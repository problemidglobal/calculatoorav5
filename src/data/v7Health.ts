import { Calculator } from '../types';

export const V7_HEALTH_CALCULATORS: Calculator[] = [
  {
    id: 'bmi-calculator',
    name: 'Body Mass Index (BMI) Calculator',
    slug: 'bmi-calculator',
    category: 'health',
    description: 'Calculate your Body Mass Index (BMI) and find your weight classification.',
    seoTitle: 'Body Mass Index (BMI) Calculator | Calculatoora',
    seoDescription: 'Find your BMI and weight classification by entering your height and weight.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 70, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, step: 1, unit: 'cm' }
    ],
    formula: 'BMI = Weight (kg) / (Height (m))^2',
    explanation: 'Uses weight and height to classify body weight into categories like underweight, normal weight, overweight, and obese.',
    example: 'A person weighting 70 kg at 175 cm tall has a BMI of 22.86 (normal weight).',
    faq: [{ question: 'What is a normal BMI range?', answer: 'A normal BMI range is between 18.5 and 24.9.' }],
    relatedSlugs: ['bmr-calculator', 'body-fat-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 0;
      const h = (Number(inputs.height) || 1) / 100;

      const bmi = h > 0 ? w / (h * h) : 0;
      let status = 'Normal Weight';
      let color = '#10b981';

      if (bmi < 18.5) {
        status = 'Underweight';
        color = '#3b82f6';
      } else if (bmi >= 25 && bmi < 29.9) {
        status = 'Overweight';
        color = '#f59e0b';
      } else if (bmi >= 30) {
        status = 'Obese';
        color = '#ef4444';
      }

      return {
        results: [
          { label: 'Body Mass Index (BMI)', value: bmi.toFixed(2), unit: 'kg/m²', isPrimary: true },
          { label: 'Classification Status', value: status }
        ],
        chartData: [
          { name: 'Your BMI Score', value: bmi, color: color },
          { name: 'Healthy Ceiling', value: 24.9, color: '#e5e7eb' }
        ]
      };
    }
  },
  {
    id: 'bmr-calculator',
    name: 'Basal Metabolic Rate (BMR) Calculator',
    slug: 'bmr-calculator',
    category: 'health',
    description: 'Calculate your Basal Metabolic Rate (BMR) using Mifflin-St Jeor formula.',
    seoTitle: 'BMR (Basal Metabolic Rate) Calculator | Calculatoora',
    seoDescription: 'Find your BMR to determine the baseline calories your body needs at rest.',
    inputs: [
      { id: 'gender', label: 'Gender Identity', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ] },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 75, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 180, step: 1, unit: 'cm' },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 28, step: 1, unit: 'yrs' }
    ],
    formula: 'Male: BMR = 10 * weight + 6.25 * height - 5 * age + 5\nFemale: BMR = 10 * weight + 6.25 * height - 5 * age - 161',
    explanation: 'BMR represents the number of calories your body needs to perform basic life-sustaining functions at rest.',
    example: 'A 28-year-old male weighting 75 kg at 180 cm tall has a resting BMR of 1,710.00 calories.',
    faq: [{ question: 'How is BMR different from TDEE?', answer: 'BMR is the rate of energy expenditure at complete rest, while TDEE includes daily physical activity.' }],
    relatedSlugs: ['tdee-calculator', 'bmi-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const w = Number(inputs.weight) || 0;
      const h = Number(inputs.height) || 0;
      const a = Number(inputs.age) || 0;

      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr = g === 'male' ? bmr + 5 : bmr - 161;

      return {
        results: [
          { label: 'Basal Metabolic Rate (BMR)', value: Math.round(bmr), unit: 'kcal/day', isPrimary: true },
          { label: 'Annual Resting Energy Requirement', value: Math.round(bmr * 365).toLocaleString(), unit: 'kcal' }
        ]
      };
    }
  },
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    slug: 'body-fat-calculator',
    category: 'health',
    description: 'Estimate your body fat percentage using US Navy circumference measurements.',
    seoTitle: 'US Navy Body Fat Percentage Calculator | Calculatoora',
    seoDescription: 'Estimate your body fat percentage using quick neck, waist, and hip circumference measurements.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ] },
      { id: 'neck', label: 'Neck Circumference', type: 'number', defaultValue: 38, step: 0.5, unit: 'cm' },
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 88, step: 0.5, unit: 'cm' },
      { id: 'hips', label: 'Hips Circumference (Females)', type: 'number', defaultValue: 95, step: 0.5, unit: 'cm' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, step: 1, unit: 'cm' }
    ],
    formula: 'M: 86.01*log10(waist - neck) - 70.041*log10(height) + 36.76\nF: 161.278*log10(waist + hips - neck) - 97.43*log10(height) - 78.387',
    explanation: 'Uses waist, neck, and height (and hips for females) to estimate body fat percentage based on US Navy standards.',
    example: 'A male with a 38 neck, 88 waist, and 175 height has an estimated body fat of 17.55%.',
    faq: [{ question: 'How accurate is the US Navy body fat formula?', answer: 'It is a highly accessible estimation method, typically accurate to within 3% to 4% of dual-energy X-ray absorptiometry (DEXA) scans.' }],
    relatedSlugs: ['lean-body-mass-calculator', 'bmi-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const neck = Number(inputs.neck) || 1;
      const waist = Number(inputs.waist) || 1;
      const hips = Number(inputs.hips) || 1;
      const ht = Number(inputs.height) || 1;

      let pct = 0;
      if (g === 'male') {
        pct = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(ht) + 36.76;
      } else {
        pct = 161.278 * Math.log10(waist + hips - neck) - 97.43 * Math.log10(ht) - 78.387;
      }

      pct = Math.max(2, Math.min(60, pct));
      return {
        results: [
          { label: 'Estimated Body Fat', value: pct.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Estimated Lean Bio Mass', value: (100 - pct).toFixed(1), unit: '%' }
        ],
        chartData: [
          { name: 'Adipose Body Fat', value: pct, color: '#f59e0b' },
          { name: 'Lean Muscle & Skeletal Mass', value: 100 - pct, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'tdee-calculator',
    name: 'Total Daily Energy Expenditure (TDEE) Calculator',
    slug: 'tdee-calculator',
    category: 'health',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) based on your activity level.',
    seoTitle: 'TDEE (Daily Energy Expenditure) Calculator | Calculatoora',
    seoDescription: 'Find your TDEE to determine how many calories you burn daily based on your metabolic baseline and activity.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ] },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 75, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 180, step: 1, unit: 'cm' },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 28, step: 1, unit: 'yrs' },
      { id: 'activity', label: 'Physical Activity level', type: 'select', defaultValue: '1.375', options: [
        { label: 'Sedentary (Office job)', value: '1.2' },
        { label: 'Light Exercise (1-2 days/wk)', value: '1.375' },
        { label: 'Moderate Exercise (3-5 days/wk)', value: '1.55' },
        { label: 'Heavy Exercise (6-7 days/wk)', value: '1.725' },
        { label: 'Athlete (Double daily workouts)', value: '1.9' }
      ] }
    ],
    formula: 'TDEE = BMR * Physical Activity Multiplier',
    explanation: 'Combines your daily physical activity level with your metabolic baseline to find your total daily calorie requirements.',
    example: 'A BMR of 1,710 kcal with light exercise (1.375 multiplier) results in a TDEE of 2,351 kcal/day.',
    faq: [{ question: 'How do I use my TDEE for weight loss?', answer: 'To lose weight, eat 300 to 500 calories below your TDEE daily. To gain weight, eat surplus calories.' }],
    relatedSlugs: ['bmr-calculator', 'calorie-deficit-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const w = Number(inputs.weight) || 0;
      const h = Number(inputs.height) || 0;
      const a = Number(inputs.age) || 0;
      const mult = Number(inputs.activity) || 1.2;

      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr = g === 'male' ? bmr + 5 : bmr - 161;
      const tdee = bmr * mult;

      return {
        results: [
          { label: 'Daily TDEE Maintenance', value: Math.round(tdee), unit: 'kcal/day', isPrimary: true },
          { label: 'Estimated Weekly Energy Burn', value: Math.round(tdee * 7).toLocaleString(), unit: 'kcal' }
        ]
      };
    }
  },
  {
    id: 'macro-split-calculator',
    name: 'Macro Split Calculator',
    slug: 'macro-split-calculator',
    category: 'health',
    description: 'Calculate daily targets for macronutrients—protein, carbs, and fats—based on your calorie goals.',
    seoTitle: 'Macronutrient Split Planner | Calculatoora',
    seoDescription: 'Find your target daily macronutrients (protein, carbs, fats) based on your weight goals.',
    inputs: [
      { id: 'calories', label: 'Daily Target Calories', type: 'number', defaultValue: 2000, step: 50, unit: 'kcal' },
      { id: 'strategy', label: 'Nutritional Ratio strategy', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Balanced (30% P / 40% C / 30% F)', value: 'balanced' },
        { label: 'Low Carb (40% P / 20% C / 40% F)', value: 'lowcarb' },
        { label: 'High Protein (45% P / 35% C / 20% F)', value: 'highprotein' }
      ] }
    ],
    formula: 'Protein = 4 kcal/g, Carbs = 4 kcal/g, Fats = 9 kcal/g',
    explanation: 'Converts target calories into daily macronutrient weight (g) targets based on your nutrition strategy.',
    example: 'For a 2,000 calorie diet on a balanced split: aim for 150g protein, 200g carbs, and 67g fats daily.',
    faq: [{ question: 'Which macro split is best for muscle growth?', answer: 'A high-protein strategy (around 1.6 to 2.2g of protein per kg of body weight) supports effective muscle recovery and growth.' }],
    relatedSlugs: ['tdee-calculator', 'calorie-deficit-calculator'],
    calculate: (inputs) => {
      const kcal = Number(inputs.calories) || 2000;
      const strategy = inputs.strategy || 'moderate';

      let pPct = 0.3, cPct = 0.4, fPct = 0.3;
      if (strategy === 'lowcarb') {
        pPct = 0.4; cPct = 0.2; fPct = 0.4;
      } else if (strategy === 'highprotein') {
        pPct = 0.45; cPct = 0.35; fPct = 0.2;
      }

      const pg = (kcal * pPct) / 4;
      const cg = (kcal * cPct) / 4;
      const fg = (kcal * fPct) / 9;

      return {
        results: [
          { label: 'Daily Protein Target', value: Math.round(pg), unit: 'grams', isPrimary: true },
          { label: 'Daily Carbohydrates Limit', value: Math.round(cg), unit: 'grams' },
          { label: 'Daily Fats Target', value: Math.round(fg), unit: 'grams' }
        ],
        chartData: [
          { name: 'Protein (kcal)', value: kcal * pPct, color: '#3b82f6' },
          { name: 'Carbs (kcal)', value: kcal * cPct, color: '#f59e0b' },
          { name: 'Fats (kcal)', value: kcal * fPct, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'heart-rate-calculator',
    name: 'Heart Rate Calculator',
    slug: 'heart-rate-calculator',
    category: 'health',
    description: 'Calculate target exercise heart rate zones based on age and resting pulse.',
    seoTitle: 'Target Heart Rate Zone Calculator | Calculatoora',
    seoDescription: 'Calculate your target cardio and fat-burn heart rate zones.',
    inputs: [
      { id: 'age', label: 'Your Age', type: 'number', defaultValue: 30, step: 1, unit: 'yrs' },
      { id: 'restHr', label: 'Resting pulse (Pulse bpm)', type: 'number', defaultValue: 65, step: 1, unit: 'bpm' }
    ],
    formula: 'Max HR = 220 - Age\nReserve HR = Max HR - Resting HR\nTarget = (Reserve * %intensity) + Resting HR',
    explanation: 'Uses the Karvonen formula to calculate personalized target heart rate training zones.',
    example: 'For a 30-year-old with a 65 bpm resting pulse, the aerobic training zone (70% intensity) is 152 bpm.',
    faq: [{ question: 'What is a normal resting heart rate?', answer: 'For most healthy adults, resting heart rates range from 60 to 100 bpm.' }],
    relatedSlugs: ['max-hr-calculator', 'calorie-burn-rate-calculator'],
    calculate: (inputs) => {
      const age = Number(inputs.age) || 30;
      const rhr = Number(inputs.restHr) || 65;

      const mhr = 220 - age;
      const hrr = mhr - rhr;

      const fatBurn = (hrr * 0.6) + rhr;
      const aerobic = (hrr * 0.75) + rhr;

      return {
        results: [
          { label: 'Estimated Max Heart Rate', value: mhr, unit: 'bpm', isPrimary: true },
          { label: 'Fat Burning Zone (60% HR)', value: Math.round(fatBurn), unit: 'bpm' },
          { label: 'Aerobic Training Zone (75% HR)', value: Math.round(aerobic), unit: 'bpm' }
        ]
      };
    }
  },
  {
    id: 'calorie-burn-rate-calculator',
    name: 'Calorie Burn Rate Calculator',
    slug: 'calorie-burn-rate-calculator',
    category: 'health',
    description: 'Estimate calories burned during physical activities using MET logs.',
    seoTitle: 'Calorie Burn Exercise Planner | Calculatoora',
    seoDescription: 'Estimate calories burned during physical activities by entering MET (Metabolic Equivalent) logs.',
    inputs: [
      { id: 'weight', label: 'Body Weight', type: 'number', defaultValue: 75, step: 1, unit: 'kg' },
      { id: 'duration', label: 'Activity Duration', type: 'number', defaultValue: 45, step: 5, unit: 'mins' },
      { id: 'met', label: 'Physical Effort level', type: 'select', defaultValue: '8.0', options: [
        { label: 'Walking (Casual MET 3.0)', value: '3.0' },
        { label: 'Yoga / Pilates (MET 3.5)', value: '3.5' },
        { label: 'Cycling (Standard MET 6.0)', value: '6.0' },
        { label: 'Jogging (8 km/h MET 8.0)', value: '8.0' },
        { label: 'Heavy Swimming (MET 10.0)', value: '10.0' }
      ] }
    ],
    formula: 'Calories Burned = Duration (mins) * (MET * 3.5 * Weight (kg) / 200)',
    explanation: 'Uses Metabolic Equivalents (METs) to estimate overall energy expenditure during various activities.',
    example: 'A 75 kg person jogging (MET 8.0) for 45 minutes burns approximately 472 calories.',
    faq: [{ question: 'What does a MET score indicate?', answer: 'One MET represents the rate of energy expenditure at rest (approximately 1 calorie per kg or body weight per hour).' }],
    relatedSlugs: ['tdee-calculator', 'running-pace-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 70;
      const t = Number(inputs.duration) || 30;
      const met = Number(inputs.met) || 4.0;

      const burned = t * ((met * 3.5 * w) / 200);
      return {
        results: [
          { label: 'Estimated Calories Burned', value: Math.round(burned), unit: 'kcal', isPrimary: true },
          { label: 'Estimated Net Workout Burn Rate', value: (burned / t).toFixed(1), unit: 'kcal/min' }
        ]
      };
    }
  },
  {
    id: 'max-hr-calculator',
    name: 'Max Heart Rate Calculator',
    slug: 'max-hr-calculator',
    category: 'health',
    description: 'Compare formulas to estimate your maximum heart rate.',
    seoTitle: 'Max Heart Rate Formulas solver | Calculatoora',
    seoDescription: 'Find your maximum heart rate using the Fox, Tanaka, and Gellish formulas.',
    inputs: [
      { id: 'age', label: 'Self Age', type: 'number', defaultValue: 35, step: 1, unit: 'yrs' }
    ],
    formula: 'Fox: 220 - Age\nTanaka: 208 - (0.7 * Age)',
    explanation: 'Compares various scientific formulas to estimate maximum safe heart rate during exercise.',
    example: 'For a 35-year-old, the Tanaka formula estimates a max heart rate of 184 bpm.',
    faq: [{ question: 'What is the most accurate formula?', answer: 'The Tanaka formula is modern and generally considered more accurate for active older adults.' }],
    relatedSlugs: ['heart-rate-calculator', 'calorie-burn-rate-calculator'],
    calculate: (inputs) => {
      const age = Number(inputs.age) || 35;

      const fox = 220 - age;
      const tanaka = 208 - (0.7 * age);
      const gellish = 207 - (0.7 * age);

      return {
        results: [
          { label: 'Fox Formula Standard (MHR)', value: fox, unit: 'bpm', isPrimary: true },
          { label: 'Tanaka Modern Formula', value: Math.round(tanaka), unit: 'bpm' },
          { label: 'Gellish Formula Estimation', value: Math.round(gellish), unit: 'bpm' }
        ]
      };
    }
  },
  {
    id: 'hydration-calculator',
    name: 'Hydration Calculator',
    slug: 'hydration-calculator',
    category: 'health',
    description: 'Calculate daily target water intake based on weight and activity level.',
    seoTitle: 'Daily Water Intake Planner | Calculatoora',
    seoDescription: 'Determine your recommended daily hydration targets based on body weight and activity.',
    inputs: [
      { id: 'weight', label: 'Body Weight', type: 'number', defaultValue: 70, step: 1, unit: 'kg' },
      { id: 'exerciseMinutes', label: 'Daily Workout Duration', type: 'number', defaultValue: 60, step: 10, unit: 'mins' }
    ],
    formula: 'Baseline Intake = Weight (kg) * 35 ml\nExercise Addition = 10 ml per Minute of exercise',
    explanation: 'Calculates baseline water needs plus additional fluid requirements based on exercise intensity and duration.',
    example: 'A 70 kg person exercising for 60 minutes requires a daily water intake of approximately 3.05 liters.',
    faq: [{ question: 'Does coffee or tea count toward hydration?', answer: 'Yes! Modestly caffeinated beverages contribute to your daily hydration goals.' }],
    relatedSlugs: ['calorie-burn-rate-calculator', 'tdee-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 70;
      const ex = Number(inputs.exerciseMinutes) || 0;

      const baseMl = w * 35;
      const addedMl = ex * 10;
      const totalLiters = (baseMl + addedMl) / 1000;

      return {
        results: [
          { label: 'Recommended Daily Water Intake', value: totalLiters.toFixed(2), unit: 'Liters', isPrimary: true },
          { label: 'Intake in standard glasses', value: Math.ceil(totalLiters / 0.25), unit: 'Glasses (250ml)' }
        ]
      };
    }
  },
  {
    id: 'running-pace-calculator',
    name: 'Running Pace Calculator',
    slug: 'running-pace-calculator',
    category: 'health',
    description: 'Calculate required running pace from target distances and times.',
    seoTitle: 'Running Pace & Speed Planner | Calculatoora',
    seoDescription: 'Calculate the running pace (min/km) needed to achieve your target distances and times.',
    inputs: [
      { id: 'distance', label: 'Desired Distance', type: 'number', defaultValue: 10, step: 0.5, unit: 'km' },
      { id: 'hours', label: 'Target Hours', type: 'number', defaultValue: 0, step: 1, unit: 'hrs' },
      { id: 'minutes', label: 'Target Minutes', type: 'number', defaultValue: 52, step: 1, unit: 'mins' }
    ],
    formula: 'Pace = Total time (Minutes) / Distance (km)',
    explanation: 'Converts target hours, minutes, and distance into a consistent running pace.',
    example: 'Running a 10k in 52 minutes requires a consistent pace of 5:12 per kilometer.',
    faq: [{ question: 'What is a typical beginner 5k pace?', answer: 'Most beginner runners complete a 5k with an average pace of 6:00 to 7:00 per kilometer.' }],
    relatedSlugs: ['calorie-burn-rate-calculator', 'one-rep-max-calculator'],
    calculate: (inputs) => {
      const d = Number(inputs.distance) || 1;
      const h = Number(inputs.hours) || 0;
      const m = Number(inputs.minutes) || 0;

      const totalMins = (h * 60) + m;
      const floatPace = totalMins / d;

      const paceMins = Math.floor(floatPace);
      const paceSecs = Math.round((floatPace - paceMins) * 60);
      const formattedSecs = paceSecs < 10 ? '0' + paceSecs : paceSecs;

      return {
        results: [
          { label: 'Required Target Pace', value: `${paceMins}:${formattedSecs}`, unit: 'min/km', isPrimary: true },
          { label: 'Average running Speed', value: (60 / floatPace).toFixed(2), unit: 'km/h' }
        ]
      };
    }
  },
  {
    id: 'body-density-calculator',
    name: 'Body Density Calculator',
    slug: 'body-density-calculator',
    category: 'health',
    description: 'Calculate body density using Jackson-Pollock skinfold measurements.',
    seoTitle: 'Body Density Jackson-Pollock Solver | Calculatoora',
    seoDescription: 'Calculate body density based on standard Jackson-Pollock sports skinfold caliper measurements.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ] },
      { id: 'sumSkinfolds', label: 'Sum of 3 Skinfolds (Triceps, Chest, Thigh)', type: 'number', defaultValue: 45, step: 1, unit: 'mm' },
      { id: 'age', label: 'Age', type: 'number', defaultValue: 28, step: 1, unit: 'yrs' }
    ],
    formula: 'Jackson-Pollock gender custom quadratic equations.',
    explanation: 'Estimates physical body density based on standard skinfold caliper equations.',
    example: 'A 28-year-old male with a skinfold sum of 45mm has an estimated body density of 1.062 g/ml.',
    faq: [{ question: 'How is body density converted to body fat?', answer: 'The Siri or Schutte formulas are commonly used to convert body density into body fat percentage.' }],
    relatedSlugs: ['body-fat-calculator', 'lean-body-mass-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const sum = Number(inputs.sumSkinfolds) || 45;
      const age = Number(inputs.age) || 28;

      let density = 1.0;
      if (g === 'male') {
        density = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * age);
      } else {
        density = 1.0994921 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * age);
      }

      return {
        results: [
          { label: 'Estimated Body Density', value: density.toFixed(6), unit: 'g/ml', isPrimary: true },
          { label: 'Jackson-Pollock Baseline', value: '3-Site Standard' }
        ]
      };
    }
  },
  {
    id: 'lean-body-mass-calculator',
    name: 'Lean Body Mass Calculator',
    slug: 'lean-body-mass-calculator',
    category: 'health',
    description: 'Calculate your Lean Body Mass (LBM) using Boer or James formulas.',
    seoTitle: 'Lean Body Mass (LBM) Calculator | Calculatoora',
    seoDescription: 'Calculate your LBM to determine how much of your body weight consists of lean mass.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ] },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 80, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 180, step: 1, unit: 'cm' }
    ],
    formula: 'Boer: M = 0.407 * Weight + 0.267 * Height - 19.2\nF = 0.252 * Weight + 0.473 * Height - 48.3',
    explanation: 'LBM measures your total body weight minus your body fat weight, representing muscle, organs, and bones.',
    example: 'An 180 cm tall male weighting 80 kg has an estimated lean body mass of 61.42 kg.',
    faq: [{ question: 'Why is LBM important for athletes?', answer: 'Understanding LBM helps athletes track pure muscle changes and accurately plan daily protein requirements.' }],
    relatedSlugs: ['body-fat-calculator', 'body-density-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const w = Number(inputs.weight) || 0;
      const h = Number(inputs.height) || 0;

      let lbm = 0;
      if (g === 'male') {
        lbm = (0.407 * w) + (0.267 * h) - 19.2;
      } else {
        lbm = (0.252 * w) + (0.473 * h) - 48.3;
      }

      lbm = Math.max(10, Math.min(w, lbm));
      return {
        results: [
          { label: 'Lean Body Mass (LBM)', value: lbm.toFixed(2), unit: 'kg', isPrimary: true },
          { label: 'Total Body Fat weight', value: (w - lbm).toFixed(2), unit: 'kg' }
        ]
      };
    }
  },
  {
    id: 'calorie-deficit-calculator',
    name: 'Calorie Deficit Calculator',
    slug: 'calorie-deficit-calculator',
    category: 'health',
    description: 'Determine your target calorie deficit to hit weight loss goals.',
    seoTitle: 'Daily Calorie Deficit Estimator | Calculatoora',
    seoDescription: 'Find your target daily deficit and estimated weight loss timeline.',
    inputs: [
      { id: 'tdee', label: 'Estimated daily TDEE Maintenance', type: 'number', defaultValue: 2500, step: 50, unit: 'kcal' },
      { id: 'targetLoss', label: 'Desired Weight Loss Rate', type: 'select', defaultValue: '0.5', options: [
        { label: 'Gentle (0.25 kg / wk)', value: '0.25' },
        { label: 'Moderate (0.5 kg / wk)', value: '0.5' },
        { label: 'Aggressive (1.0 kg / wk)', value: '1.0' }
      ] }
    ],
    formula: 'Daily Calorie Deficit = Target Weekly Loss (kg) * 1100 kcal',
    explanation: 'Estimates daily calorie deficits and targets to achieve steady, sustainable weight loss.',
    example: 'To lose 0.5 kg per week with a TDEE of 2,500 kcal, eat at a 500 calorie deficit (2,000 kcal/day).',
    faq: [{ question: 'What is a safe limit for a calorie deficit?', answer: 'For sustainable weight loss, it is generally recommended to keep your deficit within 300 to 500 calories.' }],
    relatedSlugs: ['tdee-calculator', 'weight-loss-velocity-calculator'],
    calculate: (inputs) => {
      const tdee = Number(inputs.tdee) || 2000;
      const rate = Number(inputs.targetLoss) || 0.5;

      const deficit = rate * 1100;
      const targetIntake = Math.max(1200, tdee - deficit);

      return {
        results: [
          { label: 'Daily Target Calorie Intake', value: Math.round(targetIntake), unit: 'kcal/day', isPrimary: true },
          { label: 'Recommended Calorie Deficit', value: Math.round(tdee - targetIntake), unit: 'kcal' }
        ]
      };
    }
  },
  {
    id: 'weight-loss-velocity-calculator',
    name: 'Weight Loss Velocity Calculator',
    slug: 'weight-loss-velocity-calculator',
    category: 'health',
    description: 'Calculate weight loss speed over your custom diet horizon.',
    seoTitle: 'Diet Velocity Timeline Solver | Calculatoora',
    seoDescription: 'Determine your long-term weight loss trajectory based on daily calorie deficit setups.',
    inputs: [
      { id: 'startWeight', label: 'Current Weight', type: 'number', defaultValue: 85, step: 1, unit: 'kg' },
      { id: 'dailyDeficit', label: 'Target Calorie Deficit', type: 'number', defaultValue: 500, step: 50, unit: 'kcal' },
      { id: 'weeksLimit', label: 'Timeline Duration (Weeks)', type: 'number', defaultValue: 12, step: 1, unit: 'wks' }
    ],
    formula: 'Weight Loss = (Daily Deficit * 7 * Weeks) / 7700',
    explanation: 'Uses baseline thermodynamics to project weight loss based on cumulative calorie deficits.',
    example: 'Eating at a 500 calorie deficit daily for 12 weeks yields an estimated weight loss of 5.45 kg.',
    faq: [{ question: 'Does metabolism slow down during dieting?', answer: 'Yes, your resting metabolic rate (BMR) naturally drops slightly as you lose weight, a process known as adaptive thermogenesis.' }],
    relatedSlugs: ['calorie-deficit-calculator', 'tdee-calculator'],
    calculate: (inputs) => {
      const start = Number(inputs.startWeight) || 80;
      const def = Number(inputs.dailyDeficit) || 500;
      const wks = Number(inputs.weeksLimit) || 12;

      const totalLoss = (def * 7 * wks) / 7700;
      const endWeight = start - totalLoss;

      return {
        results: [
          { label: 'Projected Weight Loss', value: totalLoss.toFixed(2), unit: 'kg', isPrimary: true },
          { label: 'Estimated End Weight', value: endWeight.toFixed(2), unit: 'kg' }
        ]
      };
    }
  },
  {
    id: 'one-rep-max-calculator',
    name: 'One Rep Max (1RM) Calculator',
    slug: 'one-rep-max-calculator',
    category: 'health',
    description: 'Estimate your lifting One Rep Max (1RM) using Epley and Brzycki lifting equations.',
    seoTitle: 'Lifting One Rep Max (1RM) Calculator | Calculatoora',
    seoDescription: 'Estimate your lifting one rep max (1RM) based on sub-maximal repetitions.',
    inputs: [
      { id: 'weight', label: 'Weight Lifted', type: 'number', defaultValue: 80, step: 2.5, unit: 'kg' },
      { id: 'reps', label: 'Completed Repetitions', type: 'number', defaultValue: 8, min: 1, max: 20, step: 1, unit: 'reps' }
    ],
    formula: 'Epley: 1RM = Weight * (1 + Reps/30)\nBrzycki: 1RM = Weight / (1.0278 - 0.0278 * Reps)',
    explanation: 'Estimates your maximum lifting capacity based on sub-maximal weight and repetition metrics.',
    example: 'Benching 80 kg for 8 reps estimates a One Rep Max (1RM) of approximately 101 kg.',
    faq: [{ question: 'Are submaximal estimations safe?', answer: 'Yes, estimating your max using higher reps is significantly safer than testing true 1RMs to failure.' }],
    relatedSlugs: ['running-pace-calculator', 'calorie-burn-rate-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 0;
      const r = Number(inputs.reps) || 1;

      const epley = w * (1 + r / 30);
      const brzycki = w / (1.0278 - (0.0278 * r));

      return {
        results: [
          { label: 'Epley 1RM Estimate', value: Math.round(epley), unit: 'kg', isPrimary: true },
          { label: 'Brzycki 1RM Estimate', value: Math.round(brzycki), unit: 'kg' },
          { label: '85% Training Weight (Target 5-rep weight)', value: Math.round(epley * 0.85), unit: 'kg' }
        ]
      };
    }
  }
];
