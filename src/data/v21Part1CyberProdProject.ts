import { Calculator } from '../types';

export const V21_PART1_CALCULATORS: Calculator[] = [
  // ====================================== CYBERSECURITY ======================================
  {
    id: 'password-policy',
    name: 'Password Policy Strength Calculator',
    slug: 'password-policy',
    category: 'cybersecurity',
    description: 'Calculate complexity entropy and estimated brute force cracking time based on security policies.',
    formula: 'Entropy (E) = L * log2(R)\nWhere L is length, R is character pool size.',
    explanation: 'Evaluates political password strength metrics. Models mathematical search space volume and computing decay rates against modern GPU matrix arrays.',
    example: 'A policy enforcing 12 characters with uppercase, lowercase, numbers, and symbols yields ~79.5 bits of entropy.',
    inputs: [
      { id: 'length', label: 'Minimum Password Length', type: 'number', defaultValue: 12, min: 4, max: 128 },
      { id: 'useUpper', label: 'Require Uppercase Letters [A-Z]', type: 'select', defaultValue: 'yes', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] },
      { id: 'useLower', label: 'Require Lowercase Letters [a-z]', type: 'select', defaultValue: 'yes', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] },
      { id: 'useDigits', label: 'Require Numbers [0-9]', type: 'select', defaultValue: 'yes', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] },
      { id: 'useSymbols', label: 'Require Special Characters [!@#$%^&*]', type: 'select', defaultValue: 'yes', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] }
    ],
    faq: [
      { question: 'What is a secure entropy threshold?', answer: 'An entropy score of 80 bits or above is generally considered highly secure against modern offline brute-force matching arrays.' }
    ],
    relatedSlugs: ['security-compliance', 'risk-impact'],
    seoTitle: 'Enterprise Password Policy Complexity & Entropy Calculator',
    seoDescription: 'Calculate password policy entropy ratings. Computes hypothetical brute-force cracking resistance based on character sets.',
    calculate: (inputs) => {
      const len = Number(inputs.length || 12);
      let pool = 0;
      if (inputs.useUpper === 'yes') pool += 26;
      if (inputs.useLower === 'yes') pool += 26;
      if (inputs.useDigits === 'yes') pool += 10;
      if (inputs.useSymbols === 'yes') pool += 33;
      if (pool === 0) pool = 10; // Default fallback to prevent infinity logs

      const entropy = len * Math.log2(pool);
      const searchSpace = Math.pow(pool, len);

      // standard speed estimation: 100 billion guesses per sec (1e11)
      const guessesPerSec = 1e11;
      const secondsToCrack = searchSpace / guessesPerSec;
      
      let crackTimeText = 'Less than 1 second';
      if (secondsToCrack > 31536000) {
        crackTimeText = `${(secondsToCrack / 31536000).toExponential(2)} Years`;
      } else if (secondsToCrack > 86400) {
        crackTimeText = `${(secondsToCrack / 86400).toFixed(1)} Days`;
      } else if (secondsToCrack > 3600) {
        crackTimeText = `${(secondsToCrack / 3600).toFixed(1)} Hours`;
      } else if (secondsToCrack > 60) {
        crackTimeText = `${(secondsToCrack / 60).toFixed(1)} Minutes`;
      }

      return {
        results: [
          { label: 'Calculated Entropy Score', value: `${entropy.toFixed(1)} Bits`, isPrimary: true },
          { label: 'Estimated GPU Offline Crack Time', value: crackTimeText, isPrimary: true },
          { label: 'Character Space Pool Size', value: pool },
          { label: 'Unique Permutations Total', value: searchSpace.toExponential(2) }
        ]
      };
    }
  },
  {
    id: 'security-compliance',
    name: 'Security Compliance Readiness Calculator',
    slug: 'security-compliance',
    category: 'cybersecurity',
    description: 'Assess enterprise compliance readiness score for SOC 2, ISO 27001, or GDPR frameworks.',
    formula: 'Readiness % = (Implemented Controls / Total Controls) * 100',
    explanation: 'Aggregates self-reported controls across standard cybersecurity governance categories to measure framework adherence values.',
    example: 'Completing 18 out of 25 core SOC 2 operational audits generates a 72% readiness progress bar.',
    inputs: [
      { id: 'framework', label: 'Compliance Target Framework', type: 'select', defaultValue: 'soc2', options: [
        { label: 'SOC 2 Type II (Security Rule)', value: 'soc2' },
        { label: 'ISO/IEC 27001 (ISMS Controls)', value: 'iso27001' },
        { label: 'GDPR (Data Privacy Directives)', value: 'gdpr' }
      ]},
      { id: 'controlCount', label: 'Total Audited Framework Controls', type: 'number', defaultValue: 24, min: 1 },
      { id: 'completedCount', label: 'Fully Implemented controls', type: 'number', defaultValue: 16, min: 0 }
    ],
    faq: [
      { question: 'What is the minimum passing rate for certification?', answer: 'Official audits require 100% adherence to defined scopes, though internal readiness checks help identify and fix gaps before an external evaluation.' }
    ],
    relatedSlugs: ['password-policy', 'risk-impact'],
    seoTitle: 'Cybersecurity SOC 2, GDPR & ISO 27001 Audit Readiness Calculator',
    seoDescription: 'Benchmark cybersecurity compliance status. Evaluate completed controls to estimate alignment with major security frameworks.',
    calculate: (inputs) => {
      const total = Number(inputs.controlCount || 24);
      const compl = Math.min(total, Number(inputs.completedCount || 16));
      
      const pct = (compl / total) * 100;
      let status = 'Significant Gaps Exist';
      if (pct >= 90) status = 'Audit Ready';
      else if (pct >= 70) status = 'Minor Remediation Needed';

      return {
        results: [
          { label: 'Readiness Rating', value: `${pct.toFixed(1)}%`, isPrimary: true },
          { label: 'Audit Readiness Category', value: status, isPrimary: true },
          { label: 'Outstanding Control Items', value: total - compl }
        ]
      };
    }
  },
  {
    id: 'risk-impact',
    name: 'Cybersecurity Risk Impact Calculator',
    slug: 'risk-impact',
    category: 'cybersecurity',
    description: 'Calculate overall risk priority score and threat levels utilizing likelihood and impact models.',
    formula: 'Risk Priority Score (RPS) = Likelihood Scale Value * Impact Severity Value',
    explanation: 'Uses NIST standards to map threat likelihood against financial or systems impact, producing a structured prioritization index.',
    example: 'An attack with high likelihood (4/5) and medium impact (3/5) yields a medium-high Risk Score of 12.',
    inputs: [
      { id: 'likelihood', label: 'Likelihood of Event occurring (1 to 5)', type: 'number', defaultValue: 3, min: 1, max: 5 },
      { id: 'impact', label: 'Operational & Financial Impact Severity (1 to 5)', type: 'number', defaultValue: 4, min: 1, max: 5 }
    ],
    faq: [
      { question: 'How is the risk score classified?', answer: 'Risk score levels: 1-5 (Low), 6-12 (Medium), 15-25 (High/Critical risk thresholds requiring immediate mitigation).' }
    ],
    relatedSlugs: ['threat-level', 'security-cost'],
    seoTitle: 'Cybersecurity Threat Risk Matrix (Likelihood x Impact) Calculator',
    seoDescription: 'Analyze digital business vulnerability factors. Compute risk priority scores using NIST evaluation matrices.',
    calculate: (inputs) => {
      const l = Math.min(5, Math.max(1, Number(inputs.likelihood || 3)));
      const i = Math.min(5, Math.max(1, Number(inputs.impact || 4)));
      const rps = l * i;

      let rLevel = 'LOW';
      if (rps >= 15) rLevel = 'CRITICAL / HIGH';
      else if (rps >= 6) rLevel = 'MEDIUM';

      return {
        results: [
          { label: 'Risk Priority Score', value: `${rps} / 25`, isPrimary: true },
          { label: 'Recommended Action Tier', value: rLevel, isPrimary: true },
          { label: 'Raw Likelihood Metric', value: l },
          { label: 'Raw Impact Metric', value: i }
        ]
      };
    }
  },
  {
    id: 'threat-level',
    name: 'Dynamic Threat Level & CVSS Calculator',
    slug: 'threat-level',
    category: 'cybersecurity',
    description: 'Estimate base vulnerability priority levels similar to the Common Vulnerability Scoring System (CVSS).',
    formula: 'Vulnerability threat weighting = AV * AC * PR * UI * C * I * A',
    explanation: 'Models threat vectors based on access complexity, target network boundaries, privileges, and confidentiality impacts.',
    example: 'An unauthenticated remote code execution exploit yields an ultra-high CVSS rating of 9.8.',
    inputs: [
      { id: 'vector', label: 'Attack Vector', type: 'select', defaultValue: 'N', options: [
        { label: 'Network Remote / Publicly exposed (N)', value: 'N' },
        { label: 'Adjacent Local Subnet Connection (A)', value: 'A' },
        { label: 'Physical Server Access Required (P)', value: 'P' }
      ]},
      { id: 'complexity', label: 'Attack Complexity', type: 'select', defaultValue: 'L', options: [
        { label: 'Low - Standard exploit tools (L)', value: 'L' },
        { label: 'High - Rare conditions needed (H)', value: 'H' }
      ]},
      { id: 'confidentiality', label: 'Confidentiality Impact Severity', type: 'select', defaultValue: 'H', options: [
        { label: 'Complete Leakage (H)', value: 'H' },
        { label: 'Partial Disclosure (L)', value: 'L' },
        { label: 'None (N)', value: 'N' }
      ]}
    ],
    faq: [
      { question: 'What does CVSS stand for?', answer: 'Common Vulnerability Scoring System, which is the global standardized open framework for communicating the characteristics and severity of software vulnerabilities.' }
    ],
    relatedSlugs: ['risk-impact', 'security-compliance'],
    seoTitle: 'CVSS Cybersecurity Vulnerability Threat Level Calculator',
    seoDescription: 'Obtain Base CVSS severity grades. Estimate security threat exposures based on attack vectors and confidentiality factors.',
    calculate: (inputs) => {
      let base = 5.0;
      if (inputs.vector === 'N') base += 2.5;
      if (inputs.vector === 'A') base += 1.0;
      if (inputs.complexity === 'L') base += 1.5;
      if (inputs.confidentiality === 'H') base += 1.0;

      const score = Math.min(10.0, base);

      return {
        results: [
          { label: 'Vulnerability Severity Score', value: `${score.toFixed(1)} / 10.0`, isPrimary: true },
          { label: 'Threat Classification Group', value: score >= 9.0 ? 'CRITICAL' : score >= 7.0 ? 'HIGH' : score >= 4.0 ? 'MEDIUM' : 'LOW', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'security-cost',
    name: 'Cybersecurity ROI & SLA Cost Calculator',
    slug: 'security-cost',
    category: 'cybersecurity',
    description: 'Evaluate cost balance sheets of digital defense solutions versus expected data breach losses.',
    formula: 'Net Return on Security Investment = (Risk Reductions - Solution Costs) / Solution Costs',
    explanation: 'Applies Gordon-Loeb paradigms to structure defensive enterprise investments, predicting net cost-efficiencies.',
    example: 'A $12,000 firewall safeguarding $90,000 in potential breach costs yields a 400% return.',
    inputs: [
      { id: 'assetValue', label: 'Safeguarded Assets Aggregate Value ($)', type: 'number', defaultValue: 150000, min: 1 },
      { id: 'incidentPct', label: 'Annual Baseline Breach Probability without Defense (%)', type: 'number', defaultValue: 12, min: 0.1, max: 100 },
      { id: 'solutionCost', label: 'Proposed Vendor Security Suite Annual Costs ($)', type: 'number', defaultValue: 5000, min: 1 },
      { id: 'mitigationRate', label: 'Vulnerability Mitigation Efficiency rate (%)', type: 'number', defaultValue: 85, min: 1, max: 100 }
    ],
    faq: [
      { question: 'How is secondary reputational damage factored in?', answer: 'The aggregate asset value should compile both direct IT restoration costs and long-term customer fallout or PR overhead.' }
    ],
    relatedSlugs: ['risk-impact', 'data-loss'],
    seoTitle: 'Cybersecurity Return on Security Investment (ROSI) Calculator',
    seoDescription: 'Find financial returns on cybersecurity software. Models expected data breach liabilities and compares them with software subscription costs.',
    calculate: (inputs) => {
      const asset = Number(inputs.assetValue || 150000);
      const prob = Number(inputs.incidentPct || 12) / 100;
      const cost = Number(inputs.solutionCost || 5000);
      const reduce = Number(inputs.mitigationRate || 85) / 100;

      const baselineALE = asset * prob; // Annual Loss Expectancy
      const mitigatedALE = baselineALE * (1 - reduce);
      const securitySavings = baselineALE - mitigatedALE;
      const netProfit = securitySavings - cost;
      const rosi = cost > 0 ? (netProfit / cost) * 100 : 0;

      return {
        results: [
          { label: 'ROSI Return Rating', value: `${rosi.toFixed(1)}%`, isPrimary: true },
          { label: 'Annualized Mitigation Savings', value: securitySavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Unmitigated Loss Risk (ALE)', value: baselineALE.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) },
          { label: 'Net Annual Savings after Cost', value: netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'incident-response',
    name: 'Incident Response MTTR & Speed Calculator',
    slug: 'incident-response',
    category: 'cybersecurity',
    description: 'Track team system alerting response rates, monitoring MTTD, MTTA, and MTTR indexes.',
    formula: 'MTTR = Sum(Restoration Duration hours) / Incident Count',
    explanation: 'Monitors incident response efficiency. Helping network operations managers review engineering downtime metrics.',
    example: 'A critical outage identified in 15 mins, acknowledged in 10 mins, and restored in 55 mins.',
    inputs: [
      { id: 'detectMinutes', label: 'Average Time from Event to Detect (MTTD - mins)', type: 'number', defaultValue: 15, min: 0 },
      { id: 'ackMinutes', label: 'Average Time from Detect to Acknowledge (MTTA - mins)', type: 'number', defaultValue: 12, min: 0 },
      { id: 'resolveMinutes', label: 'Average Time from Ack to Remediation (MTTR - mins)', type: 'number', defaultValue: 60, min: 1 }
    ],
    faq: [
      { question: 'What is MTTR?', answer: 'Mean Time to Resolution - the core industry SLA metric tracking operational response capabilities during outages or threat breaches.' }
    ],
    relatedSlugs: ['gpa-calculator', 'risk-impact'],
    seoTitle: 'Incident Response Team MTTR, MTTD, MTTA Operational Performance Calculator',
    seoDescription: 'Evaluate systems reliability. Tracks average service downtime intervals and resolution performance ratios.',
    calculate: (inputs) => {
      const d = Number(inputs.detectMinutes || 15);
      const a = Number(inputs.ackMinutes || 12);
      const r = Number(inputs.resolveMinutes || 60);

      const totalTimeMinutes = d + a + r;

      return {
        results: [
          { label: 'Total Mean Downtime', value: `${totalTimeMinutes} Minutes`, isPrimary: true },
          { label: 'Detection Speed Portion', value: `${((d / totalTimeMinutes) * 100).toFixed(0)}%`, isPrimary: true },
          { label: 'Active Mediation Resolution Rate', value: `${((r / totalTimeMinutes) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'recovery-planning',
    name: 'Disaster Recovery RTO & RPO Risk Calculator',
    slug: 'recovery-planning',
    category: 'cybersecurity',
    description: 'Calculate data loss and system downtime liabilities based on Recovery Time Objective (RTO) and Recovery Point Objective (RPO) metrics.',
    formula: 'Total RTO Downtime Loss = Outage Duration * Value of Operations per Hour',
    explanation: 'Models business continuity resilience by estimating financial and data vulnerabilities based on disaster restore capabilities.',
    example: 'An LLC losing $800/hr in operations with a 15-hour backup window.',
    inputs: [
      { id: 'hourlyRevenue', label: 'Average Operational Value per Hour ($)', type: 'number', defaultValue: 500, min: 0 },
      { id: 'rtoHours', label: 'Recovery Time Objective (RTO) Duration Target (Hours)', type: 'number', defaultValue: 4, min: 0.1, step: 0.1 },
      { id: 'rpoHours', label: 'Recovery Point Objective (RPO) Max File Age (Hours)', type: 'number', defaultValue: 24, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'What is the core difference between RTO and RPO?', answer: 'RTO (Recovery Time Objective) defines how quickly your systems must be restored to preserve operations, while RPO (Recovery Point Objective) sets the maximum acceptable age of data lost to a transaction crash.' }
    ],
    relatedSlugs: ['incident-response', 'data-loss'],
    seoTitle: 'Disaster Recovery Plan RTO & RPO Financial Loss Risk Calculator',
    seoDescription: 'Structure data backup schedules. Calculates operations loss figures using targeted RTO metrics.',
    calculate: (inputs) => {
      const revenue = Number(inputs.hourlyRevenue || 500);
      const rto = Number(inputs.rtoHours || 4);
      const rpo = Number(inputs.rpoHours || 24);

      const rtoCost = rto * revenue;
      const rpoCost = rpo * revenue; // estimate maximum possible data loss value
      const totalCombinedWorstCase = rtoCost + rpoCost;

      return {
        results: [
          { label: 'RTO Downtime Impact Cost', value: rtoCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Max RPO Data Loss Risk Cost', value: rpoCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Worst-Case Disaster Loss Risk', value: totalCombinedWorstCase.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'data-loss',
    name: 'Data Breach Liability & Cost Calculator',
    slug: 'data-loss',
    category: 'cybersecurity',
    description: 'Estimate legal liabilities, recovery expenses, and reputational damage following a business data breach.',
    formula: 'Total Breach Costs = Record Count * Cost Per Compromised Record',
    explanation: 'Based on Ponemon reports, helps compliance officers calculate potential financial exposure following a database breach.',
    example: 'A database leak involving 15,000 PII records, valued at an average of $164 per record.',
    inputs: [
      { id: 'recordCount', label: 'Compromised Individual PII Records Count', type: 'number', defaultValue: 5000, min: 1 },
      { id: 'recordCost', label: 'Estimated Liability Cost per Record ($) (PII Default: $164)', type: 'number', defaultValue: 164, min: 1 }
    ],
    faq: [
      { question: 'What costs are included in the record cost default?', answer: 'The default $164 per record includes forensic remediation, regulatory fines, customer notification costs, legal defense, and credit monitoring.' }
    ],
    relatedSlugs: ['risk-impact', 'security-cost'],
    seoTitle: 'Data Breach Financial Liability & Ransomware Loss Calculator',
    seoDescription: 'Calculate data leakage liabilities. Computes forensic restoration costs based on compromised PII record counts.',
    calculate: (inputs) => {
      const count = Number(inputs.recordCount || 5000);
      const cost = Number(inputs.recordCost || 164);

      const baseLoss = count * cost;
      const legalFund = baseLoss * 0.15;
      const totalExposure = baseLoss + legalFund;

      return {
        results: [
          { label: 'Estimated Base Exposure', value: baseLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Legal Defense Overhead (15%)', value: legalFund.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Estimated Liability Risk', value: totalExposure.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },

  // ====================================== PRODUCTIVITY ======================================
  {
    id: 'workday-calc',
    name: 'Workday Hours & Billable Capacity Calculator',
    slug: 'workday-calc',
    category: 'productivity',
    description: 'Calculate direct net operational working hours and measure daily focus percentages.',
    formula: 'Net Workday Hours = Total Hours - Non-working Breaks',
    explanation: 'Delineates business workflows to distinguish active focus targets from passive break times.',
    example: 'An 8.5-hour workday containing a 1-hour lunch break and two 15-minute syncs.',
    inputs: [
      { id: 'totalHours', label: 'Overall Core Clocked Hours (Hours)', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.1 },
      { id: 'lunchMinutes', label: 'Lunch Break Duration (Mins)', type: 'number', defaultValue: 45, min: 0 },
      { id: 'miscMinutes', label: 'Admin Overhead/Chat Breaks (Mins)', type: 'number', defaultValue: 30, min: 0 }
    ],
    faq: [
      { question: 'What is a typical focus ratio?', answer: 'A high-impact target is achieving a focus ratio above 75%, indicating that minimum time is spent on administrative tasks and distractions.' }
    ],
    relatedSlugs: ['focus-session', 'time-saving'],
    seoTitle: 'Workday Billable Hours & Active Productivity Ratio Calculator',
    seoDescription: 'Optimize your daily schedule. Calculate net working hours and tracking focus ratios by factoring in lunch breaks.',
    calculate: (inputs) => {
      const gross = Number(inputs.totalHours || 8.5);
      const lunch = Number(inputs.lunchMinutes || 45) / 60;
      const misc = Number(inputs.miscMinutes || 30) / 60;

      const net = Math.max(0, gross - lunch - misc);
      const pctRatio = gross > 0 ? (net / gross) * 100 : 0;

      return {
        results: [
          { label: 'Net Working Hours', value: `${net.toFixed(2)} Hrs`, isPrimary: true },
          { label: 'Core Workday Focus Ratio', value: `${pctRatio.toFixed(1)}%`, isPrimary: true },
          { label: 'Accumulated Break Time', value: `${((lunch + misc) * 60).toFixed(0)} mins` }
        ]
      };
    }
  },
  {
    id: 'focus-session',
    name: 'Pomodoro Focus Session Planner',
    slug: 'focus-session',
    category: 'productivity',
    description: 'Structure custom Pomodoro sprints with optimized work-to-rest ratios to prevent cognitive fatigue.',
    formula: 'Pomodoro sprint loop ratio = Work Time / Break Time',
    explanation: 'Uses behavioral focus loops to structure sustainable rest periods throughout your workday.',
    example: 'Four 25-minute Pomodoro sprints generate a total focus duration of 100 minutes with 15 minutes of rest.',
    inputs: [
      { id: 'workDuration', label: 'Focus Sprint Interval (Mins)', type: 'number', defaultValue: 25, min: 5 },
      { id: 'breakDuration', label: 'Short Rest Break Interval (Mins)', type: 'number', defaultValue: 5, min: 1 },
      { id: 'cycles', label: 'Set Loop Cycles (Count)', type: 'number', defaultValue: 4, min: 1 }
    ],
    faq: [
      { question: 'Why use the 25-5 Pomodoro default?', answer: 'The human brain maintains peak cognitive focus for roughly 20-30 minutes. Restricting intervals to 25 minutes optimizes concentration and helps prevent burnout.' }
    ],
    relatedSlugs: ['workday-calc', 'time-saving'],
    seoTitle: 'Custom Pomodoro Focus Cycle & Study Planner Calculator',
    seoDescription: 'Calculate work-to-rest intervals. Plan your Pomodoro study sessions to maximize focus and improve time management.',
    calculate: (inputs) => {
      const w = Number(inputs.workDuration || 25);
      const b = Number(inputs.breakDuration || 5);
      const c = Number(inputs.cycles || 4);

      const workTotal = w * c;
      const breakTotal = b * c;
      const sessionTotal = workTotal + breakTotal;

      return {
        results: [
          { label: 'Total Focus Work Time', value: `${workTotal} Minutes`, isPrimary: true },
          { label: 'Combined Rest Break Time', value: `${breakTotal} Minutes`, isPrimary: true },
          { label: 'Total Outlay Required', value: `${sessionTotal} Minutes` },
          { label: 'Overall Efficiency Ratio', value: `${((workTotal / sessionTotal) * 100).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'time-saving',
    name: 'Workflow Automation Time Savings Calculator',
    slug: 'time-saving',
    category: 'productivity',
    description: 'Calculate monthly and annual hours saved by automating repetitive tasks.',
    formula: 'Total Year Savings = Task Frequency * Time Saved per Task * 12',
    explanation: 'Assesses the long-term ROI of automation software, helping teams justify custom script developments and template creations.',
    example: 'Automating a daily task that used to take 12 minutes saves roughly 73 hours of raw work time per year.',
    inputs: [
      { id: 'timePerTask', label: 'Time Spent per Manual Run (Mins)', type: 'number', defaultValue: 15, min: 0.1 },
      { id: 'frequency', label: 'Task Frequency Occurrence (Times/Week)', type: 'number', defaultValue: 5, min: 1 },
      { id: 'wageHour', label: 'Internal Staff Labor Rate ($/Hour)', type: 'number', defaultValue: 35, min: 0 }
    ],
    faq: [
      { question: 'Should we automate everything?', answer: 'Only automate tasks where the setup costs are lower than the value of the hours saved over the asset\'s lifespan.' }
    ],
    relatedSlugs: ['productivity-loss', 'task-efficiency'],
    seoTitle: 'Work Time Savings & Script Automation Software ROI Calculator',
    seoDescription: 'Calculate time and labor cost savings from automation. Track recurring efficiency gains across weekly tasks easily.',
    calculate: (inputs) => {
      const minsSec = Number(inputs.timePerTask || 15);
      const freq = Number(inputs.frequency || 5);
      const wage = Number(inputs.wageHour || 35);

      const weeklyMins = minsSec * freq;
      const monthlyHours = (weeklyMins * 4.333) / 60;
      const yearlyHours = monthlyHours * 12;

      const monthlyCash = monthlyHours * wage;
      const yearlyCash = yearlyHours * wage;

      return {
        results: [
          { label: 'Annual Time Saved Balance', value: `${yearlyHours.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Annual Labor Cost Recaptured', value: yearlyCash.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Monthly Repose Gain', value: `${monthlyHours.toFixed(1)} Hours` },
          { label: 'Monthly Capital Equivalent', value: monthlyCash.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'productivity-loss',
    name: 'Downtime & Administrative Loss Cost Calculator',
    slug: 'productivity-loss',
    category: 'productivity',
    description: 'Measure the financial cost of operational distractions and administrative bottlenecks on your business.',
    formula: 'Monthly Distraction Loss = Distracted Hours * Employees * Salary Rate',
    explanation: 'Quantifies the monetary impact of daily distractions, helping teams improve workflow protocols.',
    example: 'Ten employees losing 35 minutes a day to status check ins costs thousands monthly.',
    inputs: [
      { id: 'crewSize', label: 'Count of Impacted Employees', type: 'number', defaultValue: 8, min: 1 },
      { id: 'lossMins', label: 'Daily Distracted Time per Staff Member (Mins)', type: 'number', defaultValue: 45, min: 1 },
      { id: 'avgWage', label: 'Average Staff Hourly Salary ($/Hour)', type: 'number', defaultValue: 42, min: 1 }
    ],
    faq: [
      { question: 'What counts as administrative drift?', answer: 'Administrative drift includes manual data entry, unnecessary alignment meetings, sorting emails, and switching between tools.' }
    ],
    relatedSlugs: ['time-saving', 'task-efficiency'],
    seoTitle: 'Corporate Distraction Costs & Workflow Bottleneck Calculator',
    seoDescription: 'Measure time and financial losses from operational distractions. Calculate team productivity drains to improve workflows.',
    calculate: (inputs) => {
      const crew = Number(inputs.crewSize || 8);
      const mins = Number(inputs.lossMins || 45);
      const wage = Number(inputs.avgWage || 42);

      const singleDailyLossHours = mins / 60;
      const crewDailyLossHours = singleDailyLossHours * crew;

      const monthlyLossHours = crewDailyLossHours * 21; // average 21 workdays in month
      const yearlyLossHours = monthlyLossHours * 12;

      const monthlyCashLoss = monthlyLossHours * wage;
      const yearlyCashLoss = yearlyLossHours * wage;

      return {
        results: [
          { label: 'Annual Capital Wasted', value: yearlyCashLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annual Cumulative Hours Lost', value: `${yearlyLossHours.toFixed(0)} Hours`, isPrimary: true },
          { label: 'Monthly Corporate Overhead Cost', value: monthlyCashLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'task-efficiency',
    name: 'Standard Task Efficiency Ratio Calculator',
    slug: 'task-efficiency',
    category: 'productivity',
    description: 'Compare actual task completion times against optimized historical benchmarks.',
    formula: 'Task Efficiency % = (Target Benchmark Time / Actual Completed Time) * 100',
    explanation: 'Measures and displays productivity efficiency, helping individuals adjust work paces and schedules.',
    example: 'An assignment with an 8-hour target baseline that takes 10 hours has an 80% efficiency rating.',
    inputs: [
      { id: 'benchmarkHours', label: 'Target Benchmark Baseline (Hours)', type: 'number', defaultValue: 6, min: 0.1, step: 0.1 },
      { id: 'actualHours', label: 'Actual Logged Completion Duration (Hours)', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'Can task efficiency exceed 100%?', answer: 'Yes! Exceeding 100% means the task was completed faster than the historical benchmark, indicating high focus and efficiency.' }
    ],
    relatedSlugs: ['time-saving', 'priority-matrix'],
    seoTitle: 'Task Assembly Speed & Focus Performance Efficiency Calculator',
    seoDescription: 'Calculate and track task completion benchmarks. Compare actual work durations against optimized timelines.',
    calculate: (inputs) => {
      const b = Number(inputs.benchmarkHours || 6);
      const a = Number(inputs.actualHours || 8.5);

      const efficiency = (b / a) * 100;
      const variance = a - b;

      return {
        results: [
          { label: 'Task Operational Efficiency', value: `${efficiency.toFixed(1)}%`, isPrimary: true },
          { label: 'Baseline Variance Offset', value: `${variance.toFixed(2)} Hours`, isPrimary: true },
          { label: 'Rating Designation', value: efficiency >= 100 ? 'Peak Excellence' : efficiency >= 80 ? 'Standard Alignment' : 'Training Optimization Recommended' }
        ]
      };
    }
  },
  {
    id: 'goal-tracking',
    name: 'KPI Goal Progress tracker',
    slug: 'goal-tracking',
    category: 'productivity',
    description: 'Track and display your key business metrics against defined target goals over a given timeline.',
    formula: 'Current Run Rate Needed = Remaining Target / Remaining Sessions',
    explanation: 'Tracks personal or team performance across milestones, preventing last-minute rushes.',
    example: 'Aiming to write 40,000 words in 30 days, completing 12,000 words in the first 10 days.',
    inputs: [
      { id: 'targetGoal', label: 'Overall Completion Target Unit Goal', type: 'number', defaultValue: 100, min: 1 },
      { id: 'currentVal', label: 'Active Current Completed Level', type: 'number', defaultValue: 35, min: 0 },
      { id: 'totalDays', label: 'Total Planned Project Timeline (Days)', type: 'number', defaultValue: 30, min: 1 },
      { id: 'daysUsed', label: 'Elapsed Days Spent to Date (Days)', type: 'number', defaultValue: 12, min: 0 }
    ],
    faq: [
      { question: 'What is a metric run rate?', answer: 'The run rate is the pace required per day from today onward to hit your goal on schedule.' }
    ],
    relatedSlugs: ['task-efficiency', 'workday-calc'],
    seoTitle: 'Target Goal Tracking Metric Pace Progress Calculator',
    seoDescription: 'Track key performance metrics and deadlines. Calculate daily progress run rates needed to hit your goals.',
    calculate: (inputs) => {
      const target = Number(inputs.targetGoal || 100);
      const curr = Math.min(target, Number(inputs.currentVal || 35));
      const daysTotal = Number(inputs.totalDays || 30);
      const daysSpent = Math.min(daysTotal, Number(inputs.daysUsed || 12));

      const completionPct = (curr / target) * 100;
      const remainingVal = target - curr;
      const remainingDays = daysTotal - daysSpent;

      let runRateStr = 'Target Hit!';
      if (remainingVal > 0 && remainingDays > 0) {
        runRateStr = `${(remainingVal / remainingDays).toFixed(2)} units per day`;
      } else if (remainingVal > 0 && remainingDays <= 0) {
        runRateStr = 'Deadline reached with incomplete goals';
      }

      return {
        results: [
          { label: 'Overall Goal Progress Completed', value: `${completionPct.toFixed(1)}%`, isPrimary: true },
          { label: 'Required Target Daily Run Rate', value: runRateStr, isPrimary: true },
          { label: 'Unfinished Target Balance', value: remainingVal },
          { label: 'Remaining Calendar Days', value: remainingDays }
        ]
      };
    }
  },
  {
    id: 'priority-matrix',
    name: 'ICE Score Priority Index Calculator',
    slug: 'priority-matrix',
    category: 'productivity',
    description: 'Prioritize feature backlogs and roadmap tasks using the ICE framework (Impact, Confidence, Ease).',
    formula: 'ICE Score = Impact (1-10) * Confidence (1-10) * Ease (1-10)',
    explanation: 'Used by agile teams to objectively evaluate backlog priorities and make data-driven roadmap choices.',
    example: 'An automation feature with high Impact (8), high Confidence (9), but low Ease (3) has an ICE score of 216.',
    inputs: [
      { id: 'impactScore', label: 'Project Impact (How much it helps) [1 to 10]', type: 'number', defaultValue: 8, min: 1, max: 10 },
      { id: 'confidenceScore', label: 'Confidence % (How sure are we of impact) [1 to 10]', type: 'number', defaultValue: 7, min: 1, max: 10 },
      { id: 'easeScore', label: 'Ease of implementation (How easy to build) [1 to 10]', type: 'number', defaultValue: 5, min: 1, max: 10 }
    ],
    faq: [
      { question: 'How is ICE score interpreted?', answer: 'ICE scores can range from 1 to 1,000. Higher scores indicate projects that offer high returns with lower engineering effort.' }
    ],
    relatedSlugs: ['task-efficiency', 'goal-tracking'],
    seoTitle: 'ICE Backlog Scoring Priority Calculator | Agile Roadmap Solver',
    seoDescription: 'Calculate task priority scores using the ICE method (Impact, Confidence, Ease) to optimize your roadmap.',
    calculate: (inputs) => {
      const imp = Math.max(1, Math.min(10, Number(inputs.impactScore || 8)));
      const conf = Math.max(1, Math.min(10, Number(inputs.confidenceScore || 7)));
      const ease = Math.max(1, Math.min(10, Number(inputs.easeScore || 5)));

      const totalIce = imp * conf * ease;

      return {
        results: [
          { label: 'ICE Priority Score', value: `${totalIce} / 1000`, isPrimary: true },
          { label: 'Implementation Priority Tier', value: totalIce >= 512 ? 'IMMEDIATE FOCUS' : totalIce >= 216 ? 'STAGED REMEDIATION' : 'BACKLOG STASIS', isPrimary: true }
        ]
      };
    }
  },

  // ====================================== PROJECT MANAGEMENT ======================================
  {
    id: 'project-deadline',
    name: 'Project Timeline & Deadline Estimator',
    slug: 'project-deadline',
    category: 'project-management',
    description: 'Estimate realistic project target dates by factoring in task weights and team buffer percentages.',
    formula: 'Planned Days = (Total Estimate Hours / Standard Daily Hours) * (1 + Buffer %)',
    explanation: 'Models project completion risks and estimates realistic milestone goals.',
    example: 'A 120-hour sprint with an 8-hour daily pace and a 20% safety buffer takes 18 business days.',
    inputs: [
      { id: 'estimateHours', label: 'Total Estimated Task Effort (Hours)', type: 'number', defaultValue: 120, min: 1 },
      { id: 'workdayHours', label: 'Daily Delivery Capacity (Hours/Day)', type: 'number', defaultValue: 8, min: 1, max: 24 },
      { id: 'bufferPct', label: 'Project Risk Safety Buffer (%)', type: 'number', defaultValue: 20, min: 0, max: 150 }
    ],
    faq: [
      { question: 'Why add a project safety buffer?', answer: 'Buffers account for unplanned scope creep, technical debt, and team illness, helping you set realistic stakeholder expectations.' }
    ],
    relatedSlugs: ['project-budget', 'team-capacity'],
    seoTitle: 'Project Timeline, Effort Days & Deadline Estimator',
    seoDescription: 'Estimate reliable milestone completion dates. Factors in team daily hours and project buffer percentages.',
    calculate: (inputs) => {
      const hours = Number(inputs.estimateHours || 120);
      const dayHrs = Number(inputs.workdayHours || 8);
      const buffer = Number(inputs.bufferPct || 20) / 100;

      const rawDays = hours / dayHrs;
      const bufferedDays = rawDays * (1 + buffer);

      return {
        results: [
          { label: 'Estimated Working Days', value: `${bufferedDays.toFixed(1)} Days`, isPrimary: true },
          { label: 'Raw Effort Required', value: `${rawDays.toFixed(1)} Days`, isPrimary: true },
          { label: 'Safety Buffer Added', value: `${(rawDays * buffer).toFixed(1)} Days` }
        ]
      };
    }
  },
  {
    id: 'project-budget',
    name: 'EVM Project Budget Variance Calculator',
    slug: 'project-budget',
    category: 'project-management',
    description: 'Track project budget health and project costs using Earned Value Management (EVM).',
    formula: 'Cost Variance (CV) = Earned Value (EV) - Actual Cost (AC)',
    explanation: 'Uses standard PMI governance principles to measure project cost variances and forecast budget health.',
    example: 'An EV of $10K with an AC of $11K generates an unfavorable Cost Variance of -$1,000.',
    inputs: [
      { id: 'plannedValue', label: 'Planned Value (PV) Projected Work Budget ($)', type: 'number', defaultValue: 15000, min: 1 },
      { id: 'earnedValue', label: 'Earned Value (EV) Physical Completed Budget ($)', type: 'number', defaultValue: 12000, min: 0 },
      { id: 'actualCost', label: 'Actual Cost (AC) Settled Outlay Expenses ($)', type: 'number', defaultValue: 14000, min: 1 }
    ],
    faq: [
      { question: 'What is a positive Cost Variance?', answer: 'A positive Cost Variance (CV > 0) means the project is running under budget, indicating efficient resource allocation.' }
    ],
    relatedSlugs: ['project-deadline', 'project-performance'],
    seoTitle: 'EVM Cost & Budget Variance PMI Project Calculator',
    seoDescription: 'Monitor project budget health using Earned Value Management (EVM). Calculate cost and schedule variances easily.',
    calculate: (inputs) => {
      const pv = Number(inputs.plannedValue || 15000);
      const ev = Number(inputs.earnedValue || 12000);
      const ac = Number(inputs.actualCost || 14000);

      const cv = ev - ac;
      const sv = ev - pv; // Schedule Variance

      return {
        results: [
          { label: 'Cost Variance (CV)', value: cv.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Schedule Variance (SV)', value: sv.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Cost Performance Status', value: cv >= 0 ? 'UNDER BUDGET (Good)' : 'OVER BUDGET (Variance alert)', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'project-completion',
    name: 'Weighted Project Completion Calculator',
    slug: 'project-completion',
    category: 'project-management',
    description: 'Calculate overall project progress using custom weighted tasks.',
    formula: 'Overall Progress % = Sum(Task Progress * Task Weight) / Sum(Task Weights)',
    explanation: 'Dells into realistic task breakdowns where large phases (such as architecture) are weighted higher than minor subtasks.',
    example: 'An LLC completing a database design (worth 40% weighting) and a frontend setup (worth 25% weight).',
    inputs: [
      { id: 'task1Progress', label: 'Task Phase 1 Completed Progress (%)', type: 'number', defaultValue: 100, min: 0, max: 100 },
      { id: 'task1Weight', label: 'Task Phase 1 Project Importance Weight', type: 'number', defaultValue: 3, min: 1 },
      { id: 'task2Progress', label: 'Task Phase 2 Completed Progress (%)', type: 'number', defaultValue: 40, min: 0, max: 100 },
      { id: 'task2Weight', label: 'Task Phase 2 Importance Weight', type: 'number', defaultValue: 2, min: 1 }
    ],
    faq: [
      { question: 'Why use weighted progress instead of task averages?', answer: 'Simple averages treat all tasks equally. Weighted progress accounts for task size and impact, providing a more realistic view of project completion.' }
    ],
    relatedSlugs: ['project-deadline', 'work-allocation'],
    seoTitle: 'Weighted Project Progress & Task Milestone Completion Calculator',
    seoDescription: 'Calculate overall project progress based on custom task weights. Get a realistic completion percentage for your team.',
    calculate: (inputs) => {
      const p1 = Number(inputs.task1Progress || 100);
      const w1 = Number(inputs.task1Weight || 3);
      const p2 = Number(inputs.task2Progress || 40);
      const w2 = Number(inputs.task2Weight || 2);

      const totalWeight = w1 + w2;
      const weightedProgressSum = (p1 * w1) + (p2 * w2);
      const progress = totalWeight > 0 ? weightedProgressSum / totalWeight : 0;

      return {
        results: [
          { label: 'Weighted Project Progress', value: `${progress.toFixed(1)}%`, isPrimary: true },
          { label: 'Outstanding Effort Remaining', value: `${(100 - progress).toFixed(1)}%`, isPrimary: true },
          { label: 'Aggregate Weights Allocated', value: totalWeight }
        ]
      };
    }
  },
  {
    id: 'team-capacity',
    name: 'Sprint Team Capacity Calculator',
    slug: 'team-capacity',
    category: 'project-management',
    description: 'Calculate available team working hours for upcoming agile sprints, factoring in meetings and time off.',
    formula: 'Capacity Hours = Member Count * Daily Workday hours * Days - PTO/Meetings Time',
    explanation: 'Helps teams budget resources during sprint planning to prevent over-allocation.',
    example: 'A six-person team over a 10-day sprint has roughly 370 available hours after accounting for holidays and Scrum meetings.',
    inputs: [
      { id: 'teamSize', label: 'Development Core Team Size', type: 'number', defaultValue: 5, min: 1 },
      { id: 'sprintDays', label: 'Sprint Calendar Working Days', type: 'number', defaultValue: 10, min: 1 },
      { id: 'workdayHrs', label: 'Planned Raw Working Hours per Day', type: 'number', defaultValue: 8, min: 1, max: 24 },
      { id: 'ptoHours', label: 'Planned Team Time Off / PTO (Hours)', type: 'number', defaultValue: 16, min: 0 },
      { id: 'meetingHours', label: 'Sprint Scrum Overhead Meetings per Person (Hours)', type: 'number', defaultValue: 6, min: 0 }
    ],
    faq: [
      { question: 'Why factor in Scrum overhead hours?', answer: 'Daily standups, retro workshops, and planning sessions can reduce actual coding capacity by up to 15%, which must be factored into estimations.' }
    ],
    relatedSlugs: ['project-deadline', 'work-allocation'],
    seoTitle: 'Sprint Capacity & Developer resource Sizing Planner',
    seoDescription: 'Calculate team capacity for agile sprints. Factors in raw hours, PTO, and Scrum meeting overhead.',
    calculate: (inputs) => {
      const size = Number(inputs.teamSize || 5);
      const days = Number(inputs.sprintDays || 10);
      const hoursDay = Number(inputs.workdayHrs || 8);
      const pto = Number(inputs.ptoHours || 16);
      const meetings = Number(inputs.meetingHours || 6);

      const grossHours = size * days * hoursDay;
      const meetingOverheadTotal = meetings * size;
      const netCapacity = Math.max(0, grossHours - pto - meetingOverheadTotal);

      return {
        results: [
          { label: 'Available Sprint Capacity', value: `${netCapacity.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Gross Potential Capacity', value: `${grossHours} Hours`, isPrimary: true },
          { label: 'Scrum Meetings Overhead', value: `${meetingOverheadTotal} Hours` },
          { label: 'Target Focus Allocation Limit (85%)', value: `${(netCapacity * 0.85).toFixed(1)} Hours` }
        ]
      };
    }
  },
  {
    id: 'work-allocation',
    name: 'Task & Resource Work Allocation Calculator',
    slug: 'work-allocation',
    category: 'project-management',
    description: 'Check team allocation rates by comparing assigned tasks to available hours.',
    formula: 'Allocation Rate = (Assigned Workload / Available Capacity) * 100',
    explanation: 'Reviews resource allocation levels to optimize workloads and balance team operations.',
    example: 'Assigning a 42-hour workload to an engineer with 35 available hours results in a 120% allocation rate.',
    inputs: [
      { id: 'totalAssigned', label: 'Assigned Workload Task Hours (Hours)', type: 'number', defaultValue: 32, min: 1 },
      { id: 'totalAvailable', label: 'Engineer Available Capacity (Hours)', type: 'number', defaultValue: 40, min: 1 }
    ],
    faq: [
      { question: 'What is the optimal allocation rate?', answer: 'Aim for a 75-85% allocation rate, leaving buffer room for urgent tasks and code reviews.' }
    ],
    relatedSlugs: ['team-capacity', 'project-performance'],
    seoTitle: 'Team Task Allocation & Resource Overload Risk Calculator',
    seoDescription: 'Balance team workloads. Compare assigned tasks to available hours to prevent employee burnout.',
    calculate: (inputs) => {
      const ass = Number(inputs.totalAssigned || 32);
      const cap = Number(inputs.totalAvailable || 40);

      const rate = (ass / cap) * 100;
      let review = 'Safe Allocation';
      if (rate > 100) review = 'Over-allocated Risk (Overtime)';
      else if (rate < 60) review = 'Under-utilized (Bench time)';

      return {
        results: [
          { label: 'Member Resource Allocation Rate', value: `${rate.toFixed(1)}%`, isPrimary: true },
          { label: 'Risk Balance Assessment', value: review, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'project-performance',
    name: 'EVM Project Performance CPI & SPI Calculator',
    slug: 'project-performance',
    category: 'project-management',
    description: 'Calculate Cost Performance Index (CPI) and Schedule Performance Index (SPI) to check project efficiency.',
    formula: 'CPI = Earned Value / Actual Cost | SPI = Earned Value / Planned Value',
    explanation: 'Standard PMI indices showing if your project performance is aligned with schedule and cost benchmarks.',
    example: 'A CPI of 1.05 and SPI of 0.95 means you are under budget but slightly behind schedule.',
    inputs: [
      { id: 'plannedValue', label: 'Planned Value (PV) Projected Work ($)', type: 'number', defaultValue: 10000, min: 1 },
      { id: 'earnedValue', label: 'Earned Value (EV) Physical Accomplished ($)', type: 'number', defaultValue: 9500, min: 0 },
      { id: 'actualCost', label: 'Actual Cost (AC) Realized Spending ($)', type: 'number', defaultValue: 9000, min: 1 }
    ],
    faq: [
      { question: 'How do you interpret the performance indexes?', answer: 'Values above 1.0 indicate favorable performance, while values below 1.0 indicate that the project is over budget or behind schedule.' }
    ],
    relatedSlugs: ['project-budget', 'project-deadline'],
    seoTitle: 'EVM Project performance Index (CPI & SPI) Calculator',
    seoDescription: 'Benchmark project health. Calculate CPI & SPI indices to check cost-efficiencies and schedules.',
    calculate: (inputs) => {
      const pv = Number(inputs.plannedValue || 10000);
      const ev = Number(inputs.earnedValue || 9500);
      const ac = Number(inputs.actualCost || 9000);

      const cpi = ev / ac;
      const spi = ev / pv;

      return {
        results: [
          { label: 'Cost Performance Index (CPI)', value: cpi.toFixed(3), isPrimary: true },
          { label: 'Schedule Performance Index (SPI)', value: spi.toFixed(3), isPrimary: true },
          { label: 'Overall Health Rating', value: (cpi >= 1 && spi >= 1) ? 'On schedule & under budget' : (cpi < 1 && spi < 1) ? 'Critical: Behind schedule & over budget' : 'Marginal imbalance', isPrimary: true }
        ]
      };
    }
  }
];
