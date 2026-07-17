import { Calculator } from '../types';

export const V16_HEALTH_FITNESS_CALCULATORS: Calculator[] = [
  // HEALTH ADVANCED (21-28)
  {
    id: 'health-risk',
    name: 'Health Risk Calculator',
    slug: 'health-risk',
    category: 'health',
    description: 'Assess cardiovascular and system health risk categories based on physical biomarkers and daily habits.',
    formula: 'Risk Level = f(Systolic BP, BMI, Activity, Smoking status)',
    explanation: 'Collates blood pressure, body weight ratios, active habit profiles, and nicotine factors to calculate a weighted systemic risk score.',
    example: 'A systolic BP of 135 (high-normal), smoking habits, and a BMI of 29 yields a "Moderate-High Risk" cardiovascular status.',
    inputs: [
      { id: 'sbp', label: 'Systolic Blood Pressure', type: 'number', defaultValue: 120, min: 80, max: 200, unit: 'mmHg' },
      { id: 'bmi', label: 'Body Mass Index (BMI)', type: 'number', defaultValue: 24.5, min: 10, max: 60, unit: 'kg/m²' },
      { id: 'smoking', label: 'Smoking/Nicotine User', type: 'select', defaultValue: 'no', options: [
        { label: 'Non-Smoker', value: 'no' },
        { label: 'Active Smoker/Vaper', value: 'yes' }
      ]},
      { id: 'exercise', label: 'Weekly Physical Workouts', type: 'select', defaultValue: 'active', options: [
        { label: 'Sedentary (< 30 min / wk)', value: 'sedentary' },
        { label: 'Active (150+ min / wk)', value: 'active' }
      ]}
    ],
    faq: [
      { question: 'Is this diagnostic?', answer: 'No. This is a wellness risk index screening model. Always consult a general cardiologist or medical practitioner for diagnostics.' }
    ],
    relatedSlugs: ['wellness-score', 'lifestyle-calc'],
    seoTitle: 'Cardiovascular & Lifestyle Health Risk Calculator',
    seoDescription: 'Check systemic wellness risks and cardiovascular scores using simple blood pressure, BMI, and lifestyle indices.',
    calculate: (inputs) => {
      const sbp = Number(inputs.sbp || 120);
      const bmi = Number(inputs.bmi || 24);
      const smoker = String(inputs.smoking || 'no') === 'yes';
      const exe = String(inputs.exercise || 'active') === 'sedentary';
      
      let score = 0;
      if (sbp > 130) score += 2;
      if (sbp > 140) score += 3;
      if (bmi >= 25) score += 1;
      if (bmi >= 30) score += 2.5;
      if (smoker) score += 4;
      if (exe) score += 2;
      
      let rating = 'Low Risk';
      if (score >= 3) rating = 'Mild Risk';
      if (score >= 6) rating = 'Moderate Risk';
      if (score >= 9) rating = 'High Risk';
      
      return {
        results: [
          { label: 'Calculated Risk Category', value: rating, unit: '', isPrimary: true },
          { label: 'Risk Factor Score Points', value: score, unit: 'pts/12' }
        ]
      };
    }
  },
  {
    id: 'wellness-score',
    name: 'Wellness Score Calculator',
    slug: 'wellness-score',
    category: 'health',
    description: 'Calculate a comprehensive daily wellness score by evaluating hydration, sleep quality, and active nutrition habits.',
    formula: 'Score = (Hydration% * 2) + (Sleep% * 4) + (Exercise% * 3) + (Macro% * 1)',
    explanation: 'Combines multiple foundational health categories, applying a proprietary wellness weighting curve to yield your clean daily score index.',
    example: 'Sleeping 8 hours (100%), drinking 2.5L water (85%), and completing a workout results in a stellar general Wellness Score of 88/100.',
    inputs: [
      { id: 'sleep', label: 'Average Nightly Sleep', type: 'number', defaultValue: 7.5, min: 3, max: 12, step: 0.5, unit: 'hrs' },
      { id: 'water', label: 'Daily Water Intake', type: 'number', defaultValue: 2.5, min: 0.5, max: 6, step: 0.1, unit: 'liters' },
      { id: 'workouts', label: 'Workouts Completed in Week', type: 'number', defaultValue: 3, min: 0, max: 7, unit: 'sessions' },
      { id: 'stress', label: 'Perceived Stress Level', type: 'select', defaultValue: 'medium', options: [
        { label: 'Low stress', value: 'low' },
        { label: 'Medium stress', value: 'medium' },
        { label: 'High stress', value: 'high' }
      ]}
    ],
    faq: [
      { question: 'How can I elevate my score?', answer: 'Focus on scaling sleep consistency, maintaining hydration, and pacing daily work pressure.' }
    ],
    relatedSlugs: ['health-risk', 'sleep-quality'],
    seoTitle: 'Daily General Health & Wellness Score Calculator',
    seoDescription: 'Obtain an aggregate score index of your ongoing physical health using combined wellness habits.',
    calculate: (inputs) => {
      const sleep = Number(inputs.sleep || 8);
      const water = Number(inputs.water || 2);
      const work = Number(inputs.workouts || 0);
      const stress = String(inputs.stress || 'medium');
      
      let score = 0;
      // Sleep (max 30 pts)
      if (sleep >= 7 && sleep <= 9) score += 30;
      else if (sleep >= 6) score += 18;
      else score += 8;
      
      // Water (max 30 pts)
      if (water >= 2.5) score += 30;
      else if (water >= 1.5) score += 20;
      else score += 5;
      
      // Workouts (max 25 pts)
      score += Math.min(25, work * 6);
      
      // Stress (max 15 pts)
      if (stress === 'low') score += 15;
      else if (stress === 'medium') score += 10;
      else score += 2;
      
      return {
        results: [
          { label: 'Aggregated Wellness Score', value: Math.round(score), unit: '/100', isPrimary: true },
          { label: 'Hydration Rating Index', value: water >= 2.5 ? 'Excellent' : 'Insufficient', unit: '' }
        ]
      };
    }
  },
  {
    id: 'lifestyle-calc',
    name: 'Lifestyle Calculator',
    slug: 'lifestyle-calc',
    category: 'health',
    description: 'Assess how modern sedentary hours, caffeine habits, and outdoor screen-free times balance overall health.',
    formula: 'Balance Rating = f(Sedentary hours, Screen time, Sunshine exposure)',
    explanation: 'Measures standard daily active vs static desk allocations to project lifestyle stress indicators.',
    example: 'Sitting 10 hours daily with 6 hours of non-work screen time yields a highly unbalanced metabolic profile.',
    inputs: [
      { id: 'desk', label: 'Average Desk Sedentary Time', type: 'number', defaultValue: 8, min: 1, max: 16, unit: 'hrs/day' },
      { id: 'screen', label: 'Recreational Screen Time', type: 'number', defaultValue: 4, min: 0, max: 12, unit: 'hrs/day' },
      { id: 'sun', label: 'Outdoor Sunshine Exposure', type: 'number', defaultValue: 20, min: 0, max: 180, unit: 'min/day' }
    ],
    faq: [
      { question: 'What is a dangerous screen time cap?', answer: 'Non-occupational screen exposure exceeding 4 hours is correlated with sleep disruption and posture fatigue. Set physical standing timers.' }
    ],
    relatedSlugs: ['health-risk', 'wellness-score'],
    seoTitle: 'Sedentary Screen-Time & Lifestyle Balance Calculator',
    seoDescription: 'Evaluate standing breaks, desk bounds, and non-working screen exposures to adjust daily schedules.',
    calculate: (inputs) => {
      const desk = Number(inputs.desk || 8);
      const screen = Number(inputs.screen || 4);
      const sun = Number(inputs.sun || 20);
      
      const balanceValue = 100 - (desk * 4) - (screen * 5) + Math.min(20, sun * 0.2);
      const score = Math.max(0, Math.min(100, balanceValue));
      
      let rating = 'Highly Unbalanced';
      if (score >= 45) rating = 'Partially Balanced';
      if (score >= 75) rating = 'Elegantly Balanced';
      
      return {
        results: [
          { label: 'Lifestyle Harmony Score', value: Math.round(score), unit: 'pts/100', isPrimary: true },
          { label: 'Balance Rating Class', value: rating, unit: '' }
        ]
      };
    }
  },
  {
    id: 'sleep-quality',
    name: 'Sleep Quality Calculator',
    slug: 'sleep-quality',
    category: 'health',
    description: 'Calculate natural REM/Non-REM sleep cycles and estimate chronic sleep debt from daily sleep targets.',
    formula: 'Cycles Count = Sleep Hours / 1.5; Debt = Target Hours - Actual Hours',
    explanation: 'Models 90-minute neural sleep cycles alongside weekly target deficits to reveal cumulative physiological fatigue.',
    example: 'Sleeping 6 hours results in exactly 4 full cycles, but incurs a 1.5-hour debt against a healthy 7.5-hour target.',
    inputs: [
      { id: 'actual', label: 'Actual Sleep Last Night', type: 'number', defaultValue: 6, min: 2, max: 12, step: 0.1, unit: 'hrs' },
      { id: 'target', label: 'Your Goal Sleep Target', type: 'number', defaultValue: 8, min: 6, max: 10, step: 0.5, unit: 'hrs' }
    ],
    faq: [
      { question: 'How long are human sleep cycles?', answer: 'An average human sleep cycle takes approximately 90 minutes, transitioning through light sleep, deep stage sleep, and REM.' }
    ],
    relatedSlugs: ['recovery-time', 'wellness-score'],
    seoTitle: 'REM Sleep Cycle & Cumulative Sleep Debt Calculator',
    seoDescription: 'Calculate target sleep cycle splits and manage ongoing chronic exhaustion debt scores dynamically.',
    calculate: (inputs) => {
      const act = Number(inputs.actual || 7.5);
      const tar = Number(inputs.target || 8);
      
      const cycles = act / 1.5;
      const debt = Math.max(0, tar - act);
      const efficiency = act >= tar ? 98 : Math.max(40, Math.round((act / tar) * 100));
      
      return {
        results: [
          { label: 'Calculated Sleep Efficiency', value: efficiency, unit: '%', isPrimary: true },
          { label: 'Completed REM Cycles', value: Number(cycles.toFixed(1)), unit: 'cycles' },
          { label: 'Nightly Sleep Debt Margin', value: debt, unit: 'hrs' }
        ]
      };
    }
  },
  {
    id: 'recovery-time',
    name: 'Recovery Time Calculator',
    slug: 'recovery-time',
    category: 'health',
    description: 'Project post-training somatic muscle recovery requirements using workout impact variables.',
    formula: 'Recovery Needed (Hours) = Base (24) * Intensity factor * Stress level multiplier',
    explanation: 'Integrates training weight resistance parameters, quality sleep, and daily protein targets to estimate muscular recovery windows.',
    example: 'A high-intensity leg training session completed with substandard sleep and low protein requires approximately 48-60 hours of rest.',
    inputs: [
      { id: 'intensity', label: 'Completed Session Intensity', type: 'select', defaultValue: 'heavy', options: [
        { label: 'Light (Cardio/Aerobic)', value: 'light' },
        { label: 'Moderate (Hypertrophy lifting)', value: 'moderate' },
        { label: 'Heavy/Maximal (Compound squats/Max-deadlift)', value: 'heavy' }
      ]},
      { id: 'sleepHrs', label: 'Hours of Rest Post-Workout', type: 'number', defaultValue: 7, min: 4, max: 11, unit: 'hrs' },
      { id: 'proteinMatch', label: 'Protein Target Met', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (1.6g to 2.2g per kg)', value: 'yes' },
        { label: 'No (< 1g per kg)', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'What is delayed onset muscle soreness?', answer: 'DOMS is micro-tearing within myofibrils. Rest, hydration, and amino acids act as critical building blocks for tissue recovery.' }
    ],
    relatedSlugs: ['sleep-quality', 'workout-intensity'],
    seoTitle: 'Skeletal Muscle Training Recovery Time Calculator',
    seoDescription: 'Forecast when muscle fibers will achieve peak contractile output based on training load variables.',
    calculate: (inputs) => {
      const intensity = String(inputs.intensity || 'moderate');
      const sleep = Number(inputs.sleepHrs || 8);
      const protein = String(inputs.proteinMatch || 'yes') === 'yes';
      
      let hrs = 24;
      if (intensity === 'moderate') hrs = 36;
      else if (intensity === 'heavy') hrs = 48;
      
      // Adjust based on recovery resources
      if (sleep < 7) hrs *= 1.25;
      if (!protein) hrs *= 1.20;
      
      return {
        results: [
          { label: 'Recommended Muscle Rest Window', value: Math.round(hrs), unit: 'hours', isPrimary: true },
          { label: 'Next Training Session Readiness', value: hrs <= 24 ? 'Ready' : 'Resting Required', unit: '' }
        ]
      };
    }
  },
  {
    id: 'nutrition-goal',
    name: 'Nutrition Goal Calculator',
    slug: 'nutrition-goal',
    category: 'health',
    description: 'Determine tailored daily caloric requirements and customized macronutrient distributions based on physical targets.',
    formula: 'Daily Calories = TDEE + Goal offset; Macros = split(g Protein, g Carb, g Fat)',
    explanation: 'Uses a body profile to calculate maintenance calories, shifts them for your weight goal, and divides the energy split into muscle-optimal grams.',
    example: 'A target of 2,400 calories configured for building muscle (40% carb, 30% protein, 30% fat) requires 180g of protein daily.',
    inputs: [
      { id: 'tdee', label: 'Estimated Daily Maintenance (TDEE)', type: 'number', defaultValue: 2200, min: 1000, max: 5000, unit: 'kcal' },
      { id: 'goal', label: 'Primary Physical Goal', type: 'select', defaultValue: 'gain', options: [
        { label: 'Lose fat weight (-400 kcal deficit)', value: 'lose' },
        { label: 'Maintain physical balance', value: 'maintain' },
        { label: 'Gain lean muscle (+300 kcal surplus)', value: 'gain' }
      ]},
      { id: 'proteinSplit', label: 'Protein Allocation Preference', type: 'select', defaultValue: 'high', options: [
        { label: 'High Protein (35% calories)', value: 'high' },
        { label: 'Moderate Protein (25% calories)', value: 'moderate' }
      ]}
    ],
    faq: [
      { question: 'Why scale protein during a cut?', answer: 'Caloric deficits increase muscle breakdown risks. Elevated protein triggers muscle protein synthesis and preserves active calorie-burning lean mass.' }
    ],
    relatedSlugs: ['meal-planning', 'body-transformation'],
    seoTitle: 'Daily Calorie, Macro, & Protein Target Calculator',
    seoDescription: 'Calculate custom macronutrient gram splits matching standard deficit or athletic surplus energy parameters.',
    calculate: (inputs) => {
      const tdee = Number(inputs.tdee || 2000);
      const goal = String(inputs.goal || 'maintain');
      const protPref = String(inputs.proteinSplit || 'high');
      
      let targetKcals = tdee;
      if (goal === 'lose') targetKcals = tdee - 400;
      else if (goal === 'gain') targetKcals = tdee + 300;
      
      let pPct = 30;
      let cPct = 40;
      let fPct = 30;
      
      if (protPref === 'high') {
        pPct = 35;
        cPct = 35;
        fPct = 30;
      } else {
        pPct = 25;
        cPct = 50;
        fPct = 25;
      }
      
      const proteinGrams = (targetKcals * (pPct / 100)) / 4;
      const carbGrams = (targetKcals * (cPct / 100)) / 4;
      const fatGrams = (targetKcals * (fPct / 100)) / 9;
      
      return {
        results: [
          { label: 'Calculated Target Intake', value: targetKcals, unit: 'kcal/day', isPrimary: true },
          { label: 'Daily Protein Target', value: Math.round(proteinGrams), unit: 'grams' },
          { label: 'Daily Carbohydrate Target', value: Math.round(carbGrams), unit: 'grams' },
          { label: 'Daily Healthy Fat Target', value: Math.round(fatGrams), unit: 'grams' }
        ]
      };
    }
  },
  {
    id: 'meal-planning',
    name: 'Meal Planning Calculator',
    slug: 'meal-planning',
    category: 'health',
    description: 'Divide massive daily macros into balanced calorie caps across a structured 3 to 5 meal schedule.',
    formula: 'Meal Budget = Daily Calories / Meals Count (adjusted for breakfast/dinner ratios)',
    explanation: 'Divides your daily energy budget into practical, custom portion structures for breakfast, lunch, and training snacks.',
    example: 'An athletic budget of 2,400 kcal split across 4 structured meals schedules 600 kcal per serving.',
    inputs: [
      { id: 'totalCal', label: 'Overall Daily Calorie Goal', type: 'number', defaultValue: 2400, min: 1000, unit: 'kcal' },
      { id: 'mealsCount', label: 'Daily Meals Schedule', type: 'number', defaultValue: 4, min: 2, max: 6, unit: 'meals' }
    ],
    faq: [
      { question: 'Should meals be evenly sized?', answer: 'Not necessarily. Many athletes prioritize larger carb servings before and after intense physical workouts to improve cell recovery.' }
    ],
    relatedSlugs: ['nutrition-goal', 'body-transformation'],
    seoTitle: 'Portion Control & Meal Calorie Planner',
    seoDescription: 'Divide your total daily macro limits into calorie portions across custom eating schedules.',
    calculate: (inputs) => {
      const calories = Number(inputs.totalCal || 2000);
      const meals = Number(inputs.mealsCount || 3);
      
      const perMeal = calories / meals;
      
      return {
        results: [
          { label: 'Average Calories per Serving', value: Math.round(perMeal), unit: 'kcal', isPrimary: true },
          { label: 'Weekly Active Meal Count', value: meals * 7, unit: 'dishes' }
        ]
      };
    }
  },
  {
    id: 'body-measurement',
    name: 'Body Measurement Tracker',
    slug: 'body-measurement',
    category: 'health',
    description: 'Track key health metrics including Waist-to-Hip Ratio (WHR) and Waist-to-Height Ratio (WHtR).',
    formula: 'WHR = Waist / Hip; WHtR = Waist / Height',
    explanation: 'Uses abdominal and skeletal measurements to evaluate healthy adipose storage parameters and cardiovascular risk thresholds.',
    example: 'A waist of 32" and hips of 38" yields a 0.84 WHR, indicating healthy visceral fat distribution.',
    inputs: [
      { id: 'gender', label: 'Biological Profile', type: 'select', defaultValue: 'male', options: [
        { label: 'Male Profile', value: 'male' },
        { label: 'Female Profile', value: 'female' }
      ]},
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 34, min: 20, max: 80, step: 0.1, unit: 'inches' },
      { id: 'hip', label: 'Hip Circumference', type: 'number', defaultValue: 38, min: 20, max: 80, step: 0.1, unit: 'inches' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 70, min: 40, max: 95, step: 1, unit: 'inches' }
    ],
    faq: [
      { question: 'Why does waist fat pose higher cardiovascular risks?', answer: 'Abdominal visceral adiposity is metabolic tissue that surrounds crucial organs, releasing cytokines that can impact general blood pressure.' }
    ],
    relatedSlugs: ['health-risk', 'nutrition-goal'],
    seoTitle: 'Waist-to-Hip (WHR) & Waist-to-Height (WHtR) Ratio Calculator',
    seoDescription: 'Estimate healthy abdominal adipose indices using simple body tape-measure circumferences.',
    calculate: (inputs) => {
      const gender = String(inputs.gender || 'male');
      const waist = Number(inputs.waist || 32);
      const hip = Number(inputs.hip || 38);
      const height = Number(inputs.height || 70);
      
      const whr = waist / hip;
      const whtr = waist / height;
      
      let rWHR = 'Excellent';
      if (gender === 'male') {
        if (whr >= 0.90 && whr < 0.96) rWHR = 'Moderate Risk';
        else if (whr >= 0.96) rWHR = 'High Risk';
      } else {
        if (whr >= 0.80 && whr < 0.86) rWHR = 'Moderate Risk';
        else if (whr >= 0.86) rWHR = 'High Risk';
      }
      
      const rWHtR = whtr > 0.5 ? 'Cardiovascular Alert (Waist > Half Height)' : 'Optimal visceral Fat Volume';
      
      return {
        results: [
          { label: 'Waist-to-Hip Ratio (WHR)', value: Number(whr.toFixed(2)), unit: '', isPrimary: true },
          { label: 'WHR Risk Classification', value: rWHR, unit: '' },
          { label: 'Waist-to-Height Ratio (WHtR)', value: Number(whtr.toFixed(2)), unit: '' },
          { label: 'WHtR Healthy Categorization', value: rWHtR, unit: '' }
        ]
      };
    }
  },

  // FITNESS ADVANCED (29-34)
  {
    id: 'strength-calc',
    name: 'Strength Calculator (1RM)',
    slug: 'strength-calc',
    category: 'fitness',
    description: 'Calculate your One-Repetition Maximum (1RM) using Epley and Brzycki equations for any compound lift.',
    formula: '1RM = Weight * (1 + Reps / 30) (Epley Method)',
    explanation: 'Uses submaximal power efforts to safely estimate maximum absolute single-rep physical lifting capability.',
    example: 'Lifting 225 lbs for 5 clean bench-press repetitions yields a calculated 1RM of 262.5 lbs.',
    inputs: [
      { id: 'liftWeight', label: 'Weight Lifted', type: 'number', defaultValue: 225, min: 1, unit: 'lbs / kg' },
      { id: 'liftReps', label: 'Completed Repetitions', type: 'number', defaultValue: 5, min: 1, max: 20, unit: 'reps' }
    ],
    faq: [
      { question: 'Why avoid direct 1RM testing?', answer: 'Testing absolute maximum single-reps puts extreme structural stress on joints and connective tissue. Submaximal models are highly accurate and much safer.' }
    ],
    relatedSlugs: ['training-progress', 'workout-intensity'],
    seoTitle: 'One-Repetition Maximum 1RM Lifting Strength Calculator',
    seoDescription: 'Safely calculate absolute lifting strength and project training percentage zones using submaximal reps.',
    calculate: (inputs) => {
      const w = Number(inputs.liftWeight || 0);
      const r = Number(inputs.liftReps || 1);
      
      if (r === 1) {
        return {
          results: [
            { label: 'Estimated One-Rep Max', value: w, unit: '', isPrimary: true },
            { label: '85% (Strength Threshold)', value: Math.round(w * 0.85), unit: '' }
          ]
        };
      }
      
      const epley = w * (1 + r / 30);
      const brzycki = w / (1.0278 - (0.0278 * r));
      const average1rm = (epley + brzycki) / 2;
      
      return {
        results: [
          { label: 'Estimated One-Rep Max (1RM)', value: Math.round(average1rm), unit: 'lbs/kg', isPrimary: true },
          { label: 'Epley Formula Output', value: Math.round(epley), unit: 'lbs/kg' },
          { label: 'Brzycki Formula Output', value: Math.round(brzycki), unit: 'lbs/kg' },
          { label: '80% (Hypertrophy Target)', value: Math.round(average1rm * 0.80), unit: 'lbs/kg' }
        ]
      };
    }
  },
  {
    id: 'training-progress',
    name: 'Training Progress Calculator',
    slug: 'training-progress',
    category: 'fitness',
    description: 'Track Week-Over-Week training progressive overload and relative muscular volume growth.',
    formula: 'Volume Load = Sets * Reps * Lifted Weight; Progress% = (New Volume / Prev Volume - 1) * 100',
    explanation: 'Aggregates mechanical weight workloads to ensure you achieve consistent, safe hypertrophic muscle growth.',
    example: 'Bench pressing 3 sets of 10 at 185 lbs yields a 5,550 lbs total volume weight. Stepping up to 200 lbs delivers a substantial 8.1% progress lift.',
    inputs: [
      { id: 'prevWeight', label: 'Previous Lifted Weight', type: 'number', defaultValue: 185, min: 0, unit: 'lbs/kg' },
      { id: 'prevReps', label: 'Previous Repetitions Count', type: 'number', defaultValue: 10, min: 1, unit: 'reps' },
      { id: 'prevSets', label: 'Previous Sets Completed', type: 'number', defaultValue: 3, min: 1, unit: 'sets' },
      { id: 'newWeight', label: 'New Session Weight', type: 'number', defaultValue: 200, min: 0, unit: 'lbs/kg' },
      { id: 'newReps', label: 'New Session Repetitions', type: 'number', defaultValue: 10, min: 1, unit: 'reps' },
      { id: 'newSets', label: 'New Session Sets', type: 'number', defaultValue: 3, min: 1, unit: 'sets' }
    ],
    faq: [
      { question: 'What is progressive overload?', answer: 'The gradual increase of mechanical stress placed upon muscle fibers during training, forcing structural adaptation and lean growth.' }
    ],
    relatedSlugs: ['strength-calc', 'workout-intensity'],
    seoTitle: 'Weekly Progressive Overload & Training Volume Tracker',
    seoDescription: 'Calculate training volume metrics and track progressive adjustments in total sets and weight over time.',
    calculate: (inputs) => {
      const pw = Number(inputs.prevWeight || 0);
      const pr = Number(inputs.prevReps || 0);
      const ps = Number(inputs.prevSets || 0);
      
      const nw = Number(inputs.newWeight || 0);
      const nr = Number(inputs.newReps || 0);
      const ns = Number(inputs.newSets || 0);
      
      const prevVol = pw * pr * ps;
      const newVol = nw * nr * ns;
      
      const pct = prevVol > 0 ? ((newVol - prevVol) / prevVol) * 100 : 0;
      
      return {
        results: [
          { label: 'Weekly Volume Growth', value: Number(pct.toFixed(1)), unit: '%', isPrimary: true },
          { label: 'Previous Total volume Load', value: prevVol, unit: 'lbs/kg' },
          { label: 'New Session volume Load', value: newVol, unit: 'lbs/kg' }
        ]
      };
    }
  },
  {
    id: 'workout-intensity',
    name: 'Workout Intensity Calculator',
    slug: 'workout-intensity',
    category: 'fitness',
    description: 'Calculate cardiovascular target Heart Rate Zones using the high-accuracy Karvonen formula.',
    formula: 'Target HR = [(HR_max - HR_rest) * intensity%] + HR_rest',
    explanation: 'Uses your heart rate reserve (HRR) to estimate optimal exertion bounds for fat burn, aerobic conditioning, and VO2 max training.',
    example: 'An athlete of age 30 with a resting heart rate of 60 bpm possesses active aerobic intensity bounds (75%) around 157 bpm.',
    inputs: [
      { id: 'age', label: 'Your Current Age', type: 'number', defaultValue: 30, min: 10, max: 90, unit: 'years' },
      { id: 'rhr', label: 'Resting Heart Rate (RHR)', type: 'number', defaultValue: 60, min: 35, max: 120, unit: 'bpm' },
      { id: 'intensityPct', label: 'Target Workout Intensity', type: 'range', defaultValue: 75, min: 40, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'Why use Karvonen over standard Max HR estimation?', answer: 'The standard formula (220-age) ignores resting conditioning levels. The Karvonen formula accounts for your Resting Heart Rate, yielding highly customized cardiothoracic zones.' }
    ],
    relatedSlugs: ['strength-calc', 'exercise-recovery'],
    seoTitle: 'Karvonen Heart Rate Zone Intensity Calculator',
    seoDescription: 'Obtain customized target cardiovascular zones using age offsets and resting heart rates.',
    calculate: (inputs) => {
      const age = Number(inputs.age || 30);
      const rhr = Number(inputs.rhr || 60);
      const targetInt = Number(inputs.intensityPct || 75) / 100;
      
      const maxHr = 220 - age;
      const hrr = maxHr - rhr;
      
      const targetBpm = (hrr * targetInt) + rhr;
      
      return {
        results: [
          { label: 'Target Cardio Heart Rate', value: Math.round(targetBpm), unit: 'BPM', isPrimary: true },
          { label: 'Calculated HR Reserve (HRR)', value: hrr, unit: 'BPM' },
          { label: 'Fat-Burn Threshold (60% HRR)', value: Math.round((hrr * 0.6) + rhr), unit: 'BPM' },
          { label: 'Aerobic Threshold (80% HRR)', value: Math.round((hrr * 0.8) + rhr), unit: 'BPM' }
        ]
      };
    }
  },
  {
    id: 'exercise-recovery',
    name: 'Exercise Recovery Calculator',
    slug: 'exercise-recovery',
    category: 'fitness',
    description: 'Calculate post-workout rehydration fluid targets and muscle glycogen glycogen requirements based on weight loss.',
    formula: 'Rehydration Target = Body Weight Lost * 1.5 liters',
    explanation: 'Estimates healthy water replenishment indices and carbohydrate loads to optimize glycogen stores after intense athletic activity.',
    example: 'Losing 1 kg of body weight during a run requires exactly 1.5 liters of balanced liquid replenishment.',
    inputs: [
      { id: 'weightLost', label: 'Body Weight Lost During Workout', type: 'number', defaultValue: 2, min: 0, max: 10, step: 0.1, unit: 'lbs' },
      { id: 'duration', label: 'Workout Duration', type: 'number', defaultValue: 90, min: 10, max: 480, unit: 'minutes' }
    ],
    faq: [
      { question: 'Why do I need extra fluid relative to sweat lost?', answer: 'Kidneys continue filtering and releasing post-workout fluids. Drinking 150% of sweat loss ensures rapid systemic cell hydration.' }
    ],
    relatedSlugs: ['workout-intensity', 'fitness-goal-timeline'],
    seoTitle: 'Sweat Loss Fluid & Glycogen Recovery Calculator',
    seoDescription: 'Calculate athletic hydration metrics and estimated post-training carbohydrate replenishment loads.',
    calculate: (inputs) => {
      const lostLbs = Number(inputs.weightLost || 2);
      const dur = Number(inputs.duration || 60);
      
      // Convert lost weight in lbs to liters needed (1 lb lost ~ 450g water ~ require ~24oz/1.5x)
      const liquidMl = lostLbs * 700; // ~700ml per lb lost
      const glycogenGrams = lostLbs * 120 + (dur * 0.5);
      
      return {
        results: [
          { label: 'Water Replenishment Volume', value: Math.round(liquidMl), unit: 'mL', isPrimary: true },
          { label: 'Target Glycogen Recovery Carb', value: Math.round(glycogenGrams), unit: 'grams' }
        ]
      };
    }
  },
  {
    id: 'fitness-goal-timeline',
    name: 'Fitness Goal Timeline Calculator',
    slug: 'fitness-goal-timeline',
    category: 'fitness',
    description: 'Calculate the total estimated weeks required to safely achieve your target body weight goal.',
    formula: 'Weeks Required = Weight to Change / Safe Weekly Rate',
    explanation: 'Determines the duration of healthy kinetic caloric deficits or regular mass gains while prioritizing muscle retention.',
    example: 'To drop 15 lbs safely at 1 lb per week requires a highly predictable 15-week fat-loss cycle.',
    inputs: [
      { id: 'startWeight', label: 'Current Body Weight', type: 'number', defaultValue: 195, min: 60, unit: 'lbs' },
      { id: 'goalWeight', label: 'Target Body Weight Goal', type: 'number', defaultValue: 180, min: 60, unit: 'lbs' },
      { id: 'dailyDeficit', label: 'Planned Calorie Offset (Daily)', type: 'number', defaultValue: 500, min: 100, max: 1000, step: 50, unit: 'kcal' }
    ],
    faq: [
      { question: 'What is a medically safe rate of weight loss?', answer: 'A loss of 0.5% to 1% of total body weight per week is highly sustainable, protecting metabolic rate and muscle tissues.' }
    ],
    relatedSlugs: ['body-transformation', 'nutrition-goal'],
    seoTitle: 'Target Body Weight Timeline Planner',
    seoDescription: 'Calculate estimated weeks required to achieve safe fat-loss or steady muscle gains using caloric metrics.',
    calculate: (inputs) => {
      const start = Number(inputs.startWeight || 180);
      const goal = Number(inputs.goalWeight || 170);
      const deficit = Number(inputs.dailyDeficit || 500);
      
      const totalDiff = Math.abs(start - goal);
      // 3500 kcal is roughly equivalent to 1 lb of stored adipose energy
      const weeklyLossLbs = (deficit * 7) / 3500;
      const weeks = weeklyLossLbs > 0 ? totalDiff / weeklyLossLbs : 0;
      
      return {
        results: [
          { label: 'Projected Duration Timeline', value: Number(weeks.toFixed(1)), unit: 'weeks', isPrimary: true },
          { label: 'Ongoing Safe Weekly Rate', value: Number(weeklyLossLbs.toFixed(2)), unit: 'lbs/wk' },
          { label: 'Target Energy Shift Needed', value: Math.round(totalDiff * 3500), unit: 'kcal total' }
        ]
      };
    }
  },
  {
    id: 'body-transformation',
    name: 'Body Transformation Calculator',
    slug: 'body-transformation',
    category: 'fitness',
    description: 'Project dynamic changes in fat mass, lean body mass (LBM), and skeletal proportions during body recomposition.',
    formula: 'LBM = Weight * (1 - Fat%); Fat Mass = Weight * Fat%',
    explanation: 'Models absolute lean tissue mass separate from adipose storage to track high-accuracy body recomposition progress.',
    example: 'An athlete weighing 180 lbs with 20% body fat possesses 144 lbs of Lean Body Mass. Changing fat to 15% yields 153 lbs of LBM.',
    inputs: [
      { id: 'weight', label: 'Current Total Weight', type: 'number', defaultValue: 180, min: 40, unit: 'lbs/kg' },
      { id: 'fatPct', label: 'Current Body Fat', type: 'number', defaultValue: 20, min: 2, max: 60, unit: '%' },
      { id: 'targetFatPct', label: 'Target Body Fat', type: 'number', defaultValue: 15, min: 2, max: 60, unit: '%' }
    ],
    faq: [
      { question: 'What is body recomposition?', answer: 'Simultaneously gaining functional muscle fiber while dropping fatty tissues. Often occurs in novice lifters or returning athletes.' }
    ],
    relatedSlugs: ['fitness-goal-timeline', 'nutrition-goal'],
    seoTitle: 'Body Recomposition & Lean Mass (LBM) Calculator',
    seoDescription: 'Forecast absolute lean skeletal tissue changes separate from body fat weight percentages during fitness programs.',
    calculate: (inputs) => {
      const w = Number(inputs.weight || 180);
      const startFat = Number(inputs.fatPct || 20) / 100;
      const goalFat = Number(inputs.targetFatPct || 15) / 100;
      
      const startFatMass = w * startFat;
      const lbm = w - startFatMass;
      
      // Target weight assuming LBM remains constant while dropping fat
      const targetWeight = lbm / (1 - goalFat);
      
      return {
        results: [
          { label: 'Target weight at Goal body fat', value: Math.round(targetWeight), unit: 'lbs/kg', isPrimary: true },
          { label: 'Lean Body Mass (LBM)', value: Math.round(lbm), unit: 'lbs/kg' },
          { label: 'Current Subcutaneous Fat Mass', value: Math.round(startFatMass), unit: 'lbs/kg' },
          { label: 'Fat Mass to Shed', value: Math.max(0, Math.round(startFatMass - (targetWeight * goalFat))), unit: 'lbs/kg' }
        ]
      };
    }
  }
];
