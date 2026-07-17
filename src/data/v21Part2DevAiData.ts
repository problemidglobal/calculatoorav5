import { Calculator } from '../types';

export const V21_PART2_CALCULATORS: Calculator[] = [
  // ====================================== SOFTWARE ENGINEERING ======================================
  {
    id: 'software-estimate',
    name: 'Software Project COCOMO II Estimator',
    slug: 'software-estimate',
    category: 'software-engineering',
    description: 'Estimate software development duration and effort using the constructive cost model (COCOMO II).',
    formula: 'Effort (Person-Months) = A * (Size in KLOC)^E * EAF\nWhere A = 2.94, E = scale factors, EAF = adjustment multipliers.',
    explanation: 'Applies industry standard COCOMO II algorithms to predict software project staffing needs based on codebase size.',
    example: 'A project with 15,000 lines of code (15 KLOC) and high complexity requires roughly 43.6 Person-Months.',
    inputs: [
      { id: 'kloc', label: 'Estimated Code Size (KLOC - Thousands of Lines of Code)', type: 'number', defaultValue: 15, min: 0.1 },
      { id: 'complexity', label: 'Overall System Complexity Level', type: 'select', defaultValue: 'normal', options: [
        { label: 'Very Simple / Low Overheads (EAF: 0.85)', value: 'simple' },
        { label: 'Normal Standard Business Software (EAF: 1.00)', value: 'normal' },
        { label: 'High Complexity / Realtime Embedded (EAF: 1.25)', value: 'high' }
      ]},
      { id: 'avgSalary', label: 'Average Developer Monthly Salary ($)', type: 'number', defaultValue: 8500, min: 1000 }
    ],
    faq: [
      { question: 'What does EAF stand for?', answer: 'Effort Adjustment Factor - compiles factors like developer capability, storage constraints, language maturity, and tool availability into a single multiplier.' }
    ],
    relatedSlugs: ['dev-cost', 'dev-time'],
    seoTitle: 'COCOMO II Software project Effort & Duration Estimator',
    seoDescription: 'Obtain engineering effort estimations. Calculates standard development months and salary expenses based on KLOC size models.',
    calculate: (inputs) => {
      const kloc = Number(inputs.kloc || 15);
      const complexity = inputs.complexity || 'normal';
      const salary = Number(inputs.avgSalary || 8500);

      let eaf = 1.0;
      if (complexity === 'simple') eaf = 0.85;
      else if (complexity === 'high') eaf = 1.25;

      // COCOMO nominal formulas
      const effort = 2.94 * Math.pow(kloc, 1.15) * eaf;
      const duration = 2.5 * Math.pow(effort, 0.35); // standard schedule formula
      const estCost = effort * salary;
      const staffNeeded = effort / duration;

      return {
        results: [
          { label: 'Estimated Effort Months', value: `${effort.toFixed(1)} Person-Months`, isPrimary: true },
          { label: 'Estimated Project Duration', value: `${duration.toFixed(1)} Calendar Months`, isPrimary: true },
          { label: 'Accumulated Staffing Costs', value: estCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Average Staff Required Pace', value: `${staffNeeded.toFixed(1)} Developers` }
        ]
      };
    }
  },
  {
    id: 'dev-cost',
    name: 'Software Development Cost Calculator',
    slug: 'dev-cost',
    category: 'software-engineering',
    description: 'Calculate overall custom software development costs based on team sizing and project timeline in weeks.',
    formula: 'Cost = Weeks * Sum(Team Members * Weekly Salaries)',
    explanation: 'Combines cross-functional team roles and hourly labor rates to define standard software launch budgets.',
    example: 'Launching an app with 2 developers, 1 designer, and a PM over a 12-week timeline.',
    inputs: [
      { id: 'developers', label: 'Count of Software Developers', type: 'number', defaultValue: 2, min: 0 },
      { id: 'devRate', label: 'Developer Average Hourly Rate ($/Hour)', type: 'number', defaultValue: 65, min: 1 },
      { id: 'designers', label: 'Count of UI/UX Designers', type: 'number', defaultValue: 1, min: 0 },
      { id: 'designRate', label: 'Designer Average Hourly Rate ($/Hour)', type: 'number', defaultValue: 50, min: 1 },
      { id: 'weeks', label: 'Total Project Timeline Duration (Weeks)', type: 'number', defaultValue: 12, min: 1 }
    ],
    faq: [
      { question: 'Why plan for weekly allocations?', answer: 'Agile methodologies budget expenses weekly through sprints, which maps cleanly to milestones.' }
    ],
    relatedSlugs: ['software-estimate', 'dev-time'],
    seoTitle: 'Custom Software Development cost & Resource Budget Calculator',
    seoDescription: 'Calculate software development budgets. Combines engineers, designers, and project managers to predict milestone expenses.',
    calculate: (inputs) => {
      const devs = Number(inputs.developers || 2);
      const devRate = Number(inputs.devRate || 65);
      const designers = Number(inputs.designers || 1);
      const desRate = Number(inputs.designRate || 50);
      const wks = Number(inputs.weeks || 12);

      const hoursPerWeek = 40;
      const devWeekly = devs * devRate * hoursPerWeek;
      const designWeekly = designers * desRate * hoursPerWeek;
      const totalWeekly = devWeekly + designWeekly;
      const totalCost = totalWeekly * wks;

      return {
        results: [
          { label: 'Total Development Cost', value: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Weekly Team Burn Rate', value: totalWeekly.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Total Cumulative Hours', value: (devs + designers) * hoursPerWeek * wks, unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'dev-time',
    name: 'Developer Time & Story Point Sizer',
    slug: 'dev-time',
    category: 'software-engineering',
    description: 'Convert agile story point backlogs into estimated working calendar weeks based on team velocities.',
    formula: 'Schedules Weeks = Total Backlog Points / (Active Team Velocity * Sprints)',
    explanation: 'Applies historical scrum team velocities to roadmap estimates to structure sprint plans.',
    example: 'A backlog of 80 story points with a team velocity of 20 points per 2-week sprint takes 8 calendar weeks.',
    inputs: [
      { id: 'storyPoints', label: 'Total Backlog Story Points Count', type: 'number', defaultValue: 80, min: 1 },
      { id: 'velocity', label: 'Average Team Sprint Velocity (Story Points/Sprint)', type: 'number', defaultValue: 20, min: 1 },
      { id: 'sprintWeeks', label: 'Sprint Duration Timeline (Weeks)', type: 'number', defaultValue: 2, min: 1, max: 4 }
    ],
    faq: [
      { question: 'What is agile velocity?', answer: 'The average history of how many story points a scrum development team successfully completes within a single standard sprint cycle.' }
    ],
    relatedSlugs: ['software-estimate', 'dev-cost'],
    seoTitle: 'Agile Story Point to Developer Time Schedule Calculator',
    seoDescription: 'Estimage agile delivery schedules. Convert system story point backlogs into estimated delivery weeks easily.',
    calculate: (inputs) => {
      const points = Number(inputs.storyPoints || 80);
      const vel = Number(inputs.velocity || 20);
      const duration = Number(inputs.sprintWeeks || 2);

      const sprintsNeeded = points / vel;
      const totalWeeks = sprintsNeeded * duration;

      return {
        results: [
          { label: 'Weeks to Completion', value: `${totalWeeks.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Estimated Sprints Required', value: `${sprintsNeeded.toFixed(1)} Sprints`, isPrimary: true },
          { label: 'Pace Needed per Week', value: `${(points / totalWeeks).toFixed(1)} Points/Week` }
        ]
      };
    }
  },
  {
    id: 'code-maintenance',
    name: 'Software Technical Debt & Refactor Cost Calculator',
    slug: 'code-maintenance',
    category: 'software-engineering',
    description: 'Assess codebase health profiles and refactoring effort cost thresholds.',
    formula: 'Refactoring Cost = (Complexity Remediation Hours * Labor Rate) + Quality Debt Cost',
    explanation: 'Models code complexity risks to estimate standard maintenance costs, helping developers justify code refactoring.',
    example: 'A code file containing legacy logic with 32 duplication files requires substantial quality restoration budgets.',
    inputs: [
      { id: 'linesOfCode', label: 'Total Code Base Size (Lines of Code)', type: 'number', defaultValue: 10000, min: 100 },
      { id: 'duplicationPct', label: 'Duplicated Code Blocks Portion (%)', type: 'number', defaultValue: 15, min: 0, max: 100 },
      { id: 'testCoverage', label: 'Test Coverage Metrics Percentage (%)', type: 'number', defaultValue: 45, min: 0, max: 100 },
      { id: 'laborRate', label: 'Developer Hourly Cost Rate ($/Hour)', type: 'number', defaultValue: 65, min: 10 }
    ],
    faq: [
      { question: 'What is technical debt?', answer: 'The implied long-term cost of choosing simple, quick software architectures today instead of choosing solid, scalable programming solutions.' }
    ],
    relatedSlugs: ['software-estimate', 'software-scaling'],
    seoTitle: 'Software Technical Debt and Maintenance Refactoring Cost Calculator',
    seoDescription: 'Obtain software technical debt cost models. Compiles duplicate code lines and test coverages to evaluate refactoring labor.',
    calculate: (inputs) => {
      const loc = Number(inputs.linesOfCode || 10000);
      const dup = Number(inputs.duplicationPct || 15) / 100;
      const cov = Number(inputs.testCoverage || 45) / 100;
      const wage = Number(inputs.laborRate || 65);

      // Estimate refactoring hours based on duplication and missing test coverage
      const dupHoursNeeded = loc * dup * 0.05; // 5 hours per 1,000 duplicated lines
      const testHoursNeeded = loc * (1 - cov) * 0.03; // 3 hours per 1,000 lines missing tests
      const totalHours = dupHoursNeeded + testHoursNeeded;
      const refCost = totalHours * wage;

      return {
        results: [
          { label: 'Calculated Tech Debt Cost', value: refCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Remediation Hours Required', value: `${totalHours.toFixed(0)} Hours`, isPrimary: true },
          { label: 'Complexity Code Quality Rating', value: cov >= 0.8 && dup <= 0.05 ? 'Grade A (Excellent)' : cov >= 0.6 && dup <= 0.15 ? 'Grade B (Acceptable)' : 'Grade C (Immediate refactor needed)' }
        ]
      };
    }
  },
  {
    id: 'software-scaling',
    name: 'Amdahl\'s Law Software scaling Tool',
    slug: 'software-scaling',
    category: 'software-engineering',
    description: 'Calculate the theoretical speedup in task execution using Amdahl\'s Law as you add processing cores.',
    formula: 'Speedup (S) = 1 / ((1 - P) + (P / N))\nWhere P is parallel fraction, N is processor cores.',
    explanation: 'Models performance limits for parallel clusters, showing potential scaling bottlenecks.',
    example: 'A program with a 75% parallel portion (P=0.75) achieves a maximum speed up of 2.28x on 4 CPU cores.',
    inputs: [
      { id: 'parallelFraction', label: 'Parallel Code Portion (%) (e.g., portions that scale on threads)', type: 'number', defaultValue: 80, min: 1, max: 100 },
      { id: 'cores', label: 'Total Scaled CPU Cores / Workers (N)', type: 'number', defaultValue: 8, min: 1, max: 256 }
    ],
    faq: [
      { question: 'What does Amdahl\'s Law state?', answer: 'Amdahl\'s Law states that the overall speed improvements of a software program developed to execute in parallel is strictly bounded by the sequential portion of the code.' }
    ],
    relatedSlugs: ['app-capacity', 'code-maintenance'],
    seoTitle: 'Amdahl\'s Law Parallel Core CPU Scalability speedup Calculator',
    seoDescription: 'Obtain software scalability limits. Tracks parallel execution capabilities and CPU core scale targets.',
    calculate: (inputs) => {
      const p = Number(inputs.parallelFraction || 80) / 100;
      const n = Number(inputs.cores || 8);

      const speedup = 1 / ((1 - p) + (p / n));
      const maximumPossibleSpeedupLimit = 1 / (1 - p); // infinite cores

      return {
        results: [
          { label: 'Theoretical Processing Speedup', value: `${speedup.toFixed(2)}x Faster`, isPrimary: true },
          { label: 'Max Possible Speedup (Inf Cores)', value: `${maximumPossibleSpeedupLimit.toFixed(1)}x Faster`, isPrimary: true },
          { label: 'Compute Core Utilization Rate', value: `${((speedup / n) * 100).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'app-capacity',
    name: 'Server API Request Capacity planner',
    slug: 'app-capacity',
    category: 'software-engineering',
    description: 'Estimate active server request load capacities based on system memory allocation budgets.',
    formula: 'Max Requests per Sec = (Available Memory / Memory per Request) * (1 / Processing Latency)',
    explanation: 'Helps backend infrastructure managers plan container scaling thresholds to prevent Out-of-Memory (OOM) errors.',
    example: 'A 2GB node server spinning 45MB instances supports roughly 44 concurrent requests before scaling.',
    inputs: [
      { id: 'serverMemoryGb', label: 'Available Node Server RAM Memory (GB)', type: 'number', defaultValue: 2, min: 0.1, step: 0.1 },
      { id: 'reqMemoryMb', label: 'Average Memory Allocation per Request (MB)', type: 'number', defaultValue: 32, min: 1 },
      { id: 'latencyMilli', label: 'Average API Response Latency (Milliseconds)', type: 'number', defaultValue: 120, min: 1 }
    ],
    faq: [
      { question: 'How is OOM crashing prevented?', answer: 'Scale your server container clusters before memory usage hits 80% to ensure enough resources are available to handle sudden traffic spikes.' }
    ],
    relatedSlugs: ['software-scaling', 'code-maintenance'],
    seoTitle: 'Node Server Request Capacity & RAM Scaling Planner',
    seoDescription: 'Calculate server memory request capacities. Estimate maximum API throughput rates based on RAM allocations.',
    calculate: (inputs) => {
      const ramGb = Number(inputs.serverMemoryGb || 2);
      const reqMb = Number(inputs.reqMemoryMb || 32);
      const latency = Number(inputs.latencyMilli || 120);

      const totalMb = ramGb * 1024;
      const concurrentCapacity = Math.floor(totalMb / reqMb);
      const reqsPerSec = concurrentCapacity * (1000 / latency);

      return {
        results: [
          { label: 'API Requests supported per Sec', value: `${reqsPerSec.toFixed(0)} Req/s`, isPrimary: true },
          { label: 'Max Safe Concurrent Requests', value: concurrentCapacity, isPrimary: true },
          { label: 'Total Server RAM Capacity', value: `${totalMb} MB` }
        ]
      };
    }
  },

  // ====================================== AI ADVANCED ======================================
  {
    id: 'ai-usage',
    name: 'AI API Token Usage & Cost Calculator',
    slug: 'ai-usage',
    category: 'ai',
    description: 'Calculate and project AI model integration costs based on your token volume.',
    formula: 'Cost = (Input Tokens / 1,000,000 * Input Rate) + (Output Tokens / 1,000,000 * Output Rate)',
    explanation: 'Estimates LLM operational costs based on token volumes, input lengths, and API usage fees.',
    example: 'Processing 10,000 API calls with standard inputs costs roughly $1.50 under Gemini Flash rates.',
    inputs: [
      { id: 'apiCalls', label: 'Total Monthly API Calls Count', type: 'number', defaultValue: 10000, min: 1 },
      { id: 'inputTokens', label: 'Average Input Tokens per Call (Prompt)', type: 'number', defaultValue: 800, min: 1 },
      { id: 'outputTokens', label: 'Average Output Tokens per Call (Response)', type: 'number', defaultValue: 400, min: 1 },
      { id: 'costInputMillion', label: 'API Price Key - Input ($ per Million Tokens)', type: 'number', defaultValue: 0.075, min: 0, step: 0.001 },
      { id: 'costOutputMillion', label: 'API Price Key - Output ($ per Million Tokens)', type: 'number', defaultValue: 0.30, min: 0, step: 0.001 }
    ],
    faq: [
      { question: 'What is a token in large language models?', answer: 'The basic building block of LLM processing, equivalent to roughly 4 characters or 0.75 English words.' }
    ],
    relatedSlugs: ['ai-cost-forecast', 'ai-token-estimator'],
    seoTitle: 'Large Language Model AI API Token Cost & Usage Calculator',
    seoDescription: 'Obtain AI token budgeting models. Predicts monthly API expenses based on custom input and output token rates.',
    calculate: (inputs) => {
      const calls = Number(inputs.apiCalls || 10000);
      const inpTok = Number(inputs.inputTokens || 800);
      const outTok = Number(inputs.outputTokens || 400);
      const pIn = Number(inputs.costInputMillion || 0.075);
      const pOut = Number(inputs.costOutputMillion || 0.30);

      const totalInputTokens = calls * inpTok;
      const totalOutputTokens = calls * outTok;
      const costIn = (totalInputTokens / 1000000) * pIn;
      const costOut = (totalOutputTokens / 1000000) * pOut;
      const grandTotalCost = costIn + costOut;

      return {
        results: [
          { label: 'Assessed Monthly AI API Costs', value: grandTotalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Combined Tokens Consumed', value: (totalInputTokens + totalOutputTokens).toLocaleString(), isPrimary: true },
          { label: 'Prompt Input Expense portion', value: costIn.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) },
          { label: 'Completion Output Expense portion', value: costOut.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'ai-cost-forecast',
    name: 'AI Scaling Cost Forecast Calculator',
    slug: 'ai-cost-forecast',
    category: 'ai',
    description: 'Forecast monthly AI model expenses as your active user base scales.',
    formula: 'Cost = Users * Average Calls per User * Cost per Call',
    explanation: 'Models monthly AI spending based on projected user growth and average API call volumes over time.',
    example: 'Growing from 1,000 to 5,000 active users leads to a significant increase in model API costs.',
    inputs: [
      { id: 'startingUsers', label: 'Current Active App Users', type: 'number', defaultValue: 1000, min: 1 },
      { id: 'monthlyGrowth', label: 'Projected Monthly User Growth rate (%)', type: 'number', defaultValue: 25, min: 1 },
      { id: 'callsPerUserDay', label: 'Average User Queries per Day', type: 'number', defaultValue: 5, min: 0.1, step: 0.1 },
      { id: 'costPerCallCent', label: 'Cost per Core API Query (US Cents, e.g., 0.05)', type: 'number', defaultValue: 0.05, min: 0.001, step: 0.001 }
    ],
    faq: [
      { question: 'How do you keep scaling costs under control?', answer: 'Optimize scaling costs by using caching layers, choosing smaller models for simple tasks, and enforcing query rate limits.' }
    ],
    relatedSlugs: ['ai-usage', 'ai-resource'],
    seoTitle: 'AI User Scaling Growth Cost Forecast Calculator',
    seoDescription: 'Forecast monthly AI API costs as your user base grows. Model budget targets over time based on active API queries.',
    calculate: (inputs) => {
      const users = Number(inputs.startingUsers || 1000);
      const growth = Number(inputs.monthlyGrowth || 25) / 100;
      const queries = Number(inputs.callsPerUserDay || 5);
      const priceSingle = Number(inputs.costPerCallCent || 0.05) / 100;

      // Calculate projection for Month 3 and Month 6
      const month1Cost = users * 30 * queries * priceSingle;
      
      const usersM3 = users * Math.pow(1 + growth, 3);
      const month3Cost = usersM3 * 30 * queries * priceSingle;

      const usersM6 = users * Math.pow(1 + growth, 6);
      const month6Cost = usersM6 * 30 * queries * priceSingle;

      return {
        results: [
          { label: 'Month 1 Estimated Expenses', value: month1Cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Month 6 Scaled Expenses Projection', value: month6Cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Month 6 Proportional Users Count', value: Math.round(usersM6).toLocaleString(), isPrimary: true },
          { label: 'Month 3 Projected Midpoint', value: month3Cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'ai-token-estimator',
    name: 'AI Word to Token Estimator',
    slug: 'ai-token-estimator',
    category: 'ai',
    description: 'Convert English and multilingual word counts into estimated API token counts.',
    formula: 'Estimated Tokens = English Word Count / 0.75 | Characters / 4',
    explanation: 'Estimates token counts for raw text files, helping developers avoid going over API context limits.',
    example: 'An English document containing 1,500 words transpires to roughly 2,000 API tokens.',
    inputs: [
      { id: 'wordsCount', label: 'Primary Document Word Count', type: 'number', defaultValue: 1500, min: 1 }
    ],
    faq: [
      { question: 'Why does word count mapping vary between languages?', answer: 'Tokenizers represent non-English orthographies with more tokens per word, meaning languages like Japanese or Arabic use more tokens for the same meaning.' }
    ],
    relatedSlugs: ['ai-usage', 'ai-cost-forecast'],
    seoTitle: 'Text Word Count to Large Language Model Token Estimator',
    seoDescription: 'Convert document word counts into estimated LLM tokens. Predict API input payloads and avoid going over context limits.',
    calculate: (inputs) => {
      const words = Number(inputs.wordsCount || 1500);

      const entTokens = Math.ceil(words / 0.75);
      const safetyBufferLimit = Math.ceil(entTokens * 1.15); // standard safety offset

      return {
        results: [
          { label: 'Estimated Nominal Tokens', value: entTokens, isPrimary: true },
          { label: 'Safety Buffer Allocation (15% Max)', value: safetyBufferLimit, isPrimary: true },
          { label: 'Percent of Standard 128k Context', value: `${((entTokens / 128000) * 100).toFixed(2)}%` }
        ]
      };
    }
  },
  {
    id: 'ai-resource',
    name: 'AI GPU VRAM Model Fitting Calculator',
    slug: 'ai-resource',
    category: 'ai',
    description: 'Calculate GPU VRAM requirements for model inference and fine-tuning based on parameter count and quantization levels.',
    formula: 'Required VRAM (GB) = (Model Parameters in B * Precision Bits / 8) * Overhead factor',
    explanation: 'Models Deep Learning memory needs, helping ML engineers choose the right Cloud GPU instances.',
    example: 'Fine-tuning a 7 Billion parameter (7B) model in FP16 precision requires a premium GPU with at least 15.4 GB of VRAM.',
    inputs: [
      { id: 'parametersB', label: 'Model Parameters Count (Billions - e.g., 7B, 13B, 70b)', type: 'number', defaultValue: 7, min: 0.1, step: 1 },
      { id: 'precision', label: 'Weight Precision Bit Width', type: 'select', defaultValue: '16', options: [
        { label: 'Uncompressed FP16 (16-bit / 2 Bytes)', value: '16' },
        { label: 'Quantized INT8 (8-bit / 1 Byte)', value: '8' },
        { label: 'highly Quantized INT4 (4-bit / 0.5 Bytes)', value: '4' }
      ]},
      { id: 'engineMode', label: 'Server Execution Operations Mode', type: 'select', defaultValue: 'inference', options: [
        { label: 'Standard Inference Serving (1.2x safety overhead)', value: 'inference' },
        { label: 'Full Parameter Tuning / Fine-Tuning (4x safety overhead)', value: 'tuning' }
      ]}
    ],
    faq: [
      { question: 'What is parameter quantization?', answer: 'Quantization reduces LLM file sizes by storing parameters in lower-precision formats (like INT4 instead of FP16), allowing large models to run on affordable GPUs.' }
    ],
    relatedSlugs: ['ai-usage', 'ai-cost-forecast'],
    seoTitle: 'LLM Model VRAM Memory & GPU Sizing Requirement Calculator',
    seoDescription: 'Calculate GPU VRAM requirements for LLM models. Compare FP16, INT8, and INT4 precision formats easily.',
    calculate: (inputs) => {
      const params = Number(inputs.parametersB || 7);
      const bits = Number(inputs.precision || 16);
      const mode = inputs.engineMode || 'inference';

      // base weight memory in GB
      const baseWeightGb = (params * bits) / 8;
      
      let overheadFactor = 1.2; // KV Cache & activation overheads
      if (mode === 'tuning') overheadFactor = 4.0; // Gradients & optimizer state overheads

      const totalRequired = baseWeightGb * overheadFactor;

      return {
        results: [
          { label: 'Minimum GPU VRAM Needed', value: `${totalRequired.toFixed(1)} GB`, isPrimary: true },
          { label: 'Pure Model Weight Size', value: `${baseWeightGb.toFixed(1)} GB`, isPrimary: true },
          { label: 'Overhead Allocations Added', value: `${(totalRequired - baseWeightGb).toFixed(1)} GB` }
        ]
      };
    }
  },
  {
    id: 'ai-model-compare',
    name: 'AI Model API Cost & SLA Benchmark Sizer',
    slug: 'ai-model-compare',
    category: 'ai',
    description: 'Compare API pricing, context window capabilities, and latencies across leading LLMs.',
    formula: 'Comparative Cost = Input cost + Output cost',
    explanation: 'Helping product managers balance cost and quality across model sizes.',
    example: 'Comparing the cost-efficiency of Gemini Flash against Gemini Pro for large context prompts.',
    inputs: [
      { id: 'queryVol', label: 'Total Planned Queries Volume', type: 'number', defaultValue: 100000, min: 100 },
      { id: 'avgInTokens', label: 'Average Prompts Length Size (Input Tokens)', type: 'number', defaultValue: 1500, min: 10 },
      { id: 'avgOutTokens', label: 'Average Generation Length Size (Output Tokens)', type: 'number', defaultValue: 500, min: 10 }
    ],
    faq: [
      { question: 'Why choose lightweight models?', answer: 'Lightweight models offer low latency and high cost-efficiency, making them ideal for simple tasks like classification and routing.' }
    ],
    relatedSlugs: ['ai-usage', 'ai-token-estimator'],
    seoTitle: 'AI Model API cost & Context Window SLA Benchmarkers',
    seoDescription: 'Compare API costs across Gemini and Claude model sizes. Model query expenses at scale easily.',
    calculate: (inputs) => {
      const vol = Number(inputs.queryVol || 100000);
      const inp = Number(inputs.avgInTokens || 1500);
      const out = Number(inputs.avgOutTokens || 500);

      const Million = 1000000;
      const totalInMillion = (vol * inp) / Million;
      const totalOutMillion = (vol * out) / Million;

      // Pricing structures
      // Gemini Flash: $0.075/M in, $0.30/M out
      const costFlash = (totalInMillion * 0.075) + (totalOutMillion * 0.30);
      // Gemini Pro: $1.25/M in, $5.00/M out
      const costPro = (totalInMillion * 1.25) + (totalOutMillion * 5.00);
      // Premium models: $3.00/M in, $15.00/M out
      const costPremium = (totalInMillion * 3.00) + (totalOutMillion * 15.00);

      return {
        results: [
          { label: 'Gemini Flash Estimated Cost', value: costFlash.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Gemini Pro Estimated Cost', value: costPro.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Ultra Premium Models Cost', value: costPremium.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },

  // ====================================== DATA SCIENCE ======================================
  {
    id: 'dataset-size',
    name: 'CSV & Dataset Sizing Storage Calculator',
    slug: 'dataset-size',
    category: 'data-science',
    description: 'Estimate physical file sizes for CSV, JSON, and Parquet tabular datasets.',
    formula: 'File Size (MB) = Row Count * (Column Count * Average Byte size per field) / 10^6',
    explanation: 'Models structured data sizes, helping data engineers choose the right storage and database capacities.',
    example: 'A dataset with 1,000,000 rows and 15 columns requires roughly 255 MB of uncompressed storage.',
    inputs: [
      { id: 'rowCount', label: 'Total Rows Count in Dataset', type: 'number', defaultValue: 1000000, min: 1 },
      { id: 'colCount', label: 'Average Columns Count in Row', type: 'number', defaultValue: 15, min: 1 },
      { id: 'avgFieldSizeBytes', label: 'Average Field Byte Size (Default: 17 Bytes)', type: 'number', defaultValue: 17, min: 1 }
    ],
    faq: [
      { question: 'Why does storage footprint vary between formats?', answer: 'JSON formats include repeated keys in every row, causing large footprints, while Parquet uses columnar compression to reduce file sizes by up to 80%.' }
    ],
    relatedSlugs: ['data-storage', 'data-growth'],
    seoTitle: 'Tabular CSV & JSON Dataset File Storage Sizing Calculator',
    seoDescription: 'Estimate dataset storage requirements. Convert rows and columns into physical file size estimates easily.',
    calculate: (inputs) => {
      const rows = Number(inputs.rowCount || 1000000);
      const cols = Number(inputs.colCount || 15);
      const sizeBytes = Number(inputs.avgFieldSizeBytes || 17);

      const rawBytes = rows * cols * sizeBytes;
      const rawMb = rawBytes / (1024 * 1024);
      const parquetMb = rawMb * 0.22; // average parquet compression ratio

      return {
        results: [
          { label: 'Raw CSV/TXT Footprint', value: `${rawMb.toFixed(1)} MB`, isPrimary: true },
          { label: 'Parquet Compressed File Size', value: `${parquetMb.toFixed(1)} MB`, isPrimary: true },
          { label: 'Equivalent Raw Bytes Count', value: rawBytes.toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'data-storage',
    name: 'Cloud Data Storage & S3 Cost Calculator',
    slug: 'data-storage',
    category: 'data-science',
    description: 'Calculate and project monthly cloud storage costs across Standard, Infrequent, and Archive storage tiers.',
    formula: 'Cost = Storage Size (GB) * Tier Price per GBPerHour',
    explanation: 'Estimates database backup and file storage costs to help teams optimize cloud budgets.',
    example: 'Storing 15 TB of cold archive backups costs roughly $60 per month.',
    inputs: [
      { id: 'storageGb', label: 'Total Core Data to Store (GB)', type: 'number', defaultValue: 5000, min: 1 },
      { id: 'stdPrice', label: 'Standard cloud Hot tier Price ($/GB)', type: 'number', defaultValue: 0.023, min: 0, step: 0.001 },
      { id: 'coldPrice', label: 'Cold Archive tier Price ($/GB)', type: 'number', defaultValue: 0.004, min: 0, step: 0.001 }
    ],
    faq: [
      { question: 'What is deep archive storage?', answer: 'Deep archive storage is a highly cost-efficient tier designed for long-term records, where retrieval times can take hours but prices are extremely low.' }
    ],
    relatedSlugs: ['dataset-size', 'data-growth'],
    seoTitle: 'AWS S3 & Cloud Storage Cost Comparison Calculator',
    seoDescription: 'Compare hot and cold cloud storage costs. Forecast your monthly hosting expenses based on data size.',
    calculate: (inputs) => {
      const gb = Number(inputs.storageGb || 5000);
      const hotPrice = Number(inputs.stdPrice || 0.023);
      const coldPrice = Number(inputs.coldPrice || 0.004);

      const costHot = gb * hotPrice;
      const costCold = gb * coldPrice;

      return {
        results: [
          { label: 'Standard Hot Tier Cost', value: costHot.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Cold Archive Tier Cost', value: costCold.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Annual Standard Tier Cost', value: (costHot * 12).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'data-growth',
    name: 'Database Capacity Volume Growth Forecast Calculator',
    slug: 'data-growth',
    category: 'data-science',
    description: 'Forecast future database storage requirements based on daily word counts or active document trends.',
    formula: 'End Volume = Starting Size * (1 + Monthly Growth Rate)^Months',
    explanation: 'Projects database size increases over time, helping team leaders procure server storage before running out of disk space.',
    example: 'A 500 GB database growing at 8% monthly will reach roughly 1,259 GB over a 12-month period.',
    inputs: [
      { id: 'startSizeGb', label: 'Current Database Size (GB)', type: 'number', defaultValue: 500, min: 1 },
      { id: 'monthlyRate', label: 'Expected Monthly Storage Growth Rate (%)', type: 'number', defaultValue: 8, min: 0, max: 100 },
      { id: 'monthsLimit', label: 'Projection Timeline (Months)', type: 'number', defaultValue: 12, min: 1, max: 120 }
    ],
    faq: [
      { question: 'How is physical data growth restricted?', answer: 'Enforce storage strictness through archiving strategies, index cleanups, and regular table partitioning.' }
    ],
    relatedSlugs: ['dataset-size', 'data-storage'],
    seoTitle: 'Database Storage Capacity Growth Forecast Calculator',
    seoDescription: 'Forecast database storage increases over time. Map system growth rates to plan server scaling targets.',
    calculate: (inputs) => {
      const start = Number(inputs.startSizeGb || 500);
      const rate = Number(inputs.monthlyRate || 8) / 100;
      const timeline = Number(inputs.monthsLimit || 12);

      const finalSize = start * Math.pow(1 + rate, timeline);
      const absoluteGbGained = finalSize - start;

      return {
        results: [
          { label: 'Projected Database Size', value: `${finalSize.toFixed(1)} GB`, isPrimary: true },
          { label: 'Cumulative Disk Size Gained', value: `${absoluteGbGained.toFixed(1)} GB`, isPrimary: true },
          { label: 'Approximate Standard Disk Costs', value: (finalSize * 0.10).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'data-quality',
    name: 'Dataset Completeness & Quality Score Calculator',
    slug: 'data-quality',
    category: 'data-science',
    description: 'Calculate overall data quality scores based on missing values, duplicate rows, and outlier checks.',
    formula: 'Quality Score % = (Complete Valid Records / Total Records) * 100',
    explanation: 'Evaluates data health to prevent bias and ensure accurate results before training machine learning models.',
    example: 'An LLC cleaning 50,000 files with 3,500 missing entries and 920 duplicate rows.',
    inputs: [
      { id: 'totalRows', label: 'Total Rows Count in Schema', type: 'number', defaultValue: 100000, min: 1 },
      { id: 'nullRows', label: 'Rows Carrying Null/Missing Values', type: 'number', defaultValue: 4500, min: 0 },
      { id: 'duplicateRows', label: 'Duplicate Rows Identified', type: 'number', defaultValue: 1200, min: 0 }
    ],
    faq: [
      { question: 'What is an acceptable quality threshold?', answer: 'Most analytical models require data quality scores of 95% or higher to prevent training bias and ensure reliable predictions.' }
    ],
    relatedSlugs: ['dataset-size', 'analytics-accuracy'],
    seoTitle: 'Dataset Data Cleaning Quality & Integrity Calculator',
    seoDescription: 'Obtain dataset quality ratings. Compiles duplicate rows and missing null entries to test compliance indexes.',
    calculate: (inputs) => {
      const total = Number(inputs.totalRows || 100000);
      const nulls = Number(inputs.nullRows || 4500);
      const dups = Number(inputs.duplicateRows || 1200);

      const invalidRows = nulls + dups;
      const validRows = Math.max(0, total - invalidRows);
      const qualityPct = (validRows / total) * 100;

      return {
        results: [
          { label: 'Dataset Quality Rating', value: `${qualityPct.toFixed(2)}%`, isPrimary: true },
          { label: 'Active Valid Records Count', value: validRows.toLocaleString(), isPrimary: true },
          { label: 'Total Damaged Entries Removed', value: invalidRows.toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'analytics-accuracy',
    name: 'AI Model Precision, Recall & F1 Matrix Calculator',
    slug: 'analytics-accuracy',
    category: 'data-science',
    description: 'Calculate classifier performance metrics including Precision, Recall, Accuracy, and F1 Score using a confusion matrix.',
    formula: 'Precision = TP / (TP + FP) | Recall = TP / (TP + FN)\nF1 = 2 * (Precision * Recall) / (Precision + Recall)',
    explanation: 'Uses a confusion matrix to evaluate classification performance, helping data scientists balance false positives and false negatives.',
    example: 'An image classification model returning 85 True Positives, 15 False Positives, and 10 False Negatives.',
    inputs: [
      { id: 'tp', label: 'True Positives (TP) Correct classifications', type: 'number', defaultValue: 85, min: 0 },
      { id: 'tn', label: 'True Negatives (TN) Correct rejections', type: 'number', defaultValue: 90, min: 0 },
      { id: 'fp', label: 'False Positives (FP) Type I Error cases', type: 'number', defaultValue: 12, min: 0 },
      { id: 'fn', label: 'False Negatives (FN) Type II Error cases', type: 'number', defaultValue: 8, min: 0 }
    ],
    faq: [
      { question: 'When is F1 Score preferred over raw Accuracy?', answer: 'F1 Score is preferred for imbalanced datasets, as it balances precision and recall to provide a more realistic metric of model performance.' }
    ],
    relatedSlugs: ['data-quality', 'sampling-calc'],
    seoTitle: 'AI Confusion Matrix Precision, Recall & F1 Classifier Score Calculator',
    seoDescription: 'Evaluate classification models. Calculate F1 Score, Precision, and Recall using a standard confusion matrix.',
    calculate: (inputs) => {
      const tp = Number(inputs.tp || 85);
      const tn = Number(inputs.tn || 90);
      const fp = Number(inputs.fp || 12);
      const fn = Number(inputs.fn || 8);

      const total = tp + tn + fp + fn;
      const accuracy = total > 0 ? (tp + tn) / total : 0;
      
      const precisionDenom = tp + fp;
      const precision = precisionDenom > 0 ? tp / precisionDenom : 0;

      const recallDenom = tp + fn;
      const recall = recallDenom > 0 ? tp / recallDenom : 0;

      const f1Denom = precision + recall;
      const f1 = f1Denom > 0 ? 2 * (precision * recall) / f1Denom : 0;

      return {
        results: [
          { label: 'F1 Performance Score', value: f1.toFixed(4), isPrimary: true },
          { label: 'Precision Rating', value: precision.toFixed(4), isPrimary: true },
          { label: 'Recall/Sensitivity Rating', value: recall.toFixed(4) },
          { label: 'Raw Model Accuracy %', value: `${(accuracy * 100).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'sampling-calc',
    name: 'Statistical Survey Sample Size Calculator',
    slug: 'sampling-calc',
    category: 'data-science',
    description: 'Calculate the minimum sample size required for statistically significant surveys, based on population size and margin of error.',
    formula: 'Sample Size = (Z^2 * p * (1-p)) / e^2\nAdjusted for finite populations with Cochran\'s correction.',
    explanation: 'Uses standard statistical formulas to help market researchers calculate sample sizes needed to hit margin of error targets.',
    example: 'For a population of 50,000, achieving a 95% confidence level with a 5% margin of error requires a sample of 381 people.',
    inputs: [
      { id: 'population', label: 'Total Target Population Size (N)', type: 'number', defaultValue: 50000, min: 1 },
      { id: 'confidence', label: 'Confidence Level (%)', type: 'select', defaultValue: '95', options: [
        { label: '99% Confidence Level (Z = 2.576)', value: '99' },
        { label: '95% Confidence Level (Z = 1.96)', value: '95' },
        { label: '90% Confidence Level (Z = 1.645)', value: '90' }
      ]},
      { id: 'marginOfError', label: 'Acceptable Margin of Error (%) (e.g., 5%)', type: 'number', defaultValue: 5, min: 0.1, max: 50 }
    ],
    faq: [
      { question: 'What is the margin of error?', answer: 'The margin of error represents the maximum range that your survey results are expected to differ from the actual population values.' }
    ],
    relatedSlugs: ['analytics-accuracy', 'data-quality'],
    seoTitle: 'Scientific Survey Sample Size Cochran Formula Calculator',
    seoDescription: 'Calculate target survey sample sizes. Determine minimum response rates based on margin of error targets.',
    calculate: (inputs) => {
      const N = Number(inputs.population || 50000);
      const conf = inputs.confidence || '95';
      const margin = Number(inputs.marginOfError || 5) / 100;

      let z = 1.96;
      if (conf === '99') z = 2.576;
      else if (conf === '90') z = 1.645;

      const p = 0.5; // standard probability of variance
      const n0 = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(margin, 2);

      // Cochran's correction for finite populations
      const nFin = n0 / (1 + ((n0 - 1) / N));
      const sampleResult = Math.ceil(nFin);

      return {
        results: [
          { label: 'Required Survey Sample Size', value: sampleResult.toLocaleString(), isPrimary: true },
          { label: 'Target Margin of Error', value: `${(margin * 100).toFixed(1)}%`, isPrimary: true },
          { label: 'Z-Score Value Applied', value: z }
        ]
      };
    }
  }
];
