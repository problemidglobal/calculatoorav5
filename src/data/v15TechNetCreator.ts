import { Calculator } from '../types';

export const V15_TECH_NET_CREATOR_CALCULATORS: Calculator[] = [
  // PROGRAMMING
  {
    id: 'v15-code-size',
    name: 'Code Size Calculator',
    slug: 'v15-code-size-calculator',
    category: 'programming',
    description: 'Calculate the physical storage size of source code repositories based on lines of code and character counts.',
    seoTitle: 'Programming Source Code Size & Storage Solver',
    seoDescription: 'Accurately estimate code base sizes in megabytes. Convert raw lines of code and average characters to find storage requirements.',
    inputs: [
      { id: 'linesOfCode', label: 'Lines of Code (LOC)', type: 'number', defaultValue: 50000 },
      { id: 'charsPerLine', label: 'Average Characters per Line', type: 'number', defaultValue: 35 }
    ],
    formula: 'File Size (Bytes) = Lines of Code * Average Characters per Line',
    explanation: 'Uncompressed source code files are standardly stored in UTF-8 or ASCII encoding, where each character consumes exactly 1 byte of storage.',
    example: 'A repository with 50,000 lines of code averaging 35 characters per line results in an uncompressed disk size of approximately 1.75 Megabytes.',
    faq: [
      { question: 'Why does GitHub code size look different than this?', answer: 'GitHub displays repository size including the compressed history database (.git directory), which tracks all historical changes.' },
      { question: 'Does compiling code reduce its storage size?', answer: 'Yes! Bundlers and compilers strip comments and optimize variable names, often reducing overall file size.' }
    ],
    relatedSlugs: ['v15-code-cost-calculator', 'v15-database-storage-calculator'],
    calculate: (inputs) => {
      const loc = Number(inputs.linesOfCode || 1000);
      const chars = Number(inputs.charsPerLine || 30);

      const sizeBytes = loc * chars;
      const sizeKb = sizeBytes / 1024;
      const sizeMb = sizeKb / 1024;

      return {
        results: [
          { label: 'Uncompressed Code Size', value: sizeMb >= 10 ? `${sizeMb.toFixed(2)} MB` : `${sizeKb.toFixed(2)} KB`, isPrimary: true },
          { label: 'Exact Bytes Count', value: `${sizeBytes.toLocaleString()} Bytes` },
          { label: 'Average Characters count', value: (loc * chars).toLocaleString() }
        ],
        chartData: [
          { name: 'Estimated Bytes', value: sizeBytes },
          { name: 'Base KiloBytes', value: Math.round(sizeKb) }
        ]
      };
    }
  },
  {
    id: 'v15-code-cost',
    name: 'Code Cost Calculator',
    slug: 'v15-code-cost-calculator',
    category: 'programming',
    description: 'Calculate the approximate cost of software development based on lines of code and average engineer compensation rates.',
    seoTitle: 'Software Development Code Cost Estimator',
    seoDescription: 'Estimate the cost of developing a software project. Balance lines of code, daily developer speed, and wages to find overall costs.',
    inputs: [
      { id: 'linesOfCode', label: 'Expected Lines of Code (LOC)', type: 'number', defaultValue: 10000 },
      { id: 'dailyCodePace', label: 'Average Code Written (LOC / Day)', type: 'number', defaultValue: 120, helpText: 'Typically 100-150 for robust, tested systems' },
      { id: 'engineerSalary', label: 'Average Developer Salary ($ / Yr)', type: 'number', defaultValue: 120000 }
    ],
    formula: 'Cost = (Lines of Code / Daily Pace) * Daily Wage Rate',
    explanation: 'While raw lines of code are not a perfect measure of complexity, this comparison provides a helpful baseline for managing cost structures on large enterprise builds.',
    example: 'Developing a 10,000 LOC system at a pace of 120 LOC daily with a developer salary of $120,000 translates to an estimated development cost of exactly $38,461.',
    faq: [
      { question: 'Why does daily LOC velocity seem low?', answer: 'Quality coding requires extensive planning, architecture design, structural refactoring, and code reviews, which limits raw LOC output.' },
      { question: 'Does including external libraries reduce costs?', answer: 'Yes! Leveraging open-source modules saves countless hours, allowing teams to focus on custom features.' }
    ],
    relatedSlugs: ['v15-dev-estimate-calculator', 'v15-software-project-calculator'],
    calculate: (inputs) => {
      const loc = Number(inputs.linesOfCode || 1000);
      const pace = Number(inputs.dailyCodePace || 100);
      const salary = Number(inputs.engineerSalary || 100000);

      const daysRequired = loc / pace;
      const dailyWage = salary / 260; // 260 working days per year
      const totalCost = daysRequired * dailyWage;

      return {
        results: [
          { label: 'Estimated Engineering Cost', value: `$${Math.round(totalCost).toLocaleString()}`, isPrimary: true },
          { label: 'Total Developer Days Required', value: `${Math.ceil(daysRequired)} working days` },
          { label: 'Average Developer Wage / Day', value: `$${Math.round(dailyWage)}` }
        ],
        chartData: [
          { name: 'Developer Cost', value: Math.round(totalCost) },
          { name: 'Annual standard salary', value: salary }
        ]
      };
    }
  },
  {
    id: 'v15-dev-estimate',
    name: 'Development Estimate Calculator',
    slug: 'v15-dev-estimate-calculator',
    category: 'programming',
    description: 'Calculate project delivery timelines and developer hours using standard three-point estimation models.',
    seoTitle: 'Three-Point Software Development Estimator',
    seoDescription: 'Generate software estimates with three-point math (PERT). Input optimistic, realistic, and pessimistic hours to manage scope creep.',
    inputs: [
      { id: 'optimisticHours', label: 'Optimistic Estimate (Hours)', type: 'number', defaultValue: 40 },
      { id: 'nominalHours', label: 'Most Likely Estimate (Hours)', type: 'number', defaultValue: 60 },
      { id: 'pessimisticHours', label: 'Pessimistic Estimate (Hours)', type: 'number', defaultValue: 120 }
    ],
    formula: 'Expected Value (E) = (Optimistic + 4*Nominal + Pessimistic) / 6\nStandard Deviation (SD) = (Pessimistic - Optimistic) / 6',
    explanation: 'Software estimates are prone to optimistic bias. Use the PERT three-point method to weight realistic and pessimistic outcomes, helping to avoid project delays.',
    example: 'With estimates of 40 hours (optimistic), 60 hours (nominal), and 120 hours (pessimistic), the expected PERT estimation is 66.67 hours with a standard deviation of 13.33 hours.',
    faq: [
      { question: 'What does PERT stand for?', answer: 'Program Evaluation and Review Technique, a project management methodology designed to estimate timelines under high uncertainty.' },
      { question: 'Why is the pessimistic pessimistic value weighted?', answer: 'Software development regularly uncovers unexpected edge cases and third-party API issues, which can delay targets.' }
    ],
    relatedSlugs: ['v15-code-cost-calculator', 'v15-software-project-calculator'],
    calculate: (inputs) => {
      const opt = Number(inputs.optimisticHours || 0);
      const nom = Number(inputs.nominalHours || 0);
      const pes = Number(inputs.pessimisticHours || 0);

      const expected = (opt + 4 * nom + pes) / 6;
      const sd = (pes - opt) / 6;

      return {
        results: [
          { label: 'Expected Project Timeline (PERT)', value: `${expected.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Timeline Buffer Variance (Daily SD)', value: `± ${sd.toFixed(1)} Hours` },
          { label: 'Safe Commitment Delivery Buffer', value: `${(expected + 2 * sd).toFixed(1)} Hours (95% Safety)` }
        ],
        chartData: [
          { name: 'Optimistic', value: opt },
          { name: 'Expected', value: Math.round(expected) },
          { name: 'Pessimistic', value: pes }
        ]
      };
    }
  },
  {
    id: 'v15-software-project',
    name: 'Software Project Planner',
    slug: 'v15-software-project-calculator',
    category: 'programming',
    description: 'Calculate team capacity, sprints, and necessary engineers to hit target release deadlines.',
    seoTitle: 'Agile Software Project Delivery Planner',
    seoDescription: 'Plan agile software projects. Calculate sprint capacities, target velocities, and team sizes to ship features on time.',
    inputs: [
      { id: 'totalBacklogPoints', label: 'Total Backlog Effort (Story Points)', type: 'number', defaultValue: 150 },
      { id: 'sprintVelocity', label: 'Average Team Velocity (Points / Sprint)', type: 'number', defaultValue: 25 },
      { id: 'weeksPerSprint', label: 'Sprint Duration (Weeks)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Sprints Needed = Total Backlog Points / Team Sprint Velocity\nTimeline (Weeks) = Sprints Needed * Sprint Duration',
    explanation: 'Dividing your product backlog by your team\'s proven sprint velocity provides a reliable delivery timeframe, replacing speculative launch dates with empirical projections.',
    example: 'Delivering a backlog of 150 story points at a velocity of 25 points per sprint requires exactly 6 sprints, translating to a 12-week timeline.',
    faq: [
      { question: 'What is agile story scaling?', answer: 'A comparative sizing method (often using Fibonacci sequences) to estimate product backlog complexity without using raw hour counts.' },
      { question: 'How do we fix a declining sprint velocity?', answer: 'Minimize multi-tasking, define clear deliverables before starting, and address technical debt early to prevent friction.' }
    ],
    relatedSlugs: ['v15-dev-estimate-calculator', 'v15-code-cost-calculator'],
    calculate: (inputs) => {
      const points = Number(inputs.totalBacklogPoints || 1);
      const vel = Number(inputs.sprintVelocity || 1);
      const wps = Number(inputs.weeksPerSprint || 2);

      const sprints = vel > 0 ? points / vel : 0;
      const totalWeeks = sprints * wps;

      return {
        results: [
          { label: 'Overall Project Duration', value: `${totalWeeks.toFixed(1)} Weeks (${sprints.toFixed(1)} Sprints)`, isPrimary: true },
          { label: 'Sprints Needed to Ship', value: `${Math.ceil(sprints)} Sprints` },
          { label: 'Target Completion Date Range', value: `${Math.ceil(totalWeeks * 7)} Days` }
        ],
        chartData: [
          { name: 'Backlog Points', value: points },
          { name: 'Sprint Velocity', value: vel }
        ]
      };
    }
  },
  {
    id: 'v15-database-storage',
    name: 'Database Storage Calculator',
    slug: 'v15-database-storage-calculator',
    category: 'programming',
    description: 'Calculate database index and storage size development over months based on payload sizes and table growth rates.',
    seoTitle: 'Database Storage Capacity Growth Estimator',
    seoDescription: 'Model database storage capacity needs. Factor in monthly customer growth and transaction log sizes over long-term timelines.',
    inputs: [
      { id: 'rowSize', label: 'Average Row Payload Size (Bytes)', type: 'number', defaultValue: 1200, helpText: 'User profiles typical 500-2000 Bytes' },
      { id: 'monthlyRows', label: 'New Rows Generated per Month', type: 'number', defaultValue: 250000 },
      { id: 'growthRate', label: 'Expected Monthly Account Growth (%)', type: 'number', defaultValue: 4.0 }
    ],
    formula: 'Monthly Storage Growth = Row Size * New Rows\nCompounded targets are calculated over a five-year horizon.',
    explanation: 'Estimating database storage growth helps you scale database instances, budget for storage costs, and plan partitioning schemes before disk space is depleted.',
    example: 'Growing at a 4.0% rate with an average row size of 1.2 KB and 250,000 monthly transactions will consume 21.05 Gigabytes of storage by Year 3.',
    faq: [
      { question: 'Why does physical database storage exceed raw data sizes?', answer: 'Database engines use extra disk space for indexes to accelerate queries, transaction write-ahead logs, and page padding.' },
      { question: 'How can we optimize database storage sizes?', answer: 'Archive old logs periodically, choose compact data structures (such as integer flags instead of strings), and use data compression.' }
    ],
    relatedSlugs: ['v15-code-size-calculator', 'v15-json-size-calculator'],
    calculate: (inputs) => {
      const row = Number(inputs.rowSize || 500);
      let volume = Number(inputs.monthlyRows || 10000);
      const rate = Number(inputs.growthRate || 0) / 100;

      let totalBytesAccum = 0;
      // Compounded over 36 months (3 Years)
      for (let m = 1; m <= 36; m++) {
        totalBytesAccum += volume * row;
        volume = volume * (1 + rate);
      }

      const totalGb = totalBytesAccum / (1024 * 1024 * 1024);

      return {
        results: [
          { label: 'Year 3 Database Storage Target', value: `${totalGb.toFixed(2)} GB`, isPrimary: true },
          { label: 'Monthly Storage Growth (Start)', value: `${((volume * row) / (1024 * 1024)).toFixed(2)} MB / Month` },
          { label: 'Estimated Total Assets Count', value: `${Math.round(volume * 36).toLocaleString()} Records` }
        ],
        chartData: [
          { name: 'Year 3 Storage (GB)', value: Math.round(totalGb) },
          { name: 'Baseline', value: 10 }
        ]
      };
    }
  },
  {
    id: 'v15-json-size',
    name: 'JSON Payload Size Calculator',
    slug: 'v15-json-size-calculator',
    category: 'programming',
    description: 'Calculate the uncompressed and compressed network transfer size of JSON objects based on character lengths.',
    seoTitle: 'JSON Network Payload & Transfer Size Solver',
    seoDescription: 'Check JSON payload sizes. Input raw characters to calculate uncompressed bytes and estimate GZIP transfer compression rates.',
    inputs: [
      { id: 'jsonCharsCount', label: 'JSON String Characters Count', type: 'number', defaultValue: 150000 }
    ],
    formula: 'Uncompressed Size = Character count * 1 Byte (in UTF-8)\nEstimated GZIP compressed size = Uncompressed Size * 0.35',
    explanation: 'JSON payloads are highly repetitive, allowing compression tools like GZIP or Brotli to reduce payload sizes by up to 65% for network transfer.',
    example: 'A JSON payload with 150,000 characters has an uncompressed size of 146.48 KB, which GZip compresses down to approximately 51.27 KB for transfer.',
    faq: [
      { question: 'Why does UTF-8 consume 1 byte per character?', answer: 'The standard ASCII character set uses 1 byte per character, but special characters (like emojis) can use up to 4 bytes.' },
      { question: 'Does formatting JSON affect transfer speeds?', answer: 'Formatting JSON with indentation and spaces adds unnecessary bytes, which is why API responses are minified.' }
    ],
    relatedSlugs: ['v15-database-storage-calculator', 'v15-api-data-calculator'],
    calculate: (inputs) => {
      const chars = Number(inputs.jsonCharsCount || 0);

      const bytes = chars;
      const kb = bytes / 1024;
      const gzipBytes = bytes * 0.35; // typical 65% compression ratio for JSON
      const gzipKb = gzipBytes / 1024;

      return {
        results: [
          { label: 'Uncompressed Payload Size', value: `${kb.toFixed(2)} KB`, isPrimary: true },
          { label: 'Estimated GZIP Payload Size', value: `${gzipKb.toFixed(2)} KB (65% Compression)`, isPrimary: true },
          { label: 'Savings for Server band', value: `${(kb - gzipKb).toFixed(2)} KB` }
        ],
        chartData: [
          { name: 'Compressed Size', value: Math.round(gzipBytes) },
          { name: 'Siphoned Redundant', value: Math.round(bytes - gzipBytes) }
        ]
      };
    }
  },
  {
    id: 'v15-api-data',
    name: 'API Data Usage Calculator',
    slug: 'v15-api-data-calculator',
    category: 'programming',
    description: 'Calculate the total daily and monthly network bandwidth bandwidth required by your web API based on request volume.',
    seoTitle: 'REST API Network Bandwidth Usage Estimator',
    seoDescription: 'Obtain estimated API data consumption targets. Enter daily request volumes and average payload sizes to budget network costs.',
    inputs: [
      { id: 'dailyApiCalls', label: 'Average Daily API Requests', type: 'number', defaultValue: 500000 },
      { id: 'avgPayloadKb', label: 'Average Payload Size per Request (KB)', type: 'number', defaultValue: 12 }
    ],
    formula: 'Daily Data Usage = Requests * Payload Size\nMonthly Data Usage = Daily Data * 30.4',
    explanation: 'Monitoring API data consumption helps you optimize server locations, manage content delivery budgets, and select appropriate server plans.',
    example: 'Serving 500,000 daily requests averaging 12 KB in payload size consumes exactly 5.72 Gigabytes of network bandwidth daily, totaling 173.9 Gigabytes monthly.',
    faq: [
      { question: 'How can we minimize API bandwidth costs?', answer: 'Implement response caching, return partial datasets (pagination), and use compressed formats like Protocol Buffers instead of raw JSON.' },
      { question: 'Why does client data usage look higher than this?', answer: 'Client data includes browser overhead like request headers, SSL handshakes, cookies, and static stylesheet assets.' }
    ],
    relatedSlugs: ['v15-json-size-calculator', 'v15-download-bandwidth-calculator'],
    calculate: (inputs) => {
      const calls = Number(inputs.dailyApiCalls || 1000);
      const kb = Number(inputs.avgPayloadKb || 1);

      const dailyKb = calls * kb;
      const dailyGb = dailyKb / (1024 * 1024);
      const monthlyGb = dailyGb * 30.4;

      return {
        results: [
          { label: 'Monthly Network Bandwidth', value: `${monthlyGb.toFixed(2)} GB`, isPrimary: true },
          { label: 'Daily Data Bandwidth Outflow', value: `${dailyGb.toFixed(2)} GB / Day` },
          { label: 'Average Data Outflow / Second', value: `${((dailyKb * 1024) / 86400).toFixed(1)} Bytes / sec` }
        ],
        chartData: [
          { name: 'Daily Data (MB)', value: Math.round(dailyGb * 1024) }
        ]
      };
    }
  },

  // NETWORKING
  {
    id: 'v15-network-speed-test',
    name: 'Network Speed Test Calculator',
    slug: 'v15-network-speed-test-calculator',
    category: 'tech',
    description: 'Calculate and convert download and upload speeds across standard networking units like megabits (Mbps) and megabytes (MB/s).',
    seoTitle: 'Network Speed Conversion & Bandwidth Solvers',
    seoDescription: 'Convert megabits to megabytes. Calculate real network speeds and transfer capacities across different metric standards.',
    inputs: [
      { id: 'networkSpeedMbps', label: 'Network Connection Speed (Mbps)', type: 'number', defaultValue: 150 }
    ],
    formula: 'Speed (MB/s) = Speed (Mbps) / 8',
    explanation: 'Network speed is typically advertised in megabits per second (Mbps). However, file systems measure storage in megabytes (MB/s). Since 1 byte consists of 8 bits, we divide the Mbps value by 8 to find the real transfer speed.',
    example: 'A network speed of 150 Mbps translates to a maximum file transfer speed of exactly 18.75 Megabytes per second (MB/s).',
    faq: [
      { question: 'Why does Mbps differ from MB/s?', answer: 'Lowercase "b" stands for bits (used in network transmission rates), while uppercase "B" stands for bytes (used in storage and file sizing).' },
      { question: 'Why do I rarely reach my maximum theoretical speed?', answer: 'Real-world speeds are limited by network congestion, router overhead, Wi-Fi interference, and host server limits.' }
    ],
    relatedSlugs: ['v15-transfer-rate-calculator', 'v15-download-bandwidth-calculator'],
    calculate: (inputs) => {
      const mbps = Number(inputs.networkSpeedMbps || 100);

      const mbyts = mbps / 8;
      const hourMaxGigabytes = (mbyts * 3600) / 1024;

      return {
        results: [
          { label: 'Real-World File Transfer Speed', value: `${mbyts.toFixed(2)} MB/s`, isPrimary: true },
          { label: 'Hourly Theoretical Cap', value: `${hourMaxGigabytes.toFixed(2)} GB / Hour` },
          { label: 'Bit Value representation', value: `${(mbps * 1000).toLocaleString()} Kilobits / sec` }
        ],
        chartData: [
          { name: 'Megabits', value: mbps },
          { name: 'Megabytes', value: Math.round(mbyts * 8) }
        ]
      };
    }
  },
  {
    id: 'v15-transfer-rate',
    name: 'Network Transfer Rate Calculator',
    slug: 'v15-transfer-rate-calculator',
    category: 'tech',
    description: 'Calculate the time required to transfer files of custom sizes over specific network speeds.',
    seoTitle: 'Network File Transfer Duration Calculator',
    seoDescription: 'Estimate file transfer times. Input file sizes and network speeds to calculate the hours and minutes needed for completion.',
    inputs: [
      { id: 'fileSizeGb', label: 'Total File Size (GB)', type: 'number', defaultValue: 50 },
      { id: 'connectionSpeedMbps', label: 'Download Connection Speed (Mbps)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Transfer duration (Seconds) = (File Size in Bits) / (Connection Speed in Bits per Second)',
    explanation: 'This calculator converts your target file size into bits and divides it by your network speed to project the exact transfer timeline.',
    example: 'Transferring a 50 GB file over a 100 Mbps connection takes exactly 1 hour, 11 minutes, and 34 seconds.',
    faq: [
      { question: 'Does network packet loss affect transfer times?', answer: 'Yes! High packet loss triggers packet retransmissions, increasing your actual transfer times beyond theoretical estimates.' },
      { question: 'Why are fiber connections faster for uploads?', answer: 'Fiber connections provide symmetrical speeds, offering identical speeds for both download and upload files.' }
    ],
    relatedSlugs: ['v15-network-speed-test-calculator', 'v15-download-bandwidth-calculator'],
    calculate: (inputs) => {
      const sizeGb = Number(inputs.fileSizeGb || 1);
      const speedMbps = Number(inputs.connectionSpeedMbps || 10);

      const totalBits = sizeGb * 1024 * 1024 * 1024 * 8;
      const bps = speedMbps * 1000000;
      const seconds = totalBits / bps;

      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.round(seconds % 60);

      return {
        results: [
          { label: 'Total Transfer Duration', value: `${hrs}h ${mins}m ${secs}s`, isPrimary: true },
          { label: 'Overall Seconds Needed', value: `${Math.round(seconds).toLocaleString()} Seconds` },
          { label: 'Calculated Bandwidth efficiency', value: `${(speedMbps * 0.9).toFixed(1)} Mbps (Accounting for standard 10% network overhead)` }
        ],
        chartData: [
          { name: 'Transfer Time (Minutes)', value: Math.round(seconds / 60) }
        ]
      };
    }
  },
  {
    id: 'v15-download-bandwidth',
    name: 'Download Bandwidth Calculator',
    slug: 'v15-download-bandwidth-calculator',
    category: 'tech',
    description: 'Calculate the bandwidth needed to support seamless concurrent movie downloads or video streams.',
    seoTitle: 'Download Bandwidth & Streaming Capacity Calculator',
    seoDescription: 'Find the download bandwidth required for concurrent users. Budget internet capacities to prevent video streaming lag.',
    inputs: [
      { id: 'simultaneousUsers', label: 'Concurrent Connected Devices', type: 'number', defaultValue: 10 },
      { id: 'activityType', label: 'Average Streaming Activity', type: 'select', defaultValue: 'hd-stream', options: [
        { label: 'General browsing / emails (2 Mbps)', value: '2' },
        { label: 'HD 1080p Video Streaming (8 Mbps)', value: '8' },
        { label: '4K Ultra HD Video Streaming (25 Mbps)', value: '25' },
        { label: 'Competitive Online Gaming (15 Mbps)', value: '15' }
      ]}
    ],
    formula: 'Total Bandwidth Required = Connected Devices * Activity Bandwidth Rate',
    explanation: 'Sizing your network bandwidth based on concurrent devices ensures consistent performance, preventing buffering and lag.',
    example: 'Supporting 10 devices streaming 4K Ultra HD video simultaneously requires a minimum download connection speed of exactly 250 Mbps.',
    faq: [
      { question: 'What is a typical bandwidth requirement for a family of 4?', answer: 'A 200 Mbps connection is generally sufficient to support video streaming, gaming, and smart home devices for a family of four.' },
      { question: 'How is download different from upload speed?', answer: 'Download speed controls the rate web assets enter your device, while upload speed governs sending assets to remote servers.' }
    ],
    relatedSlugs: ['v15-network-speed-test-calculator', 'v15-upload-bandwidth-calculator'],
    calculate: (inputs) => {
      const devices = Number(inputs.simultaneousUsers || 1);
      const rate = Number(inputs.activityType || 8);

      const requiredMbps = devices * rate;

      return {
        results: [
          { label: 'Minimum Required Download Speed', value: `${requiredMbps} Mbps`, isPrimary: true },
          { label: 'Recommended Plan Tier', value: requiredMbps > 500 ? 'Enterprise Fiber' : requiredMbps >= 250 ? 'GigaSpeed Plus' : 'Standard Broadband' },
          { label: 'Target File Transfer Speed Equivalent', value: `${(requiredMbps / 8).toFixed(1)} MB/s` }
        ],
        chartData: [
          { name: 'Required Mbps', value: requiredMbps },
          { name: 'Standard Broadband Base', value: 100 }
        ]
      };
    }
  },
  {
    id: 'v15-upload-bandwidth',
    name: 'Upload Bandwidth Calculator',
    slug: 'v15-upload-bandwidth-calculator',
    category: 'tech',
    description: 'Calculate the upload bandwidth needed to support smooth remote video conferencing, screen sharing, and backups.',
    seoTitle: 'Remote Work Upload Bandwidth Capacity Estimator',
    seoDescription: 'Obtain required upload bandwidth targets. Enter concurrent Zoom calls and screen share plans to size your network uploads.',
    inputs: [
      { id: 'remoteZoomCalls', label: 'Concurrent HD Video Calls', type: 'number', defaultValue: 4 },
      { id: 'cloudBackupsCount', label: 'Active Concurrent Cloud Backups', type: 'number', defaultValue: 2 }
    ],
    formula: 'Upload Bandwidth = (Calls * 4 Mbps) + (Backups * 10 Mbps)',
    explanation: 'Uploading files or streams requires symmetric bandwidth allocation. Inadequate upload speeds can cause dropped calls and laggy presentation screens.',
    example: 'Running 4 HD video calls alongside 2 cloud backup streams simultaneously requires a minimum network upload speed of 36 Mbps.',
    faq: [
      { question: 'Why are cable upload speeds typically slow?', answer: 'Traditional cable companies use asymmetric lines (ADSL), allocating more channel capacity to downloads than uploads.' },
      { question: 'How much upload bandwidth does screen sharing require?', answer: 'Screen sharing requires between 1.5 and 4 Mbps of symmetric seed bandwidth, depending on target resolution and frame rates.' }
    ],
    relatedSlugs: ['v15-download-bandwidth-calculator', 'v15-network-speed-test-calculator'],
    calculate: (inputs) => {
      const calls = Number(inputs.remoteZoomCalls || 1);
      const backups = Number(inputs.cloudBackupsCount || 0);

      const reqUpload = (calls * 4) + (backups * 10);

      return {
        results: [
          { label: 'Minimum Required Upload Speed', value: `${reqUpload} Mbps`, isPrimary: true },
          { label: 'Critical Capacity Threshold', value: reqUpload >= 50 ? 'High Capacity Line Required' : 'Normal Residential ADSL Sufficient' },
          { label: 'Symmetric Fiber matching scale', value: `${reqUpload} Mbps (Upload)` }
        ],
        chartData: [
          { name: 'Video Call Volume Upload', value: calls * 4 },
          { name: 'Cloud Backups Upload', value: backups * 10 }
        ]
      };
    }
  },
  {
    id: 'v15-network-capacity',
    name: 'Network Capacity Calculator',
    slug: 'v15-network-capacity-calculator',
    category: 'tech',
    description: 'Calculate overall network throughput metrics and project maximum user support capacity on a shared subnet.',
    seoTitle: 'Subnet Network & Concurrent User Capacity Solver',
    seoDescription: 'Determine subnet user capacities. Calculate concurrent device thresholds based on maximum bandwidth limits.',
    inputs: [
      { id: 'totalPipeMbps', label: 'Total Network Pipe Capacity (Mbps)', type: 'number', defaultValue: 1000 },
      { id: 'quotaPerDevice', label: 'Target Device Bandwidth Quota (Mbps)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Host capacity = Total Pipe / Quota per Device',
    explanation: 'Sizing subnets ensures you don\'t overload local routers, helping to maintain high security and network performance across office floors.',
    example: 'A 1,000 Mbps network pipe limiting devices to a 15 Mbps quota can support up to 66 concurrent devices.',
    faq: [
      { question: 'What is a network pipe?', answer: 'The maximum data carrier bandwidth provided by your internet service provider (ISP).' },
      { question: 'Why apply bandwidth quotas to devices?', answer: 'Implementing local quotas prevents individual devices from hogging bandwidth, preserving network resources for all local users.' }
    ],
    relatedSlugs: ['v15-server-capacity-calculator', 'v15-network-speed-test-calculator'],
    calculate: (inputs) => {
      const pipe = Number(inputs.totalPipeMbps || 100);
      const quota = Number(inputs.quotaPerDevice || 1);

      const deviceCount = quota > 0 ? pipe / quota : 0;

      return {
        results: [
          { label: 'Subnet Device Capacity Limit', value: `${Math.floor(deviceCount)} Concurrent Devices`, isPrimary: true },
          { label: 'Shared Subnet Peak Throughput', value: `${(pipe * 0.95).toFixed(0)} Mbps (accounting for 5% IP overhead)` },
          { label: 'Optimal security subnet frame', value: '/24 standard subnet' }
        ],
        chartData: [
          { name: 'Subnet Cap', value: Math.floor(deviceCount) }
        ]
      };
    }
  },
  {
    id: 'v15-server-capacity',
    name: 'Server Capacity Calculator',
    slug: 'v15-server-capacity-calculator',
    category: 'tech',
    description: 'Calculate server user capacity limits based on CPU, memory, and database connection thresholds.',
    seoTitle: 'Cloud Server Scaling & Concurrent User Capacity Estimator',
    seoDescription: 'Obtain cloud server scale capacities. Balance active connection threads and memory limits to project horizontal scaling needs.',
    inputs: [
      { id: 'allocatedMemoryGb', label: 'Allocated Server RAM (GB)', type: 'number', defaultValue: 16 },
      { id: 'ramPerUserMb', label: 'RAM Allocated per Active Connection (MB)', type: 'number', defaultValue: 45 }
    ],
    formula: 'Server Capacity = (Server RAM * 1024) / RAM per User',
    explanation: 'Sizing server resources helps you configure auto-scaling thresholds, keeping your application responsive and preventing out-of-memory crashes during high traffic.',
    example: 'A 16 GB RAM server dedicating 45 MB per connection can support upwards of 364 concurrent active connections.',
    faq: [
      { question: 'What causes server out-of-memory (OOM) crashes?', answer: 'OOM crashes occur when active user connections or database models request more memory than the server has available.' },
      { question: 'How does horizontal scaling protect servers?', answer: 'Horizontal scaling spins up additional server instances in response to traffic spikes, distributing the load.' }
    ],
    relatedSlugs: ['v15-network-capacity-calculator', 'v15-database-storage-calculator'],
    calculate: (inputs) => {
      const ram = Number(inputs.allocatedMemoryGb || 4);
      const userMb = Number(inputs.ramPerUserMb || 20);

      const totalMb = ram * 1024;
      const connections = userMb > 0 ? totalMb / userMb : 0;

      return {
        results: [
          { label: 'Server Connection Capacity', value: `${Math.floor(connections)} Active Users`, isPrimary: true },
          { label: 'Server RAM Allocated', value: `${ram} GB` },
          { label: 'System Memory safety buffer', value: '1.2 GB reserved for OS services' }
        ],
        chartData: [
          { name: 'User Connection Threads', value: Math.floor(connections) }
        ]
      };
    }
  },

  // CONTENT CREATOR
  {
    id: 'v15-content-production-cost',
    name: 'Content Production Cost Calculator',
    slug: 'v15-content-production-cost-calculator',
    category: 'creator-tools',
    description: 'Calculate the true cost of producing a podcast, video asset, or social media post based on wages and editing rates.',
    seoTitle: 'Video & Media Content Production Cost Solver',
    seoDescription: 'Find your video production costs. Factor in labor hours, voiceover services, and editing rates to calculate cost-per-video.',
    inputs: [
      { id: 'creatorHours', label: 'Content Creator Hours per Video', type: 'number', defaultValue: 12 },
      { id: 'hourlyWageRate', label: 'Creator Hourly Rate / Wage ($/hr)', type: 'number', defaultValue: 35 },
      { id: 'assetsOutsourceCost', label: 'Outsourced asset Costs ($/video)', type: 'number', defaultValue: 150, helpText: 'Video editing, custom thumbnails' },
      { id: 'equipmentAmortization', label: 'Monthly Equipment Amortization ($)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Production Cost = (Creator Hours * Hourly Rate) + Outsourced Costs + Equipment Cost share',
    explanation: 'Calculating your content production costs helps you set fair advertising rates, secure sponsorships, and build a sustainable media business.',
    example: 'Spending 12 hours on a video at a rate of $35/hr, with $150 in outsourced editing and a $25 equipment-share, yields a cost of $595 per video.',
    faq: [
      { question: 'Should I calculate my own labor costs?', answer: 'Yes! Factoring in your own time at a realistic hour rate ensures your content creator business is genuinely profitable.' },
      { question: 'How is weekly equipment depreciation calculated?', answer: 'Divide the total cost of your gear (cameras, microphones, computer) by its expected useful lifespan in months.' }
    ],
    relatedSlugs: ['v15-creator-revenue-goal-calculator', 'v15-social-media-roi-calculator'],
    calculate: (inputs) => {
      const hrs = Number(inputs.creatorHours || 1);
      const rate = Number(inputs.hourlyWageRate || 25);
      const outsource = Number(inputs.assetsOutsourceCost || 0);
      const amort = Number(inputs.equipmentAmortization || 0) / 4; // approximate portion per video (assuming weekly)

      const costPerVideo = (hrs * rate) + outsource + amort;

      return {
        results: [
          { label: 'Total Cost per Video Asset', value: `$${costPerVideo.toFixed(2)}`, isPrimary: true },
          { label: 'Direct Creator Labor Cost', value: `$${(hrs * rate).toFixed(2)}` },
          { label: 'Required Views to Break Even', value: `${Math.ceil(costPerVideo / 0.005)} views (assuming a $5 CPM)` }
        ],
        chartData: [
          { name: 'Labor Cost', value: hrs * rate },
          { name: 'Outsourced Work', value: outsource },
          { name: 'Gear Depreciation', value: Math.round(amort) }
        ]
      };
    }
  },
  {
    id: 'v15-creator-revenue-goal',
    name: 'Creator Revenue Goal Calculator',
    slug: 'v15-creator-revenue-goal-calculator',
    category: 'creator-tools',
    description: 'Calculate the audience size, subscription volume, and advertisement views required to achieve your monthly revenue goals.',
    seoTitle: 'Digital Creator Revenue Goal & Income Planner',
    seoDescription: 'Map out your digital creator revenue. Estimate the views and subscription members needed to hit your monthly goals.',
    inputs: [
      { id: 'targetMonthlyRevenue', label: 'Desired Monthly Revenue ($)', type: 'number', defaultValue: 5000 },
      { id: 'avgCpmRate', label: 'Average Ad CPM Rate ($ per 1,000 views)', type: 'number', defaultValue: 4.5, step: 0.1 },
      { id: 'patreonPrice', label: 'Standard Monthly Subscription Price ($)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Required Views = (Target Revenue / CPM) * 1000\nSubscribers Needed = Target Revenue / Subscription Price',
    explanation: 'Relying on a single revenue stream is risky. This tool lets you compare different monetization models, such as ad views and premium subscriptions, side by side.',
    example: 'To hit a $5,000 monthly goal with a $4.50 ad CPM and a $10 premium subscription, you need either 500 members OR 1.11 million ad views.',
    faq: [
      { question: 'What is CPM?', answer: 'CPM stands for Cost Per Mille, which represents the advertising revenue you earn per 1,000 video or page views.' },
      { question: 'Why are subscriptions more predictable than ad views?', answer: 'Subscription members provide recurring monthly revenue, protection against seasonal ad spend drops and algorithm shifts.' }
    ],
    relatedSlugs: ['v15-content-production-cost-calculator', 'v15-audience-conversion-calculator'],
    calculate: (inputs) => {
      const target = Number(inputs.targetMonthlyRevenue || 1000);
      const cpm = Number(inputs.avgCpmRate || 3);
      const patreon = Number(inputs.patreonPrice || 5);

      const reqViews = (target / cpm) * 1000;
      const reqSubs = patreon > 0 ? target / patreon : 0;

      return {
        results: [
          { label: 'Required Monthly Ad Views', value: `${Math.round(reqViews).toLocaleString()} views`, isPrimary: true },
          { label: 'Or: Paid Subscribers needed', value: `${Math.round(reqSubs).toLocaleString()} subscribers` },
          { label: 'Daily Revenue Target', value: `$${(target / 30.4).toFixed(2)} / Day` }
        ],
        chartData: [
          { name: 'Ad Views Required (K)', value: Math.round(reqViews / 1000) },
          { name: 'Subscribers Required', value: Math.round(reqSubs) }
        ]
      };
    }
  },
  {
    id: 'v15-audience-conversion',
    name: 'Audience Conversion Calculator',
    slug: 'v15-audience-conversion-calculator',
    category: 'creator-tools',
    description: 'Calculate social media audience conversion rates down the marketing funnel, from raw views to paid customers.',
    seoTitle: 'Creator Audience Conversion Funnel Solver',
    seoDescription: 'Trace your creator audience conversion stats. Calculate conversion percentages from raw impressions to email signups and sales.',
    inputs: [
      { id: 'overallViews', label: 'Video impressions / Views', type: 'number', defaultValue: 100000 },
      { id: 'conversionClickrate', label: 'Link Click-Through Rate (CTR %)', type: 'number', defaultValue: 2.1, step: 0.1 },
      { id: 'purchaseConversion', label: 'Page conversion Rate to customers (%)', type: 'number', defaultValue: 3.5, step: 0.1 }
    ],
    formula: 'Link Clicks = Impressions * (CTR / 100)\nFinal Sales = Clicks * (Purchase Rate / 100)',
    explanation: 'Audience conversion models help you optimize each step of your funnel, revealing whether you need to work on your call-to-action click rates or landing page layouts.',
    example: 'For 100,000 views with a 2.1% CTR and a 3.5% conversion rate, you will generate 2,100 clicks and exactly 73 sales.',
    faq: [
      { question: 'What is a typical healthy click-through rate?', answer: 'A conversion click-through rate of 1.5% to 3.0% is common and healthy for organic social media video links.' },
      { question: 'How can I optimize landing page conversion rates?', answer: 'Simplify checkout steps, display social proof early, and use high-contrast buy buttons to encourage signups.' }
    ],
    relatedSlugs: ['v15-creator-revenue-goal-calculator', 'v15-content-planning-calculator'],
    calculate: (inputs) => {
      const views = Number(inputs.overallViews || 1000);
      const ctr = Number(inputs.conversionClickrate || 1) / 100;
      const purchase = Number(inputs.purchaseConversion || 1) / 100;

      const clicks = views * ctr;
      const sales = clicks * purchase;
      const overallRate = views > 0 ? (sales / views) * 100 : 0;

      return {
        results: [
          { label: 'Estimated Funnel Sales Count', value: `${Math.round(sales)} Sales`, isPrimary: true },
          { label: 'Outflow link clicks generated', value: `${Math.round(clicks).toLocaleString()} Clicks` },
          { label: 'Overall Funnel Conversion Rate', value: `${overallRate.toFixed(3)}%` }
        ],
        chartData: [
          { name: 'Impressions', value: views },
          { name: 'Resource Clicks', value: Math.round(clicks) },
          { name: 'Final buyers', value: Math.round(sales) }
        ]
      };
    }
  },
  {
    id: 'v15-content-planning',
    name: 'Content Planning Calculator',
    slug: 'v15-content-planning-calculator',
    category: 'creator-tools',
    description: 'Calculate and budget your annual creative workload, designing sustainable content schedules across multiple social platforms.',
    seoTitle: 'Social Media Content Workload Planning Planner',
    seoDescription: 'Plan your content creation roadmap. Distribute your writing, filming, and cataloging tasks so you can build an audience.',
    inputs: [
      { id: 'videosPerWeek', label: 'Target Videos per Week', type: 'number', defaultValue: 2 },
      { id: 'postsPerWeek', label: 'Target Text / Social Posts per Week', type: 'number', defaultValue: 5 },
      { id: 'hoursPerVideo', label: 'Average Hours to Produce one Video', type: 'number', defaultValue: 6 },
      { id: 'hoursPerPost', label: 'Average Hours to Write one Post', type: 'number', defaultValue: 1 }
    ],
    formula: 'Weekly Creative Workload = (Videos * Hours/Video) + (Posts * Hours/Post)',
    explanation: 'Mapping out your production schedule prevents creator burnout and helps you maintain consistent, high-quality content output over months.',
    example: 'Producing 2 videos (6 hours each) and writing 5 posts (1 hour each) weekly requires exactly 17.0 hours of creative work per week.',
    faq: [
      { question: 'How can I streamline my content creation schedule?', answer: 'Batch-produce content (filming multiple videos in one session) and use planning structures to schedule posts in advance.' },
      { question: 'Why is consistent posting vital for algorithm reach?', answer: 'Social algorithms prioritize reliable channels that post consistently, helping you capture more active impressions.' }
    ],
    relatedSlugs: ['v15-content-production-cost-calculator', 'v15-audience-conversion-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.videosPerWeek || 0);
      const p = Number(inputs.postsPerWeek || 0);
      const vH = Number(inputs.hoursPerVideo || 4);
      const pH = Number(inputs.hoursPerPost || 1);

      const weeklyVHours = v * vH;
      const weeklyPHours = p * pH;
      const totalWeekly = weeklyVHours + weeklyPHours;

      return {
        results: [
          { label: 'Weekly Creative Workload', value: `${totalWeekly.toFixed(1)} Hours / Week`, isPrimary: true },
          { label: 'Weekly Video Production time', value: `${weeklyVHours} Hours` },
          { label: 'Weekly Writing & Social time', value: `${weeklyPHours} Hours` }
        ],
        chartData: [
          { name: 'Video Creation', value: weeklyVHours },
          { name: 'Post Writing', value: weeklyPHours }
        ]
      };
    }
  },
  {
    id: 'v15-social-media-roi',
    name: 'Social Media ROI Calculator',
    slug: 'v15-social-media-roi-calculator',
    category: 'creator-tools',
    description: 'Calculate return on investment (ROI) metric percentages for paid ad campaigns or influencer marketing drives.',
    seoTitle: 'Social Media Ad Campaign ROI Calculator',
    seoDescription: 'Determine your digital marketing campaign ROI. Enter ad spend and sales revenue to measure ad efficiency.',
    inputs: [
      { id: 'revenueAttributed', label: 'Ad-Attributed Sales Revenue ($)', type: 'number', defaultValue: 12000 },
      { id: 'adCampaignSpend', label: 'Total Campaign Ad Spend ($)', type: 'number', defaultValue: 4000 }
    ],
    formula: 'ROI (%) = ((Revenue - Campaign Spend) / Campaign Spend) * 100',
    explanation: 'Calculating your campaign ROI helps you identify your most profitable channels, ensuring you focus ad spend on high-performing ad campaigns.',
    example: 'Generating $12,000 in sales from a $4,000 ad spend achieves an ad campaign ROI of exactly 200.00% (and a raw ROAS of 3.0).',
    faq: [
      { question: 'What is ROI vs ROAS?', answer: 'ROAS (Return on Ad Spend) is raw revenue divided by ad costs. ROI factors in additional costs such as product creation and logistics, showing actual net profitability.' },
      { question: 'What represents a healthy ROI target?', answer: 'Aim for a baseline ROI of 100% or greater to ensure your campaign is highly profitable after accounting for inventory costs.' }
    ],
    relatedSlugs: ['v15-content-production-cost-calculator', 'v15-audience-conversion-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenueAttributed || 0);
      const spend = Number(inputs.adCampaignSpend || 1);

      const netProfit = rev - spend;
      const roi = (netProfit / spend) * 100;
      const roas = spend > 0 ? rev / spend : 0;

      return {
        results: [
          { label: 'Campaign Return on Investment (ROI)', value: `${roi.toFixed(2)}%`, isPrimary: true },
          { label: 'Return on Ad Spend (ROAS)', value: `${roas.toFixed(2)}x` },
          { label: 'Net Campaign Profit', value: `$${netProfit.toLocaleString()}` }
        ],
        chartData: [
          { name: 'Target Spend Outflow', value: spend },
          { name: 'Net Profit Back', value: Math.max(0, netProfit) }
        ]
      };
    }
  }
];
