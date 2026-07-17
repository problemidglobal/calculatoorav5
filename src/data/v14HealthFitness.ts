import { Calculator } from '../types';

export const V14_HEALTH_FITNESS_CALCULATORS: Calculator[] = [
  // HEALTH
  {
    id: 'body-composition',
    name: 'Body Composition Calculator',
    slug: 'body-composition-calculator',
    category: 'health',
    description: 'Calculate your lean body mass, body fat weight, and skeletal makeup ratios using Navy Circumference standards.',
    seoTitle: 'Navy Circumference Body Composition Calculator',
    seoDescription: 'Input neck, waist, and hip dimensions to discover your body fat percentage and lean muscle mass weights.',
    inputs: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Body Weight (lbs)', type: 'number', defaultValue: 175 },
      { id: 'height', label: 'Height (inches)', type: 'number', defaultValue: 70 },
      { id: 'neck', label: 'Neck Circumference (inches)', type: 'number', defaultValue: 15 },
      { id: 'waist', label: 'Waist Circumference (inches)', type: 'number', defaultValue: 34 },
      { id: 'hip', label: 'Hip Circumference (if Female, inches)', type: 'number', defaultValue: 36 }
    ],
    formula: 'Navy Male %Fat = 86.01 * log10(Waist - Neck) - 70.041 * log10(Height) + 36.76\nNavy Female %Fat = 163.205 * log10(Waist + Hip - Neck) - 97.684 * log10(Height) - 78.387',
    explanation: 'Uses the US Navy Circumference formula, which provides an estimate of body fat percentage close to DXA scans without requiring expensive equipment.',
    example: 'A 175 lbs male, 70" tall, with a 15" neck and a 34" waist has an estimated body fat percentage of 16.5%, translating to 28.9 lbs of fat and 146.1 lbs of lean muscle.',
    faq: [
      { question: 'How accurate is the Navy Method?', answer: 'The Navy method has a typical margin of error of 3-4% compared to clinical hydrostatic weighing and DEXA body scans.' },
      { question: 'What qualifies as a healthy body fat percentage?', answer: 'Healthy fitness body fat ranges are typically 14% to 24% for males, and 21% to 31% for females.' }
    ],
    relatedSlugs: ['body-water-calculator', 'fitness-progress-calculator'],
    calculate: (inputs) => {
      const g = String(inputs.gender || 'male');
      const w = Number(inputs.weight || 175);
      const h = Number(inputs.height || 70);
      const neck = Number(inputs.neck || 15);
      const waist = Number(inputs.waist || 34);
      const hip = Number(inputs.hip || 36);

      let bf = 15;
      if (g === 'male') {
        const diff = waist - neck;
        if (diff > 0 && h > 0) {
          bf = 86.01 * Math.log10(diff) - 70.041 * Math.log10(h) + 36.76;
        }
      } else {
        const sum = waist + hip - neck;
        if (sum > 0 && h > 0) {
          bf = 163.205 * Math.log10(sum) - 97.684 * Math.log10(h) - 78.387;
        }
      }

      bf = Math.max(2, Math.min(60, bf));
      const fatWeight = w * (bf / 100);
      const leanMass = w - fatWeight;

      return {
        results: [
          { label: 'Body Fat Percentage', value: `${bf.toFixed(1)}%`, isPrimary: true },
          { label: 'Lean Body Mass Weight', value: `${leanMass.toFixed(1)} lbs` },
          { label: 'Total Body Fat Weight', value: `${fatWeight.toFixed(1)} lbs` },
          { label: 'Biological Sex Specified', value: g.toUpperCase() }
        ],
        chartData: [
          { name: 'Lean Muscle Mass (lbs)', value: Math.round(leanMass) },
          { name: 'Body Fat (lbs)', value: Math.round(fatWeight) }
        ]
      };
    }
  },
  {
    id: 'body-water',
    name: 'Body Water Calculator',
    slug: 'body-water-calculator',
    category: 'health',
    description: 'Calculate your total body water (TBW) in liters and gallons using the Watson formula.',
    seoTitle: 'Watson Total Body Water (TBW) Calculator',
    seoDescription: 'Access standard total anatomical hydration ratios. Easily calculate optimal bodily water proportions.',
    inputs: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Body Weight (lbs)', type: 'number', defaultValue: 175 },
      { id: 'height', label: 'Height (inches)', type: 'number', defaultValue: 70 },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 30 }
    ],
    formula: 'Watson Male TBW = 2.447 - 0.09156 * Age + 0.1074 * Height * 2.54 + 0.3362 * Weight / 2.2\nWatson Female TBW = -2.097 + 0.1069 * Height * 2.54 + 0.2466 * Weight / 2.2',
    explanation: 'Skeletal muscles are highly rich in hydration compared to fats. Hydration metrics calculate active base weights safely.',
    example: 'A 30-year-old male weighing 175 lbs of 70" height has approximately 48.6 liters (12.8 gallons) of body water.',
    faq: [
      { question: 'What percentage of standard body weight is water?', answer: 'Water represents approximately 55% to 65% of total body weight for adult males, and 45% to 55% for adult females.' },
      { question: 'Why is body water volume important for doctors?', answer: 'Clinical pharmacists use TBW to accurately determine proper medication dosages, and medical staff monitor water volumes to check for dehydration risks.' }
    ],
    relatedSlugs: ['body-composition-calculator', 'nutrition-planning-calculator'],
    calculate: (inputs) => {
      const g = String(inputs.gender || 'male');
      const wKg = Number(inputs.weight || 175) / 2.20462;
      const hCm = Number(inputs.height || 70) * 2.54;
      const ageY = Number(inputs.age || 30);

      let tbwLiters = 40;
      if (g === 'male') {
        tbwLiters = 2.447 - (0.09156 * ageY) + (0.1074 * hCm) + (0.3362 * wKg);
      } else {
        tbwLiters = -2.097 + (0.1069 * hCm) + (0.2466 * wKg);
      }

      tbwLiters = Math.max(10, tbwLiters);
      const tbwGallons = tbwLiters * 0.264172;

      return {
        results: [
          { label: 'Total Body Water (L)', value: `${tbwLiters.toFixed(1)} Liters`, isPrimary: true },
          { label: 'Body Water (Gallons)', value: `${tbwGallons.toFixed(1)} Gallons` },
          { label: 'TBW percentage of Weight', value: `${((tbwLiters / wKg) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Water weight (lbs)', value: Math.round(tbwLiters * 2.2) },
          { name: 'Fat & Muscle Solids', value: Math.round(Number(inputs.weight || 175) - (tbwLiters * 2.2)) }
        ]
      };
    }
  },
  {
    id: 'bmr-comparison',
    name: 'BMR Comparison Calculator',
    slug: 'bmr-comparison-calculator',
    category: 'health',
    description: 'Compare basal metabolic rate outputs derived from Harris-Benedict, Mifflin-St Jeor, and Katch-McArdle formulas.',
    seoTitle: 'Metabolic BMR Comparison Formula Solver',
    seoDescription: 'Analyze your basal metabolism rates. Find differences across metabolic models to optimize dietary guidelines.',
    inputs: [
      { id: 'gender', label: 'Sex', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'weight', label: 'Weight (lbs)', type: 'number', defaultValue: 175 },
      { id: 'height', label: 'Height (inches)', type: 'number', defaultValue: 70 },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 30 },
      { id: 'bodyFat', label: 'Body Fat % (for Katch-McArdle approach)', type: 'number', defaultValue: 17 }
    ],
    formula: 'Mifflin: 10*wt(kg) + 6.25*ht(cm) - 5*age + (5 if Male, -161 if Female).\nKatch: 370 + 21.6 * LeanMass(kg).',
    explanation: 'Basal Metabolic Rate represents the energy expended while at complete rest. Different physiological assumptions can lead to small variances in calculated caloric needs.',
    example: 'A 175 lbs male, 70", age 30, with 17% body fat has Mifflin BMR of 1,768 kcal, Harris BMR of 1,811 kcal, and Katch BMR of 1,791 kcal.',
    faq: [
      { question: 'Which BMR formula is the most accurate?', answer: 'Mifflin-St Jeor is accepted as the most accurate standard for the general public, whereas Katch-McArdle is the most accurate for highly trained athletes since it incorporates lean muscle mass percentage.' },
      { question: 'What is BMR vs TDEE?', answer: 'BMR is energy spent at rest. TDEE includes daily activity multipliers.' }
    ],
    relatedSlugs: ['daily-energy-calculator', 'nutrition-planning-calculator'],
    calculate: (inputs) => {
      const g = String(inputs.gender || 'male');
      const wLb = Number(inputs.weight || 175);
      const hIn = Number(inputs.height || 70);
      const age = Number(inputs.age || 30);
      const bf = Number(inputs.bodyFat || 17) / 100;

      const wKg = wLb / 2.20462;
      const hCm = hIn * 2.54;

      // Mifflin
      const bmrMifflin = (10 * wKg) + (6.25 * hCm) - (5 * age) + (g === 'male' ? 5 : -161);

      // Harris-Benedict (revised)
      let bmrHarris = 1200;
      if (g === 'male') {
        bmrHarris = 88.362 + (13.397 * wKg) + (4.799 * hCm) - (5.677 * age);
      } else {
        bmrHarris = 447.593 + (9.247 * wKg) + (3.098 * hCm) - (4.330 * age);
      }

      // Katch-McArdle
      const leanKg = wKg * (1 - bf);
      const bmrKatch = 370 + (21.6 * leanKg);

      return {
        results: [
          { label: 'Mifflin-St Jeor BMR', value: `${Math.round(bmrMifflin)} kcal`, isPrimary: true },
          { label: 'Revised Harris-Benedict BMR', value: `${Math.round(bmrHarris)} kcal` },
          { label: 'Katch-McArdle (LBM approach)', value: `${Math.round(bmrKatch)} kcal` },
          { label: 'Average Calculated BMR', value: `${Math.round((bmrMifflin + bmrHarris + bmrKatch) / 3)} kcal` }
        ],
        chartData: [
          { name: 'Mifflin', value: Math.round(bmrMifflin) },
          { name: 'Harris-Ben', value: Math.round(bmrHarris) },
          { name: 'Katch-McArdle', value: Math.round(bmrKatch) }
        ]
      };
    }
  },
  {
    id: 'daily-energy',
    name: 'Daily Energy Calculator',
    slug: 'daily-energy-calculator',
    category: 'health',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) based on activity thresholds and thermal effects.',
    seoTitle: 'Total Daily Energy Expenditure (TDEE) Energy Calculator',
    seoDescription: 'Differentiate activity thresholds to track your daily energy burn rates. Estimate maintenance calories.',
    inputs: [
      { id: 'bmr', label: 'Your Rest BMR (kcal)', type: 'number', defaultValue: 1750 },
      { id: 'activity', label: 'Activity Level', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Sedentary (desk work, minimal walk)', value: 'sedentary' },
        { label: 'Light (light exercises 1-3 days/week)', value: 'light' },
        { label: 'Moderate (consistent sporting 3-5 days/week)', value: 'moderate' },
        { label: 'Heavy (strenuous exercises 6-7 days/week)', value: 'heavy' },
        { label: 'Professional Athlete (heavy manual labor daily)', value: 'athlete' }
      ]}
    ],
    formula: 'TDEE = BMR * Activity Factor\nWhere activity factor has values ranging from 1.2 to 1.9.',
    explanation: 'Total Daily Energy Expenditure estimates the calories your body consumes including desk work, walking, digestion, and sports.',
    example: 'A BMR of 1,750 kcal with a moderate physical activity factor yields a maintenance daily expense of 2,712 kcal.',
    faq: [
      { question: 'What is the Thermic Effect of Food (TEF)?', answer: 'TEF is the energy used to digest nutrients, accounting for roughly 10% of total daily energy burned.' },
      { question: 'Should I eat at my BMR level to lose weight?', answer: 'No, eating below your BMR for extended periods can cause muscle wasting. Instead, aim to consume fewer calories than your TDEE while staying above your BMR.' }
    ],
    relatedSlugs: ['bmr-comparison-calculator', 'nutrition-planning-calculator'],
    calculate: (inputs) => {
      const bmr = Number(inputs.bmr || 1750);
      const act = String(inputs.activity || 'moderate');

      let factor = 1.25;
      switch (act) {
        case 'sedentary': factor = 1.2; break;
        case 'light': factor = 1.375; break;
        case 'moderate': factor = 1.55; break;
        case 'heavy': factor = 1.725; break;
        case 'athlete': factor = 1.9; break;
      }

      const tdee = bmr * factor;

      return {
        results: [
          { label: 'Maintenance TDEE Goal', value: `${Math.round(tdee)} kcal/day`, isPrimary: true },
          { label: 'Weight Loss Target (20% deficit)', value: `${Math.round(tdee * 0.8)} kcal/day` },
          { label: 'Weight Gain Target (10% surplus)', value: `${Math.round(tdee * 1.1)} kcal/day` },
          { label: 'Activity Multiplier Factor', value: `${factor}x` }
        ],
        chartData: [
          { name: 'Basal rest BMR', value: Math.round(bmr) },
          { name: 'Active Energy Burn', value: Math.round(tdee - bmr) }
        ]
      };
    }
  },
  {
    id: 'nutrition-planning',
    name: 'Nutrition Planning Calculator',
    slug: 'nutrition-planning-calculator',
    category: 'health',
    description: 'Structure custom protein, carbohydrate, and fat mass intakes from your daily target calorie budget.',
    seoTitle: 'Daily Nutrition Macros Planning Calculator',
    seoDescription: 'Distribute macronutrient ratios for target weights. Input calorie budgets to calculate protein and fat allocations.',
    inputs: [
      { id: 'calories', label: 'Target Daily Calories (kcal)', type: 'number', defaultValue: 2400 },
      { id: 'ratio', label: 'Dietary Split Profile', type: 'select', defaultValue: 'balanced', options: [
        { label: 'Balanced Default Splits (40% Carbs, 30% Protein, 30% Fat)', value: 'balanced' },
        { label: 'High Protein / Lean Mass (35% Carbs, 45% Protein, 20% Fat)', value: 'highprotein' },
        { label: 'LCHF / Low Carb Fat (15% Carbs, 25% Protein, 60% Fat)', value: 'lowcarb' }
      ]}
    ],
    formula: 'Protein/Carbs = 4 kcal per gram.\nFats = 9 kcal per gram.',
    explanation: 'Macronutrient distribution helps shape body composition. Consuming adequate protein preserves lean muscle tissue during caloric deficits.',
    example: 'For a 2,400 kcal budget, a Balanced split prescribes 240g of carbohydrates, 180g of protein, and 80g of healthy fats.',
    faq: [
      { question: 'Why does fat contain more calories?', answer: 'Fats are highly energy-dense, supplying 9 kcal per gram. In contrast, protein and carbohydrates provide 4 kcal per gram.' },
      { question: 'How much protein is required to hold muscle?', answer: 'General sports science recommendations suggest consuming 0.7g to 1.0g of protein per pound of lean body weight daily.' }
    ],
    relatedSlugs: ['meal-calorie-calculator', 'daily-energy-calculator'],
    calculate: (inputs) => {
      const kcal = Number(inputs.calories || 2400);
      const split = String(inputs.ratio || 'balanced');

      let pc = 40, pp = 30, pf = 30;
      if (split === 'highprotein') {
        pc = 35; pp = 45; pf = 20;
      } else if (split === 'lowcarb') {
        pc = 15; pp = 25; pf = 60;
      }

      const carbsG = (kcal * (pc / 100)) / 4;
      const protG = (kcal * (pp / 100)) / 4;
      const fatG = (kcal * (pf / 100)) / 9;

      return {
        results: [
          { label: 'Protein Target', value: `${Math.round(protG)} grams/day`, isPrimary: true },
          { label: 'Carbohydrates Target', value: `${Math.round(carbsG)} grams/day` },
          { label: 'Fat Target', value: `${Math.round(fatG)} grams/day` },
          { label: 'Total Macro Calories', value: `${kcal} kcal` }
        ],
        chartData: [
          { name: 'Carbs kcal', value: Math.round(kcal * (pc / 100)) },
          { name: 'Protein kcal', value: Math.round(kcal * (pp / 100)) },
          { name: 'Fat kcal', value: Math.round(kcal * (pf / 100)) }
        ]
      };
    }
  },
  {
    id: 'meal-calorie',
    name: 'Meal Calorie Calculator',
    slug: 'meal-calorie-calculator',
    category: 'health',
    description: 'Evaluate the caloric load and macronutrient balance of a single meal by logging individual ingredient weights.',
    seoTitle: 'Ingredient-based Meal Calorie & Nutrient Tracker',
    seoDescription: 'Obtain precise carbohydrate, protein, and fat counts for custom culinary recipes.',
    inputs: [
      { id: 'proteinG', label: 'Protein Ingredient Weight (grams)', type: 'number', defaultValue: 150, helpText: 'e.g. skinless chicken breast' },
      { id: 'carbsG', label: 'Carbohydrate Ingredient Weight (grams)', type: 'number', defaultValue: 200, helpText: 'e.g. steamed jasmine rice' },
      { id: 'fatG', label: 'Added Fats & Oils Weight (grams)', type: 'number', defaultValue: 15, helpText: 'e.g. olive oil / butter' }
    ],
    formula: 'Meal Calories = (Protein Weight * 4) + (Carb Weight * 4) + (Fat Weight * 9)',
    explanation: 'Accurately tracking calories per meal helps you maintain a caloric deficit or surplus and manage insulin responses.',
    example: 'A meal containing 150g protein source, 200g carb source, and 15g of added cooking oils averages around 1,535 kcal containing high-density macro splits.',
    faq: [
      { question: 'Is raw weight or cooked weight more accurate for tracking?', answer: 'Raw weight is always more accurate, as water retention and absorption rates vary significantly during cooking.' },
      { question: 'Why track macros instead of just calories?', answer: 'Managing macro distributions ensures you meet your protein needs to support recovery while consuming enough healthy fat for optimal hormone production.' }
    ],
    relatedSlugs: ['nutrition-planning-calculator', 'healthy-habit-calculator'],
    calculate: (inputs) => {
      const pg = Number(inputs.proteinG || 0);
      const cg = Number(inputs.carbsG || 0);
      const fg = Number(inputs.fatG || 0);

      // We approximate standard yields (e.g. 1g of pure dry equivalent assumes standard scales)
      // Since users input total source weight, we'll assume a standard general multiplier for dry yields:
      // protein is roughly 25% dry protein, carb matches 25% dry, fat is close to 100% active oil
      const activeProteinFactor = pg * 0.25;
      const activeCarbFactor = cg * 0.24;
      const activeFatFactor = fg * 0.95;

      const pKcal = activeProteinFactor * 4;
      const cKcal = activeCarbFactor * 4;
      const fKcal = activeFatFactor * 9;
      const totalKcal = pKcal + cKcal + fKcal;

      return {
        results: [
          { label: 'Total Estimated Meal Calories', value: `${Math.round(totalKcal)} kcal`, isPrimary: true },
          { label: 'Active Protein Yield', value: `${activeProteinFactor.toFixed(1)} grams` },
          { label: 'Active Carbohydrates', value: `${activeCarbFactor.toFixed(1)} grams` },
          { label: 'Active Healthy Fats', value: `${activeFatFactor.toFixed(1)} grams` }
        ],
        chartData: [
          { name: 'Protein kcal', value: Math.round(pKcal) },
          { name: 'Carbs kcal', value: Math.round(cKcal) },
          { name: 'Fats kcal', value: Math.round(fKcal) }
        ]
      };
    }
  },
  {
    id: 'healthy-habit',
    name: 'Healthy Habit Calculator',
    slug: 'healthy-habit-calculator',
    category: 'health',
    description: 'Track and project the cumulative health benefits of habits like drinking water, walking, and getting quality sleep.',
    seoTitle: 'Healthy Habit Cumulative Benefit Projector',
    seoDescription: 'See the impact of daily habits compounded over years. Track water volume totals and step milestones.',
    inputs: [
      { id: 'waterCups', label: 'Daily Water Drunk (Glasses, 8oz)', type: 'number', defaultValue: 8 },
      { id: 'steps', label: 'Daily Walking Steps Taken', type: 'number', defaultValue: 8000 },
      { id: 'sleepHours', label: 'Daily Quality Sleep (Hours)', type: 'number', defaultValue: 7.5 }
    ],
    formula: 'Compounded totals calculated over 365 days (1 year) and 1825 days (5 years).',
    explanation: 'Small healthy choices compound over time. Regular sleep and adequate hydration significantly improve focus and metabolic rate.',
    example: 'Walking 8,000 steps daily compounds to 2.92 million steps per year, covering approximately 1,380 miles.',
    faq: [
      { question: 'Is the 10,000 steps target a myth?', answer: 'While 10k steps is a marketing term, sports studies show physical health and cardiovascular benefits scale rapidly up to 7,500 - 8,000 steps daily.' },
      { question: 'Why does hydration impact focus?', answer: 'Even mild dehydration (1-2% fluids loss) can impair memory, concentration, and cognitive function.' }
    ],
    relatedSlugs: ['fitness-progress-calculator', 'meal-calorie-calculator'],
    calculate: (inputs) => {
      const cups = Number(inputs.waterCups || 8);
      const steps = Number(inputs.steps || 8000);
      const sleep = Number(inputs.sleepHours || 7.5);

      const annualWaterHydRes = cups * 8 * 365 / 128; // Gallons
      const annualMiles = steps * 0.000473 * 365; // Approx miles
      const annualSleep = sleep * 365;

      return {
        results: [
          { label: 'Annual Water Hydration', value: `${annualWaterHydRes.toFixed(1)} Gallons`, isPrimary: true },
          { label: 'Distance Covered Annually', value: `${Math.round(annualMiles)} Miles` },
          { label: 'Yearly Sleep Hours Banked', value: `${annualSleep.toFixed(0)} Hours` },
          { label: 'Combined Step Volumes (Year)', value: `${(steps * 365).toLocaleString()} Steps` }
        ],
        chartData: [
          { name: 'Drunk Water (Liter Equivalent)', value: Math.round(cups * 0.24) },
          { name: 'Estimated Walk (Miles/Month)', value: Math.round(steps * 0.000473 * 30.5) }
        ]
      };
    }
  },
  {
    id: 'fitness-progress',
    name: 'Fitness Progress Calculator',
    slug: 'fitness-progress-calculator',
    category: 'health',
    description: 'Track body measurement transformations and calculate the rate of fat loss and skeletal changes.',
    seoTitle: 'Body Dimension & Weight Progress Tracker',
    seoDescription: 'Log waist line reductions and weight trends side-by-side to track body compositional changes.',
    inputs: [
      { id: 'startWeight', label: 'Initial Body Weight (lbs)', type: 'number', defaultValue: 190 },
      { id: 'endWeight', label: 'Current Body Weight (lbs)', type: 'number', defaultValue: 178 },
      { id: 'startWaist', label: 'Starting Waist (inches)', type: 'number', defaultValue: 38 },
      { id: 'endWaist', label: 'Current Waist (inches)', type: 'number', defaultValue: 34 },
      { id: 'weeks', label: 'Timeline Duration (Weeks)', type: 'number', defaultValue: 8 }
    ],
    formula: 'Weight Loss Velocity = (Start - End) / Weeks\nWaist Reduction = Start - End',
    explanation: 'Waist circumference reductions are highly correlated with visceral fat loss, making them a more reliable progress metric than the scale alone.',
    example: 'Losing 12 lbs and 4 inches from your waist over 8 weeks represents a steady fat loss velocity of 1.5 lbs per week.',
    faq: [
      { question: 'What is a safe weekly weight loss rate?', answer: 'Losing 1 to 2 pounds per week is considered safe and sustainable for preserving muscle tissue.' },
      { question: 'Why is the scale not moving during exercise?', answer: 'You may be building healthy skeletal muscle mass while simultaneously losing body fat, resulting in body composition recomposition without scale swings.' }
    ],
    relatedSlugs: ['body-composition-calculator', 'workout-frequency-calculator'],
    calculate: (inputs) => {
      const sw = Number(inputs.startWeight || 190);
      const ew = Number(inputs.endWeight || 178);
      const swst = Number(inputs.startWaist || 38);
      const ewst = Number(inputs.endWaist || 34);
      const wks = Number(inputs.weeks || 8);

      const lostW = Math.max(0, sw - ew);
      const lostWst = Math.max(0, swst - ewst);
      const velocity = wks > 0 ? lostW / wks : 0;

      return {
        results: [
          { label: 'Weekly Loss Velocity', value: `${velocity.toFixed(2)} lbs/week`, isPrimary: true },
          { label: 'Total Weight Loss', value: `${lostW.toFixed(1)} lbs` },
          { label: 'Waist Margin Reduced', value: `${lostWst.toFixed(1)} inches` },
          { label: 'Target Percent Reduced', value: `${((lostW / sw) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Weight change', value: lostW },
          { name: 'Waist change', value: lostWst * 5 } // Scaled for contrast
        ]
      };
    }
  },

  // FITNESS
  {
    id: 'workout-frequency',
    name: 'Workout Frequency Calculator',
    slug: 'workout-frequency-calculator',
    category: 'fitness',
    description: 'Determine your optimal weekly workout frequency based on splits and training history priorities.',
    seoTitle: 'Optimal Weekly Workout Frequency Solver',
    seoDescription: 'Obtain suggested training days based on target training splits like Full Body or Push-Pull-Legs.',
    inputs: [
      { id: 'history', label: 'Training Experience Level', type: 'select', defaultValue: 'intermediate', options: [
        { label: 'Beginner (under 6 months consistent work)', value: 'beginner' },
        { label: 'Intermediate (6 months to 2 years consistent work)', value: 'intermediate' },
        { label: 'Advanced Athlete (above 2 years focus)', value: 'advanced' }
      ]},
      { id: 'split', label: 'Primary Split Target', type: 'select', defaultValue: 'ppl', options: [
        { label: 'Full Body Program', value: 'fullbody' },
        { label: 'Upper / Lower Split', value: 'upperlower' },
        { label: 'Push, Pull, Legs (PPL)', value: 'ppl' }
      ]}
    ],
    formula: 'Schedules are formatted programmatically based on frequency constraints for optimal body part recovery.',
    explanation: 'Muscles generally require 48 hours of recovery between high-intensity workouts. Selecting the right frequency ensures you hit your weekly volume goals without overtraining.',
    example: 'For an Intermediate athlete following a Push-Pull-Legs split, the recommended frequency is 4 to 5 workouts per week.',
    faq: [
      { question: 'Is training every day beneficial?', answer: 'Typically no. Muscles require strategic recovery blocks to repair and grow stronger. Training daily can impair recovery and lead to injury.' },
      { question: 'What is the most effective split for beginners?', answer: 'A 3-day Full Body routine is ideal for beginners to maximize workout frequency and neuromuscular adaptation.' }
    ],
    relatedSlugs: ['training-volume-calculator', 'strength-ratio-calculator'],
    calculate: (inputs) => {
      const exp = String(inputs.history || 'intermediate');
      const split = String(inputs.split || 'ppl');

      let recommendedDays = 3;
      let breakdownText = 'Full body workouts spaced with 48h rest intervals.';

      if (split === 'fullbody') {
        recommendedDays = exp === 'beginner' ? 3 : 4;
        breakdownText = '3-4 Full body routines per week with restful gaps.';
      } else if (split === 'upperlower') {
        recommendedDays = 4;
        breakdownText = '2 Upper body days and 2 Lower body days weekly.';
      } else if (split === 'ppl') {
        recommendedDays = exp === 'advanced' ? 6 : 5;
        breakdownText = 'Push, Pull, Legs sessions spaced with strategic active recovery days.';
      }

      return {
        results: [
          { label: 'Recommended Days/Week', value: `${recommendedDays} Workouts`, isPrimary: true },
          { label: 'Training Schedule Approach', value: breakdownText },
          { label: 'Weekly Muscle Recovery Goal', value: '48 to 72 Hours' }
        ],
        chartData: [
          { name: 'Training Days', value: recommendedDays },
          { name: 'Rest Days', value: 7 - recommendedDays }
        ]
      };
    }
  },
  {
    id: 'training-volume',
    name: 'Training Volume Calculator',
    slug: 'training-volume-calculator',
    category: 'fitness',
    description: 'Calculate your total training volume (Sets x Reps x Weight) per muscle group to optimize physical growth.',
    seoTitle: 'Resistance Training Volume Load Calculator',
    seoDescription: 'Track weight volumes across muscle groups. Calculate accumulated training loads for gym sessions easily.',
    inputs: [
      { id: 'sets', label: 'Average Weekly Sets (per muscle)', type: 'number', defaultValue: 12 },
      { id: 'reps', label: 'Average Repetitions per Set', type: 'number', defaultValue: 10 },
      { id: 'weightUsed', label: 'Average Weight Lifted (lbs)', type: 'number', defaultValue: 145 }
    ],
    formula: 'Training Volume Load = Weekly Sets * Repetitions * Weight Lifted',
    explanation: 'Progressive overload, achieved by gradually increasing your training volume, is a primary driver of muscle hypertrophy.',
    example: 'Completing 12 sets of 10 reps with 145 lbs represents an overall training volume load of 17,400 lbs.',
    faq: [
      { question: 'What is a good weekly set range for growth?', answer: 'Sports research suggests a range of 10 to 20 challenging sets per muscle group weekly for optimal hypertrophy.' },
      { question: 'What is progressive overload?', answer: 'Gradually increasing weight, reps, or sets over time to force muscle adaptions and scale strength.' }
    ],
    relatedSlugs: ['strength-ratio-calculator', 'workout-frequency-calculator'],
    calculate: (inputs) => {
      const s = Number(inputs.sets || 12);
      const r = Number(inputs.reps || 10);
      const w = Number(inputs.weightUsed || 145);

      const tonnage = s * r * w;

      return {
        results: [
          { label: 'Weekly Volume Load', value: `${tonnage.toLocaleString()} lbs`, isPrimary: true },
          { label: 'Total Repetitions Performed', value: `${s * r} Reps/week` },
          { label: 'Average Load Density', value: `${w} lbs/rep` },
          { label: 'Set Volume Level', value: s >= 15 ? 'High Volume' : 'Moderate Volume' }
        ],
        chartData: [
          { name: 'Volume load (lbs)', value: tonnage },
          { name: 'Total Reps (multiplied for contrast)', value: s * r * 10 }
        ]
      };
    }
  },
  {
    id: 'strength-ratio',
    name: 'Strength Ratio Calculator',
    slug: 'strength-ratio-calculator',
    category: 'fitness',
    description: 'Calculate your strength-to-bodyweight ratios for core movements like Bench Press, Squat, and Deadlift.',
    seoTitle: 'Strength-to-Weight Power Ratio Calculator',
    seoDescription: 'Obtain relative body strength ratios. Compare personal lift records against total body weight parameters.',
    inputs: [
      { id: 'bodyWeight', label: 'Your Body Weight (lbs)', type: 'number', defaultValue: 175 },
      { id: 'benchPress', label: 'Bench Press Max Rep (lbs)', type: 'number', defaultValue: 185 },
      { id: 'squat', label: 'Anat Squat Max Rep (lbs)', type: 'number', defaultValue: 245 },
      { id: 'deadlift', label: 'Deadlift Max Rep (lbs)', type: 'number', defaultValue: 295 }
    ],
    formula: 'Strength Ratio = Max lift / Weight',
    explanation: 'Evaluating strength relative to bodyweight is a superior metric for athletic performance compared to absolute lift weights.',
    example: 'A 175 lbs lifter with a 185 lbs bench (1.05x), 245 lbs squat (1.40x), and 295 lbs deadlift (1.68x) holds a combined relative rating of 4.13x.',
    faq: [
      { question: 'What is a good relative squat ratio?', answer: 'Squatting 1.5 times your bodyweight is considered a strong intermediate milestone for drug-free lifters.' },
      { question: 'Why deadlifts yields higher ratios?', answer: 'Deadlifts utilize the entire posterior chain, employing massive leverage from the hips, hamstrings, and lower back.' }
    ],
    relatedSlugs: ['training-volume-calculator', 'workout-frequency-calculator'],
    calculate: (inputs) => {
      const bw = Number(inputs.bodyWeight || 175);
      const bp = Number(inputs.benchPress || 185);
      const sq = Number(inputs.squat || 245);
      const dl = Number(inputs.deadlift || 295);

      const ratioBp = bp / bw;
      const ratioSq = sq / bw;
      const ratioDl = dl / bw;
      const totalR = ratioBp + ratioSq + ratioDl;

      return {
        results: [
          { label: 'Cumulative Power Ratio', value: `${totalR.toFixed(2)}x Bodyweight`, isPrimary: true },
          { label: 'Bench Press Ratio', value: `${ratioBp.toFixed(2)}x` },
          { label: 'Squat Ratio', value: `${ratioSq.toFixed(2)}x` },
          { label: 'Deadlift Ratio', value: `${ratioDl.toFixed(2)}x` }
        ],
        chartData: [
          { name: 'Bench Ratio', value: Math.round(ratioBp * 100) },
          { name: 'Squat Ratio', value: Math.round(ratioSq * 100) },
          { name: 'Deadlift Ratio', value: Math.round(ratioDl * 100) }
        ]
      };
    }
  },
  {
    id: 'calories-burned-running',
    name: 'Calories Burned Running Calculator',
    slug: 'calories-burned-running-calculator',
    category: 'fitness',
    description: 'Calculate running calories burned using MET values based on pace and your specific body mass.',
    seoTitle: 'Running MET Calorie Burn Calculator',
    seoDescription: 'Input duration and running pace to calculate estimated active calories burned.',
    inputs: [
      { id: 'weight', label: 'Body Weight (lbs)', type: 'number', defaultValue: 160 },
      { id: 'duration', label: 'Running Duration (Minutes)', type: 'number', defaultValue: 45 },
      { id: 'pace', label: 'Average Pace', type: 'select', defaultValue: '10min', options: [
        { label: '6 mph (10 min/mile, MET 9.8)', value: '10min' },
        { label: '7 mph (8.5 min/mile, MET 11.0)', value: '8.5min' },
        { label: '8 mph (7.5 min/mile, MET 11.8)', value: '7.5min' },
        { label: '5 mph (Slow Jog, MET 8.3)', value: 'jog' }
      ]}
    ],
    formula: 'Calories Burned = MET * 3.5 * Weight(kg) / 200 * Duration',
    explanation: 'Enables runners to estimate energy consumption using standardized MET research values.',
    example: 'A 160 lbs runner maintaining a 10 min/mile pace (9.8 MET) for 45 minutes burns approximately 560 kcal.',
    faq: [
      { question: 'What does MET represent?', answer: 'MET stands for Metabolic Equivalent of Task, a unit that measures the metabolic rate of a physical task relative to resting.' },
      { question: 'Does fitness level alter calorie burn rates?', answer: 'Yes. Leaner individuals with higher cardiovascular efficiency may burn slightly fewer calories at identical paces due to optimized biomechanics.' }
    ],
    relatedSlugs: ['calories-burned-cycling-calculator', 'calories-burned-walking-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight || 160) / 2.20462;
      const mins = Number(inputs.duration || 45);
      const pace = String(inputs.pace || '10min');

      let met = 9.8;
      if (pace === '8.5min') met = 11.0;
      else if (pace === '7.5min') met = 11.8;
      else if (pace === 'jog') met = 8.3;

      const burned = met * 3.5 * w / 200 * mins;

      return {
        results: [
          { label: 'Active Energy Burned', value: `${Math.round(burned)} kcal`, isPrimary: true },
          { label: 'Calories per Minute', value: `${(burned / mins).toFixed(1)} kcal/min` },
          { label: 'Anatomical MET Level Used', value: `${met} MET` }
        ],
        chartData: [
          { name: 'Burned calories', value: Math.round(burned) },
          { name: 'Pace MET Scale', value: Math.round(met * 20) }
        ]
      };
    }
  },
  {
    id: 'calories-burned-cycling',
    name: 'Calories Burned Cycling Calculator',
    slug: 'calories-burned-cycling-calculator',
    category: 'fitness',
    description: 'Calculate cycling calories burned based on body weight, duration, and average speeds.',
    seoTitle: 'Bicycle Cycling Calorie Burn Solver',
    seoDescription: 'Estimate active energy burnt during outdoor bicycle or home spin sessions using accurate MET standards.',
    inputs: [
      { id: 'weight', label: 'Body Weight (lbs)', type: 'number', defaultValue: 160 },
      { id: 'duration', label: 'Cycling Duration (Minutes)', type: 'number', defaultValue: 60 },
      { id: 'effort', label: 'Cycling Effort Level', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Light (under 10 mph, MET 4.0)', value: 'light' },
        { label: 'Moderate (12-14 mph, MET 8.0)', value: 'moderate' },
        { label: 'Vigorous speed (16-19 mph, MET 12.0)', value: 'vigorous' }
      ]}
    ],
    formula: 'Calories Burned = MET * 3.5 * Weight(kg) / 200 * Duration',
    explanation: 'Uses MET standards to calculate energy expenditure during outdoor road cycling or indoor stationary spin classes.',
    example: 'An adult weighing 160 lbs cycling at moderate speed (8.0 MET) for 60 minutes burns approximately 582 kcal.',
    faq: [
      { question: 'Why does air resistance affect cycling calorie burn?', answer: 'Air drag increases exponentially with speed, meaning cycling faster requires significantly more organic workload and muscle recruitment.' },
      { question: 'Is indoor spinning identical to outdoor cycling?', answer: 'Indoor spinning lacks wind resistance and elevation changes, so standard MET scales are adjusted to resemble controlled gym settings.' }
    ],
    relatedSlugs: ['calories-burned-running-calculator', 'calories-burned-walking-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight || 160) / 2.20462;
      const mins = Number(inputs.duration || 60);
      const eff = String(inputs.effort || 'moderate');

      let met = 8.0;
      if (eff === 'light') met = 4.0;
      else if (eff === 'vigorous') met = 12.0;

      const burned = met * 3.5 * w / 200 * mins;

      return {
        results: [
          { label: 'Cycling Energy Burned', value: `${Math.round(burned)} kcal`, isPrimary: true },
          { label: 'Calories per Minute Rate', value: `${(burned / mins).toFixed(1)} kcal/min` },
          { label: 'Operating MET Scale', value: `${met} MET` }
        ],
        chartData: [
          { name: 'Burned calories', value: Math.round(burned) },
          { name: 'Effort MET Scale', value: Math.round(met * 20) }
        ]
      };
    }
  },
  {
    id: 'calories-burned-walking',
    name: 'Calories Burned Walking Calculator',
    slug: 'calories-burned-walking-calculator',
    category: 'fitness',
    description: 'Calculate calories burned while walking, accounting for speed variations and your total body weight.',
    seoTitle: 'Walking Calorie Burn & MET Solver',
    seoDescription: 'Find estimated calorie burn rates for flat trails, commutes, or brisk fitness pathing.',
    inputs: [
      { id: 'weight', label: 'Body Weight (lbs)', type: 'number', defaultValue: 160 },
      { id: 'duration', label: 'Walking Duration (Minutes)', type: 'number', defaultValue: 50 },
      { id: 'speed', label: 'Walking Speed / Environment', type: 'select', defaultValue: 'brisk', options: [
        { label: 'Casual Pace (2 mph, MET 2.8)', value: 'casual' },
        { label: 'Standard Average (3 mph, MET 3.5)', value: 'average' },
        { label: 'Brisk Pace (3.5 mph, MET 4.3)', value: 'brisk' }
      ]}
    ],
    formula: 'Calories Burned = MET * 3.5 * Weight(kg) / 200 * Duration',
    explanation: 'Low-impact walking is highly effective for fat loss and cardiovascular health. It can be performed consistently without causing joint strain.',
    example: 'A 160 lbs individual taking a brisk 50-minute walk (3.5 mph, 4.3 MET) burns approximately 242 kcal.',
    faq: [
      { question: 'Does incline affect walking calorie burn?', answer: 'Yes! Even a slight 3-5% incline can double your energy expenditure and target the posterior chain more effectively.' },
      { question: 'How can I maximize fat loss from walking?', answer: 'Aim for consistency rather than high speeds. Brisk walking maintains your heart rate in the active fat-burn zone (60-70% of max).' }
    ],
    relatedSlugs: ['calories-burned-running-calculator', 'calories-burned-cycling-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight || 160) / 2.20462;
      const mins = Number(inputs.duration || 50);
      const spd = String(inputs.speed || 'brisk');

      let met = 4.3;
      if (spd === 'casual') met = 2.8;
      else if (spd === 'average') met = 3.5;

      const burned = met * 3.5 * w / 200 * mins;

      return {
        results: [
          { label: 'Walking Energy Burned', value: `${Math.round(burned)} kcal`, isPrimary: true },
          { label: 'Total Calories per Minute', value: `${(burned / mins).toFixed(1)} kcal/min` },
          { label: 'MET Index standard', value: `${met} MET` }
        ],
        chartData: [
          { name: 'Burned calories', value: Math.round(burned) },
          { name: 'Pace MET Scale', value: Math.round(met * 20) }
        ]
      };
    }
  },
  {
    id: 'exercise-goal',
    name: 'Exercise Goal Calculator',
    slug: 'exercise-goal-calculator',
    category: 'fitness',
    description: 'Determine the custom training times and target calories required to achieve specific physical change objectives.',
    seoTitle: 'Target Fitness & Exercise Goal Calculator',
    seoDescription: 'Obtain required workout targets based on your active fat-loss and energy burn goals.',
    inputs: [
      { id: 'targetDeficit', label: 'Target Weekly Caloric Burn Goal (kcal)', type: 'number', defaultValue: 2500 },
      { id: 'sessions', label: 'Workouts Per Week (Target count)', type: 'number', defaultValue: 4 },
      { id: 'type', label: 'Preferred Activity Type', type: 'select', defaultValue: 'running', options: [
        { label: 'Brisk Walking (approx 300 kcal/hr)', value: 'walking' },
        { label: 'Running / Heavy Cardio (approx 600 kcal/hr)', value: 'running' },
        { label: 'Resistance Weightlifting (approx 400 kcal/hr)', value: 'weights' }
      ]}
    ],
    formula: 'Session Burn = Target Deficit / Workouts\nActive Minutes = Session Burn / Rate * 60',
    explanation: 'Structuring clear workout expectations helps you manage dietary inputs and maintain steady progress toward your fitness goals.',
    example: 'To achieve a 2,500 kcal weekly deficit through 4 running sessions, you need to burn 625 kcal per workout, requiring approximately 62.5 minutes of running per session.',
    faq: [
      { question: 'Is a fat-loss deficit of 3,500 kcal realistic?', answer: 'Yes. Burning 3,500 kcal is equivalent to 1 pound of fat tissue. Aim to achieve this through a combination of exercise and a slight dietary deficit.' },
      { question: 'Why combine weightlifting with cardio?', answer: 'Weightlifting preserves lean skeletal muscle tissue, ensuring a high basal metabolic rate while you lose fat.' }
    ],
    relatedSlugs: ['calories-burned-running-calculator', 'workout-frequency-calculator'],
    calculate: (inputs) => {
      const def = Number(inputs.targetDeficit || 2500);
      const sess = Number(inputs.sessions || 4);
      const typ = String(inputs.type || 'running');

      let burnPerHr = 600;
      if (typ === 'walking') burnPerHr = 300;
      else if (typ === 'weights') burnPerHr = 400;

      const perSessionBurn = sess > 0 ? def / sess : 0;
      const minsRequired = burnPerHr > 0 ? (perSessionBurn / burnPerHr) * 60 : 0;

      return {
        results: [
          { label: 'Burn Target per Workout', value: `${Math.round(perSessionBurn)} kcal/session`, isPrimary: true },
          { label: 'Required Session Duration', value: `${Math.round(minsRequired)} Minutes/session` },
          { label: 'Estimated Weekly Duration', value: `${Math.round(minsRequired * sess)} Minutes/week` },
          { label: 'Target Deficit Achieved', value: `${def} kcal/week` }
        ],
        chartData: [
          { name: 'Deficit target-session', value: Math.round(perSessionBurn) },
          { name: 'Estimated Hour Burn', value: burnPerHr }
        ]
      };
    }
  }
];
