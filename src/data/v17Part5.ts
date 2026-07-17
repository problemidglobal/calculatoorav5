import { Calculator } from '../types';

export const V17_PART5_CALCULATORS: Calculator[] = [
  // ====================================== SECURITY & PRIVACY ======================================
  {
    id: 'sec-privacy-impact',
    name: 'Privacy Impact Risk Rating Calculator',
    slug: 'sec-privacy-impact',
    category: 'security-privacy',
    description: 'Structure risk assessment models (PIA) with numeric compliance ratings.',
    formula: 'Score = Data Sensitivity * Exposure level * Sharing multiplier',
    explanation: 'Follows ISO 29134 frameworks to rate risks from personal information handling pipelines.',
    example: 'Storing social security numbers exposed on standard cloud systems returns a critical 18/25 score.',
    inputs: [
      { id: 'sensitivity', label: 'Data Classification Level', type: 'select', defaultValue: '3', options: [
        { label: 'Public - No personal indices (1x)', value: '1' },
         { label: 'Standard PII - Names, emails, phones (3x)', value: '3' },
         { label: 'Critical PII - Biometrics, SSN (5x)', value: '5' }
      ]},
      { id: 'host', label: 'Exposure Surface / Storage Location', type: 'select', defaultValue: '2', options: [
        { label: 'Isolated protected server database (1x)', value: '1' },
         { label: 'Standard corporate SaaS database (2x)', value: '2' },
         { label: 'Publicly readable directories (5x)', value: '5' }
      ]}
    ],
    faq: [
      { question: 'What is a PIA/DPIA?', answer: 'A structured Privacy Impact Assessment designed to identify, trace, and minimize data privacy exposures throughout a software lifecycle.' }
    ],
    relatedSlugs: ['sec-data-breach-fine', 'sec-incident-response'],
    seoTitle: 'Privacy Compliance Impact Evaluation Calculator',
    seoDescription: 'Benchmark systematic data privacy exposures online.',
    calculate: (inputs) => {
      const s = Number(inputs.sensitivity || 2);
      const h = Number(inputs.host || 1);
      
      const score = s * h;
      let ranking = 'Low Risk';
      if (score >= 15) ranking = 'Critical Risk';
      else if (score >= 8) ranking = 'Medium Risk';
      
      return {
        results: [
          { label: 'Privacy Risk Rating Index', value: score, unit: '/ 25', isPrimary: true },
          { label: 'Risk Severity Category', value: ranking }
        ]
      };
    }
  },
  {
    id: 'sec-data-breach-fine',
    name: 'GDPR Data Breach Penalty Estimator',
    slug: 'sec-data-breach-fine',
    category: 'security-privacy',
    description: 'Calculate regulatory data breach fine ceilings under official GDPR rules.',
    formula: 'Fine Ceiling = Max(20000000 EUR, Global Revenue * 4%)',
    explanation: 'Models statutory maximum regulatory penalties based on standard cooperative tiers.',
    example: 'A corporation with €150M in worldwide sales faces a GDPR administrative penalty ceiling of €6 million.',
    inputs: [
      { id: 'revenue', label: 'Global Annual Corporate Revenue', type: 'number', defaultValue: 50000000, min: 10000, step: 1000000, unit: 'EUR' },
      { id: 'tier', label: 'Gdpr Compliance Severity Infraction', type: 'select', defaultValue: 'heavy', options: [
        { label: 'Standard Article 83(4) Standard (2% of sales ceiling)', value: 'light' },
         { label: 'Severe Article 83(5) Infraction (4% of sales ceiling)', value: 'heavy' }
      ]}
    ],
    faq: [
      { question: 'What is an Article 83(5) violation?', answer: 'Severe infractions covering violations of core privacy rights like missing legal consent, raw non-compliance with data subject notices, or transfers to unsecured territories.' }
    ],
    relatedSlugs: ['sec-privacy-impact', 'sec-incident-response'],
    seoTitle: 'GDPR Corporate Regulatory Data fine penalty calculator',
    seoDescription: 'Project statutory administrative GDPR citation limits easily.',
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 1000000);
      const tier = String(inputs.tier || 'heavy');
      
      const capPct = tier === 'heavy' ? 0.04 : 0.02;
      const flatCap = tier === 'heavy' ? 20000000 : 10000000;
      
      const revLimit = rev * capPct;
      const finalMaxLimit = Math.max(flatCap, revLimit);
      
      return {
        results: [
          { label: 'Maximum Regulatory Fine Ceiling', value: Math.round(finalMaxLimit), unit: 'EUR', isPrimary: true },
          { label: 'Percentage scale liability limit', value: Math.round(revLimit), unit: 'EUR' }
        ]
      };
    }
  },
  {
    id: 'sec-incident-response',
    name: 'Cybersecurity Incident Containment Planner',
    slug: 'sec-incident-response',
    category: 'security-privacy',
    description: 'Calculate containment time guidelines and incident recovery durations.',
    formula: 'Duration = Base Hours * Scope multiplier * Complexity Index / Team Strength',
    explanation: 'Translates attack profiles and server fleets into standardized system containment intervals.',
    example: 'Containing a medium-risk ransomware outbreak over 15 compromised endpoints takes roughly 28 hours.',
    inputs: [
      { id: 'infectedNodes', label: 'Compromised Network Endpoints', type: 'number', defaultValue: 15, min: 1, step: 1 },
      { id: 'complexity', label: 'Incident Severity Category', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Clean local virus - Single host (1.0x complexity)', value: '1.0' },
         { label: 'Moderate system malware - Distributed scope (2.5x)', value: '2.5' },
         { label: 'Complex system advanced persistent threat (APT) (5.0x)', value: '5.0' }
      ]},
      { id: 'engineers', label: 'Active Incident Response Team', type: 'number', defaultValue: 3, min: 1, max: 20 }
    ],
    faq: [
      { question: 'What is containment in IR?', answer: 'The critical phase of limiting damage during attacks. Actions include isolating networks and disabling compromised user credentials.' }
    ],
    relatedSlugs: ['sec-privacy-impact', 'sec-data-breach-fine'],
    seoTitle: 'Endpoint Breach Forensic response recovery timeline planning',
    seoDescription: 'Obtain estimated system recovery durations to clear compromised network fleets.',
    calculate: (inputs) => {
      const n = Number(inputs.infectedNodes || 1);
      const comp = Number(inputs.complexity || 2.0);
      const e = Number(inputs.engineers || 1);
      
      const unitHoursPerNode = 4.0;
      const rawWork = n * unitHoursPerNode * comp;
      const duration = rawWork / e;
      
      return {
        results: [
          { label: 'Estimated Containment Time', value: Number(duration.toFixed(1)), unit: 'hours', isPrimary: true },
          { label: 'Total team clean-up labor required', value: Math.round(rawWork), unit: 'engineer-hours' }
        ]
      };
    }
  },

  // ====================================== CAREER ======================================
  {
    id: 'career-promotion-timeline',
    name: 'Promotion Timeline Estimator',
    slug: 'career-promotion-timeline',
    category: 'career',
    description: 'Benchmark career advancement timelines based on performance scores and corporate sizes.',
    formula: 'Months = Base months * Organizational Scaling Factor / (Performance Index * Impact Score)',
    explanation: 'Calculates expected promotion rates using industry norms and career performance scores.',
    example: 'An engineer with high-impact reviews at a mid-sized firm is projected to promote in 18 months.',
    inputs: [
      { id: 'level', label: 'Target Seniority Grade', type: 'select', defaultValue: 'mid', options: [
        { label: 'Mid-level contributor (Junior to Mid)', value: '18' },
         { label: 'Senior lead contributor (Mid to Senior)', value: '30' },
         { label: 'Principal engineer (Senior to Principal)', value: '50' }
      ]},
      { id: 'rating', label: 'Average Performance Review Score', type: 'select', defaultValue: 'strong', options: [
        { label: 'Meets expectations (1.0x speed)', value: '1.0' },
         { label: 'Exceeds expectations (1.4x speed)', value: '1.4' },
         { label: 'Consistently exceptional (1.8x speed)', value: '1.8' }
      ]}
    ],
    faq: [
      { question: 'What is "promotion velocity"?', answer: 'The rate at which people climb corporate career structures, driven by performance scores and local job markets.' }
    ],
    relatedSlugs: ['career-resume-keyword', 'career-interview-prep'],
    seoTitle: 'Corporate Career Promotion Velocity Estimator',
    seoDescription: 'Forecast estimated timelines for career growth and level transitions.',
    calculate: (inputs) => {
      const base = Number(inputs.level || 24);
      const speed = Number(inputs.rating || 1.0);
      
      const duration = base / speed;
      
      return {
        results: [
          { label: 'Estimated Transition Timeframe', value: Number(duration.toFixed(1)), unit: 'months', isPrimary: true },
          { label: 'Pace Acceleration Quotient', value: `${speed}x` }
        ]
      };
    }
  },
  {
    id: 'career-resume-keyword',
    name: 'Resume ATS Keyword Sizing',
    slug: 'career-resume-keyword',
    category: 'career',
    description: 'Calculate resume formatting match margins and evaluate ATS keyword density.',
    formula: 'Score = (Matched keywords / Job Spec Required keywords) * 100',
    explanation: 'Ranks application readiness to help secure interviews through automated candidate screenings.',
    example: 'Matching 12 out of 15 key job skills scores 80%, exceeding common interview screening cutoffs.',
    inputs: [
      { id: 'found', label: 'Resume Matched Industry Terms', type: 'number', defaultValue: 12, min: 0 },
      { id: 'required', label: 'Job Description Essential Terms', type: 'number', defaultValue: 16, min: 1 }
    ],
    faq: [
      { question: 'What is an ATS?', answer: 'An Applicant Tracking System. HR systems scan resumes for matching keywords to filter and rank submissions.' }
    ],
    relatedSlugs: ['career-promotion-timeline', 'career-interview-prep'],
    seoTitle: 'Resume ATS Job Keyword Match Sizing',
    seoDescription: 'Optimize job profiles and test compatibility with recruiter search engines.',
    calculate: (inputs) => {
      const matched = Number(inputs.found || 0);
      const req = Number(inputs.required || 10);
      
      const score = Math.min(100, (matched / req) * 100);
      let status = 'Excellent match (Interviews likely)';
      if (score < 50) status = 'Weak match (Boost keyword context)';
      else if (score < 75) status = 'Adequate match (Refine descriptions)';
      
      return {
        results: [
          { label: 'Calculated Résumé ATS Match Score', value: `${score.toFixed(0)}%`, isPrimary: true },
          { label: 'Application Screening Outlook', value: status }
        ]
      };
    }
  },
  {
    id: 'career-interview-prep',
    name: 'Interview Preparation Prep Coordinator',
    slug: 'career-interview-prep',
    category: 'career',
    description: 'Calculate total prep hours and schedule study blocks ahead of technical interviews.',
    formula: 'prepNeeded = (Mock Interview Targets * 3) + Core Concept reviews',
    explanation: 'Models study schedules to ensure thorough preparation for technical, live-coding, and behavioral interviews.',
    example: 'Aiming for 15 interview topics over 4 weeks demands scheduling 11 hours of weekly study.',
    inputs: [
      { id: 'topics', label: 'Technical Target Topics', type: 'number', defaultValue: 12, min: 1 },
      { id: 'weeksRemaining', label: 'Weeks Remaining to Interview', type: 'number', defaultValue: 4, min: 1 }
    ],
    faq: [
      { question: 'What is behavioral interview preparation?', answer: 'The structure of drafting specific resume examples using STAR formatting standards: Situation, Task, Action, and Result.' }
    ],
    relatedSlugs: ['career-promotion-timeline', 'career-resume-keyword'],
    seoTitle: 'Technical Coding Interview prep coordinator',
    seoDescription: 'Benchmark schedule prep hours and track lesson pacing easily.',
    calculate: (inputs) => {
      const top = Number(inputs.topics || 5);
      const w = Number(inputs.weeksRemaining || 2);
      
      const totalHours = top * 3.5;
      const hourlyWeekly = totalHours / w;
      
      return {
        results: [
          { label: 'Weekly Study Schedule Required', value: Number(hourlyWeekly.toFixed(1)), unit: 'hours / week', isPrimary: true },
          { label: 'Cumulative preparation hours', value: Math.round(totalHours), unit: 'hours overall' }
        ]
      };
    }
  },

  // ====================================== LOGISTICS ======================================
  {
    id: 'logi-container-volumetric',
    name: 'Freight Container Volumetric Planner',
    slug: 'logi-container-volumetric',
    category: 'logistics',
    description: 'Calculate shipping container volume capacities and inventory space margins.',
    formula: 'Box Volume = L * W * H; Capacity = Container Volume / Box Volume * Utility coefficient',
    explanation: 'Models real physical load margins, factoring in clearance gaps and pallet loading spaces.',
    example: 'Packing 1ft boxes into standard 20ft containers (1,172 cu ft capacity) fits roughly 1,020 units.',
    inputs: [
      { id: 'boxVol', label: 'Single Carton Unit Volume', type: 'number', defaultValue: 1.2, min: 0.1, step: 0.1, unit: 'cu ft' },
      { id: 'containerSize', label: 'Shipping Container Profile', type: 'select', defaultValue: '20ft', options: [
        { label: '20ft Standard Container (1,172 usable cu ft)', value: '1172' },
         { label: '40ft Standard Container (2,385 usable cu ft)', value: '2385' }
      ]}
    ],
    faq: [
      { question: 'Why apply cargo loading factors?', answer: 'Irregular box sizes, pallets, and structural strapping elements introduce unused air pockets, meaning real capacity is usually 85% of total mathematical volume.' }
    ],
    relatedSlugs: ['logi-route-turnaround', 'creator-video-file-size'],
    seoTitle: 'Intermodal ISO shipping container volumetric planner',
    seoDescription: 'Obtain carton storage capacities and optimize container physical utility limits.',
    calculate: (inputs) => {
      const box = Number(inputs.boxVol || 1);
      const limit = Number(inputs.containerSize || 1172);
      
      const utilityFactor = 0.88; // 88% efficiency 
      const maxUnits = Math.floor((limit / box) * utilityFactor);
      
      return {
        results: [
          { label: 'Est Usable Package Capacity', value: maxUnits, unit: 'cartons', isPrimary: true },
          { label: 'Container absolute Volume', value: limit, unit: 'cu ft' }
        ]
      };
    }
  },
  {
    id: 'logi-route-turnaround',
    name: 'Logistics Route Turnaround Speed',
    slug: 'logi-route-turnaround',
    category: 'logistics',
    description: 'Calculate transit times and transportation turnaround speeds across delivery routes.',
    formula: 'Duration = (Route Distance / speed) + (Delivery Drops count * dropDelay)',
    explanation: 'Helps logistics planners optimize driver schedules, load planning, and delivery routes.',
    example: 'Driving 400 miles over 8 drop destinations takes approximately 9.3 hours of active transit.',
    inputs: [
      { id: 'distMiles', label: 'Combined Route Mileage', type: 'number', defaultValue: 300, min: 1, step: 10, unit: 'miles' },
      { id: 'speedMph', label: 'Expected Truck Velocity Speed', type: 'number', defaultValue: 55, min: 10, unit: 'mph' },
      { id: 'dropsCount', label: 'Destination Drop-Off Points', type: 'number', defaultValue: 6, min: 0 }
    ],
    faq: [
      { question: 'What is dispatch margin planning?', answer: 'The essential practice of scheduling driver transit buffers to prevent delays down the line.' }
    ],
    relatedSlugs: ['logi-container-volumetric', 'creator-video-file-size'],
    seoTitle: 'Route Transit Durations & Truck Delivery Scheduler',
    seoDescription: 'Forecasting transit durations and arrival milestones across multi-destination carrier routes.',
    calculate: (inputs) => {
      const d = Number(inputs.distMiles || 10);
      const v = Number(inputs.speedMph || 50);
      const dropNum = Number(inputs.dropsCount || 0);
      
      const delayPerDrop = 0.35; // 21 minutes per drop 
      const driveTime = d / v;
      const totalTime = driveTime + (dropNum * delayPerDrop);
      
      return {
        results: [
          { label: 'Total Route Schedule duration', value: Number(totalTime.toFixed(1)), unit: 'hours', isPrimary: true },
          { label: 'Active pure Drive time', value: Number(driveTime.toFixed(1)), unit: 'hours' },
          { label: 'Combined Delivery drops delaying', value: Number((dropNum * delayPerDrop).toFixed(1)), unit: 'hours' }
        ]
      };
    }
  },

  // ====================================== ENERGY ======================================
  {
    id: 'energy-solar-panel-array',
    name: 'Solar Panel Generation Estimator',
    slug: 'energy-solar-panel-array',
    category: 'energy',
    description: 'Calculate household solar generator harvesting volumes using solar hours and panel capacities.',
    formula: 'Yield kWh = Array Rated kW * Daily Sunlight Hours * efficiency coefficients',
    explanation: 'Sizes home solar arrays, helping users plan utility offsets and battery storage needs.',
    example: 'A solid 6.0 kW residential solar setup in Arizona (5.5 peak sun hours) generates 26.4 kWh daily.',
    inputs: [
      { id: 'arrayKw', label: 'Solar Array Rated Power Output', type: 'number', defaultValue: 6.0, min: 0.1, step: 0.5, unit: 'kW' },
      { id: 'sunHours', label: 'Daily Peak Sunlight Hours index', type: 'number', defaultValue: 5.0, min: 1, step: 0.5, unit: 'hours/day' }
    ],
    faq: [
      { question: 'What is derating in solar calculations?', answer: 'Subtracting yield losses from wire resistance, dirty panels, and DC-to-AC inverters, typically estimated to reduce output by 15-20%.' }
    ],
    relatedSlugs: ['energy-generator-fuel-rate', 'eng-voltage-drop'],
    seoTitle: 'Residential Solar Array Daily kWh Generation Estimator',
    seoDescription: 'Obtain estimated solar grid yields based on rating size and regional solar indices.',
    calculate: (inputs) => {
      const kw = Number(inputs.arrayKw || 1.0);
      const sun = Number(inputs.sunHours || 4.0);
      
      const efficiencyMultiplier = 0.82; // 82% standard system efficiency derate 
      const dailyYield = kw * sun * efficiencyMultiplier;
      
      return {
        results: [
          { label: 'Projected Daily Energy Yield', value: Number(dailyYield.toFixed(2)), unit: 'kWh / day', isPrimary: true },
          { label: 'Projected Monthly Energy Yield', value: Math.round(dailyYield * 30), unit: 'kWh' }
        ]
      };
    }
  },
  {
    id: 'energy-generator-fuel-rate',
    name: 'Generator Fuel Consumption Rate',
    slug: 'energy-generator-fuel-rate',
    category: 'energy',
    description: 'Estimate fuel consumption rates and continuous runtime horizons of standby generators.',
    formula: 'Burn rate = Generator kW size * Load Multiplier coefficient',
    explanation: 'Models diesel fuel usage to help emergency networks maintain power backup safety factors.',
    example: 'Running a 20 kW diesel backup generator at half-load consumes approximately 0.95 gallons of fuel hourly.',
    inputs: [
      { id: 'capacityKw', label: 'Generator Rated Power Output', type: 'number', defaultValue: 15, min: 1, step: 5, unit: 'kW' },
      { id: 'loadPct', label: 'Active Electricity load Factor', type: 'select', defaultValue: '50', options: [
        { label: 'Continuous Minimal Load (25% power output)', value: '25' },
         { label: 'Standard Household Load (50% power output)', value: '50' },
         { label: 'Peak Capacity Load (100% power output)', value: '100' }
      ]},
      { id: 'tankSize', label: 'Fuel Tank Capacity Volume', type: 'number', defaultValue: 12, min: 1, step: 2, unit: 'gallons' }
    ],
    faq: [
      { question: 'Why does generator fuel burn increase under load?', answer: 'High electrical loads draw high current, bogging down engine shafts and requiring the carburetor to pump more fuel to maintain motor speeds.' }
    ],
    relatedSlugs: ['energy-solar-panel-array', 'logi-route-turnaround'],
    seoTitle: 'Emergency Back-Up Generator Fuel Consumption & runtime',
    seoDescription: 'Track active diesel burn indices and plan standby refueling timelines.',
    calculate: (inputs) => {
      const kw = Number(inputs.capacityKw || 10);
      const pct = Number(inputs.loadPct || 50) / 100;
      const tank = Number(inputs.tankSize || 10);
      
      const specificFuelConsWeight = 0.082; // Gallons per net kW generated hourly 
      const activeKw = kw * pct;
      const hourlyBurn = Math.max(0.2, activeKw * specificFuelConsWeight);
      const runtime = tank / hourlyBurn;
      
      return {
        results: [
          { label: 'Continuous Backup Runtime', value: Number(runtime.toFixed(1)), unit: 'hours', isPrimary: true },
          { label: 'Hourly Fuel Burn Rate', value: Number(hourlyBurn.toFixed(2)), unit: 'gallons/hour' }
        ]
      };
    }
  }
];
