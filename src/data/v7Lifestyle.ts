import { Calculator } from '../types';

export const V7_LIFESTYLE_CALCULATORS: Calculator[] = [
  {
    id: 'tip-calculator',
    name: 'Tip Calculator',
    slug: 'tip-calculator',
    category: 'lifestyle',
    description: 'Calculate tips and split bills among multiple people.',
    seoTitle: 'Restaurant Tip & Bill Split Calculator | Calculatoora',
    seoDescription: 'Calculate tips and split restaurant bills easily. Customize tip percentages and share costs among friends.',
    inputs: [
      { id: 'billAmount', label: 'Overall Bill Total', type: 'number', defaultValue: 84.50, step: 0.5, unit: '$' },
      { id: 'tipPercentage', label: 'Tip Percentage', type: 'number', defaultValue: 18, min: 0, max: 50, step: 1, unit: '%' },
      { id: 'peopleCount', label: 'Number of People Spitting', type: 'number', defaultValue: 3, min: 1, max: 100, step: 1, unit: 'pax' }
    ],
    formula: 'Tip Amount = Bill * (Tip % / 100)\nCost Per Person = (Bill + Tip) / People',
    explanation: 'Calculates overall tips and splits the bill evenly among group members.',
    example: 'For an $84.50 bill with an 18.00% tip split among 3 people: each person pays $33.24 (tip total of $15.21).',
    faq: [{ question: 'What is standard tipping in USA?', answer: 'Typical tipping rates at US restaurants range from 15% to 20% of the pre-tax bill.' }],
    relatedSlugs: ['expense-split-calculator', 'budget-planner-calculator'],
    calculate: (inputs) => {
      const bill = Number(inputs.billAmount) || 0;
      const pct = (Number(inputs.tipPercentage) || 18) / 100;
      const size = Number(inputs.peopleCount) || 1;

      const tipAmt = bill * pct;
      const total = bill + tipAmt;
      const share = total / size;

      return {
        results: [
          { label: 'Individual Share Cost', value: share.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Tip Value', value: tipAmt.toFixed(2), unit: '$' },
          { label: 'Overall Bill Total', value: total.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Original Check Base', value: bill, color: '#3b82f6' },
          { name: 'Tip Pool Added', value: tipAmt, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'sleep-cycle-calculator',
    name: 'Sleep Cycle Calculator',
    slug: 'sleep-cycle-calculator',
    category: 'lifestyle',
    description: 'Calculate optimal wake-up times based on 90-minute sleep cycles.',
    seoTitle: 'Optimal Sleep Cycle & Bedtime Planner | Calculatoora',
    seoDescription: 'Find the best times to go to bed or wake up based on natural 90-minute sleep cycles.',
    inputs: [
      { id: 'direction', label: 'Planning Mode', type: 'select', defaultValue: 'wake', options: [
        { label: 'When to sleep if waking up at...', value: 'wake' },
        { label: 'When to wake up if sleeping at...', value: 'sleep' }
      ] },
      { id: 'targetHour', label: 'Hour (Standard 12h)', type: 'number', defaultValue: 7, min: 1, max: 12, step: 1 },
      { id: 'targetMin', label: 'Minute', type: 'number', defaultValue: 30, min: 0, max: 59, step: 5 },
      { id: 'ampm', label: 'AM / PM', type: 'select', defaultValue: 'AM', options: [
        { label: 'AM', value: 'AM' },
        { label: 'PM', value: 'PM' }
      ] }
    ],
    formula: 'Sleep Cycle = 90 Minutes + 14 Minutes to fall asleep.',
    explanation: 'Waking up at the end of a 90-minute sleep cycle helps you feel alert and refreshed, preventing grogginess.',
    example: 'To wake up refreshed at 7:30 AM, aim to go to bed at either 10:16 PM or 11:46 PM.',
    faq: [{ question: 'How long are sleep cycles?', answer: 'The average adult sleep cycle lasts approximately 90 minutes, moving through light sleep, deep sleep, and REM stages.' }],
    relatedSlugs: ['tip-calculator', 'hydration-calculator'],
    calculate: (inputs) => {
      const hStr = inputs.targetHour || '7';
      const mStr = inputs.targetMin || '30';
      const ampm = inputs.ampm || 'AM';
      const dir = inputs.direction || 'wake';

      let hour = Number(hStr);
      const min = Number(mStr);

      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;

      const baseMins = (hour * 60) + min;
      const targetBedTimes: string[] = [];

      const formatTime = (totalMinutes: number): string => {
        let h = Math.floor(totalMinutes / 60) % 24;
        const m = totalMinutes % 60;
        const sfx = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        const formattedMin = m < 10 ? '0' + m : m;
        return `${h}:${formattedMin} ${sfx}`;
      };

      if (dir === 'wake') {
        const fallAsleepBuffer = 14;
        const cycleLength = 90;

        for (let cycles = 4; cycles <= 6; cycles++) {
          const sleepDuration = (cycles * cycleLength) + fallAsleepBuffer;
          let bedMins = baseMins - sleepDuration;
          if (bedMins < 0) bedMins += 24 * 60;
          targetBedTimes.push(formatTime(bedMins));
        }
      } else {
        const fallAsleepBuffer = 14;
        const cycleLength = 90;

        for (let cycles = 4; cycles <= 6; cycles++) {
          const sleepDuration = (cycles * cycleLength) + fallAsleepBuffer;
          let wakeMins = baseMins + sleepDuration;
          wakeMins = wakeMins % (24 * 60);
          targetBedTimes.push(formatTime(wakeMins));
        }
      }

      return {
        results: [
          { label: dir === 'wake' ? 'Best Bedtimes (Backwards)' : 'Best Wake Times (Forwards)', value: targetBedTimes.join('  |  '), isPrimary: true },
          { label: 'Cycle Count Range', value: '4, 5, or 6 Cycles (6h to 9h total)' }
        ]
      };
    }
  },
  {
    id: 'dog-age-calculator',
    name: 'Dog Age Calculator',
    slug: 'dog-age-calculator',
    category: 'lifestyle',
    description: 'Convert your dog\'s age into estimated human years based on their breed size.',
    seoTitle: 'Dog Age in Human Years Calculator | Calculatoora',
    seoDescription: 'Find your dog\'s age in human years based on their size and age.',
    inputs: [
      { id: 'dogYears', label: 'Dog\'s Physical Age (Years)', type: 'number', defaultValue: 5, step: 1, unit: 'yrs' },
      { id: 'size', label: 'Breed Size class', type: 'select', defaultValue: 'medium', options: [
        { label: 'Small (Under 10 kg)', value: 'small' },
        { label: 'Medium (10 - 25 kg)', value: 'medium' },
        { label: 'Large (Over 25 kg)', value: 'large' }
      ] }
    ],
    formula: 'Small: 15 + 9 + (Age-2)*4\nLarge: 15 + 9 + (Age-2)*7',
    explanation: 'Converts pet age to human equivalents. Larger breed sizes age slightly faster than smaller breeds.',
    example: 'A 5-year-old medium breed dog is approximately 36 years old in human years.',
    faq: [{ question: 'Why do larger dogs age faster?', answer: 'Larger dogs grow faster and experience physiological aging more rapidly than smaller breeds.' }],
    relatedSlugs: ['cat-age-calculator', 'sleep-cycle-calculator'],
    calculate: (inputs) => {
      const y = Number(inputs.dogYears) || 1;
      const s = inputs.size || 'medium';

      let humanAge = 15;
      if (y > 1) humanAge += 9;
      if (y > 2) {
        let mult = 4;
        if (s === 'medium') mult = 5;
        if (s === 'large') mult = 7;
        humanAge += (y - 2) * mult;
      }

      return {
        results: [
          { label: 'Estimated Age in Human Years', value: humanAge, unit: 'Human Yrs', isPrimary: true },
          { label: 'Aging Pace Profile', value: s.toUpperCase() + ' Breed Standard' }
        ]
      };
    }
  },
  {
    id: 'cat-age-calculator',
    name: 'Cat Age Calculator',
    slug: 'cat-age-calculator',
    category: 'lifestyle',
    description: 'Convert your cat\'s biological age into estimated human years.',
    seoTitle: 'Cat Age in Human Years Calculator | Calculatoora',
    seoDescription: 'Convert your cat\'s age to human years using standard feline aging guidelines.',
    inputs: [
      { id: 'catYears', label: 'Cat Age (Years)', type: 'number', defaultValue: 4, step: 1, unit: 'yrs' }
    ],
    formula: 'Human Age = 15 + 9 + (Age - 2) * 4',
    explanation: 'Estimates feline aging, with cats maturing rapidly in their first two years before settling into a steady aging process.',
    example: 'A 4-year-old cat is approximately 32 years old in human years.',
    faq: [{ question: 'How long do indoor cats live?', answer: 'Healthy indoor cats typically live 12 to 15 years, with some reaching age 20 or older.' }],
    relatedSlugs: ['dog-age-calculator', 'sleep-cycle-calculator'],
    calculate: (inputs) => {
      const y = Number(inputs.catYears) || 1;

      let humanAge = 15;
      if (y > 1) humanAge += 9;
      if (y > 2) {
        humanAge += (y - 2) * 4;
      }

      return {
        results: [
          { label: 'Estimated Feline Age in Human Years', value: humanAge, unit: 'Human Yrs', isPrimary: true },
          { label: 'Feline Life Stage', value: y >= 11 ? 'Senior' : y >= 7 ? 'Mature' : 'Adult' }
        ]
      };
    }
  },
  {
    id: 'habit-streak-tracker',
    name: 'Habit Streak Tracker & Progress Calculator',
    slug: 'habit-streak-tracker',
    category: 'lifestyle',
    description: 'Track habit stickiness and success rates across a custom tracking window.',
    seoTitle: 'Habit Consistency & Progress Tracker | Calculatoora',
    seoDescription: 'Calculate habit consistency and completion rates based on total days and milestones.',
    inputs: [
      { id: 'totalDays', label: 'Tracking Window Horizon', type: 'number', defaultValue: 30, step: 5, unit: 'days' },
      { id: 'completedDays', label: 'Completed Days Count', type: 'number', defaultValue: 21, step: 1, unit: 'days' }
    ],
    formula: 'Consistency Rate = (Completed Days / Total Days) * 100',
    explanation: 'Measures habit completion rates over time to help you build and maintain new routines.',
    example: 'Completing a habit on 21 out of 30 days yields a 70.00% consistency rate.',
    faq: [{ question: 'How long does it take to form a habit?', answer: 'On average, it takes approximately 18 to 66 days to form a automatic daily habit.' }],
    relatedSlugs: ['sleep-cycle-calculator', 'tip-calculator'],
    calculate: (inputs) => {
      const t = Number(inputs.totalDays) || 30;
      const c = Number(inputs.completedDays) || 0;

      const rate = t > 0 ? (c / t) * 100 : 0;
      return {
        results: [
          { label: 'Habit Consistency Rate', value: rate.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Missed Days Count', value: Math.max(0, t - c), unit: 'Days' }
        ],
        chartData: [
          { name: 'Completed Days', value: c, color: '#10b981' },
          { name: 'Missed Days', value: Math.max(0, t - c), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    slug: 'wallpaper-calculator',
    category: 'diy',
    description: 'Estimate wallpaper rolls needed for rooms based on wall sizes.',
    seoTitle: 'Wallpaper Roll Estimator | Calculatoora',
    seoDescription: 'Determine estimated wallpaper rolls required by entering room dimensions.',
    inputs: [
      { id: 'width', label: 'Total Wall Width Sum', type: 'number', defaultValue: 12, step: 1, unit: 'ft' },
      { id: 'height', label: 'All Wall Height', type: 'number', defaultValue: 8, step: 0.5, unit: 'ft' },
      { id: 'rollArea', label: 'Single Wallpaper Roll Area Coverage', type: 'number', defaultValue: 56, step: 5, unit: 'sq ft' }
    ],
    formula: 'Rolls Required = (Width * Height) * 1.15 (Overhead) / Roll Area',
    explanation: 'Calculates wallpaper rolls needed, including a 15% safety margin for pattern matching and cutting.',
    example: 'An 12x8 ft wall covers 96 square feet; using standard 56 sq ft rolls, you will need 3 rolls.',
    faq: [{ question: 'Why add a wallpaper waste buffer?', answer: 'Pattern repeats and trimming always lead to wall waste, requiring slightly more paper than your exact surface area.' }],
    relatedSlugs: ['paint-calculator', 'tile-layout-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.width) || 0;
      const h = Number(inputs.height) || 0;
      const rollArea = Number(inputs.rollArea) || 50;

      const baseArea = w * h;
      const rollCount = (baseArea * 1.15) / rollArea;

      return {
        results: [
          { label: 'Recommended Wallpaper Rolls', value: Math.ceil(rollCount), unit: 'Rolls', isPrimary: true },
          { label: 'Total Wall Surface Area', value: baseArea.toFixed(1), unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'paint-calculator',
    name: 'Paint Quantity Calculator',
    slug: 'paint-calculator',
    category: 'diy',
    description: 'Calculate paint cans needed based on wall surface area and coat counts.',
    seoTitle: 'DIY Paint Can Quantity Estimator | Calculatoora',
    seoDescription: 'Find estimated paint gallons required by entering room width and height.',
    inputs: [
      { id: 'wallWidth', label: 'Total Wall Width Sum', type: 'number', defaultValue: 40, step: 2, unit: 'ft' },
      { id: 'wallHeight', label: 'Standard Wall Height', type: 'number', defaultValue: 8, step: 0.5, unit: 'ft' },
      { id: 'coats', label: 'Quantity of Coats', type: 'number', defaultValue: 2, min: 1, max: 5, step: 1, unit: 'coats' }
    ],
    formula: 'Gallons = (Total Wall Area * Coats) / 350',
    explanation: 'Estimates paint needs, assuming a standard coverage of 350 square feet per gallon.',
    example: 'Painting a 40x8 ft area (320 sq ft) with 2 coats requires approximately 1.83 gallons of paint.',
    faq: [{ question: 'How much does a gallon of paint cover?', answer: 'One gallon of paint typically covers 350 to 400 square feet on smooth prime surfaces.' }],
    relatedSlugs: ['wallpaper-calculator', 'tile-layout-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.wallWidth) || 0;
      const h = Number(inputs.wallHeight) || 0;
      const c = Number(inputs.coats) || 1;

      const area = w * h;
      const gals = (area * c) / 350;

      return {
        results: [
          { label: 'Recommended Paint Gallons', value: gals.toFixed(2), unit: 'Gallons', isPrimary: true },
          { label: 'Overall Wall Surface Area', value: area.toFixed(1), unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'tile-layout-calculator',
    name: 'Tile Layout & Quantity Calculator',
    slug: 'tile-layout-calculator',
    category: 'diy',
    description: 'Calculate floor tiles and grout lines needed for custom rooms.',
    seoTitle: 'Floor Tile Quantity Estimator | Calculatoora',
    seoDescription: 'Find the estimated tiles needed for floor and bathroom installations.',
    inputs: [
      { id: 'roomWidth', label: 'Room Width Target', type: 'number', defaultValue: 10, step: 0.5, unit: 'ft' },
      { id: 'roomLength', label: 'Room Length Target', type: 'number', defaultValue: 12, step: 0.5, unit: 'ft' },
      { id: 'tileSize', label: 'Tile Dimension (Inches)', type: 'select', defaultValue: '12', options: [
        { label: 'Aesthetic Small (6x6")', value: '6' },
        { label: 'Standard size (12x12")', value: '12' },
        { label: 'Large Format (24x24")', value: '24' }
      ] }
    ],
    formula: 'Raw Tiles = (Room Area) / (Tile Area)\nTotal Tiles = Raw Tiles * 1.10 (Waste Buffer)',
    explanation: 'Calculates the number of tiles needed for a floor layout, including a 10% safety margin for cutting.',
    example: 'Tiling a 10x12 ft room (120 sq ft) with 12" tiles requires approximately 132 tiles (including the safety margin).',
    faq: [{ question: 'What is a typical tile cutting buffer?', answer: 'A 10% safety buffer is standard for simple straight installations, while diagonal layouts may require 15%.' }],
    relatedSlugs: ['paint-calculator', 'concrete-volume-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.roomWidth) || 0;
      const l = Number(inputs.roomLength) || 0;
      const sizeInches = Number(inputs.tileSize) || 12;

      const roomArea = w * l;
      const tileAreaSqFt = (sizeInches * sizeInches) / 144;
      const tilesNeeded = (roomArea / tileAreaSqFt) * 1.10;

      return {
        results: [
          { label: 'Recommended Tiles Required', value: Math.ceil(tilesNeeded), unit: 'Tiles', isPrimary: true },
          { label: 'Total Room Surface Area', value: roomArea.toFixed(1), unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'concrete-volume-calculator',
    name: 'Concrete Volume Calculator',
    slug: 'concrete-volume-calculator',
    category: 'diy',
    description: 'Calculate cubic yards and standard bags of cement needed for concrete pours and slabs.',
    seoTitle: 'Concrete Slab Cubic Yard & Bag Estimator | Calculatoora',
    seoDescription: 'Calculate required concrete volumes in cubic yards and 80-lb bags for pours and slabs.',
    inputs: [
      { id: 'length', label: 'Slab Length', type: 'number', defaultValue: 10, step: 0.5, unit: 'ft' },
      { id: 'width', label: 'Slab Width', type: 'number', defaultValue: 10, step: 0.5, unit: 'ft' },
      { id: 'depth', label: 'Slab Thickness / Depth', type: 'number', defaultValue: 4, step: 1, unit: 'in' }
    ],
    formula: 'Cubic Yards = (Length * Width * (Depth / 12)) / 27',
    explanation: 'Finds the volume of concrete needed for a pour, providing results in both cubic yards and equivalent standard 80-lb bags.',
    example: 'A 10x10 ft slab at 4 inches thick requires 1.23 cubic yards of concrete, or approximately 56 bags (80-lb).',
    faq: [{ question: 'How much volume does an 80-lb concrete bag cover?', answer: 'An 80-lb bag of concrete mix yields approximately 0.60 cubic feet of wet concrete.' }],
    relatedSlugs: ['mulch-volume-calculator', 'tile-layout-calculator'],
    calculate: (inputs) => {
      const l = Number(inputs.length) || 0;
      const w = Number(inputs.width) || 0;
      const d = (Number(inputs.depth) || 4) / 12;

      const cuFt = l * w * d;
      const cuYards = cuFt / 27;
      const bags80lb = cuFt / 0.6;

      return {
        results: [
          { label: 'Cubic Yards Required', value: cuYards.toFixed(2), unit: 'yd³', isPrimary: true },
          { label: 'Equivalent 80-lb Bags', value: Math.ceil(bags80lb), unit: 'Bags' }
        ]
      };
    }
  },
  {
    id: 'mulch-volume-calculator',
    name: 'Mulch Volume Calculator',
    slug: 'mulch-volume-calculator',
    category: 'diy',
    description: 'Calculate organic mulch volume needs for garden beds.',
    seoTitle: 'Garden Mulch Volume Estimator | Calculatoora',
    seoDescription: 'Find estimated mulch coverage volumes in bags or cubic yards based on garden bed dimensions.',
    inputs: [
      { id: 'bedLength', label: 'Garden Bed Length', type: 'number', defaultValue: 20, step: 1, unit: 'ft' },
      { id: 'bedWidth', label: 'Garden Bed Width', type: 'number', defaultValue: 4, step: 1, unit: 'ft' },
      { id: 'depth', label: 'Mulch Depth Thickness', type: 'number', defaultValue: 3, step: 0.5, unit: 'in' }
    ],
    formula: 'Cubic Yards = (Bed Area * Thickness / 12) / 27',
    explanation: 'Calculates the volume of mulch needed to cover a garden bed at your desired thickness.',
    example: 'A 20x4 ft garden bed covered with 3 inches of mulch requires 0.74 cubic yards (approximately 10 bags).',
    faq: [{ question: 'What is standard garden mulch depth?', answer: 'For effective weed control and moisture retention, aim for a mulch thickness of 2 to 3 inches.' }],
    relatedSlugs: ['concrete-volume-calculator', 'paint-calculator'],
    calculate: (inputs) => {
      const l = Number(inputs.bedLength) || 0;
      const w = Number(inputs.bedWidth) || 0;
      const d = (Number(inputs.depth) || 3) / 12;

      const cuFt = l * w * d;
      const cy = cuFt / 27;
      const bags2cf = cuFt / 2.0;

      return {
        results: [
          { label: 'Cubic Yards Needed', value: cy.toFixed(2), unit: 'yd³', isPrimary: true },
          { label: 'Equivalent 2-cu-ft Bags', value: Math.ceil(bags2cf), unit: 'Bags' }
        ]
      };
    }
  }
];
