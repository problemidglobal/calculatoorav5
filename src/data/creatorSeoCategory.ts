import { Calculator } from '../types';

export const CREATOR_SEO_CALCULATORS: Calculator[] = [
  {
    id: 'creator-word-counter',
    name: 'Integrated Word & Sentiment Counter',
    slug: 'word-counter',
    category: 'creator-tools',
    description: 'Calculate real-time word, character, and sentence counts, and evaluate readability scores.',
    seoTitle: 'Word Counter & Text Analyzer | Calculatoora',
    seoDescription: 'Count words, characters, sentences, paragraphs, and estimate reading time with this local developer tool.',
    inputs: [
      { id: 'textIn', label: 'Raw Content Paste', type: 'text', defaultValue: 'Optimizing web applications requires minimizing payload sizes and deferring non-critical scripts. This simple tool runs completely on your browser thread.' }
    ],
    formula: 'Words = Count of split substrings; Paragraphs = split of linefeed sequences.',
    explanation: 'Measuring text volume, sentence counts, and average word lengths helps keep content clear and engaging.',
    example: 'A paragraph containing two sentences and 18 words has an average sentence length of 9 words.',
    faq: [
      { question: 'What is the optimal sentence length?', answer: 'To maintain high readability, keep sentences under 15 words. Shorter sentences are easier for readers to quickly digest.' }
    ],
    relatedSlugs: ['reading-time', 'speaking-time', 'string-length'],
    calculate: (inputs) => {
      const raw = inputs.textIn || '';
      
      const chars = raw.length;
      const stripped = raw.trim();
      const words = stripped ? stripped.split(/\s+/).length : 0;
      const paragraphs = stripped ? stripped.split(/\n+/).length : 0;
      const sentences = stripped ? stripped.split(/[.!?]+/).filter(Boolean).length : 0;

      const readingTime = Math.ceil(words / 225); // Baseline 225 words per minute

      return {
        results: [
          { label: 'Words Counted', value: words, isPrimary: true },
          { label: 'Characters (with spaces)', value: chars },
          { label: 'Detected Sentences', value: sentences },
          { label: 'Paragraph Breaks', value: paragraphs },
          { label: 'Estimated Reading Time', value: `${readingTime} min` }
        ]
      };
    }
  },
  {
    id: 'creator-reading-time',
    name: 'Reading Time Calculator',
    slug: 'reading-time',
    category: 'creator-tools',
    description: 'Calculate average reading times of blog articles and scripts based on custom reading speeds.',
    seoTitle: 'Reading Time Estimator | Calculatoora',
    seoDescription: 'Estimate reading times based on custom words-per-minute parameters for blog optimization.',
    inputs: [
      { id: 'words', label: 'Word Count', type: 'number', defaultValue: 1200 },
      { id: 'wpm', label: 'Reading Speed (WPM)', type: 'select', defaultValue: '200', options: [
        { label: 'Slow Reader (150 WPM)', value: '150' },
        { label: 'Average Reader (200 WPM)', value: '200' },
        { label: 'Fast Reader (300 WPM)', value: '300' }
      ]}
    ],
    formula: 'Reading Time = Words / Reading Speed (WPM)',
    explanation: 'Adding estimated reading times to blog headers gives readers a clear expectation of the article length, reducing bounce rates.',
    example: 'An article with 1,200 words takes an average reader (200 WPM) exactly 6 minutes to complete.',
    faq: [
      { question: 'What is the average reading speed for adults?', answer: 'Most adults read between 200 and 250 words per minute for non-technical literature.' }
    ],
    relatedSlugs: ['word-counter', 'speaking-time'],
    calculate: (inputs) => {
      const words = Number(inputs.words || 1200);
      const wpm = Number(inputs.wpm || 200);

      const mins = words / wpm;
      const totalSeconds = Math.round(mins * 60);
      const displayMins = Math.floor(mins);
      const displaySecs = totalSeconds % 60;

      return {
        results: [
          { label: 'Estimated Reading Time', value: `${displayMins}m ${displaySecs}s`, isPrimary: true },
          { label: 'Total Words', value: words.toLocaleString() },
          { label: 'Speaking Equivalents', value: `${(words / 150).toFixed(1)} min` }
        ]
      };
    }
  },
  {
    id: 'creator-speaking-time',
    name: 'Speaking Time Calculator',
    slug: 'speaking-time',
    category: 'creator-tools',
    description: 'Convert presentation slides, video scripts, and text files into accurate read-aloud timings.',
    seoTitle: 'Speaking Time and Presentation Timer | Calculatoora',
    seoDescription: 'Accurately convert written speech texts to absolute read-aloud durations in minutes and seconds.',
    inputs: [
      { id: 'wordCount', label: 'Speech Word Count', type: 'number', defaultValue: 350 },
      { id: 'pace', label: 'Speaking Pace', type: 'select', defaultValue: '130', options: [
        { label: 'Slow Presentation pace (110 WPM)', value: '110' },
        { label: 'Steady Conversational pace (130 WPM)', value: '130' },
        { label: 'Rapid Broadcast pace (160 WPM)', value: '160' }
      ]}
    ],
    formula: 'Speaking Time = Words / Speaking Pace',
    explanation: 'Speaking speeds are typically slower than reading speeds. Converting word count to speaking time is essential for timing presentations and video scripts.',
    example: 'A script with 350 words matching standard slide paces translates to about 2 minutes and 41 seconds of read-aloud time.',
    faq: [
      { question: 'Why is presentation speaking slower?', answer: 'Presenters use pauses, adjust volume for impact, and speak clearly to ensure large audiences can follow along.' }
    ],
    relatedSlugs: ['reading-time', 'word-counter'],
    calculate: (inputs) => {
      const words = Number(inputs.wordCount || 350);
      const speed = Number(inputs.pace || 130);

      const mins = words / speed;
      const totalSeconds = Math.round(mins * 60);
      const displayMins = Math.floor(mins);
      const displaySecs = totalSeconds % 60;

      return {
        results: [
          { label: 'Duration Output', value: `${displayMins}m ${displaySecs}s`, isPrimary: true },
          { label: 'Words counts', value: words },
          { label: 'Suggested Slide Counts (estimate)', value: Math.ceil(words / 120) }
        ]
      };
    }
  },
  {
    id: 'creator-typing-speed',
    name: 'Typing Speed (WPM) Calculator',
    slug: 'typing-speed',
    category: 'creator-tools',
    description: 'Calculate average typing speed (WPM) and accuracy from text entries and duration limits.',
    seoTitle: 'Keyboard Typing Speed WPM Calculator | Calculatoora',
    seoDescription: 'Obtain precise WPM counts, net typing performance, and accuracy margins based on word inputs and timers.',
    inputs: [
      { id: 'textEntered', label: 'Typed characters length', type: 'number', defaultValue: 280 },
      { id: 'errors', label: 'Typing Errors', type: 'number', defaultValue: 3 },
      { id: 'timeSecs', label: 'Time elapsed (seconds)', type: 'number', defaultValue: 60 }
    ],
    formula: 'Gross WPM = (Chars / 5) / (Time_Minutes); Net WPM = Gross WPM - (Errors / Time_Minutes)',
    explanation: 'Standard typing metrics calculate a "word" as exactly five characters. Typing speed is measured in Net Words Per Minute to account for error penalties.',
    example: 'Typing 280 characters in 60 seconds with 3 errors yields a speed of 53 Net WPM.',
    faq: [
      { question: 'What is a strong typing speed?', answer: 'For standard desk jobs, 40 to 60 Words Per Minute (WPM) is average. Professional transcriptionists typically exceed 80 WPM.' }
    ],
    relatedSlugs: ['word-counter', 'string-length'],
    calculate: (inputs) => {
      const chars = Number(inputs.textEntered || 280);
      const errors = Number(inputs.errors || 3);
      const timeSecs = Number(inputs.timeSecs || 60);

      if (timeSecs <= 0) {
        return { results: [{ label: 'Speed', value: 'Duration must exceed 0', isPrimary: true }] };
      }

      const minutes = timeSecs / 60;
      const grossWPM = (chars / 5) / minutes;
      const netWPM = Math.max(0, grossWPM - (errors / minutes));
      const accuracy = chars > 0 ? ((chars - (errors * 5)) / chars) * 100 : 100;

      return {
        results: [
          { label: 'Net Typing Speed', value: `${Math.round(netWPM)} WPM`, isPrimary: true },
          { label: 'Gross Entry Speed', value: `${Math.round(grossWPM)} WPM` },
          { label: 'Accuracy Score', value: `${Math.max(0, Math.round(accuracy))}%` }
        ]
      };
    }
  },
  {
    id: 'creator-script-length',
    name: 'Script Duration Estimator',
    slug: 'script-length',
    category: 'creator-tools',
    description: 'Calculate video script duration based on line count and average read-aloud rates.',
    seoTitle: 'Video Script to Video Seconds Calculator | Calculatoora',
    seoDescription: 'Input written scripts to map line counts and sentences to precise video lengths.',
    inputs: [
      { id: 'lines', label: 'Count of Script Lines', type: 'number', defaultValue: 30 },
      { id: 'wordsPerLine', label: 'Average Words per Line', type: 'number', defaultValue: 12 },
      { id: 'tempo', label: 'Pace tempo', type: 'select', defaultValue: 'conversational', options: [
        { label: 'E-learning / instructional (120 words/m)', value: '120' },
        { label: 'Conversational pitch (140 words/m)', value: '140' },
        { label: 'Fast Promo script (165 words/m)', value: '165' }
      ]}
    ],
    formula: 'Total Words = Lines * WordsPerLine; Duration = Total Words / tempo',
    explanation: 'Video editors use script timing estimates to plan storyboard structures and align audio tracks before starting production.',
    example: 'A script containing 30 lines with 12 words per line translates to about 2 minutes and 34 seconds of video run time at standard pace.',
    faq: [
      { question: 'Why does script timing often run short?', answer: 'Estimated script times are often shorter because they don\'t account for action breaks, pauses, or transition slides.' }
    ],
    relatedSlugs: ['speaking-time', 'video-duration'],
    calculate: (inputs) => {
      const lines = Number(inputs.lines || 30);
      const wpl = Number(inputs.wordsPerLine || 12);
      const tempo = Number(inputs.tempo || 140);

      const totalWords = lines * wpl;
      const totalSecs = (totalWords / tempo) * 60;
      
      const m = Math.floor(totalSecs / 60);
      const s = Math.round(totalSecs % 60);

      return {
        results: [
          { label: 'Estimated Run Duration', value: `${m}m ${s}s`, isPrimary: true },
          { label: 'Overall Word Count', value: totalWords }
        ]
      };
    }
  },
  {
    id: 'creator-video-duration',
    name: 'Video Run Time Calculator',
    slug: 'video-duration',
    category: 'creator-tools',
    description: 'Calculate overall video duration based on scene counts and individual storyboard margins.',
    seoTitle: 'Video Run Time & Slide Duration Estimator | Calculatoora',
    seoDescription: 'Obtain precise run times based on planned scene quantities and individual storyboard intervals.',
    inputs: [
      { id: 'scenes', label: 'Number of Scenes', type: 'number', defaultValue: 12 },
      { id: 'avgDuration', label: 'Average Scene duration (Seconds)', type: 'number', defaultValue: 8 }
    ],
    formula: 'Duration = Number of Scenes * Average Scene Time',
    explanation: 'Timing video scenes helps creators refine flow, structure pacing, and stay within social media platform video length limits.',
    example: 'A 12-scene sequence averaging 8 seconds per shot yields a total run time of 1 minute and 36 seconds.',
    faq: [
      { question: 'What is the optimal video length for TikTok?', answer: 'Videos between 15 and 45 seconds generally perform best for viewer retention and engagement.' }
    ],
    relatedSlugs: ['script-length', 'podcast-length'],
    calculate: (inputs) => {
      const s = Number(inputs.scenes || 12);
      const avg = Number(inputs.avgDuration || 8);

      const totalSecs = s * avg;
      const m = Math.floor(totalSecs / 60);
      const remS = totalSecs % 60;

      return {
        results: [
          { label: 'Overall Video Duration', value: `${m}m ${remS}s`, isPrimary: true },
          { label: 'Video duration in raw seconds', value: `${totalSecs} s` }
        ]
      };
    }
  },
  {
    id: 'creator-podcast-length',
    name: 'Podcast Segment & Length Estimator',
    slug: 'podcast-length',
    category: 'creator-tools',
    description: 'Calculate overall podcast show duration based on intros, sponsorships, and guest discussions.',
    seoTitle: 'Podcast Episode Segment Timer | Calculatoora',
    seoDescription: 'Plan podcast episode durations, factoring in intro timings, sponsor segments, and main topic discussion blocks.',
    inputs: [
      { id: 'intro', label: 'Intro & Music Hook (min)', type: 'number', defaultValue: 2 },
      { id: 'discussion', label: 'Guest & Co-Host Discussion (min)', type: 'number', defaultValue: 45 },
      { id: 'sponsors', label: 'Ad & Sponsor Breaks count', type: 'number', defaultValue: 2 },
      { id: 'outro', label: 'Outro CTA sequence duration (min)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Time = Intro + Discussion + Outro + (SponsorBreaks * 1.5)',
    explanation: 'Structuring podcast segments ensures episode lengths remain consistent, keeping listeners engaged through dynamic pacing.',
    example: 'A plan with a 45-minute discussion, 2 brief sponsor ads, and standard templates resolves to a 53-minute episode.',
    faq: [
      { question: 'How long should a podcast episode be?', answer: 'The optimal length is determined by your content. 20 to 45 minutes fits well with typical daily commute patterns.' }
    ],
    relatedSlugs: ['video-duration', 'speaking-time'],
    calculate: (inputs) => {
      const intro = Number(inputs.intro || 2);
      const disc = Number(inputs.discussion || 45);
      const ads = Number(inputs.sponsors || 2);
      const outro = Number(inputs.outro || 3);

      const totalMinutes = intro + disc + outro + (ads * 1.5); // Assume 1.5 minutes average for ad reads

      return {
        results: [
          { label: 'Total Planned Program Length', value: `${totalMinutes.toFixed(1)} mins`, isPrimary: true },
          { label: 'Core Discussion Share', value: `${((disc / totalMinutes) * 100).toFixed(0)}%` },
          { label: 'Advertising Overhead duration', value: `${ads * 1.5} mins` }
        ]
      };
    }
  },
  {
    id: 'creator-article-length',
    name: 'Article Layout Word Estimator',
    slug: 'article-length',
    category: 'creator-tools',
    description: 'Estimate required article length based on SEO target thresholds and topic depth.',
    seoTitle: 'SEO Article Word Count Planner | Calculatoora',
    seoDescription: 'Plan target website article lengths based on theme configurations and ranking benchmarks for search optimization.',
    inputs: [
      { id: 'depth', label: 'Content Depth', type: 'select', defaultValue: 'seo-optimized', options: [
        { label: 'Quick tip / news post (400 words)', value: '400' },
        { label: 'Comprehensive SEO article (1200 words)', value: '1200' },
        { label: 'Ultimate Pillar Page guide (3000 words)', value: '3000' }
      ]},
      { id: 'sectionsCount', label: 'Subheadings count (H2/H3)', type: 'number', defaultValue: 6 }
    ],
    formula: 'Target size = base depth category length plus optional segment padding.',
    explanation: 'In-depth pillar guides typically rank higher in organic search result indexing than shorter, surface-level articles.',
    example: 'An SEO-optimized article with 6 subheadings requires a target length of 1,200 words, averaging 200 words per section.',
    faq: [
      { question: 'Are longer articles always better for SEO?', answer: 'Not necessarily. Quality, relevance, and user intent match are more critical than raw word counts.' }
    ],
    relatedSlugs: ['word-counter', 'reading-time'],
    calculate: (inputs) => {
      const base = Number(inputs.depth || 1200);
      const subheadings = Number(inputs.sectionsCount || 6);

      const avgWordsPerSub = base / subheadings;

      return {
        results: [
          { label: 'Suggested Word Target', value: `${base} words`, isPrimary: true },
          { label: 'Average Words per Subheading', value: `${avgWordsPerSub.toFixed(0)} words` }
        ]
      };
    }
  },
  {
    id: 'creator-youtube-earnings',
    name: 'YouTube Ad Revenue Calculator',
    slug: 'youtube-earnings',
    category: 'creator-tools',
    description: 'Calculate average YouTube ad revenue based on daily video views and niche RPM values.',
    seoTitle: 'YouTube Earnings & Ad Revenue Solver | Calculatoora',
    seoDescription: 'Input daily channel views and target RPM to check estimated monthly and annual revenue ranges.',
    inputs: [
      { id: 'dailyViews', label: 'Average Daily Views', type: 'number', defaultValue: 25000 },
      { id: 'rpm', label: 'Niche RPM ($ / 1k views)', type: 'number', defaultValue: 4.5 }
    ],
    formula: 'Earnings = (Views / 1000) * RPM',
    explanation: 'YouTube ad earnings are calculated using RPM (Revenue Per Mille), which is the amount creators earn per 1,000 views after YouTube\'s platform revenue share.',
    example: 'A channel averaging 25,000 views daily with a $4.50 RPM generates about $3,375 in monthly ad revenue.',
    faq: [
      { question: 'What is the difference between CPM and RPM?', answer: 'CPM measures the cost advertisers pay per 1,000 ad impressions. RPM shows the actual revenue a creator earns per 1,000 video views after YouTube\'s platform cut.' }
    ],
    relatedSlugs: ['youtube-cpm', 'youtube-rpm', 'tiktok-earnings'],
    calculate: (inputs) => {
      const dailyViews = Number(inputs.dailyViews || 25000);
      const rpm = Number(inputs.rpm || 4.5);

      const dailyEarnings = (dailyViews / 1000) * rpm;
      const monthlyEarnings = dailyEarnings * 30.5;
      const annualEarnings = dailyEarnings * 365;

      return {
        results: [
          { label: 'Estimated Monthly Revenue', value: `$${monthlyEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, isPrimary: true },
          { label: 'Estimated Daily Revenue', value: `$${dailyEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
          { label: 'Estimated Annual Revenue', value: `$${annualEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}` }
        ],
        chartData: [
          { name: 'Jan-Jun Peak', value: monthlyEarnings * 6, color: '#39FF14' },
          { name: 'Jul-Dec Peak', value: monthlyEarnings * 6.8, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'creator-youtube-cpm',
    name: 'YouTube CPM Cost Calculator',
    slug: 'youtube-cpm',
    category: 'creator-tools',
    description: 'Determine average campaign cost per 1,000 ad impressions based on overall budget and reach.',
    seoTitle: 'YouTube Campaign CPM Cost Solver | Calculatoora',
    seoDescription: 'Evaluate campaign CPM (Cost Per Mille) cost profiles based on advertising budgets and impression counts.',
    inputs: [
      { id: 'budget', label: 'Overall Ad Campaign Budget ($)', type: 'number', defaultValue: 1500 },
      { id: 'impressions', label: 'Total Deliveries Impressions', type: 'number', defaultValue: 185000 }
    ],
    formula: 'CPM = (Campaign cost / Total impressions) * 1000',
    explanation: 'CPM (Cost Per Mille) is a key metric advertisers use to measure campaign cost efficiency.',
    example: 'An advertising spend of $1,500 that delivers 185,000 ad impressions equivalents to an $8.11 CPM.',
    faq: [
      { question: 'Why does CPM vary across countries?', answer: 'Advertisers pay premium CPM rates in countries with higher purchasing power (e.g., US, UK, DE) because user conversion values are typically higher.' }
    ],
    relatedSlugs: ['youtube-earnings', 'youtube-rpm'],
    calculate: (inputs) => {
      const budget = Number(inputs.budget || 1500);
      const imps = Number(inputs.impressions || 185000);

      const cpm = imps > 0 ? (budget / imps) * 1000 : 0;

      return {
        results: [
          { label: 'Calculated Campaign CPM cost', value: `$${cpm.toFixed(2)}`, isPrimary: true },
          { label: 'Output deliveries cost per impression', value: `$${(budget / imps).toFixed(5)}` }
        ]
      };
    }
  },
  {
    id: 'creator-youtube-rpm',
    name: 'YouTube Page Analytics RPM Solver',
    slug: 'youtube-rpm',
    category: 'creator-tools',
    description: 'Obtain average RPM performance based on standard analytics earnings reports.',
    seoTitle: 'YouTube Channel RPM Solver | Calculatoora',
    seoDescription: 'Calculate RPM earnings efficiency based on overall earnings records and total video views.',
    inputs: [
      { id: 'revenue', label: 'Total Earnings Period ($)', type: 'number', defaultValue: 1200 },
      { id: 'views', label: 'Period Video Views', type: 'number', defaultValue: 280000 }
    ],
    formula: 'RPM = (Period Earnings / Views) * 1000',
    explanation: 'RPM (Revenue Per Mille) is the metric that matters most to creators. It reflects how effectively a channel monetizes its overall traffic.',
    example: 'A monthly earnings report of $1,200 from 280,000 video views indicates a $4.29 RPM.',
    faq: [
      { question: 'How can creators increase RPM?', answer: 'By creating longer videos (over 8 minutes) to allow mid-roll ads, targeting higher-paying niches (e.g., finance, tech), and focusing on high-CPM countries.' }
    ],
    relatedSlugs: ['youtube-earnings', 'youtube-cpm'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 1200);
      const views = Number(inputs.views || 280000);

      const rpm = views > 0 ? (rev / views) * 1000 : 0;

      return {
        results: [
          { label: 'Channel RPM Average', value: `$${rpm.toFixed(2)}`, isPrimary: true },
          { label: 'Ad revenue share per single view', value: `$${(rev / views).toFixed(5)}` }
        ]
      };
    }
  },
  {
    id: 'creator-tiktok-earnings',
    name: 'TikTok Creator Rewards Estimator',
    slug: 'tiktok-earnings',
    category: 'creator-tools',
    description: 'Calculate average earnings from Creator Rewards programs based on views and RPM.',
    seoTitle: 'TikTok Creator Rewards Earnings Solver | Calculatoora',
    seoDescription: 'Obtain monthly TikTok creator rewards estimates based on view counts and niche RPM rates.',
    inputs: [
      { id: 'views', label: 'Qualified Video Views monthly', type: 'number', defaultValue: 500000 },
      { id: 'rpm', label: 'Qualified RPM rate ($ / 1k views)', type: 'number', defaultValue: 0.65 }
    ],
    formula: 'Rewards = (Qualified Views / 1000) * RPM',
    explanation: 'TikTok’s Creator Rewards Program pays creators for high-retention videos longer than one minute, with rates determined by qualified RPM multipliers.',
    example: '500,000 qualified monthly video views at a $0.65 RPM generates an estimated $325 creator payout.',
    faq: [
      { question: 'What is a "Qualified View" on TikTok?', answer: 'Views are qualified if the user watches the video for at least five seconds, doesn\'t skip, and isn\'t purchasing promotional boosts.' }
    ],
    relatedSlugs: ['youtube-earnings', 'instagram-engagement'],
    calculate: (inputs) => {
      const views = Number(inputs.views || 500000);
      const rpm = Number(inputs.rpm || 0.65);

      const pay = (views / 1000) * rpm;

      return {
        results: [
          { label: 'Estimated Creator Rewards Payout', value: `$${pay.toFixed(2)}`, isPrimary: true },
          { label: 'Average earnings per video view', value: `$${(pay / views).toFixed(5)}` }
        ]
      };
    }
  },
  {
    id: 'creator-instagram-engagement',
    name: 'Instagram Profile Engagement Solver',
    slug: 'instagram-engagement',
    category: 'creator-tools',
    description: 'Calculate Instagram post engagement rates based on likes, comments, and profile followers.',
    seoTitle: 'Instagram Engagement Rate Solver | Calculatoora',
    seoDescription: 'Measure your Instagram profile and post engagement rate based on followers, comment lines, and likes.',
    inputs: [
      { id: 'likes', label: 'Average Likes per Post', type: 'number', defaultValue: 1200 },
      { id: 'comments', label: 'Average Comments per Post', type: 'number', defaultValue: 65 },
      { id: 'followers', label: 'Channel Followers count', type: 'number', defaultValue: 25000 }
    ],
    formula: 'Engagement Rate = ((Likes + Comments) / Followers) * 100',
    explanation: 'Brands use engagement rates over raw follower counts to evaluate creator campaign suitability, as high engagement indicates an active, real audience.',
    example: 'An post averaging 1,200 likes and 65 comments on a 25,000-follower account has a 5.06% engagement rate.',
    faq: [
      { question: 'What is a healthy engagement rate?', answer: 'For micro-creators, 3% to 6% is healthy. Accounts with larger follower bases typically see average engagement rates dip below 1.5%.' }
    ],
    relatedSlugs: ['engagement-rate', 'follower-growth'],
    calculate: (inputs) => {
      const l = Number(inputs.likes || 1200);
      const c = Number(inputs.comments || 65);
      const f = Number(inputs.followers || 25000);

      const er = f > 0 ? (((l + c) / f) * 100) : 0;

      return {
        results: [
          { label: 'Average Post Engagement Rate', value: `${er.toFixed(2)}%`, isPrimary: true },
          { label: 'Combined Interactive Activities', value: (l + c).toLocaleString() }
        ],
        chartData: [
          { name: 'Active Interaction', value: l + c, color: '#39FF14' },
          { name: 'Passive Followers', value: Math.max(0, f - (l + c)), color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'creator-sm-growth',
    name: 'Social Media Growth Forecaster',
    slug: 'sm-growth',
    category: 'creator-tools',
    description: 'Project future profile growth and metrics based on current growth trends.',
    seoTitle: 'Social Media Forecast & Growth Solver | Calculatoora',
    seoDescription: 'Forecast account follower growth over 6 and 12-month periods based on current monthly growth metrics.',
    inputs: [
      { id: 'startFollowers', label: 'Current Followers count', type: 'number', defaultValue: 10000 },
      { id: 'monthlyGrowthRate', label: 'Monthly growth rate (%)', type: 'number', defaultValue: 8 }
    ],
    formula: 'Future = Current * (1 + MonthlygrowthRate/100)^Months',
    explanation: 'Forecasting audience growth helps creators negotiate sponsorships and set realistic milestones for brand partnerships.',
    example: 'Growing at 8% monthly, a 10,000-follower channel is projected to reach approximately 15,868 followers in six months.',
    faq: [
      { question: 'What drives compounding audience growth?', answer: 'Viral content shares, cross-promotions, search algorithms, and consistent publishing schedules can drive exponential growth.' }
    ],
    relatedSlugs: ['follower-growth', 'instagram-engagement'],
    calculate: (inputs) => {
      const current = Number(inputs.startFollowers || 10000);
      const pct = Number(inputs.monthlyGrowthRate || 8) / 100;

      const m6 = current * Math.pow(1 + pct, 6);
      const m12 = current * Math.pow(1 + pct, 12);

      return {
        results: [
          { label: 'Projected Followers in 12 Months', value: Math.round(m12).toLocaleString(), isPrimary: true },
          { label: 'Projected Followers in 6 Months', value: Math.round(m6).toLocaleString() },
          { label: 'Estimated Overall Growth Delta', value: `+${Math.round(m12 - current).toLocaleString()} followers` }
        ],
        chartData: [
          { name: 'Month 0', value: current },
          { name: 'Month 6', value: Math.round(m6) },
          { name: 'Month 12', value: Math.round(m12) }
        ]
      };
    }
  },
  {
    id: 'creator-follower-growth',
    name: 'Follower Growth Rate Solver',
    slug: 'follower-growth',
    category: 'creator-tools',
    description: 'Calculate your audience growth rate between two tracking dates.',
    seoTitle: 'Audience Follower Growth Rate Solver | Calculatoora',
    seoDescription: 'Obtain precise percentages indicating how quickly your profile is acquiring new followers.',
    inputs: [
      { id: 'priorValue', label: 'Prior Period Followers', type: 'number', defaultValue: 8500 },
      { id: 'newValue', label: 'New Period Followers', type: 'number', defaultValue: 10200 }
    ],
    formula: 'Growth Rate = ((New - Prior) / Prior) * 100',
    explanation: 'Tracking period-over-period growth helps creators assess the effectiveness of recent campaigns and content strategies.',
    example: 'An increase from 8,500 to 10,200 followers represents a 20.0% growth rate.',
    faq: [
      { question: 'What is a typical monthly growth rate?', answer: 'Organic growth rates typically hover between 2% and 5% monthly for small to mid-sized active accounts.' }
    ],
    relatedSlugs: ['sm-growth', 'instagram-engagement'],
    calculate: (inputs) => {
      const p = Number(inputs.priorValue || 8500);
      const n = Number(inputs.newValue || 10200);

      const diff = n - p;
      const rate = p > 0 ? ((diff / p) * 100) : 0;

      return {
        results: [
          { label: 'Follower Growth Rate', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Net Followers Acquired', value: `+${diff.toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'creator-engagement-rate',
    name: 'Overall Engagement Rate Calculator',
    slug: 'engagement-rate',
    category: 'creator-tools',
    description: 'Calculate social media engagement rates based on overall post interactions and impressions.',
    seoTitle: 'Universal Profile Engagement Rate Solver | Calculatoora',
    seoDescription: 'Calculate standard profile engagement rates from impressions or reach, likes, and shares.',
    inputs: [
      { id: 'interactions', label: 'Total Interactive clicks (Likes, Shares, Comments)', type: 'number', defaultValue: 340 },
      { id: 'impressions', label: 'Impressions / Reach Count', type: 'number', defaultValue: 8200 }
    ],
    formula: 'Engagement Rate = (Interactions / Impressions) * 100',
    explanation: 'Reach-based engagement rates provide a more accurate measure of content performance and viral potential than follower-based metrics.',
    example: 'Receiving 340 active interactions from 8,200 impressions yields a 4.15% engagement rate.',
    faq: [
      { question: 'Is reach-based engagement higher than follower-based?', answer: 'No, reach-based engagement is usually lower because algorithms show content to broad, non-following audiences.' }
    ],
    relatedSlugs: ['instagram-engagement', 'sm-growth'],
    calculate: (inputs) => {
      const click = Number(inputs.interactions || 340);
      const imps = Number(inputs.impressions || 8200);

      const er = imps > 0 ? ((click / imps) * 100) : 0;

      return {
        results: [
          { label: 'Impressions Engagement Rate', value: `${er.toFixed(2)}%`, isPrimary: true },
          { label: 'Interactions per single impression', value: `${(click / imps).toFixed(4)}` }
        ]
      };
    }
  },
  {
    id: 'seo-keyword-density',
    name: 'Keyword Density & Count Meter',
    slug: 'keyword-density',
    category: 'creator-tools',
    description: 'Calculate keyword frequency and density to optimize copy for search engine guidelines.',
    seoTitle: 'Keyword Density Finder & Copy Optimizer | Calculatoora',
    seoDescription: 'Input written content and target phrases to calculate keyword density and check for keyword stuffing penalties.',
    inputs: [
      { id: 'corpus', label: 'Article / Copy Text Block', type: 'text', defaultValue: 'Optimizing responsive web design requires solid web layouts, web structures, and fast web speed scores. Learn why web is key.' },
      { id: 'phrase', label: 'Target Keyword / Phrase', type: 'text', defaultValue: 'web' }
    ],
    formula: 'Density = (Phrase Count / Word Count) * 100',
    explanation: 'Keyword density is the percentage of times a keyword appears in a text. While relevant keywords help search engines understand content, excessive frequency (keyword stuffing) can lead to search penalties.',
    example: 'Using "web" 5 times in a 20-word paragraph yields a 25.0% density, which far exceeds standard SEO guidelines.',
    faq: [
      { question: 'What is the ideal keyword density for SEO?', answer: 'The ideal is generally between 1.0% and 2.5%. Keep the frequency natural to avoid keyword stuffing penalties.' }
    ],
    relatedSlugs: ['keyword-ratio', 'seo-score'],
    calculate: (inputs) => {
      const corpus = inputs.corpus || '';
      const phrase = (inputs.phrase || '').trim().toLowerCase();

      const words = corpus.trim().split(/\s+/).filter(Boolean);
      const totalWords = words.length;

      if (!phrase || totalWords === 0) {
        return {
          results: [{ label: 'Keyword Density', value: '0%', isPrimary: true }]
        };
      }

      // Count occurrences
      const escaped = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      const matches = corpus.match(regex);
      const count = matches ? matches.length : 0;

      const density = (count / totalWords) * 100;
      let review = 'Healthy Frequency ✅';
      if (density > 2.5) review = 'High Frequency (Stuffing Risk) ⚠️';
      if (density === 0) review = 'No Keywords detected';

      return {
        results: [
          { label: 'Keyword Density percentage', value: `${density.toFixed(2)}%`, isPrimary: true },
          { label: 'Occurrences Count', value: `${count} times` },
          { label: 'Total Words scanned', value: totalWords },
          { label: 'SEO Advisor review', value: review }
        ]
      };
    }
  },
  {
    id: 'seo-keyword-ratio',
    name: 'SEO Keyword Ratio Analyzer',
    slug: 'keyword-ratio',
    category: 'creator-tools',
    description: 'Calculate the ratio of primary keywords to secondary keywords within an article.',
    seoTitle: 'SEO Keyword Ratio & Balance Solver | Calculatoora',
    seoDescription: 'Obtain target ratios of primary keywords to secondary keywords to construct balanced, search-friendly copy.',
    inputs: [
      { id: 'primary', label: 'Primary Keyword Occurrences', type: 'number', defaultValue: 15 },
      { id: 'secondary', label: 'Secondary / LSI Occurrences', type: 'number', defaultValue: 45 }
    ],
    formula: 'Ratio = Primary_Count / Secondary_Count',
    explanation: 'Effective SEO Copy balances primary focus keywords with related secondary terms (LSI) to provide rich, comprehensive context for search engines.',
    example: 'An article with 15 primary and 45 secondary keyword occurrences has a balanced 1:3 ratio, showing healthy topical depth.',
    faq: [
      { question: 'What are LSI keywords?', answer: 'Latent Semantic Indexing keywords are conceptually related terms that search engines use to understand deep topical context.' }
    ],
    relatedSlugs: ['keyword-density', 'seo-score'],
    calculate: (inputs) => {
      const pri = Number(inputs.primary || 15);
      const sec = Number(inputs.secondary || 45);

      const ratioVal = sec > 0 ? (pri / sec) : pri;

      return {
        results: [
          { label: 'Keyword Balance Ratio', value: `1 : ${(1 / ratioVal).toFixed(1)}`, isPrimary: true },
          { label: 'Primary Share of overall keywords', value: `${((pri / (pri + sec)) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'seo-score',
    name: 'Calculatoora Live SEO Score Evaluator',
    slug: 'seo-score',
    category: 'creator-tools',
    description: 'Evaluate overall page SEO scores based on keyword density, reading complexity, and metadata configurations.',
    seoTitle: 'SEO Content Score Solver | Calculatoora',
    seoDescription: 'Input content and title parameters to evaluate overall search-friendliness on a scale of 100.',
    inputs: [
      { id: 'titleText', label: 'Meta Tag Title text', type: 'text', defaultValue: 'Best Computational Math solver - Calculatoora V4' },
      { id: 'descText', label: 'Meta Tag Description text', type: 'text', defaultValue: 'Get access to fast mathematical solvers on Calculatoora. Run formulas locally without server uploads.' },
      { id: 'length', label: 'Content word count', type: 'number', defaultValue: 850 }
    ],
    formula: 'SEO Score = TitleLengthPenalty + DescLengthPenalty + WordCountScore',
    explanation: 'A healthy SEO ranking requires containing precise metadata lengths (Title: 50-60 characters, Description: 120-160 characters) and minimum body content depth.',
    example: 'With optimal meta values and an 850-word body copy, page evaluations score 95/100.',
    faq: [
      { question: 'Why does title length matter?', answer: 'Search engines limit visual space in search results. Titles exceeding characters are truncated, reducing click-through rates.' }
    ],
    relatedSlugs: ['meta-title-length', 'meta-desc-length', 'url-length'],
    calculate: (inputs) => {
      const title = inputs.titleText || '';
      const desc = inputs.descText || '';
      const words = Number(inputs.length || 850);

      let score = 100;

      // Title penalty
      const tLen = title.length;
      if (tLen < 40 || tLen > 60) score -= 15;
      if (tLen === 0) score -= 20;

      // Desc penalty
      const dLen = desc.length;
      if (dLen < 110 || dLen > 165) score -= 15;
      if (dLen === 0) score -= 20;

      // Words penalty
      if (words < 500) score -= 20;
      else if (words < 1000) score -= 5;

      return {
        results: [
          { label: 'Overall SEO Content Score', value: `${Math.max(10, score)} / 100`, isPrimary: true },
          { label: 'Title Evaluation character count', value: `${tLen} Chars (Goal: 50-60)` },
          { label: 'Description Evaluation character count', value: `${dLen} Chars (Goal: 120-160)` }
        ],
        chartData: [
          { name: 'Your Score', value: score, color: '#39FF14' },
          { name: 'Room to Improve', value: 100 - score, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'seo-meta-title-length',
    name: 'Meta Title Length Calculator',
    slug: 'meta-title-length',
    category: 'creator-tools',
    description: 'Calculate page title character and pixel counts to optimize search appearance.',
    seoTitle: 'Meta Title Length optimization Solver | Calculatoora',
    seoDescription: 'Obtain precise letter counts and search-appearance warnings to optimize headings.',
    inputs: [
      { id: 'titleText', label: 'Enter Page Title text', type: 'text', defaultValue: 'Calculoora Version 4: Fully offline static developer utility Hub' }
    ],
    formula: 'Length = Character count (Standard absolute limit: 60 characters).',
    explanation: 'Page titles are a critical SEO signal. Keeping titles within limits prevents them from being cut off in search results (SERPs).',
    example: 'A Title containing 61 characters faces truncation warning on Google mobile search layouts.',
    faq: [
      { question: 'What is the ideal title length?', answer: 'Between 50 and 60 characters is standard. This balances visibility with search engine layout limits.' }
    ],
    relatedSlugs: ['seo-score', 'meta-desc-length'],
    calculate: (inputs) => {
      const text = inputs.titleText || '';
      const len = text.length;

      let status = 'Perfect Length ✅';
      if (len === 0) status = 'Empty Title 🛑';
      else if (len < 30) status = 'Short Title Range ⚠️';
      else if (len > 60) status = 'Truncation Warning ⚠️';

      return {
        results: [
          { label: 'Title Length status', value: status, isPrimary: true },
          { label: 'Computed characters count', value: `${len} ch` },
          { label: 'Estimated Google SERP Width', value: `${len * 9.2} pixels (Limit: ~580px)` }
        ]
      };
    }
  },
  {
    id: 'seo-meta-desc-length',
    name: 'Meta Description Length Calculator',
    slug: 'meta-desc-length',
    category: 'creator-tools',
    description: 'Calculate page description character lengths to optimize search snippet appearance.',
    seoTitle: 'Meta Description Length Solver | Calculatoora',
    seoDescription: 'Measure meta description lengths to ensure snippets display completely in search result layouts.',
    inputs: [
      { id: 'descText', label: 'Snippet description text', type: 'text', defaultValue: 'Discover the largest suite of local micro-calculators on earth. Perfect for physics, engineering, and web layouts.' }
    ],
    formula: 'Target Length = 120 to 160 characters.',
    explanation: 'An optimized description encourages users to click through by explaining what they will find on your page.',
    example: 'A description containing 148 characters fits comfortably within snippet limits.',
    faq: [
      { question: 'Are longer meta descriptions penalized?', answer: 'No, but anything past 160 characters is truncated, which can cut off important details or calls to action.' }
    ],
    relatedSlugs: ['seo-score', 'meta-title-length'],
    calculate: (inputs) => {
      const desc = inputs.descText || '';
      const len = desc.length;

      let rangeStatus = 'Snippets optimization ✅';
      if (len === 0) rangeStatus = 'Missing description ⚠️';
      if (len < 110) rangeStatus = 'Short description (Underutilized Space) ⚠️';
      if (len > 160) rangeStatus = 'Excess length (Truncation likely) ⚠️';

      return {
        results: [
          { label: 'Snippet Display status', value: rangeStatus, isPrimary: true },
          { label: 'Snippet character counts', value: `${len} ch` }
        ]
      };
    }
  },
  {
    id: 'seo-url-length',
    name: 'SEO URL Length & Structure Solver',
    slug: 'url-length',
    category: 'creator-tools',
    description: 'Analyze URL structure and character length for search optimization and readability.',
    seoTitle: 'SEO URL Length & Anchor Solver | Calculatoora',
    seoDescription: 'Measure URL string lengths and identify structural issues (e.g. spaces, ugly query parameters) in website anchors.',
    inputs: [
      { id: 'urlStr', label: 'URL Anchor link to test', type: 'text', defaultValue: 'https://calculatoora.com/categories/programming/base64-encoder?utm_source=dev&active=true' }
    ],
    formula: 'URL Depth = Count of slashes; Length = Chars counts.',
    explanation: 'Short, descriptive URLs (often called human-readable or slug arrays) improve click-through rates and aid search indexing.',
    example: 'A 92-byte URL containing tracked campaign queries simplifies to a clean 58-character address after scrubbing parameter strings.',
    faq: [
      { question: 'Do query parameters hurt SEO?', answer: 'Not directly, but they can create duplicate content issues if search engines index multiple versions of the same page.' }
    ],
    relatedSlugs: ['seo-score', 'char-encoding'],
    calculate: (inputs) => {
      const raw = inputs.urlStr || '';
      const len = raw.length;

      const cleanUrl = raw.split('?')[0];
      const dirtyParams = raw.includes('?');

      let status = 'Clean Structure ✅';
      if (len > 75) status = 'Long URL Address ⚠️';
      if (dirtyParams) status = 'Parameter Bloat detected ⚠️';

      return {
        results: [
          { label: 'URL Structure review', value: status, isPrimary: true },
          { label: 'Character Count', value: `${len} characters` },
          { label: 'Scrubbed Clean URL output', value: cleanUrl }
        ]
      };
    }
  },
  {
    id: 'seo-readability-score',
    name: 'Flesch Readability Score Solver',
    slug: 'readability-score',
    category: 'creator-tools',
    description: 'Calculate the Flesch Reading Ease score of your text to ensure it reaches your target audience.',
    seoTitle: 'Flesch Reading Ease Score Solver | Calculatoora',
    seoDescription: 'Obtain instant Flesch-Kincaid reading difficulty and age-range ratings for your copy.',
    inputs: [
      { id: 'copyIn', label: 'Paste Written Work', type: 'text', defaultValue: 'This website is very fast. It runs calculations inside your browser. No files are saved on a server.' }
    ],
    formula: 'Score = 206.835 - 1.015 * (TotalWords / TotalSentences) - 84.6 * (TotalSyllables / TotalWords)',
    explanation: 'The Flesch-Kincaid Reading Ease index scores written copy on a scale of 0 to 100. Higher scores indicate paragraphs that are easy to read and understand.',
    example: 'An input consisting of basic vocabulary and short sentences scores 92, denoting elementary school level readability.',
    faq: [
      { question: 'What is a strong target Flesch score?', answer: 'For general web copy, aim for a score between 60 and 70 (approx. 8th to 9th-grade reading level).' }
    ],
    relatedSlugs: ['word-counter', 'seo-score'],
    calculate: (inputs) => {
      const copy = inputs.copyIn || '';
      
      const wordsList = copy.trim().split(/\s+/).filter(Boolean);
      const wCount = wordsList.length;
      const sCount = copy.split(/[.!?]+/).filter(Boolean).length || 1;

      if (wCount === 0) {
        return { results: [{ label: 'Score', value: 'Paste text copy to analyze', isPrimary: true }] };
      }

      // Simple syllable approximation: count vowels, adjust for silent letters
      let syllablesCount = 0;
      wordsList.forEach((word) => {
        let wClean = word.toLowerCase().replace(/[^a-z]/g, '');
        if (wClean.length <= 3) {
          syllablesCount += 1;
          return;
        }
        wClean = wClean.replace(/(?:es|ed|e)$/, '');
        wClean = wClean.replace(/^y/, '');
        const vowels = wClean.match(/[aeiouy]{1,2}/g);
        syllablesCount += vowels ? vowels.length : 1;
      });

      const scoreValue = 206.835 - 1.015 * (wCount / sCount) - 84.6 * (syllablesCount / wCount);
      const score = Math.max(0, Math.min(100, scoreValue));

      let audience = 'Graduate Level (Difficult)';
      if (score > 90) audience = '5th Grade (Very Easy)';
      else if (score > 80) audience = '6th Grade (Easy)';
      else if (score > 70) audience = '7th Grade (Fairly Easy)';
      else if (score > 60) audience = '8th & 9th Grade (Standard Plain English)';
      else if (score > 50) audience = 'High School (Fairly Difficult)';
      else if (score > 30) audience = 'College Level (Difficult)';

      return {
        results: [
          { label: 'Flesch Reading Ease', value: `${score.toFixed(1)} / 100`, isPrimary: true },
          { label: 'Reading Level Audience', value: audience },
          { label: 'Estimated Syllables calculated', value: syllablesCount }
        ],
        chartData: [
          { name: 'Complexity Score', value: score, color: '#39FF14' },
          { name: 'Padding Index', value: 100 - score, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'seo-content-length-analyzer',
    name: 'Copy Section Density & Length Planner',
    slug: 'content-length-analyzer',
    category: 'creator-tools',
    description: 'Map content volume and subheading count to recommended focal keyword frequencies.',
    seoTitle: 'Web page Copy length optimizer | Calculatoora',
    seoDescription: 'Plan target website page lengths, calculating recommended image counts and focus density ranges.',
    inputs: [
      { id: 'targetWords', label: 'Overall Target Word Count', type: 'number', defaultValue: 1500 }
    ],
    formula: 'Images suggested = Words / 450; Anchor headings = Words / 250.',
    explanation: 'A balanced content plan maintains visual variety (using images or charts) alongside structured text layout blocks to maximize search readability indices.',
    example: 'Planning a 1,500-word block recommends at least 6 section headings and 3-4 supporting illustrations.',
    faq: [
      { question: 'Why plan content structures?', answer: 'Because highly organized copy structures allow search engine web crawlers to categorize pages effectively.' }
    ],
    relatedSlugs: ['seo-score', 'article-length'],
    calculate: (inputs) => {
      const words = Number(inputs.targetWords || 1500);

      const subheadingsGoal = Math.max(2, Math.ceil(words / 250));
      const imagesGoal = Math.max(1, Math.ceil(words / 450));
      const keywordOccurMin = Math.ceil(words * 0.01);
      const keywordOccurMax = Math.ceil(words * 0.02);

      return {
        results: [
          { label: 'Recommended Structural Layout', value: `${words} Words`, isPrimary: true },
          { label: 'Minimum Subheadings (H2/H3)', value: `At least ${subheadingsGoal} headings` },
          { label: 'Target Image Counts file', value: `At least ${imagesGoal} assets` },
          { label: 'Suggested Keyword Frequency', value: `${keywordOccurMin} to ${keywordOccurMax} times` }
        ]
      };
    }
  }
];
