import { Calculator } from '../types';

export const V13_HEALTH_FITNESS_CALCULATORS: Calculator[] = [
  {
    id: 'healthy-weight',
    name: 'Healthy Weight Calculator',
    slug: 'healthy-weight-calculator',
    category: 'health',
    description: 'Find your healthy body weight range based on WHO BMI standards for height.',
    seoTitle: 'Healthy Weight Range Planner (WHO Guidelines)',
    seoDescription: 'Input height and biological markers to identify target weights supporting healthy metabolic profiles.',
    inputs: [
      { id: 'height', label: 'Your Height', type: 'number', defaultValue: 175, unit: 'cm', min: 100, max: 250 }
    ],
    formula: 'Minimum Weight = 18.5 * (Height/100)^2\nMaximum Weight = 24.9 * (Height/100)^2',
    explanation: 'Uses World Health Organization (WHO) BMI benchmarks (18.5 to 24.9) to establish healthy weight ranges based on height.',
    example: 'For a height of 175 cm, the healthy weight range is 56.7 kg to 76.3 kg.',
    faq: [
      { question: 'What is BMI?', answer: 'Body Mass Index. A metric of body fatness calculated as weight divided by height squared, used as a screening tool for healthy weight.' }
    ],
    relatedSlugs: ['ideal-weight-calculator', 'macro-calculator'],
    keywords: ['healthy weight index who', 'height weight body scale', 'mass target calculator'],
    calculate: (inputs) => {
      const h = Number(inputs.height || 175) / 100;

      const minW = 18.5 * h * h;
      const maxW = 24.9 * h * h;
      const idealW = 21.7 * h * h;

      return {
        results: [
          { label: 'Healthy Weight Range', value: `${minW.toFixed(1)} - ${maxW.toFixed(1)}`, unit: 'kg', isPrimary: true },
          { label: 'Median Ideal Balanced Weight', value: `${idealW.toFixed(1)}`, unit: 'kg' }
        ],
        chartData: [
          { name: 'Lower Bound (kg)', value: Math.round(minW) },
          { name: 'Median Safe (kg)', value: Math.round(idealW) },
          { name: 'Upper Bound (kg)', value: Math.round(maxW) }
        ]
      };
    }
  },
  {
    id: 'weight-goal',
    name: 'Weight Goal Calculator',
    slug: 'weight-goal-calculator',
    category: 'health',
    description: 'Calculate weekly calorie targets and estimated timelines to reach your target weight safely.',
    seoTitle: 'Weight Goal Target & Calorie Timeline Calculator',
    seoDescription: 'Forecast when you will reach your target weight based on safe daily calorie deficits.',
    inputs: [
      { id: 'weight', label: 'Current Weight', type: 'number', defaultValue: 85, unit: 'kg' },
      { id: 'target', label: 'Target Weight', type: 'number', defaultValue: 78, unit: 'kg' },
      { id: 'activity', label: 'Daily Activity Level', type: 'select', defaultValue: 'moderate', options: [{ label: 'Sedentary (No exercise)', value: 'sedentary' }, { label: 'Light (1-3 days/wk)', value: 'light' }, { label: 'Moderate (3-5 days/wk)', value: 'moderate' }, { label: 'Heavy (6-7 days/wk)', value: 'heavy' }] },
      { id: 'pace', label: 'Weekly Change Pace', type: 'select', defaultValue: 'moderate', options: [{ label: 'Slow (0.25 kg/wk)', value: 'slow' }, { label: 'Moderate (0.5 kg/wk)', value: 'moderate' }, { label: 'Rapid (1.0 kg/wk)', value: 'rapid' }] }
    ],
    formula: 'Daily Calorie Deficit = Weekly Pace (kg) * 7700 / 7',
    explanation: 'A deficit of 7,700 kcal is approximately required to burn 1 kg of body fat. Safe weekly weight loss rates range from 0.25 to 1.0 kg.',
    example: 'Losing 7 kg (from 85 kg to 78 kg) at a moderate pace of 0.5 kg/week requires a daily 550 calorie deficit and takes 14 weeks.',
    faq: [
      { question: 'What is a safe weekly weight loss rate?', answer: 'Health organizations recommend losing 0.5 kg to 1.0 kg per week to preserve lean muscle tissue and support long-term weight management.' }
    ],
    relatedSlugs: ['healthy-weight-calculator', 'macro-calculator'],
    keywords: ['calorie deficit deficit calculator', 'target weight goal timeline', 'safe fat loss planner'],
    calculate: (inputs) => {
      const cur = Number(inputs.weight || 85);
      const tgt = Number(inputs.target || 78);
      const activity = inputs.activity || 'moderate';
      const pace = inputs.pace || 'moderate';

      let factor = 32; // basic calorie factor per kg
      if (activity === 'sedentary') factor = 28;
      else if (activity === 'light') factor = 30;
      else if (activity === 'heavy') factor = 35;

      const tdee = cur * factor;

      let weeklyGoal = 0.5;
      if (pace === 'slow') weeklyGoal = 0.25;
      else if (pace === 'rapid') weeklyGoal = 1.0;

      const totalDelta = Math.abs(cur - tgt);
      const weeksNeeded = weeklyGoal > 0 ? totalDelta / weeklyGoal : 0;

      // 1kg of fat ≈ 7700 kcal
      const dailyDeficit = weeklyGoal * 7700 / 7;
      const targetCalories = cur >= tgt ? tdee - dailyDeficit : tdee + dailyDeficit;

      return {
        results: [
          { label: 'Target Completion Date', value: `${weeksNeeded.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Daily Calorie Expenditure (TDEE)', value: `${Math.round(tdee)}`, unit: 'kcal' },
          { label: 'Target Daily Calories', value: `${Math.round(targetCalories)}`, unit: 'kcal' },
          { label: 'Adjusted Deficit/Surplus', value: cur >= tgt ? `Deficit: -${Math.round(dailyDeficit)} kcal` : `Surplus: +${Math.round(dailyDeficit)} kcal` }
        ],
        chartData: [
          { name: 'Maintenance Calories', value: Math.round(tdee) },
          { name: 'Target Calorie Budget', value: Math.round(targetCalories) }
        ]
      };
    }
  },
  {
    id: 'calories-per-meal',
    name: 'Calories Per Meal Calculator',
    slug: 'calories-per-meal-calculator',
    category: 'health',
    description: 'Distribute your daily calorie target across structured meals and snacks to manage hunger and energy.',
    seoTitle: 'Daily Calories Per Meal Distribution Calculator',
    seoDescription: 'Obtain exact meal calorie breakdowns matching 3, 4, or 5 meals daily.',
    inputs: [
      { id: 'dailyTarget', label: 'Daily Calorie Target', type: 'number', defaultValue: 2000, unit: 'kcal' },
      { id: 'mealPlan', label: 'Choose Meal Structure', type: 'select', defaultValue: '3_meals_1_snack', options: [{ label: '3 Standard Meals', value: '3_meals' }, { label: '3 Meals + 1 Snack', value: '3_meals_1_snack' }, { label: '3 Meals + 2 Snacks', value: '3_meals_2_snacks' }, { label: '4 Even Meals (No snacks)', value: '4_meals' }] }
    ],
    formula: '3 Meals + 1 Snack: Breakfast (30%), Lunch (35%), Dinner (25%), Snack (10%)',
    explanation: 'Distribute your calorie budget across meals to manage hunger, support training, and prevent overeating.',
    example: 'Dividing 2,000 daily calories into 3 meals and 1 snack allocates 600 kcal for breakfast, 700 kcal for lunch, 500 kcal for dinner, and 200 kcal for a snack.',
    faq: [
      { question: 'Does meal timing affect weight loss?', answer: 'No. Total daily energy balance (calories in vs. calories out) is the primary driver of weight loss, regardless of meal frequency or timing.' }
    ],
    relatedSlugs: ['macro-calculator', 'weight-goal-calculator'],
    keywords: ['per meal calorie tracking', 'breakfast dinner calorie splits', 'portion target helper'],
    calculate: (inputs) => {
      const daily = Number(inputs.dailyTarget || 2000);
      const plan = inputs.mealPlan || '3_meals_1_snack';

      let bVal = 0, lVal = 0, dVal = 0, s1Val = 0, s2Val = 0;

      if (plan === '3_meals') {
        bVal = daily * 0.33;
        lVal = daily * 0.34;
        dVal = daily * 0.33;
      } else if (plan === '3_meals_1_snack') {
        bVal = daily * 0.3;
        lVal = daily * 0.35;
        dVal = daily * 0.25;
        s1Val = daily * 0.1;
      } else if (plan === '3_meals_2_snacks') {
        bVal = daily * 0.25;
        lVal = daily * 0.3;
        dVal = daily * 0.25;
        s1Val = daily * 0.1;
        s2Val = daily * 0.1;
      } else if (plan === '4_meals') {
        bVal = daily * 0.25;
        lVal = daily * 0.25;
        dVal = daily * 0.25;
        s1Val = daily * 0.25;
      }

      return {
        results: [
          { label: 'Breakfast Target', value: `${Math.round(bVal)}`, unit: 'kcal', isPrimary: true },
          { label: 'Lunch Target', value: `${Math.round(lVal)}`, unit: 'kcal' },
          { label: 'Dinner Target', value: `${Math.round(dVal)}`, unit: 'kcal' },
          { label: 'Primary Snack / Additional Meal', value: s1Val > 0 ? `${Math.round(s1Val)} kcal` : 'N/A' },
          { label: 'Secondary Snack Option', value: s2Val > 0 ? `${Math.round(s2Val)} kcal` : 'N/A' }
        ],
        chartData: [
          { name: 'Breakfast', value: Math.round(bVal) },
          { name: 'Lunch', value: Math.round(lVal) },
          { name: 'Dinner', value: Math.round(dVal) },
          { name: 'Snacks/Other', value: Math.round(s1Val + s2Val) }
        ]
      };
    }
  },
  {
    id: 'protein-intake',
    name: 'Protein Intake Calculator',
    slug: 'protein-intake-calculator',
    category: 'health',
    description: 'Calculate your daily target protein intake based on body weight, training goals, and lifestyle.',
    seoTitle: 'Daily Protein Intake Target Calculator',
    seoDescription: 'Determine protein targets in grams based on training goals (e.g., muscle gain, weight loss, sedentary).',
    inputs: [
      { id: 'weight', label: 'Body Weight (kg)', type: 'number', defaultValue: 75, min: 30, max: 250 },
      { id: 'intent', label: 'Your Training Goal', type: 'select', defaultValue: 'muscle_gain', options: [{ label: 'Sedentary (General Health)', value: 'health' }, { label: 'Endurance Running / Cardio', value: 'endurance' }, { label: 'Muscle Gain / Strength', value: 'muscle_gain' }, { label: 'Calorie Deficit fat loss (Preserve Muscle)', value: 'fat_loss' }] }
    ],
    formula: 'Protein Intake = Weight (kg) * Multiplication Factor (0.8 to 2.2 g/kg)',
    explanation: 'Protein supports muscle maintenance and repair. Higher physical activity levels and calorie deficits require elevated protein ranges to prevent muscle breakdown.',
    example: 'A active 75 kg lifter looking to gain muscle requires 1.8g to 2.0g per kg, translating to approximately 135g to 150g of daily protein.',
    faq: [
      { question: 'Can you digest more than 30g of protein in one meal?', answer: 'Yes. While 20-30g maximizes muscle protein synthesis temporarily, the body easily digests and utilizes larger amounts over several hours.' }
    ],
    relatedSlugs: ['macro-calculator', 'weight-goal-calculator'],
    keywords: ['protein target daily', 'muscle building protein ratio', 'lean mass preservation'],
    calculate: (inputs) => {
      const w = Number(inputs.weight || 75);
      const intent = inputs.intent || 'muscle_gain';

      let minFactor = 0.8;
      let maxFactor = 1.0;

      if (intent === 'health') {
        minFactor = 0.8;
        maxFactor = 1.2;
      } else if (intent === 'endurance') {
        minFactor = 1.2;
        maxFactor = 1.6;
      } else if (intent === 'muscle_gain') {
        minFactor = 1.6;
        maxFactor = 2.2;
      } else if (intent === 'fat_loss') {
        minFactor = 1.8;
        maxFactor = 2.4;
      }

      const minVal = w * minFactor;
      const maxVal = w * maxFactor;

      return {
        results: [
          { label: 'Recommended Protein Intake', value: `${minVal.toFixed(0)} - ${maxVal.toFixed(0)}`, unit: 'g / day', isPrimary: true },
          { label: 'Minimum Vital Protein Requirement', value: `${(w * 0.8).toFixed(0)}`, unit: 'g / day' }
        ],
        chartData: [
          { name: 'Lower Target (g)', value: Math.round(minVal) },
          { name: 'Upper Target (g)', value: Math.round(maxVal) }
        ]
      };
    }
  },
  {
    id: 'fat-intake',
    name: 'Fat Intake Calculator',
    slug: 'fat-intake-calculator',
    category: 'health',
    description: 'Calculate daily dietary fat targets to support hormone regulation and health.',
    seoTitle: 'Daily Dietary Fat Targets Calculator',
    seoDescription: 'Forecast your essential fat intake in grams based on daily calorie targets.',
    inputs: [
      { id: 'totalCal', label: 'Daily Calorie Intake Target', type: 'number', defaultValue: 2000, unit: 'kcal' },
      { id: 'dietType', label: 'Desired Fat Ratio Plan', type: 'select', defaultValue: 'moderate', options: [{ label: 'Low Fat (20% of calories)', value: 'low' }, { label: 'Moderate Balanced (25% of calories)', value: 'moderate' }, { label: 'High Fat / Keto (35% of calories)', value: 'high' }] }
    ],
    formula: 'Fat grams = (Total Calories * Fat Allocation %) / 9',
    explanation: 'Dietary fats are critical for hormone synthesis and vitamin absorption. One gram of fat contains approximately 9 calories.',
    example: 'A 2,000 calorie target with an allocated 25% fat plan requires 500 fat calories daily, translating to approximately 56 grams of fat.',
    faq: [
      { question: 'What are healthy fats?', answer: 'Monounsaturated and polyunsaturated fats (found in avocados, olive oil, nuts, and salmon) support cardiovascular health and reduce inflammation.' }
    ],
    relatedSlugs: ['macro-calculator', 'protein-intake-calculator'],
    keywords: ['dietary healthy fat target', 'lipids hormone regulator', 'fat grams calorie share'],
    calculate: (inputs) => {
      const cal = Number(inputs.totalCal || 2000);
      const diet = inputs.dietType || 'moderate';

      let ratio = 0.25;
      if (diet === 'low') ratio = 0.2;
      else if (diet === 'high') ratio = 0.35;

      const fatCal = cal * ratio;
      const fatG = fatCal / 9;

      return {
        results: [
          { label: 'Recommended Daily Fats', value: `${fatG.toFixed(1)}`, unit: 'g', isPrimary: true },
          { label: 'Fat Calorie Allocation', value: `${Math.round(fatCal)}`, unit: 'kcal' },
          { label: 'Percentage of Daily Energy', value: `${(ratio * 100).toFixed(0)}%` }
        ],
        chartData: [
          { name: 'Fat Calories', value: Math.round(fatCal) },
          { name: 'Remaining Calories', value: Math.round(cal - fatCal) }
        ]
      };
    }
  },
  {
    id: 'carb-intake',
    name: 'Carbohydrate Intake Calculator',
    slug: 'carb-intake-calculator',
    category: 'health',
    description: 'Calculate daily targets for carbohydrates based on daily activity and calorie requirements.',
    seoTitle: 'Daily Carbohydrate Intake Target Calculator',
    seoDescription: 'Find daily target carb intakes in grams based on target training duration and intensity.',
    inputs: [
      { id: 'dailyCal', label: 'Daily Calorie Target', type: 'number', defaultValue: 2000, unit: 'kcal' },
      { id: 'proteinG', label: 'Your Planned Protein Intake', type: 'number', defaultValue: 130, unit: 'g' },
      { id: 'fatG', label: 'Your Planned Fat Intake', type: 'number', defaultValue: 55, unit: 'g' }
    ],
    formula: 'Carb calories = Total Calories - (Protein grams * 4) - (Fat grams * 9)\nCarb grams = Carb calories / 4',
    explanation: 'Carbohydrates are the body\'s primary energy source. Calculate your carb target by subtracting protein and fat calorie targets from your total daily budget.',
    example: 'For a 2,000 calorie plan containing 130g of protein (520 kcal) and 55g of fat (495 kcal), the remaining 985 kcal translates to approximately 246g of carbohydrates.',
    faq: [
      { question: 'What is the role of carbohydrates in training?', answer: 'Carbs are stored in muscles and the liver as glycogen. Adequate glycogen levels support training intensity and postpone fatigue.' }
    ],
    relatedSlugs: ['macro-calculator', 'protein-intake-calculator', 'fat-intake-calculator'],
    keywords: ['carbs target daily', 'glycogen tank planner', 'carbohydrate fuel requirements'],
    calculate: (inputs) => {
      const cal = Number(inputs.dailyCal || 2000);
      const prot = Number(inputs.proteinG || 130);
      const fat = Number(inputs.fatG || 55);

      const protCal = prot * 4;
      const fatCal = fat * 9;
      const carbCal = Math.max(0, cal - protCal - fatCal);
      const carbG = carbCal / 4;

      return {
        results: [
          { label: 'Recommended Daily Carbs', value: `${carbG.toFixed(1)}`, unit: 'g', isPrimary: true },
          { label: 'Carb Calorie Allocation', value: `${Math.round(carbCal)}`, unit: 'kcal' },
          { label: 'Remaining Energy Balance', value: `${((carbCal / cal) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Carbs (kcal)', value: Math.round(carbCal) },
          { name: 'Protein (kcal)', value: Math.round(protCal) },
          { name: 'Fats (kcal)', value: Math.round(fatCal) }
        ]
      };
    }
  },
  {
    id: 'bmi-trend',
    name: 'BMI Trend Calculator',
    slug: 'bmi-trend-calculator',
    category: 'health',
    description: 'Track and map alterations in your Body Mass Index (BMI) across progressive weight levels.',
    seoTitle: 'Dynamic BMI Trend & Health Boundary Calculator',
    seoDescription: 'Obtain BMI trend charts to visualize weight variations against standard healthy ranges.',
    inputs: [
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, min: 100, max: 250 },
      { id: 'startWeight', label: 'Prior Weight (kg)', type: 'number', defaultValue: 90 },
      { id: 'secWeight', label: 'Current Weight (kg)', type: 'number', defaultValue: 84 }
    ],
    formula: 'BMI = Weight (kg) / (Height/100)^2',
    explanation: 'Monitor alterations in your Body Mass Index to visualize your progress toward healthy target ranges.',
    example: 'For a height of 175 cm, reducing your weight from 90 kg to 84 kg shifts your BMI from a mildly obese 29.4 down to 27.4, tracking progress toward healthy ranges (under 25).',
    faq: [
      { question: 'What is a healthy BMI?', answer: 'A BMI between 18.5 and 24.9 is considered healthy, while 25-29.9 is classified as overweight, and 30+ as obese.' }
    ],
    relatedSlugs: ['healthy-weight-calculator', 'ideal-weight-calculator'],
    keywords: ['bmi change over time', 'health progress scale', 'body fat trajectory tracker'],
    calculate: (inputs) => {
      const h = Number(inputs.height || 175) / 100;
      const w1 = Number(inputs.startWeight || 90);
      const w2 = Number(inputs.secWeight || 84);

      const bmi1 = w1 / (h * h);
      const bmi2 = w2 / (h * h);
      const change = bmi2 - bmi1;

      return {
        results: [
          { label: 'Prior Body Mass Index (BMI)', value: `${bmi1.toFixed(1)}` },
          { label: 'Current Body Mass Index (BMI)', value: `${bmi2.toFixed(1)}`, isPrimary: true },
          { label: 'BMI Delta Change', value: change >= 0 ? `+${change.toFixed(1)}` : `${change.toFixed(1)}` }
        ],
        chartData: [
          { name: 'Prior BMI', value: Math.round(bmi1) },
          { name: 'Current BMI', value: Math.round(bmi2) }
        ]
      };
    }
  },
  {
    id: 'fitness-goal',
    name: 'Fitness Goal Calculator',
    slug: 'fitness-goal-calculator',
    category: 'fitness',
    description: 'Structure targeted athletic training volumes and heart rate zones matching personal training goals.',
    seoTitle: 'Athletic Fitness Target & Heart Rate Zone Planner',
    seoDescription: 'Obtain customized target training zones and weekly active card duration suggestions.',
    inputs: [
      { id: 'age', label: 'Your Age', type: 'number', defaultValue: 28, min: 10, max: 100 },
      { id: 'focus', label: 'Primary Physical Objective', type: 'select', defaultValue: 'strength', options: [{ label: 'Endurance Base (Cardio)', value: 'cardio' }, { label: 'Aerobic Fat Burning', value: 'fat_burn' }, { label: 'Strength & Power', value: 'strength' }, { label: 'Active General Recovery', value: 'recovery' }] }
    ],
    formula: 'Max HR = 220 - Age\nTarget training zone is calibrated based on selected physical objective percentages.',
    explanation: 'Track your training intensity and cardiorespiratory load to support your goals and prevent overtraining.',
    example: 'For an age of 28, Max HR is 192 bpm. Choosing an Endurance objective targets aerobic training zones between 70% and 80%, representing 134 to 154 bpm.',
    faq: [
      { question: 'Why use heart rate zones?', answer: 'Heart rate zones represent objective measures of physical strain, helping ensure you train at the appropriate intensity.' }
    ],
    relatedSlugs: ['healthy-weight-calculator', 'workout-duration-calculator'],
    keywords: ['aerobic capacity zone planner', 'fat burning heart zones', 'weekly workout targets'],
    calculate: (inputs) => {
      const age = Number(inputs.age || 28);
      const focus = inputs.focus || 'strength';

      const maxHr = 220 - age;
      let lowerPct = 0.6, upperPct = 0.7;
      let durationStr = '150 minutes weekly';

      if (focus === 'cardio') {
        lowerPct = 0.7;
        upperPct = 0.8;
        durationStr = '150-300 minutes moderate-vigorous cardio weekly';
      } else if (focus === 'fat_burn') {
        lowerPct = 0.6;
        upperPct = 0.7;
        durationStr = '4-5 steady pace sessions of 30-45 minutes weekly';
      } else if (focus === 'strength') {
        lowerPct = 0.8;
        upperPct = 0.9;
        durationStr = '3-4 progressive strength workouts of 45-60 minutes weekly';
      } else if (focus === 'recovery') {
        lowerPct = 0.5;
        upperPct = 0.6;
        durationStr = '2-3 light active recovery walks or stretching sessions weekly';
      }

      const lowerHr = maxHr * lowerPct;
      const upperHr = maxHr * upperPct;

      return {
        results: [
          { label: 'Target Heart Rate Zone', value: `${Math.round(lowerHr)} - ${Math.round(upperHr)}`, unit: 'bpm', isPrimary: true },
          { label: 'Maximum Heart Rate limit', value: `${maxHr}`, unit: 'bpm' },
          { label: 'Suggested Weekly Training volume', value: durationStr }
        ],
        chartData: [
          { name: 'Lower Zone limit', value: Math.round(lowerHr) },
          { name: 'Upper Zone limit', value: Math.round(upperHr) },
          { name: 'Absolute Max HR', value: maxHr }
        ]
      };
    }
  },
  {
    id: 'workout-duration',
    name: 'Workout Duration Calculator',
    slug: 'workout-duration-calculator',
    category: 'fitness',
    description: 'Plan total session length by accounting for warmup, active intervals, loading periods, and cooldowns.',
    seoTitle: 'Workout Session Duration & Timing Planner',
    seoDescription: 'Input target sets, warmups, and rest durations to find the total time required for a workout.',
    inputs: [
      { id: 'sets', label: 'Total Planned Heavy Sets', type: 'number', defaultValue: 15 },
      { id: 'rest', label: 'Average Rest Time Between Sets (Seconds)', type: 'number', defaultValue: 90 },
      { id: 'setLength', label: 'Average Set Execution Length (Seconds)', type: 'number', defaultValue: 40 },
      { id: 'warmup', label: 'Warmup Duration (Minutes)', type: 'number', defaultValue: 10 },
      { id: 'cooldown', label: 'Cooldown / Stretch Time', type: 'number', defaultValue: 5 }
    ],
    formula: 'Total Duration = Warmup + Cooldown + [Sets * (SetLength + Rest) / 60]',
    explanation: 'Track the total time required for a workout to plan your sessions and avoid fatigue from excessively long workouts.',
    example: 'A workout with 15 sets, 90-second rest intervals, 40-second active sets, a 10-minute warmup, and a 5-minute cooldown requires approximately 47.5 minutes.',
    faq: [
      { question: 'What is the optimal workout duration?', answer: 'For resistance training, 45 to 75 minutes of high-intensity work is typically sufficient to stimulate growth without excessive stress.' }
    ],
    relatedSlugs: ['workout-volume-calculator', 'fitness-goal-calculator'],
    keywords: ['workout duration timeline', 'session time target', 'gym set rest scheduler'],
    calculate: (inputs) => {
      const sets = Number(inputs.sets || 15);
      const restSec = Number(inputs.rest || 90);
      const setSec = Number(inputs.setLength || 40);
      const warmupMin = Number(inputs.warmup || 10);
      const cooldownMin = Number(inputs.cooldown || 5);

      const activeTimeSec = sets * (restSec + setSec);
      const totalMin = warmupMin + cooldownMin + (activeTimeSec / 60);

      return {
        results: [
          { label: 'Estimated Workout Duration', value: `${totalMin.toFixed(1)} Minutes`, isPrimary: true },
          { label: 'Active Weightlifting Segment', value: `${(activeTimeSec / 60).toFixed(1)} Minutes` },
          { label: 'Total rest Slabs', value: `${((sets * restSec) / 60).toFixed(1)} Minutes` }
        ],
        chartData: [
          { name: 'Warmup/Cooldown', value: warmupMin + cooldownMin },
          { name: 'Under Load Work', value: Math.round((sets * setSec) / 60) },
          { name: 'Rest Recovery', value: Math.round((sets * restSec) / 60) }
        ]
      };
    }
  },
  {
    id: 'workout-volume',
    name: 'Workout Volume Calculator',
    slug: 'workout-volume-calculator',
    category: 'fitness',
    description: 'Calculate total tonnage lifted per movement or entire workout sessions to monitor volume overload.',
    seoTitle: 'Total Weightlifted Session Volume Tonnage Calculator',
    seoDescription: 'Determine total workout tonnage (weight x sets x reps) to track progressive volume overload.',
    inputs: [
      { id: 'weight', label: 'Weight Lifted', type: 'number', defaultValue: 60, unit: 'kg' },
      { id: 'sets', label: 'Sets Completed', type: 'number', defaultValue: 4 },
      { id: 'reps', label: 'Reps per Set', type: 'number', defaultValue: 10 }
    ],
    formula: 'Total Tonnage Volume = Weight * Sets * Reps',
    explanation: 'Track workout volume (total weight lifted) to verify progressive overload and stimulate muscle growth over time.',
    example: 'Lifting 60 kg for 4 sets of 10 reps yields a total daily training volume of 2,400 kg.',
    faq: [
      { question: 'What is progressive overload?', answer: 'Gradually increasing weight, reps, or sets over time to continually challenge muscles and stimulate muscle growth.' }
    ],
    relatedSlugs: ['workout-duration-calculator', 'strength-progress-calculator'],
    keywords: ['workout tonnage calculator', 'progressive overload load metric', 'bodybuilding volume tracking'],
    calculate: (inputs) => {
      const wt = Number(inputs.weight || 60);
      const sets = Number(inputs.sets || 4);
      const reps = Number(inputs.reps || 10);

      const tonnage = wt * sets * reps;

      return {
        results: [
          { label: 'Total Tonnage Volume', value: `${tonnage.toLocaleString()}`, unit: 'kg', isPrimary: true },
          { label: 'Working Reps Completed', value: `${sets * reps}` }
        ],
        chartData: [
          { name: 'Unit Load (kg)', value: wt },
          { name: 'Multi-set Total (divided)', value: Math.round(tonnage / 10) }
        ]
      };
    }
  },
  {
    id: 'strength-progress',
    name: 'Strength Progress Calculator',
    slug: 'strength-progress-calculator',
    category: 'fitness',
    description: 'Calculate strength gain percentages and compare your performance across training cycles.',
    seoTitle: 'Strength Gain Percentage & Lift Progress Calculator',
    seoDescription: 'Obtain absolute strength gains, and determine percentage progress across training blocks.',
    inputs: [
      { id: 'oldMax', label: 'Baseline Lift/Max', type: 'number', defaultValue: 100, unit: 'kg' },
      { id: 'newMax', label: 'Current Lift/Max', type: 'number', defaultValue: 112.5, unit: 'kg' }
    ],
    formula: 'Strength Increase (%) = [(New Lift - Old Lift) / Old Lift] * 100',
    explanation: 'Track changes in your one-rep max or working sets to evaluate the efficacy of your strength programs.',
    example: 'Increasing your squat from 100 kg to 112.5 kg represents an impressive 12.50% strength gain.',
    faq: [
      { question: 'How quickly can I expect strength to increase?', answer: 'Beginners can experience rapid strength gains (due to neural adaptations), while experienced lifters may require weeks of targeted training to add 2-5% to their lifts.' }
    ],
    relatedSlugs: ['workout-volume-calculator', 'fitness-goal-calculator'],
    keywords: ['strength scaling progress tracker', 'max lift percentage growth', 'barbell progress calculator'],
    calculate: (inputs) => {
      const oldVal = Number(inputs.oldMax || 100);
      const newVal = Number(inputs.newMax || 112.5);

      const change = newVal - oldVal;
      const pct = oldVal > 0 ? (change / oldVal) * 100 : 0;

      return {
        results: [
          { label: 'Strength Progress Gain', value: `${pct.toFixed(2)}%`, isPrimary: true },
          { label: 'Absolute Load Increase', value: `+${change.toFixed(1)}`, unit: 'kg' }
        ],
        chartData: [
          { name: 'Prior Maximum Lift', value: Math.round(oldVal) },
          { name: 'Current Maximum Lift', value: Math.round(newVal) }
        ]
      };
    }
  },
  {
    id: 'body-transformation',
    name: 'Body Transformation Calculator',
    slug: 'body-transformation-calculator',
    category: 'fitness',
    description: 'Track alterations in body composition by balancing fat loss with lean muscle mass gains.',
    seoTitle: 'Body Composition Transformation & Muscle Gain Calculator',
    seoDescription: 'Calculate absolute changes in lean muscle mass and body fat percentage.',
    inputs: [
      { id: 'weight1', label: 'Starting Total Weight (kg)', type: 'number', defaultValue: 82 },
      { id: 'fatPct1', label: 'Starting Body Fat (%)', type: 'number', defaultValue: 24, min: 2, max: 60 },
      { id: 'weight2', label: 'Current Total Weight (kg)', type: 'number', defaultValue: 78 },
      { id: 'fatPct2', label: 'Current Body Fat (%)', type: 'number', defaultValue: 18, min: 2, max: 60 }
    ],
    formula: 'Lean Mass = Weight * (1 - Fat%)\nFat Mass = Weight * Fat%',
    explanation: 'Track body composition changes (lean muscle mass vs. body fat) rather than just total weight to evaluate your nutrition and training program.',
    example: 'Reducing total weight from 82 kg to 78 kg while decreasing body fat from 24% to 18% means you burned 5.6 kg of body fat while gaining approximately 1.6 kg of lean muscle mass.',
    faq: [
      { question: 'What is body recomposition?', answer: 'Gaining muscle and losing fat simultaneously. This is typically observed in beginners, individuals returning to training, or those with higher body fat levels.' }
    ],
    relatedSlugs: ['healthy-weight-calculator', 'workout-volume-calculator'],
    keywords: ['lean mass ratio analyzer', 'body fat loss calculator', 'muscle gain metric tracking'],
    calculate: (inputs) => {
      const w1 = Number(inputs.weight1 || 82);
      const f1 = Number(inputs.fatPct1 || 24) / 100;
      const w2 = Number(inputs.weight2 || 78);
      const f2 = Number(inputs.fatPct2 || 18) / 100;

      const fatMass1 = w1 * f1;
      const leanMass1 = w1 * (1 - f1);

      const fatMass2 = w2 * f2;
      const leanMass2 = w2 * (1 - f2);

      const fatChange = fatMass2 - fatMass1;
      const leanChange = leanMass2 - leanMass1;

      return {
        results: [
          { label: 'Diet Performance Overview', value: fatChange <= 0 ? `Cost of fat lost: ${Math.abs(fatChange).toFixed(1)} kg` : `Fat Gained: +${fatChange.toFixed(1)} kg`, isPrimary: true },
          { label: 'Lean Muscle Balance Change', value: leanChange >= 0 ? `Lean Gained: +${leanChange.toFixed(1)} kg` : `Lean Lost: ${leanChange.toFixed(1)} kg` },
          { label: 'Starting Lean Muscle Mass', value: `${leanMass1.toFixed(1)}`, unit: 'kg' },
          { label: 'Current Lean Muscle Mass', value: `${leanMass2.toFixed(1)}`, unit: 'kg' }
        ],
        chartData: [
          { name: 'Initial Fat (kg)', value: Math.round(fatMass1) },
          { name: 'Current Fat (kg)', value: Math.round(fatMass2) },
          { name: 'Initial Lean (kg)', value: Math.round(leanMass1) },
          { name: 'Current Lean (kg)', value: Math.round(leanMass2) }
        ]
      };
    }
  },
  {
    id: 'running-training',
    name: 'Running Training Calculator',
    slug: 'running-training-calculator',
    category: 'fitness',
    description: 'Calculate target running paces for different workout intensities like recovery, tempo, intervals, and aerobic base runs.',
    seoTitle: 'Running Training Pace Target Calculator',
    seoDescription: 'Input a recent race time to calculate optimal running paces for recovery, tempo, and speed intervals.',
    inputs: [
      { id: 'distance', label: 'Recent Race Distance', type: 'select', defaultValue: '5k', options: [{ label: '5 km Run', value: '5k' }, { label: '10 km Run', value: '10k' }, { label: 'Half Marathon (21.1 km)', value: 'half' }] },
      { id: 'minutes', label: 'Race Time (Minutes)', type: 'number', defaultValue: 25 },
      { id: 'seconds', label: 'Race Time (Seconds)', type: 'number', defaultValue: 0 }
    ],
    formula: 'Training intensities are calculated based on percentages of your baseline VO2/aerobic pace.',
    explanation: 'Maximize training efficiency by running at the appropriate paces to stimulate specific physiological systems, preventing injury and overtraining.',
    example: 'A 5K race time of 25:00 (5:00/km pace) translates to suggested paces of 6:15/km for aerobic base runs, 5:25/km for tempo runs, and 4:35/km for intervals.',
    faq: [
      { question: 'Why use different running paces?', answer: 'Different training intensities stimulate specific physiological adaptations. Low-intensity runs build aerobic bases, while intervals raise anaerobic thresholds.' }
    ],
    relatedSlugs: ['pace-improvement-calculator', 'fitness-goal-calculator'],
    keywords: ['aerobic runs target pace', 'tempo running zones', 'track intervals speed calculator'],
    calculate: (inputs) => {
      const dist = inputs.distance || '5k';
      const m = Number(inputs.minutes || 25);
      const s = Number(inputs.seconds || 0);

      const totalSec = (m * 60) + s;
      let distKm = 5;
      if (dist === '10k') distKm = 10;
      else if (dist === 'half') distKm = 21.1;

      const basePaceSec = totalSec / distKm;

      // Paces based on percentage multipliers
      const easyPaceSec = basePaceSec * 1.25;
      const tempoPaceSec = basePaceSec * 1.08;
      const intervalPaceSec = basePaceSec * 0.92;

      const formatPace = (secs: number) => {
        const minPart = Math.floor(secs / 60);
        const secPart = Math.floor(secs % 60);
        return `${minPart}:${secPart.toString().padStart(2, '0')} /km`;
      };

      return {
        results: [
          { label: 'Aerobic Base (Easy Run)', value: formatPace(easyPaceSec), isPrimary: true },
          { label: 'Tempo Training Intensity', value: formatPace(tempoPaceSec) },
          { label: 'Vo2-Max Speed Intervals', value: formatPace(intervalPaceSec) },
          { label: 'Baseline Race Pace', value: formatPace(basePaceSec) }
        ],
        chartData: [
          { name: 'Intervals (Sec/km)', value: Math.round(intervalPaceSec) },
          { name: 'Race Pace (Sec/km)', value: Math.round(basePaceSec) },
          { name: 'Easy Pace (Sec/km)', value: Math.round(easyPaceSec) }
        ]
      };
    }
  },
  {
    id: 'pace-improvement',
    name: 'Pace Improvement Calculator',
    slug: 'pace-improvement-calculator',
    category: 'fitness',
    description: 'Calculate target pacings to shave time off your personal best run targets.',
    seoTitle: 'Running Pace Improvement Target Calculator',
    seoDescription: 'Obtain required speed increases and split progressions to reach your race goals.',
    inputs: [
      { id: 'distance', label: 'Race Target Span', type: 'select', defaultValue: '5k', options: [{ label: '5,000 meters (5 km)', value: '5k' }, { label: '10,000 meters (10 km)', value: '10k' }, { label: 'Half Marathon', value: 'half' }] },
      { id: 'currentMin', label: 'Current Best Time (Minutes)', type: 'number', defaultValue: 24 },
      { id: 'currentSec', label: 'Current Best Time (Seconds)', type: 'number', defaultValue: 30 },
      { id: 'targetMin', label: 'Target Race Time (Minutes)', type: 'number', defaultValue: 21 },
      { id: 'targetSec', label: 'Target Race Time (Seconds)', type: 'number', defaultValue: 30 }
    ],
    formula: 'Required pace change = (Current Time / Distance) - (Target Time / Distance)',
    explanation: 'Break down your goal times into seconds per kilometer or per mile target paces to guide your interval training.',
    example: 'Shaving your 5K down to 21:30 from 24:30 requires increasing your average training pace by 36 seconds per kilometer, or from 4:54/km to 4:18/km.',
    faq: [
      { question: 'How can I maintain a target race pace?', answer: 'Focus on progressive overload with structured interval training alongside regular aerobic threshold runs to build endurance at higher paces.' }
    ],
    relatedSlugs: ['running-training-calculator', 'fitness-goal-calculator'],
    keywords: ['pace cutting calculator', 'shatter personal best runs', 'split times target finder'],
    calculate: (inputs) => {
      const dist = inputs.distance || '5k';
      const cM = Number(inputs.currentMin || 24);
      const cS = Number(inputs.currentSec || 30);
      const tM = Number(inputs.targetMin || 21);
      const tS = Number(inputs.targetSec || 30);

      const currentTotalSec = (cM * 60) + cS;
      const targetTotalSec = (tM * 60) + tS;

      let distVal = 5;
      if (dist === '10k') distVal = 10;
      else if (dist === 'half') distVal = 21.1;

      const cPace = currentTotalSec / distVal;
      const tPace = targetTotalSec / distVal;
      const diffSec = Math.max(0, cPace - tPace);

      const formatPace = (secs: number) => {
        const minPart = Math.floor(secs / 60);
        const secPart = Math.floor(secs % 60);
        return `${minPart}:${secPart.toString().padStart(2, '0')} /km`;
      };

      return {
        results: [
          { label: 'Required Pace Progress', value: formatPace(tPace), isPrimary: true },
          { label: 'Time To Shave Off Per km', value: `${diffSec.toFixed(1)} Seconds / km` },
          { label: 'Current Training Pace', value: formatPace(cPace) },
          { label: 'Absolute race time improvement', value: `${Math.floor((currentTotalSec - targetTotalSec) / 60)}m ${(currentTotalSec - targetTotalSec) % 60}s` }
        ],
        chartData: [
          { name: 'Planned Target Pace (sec)', value: Math.round(tPace) },
          { name: 'Current baseline Pace (sec)', value: Math.round(cPace) }
        ]
      };
    }
  }
];
