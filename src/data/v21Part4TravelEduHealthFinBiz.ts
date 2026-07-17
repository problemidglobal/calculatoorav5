import { Calculator } from '../types';

export const V21_PART4_CALCULATORS: Calculator[] = [
  // ====================================== TRAVEL ======================================
  {
    id: 'trip-budget',
    name: 'Standard Trip Budget Sizer',
    slug: 'trip-budget',
    category: 'travel',
    description: 'Calculate and budget travel expenses including flights, hotels, meals, and emergencies.',
    formula: 'Cost = Flights + Days * (Hotel + Food per day + Activities) + Emergency Buffer',
    explanation: 'Consolidates travel expenses to help travelers plan routes and optimize vacation budgets.',
    example: 'A 7-day trip to Paris budgeting $350 for flights and $120/night lodging.',
    inputs: [
      { id: 'flightPrice', label: 'Flights / Transport Cost ($)', type: 'number', defaultValue: 350, min: 0 },
      { id: 'hotelPrice', label: 'Lodging / Hotel per Night ($)', type: 'number', defaultValue: 120, min: 0 },
      { id: 'daysCount', label: 'Trip Duration (Days)', type: 'number', defaultValue: 7, min: 1 },
      { id: 'foodDaily', label: 'Daily Food & Meal Budget ($)', type: 'number', defaultValue: 45, min: 0 },
      { id: 'emergencyPct', label: 'Emergency Safety Buffer (%)', type: 'number', defaultValue: 15, min: 0 }
    ],
    faq: [
      { question: 'Why add a travel safety buffer?', answer: 'Buffers cover unexpected taxi fares, medicine, or baggage fees without compromising your main vacation budget.' }
    ],
    relatedSlugs: ['vacation-cost', 'route-cost'],
    seoTitle: 'Standard Vacation & Road Trip Budget Sizer',
    seoDescription: 'Calculate travel budgets. Estimate flight, hotel, and meal costs with a safety buffer.',
    calculate: (inputs) => {
      const fl = Number(inputs.flightPrice || 350);
      const hot = Number(inputs.hotelPrice || 120);
      const days = Number(inputs.daysCount || 7);
      const food = Number(inputs.foodDaily || 45);
      const buffer = Number(inputs.emergencyPct || 15) / 100;

      const lodgingTotal = hot * (days - 1);
      const foodTotal = food * days;
      const baseTotal = fl + lodgingTotal + foodTotal;
      const safetyAmt = baseTotal * buffer;
      const finalCost = baseTotal + safetyAmt;

      return {
        results: [
          { label: 'Total Trip Budget', value: finalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Safety Buffer Reserve', value: safetyAmt.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Daily Average Expense', value: (finalCost / days).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'vacation-cost',
    name: 'Multi-Person Vacation Cost Planner',
    slug: 'vacation-cost',
    category: 'travel',
    description: 'Calculate overall vacation costs for multiple travelers and duration in days.',
    formula: 'Total Cost = (Transport + (Hotel per night * Days) + (Food * Travelers * Days))',
    explanation: 'Estimates combined vacation expenses, helping families and groups coordinate travel budgets.',
    example: 'A family of four budgeting for a 5-day mountain cabin getaway.',
    inputs: [
      { id: 'travelerCount', label: 'Total Count of Travelers', type: 'number', defaultValue: 3, min: 1 },
      { id: 'daysTarget', label: 'Vacation Duration (Days)', type: 'number', defaultValue: 5, min: 1 },
      { id: 'transportPerson', label: 'Upfront Transport per Person ($) (e.g., flight/gas)', type: 'number', defaultValue: 150, min: 0 },
      { id: 'lodgingNight', label: 'Cabin / Hotel per Night ($)', type: 'number', defaultValue: 160, min: 0 },
      { id: 'mealsPersonDay', label: 'Meals & Dining per Person/Day ($)', type: 'number', defaultValue: 40, min: 0 }
    ],
    faq: [
      { question: 'How is groups dining optimized?', answer: 'Grouping dining costs and cooking shared meals at Airbnb cabin kitchens can reduce travel food costs by up to 50%.' }
    ],
    relatedSlugs: ['trip-budget', 'route-cost'],
    seoTitle: 'Family & Group Vacation Cost Planner | Travel Sizer',
    seoDescription: 'Estimate overall vacation costs for multiple travelers. Calculate group flight, cabin, and dining expenses easily.',
    calculate: (inputs) => {
      const crew = Number(inputs.travelerCount || 3);
      const days = Number(inputs.daysTarget || 5);
      const transPr = Number(inputs.transportPerson || 150);
      const lodg = Number(inputs.lodgingNight || 160);
      const meals = Number(inputs.mealsPersonDay || 40);

      const totalTrans = transPr * crew;
      const totalLodging = lodg * (days - 1);
      const totalMeals = meals * crew * days;
      const combinedCapitalCost = totalTrans + totalLodging + totalMeals;

      return {
        results: [
          { label: 'Estimated Group Budget', value: combinedCapitalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Cost per Person', value: (combinedCapitalCost / crew).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Combined Meal Budget', value: totalMeals.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'travel-time',
    name: 'Travel Duration & Speed Calculator',
    slug: 'travel-time',
    category: 'travel',
    description: 'Calculate travel times based on distance and speed, factoring in layovers or rest breaks.',
    formula: 'Travel Time = (Distance / Speed) + Layover Hours',
    explanation: 'Calculates travel times to help you plan flights, train rides, and road trip schedules.',
    example: 'Driving 450 miles at a steady 65 mph speed with an hour of cumulative rest breaks.',
    inputs: [
      { id: 'distanceMiles', label: 'Trip Distance (Miles)', type: 'number', defaultValue: 450, min: 1 },
      { id: 'averageSpeed', label: 'Average Travel Speed (mph)', type: 'number', defaultValue: 65, min: 10, max: 600 },
      { id: 'restHours', label: 'Layovers or Rest Stop Breaks (Hours)', type: 'number', defaultValue: 1.5, min: 0, step: 0.1 }
    ],
    faq: [
      { question: 'Why factor in rest stops?', answer: 'Rest stops prevent driver fatigue. Schedulers recommend taking a 15-minute break every two hours of continuous road driving.' }
    ],
    relatedSlugs: ['route-cost', 'trip-budget'],
    seoTitle: 'Travel Time, Average Speed & road rest break Calculator',
    seoDescription: 'Calculate travel times based on distance and speed. Factors in flight layovers and road trip rest breaks.',
    calculate: (inputs) => {
      const d = Number(inputs.distanceMiles || 450);
      const s = Number(inputs.averageSpeed || 65);
      const b = Number(inputs.restHours || 1.5);

      const movingHours = d / s;
      const totalHours = movingHours + b;

      return {
        results: [
          { label: 'Total Travel Duration', value: `${totalHours.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Moving Time (In Transit)', value: `${movingHours.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Rest / Break Portion', value: `${b.toFixed(1)} Hours` }
        ]
      };
    }
  },
  {
    id: 'travel-packing',
    name: 'Travel Packing Quantity Sizer',
    slug: 'travel-packing',
    category: 'travel',
    description: 'Calculate recommended packing amounts (shirts, socks, toiletries) based on trip duration and laundry access.',
    formula: 'Packing count = Days of trip - (Laundry multiplier)',
    explanation: 'Uses trip duration and laundry details to recommend precise packing quantities, keeping luggage light.',
    example: 'Packing for a 10-day trip with hotel laundry access.',
    inputs: [
      { id: 'tripDaysCount', label: 'Vacation Duration (Days)', type: 'number', defaultValue: 8, min: 1 },
      { id: 'laundryAccess', label: 'Is mid-trip Laundry Access available?', type: 'select', defaultValue: 'no', options: [
        { label: 'No - Pack for full duration', value: 'no' },
        { label: 'Yes - Cut packing quantities in half', value: 'yes' }
      ]}
    ],
    faq: [
      { question: 'What is the "5-4-3-2-1" packing rule?', answer: 'A standard packing rule recommending: 5 pairs of socks/undies, 4 tops, 3 bottoms, 2 pairs of shoes, and 1 hat/jacket for standard week-long trips.' }
    ],
    relatedSlugs: ['trip-budget', 'travel-time'],
    seoTitle: 'Travel Luggage Packing Checklist Sizer',
    seoDescription: 'Calculate recommended packing amounts for vacations. Tailors clothing checklists based on laundry access.',
    calculate: (inputs) => {
      const days = Number(inputs.tripDaysCount || 8);
      const laundry = inputs.laundryAccess || 'no';

      let divisor = 1;
      if (laundry === 'yes') divisor = 2;

      const shirts = Math.ceil(days / divisor);
      const undies = Math.ceil((days + 1) / divisor);
      const pants = Math.ceil(days / (divisor * 3.5)); // wear pants multiple days

      return {
        results: [
          { label: 'Recommended Shirts/Tops', value: Math.max(2, shirts), isPrimary: true },
          { label: 'Recommended Underwear/Socks', value: Math.max(2, undies), isPrimary: true },
          { label: 'Recommended Pants/Trousers', value: Math.max(1, pants) }
        ]
      };
    }
  },
  {
    id: 'route-cost',
    name: 'Road Trip Route Cost & Toll Sizer',
    slug: 'route-cost',
    category: 'travel',
    description: 'Compute tolls, fuel costs, and lodging for long road trips.',
    formula: 'Route Cost = (Distance / MPG * Gas Price) + Tolls + Lodging',
    explanation: 'Calculates road trip expenses to help travelers plan routes and optimize fuel costs.',
    example: 'A 650-mile road trip averaging 24 MPG with $15 in highway tolls.',
    inputs: [
      { id: 'routeDistMiles', label: 'Planned Route Distance (Miles)', type: 'number', defaultValue: 650, min: 1 },
      { id: 'carMpgRating', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 24, min: 5 },
      { id: 'priceGas', label: 'Local Gas Price ($/Gallon)', type: 'number', defaultValue: 3.65, min: 0.1 },
      { id: 'highwayTolls', label: 'Expected Toll Fees ($)', type: 'number', defaultValue: 15, min: 0 }
    ],
    faq: [
      { question: 'How is road trip fuel efficiency optimized?', answer: 'Optimize fuel costs by driving at consistent highway speeds (under 65 mph) and maintaining correct tire pressures.' }
    ],
    relatedSlugs: ['trip-budget', 'travel-time'],
    seoTitle: 'Road Trip Route Toll and Gasoline Expense Calculator',
    seoDescription: 'Calculate road trip fuel and toll expenses. Estimate total route costs based on MPG.',
    calculate: (inputs) => {
      const d = Number(inputs.routeDistMiles || 650);
      const mpg = Number(inputs.carMpgRating || 24);
      const gas = Number(inputs.priceGas || 3.65);
      const tolls = Number(inputs.highwayTolls || 15);

      const fuelUsed = d / mpg;
      const fuelCost = fuelUsed * gas;
      const totalRouteCost = fuelCost + tolls;

      return {
        results: [
          { label: 'Estimated Route Cost', value: totalRouteCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Fuel Expense Portion', value: fuelCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Fuel Volume Consumed', value: `${fuelUsed.toFixed(1)} Gallons` }
        ]
      };
    }
  },

  // ====================================== EDUCATION ======================================
  {
    id: 'learning-time',
    name: 'Skill Learning Time & Fluency Estimator',
    slug: 'learning-time',
    category: 'education',
    description: 'Estimate hours required to achieve professional proficiency in a skill based on study volume.',
    formula: 'Duration Weeks = Target Capability Hours / (Daily study Hours * days/week)',
    explanation: 'Applies study milestones to project the months required to build expertise in any field.',
    example: 'Learning coding or piano to professional levels (1,000 hrs target) studying 2 hours a day, 5 days/week.',
    inputs: [
      { id: 'targetProfLevel', label: 'Target Proficiency Level (Hours)', type: 'select', defaultValue: '1000', options: [
        { label: 'Professional Working Competence (1,000 hrs)', value: '1000' },
        { label: 'Standard Basic Fluency (200 hrs)', value: '200' },
        { label: 'Novice Overview familiarity (40 hrs)', value: '40' }
      ]},
      { id: 'dailyHours', label: 'Daily Study Commitment (Hours)', type: 'number', defaultValue: 2, min: 0.1, max: 15, step: 0.1 },
      { id: 'studyDaysWeek', label: 'Active Study Days per Week', type: 'number', defaultValue: 5, min: 1, max: 7 }
    ],
    faq: [
      { question: 'What is the 10,000-hour rule?', answer: 'Popularized by Malcolm Gladwell, the 10,000-hour rule suggests that achieving elite world-class expertise in highly competitive fields requires roughly 10,000 hours of deliberate practice.' }
    ],
    relatedSlugs: ['skill-progress', 'course-difficulty'],
    seoTitle: 'Skill Learning Time & Deliberate Practice Sizer',
    seoDescription: 'Estimate hours and timeline weeks to achieve proficiency. Plan your daily study schedules.',
    calculate: (inputs) => {
      const targetHours = Number(inputs.targetProfLevel || 1000);
      const daily = Number(inputs.dailyHours || 2);
      const days = Number(inputs.studyDaysWeek || 5);

      const weeklyHours = daily * days;
      const weeksNeeded = targetHours / weeklyHours;
      const monthsNeeded = weeksNeeded / 4.333;

      return {
        results: [
          { label: 'Required Learning Timeline', value: `${monthsNeeded.toFixed(1)} Months`, isPrimary: true },
          { label: 'Equivalent Weeks Count', value: `${weeksNeeded.toFixed(0)} Weeks`, isPrimary: true },
          { label: 'Weekly Study Pace', value: `${weeklyHours} Hours/Week` }
        ]
      };
    }
  },
  {
    id: 'skill-progress',
    name: 'Learning Progress & Milestone Tracker',
    slug: 'skill-progress',
    category: 'education',
    description: 'Track your learning progression and estimate completion dates for study goals.',
    formula: 'Time Remaining = Current Remaining Syllabus / Average pacing velocity',
    explanation: 'Calculates the days required to complete a syllabus based on your current study speed, helping you plan exams.',
    example: 'Completing 12 out of 30 syllabus chapters, studying 3 chapters per week.',
    inputs: [
      { id: 'totalMilestones', label: 'Total Chapters / Milestones in curriculum', type: 'number', defaultValue: 30, min: 1 },
      { id: 'completedChapters', label: 'Completed Milestones', type: 'number', defaultValue: 12, min: 0 },
      { id: 'chaptersPerWeek', label: 'Current Study Pace (Chapters per Week)', type: 'number', defaultValue: 2.5, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'Why track study velocity?', answer: 'Tracking study velocity helps you maintain consistent progress and prevents last-minute cramming before exams.' }
    ],
    relatedSlugs: ['learning-time', 'exam-planning'],
    seoTitle: 'Learning Progress Syllabus Tracker & Completion Forecaster',
    seoDescription: 'Track learning milestones and predict completion dates. Get a realistic study timeline based on speed.',
    calculate: (inputs) => {
      const total = Number(inputs.totalMilestones || 30);
      const comp = Math.min(total, Number(inputs.completedChapters || 12));
      const pace = Number(inputs.chaptersPerWeek || 2.5);

      const remaining = total - comp;
      const weeksRemaining = remaining / pace;

      return {
        results: [
          { label: 'Progress Completed', value: `${((comp / total) * 100).toFixed(1)}%`, isPrimary: true },
          { label: 'Remaining Weeks Needed', value: `${weeksRemaining.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Remaining Items', value: remaining }
        ]
      };
    }
  },
  {
    id: 'study-cost',
    name: 'Tuition Cost & Student ROI Estimator',
    slug: 'study-cost',
    category: 'education',
    description: 'Calculate student loan payments and estimate educational ROI based on starting salaries.',
    formula: 'Educational ROI % = (Expected Starting Salary - Non-degree Wage) / Total Education Investment * 100',
    explanation: 'Models starting salaries and degree costs to calculate educational ROI, helping students make informed choices.',
    example: 'Sizing a $40,000 degree program that secures an $85,000 starting salary.',
    inputs: [
      { id: 'tuitionPerYear', label: 'Tuition & Material Fees per Year ($)', type: 'number', defaultValue: 15000, min: 0 },
      { id: 'programDurationYears', label: 'Program Duration (Years)', type: 'number', defaultValue: 4, min: 1 },
      { id: 'expectedSalary', label: 'Expected Starting Salary after Graduation ($)', type: 'number', defaultValue: 65000, min: 5000 },
      { id: 'baselineSalary', label: 'Alternate Wage without Degree ($) (e.g., $32K)', type: 'number', defaultValue: 32000, min: 0 }
    ],
    faq: [
      { question: 'What is a typical college degree ROI?', answer: 'Highly technical fields (like engineering or medicine) often deliver substantial returns within the first 5 years of graduation.' }
    ],
    relatedSlugs: ['learning-time', 'course-difficulty'],
    seoTitle: 'College Tuition Cost & Starting Salary Student ROI Calculator',
    seoDescription: 'Calculate educational ROI and starting salaries. Balance student loans against starting salaries easily.',
    calculate: (inputs) => {
      const annualTuition = Number(inputs.tuitionPerYear || 15000);
      const years = Number(inputs.programDurationYears || 4);
      const salary = Number(inputs.expectedSalary || 65000);
      const baseSalary = Number(inputs.baselineSalary || 32000);

      const totalTuitionCost = annualTuition * years;
      const salaryDifference = salary - baseSalary;
      const paybackYears = salaryDifference > 0 ? totalTuitionCost / salaryDifference : 0;

      return {
        results: [
          { label: 'Payback Period', value: `${paybackYears.toFixed(1)} Years`, isPrimary: true },
          { label: 'Total Education Outset', value: totalTuitionCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annual Income Increase', value: salaryDifference.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'exam-planning',
    name: 'Standard Study pace Exam planner',
    slug: 'exam-planning',
    category: 'education',
    description: 'Structure exam revisions, calculating total pages or topics to cover per day before an exam.',
    formula: 'Study Pace = Total Pages to cover / Remaining Calendar days',
    explanation: 'Divides syllabus pages over remaining days to plan sustainable study schedules, keeping stress low.',
    example: 'Planning to cover a 450-page biology textbook over 25 remaining calendar days.',
    inputs: [
      { id: 'totalPagesSyllabus', label: 'Total Pages / Chapters to cover', type: 'number', defaultValue: 450, min: 1 },
      { id: 'daysToExam', label: 'Calendar Days Remaining until Exam', type: 'number', defaultValue: 25, min: 1 }
    ],
    faq: [
      { question: 'Why add a review day?', answer: 'Setting aside the final 3 days for practice questions and mock exams improves retention and boosts test-day confidence.' }
    ],
    relatedSlugs: ['skill-progress', 'course-difficulty'],
    seoTitle: 'Syllabus Page count Study Pace Exam planner',
    seoDescription: 'Structure study schedules before exams. Calculate daily page coverage counts easily.',
    calculate: (inputs) => {
      const pages = Number(inputs.totalPagesSyllabus || 450);
      const days = Number(inputs.daysToExam || 25);

      const dailyRate = pages / days;
      // schedule with a 3-day review buffer
      const bufferDays = Math.max(1, days - 3);
      const rateWithBuffer = pages / bufferDays;

      return {
        results: [
          { label: 'Required Daily Study Pace', value: `${dailyRate.toFixed(1)} Pages/Day`, isPrimary: true },
          { label: 'Pace with 3-Day Buffer (Safe)', value: `${rateWithBuffer.toFixed(1)} Pages/Day`, isPrimary: true },
          { label: 'Total Pages to Cover', value: pages }
        ]
      };
    }
  },
  {
    id: 'course-difficulty',
    name: 'Class study workload difficulty Estimator',
    slug: 'course-difficulty',
    category: 'education',
    description: 'Estimate required study hours per week based on credit weight and class complexity factors.',
    formula: 'Weekly Study Hours = Course Credits * Complexity scale factor',
    explanation: 'Uses credit hours and syllabus details to estimate weekly study times, helping students balance course workloads.',
    example: 'A heavy 4-credit chemistry lab course with high complexity factors.',
    inputs: [
      { id: 'courseCredits', label: 'Class Academic Credit Hours (e.g., 3)', type: 'number', defaultValue: 3, min: 1, max: 10 },
      { id: 'difficultyRate', label: 'Course Subject Difficulty Factor', type: 'select', defaultValue: '3', options: [
        { label: 'High / Heavy Reading Lab (3x factor)', value: '3' },
        { label: 'Standard Normal Academic Course (2x factor)', value: '2' },
        { label: 'Introductory Overview Course (1x factor)', value: '1' }
      ]}
    ],
    faq: [
      { question: 'What is the credit hour standard?', answer: 'The academic standard recommends studying 2 hours weekly outside of class for every 1 classroom credit hour.' }
    ],
    relatedSlugs: ['learning-time', 'exam-planning'],
    seoTitle: 'Weekly Academic study Workload credit difficulty Estimator',
    seoDescription: 'Calculate required weekly study times based on course credits and difficulty levels.',
    calculate: (inputs) => {
      const credits = Number(inputs.courseCredits || 3);
      const diff = Number(inputs.difficultyRate || 2);

      const studyHoursWeekVal = credits * diff;

      return {
        results: [
          { label: 'Weekly Study Hours Needed', value: `${studyHoursWeekVal} Hours/Week`, isPrimary: true },
          { label: 'Daily Study Session Target', value: `${(studyHoursWeekVal / 5).toFixed(1)} Hours (5-Day)`, isPrimary: true }
        ]
      };
    }
  },

  // ====================================== HEALTH ======================================
  {
    id: 'health-planning',
    name: 'Calorie Deficit & weight Timeline Planner',
    slug: 'health-planning',
    category: 'health',
    description: 'Calculate weight goal timelines based on calorie deficits and activity levels.',
    formula: 'Required Weeks = (Weight Target lbs * 3,500) / (Daily Calorie Deficit)',
    explanation: 'Estimates safe weight transition timelines based on calorie metrics, helping you plan fitness goals.',
    example: 'Planning to lose 15 lbs with a steady 500-calorie daily deficit.',
    inputs: [
      { id: 'weightGoalLbs', label: 'Total Weight Change Target (lbs / Pounds)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'dailyDeficit', label: 'Target Daily Calorie Deficit', type: 'number', defaultValue: 500, min: 100, max: 1500 }
    ],
    faq: [
      { question: 'What is a safe weight loss pace?', answer: 'Losing 1 to 2 lbs per week is widely considered the maximum safe and sustainable pace for long-term health.' }
    ],
    relatedSlugs: ['lifestyle-score', 'sleep-schedule'],
    seoTitle: 'Calorie Deficit & weight transition Timeline Planner',
    seoDescription: 'Predict weight goal timelines based on safe daily calorie deficits. Achieve fitness goals healthily.',
    calculate: (inputs) => {
      const lbs = Number(inputs.weightGoalLbs || 15);
      const deficit = Number(inputs.dailyDeficit || 500);

      const totalCalories = lbs * 3500;
      const daysNeeded = totalCalories / deficit;
      const weeksNeeded = daysNeeded / 7;

      return {
        results: [
          { label: 'Required Timeline', value: `${weeksNeeded.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Pace per Week', value: `${(deficit * 7 / 3500).toFixed(2)} lbs / Week`, isPrimary: true },
          { label: 'Cumulative Calorie Burn', value: totalCalories }
        ]
      };
    }
  },
  {
    id: 'lifestyle-score',
    name: 'Lifestyle Habits Health Rater',
    slug: 'lifestyle-score',
    category: 'health',
    description: 'Assess activity levels, water, and sleep to generate a comprehensive lifestyle rating.',
    formula: 'Score = Water points + Sleep points + Activity levels',
    explanation: 'Reviews positive lifestyle habits to help you build balanced personal schedules.',
    example: 'Consuming 10 glasses of water, sleeping 7 hours, and exercising 30 minutes a day.',
    inputs: [
      { id: 'waterGlasses', label: 'Water Consumed per Day (Glasses)', type: 'number', defaultValue: 8, min: 1 },
      { id: 'sleepHrs', label: 'Average Rest Sleep (Hours)', type: 'number', defaultValue: 7.5, min: 1, max: 24 },
      { id: 'exerciseMins', label: 'Active Physical Exercise (Mins/Day)', type: 'number', defaultValue: 30, min: 0 }
    ],
    faq: [
      { question: 'Why is hydration critical?', answer: 'Correct hydration increases metabolic processes and maintains concentration levels throughout your workday.' }
    ],
    relatedSlugs: ['health-planning', 'sleep-schedule'],
    seoTitle: 'Lifestyle Habit Health Rating score Sizer',
    seoDescription: 'Benchmark your personal lifestyle habits. Evaluate daily water, sleep, and exercise scores easily.',
    calculate: (inputs) => {
      const water = Number(inputs.waterGlasses || 8);
      const sleep = Number(inputs.sleepHrs || 7.5);
      const exercise = Number(inputs.exerciseMins || 30);

      // Simple scoring model out of 100
      let sc = 0;
      if (water >= 8) sc += 30; else sc += water * 3.5;
      if (sleep >= 7 && sleep <= 9) sc += 40; else sc += 20;
      if (exercise >= 30) sc += 30; else sc += exercise * 1;

      return {
        results: [
          { label: 'Habits Quality Rating Score', value: `${sc} / 100`, isPrimary: true },
          { label: 'Lifestyle Tier Group', value: sc >= 85 ? 'Highly Well-Balanced' : sc >= 60 ? 'Standard Alignment' : 'Training Optimization Recommended', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'sleep-schedule',
    name: 'Optimal Sleep Cycle Bedtime planner',
    slug: 'sleep-schedule',
    category: 'health',
    description: 'Calculate bedtime and wake up times based on standard 90-minute sleep cycles.',
    formula: 'Wake Up = Bedtime + (90 Mins * Cycle count) + 14 Mins to sleep',
    explanation: 'Avoid waking up mid-cycle to prevent grogginess and improve cognitive focus.',
    example: 'Planning to wake up at 7:00 AM requires a sleep schedule that fits standard cycle times.',
    inputs: [
      { id: 'wakeTime', label: 'Target Wake Up Time', type: 'select', defaultValue: '07:00', options: [
        { label: '06:00 AM', value: '06:00' },
        { label: '07:00 AM', value: '07:00' },
        { label: '08:00 AM', value: '08:00' }
      ]}
    ],
    faq: [
      { question: 'Why 90 minutes?', answer: 'The human brain proceeds through stages of light, deep, and REM sleep in ~90-minute waves. Waking up at the end of a cycle naturally avoids waking grogginess.' }
    ],
    relatedSlugs: ['lifestyle-score', 'health-planning'],
    seoTitle: 'Sleep Cycle Bedtime & Wake up Time Planner',
    seoDescription: 'Calculate optimal sleep schedules. Avoid waking up mid-cycle to prevent morning grogginess.',
    calculate: (inputs) => {
      const wake = inputs.wakeTime || '07:00';
      const [wh, wm] = wake.split(':').map(Number);

      // Calculate backwards for 5 cycles (7.5 hours) + 14 mins to fall asleep
      const totalSleepMinutes = (5 * 90) + 14;
      let wakeMinutesTotal = wh * 60 + wm;
      let bedMinutesTotal = (wakeMinutesTotal - totalSleepMinutes + 1440) % 1440;

      const bh = Math.floor(bedMinutesTotal / 60);
      const bm = bedMinutesTotal % 60;
      const bedStr = `${bh.toString().padStart(2, '0')}:${bm.toString().padStart(2, '0')}`;

      return {
        results: [
          { label: 'Recommended Bedtime', value: bedStr, isPrimary: true },
          { label: 'Designed Sleep cycles', value: '5 Cycles (7.5 hours)', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'nutrition-calc',
    name: 'Daily Macronutrient (Macros) Target Sizer',
    slug: 'nutrition-calc',
    category: 'health',
    description: 'Calculate protein, carbohydrate, and fat gram targets based on daily calorie goals and body composition targets.',
    formula: 'Protein grams = Calorie share / 4 | Fat grams = share / 9 | Carbs = share / 4',
    explanation: 'Models optimal macronutrient targets, helping athletes and fitness enthusiasts balance diets.',
    example: 'A 2,000 calorie plan designed with a 40/30/30 (Carbs/Protein/Fat) macro ratio.',
    inputs: [
      { id: 'dailyCalories', label: 'Daily Calorie Goal (Calories)', type: 'number', defaultValue: 2000, min: 800 },
      { id: 'dietPattern', label: 'Target Macro Ratio Pattern', type: 'select', defaultValue: 'balanced', options: [
        { label: 'Balanced Lifestyle (40% C / 30% P / 30% F)', value: 'balanced' },
        { label: 'High Protein Fitness (35% C / 45% P / 20% F)', value: 'muscle' },
        { label: 'Lower Carbohydrate (15% C / 45% P / 40% F)', value: 'lowcarb' }
      ]}
    ],
    faq: [
      { question: 'Why do macro gram values differ?', answer: 'Protein and carbs contain 4 calories per gram, while dietary fats contain 9 calories per gram, so fats have a higher calorie-to-weight ratio.' }
    ],
    relatedSlugs: ['wellness-calc', 'health-planning'],
    seoTitle: 'Daily Macronutrient Macros target gram Sizer',
    seoDescription: 'Calculate calorie and macronutrient targets. Customize protein, carb, and fat balances easily.',
    calculate: (inputs) => {
      const cal = Number(inputs.dailyCalories || 2000);
      const pattern = inputs.dietPattern || 'balanced';

      let carbPct = 0.40, protPct = 0.30, fatPct = 0.30;
      if (pattern === 'muscle') {
        carbPct = 0.35; protPct = 0.45; fatPct = 0.20;
      } else if (pattern === 'lowcarb') {
        carbPct = 0.15; protPct = 0.45; fatPct = 0.40;
      }

      const carbsG = (cal * carbPct) / 4;
      const protG = (cal * protPct) / 4;
      const fatG = (cal * fatPct) / 9;

      return {
        results: [
          { label: 'Protein Target Grams', value: `${protG.toFixed(0)} g`, isPrimary: true },
          { label: 'Carbs Target Grams', value: `${carbsG.toFixed(0)} g`, isPrimary: true },
          { label: 'Fat Target Grams', value: `${fatG.toFixed(0)} g`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'wellness-calc',
    name: 'Daily Hydration & Metabolic Rate Sizer',
    slug: 'wellness-calc',
    category: 'health',
    description: 'Calculate daily hydration and metabolic water targets based on weight and activity level.',
    formula: 'Hydrating Liters = Weight in kg * 0.035 + Activity exercise additions',
    explanation: 'Estimates daily hydration needs to prevent dehydration and support metabolic health during exercise.',
    example: 'Hydration needs for a 75 kg person practicing 45 minutes of daily exercise.',
    inputs: [
      { id: 'bodyWeightKg', label: 'Body Weight (kg)', type: 'number', defaultValue: 75, min: 20 },
      { id: 'exerciseMinutes', label: 'Daily Exercise Duration (Mins)', type: 'number', defaultValue: 45, min: 0 }
    ],
    faq: [
      { question: 'Does tea or coffee support hydration targets?', answer: 'Yes! Mildly caffeinated beverages like tea and coffee contribute to your daily hydration goals.' }
    ],
    relatedSlugs: ['lifestyle-score', 'nutrition-calc'],
    seoTitle: 'Daily Hydration & Active Exercise Water Volume Calculator',
    seoDescription: 'Calculate daily hydration and metabolic water targets based on body weight and exercise levels.',
    calculate: (inputs) => {
      const kg = Number(inputs.bodyWeightKg || 75);
      const mins = Number(inputs.exerciseMinutes || 45);

      const baseWaterL = kg * 0.035;
      const exerciseLossL = (mins / 30) * 0.35; // 350ml extra for every 30 mins exercise
      const totalWaterL = baseWaterL + exerciseLossL;

      return {
        results: [
          { label: 'Daily Water Hydration', value: `${totalWaterL.toFixed(2)} Liters`, isPrimary: true },
          { label: 'Baseline Metabolic Target', value: `${baseWaterL.toFixed(2)} Liters`, isPrimary: true },
          { label: 'Exercise Loss Buffer', value: `${exerciseLossL.toFixed(2)} Liters` }
        ]
      };
    }
  },

  // ====================================== FINANCE ======================================
  {
    id: 'money-mgmt',
    name: '50/30/20 Income Budget Planner',
    slug: 'money-mgmt',
    category: 'finance',
    description: 'Budget your monthly income using the 50/30/20 rule (Needs, Wants, Savings).',
    formula: 'Needs = 50% | Wants = 30% | Savings/Debt = 20%',
    explanation: 'Uses the popular 50/30/20 budgeting rule to balance living expenses, savings, and discretionary spending.',
    example: 'Partitioning a $4,500 monthly net salary to maximize savings.',
    inputs: [
      { id: 'monthlyIncome', label: 'Monthly Net Income ($) (After taxes)', type: 'number', defaultValue: 4500, min: 100 }
    ],
    faq: [
      { question: 'What fits into "Needs"?', answer: 'Needs include essential living expenses like rent or mortgage, utility bills, groceries, and minimum debt payments.' }
    ],
    relatedSlugs: ['savings-goal-calc', 'investment-projection'],
    seoTitle: '50/30/20 Rule Monthly Income Budget Planner',
    seoDescription: 'Budget monthly income with the 50/30/20 rule. Balance essential needs, wants, and savings goals easily.',
    calculate: (inputs) => {
      const inc = Number(inputs.monthlyIncome || 4500);

      const needs = inc * 0.50;
      const wants = inc * 0.30;
      const savings = inc * 0.20;

      return {
        results: [
          { label: 'Needs Allocation (50%)', value: needs.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Wants Allowance (30%)', value: wants.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Savings/Debt Payoff (20%)', value: savings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'financial-planning',
    name: 'Retirement Wealth Longevity planner',
    slug: 'financial-planning',
    category: 'finance',
    description: 'Estimate your retirement savings timeline and safe monthly withdrawals.',
    formula: 'Safe annual withdrawal = Portfolio value * 4%',
    explanation: 'Uses the standard 4% safe withdrawal rule to estimate retirement timelines and prevent outliving your savings.',
    example: 'Modeling standard payouts for a $750,000 retirement portfolio investment.',
    inputs: [
      { id: 'portfolioVal', label: 'Target Retirement Savings Value ($)', type: 'number', defaultValue: 750000, min: 1000 },
      { id: 'annualWithdrawPct', label: 'Annual Safe Withdrawal Rate (%)', type: 'number', defaultValue: 4.0, min: 1, max: 15, step: 0.1 }
    ],
    faq: [
      { question: 'What is the 4% rule?', answer: 'The 4% rule is an industry benchmark suggesting that withdrawing 4% of your retirement portfolio annually, adjusted for inflation, ensures your savings last at least 30 years.' }
    ],
    relatedSlugs: ['money-mgmt', 'budget-forecast'],
    seoTitle: 'Retirement Wealth Longevity & Safe Withdrawal Rate Calculator',
    seoDescription: 'Estimate your retirement timeline. Calculate annual safe withdrawals based on portfolio sizes.',
    calculate: (inputs) => {
      const value = Number(inputs.portfolioVal || 750000);
      const rate = Number(inputs.annualWithdrawPct || 4.0) / 100;

      const annualSafe = value * rate;
      const monthlySafe = annualSafe / 12;

      return {
        results: [
          { label: 'Annual Safe Withdrawal Amount', value: annualSafe.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Equivalent Monthly Budget', value: monthlySafe.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'savings-goal-calc',
    name: 'Savings Goal Monthly planner',
    slug: 'savings-goal-calc',
    category: 'finance',
    description: 'Calculate required monthly savings to achieve your financial goals within a specific timeline, factoring in compound interest.',
    formula: 'Monthly Savings = (Target * r) / ((1 + r)^n - 1)\nWhere r is the monthly interest rate, n is the total months.',
    explanation: 'Models compound interest to calculate the required monthly savings to hit your deposit goals.',
    example: 'Saving $20,000 for a home downpayment over a 3-year period.',
    inputs: [
      { id: 'goalTargetAmount', label: 'Savings Goal Target ($)', type: 'number', defaultValue: 20000, min: 100 },
      { id: 'timeHorizonMonths', label: 'Timeline to Target (Months)', type: 'number', defaultValue: 36, min: 1 },
      { id: 'interestRatePct', label: 'Annual Interest Rate (APY) (%)', type: 'number', defaultValue: 4.5, min: 0 }
    ],
    faq: [
      { question: 'Why does compound interest help?', answer: 'Compounding allows you to earn interest on your interest, reducing the direct monthly savings needed to hit your financial goals.' }
    ],
    relatedSlugs: ['money-mgmt', 'investment-projection'],
    seoTitle: 'Compound Interest Savings Goal Monthly Planner',
    seoDescription: 'Calculate required monthly savings to hit your financial goals. Budget for downpayments and deposits easily.',
    calculate: (inputs) => {
      const tgt = Number(inputs.goalTargetAmount || 20000);
      const months = Number(inputs.timeHorizonMonths || 36);
      const apy = Number(inputs.interestRatePct || 4.5) / 100;

      let monthlyPace = tgt / months;
      if (apy > 0) {
        const r = apy / 12;
        monthlyPace = (tgt * r) / (Math.pow(1 + r, months) - 1);
      }

      const totalPrincipalDepositedVal = monthlyPace * months;
      const totalInterestEarnedVal = tgt - totalPrincipalDepositedVal;

      return {
        results: [
          { label: 'Required Monthly Savings Pace', value: monthlyPace.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Total Principal Deposited', value: totalPrincipalDepositedVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Compound Interest Gained', value: totalInterestEarnedVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'investment-projection',
    name: 'Investment Projection Compound returns Tool',
    slug: 'investment-projection',
    category: 'finance',
    description: 'Project retirement wealth growth by factoring in compound returns and continuous monthly contributions.',
    formula: 'Future Value = Principal * (1 + r)^n + PMT * [((1 + r)^n - 1)/r]',
    explanation: 'Models investment growth based on monthly contributions and stock market indices, helping you plan retirement goals.',
    example: 'Depositing $300 monthly into indexed funds averaging 8% annual returns over 25 years.',
    inputs: [
      { id: 'startingPrincipal', label: 'Initial Investment Portfolio ($)', type: 'number', defaultValue: 5000, min: 0 },
      { id: 'monthlyDeposit', label: 'Recurring Monthly Deposit Amount ($)', type: 'number', defaultValue: 300, min: 0 },
      { id: 'rateApy', label: 'Projected Annual Return Rate (APY) (%)', type: 'number', defaultValue: 8.0, min: 0 },
      { id: 'yearsHorizon', label: 'Investment Timeline Horizon (Years)', type: 'number', defaultValue: 25, min: 1, max: 50 }
    ],
    faq: [
      { question: 'What are typical market returns?', answer: 'The S&P 500 has averaged roughly 8% to 10% in annual nominal returns over the last century, making index funds a popular choice for long-term growth.' }
    ],
    relatedSlugs: ['savings-goal-calc', 'budget-forecast'],
    seoTitle: 'Annual Stock Market Index Compound Returns Calculator',
    seoDescription: 'Project investment growth and compound returns. Estimate future retirement wealth based on recurring contributions.',
    calculate: (inputs) => {
      const p = Number(inputs.startingPrincipal || 5000);
      const pmt = Number(inputs.monthlyDeposit || 300);
      const apy = Number(inputs.rateApy || 8.0) / 100;
      const yrs = Number(inputs.yearsHorizon || 25);

      const n = yrs * 12;
      const r = apy / 12;

      let fv = p;
      if (r > 0) {
        const principalComp = p * Math.pow(1 + r, n);
        const continuousComp = pmt * ((Math.pow(1 + r, n) - 1) / r);
        fv = principalComp + continuousComp;
      } else {
        fv = p + (pmt * n);
      }

      const totalDeposited = p + (pmt * n);
      const cumulativeInterest = Math.max(0, fv - totalDeposited);

      return {
        results: [
          { label: 'Projected Future Balance', value: fv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Estimated Balance Earned', value: cumulativeInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Cash Invested', value: totalDeposited.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'budget-forecast',
    name: '12-Month Cash Balance Forecaster',
    slug: 'budget-forecast',
    category: 'finance',
    description: 'Forecast monthly cash balances over a 12-month period based on income and recurring expenses.',
    formula: 'Ending Cash Balance = Starting Cash + Total Income - Total Expenses',
    explanation: 'Tracks monthly cash flows to help you project net worth and improve savings rates.',
    example: 'Estimating monthly cash balances based on a $4,500 income and $3,200 in monthly expenses.',
    inputs: [
      { id: 'activeBaseCash', label: 'Starting Liquid Cash Balance ($)', type: 'number', defaultValue: 10000, min: 0 },
      { id: 'allIncome', label: 'Monthly Household Net Income ($)', type: 'number', defaultValue: 4500, min: 0 },
      { id: 'allExpenses', label: 'Monthly Budget Expenses Cost ($)', type: 'number', defaultValue: 3200, min: 0 }
    ],
    faq: [
      { question: 'Why check monthly cash flows?', answer: 'Tracking cash flows reveals discretionary spending trends and helps you optimize savings to grow your emergency fund.' }
    ],
    relatedSlugs: ['money-mgmt', 'savings-goal-calc'],
    seoTitle: 'Household Net Worth Cash Balance 12-Month Forecaster',
    seoDescription: 'Forecast monthly cash balances and net worth. Project savings growth based on income and expenses.',
    calculate: (inputs) => {
      const base = Number(inputs.activeBaseCash || 10000);
      const inc = Number(inputs.allIncome || 4500);
      const exp = Number(inputs.allExpenses || 3200);

      const netMonthlyFlow = inc - exp;
      const endYearBalanceVal = base + (netMonthlyFlow * 12);

      return {
        results: [
          { label: 'Projected Cash Balance (12M)', value: endYearBalanceVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Net Monthly Earnings', value: netMonthlyFlow.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true }
        ]
      };
    }
  },

  // ====================================== BUSINESS ======================================
  {
    id: 'business-planning',
    name: 'Startup runway and Burn Rate Calculator',
    slug: 'business-planning',
    category: 'business',
    description: 'Calculate cash runways and monthly burn rates for startup operations.',
    formula: 'Cash Runway (Months) = Starting Capital / Net Monthly Burn',
    explanation: 'Models monthly spending to calculate startup runways, helping founders plan funding rounds.',
    example: 'A startup with $150,000 in cash reserves spending $12,500 net per month.',
    inputs: [
      { id: 'currentCapital', label: 'Available Cash Reserves ($)', type: 'number', defaultValue: 150000, min: 100 },
      { id: 'revenueMonthly', label: 'Monthly Business Revenue ($)', type: 'number', defaultValue: 4500, min: 0 },
      { id: 'expenseMonthly', label: 'Monthly Operating Costs ($)', type: 'number', defaultValue: 17000, min: 100 }
    ],
    faq: [
      { question: 'What is a safe cash runway?', answer: 'Standard startup practice recommends maintaining a cash runway of 12 to 18 months, giving you enough time to achieve profitability or raise fresh capital.' }
    ],
    relatedSlugs: ['sales-forecast', 'business-cost-calc'],
    seoTitle: 'Startup Cash Runway, Burn Rate & Funding Calculator',
    seoDescription: 'Calculate cash runways and monthly burn rates. Plan startup operations budgets easily.',
    calculate: (inputs) => {
      const cap = Number(inputs.currentCapital || 150000);
      const rev = Number(inputs.revenueMonthly || 4500);
      const exp = Number(inputs.expenseMonthly || 17000);

      const netBurn = Math.max(0, exp - rev);
      const runwayMonths = netBurn > 0 ? cap / netBurn : Infinity;

      return {
        results: [
          { label: 'Startup Runway (Months)', value: netBurn > 0 ? `${runwayMonths.toFixed(1)} Months` : 'Infinite Runway (Profitable!)', isPrimary: true },
          { label: 'Net Monthly Burn Rate', value: netBurn.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Operational Loss Portion', value: exp.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'sales-forecast',
    name: 'Business Lead Pipeline Sales Forecaster',
    slug: 'sales-forecast',
    category: 'business',
    description: 'Forecast sales revenues based on conversion pipelines and average deal sizes.',
    formula: 'Sales Volume = Total Leads * Conversion % * Average Deal Size',
    explanation: 'Models sales funnels to estimate annual revenue, helping teams plan sales pipelines.',
    example: 'A sales pipeline with 2,500 active leads, a 4% conversion rate, and a $1,200 average deal size.',
    inputs: [
      { id: 'leadsCount', label: 'Total Leads in Pipeline', type: 'number', defaultValue: 2500, min: 1 },
      { id: 'conversionRatePct', label: 'Lead Conversion Rate (%)', type: 'number', defaultValue: 4.0, min: 0.1, max: 100, step: 0.1 },
      { id: 'avgDealSize', label: 'Average Deal Size ($)', type: 'number', defaultValue: 1200, min: 10 }
    ],
    faq: [
      { question: 'How is lead conversion rate defined?', answer: 'The percentage of raw inbound leads that successfully purchase products or sign custom service contracts.' }
    ],
    relatedSlugs: ['customer-growth', 'profit-projection'],
    seoTitle: 'Business Sales Pipeline Conversion & Revenue Forecaster',
    seoDescription: 'Forecast monthly and annual sales revenues. Model deal sizes and conversions across business pipelines.',
    calculate: (inputs) => {
      const leads = Number(inputs.leadsCount || 2500);
      const conv = Number(inputs.conversionRatePct || 4.0) / 100;
      const deal = Number(inputs.avgDealSize || 1200);

      const dealsWon = leads * conv;
      const estimatedRevenuesVal = dealsWon * deal;

      return {
        results: [
          { label: 'Projected Sales Revenue', value: estimatedRevenuesVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Deals Won / Conversions', value: Math.round(dealsWon).toLocaleString(), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'customer-growth',
    name: 'LTV to CAC Ratio customer Sizer',
    slug: 'customer-growth',
    category: 'business',
    description: 'Calculate Customer Acquisition Cost (CAC) and Customer Lifetime Value (LTV) to evaluate business unit economics.',
    formula: 'LTV:CAC Ratio = (Lifetime Value per User) / (Average Acquisition Cost)',
    explanation: 'Measures marketing efficiency to help SaaS founders optimize ad budgets and scale acquisitions.',
    example: 'An LLC with an average CAC of $45 and LTV of $180 returns a strong 4.0 LTV:CAC ratio.',
    inputs: [
      { id: 'customerLtv', label: 'Customer Lifetime Value (LTV) ($)', type: 'number', defaultValue: 180, min: 1 },
      { id: 'customerCac', label: 'Customer Acquisition Cost (CAC) ($)', type: 'number', defaultValue: 45, min: 1 }
    ],
    faq: [
      { question: 'What is a sustainable LTV:CAC ratio?', answer: 'SaaS platforms typically target an LTV:CAC ratio of 3.0 or higher. Ratios above 4.0 indicate highly efficient marketing systems.' }
    ],
    relatedSlugs: ['sales-forecast', 'profit-projection'],
    seoTitle: 'LTV to CAC Corporate Unit Economics Ratio Sizer',
    seoDescription: 'Calculate Customer Lifetime Value (LTV) and CAC ratios to optimize marketing ad spend and user metrics.',
    calculate: (inputs) => {
      const ltv = Number(inputs.customerLtv || 180);
      const cac = Number(inputs.customerCac || 45);

      const ratio = ltv / cac;
      let scoreText = 'Profitable Unit Scale (Optimal)';
      if (ratio < 1.0) scoreText = 'Unsustainable: Cost exceeds return';
      else if (ratio < 3.0) scoreText = 'Marginal Efficiency: Consider optimizing CAC';

      return {
        results: [
          { label: 'LTV to CAC Ratio Rating', value: `${ratio.toFixed(2)}x`, isPrimary: true },
          { label: 'Customer Unit Quality tier', value: scoreText, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'business-cost-calc',
    name: 'Company Operations & overhead Cost Sizer',
    slug: 'business-cost-calc',
    category: 'business',
    description: 'Calculate total operational costs by compiling overhead, payroll, rent, and software.',
    formula: 'Total Cost = Rent + Software + Staff Salaries + Miscellaneous Reserves',
    explanation: 'Consolidates business expenses to calculate net profitability, helping entrepreneurs control budgets.',
    example: 'A business spending $4,500 monthly on software and $15,000 on staff payroll.',
    inputs: [
      { id: 'rentOfficeMonthly', label: 'Office Rent / Workspace Costs ($/Month)', type: 'number', defaultValue: 2500, min: 0 },
      { id: 'saasSoftwareCost', label: 'SaaS Software & Tool Subscriptions ($/Month)', type: 'number', defaultValue: 1200, min: 0 },
      { id: 'staffPayrollMonthly', label: 'Staff Payroll Costs ($/Month)', type: 'number', defaultValue: 16000, min: 0 }
    ],
    faq: [
      { question: 'Why separate SaaS software costs?', answer: 'Software subscriptions are typically fixed recurring costs, whereas payroll and marketing can be adjusted based on revenue cycles.' }
    ],
    relatedSlugs: ['business-planning', 'profit-projection'],
    seoTitle: 'Corporate operating Costs & Monthly Burn Rate Calculator',
    seoDescription: 'Calculate business operational costs. Budget for rent, payroll, software, and miscellaneous overheads.',
    calculate: (inputs) => {
      const rent = Number(inputs.rentOfficeMonthly || 2500);
      const saas = Number(inputs.saasSoftwareCost || 1200);
      const payroll = Number(inputs.staffPayrollMonthly || 16000);

      const totalMonthlyCostVal = rent + saas + payroll;
      const annualBurnRateVal = totalMonthlyCostVal * 12;

      return {
        results: [
          { label: 'Monthly Operating Expenses', value: totalMonthlyCostVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Annual Operations Cost', value: annualBurnRateVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'profit-projection',
    name: 'Business Profit Margin Projection Sizer',
    slug: 'profit-projection',
    category: 'business',
    description: 'Calculate net profit margins and gross margins based on pricing and volume.',
    formula: 'Net Margin % = ((Revenue - Expenses) / Revenue) * 100',
    explanation: 'Models pricing and expenses to project gross and net profit margins, helping entrepreneurs optimize profitability.',
    example: 'Selling 1,000 retail items monthly at $45, with $31,500 in total expenses.',
    inputs: [
      { id: 'salesVolume', label: 'Monthly Sales Volume (Units)', type: 'number', defaultValue: 1200, min: 1 },
      { id: 'pricePerUnit', label: 'Average Unit Selling Price ($)', type: 'number', defaultValue: 35, min: 1 },
      { id: 'totalCostMonthly', label: 'Total Cumulative Operational Costs ($)', type: 'number', defaultValue: 28000, min: 1 }
    ],
    faq: [
      { question: 'What is a typical healthy net profit margin?', answer: 'Typical healthy net profit margins range from 10% to 25%, depending on the business sector and operational scale.' }
    ],
    relatedSlugs: ['business-cost-calc', 'customer-growth'],
    seoTitle: 'Corporate Gross & Net Profit Margin Projections Sizer',
    seoDescription: 'Calculate gross and net profit margins. Model unit prices, volumes, and overhead costs easily.',
    calculate: (inputs) => {
      const vol = Number(inputs.salesVolume || 1200);
      const price = Number(inputs.pricePerUnit || 35);
      const cost = Number(inputs.totalCostMonthly || 28000);

      const totalRevenue = vol * price;
      const netProfitVal = totalRevenue - cost;
      const profitMarginPct = totalRevenue > 0 ? (netProfitVal / totalRevenue) * 100 : 0;

      return {
        results: [
          { label: 'Projected Net Profit', value: netProfitVal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Calculated Net Profit Margin', value: `${profitMarginPct.toFixed(2)}%`, isPrimary: true },
          { label: 'Cumulative Monthly Revenues', value: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  }
];
