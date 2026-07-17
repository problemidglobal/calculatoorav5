import { Calculator } from '../types';

export const HEALTH_CALCULATORS: Calculator[] = [
  {
    id: 'bmi-advanced-calculator',
    name: 'BMI Advanced Calculator',
    slug: 'bmi-advanced-calculator',
    category: 'health',
    description: 'Calculate your Body Mass Index (BMI) using metric or imperial units, categorizing overall weight based on WHO clinical lines.',
    seoTitle: 'Advanced BMI & Weight Health Calculator | Calculatoora',
    seoDescription: 'Accurately determine your Body Mass Index (BMI). Get personalized health category feedback (Underweight, Normal, Overweight, Obese) based on WHO guidelines.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 75, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height', type: 'number', defaultValue: 175, step: 1, unit: 'cm' },
      { id: 'system', label: 'Unit System', type: 'select', defaultValue: 'metric', options: [
        { label: 'Metric (kg / cm)', value: 'metric' },
        { label: 'Imperial (lbs / inches)', value: 'imperial' }
      ]}
    ],
    formula: 'Metric: BMI = weight_kg / (height_m^2)\nImperial: BMI = (weight_lbs / height_inches^2) * 703',
    explanation: 'Body Mass Index is a universal screening metric used by physicians to quickly bucket adult weight categories relative to frame size.',
    example: 'An individual weighing 75kg at 175cm has a BMI of 24.49, falling comfortably into the healthy, recommended Weight bracket.',
    faq: [
      { question: 'What are the WHO BMI boundaries?', answer: 'Underweight represents < 18.5, Normal weight is 18.5 - 24.9, Overweight is 25.0 - 29.9, and Obese is defined as 30.0 or higher.' },
      { question: 'Does BMI measure raw body fat?', answer: 'No, BMI calculates height-to-weight ratios. It cannot distinguish high muscle density from fatty tissue caches. Athletes or bodybuilders often calculate as overweight on BMI scales.' }
    ],
    relatedSlugs: ['ideal-weight-calculator', 'body-fat-calculator', 'bmr-advanced-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 0;
      const h = Number(inputs.height) || 1;
      const sys = inputs.system || 'metric';

      let bmi = 0;
      if (sys === 'metric') {
        const heightM = h / 100;
        bmi = w / (heightM * heightM);
      } else {
        bmi = (w / (h * h)) * 703;
      }

      let categoryStr = 'Normal Weight';
      let healthAdvice = 'Secure lifestyle. Keep active!';
      let categoryColor = '#39FF14';

      if (bmi < 18.5) {
        categoryStr = 'Underweight';
        healthAdvice = 'Consider nutritional consulting to build lean mass.';
        categoryColor = '#3b82f6';
      } else if (bmi >= 25 && bmi < 30) {
        categoryStr = 'Overweight';
        healthAdvice = 'Engage in caloric optimization and steady cardiovascular training.';
        categoryColor = '#f59e0b';
      } else if (bmi >= 30) {
        categoryStr = 'Obese';
        healthAdvice = 'Medical consulting advised to prevent cardiovascular complications.';
        categoryColor = '#ef4444';
      }

      return {
        results: [
          { label: 'Calculated BMI Value', value: bmi.toFixed(2), unit: 'kg/m²', isPrimary: true },
          { label: 'WHO Health Status Category', value: categoryStr, unit: 'status' },
          { label: 'Clinical Lifestyle Guidance', value: healthAdvice, unit: 'info' }
        ],
        chartData: [
          { name: 'Your BMI Score', value: Math.round(bmi), color: categoryColor },
          { name: 'Target healthy Threshold', value: 22, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    slug: 'ideal-weight-calculator',
    category: 'health',
    description: 'Calculate your healthy ideal weight target ranges using Miller, Robinson, and Devine sports science formulas.',
    seoTitle: 'Ideal Body Weight (IBW) Calculator | Calculatoora',
    seoDescription: 'Obtain medical estimations of ideal weight targets for men and women based on height matrices.',
    inputs: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'height', label: 'Your Height', type: 'number', defaultValue: 178, step: 1, unit: 'cm' }
    ],
    formula: 'Devine Male: 50.0 + 2.3 * (Height_in - 60)\nDevine Female: 45.5 + 2.3 * (Height_in - 60)',
    explanation: 'Ideal Body Weight (IBW) formulas offer physicians reliable targets to prescribe medication doses and target fitness guidelines.',
    example: 'A 178cm (70 inches) male has an estimated Devine Ideal Weight of 73.00 kg.',
    faq: [
      { question: 'Why does gender alter ideal weight estimations?', answer: 'Due to biological variance, male frames typically carry higher muscle and bone density weights compared to female frames.' }
    ],
    relatedSlugs: ['bmi-advanced-calculator', 'body-fat-calculator', 'tdee-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const hCm = Number(inputs.height) || 170;

      // Convert layout to inches
      const inches = hCm / 2.54;
      const inchesOver5Ft = Math.max(0, inches - 60);

      let ibwDevine = 0;
      let ibwRobinson = 0;

      if (g === 'male') {
        ibwDevine = 50.0 + (2.3 * inchesOver5Ft);
        ibwRobinson = 52.0 + (1.9 * inchesOver5Ft);
      } else {
        ibwDevine = 45.5 + (2.3 * inchesOver5Ft);
        ibwRobinson = 49.0 + (1.7 * inchesOver5Ft);
      }

      const meanIdeal = (ibwDevine + ibwRobinson) / 2;

      return {
        results: [
          { label: 'Estimated Ideal Weight (Devine)', value: ibwDevine.toFixed(1), unit: 'kg', isPrimary: true },
          { label: 'Estimated Ideal Weight (Robinson)', value: ibwRobinson.toFixed(1), unit: 'kg' },
          { label: 'Average Combined Target Range', value: `${(meanIdeal * 0.95).toFixed(1)} - ${(meanIdeal * 1.05).toFixed(1)}`, unit: 'kg' }
        ],
        chartData: [
          { name: 'Devine Ideal Weight', value: Math.round(ibwDevine), color: '#39FF14' },
          { name: 'Robinson Ideal Weight', value: Math.round(ibwRobinson), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'body-fat-advanced-calculator',
    name: 'Body Fat Calculator',
    slug: 'body-fat-advanced-calculator',
    category: 'health',
    description: 'Calculate estimated body fat percentages using standard waist-to-weight circumference YMCA conversion parameters.',
    seoTitle: 'Online Body Fat Circumference Calculator | Calculatoora',
    seoDescription: 'Obtain calculated fat percentages. Compare lean muscle composition relative to adipose metrics easily.',
    inputs: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Total Weight', type: 'number', defaultValue: 170, step: 1, unit: 'lbs' },
      { id: 'waist', label: 'Waist Circumference', type: 'number', defaultValue: 34, step: 0.5, unit: 'inches' }
    ],
    formula: 'YMCA Male: BF% = [ (1.634 * Waist - 0.1804 * Weight - 98.42) / (1.634 * Waist) ] * 100\nYMCA Female: BF% = [ (1.634 * Waist - 0.08272 * Weight - 76.76) / (1.634 * Waist) ] * 100',
    explanation: 'Traces body fat parameters relative to structural body dimensions. Adipose tissue is highly concentrated around abdominal organs.',
    example: 'A 170lb male with a 34-inch waist yields an estimated body fat percentage of 16.92%.',
    faq: [
      { question: 'What are healthy muscle and fat brackets?', answer: 'For men, 14-24% body fat is considered normal/healthy. For women, 21-31% represents common baseline health levels.' }
    ],
    relatedSlugs: ['bmi-advanced-calculator', 'ideal-weight-calculator', 'macro-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const w = Number(inputs.weight) || 160;
      const waist = Number(inputs.waist) || 32;

      let bf = 0;
      if (g === 'male') {
        const factor = (1.634 * waist) - (0.1804 * w) - 98.42;
        bf = Math.max(3, (factor / (1.634 * waist)) * 100);
      } else {
        const factor = (1.634 * waist) - (0.08272 * w) - 76.76;
        bf = Math.max(6, (factor / (1.634 * waist)) * 100);
      }

      const fatWeight = w * (bf / 100);
      const leanWeight = w - fatWeight;

      return {
        results: [
          { label: 'Estimated Body Fat Share', value: bf.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Adipose Fat Tissue Weight', value: fatWeight.toFixed(1), unit: 'lbs' },
          { label: 'Lean Mass Muscle Weight', value: leanWeight.toFixed(1), unit: 'lbs' }
        ],
        chartData: [
          { name: 'Lean Muscle/Bone Mass', value: Math.round(leanWeight), color: '#39FF14' },
          { name: 'Body Fat Tissue', value: Math.round(fatWeight), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'bmr-advanced-calculator',
    name: 'BMR Advanced Calculator',
    slug: 'bmr-advanced-calculator',
    category: 'health',
    description: 'Calculate your Basal Metabolic Rate (BMR) using Mifflin-St Jeor and Harris-Benedict formulas to determine baseline energy expenditure.',
    seoTitle: 'BMR Basal Metabolic Rate Calculator | Calculatoora',
    seoDescription: 'Discover your baseline daily calorie consumption at absolute rest using the Mifflin-St Jeor formula.',
    inputs: [
      { id: 'gender', label: 'Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 172, step: 1, unit: 'cm' },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 28, step: 1, unit: 'years' }
    ],
    formula: 'Mifflin Male: BMR = 10*Weight + 6.25*Height - 5*Age + 5\nMifflin Female: BMR = 10*Weight + 6.25*Height - 5*Age - 161',
    explanation: 'Basal Metabolic Rate is the daily energy (in calories) consumed by your body just to sustain involuntary vegetative functions (ventilation, circulation, cellular repair) while at complete physical rest.',
    example: 'A 28-year-old male weighing 70kg at 172cm has a Mifflin BMR of 1,605 calories per day.',
    faq: [
      { question: 'Should I eat below my BMR to lose weight?', answer: 'Eating significantly below your BMR is generally discouraged because it can trigger metabolic slow-down and muscle atrophy. Fuel metabolic rates safely! Consult a dietician.' }
    ],
    relatedSlugs: ['tdee-calculator', 'calorie-deficit-calculator', 'macro-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const w = Number(inputs.weight) || 70;
      const h = Number(inputs.height) || 170;
      const age = Number(inputs.age) || 28;

      // Mifflin
      let bmrMifflin = 0;
      if (g === 'male') {
        bmrMifflin = (10 * w) + (6.25 * h) - (5 * age) + 5;
      } else {
        bmrMifflin = (10 * w) + (6.25 * h) - (5 * age) - 161;
      }

      // Harris-Benedict
      let bmrHB = 0;
      if (g === 'male') {
        bmrHB = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * age);
      } else {
        bmrHB = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * age);
      }

      return {
        results: [
          { label: 'BMR (Mifflin-St Jeor Standard)', value: bmrMifflin.toFixed(0), unit: 'kcal/day', isPrimary: true },
          { label: 'BMR (Revised Harris-Benedict)', value: bmrHB.toFixed(0), unit: 'kcal/day' }
        ],
        chartData: [
          { name: 'Mifflin BMR Calories', value: Math.round(bmrMifflin), color: '#39FF14' },
          { name: 'Harris BMR Calories', value: Math.round(bmrHB), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'tdee-calculator',
    name: 'TDEE Calculator',
    slug: 'tdee-calculator',
    category: 'health',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) based on physical exercise activity levels.',
    seoTitle: 'Total Daily Energy Expenditure (TDEE) Calculator | Calculatoora',
    seoDescription: 'Obtain calculated maintenance daily calorie requirements. Map customized physical activity multipliers instantly.',
    inputs: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 75, step: 1, unit: 'kg' },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 178, step: 1, unit: 'cm' },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 25, step: 1, unit: 'years' },
      { id: 'activity', label: 'Gym/Work Activity level', type: 'select', defaultValue: '1.375', options: [
        { label: 'Sedentary (No Exercise)', value: '1.2' },
        { label: 'Light Exercise (1-2 days/wk)', value: '1.375' },
        { label: 'Moderate Exercise (3-5 days/wk)', value: '1.55' },
        { label: 'Heavy Athlete (Daily)', value: '1.725' }
      ]}
    ],
    formula: 'TDEE = Mifflin BMR * Physical Activity Multiplier',
    explanation: 'Unpacking total energy needs guides individuals on whether they need to cut, maintain, or bulb calories relative to their training loads.',
    example: 'An active male requiring 1,700 base resting BMR calories expends approximately 2,338 TDEE calories when accounting for light exercise.',
    faq: [
      { question: 'Is BMR included inside TDEE?', answer: 'Yes, BMR represents about 60-70% of your total TDEE score. The rest is comprised of daily movement, thermal food metabolization, and targeted workout activity.' }
    ],
    relatedSlugs: ['bmr-advanced-calculator', 'calorie-deficit-calculator', 'macro-calculator'],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const w = Number(inputs.weight) || 75;
      const h = Number(inputs.height) || 178;
      const age = Number(inputs.age) || 25;
      const mult = Number(inputs.activity) || 1.375;

      let bmr = 0;
      if (g === 'male') {
        bmr = (10 * w) + (6.25 * h) - (5 * age) + 5;
      } else {
        bmr = (10 * w) + (6.25 * h) - (5 * age) - 161;
      }

      const tdee = bmr * mult;

      return {
        results: [
          { label: 'Your Daily TDEE Calories', value: tdee.toFixed(0), unit: 'kcal/day', isPrimary: true },
          { label: 'Basal Resting BMR Portion', value: bmr.toFixed(0), unit: 'kcal/day' },
          { label: 'Energy Burn From Physical Movement', value: (tdee - bmr).toFixed(0), unit: 'kcal/day' }
        ],
        chartData: [
          { name: 'Basal Rest BMR', value: Math.round(bmr), color: '#312e81' },
          { name: 'Active Energy Expended', value: Math.round(tdee - bmr), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'calorie-deficit-calculator',
    name: 'Calorie Deficit Calculator',
    slug: 'calorie-deficit-calculator',
    category: 'health',
    description: 'Establish safe target daily calorie thresholds to stimulate steady body weight reductions.',
    seoTitle: 'Daily Calorie Deficit Weight Loss Calculator | Calculatoora',
    seoDescription: 'Generate target diet calorie bounds to reach weight goals. Calculate predicted weekly fat loss.',
    inputs: [
      { id: 'tdee', label: 'Total Daily Energy Expenditures (TDEE)', type: 'number', defaultValue: 2400, step: 50, unit: 'kcal' },
      { id: 'deficit', label: 'Desired Caloric Deficit Target', type: 'select', defaultValue: '500', options: [
        { label: 'Mild Cut (250 kcal/day)', value: '250' },
        { label: 'Standard Cut (500 kcal/day)', value: '500' },
        { label: 'Aggressive Cut (750 kcal/day)', value: '750' }
      ]}
    ],
    formula: 'Target Diet Calories = TDEE - Deficit\nEst. Weekly Fat Loss = (Deficit * 7) / 3500 lbs',
    explanation: 'A caloric deficit forces the human frame to oxidize stored body fat to cover daily energy deficits.',
    example: 'Subtracting a standard 500 calorie cut from a 2,400 maintenance TDEE requires consuming 1,900 diet calories, generating an estimated 1 lb of fat loss weekly.',
    faq: [
      { question: 'How many calories make up a pound of body fat?', answer: 'One pound of human fat tissue contains roughly 3,500 calories of stored oxidative energy.' }
    ],
    relatedSlugs: ['tdee-calculator', 'weight-loss-calculator', 'protein-calculator'],
    calculate: (inputs) => {
      const tdee = Number(inputs.tdee) || 2000;
      const deficit = Number(inputs.deficit) || 500;

      const target = Math.max(1200, tdee - deficit);
      const weeklyLbs = (deficit * 7) / 3500;

      return {
        results: [
          { label: 'Target Daily Diet Calories', value: target.toFixed(0), unit: 'kcal/day', isPrimary: true },
          { label: 'Expected Weekly Weight Loss', value: weeklyLbs.toFixed(2), unit: 'lbs' },
          { label: 'Estimated Monthly Fat Loss Equivalent', value: (weeklyLbs * 4.3).toFixed(1), unit: 'lbs' }
        ],
        chartData: [
          { name: 'Safe Diet Intake Calories', value: target, color: '#39FF14' },
          { name: 'Eliminated Calorie Gap', value: deficit, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'weight-loss-calculator',
    name: 'Weight Loss Calculator',
    slug: 'weight-loss-calculator',
    category: 'health',
    description: 'Calculate timelines and weeks of diet required to safely transition from current weights to targets.',
    seoTitle: 'Weight Loss Deadline & Timeline Calculator | Calculatoora',
    seoDescription: 'Forecast how many weeks of calibrated deficit are needed to reach your weight target.',
    inputs: [
      { id: 'current', label: 'Current Weight', type: 'number', defaultValue: 195, step: 1, unit: 'lbs' },
      { id: 'target', label: 'Goal Target Weight', type: 'number', defaultValue: 175, step: 1, unit: 'lbs' },
      { id: 'rate', label: 'Target Weekly Loss Rate', type: 'select', defaultValue: '1.0', options: [
        { label: '0.5 lbs/week (Gentle)', value: '0.5' },
        { label: '1.0 lbs/week (Balanced)', value: '1.0' },
        { label: '1.5 lbs/week (Focused)', value: '1.5' },
        { label: '2.0 lbs/week (Intense)', value: '2.0' }
      ]}
    ],
    formula: 'Weeks Required = (Current Weight - Target Weight) / Weekly Loss Rate',
    explanation: 'Forecasting healthy pacing prevents athletes from crash-dieting, which can degrade vital muscle mass and support metabolism rebound.',
    example: 'Shaving 20 lbs at a balanced pace of 1.0 lb weekly requires exactly 20 weeks of calorie management.',
    faq: [
      { question: 'What is a medically safe loss rate?', answer: 'General medical consensus recommends losing 0.5 to 2.0 pounds (0.25 to 1.0 kg) per week to preserve muscle integrity and sustain energy levels.' }
    ],
    relatedSlugs: ['calorie-deficit-calculator', 'protein-calculator', 'water-intake-calculator'],
    calculate: (inputs) => {
      const cur = Number(inputs.current) || 180;
      const target = Number(inputs.target) || 160;
      const ratePrW = Number(inputs.rate) || 1.0;

      const gap = Math.max(0, cur - target);
      const weeks = ratePrW > 0 ? gap / ratePrW : 0;

      return {
        results: [
          { label: 'Estimated Journey Duration', value: weeks.toFixed(1), unit: 'weeks', isPrimary: true },
          { label: 'Total Weight Loss Gap', value: gap.toFixed(1), unit: 'lbs' },
          { label: 'Required Daily Caloric Deficit Equivalent', value: (ratePrW * 500).toFixed(0), unit: 'kcal/day' }
        ],
        chartData: [
          { name: 'Target Weight Goal', value: target, color: '#39FF14' },
          { name: 'Weight Excess to lose', value: gap, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'protein-calculator',
    name: 'Protein Calculator',
    slug: 'protein-calculator',
    category: 'health',
    description: 'Calculate optimal daily protein grams based on your lean mass and personal training goals.',
    seoTitle: 'Daily Protein Requirement Calculator | Calculatoora',
    seoDescription: 'Determine target daily protein intake. Tailor protein targets for muscle gain or deficit retention.',
    inputs: [
      { id: 'weight', label: 'Your Weight', type: 'number', defaultValue: 180, step: 1, unit: 'lbs' },
      { id: 'goal', label: 'Primary Fitness Goal', type: 'select', defaultValue: 'strength', options: [
        { label: 'Sedentary Wellness (0.4g/lb)', value: '0.4' },
        { label: 'Endurance Running (0.6g/lb)', value: '0.6' },
        { label: 'Strength & Muscle Gain (0.8g/lb)', value: '0.8' },
        { label: 'Intense Bodybuilding (1.0g/lb)', value: '1.0' }
      ]}
    ],
    formula: 'Protein Grams = Body Weight (lbs) * Goal Factor Multiplier',
    explanation: 'Proteins provide amino acids required to repair myofibrillar micro-tears resulting from high-intensity resistance training.',
    example: 'A 180lb lifting athlete striving to build power requires roughly 144 grams of protein daily.',
    faq: [
      { question: 'Can too much protein damage kidneys?', answer: 'For healthy individuals, higher protein levels (up to 1.2g/lb) do not impair liver or kidney function. Insufficient levels, however, will limit recovery.' }
    ],
    relatedSlugs: ['macro-calculator', 'tdee-calculator', 'calorie-deficit-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 150;
      const mult = Number(inputs.goal) || 0.8;

      const proteinG = w * mult;
      const proteinCalories = proteinG * 4;

      return {
        results: [
          { label: 'Optimal daily Protein Intake', value: proteinG.toFixed(0), unit: 'grams', isPrimary: true },
          { label: 'Energy Allocated from Protein', value: proteinCalories.toFixed(0), unit: 'kcal' }
        ],
        chartData: [
          { name: 'Target Protein Grams', value: Math.round(proteinG), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'macro-calculator',
    name: 'Macro Calculator',
    slug: 'macro-calculator',
    category: 'health',
    description: 'Calculate daily macronutrient distributions (protein, carbohydrates, and fats) matching target fitness goals.',
    seoTitle: 'Macronutrient Split Ratio Calculator | Calculatoora',
    seoDescription: 'Deconstruct complex calories targets into actionable grams of fats, carbs, and proteins.',
    inputs: [
      { id: 'calories', label: 'Daily Calorie target', type: 'number', defaultValue: 2000, step: 50, unit: 'kcal' },
      { id: 'split', label: 'Preferred Macro Diet Split', type: 'select', defaultValue: 'balanced', options: [
        { label: 'Balanced (40% Carb / 30% Protein / 30% Fat)', value: 'balanced' },
        { label: 'Low Carb Athletic (20% Carb / 40% Protein / 40% Fat)', value: 'lowcarb' },
        { label: 'High Carb Endurance (60% Carb / 20% Protein / 20% Fat)', value: 'highcarb' }
      ]}
    ],
    formula: 'Carb: 4 kcal/g | Protein: 4 kcal/g | Fat: 9 kcal/g\nGrams = (Calories * Split Ratio %) / (kcal per Gram)',
    explanation: 'Fine-tuning macro splits ensures that your daily caloric intake supports muscle recovery, endurance, and hormonal health.',
    example: 'Consuming 2,000 daily calories on a balanced split translates to 200g of Carbs, 150g of Protein, and approximately 67g of Fats.',
    faq: [
      { question: 'What is a ketogenic macro split?', answer: 'Ketogenic diets restrict daily carbohydrate intake to 5-10% of total calories, using healthy dietary fats (70-80%) to fuel your body via ketones.' }
    ],
    relatedSlugs: ['protein-calculator', 'tdee-calculator', 'calorie-deficit-calculator'],
    calculate: (inputs) => {
      const c = Number(inputs.calories) || 2000;
      const split = inputs.split || 'balanced';

      let carbPct = 0.40, protPct = 0.30, fatPct = 0.30;
      if (split === 'lowcarb') {
        carbPct = 0.20; protPct = 0.40; fatPct = 0.40;
      } else if (split === 'highcarb') {
        carbPct = 0.60; protPct = 0.20; fatPct = 0.20;
      }

      const carbG = (c * carbPct) / 4;
      const protG = (c * protPct) / 4;
      const fatG = (c * fatPct) / 9;

      return {
        results: [
          { label: 'Carbs Required Daily', value: carbG.toFixed(0), unit: 'grams' },
          { label: 'Protein Required Daily', value: protG.toFixed(0), unit: 'grams', isPrimary: true },
          { label: 'Fats Required Daily', value: fatG.toFixed(0), unit: 'grams' }
        ],
        chartData: [
          { name: 'Carbohydrates (g)', value: Math.round(carbG), color: '#3b82f6' },
          { name: 'Dietary Protein (g)', value: Math.round(protG), color: '#39FF14' },
          { name: 'Healthy Fats (g)', value: Math.round(fatG), color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'water-intake-advanced-calculator',
    name: 'Water Intake Calculator',
    slug: 'water-intake-advanced-calculator',
    category: 'health',
    description: 'Calculate your baseline daily hydration goals based on your physical body weight and exercise habits.',
    seoTitle: 'Daily Water Consumption & Hydration Calculator | Calculatoora',
    seoDescription: 'Calculate optimal fluid requirements. Maintain hydration levels during intense training.',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: 160, step: 1, unit: 'lbs' },
      { id: 'exercise', label: 'Daily Active Training Duration', type: 'number', defaultValue: 60, step: 10, unit: 'minutes' }
    ],
    formula: 'Daily Water (oz) = Weight (lbs) * 0.5 + (Exercise Minutes / 30) * 12 oz',
    explanation: 'Water carries essential nutrients through your bloodstream and regulated body temperature via perspiration. Exercise drains these fluid reserves, requiring prompt replenishment.',
    example: 'A 160lb individual exercising for 60 minutes requires 104 ounces (approx. 3.1 liters) of water daily.',
    faq: [
      { question: 'How much water is that in metric units?', answer: 'An ounce equals roughly 29.5 milliliters. 100 oz corresponds to approximately 2.95 liters.' }
    ],
    relatedSlugs: ['bmi-advanced-calculator', 'tdee-calculator', 'weight-loss-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 150;
      const exMin = Number(inputs.exercise) || 0;

      const baseOz = w * 0.5;
      const activeOz = (exMin / 30) * 12;
      const totalOz = baseOz + activeOz;
      const liters = totalOz * 0.02957;

      return {
        results: [
          { label: 'Recommended daily Water', value: totalOz.toFixed(0), unit: 'ounces (oz)', isPrimary: true },
          { label: 'Equivalent Metric volume', value: liters.toFixed(2), unit: 'liters (L)' },
          { label: 'Standard 8oz Glasses equivalent', value: Math.ceil(totalOz / 8), unit: 'glasses' }
        ],
        chartData: [
          { name: 'Hydration Target (oz)', value: Math.round(totalOz), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'pregnancy-calculator',
    name: 'Pregnancy Calculator',
    slug: 'pregnancy-calculator',
    category: 'health',
    description: 'Calculate pregnancy progress, estimated due date (EDD), and key fetal development milestones based on multiple dating methods.',
    seoTitle: 'Ultimate Pregnancy Calculator - Due Date, Milestones, and Baby Growth Tracker',
    seoDescription: 'Use the world\'s most advanced Pregnancy Calculator to estimate your due date using LMP, conception date, IVF, or ultrasound dating, and track baby\'s growth week-by-week.',
    inputs: [
      { id: 'method', label: 'Calculation Method', type: 'select', defaultValue: 'lmp', options: [
        { label: 'Last Menstrual Period (LMP)', value: 'lmp' },
        { label: 'Conception Date', value: 'conception' },
        { label: 'IVF Transfer Date', value: 'ivf' },
        { label: 'Ultrasound Dating', value: 'ultrasound' },
        { label: 'Expected Due Date', value: 'duedate' }
      ]}
    ],
    formula: 'EDD = LMP + 280 days (or IVF/Conception/Ultrasound equivalents)',
    explanation: 'Pregnancy progress is calculated from the first day of your last menstrual period (LMP) or equivalents. A standard full-term pregnancy lasts approximately 40 weeks (280 days).',
    example: 'For an LMP starting on Jan 1, 2026, the estimated due date is Oct 8, 2026.',
    faq: [
      { question: 'How accurate is a Pregnancy Calculator?', answer: 'Dating based on early ultrasound is considered the most accurate medical standard. LMP-based estimates assume a 28-day cycle with ovulation on Day 14.' },
      { question: 'What are the pregnancy trimesters?', answer: 'First Trimester: Week 1 to 13 (approx.), Second Trimester: Week 14 to 27, Third Trimester: Week 28 to 40 (and beyond).' }
    ],
    relatedSlugs: ['health-pregnancy-due-date', 'bmi-advanced-calculator', 'water-intake-advanced-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Estimated Due Date', value: 'Select inputs in calculator', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'ovulation-calculator',
    name: 'Ovulation Calculator',
    slug: 'ovulation-calculator',
    category: 'health',
    description: 'Calculate your fertile window, peak ovulation days, and next menstrual cycle forecasts using advanced estimation models.',
    seoTitle: 'Ultimate Ovulation Calculator - Fertile Window & Cycle Tracker',
    seoDescription: 'Calculate your most fertile days, estimated ovulation date, and track your next menstrual cycles with our advanced educational Ovulation Calculator.',
    inputs: [
      { id: 'lmp', label: 'First Day of Last Period', type: 'date', defaultValue: '' },
      { id: 'cycleLength', label: 'Average Cycle Length', type: 'number', defaultValue: '', unit: 'days' },
      { id: 'lutealLength', label: 'Luteal Phase Duration', type: 'number', defaultValue: '', unit: 'days' }
    ],
    formula: 'Ovulation Day = Cycle Length - Luteal Phase (approx. 14 days before next period)\nFertile Window = Ovulation Day - 5 days to Ovulation Day + 1 day',
    explanation: 'The ovulation calculator predicts menstrual cycles and fertile windows based on the date of your last menstrual period (LMP) and average cycle length. Peak fertility occurs on the day of ovulation and the preceding 5 days, representing the lifespan of sperm and the egg.',
    example: 'For an LMP of July 1 and a 28-day cycle, ovulation is expected on July 15. The fertile window extends from July 10 to July 16.',
    faq: [
      { question: 'What is a fertile window?', answer: 'The fertile window is the 6-day period during which pregnancy is biologically possible. It includes the day of ovulation and the 5 days prior.' },
      { question: 'Can I use this calculator if my cycles are irregular?', answer: 'Yes, this calculator includes an Irregular Cycle Mode which adjusts calculations based on cycle length variation, providing an expanded fertile window to ensure coverage.' },
      { question: 'Is this calculator a medical diagnosis tool?', answer: 'No, this calculator is for educational and informational purposes only. It should not be used as a reliable contraceptive method or medical advice.' }
    ],
    relatedSlugs: ['pregnancy-calculator', 'bmi-advanced-calculator', 'water-intake-advanced-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Ovulation Date', value: 'Enter period details to compute', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'health',
    description: 'Calculate your Body Mass Index (BMI) and discover advanced body composition insights, waist ratios, daily calories, and ideal weight charts.',
    seoTitle: 'Ultimate BMI Calculator | Advanced Body Mass Index & Fat Insights',
    seoDescription: 'Obtain precise BMI, body fat percentage, waist-height ratio, BMR, daily calorie needs, and ideal weight targets with our premium interactive BMI calculator.',
    inputs: [
      { id: 'height', label: 'Height', type: 'number', defaultValue: '', step: 1, unit: 'cm' },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: '', step: 1, unit: 'kg' },
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]}
    ],
    formula: 'Metric: BMI = Weight (kg) / Height (m)²\nImperial: BMI = (Weight (lbs) / Height (in)²) * 703',
    explanation: 'Body Mass Index (BMI) is a clinical screening metric to classify weight categories. It is paired with optional waist, neck, and hip circumferences to estimate body fat and health risk levels.',
    example: 'A person who is 175 cm tall and weighs 70 kg has a BMI of 22.86, placing them in the normal/healthy category.',
    faq: [
      { question: 'What is a healthy BMI range?', answer: 'A BMI between 18.5 and 24.9 is considered normal or healthy according to the World Health Organization (WHO).' },
      { question: 'Is BMI different for men and women?', answer: 'The standard BMI formula is the same, but healthy fat percentages and fat distributions vary significantly between sexes, which is why our calculator provides gender-specific body composition insights.' }
    ],
    relatedSlugs: ['ideal-weight-calculator', 'calorie-calculator', 'pregnancy-calculator', 'age-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Body Mass Index (BMI)', value: 'Enter height and weight', isPrimary: true }
        ]
      };
    }
  }
];
