import { Calculator } from '../types';

export const V12_PART4_CALCULATORS: Calculator[] = [
  // ==================== VIDEO & STREAMING ====================
  {
    id: 'streaming-bitrate',
    name: 'Streaming Bitrate Calculator',
    slug: 'streaming-bitrate-calculator',
    category: 'video-streaming',
    description: 'Calculate target upload bitrates and bandwidth requirements based on resolution and framerate settings.',
    seoTitle: 'Live video upload stream bitrate sizer',
    seoDescription: 'Calculate target upload bitrates and network requirements based on resolution and framerate settings.',
    inputs: [
      { id: 'resolution', label: 'Streaming Video resolution', type: 'select', defaultValue: '1080p', options: [
        { label: '4K Ultra-HD (2160p)', value: '2160p' },
        { label: 'Full High-Def (1080p)', value: '1080p' },
        { label: 'Standard High-Def (720p)', value: '720p' }
      ]},
      { id: 'framerate', label: 'Frame frequency (FPS)', type: 'select', defaultValue: '60', options: [
        { label: '60 Frames per Second', value: '60' },
        { label: '30 Frames per Second', value: '30' }
      ]}
    ],
    formula: 'Required Upload Bandwidth = Target Stream Bitrate * 1.5 (safety buffer multiplier)',
    explanation: 'A 50% safety buffer is recommended for stream bitrates to prevent frames dropping during network spikes.',
    example: 'Streaming at 1080p at 60fps requires a target stream bitrate of approximately 6,000 Kbps and at least 9.0 Mbps in upload bandwidth.',
    faq: [{ question: 'What is a dropped frame?', answer: 'A frame discarded by encoders due to sudden drops in network upload bandwidth.' }],
    relatedSlugs: ['video-storage-calculator', 'upload-time-calculator'],
    keywords: ['obs upload bitrate standards', 'twitch livestream bandwidth needs', 'framerate encoder buffers'],
    calculate: (inputs) => {
      const res = inputs.resolution || '1080p';
      const fps = inputs.framerate || '60';

      let bitrateKbps = 6000;
      if (res === '2160p') {
        bitrateKbps = fps === '60' ? 20000 : 13000;
      } else if (res === '1080p') {
        bitrateKbps = fps === '60' ? 6000 : 4500;
      } else {
        bitrateKbps = fps === '60' ? 3800 : 2500;
      }

      const requiredBandwidth = (bitrateKbps / 1024) * 1.5;

      return {
        results: [
          { label: 'Target Streaming Bitrate', value: `${bitrateKbps} Kbps`, isPrimary: true },
          { label: 'Recommended Upload Bandwidth', value: `${requiredBandwidth.toFixed(1)} Mbps` }
        ],
        chartData: [
          { name: 'Nominal Bitrate', value: bitrateKbps / 1024 },
          { name: 'Required Buffer', value: (bitrateKbps / 1024) * 0.5 }
        ]
      };
    }
  },
  {
    id: 'video-storage-calculator',
    name: 'Video Storage Calculator',
    slug: 'video-storage-calculator',
    category: 'video-streaming',
    description: 'Calculate video project file size allocations based on format and shooting duration.',
    seoTitle: 'Movie camera RAW Video Storage Sizer',
    seoDescription: 'Model your video storage needs based on resolution, bit depth, and raw recording hours.',
    inputs: [
      { id: 'hours', label: 'Shoot Recording duration (Hours)', type: 'number', defaultValue: 2 },
      { id: 'codecFormat', label: 'Selected production codec format', type: 'select', defaultValue: 'prores', options: [
        { label: 'Raw Uncompressed (1200GB / Hour)', value: 'uncompressed' },
        { label: 'ProRes 422 HQ (100GB / Hour)', value: 'prores' },
        { label: 'H.264 Web / MP4 (15GB / Hour)', value: 'h264' }
      ]}
    ],
    formula: 'File Size = recording hours * Codec Data Sizing Multiplier',
    explanation: 'Recording in ProRes HQ captures excellent visual detail, but requires significantly more storage space than standard H.264 codecs.',
    example: 'A 2-hour multicam shoot in ProRes 422 HQ requires approximately 200 GB in storage capacity.',
    faq: [{ question: 'What is ProRes?', answer: 'A high-performance intermediate video codec developed by Apple for video editing.' }],
    relatedSlugs: ['streaming-bitrate-calculator', 'upload-time-calculator'],
    keywords: ['camera footage file sizes', 'raw recording data sizer', 'video editor capacity requirements'],
    calculate: (inputs) => {
      const hrs = Number(inputs.hours || 2);
      const codec = inputs.codecFormat || 'prores';

      let sizePerHr = 100;
      if (codec === 'uncompressed') sizePerHr = 1200;
      else if (codec === 'h264') sizePerHr = 15;

      const totalGb = hrs * sizePerHr;

      return {
        results: [
          { label: 'Estimated Video File Size', value: `${totalGb.toLocaleString()} GB`, isPrimary: true },
          { label: 'Hourly Codec Payload Rate', value: `${sizePerHr} GB / Hour` }
        ],
        chartData: [
          { name: 'Sized Video footage', value: totalGb }
        ]
      };
    }
  },
  {
    id: 'render-time',
    name: 'Render Time Calculator',
    slug: 'render-time-calculator',
    category: 'video-streaming',
    description: 'Estimate render times for video export timelines based on project durations and system speeds.',
    seoTitle: 'Digital video editor Export Render Time Calculator',
    seoDescription: 'Estimate video rendering times based on timeline complexity and system speeds.',
    inputs: [
      { id: 'durationMin', label: 'Timeline Video Duration (Minutes)', type: 'number', defaultValue: 10 },
      { id: 'renderSpeed', label: 'System render processing speed', type: 'select', defaultValue: '1x', options: [
        { label: 'Standard Real-Time Export (1x)', value: '1x' },
        { label: 'Faded CPU Heavy Encoding (3x)', value: '3x' },
        { label: 'Modern GPU Accelerated Export (0.3x)', value: '03x' }
      ]}
    ],
    formula: 'Render Time = Project Duration * Speed Multiplier',
    explanation: 'Hardware acceleration (like NVENC or Apple Silicon Media Engines) can export timelines faster than real-time speed.',
    example: 'A 10-minute video timeline takes approximately 30 minutes to render on older systems with heavy CPU software encoding.',
    faq: [{ question: 'How can I speed up exports?', answer: 'Enable GPU acceleration, lower timeline resolutions, or cache preview renders.' }],
    relatedSlugs: ['video-storage-calculator', 'upload-time-calculator'],
    keywords: ['premiere export render estimates', 'davinci gpu encoder speeds', 'timeline complexity scales'],
    calculate: (inputs) => {
      const dur = Number(inputs.durationMin || 10);
      const speed = inputs.renderSpeed || '1x';

      let mult = 1.0;
      if (speed === '3x') mult = 3.0;
      else if (speed === '03x') mult = 0.3;

      const mins = dur * mult;

      return {
        results: [
          { label: 'Projected Render Time', value: `${mins.toFixed(1)} Minutes`, isPrimary: true },
          { label: 'Export Speed Ratio', value: `${mult.toFixed(2)}x` }
        ],
        chartData: [
          { name: 'Render Minutes', value: Math.round(mins) }
        ]
      };
    }
  },
  {
    id: 'upload-time',
    name: 'Upload Time Calculator',
    slug: 'upload-time-calculator',
    category: 'video-streaming',
    description: 'Calculate video export upload durations based on file sizes and network speeds.',
    seoTitle: 'Web video export cloud upload time solver',
    seoDescription: 'Find the time required to upload large video files based on size and network speeds.',
    inputs: [
      { id: 'fileSizeGb', label: 'Project Export File size (GB)', type: 'number', defaultValue: 15 },
      { id: 'networkSpeed', label: 'Network Upload Speed (Mbps)', type: 'number', defaultValue: 25 }
    ],
    formula: 'Bits = Gigabytes * 8 * 10^9\nUpload Seconds = Bits / Speed in Megabits per second',
    explanation: 'Broadband plans typically prioritize downstream speeds, making upstream uploads for large video files take surprisingly long.',
    example: 'Uploading a 15 GB video file over a 25 Mbps network connection requires approximately 1.3 hours to complete.',
    faq: [{ question: 'How can I speed up uploads?', answer: 'Use fiber connections with symmetrical speeds, or export files in compressed formats like WebM.' }],
    relatedSlugs: ['render-time-calculator', 'video-storage-calculator'],
    keywords: ['vimeo fiber upload hours', 'symmetrical upstream calculator', 'frame rendering data'],
    calculate: (inputs) => {
      const size = Number(inputs.fileSizeGb || 15);
      const speed = Number(inputs.networkSpeed || 25);

      const sizeBits = size * 8 * 1024 * 1024 * 1024;
      const speedBitsSec = speed * 1000 * 1000;

      const seconds = speedBitsSec > 0 ? sizeBits / speedBitsSec : 0;
      const hours = seconds / 3600;

      return {
        results: [
          { label: 'Estimated Upload Duration', value: `${hours.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Stream Payload Speed', value: `${(speed / 8).toFixed(1)} MB / Sec` }
        ],
        chartData: [
          { name: 'Upload Hours', value: Math.round(hours) }
        ]
      };
    }
  },
  {
    id: 'streaming-cost',
    name: 'Streaming Cost Calculator',
    slug: 'streaming-cost-calculator',
    category: 'video-streaming',
    description: 'Calculate video CDN hosting costs based on traffic volume and delivery pricing.',
    seoTitle: 'Video CDN traffic streaming cost estimator',
    seoDescription: 'Estimate your video CDN streaming costs based on traffic volume and average file sizes.',
    inputs: [
      { id: 'viewers', label: 'Expected monthly Viewers count', type: 'number', defaultValue: 5000 },
      { id: 'avgVideoMb', label: 'Average Video size downloaded (MB)', type: 'number', defaultValue: 350 },
      { id: 'cdnCost', label: 'CDN distribution charge ($ per GB)', type: 'number', defaultValue: 0.08 }
    ],
    formula: 'Cost = [Viewers * Video Size / 1024] * CDN Cost per GB',
    explanation: 'Self-hosting video can be expensive, as CDNs charge for data transfer based on bandwidth usage.',
    example: 'Hosting 5,000 monthly viewers watching a 350 MB video generates $136.72 in CDN distribution costs at $0.08/GB.',
    faq: [{ question: 'What is a CDN pull?', answer: 'The first time a file is requested, the CDN pulls and caches it from the primary server.' }],
    relatedSlugs: ['hosting-cost-calculator', 'server-capacity-calculator'],
    keywords: ['vimeo enterprise cdn rates', 'bandwidth egress charges', 'video platform hosting costs'],
    calculate: (inputs) => {
      const views = Number(inputs.viewers || 5000);
      const size = Number(inputs.avgVideoMb || 350);
      const cost = Number(inputs.cdnCost || 0.08);

      const totalGb = (views * size) / 1024;
      const finalCost = totalGb * cost;

      return {
        results: [
          { label: 'Estimated Monthly CDN Cost', value: finalCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Egress Data Transferred', value: `${Math.round(totalGb).toLocaleString()} GB` }
        ],
        chartData: [
          { name: 'CDN Charge Cost', value: Math.round(finalCost) }
        ]
      };
    }
  },

  // ==================== MUSIC ====================
  {
    id: 'audio-storage-calculator',
    name: 'Audio Storage Calculator',
    slug: 'audio-storage-calculator',
    category: 'music',
    description: 'Check required audio tracking storage capacity based on sample rates and session durations.',
    seoTitle: 'Music Production project audio storage sizer',
    seoDescription: 'Model your audio tracking storage needs based on sample rates and multi-track session hours.',
    inputs: [
      { id: 'tracks', label: 'Total multi-track Session tracks count', type: 'number', defaultValue: 24 },
      { id: 'sampleRate', label: 'Recording Sample standard (kHz)', type: 'select', defaultValue: '48', options: [
        { label: 'Standard Studio (48 kHz / 24-bit)', value: '48' },
        { label: 'Deluxe High-End (96 kHz / 24-bit)', value: '96' }
      ]},
      { id: 'durHrs', label: 'Recording Session duration (Hours)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Data Rate = Sample Rate * Bit Depth * Tracks\nFile Size = Duration * Data Rate',
    explanation: 'Recording a multi-track studio session at high resolutions generates large file sizes, requiring ample drive space.',
    example: 'A 24-track session recorded for 3 hours at 48kHz / 24-bit generates approximately 35.5 GB of audio data.',
    faq: [{ question: 'Why use 24-bit over 16-bit?', answer: '24-bit increases dynamic range, lowering the noise floor and preventing digital clipping.' }],
    relatedSlugs: ['video-storage-calculator', 'photo-storage-calculator'],
    keywords: ['daw session track data', 'uncompressed wav sizing converter', 'hifi audio bytes footprint'],
    calculate: (inputs) => {
      const tracks = Math.max(1, Number(inputs.tracks || 24));
      const rate = inputs.sampleRate === '96' ? 96000 : 48000;
      const hrs = Number(inputs.durHrs || 3);

      const bytesPerSec = rate * 3 * tracks; // 24-bit = 3 bytes
      const totalGb = (bytesPerSec * hrs * 3600) / (1024 * 1024 * 1024);

      return {
        results: [
          { label: 'Estimated Session Size', value: `${totalGb.toFixed(2)} GB`, isPrimary: true },
          { label: 'Payload bytes rate equivalent', value: `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB / Sec` }
        ],
        chartData: [
          { name: 'Used storage space', value: Math.round(totalGb) }
        ]
      };
    }
  },
  {
    id: 'music-revenue',
    name: 'Music Revenue Calculator',
    slug: 'music-revenue-calculator',
    category: 'music',
    description: 'Calculate net music revenue by balancing physical sales against streaming platform commissions.',
    seoTitle: 'Music distribution revenue sharing ledger',
    seoDescription: 'Forecast your net music revenues after accounting for platform commissions and distributor splits.',
    inputs: [
      { id: 'albumSales', label: 'Assumed album sales ($)', type: 'number', defaultValue: 1200 },
      { id: 'distroFee', label: 'Distributor profit sharing fee (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Net Revenue = Gross Sales * (1 - Distro Fee%)',
    explanation: 'Music distributors take a percentage split of physical and digital album sales to cover distribution costs.',
    example: 'Earning $1,200 in physical album sales under a standard 15% distributor split yields $1,020 in net revenue.',
    faq: [{ question: 'What is mechanical royalty?', answer: 'Royalties paid to songwriters whenever a physical or digital copy of their music is manufactured or downloaded.' }],
    relatedSlugs: ['streaming-earnings-calculator'],
    keywords: ['physical album royalties tracker', 'platform commission share deductions', 'independent artist margins'],
    calculate: (inputs) => {
      const sales = Number(inputs.albumSales || 1200);
      const distro = Number(inputs.distroFee || 15) / 100;

      const fee = sales * distro;
      const net = sales - fee;

      return {
        results: [
          { label: 'Net Artist Revenue', value: net.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Distributor Fee Cut', value: fee.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Artist Profit Share', value: net },
          { name: 'Distributor Cut Cut', value: fee }
        ]
      };
    }
  },
  {
    id: 'streaming-earnings',
    name: 'Streaming Earnings Calculator',
    slug: 'streaming-earnings-calculator',
    category: 'music',
    description: 'Estimate digital streaming royalties for artists across Spotify, Apple, and Amazon Music.',
    seoTitle: 'Spotify & Apple Music Streaming Royalty Calculator',
    seoDescription: 'Estimate your streaming royalties across different digital music platforms.',
    inputs: [
      { id: 'streamCount', label: 'Target Monthly Stream count', type: 'number', defaultValue: 50000 },
      { id: 'platformSelect', label: 'Digital Music Platform', type: 'select', defaultValue: 'spotify', options: [
        { label: 'Spotify ($0.0035 / Stream)', value: 'spotify' },
        { label: 'Apple Music ($0.0075 / Stream)', value: 'apple' },
        { label: 'YouTube Music ($0.0020 / Stream)', value: 'youtube' }
      ]}
    ],
    formula: 'Estimated Royalties = Stream Count * Platform Royalty Rate',
    explanation: 'Royalty rates differ significantly between streaming platforms, which makes distributing your music across multiple channels essential.',
    example: 'Accumulating 50,000 monthly streams on Spotify generates approximately $175 in digital artist royalties.',
    faq: [{ question: 'How do platforms pay artists?', answer: 'Platforms pool payout dollars, distributing royalties based on an artist\'s share of total streams.' }],
    relatedSlugs: ['music-revenue-calculator'],
    keywords: ['stream payout estimates spotify', 'apple music royalty multiplier', 'digital music distributor sheets'],
    calculate: (inputs) => {
      const count = Number(inputs.streamCount || 50000);
      const plat = inputs.platformSelect || 'spotify';

      let rate = 0.0035;
      if (plat === 'apple') rate = 0.0075;
      else if (plat === 'youtube') rate = 0.0020;

      const total = count * rate;

      return {
        results: [
          { label: 'Projected Monthly Royalties', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Assumed Platform Rate', value: `$${rate.toFixed(4)} / Stream` }
        ],
        chartData: [
          { name: 'Estimated Payout', value: Math.round(total) }
        ]
      };
    }
  },
  {
    id: 'tempo-calculator',
    name: 'Tempo Calculator',
    slug: 'tempo-calculator',
    category: 'music',
    description: 'Convert music tempo (BPM) into precise milliseconds and hertz intervals for delay and LFO timing.',
    seoTitle: 'Music bpm delay time & hz converter',
    seoDescription: 'Convert music tempo (BPM) into millisecond track delay times and LFO hertz intervals.',
    inputs: [
      { id: 'bpmVal', label: 'Music Tempo (BPM)', type: 'number', defaultValue: 120, min: 20, max: 300 }
    ],
    formula: 'Quarter Note Delay (ms) = 60000 / BPM\nHz = BPM / 60',
    explanation: 'Converting BPM into milliseconds helps audio engineers sync delay times and LFO rates with the track\'s tempo.',
    example: 'A tempo of 120 BPM corresponds to a 500ms quarter-note delay time or a 2.00 Hz LFO frequency.',
    faq: [{ question: 'What is a dot alignment?', answer: 'A musical timing variation that extends a delay time by 1.5 times its standard value.' }],
    relatedSlugs: ['beat-calculator'],
    keywords: ['bpm dynamic delay calculator', 'midi lfo timing hz', 'quarter note delay milliseconds'],
    calculate: (inputs) => {
      const bpm = Math.max(20, Number(inputs.bpmVal || 120));

      const quarterMs = 60000 / bpm;
      const eighthMs = quarterMs / 2;
      const hz = bpm / 60;

      return {
        results: [
          { label: 'Quarter Note Delay (1/4)', value: `${quarterMs.toFixed(1)} ms`, isPrimary: true },
          { label: 'Eighth Note Delay (1/8)', value: `${eighthMs.toFixed(1)} ms` },
          { label: 'Tempo Hertz Rate (Hz)', value: `${hz.toFixed(2)} Hz` }
        ]
      };
    }
  },
  {
    id: 'beat-calculator',
    name: 'Beat Calculator',
    slug: 'beat-calculator',
    category: 'music',
    description: 'Calculate total track bars and beats based on time signature and project duration.',
    seoTitle: 'Bars, Beats, & Project Duration Time Sizer',
    seoDescription: 'Calculate total track bars and beats based on time signature, tempo, and project duration.',
    inputs: [
      { id: 'tempoBpm', label: 'Music Tempo (BPM)', type: 'number', defaultValue: 128 },
      { id: 'timeSigNumerator', label: 'Beats per Bar (Numerator)', type: 'number', defaultValue: 4 },
      { id: 'mins', label: 'Song Target duration (Minutes)', type: 'number', defaultValue: 3.5 }
    ],
    formula: 'Beats = BPM * Minutes\nTotal Bars = Beats / Numerator',
    explanation: 'Quantizing song structures helps artists align arrangements with standard physical duration limits.',
    example: 'A 3.5-minute song at 128 BPM has 448 total beats, which corresponds to 112 bars in a typical 4/4 time signature.',
    faq: [{ question: 'Why is 4/4 the standard time signature?', answer: 'Known as "common time," its symmetrical four-beat pattern is widely used across most popular music genres.' }],
    relatedSlugs: ['tempo-calculator'],
    keywords: ['song bars structural grid', 'beats timeline length', 'metronome quantization solver'],
    calculate: (inputs) => {
      const bpm = Number(inputs.tempoBpm || 128);
      const num = Number(inputs.timeSigNumerator || 4);
      const minsVal = Number(inputs.mins || 3.5);

      const totalBeats = bpm * minsVal;
      const totalBars = totalBeats / num;

      return {
        results: [
          { label: 'Total Track Beats', value: Math.round(totalBeats).toString(10), isPrimary: true },
          { label: 'Standard Bars (Measures)', value: Math.round(totalBars).toString(10) }
        ]
      };
    }
  },

  // ==================== HOME UTILITIES ====================
  {
    id: 'electricity-bill',
    name: 'Electricity Bill Calculator',
    slug: 'electricity-bill-calculator',
    category: 'home-utilities',
    description: 'Estimate your monthly electricity bills based on daily kilowatt-hour (kWh) usage and regional utility rates.',
    seoTitle: 'Monthly electricity bill utility cost solver',
    seoDescription: 'Estimate your monthly electricity bills based on daily kilowatt-hour (kWh) usage and utility rates.',
    inputs: [
      { id: 'dailyKwh', label: 'Estimated daily Usage (kWh)', type: 'number', defaultValue: 30 },
      { id: 'utilityRate', label: 'Utility rate ($ per kWh)', type: 'number', defaultValue: 0.15 }
    ],
    formula: 'Monthly Cost = Daily kWh * Utility Rate * 30.4',
    explanation: 'Tracking daily energy usage simplifies home budgeting and highlights potential solar and efficiency savings.',
    example: 'Consuming 30 kWh daily at a utility rate of $0.15/kWh generates an estimated monthly electricity bill of $136.80.',
    faq: [{ question: 'What is a tier system?', answer: 'Some utility companies charge higher rates as your monthly energy consumption exceeds standard thresholds.' }],
    relatedSlugs: ['energy-consumption-calculator', 'solar-savings-calculator'],
    keywords: ['electric bill pricing estimates', 'monthly power consumption kWh', 'utility rates bill sizer'],
    calculate: (inputs) => {
      const kwh = Number(inputs.dailyKwh || 30);
      const rate = Number(inputs.utilityRate || 0.15);

      const monthCost = kwh * rate * 30.4;
      const yearCost = monthCost * 12;

      return {
        results: [
          { label: 'Estimated Monthly Bill Charge', value: monthCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Utility Cost Outlay', value: yearCost.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Electricity Cost', value: Math.round(monthCost) }
        ]
      };
    }
  },
  {
    id: 'water-bill-calculator',
    name: 'Water Bill Calculator',
    slug: 'water-bill-calculator',
    category: 'home-utilities',
    description: 'Estimate your monthly water bills based on daily household usage and sewage rates.',
    seoTitle: 'Household water billing usage estimator',
    seoDescription: 'Estimate your monthly water bills based on daily gallon usage and municipal rates.',
    inputs: [
      { id: 'gallonsDay', label: 'Daily Household Usage (Gallons)', type: 'number', defaultValue: 180 },
      { id: 'ratePerThousand', label: 'Water rate ($ per 1,000 Gallons)', type: 'number', defaultValue: 8.5 }
    ],
    formula: 'Monthly Charge = (Daily Gallons * 30.4 / 1000) * Rate per 1,000 Gallons',
    explanation: 'Water usage and sewage rates vary by municipality, meaning identifying household leaks is key to lowering utility bills.',
    example: 'Using 180 gallons daily at a rate of $8.50 per 1,000 gallons generates an estimated monthly water bill of $46.51.',
    faq: [{ question: 'How much water does a leak waste?', answer: 'A single running toilet can waste over 200 gallons of water per day.' }],
    relatedSlugs: ['electricity-bill-calculator'],
    keywords: ['sewage water billing metrics', 'municipal gallon usage rates', 'home leakage cost sizer'],
    calculate: (inputs) => {
      const gal = Number(inputs.gallonsDay || 180);
      const rate = Number(inputs.ratePerThousand || 8.5);

      const monthlyGal = gal * 30.4;
      const monthlyCost = (monthlyGal / 1000) * rate;

      return {
        results: [
          { label: 'Estimated Monthly Water Bill', value: monthlyCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Volume Consumed', value: `${Math.round(monthlyGal).toLocaleString()} Gallons` }
        ],
        chartData: [
          { name: 'Water Cost', value: Math.round(monthlyCost) }
        ]
      };
    }
  },
  {
    id: 'gas-cost-calculator',
    name: 'Gas Cost Calculator',
    slug: 'gas-cost-calculator',
    category: 'home-utilities',
    description: 'Estimate your monthly natural gas bills based on heat usage and term pricing.',
    seoTitle: 'Natural gas therm heating bill calculator',
    seoDescription: 'Estimate your monthly natural gas bills based on heat usage and regional therm pricing.',
    inputs: [
      { id: 'thermsMonth', label: 'Monthly Heat Usage (Therms)', type: 'number', defaultValue: 45 },
      { id: 'costPerTherm', label: 'Gas rate ($ per Therm)', type: 'number', defaultValue: 1.15 }
    ],
    formula: 'Monthly Bill = Monthly Therms * Cost per Therm',
    explanation: 'Gas consumption spikes during winter heating seasons. Tracking therm pricing helps homeowners anticipate these seasonal bill increases.',
    example: 'Using 45 therms monthly at a rate of $1.15/therm generates an estimated monthly gas bill of $51.75.',
    faq: [{ question: 'What is a therm?', answer: 'A unit of heat energy equal to 100,000 British thermal units (BTUs).' }],
    relatedSlugs: ['electricity-bill-calculator'],
    keywords: ['natural gas heating cost', 'winter utility therm rates', 'btu pricing energy'],
    calculate: (inputs) => {
      const therms = Number(inputs.thermsMonth || 45);
      const rate = Number(inputs.costPerTherm || 1.15);

      const cost = therms * rate;

      return {
        results: [
          { label: 'Estimated Monthly Gas Bill', value: cost.toFixed(2), unit: '$', isPrimary: true }
        ],
        chartData: [
          { name: 'Gas Cost', value: Math.round(cost) }
        ]
      };
    }
  },
  {
    id: 'energy-consumption-calculator',
    name: 'Energy Consumption Calculator',
    slug: 'energy-consumption-calculator',
    category: 'home-utilities',
    description: 'Calculate daily and monthly energy consumption (kWh) based on appliance power draws.',
    seoTitle: 'Appliance power energy consumption sizer',
    seoDescription: 'Calculate daily and monthly energy consumption (kWh) based on appliance wattage and operating hours.',
    inputs: [
      { id: 'wattage', label: 'Appliance Power Draw (Watts)', type: 'number', defaultValue: 1500 },
      { id: 'hoursActive', label: 'Operating Hours per Day', type: 'number', defaultValue: 4 }
    ],
    formula: 'Daily KWh = (Wattage * Hours active) / 1000',
    explanation: 'High-wattage appliances (like space heaters and dryers) are the primary drivers of household energy consumption.',
    example: 'Running a 1,500W space heater for 4 hours daily consumes approximately 6.0 kWh of electricity per day.',
    faq: [{ question: 'What is vampire draw?', answer: 'Power consumed by appliances and chargers while plugged in but in standby mode.' }],
    relatedSlugs: ['electricity-bill-calculator', 'appliance-cost-calculator'],
    keywords: ['appliance wattage consumption', 'kilowatt hours calculator', 'household vampire draw loads'],
    calculate: (inputs) => {
      const watts = Number(inputs.wattage || 1500);
      const hrs = Number(inputs.hoursActive || 4);

      const dailyKwh = (watts * hrs) / 1000;
      const monthlyKwh = dailyKwh * 30.4;

      return {
        results: [
          { label: 'Estimated Daily Consumption', value: `${dailyKwh.toFixed(2)} kWh`, isPrimary: true },
          { label: 'Monthly Energy Consumption', value: `${monthlyKwh.toFixed(1)} kWh` }
        ],
        chartData: [
          { name: 'Daily Consumption', value: Math.round(dailyKwh * 10) / 10 }
        ]
      };
    }
  },
  {
    id: 'solar-savings-calculator',
    name: 'Solar Savings Calculator',
    slug: 'solar-savings-calculator',
    category: 'home-utilities',
    description: 'Calculate potential solar panel energy offsets and payback periods based on installation costs.',
    seoTitle: 'Solar Panel Payback Period & Energy Cost Savings Tool',
    seoDescription: 'Estimate your solar savings and payback period based on installation costs and energy offsets.',
    inputs: [
      { id: 'systemCost', label: 'Capital Installation Cost ($)', type: 'number', defaultValue: 18000 },
      { id: 'monthlyBillSaved', label: 'Average Monthly Bill Offset ($)', type: 'number', defaultValue: 140 }
    ],
    formula: 'Payback Years = Installation Cost / (Monthly Offset * 12)',
    explanation: 'Solar installations involve high upfront costs, but offset utility bills to deliver long-term savings over their operational lifespan.',
    example: 'An $18,000 solar installation that offsets $140 in monthly electricity bills pays for itself in approximately 10.7 years.',
    faq: [{ question: 'What is net metering?', answer: 'A billing mechanism that credits solar owners for excess electricity they send back to the grid.' }],
    relatedSlugs: ['electricity-bill-calculator'],
    keywords: ['solar panel payback period', 'photovoltaic utility savings', 'net metering grid credits'],
    calculate: (inputs) => {
      const cost = Number(inputs.systemCost || 18000);
      const saved = Number(inputs.monthlyBillSaved || 140);

      const annualSaved = saved * 12;
      const paybackYrs = annualSaved > 0 ? cost / annualSaved : 0;

      return {
        results: [
          { label: 'Projected Solar Payback Period', value: `${paybackYrs.toFixed(1)} Years`, isPrimary: true },
          { label: 'Annual Electricity Bill Savings', value: annualSaved.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Capital', value: cost },
          { name: '5-Year Savings Offset', value: annualSaved * 5 }
        ]
      };
    }
  },
  {
    id: 'appliance-cost-calculator',
    name: 'Appliance Cost Calculator',
    slug: 'appliance-cost-calculator',
    category: 'home-utilities',
    description: 'Calculate continuous operating costs for household appliances based on power draws and utility rates.',
    seoTitle: 'Appliance annual operating cost utility tracker',
    seoDescription: 'Find the operating costs of household appliances based on their power draw and your local utility rates.',
    inputs: [
      { id: 'powerWatts', label: 'Appliance Power Draw (Watts)', type: 'number', defaultValue: 500 },
      { id: 'hrsPerDay', label: 'Operating Hours per Day', type: 'number', defaultValue: 8 },
      { id: 'rateKwh', label: 'Local Utility Rate ($ per kWh)', type: 'number', defaultValue: 0.14 }
    ],
    formula: 'Daily Cost = (Power Watts * Hours / 1000) * Utility Rate',
    explanation: 'Calculating individual appliance costs helps homeowners identify which devices contribute most to their utility bills.',
    example: 'Running a 500W refrigerator for 8 hours daily costs approximately $0.56 per day to operate at a $0.14/kWh utility rate.',
    faq: [{ question: 'What does Energy Star mean?', answer: 'A government-backed program labeling appliances that meet high energy-efficiency standards.' }],
    relatedSlugs: ['energy-consumption-calculator', 'electricity-bill-calculator'],
    keywords: ['refrigerator annual operating cost', 'energy star appliance pricing', 'kilowatt hours utility checker'],
    calculate: (inputs) => {
      const watts = Number(inputs.powerWatts || 500);
      const hrs = Number(inputs.hrsPerDay || 8);
      const rate = Number(inputs.rateKwh || 0.14);

      const dailyKwh = (watts * hrs) / 1000;
      const dailyCost = dailyKwh * rate;
      const monthlyCost = dailyCost * 30.4;
      const annualCost = monthlyCost * 12;

      return {
        results: [
          { label: 'Projected Annual Operating Cost', value: annualCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly operating charge equivalent', value: monthlyCost.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Appliance Cost', value: Math.round(annualCost) }
        ]
      };
    }
  },

  // ==================== ENVIRONMENT ====================
  {
    id: 'carbon-footprint',
    name: 'Carbon Footprint Calculator',
    slug: 'carbon-footprint-calculator',
    category: 'environment',
    description: 'Estimate your annual greenhouse gas emissions based on transportation and home energy usage.',
    seoTitle: 'Personal Greenhouse Gas Carbon Footprint Calculator',
    seoDescription: 'Estimate your annual carbon footprint in metric tons of CO2 based on travel and utilities.',
    inputs: [
      { id: 'milesDrivenYear', label: 'Vehicle Annual Miles driven', type: 'number', defaultValue: 12000 },
      { id: 'gasMileageAvg', label: 'Average Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 25 },
      { id: 'kwhMonthly', label: 'Monthly Home Electricity Consumption (kWh)', type: 'number', defaultValue: 800 }
    ],
    formula: 'Vehicle CO2 = (Miles / MPG) * 8.887 kg\nHome CO2 = kWh * 12 * 0.385 kg',
    explanation: 'Transportation and home heating are the primary sources of individual carbon emissions.',
    example: 'Driving 12,000 miles at 25 MPG and consuming 800 kWh of electricity monthly generates approximately 7.9 metric tons of CO2 annually.',
    faq: [{ question: 'What is a metric ton of CO2?', answer: 'A standard unit of carbon measurement equivalent to filling a volume of approximately 500 standard balloons.' }],
    relatedSlugs: ['carbon-offset-calculator', 'eco-savings-calculator'],
    keywords: ['vehicle greenhouse gas emissions', 'personal co2 offset metrics', 'electric bill carbon footprint'],
    calculate: (inputs) => {
      const miles = Number(inputs.milesDrivenYear || 12000);
      const mpg = Math.max(1, Number(inputs.gasMileageAvg || 25));
      const kwh = Number(inputs.kwhMonthly || 800);

      // Standard EPA coefficients
      const gasKgCo2PerGallon = 8.887;
      const kwhKgCo2PerUnit = 0.385;

      const vehicleTons = (miles / mpg) * gasKgCo2PerGallon / 1000;
      const homeTons = (kwh * 12) * kwhKgCo2PerUnit / 1000;
      const totalTons = vehicleTons + homeTons;

      return {
        results: [
          { label: 'Annual Carbon Footprint', value: `${totalTons.toFixed(2)} Metric Tons`, isPrimary: true },
          { label: 'Vehicle Emissions Contribution', value: `${vehicleTons.toFixed(2)} Tons` },
          { label: 'Utilities Emissions Contribution', value: `${homeTons.toFixed(2)} Tons` }
        ],
        chartData: [
          { name: 'Vehicle fuel', value: Math.round(vehicleTons * 10) / 10 },
          { name: 'Utilities emissions', value: Math.round(homeTons * 10) / 10 }
        ]
      };
    }
  },
  {
    id: 'carbon-offset',
    name: 'Carbon Offset Calculator',
    slug: 'carbon-offset-calculator',
    category: 'environment',
    description: 'Calculate the number of trees needed to offset your annual carbon footprint.',
    seoTitle: 'Tree Canopy Carbon Offsetting Calculator',
    seoDescription: 'Find the number of mature trees required to offset your annual carbon footprint.',
    inputs: [
      { id: 'targetEmissionsTons', label: 'Target Emissions (Metric Tons CO2/Year)', type: 'number', defaultValue: 12 }
    ],
    formula: 'Trees Required = Target Emissions / 0.022 (assuming 22kg/year absorption rate per mature tree)',
    explanation: 'A mature tree absorbs approximately 22 kg of CO2 annually, helping clean the atmosphere through reforestation.',
    example: 'Offsetting a typical 12-metric-ton carbon footprint requires planting and growing approximately 546 mature trees.',
    faq: [{ question: 'How long does a tree take to mature?', answer: 'Most broadleaf trees require 10 to 20 years to reach their maximum carbon absorption rate.' }],
    relatedSlugs: ['carbon-footprint-calculator'],
    keywords: ['reforestation carbon offsets', 'tree co2 absorption rates', 'greenhouse gas offsets tool'],
    calculate: (inputs) => {
      const tons = Number(inputs.targetEmissionsTons || 12);

      const kgTotal = tons * 1000;
      const treesCount = kgTotal / 21.8; // ~22kg per year absorption

      return {
        results: [
          { label: 'Mature Trees Required to Offset', value: Math.ceil(treesCount).toLocaleString(), isPrimary: true },
          { label: 'Equivalent Absorbed Weight', value: `${(tons * 2204.6).toFixed(0)} lbs of CO2` }
        ],
        chartData: [
          { name: 'Trees needed', value: Math.ceil(treesCount) }
        ]
      };
    }
  },
  {
    id: 'eco-savings',
    name: 'Eco Savings Calculator',
    slug: 'eco-savings-calculator',
    category: 'environment',
    description: 'Calculate water and carbon savings from choosing energy-efficient home options.',
    seoTitle: 'Eco-Friendly Lifestyle Water & Carbon Savings Solver',
    seoDescription: 'Track monthly resource savings from adopting eco-friendly home habits.',
    inputs: [
      { id: 'lowFlowShowerheads', label: 'Use Low-Flow Fixtures?', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { id: 'ledBulbsCount', label: 'Active LED light bulbs count', type: 'number', defaultValue: 15 }
    ],
    formula: 'Water Saved = daily minutes * 1.5 gallons * 30 days\nLED Saved = Bulbs * 50W difference * hours active',
    explanation: 'Adopting simple eco-friendly habits like installing low-flow fixtures can save thousands of gallons of water annually.',
    example: 'Installing 15 LED bulbs in a home saves approximately 114 kWh of electricity and reduces utility bills by $16.00 monthly.',
    faq: [{ question: 'What is a low-flow fixture?', answer: 'Showerheads and faucets engineered to deliver strong pressure while using 30% to 50% less water.' }],
    relatedSlugs: ['carbon-footprint-calculator', 'recycling-calculator'],
    keywords: ['low flow water volume offsets', 'led replacement savings', 'green home energy adjustments'],
    calculate: (inputs) => {
      const led = Number(inputs.ledBulbsCount || 15);
      const isLowFlow = inputs.lowFlowShowerheads === 'yes';

      const waterSavedGals = isLowFlow ? 800 : 0; // ~800 gallons a month standard household
      const powerSavedKwh = led * 0.12 * 30.4; // standard lead watt offset

      return {
        results: [
          { label: 'Monthly Water Saved', value: `${waterSavedGals} Gallons`, isPrimary: true },
          { label: 'Monthly Electricity Saved', value: `${powerSavedKwh.toFixed(1)} kWh` }
        ],
        chartData: [
          { name: 'Water Saved Gals', value: waterSavedGals },
          { name: 'kWh Saved', value: Math.round(powerSavedKwh) }
        ]
      };
    }
  },
  {
    id: 'recycling-calculator',
    name: 'Recycling Calculator',
    slug: 'recycling-calculator',
    category: 'environment',
    description: 'Project landfill waste reduction and energy savings from home recycling habits.',
    seoTitle: 'Household Recycling Landfill Diversion Calculator',
    seoDescription: 'Estimate your monthly organic landfill diversion and energy savings from recycling habits.',
    inputs: [
      { id: 'plasticBottlesWeek', label: 'Plastic Bottles recycled per Week', type: 'number', defaultValue: 12 },
      { id: 'paperWeightLbs', label: 'Paper & Cardboard recycled (lbs/Week)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Landfill Diverted = recycled items * baseline unit weights',
    explanation: 'Recycling aluminum and cardboard saves significant manufacturing energy compared to refining raw virgin resources.',
    example: 'Recycling 12 plastic bottles weekly diverts approximately 37 lbs of municipal waste from landfills annually.',
    faq: [{ question: 'What is landfill diversion?', answer: 'The percentage of household waste recycled or composted rather than sent to corporate landfill heaps.' }],
    relatedSlugs: ['eco-savings-calculator'],
    keywords: ['plastic bottle landfill diversion', 'reclaimed aluminum energy savings', 'municipal sorting guidelines'],
    calculate: (inputs) => {
      const bottles = Number(inputs.plasticBottlesWeek || 12);
      const paper = Number(inputs.paperWeightLbs || 10);

      const plasticAnnualLbs = bottles * 0.05 * 52;
      const paperAnnualLbs = paper * 52;
      const totalDiverted = plasticAnnualLbs + paperAnnualLbs;

      return {
        results: [
          { label: 'Landfill waste Diverted Annually', value: `${totalDiverted.toFixed(1)} lbs`, isPrimary: true },
          { label: 'Carbon equivalent offset', value: `${(totalDiverted * 0.85).toFixed(1)} lbs CO2` }
        ],
        chartData: [
          { name: 'Recycled Plastic', value: Math.round(plasticAnnualLbs) },
          { name: 'Cardboard paper', value: Math.round(paperAnnualLbs) }
        ]
      };
    }
  },
  {
    id: 'energy-efficiency',
    name: 'Energy Efficiency Calculator',
    slug: 'energy-efficiency-calculator',
    category: 'environment',
    description: 'Calculate electrical efficiency ratings (EER) and energy savings for air conditioning units.',
    seoTitle: 'HVAC Air Conditioning SEER Rating Sizer',
    seoDescription: 'Find energy savings by comparing standard air conditioning SEER cooling ratios.',
    inputs: [
      { id: 'capacityBtu', label: 'AC System Cooling Capacity (BTU)', type: 'number', defaultValue: 12000 },
      { id: 'seerRating', label: 'System SEER Rating', type: 'number', defaultValue: 16 }
    ],
    formula: 'Operating Wattage = Capacity BTU / SEER\nHourly Cost = (Operating Wattage / 1000) * Utility Rate',
    explanation: 'Opting for systems with higher SEER ratings can significantly reduce home cooling bills, especially in warmer climates.',
    example: 'A 12,000 BTU unit operating at 16 SEER consumes 750W per hour, earning significant utility savings over older 10 SEER units.',
    faq: [{ question: 'What is a SEER rating?', answer: 'Seasonal Energy Efficiency Ratio - measures AC cooling efficiency over a typical operating season.' }],
    relatedSlugs: ['electricity-bill-calculator', 'energy-consumption-calculator'],
    keywords: ['air conditioner seasonal SEER', 'cooling wattage draw solver', 'hvac operating costs planning'],
    calculate: (inputs) => {
      const btu = Number(inputs.capacityBtu || 12000);
      const seer = Math.max(5, Number(inputs.seerRating || 16));

      const continuousWatts = btu / seer;
      const dailyKwh = (continuousWatts * 6) / 1000; // ~6 hours active cooling per day average

      return {
        results: [
          { label: 'Continuous Operating Wattage', value: `${continuousWatts.toFixed(0)} Watts`, isPrimary: true },
          { label: 'Daily Cooling Consumption (6 hrs)', value: `${dailyKwh.toFixed(1)} kWh` }
        ],
        chartData: [
          { name: 'Operating power draw', value: Math.round(continuousWatts) }
        ]
      };
    }
  }
];
