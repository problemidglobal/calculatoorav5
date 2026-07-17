import { Calculator } from '../types';

export const FITNESS_CALCULATORS: Calculator[] = [
  {
    id: 'running-pace-calculator',
    name: 'Running Pace Calculator',
    slug: 'running-pace-calculator',
    category: 'fitness',
    description: 'Calculate your required target running pace or determine your average pace over completed run durations.',
    seoTitle: 'Running Pace & Training Split Calculator | Calculatoora',
    seoDescription: 'Input distance and time to compute your exact minutes-per-mile or minutes-per-kilometer running pace. Ideal for marathon training.',
    inputs: [
      { id: 'distance', label: 'Distance', type: 'number', defaultValue: 5, step: 0.1, unit: 'km' },
      { id: 'hours', label: 'Duration Hours', type: 'number', defaultValue: 0, step: 1 },
      { id: 'minutes', label: 'Duration Minutes', type: 'number', defaultValue: 25, step: 1 },
      { id: 'seconds', label: 'Duration Seconds', type: 'number', defaultValue: 0, step: 1 }
    ],
    formula: 'Pace = Total Time in Minutes / Distance',
    explanation: 'Pacing measures the time required to cross a single unit of distance. It helps athletes map precise race targets.',
    example: 'Running a 5k distance in exactly 25 minutes results in an average pace of 5:00 minutes per kilometer.',
    faq: [
      { question: 'What is minutes per mile vs minutes per km?', answer: 'Pace is relative to the unit configuration. 5:00/km is approximately equivalent to an 8:03/mile pace.' }
    ],
    relatedSlugs: ['running-speed-calculator', 'exercise-calories-calculator', 'target-heart-rate-calculator'],
    calculate: (inputs) => {
      const dist = Number(inputs.distance) || 1;
      const h = Number(inputs.hours) || 0;
      const m = Number(inputs.minutes) || 0;
      const s = Number(inputs.seconds) || 0;

      const totalSeconds = (h * 3600) + (m * 60) + s;
      const paceSec = totalSeconds / dist;

      const paceMinStr = Math.floor(paceSec / 60);
      const paceSecStr = Math.round(paceSec % 60).toString().padStart(2, '0');

      return {
        results: [
          { label: 'Calculated Average Running Pace', value: `${paceMinStr}:${paceSecStr}`, unit: 'min/unit', isPrimary: true },
          { label: 'Total Tracked Seconds', value: totalSeconds.toString(), unit: 'seconds' }
        ],
        chartData: [
          { name: 'Average Pace (sec)', value: Math.round(paceSec), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'running-speed-calculator',
    name: 'Running Speed Calculator',
    slug: 'running-speed-calculator',
    category: 'fitness',
    description: 'Convert run times and distance parameters into absolute velocities (miles-per-hour or kilometers-per-hour).',
    seoTitle: 'Running Speed conversion Calculator | Calculatoora',
    seoDescription: 'Convert running pace metrics into miles-per-hour and kilometers-per-hour instantly.',
    inputs: [
      { id: 'distance', label: 'Distance', type: 'number', defaultValue: 10, step: 0.1, unit: 'km' },
      { id: 'hours', label: 'Time (Hours)', type: 'number', defaultValue: 1, step: 1 },
      { id: 'minutes', label: 'Time (Minutes)', type: 'number', defaultValue: 0, step: 1 }
    ],
    formula: 'Speed = Distance / Time (Hours)',
    explanation: 'Converts running splits into sustained speeds, helpful for comparing treadmill velocities with track metrics.',
    example: 'Running 10 kilometers in 1 hour corresponds to an average running speed of 10.00 km/h.',
    faq: [
      { question: 'How is speed connected to pacing?', answer: 'Speed is distance over time, whereas pace is time over distance. They are mathematically inverse.' }
    ],
    relatedSlugs: ['running-pace-calculator', 'exercise-calories-calculator', 'target-heart-rate-calculator'],
    calculate: (inputs) => {
      const d = Number(inputs.distance) || 1;
      const h = Number(inputs.hours) || 0;
      const m = Number(inputs.minutes) || 0;

      const hoursTotal = h + (m / 60);
      const speed = hoursTotal > 0 ? d / hoursTotal : 0;

      return {
        results: [
          { label: 'Sustained Speed', value: speed.toFixed(2), unit: 'units/hour', isPrimary: true },
          { label: 'Calculated Time Hours', value: hoursTotal.toFixed(3), unit: 'hours' }
        ],
        chartData: [
          { name: 'Sustained Speed Speed', value: Math.round(speed * 10), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'walking-calories-calculator',
    name: 'Walking Calories Calculator',
    slug: 'walking-calories-calculator',
    category: 'fitness',
    description: 'Calculate calories burned while walking, factoring in body weight, distance, and speed.',
    seoTitle: 'Calculate Calories Burned Walking | Calculatoora',
    seoDescription: 'Find out how many calories you burn walking or hiking based on distance and body weight.',
    inputs: [
      { id: 'weight', label: 'Body weight', type: 'number', defaultValue: 155, step: 5, unit: 'lbs' },
      { id: 'distance', label: 'Walking Distance', type: 'number', defaultValue: 3.5, step: 0.1, unit: 'miles' },
      { id: 'speed', label: 'Walking Speed (Pace)', type: 'select', defaultValue: '3.0', options: [
        { label: 'Stout Stroll (2.0 mph)', value: '2.0' },
        { label: 'Moderate Pace (3.0 mph)', value: '3.0' },
        { label: 'Brisk Fitness Walk (4.0 mph)', value: '4.0' }
      ]}
    ],
    formula: 'Calories = 0.5 * Weight (lbs) * Distance (miles) * MET adjustments',
    explanation: 'Walking is a remarkable cardiovascular baseline practice. Energy requirements scale up with body weight and distance.',
    example: 'A 155lb person walking brickly for 3.5 miles at a 3.0 mph pace burns approximately 271 calories.',
    faq: [
      { question: 'Does uphill walking burn more calories?', answer: 'Yes, adding incline terrain climbs forces muscle fibers to work against gravity, increasing metabolic demands.' }
    ],
    relatedSlugs: ['exercise-calories-calculator', 'running-pace-calculator', 'water-intake-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 150;
      const d = Number(inputs.distance) || 0;
      const sp = Number(inputs.speed) || 3.0;

      // Base walking calories coefficient
      const baseBurn = 0.5 * w * d;
      let multiplier = 1.0;
      if (sp === 2.0) multiplier = 0.85;
      else if (sp === 4.0) multiplier = 1.25;

      const finalBurn = baseBurn * multiplier;

      return {
        results: [
          { label: 'Estimated Walking Calories Burned', value: finalBurn.toFixed(0), unit: 'kcal', isPrimary: true },
          { label: 'Target Distance Cleared', value: d.toFixed(1), unit: 'miles' }
        ],
        chartData: [
          { name: 'Estimated Calories Burned', value: Math.round(finalBurn), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'exercise-calories-calculator',
    name: 'Exercise Calories Calculator',
    slug: 'exercise-calories-calculator',
    category: 'fitness',
    description: 'Calculate calories burned across popular activities using medical MET (Metabolic Equivalent of Task) values.',
    seoTitle: 'Calculate Exercise Calories Burned | Calculatoora',
    seoDescription: 'Obtain metabolic calories burned tracking. Calculate energy output across multi-sport disciplines.',
    inputs: [
      { id: 'weight', label: 'Body Weight (kg)', type: 'number', defaultValue: 75, step: 1, unit: 'kg' },
      { id: 'duration', label: 'Workout Duration', type: 'number', defaultValue: 45, step: 5, unit: 'minutes' },
      { id: 'sport', label: 'Type of Exercise', type: 'select', defaultValue: 'activeJogging', options: [
        { label: 'Sustained Running/Jogging (MET 7.0)', value: '7.0' },
        { label: 'Calisthenics & Strength training (MET 3.5)', value: '3.5' },
        { label: 'Outdoor Road Cycling (MET 6.0)', value: '6.0' },
        { label: 'Lap Swimming (MET 8.0)', value: '8.0' }
      ]}
    ],
    formula: 'Calories = Duration * (MET * 3.5 * Weight_kg) / 200',
    explanation: 'Metabolic Equivalent of Task (MET) numbers estimate active metabolic oxygen consumption across different fitness exercises.',
    example: 'Exercising for 45 minutes at active Swimming rates (MET 8) for a 75kg person burns approximately 591 calories.',
    faq: [
      { question: 'What is a MET value?', answer: 'One MET represents the metabolic oxygen rate consumed at rest (3.5ml oxygen per kg of body weight per minute).' }
    ],
    relatedSlugs: ['walking-calories-calculator', 'target-heart-rate-calculator', 'tdee-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 70;
      const dur = Number(inputs.duration) || 30;
      const met = Number(inputs.sport) || 7.0;

      const calories = dur * (met * 3.5 * w) / 200;

      return {
        results: [
          { label: 'Total Calories Burned', value: calories.toFixed(0), unit: 'kcal', isPrimary: true },
          { label: 'Core MET Intensity Scale', value: met.toFixed(1), unit: 'MET' }
        ],
        chartData: [
          { name: 'Workout Calories Melted', value: Math.round(calories), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'target-heart-rate-calculator',
    name: 'Target Heart Rate',
    slug: 'target-heart-rate-calculator',
    category: 'fitness',
    description: 'Calculate optimal cardio and fat burn training zones using the Karvonen heart rate reserve equation.',
    seoTitle: 'Target Cardio Training Heat Rate Zones | Calculatoora',
    seoDescription: 'Obtain your tailored cardiovascular training heart rate targets based on rest heartbeat and age parameters.',
    inputs: [
      { id: 'age', label: 'Your Age', type: 'number', defaultValue: 28, step: 1, unit: 'years' },
      { id: 'restHR', label: 'Resting Heart Rate (BPM)', type: 'number', defaultValue: 65, step: 1, unit: 'bpm' }
    ],
    formula: 'Max HR = 220 - Age\nHR Reserve = Max HR - Resting HR\nTarget Zone HR = (HR Reserve * Intensity %) + Resting HR',
    explanation: 'The Karvonen formula is preferred because it accounts for resting heart rate metrics, presenting highly accurate personal effort limits.',
    example: 'For a 28-year-old with a 65 bpm resting heart rate, your cardio training target zone (70% intensity) works out to 154 bpm.',
    faq: [
      { question: 'What is the fat-burn zone?', answer: 'Fat-burn zone sits around 50% to 60% of heart rate reserve, where your body prioritizes lipid oxidation for fuel.' }
    ],
    relatedSlugs: ['exercise-calories-calculator', 'running-pace-calculator', 'bmr-advanced-calculator'],
    calculate: (inputs) => {
      const age = Number(inputs.age) || 28;
      const rest = Number(inputs.restHR) || 60;

      const maxHR = 220 - age;
      const hrr = maxHR - rest;

      const fatBurnMin = (hrr * 0.50) + rest;
      const fatBurnMax = (hrr * 0.65) + rest;

      const cardioMin = (hrr * 0.70) + rest;
      const cardioMax = (hrr * 0.85) + rest;

      return {
        results: [
          { label: 'Aerobic Cardio Zone (70-85%)', value: `${cardioMin.toFixed(0)} - ${cardioMax.toFixed(0)}`, unit: 'bpm', isPrimary: true },
          { label: 'Fat Burning Zone (50-65%)', value: `${fatBurnMin.toFixed(0)} - ${fatBurnMax.toFixed(0)}`, unit: 'bpm' },
          { label: 'Absolute Max Heart Rate (100%)', value: maxHR.toString(), unit: 'bpm' }
        ],
        chartData: [
          { name: 'Resting Heart Beat', value: rest, color: '#312e81' },
          { name: 'Fat Burn Threshold', value: Math.round(fatBurnMin), color: '#3b82f6' },
          { name: 'Target Cardio Standard', value: Math.round(cardioMin), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'sleep-calculator',
    name: 'Sleep Calculator',
    slug: 'sleep-calculator',
    category: 'fitness',
    description: 'Calculate optimal times to bed or wake cycles to prevent sleep inertia grogginess by aligning with biological REM phases.',
    seoTitle: '90-Min REM Sleep Cycle Calculator | Calculatoora',
    seoDescription: 'Solve when you should sleep or wake up. Target natural sleep intervals to wake up completely fresh.',
    inputs: [
      { id: 'mode', label: 'Sleep Goal', type: 'select', defaultValue: 'wake', options: [
        { label: 'Calculate Wake Times (I am sleeping now)', value: 'wake' },
        { label: 'Calculate Bedtime (I have to wake up at...)', value: 'bed' }
      ]},
      { id: 'targetTime', label: 'Time Reference (HH:MM)', type: 'text', defaultValue: '07:00' }
    ],
    formula: 'Natural sleep cycles occur in exactly 90-minute REM loops.',
    explanation: 'Waking up mid-REM cycle triggers sleep inertia, leaving you groggy. Waking up during transition windows ensures natural energy.',
    example: 'To wake up completely refreshed at 07:00 AM, seek to fall asleep at optimal bedtime slots such as 10:00 PM or 11:30 PM (exactly 5 or 6 sleep cycles).',
    faq: [
      { question: 'How long are sleep cycles?', answer: 'A single complete human sleep cycle lasts approximately 90 minutes, transitioning through light, deep, and REM phases.' }
    ],
    relatedSlugs: ['target-heart-rate-calculator', 'bmr-advanced-calculator', 'age-advanced-calculator'],
    calculate: (inputs) => {
      const mode = inputs.mode || 'wake';
      const ref = inputs.targetTime || '07:00';

      const parts = ref.split(':');
      const h = Number(parts[0]) || 7;
      const m = Number(parts[1]) || 0;

      const dateRef = new Date();
      dateRef.setHours(h);
      dateRef.setMinutes(m);

      const cyclesList: string[] = [];

      if (mode === 'wake') {
        const sleepNow = new Date(); // assume falling asleep inside 15 min
        sleepNow.setMinutes(sleepNow.getMinutes() + 14); // 14 min average latency representation

        for (let c = 3; c <= 6; c++) {
          const t = new Date(sleepNow.getTime() + (c * 90 * 60 * 1000));
          cyclesList.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }

        return {
          results: [
            { label: 'Best Wake Up Options', value: cyclesList.join('  |  '), unit: 'times', isPrimary: true },
            { label: 'Optimal Sleep Cycle Count', value: '5 - 6 Cycles (7.5 to 9 Hours)', unit: 'cycles' }
          ],
          chartData: [
            { name: 'Sleep Cycles (hours)', value: 9 * 10, color: '#39FF14' }
          ]
        };
      } else {
        // Calculate bedtime
        for (let c = 6; c >= 3; c--) {
          const t = new Date(dateRef.getTime() - (c * 90 * 60 * 1000) - (14 * 60 * 1000));
          cyclesList.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }

        return {
          results: [
            { label: 'Optimal Bedtimes Required', value: cyclesList.join('  |  '), unit: 'times', isPrimary: true },
            { label: 'Latency accounted for', value: '14 minutes baseline bedtime latency', unit: 'buffer' }
          ],
          chartData: [
            { name: 'Required Sleep Hours', value: 9 * 10, color: '#39FF14' }
          ]
        };
      }
    }
  }
];
