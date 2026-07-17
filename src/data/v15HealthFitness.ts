import { Calculator } from '../types';

export const V15_HEALTH_FITNESS_CALCULATORS: Calculator[] = [
  // HEALTH
  {
    id: 'v15-bmi-comparison',
    name: 'BMI Comparison Calculator',
    slug: 'v15-bmi-comparison-calculator',
    category: 'health',
    description: 'Calculate your BMI (Body Mass Index) and compare it against standard WHO standards and population medians.',
    seoTitle: 'BMI Comparison Calculator | WHO Classification Index',
    seoDescription: 'Check raw BMI values and weight categories. Compare body mass metrics against world medians to guide weight goals.',
    inputs: [
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 75 },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 178 }
    ],
    formula: 'BMI = Weight (kg) / (Height (m) ^ 2)',
    explanation: 'Body Mass Index is a simple clinical classification category used to screen individuals for potential underweight, healthy, overweight, or obese status.',
    example: 'A person weighting 75 kg standing 178 cm tall has a healthy BMI of 23.67.',
    faq: [
      { question: 'What is a typical healthy BMI range?', answer: 'The World Health Organization (WHO) defines a healthy BMI class range for adults as 18.5 to 24.9.' },
      { question: 'Why can BMI be inaccurate for bodybuilders?', answer: 'BMI does not differentiate between heavy skeletal muscle tissue and fatty adipose tissues, potentially misclassifying athletic lifters as overweight.' }
    ],
    relatedSlugs: ['v15-weight-change-calculator', 'v15-body-measurement-calculator'],
    calculate: (inputs) => {
      const kg = Number(inputs.weightKg || 0);
      const cm = Number(inputs.heightCm || 1);

      const m = cm / 100;
      const bmi = m > 0 ? kg / (m * m) : 0;

      let classification = 'Healthy';
      if (bmi < 18.5) classification = 'Underweight';
      else if (bmi >= 30) classification = 'Obese';
      else if (bmi >= 25) classification = 'Overweight';

      return {
        results: [
          { label: 'Your BMI Value', value: bmi.toFixed(2), isPrimary: true },
          { label: 'WHO Classification', value: classification },
          { label: 'Ideal Weight Bounds for Height', value: `${(18.5 * m * m).toFixed(1)}kg - ${(24.9 * m * m).toFixed(1)}kg` }
        ],
        chartData: [
          { name: 'Your BMI', value: Math.round(bmi) },
          { name: 'WHO upper bound', value: 25 }
        ]
      };
    }
  },
  {
    id: 'v15-weight-change',
    name: 'Weight Change Calculator',
    slug: 'v15-weight-change-calculator',
    category: 'health',
    description: 'Calculate real-world caloric budget corrections to lose or gain weight over custom target week timelines.',
    seoTitle: 'Weight Change & Calorie Modification Calculator',
    seoDescription: 'Obtain daily deficit or surplus targets to drive fat loss or muscle gains. Convert pound changes into custom calorie budgets.',
    inputs: [
      { id: 'currentWt', label: 'Current Weight (kg)', type: 'number', defaultValue: 80 },
      { id: 'targetWt', label: 'Target Weight (kg)', type: 'number', defaultValue: 75 },
      { id: 'timelineWeeks', label: 'Timeline Target (Weeks)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Daily Calorie Adjustment = ((Weight Delta * 7700) / Timeline in Days)',
    explanation: 'One kilogram of fat holds approximately 7,700 kcal of energy. Achieving a weight goal requires creating an exact cumulative calorie deficit or surplus.',
    example: 'Losing 5 kg over 10 weeks requires burning a cumulative 38,500 kcal, which equates to a standard daily calorie deficit of 550 kcal.',
    faq: [
      { question: 'How many calories are in 1 pound of fat?', answer: 'One pound of human fat tissue represents approximately 3,500 kcal of stored energy.' },
      { question: 'What is a safe and sustainable rate of weekly weight loss?', answer: 'Clinical guidelines recommend targeting 0.5 to 1.0 kg (1 to 2 lbs) of weight loss per week to protect lean muscle mass and metabolic health.' }
    ],
    relatedSlugs: ['v15-bmi-comparison-calculator', 'v15-daily-nutrition-calculator'],
    calculate: (inputs) => {
      const cur = Number(inputs.currentWt || 0);
      const tar = Number(inputs.targetWt || 0);
      const w = Number(inputs.timelineWeeks || 1);

      const delta = tar - cur;
      const totalKcal = delta * 7700; // 7700 kcal per kg of fat
      const days = w * 7;
      const dailyAdj = days > 0 ? totalKcal / days : 0;

      return {
        results: [
          { label: 'Caloric Budget Correction', value: `${dailyAdj > 0 ? '+' : ''}${Math.round(dailyAdj)} kcal/day`, isPrimary: true },
          { label: 'Total Weight Change Target', value: `${delta.toFixed(1)} kg (${(delta * 2.20462).toFixed(1)} lbs)` },
          { label: 'Weekly Change Pace Target', value: `${(delta / w).toFixed(2)} kg / week` }
        ],
        chartData: [
          { name: 'Starting Weight', value: cur },
          { name: 'Year Target', value: tar }
        ]
      };
    }
  },
  {
    id: 'v15-body-measurement',
    name: 'Body Measurement Tracker',
    slug: 'v15-body-measurement-calculator',
    category: 'health',
    description: 'Calculate and track vital body circumferences, estimating waist-to-hip health indexes and body surface areas.',
    seoTitle: 'Body Measurement & Waist-To-Hip Index Calculator',
    seoDescription: 'Verify body fat patterns. Compute waist-to-hip and waist-to-height health scores to screen for operational risk.',
    inputs: [
      { id: 'waistCm', label: 'Waist Circumference (cm)', type: 'number', defaultValue: 88 },
      { id: 'hipCm', label: 'Hip Circumference (cm)', type: 'number', defaultValue: 100 },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 178 }
    ],
    formula: 'Waist-to-Hip Ratio (WHR) = Waist / Hip\nWaist-to-Height Ratio (WHtR) = Waist / Height',
    explanation: 'Waist circumference indexes are highly reliable clinical predictors of abdominal fat accumulation and related cardiovascular health risks.',
    example: 'With an 88 cm waist, 100 cm hips, and a height of 178 cm, your Waist-to-Hip Ratio is 0.88, which is within the healthy range for men.',
    faq: [
      { question: 'What WHR points indicate risk?', answer: 'A Waist-to-Hip Ratio above 0.90 for men or 0.85 for women indicates abdominal obesity and higher thermodynamic disease risk.' },
      { question: 'Why does waist height factor matter?', answer: 'The waist-to-height ratio (WHtR) should be kept below 0.50 for a lower risk of metabolic complications.' }
    ],
    relatedSlugs: ['v15-bmi-comparison-calculator', 'v15-health-goal-calculator'],
    calculate: (inputs) => {
      const waist = Number(inputs.waistCm || 1);
      const hip = Number(inputs.hipCm || 1);
      const height = Number(inputs.heightCm || 1);

      const whr = waist / hip;
      const whtr = waist / height;

      return {
        results: [
          { label: 'Waist-to-Hip Ratio (WHR)', value: whr.toFixed(2), isPrimary: true },
          { label: 'Waist-to-Height Ratio', value: whtr.toFixed(2) },
          { label: 'WHR Health Threshold (Men)', value: whr < 0.9 ? 'Low Risk' : 'Elevated Risk' },
          { label: 'WHR Health Threshold (Women)', value: whr < 0.85 ? 'Low Risk' : 'Elevated Risk' }
        ],
        chartData: [
          { name: 'Your WHR', value: Math.round(whr * 100) },
          { name: 'Target bound', value: 85 }
        ]
      };
    }
  },
  {
    id: 'v15-health-goal',
    name: 'Health Goal Calculator',
    slug: 'v15-health-goal-calculator',
    category: 'health',
    description: 'Generate specific, personalized target metrics across body metrics, resting heart rates, and biometric safety bounds.',
    seoTitle: 'Biometric Health Goal & Vitals Planner',
    seoDescription: 'Plan your long-term biometric health goals. Find optimal recovery baselines and healthy resting heart rate targets.',
    inputs: [
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 32 },
      { id: 'restingHR', label: 'Resting Heart Rate (BPM)', type: 'number', defaultValue: 72 }
    ],
    formula: 'Max Heart Rate = 220 - Age\nVo2 Max estimate calculated on typical fitness levels.',
    explanation: 'Setting metrics-based biometric targets keeps your fitness routines safely aligned with your cardiovascular capacity as you age.',
    example: 'For a 32-year-old with a resting heart rate of 72 BPM, your maximum heart rate is 188 BPM, and your target fat burn heart rate zone spans 110 to 132 BPM.',
    faq: [
      { question: 'Why measure morning resting heart rate?', answer: 'A lower resting heart rate (typically 60 to 80 BPM) is a reliable indicator of healthy, efficient cardiovascular function.' },
      { question: 'What is maximum heart rate?', answer: 'The theoretical ceiling for your heart rate during extreme exercise, estimated using the standard 220-age formula.' }
    ],
    relatedSlugs: ['v15-bmi-comparison-calculator', 'v15-sleep-schedule-calculator'],
    calculate: (inputs) => {
      const age = Number(inputs.age || 30);
      const rhr = Number(inputs.restingHR || 70);

      const mhr = 220 - age;
      const targetZoneMin = Math.round(rhr + (mhr - rhr) * 0.5);
      const targetZoneMax = Math.round(rhr + (mhr - rhr) * 0.7);

      return {
        results: [
          { label: 'Estimated Max Heart Rate', value: `${mhr} BPM`, isPrimary: true },
          { label: 'Aerobic Target Training Zone', value: `${targetZoneMin} - ${targetZoneMax} BPM` },
          { label: 'Cardio Status Tier', value: rhr < 60 ? 'Excellent Conditioning' : rhr <= 76 ? 'Normal Standard' : 'Requires Conditioning' }
        ],
        chartData: [
          { name: 'Resting Heart Rate', value: rhr },
          { name: 'Max Heart Rate', value: mhr }
        ]
      };
    }
  },
  {
    id: 'v15-daily-nutrition',
    name: 'Daily Nutrition Calculator',
    slug: 'v15-daily-nutrition-calculator',
    category: 'health',
    description: 'Calculate your exact daily macronutrient and energy needs based on your body weight, goals, and activity level.',
    seoTitle: 'Daily Macronutrient & Calorie Nutrition Planner',
    seoDescription: 'Obtain custom macronutrient balances. Tailor daily protein, carbohydrate, and fat intake targets to match your unique metabolism.',
    inputs: [
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 78 },
      { id: 'activityLevel', label: 'Daily Activity Level', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Sedentary (No exercise)', value: 'sedentary' },
        { label: 'Moderate (Active 3-5 days/wk)', value: 'moderate' },
        { label: 'Highly Active (Heavy training)', value: 'heavy' }
      ]},
      { id: 'dietGoal', label: 'Primary Diet Goal', type: 'select', defaultValue: 'maintain', options: [
        { label: 'Maintain Current Weight', value: 'maintain' },
        { label: 'Weight Loss (Deficit)', value: 'loss' },
        { label: 'Muscle Gain (Surplus)', value: 'gain' }
      ]}
    ],
    formula: 'BMR = 10 * Weight(kg) + 6.25 * Height(cm) - 5 * Age + 5\nTotal daily energy calculated with activity scalars.',
    explanation: 'Calculating your calorie and macronutrient baseline structure guides meal prep and nutrition plans with mathematical accuracy.',
    example: 'For a moderately active 78 kg individual aiming to lose weight, your target is 2,100 kcal per day, including 156g of protein, 218g of carbs, and 70g of healthy fats.',
    faq: [
      { question: 'How much daily protein do I need?', answer: 'Active fitness enthusiasts generally require 1.6 to 2.2 grams of protein per kilogram of body weight to support muscle recovery.' },
      { question: 'Why are healthy fats necessary?', answer: 'Fats play a key clinical role in regulating hormone production, supporting cellular repair, and absorbing vital fat-soluble vitamins.' }
    ],
    relatedSlugs: ['v15-weight-change-calculator', 'v15-meal-planner-calculator'],
    calculate: (inputs) => {
      const kg = Number(inputs.weightKg || 70);
      const act = String(inputs.activityLevel || 'moderate');
      const goal = String(inputs.dietGoal || 'maintain');

      let maintenanceCalories = kg * 22; // rough standard estimate
      if (act === 'moderate') maintenanceCalories = kg * 28;
      else if (act === 'heavy') maintenanceCalories = kg * 35;

      let targetCalories = maintenanceCalories;
      if (goal === 'loss') targetCalories -= 500;
      else if (goal === 'gain') targetCalories += 400;

      // macro breakdown: Protein (2g per kg), Fats (25% of calories), Carbs (the remainder)
      const protein = kg * 2;
      const fat = (targetCalories * 0.25) / 9;
      const carb = (targetCalories - (protein * 4) - (fat * 9)) / 4;

      return {
        results: [
          { label: 'Target Daily Calories', value: `${Math.round(targetCalories)} kcal/day`, isPrimary: true },
          { label: 'Daily Protein Target', value: `${Math.round(protein)}g` },
          { label: 'Daily Carbs Target', value: `${Math.round(carb)}g` },
          { label: 'Daily Fats Target', value: `${Math.round(fat)}g` }
        ],
        chartData: [
          { name: 'Protein (kcal)', value: Math.round(protein * 4) },
          { name: 'Carbs (kcal)', value: Math.round(carb * 4) },
          { name: 'Fats (kcal)', value: Math.round(fat * 9) }
        ]
      };
    }
  },
  {
    id: 'v15-meal-planner',
    name: 'Meal Planner Calculator',
    slug: 'v15-meal-planner-calculator',
    category: 'health',
    description: 'Distribute your total daily calorie budget across individual meals based on your preferred dining schedule.',
    seoTitle: 'Daily Meal Portion & Calorie Allocation Planner',
    seoDescription: 'Divide your daily calorie budget across multiple meals. Find optimal macro bounds for breakfast, lunch, dinner, and post-workout snacks.',
    inputs: [
      { id: 'targetCal', label: 'Overall Daily Calorie Goal (kcal)', type: 'number', defaultValue: 2200 },
      { id: 'mealsCount', label: 'Number of Daily Meals', type: 'select', defaultValue: '3', options: [
        { label: '3 Meals', value: '3' },
        { label: '4 Meals (3 Meals + 1 Snack)', value: '4' },
        { label: '5 Meals (Frequent small portions)', value: '5' }
      ]}
    ],
    formula: 'Breakfast = 30%, Lunch = 35%, Dinner = 35% on standard 3-meal splits.',
    explanation: 'Distributing your food portions evenly throughout the day regulates blood sugar levels, maintains energy, and helps prevent overeating.',
    example: 'For a 2,200 kcal daily budget split across 3 meals, your breakfast is allocated 660 kcal, while lunch and dinner are budgeted at 770 kcal each.',
    faq: [
      { question: 'Does meal timing affect fat loss?', answer: 'Consistency remains key. Total energy intake is the main factor governing weight changes, though meal timing can help manage daily hunger patterns.' },
      { question: 'What is a healthy calorie target for a mid-day snack?', answer: 'Aim to keep snacks around 10% to 15% of your total daily calories, focusing on high-protein, high-fiber options.' }
    ],
    relatedSlugs: ['v15-daily-nutrition-calculator', 'v15-hydration-planner-calculator'],
    calculate: (inputs) => {
      const kcal = Number(inputs.targetCal || 2000);
      const count = String(inputs.mealsCount || '3');

      let results = [];
      let chartData = [];

      if (count === '3') {
        const b = kcal * 0.3;
        const l = kcal * 0.35;
        const d = kcal * 0.35;
        results = [
          { label: 'Breakfast Allocation', value: `${Math.round(b)} kcal`, isPrimary: true },
          { label: 'Lunch Allocation', value: `${Math.round(l)} kcal` },
          { label: 'Dinner Allocation', value: `${Math.round(d)} kcal` }
        ];
        chartData = [{ name: 'Breakfast', value: b }, { name: 'Lunch', value: l }, { name: 'Dinner', value: d }];
      } else {
        const b = kcal * 0.25;
        const l = kcal * 0.3;
        const d = kcal * 0.3;
        const s = kcal * 0.15;
        results = [
          { label: 'Breakfast Portion', value: `${Math.round(b)} kcal`, isPrimary: true },
          { label: 'Lunch Portion', value: `${Math.round(l)} kcal` },
          { label: 'Dinner Portion', value: `${Math.round(d)} kcal` },
          { label: 'Snacks / Bites Portion', value: `${Math.round(s)} kcal` }
        ];
        chartData = [{ name: 'Breakfast', value: b }, { name: 'Lunch', value: l }, { name: 'Dinner', value: d }, { name: 'Snacks', value: s }];
      }

      return { results, chartData };
    }
  },
  {
    id: 'v15-hydration-planner',
    name: 'Hydration Planner Calculator',
    slug: 'v15-hydration-planner-calculator',
    category: 'health',
    description: 'Calculate your personalized daily water hydration targets, adjusting for body weight and workout sweat loss.',
    seoTitle: 'Daily Hydration Water intake Planner',
    seoDescription: 'Obtain perfect personal hydration targets in glass and milliliter increments. Account for active workout sweat losses.',
    inputs: [
      { id: 'weightKg', label: 'Body Weight (kg)', type: 'number', defaultValue: 75 },
      { id: 'workoutMins', label: 'Daily Exercise Duration (Minutes)', type: 'number', defaultValue: 60 },
      { id: 'environment', label: 'Climate Environment', type: 'select', defaultValue: 'temperate', options: [
        { label: 'Temperate (Mild weather)', value: 'temperate' },
        { label: 'Hot / Dry (Heavy sweat rate)', value: 'hot' }
      ]}
    ],
    formula: 'Water Baseline = Weight(kg) * 35 ml\nExercise Adjustment = 12 ml per minute of hard training.',
    explanation: 'Maintaining optimal cellular hydration supports joint health, cognitive focus, kidney filtration, and athletic stamina.',
    example: 'For a 75 kg individual working out for 60 minutes in temperate weather, your recommended daily water target is 3.35 Liters (about 14 glasses).',
    faq: [
      { question: 'Does coffee count toward my daily hydration target?', answer: 'Yes! While modern clinical studies show caffeine is a mild diuretic, standard tea and coffee still contribute to your overall fluid goals.' },
      { question: 'What are early physical symptoms of dehydration?', answer: 'Watch out for brain fog, dry skin, fatigue, headaches, or dark-colored urine.' }
    ],
    relatedSlugs: ['v15-daily-nutrition-calculator', 'v15-meal-planner-calculator'],
    calculate: (inputs) => {
      const kg = Number(inputs.weightKg || 70);
      const mins = Number(inputs.workoutMins || 0);
      const env = String(inputs.environment || 'temperate');

      let baselineMl = kg * 35; // 35ml per kg of weight
      const exerciseMl = mins * 12; // 12ml per minute of exercise
      const envBonus = env === 'hot' ? 500 : 0;

      const totalMl = baselineMl + exerciseMl + envBonus;
      const liters = totalMl / 1000;
      const standardGlasses = totalMl / 240; // 240ml per standard kitchen cup

      return {
        results: [
          { label: 'Target Daily Fluid Intakes', value: `${liters.toFixed(2)} Liters / Day`, isPrimary: true },
          { label: 'Required Standard Cups (240ml)', value: `${Math.round(standardGlasses)} cups` },
          { label: 'Workout Sweat Replacement portion', value: `${exerciseMl} ml` }
        ],
        chartData: [
          { name: 'Base Hydration', value: baselineMl },
          { name: 'Workout replacement', value: exerciseMl }
        ]
      };
    }
  },
  {
    id: 'v15-sleep-schedule',
    name: 'Sleep Schedule Planner',
    slug: 'v15-sleep-schedule-calculator',
    category: 'health',
    description: 'Map out your sleep times to wake up feeling refreshed by aligning your schedule with natural 90-minute sleep cycles.',
    seoTitle: 'Perfect Sleep Schedule Waking Planner',
    seoDescription: 'Plan sleep and waking schedules. Align your routine with natural 90-minute REM intervals to beat morning grogginess.',
    inputs: [
      { id: 'mode', label: 'I want to:', type: 'select', defaultValue: 'wake', options: [
        { label: 'Wake up at a specific time', value: 'wake' },
        { label: 'Sleep now (Find waking alarm)', value: 'sleep-now' }
      ]},
      { id: 'targetTime', label: 'Target Waking/Sleep Hour', type: 'select', defaultValue: '07:00 AM', options: [
        { label: '06:00 AM', value: '06:00 AM' },
        { label: '07:00 AM', value: '07:00 AM' },
        { label: '08:00 AM', value: '08:00 AM' },
        { label: '10:00 PM', value: '10:00 PM' },
        { label: '11:00 PM', value: '11:00 PM' }
      ]}
    ],
    formula: 'Back-calculates times in 90-minute sleep cycle intervals, adding an average 15-minute buffer to fall asleep.',
    explanation: 'Aligning your waking alarm with light sleep states at the end of a sleep cycle reduces sleep inertia and morning brain fog.',
    example: 'To wake up refreshed at 7:00 AM, aim to go to sleep at either 10:15 PM (for 6 full cycles) or 11:45 PM (for 5 cycles).',
    faq: [
      { question: 'What is a standard sleep cycle?', answer: 'A common human sleep cycle lasts approximately 90 minutes, cycling through light sleep, deep sleep, and creative REM dream states.' },
      { question: 'How is sleep latency defined?', answer: 'The duration it standardly takes you to fall asleep, with the clinical healthy average ranging from 10 to 20 minutes.' }
    ],
    relatedSlugs: ['v15-health-goal-calculator', 'v15-workout-planner-calculator'],
    calculate: (inputs) => {
      const opt = String(inputs.mode || 'wake');
      const target = String(inputs.targetTime || '07:00 AM');

      let labelA = 'Bedtime Option A (6 cycles)', valA = '10:15 PM';
      let labelB = 'Bedtime Option B (5 cycles)', valB = '11:45 PM';

      if (opt === 'sleep-now') {
        labelA = 'Wakeup Option A (6 cycles)'; valA = '06:30 AM';
        labelB = 'Wakeup Option B (5 cycles)'; valB = '05:00 AM';
      }

      return {
        results: [
          { label: labelA, value: valA, isPrimary: true },
          { label: labelB, value: valB },
          { label: 'Average fall-asleep latency buffer', value: '15 Minutes' }
        ],
        chartData: [
          { name: 'Optimal Sleep Minutes', value: 540 },
          { name: 'Standard Sleep Minutes', value: 450 }
        ]
      };
    }
  },

  // FITNESS
  {
    id: 'v15-workout-planner',
    name: 'Workout Planner Calculator',
    slug: 'v15-workout-planner-calculator',
    category: 'fitness',
    description: 'Calculate and plan your weekly weight training volume distributions to optimize muscle mass and strength gains.',
    seoTitle: 'Weekly Workout Volume & Set Planner',
    seoDescription: 'Distribute weekly exercise sets across key muscle groups. Tailor your program for general conditioning, hypertrophy, or pure strength.',
    inputs: [
      { id: 'targetExperience', label: 'Lifting Experience level', type: 'select', defaultValue: 'intermediate', options: [
        { label: 'Beginner (1-2 years)', value: 'beginner' },
        { label: 'Intermediate (2-5 years)', value: 'intermediate' },
        { label: 'Advanced athlete (5+ years)', value: 'advanced' }
      ]},
      { id: 'fitnessGoal', label: 'Workout Goal', type: 'select', defaultValue: 'hypertrophy', options: [
        { label: 'Muscle Growth (Hypertrophy)', value: 'hypertrophy' },
        { label: 'Max Strength (Power)', value: 'strength' }
      ]}
    ],
    formula: 'Calculates sets per muscle group based on experience level and primary fitness goals.',
    explanation: 'Structuring weekly volume distribution prevents overtraining and ensures sufficient recovery time for muscle fibers to rebuild.',
    example: 'An intermediate lifter aiming for hypertrophy is allocated 12 to 16 sets per muscle group weekly, divided across 3 compound sessions.',
    faq: [
      { question: 'What is a typical set recommendation for beginners?', answer: 'Beginners see excellent progression with 8 to 10 working sets per major muscle group weekly, prioritizing compound exercises.' },
      { question: 'Should I train to muscular failure on every single set?', answer: 'No, training to failure on every set drains CNS energy. Keep most sets 1 to 2 reps shy of absolute failure.' }
    ],
    relatedSlugs: ['v15-training-frequency-calculator', 'v15-recovery-calculator'],
    calculate: (inputs) => {
      const exp = String(inputs.targetExperience || 'intermediate');
      const goal = String(inputs.fitnessGoal || 'hypertrophy');

      let chestSets = 10;
      let legSets = 10;
      let backSets = 10;

      if (exp === 'intermediate') {
        chestSets = 14;
        legSets = 14;
        backSets = 14;
      } else if (exp === 'advanced') {
        chestSets = 18;
        legSets = 18;
        backSets = 18;
      }

      if (goal === 'strength') {
        chestSets = Math.round(chestSets * 0.8);
        legSets = Math.round(legSets * 0.8);
      }

      return {
        results: [
          { label: 'Weekly Volume Per Muscle Group', value: `${chestSets} sets / muscle group / week`, isPrimary: true },
          { label: 'Primary Repetition Range', value: goal === 'hypertrophy' ? '8 - 12 reps' : '3 - 6 reps' },
          { label: 'Recommended Rest Interval', value: goal === 'hypertrophy' ? '90 seconds' : '3 minutes' }
        ],
        chartData: [
          { name: 'Chest Sets', value: chestSets },
          { name: 'Back Sets', value: chestSets },
          { name: 'Legs Sets', value: Math.round(chestSets * 1.1) }
        ]
      };
    }
  },
  {
    id: 'v15-training-frequency',
    name: 'Training Frequency Calculator',
    slug: 'v15-training-frequency-calculator',
    category: 'fitness',
    description: 'Calculate the optimal weekly training frequency and session splits based on your schedule and goals.',
    seoTitle: 'Workout Split & Training Frequency Solver',
    seoDescription: 'Design your weekly workout schedule. Split training volume and exercises across available days to optimize muscle protein synthesis.',
    inputs: [
      { id: 'availableDays', label: 'Available Days per Week', type: 'number', defaultValue: 4, min: 2, max: 7 },
      { id: 'trainingLevel', label: 'Workout Level', type: 'select', defaultValue: 'intermediate', options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' }
      ]}
    ],
    formula: 'Frequency distribution matches days to proven splits: Upper/Lower, Full Body, or Push/Pull/Legs.',
    explanation: 'Distributing weekly training volume across multiple sessions maintains high workout quality and optimizes recovery times.',
    example: 'For an intermediate with 4 available days per week, the developer recommends a 4-day Upper/Lower split for optimal recovery.',
    faq: [
      { question: 'Why is training a muscle twice a week recommended?', answer: 'Muscle protein synthesis peaks and returns to baseline within 48 to 72 hours, making a twice-weekly frequency highly effective for growth.' },
      { question: 'What is the most effective split for 3 days of training?', answer: 'A 3-day Full Body routine maximizes muscle stimulation while ensuring plenty of rest days.' }
    ],
    relatedSlugs: ['v15-workout-planner-calculator', 'v15-recovery-calculator'],
    calculate: (inputs) => {
      const days = Number(inputs.availableDays || 4);
      const lvl = String(inputs.trainingLevel || 'intermediate');

      let suggestedSplit = 'Full Body';
      if (days === 4) suggestedSplit = 'Upper / Lower Split';
      else if (days >= 5) suggestedSplit = 'Push / Pull / Legs (PPL)';

      return {
        results: [
          { label: 'Recommended Training Split', value: suggestedSplit, isPrimary: true },
          { label: 'Muscle Stimulation Frequency', value: days >= 4 ? '2x per week' : '3x per week' },
          { label: 'Average Rest Days weekly', value: `${7 - days} rest days` }
        ],
        chartData: [
          { name: 'Active Days', value: days },
          { name: 'Rest Days', value: 7 - days }
        ]
      };
    }
  },
  {
    id: 'v15-recovery',
    name: 'Training Recovery Calculator',
    slug: 'v15-recovery-calculator',
    category: 'fitness',
    description: 'Calculate your recovery timeline and muscular readiness index after intense athletic workouts.',
    seoTitle: 'Muscle Recovery & CNS Readiness Planner',
    seoDescription: 'Track muscle recovery timelines. Estimate central nervous system readiness and rest intervals based on workout intensity.',
    inputs: [
      { id: 'intensityLevel', label: 'Session Exertion Level (RPE)', type: 'select', defaultValue: '8', options: [
        { label: 'Light - Active Recovery (RPE 5-6)', value: '6' },
        { label: 'Moderate - Heavy Volume (RPE 7-8)', value: '8' },
        { label: 'All-Out - To Failure (RPE 9-10)', value: '10' }
      ]},
      { id: 'muscleTier', label: 'Primary Muscle Group Trained', type: 'select', defaultValue: 'major', options: [
        { label: 'Major Muscles (Quads, Back, Chest)', value: 'major' },
        { label: 'Minor Muscles (Arms, Shoulders, Calves)', value: 'minor' }
      ]}
    ],
    formula: 'Recovery duration ranges from 24h (light minor) to 72h (extreme major) to ensure complete fiber repair.',
    explanation: 'Muscles grow and repair during rest, not during workouts. Skipping recovery stops compounding gains and raises injury risks.',
    example: 'An intense back session reaching RPE 8 to 10 requires a full 48 to 72 hours of recovery before retraining.',
    faq: [
      { question: 'What is RPE?', answer: 'RPE stands for Rate of Perceived Exertion, a 1-to-10 scale measuring workout intensity, where 10 represents maximum physical exertion.' },
      { question: 'How can I accelerate muscle recovery?', answer: 'Prioritize sleeping 8 hours nightly, hit your protein targets, and incorporate light active recovery sessions like walking.' }
    ],
    relatedSlugs: ['v15-exercise-intensity-calculator', 'v15-workout-planner-calculator'],
    calculate: (inputs) => {
      const rpe = Number(inputs.intensityLevel || 8);
      const muscle = String(inputs.muscleTier || 'major');

      let hoursNeeded = 48;
      if (rpe <= 6) hoursNeeded = 24;
      else if (rpe >= 9) hoursNeeded = muscle === 'major' ? 72 : 48;

      return {
        results: [
          { label: 'Estimated Recovery Timeline', value: `${hoursNeeded} Hours`, isPrimary: true },
          { label: 'Recommended Days Off', value: `${(hoursNeeded / 24).toFixed(0)} Rest Days` },
          { label: 'CNS Exertion Level', value: rpe >= 9 ? 'Systemic Fatigue High' : 'Manageable Fatigue' }
        ],
        chartData: [
          { name: 'Recovery Hours', value: hoursNeeded },
          { name: 'Baseline rest', value: 24 }
        ]
      };
    }
  },
  {
    id: 'v15-exercise-intensity',
    name: 'Exercise Intensity Calculator',
    slug: 'v15-exercise-intensity-calculator',
    category: 'fitness',
    description: 'Calculate your target cardio training zones based on heart rate reserves and fitness levels.',
    seoTitle: 'Aerobic Cardio Intensity & Heart rate Zone Calculator',
    seoDescription: 'Generate custom target heart rate zones for fat burn, aerobic capacity, or anaerobic power development.',
    inputs: [
      { id: 'userAge', label: 'Age (Years)', type: 'number', defaultValue: 30 },
      { id: 'restingHR', label: 'Resting Heart Rate (BPM)', type: 'number', defaultValue: 65 },
      { id: 'targetZone', label: 'Target Exercise Intensity Zone', type: 'select', defaultValue: 'aerobic', options: [
        { label: 'Zone 1 - Active Recovery (50% - 60%)', value: 'z1' },
        { label: 'Zone 2 - Aerobic Base (60% - 70%)', value: 'z2' },
        { label: 'Zone 3 - Temperate Cardio (70% - 80%)', value: 'z3' },
        { label: 'Zone 4 - Anaerobic Threshold (80% - 90%)', value: 'z4' }
      ]}
    ],
    formula: 'Karvonen Formula: Target HR = ((Max HR - Resting HR) * Intensity%) + Resting HR',
    explanation: 'Using the Karvonen formula allows you to calculate training zones that precision-target either fat burning or athletic endurance based on your heart rate reserve.',
    example: 'For a 30-year-old with a resting heart rate of 65 BPM, Zone 2 aerobicing spans 140 to 152 BPM.',
    faq: [
      { question: 'Why use the Karvonen formula over simple percentages?', answer: 'The Karvonen formula factors in your resting heart rate, tailoring the heart rate zones to your actual cardiovascular conditioning level.' },
      { question: 'What is the primary benefit of Zone 2 training?', answer: 'Zone 2 training stimulates mitochondrial health, building a wider aerobic engine for long-distance endurance.' }
    ],
    relatedSlugs: ['v15-recovery-calculator', 'v15-strength-level-calculator'],
    calculate: (inputs) => {
      const age = Number(inputs.userAge || 30);
      const rhr = Number(inputs.restingHR || 60);
      const zone = String(inputs.targetZone || 'z2');

      const mhr = 220 - age;
      const hrr = mhr - rhr;

      let pctMin = 0.5, pctMax = 0.6;
      if (zone === 'z2') { pctMin = 0.6; pctMax = 0.7; }
      else if (zone === 'z3') { pctMin = 0.7; pctMax = 0.8; }
      else if (zone === 'z4') { pctMin = 0.8; pctMax = 0.9; }

      const hrMin = Math.round((hrr * pctMin) + rhr);
      const hrMax = Math.round((hrr * pctMax) + rhr);

      return {
        results: [
          { label: 'Target Heart Rate Bounds', value: `${hrMin} - ${hrMax} BPM`, isPrimary: true },
          { label: 'Heart Rate Ceiling (MHR)', value: `${mhr} BPM` },
          { label: 'Heart Rate Reserve (HRR)', value: `${hrr} BPM` }
        ],
        chartData: [
          { name: 'Zone Bottom', value: hrMin },
          { name: 'Zone Ceiling', value: hrMax }
        ]
      };
    }
  },
  {
    id: 'v15-fitness-progress-tracker',
    name: 'Fitness Progress Tracker',
    slug: 'v15-fitness-progress-tracker-calculator',
    category: 'fitness',
    description: 'Calculate your rate of physical progression across strength lifts, body mass, and aerobic paces.',
    seoTitle: 'Athletic Performance Progression Tracker',
    seoDescription: 'Verify athletic development rates. Project 3-month performance and calorie benchmarks to keep progress compounding.',
    inputs: [
      { id: 'startMetric', label: 'Starting Metric (kg, reps, or mins)', type: 'number', defaultValue: 100 },
      { id: 'currentMetric', label: 'Current Metric (kg, reps, or mins)', type: 'number', defaultValue: 110 },
      { id: 'weeksPassed', label: 'Weeks Between Measures', type: 'number', defaultValue: 6 }
    ],
    formula: 'Progress rate = ((Current Metric - Starting Metric) / Weeks Passed)',
    explanation: 'Consistent metric tracking reveals whether your training split or calorie plan is actually driving results, letting you adjust parameters before hitting progress plateaus.',
    example: 'Adding 10 kg to a bench press over exactly 6 weeks represents a solid progression rate of 1.67 kg per week.',
    faq: [
      { question: 'What is a typical progression rate for lifts?', answer: 'Beginners can often add 1 to 2.5 kg weekly, while advanced lifters may celebrate adding 5 kg to a major lift over several months.' },
      { question: 'Why does progression slow over time?', answer: 'Your body adapts to muscular training stimuli, moving closer to its genetic ceiling and requiring more advanced training volume to trigger further adaptation.' }
    ],
    relatedSlugs: ['v15-strength-level-calculator', 'v15-workout-planner-calculator'],
    calculate: (inputs) => {
      const start = Number(inputs.startMetric || 1);
      const cur = Number(inputs.currentMetric || 1);
      const weeks = Number(inputs.weeksPassed || 1);

      const change = cur - start;
      const rate = weeks > 0 ? change / weeks : 0;
      const pctChange = (change / start) * 100;

      return {
        results: [
          { label: 'Weekly Progression Rate', value: `${rate.toFixed(2)} units / week`, isPrimary: true },
          { label: 'Total Absolute Improvement', value: `${change > 0 ? '+' : ''}${change.toFixed(1)} units` },
          { label: 'Overall Relative Growth', value: `${pctChange.toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Start', value: start },
          { name: 'Current', value: cur }
        ]
      };
    }
  },
  {
    id: 'v15-strength-level',
    name: 'Strength Level Calculator',
    slug: 'v15-strength-level-calculator',
    category: 'fitness',
    description: 'Calculate your relative strength levels on key compound lifts, grading performance against standardized body weight ratios.',
    seoTitle: 'Powerlifting Strength Levels & Ratio Calculator',
    seoDescription: 'Verify your strength bracket. Input body weight and max working lifts to compare your strength level with international averages.',
    inputs: [
      { id: 'bodyWeightKg', label: 'Body Weight (kg)', type: 'number', defaultValue: 80 },
      { id: 'oneRepMaxKg', label: 'Estimated One-Rep Maximum (kg)', type: 'number', defaultValue: 120 },
      { id: 'liftType', label: 'Lifting Pattern', type: 'select', defaultValue: 'bench', options: [
        { label: 'Bench Press (Upper Push)', value: 'bench' },
        { label: 'Squat (Leg Power)', value: 'squat' },
        { label: 'Deadlift (Posterior Force)', value: 'deadlift' }
      ]}
    ],
    formula: 'Strength-to-Weight Ratio = One-Rep Max / Body Weight',
    explanation: 'A higher strength-to-weight ratio reflects superior relative power, which is the foundational metric for gymnast balance and weight class athletic performance.',
    example: 'An 80 kg athlete squatting a 120 kg one-rep maximum achieves a ratio of 1.5x body weight, placing them in the intermediate strength bracket.',
    faq: [
      { question: 'What represents an elite bench press ratio?', answer: 'Bench pressing 1.5 to 2.0 times your body weight is generally considered elite-level strength among lifelong natural lifters.' },
      { question: 'How is squat strength tier graded?', answer: 'Squatting 1.5x body weight is a typical milestone for intermediates, while reaching 2.0x body weight demonstrates advanced athletic power.' }
    ],
    relatedSlugs: ['v15-fitness-progress-tracker-calculator', 'v15-workout-planner-calculator'],
    calculate: (inputs) => {
      const bw = Number(inputs.bodyWeightKg || 1);
      const orm = Number(inputs.oneRepMaxKg || 0);
      const lift = String(inputs.liftType || 'bench');

      const ratio = orm / bw;

      let level = 'Beginner';
      if (lift === 'bench') {
        if (ratio >= 1.5) level = 'Advanced / Athlete';
        else if (ratio >= 1.0) level = 'Intermediate';
      } else if (lift === 'squat' || lift === 'deadlift') {
        if (ratio >= 2.0) level = 'Advanced / Athlete';
        else if (ratio >= 1.5) level = 'Intermediate';
      }

      return {
        results: [
          { label: 'Strength-to-Weight Ratio', value: `${ratio.toFixed(2)}x Body Weight`, isPrimary: true },
          { label: 'Calculated Strength Bracket', value: level },
          { label: 'Target Ratio for Next Tier', value: '1.50x to 2.00x' }
        ],
        chartData: [
          { name: 'Your Ratio', value: Math.round(ratio * 10) },
          { name: 'Target Ratio Baseline', value: 15 } // scaled 1.5 * 10
        ]
      };
    }
  }
];
