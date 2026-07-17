import { Calculator } from '../types';

export const V22_PART1_CALCULATORS: Calculator[] = [
  // ====================================== CYBERSECURITY ======================================
  {
    id: 'security-budget',
    name: 'Security Budget Calculator',
    slug: 'security-budget',
    category: 'cybersecurity',
    description: 'Calculate enterprise cybersecurity allocation based on asset values, exposure factor, and risk target.',
    formula: 'Target Security Budget = Asset Value * Exposure Factor * Target Security Increase (Multiplier)',
    explanation: 'Estimates appropriate cyber protection expenditure by aligning organizational structural valuations with exposure risks and defense objectives.',
    example: 'For a $5,000,000 asset infrastructure with 10% exposure factor and 2x target security increase, the budget allocation is $100,000.',
    inputs: [
      { id: 'assetValue', label: 'Total Digital Asset Value ($)', type: 'number', defaultValue: 1000000, min: 10000, step: 5000 },
      { id: 'exposure', label: 'Current Exposure Factor (%)', type: 'number', defaultValue: 15, min: 1, max: 100, step: 1 },
      { id: 'targetStrength', label: 'Target Defense Upgrade', type: 'select', defaultValue: 1.5, options: [
        { label: 'Basic Coverage (1.0x)', value: 1.0 },
        { label: 'Standard Upgrade (1.5x)', value: 1.5 },
        { label: 'Advanced Fortification (2.0x)', value: 2.0 },
        { label: 'Military-Grade Compliance (3.0x)', value: 3.0 }
      ]}
    ],
    faq: [
      { question: 'What is cybersecurity exposure factor?', answer: 'The exposure factor is the physical or logical percentage of vulnerability an asset faces before protection controls are introduced.' },
      { question: 'Should compliance drive the budget?', answer: 'While compliance is crucial, budgeting should focus on actual threat vectors and risk mitigation values.' }
    ],
    relatedSlugs: ['security-risk', 'cyber-protection'],
    seoTitle: 'Enterprise Cybersecurity Protection Budget Calculator',
    seoDescription: 'Accurately determine the optimal cybersecurity budget based on digital asset valuations and cyber exposure threats.',
    calculate: (inputs) => {
      const asset = Number(inputs.assetValue || 1000000);
      const exposure = Number(inputs.exposure || 15) / 100;
      const mult = Number(inputs.targetStrength || 1.5);
      const budget = asset * exposure * (mult / 20); // Scale down to reasonable security budget rates (approx 5-15% of ALE)
      const ale = asset * exposure; // Annualized Loss Expectancy
      return {
        results: [
          { label: 'Recommended Security Budget', value: '$' + budget.toLocaleString(undefined, { maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annualized Loss Expectancy (Unprotected)', value: '$' + ale.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
          { label: 'Percentage of Asset Value', value: ((budget / asset) * 100).toFixed(2) + '%', unit: 'ratio' }
        ],
        chartData: [
          { name: 'Asset Value', value: asset },
          { name: 'Loss Risk', value: ale },
          { name: 'Cyber Budget', value: budget }
        ]
      };
    }
  },
  {
    id: 'security-risk',
    name: 'Security Risk Calculator',
    slug: 'security-risk',
    category: 'cybersecurity',
    description: 'Calculate risk scores and critical threat weight based on threat likelihood, severity, and current controls.',
    formula: 'Risk Level = Threat Likelihood * Threat Severity * (1 - Control Effectiveness)',
    explanation: 'Evaluates corporate threat risks. Provides an overall security rating by matching active exploit likelihood against business impacts and active defenses.',
    example: 'A ransomware threat with likelihood 4, severity 5, and 60% control effectiveness yields a risk score of 8 out of 25 (Medium Risk).',
    inputs: [
      { id: 'likelihood', label: 'Threat Likelihood (1 to 5)', type: 'range', defaultValue: 3, min: 1, max: 5, step: 1 },
      { id: 'severity', label: 'Physical Impact/Severity (1 to 5)', type: 'range', defaultValue: 4, min: 1, max: 5, step: 1 },
      { id: 'effectiveness', label: 'Current Control Effectiveness (%)', type: 'number', defaultValue: 50, min: 0, max: 100, step: 5 }
    ],
    faq: [
      { question: 'What does the Risk Score mean?', answer: 'A score under 5 is Low Risk, 5-12 is Medium Risk, and above 12 is High / Critical Risk requiring active remediation.' },
      { question: 'How can we increase control effectiveness?', answer: 'Introduce automated policy compliance checks, employee awareness trainings, and multi-factor authentication systems.' }
    ],
    relatedSlugs: ['security-budget', 'cyber-protection'],
    seoTitle: 'Threat Risk Assessment & Mitigation Score Calculator',
    seoDescription: 'Assess company threat quotients using likelihood, severity indices, and control metrics.',
    calculate: (inputs) => {
      const likely = Number(inputs.likelihood || 3);
      const severe = Number(inputs.severity || 4);
      const effect = Number(inputs.effectiveness || 50) / 100;
      const rawScore = likely * severe;
      const mitigatedScore = rawScore * (1 - effect);
      let level = 'Low';
      if (mitigatedScore > 12) level = 'Critical High';
      else if (mitigatedScore > 6) level = 'Medium';
      return {
        results: [
          { label: 'Mitigated Risk Score', value: mitigatedScore.toFixed(1) + ' / 25', isPrimary: true },
          { label: 'Risk Severity Category', value: level },
          { label: 'Unmitigated Threat Level', value: rawScore + ' / 25' }
        ],
        chartData: [
          { name: 'Total Risk Possible', value: 25 },
          { name: 'Unmitigated Risk', value: rawScore },
          { name: 'Mitigated Risk', value: mitigatedScore }
        ]
      };
    }
  },
  {
    id: 'cyber-protection',
    name: 'Cyber Protection Calculator',
    slug: 'cyber-protection',
    category: 'cybersecurity',
    description: 'Assess cyber protection score based on fundamental firewall, endpoint, identity, and monitoring defense layers.',
    formula: 'Protection Score = (Firewall + Endpoint + Identity + Monitoring + Training) / 5',
    explanation: 'Verifies global defense architecture maturity by taking weighted inputs from key infrastructure security layers.',
    example: 'Layer scores of 80, 70, 90, 60, and 50% result in a holistic Cyber Protection Index of 70%.',
    inputs: [
      { id: 'firewall', label: 'Firewall & Network Security (%)', type: 'number', defaultValue: 80, min: 0, max: 100 },
      { id: 'endpoint', label: 'Endpoint Detection & Response (%)', type: 'number', defaultValue: 70, min: 0, max: 100 },
      { id: 'identity', label: 'IAM / MFA Controls (%)', type: 'number', defaultValue: 90, min: 0, max: 100 },
      { id: 'monitoring', label: 'SOC Reporting & Monitoring (%)', type: 'number', defaultValue: 60, min: 0, max: 100 },
      { id: 'training', label: 'Employee Phishing Training (%)', type: 'number', defaultValue: 50, min: 0, max: 100 }
    ],
    faq: [
      { question: 'Why is user training included?', answer: 'The human element remains the single largest vector for security intrusion, making continuous education just as vital as software firewalls.' }
    ],
    relatedSlugs: ['security-budget', 'security-risk'],
    seoTitle: 'Holistic Cyber Protection Defense Layer Calculator',
    seoDescription: 'Verify organizational infrastructure security strength indices across firewall, endpoint, and IAM networks.',
    calculate: (inputs) => {
      const fw = Number(inputs.firewall || 80);
      const ep = Number(inputs.endpoint || 70);
      const id = Number(inputs.identity || 90);
      const mon = Number(inputs.monitoring || 60);
      const train = Number(inputs.training || 50);
      const score = (fw + ep + id + mon + train) / 5;
      let resilience = 'Vulnerable';
      if (score >= 85) resilience = 'Robust Fortress';
      else if (score >= 65) resilience = 'Vigilant / Standard';
      return {
        results: [
          { label: 'Cyber Protection Rating', value: score.toFixed(1) + '%', isPrimary: true },
          { label: 'Infrastructure Status', value: resilience },
          { label: 'Vulnerability Gap', value: (100 - score).toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Firewall', value: fw },
          { name: 'Endpoint', value: ep },
          { name: 'IAM', value: id },
          { name: 'Log Monitoring', value: mon },
          { name: 'User Training', value: train }
        ]
      };
    }
  },
  {
    id: 'backup-planning',
    name: 'Backup Planning Calculator',
    slug: 'backup-planning',
    category: 'cybersecurity',
    description: 'Calculate storage needs and schedules for modern data backups including incremental footprints.',
    formula: 'Total Backup Capacity = Initial Size + (Daily Delta * Retention Days)',
    explanation: 'Models backup expansion speeds to determine local hardware or cloud storage scales needed for keeping historical recovery records.',
    example: 'Starting with a 500 GB system that updates 5% (25 GB) daily, retaining backups for 30 days requires 1,250 GB.',
    inputs: [
      { id: 'initialSize', label: 'Starting Live System Size (GB)', type: 'number', defaultValue: 500, min: 10 },
      { id: 'dailyDelta', label: 'Daily Data Alteration Rate (%)', type: 'number', defaultValue: 5, min: 1, max: 50 },
      { id: 'retentionDays', label: 'Desired Retention Term (Days)', type: 'number', defaultValue: 30, min: 1, max: 365 }
    ],
    faq: [
      { question: 'What is incremental vs full backups?', answer: 'Full backups copy the entire system, while incremental backups only capture changes since the last backup, saving considerable storage.' }
    ],
    relatedSlugs: ['disaster-recovery', 'recovery-cost'],
    seoTitle: 'Data Backup Capacity & Delta Retention Storage Calculator',
    seoDescription: 'Calculate expected data storage capacity requirements to safely hold scheduled incremental and full system backups.',
    calculate: (inputs) => {
      const initial = Number(inputs.initialSize || 500);
      const deltaPercent = Number(inputs.dailyDelta || 5) / 100;
      const days = Number(inputs.retentionDays || 30);
      const dailyBytes = initial * deltaPercent;
      const deltaTotal = dailyBytes * days;
      const total = initial + deltaTotal;
      return {
        results: [
          { label: 'Total Retained Storage', value: total.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' GB', isPrimary: true },
          { label: 'Daily Modification Size', value: dailyBytes.toFixed(1) + ' GB' },
          { label: 'Total Historical Accumulation', value: deltaTotal.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' GB' }
        ],
        chartData: [
          { name: 'Original State', value: initial },
          { name: 'Accumulation Delta', value: deltaTotal }
        ]
      };
    }
  },
  {
    id: 'disaster-recovery',
    name: 'Disaster Recovery Calculator',
    slug: 'disaster-recovery',
    category: 'cybersecurity',
    description: 'Determine disaster recovery (DR) cost thresholds based on corporate RPO and RTO goals.',
    formula: 'DR Downtime Cost = (Allowed RTO * Hourly Loss) + (Allowed RPO * Re-entry Data Cost per Hour)',
    explanation: 'Maps recovery point objectives (RPO) and recovery time objectives (RTO) against operational expenses to optimize emergency server clusters.',
    example: 'Targeting a 4-hour RTO and 2-hour RPO at an hourly operating loss of $1,200 leads to a potential $5,600 exposure per disruption incident.',
    inputs: [
      { id: 'rto', label: 'Target Recovery Time Objective (RTO - Hours)', type: 'number', defaultValue: 4, min: 0.5, step: 0.5 },
      { id: 'rpo', label: 'Target Recovery Point Objective (RPO - Hours)', type: 'number', defaultValue: 2, min: 0.5, step: 0.5 },
      { id: 'hourlyLoss', label: 'Average Corporate Hourly Loss ($)', type: 'number', defaultValue: 1500, min: 100, step: 100 },
      { id: 'reentryCost', label: 'Data Re-Creation Hour Cost ($)', type: 'number', defaultValue: 400, min: 50, step: 50 }
    ],
    faq: [
      { question: 'What are RTO and RPO?', answer: 'RTO (Recovery Time Objective) is the maximum acceptable duration of downtime. RPO (Recovery Point Objective) is the maximum acceptable period of data loss.' }
    ],
    relatedSlugs: ['backup-planning', 'recovery-cost'],
    seoTitle: 'Disaster Recovery RTO & RPO Financial Exposure Calculator',
    seoDescription: 'Calculate the total cost impact of system downtime and data loss to justify corporate disaster recovery strategies.',
    calculate: (inputs) => {
      const rto = Number(inputs.rto || 4);
      const rpo = Number(inputs.rpo || 2);
      const loss = Number(inputs.hourlyLoss || 1500);
      const re = Number(inputs.reentryCost || 400);
      const rtoCost = rto * loss;
      const rpoCost = rpo * re;
      const total = rtoCost + rpoCost;
      return {
        results: [
          { label: 'Incident Loss Exposure', value: '$' + total.toLocaleString(), isPrimary: true },
          { label: 'Downtime Loss (RTO)', value: '$' + rtoCost.toLocaleString() },
          { label: 'Data Destruction Cost (RPO)', value: '$' + rpoCost.toLocaleString() }
        ],
        chartData: [
          { name: 'RTO Cost (Downtime)', value: rtoCost },
          { name: 'RPO Cost (Loss)', value: rpoCost }
        ]
      };
    }
  },
  {
    id: 'recovery-cost',
    name: 'Recovery Cost Calculator',
    slug: 'recovery-cost',
    category: 'cybersecurity',
    description: 'Calculate the comprehensive financial cost of cybersecurity incidents, records exposure, and cleanups.',
    formula: 'Total Incident Cost = (Compromised Records * Cost Per Record) + Forensic Cleanups + Legal Regulatory Fines',
    explanation: 'Collates compliance, administrative, operations, and PR costs to estimate the full real damages of a cybersecurity breach.',
    example: 'A breach exposure of 5,000 sensitive records at $150 per record with $20,000 regulatory penalties totals $770,000.',
    inputs: [
      { id: 'records', label: 'Compromised Records Count', type: 'number', defaultValue: 2500, min: 0, step: 100 },
      { id: 'costPerRecord', label: 'Direct Damage Cost Per Record ($)', type: 'number', defaultValue: 164, min: 10, step: 5 },
      { id: 'forensics', label: 'Incident Response & IR Forensics ($)', type: 'number', defaultValue: 25000, min: 0, step: 1000 },
      { id: 'fines', label: 'Regulatory Penalties & GDPR Fines ($)', type: 'number', defaultValue: 15000, min: 0, step: 1000 }
    ],
    faq: [
      { question: 'What is the average global cost per lost record?', answer: 'According to IBM Security reports, the average cost per leaked sensitive record hovers around $150 to $180, factoring notifications and credit audits.' }
    ],
    relatedSlugs: ['security-risk', 'disaster-recovery'],
    seoTitle: 'Cyber Security Breach Incident Recovery Cost Calculator',
    seoDescription: 'Estimate the financial impact of database exposure, regulatory fines, and forensics response cleanups.',
    calculate: (inputs) => {
      const rec = Number(inputs.records || 2500);
      const rate = Number(inputs.costPerRecord || 164);
      const forex = Number(inputs.forensics || 25000);
      const fine = Number(inputs.fines || 15000);
      const recordDamage = rec * rate;
      const grandTotal = recordDamage + forex + fine;
      return {
        results: [
          { label: 'Estimated Total Incident Cost', value: '$' + grandTotal.toLocaleString(), isPrimary: true },
          { label: 'Direct Record Exposure Loss', value: '$' + recordDamage.toLocaleString() },
          { label: 'Overhead Operational Cleanups', value: '$' + (forex + fine).toLocaleString() }
        ],
        chartData: [
          { name: 'Record Leak Loss', value: recordDamage },
          { name: 'Cleanup Operations', value: forex },
          { name: 'Compliance Fines', value: fine }
        ]
      };
    }
  },

  // ====================================== PRODUCTIVITY ======================================
  {
    id: 'productivity-planner',
    name: 'Productivity Planner Calculator',
    slug: 'productivity-planner',
    category: 'productivity',
    description: 'Calculate daily execution efficiency indexes based on deep work hours, planning efforts, and breaks.',
    formula: 'Productivity score = (Deep Work hours * 2 + Planning factor * 10 - Interruption Count * 5) styled as percentage',
    explanation: 'Models optimal cognitive flow by rating continuous flow-state periods against chaotic meeting blocks and physical fatigue.',
    example: 'Given 5 hours of deep work, 1 planning routine, and 4 unexpected interruptions, the daily score reaches 80/100.',
    inputs: [
      { id: 'deepWork', label: 'Intense Deep Work Hours', type: 'number', defaultValue: 4, min: 0, max: 12, step: 0.5 },
      { id: 'planning', label: 'Daily Planning Effort (Mins)', type: 'number', defaultValue: 15, min: 0, max: 120, step: 5 },
      { id: 'interruptions', label: 'Context Switching Interruption Count', type: 'number', defaultValue: 3, min: 0, max: 30 }
    ],
    faq: [
      { question: 'Can deep work replace long hours?', answer: 'Absolutely. Research shows 4 focused hours of uninterrupted work output matches 8 hours of distracted, meeting-heavy blocks.' }
    ],
    relatedSlugs: ['weekly-time', 'workload-balance'],
    seoTitle: 'Daily Cognitive Focus & Productivity Planner Calculator',
    seoDescription: 'Log deep work hours, planning efforts, and interruption factors to evaluate your daily efficiency metric.',
    calculate: (inputs) => {
      const dw = Number(inputs.deepWork || 4);
      const plan = Number(inputs.planning || 15);
      const inter = Number(inputs.interruptions || 3);
      const flowCredits = dw * 15;
      const planCredits = plan * 0.5;
      const penalty = inter * 8;
      let raw = flowCredits + planCredits - penalty;
      const score = Math.max(10, Math.min(100, raw));
      return {
        results: [
          { label: 'Daily Focus Index Score', value: score.toFixed(0) + ' / 100', isPrimary: true },
          { label: 'Context Switching Penalty', value: penalty + ' pts reduction', unit: 'points' },
          { label: 'Estimated Output Index', value: (dw * 1.5).toFixed(1) + 'x speed', unit: 'multiplier' }
        ],
        chartData: [
          { name: 'Flow Credits', value: flowCredits },
          { name: 'Planning Credits', value: planCredits },
          { name: 'Interrupt Penalty', value: penalty }
        ]
      };
    }
  },
  {
    id: 'weekly-time',
    name: 'Weekly Time Calculator',
    slug: 'weekly-time',
    category: 'productivity',
    description: 'Balance and allocate the 168 hours of the week across sleep, career, obligations, and lifestyle.',
    formula: 'Remaining Discretionary Hours = 168 - (Sleep + Core Career + Errands + Commutes)',
    explanation: 'A visual audit detailing exactly how temporal resource allocation translates into work-life ratios, catching stress bottlenecks before they cause burnout.',
    example: 'Working 50 hours, sleeping 8 hours daily (56 total), and spending 25 hours on travel and utilities leaves 37 discretionary hours.',
    inputs: [
      { id: 'sleep', label: 'Weekly Sleep Hours (Daily avg * 7)', type: 'number', defaultValue: 54, min: 10, max: 112 },
      { id: 'career', label: 'Professional Career & Work Hours', type: 'number', defaultValue: 40, min: 0, max: 100 },
      { id: 'chores', label: 'Errands, Errands & Commutes', type: 'number', defaultValue: 20, min: 0, max: 80 },
      { id: 'exercise', label: 'Active Gym, Sports & Exercise', type: 'number', defaultValue: 5, min: 0, max: 30 }
    ],
    faq: [
      { question: 'What is a healthy discretionary threshold?', answer: 'Maintaining at least 20 to 30 discretionary free hours per week avoids burnout, keeping mental stability and energy high.' }
    ],
    relatedSlugs: ['productivity-planner', 'workload-balance'],
    seoTitle: 'Weekly 168-Hour Balance & Work-Life Planner Calculator',
    seoDescription: 'Input weekly hours spent sleeping, working, traveling, and resting to discover your true discretionary hours.',
    calculate: (inputs) => {
      const s = Number(inputs.sleep || 54);
      const c = Number(inputs.career || 40);
      const ch = Number(inputs.chores || 20);
      const ex = Number(inputs.exercise || 5);
      const totalAllocated = s + c + ch + ex;
      const free = Math.max(0, 168 - totalAllocated);
      return {
        results: [
          { label: 'Discretionary Free Hours Left', value: free + ' hrs / week', isPrimary: true },
          { label: 'Total Planned Allocation', value: totalAllocated + ' hrs / week' },
          { label: 'Free Time percentage', value: ((free / 168) * 100).toFixed(1) + '%', unit: 'ratio' }
        ],
        chartData: [
          { name: 'Sleep Time', value: s },
          { name: 'Working', value: c },
          { name: 'Chores & Travel', value: ch },
          { name: 'Exercise', value: ex },
          { name: 'Unallocated Free', value: free }
        ]
      };
    }
  },
  {
    id: 'workload-balance',
    name: 'Workload Balance Calculator',
    slug: 'workload-balance',
    category: 'productivity',
    description: 'Track and score employee burnout and task saturation quotients using active deadlines and complexities.',
    formula: 'Cognitive Stress Score = (Task Count * Average Complexity) + (Active Deadlines * 1.5) minus delegation',
    explanation: 'Mathematically benchmarks task loads against human stress thresholds to highlight risks of acute work exhaustion.',
    example: 'Managing 8 concurrent tasks carrying average complexity 4 alongside 5 hard deadlines creates a workload score of 39.5 (Overloaded).',
    inputs: [
      { id: 'tasks', label: 'Total Active Tasks On Plate', type: 'number', defaultValue: 6, min: 1, max: 30 },
      { id: 'complexity', label: 'Average Task Complexity (1 to 5 scale)', type: 'select', defaultValue: 3, options: [
        { label: '1 - Trivial Administrative Tasks', value: 1 },
        { label: '2 - Straightforward Outlines', value: 2 },
        { label: '3 - Deep Multi-step Problem Solving', value: 3 },
        { label: '4 - Extremely Creative / Demanding', value: 4 },
        { label: '5 - Mega Enterprise Execution Block', value: 5 }
      ]},
      { id: 'deadlines', label: 'Hard Deadlines This Week', type: 'number', defaultValue: 4, min: 0, max: 15 }
    ],
    faq: [
      { question: 'What score signals imminent burnout?', answer: 'A score of 30 or above indicates highly elevated stress levels, where accuracy drops and neural fatigue rapidly compounds.' }
    ],
    relatedSlugs: ['productivity-planner', 'task-efficiency'],
    seoTitle: 'Workload Stress & Brain Burnout Saturation Calculator',
    seoDescription: 'Measure mental overload scores based on task complications, active commitments, and schedule deadlines.',
    calculate: (inputs) => {
      const tasks = Number(inputs.tasks || 6);
      const comp = Number(inputs.complexity || 3);
      const dead = Number(inputs.deadlines || 4);
      const load = (tasks * comp) + (dead * 2.5);
      let stressStatus = 'Healthy / Controlled';
      if (load > 35) stressStatus = 'Extreme Burnout Warning';
      else if (load >= 20) stressStatus = 'Active Saturation';
      return {
        results: [
          { label: 'Workload Sensation Score', value: load.toFixed(1) + ' pts', isPrimary: true },
          { label: 'Neurovascular Condition', value: stressStatus },
          { label: 'Recommended Delegations', value: load > 25 ? Math.ceil((load - 20) / 4) + ' tasks' : '0 tasks' }
        ],
        chartData: [
          { name: 'Base Tasks Load', value: tasks * comp },
          { name: 'Deadlines Pressure', value: dead * 2.5 }
        ]
      };
    }
  },
  {
    id: 'task-efficiency',
    name: 'Task Efficiency Calculator',
    slug: 'task-efficiency',
    category: 'productivity',
    description: 'Calculate yield of automating or outsourcing repetitive tasks vs manual work times.',
    formula: 'Efficiency Return = (Manual Hours - Delegated Cost Hours) / Manual Hours',
    explanation: 'Sizers financial payback rates of building macros, installing integrations, or hiring administrative helpers to bypass standard recurring workflows.',
    example: 'Slicing manual weekly processes from 10 hours down to 1 hour (costing 0.5 equivalent hours) yields an 85% task efficiency return.',
    inputs: [
      { id: 'manualHours', label: 'Manual Time Currently Required (Hrs/Week)', type: 'number', defaultValue: 8, min: 1 },
      { id: 'outsourcedHours', label: 'Time Required Post-Automation (Hrs/Week)', type: 'number', defaultValue: 1.5, min: 0 },
      { id: 'maintenanceHours', label: 'Weekly Maintenance/Cost Hour Equivalence', type: 'number', defaultValue: 0.5, min: 0 }
    ],
    faq: [
      { question: 'When is automation worth the upfront build cost?', answer: 'As a rule, if you perform the task more than 5 times a week and it takes longer than 15 minutes each iteration, automating is highly profitable.' }
    ],
    relatedSlugs: ['time-saving', 'goal-achievement'],
    seoTitle: 'Task Outsourcing & Automation Efficiency ROI Calculator',
    seoDescription: 'Compare your hourly manual production rates with automation parameters to discover efficiency index percentages.',
    calculate: (inputs) => {
      const man = Number(inputs.manualHours || 8);
      const out = Number(inputs.outsourcedHours || 1.5);
      const maint = Number(inputs.maintenanceHours || 0.5);
      const totalPost = out + maint;
      const netSaved = Math.max(0, man - totalPost);
      const efficientReturn = (netSaved / man) * 100;
      return {
        results: [
          { label: 'Time Reclaim Return Rate', value: efficientReturn.toFixed(1) + '%', isPrimary: true },
          { label: 'Hours Reclaimed Weekly', value: netSaved.toFixed(1) + ' hours', unit: 'hrs/wk' },
          { label: 'Annual Total Reclaimed Time', value: (netSaved * 52).toFixed(0) + ' hours', unit: 'hrs/yr' }
        ],
        chartData: [
          { name: 'Active Automation post-time', value: totalPost },
          { name: 'Weekly Reclaimed Core', value: netSaved }
        ]
      };
    }
  },
  {
    id: 'time-saving',
    name: 'Time Saving Calculator',
    slug: 'time-saving',
    category: 'productivity',
    description: 'Determine the amortization and payback point of writing automation scripts or building workflows.',
    formula: 'Payback Days = Upfront Build Duration Hours / Daily Saved Time Hours',
    explanation: 'Tells you if creating an automation algorithm actually saves time in the long run. Validates the famous XKCD automation time spectrum model.',
    example: 'Spending 10 hours of upfront design to shave 10 minutes off a daily task pays off completely inside the first 60 days.',
    inputs: [
      { id: 'upfrontHours', label: 'Upfront Creation & Build Effort (Hours)', type: 'number', defaultValue: 12, min: 1 },
      { id: 'instanceSaved', label: 'Saved Time Per Execution (Minutes)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'frequencyDay', label: 'Executions Count Per Day', type: 'number', defaultValue: 5, min: 1 }
    ],
    faq: [
      { question: 'Does payback factor logic updates?', answer: 'Payback times should ideally be less than 6 months, as custom tools often require minor feature alterations or runtime maintenance over longer times.' }
    ],
    relatedSlugs: ['task-efficiency', 'goal-achievement'],
    seoTitle: 'Custom Script Automation & Built Payback Calculator',
    seoDescription: 'Find when your investment in building automation is fully paid back in discretionary time saved.',
    calculate: (inputs) => {
      const upfront = Number(inputs.upfrontHours || 12);
      const savedMinutes = Number(inputs.instanceSaved || 15);
      const freq = Number(inputs.frequencyDay || 5);
      const dailySavedHrs = (savedMinutes * freq) / 60;
      const paybackDays = upfront / dailySavedHrs;
      const monthlySavingHrs = dailySavedHrs * 30;
      return {
        results: [
          { label: 'Payback Break-Even Point', value: paybackDays.toFixed(1) + ' Days', isPrimary: true },
          { label: 'Daily Saved Time', value: (dailySavedHrs * 60).toFixed(0) + ' minutes', unit: 'minutes' },
          { label: 'Net Core Saving Per Month', value: monthlySavingHrs.toFixed(1) + ' hours', unit: 'hours/mo' }
        ],
        chartData: [
          { name: 'Upfront Investment', value: upfront },
          { name: 'Net Saving in Year 1', value: Math.max(0, (dailySavedHrs * 365) - upfront) }
        ]
      };
    }
  },
  {
    id: 'goal-achievement',
    name: 'Goal Achievement Calculator',
    slug: 'goal-achievement',
    category: 'productivity',
    description: 'Break down complex goals into milestone targets and project completion dates based on weekly speed.',
    formula: 'Target Time Weeks = Total Required Creative Points / Weekly Velocity Output',
    explanation: 'Uses agile development practices to structure long-term projects (like writing novels, passing certifications, or preparing physical projects).',
    example: 'A certification requiring 120 total study units with a consistent velocity of 8 units per week finishes in 15 weeks.',
    inputs: [
      { id: 'workVolume', label: 'Total Task Complexity Units (Points)', type: 'number', defaultValue: 100, min: 5 },
      { id: 'weeklyHours', label: 'Weekly Hours Allocated To Work', type: 'number', defaultValue: 10, min: 1 },
      { id: 'efficiencySpeed', label: 'Planned Study Velocity Ratio', type: 'select', defaultValue: 1.0, options: [
        { label: 'Conservative / Deep (0.8x)', value: 0.8 },
        { label: 'Standard Steady (1.0x)', value: 1.0 },
        { label: 'Aggressive Sprint (1.3x)', value: 1.3 },
        { label: 'Ultra High Mastery (1.6x)', value: 1.6 }
      ]}
    ],
    faq: [
      { question: 'What is Study Velocity?', answer: 'Velocity models the pace of study. A standard 1.0x represents converting 1 hour into 1 structured point of content progress.' }
    ],
    relatedSlugs: ['productivity-planner', 'weekly-time'],
    seoTitle: 'Milestone Timeline Tracker & Goal Velocity Calculator',
    seoDescription: 'Accurately forecast completion timelines for complex accomplishments by tracking effort and velocity thresholds.',
    calculate: (inputs) => {
      const vol = Number(inputs.workVolume || 100);
      const hrs = Number(inputs.weeklyHours || 10);
      const vel = Number(inputs.efficiencySpeed || 1.0);
      const currentOutput = hrs * vel;
      const totalWeeks = vol / currentOutput;
      return {
        results: [
          { label: 'Projected Completion Term', value: totalWeeks.toFixed(1) + ' Weeks', isPrimary: true },
          { label: 'Weekly Milestone Velocity', value: currentOutput.toFixed(1) + ' pts / week' },
          { label: 'Total Hours Necessary', value: (totalWeeks * hrs).toFixed(0) + ' hours', unit: 'total hours' }
        ],
        chartData: [
          { name: 'Total Work To Do', value: vol },
          { name: 'Week 1 Progress', value: currentOutput },
          { name: 'Week 2 Accumulated', value: currentOutput * 2 }
        ]
      };
    }
  },

  // ====================================== CAREER ======================================
  {
    id: 'career-path',
    name: 'Career Path Calculator',
    slug: 'career-path',
    category: 'career',
    description: 'Calculate future corporate position promotion timelines and career lifetime earnings scenarios.',
    formula: 'Future Compounded Salary = Starting Salary * (1 + Growth Rate) ^ Tenure Year',
    explanation: 'Models salary growth by compounding annual promotions, continuous cost-of-living adjustments, and career milestones.',
    example: 'An $80,000 corporate starting salary compounding at 7.5% per year reaches $164,882 over a 10-year tenure.',
    inputs: [
      { id: 'baseSalary', label: 'Current Base Salary ($/Year)', type: 'number', defaultValue: 75000, min: 10000, step: 2500 },
      { id: 'growthRate', label: 'Forecast Annual Raise / Promotion Rate (%)', type: 'number', defaultValue: 8, min: 0, max: 50, step: 0.5 },
      { id: 'years', label: 'Planning Horizon Timeline (Years)', type: 'number', defaultValue: 10, min: 1, max: 40 }
    ],
    faq: [
      { question: 'What is a typical corporate annual salary increase?', answer: 'Average inflation cost raises range from 3% to 4%. Step elevations or milestone promotions yield 10% to 15% rate jumps.' }
    ],
    relatedSlugs: ['salary-growth', 'career-investment'],
    seoTitle: 'Lifetime Career Earnings Projection & Promotion Calculator',
    seoDescription: 'Determine your future salary potential and lifetime wealth projections by modeling structured raise rates.',
    calculate: (inputs) => {
      const base = Number(inputs.baseSalary || 75000);
      const growth = Number(inputs.growthRate || 8) / 100;
      const terms = Number(inputs.years || 10);
      let cumulative = 0;
      let finalSal = base;
      const steps = [];
      for (let i = 1; i <= terms; i++) {
        finalSal = finalSal * (1 + growth);
        cumulative += finalSal;
        if (i % Math.ceil(terms / 4) === 0 || i === terms) {
          steps.push({ name: `Year ${i}`, value: Math.round(finalSal) });
        }
      }
      return {
        results: [
          { label: 'Projected Target Salary', value: '$' + Math.round(finalSal).toLocaleString(), isPrimary: true },
          { label: 'Cumulative Gross Earnings', value: '$' + Math.round(cumulative).toLocaleString() },
          { label: 'Total Increase Percentage', value: (((finalSal - base) / base) * 100).toFixed(1) + '%', unit: 'growth' }
        ],
        chartData: steps
      };
    }
  },
  {
    id: 'skill-development',
    name: 'Skill Development Calculator',
    slug: 'skill-development',
    category: 'career',
    description: 'Model the acquisition curve of professional skills toward global mastery thresholds.',
    formula: 'Time to Level Hours = Effort Constant (Level) / Weekly Deliberate Practice Hours',
    explanation: 'Converts skill hours into standardized progression metrics. References Ericsson\'s 10,000-hour mastery research.',
    example: 'Allocating 15 hours of deliberate practice weekly leads to specialized professional competence (4,000 hours) in 5.1 years.',
    inputs: [
      { id: 'weeklyPractice', label: 'Practicing Hours Allocated per Week', type: 'number', defaultValue: 12, min: 1, max: 80 },
      { id: 'efficiencyRatio', label: 'Focus & Intent Factor', type: 'select', defaultValue: 1.0, options: [
        { label: 'Casual / Unfocused Practice (0.6x)', value: 0.6 },
        { label: 'Guided Deliberate Study (1.0x)', value: 1.0 },
        { label: 'Elite Pro Coaching & Bootcamps (1.4x)', value: 1.4 }
      ]}
    ],
    faq: [
      { question: 'What are the skill expertise hour milestones?', answer: '100 hours grants basic proficiency, 1,000 hours allows regional competence, 5,000 hours builds expert level, and 10,000 hours yields elite master rankings.' }
    ],
    relatedSlugs: ['career-path', 'career-investment'],
    seoTitle: 'Deliberate Skill Mastery & Expert Level Timeline Calculator',
    seoDescription: 'Calculate the physical years required to achieve top-tier professional expertise using deliberate practice models.',
    calculate: (inputs) => {
      const hrs = Number(inputs.weeklyPractice || 12);
      const focus = Number(inputs.efficiencyRatio || 1.0);
      const effectiveWeekly = hrs * focus;
      const yearsProficient = (1000 / effectiveWeekly) / 52;
      const yearsExpert = (5000 / effectiveWeekly) / 52;
      const yearsMaster = (10000 / effectiveWeekly) / 52;
      return {
        results: [
          { label: 'Timeline to Elite Mastery (10k hrs)', value: yearsMaster.toFixed(1) + ' Years', isPrimary: true },
          { label: 'Timeline to High Expert (5k hrs)', value: yearsExpert.toFixed(1) + ' Years', unit: 'years' },
          { label: 'Timeline to Core Proficient (1k hrs)', value: yearsProficient.toFixed(1) + ' Years', unit: 'years' }
        ],
        chartData: [
          { name: 'Proficient', value: yearsProficient * 12 },
          { name: 'Expert', value: yearsExpert * 12 },
          { name: 'Master', value: yearsMaster * 12 }
        ]
      };
    }
  },
  {
    id: 'salary-growth',
    name: 'Salary Growth Calculator',
    slug: 'salary-growth',
    category: 'career',
    description: 'Establish potential career long-term compounding salaries factoring raises and career milestones.',
    formula: 'Compounded Salary = Base Salary * (1 + Yearly Average Elevation Rate) ^ Horizon',
    explanation: 'Uses financial compounding math to trace long-range wealth scenarios based on credential enhancements and promotional jumps.',
    example: 'An $80,000 base starting salary compounding at 6% annually grows to $143,268 inside of a 10-year term.',
    inputs: [
      { id: 'base', label: 'Current Basic Compensation ($/Yr)', type: 'number', defaultValue: 65000, min: 5000, step: 2000 },
      { id: 'yearlyRaise', label: 'Average Raising Rate per Year (%)', type: 'number', defaultValue: 5, min: 0, max: 30, step: 0.1 },
      { id: 'horizon', label: 'Projected Careers Horizon (Years)', type: 'number', defaultValue: 15, min: 1, max: 50 }
    ],
    faq: [
      { question: 'Why does a 5% raise compound so fast?', answer: 'With compounding raises, your next raise is calculated off your new higher salary, which yields exponentially greater compounding returns over active 10-20 year timelines.' }
    ],
    relatedSlugs: ['career-path', 'job-decision'],
    seoTitle: 'Long-term Salary Incremental Compounding Calculator',
    seoDescription: 'Find how much your yearly salary expands over career spans by adjusting cost-of-living raises and promotion increments.',
    calculate: (inputs) => {
      const b = Number(inputs.base || 65000);
      const r = Number(inputs.yearlyRaise || 5) / 100;
      const y = Number(inputs.horizon || 15);
      const finalVal = b * Math.pow(1 + r, y);
      const totalGain = finalVal - b;
      return {
        results: [
          { label: 'Future Compositions Value', value: '$' + Math.round(finalVal).toLocaleString(), isPrimary: true },
          { label: 'Total Lifetime Cumulative raise', value: '$' + Math.round(totalGain).toLocaleString() },
          { label: 'Compounded Growth Margin', value: ((finalVal / b - 1) * 100).toFixed(1) + '%', unit: 'ratio' }
        ],
        chartData: [
          { name: 'Current Compensation', value: b },
          { name: 'Future Projected', value: finalVal }
        ]
      };
    }
  },
  {
    id: 'career-investment',
    name: 'Career Investment Calculator',
    slug: 'career-investment',
    category: 'career',
    description: 'Compute precise financial ROI of professional credentials, bootcamps, master degrees, and certifications.',
    formula: 'Investments Payback (Months) = Total Cash Expended / Projected Monthly Compensation Raise',
    explanation: 'Quantifies education pricing benefits by weighing direct school outlays and lost work opportunities against prospective salary bumps.',
    example: 'A premium tech programming bootcamp costing $15,000 that boosts salary by $2,000 monthly pays off fully in 7.5 months.',
    inputs: [
      { id: 'tuition', label: 'Total Direct Cost (Fee, Book, Travel) ($)', type: 'number', defaultValue: 12000, min: 100, step: 500 },
      { id: 'opportunityCost', label: 'Foregone Wages / Lost Income ($)', type: 'number', defaultValue: 5000, min: 0, step: 500 },
      { id: 'salaryBoost', label: 'Projected Gross Salary Boost ($/Year)', type: 'number', defaultValue: 15000, min: 1000, step: 1000 }
    ],
    faq: [
      { question: 'What is opportunity cost in education?', answer: 'Opportunity cost accounts for the wage you sacrifices if you must stop working to attend schools, classes, or bootcamps.' }
    ],
    relatedSlugs: ['career-path', 'salary-growth'],
    seoTitle: 'Education Master Degree & Bootcamp ROI Calculator',
    seoDescription: 'Discover the exact financial payback runtime of expensive degrees and technical bootcamps based on salary boosts.',
    calculate: (inputs) => {
      const t = Number(inputs.tuition || 12000);
      const o = Number(inputs.opportunityCost || 5000);
      const boost = Number(inputs.salaryBoost || 15000);
      const totalOutlay = t + o;
      const monthlyBoostVal = boost / 12;
      const paybackHrs = totalOutlay / monthlyBoostVal;
      const fiveYearROI = ((boost * 5) - totalOutlay) / totalOutlay * 100;
      return {
        results: [
          { label: 'Financial Break-Even (Months)', value: Math.max(0.1, paybackHrs).toFixed(1) + ' Months', isPrimary: true },
          { label: 'Total Adjusted Investment Cost', value: '$' + totalOutlay.toLocaleString() },
          { label: 'Projected 5-Year Net ROI', value: fiveYearROI.toFixed(0) + '%', unit: 'percentage' }
        ],
        chartData: [
          { name: 'Tuition Cost', value: t },
          { name: 'Opportunity Loss', value: o },
          { name: 'Boost Level Year 1', value: boost }
        ]
      };
    }
  },
  {
    id: 'job-decision',
    name: 'Job Decision Calculator',
    slug: 'job-decision',
    category: 'career',
    description: 'Utilize weighted decision matrix systems to objectively compare and score multiple competitive job offers.',
    formula: 'Score = (Salary Weight * Salary Rating) + (Commute Weight * Commute Rating) + (Culture Weight * Culture Rating)',
    explanation: 'Slices emotional bias out of job hunt choices by deploying structured weighted priorities across core offer and lifestyle factors.',
    example: 'Given extreme salary focus, an offer with higher base pay score outpaces a flexible remote job, grading at 8.7/10 overall.',
    inputs: [
      { id: 'salaryRating', label: 'Offer Salary & Bonus Rating (1 to 10)', type: 'range', defaultValue: 8, min: 1, max: 10, step: 1 },
      { id: 'commuteRating', label: 'Commute & Travel Flex Rating (1 to 10)', type: 'range', defaultValue: 6, min: 1, max: 10, step: 1 },
      { id: 'cultureRating', label: 'Life Balance & Work Culture Rating (1 to 10)', type: 'range', defaultValue: 7, min: 1, max: 10, step: 1 },
      { id: 'paramPriority', label: 'Primary Sizer Criterion Weighting', type: 'select', defaultValue: 'salary', options: [
        { label: 'Maximize Salary & Cash (Weighted 60% cash, 20% others)', value: 'salary' },
        { label: 'Maximize Remote Balance (Weighted 60% commute, 20% others)', value: 'lifestyle' },
        { label: 'Equal Holistic Sizing Matrix (Equal weight for all layers)', value: 'equal' }
      ]}
    ],
    faq: [
      { question: 'How do ratings work herein?', answer: 'Grade each parameter on a clean 1-10 spectrum. For commute, 10 represents fully remote or walking distance; for salary, 10 represents your peak target wealth.' }
    ],
    relatedSlugs: ['career-path', 'salary-growth'],
    seoTitle: 'Corporate Job Offer Decision Score & Matrix Calculator',
    seoDescription: 'Compute structural preference scores to compare competitive offers using salary, culture, and commute metrics.',
    calculate: (inputs) => {
      const sal = Number(inputs.salaryRating || 8);
      const com = Number(inputs.commuteRating || 6);
      const cul = Number(inputs.cultureRating || 7);
      const mode = String(inputs.paramPriority || 'salary');
      let wSal = 0.33, wCom = 0.33, wCul = 0.33;
      if (mode === 'salary') {
        wSal = 0.6; wCom = 0.2; wCul = 0.2;
      } else if (mode === 'lifestyle') {
        wSal = 0.2; wCom = 0.6; wCul = 0.2;
      }
      const score = (sal * wSal) + (com * wCom) + (cul * wCul);
      return {
        results: [
          { label: 'Offer Evaluation Score', value: score.toFixed(1) + ' / 10.0', isPrimary: true },
          { label: 'Decision Verdict Rating', value: score >= 8.0 ? 'Highly Recommended Offer' : score >= 6.0 ? 'Acceptable Offer' : 'Consider Negotiating' }
        ],
        chartData: [
          { name: 'Salary Value', value: sal * wSal * 10 },
          { name: 'Commute Value', value: com * wCom * 10 },
          { name: 'Culture Value', value: cul * wCul * 10 }
        ]
      };
    }
  },

  // ====================================== TECHNOLOGY ======================================
  {
    id: 'computer-upgrade',
    name: 'Computer Upgrade Calculator',
    slug: 'computer-upgrade',
    category: 'tech',
    description: 'Track processing and memory performance upgrade options to optimize digital workstation hardware lifespans.',
    formula: 'Bottleneck Index = Max(CPU Latency, Memory Latency, GPU Latency) as scaled ratios',
    explanation: 'Measures which subsystem holds back your daily processing tasks or gaming FPS to ensure target upgrade spending is focused correctly.',
    example: 'Operating an outdated 4-core physical CPU with a modern GPU during heavy video rendering triggers a 75% CPU core bottleneck bottleneck.',
    inputs: [
      { id: 'ram', label: 'Installed Memory RAM capacity (GB)', type: 'select', defaultValue: 8, options: [
        { label: '4 GB - Extreme Resource Starvation', value: 4 },
        { label: '8 GB - Normal Office Constraint', value: 8 },
        { label: '16 GB - Standard Multimedia Flex', value: 16 },
        { label: '32 GB - Advanced Workstation Grade', value: 32 },
        { label: '64 GB - Ultimate Developer / Content', value: 64 }
      ]},
      { id: 'cpuAge', label: 'Core Processor Generation Age (Years)', type: 'number', defaultValue: 4, min: 0, max: 15 },
      { id: 'hasSSD', label: 'Primary OS Drive Type', type: 'select', defaultValue: 'ssd', options: [
        { label: 'High-speed NVMe or SSD Drive', value: 'ssd' },
        { label: 'Standard Mechanical HDD Drive', value: 'hdd' }
      ]}
    ],
    faq: [
      { question: 'Which upgrade brings maximum speed gains?', answer: 'Transitioning from a mechanical hard drive (HDD) to a solid-state drive (SSD) offers the single most dramatic usability boost.' }
    ],
    relatedSlugs: ['hardware-cost', 'device-lifespan'],
    seoTitle: 'Workstation System Hardware Bottleneck Upgrade Calculator',
    seoDescription: 'Log your current PC specs to discover which specific hardware upgrades yield maximal system speed improvements.',
    calculate: (inputs) => {
      const ram = Number(inputs.ram || 8);
      const age = Number(inputs.cpuAge || 4);
      const isSSD = String(inputs.hasSSD || 'ssd') === 'ssd';
      let score = 90;
      if (ram <= 8) score -= 25;
      if (age >= 4) score -= (age * 6);
      if (!isSSD) score -= 35;
      const bottleneckRating = Math.max(15, Math.min(100, 100 - score));
      return {
        results: [
          { label: 'Overall Bottleneck Score', value: bottleneckRating.toFixed(0) + '%', isPrimary: true },
          { label: 'Recommended Priority Step', value: !isSSD ? 'Replace OS Drive with NVMe SSD' : ram < 16 ? 'Expand RAM memory to 16/32 GB' : age > 5 ? 'Upgrade CPU & Motherboard' : 'Workstation is highly optimized' }
        ],
        chartData: [
          { name: 'RAM Efficiency', value: ram * 1.5 },
          { name: 'CPU Viability', value: Math.max(0, 50 - (age * 5)) },
          { name: 'Drive Efficiency', value: isSSD ? 30 : 5 }
        ]
      };
    }
  },
  {
    id: 'hardware-cost',
    name: 'Hardware Cost Calculator',
    slug: 'hardware-cost',
    category: 'tech',
    description: 'Consolidate and balance motherboard, CPU, memory, storage, and graphics hardware component spending.',
    formula: 'Total System Cost = Graphics Processing GPU + Processor CPU + Motherboard + Storage SSD + RAM Memory + PSU',
    explanation: 'Collates PC hardware component quotes to enforce strict system budgeting for custom office servers or high-performance gaming rigs.',
    example: 'Budgeting $300 for a GPU, $200 for a CPU, $120 for a motherboard, and $180 for other core components totals $800.',
    inputs: [
      { id: 'gpu', label: 'Graphics Card / GPU Budget ($)', type: 'number', defaultValue: 350, min: 0, step: 25 },
      { id: 'cpu', label: 'Central Processor / CPU cost ($)', type: 'number', defaultValue: 220, min: 20, step: 10 },
      { id: 'moboAndPower', label: 'Motherboard, Case, and Power PSU ($)', type: 'number', defaultValue: 150, min: 30, step: 10 },
      { id: 'storageAndRam', label: 'Drives & RAM Memory Kits ($)', type: 'number', defaultValue: 110, min: 20, step: 10 }
    ],
    faq: [
      { question: 'What is a balanced component price ratio for a standard workstation?', answer: 'For general computation, CPU and RAM memory should claim ~40% of funds. For heavy design, CAD, or GPU data networks, graphics should take ~30-40%.' }
    ],
    relatedSlugs: ['computer-upgrade', 'device-lifespan'],
    seoTitle: 'Custom Workstation PC Component Budget Calculator',
    seoDescription: 'Calculate and plan your custom PC hardware build expenditures across processors, graphics cards, and memory.',
    calculate: (inputs) => {
      const gpuCost = Number(inputs.gpu || 350);
      const cpuCost = Number(inputs.cpu || 220);
      const moboCost = Number(inputs.moboAndPower || 150);
      const diskCost = Number(inputs.storageAndRam || 110);
      const grandTotal = gpuCost + cpuCost + moboCost + diskCost;
      return {
        results: [
          { label: 'Total Estimated System Cost', value: '$' + grandTotal.toLocaleString(), isPrimary: true },
          { label: 'Processing Allocation', value: ((cpuCost / grandTotal) * 100).toFixed(1) + '%' },
          { label: 'Graphics Allocation', value: ((gpuCost / grandTotal) * 100).toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Graphics', value: gpuCost },
          { name: 'Processor', value: cpuCost },
          { name: 'Motherboard/PSU', value: moboCost },
          { name: 'Drives/Memory', value: diskCost }
        ]
      };
    }
  },
  {
    id: 'device-lifespan',
    name: 'Device Lifespan Calculator',
    slug: 'device-lifespan',
    category: 'tech',
    description: 'Calculate and model the expected runtime lifespan of mobile, laptop, and server hardware.',
    formula: 'Expected Useful Years = Base Lifespan / (Usage Stress Factor * Thermal Factor)',
    explanation: 'Uses predictive wear calculations to model battery degradation, screen burnt-out rates, and heat degradation levels on core hardware.',
    example: 'A business workstation running 16 hours daily under dusty conditions has its base 5-year life reduced to 3.1 years.',
    inputs: [
      { id: 'deviceType', label: 'Subsystem Category', type: 'select', defaultValue: 'laptop', options: [
        { label: 'Premium Laptop Workstation', value: 'laptop' },
        { label: 'Mobile Smartphone Device', value: 'mobile' },
        { label: 'Continuous Enterprise Rack Server', value: 'server' },
        { label: 'Consolidated Office NAS Storage', value: 'nas' }
      ]},
      { id: 'dailyHours', label: 'Average Active Runtime Hours per Day', type: 'number', defaultValue: 8, min: 1, max: 24 },
      { id: 'hasCooling', label: 'Active Cooling / Environmental Setting', type: 'select', defaultValue: 'good', options: [
        { label: 'Excellent - Dust-controlled aircon room', value: 'good' },
        { label: 'Moderate - Generic standard room temp', value: 'medium' },
        { label: 'Intense - Enclosed enclosure or dusty floor', value: 'stress' }
      ]}
    ],
    faq: [
      { question: 'Why do server drives outlast standard drives?', answer: 'Enterprise server hardware is built with selective enterprise-tier mechanical components designed specifically for continuous 24/7 duty loops.' }
    ],
    relatedSlugs: ['computer-upgrade', 'hardware-cost'],
    seoTitle: 'Enterprise Server & Gadget Longevity Prediction Calculator',
    seoDescription: 'Predict the physical operating lifespan of computers and mobile devices based on active stress levels.',
    calculate: (inputs) => {
      const type = String(inputs.deviceType || 'laptop');
      const hrs = Number(inputs.dailyHours || 8);
      const cool = String(inputs.hasCooling || 'good');
      let base = 5;
      if (type === 'mobile') base = 3;
      else if (type === 'server') base = 7;
      else if (type === 'nas') base = 6;
      let stress = hrs / 8; // standard baseline is 8 hours
      if (cool === 'stress') stress *= 1.4;
      else if (cool === 'good') stress *= 0.85;
      const adjustedLife = Math.max(1, base / stress);
      return {
        results: [
          { label: 'Expected System Lifetime', value: adjustedLife.toFixed(1) + ' Years', isPrimary: true },
          { label: 'Relative Operational stress', value: stress.toFixed(2) + 'x factor' },
          { label: 'Replacement Alert Date', value: 'Required within ' + (adjustedLife * 12).toFixed(0) + ' Months' }
        ],
        chartData: [
          { name: 'Theoretical Optimum', value: base },
          { name: 'Estimated Practical', value: adjustedLife }
        ]
      };
    }
  },
  {
    id: 'storage-need',
    name: 'Storage Need Calculator',
    slug: 'storage-need',
    category: 'tech',
    description: 'Calculate file storage capacities needed for modern document, high-resolution photo, or CCTV logs.',
    formula: 'Total Sizer Requirement = File Count * Average File Category Size Multipliers',
    explanation: 'Quick visual footprint estimator for creators, system analysts, and developers organizing long-term storage partitions.',
    example: 'Storing 15,000 professional raw camera prints at 45 MB per picture requires at least 675 GB of raw space.',
    inputs: [
      { id: 'mediaType', label: 'Target Asset Format Sizer', type: 'select', defaultValue: 'rawPhoto', options: [
        { label: '1080p Standard HD Video (Per Minute - ~150 MB)', value: 150 },
        { label: '4K Ultra High Definition Video (Per Minute - ~400 MB)', value: 400 },
        { label: 'Standard Smartphone compressed JPG (Per File - ~3 MB)', value: 3 },
        { label: 'Professional RAW Camera Picture (Per File - ~45 MB)', value: 45 },
        { label: 'Compressed MP3 Audio Music track (Per File - ~6 MB)', value: 6 }
      ]},
      { id: 'mediaCount', label: 'Expected Volume / Minutes Count', type: 'number', defaultValue: 1000, min: 1, step: 10 }
    ],
    faq: [
      { question: 'Should I buy exactly what this estimates?', answer: 'Always buy at least 25-30% more storage than estimated. File systems require open overhead space to perform block file operations.' }
    ],
    relatedSlugs: ['backup-storage', 'storage-need'],
    seoTitle: 'Network Data Files Capacity Sizing Calculator',
    seoDescription: 'Sizer cloud disk and hard drive space needed to host camera RAW files, high-res audio, or 4K videos.',
    calculate: (inputs) => {
      const perUnit = Number(inputs.mediaType || 45);
      const count = Number(inputs.mediaCount || 1000);
      const sizeMB = perUnit * count;
      const sizeGB = sizeMB / 1024;
      const sizeTB = sizeGB / 1024;
      const label = sizeTB > 0.9 ? sizeTB.toFixed(2) + ' TB' : sizeGB.toFixed(1) + ' GB';
      return {
        results: [
          { label: 'Required Disk Capacity', value: label, isPrimary: true },
          { label: 'Total Megabytes Calculated', value: sizeMB.toLocaleString() + ' MB' },
          { label: 'Number of standard 1TB drives', value: Math.max(1, Math.ceil(sizeGB / 930)) + ' drives' }
        ],
        chartData: [
          { name: 'Estimated Sizing Space', value: sizeGB }
        ]
      };
    }
  }
];
