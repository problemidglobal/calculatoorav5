import { Calculator } from '../types';

export const V13_TECH_NET_CREATOR_CALCULATORS: Calculator[] = [
  {
    id: 'code-execution-time',
    name: 'Code Execution Time Calculator',
    slug: 'code-execution-time-calculator',
    category: 'programming',
    description: 'Estimate code execution time based on clock cycles, instructions count, and CPU frequency.',
    seoTitle: 'CPU Clock Execution Time & Big-O Speed Estimator',
    seoDescription: 'Forecast the runtime speed of code algorithms based on instruction counts and clock speeds.',
    inputs: [
      { id: 'instructions', label: 'Instruction Count (Millions)', type: 'number', defaultValue: 50 },
      { id: 'cpi', label: 'Average Cycles Per Instruction (CPI)', type: 'number', defaultValue: 1.5, step: 0.1 },
      { id: 'frequency', label: 'CPU Clock Frequency (GHz)', type: 'number', defaultValue: 3.2, step: 0.1 }
    ],
    formula: 'Execution Time (Seconds) = (Instructions * CPI) / Clock Frequency',
    explanation: 'A CPU processes programs by executing individual cycles. The time taken depends on total instruction count, average cycles per instruction (CPI), and CPU clock speed.',
    example: 'Executing 50 Million instructions at an average CPI of 1.5 on a 3.2 GHz processor takes approximately 0.0234 seconds (23.44 milliseconds).',
    faq: [
      { question: 'What is CPI?', answer: 'Cycles Per Instruction. The average number of clock cycles required by a CPU to execute a single program instruction.' }
    ],
    relatedSlugs: ['memory-usage-calculator', 'storage-requirement-calculator'],
    keywords: ['cpu clock cycle estimator', 'instruction execution speed', 'algorithm runtime solver'],
    calculate: (inputs) => {
      const inst = Number(inputs.instructions || 50) * 1_000_000;
      const cpi = Number(inputs.cpi || 1.5);
      const freq = Number(inputs.frequency || 3.2) * 1_000_000_000;

      const runTimeSec = freq > 0 ? (inst * cpi) / freq : 0;
      const runTimeMs = runTimeSec * 1000;

      return {
        results: [
          { label: 'Estimated execution Time', value: `${runTimeMs.toFixed(3)} ms`, isPrimary: true },
          { label: 'Time in Seconds', value: `${runTimeSec.toExponential(3)} Seconds` },
          { label: 'Aggregated Cycles Spent', value: `${(inst * cpi).toLocaleString()} Cycles` }
        ],
        chartData: [
          { name: 'Total Instructions (M)', value: Math.round(inst / 1_000_000) },
          { name: 'Cycles Spent (M)', value: Math.round((inst * cpi) / 1_000_000) }
        ]
      };
    }
  },
  {
    id: 'memory-usage',
    name: 'Memory Usage Calculator',
    slug: 'memory-usage-calculator',
    category: 'programming',
    description: 'Calculate memory usage based on variable counts and data types (e.g., Integer, Float, Char, Pointers).',
    seoTitle: 'Variable Storage & RAM Usage Calculator',
    seoDescription: 'Input different data types and array lengths to calculate the exact bytes of heap or stack memory consumed.',
    inputs: [
      { id: 'ints', label: 'Integers (4-bytes each)', type: 'number', defaultValue: 10000 },
      { id: 'doubles', label: 'Floats/Doubles (8-bytes each)', type: 'number', defaultValue: 5000 },
      { id: 'chars', label: 'Chars/ASCII (1-byte each)', type: 'number', defaultValue: 25000 },
      { id: 'pointers', label: 'Pointers / References (8-bytes each)', type: 'number', defaultValue: 5000 }
    ],
    formula: 'RAM Usage = (Ints * 4) + (Doubles * 8) + (Chars * 1) + (Pointers * 8) bytes',
    explanation: 'Track the physical memory allocation of your data structures to evaluate RAM requirements and prevent memory leaks.',
    example: 'Allocating 10,000 integers, 5,000 doubles, 25,000 chars, and 5,000 pointers requires approximately 145,000 bytes (141.6 KB).',
    faq: [
      { question: 'Why does memory usage differ in JS?', answer: 'JavaScript is a high-level language where memory management (like garbage collection) is automated, meaning variables incur object wrapper overheads.' }
    ],
    relatedSlugs: ['storage-requirement-calculator', 'file-size-calculator'],
    keywords: ['variable ram storage', 'c structures memory consumption', 'heap data footprint'],
    calculate: (inputs) => {
      const i = Number(inputs.ints || 10000);
      const d = Number(inputs.doubles || 5000);
      const c = Number(inputs.chars || 25000);
      const p = Number(inputs.pointers || 5000);

      const bytes = (i * 4) + (d * 8) + (c * 1) + (p * 8);
      const kb = bytes / 1024;
      const mb = kb / 1024;

      return {
        results: [
          { label: 'Total Allocated Memory', value: mb > 1 ? `${mb.toFixed(3)} MB` : `${kb.toFixed(1)} KB`, isPrimary: true },
          { label: 'Aggregated Footprint (Bytes)', value: `${bytes.toLocaleString()} Bytes` }
        ],
        chartData: [
          { name: 'Integers (Bytes)', value: i * 4 },
          { name: 'Doubles (Bytes)', value: d * 8 },
          { name: 'Chars (Bytes)', value: c * 1 },
          { name: 'Pointers (Bytes)', value: p * 8 }
        ]
      };
    }
  },
  {
    id: 'storage-requirement',
    name: 'Storage Requirement Calculator',
    slug: 'storage-requirement-calculator',
    category: 'programming',
    description: 'Calculate long-term drive storage requirements based on daily log accumulation rates and retention logs.',
    seoTitle: 'Server Logs & Drive Storage Capacity Planner',
    seoDescription: 'Obtain long-term storage trends for daily log files or database records over selected retention periods.',
    inputs: [
      { id: 'rate', label: 'Daily Data Accumulation', type: 'number', defaultValue: 15, unit: 'GB' },
      { id: 'retention', label: 'Retention Period (Days)', type: 'number', defaultValue: 90 },
      { id: 'overhead', label: 'Replication / Index Overhead (%)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Total Storage = Daily Rate * Days * (1 + Overhead%)',
    explanation: 'Track data accumulation and storage replication overheads to plan server and drive capacity requirements.',
    example: 'Storing 15 GB of daily logs for 90 days under a 10% replication overhead requires approximately 1.485 TB of drive storage.',
    faq: [
      { question: 'Why plan replication overhead?', answer: 'Production arrays require extra storage for indexes, backups, snapshots, and database replication.' }
    ],
    relatedSlugs: ['database-size-calculator', 'file-size-calculator'],
    keywords: ['server storage capacity planner', 'long term retention size', 'disk usage forecasting'],
    calculate: (inputs) => {
      const rate = Number(inputs.rate || 15);
      const days = Number(inputs.retention || 90);
      const ovh = Number(inputs.overhead || 10) / 100;

      const raw = rate * days;
      const totalGB = raw * (1 + ovh);
      const totalTB = totalGB / 1024;

      return {
        results: [
          { label: 'Total Drive Storage Required', value: totalTB >= 1 ? `${totalTB.toFixed(2)} TB` : `${totalGB.toFixed(0)} GB`, isPrimary: true },
          { label: 'Raw Uncompressed Data', value: `${raw.toLocaleString()} GB` },
          { label: 'Indexes / Replication Overhead', value: `${(raw * ovh).toLocaleString()} GB` }
        ],
        chartData: [
          { name: 'Raw Data Size', value: Math.round(raw) },
          { name: 'Overhead Allocated', value: Math.round(raw * ovh) }
        ]
      };
    }
  },
  {
    id: 'api-cost',
    name: 'API Cost Estimator',
    slug: 'api-cost-estimator',
    category: 'programming',
    description: 'Estimate daily, monthly, and yearly API costs based on transaction volume and rates per thousand calls.',
    seoTitle: 'Dynamic API Surcharges & Bill Estimator',
    seoDescription: 'Project api billings based on raw monthly transaction counts and rates per thousand requests.',
    inputs: [
      { id: 'calls', label: 'Daily API Calls / Requests', type: 'number', defaultValue: 25000 },
      { id: 'rate', label: 'API Price Per 1,000 Requests ($)', type: 'number', defaultValue: 0.15, step: 0.01 }
    ],
    formula: 'Cost = (Calls / 1,000) * Price_Rate',
    explanation: 'Track API consumption across volume tiers to forecast monthly usage costs and support budgets.',
    example: 'Making 25,000 daily requests at a rate of 15¢ per 1,000 calls costs $3.75 daily, scaling to approximately $112.50 monthly.',
    faq: [
      { question: 'Can API charges scale non-linearly?', answer: 'Yes, because many enterprise API providers offer discounted volume packages for larger query tiers.' }
    ],
    relatedSlugs: ['database-size-calculator', 'storage-requirement-calculator'],
    keywords: ['api rates billing calculator', 'cloud platform charges', 'monthly requests budget'],
    calculate: (inputs) => {
      const calls = Number(inputs.calls || 25000);
      const rate = Number(inputs.rate || 0.15);

      const daily = (calls / 1000) * rate;
      const monthly = daily * 30;
      const annual = daily * 365;

      return {
        results: [
          { label: 'Estimated Monthly Bill', value: `$${monthly.toFixed(2)}`, isPrimary: true },
          { label: 'Daily API Surcharges Price', value: `$${daily.toFixed(2)}` },
          { label: 'Yearly Subscription Cost', value: `$${annual.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Daily Surcharges ($)', value: Math.round(daily) },
          { name: 'Monthly Bill ($)', value: Math.round(monthly) }
        ]
      };
    }
  },
  {
    id: 'database-size',
    name: 'Database Size Calculator',
    slug: 'database-size-calculator',
    category: 'programming',
    description: 'Calculate average relational database table sizes based on column sizes and total database records.',
    seoTitle: 'Sub-tables SQL Database Size Estimator',
    seoDescription: 'Input row widths and record counts to calculate total database table storage requirements.',
    inputs: [
      { id: 'rows', label: 'Total Expected Records', type: 'number', defaultValue: 1000000 },
      { id: 'rowSize', label: 'Average Row size (Bytes)', type: 'number', defaultValue: 256, min: 10, max: 10000 }
    ],
    formula: 'Database Size = Records * RowSize * 1.25 (index & paging cushion)',
    explanation: 'Database tables require page cushions and indexes in addition to row storage. This calculator adds a default 25% cushion for accurate estimates.',
    example: 'Storing 1 Million records with an average row size of 256 bytes require approximately 320 MB of storage (accounting for index overheads).',
    faq: [
      { question: 'Why add index cushions?', answer: 'SQL structures use B-Trees and paging tables to expedite lookups, increasing tables size by 20% to 40%.' }
    ],
    relatedSlugs: ['storage-requirement-calculator', 'file-size-calculator'],
    keywords: ['database table size estimator', 'postgresql capacity planner', 'sql row size calculator'],
    calculate: (inputs) => {
      const r = Number(inputs.rows || 1000000);
      const rs = Number(inputs.rowSize || 256);

      const bytes = r * rs * 1.25;
      const mb = bytes / 1024 / 1024;
      const gb = mb / 1024;

      return {
        results: [
          { label: 'Estimated DB Table Capacity', value: gb >= 1 ? `${gb.toFixed(2)} GB` : `${mb.toFixed(1)} MB`, isPrimary: true },
          { label: 'Raw Row Weight (No Indexes)', value: `${((r * rs)/1024/1024).toFixed(1)} MB` }
        ],
        chartData: [
          { name: 'Raw Data (MB)', value: Math.round((r * rs)/1024/1024) },
          { name: 'Overhead + Index Cushion', value: Math.round(((r * rs * 0.25)/1024/1024)) }
        ]
      };
    }
  },
  {
    id: 'file-size',
    name: 'File Size Calculator',
    slug: 'file-size-calculator',
    category: 'programming',
    description: 'Convert between different raw computer binary file sizes (e.g., Bytes, KB, MB, GB, TB).',
    seoTitle: 'Digital File Size Unit Converter',
    seoDescription: 'Convert files sizes instantly between bits, bytes, kilobytes, megabytes, and gigabytes.',
    inputs: [
      { id: 'amount', label: 'Source File Value', type: 'number', defaultValue: 500 },
      { id: 'unit', label: 'Source File Unit', type: 'select', defaultValue: 'MB', options: [{ label: 'KB (Kilobytes)', value: 'KB' }, { label: 'MB (Megabytes)', value: 'MB' }, { label: 'GB (Gigabytes)', value: 'GB' }, { label: 'TB (Terabytes)', value: 'TB' }] }
    ],
    formula: 'Conversions use binary factors: 1 KB = 1024 Bytes, 1 MB = 1024 KB, etc.',
    explanation: 'Convert file sizes using binary factors of 1,024 to prevent confusion between decimal and binary definitions.',
    example: 'A 500 MB file converts to exactly 512,000 KB, 0.488 GB, and over 524 Million bytes.',
    faq: [
      { question: 'Why does my drive show less space than advertised?', answer: 'Drive manufacturers use decimal definitions (1 KB = 1,000 Bytes), while operating systems use binary definitions (1 KB = 1,024 Bytes).' }
    ],
    relatedSlugs: ['compression-ratio-calculator', 'storage-requirement-calculator'],
    keywords: ['file size converter', 'binary byte converter', 'kilobytes megabytes gigabytes conversion'],
    calculate: (inputs) => {
      const amt = Number(inputs.amount || 500);
      const unit = inputs.unit || 'MB';

      let bytes = amt;
      if (unit === 'KB') bytes = amt * 1024;
      else if (unit === 'MB') bytes = amt * 1024 * 1024;
      else if (unit === 'GB') bytes = amt * 1024 * 1024 * 1024;
      else if (unit === 'TB') bytes = amt * 1024 * 1024 * 1024 * 1024;

      const kb = bytes / 1024;
      const mb = kb / 1024;
      const gb = mb / 1024;

      return {
        results: [
          { label: 'Gigabytes Equivalent (GB)', value: `${gb.toFixed(3)} GB`, isPrimary: true },
          { label: 'Megabytes Equivalent (MB)', value: `${mb.toFixed(1)} MB` },
          { label: 'Raw Bytes Count', value: `${bytes.toLocaleString()} Bytes` }
        ],
        chartData: [
          { name: 'KB Size', value: Math.round(kb / 1000) },
          { name: 'MB Size', value: Math.round(mb) }
        ]
      };
    }
  },
  {
    id: 'compression-ratio',
    name: 'Compression Ratio Calculator',
    slug: 'compression-ratio-calculator',
    category: 'programming',
    description: 'Calculate file compression ratios and saved disk space percentages.',
    seoTitle: 'File Compression Ratio & Space Savings Calculator',
    seoDescription: 'Compare uncompressed and compressed file sizes to measure compression efficiency.',
    inputs: [
      { id: 'uncompressed', label: 'Original File Size (MB)', type: 'number', defaultValue: 120 },
      { id: 'compressed', label: 'Compressed File Size (MB)', type: 'number', defaultValue: 35 }
    ],
    formula: 'Compression Ratio = Original / Compressed\nSpace Savings (%) = (Original - Compressed) / Original * 100',
    explanation: 'Track compression performance to measure directory optimization efficiency and drive space savings.',
    example: 'Compressing a 120 MB directory down to 35 MB achieves a 3.43:1 compression ratio, representing a 70.83% drive space saving.',
    faq: [
      { question: 'What is lossy vs. lossless compression?', answer: 'Lossless compression (e.g., ZIP) preserves raw data perfectly, while lossy compression (e.g., JPEG/MP3) discards minor details to maximize file size reductions.' }
    ],
    relatedSlugs: ['file-size-calculator', 'storage-requirement-calculator'],
    keywords: ['compression efficiency level', 'disk space savings calculator', 'lossless zip ratio solver'],
    calculate: (inputs) => {
      const orig = Math.max(0.1, Number(inputs.uncompressed || 120));
      const comp = Math.max(0.1, Number(inputs.compressed || 35));

      const ratio = orig / comp;
      const savings = ((orig - comp) / orig) * 100;

      return {
        results: [
          { label: 'Calculated Compression Ratio', value: `${ratio.toFixed(2)} : 1`, isPrimary: true },
          { label: 'Hard-Drive Space Saved (%)', value: `${savings.toFixed(2)}%` },
          { label: 'Raw Saved Capacity (MB)', value: `${(orig - comp).toFixed(1)} MB` }
        ],
        chartData: [
          { name: 'Compressed Size', value: Math.round(comp) },
          { name: 'Hard Drive Savings', value: Math.round(orig - comp) }
        ]
      };
    }
  },
  {
    id: 'advanced-subnet',
    name: 'Advanced Subnet Calculator',
    slug: 'advanced-subnet-calculator',
    category: 'programming',
    description: 'Deconstruct classful subnets, CIDR netmasks, host limits, and wildcard indicators.',
    seoTitle: 'IPv4 CIDR Block Subnet Mask Calculator',
    seoDescription: 'Input IP addresses and subnet masks to calculate host ranges, network address boundaries, and wildcard indicators.',
    inputs: [
      { id: 'ipAddress', label: 'Target IPv4 Address', type: 'text', defaultValue: '192.168.1.1' },
      { id: 'cidr', label: 'CIDR Netmask Range (/X)', type: 'number', defaultValue: 24, min: 1, max: 32 }
    ],
    formula: 'Subnet hosts = 2^(32 - CIDR) - 2',
    explanation: 'Subnetting divides physical networks into logic subsets to manage traffic and allocate IP addresses effectively.',
    example: 'A 192.168.1.1/24 subnet provides 254 usable host addresses (192.168.1.1 to 192.168.1.254), with 192.168.1.0 as the network address.',
    faq: [
      { question: 'Why subtract 2 from total subnet hosts?', answer: 'Because the first address in a subnet represents the network identifier, and the last address is reserved for broadcast transmissions.' }
    ],
    relatedSlugs: ['ip-address-planner', 'network-capacity-calculator'],
    keywords: ['cidr subnet planner', 'broadcast network ip indicator', 'wildcard mask solver'],
    calculate: (inputs) => {
      const ip = inputs.ipAddress || '192.168.1.1';
      const cidr = Math.min(32, Math.max(1, Number(inputs.cidr || 24)));

      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

      // Class guesser
      const firstOct = parseInt(ip.split('.')[0]) || 192;
      let clVal = 'Class C';
      if (firstOct < 128) clVal = 'Class A';
      else if (firstOct < 191) clVal = 'Class B';

      return {
        results: [
          { label: 'Usable Hosts Count', value: usableHosts.toLocaleString(), isPrimary: true },
          { label: 'IP Address Block Class', value: clVal },
          { label: 'Subnet Wildcard Mask', value: `0.0.0.${totalHosts - 1}` }
        ],
        chartData: [
          { name: 'CIDR Mask (/X)', value: cidr },
          { name: 'Usable Network Hosts', value: usableHosts }
        ]
      };
    }
  },
  {
    id: 'ip-address-planner',
    name: 'IP Address Planner',
    slug: 'ip-address-planner',
    category: 'programming',
    description: 'Calculate IP address allocations across network tiers to prevent collisions and support address ranges.',
    seoTitle: 'IP Address Block Allocation & Scope Planner',
    seoDescription: 'Segment IP scopes and target limits across offices, servers, and VPN tunnels.',
    inputs: [
      { id: 'startIp', label: 'Starting IP Scope', type: 'text', defaultValue: '10.0.0.0' },
      { id: 'stations', label: 'Required Working Stations', type: 'number', defaultValue: 120 },
      { id: 'servers', label: 'Required Backend Servers', type: 'number', defaultValue: 30 },
      { id: 'vpns', label: 'Remote VPN Active Users Scopes', type: 'number', defaultValue: 50 }
    ],
    formula: 'Allocations resolve to matching binary powers of 2.',
    explanation: 'Track IP address allocations across company segments (workstations, servers, VPNs) to structure scopes and manage IP resources.',
    example: 'Planning for 120 workstations, 30 servers, and 50 VPNs requires allocating /25 (128 addresses), /27 (32 addresses), and /26 (64 addresses) subnets respectively.',
    faq: [
      { question: 'What is static vs. dynamic IP planning?', answer: 'Dynamic IP ranges are managed by DHCP servers for user workstations, while static IPs are reserved for infrastructure variables like printers and server nodes.' }
    ],
    relatedSlugs: ['advanced-subnet-calculator', 'network-capacity-calculator'],
    keywords: ['ip pool allocation helper', 'dhcp subnet boundaries', 'active dynamic range planner'],
    calculate: (inputs) => {
      const startingIp = inputs.startIp || '10.0.0.0';
      const users = Number(inputs.stations || 120);
      const servs = Number(inputs.servers || 30);
      const vpns = Number(inputs.vpns || 50);

      const findCidr = (qty: number): number => {
        const needed = qty + 2;
        let bits = 0;
        while (Math.pow(2, bits) < needed) {
          bits++;
        }
        return 32 - bits;
      };

      return {
        results: [
          { label: 'Working Stations Subnet', value: `/${findCidr(users)} Subnet`, isPrimary: true },
          { label: 'Infrastructure Servers Subnet', value: `/${findCidr(servs)} Subnet` },
          { label: 'VPN Remote Subnet Allocations', value: `/${findCidr(vpns)} Subnet` }
        ],
        chartData: [
          { name: 'Stations IP Needs', value: users },
          { name: 'Servers IP Needs', value: servs },
          { name: 'VPN Tunnels Needs', value: vpns }
        ]
      };
    }
  },
  {
    id: 'network-capacity',
    name: 'Network Capacity Calculator',
    slug: 'network-capacity-calculator',
    category: 'programming',
    description: 'Calculate required network capacity based on active concurrent user rates and applications.',
    seoTitle: 'Network Capacity & Backbone Congestion Calculator',
    seoDescription: 'Obtain suggested internet backbone bandwidth tiers based on active workstations.',
    inputs: [
      { id: 'users', label: 'Active Concurrent Network Users', type: 'number', defaultValue: 150 },
      { id: 'appUse', label: 'Primary Application Usage Profile', type: 'select', defaultValue: 'video_calls', options: [{ label: 'General Office (Text, Email) (0.5 Mbps)', value: 'office' }, { label: 'Web Browsing + Database (2.0 Mbps)', value: 'web' }, { label: 'Regular Video Calls / Voip (5.0 Mbps)', value: 'video_calls' }, { label: 'High Density Cloud Syncing (15.0 Mbps)', value: 'cloud' }] }
    ],
    formula: 'Backbone Capacity = Concurrent Users * Profile Mbps * 1.30 (over-provision cushion)',
    explanation: 'Track network capacity requirements to prevent congestion and determine internet backbone speeds for office environments.',
    example: 'A network supporting 150 active video call users under a 30% over-provision factor requires a stable 975 Mbps connection.',
    faq: [
      { question: 'What is QoS in network capacity?', answer: 'Quality of Service (QoS) prioritizes high-priority traffic (like real-time video) over lower-priority traffic (like file downloads) when network congestion occurs.' }
    ],
    relatedSlugs: ['bandwidth-requirement-calculator', 'transfer-speed-calculator'],
    keywords: ['local office backbone speed', 'network bandwidth congestion', 'voip internet pipeline'],
    calculate: (inputs) => {
      const users = Number(inputs.users || 150);
      const app = inputs.appUse || 'video_calls';

      let factor = 5.0;
      if (app === 'office') factor = 0.5;
      else if (app === 'web') factor = 2.0;
      else if (app === 'cloud') factor = 15.0;

      const baseMbps = users * factor;
      const totalMbps = baseMbps * 1.3;

      return {
        results: [
          { label: 'Suggested Network Capacity', value: totalMbps >= 1000 ? `${(totalMbps/1000).toFixed(2)} Gbps` : `${totalMbps.toFixed(0)} Mbps`, isPrimary: true },
          { label: 'Raw Under-load Traffic', value: `${baseMbps.toFixed(0)} Mbps` },
          { label: 'Safety Congestion Guard (30%)', value: `${(baseMbps * 0.3).toFixed(0)} Mbps` }
        ],
        chartData: [
          { name: 'Raw Traffic Demand (Mbps)', value: Math.round(baseMbps) },
          { name: 'Congestion Buffer (Mbps)', value: Math.round(baseMbps * 0.3) }
        ]
      };
    }
  },
  {
    id: 'bandwidth-requirement',
    name: 'Bandwidth Requirement Calculator',
    slug: 'bandwidth-requirement-calculator',
    category: 'programming',
    description: 'Calculate bandwidth requirements for media streaming, video feeds, and CCTV pipelines.',
    seoTitle: 'Camera CCTV & Video Bandwidth Requirement Calculator',
    seoDescription: 'Obtain backbone network pipeline guidelines based on stream quality and camera counts.',
    inputs: [
      { id: 'streams', label: 'Concurrent Active Feeds / Cameras', type: 'number', defaultValue: 8 },
      { id: 'resolution', label: 'Video Stream Resolution', type: 'select', defaultValue: '1080p', options: [{ label: 'SD Quality (480p) (1.2 Mbps)', value: 'sd' }, { label: 'HD Quality (720p) (2.5 Mbps)', value: 'hd' }, { label: 'Full HD Quality (1080p) (5.0 Mbps)', value: 'full_hd' }, { label: 'Ultra HD Quality (4K) (25.0 Mbps)', value: '4k' }] }
    ],
    formula: 'Network Pipeline Requirement = Feeds * Resolution_Mult Mbps',
    explanation: 'Track streaming bandwidth requirements to prevent local area network congestion.',
    example: 'Deploying 8 security IP cameras streaming at 1085p Resolution (5 Mbps each) requires 40.0 Mbps of consistent network capacity.',
    faq: [
      { question: 'Does frame rate affect bandwidth?', answer: 'Yes. Reducing a video stream from 60 fps to 30 fps can reduce its bandwidth requirement by up to 40%.' }
    ],
    relatedSlugs: ['network-capacity-calculator', 'transfer-speed-calculator'],
    keywords: ['cctv network traffic estimation', 'ip cameras bandwidth pipeline', '4k streaming network demand'],
    calculate: (inputs) => {
      const feeds = Number(inputs.streams || 8);
      const res = inputs.resolution || '1080p';

      let rateVal = 5.0;
      if (res === 'sd') rateVal = 1.2;
      else if (res === 'hd') rateVal = 2.5;
      else if (res === '4k') rateVal = 25.0;

      const reqMbps = feeds * rateVal;

      return {
        results: [
          { label: 'Aggregated Pipeline Bandwidth', value: `${reqMbps.toFixed(1)} Mbps`, isPrimary: true },
          { label: 'CCTV Traffic Classification', value: reqMbps > 100 ? 'High Backbone Traffic' : 'Standard Local Area Traffic' }
        ],
        chartData: [
          { name: 'CCTV Traffic (Mbps)', value: Math.round(reqMbps) },
          { name: 'Available Standard Pipe (100M)', value: 100 }
        ]
      };
    }
  },
  {
    id: 'transfer-speed-calc',
    name: 'Transfer Speed Calculator',
    slug: 'transfer-speed-calculator',
    category: 'programming',
    description: 'Calculate download and upload times based on file size and connection speeds.',
    seoTitle: 'File Transmission Download & Speed Calculator',
    seoDescription: 'Obtain exact completion times for files downloads based on connection speed.',
    inputs: [
      { id: 'fSize', label: 'File Store Volume (GB)', type: 'number', defaultValue: 25 },
      { id: 'throughput', label: 'Average Network Speed (Mbps)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Time (Seconds) = [File_Size_GB * 8 * 1,024] / Throughput_Mbps',
    explanation: 'Calculate download times by converting file sizes into bits (1 byte = 8 bits) and dividing by network speed.',
    example: 'Downloading a 25 GB file over a 100 Mbps connection takes approximately 34 minutes and 8 seconds.',
    faq: [
      { question: 'What is the Mbps vs. MB/s difference?', answer: 'Mbps represents Megabits per second (used for network speeds), while MB/s represents Megabytes per second (used for file sizes). 1 MB/s is equal to 8 Mbps.' }
    ],
    relatedSlugs: ['bandwidth-requirement-calculator', 'network-capacity-calculator'],
    keywords: ['transmission file download timing', 'network throughput metric', 'internet cloud transfer speed'],
    calculate: (inputs) => {
      const cap = Number(inputs.fSize || 25);
      const speed = Number(inputs.throughput || 100);

      // Convert GB to Megabits
      const megabits = cap * 8 * 1024;
      const speedCorr = speed || 1;
      const secTotal = megabits / speedCorr;

      const minVal = secTotal / 60;
      const hrVal = minVal / 60;

      let elapsedString = '';
      if (secTotal < 60) elapsedString = `${secTotal.toFixed(1)} Seconds`;
      else if (secTotal < 3600) elapsedString = `${minVal.toFixed(1)} Minutes`;
      else elapsedString = `${hrVal.toFixed(1)} Hours`;

      return {
        results: [
          { label: 'Estimated Transfer Duration', value: elapsedString, isPrimary: true },
          { label: 'Actual Bits count', value: `${megabits.toLocaleString()} Megabits` },
          { label: 'Optimal Megabytes Speed', value: `${(speed / 8).toFixed(1)} MB/s` }
        ],
        chartData: [
          { name: 'Throughput Speed (Mbps)', value: Math.round(speed) },
          { name: 'Elapsed Minutes Span', value: Math.round(minVal) }
        ]
      };
    }
  },
  {
    id: 'ping-time',
    name: 'Ping Time Calculator',
    slug: 'ping-time-calculator',
    category: 'programming',
    description: 'Calculate network round-trip times (RTT) based on geographic distance and medium speed constants.',
    seoTitle: 'Network Fiber Propagation Latency Calculator',
    seoDescription: 'Find minimal physical ping times between locations using speed-of-light formulas.',
    inputs: [
      { id: 'distance', label: 'One-Way Distance (km)', type: 'number', defaultValue: 3000 },
      { id: 'medium', label: 'Fiber / Cable Propagation Medium', type: 'select', defaultValue: 'fiber', options: [{ label: 'Glass Fiber Optic Wire (200,000 km/s)', value: 'fiber' }, { label: 'Standard Copper Wire coaxial (230,000 km/s)', value: 'copper' }, { label: 'Air Space / Satellite waves (299,792 km/s)', value: 'air' }] }
    ],
    formula: 'Propagation Delay (one-way) = Distance / Speed_of_Medium\nRTT Ping = Propagation Delay * 2',
    explanation: 'Calculate physical signal propagation limits between network nodes to establish baseline ping times, excluding router processing overheads.',
    example: 'A fiber optic signal traveling 3,000 km has a one-way delay of 15 ms, resulting in a minimum physical ping (RTT) of 30 ms.',
    faq: [
      { question: 'Why is actual ping typically higher than physical limits?', answer: 'Actual ping includes processing, queuing, and serialization overheads at every network router and switch along the path.' }
    ],
    relatedSlugs: ['transfer-speed-calculator', 'network-capacity-calculator'],
    keywords: ['geographic network latency', 'fiber propagation speed limits', 'internet ping calculator'],
    calculate: (inputs) => {
      const d = Number(inputs.distance || 3000);
      const med = inputs.medium || 'fiber';

      let speed = 200000; // km/s
      if (med === 'copper') speed = 230000;
      else if (med === 'air') speed = 299792;

      const delayOneWayMs = (d / speed) * 1000;
      const rttPing = delayOneWayMs * 2;

      return {
        results: [
          { label: 'Minimum Physical Ping (RTT)', value: `${rttPing.toFixed(2)} ms`, isPrimary: true },
          { label: 'One-Way propagation Delay', value: `${delayOneWayMs.toFixed(2)} ms` }
        ],
        chartData: [
          { name: 'One-Way Latency', value: Math.round(delayOneWayMs) },
          { name: 'RTT Ping (ms)', value: Math.round(rttPing) }
        ]
      };
    }
  },
  {
    id: 'blog-revenue',
    name: 'Blog Revenue Calculator',
    slug: 'blog-revenue-calculator',
    category: 'creator-tools',
    description: 'Calculate blog earnings based on traffic, page views, ad RPM, and affiliate sales.',
    seoTitle: 'Blog Ad and Affiliate Monetization Calculator',
    seoDescription: 'Input monthly page views, RPM rates, and affiliate sales to estimate your total monthly blog income.',
    inputs: [
      { id: 'views', label: 'Monthly Page Views', type: 'number', defaultValue: 50000 },
      { id: 'rpm', label: 'Ad Revenue RPM ($)', type: 'number', defaultValue: 18 },
      { id: 'affSales', label: 'Monthly Affiliate Sales Commissions ($)', type: 'number', defaultValue: 500 }
    ],
    formula: 'Monthly Income = (Pageviews / 1,000) * RPM + Affiliate Sales',
    explanation: 'Track your blog\'s performance by combining display ad CPM/RPM revenues with affiliate sales commissions.',
    example: 'A blog receiving 500,000 page views monthly with an $18 RPM and earning $500 in affiliate commissions generates approximately $1,400 monthly.',
    faq: [
      { question: 'What is Ad RPM?', answer: 'Revenue Per Mille. The amount an ad network pays you for every 1,000 page views your blog generates.' }
    ],
    relatedSlugs: ['website-earnings-calculator', 'ad-revenue-calculator'],
    keywords: ['blog passive income solver', 'affiliate blog earnings', 'display ads rpm calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.views || 50000);
      const rpm = Number(inputs.rpm || 18);
      const aff = Number(inputs.affSales || 500);

      const ads = (v / 1000) * rpm;
      const total = ads + aff;

      return {
        results: [
          { label: 'Combined Monthly Blog Income', value: `$${total.toFixed(2)}`, isPrimary: true },
          { label: 'Display Ads Income Share', value: `$${ads.toFixed(2)}` },
          { label: 'Affiliate Sales share', value: `$${aff.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Display Ads ($)', value: Math.round(ads) },
          { name: 'Affiliates ($)', value: Math.round(aff) }
        ]
      };
    }
  },
  {
    id: 'website-earnings',
    name: 'Website Earnings Calculator',
    slug: 'website-earnings-calculator',
    category: 'creator-tools',
    description: 'Calculate website conversion rates and earnings based on visitors, product prices, and conversion percentages.',
    seoTitle: 'E-commerce Website conversion Earnings Calculator',
    seoDescription: 'Obtain estimated monthly earnings based on traffic volumes, checkout prices, and conversion rates.',
    inputs: [
      { id: 'visitors', label: 'Monthly Website Visitors', type: 'number', defaultValue: 20000 },
      { id: 'convRate', label: 'Checkout Conversion Rate (%)', type: 'number', defaultValue: 1.8, step: 0.1 },
      { id: 'avgPrice', label: 'Average checkout Price ($)', type: 'number', defaultValue: 45 }
    ],
    formula: 'Monthly Income = Visitors * (Conversion% / 100) * Checkout Price',
    explanation: 'Track e-commerce conversions and store performance to forecast revenues and plan marketing campaigns.',
    example: 'A store receiving 20,000 visitors monthly with a 1.8% conversion rate and a $45 average order value generates approximately $16,200 monthly.',
    faq: [
      { question: 'What is a typical e-commerce conversion rate?', answer: 'Typical online store conversion rates range from 1.5% to 3.0%, depending on industry and traffic relevance.' }
    ],
    relatedSlugs: ['blog-revenue-calculator', 'ad-revenue-calculator'],
    keywords: ['ecommerce store intake solver', 'checkout conversion rate planner', 'traffic sales monetization'],
    calculate: (inputs) => {
      const vis = Number(inputs.visitors || 20000);
      const conv = Number(inputs.convRate || 1.8) / 100;
      const price = Number(inputs.avgPrice || 45);

      const sales = vis * conv;
      const total = sales * price;

      return {
        results: [
          { label: 'Projected Monthly Sales', value: `$${total.toFixed(2)}`, isPrimary: true },
          { label: 'Total Volume of Orders', value: `${Math.round(sales)} Sales` }
        ],
        chartData: [
          { name: 'Traffic (Visitors / 10)', value: Math.round(vis / 10) },
          { name: 'Revenues ($)', value: Math.round(total) }
        ]
      };
    }
  },
  {
    id: 'ad-revenue',
    name: 'Ad Revenue Calculator',
    slug: 'ad-revenue-calculator',
    category: 'creator-tools',
    description: 'Calculate display ad CPM earnings across desktop and mobile placements.',
    seoTitle: 'Display Ad CPM Monetization Calculator',
    seoDescription: 'Determine ad revenues based on impressions and CPM rates.',
    inputs: [
      { id: 'impressions', label: 'Expected Ad Impressions', type: 'number', defaultValue: 100000 },
      { id: 'cpm', label: 'Average CPM Rate ($)', type: 'number', defaultValue: 6.5, step: 0.1 }
    ],
    formula: 'Earnings = (Impressions / 1,000) * CPM',
    explanation: 'Track display ad CPM performance (revenue per 1,000 impressions) to forecast earnings and optimize ad placements.',
    example: 'Serving 100,000 ad impressions at a $6.50 CPM generates approximately $650 in revenue.',
    faq: [
      { question: 'What is CPM?', answer: 'Cost Per Mille. The cost advertisers pay for every 1,000 impressions their ad receives on your website.' }
    ],
    relatedSlugs: ['blog-revenue-calculator', 'website-earnings-calculator'],
    keywords: ['cpm ad payouts helper', 'impressions advertising revenue', 'ad networks billing tool'],
    calculate: (inputs) => {
      const imp = Number(inputs.impressions || 10000);
      const cpm = Number(inputs.cpm || 6.5);

      const gross = (imp / 1000) * cpm;

      return {
        results: [
          { label: 'Projected Ad Revenue', value: `$${gross.toFixed(2)}`, isPrimary: true },
          { label: 'Payout Per Impression', value: `$${(cpm / 1000).toFixed(4)}` }
        ],
        chartData: [
          { name: 'Impressions Count', value: imp },
          { name: 'Ad Earnings ($)', value: Math.round(gross) }
        ]
      };
    }
  },
  {
    id: 'creator-sponsorship',
    name: 'Creator Sponsorship Calculator',
    slug: 'creator-sponsorship-calculator',
    category: 'creator-tools',
    description: 'Calculate fair brand sponsorship rates based on audience reach and engagement levels.',
    seoTitle: 'Social Media Brand Sponsorship Rate Calculator',
    seoDescription: 'Find fair pricing guidelines for social media sponsor spots based on reach and engagement.',
    inputs: [
      { id: 'followers', label: 'Total Active Followers', type: 'number', defaultValue: 25000 },
      { id: 'engagement', label: 'Average Engagement Rate (%)', type: 'number', defaultValue: 3.5, step: 0.1 },
      { id: 'cpe', label: 'Desired Cost Per Engagement (CPE) ($)', type: 'number', defaultValue: 0.25, step: 0.05 }
    ],
    formula: 'Fair Sponsor rate = Followers * (Engagement% / 100) * CPE',
    explanation: 'Determine competitive brand sponsorship rates by aligning pricing with audience engagement metrics rather than just follower counts.',
    example: 'Having 25,000 followers with a 3.5% engagement rate translates to 875 key interactions, indicating a fair sponsor price of $218.75 at a 25¢ CPE.',
    faq: [
      { question: 'Why does engagement rate matter to sponsors?', answer: 'Sponsors prioritize engagement over follower count, as active user interactions are more likely to convert into product sales.' }
    ],
    relatedSlugs: ['video-rpm-calculator', 'audience-growth-calculator'],
    keywords: ['brand deal pricing calculator', 'influencer sponsor rates', 'social media engagement score'],
    calculate: (inputs) => {
      const followers = Number(inputs.followers || 25000);
      const eng = Number(inputs.engagement || 3.5) / 100;
      const cpe = Number(inputs.cpe || 0.25);

      const interactions = followers * eng;
      const rate = interactions * cpe;

      return {
        results: [
          { label: 'Fair Sponsor Deal Price', value: `$${rate.toFixed(2)}`, isPrimary: true },
          { label: 'Expected Total Interactions', value: `${Math.round(interactions)} Comments/Likes` }
        ],
        chartData: [
          { name: 'Followers List (divided / 100)', value: Math.round(followers / 100) },
          { name: 'Sponsorship Price ($)', value: Math.round(rate) }
        ]
      };
    }
  },
  {
    id: 'video-rpm',
    name: 'Video RPM Calculator',
    slug: 'video-rpm-calculator',
    category: 'creator-tools',
    description: 'Calculate video creator payout earnings based on views and video RPM rates.',
    seoTitle: 'Video Creator CPM and RPM Payout Calculator',
    seoDescription: 'Obtain estimated video payouts based on raw views and video RPM parameters.',
    inputs: [
      { id: 'views', label: 'Total Expected Video Views', type: 'number', defaultValue: 150000 },
      { id: 'rpm', label: 'Video Payout RPM ($)', type: 'number', defaultValue: 4.8, step: 0.1 }
    ],
    formula: 'Estimated Payout = (Views / 1,000) * RPM',
    explanation: 'Track your video monetization by calculating earnings per thousand views (RPM), which represents your net payout after platform commissions.',
    example: 'Generating 150,000 views at a $4.80 RPM yields a net payout of approximately $720.',
    faq: [
      { question: 'What is the CPM vs. RPM difference for video?', answer: 'CPM is what advertisers pay the platform, while RPM represents your actual net earnings after the platform takes its commission share.' }
    ],
    relatedSlugs: ['creator-sponsorship-calculator', 'audience-growth-calculator'],
    keywords: ['video creator payouts RPM', 'youtube ad revenue calculator', 'membership video monetization'],
    calculate: (inputs) => {
      const views = Number(inputs.views || 150000);
      const rpm = Number(inputs.rpm || 4.8);

      const earnings = (views / 1000) * rpm;

      return {
        results: [
          { label: 'Net Video Earnings', value: `$${earnings.toFixed(2)}`, isPrimary: true },
          { label: 'Earnings Per View', value: `$${(rpm/1000).toFixed(4)}` }
        ],
        chartData: [
          { name: 'Video Views (divided / 1000)', value: Math.round(views / 1000) },
          { name: 'RPM Earnings ($)', value: Math.round(earnings) }
        ]
      };
    }
  },
  {
    id: 'audience-growth',
    name: 'Audience Growth Calculator',
    slug: 'audience-growth-calculator',
    category: 'creator-tools',
    description: 'Calculate required monthly growth rates to reach your target follower counts over time.',
    seoTitle: 'Audience and Follower Growth Target Calculator',
    seoDescription: 'Determine the monthly growth rate required to reach your target follower count over a set timeline.',
    inputs: [
      { id: 'current', label: 'Current Followers Count', type: 'number', defaultValue: 5000 },
      { id: 'target', label: 'Target Followers Goal', type: 'number', defaultValue: 15000 },
      { id: 'months', label: 'Target timeline (Months)', type: 'number', defaultValue: 12 }
    ],
    formula: 'Required Monthly Growth Rate (%) = [(Target / Current) ^ (1 / Months) - 1] * 100',
    explanation: 'Calculate the compound monthly growth rate required to scale your audience to a target size over a specific timeframe.',
    example: 'Scaling a newsletter subscriber base from 5,000 to 15,000 over 12 months requires a consistent monthly growth rate of 9.59%.',
    faq: [
      { question: 'Why use compounded growth targets?', answer: 'Compounded growth reflects social sharing dynamics, where an expanding audience naturally accelerates reach over time.' }
    ],
    relatedSlugs: ['creator-sponsorship-calculator', 'content-calendar-calculator'],
    keywords: ['audience expansion target', 'compounding subscriber growth', 'newsletter target pacing'],
    calculate: (inputs) => {
      const cur = Math.max(1, Number(inputs.current || 5000));
      const tgt = Math.max(1, Number(inputs.target || 15000));
      const m = Math.max(1, Number(inputs.months || 12));

      const reqRate = (Math.pow(tgt / cur, 1 / m) - 1) * 100;
      const addPerMonth = (tgt - cur) / m;

      return {
        results: [
          { label: 'Required Monthly Growth Rate', value: `${reqRate.toFixed(2)}%`, isPrimary: true },
          { label: 'Linear Monthly additions', value: `+${addPerMonth.toFixed(0)} subscribers/mo` }
        ],
        chartData: [
          { name: 'Starting Baseline', value: cur },
          { name: 'Target Goal', value: tgt }
        ]
      };
    }
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar Calculator',
    slug: 'content-calendar-calculator',
    category: 'creator-tools',
    description: 'Calculate your total yearly content output based on weekly publishing schedules.',
    seoTitle: 'Content Calendar Production Speed Calculator',
    seoDescription: 'Determine total yearly content output and target workloads based on weekly publishing targets.',
    inputs: [
      { id: 'postsWeek', label: 'Planned Posts / Videos per Week', type: 'number', defaultValue: 3 },
      { id: 'hoursPost', label: 'Average Production Time per Post (Hours)', type: 'number', defaultValue: 4 }
    ],
    formula: 'Yearly Output = Posts/Week * 52 weeks\nWeekly Workload = Posts/Week * Hours/Post',
    explanation: 'Structure your content pipeline by tracking weekly hours and total annual outputs to maintain a sustainable schedule.',
    example: 'Publishing 3 videos weekly with a 4-hour production time per video represents 12 hours of weekly workload, yielding a total of 156 items annually.',
    faq: [
      { question: 'How can content batching save time?', answer: 'Batching identical production tasks (like scripting, filming, or editing) reduces switching costs and improves focus.' }
    ],
    relatedSlugs: ['audience-growth-calculator', 'creator-sponsorship-calculator'],
    keywords: ['content pipeline volume planner', 'youtube filming calendar tracker', 'yearly media volume'],
    calculate: (inputs) => {
      const posts = Number(inputs.postsWeek || 3);
      const hrs = Number(inputs.hoursPost || 4);

      const weeklyHrs = posts * hrs;
      const annualPosts = posts * 52;
      const annualHrs = weeklyHrs * 52;

      return {
        results: [
          { label: 'Yearly Content Output', value: `${annualPosts} Assets / Year`, isPrimary: true },
          { label: 'Weekly Production Workload', value: `${weeklyHrs.toFixed(1)} Hours/Week` },
          { label: 'Total Yearly Production Time', value: `${annualHrs.toLocaleString()} Hours/Year` }
        ],
        chartData: [
          { name: 'Weekly Work Hours', value: Math.round(weeklyHrs) },
          { name: 'Yearly Assets Count', value: annualPosts }
        ]
      };
    }
  }
];
