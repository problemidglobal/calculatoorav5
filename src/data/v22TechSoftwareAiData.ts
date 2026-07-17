import { Calculator } from '../types';

export const V22_PART2_CALCULATORS: Calculator[] = [
  // ====================================== TECHNOLOGY CONTINUED ======================================
  {
    id: 'backup-storage',
    name: 'Backup Storage Calculator',
    slug: 'backup-storage',
    category: 'tech',
    description: 'Calculate total capacity required for multi-tier Grandfather-Father-Son (GFS) backups.',
    formula: 'Total GFS Capacity = (Daily Backups * Size) + (Weekly * Size) + (Monthly * Size) + (Yearly * Size)',
    explanation: 'Sizes enterprise data retention systems using standard cyclical schemes. Models long-range magnetic tape or cloud storage requirements.',
    example: 'For a 200 GB active database, maintaining 6 daily, 4 weekly, 12 monthly, and 7 yearly points requires an aggregate 5.8 TB.',
    inputs: [
      { id: 'sourceSize', label: 'Source System Size (GB)', type: 'number', defaultValue: 200, min: 1 },
      { id: 'dailyCount', label: 'Retained Dailies (typically 7)', type: 'number', defaultValue: 7, min: 0 },
      { id: 'weeklyCount', label: 'Retained Weeklies (typically 4)', type: 'number', defaultValue: 4, min: 0 },
      { id: 'monthlyCount', label: 'Retained Monthlies (typically 12)', type: 'number', defaultValue: 12, min: 0 },
      { id: 'dedup', label: 'Deduplication Savings Ratio', type: 'select', defaultValue: 1.5, options: [
        { label: 'No Deduplication (1.0x)', value: 1.0 },
        { label: 'Light Compressions (1.5x)', value: 1.5 },
        { label: 'Heuristic Data deduplication (3.0x)', value: 3.0 }
      ]}
    ],
    faq: [
      { question: 'What is a Grandfather-Father-Son rotation?', answer: 'GFS is a popular backup scheduling strategy where Son stands for daily incremental snapshots, Father is the weekly full copy, and Grandfather is the monthly archive.' }
    ],
    relatedSlugs: ['backup-planning', 'storage-need'],
    seoTitle: 'GFS Backup Scheme Total Capacity Sizer',
    seoDescription: 'Accurately size corporate archival pools by modeling deduplicated GFS tape rotation structures.',
    calculate: (inputs) => {
      const size = Number(inputs.sourceSize || 200);
      const d = Number(inputs.dailyCount || 7);
      const w = Number(inputs.weeklyCount || 4);
      const m = Number(inputs.monthlyCount || 12);
      const dedup = Number(inputs.dedup || 1.5);
      
      const rawDays = (d * size) + (w * size) + (m * size);
      const compressed = rawDays / dedup;
      return {
        results: [
          { label: 'Estimated Backup Footprint', value: compressed.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' GB', isPrimary: true },
          { label: 'Uncompressed Capacity Required', value: rawDays.toLocaleString() + ' GB' },
          { label: 'Data Compression Savings Ratio', value: ((1 - 1/dedup) * 100).toFixed(0) + '%' }
        ],
        chartData: [
          { name: 'Source Size', value: size },
          { name: 'GFS Aggregate Pool', value: compressed }
        ]
      };
    }
  },
  {
    id: 'internet-requirement',
    name: 'Internet Requirement Calculator',
    slug: 'internet-requirement',
    category: 'tech',
    description: 'Calculate household or office internet bandwidth requirements based on user and device behaviors.',
    formula: 'Internet Bandwidth (Mbps) = Sum (Device Count * Action Bandwidth Coefficient)',
    explanation: 'Calculates the real-time internet downloading and uploading speed thresholds needed to prevent stuttering on Zoom or YouTube streams.',
    example: 'A household with 2 video workers (10 Mbps each) and three active 4K televisions (25 Mbps each) requires at least 95 Mbps.',
    inputs: [
      { id: 'webUsers', label: 'Standard Web & Email Users', type: 'number', defaultValue: 2, min: 0 },
      { id: 'zoomWorkers', label: 'Zoom/Video Conference Users', type: 'number', defaultValue: 1, min: 0 },
      { id: 'streamers', label: '4K/UHD Video Streamers', type: 'number', defaultValue: 2, min: 0 },
      { id: 'gamers', label: 'Online competitive Gamers', type: 'number', defaultValue: 1, min: 0 }
    ],
    faq: [
      { question: 'Why does latency matter more than bandwidth for gaming?', answer: 'Competitive gaming uses vanishingly small file packets (requiring only ~3 Mbps), but desires near-zero server ping latencies.' }
    ],
    relatedSlugs: ['computer-upgrade', 'device-lifespan'],
    seoTitle: 'Household & Office Bandwidth Speed Requirement Calculator',
    seoDescription: 'Find the minimum home network speed tier matching your telecommuting, streaming, and gaming workloads.',
    calculate: (inputs) => {
      const web = Number(inputs.webUsers || 2) * 5;
      const zoom = Number(inputs.zoomWorkers || 1) * 15;
      const uHD = Number(inputs.streamers || 2) * 25;
      const game = Number(inputs.gamers || 1) * 8;
      const totalMbps = web + zoom + uHD + game;
      const recommendedPort = Math.max(25, totalMbps * 1.3); // add 30% overhead buffer
      return {
        results: [
          { label: 'Required Speed Capacity', value: recommendedPort.toFixed(0) + ' Mbps', isPrimary: true },
          { label: 'Net Concurrent Peak Draw', value: totalMbps + ' Mbps' },
          { label: 'Best Tier Recommendation', value: recommendedPort > 500 ? 'Fiber optic Gig-Port' : recommendedPort > 150 ? 'Standard High-Speed Cable' : 'Basic Broadband VDSL' }
        ],
        chartData: [
          { name: 'Web Traffic', value: web },
          { name: 'Video Calls', value: zoom },
          { name: '4K Streams', value: uHD },
          { name: 'Gaming Packets', value: game }
        ]
      };
    }
  },

  // ====================================== SOFTWARE ENGINEERING ======================================
  {
    id: 'software-project',
    name: 'Software Project Calculator',
    slug: 'software-project',
    category: 'software-engineering',
    description: 'Estimate project agile story points, velocity, sprint timelines, and resources.',
    formula: 'Sprints Needed = Total Points / Velocity\nTeam Size = (Points * Hours Per Point) / Total Available Sprint Hours',
    explanation: 'Converts product roadmaps into visual calendar estimates by analyzing historical developer speed dynamics.',
    example: 'A backlog of 150 story points running at a developer velocity of 30 points per sprint finishes in exactly 5 sprints.',
    inputs: [
      { id: 'points', label: 'Total Backlog Story Points', type: 'number', defaultValue: 120, min: 1 },
      { id: 'velocity', label: 'Planned Team Sprint Velocity (Points)', type: 'number', defaultValue: 25, min: 1 },
      { id: 'sprintWeeks', label: 'Sprint Duration (Weeks)', type: 'number', defaultValue: 2, min: 1, max: 4 }
    ],
    faq: [
      { question: 'What is a story point?', answer: 'A story point is an abstract unit of work that represents aggregate effort, complexity, and uncertainty involved in building a feature.' }
    ],
    relatedSlugs: ['development-time', 'software-cost'],
    seoTitle: 'Agile Software Backlog Story Points Planner',
    seoDescription: 'Translate corporate product backlogs and velocities into clear sprint timelines and calendar delivery forecasts.',
    calculate: (inputs) => {
      const p = Number(inputs.points || 120);
      const v = Number(inputs.velocity || 25);
      const w = Number(inputs.sprintWeeks || 2);
      const sprints = p / v;
      const totalDays = sprints * w * 5;
      return {
        results: [
          { label: 'Required Agile Sprints', value: sprints.toFixed(1), isPrimary: true },
          { label: 'Calendar Work Days', value: totalDays.toFixed(0) + ' Days' },
          { label: 'Total Project Weeks', value: (sprints * w).toFixed(1) + ' Weeks' }
        ],
        chartData: [
          { name: 'Points Completed', value: p },
          { name: 'Sprint Velocity Cap', value: v }
        ]
      };
    }
  },
  {
    id: 'development-time',
    name: 'Development Time Calculator',
    slug: 'development-time',
    category: 'software-engineering',
    description: 'Apply COCOMO modeling parameters to estimate engineering hours and workforce sizes based on software lines of code.',
    formula: 'Effort (Person-Months) = 2.4 * (KLOC) ^ 1.05',
    explanation: 'Calculates development times using the classic constructive cost model based on estimated lines of code.',
    example: 'A system sized at 15,000 lines of code (15 KLOC) requires approximately 43 person-months of concentrated development.',
    inputs: [
      { id: 'kloc', label: 'Software Size (KLOC - Thousands of Lines)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'mode', label: 'Project Technical Complexity', type: 'select', defaultValue: 'organic', options: [
        { label: 'Organic - Simple, well-known patterns', value: 'organic' },
        { label: 'Semidetached - Medium scale, hybrid libraries', value: 'semi' },
        { label: 'Embedded - Complex hardware/kernel bindings', value: 'embedded' }
      ]}
    ],
    faq: [
      { question: 'What does KLOC mean?', answer: 'KLOC stands for Thousands of Lines of Code. It is a traditional metric of codebase magnitude used in algorithmic efforts.' }
    ],
    relatedSlugs: ['software-project', 'software-cost'],
    seoTitle: 'COCOMO Software Engineering Effort Sizer',
    seoDescription: 'Estimate engineering person-months and software build scopes using algorithmic software line models.',
    calculate: (inputs) => {
      const kloc = Number(inputs.kloc || 15);
      const mode = String(inputs.mode || 'organic');
      let a = 2.4, b = 1.05;
      if (mode === 'semi') { a = 3.0; b = 1.12; }
      else if (mode === 'embedded') { a = 3.6; b = 1.20; }
      const effort = a * Math.pow(kloc, b);
      const duration = 2.5 * Math.pow(effort, 0.38);
      return {
        results: [
          { label: 'Total Development Effort', value: effort.toFixed(1) + ' Person-Months', isPrimary: true },
          { label: 'Calendar Build Duration', value: duration.toFixed(1) + ' Months' },
          { label: 'Optimal Engineering Size', value: Math.max(1, Math.ceil(effort / duration)) + ' developers' }
        ],
        chartData: [
          { name: 'Initial Codebase Sizing', value: kloc * 10 },
          { name: 'Development Months', value: duration * 10 }
        ]
      };
    }
  },
  {
    id: 'software-cost',
    name: 'Software Cost Calculator',
    slug: 'software-cost',
    category: 'software-engineering',
    description: 'Calculate comprehensive software project build costs including engineer compensation and monthly cloud services.',
    formula: 'Software cost = Developer Salaries + Server Cloud Instances + Third-party Integrations',
    explanation: 'Sizers custom IT program budgets by combining salaries, security licensing, and continuous server scaling expenses.',
    example: 'Assembling an app carrying $40,000 engineering wages along with $2,000 monthly cloud hosting results in a first-year budget of $64,000.',
    inputs: [
      { id: 'devHours', label: 'Total Developer Build Hours', type: 'number', defaultValue: 400, min: 10 },
      { id: 'hourlyRate', label: 'Average Hourly Wage ($/Hour)', type: 'number', defaultValue: 85, min: 10 },
      { id: 'hostingMonth', label: 'Cloud Infrastructure / Hosting ($/Month)', type: 'number', defaultValue: 300, min: 0 }
    ],
    faq: [
      { question: 'What is software TCO?', answer: 'TCO (Total Cost of Ownership) aggregates the building fee with ongoing maintenance, debugging, hosting, and operations costs.' }
    ],
    relatedSlugs: ['software-project', 'maintenance-cost'],
    seoTitle: 'Enterprise Custom Software Build & Cloud Budget Calculator',
    seoDescription: 'Forecast the full production cost of creating custom software services by tracking labor rates and server architectures.',
    calculate: (inputs) => {
      const hrs = Number(inputs.devHours || 400);
      const rate = Number(inputs.hourlyRate || 85);
      const host = Number(inputs.hostingMonth || 300);
      const labor = hrs * rate;
      const yearlyHost = host * 12;
      const grandTotal = labor + yearlyHost;
      return {
        results: [
          { label: 'Year 1 Total Cost', value: '$' + grandTotal.toLocaleString(), isPrimary: true },
          { label: 'Direct Engineering Costs', value: '$' + labor.toLocaleString() },
          { label: 'Annual Sizer Hosting Fee', value: '$' + yearlyHost.toLocaleString() }
        ],
        chartData: [
          { name: 'Labor Cost', value: labor },
          { name: 'Cloud Infrastructure', value: yearlyHost }
        ]
      };
    }
  },
  {
    id: 'bug-impact',
    name: 'Bug Impact Calculator',
    slug: 'bug-impact',
    category: 'software-engineering',
    description: 'Measure technical debt financial impact and bug-fixing latency on soft delivery speed.',
    formula: 'Defect Sizer Cost = Subeffect Multiplier * Fixing Hours * Engineering Hourly Cost',
    explanation: 'Traces how debugging late-stage defects (e.g. during system verification vs pre-compile local development) drains engineering budgets.',
    example: 'Finding 15 bugs late in system validation requiring 8 hours each to resolve costs $9,600 in auxiliary testing steps.',
    inputs: [
      { id: 'bugCount', label: 'Average Bugs Logged Weekly', type: 'number', defaultValue: 12, min: 0 },
      { id: 'fixHours', label: 'Average Fixing duration (Hours)', type: 'number', defaultValue: 3, min: 0.5, step: 0.5 },
      { id: 'devWages', label: 'Engineering Cost Hour ($)', type: 'number', defaultValue: 75, min: 20 }
    ],
    faq: [
      { question: 'Why does bug age raise repair costs?', answer: 'Bugs found late in system lifecycles require re-indexing regression passes, staging coordination, and database migrations, magnifying resolving efforts.' }
    ],
    relatedSlugs: ['development-time', 'software-cost'],
    seoTitle: 'Software Defect Resolving & Technical Debt Sizer',
    seoDescription: 'Analyze weekly developer hours lost resolving bugs to calculate software delivery delays.',
    calculate: (inputs) => {
      const count = Number(inputs.bugCount || 12);
      const hrs = Number(inputs.fixHours || 3);
      const wage = Number(inputs.devWages || 75);
      const weeklyHoursLost = count * hrs;
      const financialLoss = weeklyHoursLost * wage;
      return {
        results: [
          { label: 'Weekly Debug Cost Exposure', value: '$' + financialLoss.toLocaleString(), isPrimary: true },
          { label: 'Developer Hours Lost Weekly', value: weeklyHoursLost.toFixed(1) + ' hrs' },
          { label: 'Annual Profit Loss Sizer', value: '$' + (financialLoss * 52).toLocaleString() }
        ],
        chartData: [
          { name: 'Constructive Feature Hours', value: 40 - Math.min(40, weeklyHoursLost) },
          { name: 'Debugging Defect Hours', value: Math.min(40, weeklyHoursLost) }
        ]
      };
    }
  },
  {
    id: 'maintenance-cost',
    name: 'Maintenance Cost Calculator',
    slug: 'maintenance-cost',
    category: 'software-engineering',
    description: 'Calculate standard annual software maintenance budgets (routinely 15-25% of initial build outlays).',
    formula: 'Annual Maintenance Budget = Initial Software Cost * (15% to 25% scale based on system stability)',
    explanation: 'Budgets yearly outlays for system security patching, API upgrades, database cleanup, and minor UI additions.',
    example: 'A custom software suite costing $100,000 requires $20,000 annually in routine systems maintenance.',
    inputs: [
      { id: 'buildCost', label: 'Initial Software Development Cost ($)', type: 'number', defaultValue: 80000, min: 1000, step: 5000 },
      { id: 'riskTier', label: 'Infrastructure Complexity & Security', type: 'select', defaultValue: 0.2, options: [
        { label: 'Low - Simple static landing screens (15% build cost)', value: 0.15 },
        { label: 'Standard - Relational database dynamic app (20% build cost)', value: 0.20 },
        { label: 'Critical - Financial banking protocols (25% build cost)', value: 0.25 }
      ]}
    ],
    faq: [
      { question: 'What does software maintenance cover?', answer: 'It covers operating system updates, external visual library upgrades, SSL security patches, and structural error handling.' }
    ],
    relatedSlugs: ['software-cost', 'software-project'],
    seoTitle: 'Annual Enterprise Application Maintenance Sizer',
    seoDescription: 'Structure custom yearly budgets for server upgrades and application maintenance based on industry-standard percentages.',
    calculate: (inputs) => {
      const build = Number(inputs.buildCost || 80000);
      const percentage = Number(inputs.riskTier || 0.2);
      const yearly = build * percentage;
      return {
        results: [
          { label: 'Yearly Maintenance Budget', value: '$' + yearly.toLocaleString(), isPrimary: true },
          { label: 'Monthly Operational Allocation', value: '$' + Math.round(yearly / 12).toLocaleString() },
          { label: '5-Year Accumulation Cost', value: '$' + (yearly * 5).toLocaleString() }
        ],
        chartData: [
          { name: 'Build Capex', value: build },
          { name: 'Opex Maintenance Yr 1', value: yearly }
        ]
      };
    }
  },

  // ====================================== AI & MACHINE LEARNING ======================================
  {
    id: 'ai-usage-cost',
    name: 'AI Usage Cost Calculator',
    slug: 'ai-usage-cost',
    category: 'ai',
    description: 'Project monthly AI API charges based on prompt triggers, completion lengths, and distinct model prices.',
    formula: 'Monthly AI cost = API Prompt Count * (Prompt rate * Prompt tokens + Completion rate * Completion tokens)',
    explanation: 'Exposes financial parameters of deploying generative systems by tracking usage frequencies and distinct LLM pricing schedules.',
    example: 'Evaluating 100,000 monthly API calls on Gemini with 500 input and 200 output tokens yields a $17.50 billing total.',
    inputs: [
      { id: 'monthlyRequests', label: 'Average Monthly API Requests', type: 'number', defaultValue: 50000, min: 100, step: 1000 },
      { id: 'promptTokens', label: 'Average Input Tokens Per Prompt', type: 'number', defaultValue: 450, min: 10 },
      { id: 'completionTokens', label: 'Average Output Tokens Per Prompt', type: 'number', defaultValue: 150, min: 10 },
      { id: 'rateMode', label: 'Model Provider Pricing Preset', type: 'select', defaultValue: 'geminiFlash', options: [
        { label: 'Gemini Flash ($0.075 / $0.3 per M tokens)', value: 'geminiFlash' },
        { label: 'Gemini Pro ($0.350 / $1.05 per M tokens)', value: 'geminiPro' },
        { label: 'Legacy Large LLM ($2.500 / $10.0 per M tokens)', value: 'legacy' }
      ]}
    ],
    faq: [
      { question: 'What is a Token in AI APIs?', answer: 'A token is an operational fragment of a text character set. As a rule of thumb, 100 English words map directly to approximately 130 tokens.' }
    ],
    relatedSlugs: ['ai-token', 'ai-model-size'],
    seoTitle: 'LLM API Token Monthly Sizing & Cost Calculator',
    seoDescription: 'Estimate monthly generative endpoint bills based on custom character sizing, tokens, and model rates.',
    calculate: (inputs) => {
      const reqs = Number(inputs.monthlyRequests || 50000);
      const prTokens = Number(inputs.promptTokens || 450);
      const compTokens = Number(inputs.completionTokens || 150);
      const mode = String(inputs.rateMode || 'geminiFlash');
      
      let ratePr = 0.075 / 1000000;
      let rateComp = 0.3 / 1000000;
      
      if (mode === 'geminiPro') {
        ratePr = 0.35 / 1000000;
        rateComp = 1.05 / 1000000;
      } else if (mode === 'legacy') {
        ratePr = 2.50 / 1000000;
        rateComp = 10.0 / 1000000;
      }
      
      const prCost = reqs * prTokens * ratePr;
      const compCost = reqs * compTokens * rateComp;
      const totalCost = prCost + compCost;
      return {
        results: [
          { label: 'Estimated Monthly Bill', value: '$' + totalCost.toFixed(2), isPrimary: true },
          { label: 'Input Promo Sizer Fee', value: '$' + prCost.toFixed(3) },
          { label: 'Output Reply Sizer Fee', value: '$' + compCost.toFixed(3) }
        ],
        chartData: [
          { name: 'Input Sizer', value: prCost },
          { name: 'Output Yield', value: compCost }
        ]
      };
    }
  },
  {
    id: 'ai-token',
    name: 'AI Token Calculator',
    slug: 'ai-token',
    category: 'ai',
    description: 'Convert words, paragraphs, or characters to estimated tokens using standard Tiktoken rules.',
    formula: 'Tokens = Words Volume * 1.33\nCharacters = Words Volume * 4.8',
    explanation: 'Ensures accurate input sizes before routing content streams to deep learning context windows.',
    example: 'Writing a 1,500-word blog post translates into about 2,000 sub-word language tokens.',
    inputs: [
      { id: 'words', label: 'Inputs Text Word Count', type: 'number', defaultValue: 800, min: 1 }
    ],
    faq: [
      { question: 'Why does token count exceed word count?', answer: 'Tokens representing parts of punctuation, prefixes, and word suffixes often slice complex words into multiple semantic parts.' }
    ],
    relatedSlugs: ['ai-usage-cost', 'ai-model-size'],
    seoTitle: 'Generative AI Word-to-Token Size Converter',
    seoDescription: 'Instantly convert paragraphs or lists of words into token sizes to prevent context window bloating.',
    calculate: (inputs) => {
      const w = Number(inputs.words || 800);
      const tok = Math.ceil(w * 1.3333);
      const chars = Math.ceil(w * 4.8);
      return {
        results: [
          { label: 'Estimated AI Tokens', value: tok.toLocaleString() + ' tokens', isPrimary: true },
          { label: 'Expected Total Characters', value: chars.toLocaleString() + ' chars' },
          { label: 'Percentage of 1M context window', value: ((tok / 1000000) * 100).toFixed(4) + '%' }
        ],
        chartData: [
          { name: 'Words count', value: w },
          { name: 'Tokens count', value: tok }
        ]
      };
    }
  },
  {
    id: 'ai-model-size',
    name: 'AI Model Size Calculator',
    slug: 'ai-model-size',
    category: 'ai',
    description: 'Calculate VRAM memory overhead for model inference and training based on parameter count, quantization bitwidth, and batch sizes.',
    formula: 'VRAM Required (GB) = (Model Parameters * Byte-Factor) * 1.2',
    explanation: 'Models hardware requirements for local machine learning. Highlights if a quantized model can fit inside standard NVIDIA desktop consumer GPUs.',
    example: 'A 7B parameter model loaded with 4-bit precision requires about 5.25 GB of VRAM.',
    inputs: [
      { id: 'params', label: 'Model Parameters (In Billions, e.g. 7B, 13B, 70B)', type: 'number', defaultValue: 7, min: 1, max: 200 },
      { id: 'bitWidth', label: 'Quantization Level Precision', type: 'select', defaultValue: 4, options: [
        { label: '4-bit Quantized (0.5 Bytes per param)', value: 0.5 },
        { label: '8-bit Quantized (1 Byte per param)', value: 1.0 },
        { label: 'FP16 Half-Precision (2 Bytes per param)', value: 2.0 },
        { label: 'FP32 Full-Precision (4 Bytes per param)', value: 4.0 }
      ]},
      { id: 'batchSize', label: 'Serving Batch Size Sizer', type: 'number', defaultValue: 1, min: 1, max: 128 }
    ],
    faq: [
      { question: 'What is Model Quantization?', answer: 'Quantization scales down the decimal float data representation (e.g., from 16 bits down to 4 bits) to save GPU memory at a minimal cost of cognitive accuracy.' }
    ],
    relatedSlugs: ['ai-compute', 'ai-usage-cost'],
    seoTitle: 'Local LLM GPU VRAM Capacity Sizer',
    seoDescription: 'Find when your system graphics cards can locally handle machine learning models using quantization multipliers.',
    calculate: (inputs) => {
      const p = Number(inputs.params || 7);
      const bw = Number(inputs.bitWidth || 4);
      const batch = Number(inputs.batchSize || 1);
      const modelWeightVRAM = p * bw;
      const contextVRAM = batch * 0.85; // rough context KV cache buffer
      const totals = (modelWeightVRAM + contextVRAM) * 1.25; // add 25% system driver overhead
      return {
        results: [
          { label: 'Estimated Total GPU VRAM Needed', value: totals.toFixed(2) + ' GB', isPrimary: true },
          { label: 'Static Network Weight Footprint', value: modelWeightVRAM.toFixed(2) + ' GB' },
          { label: 'KV Cache Serving Buffer', value: contextVRAM.toFixed(2) + ' GB' }
        ],
        chartData: [
          { name: 'System Weight', value: modelWeightVRAM },
          { name: 'Cache Buffer', value: contextVRAM }
        ]
      };
    }
  },
  {
    id: 'ai-compute',
    name: 'AI Compute Calculator',
    slug: 'ai-compute',
    category: 'ai',
    description: 'Estimate required Floating Point Operations (FLOPs) and server node weights to train machine learning systems.',
    formula: 'Training FLOPs = 6 * Parameters Count * Dataset Token Count',
    explanation: 'Uses AI research standard formulations to map massive pre-training token scales into standard computational FLOP counts and calendar hours across commercial GPU cluster configurations.',
    example: 'Training a 3B parameter model over 500 Billion tokens takes 9.0x10^21 FLOPs.',
    inputs: [
      { id: 'params', label: 'LLM Parameters count (Billions, e.g. 3B)', type: 'number', defaultValue: 3, min: 0.1 },
      { id: 'datasetTokens', label: 'Dataset tokens count (Billions)', type: 'number', defaultValue: 300, min: 1 },
      { id: 'gpuType', label: 'Cluster Graphics Processing hardware', type: 'select', defaultValue: 'h100', options: [
        { label: 'NVIDIA H100 (Peak ~700 TFLOPs active)', value: 700 },
        { label: 'NVIDIA A100 (Peak ~312 TFLOPs active)', value: 312 },
        { label: 'Consumer RTX 4090 (Peak ~83 TFLOPs active)', value: 83 }
      ]}
    ],
    faq: [
      { question: 'Why is the training multiplier (6) used?', answer: 'During training, 2 FLOPs are spent for the forward pass, and 4 FLOPs for the backward gradient calculation, scaling net operations to 6 * parameters.' }
    ],
    relatedSlugs: ['ai-model-size', 'ai-storage'],
    seoTitle: 'Pre-Training FLOPs & Clustering GPU Hours Calculator',
    seoDescription: 'Calculate aggregate computational operation requirements to schedule machine learning server leases.',
    calculate: (inputs) => {
      const p = Number(inputs.params || 3) * 1000000000;
      const t = Number(inputs.datasetTokens || 300) * 1000000000;
      const gpuPeak = Number(inputs.gpuType || 700) * 1000000000000;
      
      const flops = 6 * p * t;
      const hoursSingle = flops / (gpuPeak * 3600);
      return {
        results: [
          { label: 'Total Sizer FLOPs Needed', value: flops.toExponential(2), isPrimary: true },
          { label: 'Single GPU Runtime Hours', value: Math.ceil(hoursSingle).toLocaleString() + ' Hours' },
          { label: '8-Node Cluster Duration Date', value: (hoursSingle / 8).toFixed(1) + ' Hours' }
        ],
        chartData: [
          { name: 'Model Parameters', value: Number(inputs.params || 3) },
          { name: 'Aggregate Tokens (B)', value: Number(inputs.datasetTokens || 300) }
        ]
      };
    }
  },
  {
    id: 'ai-storage',
    name: 'AI Storage Calculator',
    slug: 'ai-storage',
    category: 'ai',
    description: 'Sizer database capacity for hosting raw text collections, training dataset tokens, or deep embedding vector indices.',
    formula: 'Vectors Sizer (GB) = Vector Dimension count * Records Count * Float Size Bytes / 1M',
    explanation: 'Sizes large vector search databases like Milvus, PGVector, or Pinecone, helping you choose the right indexing strategy.',
    example: 'Indexing 5,000,000 vectors with 1536 float dimensions requires approximately 30.72 GB of raw system memory.',
    inputs: [
      { id: 'recordsCount', label: 'Total Database Vector Records', type: 'number', defaultValue: 2000000, min: 1000, step: 10000 },
      { id: 'dimensions', label: 'Vector Feature Dimensions', type: 'select', defaultValue: 1536, options: [
        { label: '384 Dimensions (All MiniLM-L6)', value: 384 },
        { label: '768 Dimensions (Standard BERT / Gemini Small)', value: 768 },
        { label: '1536 Dimensions (Standard OpenAI text-embedding)', value: 1536 },
        { label: '3072 Dimensions (Advanced Gemini Large / text-3-large)', value: 3072 }
      ]}
    ],
    faq: [
      { question: 'What is vector dimension?', answer: 'A dimension represents an orientation axis in multi-dimensional space, indexing semantic context points extracted during neuron passes.' }
    ],
    relatedSlugs: ['ai-usage-cost', 'ai-compute'],
    seoTitle: 'Semantic Vector Database Memory Sizer',
    seoDescription: 'Weigh vector features and dataset records to layout storage limits on high-performance semantic search clusters.',
    calculate: (inputs) => {
      const recs = Number(inputs.recordsCount || 2000000);
      const dim = Number(inputs.dimensions || 1536);
      const rawBytes = recs * dim * 4; // FP32 is 4 bytes
      const rawGB = rawBytes / 1000000000;
      const indexOverheadGB = rawGB * 1.35; // HNSW index adds ~35% RAM footprint
      return {
        results: [
          { label: 'Total Server RAM Needed', value: indexOverheadGB.toFixed(2) + ' GB', isPrimary: true },
          { label: 'Raw Vector Size Sizer', value: rawGB.toFixed(2) + ' GB' },
          { label: 'Index Tree Overhead', value: (indexOverheadGB - rawGB).toFixed(2) + ' GB' }
        ],
        chartData: [
          { name: 'Raw Vector Space', value: rawGB },
          { name: 'Active Index Sizer', value: indexOverheadGB - rawGB }
        ]
      };
    }
  },

  // ====================================== DATA SCIENCE ======================================
  {
    id: 'data-storage',
    name: 'Data Storage Calculator',
    slug: 'data-storage-size',
    category: 'data-science',
    description: 'Budget disk and cloud partitions needed for big data analytics warehouses and logging lakes.',
    formula: 'Daily Sizing = Devices count * Logs Size Per Device Daily',
    explanation: 'Sizes dynamic enterprise system activity logs to calculate long-term, multi-year archival pools and replication levels.',
    example: 'A container farm with 500 nodes writing 500 MB of syslog information daily accrues 250 GB every day.',
    inputs: [
      { id: 'devices', label: 'Generating Nodes/Devices Count', type: 'number', defaultValue: 300, min: 1 },
      { id: 'sizePerDevice', label: 'Sizer Log Written Daily per Device (MB)', type: 'number', defaultValue: 250, min: 1 },
      { id: 'daysRetention', label: 'Hot Retention Window (Days)', type: 'number', defaultValue: 90, min: 1 }
    ],
    faq: [
      { question: 'What is hot vs cold tier data?', answer: 'Hot storage uses SSD memory for instant SQL query availability. Cold storage archives older data on magnetic media to slash ongoing cost metrics.' }
    ],
    relatedSlugs: ['database-size', 'data-growth'],
    seoTitle: 'Big Data Logs Lake Storage Capacity Sizer',
    seoDescription: 'Find when your big data pipeline requires cold partition offloads by tracking daily logs volumes and retention calendars.',
    calculate: (inputs) => {
      const dev = Number(inputs.devices || 300);
      const perAvg = Number(inputs.sizePerDevice || 250);
      const days = Number(inputs.daysRetention || 90);
      
      const dailyMB = dev * perAvg;
      const dailyGB = dailyMB / 1024;
      const totalPoolGB = dailyGB * days;
      return {
        results: [
          { label: 'Hot Storage Pool Size', value: totalPoolGB.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' GB', isPrimary: true },
          { label: 'Daily Accrued Sizer', value: dailyGB.toFixed(1) + ' GB/day' },
          { label: 'Expected Monthly Volume', value: (dailyGB * 30).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' GB' }
        ],
        chartData: [
          { name: 'Active Lake Storage', value: totalPoolGB }
        ]
      };
    }
  },
  {
    id: 'database-size',
    name: 'Database Size Calculator',
    slug: 'database-size',
    category: 'data-science',
    description: 'Estimate tabular database schema storage sizing based on row column byte widths.',
    formula: 'Row Byte Width = Sum (DataType Byte Sizes)\nTotal Schema Size = Row Byte Width * Records Count',
    explanation: 'Calculates physical sizing on traditional SQL engines (Postgres, MySQL) by building a mock representation of table cell datatypes.',
    example: 'A table with 5 integer fields, 2 uuid columns, and three status strings totaling 150 bytes per row takes 15 GB for 100 Million rows.',
    inputs: [
      { id: 'rowCount', label: 'Estimated Table Records Count', type: 'number', defaultValue: 10000000, min: 1000, step: 100000 },
      { id: 'colsCount', label: 'Average Columns count per Row', type: 'number', defaultValue: 15, min: 1 },
      { id: 'byteWidth', label: 'Average DataType Space size per Cell', type: 'select', defaultValue: 8, options: [
        { label: 'Small Int / Flag (2 Bytes)', value: 2 },
        { label: 'Standard Integers / Float (4 Bytes)', value: 4 },
        { label: 'BigInt / Standard Timestamps (8 Bytes)', value: 8 },
        { label: 'UUID / Hash strings / Text cells (32 Bytes)', value: 32 }
      ]}
    ],
    faq: [
      { question: 'Why does physical disk size exceed raw data bytes?', answer: 'Database servers create auxiliary B-Tree index structures, transactional WAL logs, and page padding boundaries to maintain indexing performance.' }
    ],
    relatedSlugs: ['data-storage-size', 'data-growth'],
    seoTitle: 'SQL Database Sizer & Tabular Engine Capacity Calculator',
    seoDescription: 'Size custom relational schemas by mapping column datatypes against records volumes.',
    calculate: (inputs) => {
      const rows = Number(inputs.rowCount || 10000000);
      const cols = Number(inputs.colsCount || 15);
      const bytes = Number(inputs.byteWidth || 8);
      
      const rawRowBytes = cols * bytes;
      const tableBytes = rows * rawRowBytes;
      const indexBytes = tableBytes * 0.4; // assume 40% index overhead
      const totalGB = (tableBytes + indexBytes) / 1000000000;
      return {
        results: [
          { label: 'Tabular Disk footprint Capacity', value: totalGB.toFixed(2) + ' GB', isPrimary: true },
          { label: 'Raw Data Bytes Size', value: (tableBytes / 1000000000).toFixed(2) + ' GB' },
          { label: 'B-Tree Indexes Index overhead', value: (indexBytes / 1000000000).toFixed(2) + ' GB' }
        ],
        chartData: [
          { name: 'Raw Data Cells', value: tableBytes / 1000000 },
          { name: 'Index Pointers', value: indexBytes / 1000000 }
        ]
      };
    }
  },
  {
    id: 'data-growth',
    name: 'Data Growth Calculator',
    slug: 'data-growth',
    category: 'data-science',
    description: 'Project dynamic database growth compounding expansions over time using historical expansion percentages.',
    formula: 'Future Volume = Starting Volume * (1 + Compounded Growth Rate) ^ Intervals',
    explanation: 'Uses financial-style interest compounding equations to trace long-range big data lakes capacity horizons.',
    example: 'Starting with a 20 TB archive compounding 2% monthly reaches 53.6 TB over a 4-year stretch.',
    inputs: [
      { id: 'startingVolume', label: 'Starting Total Data Sizer (TB)', type: 'number', defaultValue: 25, min: 1 },
      { id: 'annualGrowth', label: 'Annual Compound Sizer Growth Rate (%)', type: 'number', defaultValue: 25, min: 1, max: 200 }
    ],
    faq: [
      { question: 'What does CAGR mean for big data?', answer: 'CAGR (Compound Annual Growth Rate) evaluates the geometric progression rate that models physical corporate storage expanding over many consecutive years.' }
    ],
    relatedSlugs: ['data-storage-size', 'database-size'],
    seoTitle: 'Enterprise Data Lake Monthly CAGR Archival Sizer',
    seoDescription: 'Forecast future storage requirements by compounding database growth rates.',
    calculate: (inputs) => {
      const b = Number(inputs.startingVolume || 25);
      const grow = Number(inputs.annualGrowth || 25) / 100;
      const year5 = b * Math.pow(1 + grow, 5);
      return {
        results: [
          { label: 'Data Sizer expected in 5 Years', value: year5.toFixed(1) + ' TB', isPrimary: true },
          { label: 'Expected Year 1 Volume', value: (b * (1 + grow)).toFixed(1) + ' TB' },
          { label: 'Net Cumulative Growth expected', value: (year5 - b).toFixed(1) + ' TB' }
        ],
        chartData: [
          { name: 'Current Base', value: b },
          { name: 'Year 1 Step', value: b * (1+grow) },
          { name: 'Year 5 Peak', value: year5 }
        ]
      };
    }
  },
  {
    id: 'data-transfer',
    name: 'Data Transfer Calculator',
    slug: 'data-transfer-time',
    category: 'data-science',
    description: 'Calculate bandwidth, transfer time, and data size matching system updates.',
    formula: 'Transfer Hours = Data Size Bytes / (Bandwidth Speed Bits * Operational Slicing Coefficient / 8)',
    explanation: 'Sizers real-world network operations. Translates database backup sizing indices and network bitwidths into hard completion calendars.',
    example: 'Pushing a 4 TB directory over a steady 1 Gbps connection requires about 9 hours and 6 minutes.',
    inputs: [
      { id: 'dataSize', label: 'Total File directory Size (GB)', type: 'number', defaultValue: 1000, min: 1 },
      { id: 'lineSpeed', label: 'Active Link Network Bandwidth Speed (Mbps)', type: 'select', defaultValue: 100, options: [
        { label: '10 Mbps - Legacy Dial/DSL link', value: 10 },
        { label: '100 Mbps - Fast Ethernet Office link', value: 100 },
        { label: '1000 Mbps (1 Gbps) - Gigabit network', value: 1000 },
        { label: '10000 Mbps (10 Gbps) - Datacenter backbone', value: 10000 }
      ]}
    ],
    faq: [
      { question: 'Why does actual speed fall short of theoretical bandwidth?', answer: 'Protocol framing (TCP headers), network congestion, and storage write latency caps rarely let links reach 100% capacity.' }
    ],
    relatedSlugs: ['data-storage-size', 'data-growth'],
    seoTitle: 'Network Network Speed Transfer Time Sizer',
    seoDescription: 'Calculate the physical transfer duration of massive files across different network speeds.',
    calculate: (inputs) => {
      const sizeGB = Number(inputs.dataSize || 1000);
      const mbps = Number(inputs.lineSpeed || 100);
      
      const bitsToTransfer = sizeGB * 8000000000;
      const bitsPerSecond = mbps * 1000000 * 0.85; // assume 85% link utilization efficiency
      const seconds = bitsToTransfer / bitsPerSecond;
      const hours = seconds / 3600;
      
      const labelStr = hours > 24 ? (hours/24).toFixed(1) + ' Days' : hours.toFixed(1) + ' Hours';
      return {
        results: [
          { label: 'Estimated Transfer Duration', value: labelStr, isPrimary: true },
          { label: 'Effective Speed expected', value: (mbps * 0.85).toFixed(1) + ' Mbps', unit: 'mbps' },
          { label: 'Real Bytes Transferred per Hour', value: ((bitsPerSecond * 3600) / 8000000000).toFixed(1) + ' GB/hour' }
        ],
        chartData: [
          { name: 'Unutilized bandwidth cap', value: mbps * 0.15 },
          { name: 'Utilized transfer bandwidth', value: mbps * 0.85 }
        ]
      };
    }
  },
  {
    id: 'dataset-labeling',
    name: 'Dataset Sizer & Modeling Splitter',
    slug: 'dataset',
    category: 'data-science',
    description: 'Sizer labeling fees, samples, and training data boundary split ratios.',
    formula: 'Training Splits = Dataset size * 70%, Validation = 15%, Testing = 15%',
    explanation: 'Structured planning interface for research scientists calibrating machine learning runs, separating databases into optimized splits.',
    example: 'A dataset representing 250,000 files splits into 175,000 train samples, 37,500 validation, and 37,500 test records.',
    inputs: [
      { id: 'datasetRows', label: 'Cumulative Dataset Entry Count', type: 'number', defaultValue: 100000, min: 100 },
      { id: 'splitRatio', label: 'Partition Split Methodology', type: 'select', defaultValue: 'split70', options: [
        { label: 'Standard 70% / 15% / 15% Split Scheme', value: 'split70' },
        { label: 'Modern Large Scale 80% / 10% / 10% Scheme', value: 'split80' },
        { label: 'Traditional 60% / 20% / 20% Scheme', value: 'split60' }
      ]}
    ],
    faq: [
      { question: 'Why split the data?', answer: 'Training sets optimize the weights. Validation sets fine-tune network hyper-parameters. Testing sets verify the final real-world generalized accuracy.' }
    ],
    relatedSlugs: ['database-size', 'data-storage-size'],
    seoTitle: 'Machine Learning Training Dataset Partition Sizer',
    seoDescription: 'Divide your datasets into optimized training, validation, and testing sample splits.',
    calculate: (inputs) => {
      const rows = Number(inputs.datasetRows || 100000);
      const ratio = String(inputs.splitRatio || 'split70');
      let trPct = 0.7, vaPct = 0.15, tePct = 0.15;
      if (ratio === 'split80') { trPct = 0.8; vaPct = 0.1; tePct = 0.1; }
      else if (ratio === 'split60') { trPct = 0.6; vaPct = 0.2; tePct = 0.2; }
      return {
        results: [
          { label: 'Training Set Partition (Count)', value: Math.round(rows * trPct).toLocaleString() + ' rows', isPrimary: true },
          { label: 'Validation Set Partition', value: Math.round(rows * vaPct).toLocaleString() + ' rows' },
          { label: 'Target Testing Validation', value: Math.round(rows * tePct).toLocaleString() + ' rows' }
        ],
        chartData: [
          { name: 'Training subset', value: rows * trPct },
          { name: 'validation subset', value: rows * vaPct },
          { name: 'Testing subset', value: rows * tePct }
        ]
      };
    }
  },

  // ====================================== ENGINEERING ======================================
  {
    id: 'engineering-material',
    name: 'Engineering Material Calculator',
    slug: 'engineering-material',
    category: 'engineering',
    description: 'Calculate absolute volumetric mass structures and shipping weights based on material selection.',
    formula: 'Weight (kg) = Volume (M^3) * Specific Material Gravity Density',
    explanation: 'Models specific density coefficients for structural substances (aluminum, steel, brass, glass, concrete) to plan shipping sizes.',
    example: 'An engineering column of aluminum (2700 kg/m^3) measuring 0.5 cubic meters weighs 1,350 kilograms.',
    inputs: [
      { id: 'volm', label: 'Substance Net Volume (Cubic Meters)', type: 'number', defaultValue: 0.25, min: 0.01, step: 0.01 },
      { id: 'materialDensity', label: 'Material Substance Density Preset', type: 'select', defaultValue: 7850, options: [
        { label: 'Structural Steel (Density ~7850 kg/m^3)', value: 7850 },
        { label: 'Industrial Aluminum (Density ~2700 kg/m^3)', value: 2700 },
        { label: 'Premium Copper Alloys (Density ~8960 kg/m^3)', value: 8960 },
        { label: 'Standard Cured Concrete (Density ~2400 kg/m^3)', value: 2400 }
      ]}
    ],
    faq: [
      { question: 'Why does volumetric weight matter in shipping?', answer: 'Carriers use the physical volume alongside dead weight to determine cargo fuel and handling costs.' }
    ],
    relatedSlugs: ['structural-safety', 'load-calculator'],
    seoTitle: 'Volumetric Mass & Material Weight Calculator',
    seoDescription: 'Find shipping weights for design components by adjusting substance coefficients and volumes.',
    calculate: (inputs) => {
      const vol = Number(inputs.volm || 0.25);
      const density = Number(inputs.materialDensity || 7850);
      const mass = vol * density;
      return {
        results: [
          { label: 'Calculated Net Weight', value: mass.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' kg', isPrimary: true },
          { label: 'Equivalent Weight in Pounds', value: (mass * 2.20462).toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' lbs' }
        ],
        chartData: [
          { name: 'Structural Sizing Mass', value: mass }
        ]
      };
    }
  },
  {
    id: 'structural-safety',
    name: 'Structural Safety Calculator',
    slug: 'structural-safety',
    category: 'engineering',
    description: 'Calculate material factor-of-safety rating based on ultimate load limit vs operational load.',
    formula: 'Factor of Safety (FoS) = Ultimate Material Stress Capability / Actual Structural Working Stress',
    explanation: 'Safety benchmarks configured for structural engineering, ensuring physical components safely withstand peaks.',
    example: 'An ultimate yield stress threshold of 350 MPa under an actual operational stress load of 100 MPa yields a Factor of Safety of 3.50.',
    inputs: [
      { id: 'ultimateStress', label: 'Ultimate Material Stress Limitation (MPa)', type: 'number', defaultValue: 400, min: 10 },
      { id: 'workingStress', label: 'Expected Max Working Stress (MPa)', type: 'number', defaultValue: 150, min: 1 }
    ],
    faq: [
      { question: 'What is a typical design Factor of Safety?', answer: 'Public elevator networks require safety factors of 10-12. Standard buildings use safety factors of 2.0. Aerospace structures use tight safety factors of 1.25 to stay lightweight.' }
    ],
    relatedSlugs: ['engineering-material', 'load-calculator'],
    seoTitle: 'Factor of Safety & Stress Resilience Calculator',
    seoDescription: 'Benchmark structural integrity thresholds by checking ultimate stresses against max design operating loads.',
    calculate: (inputs) => {
      const ult = Number(inputs.ultimateStress || 400);
      const work = Number(inputs.workingStress || 150);
      const fos = ult / work;
      const pass = fos >= 1.5;
      return {
        results: [
          { label: 'Factor of Safety (FoS)', value: fos.toFixed(2), isPrimary: true },
          { label: 'Structural Verdict Evaluation', value: pass ? 'Resilient / Approved' : 'FAIL - Below Safety standard' },
          { label: 'Operational Stress Margin', value: (ult - work) + ' MPa extra headroom' }
        ],
        chartData: [
          { name: 'Working Stress', value: work },
          { name: 'Headroom Margin', value: Math.max(0, ult - work) }
        ]
      };
    }
  },
  {
    id: 'load-calculator',
    name: 'Load & Moment Calculator',
    slug: 'load',
    category: 'engineering',
    description: 'Calculate structural bending moments, shear forces, and point-bending load capacities for beams.',
    formula: 'Bending Moment (M) = Point Load Force * Segment Length (for cantilever setups)',
    explanation: 'Sizes deflection variables in cantilever structures. Helps mechanics and carpenters plan timber joists and metal framing limits.',
    example: 'Placing a 500 N force on a 4-meter cantilever beam generates a maximum moment of 2,000 N-m at the root support.',
    inputs: [
      { id: 'pointForce', label: 'Exerted Point Load Force (Newtons)', type: 'number', defaultValue: 800, min: 1 },
      { id: 'beamLength', label: 'Lever / Beam Physical Length (meters)', type: 'number', defaultValue: 3, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'How is a cantilevering beam shaped?', answer: 'A cantilever beam is fixed at only one end, forcing the opposite end to hang unsupported. Bending stresses maximize at the fixed base.' }
    ],
    relatedSlugs: ['engineering-material', 'structural-safety'],
    seoTitle: 'Structural Bending Moment Leverage Sizer',
    seoDescription: 'Measure physical load distributions and maximum shearing moments in cantilever framing components.',
    calculate: (inputs) => {
      const force = Number(inputs.pointForce || 800);
      const len = Number(inputs.beamLength || 3);
      const maxMoment = force * len;
      return {
        results: [
          { label: 'Maximum Bending Moment', value: maxMoment.toLocaleString() + ' N·m', isPrimary: true },
          { label: 'Shearing Force at Support', value: force.toLocaleString() + ' Newtons' },
          { label: 'Equivalent Moment in Foot-Pounds', value: Math.round(maxMoment * 0.73756) + ' lb·ft' }
        ],
        chartData: [
          { name: 'Length Step 1', value: force * (len / 3) },
          { name: 'Length Step 2', value: force * (len * 2 / 3) },
          { name: 'Root Support Max', value: maxMoment }
        ]
      };
    }
  },
  {
    id: 'thermal-calculator',
    name: 'Thermal Heat Transfer Calculator',
    slug: 'thermal',
    category: 'engineering',
    description: 'Calculate heat conduction rate across physical insulation obstacles and wall barriers.',
    formula: 'Heat Transfer Rate (Q) = (Conduction Coefficient * Area * Temperature Delta) / Barrier thickness',
    explanation: 'Uses Fourier\'s heat conduction law to size building thermal pathways, optimizing thermodynamic layers in construction.',
    example: 'A glass panel (conduction 1.05) measuring 3 sqm with 15C delta across 0.005m thickness passes 9,450 Watts of energy.',
    inputs: [
      { id: 'conduc', label: 'Material Thermal Conductivity (K-value W/m*K)', type: 'select', defaultValue: 0.04, options: [
        { label: 'Glass wool insulation (k ~0.04)', value: 0.04 },
        { label: 'Clay Bricks / Masonry (k ~0.80)', value: 0.8 },
        { label: 'Glass pane structural (k ~1.05)', value: 1.05 },
        { label: 'Raw steel alloy (k ~50.0)', value: 50.0 }
      ]},
      { id: 'areaSq', label: 'Total Surface Exposure Area (Sqm)', type: 'number', defaultValue: 20, min: 0.1 },
      { id: 'tempDelta', label: 'Temperature Gradient Delta (Kelvin / C)', type: 'number', defaultValue: 12, min: 1 },
      { id: 'thicknessM', label: 'Barrier Physical Thickness (meters)', type: 'number', defaultValue: 0.15, min: 0.001, step: 0.005 }
    ],
    faq: [
      { question: 'What does a high K-value mean?', answer: 'A high K-value signals high thermal conduction (like metals), meaning heat rapidly escapes. Low K-values signify excellent insulation properties (like fiberglass).' }
    ],
    relatedSlugs: ['engineering-material', 'structural-safety'],
    seoTitle: 'Dynamic Wall Heat Conduction Transfer Sizer',
    seoDescription: 'Measure building heat losses and energy insulation dynamics by adjusting thicknesses and conductivity parameters.',
    calculate: (inputs) => {
      const k = Number(inputs.conduc || 0.04);
      const area = Number(inputs.areaSq || 20);
      const delta = Number(inputs.tempDelta || 12);
      const thick = Number(inputs.thicknessM || 0.15);
      
      const heatLossW = (k * area * delta) / thick;
      return {
        results: [
          { label: 'Conductive Heat Flux (Loss)', value: heatLossW.toFixed(1) + ' Watts', isPrimary: true },
          { label: 'Material R-value (Insulation Rating)', value: (thick / k).toFixed(3) + ' m²·K/W' },
          { label: 'Hourly BTU escape loss equivalent', value: Math.round(heatLossW * 3.41214) + ' BTU/hr' }
        ],
        chartData: [
          { name: 'Heat loss rate', value: heatLossW }
        ]
      };
    }
  }
];
