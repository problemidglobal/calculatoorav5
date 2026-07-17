import { Calculator } from '../types';

export const V16_NEW_SPECIALTIES_CALCULATORS: Calculator[] = [
  // MEDICAL & HEALTH PROFESSIONAL (71-77)
  {
    id: 'med-dosage',
    name: 'Medical Dosage Calculator',
    slug: 'med-dosage',
    category: 'medical-pro',
    description: 'Calculate pediatric and adult drug dosages based on patient weight and specific clinical concentrations.',
    formula: 'Dosage mg = Weight (kg) * Dosage rate (mg/kg/day)',
    explanation: 'Calculates the total daily active chemical mass (mg) and divides it across custom daily dosing frequencies.',
    example: 'A child weighing 15 kg prescribed a pediatric drug at 10 mg/kg/day needs 150 mg daily, split into 75 mg every 12 hours.',
    inputs: [
      { id: 'weightKg', label: 'Patient Body Weight', type: 'number', defaultValue: 15, min: 1, unit: 'kg' },
      { id: 'dosageRate', label: 'Clinical Dosage Rate', type: 'number', defaultValue: 10, min: 0.1, step: 0.5, unit: 'mg/kg/day' },
      { id: 'frequency', label: 'Daily Dosing Intervals', type: 'select', defaultValue: '2', options: [
        { label: 'Once Daily (q.d.)', value: '1' },
        { label: 'Twice Daily (b.i.d.)', value: '2' },
        { label: 'Three Times Daily (t.i.d.)', value: '3' },
        { label: 'Four Times Daily (q.i.d.)', value: '4' }
      ]}
    ],
    faq: [
      { question: 'Why is pediatric dosing weight-based?', answer: 'Children have different metabolic baselines, renal filtering rates, and blood volumes, requiring precise dose scaling relative to weight.' }
    ],
    relatedSlugs: ['iv-flow-rate', 'drug-concentration'],
    seoTitle: 'Pediatric Weight-Based Medical Dosage Calculator',
    seoDescription: 'Obtain estimated active drug dosages and child/adult pharmaceutical split profiles.',
    calculate: (inputs) => {
      const kg = Number(inputs.weightKg || 10);
      const rate = Number(inputs.dosageRate || 5);
      const freq = Number(inputs.frequency || 2);
      
      const dailyMg = kg * rate;
      const singleMg = dailyMg / freq;
      
      return {
        results: [
          { label: 'Total Daily Dosage', value: Number(dailyMg.toFixed(1)), unit: 'mg/day', isPrimary: true },
          { label: 'Dose per Single Interval', value: Number(singleMg.toFixed(1)), unit: 'mg/dose' }
        ]
      };
    }
  },
  {
    id: 'iv-flow-rate',
    name: 'IV Flow Rate Calculator',
    slug: 'iv-flow-rate',
    category: 'medical-pro',
    description: 'Calculate intravenous infusion drip speeds using liquid volumes, infusion hours, and drop elements.',
    formula: 'Drip Rate (gtt/min) = [Volume (mL) * Drop Factor (gtt/mL)] / Time (mins)',
    explanation: 'Converts fluid volumes into physical gravity-fed drop rates (gtt/min) using standard clinical tube factor values.',
    example: 'Infusing 1,000 mL of saline over 8 hours using standard 15 gtt/mL macro-drip tubing requires exactly 31 drops per minute.',
    inputs: [
      { id: 'volumeMl', label: 'Infusion Fluid Volume', type: 'number', defaultValue: 1000, min: 1, unit: 'mL' },
      { id: 'durationHours', label: 'Infusion Time Scale', type: 'number', defaultValue: 8, min: 0.5, step: 0.5, unit: 'hours' },
      { id: 'dropFactor', label: 'Infusion Tubing Drop Factor', type: 'select', defaultValue: '15', options: [
        { label: 'Macro-drip tubing (10 gtt/mL)', value: '10' },
        { label: 'Macro-drip tubing (15 gtt/mL)', value: '15' },
        { label: 'Macro-drip tubing (20 gtt/mL)', value: '20' },
        { label: 'Micro-drip pediatric tubing (60 gtt/mL)', value: '60' }
      ]}
    ],
    faq: [
      { question: 'What is pediatric micro-drip tubing used for?', answer: 'It is calibrated at 60 gtt/mL (where 1 drop/min equals 1 mL/hour) to run slow, high-precision fluid volumes safely.' }
    ],
    relatedSlugs: ['med-dosage', 'drug-concentration'],
    seoTitle: 'Intravenous (IV) Saline Infusion Drip Rate Calculator',
    seoDescription: 'Calculate the physical drops-per-minute (gtt/min) flow speed for intravenous fluids.',
    calculate: (inputs) => {
      const vol = Number(inputs.volumeMl || 500);
      const hrs = Number(inputs.durationHours || 4);
      const factor = Number(inputs.dropFactor || 15);
      
      const mins = hrs * 60;
      const dripRate = (vol * factor) / mins;
      const infusionRate = vol / hrs;
      
      return {
        results: [
          { label: 'Intravenous Drip Rate speed', value: Math.round(dripRate), unit: 'gtt/min (drops/min)', isPrimary: true },
          { label: 'Hourly Flow Infusion Rate', value: Math.round(infusionRate), unit: 'mL/hour' }
        ]
      };
    }
  },
  {
    id: 'med-unit-converter',
    name: 'Medical Unit Converter',
    slug: 'med-unit-converter',
    category: 'medical-pro',
    description: 'Convert blood glucose (sugar) metrics from mg/dL to mmol/L and other medical values.',
    formula: 'Glucose mmol/L = Glucose mg/dL / 18.016',
    explanation: 'Performs molar mass conversions for common biological solutes to reconcile standard global clinical reports.',
    example: 'A blood glucose level of 100 mg/dL converts to 5.5 mmol/L in international units.',
    inputs: [
      { id: 'val', label: 'Value to Convert', type: 'number', defaultValue: 100, min: 1, unit: 'units' },
      { id: 'conversionType', label: 'Conversion Pathway', type: 'select', defaultValue: 'glucose', options: [
        { label: 'Blood Glucose (mg/dL → mmol/L)', value: 'glucose' },
        { label: 'Blood Glucose (mmol/L → mg/dL)', value: 'glucoseRev' },
        { label: 'Cholesterol (mg/dL → mmol/L)', value: 'cholesterol' }
      ]}
    ],
    faq: [
      { question: 'What is the healthy fasting blood glucose range?', answer: 'For a healthy adult, a normal fasting blood glucose level typically stays under 100 mg/dL (5.6 mmol/L).' }
    ],
    relatedSlugs: ['med-dosage', 'health-measurement-gfr'],
    seoTitle: 'Clinical Blood Sugar Glucose Molar Unit Converter',
    seoDescription: 'Convert blood glucose sugar and cholesterol values between US and Metric SI units.',
    calculate: (inputs) => {
      const val = Number(inputs.val || 100);
      const type = String(inputs.conversionType || 'glucose');
      
      let res = 0;
      let targetUnit = '';
      if (type === 'glucose') {
        res = val / 18.016;
        targetUnit = 'mmol/L';
      } else if (type === 'glucoseRev') {
        res = val * 18.016;
        targetUnit = 'mg/dL';
      } else if (type === 'cholesterol') {
        res = val / 38.67;
        targetUnit = 'mmol/L';
      }
      
      return {
        results: [
          { label: 'Converted Medical Outcome', value: Number(res.toFixed(2)), unit: targetUnit, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'drug-concentration',
    name: 'Drug Concentration Calculator',
    slug: 'drug-concentration',
    category: 'medical-pro',
    description: 'Calculate the concentration of solute active pharmaceutical, in solutions of diverse volumes.',
    formula: 'Concentration = Solute Mass (g) / Solvent Volume (mL)',
    explanation: 'Helps medical practitioners formulate correct solution percentages (mg/mL or mcg/mL) for pediatric care.',
    example: 'Dissolving 2 grams of solute in 500 mL of fluid produces a concentration of 4 mg/mL.',
    inputs: [
      { id: 'massMg', label: 'Solute Active Drug Mass', type: 'number', defaultValue: 2000, min: 1, unit: 'mg' },
      { id: 'fluidVolume', label: 'Total Solvent Liquid Volume', type: 'number', defaultValue: 500, min: 1, unit: 'mL' }
    ],
    faq: [
      { question: 'What is the metric ratio conversion rate?', answer: '1 mg/mL is equivalent to exactly 1,000 mcg/mL. Always verify decimal points carefully during formulations.' }
    ],
    relatedSlugs: ['med-dosage', 'iv-flow-rate'],
    seoTitle: 'Pharmaceutical Liquid Drug Concentration Calculator',
    seoDescription: 'Obtain estimated fluid dilutions and active drug concentrations in mg/mL or mcg/mL.',
    calculate: (inputs) => {
      const mass = Number(inputs.massMg || 1000);
      const vol = Number(inputs.fluidVolume || 250);
      
      const concentration = mass / vol;
      const targetMcg = concentration * 1000;
      
      return {
        results: [
          { label: 'Active Concentration Ratio', value: Number(concentration.toFixed(2)), unit: 'mg/mL', isPrimary: true },
          { label: 'Concentration in Micrograms', value: Math.round(targetMcg), unit: 'mcg/mL' }
        ]
      };
    }
  },
  {
    id: 'health-measurement-gfr',
    name: 'Glomerular Filtration Rate (GFR) Calculator',
    slug: 'health-measurement-gfr',
    category: 'medical-pro',
    description: 'Estimate kidney Glomerular Filtration Rates (eGFR) and Mean Arterial Pressure (MAP) using patient parameters.',
    formula: 'eGFR GFR = [(140 - Age) * Weight (kg)] / (72 * Serum Creatinine mg/dL) (* 0.85 if Female)',
    explanation: 'Uses the classic Cockcroft-Gault equation alongside standard renal biomarker indicators.',
    example: 'A 65-year-old male weighing 75 kg with a serum creatinine of 1.1 mg/dL possesses an estimated eGFR of ~64.8 mL/min.',
    inputs: [
      { id: 'age', label: 'Patient Age', type: 'number', defaultValue: 65, min: 18, max: 100, unit: 'years' },
      { id: 'weight', label: 'Patient Body Weight', type: 'number', defaultValue: 75, min: 30, unit: 'kg' },
      { id: 'creatinine', label: 'Serum Creatinine Level', type: 'number', defaultValue: 1.1, min: 0.1, max: 10.0, step: 0.1, unit: 'mg/dL' },
      { id: 'female', label: 'Biological Profile', type: 'select', defaultValue: 'no', options: [
        { label: 'Male', value: 'no' },
        { label: 'Female', value: 'yes' }
      ]}
    ],
    faq: [
      { question: 'What does a low GFR score imply?', answer: 'A GFR below 60 mL/min/1.73m² for 3 months or more may indicate developing Chronic Kidney Disease (CKD), requiring medical evaluation.' }
    ],
    relatedSlugs: ['med-unit-converter', 'medical-ratio'],
    seoTitle: 'Renal Cockcroft-Gault GFR Filtering Calculator',
    seoDescription: 'Estimate renal filtering eGFR capacities and track clearance performance dynamically.',
    calculate: (inputs) => {
      const age = Number(inputs.age || 50);
      const kg = Number(inputs.weight || 70);
      const creat = Number(inputs.creatinine || 1.0);
      const isFemale = String(inputs.female || 'no') === 'yes';
      
      let gfr = ((140 - age) * kg) / (72 * creat);
      if (isFemale) gfr *= 0.85;
      
      let ckdStage = 'Normal Function';
      if (gfr < 15) ckdStage = 'Kidney Failure (Stage 5)';
      else if (gfr < 30) ckdStage = 'Severe Decrease (Stage 4)';
      else if (gfr < 60) ckdStage = 'Moderate Decrease (Stage 3)';
      else if (gfr < 90) ckdStage = 'Mild Decrease (Stage 2)';
      
      return {
        results: [
          { label: 'Estimated GFR Clearance', value: Number(gfr.toFixed(1)), unit: 'mL/min', isPrimary: true },
          { label: 'Renal Filtering Classification', value: ckdStage, unit: '' }
        ]
      };
    }
  },
  {
    id: 'clinical-score-gcs',
    name: 'Glasgow Coma Scale & Clinical Score Calculator',
    slug: 'clinical-score-gcs',
    category: 'medical-pro',
    description: 'Calculate Glasgow Coma Scale (GCS) and APGAR infant scores.',
    formula: 'GCS Score = Eye Opening (1-4) + Verbal Response (1-5) + Motor Response (1-6)',
    explanation: 'Uses a systematic assessment of patient responses to grade cognitive and neural impairment after injury.',
    example: 'Opening eyes to voice (3), utilizing confused conversation (4), and localizing physical pain (5) scores a moderate GCS of 12.',
    inputs: [
      { id: 'eye', label: 'Eye Opening (E)', type: 'select', defaultValue: '3', options: [
        { label: 'No response (1 pt)', value: '1' },
        { label: 'To pain sensation (2 pts)', value: '2' },
        { label: 'To verbal shout (3 pts)', value: '3' },
        { label: 'Spontaneous opening (4 pts)', value: '4' }
      ]},
      { id: 'verbal', label: 'Verbal Response (V)', type: 'select', defaultValue: '4', options: [
        { label: 'No vocal sounds (1 pt)', value: '1' },
        { label: 'Incomprehensible sounds (2 pts)', value: '2' },
        { label: 'Inappropriate word chunks (3 pts)', value: '3' },
        { label: 'Confused conversation (4 pts)', value: '4' },
        { label: 'Oriented, normal speech (5 pts)', value: '5' }
      ]},
      { id: 'motor', label: 'Motor Response (M)', type: 'select', defaultValue: '5', options: [
        { label: 'No response (1 pt)', value: '1' },
        { label: 'Abnormal extension (2 pts)', value: '2' },
        { label: 'Abnormal flexion (3 pts)', value: '3' },
        { label: 'Withdrawal from pain (4 pts)', value: '4' },
        { label: 'Localizes noxious pain (5 pts)', value: '5' },
        { label: 'Obeys motor commands (6 pts)', value: '6' }
      ]}
    ],
    faq: [
      { question: 'What is the maximum achievable GCS score?', answer: 'The scale ranges from 3 (deep unconsciousness or death) to 15 (fully awake, healthy profile).' }
    ],
    relatedSlugs: ['health-measurement-gfr', 'medical-ratio'],
    seoTitle: 'Neurological Glasgow Coma Scale (GCS) Calculator',
    seoDescription: 'Obtain clinical GCS neurological scores for conscious and semi-conscious trauma patients.',
    calculate: (inputs) => {
      const e = Number(inputs.eye || 4);
      const v = Number(inputs.verbal || 5);
      const m = Number(inputs.motor || 6);
      
      const total = e + v + m;
      let level = 'Severe Injury (Comatose)';
      if (total >= 13) level = 'Mild Neurological Impairment';
      else if (total >= 9) level = 'Moderate brain trauma';
      
      return {
        results: [
          { label: 'Cumulative GCS Score', value: total, unit: 'pts/15', isPrimary: true },
          { label: 'Impairment Grading Class', value: level, unit: '' }
        ]
      };
    }
  },
  {
    id: 'medical-ratio-bun',
    name: 'BUN-to-Creatinine Ratio Calculator',
    slug: 'medical-ratio-bun',
    category: 'medical-pro',
    description: 'Calculate renal BUN-to-Creatinine and cholesterol proportions.',
    formula: 'BUN/Creatinine Ratio = Blood Urea Nitrogen (mg/dL) / Serum Creatinine (mg/dL)',
    explanation: 'Uses biochemical markers to identify pre-renal, intrinsic renal, or post-renal causes of kidney stress.',
    example: 'A patient with a BUN count of 45 mg/dL and a creatinine of 1.5 mg/dL features a ratio of 30:1, suggesting dehydration.',
    inputs: [
      { id: 'bun', label: 'Blood Urea Nitrogen (BUN)', type: 'number', defaultValue: 45, min: 1, unit: 'mg/dL' },
      { id: 'creat', label: 'Serum Creatinine', type: 'number', defaultValue: 1.5, min: 0.1, step: 0.1, unit: 'mg/dL' }
    ],
    faq: [
      { question: 'What is a typical healthy BUN/Creatinine ratio?', answer: 'Normal values range from 10:1 to 20:1. A ratio over 20:1 often indicates pre-renal causes, such as dehydration or congestive heart failure.' }
    ],
    relatedSlugs: ['clinical-score-gcs', 'health-measurement-gfr'],
    seoTitle: 'Kidney BUN-to-Creatinine Biomarker Ratio Calculator',
    seoDescription: 'Track diagnostic chemistry ratios like BUN/Creatinine to evaluate kidney performance.',
    calculate: (inputs) => {
      const bun = Number(inputs.bun || 20);
      const creat = Number(inputs.creat || 1.0);
      
      const ratio = creat > 0 ? bun / creat : 0;
      let review = 'Normal renal Profile';
      if (ratio > 20) review = 'Pre-renal (Possible dehydration/decreased flow)';
      else if (ratio < 10) review = 'Intrinsic Renal damage';
      
      return {
        results: [
          { label: 'BUN to Creatinine Proportion', value: Number(ratio.toFixed(1)), unit: ':1', isPrimary: true },
          { label: 'Implied Diagnostic Note', value: review, unit: '' }
        ]
      };
    }
  },

  // MANUFACTURING (78-84)
  {
    id: 'manufacturing-cost',
    name: 'Production Cost Calculator',
    slug: 'manufacturing-cost',
    category: 'manufacturing',
    description: 'Calculate direct materials, direct labor, and factory overhead charges to reveal total manufacturing costs.',
    formula: 'Cost = Raw Materials + Direct Labor + Factory Overhead',
    explanation: 'Aggregates material procurement, operator wages, and machinery/facility amortizations to calculate total production costs and unit costs.',
    example: 'Spending $5,000 on steel, $3,200 on machinery labor, and $1,800 on factory floor rent costs $10,000 to produce 1,000 parts ($10 unit cost).',
    inputs: [
      { id: 'materials', label: 'Direct Raw Materials Cost', type: 'number', defaultValue: 5000, min: 0, unit: '$' },
      { id: 'labor', label: 'Direct Machinist/Operator Labor', type: 'number', defaultValue: 3200, min: 0, unit: '$' },
      { id: 'overhead', label: 'Allocated Factory Overhead', type: 'number', defaultValue: 1800, min: 0, unit: '$' },
      { id: 'volume', label: 'Total Units Manufactured', type: 'number', defaultValue: 1000, min: 1, unit: 'pcs' }
    ],
    faq: [
      { question: 'What falls under factory overhead?', answer: 'Rent, heating utility power, cutting oil, scheduled machine inspections, and plant supervisor salaries.' }
    ],
    relatedSlugs: ['manufacturing-efficiency', 'machine-utilization'],
    seoTitle: 'Total Factory Production & Unit cost Calculator',
    seoDescription: 'Obtain estimated unit costs and factory overhead allocations to set commercial pricing.',
    calculate: (inputs) => {
      const mat = Number(inputs.materials || 0);
      const lab = Number(inputs.labor || 0);
      const over = Number(inputs.overhead || 0);
      const vol = Number(inputs.volume || 1);
      
      const total = mat + lab + over;
      const unitCost = total / vol;
      
      return {
        results: [
          { label: 'Total Production outlay', value: total, unit: '$', isPrimary: true },
          { label: 'Cost per Single Manufactured Unit', value: Number(unitCost.toFixed(2)), unit: '$/unit' },
          { label: 'Prime Cost Share (Materials + Labor)', value: mat + lab, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'manufacturing-efficiency',
    name: 'Manufacturing Efficiency & OEE Calculator',
    slug: 'manufacturing-efficiency',
    category: 'manufacturing',
    description: 'Calculate Overall Equipment Effectiveness (OEE) using availability, performance, and quality factors.',
    formula: 'OEE% = Availability * Performance * Quality',
    explanation: 'Correlates actual machine uptime, theoretical vs actual speeds, and defect rates to measure overall asset productivity.',
    example: 'Running 90% uptime, producing at 85% rate capacity, where 98% of objects pass inspection, achieves a solid 75.0% OEE score.',
    inputs: [
      { id: 'avail', label: 'Availability Factor (Uptime %)', type: 'number', defaultValue: 90, min: 10, max: 100, unit: '%' },
      { id: 'perf', label: 'Performance Factor (Throughput %)', type: 'number', defaultValue: 85, min: 10, max: 100, unit: '%' },
      { id: 'qual', label: 'Quality rate (Pass-Inspection %)', type: 'number', defaultValue: 98, min: 50, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What is a world-class OEE benchmark?', answer: 'An OEE of 85% or higher is considered world-class for discrete manufacturing operations, with negligible defect rates.' }
    ],
    relatedSlugs: ['manufacturing-cost', 'machine-utilization'],
    seoTitle: 'Overall Equipment Effectiveness OEE Efficiency Calculator',
    seoDescription: 'Evaluate availability, throughput speed, and QA pass rates to optimize assembly line performance.',
    calculate: (inputs) => {
      const a = Number(inputs.avail || 100) / 100;
      const p = Number(inputs.perf || 100) / 100;
      const q = Number(inputs.qual || 100) / 100;
      
      const oee = a * p * q * 100;
      
      return {
        results: [
          { label: 'Overall Equipment Effectiveness (OEE)', value: Number(oee.toFixed(1)), unit: '%', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'machine-utilization',
    name: 'Machine Utilization Calculator',
    slug: 'machine-utilization',
    category: 'manufacturing',
    description: 'Track planned assembly shift allocations against active machine runtimes to find idle resource capacities.',
    formula: 'Utilization% = (Actual active Runtime / Scheduled Shift hours) * 100',
    explanation: 'Reveals productive vs idle machine time to help optimize production calendars and resource allocation.',
    example: 'Running a computer CNC machine for 34 hours of a planned 40-hour weekly shift achieves an 85.0% utilization rate.',
    inputs: [
      { id: 'scheduledHrs', label: 'Planned Shift Hours', type: 'number', defaultValue: 40, min: 1, unit: 'hours' },
      { id: 'idleHrs', label: 'Idle / Maintenance Hours', type: 'number', defaultValue: 6, min: 0, unit: 'hours' }
    ],
    faq: [
      { question: 'Why separate utilization from efficiency?', answer: 'Utilization measures active runtime, while efficiency (OEE) evaluates production speed and quality during that runtime.' }
    ],
    relatedSlugs: ['manufacturing-efficiency', 'production-capacity'],
    seoTitle: 'Machine Utilization & Idle Capacity Tracker',
    seoDescription: 'Analyze shift schedules and equipment idle hours to optimize factory asset utilization.',
    calculate: (inputs) => {
      const scheduled = Number(inputs.scheduledHrs || 40);
      const idle = Number(inputs.idleHrs || 0);
      
      const active = Math.max(0, scheduled - idle);
      const uti = (active / scheduled) * 100;
      
      return {
        results: [
          { label: 'Equipment Asset Utilization', value: Number(uti.toFixed(1)), unit: '%', isPrimary: true },
          { label: 'Active Machining Hours', value: active, unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'production-capacity',
    name: 'Production Capacity Calculator',
    slug: 'production-capacity',
    category: 'manufacturing',
    description: 'Calculate maximum factory parts throughput per shift based on unit cycle times.',
    formula: 'Capacity = (Shift hours in seconds / Unit cycle time) * Efficiency',
    explanation: 'Determines potential daily item outputs based on cycle times, shift durations, and average assembly line efficiency.',
    example: 'A line producing 1 component every 12 seconds over an 8-hour shift at 80% efficiency yields exactly 1,920 components.',
    inputs: [
      { id: 'cycleSec', label: 'Unit Cycle Time', type: 'number', defaultValue: 12, min: 0.1, step: 0.1, unit: 'seconds' },
      { id: 'hoursShift', label: 'Worked Hours per Shift', type: 'number', defaultValue: 8, min: 1, max: 24, unit: 'hours' },
      { id: 'lineEff', label: 'Line Operating Efficiency', type: 'range', defaultValue: 80, min: 10, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What is cycle time?', answer: 'The duration required to complete all assembly steps and output a single finished unit.' }
    ],
    relatedSlugs: ['machine-utilization', 'material-usage'],
    seoTitle: 'Assembly Line daily Production Capacity Calculator',
    seoDescription: 'Forecast maximum shift outputs based on cycle time bounds and factory efficiency levels.',
    calculate: (inputs) => {
      const cycle = Number(inputs.cycleSec || 10);
      const hrs = Number(inputs.hoursShift || 8);
      const eff = (Number(inputs.lineEff || 100)) / 100;
      
      const shiftSec = hrs * 3600;
      const rawCap = shiftSec / cycle;
      const finishedCap = rawCap * eff;
      
      return {
        results: [
          { label: 'Projected Output per Shift', value: Math.round(finishedCap), unit: 'finished parts', isPrimary: true },
          { label: 'Theoretical Max (100% Efficiency)', value: Math.round(rawCap), unit: 'parts' }
        ]
      };
    }
  },
  {
    id: 'material-usage',
    name: 'Material Usage & Scrap Calculator',
    slug: 'material-usage',
    category: 'manufacturing',
    description: 'Calculate sheet metal nesting margins and scrap weight percentages for custom stamp designs.',
    formula: 'Scrap% = [(Raw weight - Finished weight) / Raw weight] * 100',
    explanation: 'Tracks stamping scrap percentages to help optimize nesting layouts and lower material costs.',
    example: 'Cutting out a 1.2 kg finished stencil from a 1.8 kg steel blank sheet yields a 33.3% raw scrap waste factor.',
    inputs: [
      { id: 'rawWeight', label: 'Blank Raw Sheet Weight', type: 'number', defaultValue: 1.8, min: 0.1, step: 0.1, unit: 'kg/lbs' },
      { id: 'finishedWeight', label: 'Finished Stencil Weight', type: 'number', defaultValue: 1.2, min: 0.1, step: 0.1, unit: 'kg/lbs' }
    ],
    faq: [
      { question: 'How can stamping scrap be minimized?', answer: 'Use advanced geometric CAD nesting algorithms to pack parts closer together on raw coil stock.' }
    ],
    relatedSlugs: ['production-capacity', 'manufacturing-time'],
    seoTitle: 'Sheet Nesting Material Scrap Weight Calculator',
    seoDescription: 'Calculate sheet metal waste percentages and optimize stamping material usage.',
    calculate: (inputs) => {
      const raw = Number(inputs.rawWeight || 2);
      const fin = Number(inputs.finishedWeight || 1.5);
      
      const netScrap = Math.max(0, raw - fin);
      const pct = raw > 0 ? (netScrap / raw) * 100 : 0;
      
      return {
        results: [
          { label: 'Material Scrap Percentage', value: Number(pct.toFixed(2)), unit: '%', isPrimary: true },
          { label: 'Raw Scrap Weight per part', value: Number(netScrap.toFixed(2)), unit: 'kg/lbs' }
        ]
      };
    }
  },
  {
    id: 'manufacturing-time',
    name: 'Manufacturing Time Calculator',
    slug: 'manufacturing-time',
    category: 'manufacturing',
    description: 'Calculate total production lead times, incorporating machine setup times and unit run times.',
    formula: 'Lead Time = Setup time + Batch Quantity * Cycle run time per unit',
    explanation: 'Models total production times by combing flat setup durations with progressive cycle times.',
    example: 'A batch run of 200 units at 5 mins/unit with a 1.5 hour calibration setup requires 18.2 hours of bench time.',
    inputs: [
      { id: 'batchQty', label: 'Total Batch Quantity', type: 'number', defaultValue: 200, min: 1, unit: 'units' },
      { id: 'setupMin', label: 'Machine Setup / Kalibration Time', type: 'number', defaultValue: 90, min: 1, unit: 'minutes' },
      { id: 'cycleMin', label: 'Unit run time', type: 'number', defaultValue: 5, min: 0.1, step: 0.1, unit: 'minutes/pc' }
    ],
    faq: [
      { question: 'Why is setup time isolated?', answer: 'Setup is fixed regardless of batch size. Isolating setup helps calculate optimal batch sizes to minimize unit costs.' }
    ],
    relatedSlugs: ['material-usage', 'factory-cost-calc'],
    seoTitle: 'Total CNC Machining Batch Run lead Time Calculator',
    seoDescription: 'Project total production lead times by combining setup hours and run times.',
    calculate: (inputs) => {
      const batch = Number(inputs.batchQty || 100);
      const setup = Number(inputs.setupMin || 60);
      const run = Number(inputs.cycleMin || 2);
      
      const totalMins = setup + (batch * run);
      const totalHours = totalMins / 60;
      
      return {
        results: [
          { label: 'Total Machine lead Time', value: Number(totalHours.toFixed(1)), unit: 'Hours', isPrimary: true },
          { label: 'Net Unit runtime share', value: Math.round(batch * run), unit: 'mins' }
        ]
      };
    }
  },
  {
    id: 'factory-cost-calc',
    name: 'Factory Operating Cost Calculator',
    slug: 'factory-cost-calc',
    category: 'manufacturing',
    description: 'Calculate monthly factory footprint costs, combining utility power, leases, and machine maintenance.',
    formula: 'Cost = Electricity (kWh * Rate) + Facility Lease + Machinery Maintenance Reserves',
    explanation: 'Calculates the baseline monthly operational costs of running a heavy manufacturing facility.',
    example: 'A plant consuming 18,000 kWh monthly with a $4,500 lease and $1,200 maintenance reserves costs $8,580/month.',
    inputs: [
      { id: 'kwhUsage', label: 'Monthly Electricity Consumption', type: 'number', defaultValue: 18000, min: 0, unit: 'kWh' },
      { id: 'kwhPrice', label: 'Utility Rate', type: 'number', defaultValue: 0.16, min: 0.01, unit: '$/kWh' },
      { id: 'facilityLease', label: 'Facility Lease / Mortgage', type: 'number', defaultValue: 4500, min: 0, unit: '$' },
      { id: 'maintenanceReserves', label: 'Equipment Maintenance reserves', type: 'number', defaultValue: 1200, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'Why do factories face premium power rates?', answer: 'Industrial plants draw huge peak loads, incurring utility penalties if power factors fall below standard efficiency limits.' }
    ],
    relatedSlugs: ['manufacturing-time', 'manufacturing-cost'],
    seoTitle: 'Heavy Factory Utilities power and lease Cost Calculator',
    seoDescription: 'Estimate monthly factory operating costs by combining facilities, machinery, and utilities.',
    calculate: (inputs) => {
      const kwh = Number(inputs.kwhUsage || 10000);
      const rate = Number(inputs.kwhPrice || 0.15);
      const lease = Number(inputs.facilityLease || 3000);
      const maint = Number(inputs.maintenanceReserves || 1000);
      
      const powerCost = kwh * rate;
      const totalCost = powerCost + lease + maint;
      
      return {
        results: [
          { label: 'Total monthly Facility cost', value: totalCost, unit: '$', isPrimary: true },
          { label: 'Power Utility bill cost share', value: Number(powerCost.toFixed(2)), unit: '$' }
        ]
      };
    }
  },

  // RETAIL (85-90)
  {
    id: 'retail-pricing',
    name: 'Retail Pricing Calculator',
    slug: 'retail-pricing',
    category: 'retail',
    description: 'Calculate retail catalog prices and margins based on wholesale COGS and target markups.',
    formula: 'Retail Price = cost / (1 - Margin%)',
    explanation: 'Determines the optimal retail shelf price needed to achieve target profit margins.',
    example: 'A wholesale product costing $45 carrying a target 40% margin prices at $75.00 on the shelf.',
    inputs: [
      { id: 'wholesaleCost', label: 'Wholesale Item Cost (COGS)', type: 'number', defaultValue: 45, min: 0.1, unit: '$' },
      { id: 'targetMargin', label: 'Target Gross Profit Margin', type: 'number', defaultValue: 40, min: 1, max: 95, unit: '%' }
    ],
    faq: [
      { question: 'What is the difference between markup and margin?', answer: 'Margin is profit divided by retail price. Markup is profit divided by wholesale cost.' }
    ],
    relatedSlugs: ['retail-discount', 'retail-markup'],
    seoTitle: 'Wholesale COGS to Retail Catalog Price Calculator',
    seoDescription: 'Convert gross wholesale product costs into optimal shelf prices to hit margin targets.',
    calculate: (inputs) => {
      const cost = Number(inputs.wholesaleCost || 10);
      const margin = Number(inputs.targetMargin || 50) / 100;
      
      const price = cost / (1 - margin);
      const profit = price - cost;
      const markup = (profit / cost) * 100;
      
      return {
        results: [
          { label: 'Suggested Retail Price', value: Number(price.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Gross Profit Margin Value', value: Number(profit.toFixed(2)), unit: '$' },
          { label: 'Equivalent Markup rate', value: Number(markup.toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'retail-discount',
    name: 'Retail Discount Calculator',
    slug: 'retail-discount',
    category: 'retail',
    description: 'Calculate final checkout tags and total savings when stackable promotional coupons are applied.',
    formula: 'Discounted Price = Original * (1 - Promo_1%) * (1 - Promo_2%)',
    explanation: 'Calculates sequential, compound price markdowns for multi-flyer marketing promotions.',
    example: 'An $80 item carrying a 25% flyer discount and an extra 10% loyalty card coupon sells for $54.00.',
    inputs: [
      { id: 'originalPrice', label: 'Original Item Tag Price', type: 'number', defaultValue: 80, min: 1, unit: '$' },
      { id: 'disc1', label: 'Flyer Promo Discount', type: 'number', defaultValue: 25, min: 0, max: 100, unit: '%' },
      { id: 'disc2', label: 'Extra Loyalty / Card Coupon', type: 'number', defaultValue: 10, min: 0, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'Are stackable discounts added together?', answer: 'No. They are typically applied sequentially. E.g., a 25% and 10% stackable discount equals a 32.5% total reduction, not 35%.' }
    ],
    relatedSlugs: ['retail-pricing', 'retail-markup'],
    seoTitle: 'Sequential stackable promo Coupon Discount Calculator',
    seoDescription: 'Calculate final checkout tags when stackable holiday discounts and coupon codes overlap.',
    calculate: (inputs) => {
      const original = Number(inputs.originalPrice || 100);
      const d1 = Number(inputs.disc1 || 0) / 100;
      const d2 = Number(inputs.disc2 || 0) / 100;
      
      const price1 = original * (1 - d1);
      const finalPrice = price1 * (1 - d2);
      const overallSavings = original - finalPrice;
      
      return {
        results: [
          { label: 'Final Discounted Price', value: Number(finalPrice.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Total Saved Discount Cash', value: Number(overallSavings.toFixed(2)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'retail-markup',
    name: 'Retail Markup Calculator',
    slug: 'retail-markup',
    category: 'retail',
    description: 'Calculate markup percentages and pricing multipliers from wholesale cost baselines.',
    formula: 'Markup% = [(Retail Price - Cost) / Cost] * 100',
    explanation: 'Calculates wholesale markup percentages and pricing multipliers to help set shelf prices.',
    example: 'An item with a $20 wholesale cost priced at $50 on the shelf carries a 150% markup (2.5x multiple).',
    inputs: [
      { id: 'wholesale', label: 'Wholesale Cost', type: 'number', defaultValue: 20, min: 0.1, unit: '$' },
      { id: 'retailPrice', label: 'Shelf Retail Price', type: 'number', defaultValue: 50, min: 0.1, unit: '$' }
    ],
    faq: [
      { question: 'Why do luxury brands use high markups?', answer: 'To cover heavy designer labor, branding campaigns, premium packaging, boutique rents, and lower sales volumes.' }
    ],
    relatedSlugs: ['retail-pricing', 'retail-discount'],
    seoTitle: 'Wholesale to Shelf Retail Markup Calculator',
    seoDescription: 'Determine wholesale markup percentages and pricing multipliers to evaluate profit margins.',
    calculate: (inputs) => {
      const cost = Number(inputs.wholesale || 10);
      const price = Number(inputs.retailPrice || 25);
      
      const markup = cost > 0 ? ((price - cost) / cost) * 100 : 0;
      const grossMargin = price > 0 ? ((price - cost) / price) * 100 : 0;
      const multiplier = cost > 0 ? price / cost : 0;
      
      return {
        results: [
          { label: 'Calculated Markup rate', value: Number(markup.toFixed(1)), unit: '%', isPrimary: true },
          { label: 'Gross Profit Margin Ratio', value: Number(grossMargin.toFixed(1)), unit: '%' },
          { label: 'Wholesale Price Multiplier', value: Number(multiplier.toFixed(2)), unit: 'x' }
        ]
      };
    }
  },
  {
    id: 'retail-inventory-cost',
    name: 'Inventory Cost and Holding Calculator',
    slug: 'retail-inventory-cost',
    category: 'retail',
    description: 'Calculate monthly inventory holding costs, including warehouse rent, insurance, and obsolescence.',
    formula: 'Holding Cost = Average Inventory Value * Holding Cost % (Avg 20-30% annually)',
    explanation: 'Models real warehouse overheads and security fees to reveal hidden warehouse carrying costs.',
    example: 'Storing $150,000 of inventory with a 25% annual carrying rate costs approximately $3,125/month.',
    inputs: [
      { id: 'avgInventoryVal', label: 'Average Inventory Asset Value', type: 'number', defaultValue: 150000, min: 1000, unit: '$' },
      { id: 'holdingAnnualPct', label: 'Annual Holding Cost rate', type: 'number', defaultValue: 25, min: 5, max: 60, unit: '%' }
    ],
    faq: [
      { question: 'What is obsolescence cost?', answer: 'The financial loss that occurs when products expire, degrade, or become outdated before they can be sold.' }
    ],
    relatedSlugs: ['retail-stock-profit', 'retail-sales-pipeline'],
    seoTitle: 'Warehouse Inventory Carrying Cost Calculator',
    seoDescription: 'Calculate annual and monthly warehouse holding costs to optimize inventory levels.',
    calculate: (inputs) => {
      const val = Number(inputs.avgInventoryVal || 10000);
      const pct = (Number(inputs.holdingAnnualPct || 25)) / 100;
      
      const annualCost = val * pct;
      const monthlyCost = annualCost / 12;
      
      return {
        results: [
          { label: 'Monthly Inventory Holding Cost', value: Math.round(monthlyCost), unit: '$', isPrimary: true },
          { label: 'Annual Total carrying Cost', value: Math.round(annualCost), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'retail-stock-profit',
    name: 'Stock Profit Calculator',
    slug: 'retail-stock-profit',
    category: 'retail',
    description: 'Calculate gross margins and bulk profits on a run of inventory sales.',
    formula: 'Profit = Quantity sold * (Retail Price - wholesale cost)',
    explanation: 'Subtracts wholesale cost from retail price and multiplies by quantity sold to find gross profit and ROI.',
    example: 'Selling 1,500 units bought for $8 and priced at $20 yields a gross stock profit of $18,000.',
    inputs: [
      { id: 'costUnit', label: 'Wholesale cost per unit', type: 'number', defaultValue: 8.0, min: 0.1, step: 0.1, unit: '$' },
      { id: 'priceUnit', label: 'Retail price per unit', type: 'number', defaultValue: 20.0, min: 0.1, step: 0.1, unit: '$' },
      { id: 'qtySold', label: 'Inventory Units Sold', type: 'number', defaultValue: 1500, min: 1, unit: 'pcs' }
    ],
    faq: [
      { question: 'How can I maximize stock profits?', answer: 'Focus on scaling sales velocity, negotiating bulk discounts with suppliers, and optimizing retail prices to match consumer demand.' }
    ],
    relatedSlugs: ['retail-pricing', 'retail-inventory-cost'],
    seoTitle: 'Bulk Stock Inventory profit Margin Calculator',
    seoDescription: 'Calculate gross profit and return on investment (ROI) on bulk inventory runs.',
    calculate: (inputs) => {
      const cost = Number(inputs.costUnit || 1);
      const price = Number(inputs.priceUnit || 2);
      const qty = Number(inputs.qtySold || 100);
      
      const profitPerUnit = price - cost;
      const grossProfit = profitPerUnit * qty;
      const totalCostBatch = cost * qty;
      const roi = totalCostBatch > 0 ? (grossProfit / totalCostBatch) * 100 : 0;
      
      return {
        results: [
          { label: 'Gross Stock Profit Earned', value: grossProfit, unit: '$', isPrimary: true },
          { label: 'Batch Purchase Cost', value: totalCostBatch, unit: '$' },
          { label: 'Batch Return on Investment (ROI)', value: Number(roi.toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'retail-sales-pipeline',
    name: 'Retail Sales & Conversion Calculator',
    slug: 'retail-sales',
    category: 'retail',
    description: 'Calculate store revenue using checkout conversions, visitor counts, and average purchase amounts.',
    formula: 'Revenue = Foot Traffic * Purchase Conversion Rate * Average Ticket Value',
    explanation: 'Models real-world retail traffic and purchase conversions to forecast daily and monthly store revenues.',
    example: 'A store with 1,200 daily visitors converting at 3.5% with a $45 average purchase generates $1,890 in daily revenue.',
    inputs: [
      { id: 'footTraffic', label: 'Daily Customer Foot Traffic', type: 'number', defaultValue: 1200, min: 1, unit: 'users/day' },
      { id: 'conversionPct', label: 'Purchase Conversion Rate', type: 'number', defaultValue: 3.5, min: 0.1, max: 100, step: 0.1, unit: '%' },
      { id: 'ticketVal', label: 'Average Customer Checkout Ticket', type: 'number', defaultValue: 45, min: 1, unit: '$' }
    ],
    faq: [
      { question: 'What is a typical retail conversion rate?', answer: 'Physical retail conversion rates average 20% to 30%, whereas online e-commerce conversion rates typically span 2% to 4%.' }
    ],
    relatedSlugs: ['retail-pricing', 'retail-stock-profit'],
    seoTitle: 'Retail Store Sales Pipeline Conversion Calculator',
    seoDescription: 'Estimate retail revenue by varying store foot traffic, customer conversion rates, and average purchase tags.',
    calculate: (inputs) => {
      const traffic = Number(inputs.footTraffic || 100);
      const conv = (Number(inputs.conversionPct || 3)) / 100;
      const ticket = Number(inputs.ticketVal || 20);
      
      const orders = traffic * conv;
      const dailyRev = orders * ticket;
      const monthlyRev = dailyRev * 30;
      
      return {
        results: [
          { label: 'Projected Monthly Revenue', value: Math.round(monthlyRev), unit: '$', isPrimary: true },
          { label: 'Daily Sales Revenue', value: Math.round(dailyRev), unit: '$' },
          { label: 'Daily Completed Purchases', value: Number(orders.toFixed(1)), unit: 'sales' }
        ]
      };
    }
  },

  // RESTAURANT & FOOD BUSINESS (91-96)
  {
    id: 'food-cost-pct',
    name: 'Food Cost Calculator',
    slug: 'food-cost-pct',
    category: 'restaurant',
    description: 'Calculate food cost percentages using plate ingredient costs and menu pricing.',
    formula: 'Food Cost% = (Ingredient Costs / Menu Price) * 100',
    explanation: 'Measures standard recipe cost-of-goods percentages to evaluate restaurant menu profitability.',
    example: 'An entrée costing $4.50 to prepare priced at $16.00 on the menu has a healthy 28.1% food cost percentage.',
    inputs: [
      { id: 'ingredientsCost', label: 'Plate Ingredients Cost', type: 'number', defaultValue: 4.5, min: 0.1, step: 0.1, unit: '$' },
      { id: 'menuPrice', label: 'Active Menu Retail Price', type: 'number', defaultValue: 16.0, min: 1, step: 0.5, unit: '$' }
    ],
    faq: [
      { question: 'What is the healthy benchmark food cost percentage?', answer: 'Most profitable commercial restaurants target food cost percentages between 28% and 35% to maintain margin safety.' }
    ],
    relatedSlugs: ['recipe-costing', 'menu-pricing-calc'],
    seoTitle: 'Plate Recipe Ingredient food Cost percentage Calculator',
    seoDescription: 'Calculate food cost percentages to verify the financial profitability of your menu items.',
    calculate: (inputs) => {
      const cost = Number(inputs.ingredientsCost || 3);
      const price = Number(inputs.menuPrice || 12);
      
      const pctValue = price > 0 ? (cost / price) * 100 : 0;
      const profitContribution = price - cost;
      
      return {
        results: [
          { label: 'Calculated Food Cost Percentage', value: Number(pctValue.toFixed(1)), unit: '%', isPrimary: true },
          { label: 'Gross Profit Contribution per Plate', value: Number(profitContribution.toFixed(2)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'recipe-costing',
    name: 'Recipe Cost Calculator',
    slug: 'recipe-costing',
    category: 'restaurant',
    description: 'Calculate the total cost to prepare a recipe by combining bulk ingredient weights and portion sizes.',
    formula: 'Ingredient Cost = (Wholesale Cost / Bulk Size) * Portion Size',
    explanation: 'Converts bulk purchases into precise, single-portion ingredient costs to help calculate meal prices.',
    example: 'Using 6 ounces of steak from a 10-lb bulk box bought for $90 costs exactly $3.38 for that ingredient.',
    inputs: [
      { id: 'bulkWeight', label: 'Bulk Purchased Weight', type: 'number', defaultValue: 10, min: 0.1, unit: 'lbs' },
      { id: 'bulkPrice', label: 'Bulk Wholesale Price Paid', type: 'number', defaultValue: 90, min: 1, unit: '$' },
      { id: 'portionOz', label: 'Standard Portion Size', type: 'number', defaultValue: 6, min: 0.1, step: 0.1, unit: 'ounces' }
    ],
    faq: [
      { question: 'How do standard units convert?', answer: '1 lb contains exactly 16 ounces. Always convert units to a common multiplier before running calculations.' }
    ],
    relatedSlugs: ['food-cost-pct', 'menu-pricing-calc'],
    seoTitle: 'Single Portion Bulk Recipe Costing Calculator',
    seoDescription: 'Calculate precise ingredient costs per portion using raw bulk pricing and portion sizes.',
    calculate: (inputs) => {
      const bulkLb = Number(inputs.bulkWeight || 10);
      const bulkPrice = Number(inputs.bulkPrice || 50);
      const portionOz = Number(inputs.portionOz || 8);
      
      const totalOuncesVal = bulkLb * 16;
      const costPerOz = totalOuncesVal > 0 ? bulkPrice / totalOuncesVal : 0;
      const portionCostVal = costPerOz * portionOz;
      
      return {
        results: [
          { label: 'Cost per single Portion', value: Number(portionCostVal.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Cost per Dry Ounce', value: Number(costPerOz.toFixed(3)), unit: '$/oz' }
        ]
      };
    }
  },
  {
    id: 'menu-pricing-calc',
    name: 'Menu Pricing Calculator',
    slug: 'menu-pricing-calc',
    category: 'restaurant',
    description: 'Calculate suggested menu prices using target food cost percentages and ingredient costs.',
    formula: 'Suggested Price = wholesale ingredients cost / Target food cost %',
    explanation: 'Calculates the suggested menu retail price based on your raw food cost and target margin percentages.',
    example: 'An entrée with $3.80 of raw ingredients and a 30% target food cost prices at $12.67 on the menu.',
    inputs: [
      { id: 'rawIngredientsCost', label: 'Plate Wholesale Ingredients Cost', type: 'number', defaultValue: 3.80, min: 0.1, step: 0.1, unit: '$' },
      { id: 'targetFoodCostPct', label: 'Target Food Cost %', type: 'number', defaultValue: 30, min: 5, max: 80, unit: '%' }
    ],
    faq: [
      { question: 'Does menu pricing cover labor costs?', answer: 'No. The remaining percentage (e.g. 70%) must cover kitchen prep work, front-of-house staff, dining leases, and utility power.' }
    ],
    relatedSlugs: ['food-cost-pct', 'recipe-costing'],
    seoTitle: 'Restaurant Menu Suggested Retail Pricing Calculator',
    seoDescription: 'Determine suggests menu card prices using target food cost margins and wholesale costs.',
    calculate: (inputs) => {
      const cost = Number(inputs.rawIngredientsCost || 3);
      const targetPct = Number(inputs.targetFoodCostPct || 30) / 100;
      
      const suggested = targetPct > 0 ? cost / targetPct : 0;
      
      return {
        results: [
          { label: 'Suggested Menu Price', value: Number(suggested.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Gross Margin contribution', value: Number((suggested - cost).toFixed(2)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'restaurant-profit-calc',
    name: 'Restaurant Profit Calculator',
    slug: 'restaurant-profit-calc',
    category: 'restaurant',
    description: 'Calculate monthly restaurant profits by combining guest checks, labor costs, and rent.',
    formula: 'Net cash = Monthly Cover tickets * Average guest cover check - Labor - Rent - Food cost',
    explanation: 'Models monthly dining revenues, labor costs, food COGS, and utilities to forecast net profits.',
    example: 'A restaurant serving 4,500 guests checking at $35, with $45,000 labor, $5,000 rent, and 30% food costs, nets $55,000.',
    inputs: [
      { id: 'guestsShift', label: 'Monthly Dining Guest covers', type: 'number', defaultValue: 4500, min: 10, step: 50, unit: 'guests/mth' },
      { id: 'avgTicket', label: 'Average Guest Check Ticket', type: 'number', defaultValue: 35, min: 5, unit: '$' },
      { id: 'laborMonthly', label: 'Staff payroll & kitchen labor', type: 'number', defaultValue: 45000, min: 1000, unit: '$' },
      { id: 'rentUtilities', label: 'Monthly Lease + Gas Utilities', type: 'number', defaultValue: 5000, min: 500, unit: '$' },
      { id: 'actualFoodCostPct', label: 'Average food cost % share', type: 'number', defaultValue: 30, min: 10, max: 70, unit: '%' }
    ],
    faq: [
      { question: 'What is prime cost in restaurants?', answer: 'The sum of your total cost of food (COGS) and your total labor costs. Prime cost should not exceed 60% of total revenue to maintain profitability.' }
    ],
    relatedSlugs: ['menu-pricing-calc', 'food-inventory-cogs'],
    seoTitle: 'Restaurant monthly Net Operating Profit Calculator',
    seoDescription: 'Forecast monthly dining net margins by combining guest covers, staffing, and food costs.',
    calculate: (inputs) => {
      const guests = Number(inputs.guestsShift || 1000);
      const ticket = Number(inputs.avgTicket || 20);
      const labor = Number(inputs.laborMonthly || 15000);
      const rent = Number(inputs.rentUtilities || 3000);
      const foodP = (Number(inputs.actualFoodCostPct || 30)) / 100;
      
      const totalRevenue = guests * ticket;
      const foodCostTotalVal = totalRevenue * foodP;
      const netProfit = totalRevenue - foodCostTotalVal - labor - rent;
      const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      
      return {
        results: [
          { label: 'Estimated net monthly profit', value: Math.round(netProfit), unit: '$', isPrimary: true },
          { label: 'Total restaurant revenue', value: totalRevenue, unit: '$' },
          { label: 'Net Profit margin ratio', value: Number(margin.toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'food-inventory-cogs',
    name: 'Food Inventory & COGS Calculator',
    slug: 'food-inventory-cogs',
    category: 'restaurant',
    description: 'Calculate restaurant Cost of Goods Sold (COGS) using inventory levels and wholesale orders.',
    formula: 'COGS = Beginning Stock + Wholesale Shipments - Ending Stock',
    explanation: 'Combines beginning stock, orders, and ending stock levels to track real-world food costs and minimize waste.',
    example: 'Starting with $15,000 of stock, ordering $42,000, and finishing with $18,000 leaves exactly $39,000 in food COGS.',
    inputs: [
      { id: 'beginningInventory', label: 'Beginning stock value', type: 'number', defaultValue: 15000, min: 0, unit: '$' },
      { id: 'ordersAdded', label: 'Wholesale Shipments purchased', type: 'number', defaultValue: 42000, min: 0, unit: '$' },
      { id: 'endingInventory', label: 'Ending shelf stock value', type: 'number', defaultValue: 18000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'How is physical inventory valued?', answer: 'Using actual wholesale costs per item to sum the total value of stock currently on the shelves.' }
    ],
    relatedSlugs: ['restaurant-profit-calc', 'food-portion-calc'],
    seoTitle: 'Restaurant Food COGS Cost of Sales Calculator',
    seoDescription: 'Calculate food Cost of Goods Sold (COGS) using starting stock and orders to monitor waste.',
    calculate: (inputs) => {
      const beg = Number(inputs.beginningInventory || 0);
      const ord = Number(inputs.ordersAdded || 0);
      const end = Number(inputs.endingInventory || 0);
      
      const cogs = beg + ord - end;
      
      return {
        results: [
          { label: 'Food Cost of Goods Sold (COGS)', value: cogs, unit: '$', isPrimary: true },
          { label: 'Raw Stock turnover value', value: beg + ord, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'food-portion-calc',
    name: 'Catering Portion Calculator',
    slug: 'food-portion-calc',
    category: 'restaurant',
    description: 'Calculate required bulk recipe weights based on event guest counts and portion sizes.',
    formula: 'Total Required (lbs) = (Guest Count * Portion Size Oz) / 16',
    explanation: 'Converts target dining portion sizes into clean bulk purchase weights to streamline event food ordering.',
    example: 'Serving a 6 oz portion of protein to 150 catering guests requires exactly 56.3 lbs of bulk purchases.',
    inputs: [
      { id: 'guestsCount', label: 'Event Guest Count', type: 'number', defaultValue: 150, min: 1, unit: 'guests' },
      { id: 'portionOz', label: 'Portion size per seat', type: 'number', defaultValue: 6, min: 1, unit: 'ounces' }
    ],
    faq: [
      { question: 'What is the standard yield loss for roasted beef?', answer: 'Raw meat loses 20% to 30% of its weight during cooking. Increase raw ordering weights to ensure adequate finished portions.' }
    ],
    relatedSlugs: ['food-inventory-cogs', 'recipe-costing'],
    seoTitle: 'Catering Bulk portion sizing Calculator',
    seoDescription: 'Obtain estimated raw bulk ingredient requirements based on event guest counts and ounces.',
    calculate: (inputs) => {
      const guests = Number(inputs.guestsCount || 100);
      const portion = Number(inputs.portionOz || 8);
      
      const totalOz = guests * portion;
      const totalLbs = totalOz / 16;
      
      return {
        results: [
          { label: 'Bulk Required material weight', value: Number(totalLbs.toFixed(1)), unit: 'lbs', isPrimary: true },
          { label: 'Total Ounces to Portion', value: totalOz, unit: 'oz' }
        ]
      };
    }
  },

  // REAL ESTATE PROFESSIONAL (97-101)
  {
    id: 'property-roi',
    name: 'Property ROI Calculator',
    slug: 'property-roi',
    category: 'real-estate-pro',
    description: 'Calculate annual property yields and cash-on-cash ROI based on purchase costs and rental income.',
    formula: 'ROI = (Annual Net Rent / Purchase Capital) * 100',
    explanation: 'Models downpayments, closing costs, and rental yields to calculate real estate cash-on-cash ROI.',
    example: 'A property costing $250,000 bought with a $50,000 downpayment that yields $4,200 annual cash flow achieves an 8.4% cash-on-cash return.',
    inputs: [
      { id: 'purchaseCost', label: 'Total Purchase Cost', type: 'number', defaultValue: 250000, min: 1000, unit: '$' },
      { id: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 50000, min: 0, unit: '$' },
      { id: 'grossMonthlyRent', label: 'Gross Monthly Rent Income', type: 'number', defaultValue: 2200, min: 1, unit: '$' },
      { id: 'nonMortgageExpenses', label: 'Monthly Expenses (Taxes, Insurance, Repairs)', type: 'number', defaultValue: 600, min: 0, unit: '$' },
      { id: 'mortgageInterestRate', label: 'Mortgage Interest Rate', type: 'number', defaultValue: 6.5, min: 0, max: 20, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'What is cash-on-cash return?', answer: 'The ratio of annual cash flow to the actual cash invested, which is a key metric for evaluating real estate performance.' }
    ],
    relatedSlugs: ['rental-profit', 'property-cash-flow'],
    seoTitle: 'Rental Real Estate property ROI & Yield Calculator',
    seoDescription: 'Calculate cash-on-cash ROI and capitalization rates for rental properties.',
    calculate: (inputs) => {
      const price = Number(inputs.purchaseCost || 200000);
      const dp = Number(inputs.downPayment || 40000);
      const rent = Number(inputs.grossMonthlyRent || 1500);
      const opex = Number(inputs.nonMortgageExpenses || 400);
      const rate = Number(inputs.mortgageInterestRate || 6);
      
      const loan = price - dp;
      // Simple 30-year amortization monthly payment estimation
      const r = (rate / 100) / 12;
      const mortPayment = loan > 0 && r > 0 ? (loan * r * Math.pow(1 + r, 360)) / (Math.pow(1 + r, 360) - 1) : 0;
      
      const monthlyCashflow = rent - opex - mortPayment;
      const annualCashflow = monthlyCashflow * 12;
      
      const cashOnCashRoy = dp > 0 ? (annualCashflow / dp) * 100 : 0;
      const capRate = price > 0 ? (((rent - opex) * 12) / price) * 100 : 0;
      
      return {
        results: [
          { label: 'Cash-on-Cash ROI Yield', value: Number(cashOnCashRoy.toFixed(2)), unit: '%', isPrimary: true },
          { label: 'Unleveraged Capitalization Rate', value: Number(capRate.toFixed(2)), unit: '%' },
          { label: 'Net Monthly Operating cash flow', value: Math.round(monthlyCashflow), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'rental-profit',
    name: 'Rental Profit Calculator',
    slug: 'rental-profit',
    category: 'real-estate-pro',
    description: 'Calculate property rental income and cap rates based on rent levels and operating expenses.',
    formula: 'Net Operating Income (NOI) = Gross Rent - vacancy allowance - expenses',
    explanation: 'Deducts standard vacancies (8%) and property management fees to estimate real rental income.',
    example: 'A $2,000 monthly rental property with 8% vacancy and $550 expenses nets $1,290/month.',
    inputs: [
      { id: 'rentAmt', label: 'Gross Monthly Rent', type: 'number', defaultValue: 2000, min: 10, unit: '$' },
      { id: 'expensesMonthly', label: 'Monthly Expenses (HOA, Taxes, Main)', type: 'number', defaultValue: 550, min: 0, unit: '$' },
      { id: 'vacancyRate', label: 'Assumed Vacancy rate buffer', type: 'number', defaultValue: 8, min: 0, max: 50, unit: '%' }
    ],
    faq: [
      { question: 'Why plan for vacancy rate buffers?', answer: 'Properties occasionally sit empty during tenant transitions. Budgeting an 8% buffer helps prevent unexpected cash shortages.' }
    ],
    relatedSlugs: ['property-roi', 'property-cash-flow'],
    seoTitle: 'Rental property Net Operating Income (NOI) Calculator',
    seoDescription: 'Calculate net operating income (NOI) and cap rates for rental properties.',
    calculate: (inputs) => {
      const rent = Number(inputs.rentAmt || 1000);
      const opex = Number(inputs.expensesMonthly || 300);
      const vacancy = (Number(inputs.vacancyRate || 8)) / 100;
      
      const netRent = rent * (1 - vacancy);
      const monthlyNoi = netRent - opex;
      const annualNoi = monthlyNoi * 12;
      
      return {
        results: [
          { label: 'Annual Net Operating Income (NOI)', value: annualNoi, unit: '$', isPrimary: true },
          { label: 'Net Monthly Rental income', value: Math.round(monthlyNoi), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'property-cash-flow',
    name: 'Property Cash Flow Calculator',
    slug: 'property-cash-flow',
    category: 'real-estate-pro',
    description: 'Calculate monthly property cash flow, including mortgage payments and management fees.',
    formula: 'Cash Flow = Rent - mortgage P&I - manager fee - reserve savings',
    explanation: 'Models real-world property expenses to forecast monthly net cash flow.',
    example: 'A renting property collecting $2,500/mo with a $1,200 mortgage and $250 manager fee yields $1,050/mth.',
    inputs: [
      { id: 'rentMonthly', label: 'Monthly Rent Income Collected', type: 'number', defaultValue: 2500, min: 1, unit: '$' },
      { id: 'mortgageInterest', label: 'Mortgage Principal & Interest payment', type: 'number', defaultValue: 1200, min: 0, unit: '$' },
      { id: 'managementFeePct', label: 'Property Manager fee percentage', type: 'number', defaultValue: 10, min: 0, max: 25, unit: '%' }
    ],
    faq: [
      { question: 'Are property managers worth their fee?', answer: 'For out-of-town owners, paying a 10% manager fee is an effective way to handle repair requests and tenant screenings.' }
    ],
    relatedSlugs: ['property-roi', 'rental-profit'],
    seoTitle: 'Rental Property Monthly Cash Flow Calculator',
    seoDescription: 'Calculate monthly cash flow, including mortgage payments and management fees.',
    calculate: (inputs) => {
      const rent = Number(inputs.rentMonthly || 1500);
      const mort = Number(inputs.mortgageInterest || 800);
      const mPct = (Number(inputs.managementFeePct || 10)) / 100;
      
      const mFee = rent * mPct;
      const netCash = rent - mort - mFee;
      
      return {
        results: [
          { label: 'Monthly cash pocket surplus', value: Math.round(netCash), unit: '$', isPrimary: true },
          { label: 'Manager fee cost amount', value: Math.round(mFee), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'property-cost',
    name: 'Property Purchasing Cost Calculator',
    slug: 'property-cost',
    category: 'real-estate-pro',
    description: 'Calculate total property purchasing costs, including title transfers, stamp duties, and closing costs.',
    formula: 'Purchase Cost = Listing price + Land stamp duty + Title Insurance + Broker fee',
    explanation: 'Aggregates purchasing fees and closing costs to help calculate required investment capital.',
    example: 'A $300,000 property carries ~$10,500 in total transaction overheads, requiring $310,500 in buying capital.',
    inputs: [
      { id: 'listingPrice', label: 'Property Listing Buy Price', type: 'number', defaultValue: 300000, min: 1000, unit: '$' },
      { id: 'transferTaxPct', label: 'Land Stamp Transfer Tax', type: 'number', defaultValue: 2.0, min: 0, max: 10, step: 0.1, unit: '%' },
      { id: 'legalClosingCosts', label: 'Attorney and Title Closing costs', type: 'number', defaultValue: 4500, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is transfer tax?', answer: 'A regional tax charged by local governments to officially register the transfer of land ownership.' }
    ],
    relatedSlugs: ['property-roi', 'construction-budget'],
    seoTitle: 'Property Purchasing Cost & Closing Fees Calculator',
    seoDescription: 'Calculate total property purchasing costs, including title transfers and closing costs.',
    calculate: (inputs) => {
      const price = Number(inputs.listingPrice || 200000);
      const taxP = (Number(inputs.transferTaxPct || 1.5)) / 100;
      const closing = Number(inputs.legalClosingCosts || 3000);
      
      const taxCost = price * taxP;
      const grandTotalCapital = price + taxCost + closing;
      
      return {
        results: [
          { label: 'Required Buying Capital', value: Math.round(grandTotalCapital), unit: '$', isPrimary: true },
          { label: 'Stamp Duty Transfer Tax cost', value: Math.round(taxCost), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'construction-budget',
    name: 'Construction Budget Calculator',
    slug: 'construction-budget',
    category: 'real-estate-pro',
    description: 'Calculate framing wood, sheet roofing, and general material costs for home renovations.',
    formula: 'Budget = (Framing Lumber Cost + Contractor Bid + Permits) * (1 + Contingency)',
    explanation: 'Aggregates contractor bids and permit costs, applying a safety contingency buffer to prevent budget overruns.',
    example: 'A $120,000 room addition bid carrying a 12% safety contingency requires $134,400 in total financing.',
    inputs: [
      { id: 'contractorBid', label: 'Primary Contractor Bid Price', type: 'number', defaultValue: 120000, min: 1000, unit: '$' },
      { id: 'materialsEst', label: 'Permits and Survey fees cost', type: 'number', defaultValue: 5000, min: 0, unit: '$' },
      { id: 'contingencyFactor', label: 'Safety Contingency buffer', type: 'number', defaultValue: 12, min: 0, max: 40, unit: '%' }
    ],
    faq: [
      { question: 'Why budget a building structural contingency?', answer: 'Excavation and renovation projects often reveal hidden foundation settling issues, wiring hazards, or plumbing damage that must be resolved.' }
    ],
    relatedSlugs: ['property-cost', 'property-roi'],
    seoTitle: 'Construction Renovation Project Budget Planner',
    seoDescription: 'Plan your renovation budget and calculate required safety contingency finance buffers.',
    calculate: (inputs) => {
      const contractor = Number(inputs.contractorBid || 50000);
      const materials = Number(inputs.materialsEst || 5000);
      const contingency = (Number(inputs.contingencyFactor || 10)) / 100;
      
      const subtotal = contractor + materials;
      const cushion = subtotal * contingency;
      const totalBudget = subtotal + cushion;
      
      return {
        results: [
          { label: 'Advised financing budget', value: Math.round(totalBudget), unit: '$', isPrimary: true },
          { label: 'contingency reserve cushion', value: Math.round(cushion), unit: '$' }
        ]
      };
    }
  },

  // TRANSPORT PROFESSIONAL (102-106)
  {
    id: 'fleet-operating-cost',
    name: 'Fleet Cost Calculator',
    slug: 'fleet-operating-cost',
    category: 'transport-pro',
    description: 'Calculate commercial truck fleet operating costs per mile, combining fuel, labor, and maintenance.',
    formula: 'Cost per Mile = Fuel cost + Driver hourly pay wage + maintenance + leases',
    explanation: 'Aggregates fuel consumption, driver pay, and maintenance reserves to calculate running costs per mile.',
    example: 'A commercial semi-truck costs approximately $1.85 per mile to operate under standard diesel fuel and maintenance rates.',
    inputs: [
      { id: 'dieselPrice', label: 'Diesel Fuel Price per Gallon', type: 'number', defaultValue: 3.85, min: 1, step: 0.05, unit: '$/gal' },
      { id: 'truckMpg', label: 'Commercial Truck MPG', type: 'number', defaultValue: 6.5, min: 2, max: 20, step: 0.1, unit: 'MPG' },
      { id: 'driverPayMile', label: 'Driver Pay Rate', type: 'number', defaultValue: 0.65, min: 0.1, max: 2.00, step: 0.01, unit: '$/mile' },
      { id: 'truckMaintenanceMile', label: 'Maintenance Reserve', type: 'number', defaultValue: 0.18, min: 0.01, step: 0.01, unit: '$/mile' }
    ],
    faq: [
      { question: 'What is MPG in logistics?', answer: 'Miles Per Gallon. Measures vehicle fuel efficiency. Lower MPG directly increases fleet fuel costs.' }
    ],
    relatedSlugs: ['vehicle-operating-cost', 'route-costing-logistics'],
    seoTitle: 'Logistics Fleet Semi-Truck cost Per Mile Calculator',
    seoDescription: 'Calculate vehicle operating costs per mile using regional fuel prices and driver wages.',
    calculate: (inputs) => {
      const fuelVal = Number(inputs.dieselPrice || 4);
      const mpg = Number(inputs.truckMpg || 6);
      const dPay = Number(inputs.driverPayMile || 0.6);
      const maint = Number(inputs.truckMaintenanceMile || 0.15);
      
      const fuelPerMileCostVal = fuelVal / mpg;
      const totalCostPerMile = fuelPerMileCostVal + dPay + maint;
      
      return {
        results: [
          { label: 'Fleet Operating Cost per Mile', value: Number(totalCostPerMile.toFixed(2)), unit: '$/mile', isPrimary: true },
          { label: 'Fuel cost share per Mile', value: Number(fuelPerMileCostVal.toFixed(2)), unit: '$/mile' }
        ]
      };
    }
  },
  {
    id: 'vehicle-operating-cost',
    name: 'Vehicle Operating Cost Calculator',
    slug: 'vehicle-operating-cost',
    category: 'transport-pro',
    description: 'Calculate vehicle operating costs per mile, incorporating lease rates and depreciation.',
    formula: 'Cost per Mile = (Fixed annual lease rates + variable miles cost) / annual miles',
    explanation: 'Combines fixed lease rates and variable operational costs to calculate total vehicle costs per mile.',
    example: 'Driving 15,000 miles annually under a $450/month lease costs approximately $0.51 per mile to operate.',
    inputs: [
      { id: 'annualMiles', label: 'Estimated Annual Travel', type: 'number', defaultValue: 15000, min: 100, unit: 'miles' },
      { id: 'monthlyLeaseTerm', label: 'Monthly Lease/Loan Payment', type: 'number', defaultValue: 450, min: 0, unit: '$' },
      { id: 'fuelCostMile', label: 'Average Fuel Cost per Mile', type: 'number', defaultValue: 0.15, min: 0.01, step: 0.01, unit: '$/mile' }
    ],
    faq: [
      { question: 'Why isolate lease rates in vehicle calculations?', answer: 'Lease payments are fixed monthly costs. Increasing annual travel miles spreads these fixed costs, lowering your overall cost per mile.' }
    ],
    relatedSlugs: ['fleet-operating-cost', 'route-costing-logistics'],
    seoTitle: 'Personal Auto & Cargo vehicle Operating cost per Mile Calculator',
    seoDescription: 'Calculate total vehicle operating costs per mile, incorporating leases and fuel costs.',
    calculate: (inputs) => {
      const miles = Number(inputs.annualMiles || 10000);
      const lease = Number(inputs.monthlyLeaseTerm || 300);
      const fuel = Number(inputs.fuelCostMile || 0.15);
      
      const fixedAnnualLeasesCostVal = lease * 12;
      const leaseCostPerMileVal = fixedAnnualLeasesCostVal / miles;
      const totalCostMileVal = leaseCostPerMileVal + fuel;
      
      return {
        results: [
          { label: 'Total Operating Cost per Mile', value: Number(totalCostMileVal.toFixed(2)), unit: '$/mile', isPrimary: true },
          { label: 'Amortized Lease Cost per Mile share', value: Number(leaseCostPerMileVal.toFixed(2)), unit: '$/mile' }
        ]
      };
    }
  },
  {
    id: 'route-costing-logistics',
    name: 'Route Cost Calculator',
    slug: 'route-costing-logistics',
    category: 'transport-pro',
    description: 'Calculate total trip fuel costs, highway tolls, and driver payroll wages for dispatch routes.',
    formula: 'Route Cost = (Route Distance / MPG) * Fuel Cost + Driver pay rate + Highway Tolls',
    explanation: 'Models specific route distances, calculating total fuel costs and toll fees to help size shipping rates.',
    example: 'A 450-mile dispatch route carrying $80 in toll fees with 6 MPG consumption costs $631.25 in fuel and tolls.',
    inputs: [
      { id: 'routeDistanceMiles', label: 'Route Distance', type: 'number', defaultValue: 450, min: 1, unit: 'miles' },
      { id: 'fuelRateGal', label: 'Fuel Price per Gallon', type: 'number', defaultValue: 3.75, min: 1, step: 0.05, unit: '$/gal' },
      { id: 'vehicleMpg', label: 'Vehicle Fuel Efficiency (MPG)', type: 'number', defaultValue: 6.0, min: 1, max: 50, step: 0.1, unit: 'MPG' },
      { id: 'highwayTollFees', label: 'Highway Toll Fees cost', type: 'number', defaultValue: 80, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'Why model highway tolls separately?', answer: 'Toll fees are fixed costs for specific routes and are not affected by vehicle fuel efficiency.' }
    ],
    relatedSlugs: ['fleet-operating-cost', 'vehicle-operating-cost'],
    seoTitle: 'Logistics freight Dispatch Route cost Calculator',
    seoDescription: 'Calculate food or logistics route dispatch costs, including fuel and tolls.',
    calculate: (inputs) => {
      const miles = Number(inputs.routeDistanceMiles || 100);
      const fuelP = Number(inputs.fuelRateGal || 3.5);
      const mpg = Number(inputs.vehicleMpg || 6);
      const tolls = Number(inputs.highwayTollFees || 0);
      
      const fuelUsed = miles / mpg;
      const fuelCost = fuelUsed * fuelP;
      const totalRouteCost = fuelCost + tolls;
      
      return {
        results: [
          { label: 'Total Dispatch Route Cost', value: Number(totalRouteCost.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Route Fuel cost share', value: Number(fuelCost.toFixed(2)), unit: '$' },
          { label: 'Gallons of Diesel Consumed', value: Number(fuelUsed.toFixed(1)), unit: 'gal' }
        ]
      };
    }
  },
  {
    id: 'transport-efficiency',
    name: 'Transport Efficiency Calculator',
    slug: 'transport-efficiency',
    category: 'transport-pro',
    description: 'Calculate payload weight densities and cargo space utilization percentages.',
    formula: 'Efficiency% = (Shipped Payload Weight / Truck capacity rating Limit) * 100',
    explanation: 'Models shipping payload weights relative to trailer capacities to optimize fleet logistics.',
    example: 'Loading 38,000 lbs of cargo in a standard semi-trailer rated for 45,000 lbs achieves an 84.4% weight utilization rate.',
    inputs: [
      { id: 'shippedWeightLbs', label: 'Shipped Payload Weight', type: 'number', defaultValue: 38000, min: 1, unit: 'lbs' },
      { id: 'truckCapLbs', label: 'Trailer Capacity Limit', type: 'number', defaultValue: 45000, min: 1000, unit: 'lbs' }
    ],
    faq: [
      { question: 'What is weigh-out in logistics?', answer: 'When a trailer hits its maximum legal highway weight limit before its physical volume is fully occupied.' }
    ],
    relatedSlugs: ['fleet-operating-cost', 'delivery-cost-calc'],
    seoTitle: 'Logistics cargo Trailer weight Sizing Efficiency Calculator',
    seoDescription: 'Optimize fleet operations by tracking trailer weight capacity loads.',
    calculate: (inputs) => {
      const weight = Number(inputs.shippedWeightLbs || 20000);
      const cap = Number(inputs.truckCapLbs || 40000);
      
      const eff = (weight / cap) * 100;
      
      return {
        results: [
          { label: 'Trailer weight Utilization', value: Number(eff.toFixed(1)), unit: '%', isPrimary: true },
          { label: 'Available Capacity Remaining', value: Math.max(0, cap - weight), unit: 'lbs' }
        ]
      };
    }
  },
  {
    id: 'delivery-cost-calc',
    name: 'Delivery Cost Calculator',
    slug: 'delivery-cost-calc',
    category: 'transport-pro',
    description: 'Calculate average delivery costs per package, combining driver payroll wages and fuel costs.',
    formula: 'Cost per Package = (Driver Shift pay + fuel) / package delivery count',
    explanation: 'Calculates the average delivery cost per package to evaluate shipping rate margins.',
    example: 'Completing 45 package deliveries on a $180 driver shift consuming $32 of fuel costs $4.71 per package.',
    inputs: [
      { id: 'driverShiftHours', label: 'Driver worked Shift Duration', type: 'number', defaultValue: 8, min: 1, unit: 'hours' },
      { id: 'driverHourlyWage', label: 'Driver Hourly Pay Rate', type: 'number', defaultValue: 22, min: 5, unit: '$/hr' },
      { id: 'dispatchRouteFuelCost', label: 'Dispatch Route Fuel cost', type: 'number', defaultValue: 32, min: 0, unit: '$' },
      { id: 'packagesDeliveredCount', label: 'Daily Packages Delivered', type: 'number', defaultValue: 45, min: 1, unit: 'parcels' }
    ],
    faq: [
      { question: 'How can delivery costs be managed effectively?', answer: 'Optimize last-mile routing to minimize route miles and increase daily package delivery counts.' }
    ],
    relatedSlugs: ['transport-efficiency', 'fleet-operating-cost'],
    seoTitle: 'SaaS courier route Delivery Cost per Package Calculator',
    seoDescription: 'Calculate average parcel shipping costs using route fuels and driver shift hours.',
    calculate: (inputs) => {
      const hrs = Number(inputs.driverShiftHours || 8);
      const wage = Number(inputs.driverHourlyWage || 20);
      const fuel = Number(inputs.dispatchRouteFuelCost || 25);
      const pkgs = Number(inputs.packagesDeliveredCount || 30);
      
      const laborCost = hrs * wage;
      const totalDeliveryCost = laborCost + fuel;
      const costPerPackage = totalDeliveryCost / pkgs;
      
      return {
        results: [
          { label: 'Average Cost per Package', value: Number(costPerPackage.toFixed(2)), unit: '$/parcel', isPrimary: true },
          { label: 'Total Route dispatch delivery cost', value: totalDeliveryCost, unit: '$' }
        ]
      };
    }
  },

  // AGRICULTURE PROFESSIONAL (107-111)
  {
    id: 'farm-operating-cost',
    name: 'Farm Operating Cost Calculator',
    slug: 'farm-operating-cost',
    category: 'agriculture',
    description: 'Calculate seasonal farming costs, combining seed bulk purchases, land leases, and crop insurance.',
    formula: 'Cost = Seeds + fertilizer soil cost + Machine leases + crop insurance',
    explanation: 'Aggregates seed, fertilizer, machinery leases, and crop insurance costs to help plan seasonal budgets.',
    example: 'A farmer spending $15,000 on seeds, $22,000 on fertilizer, and $12,000 on land leases faces $49,000 in seasonal operating costs.',
    inputs: [
      { id: 'seedsPrePrice', label: 'Seed Bulk Purchases Cost', type: 'number', defaultValue: 15000, min: 0, unit: '$' },
      { id: 'fertilizerSoilCost', label: 'Fertilizer & Soil Amendments', type: 'number', defaultValue: 22000, min: 0, unit: '$' },
      { id: 'landMachineRent', label: 'Machinery leases & Land rent', type: 'number', defaultValue: 12000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'Why does crop insurance matter?', answer: 'Crop insurance protects farmers against catastrophic yield losses caused by severe drought, hail, or pest infestations.' }
    ],
    relatedSlugs: ['crop-yield-profit', 'farming-roi'],
    seoTitle: 'Seasonal Farm Field Operating cost Calculator',
    seoDescription: 'Plan your agricultural budget by combining land leases, seeds, and fertilizer costs.',
    calculate: (inputs) => {
      const seeds = Number(inputs.seedsPrePrice || 5000);
      const fertil = Number(inputs.fertilizerSoilCost || 8000);
      const leases = Number(inputs.landMachineRent || 4000);
      
      const totalCost = seeds + fertil + leases;
      
      return {
        results: [
          { label: 'Seasonal Farm Operating Cost', value: totalCost, unit: '$', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'crop-yield-profit',
    name: 'Crop Yield and Profit Calculator',
    slug: 'crop-yield-profit',
    category: 'agriculture',
    description: 'Calculate crop yields and gross profits using crop margins, acre counts, and market prices.',
    formula: 'Profit = Acre count * yield bushel per acre * market price - Farm operating cost',
    explanation: 'Calculates seasonal crop yields and gross profits based on crop margins and acre counts.',
    example: 'Growing 100 acres of wheat yielding 55 bushels/acre sold at $7.50/bushel generates $41,250 in revenue.',
    inputs: [
      { id: 'acresActive', label: 'Total Farm Field Acres', type: 'number', defaultValue: 100, min: 1, unit: 'acres' },
      { id: 'bushelsPerAcre', label: 'Yield Bushels per Acre', type: 'number', defaultValue: 55, min: 1, unit: 'bushels' },
      { id: 'marketPriceBushel', label: 'Current Bushel spot price', type: 'number', defaultValue: 7.50, min: 0.10, step: 0.05, unit: '$/bushel' },
      { id: 'operatingCostTotal', label: 'Target Field Operating Cost', type: 'number', defaultValue: 20000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is a bushel in agriculture?', answer: 'A traditional unit of volume equivalent to 8 dry gallons of grains, standardly used to measure crop yields.' }
    ],
    relatedSlugs: ['farm-operating-cost', 'farming-roi'],
    seoTitle: 'Crop bushel Yield and Revenue profit Calculator',
    seoDescription: 'Obtain seasonal crop revenue and grain profit projections based on field acreage limits.',
    calculate: (inputs) => {
      const acres = Number(inputs.acresActive || 50);
      const yieldAmt = Number(inputs.bushelsPerAcre || 60);
      const price = Number(inputs.marketPriceBushel || 6);
      const opex = Number(inputs.operatingCostTotal || 10000);
      
      const bushelsProduced = acres * yieldAmt;
      const totalRevenue = bushelsProduced * price;
      const netProfit = totalRevenue - opex;
      
      return {
        results: [
          { label: 'Estimated net Crop profit', value: Math.round(netProfit), unit: '$', isPrimary: true },
          { label: 'Total Grain production yield', value: bushelsProduced, unit: 'bushels' },
          { label: 'Gross Farm field revenue', value: totalRevenue, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'farming-roi',
    name: 'Farming ROI Calculator',
    slug: 'farming-roi',
    category: 'agriculture',
    description: 'Calculate farming project return on investment (ROI) using crop revenues and seasonal costs.',
    formula: 'ROI% = (Net farm profit / total seasonal cost) * 100',
    explanation: 'Calculates the real return on investment (ROI) for crops or machinery upgrades based on seasonal yields.',
    example: 'Generating $60,000 in crop revenue on a $45,000 seasonal cost yields a 33.3% return on investment.',
    inputs: [
      { id: 'seasonalRevenue', label: 'Completed Seasonal Crop Revenue', type: 'number', defaultValue: 60000, min: 1, unit: '$' },
      { id: 'totalSeasonalCost', label: 'Total seasonal Farm Cost', type: 'number', defaultValue: 45000, min: 1, unit: '$' }
    ],
    faq: [
      { question: 'What is the average ROI of family farms?', answer: 'Sustained returns on investment typically average 4% to 12%, though they are highly affected by seasonal weather events and market price swings.' }
    ],
    relatedSlugs: ['farm-operating-cost', 'crop-yield-profit'],
    seoTitle: 'Farming Season ROI & Capital Return Calculator',
    seoDescription: 'Track farming project returns on investment using crop revenues and seasonal budgets.',
    calculate: (inputs) => {
      const rev = Number(inputs.seasonalRevenue || 20000);
      const cost = Number(inputs.totalSeasonalCost || 15000);
      
      const profit = rev - cost;
      const roi = cost > 0 ? (profit / cost) * 100 : 0;
      
      return {
        results: [
          { label: 'Farm return on Investment (ROI)', value: Number(roi.toFixed(1)), unit: '%', isPrimary: true },
          { label: 'Net Crop revenue profit', value: profit, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'water-requirement-irrigation',
    name: 'Water Requirement & Irrigation Calculator',
    slug: 'water-requirement-irrigation',
    category: 'agriculture',
    description: 'Calculate daily crop irrigation requirements based on field size and evapotranspiration rates.',
    formula: 'Daily Water (Gallons) = Field Area (sq ft) * Evapotranspiration (inches) * 0.623',
    explanation: 'Models plant evapotranspiration rates to calculate precise daily irrigation requirements in gallons.',
    example: 'A 50,000 sq ft orchard with a 0.20" daily transpirational loss requires 6,233 gallons of water daily.',
    inputs: [
      { id: 'fieldAreaSqFt', label: 'Field Surface Area Size', type: 'number', defaultValue: 50000, min: 100, unit: 'sq ft' },
      { id: 'evapotranspirationInches', label: 'Daily Crop Evapotranspiration (ET)', type: 'number', defaultValue: 0.20, min: 0.01, max: 2.00, step: 0.01, unit: 'inches/day' }
    ],
    faq: [
      { question: 'What is Evapotranspiration (ET)?', answer: 'The combined moisture loss from soil evaporation and plant transpiration, which represents water used by the crop.' }
    ],
    relatedSlugs: ['agricultural-planning-grid', 'farm-operating-cost'],
    seoTitle: 'Crop Irrigation Water Sizing Calculator',
    seoDescription: 'Calculate required daily field irrigation volumes in gallons using soil transpiration rates.',
    calculate: (inputs) => {
      const area = Number(inputs.fieldAreaSqFt || 10000);
      const et = Number(inputs.evapotranspirationInches || 0.15);
      
      // 1 inch of water on 1 sq ft = 0.6233 gallons
      const dailyGallons = area * et * 0.6233;
      
      return {
        results: [
          { label: 'Required Daily Irrigation Volume', value: Math.round(dailyGallons), unit: 'Gallons/day', isPrimary: true },
          { label: 'Weekly Field Irrigation requirement', value: Math.round(dailyGallons * 7), unit: 'gal' }
        ]
      };
    }
  },
  {
    id: 'agricultural-planning-grid',
    name: 'Agricultural Planning & Plant Spacing Calculator',
    slug: 'agricultural-planning-grid',
    category: 'agriculture',
    description: 'Calculate plant spacing grids, linear rows, and crop density counts per acre.',
    formula: 'Plants Count = Area size sq ft / (Row Spacing ft * Plant Spacing ft)',
    explanation: 'Uses row and plant spacing measurements to calculate required seeds and final crop density counts per acre.',
    example: 'Framing 1 acre (43,560 sq ft) with rows 3 feet apart and plants spaced 1 foot apart requires exactly 14,520 wood seeds.',
    inputs: [
      { id: 'acreAreaCoverage', label: 'Overall Acre Coverage', type: 'number', defaultValue: 1.0, min: 0.1, step: 0.1, unit: 'acres' },
      { id: 'rowSpacingFt', label: 'Row-to-Row Spacing', type: 'number', defaultValue: 3.0, min: 0.5, step: 0.1, unit: 'feet' },
      { id: 'plantSpacingIn', label: 'Plant-to-Plant spacing', type: 'number', defaultValue: 12, min: 1, unit: 'inches' }
    ],
    faq: [
      { question: 'What is the surface area of exactly 1 acre?', answer: '1 standard international acre spans exactly 43,560 square feet of land surface area.' }
    ],
    relatedSlugs: ['water-requirement-irrigation', 'crop-yield-profit'],
    seoTitle: 'Plant Spacing Grid & Row density Calculator',
    seoDescription: 'Calculate required crop seed counts and plan vegetable planting rows.',
    calculate: (inputs) => {
      const acres = Number(inputs.acreAreaCoverage || 1);
      const rowSpacing = Number(inputs.rowSpacingFt || 3);
      const plantSpacingInches = Number(inputs.plantSpacingIn || 12);
      
      const totalAreaSqFt = acres * 43560;
      const plantSpacingFt = plantSpacingInches / 12;
      
      const divisor = rowSpacing * plantSpacingFt;
      const totalPlants = divisor > 0 ? totalAreaSqFt / divisor : 0;
      
      return {
        results: [
          { label: 'Required Crop Seedlings count', value: Math.round(totalPlants), unit: 'plants', isPrimary: true },
          { label: 'Surface Field Area Size', value: Math.round(totalAreaSqFt), unit: 'sq ft' }
        ]
      };
    }
  }
];
