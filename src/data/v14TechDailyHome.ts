import { Calculator } from '../types';

export const V14_TECH_DAILY_HOME_CALCULATORS: Calculator[] = [
  // PROGRAMMING
  {
    id: 'code-exec-time',
    name: 'Code Execution Time Calculator',
    slug: 'code-execution-time-calculator',
    category: 'programming',
    description: 'Calculate overall program run durations based on algorithmic step counts (Big O complexity) and computer CPU clock rates.',
    seoTitle: 'Big O Algorithmic Code Execution Solver',
    seoDescription: 'Estime program runtime durations based on algorithmic operations count and CPU clock speed.',
    inputs: [
      { id: 'dataSize', label: 'Dataset Array Length (N)', type: 'number', defaultValue: 10000 },
      { id: 'complexity', label: 'Algorithmic Complexity (Big O)', type: 'select', defaultValue: 'nlogn', options: [
        { label: 'O(1) - Constant Time', value: '1' },
         { label: 'O(log N) - Logarithmic Time', value: 'logn' },
        { label: 'O(N) - Linear Time', value: 'n' },
        { label: 'O(N log N) - Linearithmic Time', value: 'nlogn' },
        { label: 'O(N^2) - Quadratic Time (e.g. Nested loops)', value: 'n2' }
      ]},
      { id: 'cpuSpeed', label: 'CPU Operations Capacity (GHz)', type: 'number', defaultValue: 3.5 }
    ],
    formula: 'Operations = solved according to Big O formula on N\nExecution Time = Operations / (CPU Speed * 10^9)',
    explanation: 'Demonstrates why selecting efficient algorithms is critical when scaling datasets from thousands to millions of entries.',
    example: 'Processing 10,000 items with an O(N^2) quadratic algorithm on a 3.5 GHz processor requires 100 million operations, taking 28.57 milliseconds.',
    faq: [
      { question: 'What does Big O complexity measure?', answer: 'Big O complexity models how execution time or memory usage scales relative to the input dataset size (N).' },
      { question: 'Is algorithmic efficiency or hardware speed more important when scaling?', answer: 'Algorithmic efficiency is far more important. A well-designed linear algorithm running on a slow phone will quickly outperform a quadratic algorithm running on a supercomputer as N scales.' }
    ],
    relatedSlugs: ['binary-converter', 'hexadecimal-converter'],
    calculate: (inputs) => {
      const n = Number(inputs.dataSize || 10000);
      const complexity = String(inputs.complexity || 'nlogn');
      const ghz = Number(inputs.cpuSpeed || 3.5);

      let ops = 1;
      if (complexity === '1') ops = 1;
      else if (complexity === 'logn') ops = Math.max(1, Math.log2(n));
      else if (complexity === 'n') ops = n;
      else if (complexity === 'nlogn') ops = n * Math.max(1, Math.log2(n));
      else if (complexity === 'n2') ops = n * n;

      const seconds = ops / (ghz * 1e9);
      const ms = seconds * 1000;

      return {
        results: [
          { label: 'Estimated Run Duration', value: ms < 1e-3 ? `${(ms * 1000).toFixed(3)} microseconds` : `${ms.toFixed(4)} ms`, isPrimary: true },
          { label: 'Calculated Operations Count', value: ops.toLocaleString() },
          { label: 'CPU Cycles Capacity/sec', value: `${(ghz * 1e9).toLocaleString()} cycles` }
        ],
        chartData: [
          { name: 'Algorithmic Operations', value: Math.min(1000000, ops) }
        ]
      };
    }
  },
  {
    id: 'binary-converter',
    name: 'Binary Converter',
    slug: 'binary-converter',
    category: 'programming',
    description: 'Convert base-10 decimal numbers to base-2 binary strings and vice versa.',
    seoTitle: 'Decimal to Binary Convert-Translate Solver',
    seoDescription: 'Translate base-10 decimal numbers to base-2 binary values and vice versa with complete byte explanations.',
    inputs: [
      { id: 'decimalInput', label: 'Decimal value', type: 'number', defaultValue: 156 },
      { id: 'binaryInput', label: 'Or binary value', type: 'text', defaultValue: '10011100' }
    ],
    formula: 'Divide decimals by 2 recursively, compiling remainders backward to build the binary string.',
    explanation: 'Digital machines store instructions as high and low voltage states, represented in code as binary 1 and 0 bits.',
    example: 'Converting decimal 156 yields binary 10011100. Conversely, converting binary 10011100 back yields decimal 156.',
    faq: [
      { question: 'What is a bit vs a byte?', answer: 'A single bit is a 1 or 0 binary value. A byte is a group of exactly 8 bits, capable of representing values from 0 to 255.' },
      { question: 'Why does base 2 rule computer architectures?', answer: 'Transistors function as simple on/off switches, making base-2 binary logic highly efficient to implement in physical silicon.' }
    ],
    relatedSlugs: ['hexadecimal-converter', 'code-execution-time-calculator'],
    calculate: (inputs) => {
      const dec = Number(inputs.decimalInput || 0);
      const binStr = String(inputs.binaryInput || '10011100').replace(/[^01]/g, '');

      const binFromDec = dec.toString(2);
      const decFromBin = parseInt(binStr || '0', 2);

      return {
        results: [
          { label: 'Binary from Decimal', value: binFromDec, isPrimary: true },
          { label: 'Decimal from Binary', value: isNaN(decFromBin) ? 'Invalid Binary' : decFromBin },
          { label: 'Hexadecimal value', value: dec.toString(16).toUpperCase() }
        ],
        chartData: [
          { name: 'Decimal Input', value: dec },
          { name: 'Binary parsed Base-10', value: isNaN(decFromBin) ? 0 : decFromBin }
        ]
      };
    }
  },
  {
    id: 'hexadecimal-converter',
    name: 'Hexadecimal Converter',
    slug: 'hexadecimal-converter',
    category: 'programming',
    description: 'Convert base-10 decimal numbers to base-16 hexadecimal characters and vice-versa.',
    seoTitle: 'Decimal to Hexadecimal Mathematical Converter',
    seoDescription: 'Translate base-10 decimal values to base-16 hexadecimal codes, including hex color coordinates.',
    inputs: [
      { id: 'decimalInput', label: 'Decimal value', type: 'number', defaultValue: 255 },
      { id: 'hexInput', label: 'Or Hexadecimal Code', type: 'text', defaultValue: 'FF' }
    ],
    formula: 'Base-16 conversion maps values from 0-15 using digits 0-9 and characters A-F.',
    explanation: 'Hexadecimal provides a compact, human-readable representation of binary values, making it easier to track memory addresses and colors in code.',
    example: 'Decimal 255 translates directly to hex "FF". Conversely, hex "FF" converts back to decimal 255.',
    faq: [
      { question: 'Why is Hexadecimal used in programming?', answer: 'A single hex character represents exactly 4 bits (a nibble), allowing two hexadecimal digits to represent a full 8-bit byte cleanly.' },
      { question: 'What is alpha hex color?', answer: 'Hex colors use 6 digits representing Red, Green, and Blue intensity from 00 to FF (e.g. #FF0000 is red).' }
    ],
    relatedSlugs: ['binary-converter', 'code-execution-time-calculator'],
    calculate: (inputs) => {
      const dec = Number(inputs.decimalInput || 0);
      const hexStr = String(inputs.hexInput || 'FF').trim().toUpperCase().replace(/[^0-9A-F]/g, '');

      const hexFromDec = dec.toString(16).toUpperCase();
      const decFromHex = parseInt(hexStr || '0', 16);

      return {
        results: [
          { label: 'Hex from Decimal', value: hexFromDec, isPrimary: true },
          { label: 'Decimal from Hex', value: isNaN(decFromHex) ? 'Invalid Hex' : decFromHex },
          { label: 'Binary equivalent', value: dec.toString(2) }
        ],
        chartData: [
          { name: 'Decimal Input', value: dec },
          { name: 'Hex parsed Base-10', value: isNaN(decFromHex) ? 0 : decFromHex }
        ]
      };
    }
  },

  // NETWORKING
  {
    id: 'ip-subnet',
    name: 'IP Subnet Calculator',
    slug: 'ip-subnet-calculator',
    category: 'tech',
    description: 'Calculate subnet masks, usable IP ranges, and networks boundaries from CIDR notations.',
    seoTitle: 'IP Subnet & Usable IP CIDR Calculator',
    seoDescription: 'Generate exact subnets, wildcard masks, and broadcast bounds using modern CIDR formatting.',
    inputs: [
      { id: 'ipAddress', label: 'Base IPv4 Address', type: 'text', defaultValue: '192.168.1.1' },
      { id: 'cidr', label: 'Subnet Prefix notation (CIDR)', type: 'number', defaultValue: 24, min: 1, max: 32 }
    ],
    formula: 'Wildcard = 2^(32-CIDR) - 1\nSubnet Mask = bitwise inverted wildcard.',
    explanation: 'CIDR notation defines the portion of an IP address dedicated to representing the network route, leaving the rest for host addresses.',
    example: 'An IP of 192.168.1.1 with a /24 subnet prefix mask yields exactly 254 usable host addresses, spanning from 192.168.1.1 to 192.168.1.254.',
    faq: [
      { question: 'Why are 2 IP addresses subtracted per subnet?', answer: 'The first IP address is reserved for the network address itself, and the last is reserved for broadcast messages, making them unavailable for host assignments.' },
      { question: 'What is a gateway IP address?', answer: 'The gateway address (typically the first usable IP) acts as the routing exit point for external network traffic.' }
    ],
    relatedSlugs: ['data-transfer-rate-calculator', 'binary-converter'],
    calculate: (inputs) => {
      const ip = String(inputs.ipAddress || '192.168.1.1');
      const cidr = Number(inputs.cidr || 24);

      const hosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);

      let mask = '255.255.255.0';
      if (cidr === 16) mask = '255.255.0.0';
      else if (cidr === 8) mask = '255.0.0.0';
      else if (cidr > 24) {
        const excess = cidr - 24;
        let lastOctet = 0;
        for (let i = 0; i < excess; i++) {
          lastOctet += Math.pow(2, 7 - i);
        }
        mask = `255.255.255.${lastOctet}`;
      }

      return {
        results: [
          { label: 'Subnet Mask String', value: mask, isPrimary: true },
          { label: 'Usable Host Addresses count', value: hosts.toLocaleString() },
          { label: 'Network Class', value: cidr >= 24 ? 'Class C Equivalent' : cidr >= 16 ? 'Class B Equivalent' : 'Class A Equivalent' }
        ],
        chartData: [
          { name: 'Usable IP Hosts', value: hosts },
          { name: 'Subnet Prefix bits', value: cidr }
        ]
      };
    }
  },
  {
    id: 'data-transfer',
    name: 'Data Transfer Rate Calculator',
    slug: 'data-transfer-rate-calculator',
    category: 'tech',
    description: 'Estimate network upload/download durations based on file sizes and connection speeds.',
    seoTitle: 'Network Data Transfer & Speed Estimator',
    seoDescription: 'Obtain exact movie and game download times based on MB/s rates and connection speeds.',
    inputs: [
      { id: 'fileSize', label: 'File Size (Gigabytes, GB)', type: 'number', defaultValue: 50 },
      { id: 'networkSpeed', label: 'Download Connection Speed (Mbps)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Time (Seconds) = (File Size * 8000) / Connection Speed (Mbps)',
    explanation: 'Network speeds are measured in bits per second (b/s), whereas file sizes are measured in bytes (B). One byte contains 8 bits, meaning a 100 Mbps connection download speed peaks at 12.5 MB/s.',
    example: 'Downloading a 50 GB game over a 100 Mbps broadband connection takes exactly 1 hour, 6 minutes, and 40 seconds.',
    faq: [
      { question: 'Why does reality download slower than calculations?', answer: 'Real-world transfers experience protocol overhead, network congestion, Wi-Fi packet loss, and destination server limitations.' },
      { question: 'What is Mbps vs MB/s?', answer: 'Mbps stands for Megabits per second (network speed). MB/s stands for Megabytes per second (file writing speed). Multiply MB/s by 8 to convert to Mbps.' }
    ],
    relatedSlugs: ['ip-subnet-calculator', 'video-file-size-calculator'],
    calculate: (inputs) => {
      const gb = Number(inputs.fileSize || 50);
      const mbps = Number(inputs.networkSpeed || 100);

      const bitsTotal = gb * 8 * 1000 * 1000 * 1000;
      const seconds = bitsTotal / (mbps * 1000 * 1000);

      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const remainingSecs = Math.round(seconds % 60);

      let timeText = '';
      if (hrs > 0) timeText += `${hrs}h `;
      if (mins > 0 || hrs > 0) timeText += `${mins}m `;
      timeText += `${remainingSecs}s`;

      return {
        results: [
          { label: 'Estimated Download Duration', value: timeText, isPrimary: true },
          { label: 'Max File Download Rate', value: `${(mbps / 8).toFixed(2)} Megabytes/sec (MB/s)` },
          { label: 'Hourly data throughput', value: `${((mbps * 3600) / 8000).toFixed(1)} Gigabytes/hour` }
        ],
        chartData: [
          { name: 'Download (Seconds)', value: Math.round(seconds) },
          { name: 'Speed (Mbps)', value: mbps }
        ]
      };
    }
  },

  // CONTENT CREATOR
  {
    id: 'cpm-earnings',
    name: 'CPM Ad Earnings Calculator',
    slug: 'cpm-ad-earnings-calculator',
    category: 'business', // We'll classify content-creators under category "business" or "content-creator" (existing category type mapping)
    description: 'Calculate expected yield revenues for creators based on video views and CPM (Cost Per Mille) milestones.',
    seoTitle: 'CPM Video Ad Revenues Calculator',
    seoDescription: 'Input video views and target CPM rates to estimate expected ad revenue.',
    inputs: [
      { id: 'views', label: 'Expected Video Views count', type: 'number', defaultValue: 150000 },
      { id: 'cpm', label: 'Average CPM Rate ($ per 1,000 views)', type: 'number', defaultValue: 4.5 },
      { id: 'revShare', label: 'Platform Revenue Share (%)', type: 'number', defaultValue: 55, helpText: 'e.g. YouTube cuts standard 55% share to creators' }
    ],
    formula: 'Ad Revenue = (Views / 1000) * CPM * (Rev Share / 100)',
    explanation: 'CPM measures the cost an advertiser pays for every 1,000 views of their ad. Creator earnings are calculated after the platform takes its revenue share.',
    example: 'A video receiving 150,000 views with a $4.50 CPM and a 55% platform revenue share generates exactly $371.25 for the creator.',
    faq: [
      { question: 'What factors affect CPM rates?', answer: 'The viewer location (developed countries yield higher CPMs), video niche (finance and tech pay more), and seasonal advertiser demand (higher in Q4) all influence CPM rates.' },
      { question: 'What is RPM vs CPM?', answer: 'CPM is what advertisers pay per 1,000 ad impressions. RPM is what creators actually earn per 1,000 total views across all monetization channels (ads, memberships, etc.).' }
    ],
    relatedSlugs: ['video-file-size-calculator', 'net-revenue-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.views || 150000);
      const c = Number(inputs.cpm || 4.5);
      const s = Number(inputs.revShare || 55) / 100;

      const grossAd = (v / 1000) * c;
      const creatorTake = grossAd * s;

      return {
        results: [
          { label: 'Creator Net Earnings Pay', value: `$${creatorTake.toFixed(2)}`, isPrimary: true },
          { label: 'Gross Advertiser Spend', value: `$${grossAd.toFixed(2)}` },
          { label: 'Platform Profit Cut', value: `$${(grossAd - creatorTake).toFixed(2)}` },
          { label: 'Earnings pace per 10k views', value: `$${((10000 / 1000) * c * s).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Creator Share', value: Math.round(creatorTake) },
          { name: 'Platform Cut', value: Math.round(grossAd - creatorTake) }
        ]
      };
    }
  },
  {
    id: 'video-size',
    name: 'Video File Size Calculator',
    slug: 'video-file-size-calculator',
    category: 'business',
    description: 'Calculate video storage file sizes based on bitrate settings and recording durations.',
    seoTitle: 'Video Storage File Size Calculator',
    seoDescription: 'Obtain expected video record sizes in GB based on recording resolution, container compression, and length.',
    inputs: [
      { id: 'duration', label: 'Recording Duration (Minutes)', type: 'number', defaultValue: 30 },
      { id: 'bitrate', label: 'Video Bitrate (Mbps)', type: 'select', defaultValue: '15', options: [
        { label: '4K Ultra HD (60 Mbps)', value: '60' },
        { label: '1080p High Quality (15 Mbps)', value: '15' },
        { label: '720p HD Standard (5 Mbps)', value: '5' }
      ]},
      { id: 'audioBitrate', label: 'Audio Stream Bitrate (kbps)', type: 'number', defaultValue: 192 }
    ],
    formula: 'Total Bitrate = Video Bitrate + (Audio Bitrate / 1000)\nFile Size (GB) = (Total Bitrate * 60 * Duration) / 8000',
    explanation: 'Higher bitrates capture more visual detail per frame but require significantly more storage space and internet bandwidth to stream.',
    example: 'A 30-minute 1080p video recorded at a 15 Mbps video bitrate with a 192 kbps audio track consumes exactly 3.42 GB of storage.',
    faq: [
      { question: 'What is a video bitrate?', answer: 'The volume of data processed per second of video playback, measured in Megabits per second (Mbps).' },
      { question: 'How can I compress video files without losing quality?', answer: 'Use highly efficient video codecs like H.265 (HEVC) or AV1 to compress files by up to 50% compared to standard H.264 formats.' }
    ],
    relatedSlugs: ['audio-file-size-calculator', 'data-transfer-rate-calculator'],
    calculate: (inputs) => {
      const mins = Number(inputs.duration || 30);
      const vBitrate = Number(inputs.bitrate || 15);
      const aBitrate = Number(inputs.audioBitrate || 192) / 1000; // convert kbps to Mbps

      const totalBitrate = vBitrate + aBitrate;
      const fileGB = (totalBitrate * 60 * mins) / 8000;

      return {
        results: [
          { label: 'Estimated Video file Size', value: `${fileGB.toFixed(2)} GB`, isPrimary: true },
          { label: 'File size in Megabytes', value: `${(fileGB * 1024).toFixed(0)} MB` },
          { label: 'Overall Bitrate speed', value: `${totalBitrate.toFixed(3)} Mbps` }
        ],
        chartData: [
          { name: 'Video Data Yield', value: Math.round(vBitrate * 10) },
          { name: 'Audio Data Yield', value: Math.round(aBitrate * 10) }
        ]
      };
    }
  },
  {
    id: 'audio-size',
    name: 'Audio File Size Calculator',
    slug: 'audio-size-calculator',
    category: 'business',
    description: 'Calculate digital audio recording storage based on sample rates, word bit-widths, and channels.',
    seoTitle: 'Digital Audio storage size Calculator',
    seoDescription: 'Analyze recorded audio file sizes. Compare lossless WAV parameters against compressed MP3 bitrates.',
    inputs: [
      { id: 'duration', label: 'Audio Duration (Minutes)', type: 'number', defaultValue: 60 },
      { id: 'sampleRate', label: 'Sample Rate (kHz)', type: 'select', defaultValue: '44.1', options: [
        { label: 'CD Standard quality (44.1 kHz)', value: '44.1' },
        { label: 'Pro Recording studio (48.0 kHz)', value: '48.0' },
        { label: 'High-Res audio path (96.0 kHz)', value: '96.0' }
      ]},
      { id: 'bitDepth', label: 'Audio Word Bit-Width', type: 'select', defaultValue: '16', options: [
        { label: '16-bit Lossless standard', value: '16' },
        { label: '24-bit studio depth', value: '24' },
        { label: '32-bit floating dynamics', value: '32' }
      ]},
      { id: 'channels', label: 'Channel Mode', type: 'select', defaultValue: '2', options: [
        { label: 'Stereo (2 Channels)', value: '2' },
        { label: 'Mono (1 Channel)', value: '1' }
      ]}
    ],
    formula: 'Bitrate (bps) = Sample Rate * Bit Depth * Channels\nFile Size (MB) = (Bitrate * 60 * Duration) / (8 * 1024 * 1024)',
    explanation: 'Uses digital audio parameters to calculate files size for uncompressed pulse-code modulation (PCM/WAV) audio.',
    example: 'A 60-minute stereo CD recording (44.1 kHz, 16-bit) consumes exactly 605.62 MB of uncompressed storage.',
    faq: [
      { question: 'Why does uncompressed WAV require more space?', answer: 'WAV files store every individual audio sample captured without compression. In contrast, MP3 files remove imperceptible high-frequency details to compress files by up to 90%.' },
      { question: 'What sample rate is recommended?', answer: 'The CD standard (44.1 kHz) is ideal for typical listening as it covers the full range of human hearing (up to 20 kHz).' }
    ],
    relatedSlugs: ['video-file-size-calculator', 'data-transfer-rate-calculator'],
    calculate: (inputs) => {
      const mins = Number(inputs.duration || 60);
      const sr = Number(inputs.sampleRate || 44.1) * 1000;
      const bd = Number(inputs.bitDepth || 16);
      const ch = Number(inputs.channels || 2);

      const bitsPerSec = sr * bd * ch;
      const fileMB = (bitsPerSec * 60 * mins) / (8 * 1024 * 1024);

      return {
        results: [
          { label: 'Uncompressed File Size', value: `${fileMB.toFixed(2)} Megabytes (MB)`, isPrimary: true },
          { label: 'Lossless Audio Bitrate', value: `${(bitsPerSec / 1000).toFixed(0)} kbps` },
          { label: 'Gigabytes equivalent', value: `${(fileMB / 1024).toFixed(3)} GB` }
        ],
        chartData: [
          { name: 'Audio bytes Size (MB)', value: Math.round(fileMB) }
        ]
      };
    }
  },
  {
    id: 'frame-rate-interval',
    name: 'Frame Rate Interval Calculator',
    slug: 'frame-rate-interval-calculator',
    category: 'business',
    description: 'Calculate video time-lapse frame recording intervals based on event duration and target video output specs.',
    seoTitle: 'Time-Lapse Video Frame Interval Calculator',
    seoDescription: 'Obtain required frame intervals (e.g. 1 frame/sec) to capture slow-moving events like clouds or sunset.',
    inputs: [
      { id: 'eventUnits', label: 'Actual Event Duration (Minutes)', type: 'number', defaultValue: 120 },
      { id: 'targetDuration', label: 'Result Clip Duration (Seconds)', type: 'number', defaultValue: 30 },
      { id: 'fps', label: 'Target Output Video Frame Rate (FPS)', type: 'select', defaultValue: '30', options: [
        { label: 'Standard Cinematic (24 fps)', value: '24' },
        { label: 'Standard Online Video (30 fps)', value: '30' },
        { label: 'High Frame Rate (60 fps)', value: '60' }
      ]}
    ],
    formula: 'Total Frames needed = Target Clip Duration * FPS\nFrame Interval (sec) = Event Duration (sec) / Total Frames',
    explanation: 'Calculates the precise interval to program into your camera to cleanly speed up slow-moving events (e.g. sunsets) into a dramatic short clip.',
    example: 'To compress a 2-hour (120 minutes) sunset into a 30-second video at 30 FPS, program your camera to take 1 frame every 8.0 seconds.',
    faq: [
      { question: 'What interval is best for capturing clouds?', answer: 'A 1 to 5 second interval is ideal for moving clouds, whereas sunsets are best captured with a 5 to 10 second interval.' },
      { question: 'What represents the speed factor?', answer: 'The compression speed multiplier. Deconstruct using [Event Time / Clip Time]. At 8-second intervals, time passes 240 times faster than reality.' }
    ],
    relatedSlugs: ['video-file-size-calculator', 'data-transfer-rate-calculator'],
    calculate: (inputs) => {
      const eventMins = Number(inputs.eventUnits || 120);
      const clipSecs = Number(inputs.targetDuration || 30);
      const fps = Number(inputs.fps || 30);

      const totalFramesNeeded = clipSecs * fps;
      const eventSecs = eventMins * 60;
      const intervalSecs = totalFramesNeeded > 0 ? eventSecs / totalFramesNeeded : 0;

      return {
        results: [
          { label: 'Camera Shooting Interval', value: `Take 1 frame every ${intervalSecs.toFixed(1)} seconds`, isPrimary: true },
          { label: 'Total Photos/Frames to Capture', value: `${totalFramesNeeded} photos` },
          { label: 'Time Compression Multiplier', value: `${(eventSecs / clipSecs).toFixed(0)}x Faster` }
        ],
        chartData: [
          { name: 'Event Time (Secs)', value: eventSecs },
          { name: 'Video Playback Time (Secs)', value: clipSecs * 10 } // Scaled for comparison
        ]
      };
    }
  },

  // DAILY LIFE
  {
    id: 'v14-sleep-cycle',
    name: 'Sleep Cycle Calculator',
    slug: 'sleep-cycle-calculator',
    category: 'daily-life', // Exist Category mapping
    description: 'Structure custom morning waking horizons tailored around 90-minute neural sleep cycles to wake up feeling refreshed.',
    seoTitle: 'Milli-Shorings Sleep Cycle Waking Planner',
    seoDescription: 'Plan morning wakeup times to coincide with rapid eye movement cycles, avoiding groggy mornings.',
    inputs: [
      { id: 'targetWakeHour', label: 'Desired waking alarm hour', type: 'select', defaultValue: '07', options: [
        { label: '05:00 AM', value: '05' },
        { label: '06:00 AM', value: '06' },
        { label: '07:00 AM', value: '07' },
        { label: '08:00 AM', value: '08' }
      ]},
       { id: 'averageLatency', label: 'Aver fall-asleep latency (Minutes)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Sleep parameters calculated in backwards 90 minute chunks from target waking alarm.',
    explanation: 'Waking up in the middle of a deep sleep cycle causes sleep inertia and morning grogginess. Waking up during light sleep leaves you feeling energized and alert.',
    example: 'If your alarm is set for 7:00 AM, sleeping at 10:15 PM or 11:45 PM lines up with sleep cycles to prevent brain fog.',
    faq: [
      { question: 'What is a typical sleep cycle?', answer: 'A sleep cycle consists of progression through light, deep, and REM sleep, lasting approximately 90 minutes for typical adults.' },
      { question: 'What is sleep latency?', answer: 'The duration it takes you to fall asleep after turning off your lights (on average: 10 to 20 minutes).' }
    ],
    relatedSlugs: ['habit-retention-calculator', 'healthy-habit-calculator'],
    calculate: (inputs) => {
      const wakeHr = Number(inputs.targetWakeHour || 7);
      const latency = Number(inputs.averageLatency || 15);

      // We suggest the optimal bedtime intervals for 6 cycles, 5 cycles, 4 cycles
      const cycleMin = 90;

      // Bedtimes in hours relative to wake-hour
      const calculateBedTime = (cyclesCount: number) => {
        const totalMinutes = (cyclesCount * cycleMin) + latency;
        let bedtimeHr = wakeHr - (totalMinutes / 60);
        if (bedtimeHr < 0) bedtimeHr += 24;

        const hrs = Math.floor(bedtimeHr);
        const mins = Math.round((bedtimeHr - hrs) * 60);
        const padHr = hrs < 10 ? `0${hrs}` : hrs;
        const padMin = mins < 10 ? `0${mins}` : mins;
        return `${padHr}:${padMin} ${hrs >= 12 ? 'PM' : 'AM'}`;
      };

      return {
        results: [
          { label: 'Optimal Sleep Time (6 cycles / 9h)', value: calculateBedTime(6), isPrimary: true },
          { label: 'Standard Option (5 cycles / 7.5h)', value: calculateBedTime(5) },
          { label: 'Minimum Option (4 cycles / 6h)', value: calculateBedTime(4) },
          { label: 'Fall-Asleep Latency Buffered', value: `${latency} mins` }
        ],
        chartData: [
          { name: 'Cycle sleep hours', value: 9 },
          { name: 'Standard sleep hours', value: 7.5 }
        ]
      };
    }
  },
  {
    id: 'habit-retention',
    name: 'Habit Retention Calculator',
    slug: 'habit-retention-calculator',
    category: 'daily-life',
    description: 'Calculate long-term habit retention probability and track streak markers compounding over time.',
    seoTitle: 'Habit Retention Streak & Consistency Solver',
    seoDescription: 'Understand how long it takes to build a habit based on your daily consistency.',
    inputs: [
      { id: 'dailyConsistency', label: 'Daily Habit Consistency (%)', type: 'number', defaultValue: 90 },
      { id: 'consecutiveDays', label: 'Streak Track Length (Days)', type: 'number', defaultValue: 66 }
    ],
    formula: 'Success Probability = (Consistency / 100) ^ consecutiveDays',
    explanation: 'Uses probability theory to show how minor differences in consistency dramatically affect long-term habit building.',
    example: 'An individual with 90% consistency has an overall success probability of 0.09% of maintaining a streak for 66 straight days.',
    faq: [
      { question: 'How long does it take to form a habit?', answer: 'European health studies show that forming a habit takes approximately 66 days of consistent dedication.' },
      { question: 'Does missing one day ruin a habit?', answer: 'No! Research shows that missing a single day does not materially impact long-term habit formation.' }
    ],
    relatedSlugs: ['healthy-habit-calculator', 'study-goal-calculator'],
    calculate: (inputs) => {
      const cons = Number(inputs.dailyConsistency || 90) / 100;
      const days = Number(inputs.consecutiveDays || 66);

      const prob = Math.pow(cons, days) * 100;

      return {
        results: [
          { label: 'Success Probability', value: `${prob.toFixed(4)}%`, isPrimary: true },
          { label: 'Total Target Consistency', value: `${(cons * 100).toFixed(0)}%` },
          { label: 'Milestone Days Tracker', value: `${days} Days` },
          { label: 'Streak Status', value: prob > 50 ? 'Strong Foundation' : 'Requires Focus' }
        ],
        chartData: [
          { name: 'Target Consistency', value: Math.round(cons * 100) },
          { name: 'Streak Probability', value: Math.max(1, Math.round(prob)) }
        ]
      };
    }
  },

  // HOME
  {
    id: 'appliance-cost',
    name: 'Appliance Running Cost Calculator',
    slug: 'appliance-running-cost-calculator',
    category: 'home-tools', // Existing category type
    description: 'Calculate real running costs of individual home appliances based on energy wattage rates.',
    seoTitle: 'Home Appliance Running Cost Calculator',
    seoDescription: 'Obtain appliance running costs. Calculate monthly electrical costs for heaters, pumps, and refrigerators.',
    inputs: [
      { id: 'wattage', label: 'Appliance Power Draw (Watts)', type: 'number', defaultValue: 1500 },
      { id: 'hours', label: 'Daily Running Duration (Hours)', type: 'number', defaultValue: 6 },
      { id: 'costKwh', label: 'Local utility charge ($/kWh)', type: 'number', defaultValue: 0.16 }
    ],
    formula: 'Cost Daily = (Wattage * Hours / 1000) * Utility Charge',
    explanation: 'Track high-wattage home appliances to optimize household heating and cooling costs.',
    example: 'Running a 1,500 Watt air conditioner for 6 hours daily costs exactly $1.44 per day, or $43.92 monthly.',
    faq: [
      { question: 'Which appliances consume the most electricity?', answer: 'Climate control systems (A/C, heaters), water heaters, clothes dryers, and pool pumps draw the most power.' },
      { question: 'What is standby power draw?', answer: 'Power drawn by idle electronics when turned off but plugged in (usually 1-5W per device).' }
    ],
    relatedSlugs: ['electrical-energy-calculator', 'household-water-usage-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.wattage || 1500);
      const h = Number(inputs.hours || 6);
      const c = Number(inputs.costKwh || 0.16);

      const kwhDaily = (w * h) / 1000;
      const costD = kwhDaily * c;
      const costM = costD * 30.5;
      const costY = costD * 365;

      return {
        results: [
          { label: 'Estimated Monthly Cost', value: `$${costM.toFixed(2)}`, isPrimary: true },
          { label: 'Daily Running Cost', value: `$${costD.toFixed(2)}` },
          { label: 'Yearly Running Cost', value: `$${costY.toFixed(2)}` },
          { label: 'Daily Energy consumed', value: `${kwhDaily.toFixed(2)} kWh` }
        ],
        chartData: [
          { name: 'Daily Cost ($)', value: Math.round(costD * 100) },
          { name: 'Monthly Cost ($)', value: Math.round(costM) }
        ]
      };
    }
  },
  {
    id: 'household-water',
    name: 'Household Water Usage Calculator',
    slug: 'household-water-usage-calculator',
    category: 'home-tools',
    description: 'Calculate average monthly household water consumption and identify simple ways to reduce utility bills.',
    seoTitle: 'Household Water Consumption Calculator',
    seoDescription: 'Obtain estimated monthly water usage stats. Compare kitchen, shower, and lawn water usage.',
    inputs: [
      { id: 'showers', label: 'Average Daily Showers Taken', type: 'number', defaultValue: 4 },
      { id: 'showerMins', label: 'Shower Duration (Minutes)', type: 'number', defaultValue: 8 },
      { id: 'flushes', label: 'Average Daily Toilet Flushes', type: 'number', defaultValue: 12 },
      { id: 'irrigation', label: 'Lawn Irrigation frequency (weekly)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Shower usage = Showers * Mins * 2.1 (flow rate)\nFlushes usage = Flushes * 1.6 (flush size)\nTotal water compiled over standard month.',
    explanation: 'Identifies high-water usage areas to help reduce consumption and lower municipal water bills.',
    example: 'Taking 4 showers daily (8 minutes) and flushing 12 times consumes exactly 2,634 gallons of water per month, before accounting for lawn care.',
    faq: [
      { question: 'How much water do low-flow fixtures save?', answer: 'Water-saving showerheads can reduce shower water usage by up to 40% while maintaining strong water pressure.' },
      { question: 'How much water does lawn watering use?', answer: 'Irrigating a lawn can consume 300 to 1,000 gallons per week, depending on lawn size and climate.' }
    ],
    relatedSlugs: ['appliance-running-cost-calculator', 'gardening-seed-spacing-calculator'],
    calculate: (inputs) => {
      const s = Number(inputs.showers || 4);
      const sm = Number(inputs.showerMins || 8);
      const fl = Number(inputs.flushes || 12);
      const ir = Number(inputs.irrigation || 2);

      const showerG = s * sm * 2.1; // 2.1 gpm standard flow rate
      const flushG = fl * 1.6; // 1.6 gpf standard toilet size
      const lawnG = (ir * 250) / 7; // Average lawn irrigation consumes ~250 gallons per pass

      const dailyTotal = showerG + flushG + lawnG;
      const monthlyTotal = dailyTotal * 30.5;

      return {
        results: [
          { label: 'Estimated Monthly Water Use', value: `${Math.round(monthlyTotal).toLocaleString()} Gallons`, isPrimary: true },
          { label: 'Daily Water Consumption', value: `${Math.round(dailyTotal)} Gallons` },
          { label: 'Estimated Monthly Cost (at $0.015/gal)', value: `$${(monthlyTotal * 0.015).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Shower Gallons', value: Math.round(showerG * 30.5) },
          { name: 'Toilets Flush', value: Math.round(flushG * 30.5) },
          { name: 'Lawn Sprinkling', value: Math.round(lawnG * 30.5) }
        ]
      };
    }
  },
  {
    id: 'seed-spacing',
    name: 'Gardening Seed Spacing Calculator',
    slug: 'gardening-seed-spacing-calculator',
    category: 'gardening', // Dynamic gardening category added in V14
    description: 'Calculate the total number of vegetable seeds or seedlings required for your garden rows based on spacing guidelines.',
    seoTitle: 'Gardening Seed & Row Spacing Calculator',
    seoDescription: 'Obtain suggested vegetable seed row spacing targets. Maximize harvest volume from raised garden beds.',
    inputs: [
      { id: 'bedLength', label: 'Garden Bed Row Length (feet)', type: 'number', defaultValue: 10 },
      { id: 'seedSpacing', label: 'Recommended Seed Spacing (inches)', type: 'number', defaultValue: 3 },
      { id: 'rowsCount', label: 'Number of Rows Plotted', type: 'number', defaultValue: 3 }
    ],
    formula: 'Seeds Per Row = (Row Length * 12) / Seed Spacing\nTotal Seeds = Seeds Per Row * Rows Count',
    explanation: 'Uses standard spacing guidelines to calculate seed requirements for garden beds, ensuring optimal nutrients and sunlight for vegetables.',
    example: 'Planning a 10-foot garden bed with 3 rows of carrots spaced 3 inches apart requires planting exactly 120 carrot seeds.',
    faq: [
      { question: 'Why does seed spacing matter?', answer: 'Planting seeds too close together forces growing seedlings to compete for valuable water, nutrients, and sunlight, leading to stunted growth.' },
      { question: 'Why is thinning seedlings recommended?', answer: 'Thinning involves removing excess weak seedlings to ensure remaining plants have adequate space to mature.' }
    ],
    relatedSlugs: ['household-water-usage-calculator', 'craft-diy-material-calculator'],
    calculate: (inputs) => {
      const len = Number(inputs.bedLength || 10);
      const space = Number(inputs.seedSpacing || 3);
      const rows = Number(inputs.rowsCount || 3);

      const rowLenInches = len * 12;
      const seedsPerRow = space > 0 ? Math.floor(rowLenInches / space) + 1 : 0;
      const total = seedsPerRow * rows;

      return {
        results: [
          { label: 'Required Garden Seedlings', value: `${total} Seeds/Plants`, isPrimary: true },
          { label: 'Seedlings Per Row Count', value: `${seedsPerRow} seedlings` },
          { label: 'Gardening Bed size', value: `${len} feet` }
        ],
        chartData: [
          { name: 'Row Seedlings count', value: seedsPerRow },
          { name: 'Total Plotted Rows', value: rows * 10 } // Scaled for density
        ]
      };
    }
  },
  {
    id: 'craft-diy-material',
    name: 'Craft & DIY Material Estimator',
    slug: 'craft-diy-material-calculator',
    category: 'diy', // Dynamic Category added
    description: 'Calculate materials needed for brick, tiling, or canvas painting craft projects based on dimensions.',
    seoTitle: 'Tiling & Craft DIY Material Estimator',
    seoDescription: 'Obtain dimensions and wall tiling piece estimates. Incorporate waste cushions easily.',
    inputs: [
      { id: 'surfaceArea', label: 'Project Surface Area (sq feet)', type: 'number', defaultValue: 120 },
      { id: 'pieceArea', label: 'Single Tile/Item Area (sq inches)', type: 'number', defaultValue: 144, helpText: 'e.g. 12x12 inch tile is 144 sq in' },
      { id: 'wasteFactor', label: 'Recommended Waste Cushion (%)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Net Pieces = Surface Area / (Piece Area / 144)\nTotal Pieces = Net Pieces * (1 + Waste Factor/100)',
    explanation: 'Uses project dimensions to estimate required materials, reducing costs and waste.',
    example: 'Tiling a 120 sq ft patio with 12x12 inch tiles with a 10% waste buffer requires ordering exactly 132 tiles.',
    faq: [
      { question: 'Why is a waste factor buffer critical?', answer: 'Cutting materials to fit corners or irregular borders always results in waste. Keeping a 10% cushion ensures you have enough tiles to complete the job.' },
      { question: 'How do you calculate single tile area?', answer: 'Multiply tile width by height (e.g., a 6x6 inch tile covers exactly 36 square inches).' }
    ],
    relatedSlugs: ['gardening-seed-spacing-calculator', 'appliance-running-cost-calculator'],
    calculate: (inputs) => {
      const area = Number(inputs.surfaceArea || 120);
      const pieceSize = Number(inputs.pieceArea || 144);
      const waste = Number(inputs.wasteFactor || 10) / 100;

      const pieceSf = pieceSize / 144;
      const basePieces = pieceSf > 0 ? area / pieceSf : 0;
      const bufferQty = basePieces * waste;
      const total = basePieces + bufferQty;

      return {
        results: [
          { label: 'Required Material Units', value: `${Math.ceil(total)} Pieces`, isPrimary: true },
          { label: 'Waste Buffer Cushion', value: `${Math.ceil(bufferQty)} pieces` },
          { label: 'Surface area measured', value: `${area} sq ft` }
        ],
        chartData: [
          { name: 'Required Base Pieces', value: Math.ceil(basePieces) },
          { name: 'Waste Buffer Pieces', value: Math.ceil(bufferQty) }
        ]
      };
    }
  }
];
