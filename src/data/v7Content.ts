import { Calculator } from '../types';

export const V7_CONTENT_CALCULATORS: Calculator[] = [
  {
    id: 'youtube-ad-revenue-calculator',
    name: 'YouTube Ad Revenue Calculator',
    slug: 'youtube-ad-revenue-calculator',
    category: 'creator-tools',
    description: 'Estimate daily, monthly, and yearly Google AdSense earnings based on views and RPM.',
    seoTitle: 'YouTube Money Calculator & AdSense Revenue Planner',
    seoDescription: 'Calculate your YouTube monetization revenue easily. Estimate daily and monthly channel income using RPM and views.',
    inputs: [
      { id: 'dailyViews', label: 'Expected Daily Video Views', type: 'number', defaultValue: 12000, step: 500, min: 0 },
      { id: 'cpm', label: 'Average RPM (Revenue Per 1,000 Views)', type: 'number', defaultValue: 4.50, step: 0.1, min: 0.1, max: 100, unit: '$' },
      { id: 'monetizedPct', label: 'Percent of Views Monetized', type: 'number', defaultValue: 70, min: 10, max: 100, step: 5, unit: '%' }
    ],
    formula: 'Daily Earnings = Daily Views * (Monetized % / 100) * (RPM / 1000)\nMonthly Earnings = Daily Earnings * 30.4',
    explanation: 'RPM measures how much you earn after YouTube takes its 45% revenue split of ads. It represents your net earnings per 1,000 views.',
    example: 'For 12,000 daily views at an RPM of $4.50 with 70% monetization: 12000 * 0.70 * (4.50 / 1000) = $37.80 daily earnings ($1,149.12 monthly).',
    faq: [
      { question: 'What is the difference between CPM and RPM?', answer: 'CPM measures cost per 1,000 ad impressions before YouTube split. RPM is your actual earned revenue per 1,000 total video views after Google split.' },
      { question: 'How can I increase my YouTube RPM?', answer: 'Target markets with higher buyer intent (finance, tech, business), create videos longer than 8 minutes for mid-roll ads, and focus on high-CPM countries like USA or UK.' }
    ],
    relatedSlugs: ['tiktok-earnings-calculator', 'instagram-sponsor-rate-calculator'],
    calculate: (inputs) => {
      const views = Number(inputs.dailyViews) || 0;
      const rpm = Number(inputs.cpm) || 0;
      const pct = (Number(inputs.monetizedPct) || 70) / 100;

      const daily = views * pct * (rpm / 1000);
      const monthly = daily * 30.4;
      const yearly = daily * 365;

      // Platform share representation
      const platformFee = monthly * (45 / 55);

      return {
        results: [
          { label: 'Estimated Monthly Revenue', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Estimated Daily Revenue', value: daily.toFixed(2), unit: '$' },
          { label: 'Estimated Yearly Revenue', value: yearly.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Creator Earnings Net', value: parseFloat(monthly.toFixed(1)), color: '#3b82f6' },
          { name: 'Platform Cut (45%)', value: parseFloat(platformFee.toFixed(1)), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'tiktok-earnings-calculator',
    name: 'TikTok Earnings Estimator',
    slug: 'tiktok-earnings-calculator',
    category: 'creator-tools',
    description: 'Calculate potential TikTok payouts from Creator Rewards and corporate sponsorships.',
    seoTitle: 'TikTok Money Calculator | Earnings & Sponsor Rates',
    seoDescription: 'Estimate your TikTok income. Track potential revenue from Creator Rewards and sponsorship deals with custom CPMs.',
    inputs: [
      { id: 'followers', label: 'Overall Followers Count', type: 'number', defaultValue: 45000, step: 1000, min: 0 },
      { id: 'avgViews', label: 'Average Views Per Video', type: 'number', defaultValue: 15000, step: 500, min: 0 },
      { id: 'engagement', label: 'Post Engagement Rate', type: 'number', defaultValue: 4.8, min: 0.1, max: 30, step: 0.1, unit: '%' }
    ],
    formula: 'Rewards Program Pay = Views * (RPM / 1000) [where Rewards RPM is typically $0.50-$1.00]\nEst. Sponsor Post Fee = (Followers * 0.003) + (Avg Views * 0.03 * (Engagement / 3))',
    explanation: 'TikTok earnings come from direct creator incentives and paid corporate sponsors. Sponsoring rates increase when your engagement indicators are high.',
    example: 'For 45,000 followers, 15,000 average views, and a 4.8% engagement rate: Brand sponsor post earns around $215.00.',
    faq: [
      { question: 'What does TikTok pay per 1,000 views?', answer: 'Under the Creator Rewards Program, eligible videos over 1 minute can earn between $0.40 and $1.00 per 1,000 qualified views.' }
    ],
    relatedSlugs: ['youtube-ad-revenue-calculator', 'instagram-sponsor-rate-calculator'],
    calculate: (inputs) => {
      const followers = Number(inputs.followers) || 0;
      const views = Number(inputs.avgViews) || 0;
      const engagement = Number(inputs.engagement) || 1;

      // Creator Rewards Program payout (assuming $0.65 RPM or CPM)
      const rewardsPay = (views * 0.65) / 1000;
      // Sponsor estimate
      const sponsorFee = (followers * 0.003) + (views * 0.03 * (engagement / 3));

      return {
        results: [
          { label: 'Estimated Sponsor Post Fee', value: sponsorFee.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Creator Rewards Video Payout', value: rewardsPay.toFixed(2), unit: '$' },
          { label: 'Follower Engagement Value', value: (sponsorFee / Math.max(1, followers) * 1000).toFixed(2), unit: '$/K Flwrs' }
        ],
        chartData: [
          { name: 'Sponsorship Post Price', value: parseFloat(sponsorFee.toFixed(1)), color: '#10b981' },
          { name: 'Direct Rewards Program', value: parseFloat(rewardsPay.toFixed(1)), color: '#8b5cf6' }
        ]
      };
    }
  },
  {
    id: 'twitch-subscriber-revenue-calculator',
    name: 'Twitch Subscriber Revenue Calculator',
    slug: 'twitch-subscriber-revenue-calculator',
    category: 'creator-tools',
    description: 'Calculate sub split earnings across Tiers 1, 2, and 3 Twitch subscribers.',
    seoTitle: 'Twitch Sub Income Calculator | Creator Income Split',
    seoDescription: 'Estimate your Twitch subscription earnings. Calculate payout checks for Tier 1, 2, and 3 subs with customizable revenue splits.',
    inputs: [
      { id: 't1Subs', label: 'Tier 1 Subscribers ($4.99)', type: 'number', defaultValue: 180, min: 0 },
      { id: 't2Subs', label: 'Tier 2 Subscribers ($9.99)', type: 'number', defaultValue: 12, min: 0 },
      { id: 't3Subs', label: 'Tier 3 Subscribers ($24.99)', type: 'number', defaultValue: 4, min: 0 },
      { id: 'split', label: 'Twitch Creator Payout Share', type: 'select', defaultValue: '50', options: [
        { label: 'Standard Affiliate/Partner Split (50/50)', value: '50' },
        { label: 'Partner Plus Tier Split (70/30)', value: '70' }
      ] }
    ],
    formula: 'Monthly Revenue = Total Subscriptions Gross Value * (Creator Share % / 100)',
    explanation: 'Calculates subscription shares. By default, Twitch takes 50%. Top creators can qualify for Twitch Partner Plus with a premium 70% share of Tier 1 sub income.',
    example: '180 Tier 1 subs, 12 Tier 2, and 4 Tier 3: With a 50/50 split, monthly revenue checks equal $609.18.',
    faq: [
      { question: 'What does a streamer get for a Twitch Prime sub?', answer: 'Streamers receive the same revenue split (50% standard, 70% premium) as a normal Tier 1 paid sub (nominally $2.50 creator split).' }
    ],
    relatedSlugs: ['youtube-ad-revenue-calculator', 'tiktok-earnings-calculator'],
    calculate: (inputs) => {
      const t1 = Number(inputs.t1Subs) || 0;
      const t2 = Number(inputs.t2Subs) || 0;
      const t3 = Number(inputs.t3Subs) || 0;
      const splitPct = (Number(inputs.split) || 50) / 100;

      const t1Gross = t1 * 4.99;
      const t2Gross = t2 * 9.99;
      const t3Gross = t3 * 24.99;
      const gross = t1Gross + t2Gross + t3Gross;

      const payout = gross * splitPct;
      const twitchShare = gross - payout;

      return {
        results: [
          { label: 'Estimated Monthly Payout', value: payout.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Gross Sub Subscriptions Value', value: gross.toFixed(2), unit: '$' },
          { label: 'Twitch Platform Fee Cut', value: twitchShare.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Streamer Payout', value: parseFloat(payout.toFixed(1)), color: '#8b5cf6' },
          { name: 'Twitch Platform Cut', value: parseFloat(twitchShare.toFixed(1)), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'instagram-sponsor-rate-calculator',
    name: 'Instagram Sponsor Rate Calculator',
    slug: 'instagram-sponsor-rate-calculator',
    category: 'creator-tools',
    description: 'Calculate professional sponsorship pricing tags for Instagram posts, stories, and reels.',
    seoTitle: 'Instagram Sponsor & Influencer Rate Calculator | Calculatoora',
    seoDescription: 'Find your professional Instagram post rate. Generate estimates for stories, reels, and feeds using follower and engagement metrics.',
    inputs: [
      { id: 'followers', label: 'Overall Instagram Followers', type: 'number', defaultValue: 24000, step: 500, min: 0 },
      { id: 'avgLikes', label: 'Average Likes Per Post', type: 'number', defaultValue: 1400, step: 50, min: 0 },
      { id: 'niche', label: 'Content Niche Industry', type: 'select', defaultValue: 'tech', options: [
        { label: 'Tech & Electronics (Avg CPM: $12.00)', value: '12' },
        { label: 'Business & Investing (Avg CPM: $15.00)', value: '15' },
        { label: 'Beauty & Lifestyle (Avg CPM: $8.00)', value: '8' },
        { label: 'Travel & Outdoor (Avg CPM: $10.00)', value: '10' },
        { label: 'Gaming & Comic (Avg CPM: $6.00)', value: '6' }
      ] }
    ],
    formula: 'Sponsor Feed Post = (Followers / 1,000 * Niche CPM) + (Avg Likes * 0.12)',
    explanation: 'Estimating media rates guarantees creators are paid fairly based on market CPM averages and targeted post interaction rates.',
    example: 'For 24,000 followers and 1,400 likes in the Tech niche: calculated sponsor fee equals $456.00.',
    faq: [
      { question: 'What engagement rate is considered healthy?', answer: 'A healthy Instagram engagement rate is between 3% and 6%. Highly interactive micro-creators can charge higher rates.' }
    ],
    relatedSlugs: ['tiktok-earnings-calculator', 'youtube-ad-revenue-calculator'],
    calculate: (inputs) => {
      const followers = Number(inputs.followers) || 0;
      const likes = Number(inputs.avgLikes) || 0;
      const cpm = Number(inputs.niche) || 8;

      const baseValue = (followers / 1000) * cpm;
      const postRate = baseValue + (likes * 0.12);
      const reelRate = postRate * 1.35;
      const storyRate = postRate * 0.45;

      return {
        results: [
          { label: 'Sponsor Feed Post Rate', value: postRate.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Dynamic Reel Video Rate', value: reelRate.toFixed(2), unit: '$' },
          { label: 'Story Slide Promo Rate', value: storyRate.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Instagram Story', value: parseFloat(storyRate.toFixed(1)), color: '#f59e0b' },
          { name: 'Feed Grid Post', value: parseFloat(postRate.toFixed(1)), color: '#3b82f6' },
          { name: 'Instagram Reel Promo', value: parseFloat(reelRate.toFixed(1)), color: '#ec4899' }
        ]
      };
    }
  },
  {
    id: 'video-aspect-ratio-calculator',
    name: 'Video Aspect Ratio Calculator',
    slug: 'video-aspect-ratio-calculator',
    category: 'creator-tools',
    description: 'Calculate scaling dimensions while retaining proportional video aspect ratios.',
    seoTitle: 'Video Aspect Ratio & Dimension Scaler | Calculatoora',
    seoDescription: 'Scale video resolutions proportionally. Estimate target heights and widths of standard cinematic or social video layouts.',
    inputs: [
      { id: 'ratio', label: 'Preset Proportions Aspect Ratio', type: 'select', defaultValue: '16:9', options: [
        { label: 'Widescreen (16:9)', value: '16:9' },
        { label: 'Vertical Social (9:16)', value: '9:16' },
        { label: 'Classic TV (4:3)', value: '4:3' },
        { label: 'Instagram Square (1:1)', value: '1:1' },
        { label: 'Ultra Cinema (21:9)', value: '256:108' }
      ] },
      { id: 'targetWidth', label: 'Desired Target Width (Pixels)', type: 'number', defaultValue: 1280, step: 20, min: 100 }
    ],
    formula: 'Target Height = Target Width * (Ratio Height / Ratio Width)',
    explanation: 'Ensuring your image resolutions align with standard aspects avoids black margins and blur overlays on modern mobile displays.',
    example: 'For widescreen video at a target width of 1,280 pixels, the calculated target height is 720 pixels.',
    faq: [
      { question: 'What is the aspect ratio of a TikTok video?', answer: 'TikTok and Instagram crop vertically at a 9:16 aspect ratio, which translates to a standard resolution of 1080 x 1920 pixels.' }
    ],
    relatedSlugs: ['aspect-ratio-calculator', 'image-compressor-ratio'],
    calculate: (inputs) => {
      const ratioStr = inputs.ratio || '16:9';
      const width = Number(inputs.targetWidth) || 1280;

      const [rw, rh] = ratioStr.split(':').map(Number);
      const height = (rh / rw) * width;
      const megapixels = (width * height) / 1000000;

      return {
        results: [
          { label: 'Proportional Target Height', value: Math.round(height), unit: 'px', isPrimary: true },
          { label: 'Calculated Aspect Proportion', value: ratioStr, unit: 'Ratio' },
          { label: 'Overall Resolving Megapixels', value: megapixels.toFixed(2), unit: 'MP' }
        ],
        chartData: [
          { name: 'Target Width', value: width, color: '#3b82f6' },
          { name: 'Target Height', value: height, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'audio-bitrate-calculator',
    name: 'Audio Bitrate & File Size Calculator',
    slug: 'audio-bitrate-calculator',
    category: 'creator-tools',
    description: 'Calculate digital audio transmission speeds and uncompressed file disk sizes.',
    seoTitle: 'Audio Bitrate & WAV File Size Estimator | Calculatoora',
    seoDescription: 'Estimate digital audio bitrates. Calculate file density and memory weight for professional uncompressed studio files.',
    inputs: [
      { id: 'sampleRate', label: 'Sample Frequency Rate', type: 'select', defaultValue: '44100', options: [
        { label: 'Compact Disc standard (44.1 kHz)', value: '44100' },
        { label: 'Studio Video standard (48.0 kHz)', value: '48000' },
        { label: 'Pro Hi-Fi High-res (96.0 kHz)', value: '96000' }
      ] },
      { id: 'bitDepth', label: 'Audio Bit-Depth Resolution', type: 'select', defaultValue: '16', options: [
        { label: 'Standard resolution (16-bit)', value: '16' },
        { label: 'Professional standard (24-bit)', value: '24' },
        { label: 'High-res Floating point (32-bit)', value: '32' }
      ] },
      { id: 'channels', label: 'Audio Signal Channels', type: 'select', defaultValue: '2', options: [
        { label: 'Mono Channel (1)', value: '1' },
        { label: 'Stereo Channels (2)', value: '2' },
        { label: 'Surround Channels (6)', value: '6' }
      ] },
      { id: 'duration', label: 'Clip Duration Length', type: 'number', defaultValue: 4, step: 0.5, min: 0.1, unit: 'min' }
    ],
    formula: 'Bitrate (Kbps) = Sample Rate (Hz) * Bit Depth * Channels / 1,000\nFile Size (MB) = Bitrate * 1,000 * Duration (sec) / 8 / 1,024 / 1,024',
    explanation: 'Quantizes spatial resolution. Uncompressed PCM audio files depend purely on sampling frequency and digital depth limits.',
    example: 'For 44.1 kHz stereo audio at 16-bit for 4 minutes: Bitrate is 1,411.2 Kbps. Total file size is 40.37 MB.',
    faq: [
      { question: 'What audio bitrate does Spotify stream at?', answer: 'Spotify Premium streams high-quality compressed audio using AAC format at 320 Kbps, lowering storage weights significantly.' }
    ],
    relatedSlugs: ['podcast-episode-file-size-calculator', 'video-aspect-ratio-calculator'],
    calculate: (inputs) => {
      const freq = Number(inputs.sampleRate) || 44100;
      const bits = Number(inputs.bitDepth) || 16;
      const channels = Number(inputs.channels) || 2;
      const min = Number(inputs.duration) || 4;

      const kbps = (freq * bits * channels) / 1000;
      const seconds = min * 60;
      const totalBits = kbps * 1000 * seconds;
      const sizeMB = totalBits / 8 / 1024 / 1024;

      return {
        results: [
          { label: 'Estimated Uncompressed WAV Size', value: sizeMB.toFixed(2), unit: 'MB', isPrimary: true },
          { label: 'Audio Bitrate Speed', value: kbps.toFixed(1), unit: 'Kbps' },
          { label: 'Calculated Samples Count', value: (freq * seconds / 1000000).toFixed(2), unit: 'Million' }
        ],
        chartData: [
          { name: 'Estimated WAV Size', value: parseFloat(sizeMB.toFixed(1)), color: '#3b82f6' },
          { name: 'Estimated MP3 alternative (320kbps)', value: parseFloat((sizeMB * 0.22).toFixed(1)), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'podcast-episode-file-size-calculator',
    name: 'Podcast Episode File Size Calculator',
    slug: 'podcast-episode-file-size-calculator',
    category: 'creator-tools',
    description: 'Calculate final compiled media file sizes based on chosen podcast quality bitrates.',
    seoTitle: 'Podcast File Size Estimator | Audio Compression Planner',
    seoDescription: 'Estimate your podcast episode files sizes before rendering. Plan storage constraints using custom bitrates and lesson spans.',
    inputs: [
      { id: 'quality', label: 'Audio Transmission Bitrate Quality', type: 'select', defaultValue: '128', options: [
        { label: 'High fidelity stereo (192 Kbps / high quality)', value: '192' },
        { label: 'Podcast default stereo (128 Kbps / CD comparable)', value: '128' },
        { label: 'Mono Speech optimized (64 Kbps / crisp speech)', value: '64' },
        { label: 'Compressed utility mono (48 Kbps / lower tier)', value: '48' }
      ] },
      { id: 'hours', label: 'Episode Span Duration (Hours)', type: 'number', defaultValue: 1, min: 0, max: 24 },
      { id: 'minutes', label: 'Episode Span Duration (Minutes)', type: 'number', defaultValue: 20, min: 0, max: 59 }
    ],
    formula: 'File Size (MB) = Bitrate (Kbps) * Seconds / 8 / 1,024',
    explanation: 'Podcast directories host compressed audio formats. Lowering tracking bitrates retains high spoken clarity while reducing hosting bandwidth penalties.',
    example: 'For an 80-minute podcast episode in 128 Kbps quality: size is approx 75.00 MB.',
    faq: [
      { question: 'What is the recommended MP3 bitrate for podcasts?', answer: 'Our standard is 128 Kbps for stereo files, or 64 to 96 Kbps for mono voice tracks. High fidelity music requires 192 to 320 Kbps.' }
    ],
    relatedSlugs: ['audio-bitrate-calculator', 'video-aspect-ratio-calculator'],
    calculate: (inputs) => {
      const kbps = Number(inputs.quality) || 128;
      const hr = Number(inputs.hours) || 0;
      const min = Number(inputs.minutes) || 0;

      const totalSeconds = (hr * 3600) + (min * 60);
      const sizeMB = (totalSeconds * kbps) / 8 / 1024;

      // Streaming data cost (based on listener counts)
      const dataFor1000 = (sizeMB * 1000) / 1024; // GB

      return {
        results: [
          { label: 'Estimated MP3 Episode Size', value: sizeMB.toFixed(1), unit: 'MB', isPrimary: true },
          { label: 'Total Track Length', value: `${hr}h ${min}m`, unit: 'Span' },
          { label: '1000 Streams Download Load', value: dataFor1000.toFixed(1), unit: 'GB' }
        ],
        chartData: [
          { name: 'Current Quality Option', value: parseFloat(sizeMB.toFixed(1)), color: '#8b5cf6' },
          { name: 'Ultra Compact Alternative (64K)', value: parseFloat((sizeMB * 64 / kbps).toFixed(1)), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'wallpaper-requirements-calculator',
    name: 'Wallpaper Requirements Calculator',
    slug: 'wallpaper-requirements-calculator',
    category: 'home-tools',
    description: 'Calculate wallpaper rolls needed to decorate walls including pattern offset waste factors.',
    seoTitle: 'Wallpaper Roll Calculator | Wall Decor Planner',
    seoDescription: 'Estimate wallpaper rolls needed. Calculate surface area requirements with pattern repeat margins to avoid material shortages.',
    inputs: [
      { id: 'wallWidth', label: 'Overall Wall Width', type: 'number', defaultValue: 14, min: 1, unit: 'ft' },
      { id: 'wallHeight', label: 'Wall Height (Base to Crown)', type: 'number', defaultValue: 8.5, min: 1, unit: 'ft' },
      { id: 'rollArea', label: 'Individual Roll Coverage', type: 'number', defaultValue: 56, min: 10, unit: 'sq ft' },
      { id: 'waste', label: 'Pattern Repeat Waste Factor', type: 'select', defaultValue: '115', options: [
        { label: 'Minimal texture repeat (15% waste buffer)', value: '115' },
        { label: 'Large ornate design repeat (25% waste buffer)', value: '125' },
        { label: 'Solid plain roll (5% waste buffer)', value: '105' }
      ] }
    ],
    formula: 'Wall Area = Width * Height\nRolls Needed = Math.ceil((Wall Area * Waste Factor) / Roll Area)',
    explanation: 'Measuring standard wall surfaces and factoring in decorative patterns limits wallpaper roll offsets during room trims.',
    example: 'For walls 14ft wide and 8.5ft high (119 sq ft total) with standard 56 sq ft rolls and a 15% wastage allowance: 3 rolls are required.',
    faq: [
      { question: 'What is the surface coverage of a European wallpaper roll?', answer: 'European wallpaper rolls typically cover roughly 57 square feet, whereas double American rolls cover roughly 70 square feet of area.' }
    ],
    relatedSlugs: ['paint-coverage-estimator', 'gardening-soil-volume-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.wallWidth) || 0;
      const h = Number(inputs.wallHeight) || 0;
      const rArea = Number(inputs.rollArea) || 56;
      const factor = (Number(inputs.waste) || 115) / 100;

      const netArea = w * h;
      const adjustedArea = netArea * factor;
      const rolls = Math.ceil(adjustedArea / rArea);

      return {
        results: [
          { label: 'wallpaper Rolls Required', value: rolls, isPrimary: true },
          { label: 'Net Wall Surface Area', value: netArea.toFixed(1), unit: 'sq ft' },
          { label: 'Gross Area with Waste', value: adjustedArea.toFixed(1), unit: 'sq ft' }
        ],
        chartData: [
          { name: 'Used Wallpaper', value: netArea, color: '#3b82f6' },
          { name: 'Waste / Crop Allowance', value: adjustedArea - netArea, color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'concrete-slab-volume-calculator',
    name: 'Concrete Slab Volume Calculator',
    slug: 'concrete-slab-volume-calculator',
    category: 'home-tools',
    description: 'Calculate aggregate concrete volume in cubic yards and standard retail bag counts.',
    seoTitle: 'Concrete Slab Calculator | Yardage & Bag Estimator',
    seoDescription: 'Calculate cubic yards of concrete needed for home paving slabs. Convert structural volumes to standard 60lb and 80lb premixed retail sacks.',
    inputs: [
      { id: 'length', label: 'Slab Length Metric', type: 'number', defaultValue: 12, min: 1, unit: 'ft' },
      { id: 'width', label: 'Slab Width Metric', type: 'number', defaultValue: 10, min: 1, unit: 'ft' },
      { id: 'thickness', label: 'Concrete Depth / Thickness', type: 'number', defaultValue: 4, min: 1, step: 0.5, unit: 'inches' }
    ],
    formula: 'Volume (Cu Ft) = Length * Width * (Thickness / 12)\nVolume (Cu Yds) = Volume (Cu Ft) / 27',
    explanation: 'We calculate required raw concrete volume in cubic yards. Premixed structural concrete sacks weigh 80 lbs, corresponding to 0.60 cubic feet apiece.',
    example: 'For a slab 12 x 10ft at 4 inches thick: requires 1.48 cubic yards, which matches roughly 67 bags of 80lb cement mixture.',
    faq: [
      { question: 'What is the standard concrete depth for a garden patio?', answer: 'A typical yard patio slab is 4 inches deep. Heavy vehicle driveways require a minimum depth of 5 to 6 inches with support rebar.' }
    ],
    relatedSlugs: ['wallpaper-requirements-calculator', 'fence-post-spacing-calculator'],
    calculate: (inputs) => {
      const l = Number(inputs.length) || 0;
      const w = Number(inputs.width) || 0;
      const t = Number(inputs.thickness) || 4;

      const cuFt = l * w * (t / 12);
      const cuYd = cuFt / 27;

      // Sacks estimates: 80lb sack = 0.6 cu ft, 60lb sack = 0.45 cu ft
      const sacks80 = Math.ceil(cuFt / 0.6);
      const sacks60 = Math.ceil(cuFt / 0.45);

      return {
        results: [
          { label: 'Cubic Yards Required', value: cuYd.toFixed(2), unit: 'yd³', isPrimary: true },
          { label: 'Equivalent Cubic Feet', value: cuFt.toFixed(1), unit: 'ft³' },
          { label: 'Estimated Retail 80lb Bags', value: sacks80, unit: 'Sacks' },
          { label: 'Estimated Retail 60lb Bags', value: sacks60, unit: 'Sacks' }
        ],
        chartData: [
          { name: 'Slab Volume Material', value: parseFloat(cuFt.toFixed(1)), color: '#3b82f6' },
          { name: 'Typical 10% Spillage Waste', value: parseFloat((cuFt * 0.1).toFixed(1)), color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'fence-post-spacing-calculator',
    name: 'Fence Post Spacing Calculator',
    slug: 'fence-post-spacing-calculator',
    category: 'home-tools',
    description: 'Calculate post counts and layout intervals for perimeter garden fence sections.',
    seoTitle: 'Fence Post Spacing & Panel Count Calculator | Calculatoora',
    seoDescription: 'Find required fence posts and garden panel counts. Calculate equal segment lengths for customized layouts.',
    inputs: [
      { id: 'length', label: 'Overall Boundary Length', type: 'number', defaultValue: 80, min: 1, unit: 'ft' },
      { id: 'spacing', label: 'Target Spacing (Max recommended is 8ft)', type: 'number', defaultValue: 8, min: 3, max: 15, step: 0.5, unit: 'ft' }
    ],
    formula: 'Panels Count = Math.ceil(Total Length / Target Spacing)\nPosts Count = Panels Count + 1\nAdjusted Distance = Total Length / Panels Count',
    explanation: 'Helps calculate balanced support grids. Spacing posts evenly prevents wall draft sagging under structural wind loads.',
    example: 'For an 80ft boundary with target 8ft intervals: requires 11 posts, resulting in exactly 10 equal fence spans.',
    faq: [
      { question: 'Why is 8 feet the standard boundary post spacing?', answer: 'Most residential wood panels are pre-manufactured at 8-foot lengths. Standardizing spacing avoids tricky, manual lumber cuts.' }
    ],
    relatedSlugs: ['concrete-slab-volume-calculator', 'paint-coverage-estimator'],
    calculate: (inputs) => {
      const len = Number(inputs.length) || 0;
      const targetSpac = Number(inputs.spacing) || 8;

      const panels = Math.ceil(len / targetSpac);
      const posts = panels + 1;
      const exactSpac = len / panels;

      return {
        results: [
          { label: 'Required Fence Posts', value: posts, isPrimary: true },
          { label: 'Fence Panels Needed', value: panels, unit: 'Spans' },
          { label: 'Exact Section Spacing Distance', value: exactSpac.toFixed(2), unit: 'ft' }
        ],
        chartData: [
          { name: 'Perimeter Spacing', value: exactSpac, color: '#10b981' },
          { name: 'Remaining Target Window', value: Math.max(0, targetSpac - exactSpac), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'paint-coverage-estimator',
    name: 'Paint Coverage Estimator',
    slug: 'paint-coverage-estimator',
    category: 'home-tools',
    description: 'Estimate required interior wall paint gallons while subtracting windows and doors.',
    seoTitle: 'Paint Gallon & Surface Area Coverage Estimator',
    seoDescription: 'Calculate paint volume for home remodeling. Estimate gallons of wall coloring required by adjusting for room windows and door counts.',
    inputs: [
      { id: 'width', label: 'Room Width Distance', type: 'number', defaultValue: 15, min: 1, unit: 'ft' },
      { id: 'length', label: 'Room Length Distance', type: 'number', defaultValue: 12, min: 1, unit: 'ft' },
      { id: 'height', label: 'Ceiling Clearance Height', type: 'number', defaultValue: 8, min: 5, unit: 'ft' },
      { id: 'doors', label: 'Standard Hinged Doors Count', type: 'number', defaultValue: 1, min: 0 },
      { id: 'windows', label: 'Average Glass Windows Count', type: 'number', defaultValue: 2, min: 0 },
      { id: 'coats', label: 'Number of Finishing coats', type: 'number', defaultValue: 2, min: 1, max: 4 }
    ],
    formula: 'Wall Area = 2 * (Width * Height + Length * Height) - (Door_Count * 21) - (Window_Count * 15)\nGallons = Math.ceil((Wall Area * Coats) / 350)',
    explanation: 'One standard gallon of high-quality paint treats roughly 350-400 square feet of primed drywall.',
    example: 'A 15 x 12 x 8ft high room with 1 door and 2 windows requires 2.11 gallons across 2 coats (rounded to 3 retail paint cans).',
    faq: [
      { question: 'How much paint does a standard room door take up?', answer: 'Doors consume about 21 square feet of wall space, whereas typical room widows take up about 15 square feet of surface area.' }
    ],
    relatedSlugs: ['wallpaper-requirements-calculator', 'gardening-soil-volume-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.width) || 0;
      const l = Number(inputs.length) || 0;
      const h = Number(inputs.height) || 0;
      const d = Number(inputs.doors) || 0;
      const win = Number(inputs.windows) || 0;
      const coats = Number(inputs.coats) || 2;

      const gross = 2 * (w * h + l * h);
      const deductions = (d * 21) + (win * 15);
      const net = Math.max(10, gross - deductions);

      // Gallon rating assumes 350 sq ft coverage
      const totalSqFt = net * coats;
      const gallons = Math.ceil(totalSqFt / 350);

      return {
        results: [
          { label: 'Paint Gallons Needed', value: gallons, isPrimary: true },
          { label: 'Net wall Surface Area', value: net.toFixed(1), unit: 'sq ft' },
          { label: 'Combined Coats Coverage', value: totalSqFt.toFixed(1), unit: 'sq ft' }
        ],
        chartData: [
          { name: 'Net Drywall Paint Focus', value: net, color: '#3b82f6' },
          { name: 'Doors & Windows Deduct', value: deductions, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'gardening-soil-volume-calculator',
    name: 'Gardening Soil Volume Calculator',
    slug: 'gardening-soil-volume-calculator',
    category: 'home-tools',
    description: 'Calculate premium soil volume needed to fill standard raised garden bed units.',
    seoTitle: 'Raised Bed Soil Volume & Bag Count Calculator | Calculatoora',
    seoDescription: 'Find dirt volume for backyard garden beds. Convert cubic dimensions to commercial 1.5 cu ft compost sacks.',
    inputs: [
      { id: 'length', label: 'Garden Bed Length', type: 'number', defaultValue: 8, min: 1, unit: 'ft' },
      { id: 'width', label: 'Garden Bed Width', type: 'number', defaultValue: 4, min: 1, unit: 'ft' },
      { id: 'depth', label: 'Target Soil Fill Depth', type: 'number', defaultValue: 12, min: 1, step: 1, unit: 'inches' }
    ],
    formula: 'Volume (Cubic Feet) = Length * Width * (Depth / 12)\nRequired Bags = Volume / Bag Capacity (typically 1.5 or 2.0 cu ft)',
    explanation: 'Calculating clean yard volume avoids overpaying for bagged compost soil mixes during seasonal gardening setups.',
    example: 'For an 8 x 4ft bed filled 12 inches deep: requires 32 cubic feet of compost soil, equivalent to 16 bags of 2.0 cu ft potting mix.',
    faq: [
      { question: 'What is the topsoil-to-compost ratio for raised beds?', answer: 'A common organic blend is the 60-30-10 mix: 60% standard nutrient topsoil, 30% organic compost mulch, and 10% aerated peat moss.' }
    ],
    relatedSlugs: ['paint-coverage-estimator', 'wallpaper-requirements-calculator'],
    calculate: (inputs) => {
      const len = Number(inputs.length) || 0;
      const wid = Number(inputs.width) || 0;
      const dep = Number(inputs.depth) || 12;

      const cuFt = len * wid * (dep / 12);
      const bags2 = Math.ceil(cuFt / 2.0);
      const bags15 = Math.ceil(cuFt / 1.5);
      const cubicYards = cuFt / 27;

      return {
        results: [
          { label: 'Required 2.0 cu ft Soil Bags', value: bags2, unit: 'Bags', isPrimary: true },
          { label: 'Required 1.5 cu ft Soil Bags', value: bags15, unit: 'Bags' },
          { label: 'Total Volume Metric', value: cuFt.toFixed(1), unit: 'ft³' },
          { label: 'Bulk soil yards equivalent', value: cubicYards.toFixed(3), unit: 'yd³' }
        ],
        chartData: [
          { name: 'Fill Volume', value: parseFloat(cuFt.toFixed(1)), color: '#10b981' },
          { name: 'Bulk Safety Area', value: parseFloat((cuFt * 0.05).toFixed(1)), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'greenhouse-heating-estimator',
    name: 'Greenhouse Heating Estimator',
    slug: 'greenhouse-heating-estimator',
    category: 'home-tools',
    description: 'Calculate BTU heating capacity required to sustain safe winter temperatures in greenhouses.',
    seoTitle: 'Greenhouse Heater & BTU Estimator | Calculatoora',
    seoDescription: 'Find appropriate greenhouse heating needs. Estimate BTU and Watt ratings of electric or gas stove heaters using regional winter norms.',
    inputs: [
      { id: 'area', label: 'Greenhouse Floor Footprint', type: 'number', defaultValue: 120, min: 10, unit: 'sq ft' },
      { id: 'height', label: 'Average Peaked Wall Height', type: 'number', defaultValue: 8, min: 5, unit: 'ft' },
      { id: 'glazing', label: 'Wall Glazing Material', type: 'select', defaultValue: 'double-poly', options: [
        { label: 'Single pane glass / Poly sheet (U-factor: 1.2)', value: '1.2' },
        { label: 'Double pane glass/corrugated (U-factor: 0.7)', value: '0.7' },
        { label: 'Triple-wall polycarbonate (U-factor: 0.5)', value: '0.5' }
      ] },
      { id: 'tempDiff', label: 'Design Temp Difference (Min Air vs Target)', type: 'number', defaultValue: 30, min: 5, unit: '°F' }
    ],
    formula: 'Surface Area = Floor * 1.38\nHeating Capacity (BTU) = Surface Area * Temperature Difference * Material U-Factor',
    explanation: 'Materials radiate thermal energy differently. High heat transmission (U-factor) raises backup power demands during cold snaps.',
    example: 'For a 120 sq ft floor space made of triple walls (0.5 U-factor) keeping a 30°F warmth buffer: requires 2,484 BTUs of heating.',
    faq: [
      { question: 'What size heater does a 10x12 greenhouse need?', answer: 'A standard 120 sq ft greenhouse in moderate zones typically requires 3,000 to 5,000 BTUs of winter heater capacity.' }
    ],
    relatedSlugs: ['gardening-soil-volume-calculator', 'paint-coverage-estimator'],
    calculate: (inputs) => {
      const flr = Number(inputs.area) || 120;
      const h = Number(inputs.height) || 8;
      const uFactor = Number(inputs.glazing) || 0.7;
      const tempDiff = Number(inputs.tempDiff) || 30;

      // Estimate total exposed surface area assuming a standard gable-style height grid multiplier
      const surfArea = flr * 1.38;
      const btu = surfArea * tempDiff * uFactor;
      const watts = btu / 3.412; // 1 Watt = 3.412 BTU

      return {
        results: [
          { label: 'BTU Heating Rate needed', value: Math.round(btu), unit: 'BTU/hr', isPrimary: true },
          { label: 'Electric Heater Watts', value: Math.round(watts), unit: 'W' },
          { label: 'Total Exposed Glazing Area', value: Math.round(surfArea), unit: 'sq ft' }
        ],
        chartData: [
          { name: 'Theoretical Heat Requirement', value: Math.round(btu * 0.9), color: '#3b82f6' },
          { name: 'Thermal Windage Loss Margin', value: Math.round(btu * 0.1), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'dog-age-human-equivalent-calculator',
    name: 'Dog Age Human Equivalent Calculator',
    slug: 'dog-age-human-equivalent-calculator',
    category: 'daily-life',
    description: 'Calculate a canine equivalent age based on weight and biological aging charts.',
    seoTitle: 'Dog Age Calculator in Human Years | Accurate Weight Chart',
    seoDescription: 'Find your dog equivalent biological human age accurately. Calculate feline and canine longevity indexes based on puppy weight guidelines.',
    inputs: [
      { id: 'dogAge', label: 'Dog Chronological Age', type: 'number', defaultValue: 3, min: 0.5, max: 25, step: 0.5, unit: 'years' },
      { id: 'size', label: 'Breed Size Group Classification', type: 'select', defaultValue: 'medium', options: [
        { label: 'Small Breeds (Under 20 lbs)', value: 'small' },
        { label: 'Medium Breeds (20 - 50 lbs)', value: 'medium' },
        { label: 'Large Breeds (50 - 100 lbs)', value: 'large' },
        { label: 'Giant Breeds (Over 100 lbs)', value: 'giant' }
      ] }
    ],
    formula: 'Age 1 = 15 Human Years; Age 2 = +9 Years\nSubsequent years add: Small (+4), Medium (+5), Large (+6), Giant (+7) annually.',
    explanation: 'Larger dog breed classes age faster biochemically due to cell duplication weights, yielding shorter average operational life spans.',
    example: 'A medium dog at 3 chronological years is biologically equivalent to 29 human years (15 + 9 + 5).',
    faq: [
      { question: 'Why does the old 7-year rule fail?', answer: 'The simple "multiply by 7" rule ignores that puppies mature extremely fast in year 1 and that giant breeds age twice as fast in senior stages as small breeds do.' }
    ],
    relatedSlugs: ['cat-age-human-equivalent-calculator', 'pregnancy-due-date-calculator'],
    calculate: (inputs) => {
      const age = Number(inputs.dogAge) || 3;
      const size = inputs.size || 'medium';

      let humanYears = 0;
      if (age <= 0) {
        humanYears = 0;
      } else if (age <= 1) {
        humanYears = age * 15;
      } else if (age <= 2) {
        humanYears = 15 + (age - 1) * 9;
      } else {
        humanYears = 24;
        const extra = age - 2;
        if (size === 'small') humanYears += extra * 4;
        else if (size === 'medium') humanYears += extra * 5;
        else if (size === 'large') humanYears += extra * 6;
        else humanYears += extra * 7;
      }

      // Seniors onset thresholds: Small at 11, Medium at 9, Large at 7, Giant at 6
      let seniorThresh = 9;
      if (size === 'small') seniorThresh = 11;
      else if (size === 'medium') seniorThresh = 9;
      else if (size === 'large') seniorThresh = 7;
      else seniorThresh = 6;

      const isSenior = age >= seniorThresh;

      return {
        results: [
          { label: 'Human Equivalent Biology Age', value: Math.round(humanYears), unit: 'yrs old', isPrimary: true },
          { label: 'Senior Phase Classification', value: isSenior ? 'Senior Dog Tier' : 'Active Adult Phase', unit: 'Status' },
          { label: 'Canine Chronological Span', value: age, unit: 'Years' }
        ],
        chartData: [
          { name: 'Puppy Growth Weight', value: 24, color: '#f59e0b' },
          { name: 'Adult Stage Accrual', value: Math.max(0, humanYears - 24), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'cat-age-human-equivalent-calculator',
    name: 'Cat Age Human Equivalent Calculator',
    slug: 'cat-age-human-equivalent-calculator',
    category: 'daily-life',
    description: 'Calculate a cat age in biologically equivalent human years.',
    seoTitle: 'Cat Age Calculator | Feline Human Years Estimator',
    seoDescription: 'Find your cat age in human years. Assess feline mental and physical metrics with precise life stages indexes.',
    inputs: [
      { id: 'catAge', label: 'Cat Chronological Age', type: 'number', defaultValue: 4, min: 0.5, max: 28, step: 0.5, unit: 'years' }
    ],
    formula: 'Year 1 = 15 Human Years\nYear 2 = +9 Human Years (Total 24)\nSubsequent years = +4 Human Years annually.',
    explanation: 'Felines develop rapidly during childhood, completing human equivalent adolescent transformations within 15 months.',
    example: 'A cat at 4 chronological years is equivalent to 32 human years (24 + 4 + 4).',
    faq: [
      { question: 'What is the senior age limit for typical cats?', answer: 'A cat is classified as mature/senior at around 11 years, which equals roughly 60 human biological years.' }
    ],
    relatedSlugs: ['dog-age-human-equivalent-calculator', 'birthday-milestone-planner'],
    calculate: (inputs) => {
      const age = Number(inputs.catAge) || 4;

      let humanYears = 0;
      if (age <= 0) humanYears = 0;
      else if (age <= 1) humanYears = age * 15;
      else if (age <= 2) humanYears = 15 + (age - 1) * 9;
      else humanYears = 24 + (age - 2) * 4;

      // Classifying Feline stages
      let stage = 'Junior Adult';
      if (age < 1) stage = 'Kitten';
      else if (age <= 2) stage = 'Adolescent';
      else if (age <= 6) stage = 'Young Prime';
      else if (age <= 10) stage = 'Mature Adult';
      else stage = 'Feline Senior';

      return {
        results: [
          { label: 'Human Equivalent biological Age', value: Math.round(humanYears), unit: 'yrs old', isPrimary: true },
          { label: 'Feline Life Stage', value: stage, unit: 'Status' },
          { label: 'Cat Calendar Age', value: age, unit: 'Years' }
        ],
        chartData: [
          { name: 'Kitten Benchmark Years', value: 24, color: '#f59e0b' },
          { name: 'Feline Adult Lifespan', value: Math.max(0, humanYears - 24), color: '#ec4899' }
        ]
      };
    }
  },
  {
    id: 'wedding-guest-cost-calculator',
    name: 'Wedding Guest Cost Calculator',
    slug: 'wedding-guest-cost-calculator',
    category: 'daily-life',
    description: 'Calculate overall banquet budgets and expenses accrued per attending wedding guest.',
    seoTitle: 'Wedding Budget & Cost Per Guest Calculator | Calculatoora',
    seoDescription: 'Plan your wedding party accounts. Estimate catering, beverage, and venue overhead limits grouped per relative attendee head.',
    inputs: [
      { id: 'guests', label: 'Attending Guests Headcount', type: 'number', defaultValue: 120, min: 10, step: 5 },
      { id: 'catering', label: 'Catering Price (Per Person)', type: 'number', defaultValue: 65, step: 2, unit: '$' },
      { id: 'beverage', label: 'Beverage Bar Fee (Per Person)', type: 'number', defaultValue: 25, step: 2, unit: '$' },
      { id: 'venue', label: 'Fixed Venue Rental Overheads', type: 'number', defaultValue: 4500, step: 250, unit: '$' },
      { id: 'entertain', label: 'Entertainment/Photo Static Costs', type: 'number', defaultValue: 3000, step: 200, unit: '$' }
    ],
    formula: 'Variable Cost = Guests * (Catering + Beverage)\nFixed Cost = Venue + Entertainment\nTotal Cost = Variable + Fixed\nCost Per Guest = Total Cost / Guests',
    explanation: 'Wedding budgets separate guest-dependent variable expenses (like food or gifts) from static capital costs (like hall room hires and band sound systems).',
    example: 'For 120 guests with a $4,500 venue fee and $90 variable food prep bills per person: total wedding cost equals $18,300.00 ($152.50 per guest).',
    faq: [
      { question: 'What is the average guest turnout for a wedding?', answer: 'Normally, about 75% to 85% of invited RSVP guests actually attend the celebration depending on travel distances.' }
    ],
    relatedSlugs: ['expense-split-calculator', 'budget-planner-calculator'],
    calculate: (inputs) => {
      const g = Number(inputs.guests) || 120;
      const food = Number(inputs.catering) || 0;
      const drinks = Number(inputs.beverage) || 0;
      const venue = Number(inputs.venue) || 0;
      const ent = Number(inputs.entertain) || 0;

      const varCost = g * (food + drinks);
      const fixCost = venue + ent;
      const total = varCost + fixCost;
      const perGuest = total / g;

      return {
        results: [
          { label: 'Total Wedding Budget Required', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Cost Accrued Per Guest', value: perGuest.toFixed(2), unit: '$' },
          { label: 'Variable Guest Costs (Food/Drink)', value: varCost.toFixed(2), unit: '$' },
          { label: 'Static Overhead (Venue/Sounds)', value: fixCost.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Variable Food & Drinks', value: varCost, color: '#ec4899' },
          { name: 'Static Venue & Photo Overheads', value: fixCost, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'travel-packing-weight-calculator',
    name: 'Travel Packing Weight Calculator',
    slug: 'travel-packing-weight-calculator',
    category: 'daily-life',
    description: 'Calculate flight suitcase weights to prevent airport oversize weight fines.',
    seoTitle: 'Travel Packing & Aviation Luggage Weight Calculator',
    seoDescription: 'Find your travel luggage suitcase weight. Estimate clothes and electronic loads to fit within flight packing limits.',
    inputs: [
      { id: 'limit', label: 'Airline Standard Weight Limit', type: 'number', defaultValue: 50, min: 10, max: 100, unit: 'lbs' },
      { id: 'luggage', label: 'Suitcase Empty Weight', type: 'number', defaultValue: 8.5, step: 0.2, min: 1, unit: 'lbs' },
      { id: 'clothes', label: 'Clothing Pieces Count (0.75 lbs avg)', type: 'number', defaultValue: 18, min: 0 },
      { id: 'shoes', label: 'Shoes / Heavy Footwear (1.8 lbs avg)', type: 'number', defaultValue: 3, min: 0, unit: 'pairs' },
      { id: 'electronics', label: 'Laptops, Chargers & Tech weight', type: 'number', defaultValue: 5.4, step: 0.1, min: 0, unit: 'lbs' }
    ],
    formula: 'Est. Total Weight = Suitcase Weight + (Clothes * 0.75) + (Shoes * 1.8) + Electronics',
    explanation: 'Calculates combined airport baggage limits. Pre-weight assessments help travelers adjust heavy items before boarding checks.',
    example: 'For an 8.5 lbs suitcase carrying 18 shirts/pant sets, 3 pairs of sneakers, and 5.4 lbs of electronics: estimated total weight is 32.80 lbs.',
    faq: [
      { question: 'What is the standard weight limit for international flights?', answer: 'For checked bags on international flights, the standard limit is 50 lbs (23 kg) per passenger.' }
    ],
    relatedSlugs: ['wedding-guest-cost-calculator', 'expense-split-calculator'],
    calculate: (inputs) => {
      const limit = Number(inputs.limit) || 50;
      const tare = Number(inputs.luggage) || 0;
      const cCount = Number(inputs.clothes) || 0;
      const sCount = Number(inputs.shoes) || 0;
      const tech = Number(inputs.electronics) || 0;

      const clothesWeight = cCount * 0.75;
      const shoesWeight = sCount * 1.8;
      const total = tare + clothesWeight + shoesWeight + tech;
      const margin = limit - total;

      return {
        results: [
          { label: 'Estimated Packed Weight', value: total.toFixed(2), unit: 'lbs', isPrimary: true },
          { label: 'Remaining Cabin Weight Margin', value: margin.toFixed(2), unit: 'lbs' },
          { label: 'Suitcase Capacity Occupied', value: ((total / limit) * 100).toFixed(0), unit: '%' }
        ],
        chartData: [
          { name: 'Suitcase Structure Tare', value: tare, color: '#3b82f6' },
          { name: 'Apparel Packing', value: clothesWeight + shoesWeight, color: '#10b981' },
          { name: 'Power Adaptors & Laptops', value: tech, color: '#8b5cf6' },
          { name: 'Empty Allowed Capacity Margin', value: Math.max(0, margin), color: '#9ca3af' }
        ]
      };
    }
  },
  {
    id: 'gift-budget-planner',
    name: 'Holiday & Gift Budget Planner',
    slug: 'gift-budget-planner',
    category: 'daily-life',
    description: 'Allot distinct spending pots for family, friends, and coworkers.',
    seoTitle: 'Holiday Gift Budget Planner & Recipient Apportioner',
    seoDescription: 'Organize holiday shopper budgets. Track spending allowances and purchase totals per recipient.',
    inputs: [
      { id: 'overall', label: 'Maximum Overall Gift Spending Limit', type: 'number', defaultValue: 600, min: 20, step: 20, unit: '$' },
      { id: 'family', label: 'Close Family Recipients Count', type: 'number', defaultValue: 4, min: 0 },
      { id: 'friends', label: 'Friends & Neighbors Count', type: 'number', defaultValue: 6, min: 0 },
      { id: 'coworkers', label: 'Company Coworkers Count', type: 'number', defaultValue: 3, min: 0 }
    ],
    formula: 'Assigned Weight: Family (0.15 * overall per head); Friends (0.06 * overall); Coworkers (0.03 * overall)',
    explanation: 'Apportions holiday or event spending limits into clean allowances. Helps avoid credit card over-drafts during festive seasons.',
    example: 'For a $600 overall budget: 4 family members get $90 each, 6 friends get $36 each, and 3 coworkers get $18 each (leaving $54 unallocated).',
    faq: [
      { question: 'What is a reasonable corporate coworker gift limit?', answer: 'The standard coworker/colleague gift budget spans from $15.00 to $25.00. Secret Santa rules usually cap exchange totals at $20.00.' }
    ],
    relatedSlugs: ['wedding-guest-cost-calculator', 'expense-split-calculator'],
    calculate: (inputs) => {
      const budget = Number(inputs.overall) || 600;
      const famCount = Number(inputs.family) || 0;
      const friCount = Number(inputs.friends) || 0;
      const coCount = Number(inputs.coworkers) || 0;

      // Define standard ratios per group
      const famCut = budget * 0.15;
      const friCut = budget * 0.06;
      const coCut = budget * 0.03;

      const totalAllocSpeed = (famCount * famCut) + (friCount * friCut) + (coCount * coCut);
      const remaining = budget - totalAllocSpeed;

      return {
        results: [
          { label: 'Total Allocated Gifts Outlay', value: totalAllocSpeed.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Unallocated Buffer Remaining', value: remaining.toFixed(2), unit: '$' },
          { label: 'Allotted Spend Per Family Member', value: famCut.toFixed(2), unit: '$' },
          { label: 'Allotted Spend Per Friend', value: friCut.toFixed(2), unit: '$' },
          { label: 'Allotted Spend Per Coworker', value: coCut.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Family Allocations', value: famCount * famCut, color: '#ef4444' },
          { name: 'Friends Allocations', value: friCount * friCut, color: '#3b82f6' },
          { name: 'Coworkers Allocations', value: coCount * coCut, color: '#10b981' },
          { name: 'Savings Reserve Buffer', value: Math.max(0, remaining), color: '#f59e0b' }
        ]
      };
    }
  }
];
