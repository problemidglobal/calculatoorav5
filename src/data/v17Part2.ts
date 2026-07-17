import { Calculator } from '../types';

export const V17_PART2_CALCULATORS: Calculator[] = [
  // ====================================== PROJECT MANAGEMENT ======================================
  {
    id: 'pm-project-cost',
    name: 'Project Budget & Contingency Calculator',
    slug: 'pm-project-cost',
    category: 'project-management',
    description: 'Calculate total project cost projection curves including material bounds and budget contingencies.',
    formula: 'Cost = Labor Hours * Rate + Materials * (1 + Contingency % / 100)',
    explanation: 'Integrates operational contingency factor padding to safeguard against unforeseen project labor inflation.',
    example: 'Planning 160 developer hours at $75/hr with $5,000 resources and 10% contingency yields $18,700 total.',
    inputs: [
      { id: 'hours', label: 'Allocated Project Hours', type: 'number', defaultValue: 100, min: 1, step: 5, unit: 'hrs' },
      { id: 'rate', label: 'Average Hourly Billing Rate', type: 'number', defaultValue: 65, min: 1, step: 5, unit: '$/hr' },
      { id: 'materials', label: 'Direct Resource & Hardware Fees', type: 'number', defaultValue: 3000, min: 0, step: 100, unit: '$' },
      { id: 'contingency', label: 'Financial Reserve Contingency', type: 'number', defaultValue: 15, min: 0, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'Why is budget contingency required?', answer: 'Unforeseen delays, price fluctuations, or minor scope adjustments crop up in most projects. A 10-20% contingency ensures the project completes without stalling over funding thresholds.' }
    ],
    relatedSlugs: ['pm-project-roi', 'pm-project-timeline', 'pm-resource-pricing'],
    seoTitle: 'Project Budget & Contingency Cost Calculator',
    seoDescription: 'Obtain overall project cost predictions including safety buffers and materials pricing.',
    calculate: (inputs) => {
      const hours = Number(inputs.hours || 0);
      const rate = Number(inputs.rate || 0);
      const materials = Number(inputs.materials || 0);
      const contingency = Number(inputs.contingency || 0) / 100;
      
      const labor = hours * rate;
      const baseTotal = labor + materials;
      const contingentValue = baseTotal * contingency;
      const finalCost = baseTotal + contingentValue;
      
      return {
        results: [
          { label: 'Total Projected Project Cost', value: Math.round(finalCost), unit: '$', isPrimary: true },
          { label: 'Required Contingency Reserve', value: Math.round(contingentValue), unit: '$' },
          { label: 'Unbuffered Core Project Costs', value: baseTotal, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'pm-project-timeline',
    name: 'Project Timeline & Delay Calculator',
    slug: 'pm-project-timeline',
    category: 'project-management',
    description: 'Calculate overall calendar schedules factoring in parallel task execution efficiency.',
    formula: 'Timeline Days = Sequential Tasks + (Parallel Tasks / Co-efficiency)',
    explanation: 'Models resource parallel efficiency declines to predict accurate completion calendar targets.',
    example: 'A task list spanning 30 parallel workdays across 2 people running at 80% co-efficiency takes 18.8 days.',
    inputs: [
      { id: 'days', label: 'Sum of Overall Task Man-Days', type: 'number', defaultValue: 45, min: 1, unit: 'days' },
      { id: 'parallel', label: 'Share of Tasks Runnable in Parallel', type: 'number', defaultValue: 60, min: 0, max: 100, unit: '%' },
      { id: 'staff', label: 'Available Staff Members', type: 'number', defaultValue: 3, min: 1, max: 50 }
    ],
    faq: [
      { question: 'What is parallel task efficiency?', answer: 'As more parallel streams are launched, communication overhead, status alignments, and code merges decrease true team operational efficiency.' }
    ],
    relatedSlugs: ['pm-team-capacity', 'pm-project-cost', 'pm-project-risk'],
    seoTitle: 'Agile Team Roadmap Calendar & Task Estimator',
    seoDescription: 'Benchmark parallel capabilities to project delivery calendar durations.',
    calculate: (inputs) => {
      const days = Number(inputs.days || 10);
      const parallelPct = Number(inputs.parallel || 50) / 100;
      const staff = Number(inputs.staff || 1);
      
      const seqDays = days * (1 - parallelPct);
      const parDays = days * parallelPct;
      
      // Multi-resource overhead scaling
      const efficiency = staff === 1 ? 1.0 : Math.max(0.5, 1.0 - (staff - 1) * 0.05);
      const parallelDuration = parDays / (staff * efficiency);
      const totalDuration = seqDays + parallelDuration;
      
      return {
        results: [
          { label: 'Projected Calendar Duration', value: Number(totalDuration.toFixed(1)), unit: 'workdays', isPrimary: true },
          { label: 'Delivery Time scale', value: Number((totalDuration / 5).toFixed(1)), unit: 'weeks' },
          { label: 'Resource Multiplier Efficiency', value: Math.round(efficiency * 100), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'pm-team-capacity',
    name: 'Sprint Team Capacity Calculator',
    slug: 'pm-team-capacity',
    category: 'project-management',
    description: 'Calculate total net story points or human effort hours available per development cycle.',
    formula: 'Sprint Hours = Team Size * Days * Daily Hours * Utilization factor',
    explanation: 'Discounts meetings, support duties, and admin tasks to retrieve true development and validation hours.',
    example: 'A 5-person team working a 10-day sprint at 6 hours/day with 80% focus capacity yields 240 hours.',
    inputs: [
      { id: 'team', label: 'Team Size (Developers)', type: 'number', defaultValue: 4, min: 1, max: 100 },
      { id: 'days', label: 'Sprint Length (Workdays)', type: 'number', defaultValue: 10, min: 1, max: 30, unit: 'days' },
      { id: 'hours', label: 'Nominal Daily Work Hours', type: 'number', defaultValue: 8, min: 4, max: 12, unit: 'hrs/day' },
      { id: 'focus', label: 'Core Productivity Focus', type: 'number', defaultValue: 75, min: 10, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'Why is team capacity capped at 75-80%?', answer: 'Daily standups, email management, documentation review, and context switching take up to 2.5 hours of a typical workday.' }
    ],
    relatedSlugs: ['pm-agile-sprint', 'pm-story-points', 'pm-resource-pricing'],
    seoTitle: 'Sprint Agile Focus Capacity Hour Calculator',
    seoDescription: 'Obtain precise development hours available in active workflows after deducting administrative overhead.',
    calculate: (inputs) => {
      const team = Number(inputs.team || 1);
      const days = Number(inputs.days || 10);
      const hours = Number(inputs.hours || 8);
      const focus = Number(inputs.focus || 75) / 100;
      
      const totalNominal = team * days * hours;
      const capacity = totalNominal * focus;
      const adminOverhead = totalNominal - capacity;
      
      return {
        results: [
          { label: 'Available Focus Capacity', value: Math.round(capacity), unit: 'hours/sprint', isPrimary: true },
          { label: 'Overall Nominal Group Hours', value: totalNominal, unit: 'hours' },
          { label: 'Dedicated Overhead / Admin Hours', value: Math.round(adminOverhead), unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'pm-resource-pricing',
    name: 'Resource Planning Calculator',
    slug: 'pm-resource-pricing',
    category: 'project-management',
    description: 'Calculate cost burn rates of full-time vs contracting resources on dynamic roadmaps.',
    formula: 'Cost Monthly = (FTEs * FTE rate + Contractors * Contractor rate)',
    explanation: 'Models payroll benefits, recruiting costs, and tax liabilities of mixed resource templates.',
    example: 'Managing 2 FTE at $5,000/mo and 1 Contractor at $80/hr (160h/mo) totals $22,800 monthly spending.',
    inputs: [
      { id: 'ftes', label: 'Full-time Employees (FTE)', type: 'number', defaultValue: 2, min: 0 },
      { id: 'avgFteSalary', label: 'Avg FTE Annual Salary', type: 'number', defaultValue: 100000, min: 10000, step: 5000, unit: '$/yr' },
      { id: 'contractors', label: 'Contractor Count', type: 'number', defaultValue: 1, min: 0 },
      { id: 'contractorRate', label: 'Avg Contractor Hourly Rate', type: 'number', defaultValue: 75, min: 10, step: 5, unit: '$/hr' }
    ],
    faq: [
      { question: 'What is FTE fringe loading?', answer: 'FTE salaries generally invite a 25-30% loading factor above cash wages to fund health insurance, social taxes, and physical office resources.' }
    ],
    relatedSlugs: ['pm-project-cost', 'dev-software-cost', 'pm-team-capacity'],
    seoTitle: 'FTE and Contractor Delivery Labor Cost Planner',
    seoDescription: 'Plan your blended developer and staff hourly/monthly expenditure.',
    calculate: (inputs) => {
      const fteCount = Number(inputs.ftes || 0);
      const fteSalary = Number(inputs.avgFteSalary || 80000);
      const contrCount = Number(inputs.contractors || 0);
      const contrRate = Number(inputs.contractorRate || 50);
      
      // Fringe load = 25% for full-time employees
      const annualFteCost = fteSalary * 1.25;
      const weeklyFteRate = (annualFteCost / 52) * fteCount;
      
      // Contractor costs assume 40 hours per week
      const weeklyContractorRate = contrRate * 40 * contrCount;
      const combinedWeekly = weeklyFteRate + weeklyContractorRate;
      
      return {
        results: [
          { label: 'Weekly Combined Project Burn-rate', value: Math.round(combinedWeekly), unit: '$/week', isPrimary: true },
          { label: 'Blended Monthly Resource Expense', value: Math.round(combinedWeekly * 4.33), unit: '$/month' },
          { label: 'FTE Annual Loaded Overhead Cost', value: Math.round(annualFteCost * fteCount), unit: '$/year' }
        ]
      };
    }
  },
  {
    id: 'pm-project-risk',
    name: 'Project Risk Analysis Calculator',
    slug: 'pm-project-risk',
    category: 'project-management',
    description: 'Evaluate technical scope, scheduling lag, and financial risks of upcoming projects.',
    formula: 'Risk Score = Average of Likelihood * Severity dimensions',
    explanation: 'Sparsest standard qualitative risk model translating threat points into action steps.',
    example: 'High uncertainty in scope combined with critical budget structures issues a Warning posture.',
    inputs: [
      { id: 'scopeRisk', label: 'Likelihood of Scope Creep', type: 'select', defaultValue: '3', options: [
        { label: 'Low (Fully detailed constraints)', value: '1' },
        { label: 'Medium (A few evolving specifications)', value: '3' },
        { label: 'High (Ill-defined requirements)', value: '5' }
      ]},
      { id: 'relianceRisk', label: 'Third-Party Integration Risk', type: 'select', defaultValue: '3', options: [
        { label: 'Zero external dependencies', value: '1' },
        { label: 'Single stable API', value: '3' },
        { label: 'Multiple changing vendor platforms', value: '5' }
      ]},
      { id: 'staffRisk', label: 'Key-Person Dependency / Sick leave', type: 'select', defaultValue: '3', options: [
        { label: 'Cross-trained staff (No single point)', value: '1' },
        { label: 'One highly specialized lead developer', value: '5' }
      ]}
    ],
    faq: [
      { question: 'What is a Key-Person Risk?', answer: 'The operational hazard where a single team member controls critical architectural concepts, meaning a sick leave or exit halts development.' }
    ],
    relatedSlugs: ['pm-project-timeline', 'pm-project-cost', 'security-risk-compliance'],
    seoTitle: 'SDLC Project Roadmap Threat Risk Calculator',
    seoDescription: 'Assess project planning risks across technical and scope constraints.',
    calculate: (inputs) => {
      const scope = Number(inputs.scopeRisk || 3);
      const reliance = Number(inputs.relianceRisk || 3);
      const staff = Number(inputs.staffRisk || 3);
      
      const score = (scope + reliance + staff) / 3;
      let grading = 'Moderate';
      let recom = 'Continuous testing schedule';
      
      if (score >= 4.0) {
        grading = 'Severe Risk Posture';
        recom = 'Establish rigid scope lock & buffer dates';
      } else if (score <= 1.8) {
        grading = 'Stable';
        recom = 'Proceed with baseline timeline';
      }
      
      return {
        results: [
          { label: 'Calculated Risk Grade Score', value: Number(score.toFixed(1)), unit: '/ 5.0', isPrimary: true },
          { label: 'Identified Project Stability', value: grading },
          { label: 'Strategic Action Advice', value: recom }
        ]
      };
    }
  },
  {
    id: 'pm-project-roi',
    name: 'Project NPV & ROI Calculator',
    slug: 'pm-project-roi',
    category: 'project-management',
    description: 'Calculate returns on capital investment, net payback durations, and long-term asset values.',
    formula: 'ROI = (Projected Income - Investment Cost) / Investment Cost * 100',
    explanation: 'Models standard financial ratios, showing the weeks or years needed to fully recoup upfront labor costs.',
    example: 'An $80,000 corporate software optimization saving $35,000 annually pays for itself in 2.3 years.',
    inputs: [
      { id: 'cost', label: 'Upfront Capital/Labor Cost', type: 'number', defaultValue: 50000, min: 1000, step: 5000, unit: '$' },
      { id: 'savings', label: 'Estimated Annual Cost Savings / Revenue', type: 'number', defaultValue: 24000, min: 1000, step: 1000, unit: '$/year' },
      { id: 'discount', label: 'Cost of Capital Discount Rate', type: 'number', defaultValue: 8, min: 0, max: 30, step: 0.5, unit: '%' }
    ],
    faq: [
      { question: 'What is Discount Rate in project accounting?', answer: 'The annual percentage used to discount future money cash flows, reflecting the time-value of capital (money today is worth more than tomorrow).' }
    ],
    relatedSlugs: ['pm-project-cost', 'pm-agile-sprint', 'dev-software-cost'],
    seoTitle: 'Enterprise IT Software ROI & Payback Calculator',
    seoDescription: 'Structure Net Present Value and find capital payback boundaries on software projects.',
    calculate: (inputs) => {
      const cost = Number(inputs.cost || 10000);
      const savings = Number(inputs.savings || 1000);
      const rate = Number(inputs.discount || 6) / 100;
      
      const roi = cost > 0 ? ((savings * 3 - cost) / cost) * 100 : 0; // 3 year standard evaluation
      const payback = savings > 0 ? cost / savings : 0;
      
      // Calculate NPV for 3 years
      const NPV = -cost + (savings / Math.pow(1 + rate, 1)) + (savings / Math.pow(1 + rate, 2)) + (savings / Math.pow(1 + rate, 3));
      
      return {
        results: [
          { label: '3-Year projected ROI', value: `${Math.round(roi)}%`, isPrimary: true },
          { label: 'Calculated Payback Horizon', value: Number(payback.toFixed(2)), unit: 'years' },
          { label: 'Net Present Value (NPV)', value: Math.round(NPV), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'pm-agile-sprint',
    name: 'Agile Sprint Velocity Calculator',
    slug: 'pm-agile-sprint',
    category: 'project-management',
    description: 'Forecast the number of sprint cycles required to deliver an active task backlog.',
    formula: 'Required Sprints = Total Backlog Points / Team Sprint Velocity',
    explanation: 'Uses historic delivery points per sprint to calculate predictable shipping dates.',
    example: 'A 120 story-point backlog completed by a team averaging 25 points per sprint demands 5 sprints.',
    inputs: [
      { id: 'backlog', label: 'Remaining Backlog complexity', type: 'number', defaultValue: 150, min: 1, unit: 'story points' },
      { id: 'velocity', label: 'Average Team Velocity', type: 'number', defaultValue: 30, min: 1, unit: 'points/sprint' },
      { id: 'weeks', label: 'Standard Sprint Length', type: 'number', defaultValue: 2, min: 1, max: 4, unit: 'weeks' }
    ],
    faq: [
      { question: 'What is Agile Velocity?', answer: 'The average number of database story points fully completed and delivered by a developer scrum team during previous sprint periods.' }
    ],
    relatedSlugs: ['pm-story-points', 'pm-team-capacity', 'project-time-estimate'],
    seoTitle: 'Scrum Agile Sprint Delivery Duration Calculator',
    seoDescription: 'Obtain estimated cycle counts and deliver realistic launch roadmaps using team velocities.',
    calculate: (inputs) => {
      const backlog = Number(inputs.backlog || 100);
      const vel = Number(inputs.velocity || 20);
      const len = Number(inputs.weeks || 2);
      
      const sprints = vel > 0 ? Math.ceil(backlog / vel) : 0;
      const weeks = sprints * len;
      
      return {
        results: [
          { label: 'Required Sprint Cycles', value: sprints, unit: 'sprints', isPrimary: true },
          { label: 'Total Delivery Calendar Timeline', value: weeks, unit: 'weeks' },
          { label: 'Estimated Work Days', value: weeks * 5, unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'pm-story-points',
    name: 'Agile Story Point Calculator',
    slug: 'pm-story-points',
    category: 'project-management',
    description: 'Standardize task estimation using Fibonacci-aligned complexity scales.',
    formula: 'Fibonacci Point Selection = factor(Complexity, Uncertainty, Labor effort)',
    explanation: 'Saves developer teams from false hourly precisions by abstracting efforts into standardized scales.',
    example: 'An API integration featuring high complexity and known specifications maps cleanly as an 8-story point ticket.',
    inputs: [
      { id: 'complex', label: 'Process Complexity Depth', type: 'select', defaultValue: '3', options: [
        { label: 'Low (Simple standard template)', value: '1' },
         { label: 'Medium (A few business logic pivots)', value: '3' },
         { label: 'High (Complex algorithmic structure)', value: '5' }
      ]},
      { id: 'effort', label: 'Required Delivery Hours/Labor', type: 'select', defaultValue: '3', options: [
        { label: 'Minutes to an hour', value: '1' },
        { label: 'A full work day to build', value: '3' },
        { label: 'Multi-day construction', value: '5' }
      ]},
      { id: 'uncertain', label: 'Requirement Clarity Level', type: 'select', defaultValue: '3', options: [
        { label: 'Strictly documented spec', value: '1' },
         { label: 'Some loose API documentation', value: '3' },
         { label: 'Undefined legacy dependency', value: '5' }
      ]}
    ],
    faq: [
      { question: 'Why use Fibonacci scales for task point scoping?', answer: 'The logarithmic distance between higher numbers (8, 13, 21) naturally models the growth of execution uncertainty in larger projects, helping teams flag oversized tickets.' }
    ],
    relatedSlugs: ['pm-agile-sprint', 'pm-team-capacity', 'task-duration'],
    seoTitle: 'Agile story point scoping matrix estimator',
    seoDescription: 'Scrutinize ticket scopes and generate estimated Fibonacci numbers before starting sprints.',
    calculate: (inputs) => {
      const c = Number(inputs.complex || 1);
      const e = Number(inputs.effort || 1);
      const u = Number(inputs.uncertain || 1);
      
      const total = c + e + u;
      
      // Map to Fibonacci numbers: 1, 2, 3, 5, 8, 13, 21
      let points = 1;
      if (total > 12) points = 13;
      else if (total > 9) points = 8;
      else if (total > 6) points = 5;
      else if (total > 4) points = 3;
      else if (total > 2) points = 2;
      
      return {
        results: [
          { label: 'Scrum Story Point Estimate', value: points, unit: 'points', isPrimary: true },
          { label: 'Task Profile Complexity', value: points >= 8 ? 'Epic Candidate - Split Task' : points >= 5 ? 'Standard Sprint Ticket' : 'Quick Task' },
          { label: 'Alignment Uncertainty Index', value: u >= 5 ? 'High (Spec verification required)' : 'Low to Moderate' }
        ]
      };
    }
  },

  // ====================================== SOFTWARE DEVELOPMENT ======================================
  {
    id: 'dev-productivity-index',
    name: 'Developer Productivity Index Calculator',
    slug: 'dev-productivity-index',
    category: 'programming',
    description: 'Calculate developer output and support code health vectors.',
    formula: 'Index = (PRs * 15 + Commits * 2 + Reviews * 8) * (1 - Defect Rate)',
    explanation: 'Integrates PR delivery, quality, and peer code audit values into performance scores.',
    example: 'Merging 4 peer-audited pull requests and reviewing 5 peer branches while keeping defect rates low scores top scores.',
    inputs: [
      { id: 'prs', label: 'Merged Pull Requests Monthly', type: 'number', defaultValue: 6, min: 0 },
      { id: 'reviews', label: 'Code Reviews Conducted', type: 'number', defaultValue: 10, min: 0 },
      { id: 'bugs', label: 'QA Regression Backlogs Triggered', type: 'number', defaultValue: 2, min: 0 }
    ],
    faq: [
      { question: 'Why does defect volume penalize productivity?', answer: 'Delivering buggy features requires complex downstream remediation and testing cycles, adding significant delay to overall deployment cycles.' }
    ],
    relatedSlugs: ['dev-code-maintenance', 'dev-technical-debt', 'productivity-score'],
    seoTitle: 'Software Engineer Operational Productivity & Support Calculator',
    seoDescription: 'Obtain team contribution scores including QA feedback levels.',
    calculate: (inputs) => {
      const prs = Number(inputs.prs || 0);
      const reviews = Number(inputs.reviews || 0);
      const bugs = Number(inputs.bugs || 0);
      
      const points = (prs * 20) + (reviews * 5);
      const defectLossPct = Math.min(0.8, bugs * 0.12);
      const finalScore = points * (1 - defectLossPct);
      
      return {
        results: [
          { label: 'Engineering Output Rating', value: Math.round(finalScore), unit: 'points', isPrimary: true },
          { label: 'Averaged Core Defect Drawdown', value: `${Math.round(defectLossPct * 100)}%`, unit: 'reduction' },
          { label: 'Workforce Profile Tier', value: finalScore > 100 ? 'Architectural Core' : finalScore > 40 ? 'Effective Team Member' : 'Initiate status' }
        ]
      };
    }
  },
  {
    id: 'dev-time-estimator',
    name: 'Software Development Time Calculator',
    slug: 'dev-time-estimator',
    category: 'programming',
    description: 'Estimate engineering timelines needed to develop applications based on screens and APIs.',
    formula: 'Hours = (Screens * screen_weight + APIs * api_weight) * Complexity factor',
    explanation: 'Sparsest parametric model to estimate standard full-stack development and testing schedules.',
    example: 'Erecting 5 web screens connected to 4 backend endpoints with basic OAuth scales out as roughly 154 hours.',
    inputs: [
      { id: 'screens', label: 'Custom UI Screens / Pages Count', type: 'number', defaultValue: 6, min: 1 },
      { id: 'apis', label: 'Required API Resource Endpoints', type: 'number', defaultValue: 8, min: 1 },
      { id: 'complexity', label: 'Core Technical Complexity', type: 'select', defaultValue: '1.2', options: [
        { label: 'Basic Static Template (0.8x spacing)', value: '0.8' },
        { label: 'Standard Database Web App (1.2x spacing)', value: '1.2' },
        { label: 'Complex Crypto/AI Orchestrator (1.8x spacing)', value: '1.8' }
      ]}
    ],
    faq: [
      { question: 'Does time include testing and QA setup?', answer: 'Yes, standard software estimations allocate roughly 20% of their total code timeline specifically to integration testing, unit mocks, and visual QA passes.' }
    ],
    relatedSlugs: ['dev-software-cost', 'project-time-estimate', 'task-duration'],
    seoTitle: 'Full-Stack Software Development Time Estimator',
    seoDescription: 'Determine development schedules required to build portals, apps, and backend APIs.',
    calculate: (inputs) => {
      const screens = Number(inputs.screens || 1);
      const apis = Number(inputs.apis || 1);
      const mult = Number(inputs.complexity || 1.2);
      
      // Average 18 hours per custom responsive screen & 12 hours per API endpoint route
      const rawHours = (screens * 18 + apis * 12) * mult;
      const qaHours = rawHours * 0.25;
      const totalHours = rawHours + qaHours;
      
      return {
        results: [
          { label: 'Projected Total Engineering Hours', value: Math.round(totalHours), unit: 'hours', isPrimary: true },
          { label: 'Focus Development Phase', value: Math.round(rawHours), unit: 'hours' },
          { label: 'Validation / Testing / QA Support', value: Math.round(qaHours), unit: 'hours' },
          { label: 'Calendar Weeks (1 Developer @ 30h/wk)', value: Number((totalHours / 30).toFixed(1)), unit: 'weeks' }
        ]
      };
    }
  },
  {
    id: 'dev-software-cost',
    name: 'Software Cost Calculator',
    slug: 'dev-software-cost',
    category: 'programming',
    description: 'Calculate the total budget needed to build software, factoring in staff pay and licensing fees.',
    formula: 'Total Cost = (Developer Count * Monthly Rate * Project Months) + Licensing Fees',
    explanation: 'Models salary expenditures alongside annual server and hosting fees to estimate complete lifecycles before coding starts.',
    example: 'Operating 2 developers at $65/hr over 3 months combined with $2,000 in operational licenses totals $64,400.',
    inputs: [
      { id: 'devs', label: 'Core Software Developers Count', type: 'number', defaultValue: 2, min: 1 },
      { id: 'rate', label: 'Average Hourly Billing Rate', type: 'number', defaultValue: 65, min: 10, step: 5, unit: '$/hr' },
      { id: 'months', label: 'Development Timeline', type: 'number', defaultValue: 3, min: 1, unit: 'months' },
      { id: 'licensing', label: 'Infrastructure & Tooling Licenses', type: 'number', defaultValue: 1500, min: 0, step: 100, unit: '$/yr' }
    ],
    faq: [
      { question: 'What is developer burdening?', answer: 'Infrastructure support, hardware licensing (GitHub, Slack, Jira), and operational software access adds around $1,500/year to active headcount cost structures.' }
    ],
    relatedSlugs: ['dev-time-estimator', 'pm-project-roi', 'pm-resource-pricing'],
    seoTitle: 'Custom Software Solution Development Cost Estimator',
    seoDescription: 'Obtain estimated software design budgets using headcount rates.',
    calculate: (inputs) => {
      const devs = Number(inputs.devs || 1);
      const rate = Number(inputs.rate || 50);
      const months = Number(inputs.months || 1);
      const licensing = Number(inputs.licensing || 0);
      
      const monHours = 152; // Standard 35-hour work week monthly average
      const laborCost = devs * rate * monHours * months;
      const total = laborCost + licensing;
      
      return {
        results: [
          { label: 'Overall Development Cost', value: `$${Math.round(total).toLocaleString()}`, isPrimary: true },
          { label: 'Staffing Payroll Expenses', value: `$${Math.round(laborCost).toLocaleString()}` },
          { label: 'Annual Licensing & Tooling Costs', value: `$${licensing.toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'dev-code-maintenance',
    name: 'Code Maintenance & Health Calculator',
    slug: 'dev-code-maintenance',
    category: 'programming',
    description: 'Estimate code debt growth and check the hours needed to maintain software quality.',
    formula: 'Maintenance monthly hrs = Codebase Size * Complexity Factor * (2 - Test Coverage %)',
    explanation: 'Uses cyclomatic complex variables and automated code test coverage ratios to predict software deprecation risks.',
    example: 'A 50,000 LOC project featuring 40% test coverage with complex branches demands 19.5 hours of monthly maintenance.',
    inputs: [
      { id: 'loc', label: 'Lines of Code (LOC) in Repo', type: 'number', defaultValue: 25000, min: 100, step: 5000 },
      { id: 'coverage', label: 'Automated Test Core Coverage', type: 'number', defaultValue: 70, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'complexity', label: 'Cyclomatic Class Complexity', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Low (Clean separation of components)', value: '1.0' },
        { label: 'Moderate (Standard legacy dependencies)', value: '1.4' },
        { label: 'High (Monolith spaghetti code)', value: '2.2' }
      ]}
    ],
    faq: [
      { question: 'What is Cyclomatic Complexity?', answer: 'The count of independent paths through code loops. Higher counts indicate nested condition blocks, which are difficult to test and maintain safely.' }
    ],
    relatedSlugs: ['dev-technical-debt', 'dev-productivity-index', 'dev-time-estimator'],
    seoTitle: 'Codebase Refactoring & Software Health Calculator',
    seoDescription: 'Obtain codebase health grades and project the resource hours needed to maintain code quality.',
    calculate: (inputs) => {
      const loc = Number(inputs.loc || 1000);
      const coverage = Number(inputs.coverage || 50) / 100;
      const compMult = Number(inputs.complexity || 1.4);
      
      // Base assumption: 10,000 LOC of clean code requires 2 hours of refactoring monthly
      const baseHours = (loc / 10000) * 2;
      const coverageBonusFactor = 2.0 - coverage; // 100% coverage = 1.0x hours, 0% coverage = 2.0x hours
      const maintenanceHours = baseHours * compMult * coverageBonusFactor;
      
      const healthPct = Math.max(10, Math.min(100, Math.round((coverage * 60) + (100 / compMult) * 0.4)));
      
      return {
        results: [
          { label: 'Monthly Refactoring Timeline', value: Number(maintenanceHours.toFixed(1)), unit: 'hours/month', isPrimary: true },
          { label: 'Overall Repository Health Grade', value: `${healthPct}%` },
          { label: 'Technical Quality Classification', value: healthPct > 80 ? 'Highly Maintainable' : healthPct > 55 ? 'Standard Operations' : 'Technical Debt Alert' }
        ]
      };
    }
  },
  {
    id: 'dev-technical-debt',
    name: 'Technical Debt Interest Calculator',
    slug: 'dev-technical-debt',
    category: 'programming',
    description: 'Calculate technical debt interest costs and find timelines to fix code problems.',
    formula: 'Tech Debt Interest Cost = Annual developer hours resolving bugs * Blended rate',
    explanation: 'Ratios project code correction delays, showing how poor design acts like high-interest commercial debt.',
    example: 'Wasting 6 development hours weekly fixing bugs on poor legacy systems costs $23,400 per engineer annually.',
    inputs: [
      { id: 'wastedHours', label: 'Weekly Hours Lost to Legacy Bugs', type: 'number', defaultValue: 5, min: 0, max: 40, unit: 'hrs/dev' },
      { id: 'devsCount', label: 'Impacted Team Members Count', type: 'number', defaultValue: 3, min: 1 },
      { id: 'rate', label: 'Blended Engineering Day Rate', type: 'number', defaultValue: 65, min: 10, step: 5, unit: '$/hr' }
    ],
    faq: [
      { question: 'What is Technical Debt?', answer: 'The long-term cost of choosing quick, messy code workarounds over solid architectural design. It speeds up shipping today but slows down all future feature work.' }
    ],
    relatedSlugs: ['dev-code-maintenance', 'dev-software-cost', 'dev-productivity-index'],
    seoTitle: 'Legacy Agile Technical Debt Cost Calculator',
    seoDescription: 'Benchmark the annual cash cost of fixing poor code compared to proactive refactoring.',
    calculate: (inputs) => {
      const hours = Number(inputs.wastedHours || 0);
      const devs = Number(inputs.devsCount || 1);
      const rate = Number(inputs.rate || 50);
      
      const weeklyCombinedHours = hours * devs;
      const annualWastedHours = weeklyCombinedHours * 52;
      const annualCost = annualWastedHours * rate;
      
      return {
        results: [
          { label: 'Annual Technical Debt Costs', value: `$${Math.round(annualCost).toLocaleString()}`, isPrimary: true },
          { label: 'Weekly Team Hours Lost', value: weeklyCombinedHours, unit: 'hours' },
          { label: 'Monthly Engineering Loss', value: `$${Math.round(annualCost / 12).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'dev-api-cost',
    name: 'API Cloud Fee & Bandwidth Calculator',
    slug: 'dev-api-cost',
    category: 'programming',
    description: 'Calculate monthly external API transaction fees and total bandwidth required.',
    formula: 'Cost = Daily Calls * (Price / 1000) * 30.5',
    explanation: 'Estimates outbound network traffic and cloud cost scalability relative to app user growth.',
    example: 'A database scaling to 15,000 daily user sessions requesting 8 API payloads daily generates $2,250 in API costs.',
    inputs: [
      { id: 'calls', label: 'Projected Daily API Calls', type: 'number', defaultValue: 10000, min: 100, step: 500 },
      { id: 'unitPrice', label: 'API Base Cost per 1k Calls', type: 'number', defaultValue: 0.15, min: 0.00, step: 0.01, unit: '$' },
      { id: 'kbPerCall', label: 'Averaged Packet Payload Size', type: 'number', defaultValue: 40, min: 1, step: 5, unit: 'KB' }
    ],
    faq: [
      { question: 'Why plan API packet payload sizes?', answer: 'Large JSON transfers or image buffers quickly build up massive internet egress fees when scaling systems to millions of user sessions.' }
    ],
    relatedSlugs: ['dev-scaling-calculator', 'dev-server-requirement', 'database-storage-dev'],
    seoTitle: 'Cloud API Cost & Egress Bandwidth Traffic Calculator',
    seoDescription: 'Obtain estimated cloud hosting, API transaction, and data storage costs.',
    calculate: (inputs) => {
      const calls = Number(inputs.calls || 1000);
      const price = Number(inputs.unitPrice || 0.10);
      const kb = Number(inputs.kbPerCall || 10);
      
      const monthlyCalls = calls * 30.42;
      const monCost = (monthlyCalls / 1000) * price;
      
      const dailyBytes = calls * kb * 1024;
      const monthlyBytes = dailyBytes * 30.42;
      const monthlyGB = monthlyBytes / (1024 * 1024 * 1024);
      
      return {
        results: [
          { label: 'Monthly Transaction Fees', value: `$${Number(monCost.toFixed(2))}`, isPrimary: true },
          { label: 'Forecasted Monthly Bandwidth', value: Number(monthlyGB.toFixed(2)), unit: 'GB' },
          { label: 'Annual Contract Valuation Projection', value: `$${Math.round(monCost * 12).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'database-storage-dev',
    name: 'Database Storage Calculator',
    slug: 'database-storage-dev',
    category: 'programming',
    description: 'Calculate database size growth from custom user activities and retention windows.',
    formula: 'Growth MB/month = Monthly Users * Records per User * Record size in bytes / 1,000,000',
    explanation: 'Integrates indexes and binary media assets to forecast database disk scaling.',
    example: '10,000 active users logging 20 chat messages monthly requires 1.2 GB of disk growth step-offsets.',
    inputs: [
      { id: 'activeUsers', label: 'Average Active Monthly Users', type: 'number', defaultValue: 5000, min: 100, step: 500 },
      { id: 'recordsPerMonth', label: 'Avg Records Created per User', type: 'number', defaultValue: 30, min: 1, step: 5, unit: '/month' },
      { id: 'recSizeBytes', label: 'Average Database Record Size', type: 'number', defaultValue: 1540, min: 50, step: 100, unit: 'bytes' }
    ],
    faq: [
      { question: 'What is typical database record size?', answer: 'Standard contact records require 500B-1KB. Complex JSON data with deep metadata logs grows quickly to 2KB-5KB per database line.' }
    ],
    relatedSlugs: ['dev-api-cost', 'dev-scaling-calculator', 'backup-storage'],
    seoTitle: 'NoSQL & Relational Database Disk Storage Growth Calculator',
    seoDescription: 'Model long-term database storage growth to prevent disc capacity warnings.',
    calculate: (inputs) => {
      const users = Number(inputs.activeUsers || 1000);
      const recs = Number(inputs.recordsPerMonth || 10);
      const size = Number(inputs.recSizeBytes || 500);
      
      const monBytes = users * recs * size;
      const pctOverheadingMultiplier = 1.35; // DB index & log padding overhead
      const realMonBytes = monBytes * pctOverheadingMultiplier;
      
      const monMb = realMonBytes / (1024 * 1024);
      const yrGb = (monMb * 12) / 1024;
      
      return {
        results: [
          { label: 'Estimated Monthly DB Growth', value: Number(monMb.toFixed(1)), unit: 'MB / month', isPrimary: true },
          { label: 'Projected Annual Disk Sizing', value: Number(yrGb.toFixed(2)), unit: 'GB / year' },
          { label: 'Database indexing footprint built-in', value: '35% padding included' }
        ]
      };
    }
  },
  {
    id: 'dev-server-requirement',
    name: 'Server RAM & vCPU Calculator',
    slug: 'dev-server-requirement',
    category: 'programming',
    description: 'Calculate server RAM and cpu counts needed to process peak concurrent web traffic.',
    formula: 'RAM Required = OS Baseline + (Concurrent Requests * App Memory Thread overhead)',
    explanation: 'Matches virtual machine processing cores with peak connection volumes to prevent server crashes.',
    example: 'Managing 1,000 peak concurrent threads on 15 MB endpoints requires 16 GB of memory and 4 cores.',
    inputs: [
      { id: 'peakConcurrent', label: 'Peak Concurrent Connections', type: 'number', defaultValue: 500, min: 10, step: 50 },
      { id: 'reqFootprint', label: 'Memory Footprint per Request', type: 'number', defaultValue: 16, min: 1, max: 128, unit: 'MB' },
      { id: 'vCpus', label: 'Nominal VM Base RAM Pool', type: 'number', defaultValue: 2, min: 1, max: 64, unit: 'GB' }
    ],
    faq: [
      { question: 'Why does memory scale per concurrent connection?', answer: 'In thread-based web servers, every socket connection requires its own processing thread, consuming sandboxed physical server RAM.' }
    ],
    relatedSlugs: ['dev-scaling-calculator', 'dev-api-cost', 'bandwidth-utilization-web'],
    seoTitle: 'Dynamic Host Server RAM & vCPU Core Scale Calculator',
    seoDescription: 'Size computing instances needed to support high-density concurrent transaction baselines.',
    calculate: (inputs) => {
      const concurrent = Number(inputs.peakConcurrent || 100);
      const footprint = Number(inputs.reqFootprint || 8);
      const baseRam = Number(inputs.vCpus || 2);
      
      const requestRAM = (concurrent * footprint) / 1024; // GB
      const osRAM = 1.5; // OS baseline operations
      const totalRecommendedRamGb = osRAM + requestRAM;
      
      // Compute standard required vCPUs: ~250 concurrent requests per single core rule-of-thumb
      const cores = Math.max(1, Math.ceil(concurrent / 250));
      
      return {
        results: [
          { label: 'Minimum Recommended Server RAM', value: Number(totalRecommendedRamGb.toFixed(1)), unit: 'GB RAM', isPrimary: true },
          { label: 'Required Virtual Cores (vCPUs)', value: cores, unit: 'cores' },
          { label: 'Active request memory overhead', value: Number(requestRAM.toFixed(1)), unit: 'GB' }
        ]
      };
    }
  },
  {
    id: 'dev-scaling-calculator',
    name: 'Cloud Scaling Cost Calculator',
    slug: 'dev-scaling-calculator',
    category: 'programming',
    description: 'Forecast hosting cost increases as your application traffic scales up.',
    formula: 'Scaled Cost = Current Cost * Scaling Step Multiplier ^ Overhead friction',
    explanation: 'Calculates the real cost efficiency of server architectures under sudden traffic surges.',
    example: 'With a 10x traffic spike on standard multi-instance setups, costs typically scale up by 8.5x.',
    inputs: [
      { id: 'currentCost', label: 'Current Base Cloud Costs', type: 'number', defaultValue: 150, min: 5, step: 10, unit: '$/mo' },
      { id: 'trafficScale', label: 'Expected Traffic Growth', type: 'number', defaultValue: 5, min: 1.1, max: 100, step: 0.1, unit: 'x scale' },
      { id: 'architecture', label: 'Scaling Architecture Type', type: 'select', defaultValue: 'containers', options: [
        { label: 'Serverless Functions (High cost per call)', value: 'serverless' },
        { label: 'Auto-scaling Container Clusters (Highly modern)', value: 'containers' },
        { label: 'Dedicated Fixed Servers (Spit setups)', value: 'fixed' }
      ]}
    ],
    faq: [
      { question: 'Why isn\'t cloud scaling linear?', answer: 'Container auto-scaling provides better cost breaks at scale, while serverless payment structures charge direct premiums for sudden traffic spikes.' }
    ],
    relatedSlugs: ['dev-api-cost', 'dev-server-requirement', 'database-storage-dev'],
    seoTitle: 'Scalable Cloud Computing & Hosting Price Estimator',
    seoDescription: 'Model your next system traffic surge and estimate infrastructure expenditures online.',
    calculate: (inputs) => {
      const base = Number(inputs.currentCost || 50);
      const scale = Number(inputs.trafficScale || 2);
      const arch = String(inputs.architecture || 'containers');
      
      let scalingEfficiencyFactor = 0.95; // Containers save some efficiency overhead
      if (arch === 'serverless') scalingEfficiencyFactor = 1.10; // Serverless is premium
      else if (arch === 'fixed') scalingEfficiencyFactor = 0.70; // Hard sizing wastes unutilized limits
      
      const finalCost = base * Math.pow(scale, scalingEfficiencyFactor);
      const efficiencyRank = Math.round((1 - (scalingEfficiencyFactor - 0.70)) * 100);
      
      return {
        results: [
          { label: 'Projected Scaled Cloud Costs', value: `$${Math.round(finalCost).toLocaleString()}`, isPrimary: true },
          { label: 'Monthly Cost Delta Increment', value: `$${Math.round(finalCost - base).toLocaleString()}` },
          { label: 'Architecture Scaling Score', value: `${efficiencyRank}%` }
        ]
      };
    }
  },

  // ====================================== DATA SCIENCE ======================================
  {
    id: 'ds-sample-size',
    name: 'Sample Size Calculator',
    slug: 'ds-sample-size',
    category: 'data-science',
    description: 'Calculate the static survey sample sizes required to reach specific research confidence limits.',
    formula: 'n = [Z^2 * p * (1-p) / e^2] / [1 + (Z^2 * p * (1-p) / (e^2 * N))]',
    explanation: 'Uses Cochran margin of error equations to establish statistically robust sample counts.',
    example: 'Reaching 95% confidence on a 100,000 population with 5% margin of error requires 383 survey samples.',
    inputs: [
      { id: 'pop', label: 'Overall Target Population (N)', type: 'number', defaultValue: 10000, min: 10, step: 100 },
      { id: 'conf', label: 'Statistical Confidence Level', type: 'select', defaultValue: '1.96', options: [
        { label: '90% Confidence (Z = 1.645)', value: '1.645' },
        { label: '95% Confidence (Z = 1.96)', value: '1.96' },
        { label: '99% Confidence (Z = 2.576)', value: '2.576' }
      ]},
      { id: 'err', label: 'Acceptable Margin of Error', type: 'number', defaultValue: 5, min: 1, max: 20, step: 0.5, unit: '%' }
    ],
    faq: [
      { question: 'Why is standard distribution assumed at p = 50%?', answer: 'Establishing a population baseline split at exactly 50% represents the maximum possible variance, guaranteeing that your calculated sample size is safe and robust.' }
    ],
    relatedSlugs: ['ds-data-cleaning', 'ds-dataset-size', 'research-data-analysis'],
    seoTitle: 'Survey Sample Size Cochran Formula Calculator',
    seoDescription: 'Obtain required survey responder limits using standard population margins.',
    calculate: (inputs) => {
      const N = Number(inputs.pop || 10000);
      const z = Number(inputs.conf || 1.96);
      const e = Number(inputs.err || 5) / 100;
      
      const p = 0.5; // Maximum variability assumption
      
      // Infinite population formula
      const n0 = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
      
      // Adjusted for finite population
      const n = n0 / (1 + (n0 - 1) / N);
      
      return {
        results: [
          { label: 'Minimum Required Sample Size', value: Math.ceil(n), unit: 'respondents', isPrimary: true },
          { label: 'Cochran Value Target', value: Math.round(n0) },
          { label: 'Relative Sample Ratio', value: Number(((n / N) * 100).toFixed(2)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'ds-data-cleaning',
    name: 'Data Cleaning & Purge Calculator',
    slug: 'ds-data-cleaning',
    category: 'data-science',
    description: 'Calculate dataset records usability and find rows lost to null or duplicate fields.',
    formula: 'Cleaned Rows = Total Rows * (1 - Null %) * (1 - Duplicate %)',
    explanation: 'Ratios dataset lines remaining after clearing database blanks, null values, and redundant elements.',
    example: 'Spanning a 100,000-line table featuring 8% null cells and 12% duplicate blocks leaves 81,000 usable lines.',
    inputs: [
      { id: 'rows', label: 'Dataset Unprocessed Rows', type: 'number', defaultValue: 50000, min: 10 },
      { id: 'nulls', label: 'Detected Null / Blank Rows', type: 'number', defaultValue: 7.5, min: 0, max: 90, step: 0.5, unit: '%' },
      { id: 'dupes', label: 'Identified Duplicate Rows', type: 'number', defaultValue: 4.8, min: 0, max: 90, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'Why purge duplicates before model training?', answer: 'Submitting duplicate rows heavily skews sample distributions, leading to overfitting and poor prediction accuracy in new datasets.' }
    ],
    relatedSlugs: ['ds-dataset-size', 'ds-prediction-accuracy', 'ds-sample-size'],
    seoTitle: 'Data Cleaning Usability & Purge Rate Calculator',
    seoDescription: 'Verify total pristine database rows remaining after removing nulls and duplicate rows.',
    calculate: (inputs) => {
      const rows = Number(inputs.rows || 1000);
      const nulls = Number(inputs.nulls || 0) / 100;
      const dupes = Number(inputs.dupes || 0) / 100;
      
      const afterNulls = rows * (1 - nulls);
      const finalCleaned = afterNulls * (1 - dupes);
      const valuesPurged = rows - finalCleaned;
      
      return {
        results: [
          { label: 'Cleaned Usable Record Count', value: Math.round(finalCleaned), unit: 'rows', isPrimary: true },
          { label: 'Purged Loss Record Count', value: Math.round(valuesPurged), unit: 'rows' },
          { label: 'Dataset Usable Yield Pct', value: Number(((finalCleaned / rows) * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'ds-dataset-size',
    name: 'Dataset Disk Sizing Calculator',
    slug: 'ds-dataset-size',
    category: 'data-science',
    description: 'Calculate uncompressed disk memory required to store CSV, JSON, or SQL datasets.',
    formula: 'Storage = Rows * Columns * byte weight per cell',
    explanation: 'Models uncompressed storage demands across standard cell structures to help scale storage budgets.',
    example: 'A dataset with 1,000,000 rows and 15 numeric columns consumes approximately 114 MB of storage.',
    inputs: [
      { id: 'rowsCount', label: 'Overall Dataset Rows Count', type: 'number', defaultValue: 1000000, min: 1000, step: 50000 },
      { id: 'columnsCount', label: 'Featured Columns Count', type: 'number', defaultValue: 12, min: 1 },
      { id: 'density', label: 'Columns Data Type Mix', type: 'select', defaultValue: 'numeric', options: [
        { label: 'Pure Integers (8 bytes per coordinate)', value: '8' },
        { label: 'Mixed Decimals (12 bytes per coordinate)', value: '12' },
        { label: 'High-density string texts (32 bytes per coordinate)', value: '32' }
      ]}
    ],
    faq: [
      { question: 'Why does CSV storage differ from RAM storage?', answer: 'CSV stores data as plain text strings, whereas analytical in-memory engines compress cells into highly optimized binary blocks.' }
    ],
    relatedSlugs: ['database-storage-dev', 'ds-data-cleaning', 'backup-storage'],
    seoTitle: 'Database Memory & Dataset Disk Sizing Calculator',
    seoDescription: 'Obtain uncompressed spreadsheet and dataframe size predictions based on column widths.',
    calculate: (inputs) => {
      const rows = Number(inputs.rowsCount || 10000);
      const cols = Number(inputs.columnsCount || 5);
      const width = Number(inputs.density || 8);
      
      const bytes = rows * cols * width;
      const mb = bytes / (1024 * 1024);
      const gb = mb / 1024;
      
      return {
        results: [
          { label: 'Expected Uncompressed Disk Size', value: gb >= 1 ? Number(gb.toFixed(2)) : Number(mb.toFixed(1)), unit: gb >= 1 ? 'GB' : 'MB', isPrimary: true },
          { label: 'Overall Data Cells Count', value: (rows * cols).toExponential(2), unit: 'coordinates' },
          { label: 'Post-GZIP Storage Approximation', value: gb >= 1 ? Number((gb * 0.25).toFixed(2)) : Number((mb * 0.25).toFixed(1)), unit: gb >= 1 ? 'GB' : 'MB' }
        ]
      };
    }
  },
  {
    id: 'ds-model-accuracy',
    name: 'ML Confusion Matrix Calculator',
    slug: 'ds-model-accuracy',
    category: 'data-science',
    description: 'Process raw binary classifiers to extract F1 Score, precision, recall, and accuracy ratings.',
    formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
    explanation: 'Transforms classifications into evaluation metrics to rate predictive performance.',
    example: 'A model logging 80 TP, 10 FP, 5 FN, and 205 TN yields an overall classification accuracy of 85.07%.',
    inputs: [
      { id: 'tp', label: 'True Positives (TP)', type: 'number', defaultValue: 120, min: 0 },
      { id: 'tn', label: 'True Negatives (TN)', type: 'number', defaultValue: 340, min: 0 },
      { id: 'fp', label: 'False Positives (FP)', type: 'number', defaultValue: 15, min: 0 },
      { id: 'fn', label: 'False Negatives (FN)', type: 'number', defaultValue: 25, min: 0 }
    ],
    faq: [
      { question: 'When is F1 Score better than Accuracy?', answer: 'For highly imbalanced datasets (e.g. fraud detection where only 1% of transactions are fraudulent), standard accuracy is misleading. F1 Score links precision and recall to show true utility.' }
    ],
    relatedSlugs: ['ds-precision-recall', 'ds-error-rate', 'ds-prediction-accuracy'],
    seoTitle: 'Binary Classifier Accuracy & F1 Score Calculator',
    seoDescription: 'Obtain ML precision, recall, accuracy, and F1 calculations from raw confusion matrix parameters.',
    calculate: (inputs) => {
      const tp = Number(inputs.tp || 0);
      const tn = Number(inputs.tn || 0);
      const fp = Number(inputs.fp || 0);
      const fn = Number(inputs.fn || 0);
      
      const total = tp + tn + fp + fn;
      
      const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;
      const precision = (tp + fp) > 0 ? (tp / (tp + fp)) * 100 : 0;
      const recall = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 0;
      
      const pRatio = precision / 100;
      const rRatio = recall / 100;
      const f1 = (pRatio + rRatio) > 0 ? 2 * ((pRatio * rRatio) / (pRatio + rRatio)) * 100 : 0;
      
      return {
        results: [
          { label: 'Overall Forecast Accuracy', value: `${accuracy.toFixed(1)}%`, isPrimary: true },
          { label: 'Calculated F1 Score', value: `${f1.toFixed(1)}%` },
          { label: 'Model Precision Rate', value: `${precision.toFixed(1)}%` },
          { label: 'Model Recall Sensitivity', value: `${recall.toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'ds-precision-recall',
    name: 'Precision & Recall Calculator',
    slug: 'ds-precision-recall',
    category: 'data-science',
    description: 'Calculate ML precision, recall rates, and F-beta ratings from classifier statistics.',
    formula: 'Precision = TP / (TP + FP); Recall = TP / (TP + FN)',
    explanation: 'Measures class-specific error rates to optimize decision thresholds and minimize false-positive risk.',
    example: 'A spam filter capturing 90 real spams (TP) but flagging 10 clean emails as spam (FP) has a 90% precision rate.',
    inputs: [
      { id: 'tp', label: 'True Positives (TP)', type: 'number', defaultValue: 90, min: 0 },
      { id: 'fp', label: 'False Positives (FP)', type: 'number', defaultValue: 10, min: 0 },
      { id: 'fn', label: 'False Negatives (FN)', type: 'number', defaultValue: 15, min: 0 }
    ],
    faq: [
      { question: 'What is precision?', answer: 'The share of positive predictions that are actually correct, reflecting the filter\'s ability to avoid marking clean entries as positive.' }
    ],
    relatedSlugs: ['ds-model-accuracy', 'ds-error-rate', 'ds-prediction-accuracy'],
    seoTitle: 'Precision and Recall Metric Evaluation Calculator',
    seoDescription: 'Evaluate classification scores and find optimal precision ratios online.',
    calculate: (inputs) => {
      const tp = Number(inputs.tp || 0);
      const fp = Number(inputs.fp || 0);
      const fn = Number(inputs.fn || 0);
      
      const prec = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
      const rec = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
      const recallUnit = rec / 100;
      const precUnit = prec / 100;
      const f1 = (precUnit + recallUnit) > 0 ? 2 * (precUnit * recallUnit) / (precUnit + recallUnit) * 100 : 0;
      
      return {
        results: [
          { label: 'Precision (Correct Positives Ratio)', value: `${prec.toFixed(1)}%`, isPrimary: true },
          { label: 'Recall (Coverage Sensitivity Ratio)', value: `${rec.toFixed(1)}%` },
          { label: 'Calculated F1 Metric Score', value: `${f1.toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'ds-error-rate',
    name: 'Statistical Prediction Error Rate Calculator',
    slug: 'ds-error-rate',
    category: 'data-science',
    description: 'Calculate overall statistical prediction error rates and evaluate classifier quality gaps.',
    formula: 'Error Rate = (FP + FN) / Overall Predictions * 100',
    explanation: 'Formulates basic error rates to balance performance evaluation models.',
    example: 'Misfitting 15 items out of 150 evaluations represents a 10.0% prediction error.',
    inputs: [
      { id: 'mis', label: 'Incorrect Predictions Count', type: 'number', defaultValue: 15, min: 0 },
      { id: 'total', label: 'Total Completed Predictions', type: 'number', defaultValue: 150, min: 1 }
    ],
    faq: [
      { question: 'Why track prediction error rate?', answer: 'It is the simplest baseline metric of classifier performance, serving as a clean starting point for model validation.' }
    ],
    relatedSlugs: ['ds-model-accuracy', 'ds-precision-recall', 'ds-prediction-accuracy'],
    seoTitle: 'Statistical error pace evaluation calculator',
    seoDescription: 'Obtain average prediction error rates and check classifier quality gaps.',
    calculate: (inputs) => {
      const mis = Number(inputs.mis || 0);
      const tot = Number(inputs.total || 1);
      
      const rate = (mis / tot) * 100;
      const accuracy = 100 - rate;
      
      return {
        results: [
          { label: 'Prediction Error Rate', value: `${rate.toFixed(1)}%`, isPrimary: true },
          { label: 'Relative Solution Accuracy', value: `${accuracy.toFixed(1)}%` },
          { label: 'Successful Predictions Count', value: Math.max(0, tot - mis), unit: 'predictions' }
        ]
      };
    }
  },
  {
    id: 'ds-prediction-accuracy',
    name: 'Regression Error Calculator (MSE/MAPE)',
    slug: 'ds-prediction-accuracy',
    category: 'data-science',
    description: 'Calculate regression error metrics, Mean Absolute Percentage Error (MAPE), and tracking indexes.',
    formula: 'MAPE = Average(|Observed - Predicted| / Observed) * 100',
    explanation: 'Evaluates numeric regression accuracy to benchmark pricing, market growth, and energy forecasting models.',
    example: 'Predicting a physical value at 120 against an observed target of 115 introduces a 4.35% error rate.',
    inputs: [
      { id: 'obs', label: 'Observed Real-world Value', type: 'number', defaultValue: 115, min: 1 },
      { id: 'pred', label: 'Predicted Model Forecast Value', type: 'number', defaultValue: 121, min: 1 }
    ],
    faq: [
      { question: 'What does MAPE represent?', answer: 'Mean Absolute Percentage Error describes the average size of forecast errors as percentage deviations, helping stakeholders easily gauge model performance.' }
    ],
    relatedSlugs: ['ds-model-accuracy', 'ds-error-rate', 'ds-precision-recall'],
    seoTitle: 'Regression MAPE & MSE Model Error Calculator',
    seoDescription: 'Evaluate continuous dataset errors and calculate prediction deviations online.',
    calculate: (inputs) => {
      const obs = Number(inputs.obs || 100);
      const pred = Number(inputs.pred || 100);
      
      const diff = Math.abs(obs - pred);
      const mse = Math.pow(diff, 2);
      const mape = (diff / obs) * 100;
      
      return {
        results: [
          { label: 'Absolute Percentage Error (APE)', value: `${mape.toFixed(2)}%`, isPrimary: true },
          { label: 'Squared Error Value (SE)', value: Number(mse.toFixed(1)) },
          { label: 'Raw Prediction Deviation', value: Number((pred - obs).toFixed(1)), unit: 'units' }
        ]
      };
    }
  },
  {
    id: 'ds-data-growth',
    name: 'Data Growth & Scale Calculator',
    slug: 'ds-data-growth',
    category: 'data-science',
    description: 'Calculate compounding dataset expansion rates over custom operational timelines.',
    formula: 'Final Size = Initial Size * (1 + Growth % / 100) ^ Months',
    explanation: 'Models exponential data storage growth scales to prevent server and database capacity warnings.',
    example: 'Growing a 50 GB dataset by 10% monthly fills exactly 159.4 GB of disk space in 1 year.',
    inputs: [
      { id: 'initial', label: 'Starting Data Volume Size', type: 'number', defaultValue: 50, min: 1, unit: 'GB' },
      { id: 'growth', label: 'Monthly Growth Percentage', type: 'number', defaultValue: 10, min: 0.1, max: 200, step: 0.5, unit: '%' },
      { id: 'months', label: 'Timeline Duration Scale', type: 'number', defaultValue: 12, min: 1, max: 120, unit: 'months' }
    ],
    faq: [
      { question: 'How do you combat compounding storage growth?', answer: 'Instituting automated data retention rules and offloading legacy historical records to cold archive arrays keeps operational databases small and fast.' }
    ],
    relatedSlugs: ['database-storage-dev', 'backup-storage', 'dev-scaling-calculator'],
    seoTitle: 'Expotential Data Sizing & Storage Growth Calculator',
    seoDescription: 'Model your next system traffic surge and estimate infrastructure expenditures online.',
    calculate: (inputs) => {
      const size = Number(inputs.initial || 10);
      const growth = Number(inputs.growth || 5) / 100;
      const terms = Number(inputs.months || 6);
      
      const finalSize = size * Math.pow(1 + growth, terms);
      const totalGrowthVal = finalSize - size;
      
      return {
        results: [
          { label: 'Forecasted Data Volume Size', value: Number(finalSize.toFixed(1)), unit: 'GB', isPrimary: true },
          { label: 'Incremental Growth Added', value: Number(totalGrowthVal.toFixed(1)), unit: 'GB' },
          { label: 'Growth Scale Compounded Result', value: Number((finalSize / size).toFixed(1)), unit: 'x its size' }
        ]
      };
    }
  },

  // ====================================== AI / MACHINE LEARNING ======================================
  {
    id: 'ai-token-count',
    name: 'LLM Token & Word Count Calculator',
    slug: 'ai-token-count',
    category: 'ai',
    description: 'Convert plain text word counts into estimated LLM sub-word token counts across multiple languages.',
    formula: 'Tokens = Words * Language token density multiplier',
    explanation: 'Calculates expected LLM token volumes using sub-word dictionary ratios to help estimate runtime API billing.',
    example: 'A block of 100 English words translates into roughly 133 tokens on modern LLM tokenizers.',
    inputs: [
      { id: 'words', label: 'Text Words Count', type: 'number', defaultValue: 500, min: 1, step: 25 },
      { id: 'langCode', label: 'Selected Content Language', type: 'select', defaultValue: 'en', options: [
        { label: 'English (1.33 tokens/word multiplier)', value: 'en' },
        { label: 'Source code (2.0 tokens/word multiplier)', value: 'code' },
        { label: 'European languages (1.6 tokens/word multiplier)', value: 'eu' },
        { label: 'Cyrillic languages (2.2 tokens/word multiplier)', value: 'cyr' },
        { label: 'East Asian scripts (2.5 tokens/word multiplier)', value: 'asia' }
      ]}
    ],
    faq: [
      { question: 'Why does token density vary across languages?', answer: 'Most modern LLM neural tokenizers are trained primarily on English databases. Other scripts and source code must be broken into much smaller sub-word components, inflating final token counts.' }
    ],
    relatedSlugs: ['ai-api-pricing', 'ai-vector-storage', 'ai-model-parameters'],
    seoTitle: 'Subword LLM Tokenizer & Word Volume Calculator',
    seoDescription: 'Obtain estimated LLM tokens for English texts and programming files.',
    calculate: (inputs) => {
      const words = Number(inputs.words || 100);
      const code = String(inputs.langCode || 'en');
      
      let mult = 1.33;
      if (code === 'code') mult = 2.0;
      else if (code === 'eu') mult = 1.6;
      else if (code === 'cyr') mult = 2.2;
      else if (code === 'asia') mult = 2.5;
      
      const tokensCount = Math.round(words * mult);
      
      return {
        results: [
          { label: 'Estimated Token Count', value: tokensCount, unit: 'tokens', isPrimary: true },
          { label: 'Linguistic Word density multiplier', value: mult, unit: 'tokens/word' },
          { label: 'Relative character count (Estimate)', value: Math.round(words * 5.2), unit: 'characters' }
        ]
      };
    }
  },
  {
    id: 'ai-api-pricing',
    name: 'Gemini & AI API Cost Calculator',
    slug: 'ai-api-pricing',
    category: 'ai',
    description: 'Calculate API query costs across premium LLM pricing paths for prompt and reply batches.',
    formula: 'Cost = Input Tokens * Input Rate + Output Tokens * Output Rate',
    explanation: 'Models real-world transaction overheads to help teams forecast operational API fees.',
    example: 'Running 10,000 prompt frames on Gemini 2.0 Flash at $0.075 per megatoken costs less than a penny.',
    inputs: [
      { id: 'prompts', label: 'Inputs Token Volume (Prompt)', type: 'number', defaultValue: 4000, min: 100, step: 500 },
      { id: 'replies', label: 'Outputs Token Volume (Reply)', type: 'number', defaultValue: 1000, min: 50, step: 50 },
      { id: 'volume', label: 'Projected Daily API Cycles', type: 'number', defaultValue: 5000, min: 10, step: 100 },
      { id: 'modelType', label: 'Target Model Pricing', type: 'select', defaultValue: 'flash2', options: [
        { label: 'Gemini 2.0 Flash ($0.075 / M-inputs; $0.30 / M-outputs)', value: 'flash2' },
        { label: 'Gemini 1.5 Flash ($0.075 / M-inputs; $0.30 / M-outputs)', value: 'flash15' },
        { label: 'Gemini 1.5 Pro ($1.25 / M-inputs; $5.00 / M-outputs)', value: 'pro15' }
      ]}
    ],
    faq: [
      { question: 'Why are outputs more expensive than inputs?', answer: 'Generating new tokens requires sequential auto-regressive computation draws, consuming significantly higher TPU RAM bandwidth compared to reading prompts in parallel.' }
    ],
    relatedSlugs: ['ai-token-count', 'ai-vector-storage', 'ai-training-duration'],
    seoTitle: 'Gemini LLM API Cost & Budget Estimator',
    seoDescription: 'Obtain prompt and reply costs and structural monthly API budgets.',
    calculate: (inputs) => {
      const prompts = Number(inputs.prompts || 1000);
      const replies = Number(inputs.replies || 200);
      const volume = Number(inputs.volume || 1000);
      const model = String(inputs.modelType || 'flash2');
      
      let inRate = 0.075 / 1000000; // Price per single token
      let outRate = 0.30 / 1000000;
      
      if (model === 'pro15') {
        inRate = 1.25 / 1000000;
        outRate = 5.00 / 1000000;
      }
      
      const singleCallCost = (prompts * inRate) + (replies * outRate);
      const dailyCost = singleCallCost * volume;
      const monthlyCost = dailyCost * 30.42;
      
      return {
        results: [
          { label: 'Projected Monthly API Bill', value: `$${Number(monthlyCost.toFixed(2))}`, isPrimary: true },
          { label: 'Average Cost per Single Query', value: `$${singleCallCost.toFixed(5)}` },
          { label: 'Projected Daily Operational Volume', value: `$${Number(dailyCost.toFixed(2))}`, unit: '/ day' }
        ]
      };
    }
  },
  {
    id: 'ai-vector-storage',
    name: 'AI Vector Database Memory Calculator',
    slug: 'ai-vector-storage',
    category: 'ai',
    description: 'Calculate the physical RAM and storage required to run custom embedding vector databases.',
    formula: 'RAM Required = Vector Count * Dimensions * Attribute byte widths * Index multiplier',
    explanation: 'Models standard memory spacing to plan resource capacities for RAG semantic search pipelines.',
    example: 'Indexing 500,000 document slices with 1536 Float32 dimension vectors requires 4.29 GB of memory.',
    inputs: [
      { id: 'vectors', label: 'Overall Indexed Document Count', type: 'number', defaultValue: 100000, min: 100, step: 1000 },
      { id: 'dimensions', label: 'Target Embedding Vector Dimensions', type: 'number', defaultValue: 1536, min: 64, max: 8192, step: 64 },
      { id: 'precision', label: 'Vector Numeric Word Sizing', type: 'select', defaultValue: '32', options: [
        { label: 'Float32 (4 bytes per dimension)', value: '32' },
        { label: 'Float16 (2 bytes per dimension)', value: '16' },
        { label: 'Int8 (1 byte per dimension)', value: '8' }
      ]}
    ],
    faq: [
      { question: 'What is vector query indexing padding?', answer: 'Advanced vector search algorithms, such as HNSW, construct high-density physical connection nodes between coordinates, demanding 25% to 50% RAM buffers on top of the raw vector numbers.' }
    ],
    relatedSlugs: ['ai-token-count', 'ai-api-pricing', 'ai-model-parameters'],
    seoTitle: 'Pinecone & HNSW Vector DB Sizing Memory Calculator',
    seoDescription: 'Obtain dynamic RAM scales needed to store large semantic search embeddings.',
    calculate: (inputs) => {
      const count = Number(inputs.vectors || 1000);
      const dims = Number(inputs.dimensions || 1536);
      const bits = Number(inputs.precision || 32);
      
      const bytesPerDimension = bits / 8;
      const rawBytes = count * dims * bytesPerDimension;
      const indexingPadding = 1.35; // HNSW index overhead
      const totalBytesRequired = rawBytes * indexingPadding;
      
      const mbRequired = totalBytesRequired / (1024 * 1024);
      const gbRequired = mbRequired / 1024;
      
      return {
        results: [
          { label: 'RAM Storage Capacity Sizing', value: gbRequired >= 1 ? Number(gbRequired.toFixed(2)) : Number(mbRequired.toFixed(1)), unit: gbRequired >= 1 ? 'GB RAM' : 'MB RAM', isPrimary: true },
          { label: 'Raw Vector Coordinate Size', value: gbRequired >= 1 ? Number((gbRequired / indexingPadding).toFixed(2)) : Number((mbRequired / indexingPadding).toFixed(1)), unit: gbRequired >= 1 ? 'GB' : 'MB' },
          { label: 'Overall Float values indexed', value: (count * dims).toExponential(2), unit: 'dimensions' }
        ]
      };
    }
  },
  {
    id: 'ai-model-parameters',
    name: 'Neural Model Parameter Estimator',
    slug: 'ai-model-parameters',
    category: 'ai',
    description: 'Estimate deep neural network parameters and find required active RAM memory footprints.',
    formula: 'Memory GB = Parameters in Billions * (Bytes per Parameter + Optimizer state overhead)',
    explanation: 'Models Transformer parameters to map inference and hardware setups.',
    example: 'A modern 8B parameter model loaded in 16-bit Float precision requires 16 GB of VRAM memory boundaries.',
    inputs: [
      { id: 'paramsBillion', label: 'Overall Neural Parameters', type: 'number', defaultValue: 8, min: 0.1, max: 1000, step: 0.5, unit: 'Billion (B)' },
      { id: 'precisionBits', label: 'Quantization Precision', type: 'select', defaultValue: '16', options: [
        { label: 'Full Float32 precision (32 bits)', value: '32' },
        { label: 'Half Float16 standard (16 bits)', value: '16' },
        { label: 'Quantized INT8 footprint (8 bits)', value: '8' },
        { label: 'Extreme Quantized INT4 (4 bits)', value: '4' }
      ]}
    ],
    faq: [
      { question: 'What is model quantization?', answer: 'A model compression method that scales parameter weights down to lower bit depths (e.g., Float16 to Int4) to drastically reduce memory usage with minimal accuracy loss.' }
    ],
    relatedSlugs: ['ai-gpu-sizing', 'ai-training-duration', 'ai-vector-storage'],
    seoTitle: 'Transformer Parameters memory allocation calculator',
    seoDescription: 'Obtain active VRAM allocations for LLM models across precision levels.',
    calculate: (inputs) => {
      const params = Number(inputs.paramsBillion || 7);
      const bits = Number(inputs.precisionBits || 16);
      
      const bytesPerParameter = bits / 8;
      // Raw parameter storage
      const paramsMemoryGb = params * bytesPerParameter;
      
      // Inference overhead factor
      const inferenceMemoryGb = paramsMemoryGb * 1.25;
      
      return {
        results: [
          { label: 'Memory Footprint for Inference', value: Number(inferenceMemoryGb.toFixed(1)), unit: 'GB VRAM', isPrimary: true },
          { label: 'Raw Model Weights Size on Disk', value: Number(paramsMemoryGb.toFixed(1)), unit: 'GB' },
          { label: 'Minimum safe GPU capability', value: inferenceMemoryGb > 80 ? 'Multi-A100 server clusters' : inferenceMemoryGb > 24 ? 'Commercial workstation' : 'Standard local card' }
        ]
      };
    }
  },
  {
    id: 'ai-training-duration',
    name: 'LLM Training Time & Compute Calculator',
    slug: 'ai-training-duration',
    category: 'ai',
    description: 'Calculate LLM training duration and structural compute budget constraints.',
    formula: 'Training FLOPs = 6 * Tokens * Parameters; Time = FLOPs / (GPUs * Effective TFLOPS)',
    explanation: 'Converts hardware clusters and parameter sizes into calendar days using the deep Chinchilla scaling laws.',
    example: 'Training a 7 Billion parameter model on 1.4 Trillion tokens using 128 standard A100 GPUs takes approximately 45.4 days.',
    inputs: [
      { id: 'paramsBillion', label: 'Model Parameters', type: 'number', defaultValue: 7.0, min: 0.1, step: 0.5, unit: 'B (Billion)' },
      { id: 'tokensTrillion', label: 'Training Token Dataset', type: 'number', defaultValue: 1.4, min: 0.01, step: 0.1, unit: 'T (Trillion)' },
      { id: 'gpuCount', label: 'Active GPU Cluster Size', type: 'number', defaultValue: 128, min: 1, step: 8 },
      { id: 'gpuType', label: 'Selected GPU Tier Speed', type: 'select', defaultValue: 'h100', options: [
        { label: 'Nvidia H100 (Sovereign Peak - ~350 TFLOPS)', value: '350' },
        { label: 'Nvidia A100 (Standard Cloud - ~150 TFLOPS)', value: '150' },
        { label: 'Commercial Workstation (~40 TFLOPS)', value: '40' }
      ]}
    ],
    faq: [
      { question: 'What are the Chinchilla scaling rules?', answer: 'DeepMind scaling research shows that for maximum computational efficiency, model parameter counts and token dataset sizes should be scaled in equal 1:1 ratios.' }
    ],
    relatedSlugs: ['ai-gpu-sizing', 'ai-model-parameters', 'ai-api-pricing'],
    seoTitle: 'GPU Cluster LLM Training Duration Calculator',
    seoDescription: 'Obtain model FLOP requirements and estimate training runtime timelines online.',
    calculate: (inputs) => {
      const params = Number(inputs.paramsBillion || 7) * 1000000000;
      const tokens = Number(inputs.tokensTrillion || 1) * 1000000000000;
      const gpus = Number(inputs.gpuCount || 8);
      const tflops = Number(inputs.gpuType || 150);
      
      // 6 FLOPs per parameter needed for training (2 forward + 4 backward passes)
      const totalFlops = 6 * params * tokens;
      
      // Calculate real hardware TFLOPS throughput delivered (assume standard 40% efficiency)
      const realHardwareThroughput = tflops * 0.40 * 1000000000000 * gpus;
      const secondsNeeded = totalFlops / realHardwareThroughput;
      const days = secondsNeeded / 86400;
      
      return {
        results: [
          { label: 'Projected Training Duration', value: days >= 1 ? Number(days.toFixed(1)) : Number((days * 24).toFixed(1)), unit: days >= 1 ? 'days' : 'hours', isPrimary: true },
          { label: 'Total Compute Required (FLOPs)', value: totalFlops.toExponential(2), unit: 'FLOPs' },
          { label: 'Effective hardware throughput', value: Math.round(tflops * 0.40), unit: 'TFLOPS / GPU' }
        ]
      };
    }
  },
  {
    id: 'ai-gpu-sizing',
    name: 'LLM GPU Sizing & VRAM Calculator',
    slug: 'ai-gpu-sizing',
    category: 'ai',
    description: 'Determine the exact number of enterprise Nvidia GPU cards required to load and serve parameters.',
    formula: 'GPUs Needed = ceil(Active Model Memory / Single GPU Memory)',
    explanation: 'Evaluates parameters and context lengths, showing whether databases fit single cards or require A100 server clusters.',
    example: 'Serving a 70 Billion parameter model at Float16 precision (140 GB model) requires at least two 80 GB commercial GPUs.',
    inputs: [
      { id: 'modelSize', label: 'Overall Model Size', type: 'number', defaultValue: 70, min: 1, step: 1, unit: 'B parameters' },
      { id: 'precision', label: 'VRAM Precision Format', type: 'select', defaultValue: '16', options: [
        { label: 'Float16 unquantized (2 bytes per param)', value: '16' },
        { label: 'Int8 quantized (1 byte per param)', value: '8' },
        { label: 'Int4 quantized (0.5 byte per param)', value: '4' }
      ]},
      { id: 'gpuVram', label: 'Available Memory per GPU', type: 'select', defaultValue: '80', options: [
        { label: 'Nvidia H100 / A100 (80 GB RAM)', value: '80' },
        { label: 'Nvidia A10G / Workstation (24 GB RAM)', value: '24' },
        { label: 'Standard Workstation (16 GB RAM)', value: '16' }
      ]}
    ],
    faq: [
      { question: 'What is tensor parallelism?', answer: 'The hardware orchestration of splitting single neural layer calculations across multiple physical graphics cards, allowing massive models to run in parallel memory.' }
    ],
    relatedSlugs: ['ai-model-parameters', 'ai-training-duration', 'ai-inference-tokens-per-sec'],
    seoTitle: 'Enterprise LLM Multi-GPU Hardware Sizing Calculator',
    seoDescription: 'Benchmark VRAM and find the exact count of graphics cards needed to run models.',
    calculate: (inputs) => {
      const sizeB = Number(inputs.modelSize || 7);
      const precisionBits = Number(inputs.precision || 16);
      const vramLimit = Number(inputs.gpuVram || 24);
      
      const bytesPerParameter = precisionBits / 8;
      const modelMemoryGb = sizeB * bytesPerParameter;
      // Pad with 20% system overhead to handle context states
      const effectiveMemoryRequired = modelMemoryGb * 1.20;
      
      const cardCountRequired = Math.ceil(effectiveMemoryRequired / vramLimit);
      
      return {
        results: [
          { label: 'Required Target GPUs Count', value: cardCountRequired, unit: 'cards', isPrimary: true },
          { label: 'Weighted Model VRAM Allocation', value: Number(effectiveMemoryRequired.toFixed(1)), unit: 'GB' },
          { label: 'Individual Hardware Limit Utilized', value: `${vramLimit} GB / card` }
        ]
      };
    }
  },
  {
    id: 'ai-inference-tokens-per-sec',
    name: 'LLM Inference Performance Calculator',
    slug: 'ai-inference-tokens-per-sec',
    category: 'ai',
    description: 'Calculate conversational tokens-per-second, user concurrency, and system utilization limits.',
    formula: 'Throughput = Total Generated Tokens / Total Latency Seconds',
    explanation: 'Models hardware performance to track multi-user response times during server stress testing.',
    example: 'Generating 1,000 output tokens over 20 seconds yields a system throughput of 50 tokens per second.',
    inputs: [
      { id: 'toks', label: 'Average Generated Tokens', type: 'number', defaultValue: 800, min: 10, step: 50 },
      { id: 'latencyMs', label: 'Overall Retrieval Time (Latency)', type: 'number', defaultValue: 12, min: 1, step: 1, unit: 'seconds' },
      { id: 'concur', label: 'Active Concurrent Users Count', type: 'number', defaultValue: 10, min: 1 }
    ],
    faq: [
      { question: 'What is Time to First Token (TTFT)?', answer: 'The duration between submitting a prompt and the server rendering the first character, reflecting prompt processing efficiency.' }
    ],
    relatedSlugs: ['ai-gpu-sizing', 'ai-model-parameters', 'dev-scaling-calculator'],
    seoTitle: 'LLM Compute Throughput & Token Speed Calculator',
    seoDescription: 'Obtain estimated query latencies and benchmark hardware tokens-per-second.',
    calculate: (inputs) => {
      const toks = Number(inputs.toks || 400);
      const lat = Number(inputs.latencyMs || 5);
      const concur = Number(inputs.concur || 1);
      
      const speed = lat > 0 ? toks / lat : 0;
      const systemThroughput = speed * concur;
      
      return {
        results: [
          { label: 'Output Velocity per User', value: Number(speed.toFixed(1)), unit: 'tokens / second', isPrimary: true },
          { label: 'Combined System Throughput Rate', value: Number(systemThroughput.toFixed(1)), unit: 'tokens / sec' },
          { label: 'Average Delivery Time per Token', value: lat > 0 ? Math.round((lat * 1000) / toks) : 0, unit: 'ms' }
        ]
      };
    }
  }
];
