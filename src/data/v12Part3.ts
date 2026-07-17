import { Calculator } from '../types';

export const V12_PART3_CALCULATORS: Calculator[] = [
  // ==================== MOBILE APP DEVELOPMENT ====================
  {
    id: 'app-dev-cost',
    name: 'App Development Cost Calculator',
    slug: 'app-dev-cost-calculator',
    category: 'mobile-app',
    description: 'Estimate your mobile application building costs based on platform choices, screen counts, and custom features.',
    seoTitle: 'Mobile Application Building Cost Estimator',
    seoDescription: 'Forecast the cost of building a mobile app based on platform choices, features, and screen counts.',
    inputs: [
      { id: 'platforms', label: 'Platform choices', type: 'select', defaultValue: 'both', options: [{ label: 'Both iOS & Android (Cross-platform)', value: 'both' }, { label: 'Single platform (Native)', value: 'single' }] },
      { id: 'screens', label: 'Estimated user Screen counts', type: 'number', defaultValue: 10 },
      { id: 'devLocation', label: 'Developer location base', type: 'select', defaultValue: 'agency_us', options: [
        { label: 'US/EU Agency ($120/hr)', value: 'agency_us' },
        { label: 'Global Agency ($55/hr)', value: 'agency_global' }
      ]}
    ],
    formula: 'Total Cost = (Base Hours per Screen * Screens + Feature Buffers) * Developer Hourly Rate',
    explanation: 'App development costs are primarily driven by complexity (determined by screen counts) and your developers\' regional hourly rates.',
    example: 'Building a 10-screen app using a global agency ($55/hr) averages approximately $19,250 in initial development costs.',
    faq: [{ question: 'Why use cross-platform frameworks?', answer: 'Frameworks like React Native let you share up to 90% of your codebase between iOS and Android, lowering development costs.' }],
    relatedSlugs: ['app-revenue-calculator', 'website-cost-calculator'],
    keywords: ['mobile app builder cost', 'react native development budget', 'app screens duration estimates'],
    calculate: (inputs) => {
      const isBoth = inputs.platforms === 'both';
      const screens = Math.max(1, Number(inputs.screens || 10));
      const rate = inputs.devLocation === 'agency_us' ? 120 : 55;

      let billableHours = screens * 25; // 25 hours per screen average
      if (isBoth) billableHours *= 1.3; // cross-platform overhead multiplier

      const total = billableHours * rate;

      return {
        results: [
          { label: 'Estimated Building Cost Range', value: total.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Estimated Billable Hours', value: `${Math.round(billableHours)} Hours` }
        ],
        chartData: [
          { name: 'Estimated Cost', value: total }
        ]
      };
    }
  },
  {
    id: 'app-revenue',
    name: 'App Revenue Calculator',
    slug: 'app-revenue-calculator',
    category: 'mobile-app',
    description: 'Project monthly app store earnings by balancing active users against active subscription tiers.',
    seoTitle: 'Mobile App Store Earnings & Subscription Calculator',
    seoDescription: 'Forecast app store revenues after accounting for premium conversions and platform commission fees.',
    inputs: [
      { id: 'monthlyActive', label: 'Monthly Active Users (MAU) count', type: 'number', defaultValue: 10000 },
      { id: 'convRate', label: 'Premium tier Conversion rate (%)', type: 'number', defaultValue: 2.5 },
      { id: 'subFee', label: 'Premium Subscription fee ($/Month)', type: 'number', defaultValue: 4.99 },
      { id: 'storeFee', label: 'App Store Commission levy (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Premium Users = MAU * (Conversion% / 100)\nNet Revenue = Premium Users * Sub Fee * (1 - Store Fee % / 100)',
    explanation: 'Both Apple and Google deduct an app store commission (typically 15% to 30%) on digital purchases and subscriptions.',
    example: 'An app with 10,000 monthly active users and a 2.5% premium conversion generates approximately $1,060 in monthly net revenue after a 15% app store fee.',
    faq: [{ question: 'What is the App Store Small Business Program?', answer: 'Apple reduces its App Store fee to 15% for developers earning less than $1 million in annual revenue.' }],
    relatedSlugs: ['app-dev-cost-calculator', 'app-user-growth-calculator'],
    keywords: ['app store subscription revenue', 'in app purchase profits', 'platform service fee reductions'],
    calculate: (inputs) => {
      const mau = Number(inputs.monthlyActive || 10000);
      const conv = Number(inputs.convRate || 2.5) / 100;
      const sub = Number(inputs.subFee || 4.99);
      const fee = Number(inputs.storeFee || 15) / 100;

      const premiumSells = mau * conv;
      const gross = premiumSells * sub;
      const cut = gross * fee;
      const net = gross - cut;

      return {
        results: [
          { label: 'Estimated Monthly Net Earnings', value: net.toFixed(2), unit: '$', isPrimary: true },
          { label: 'App Store Commission Fee Deducted', value: cut.toFixed(2), unit: '$' },
          { label: 'Total Premium Subscribers', value: Math.round(premiumSells) }
        ],
        chartData: [
          { name: 'Your Net Profits', value: Math.round(net) },
          { name: 'App Store Fee Cut', value: Math.round(cut) }
        ]
      };
    }
  },
  {
    id: 'app-user-growth',
    name: 'App User Growth Calculator',
    slug: 'app-user-growth-calculator',
    category: 'mobile-app',
    description: 'Forecast app user expansion timelines by balancing user acquisition with organic churn rates.',
    seoTitle: 'Mobile App Churn & Monthly Active User growth Projector',
    seoDescription: 'Forecast monthly active user (MAU) growth curves by balancing acquisition with standard churn rates.',
    inputs: [
      { id: 'startingUsers', label: 'Starting Active Users', type: 'number', defaultValue: 2000 },
      { id: 'monthlyAcq', label: 'New Users Acquired Monthly', type: 'number', defaultValue: 500 },
      { id: 'churnRate', label: 'Monthly User Churn Rate (%)', type: 'number', defaultValue: 4.5 }
    ],
    formula: 'Active(Month N) = (Active(N-1) * (1 - Churn%)) + Monthly Acquisitions',
    explanation: 'Even a small monthly churn rate (typically 3% to 6%) highlights the importance of user retention alongside user acquisition.',
    example: 'Starting with 2,000 active users, acquiring 500 monthly with a 4.5% churn grows your active user base to approximately 7,130 in 12 months.',
    faq: [{ question: 'What is a typical app churn rate?', answer: 'Average monthly churn rates for consumer apps range from 4% to 8%.' }],
    relatedSlugs: ['app-conversion-calculator', 'app-revenue-calculator'],
    keywords: ['mobile subscriber churn tracker', 'acquisition curve forecast', 'mau cohort progress'],
    calculate: (inputs) => {
      const start = Number(inputs.startingUsers || 2000);
      const acq = Number(inputs.monthlyAcq || 500);
      const churn = Number(inputs.churnRate || 4.5) / 100;

      let current = start;
      const chartPoints = [];

      for (let m = 1; m <= 12; m++) {
        current = (current * (1 - churn)) + acq;
        chartPoints.push({ name: `Month ${m}`, value: Math.round(current) });
      }

      return {
        results: [
          { label: 'Forecasted Users after 1 Year', value: Math.round(current).toLocaleString(), isPrimary: true },
          { label: 'Estimated Cumulative Churn Loss', value: `${(churn * 100).toFixed(1)}% / Month` }
        ],
        chartData: chartPoints
      };
    }
  },
  {
    id: 'app-conversion',
    name: 'App Conversion Calculator',
    slug: 'app-conversion-calculator',
    category: 'mobile-app',
    description: 'Track and optimize your app funnel, from marketing click-throughs to app installations.',
    seoTitle: 'App Store Optimization (ASO) Conversion Tracker',
    seoDescription: 'Track user conversion rates across your app store marketing and download funnel.',
    inputs: [
      { id: 'pageViews', label: 'App Store Page Visitors count', type: 'number', defaultValue: 8000 },
      { id: 'downloads', label: 'Absolute App Installs downloads', type: 'number', defaultValue: 1200 }
    ],
    formula: 'Conversion Rate = (Installs / Page Views) * 100',
    explanation: 'Regularly optimizing page elements like icons and screenshots can help improve conversion rates.',
    example: 'Securing 1,200 app downloads from 8,000 product page visits yields a healthy 15.0% installation conversion rate.',
    faq: [{ question: 'What is a standard app install conversion rate?', answer: 'Average app store conversion rates range from 10% to 25% depending on search relevance.' }],
    relatedSlugs: ['app-user-growth-calculator', 'app-revenue-calculator'],
    keywords: ['aso store page conversion', 'marketing click install', 'funnel optimization index'],
    calculate: (inputs) => {
      const page = Number(inputs.pageViews || 8000);
      const down = Number(inputs.downloads || 1200);

      const conv = page > 0 ? (down / page) * 100 : 0;

      return {
        results: [
          { label: 'Download Conversion Rate', value: `${conv.toFixed(1)} %`, isPrimary: true },
          { label: 'Non-converting Viewers Portion', value: `${(100 - conv).toFixed(1)} %` }
        ],
        chartData: [
          { name: 'Installs', value: down },
          { name: 'Exits', value: page - down }
        ]
      };
    }
  },
  {
    id: 'app-storage',
    name: 'App Storage Calculator',
    slug: 'app-storage-calculator',
    category: 'mobile-app',
    description: 'Estimate app storage requirements for database records, user assets, and system configuration files.',
    seoTitle: 'Mobile App File & Database Storage Requirement Sizer',
    seoDescription: 'Forecast your app storage requirements based on database record sizes and user-generated asset sizes.',
    inputs: [
      { id: 'avgRecordSize', label: 'Avg Database Record (KB)', type: 'number', defaultValue: 12 },
      { id: 'userCount', label: 'Expected Total User Count', type: 'number', defaultValue: 5000 },
      { id: 'userAssetsSize', label: 'Avg User Assets (MB)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Total Storage = (Record Size * Users) + (Assets * Users)',
    explanation: 'Billing for database read and write actions is a major driver of application scaling costs.',
    example: 'Managing 5,000 active users uploading an average of 5MB in custom assets requires approximately 25.06 GB in cloud database storage space.',
    faq: [{ question: 'Why optimize asset sizes?', answer: 'Asset compression and aggressive client-side caching directly lower hosting costs.' }],
    relatedSlugs: ['app-dev-cost-calculator', 'hosting-cost-calculator'],
    keywords: ['mobile cloud ledger sizing', 'database record memory footprint', 'asset cache optimization'],
    calculate: (inputs) => {
      const rec = Number(inputs.avgRecordSize || 12);
      const users = Number(inputs.userCount || 5000);
      const asset = Number(inputs.userAssetsSize || 5);

      const kbTotal = rec * users;
      const mbTotal = (kbTotal / 1024) + (asset * users);
      const gbTotal = mbTotal / 1024;

      return {
        results: [
          { label: 'Required Cloud Storage', value: `${gbTotal.toFixed(2)} GB`, isPrimary: true },
          { label: 'User Assets Share', value: `${(asset * users / 1024).toFixed(2)} GB` }
        ],
        chartData: [
          { name: 'Database records', value: Math.round(kbTotal / 1024) },
          { name: 'Uploaded Assets', value: Math.round(asset * users) }
        ]
      };
    }
  },

  // ==================== WEBSITE OPERATIONS ====================
  {
    id: 'website-cost',
    name: 'Website Cost Calculator',
    slug: 'website-cost-calculator',
    category: 'web-ops',
    description: 'Estimate website development costs based on page count requirements and custom design complexity.',
    seoTitle: 'Custom Website Design & Development Cost Estimator',
    seoDescription: 'Estimate custom website design and development costs based on page counts and feature requirements.',
    inputs: [
      { id: 'pages', label: 'Estimated Website Page count', type: 'number', defaultValue: 8 },
      { id: 'customDesign', label: 'Design execution complexity', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Premium Custom Design', value: 'high' },
        { label: 'Moderate Theme customisation', value: 'moderate' }
      ]},
      { id: 'hourlyRate', label: 'Developer rate ($/Hour)', type: 'number', defaultValue: 65 }
    ],
    formula: 'Total Cost = Pages * (Hours per Page * Complexity Modifier) * Hourly Rate',
    explanation: 'Web work relies heavily on standard page templates, meaning cost increments are driven by customized coding and integrations.',
    example: 'An 8-page website styled with moderate custom design at $65/hr averages approximately $4,160 in development costs.',
    faq: [{ question: 'What are recurring web costs?', answer: 'Hosting, domain registration, SSL certificates, and security updates are typically recur-charged.' }],
    relatedSlugs: ['website-revenue-calculator', 'hosting-cost-calculator'],
    keywords: ['custom website cost', 'web design pricing', 'html template development fee'],
    calculate: (inputs) => {
      const pages = Math.max(1, Number(inputs.pages || 8));
      const complex = inputs.customDesign === 'high' ? 1.5 : 1.0;
      const rate = Number(inputs.hourlyRate || 65);

      const hours = pages * 8 * complex; // 8 hours per page baseline
      const total = hours * rate;

      return {
        results: [
          { label: 'Estimated Website Cost', value: Math.round(total).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Projected Developer Hours', value: `${Math.round(hours)} Hours` }
        ],
        chartData: [
          { name: 'Developer Cost', value: Math.round(total) }
        ]
      };
    }
  },
  {
    id: 'website-revenue',
    name: 'Website Revenue Calculator',
    slug: 'website-revenue-calculator',
    category: 'web-ops',
    description: 'Project website revenues by balancing monthly search visits with ad impressions.',
    seoTitle: 'Website Ad-Sense Revenue & Traffic Projection Tool',
    seoDescription: 'Forecast your monthly ad-click revenue by balancing website traffic against target ad RPMs.',
    inputs: [
      { id: 'clicks', label: 'Monthly Website Visitors count', type: 'number', defaultValue: 40000 },
      { id: 'rpmRate', label: 'Assumed Ad-Sense RPM payout ($)', type: 'number', defaultValue: 12 }
    ],
    formula: 'Monthly Revenue = (Traffic / 1000) * RPM Payout',
    explanation: 'Ad-supported platforms rely heavily on target RPM multipliers, representing the return of 1,000 page views.',
    example: 'A website generating 40,000 monthly visitors earns approximately $480 in monthly ad revenue at a standard $12 RPM payout.',
    faq: [{ question: 'How can I increase my ad RPM?', answer: 'Focus on high-value keywords in niches like finance, insurance, and technology to attract higher-paying ads.' }],
    relatedSlugs: ['website-cost-calculator', 'website-traffic-calculator'],
    keywords: ['adsense website payout model', 'monetization traffic yields', 'rpm pricing calculator'],
    calculate: (inputs) => {
      const clicks = Number(inputs.clicks || 40000);
      const rpm = Number(inputs.rpmRate || 12);

      const mRev = (clicks / 1000) * rpm;
      const yrRev = mRev * 12;

      return {
        results: [
          { label: 'Expected Monthly Revenue', value: mRev.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Yearly Recurring Projection', value: yrRev.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Monthly Revenue', value: Math.round(mRev) }
        ]
      };
    }
  },
  {
    id: 'hosting-cost',
    name: 'Hosting Cost Calculator',
    slug: 'hosting-cost-calculator',
    category: 'web-ops',
    description: 'Calculate and compare standard hosting costs for virtual private servers (VPS) and cloud hosting.',
    seoTitle: 'Virtual Server Hosting Cost Estimator',
    seoDescription: 'Estimate your hosting costs by choosing between basic shared servers and dedicated cloud servers.',
    inputs: [
      { id: 'serverType', label: 'Server hosting structure', type: 'select', defaultValue: 'vps', options: [
        { label: 'Basic Shared Shared Server ($15/Month)', value: 'shared' },
        { label: 'Virtual Private Server VPS ($40/Month)', value: 'vps' },
        { label: 'Dedicated App Cluster Cloud ($180/Month)', value: 'dedicated' }
      ]},
      { id: 'sslAddon', label: 'Require Dedicated Security certificates?', type: 'select', defaultValue: 'no', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }
    ],
    formula: 'Total Cost = (Base Server Cost + Security Addon) * 12',
    explanation: 'While shared servers are budget-friendly, busy websites typically require dedicated VPS hosting to ensure reliable response times.',
    example: 'Hosting a standard app on a VPS server costs approximately $480 annually before factoring in any security addons.',
    faq: [{ question: 'Is SSL required?', answer: 'Yes, modern web browsers flag websites without SSL configurations as insecure, which negatively affects search rankings.' }],
    relatedSlugs: ['website-cost-calculator', 'server-capacity-calculator'],
    keywords: ['vps cloud servers bill', 'hosting cost optimizer', 'dedicated hosting solutions'],
    calculate: (inputs) => {
      const type = inputs.serverType || 'vps';
      let monthly = 40;
      if (type === 'shared') monthly = 15;
      else if (type === 'dedicated') monthly = 180;

      if (inputs.sslAddon === 'yes') monthly += 10;

      return {
        results: [
          { label: 'Annual Server Cost', value: (monthly * 12).toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly billing charge', value: monthly.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Hosting charges', value: monthly * 12 }
        ]
      };
    }
  },
  {
    id: 'website-traffic-calculator',
    name: 'Website Traffic Calculator',
    slug: 'website-traffic-calculator',
    category: 'web-ops',
    description: 'Calculate monthly page views based on active daily users and average page depth metrics.',
    seoTitle: 'Website Pageview Traffic & Engagement Sizer',
    seoDescription: 'Calculate monthly page views based on daily active visitors and average page depth engagement.',
    inputs: [
      { id: 'dailyActive', label: 'Daily Active Visitors count', type: 'number', defaultValue: 1500 },
      { id: 'pageDepth', label: 'Pages visited per Session depth', type: 'number', defaultValue: 3.2 }
    ],
    formula: 'Monthly Pageviews = Daily Active * Page Depth * 30.4',
    explanation: 'Optimizing site navigation and content quality helps increase page depth, boosting your ad impressions and conversion opportunites.',
    example: 'A site with 1,500 daily active visitors averaging 3.2 page views per session generates approximately 145,920 monthly page views.',
    faq: [{ question: 'What is site bounce rate?', answer: 'The percentage of visitors who leave your website after viewing only a single page.' }],
    relatedSlugs: ['website-revenue-calculator', 'bandwidth-calculator'],
    keywords: ['website monthly pageviews', 'engagement session depth', 'web traffic analytics'],
    calculate: (inputs) => {
      const active = Number(inputs.dailyActive || 1500);
      const depth = Number(inputs.pageDepth || 3.2);

      const mViews = active * depth * 30.4;

      return {
        results: [
          { label: 'Monthly Pageviews Volume', value: Math.round(mViews).toLocaleString(), isPrimary: true },
          { label: 'Annual Traffic Equivalent', value: Math.round(mViews * 12).toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'bandwidth-calculator',
    name: 'Bandwidth Calculator',
    slug: 'bandwidth-calculator',
    category: 'web-ops',
    description: 'Estimate required server data bandwidth based on average page sizes and visitor counts.',
    seoTitle: 'Server Bandwidth Requirement Sizer',
    seoDescription: 'Estimate your required monthly hosting bandwidth based on average page size and web traffic.',
    inputs: [
      { id: 'pageViews', label: 'Monthly Pageviews count', type: 'number', defaultValue: 100000 },
      { id: 'avgPageSize', label: 'Average Page File Size (MB)', type: 'number', defaultValue: 2.5 }
    ],
    formula: 'Required Bandwidth = Pageviews * Average Size',
    explanation: 'Uncompressed asset files and heavy unoptimized layouts can quickly exceed your hosting provider\'s monthly bandwidth limits.',
    example: 'Optimizing an average page size from 2.5 MB to 1.5 MB saves 100,000 visitors over 100 GB in monthly bandwidth charges.',
    faq: [{ question: 'What is a CDN?', answer: 'Content Delivery Network - caches static files globally, which significantly reduces direct server bandwidth loads.' }],
    relatedSlugs: ['server-capacity-calculator', 'website-traffic-calculator'],
    keywords: ['server monthly traffic load', 'bandwidth allocation sizing', 'web compression yields'],
    calculate: (inputs) => {
      const views = Number(inputs.pageViews || 100000);
      const size = Number(inputs.avgPageSize || 2.5);

      const totalMb = views * size;
      const totalGb = totalMb / 1024;

      return {
        results: [
          { label: 'Minimum Required Bandwidth', value: `${totalGb.toFixed(1)} GB`, isPrimary: true },
          { label: 'Bandwidth daily equivalent', value: `${(totalGb / 30).toFixed(2)} GB / Day` }
        ],
        chartData: [
          { name: 'Used Bandwidth', value: Math.round(totalGb) }
        ]
      };
    }
  },
  {
    id: 'server-capacity-calculator',
    name: 'Server Capacity Calculator',
    slug: 'server-capacity-calculator',
    category: 'web-ops',
    description: 'Calculate server capacity limits, including peak queries per second (QPS) and maximum concurrent sessions.',
    seoTitle: 'Web Application Peak QPS & Capacity Sizer',
    seoDescription: 'Model your server performance capacity by estimating peak queries per second (QPS) limits.',
    inputs: [
      { id: 'avgResponseTime', label: 'Average API Response Time (ms)', type: 'number', defaultValue: 150 },
      { id: 'concurrency', label: 'Server Active CPU Worker threads', type: 'number', defaultValue: 16 }
    ],
    formula: 'Theoretical QPS Capacity = (1000 / ResponseTime) * Worker Threads',
    explanation: 'Peak traffic and slow database queries are the primary causes of application timeouts and server crashes.',
    example: 'A VPS with 16 CPU threads handling a 150ms average response time can process up to 106.6 peak queries per second.',
    faq: [{ question: 'How can I handle higher peak loads?', answer: 'Implement worker thread clustering, database connection scaling, or opt for container deployment.' }],
    relatedSlugs: ['bandwidth-calculator', 'hosting-cost-calculator'],
    keywords: ['web queries per second qps', 'concurrency scalability load', 'api thread performance limits'],
    calculate: (inputs) => {
      const resp = Number(inputs.avgResponseTime || 150);
      const workers = Number(inputs.concurrency || 16);

      const qps = resp > 0 ? (1000 / resp) * workers : 0;
      const capacityMin = qps * 60;

      return {
        results: [
          { label: 'Theoretical Peak Capacity (QPS)', value: qps.toFixed(1), isPrimary: true },
          { label: 'Maximum Queries per Minute limit', value: Math.round(capacityMin).toLocaleString() }
        ]
      };
    }
  },

  // ==================== DIGITAL MARKETING ADVANCED ====================
  {
    id: 'seo-roi',
    name: 'SEO ROI Calculator',
    slug: 'seo-roi-calculator',
    category: 'adv-marketing',
    description: 'Calculate return on investment (ROI) for search engine optimization campaigns based on traffic conversions.',
    seoTitle: 'Search Engine Optimization (SEO) ROI Calculator',
    seoDescription: 'Calculate the return on investment (ROI) of your search engine optimization campaigns.',
    inputs: [
      { id: 'monthlyInvestment', label: 'Monthly SEO Retainer Charge ($)', type: 'number', defaultValue: 1500 },
      { id: 'acqTraffic', label: 'Projected Monthly Organic Traffic acquired', type: 'number', defaultValue: 5000 },
      { id: 'conversionPct', label: 'Lead Conversion Rate (%)', type: 'number', defaultValue: 2.0 },
      { id: 'dealValue', label: 'Average Lead Value ($)', type: 'number', defaultValue: 120 }
    ],
    formula: 'Conversion Count = Traffic * (Conversion% / 100)\nRevenue = Conversions * Lead Value\nNet Profit = Revenue - Investment\nSEO ROI = (Net Profit / Investment) * 100',
    explanation: 'SEO campaign valuation requires measuring organic search conversions alongside raw search traffic growth.',
    example: 'An organic search campaign securing 5,000 visitors and converting at $120 per lead yields approximately $10,500 in net profit.',
    faq: [{ question: 'What is a typical SEO campaign duration?', answer: 'Most SEO campaigns show reliable return-on-investment after 4 to 6 months of active optimization.' }],
    relatedSlugs: ['traffic-growth-calculator', 'keyword-value-calculator'],
    keywords: ['seo return on investment margin', 'organic search traffic yields', 'lead acquisition values'],
    calculate: (inputs) => {
      const inv = Number(inputs.monthlyInvestment || 1500);
      const traffic = Number(inputs.acqTraffic || 5000);
      const conv = Number(inputs.conversionPct || 2) / 100;
      const value = Number(inputs.dealValue || 120);

      const conversions = traffic * conv;
      const grossRev = conversions * value;
      const profit = grossRev - inv;
      const roi = inv > 0 ? (profit / inv) * 100 : 0;

      return {
        results: [
          { label: 'Projected Monthly SEO ROI', value: `${roi.toFixed(2)}%`, isPrimary: true },
          { label: 'Monthly Lead Conversions acquired', value: Math.round(conversions) },
          { label: 'Reconciled Monthly Net Profit', value: profit.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'SEO agency fee', value: inv },
          { name: 'Campaign Net Profit', value: Math.max(0, Math.round(profit)) }
        ]
      };
    }
  },
  {
    id: 'traffic-growth',
    name: 'Traffic Growth Calculator',
    slug: 'traffic-growth-calculator',
    category: 'adv-marketing',
    description: 'Forecast monthly organic organic search traffic curves based on compounding growth targets.',
    seoTitle: 'Organic Search Traffic Growth Projection Tool',
    seoDescription: 'Forecast monthly and annual search traffic growth curves based on compounding targets.',
    inputs: [
      { id: 'startTraffic', label: 'Starting Monthly Traffic', type: 'number', defaultValue: 5000 },
      { id: 'growthRate', label: 'Assumed Monthly Growth Rate (%)', type: 'number', defaultValue: 4.5 }
    ],
    formula: 'Traffic(Month N) = Base * (1 + Growth)^N',
    explanation: 'Consistent compounding growth builds significant momentum, helping you plan more reliable search marketing campaigns over time.',
    example: 'Compounding 5,000 monthly visitors at 4.5% month-over-month increases your search traffic to over 8,470 by month 12.',
    faq: [{ question: 'What is a standard search growth rate?', answer: 'Healthy, optimized websites target an organic search growth rate of 3% to 6% per month.' }],
    relatedSlugs: ['seo-roi-calculator', 'keyword-value-calculator'],
    keywords: ['organic traffic growth model', 'search volume compounding curves', 'search campaign forecasting'],
    calculate: (inputs) => {
      const start = Number(inputs.startTraffic || 5000);
      const growth = Number(inputs.growthRate || 4.5) / 100;

      let current = start;
      const chartPoints = [];

      for (let m = 1; m <= 12; m++) {
        current *= (1 + growth);
        chartPoints.push({ name: `Month ${m}`, value: Math.round(current) });
      }

      return {
        results: [
          { label: 'Projected Traffic in Year 1', value: Math.round(current).toLocaleString(), isPrimary: true },
          { label: 'Absolute Monthly Increase', value: Math.round(current - start).toLocaleString() }
        ],
        chartData: chartPoints
      };
    }
  },
  {
    id: 'keyword-value',
    name: 'Keyword Value Calculator',
    slug: 'keyword-value-calculator',
    category: 'adv-marketing',
    description: 'Calculate keyword values and traffic values by comparing organic ranking benchmarks with CPC values.',
    seoTitle: 'Ad-CPC Comparison & Keyword Value Estimator',
    seoDescription: 'Calculate the premium organic value of keywords by comparing search rankings with standard CPC metrics.',
    inputs: [
      { id: 'searchVolume', label: 'Monthly Search Volume (Impressions) count', type: 'number', defaultValue: 10000 },
      { id: 'cpcRate', label: 'Average Competitor CPC bid cost ($)', type: 'number', defaultValue: 3.5 },
      { id: 'rankCtr', label: 'Position click Click-through Rate (CTR) (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Equivalent PPC Value = Search Volume * (CTR % / 100) * CPC Cost',
    explanation: 'Valuing keywords based on CPC bids reveals the significant ad spend saved through high organic rankings.',
    example: 'Ranking in a position that captures a 15% CTR on a 10,000 volume keyword with a $3.50 CPC saves approximately $5,250 in equivalent ad spend.',
    faq: [{ question: 'Why use CPC for organic forecasting?', answer: 'CPC bids indicate the value competitors place on that traffic, reflecting the keyword\'s commercial intent.' }],
    relatedSlugs: ['seo-roi-calculator', 'traffic-growth-calculator'],
    keywords: ['keyword organic market value', 'cpc comparison search audit', 'equivalent ad spend savings'],
    calculate: (inputs) => {
      const vol = Number(inputs.searchVolume || 10000);
      const cpc = Number(inputs.cpcRate || 3.5);
      const ctr = Number(inputs.rankCtr || 15) / 100;

      const clicks = vol * ctr;
      const value = clicks * cpc;

      return {
        results: [
          { label: 'Equivalent Monthly PPC Value', value: value.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Acquired Traffic Clicks Count', value: Math.round(clicks) }
        ],
        chartData: [
          { name: 'Ad Spend Value Value', value: Math.round(value) }
        ]
      };
    }
  },
  {
    id: 'advertising-budget',
    name: 'Advertising Budget Calculator',
    slug: 'advertising-budget-calculator',
    category: 'adv-marketing',
    description: 'Calculate lead and customer acquisition goals to plan your advertising budgets.',
    seoTitle: 'Campaign Advertising Budget & Cost-Per-Lead Planner',
    seoDescription: 'Plan your digital advertising budgets by defining and tracing your target lead volumes and cost-per-lead (CPL) benchmarks.',
    inputs: [
      { id: 'leadGoal', label: 'Target Lead Volume (Monthly)', type: 'number', defaultValue: 150 },
      { id: 'cplRate', label: 'Average Cost-Per-Lead (CPL) budget ($)', type: 'number', defaultValue: 22 }
    ],
    formula: 'Monthly Budget Required = Target Leads * CPL Cost',
    explanation: 'Forecasting lead volume against CPL benchmarks is essential to prevent ad spend waste and keep campaigns profitable.',
    example: 'An ad campaign targeting 150 monthly leads at an average $22 CPL requires a baseline budget of $3,300.',
    faq: [{ question: 'What is CPL?', answer: 'Cost Per Lead - the total marketing spend divided by the number of sales leads generated.' }],
    relatedSlugs: ['campaign-profit-calculator', 'marketing-funnel-calculator'],
    keywords: ['advertising budget planner', 'cost per lead campaign', 'lead volume target finder'],
    calculate: (inputs) => {
      const goal = Number(inputs.leadGoal || 150);
      const cpl = Number(inputs.cplRate || 22);

      const budget = goal * cpl;

      return {
        results: [
          { label: 'Monthly Advertising Budget Required', value: budget.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Estimated Lead Sizing Cost', value: cpl.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Ad Spend Allocation', value: Math.round(budget) }
        ]
      };
    }
  },
  {
    id: 'campaign-profit-calculator',
    name: 'Campaign Profit Calculator',
    slug: 'campaign-profit-calculator',
    category: 'adv-marketing',
    description: 'Calculate net ad campaign profits and returns on ad spend (ROAS).',
    seoTitle: 'Campaign ROI & Return on Ad Spend (ROAS) Calculator',
    seoDescription: 'Obtain exact ad profits and ROAS metrics by inputting ad spend and purchase conversion revenues.',
    inputs: [
      { id: 'adSpend', label: 'Total Campaign Ad Spend ($)', type: 'number', defaultValue: 4000 },
      { id: 'grossSales', label: 'Gross Sales Conversions Revenue ($)', type: 'number', defaultValue: 14000 }
    ],
    formula: 'ROAS = Gross Revenue / Ad Spend\nNet Profit = Gross Revenue - Ad Spend',
    explanation: 'ROAS (Return on Ad Spend) measures click efficiency, while net profit verifies the true corporate viability of digital campaigns.',
    example: 'Spending $4,000 to generate $14,000 in gross conversions yields a healthy 3.5x ROAS and $10,000 in net profit.',
    faq: [{ question: 'What is a typical break-even ROAS?', answer: 'A 1.0x ROAS covers ad spend, but standard businesses target a 3.0x to 4.0x ROAS to cover raw product and operations overhead.' }],
    relatedSlugs: ['advertising-budget-calculator', 'marketing-funnel-calculator'],
    keywords: ['roas advertising multiplier', 'ad campaign net earnings', 'ppc conversions tracker'],
    calculate: (inputs) => {
      const spend = Number(inputs.adSpend || 4000);
      const rev = Number(inputs.grossSales || 14000);

      const roas = spend > 0 ? rev / spend : 0;
      const profit = rev - spend;

      return {
        results: [
          { label: 'Net Campaign Profit Margin', value: profit.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Return on Ad Spend (ROAS)', value: `${roas.toFixed(2)}x` }
        ],
        chartData: [
          { name: 'Ad Spend Cost', value: spend },
          { name: 'Net Profit Margin', value: Math.max(0, profit) }
        ]
      };
    }
  },
  {
    id: 'marketing-funnel',
    name: 'Marketing Funnel Calculator',
    slug: 'marketing-funnel-calculator',
    category: 'adv-marketing',
    description: 'Model your marketing funnel, tracking conversion rates from raw impressions down to final closed sales.',
    seoTitle: 'Sales & Marketing Funnel Conversion Sizer',
    seoDescription: 'Model your sales funnel, tracking conversion rates from raw impressions down to final sales and revenue.',
    inputs: [
      { id: 'impressions', label: 'Top-Funnel Impressional Audience count', type: 'number', defaultValue: 100000 },
      { id: 'ctrPct', label: 'Landing Click-through Rate (CTR) (%)', type: 'number', defaultValue: 2.2 },
      { id: 'saleConvPct', label: 'Product Conversion Sales rate (%)', type: 'number', defaultValue: 1.5 },
      { id: 'orderValue', label: 'Average Consumer Check value ($)', type: 'number', defaultValue: 45 }
    ],
    formula: 'Clicks = Impressions * CTR%\nSales = Clicks * Sales%\nRevenue = Sales * Order Value',
    explanation: 'Tracking conversion rates at each funnel stage helps identify and fix drops in user engagement.',
    example: 'An impression cohort of 100,000 with a 2.2% CTR (2,200 visits) converts 33 purchases at a $45 checkout, yielding $1,485 in total revenue.',
    faq: [{ question: 'What is top-of-funnel versus bottom-of-funnel?', answer: 'Top-of-funnel focuses on raw impressions and brand awareness, while bottom-of-funnel centers on high-intent sales conversions.' }],
    relatedSlugs: ['advertising-budget-calculator', 'campaign-profit-calculator'],
    keywords: ['funnel conversion multiplier', 'ppc impressions conversions', 'consumer checkout metrics'],
    calculate: (inputs) => {
      const imp = Number(inputs.impressions || 100000);
      const ctr = Number(inputs.ctrPct || 2.2) / 100;
      const conv = Number(inputs.saleConvPct || 1.5) / 100;
      const val = Number(inputs.orderValue || 45);

      const clicks = imp * ctr;
      const sales = clicks * conv;
      const revenue = sales * val;

      return {
        results: [
          { label: 'Forecasted Total Revenues', value: revenue.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Acquired Consumer Sales', value: Math.round(sales) },
          { label: 'Website Traffic Clicks received', value: Math.round(clicks) }
        ],
        chartData: [
          { name: 'Exits', value: imp - Math.round(clicks) },
          { name: 'Clicks', value: Math.round(clicks) - Math.round(sales) },
          { name: 'Purchases', value: Math.round(sales) }
        ]
      };
    }
  },

  // ==================== PHOTOGRAPHY & MEDIA ====================
  {
    id: 'image-compression',
    name: 'Image Compression Calculator',
    slug: 'image-compression-calculator',
    category: 'photography',
    description: 'Calculate predicted file size savings from image compression and format optimization.',
    seoTitle: 'Image File Size Compression Savings Calculator',
    seoDescription: 'Estimate web resource and storage savings from image compression.',
    inputs: [
      { id: 'baseSize', label: 'Original Image Size (MB)', type: 'number', defaultValue: 6.5 },
      { id: 'qualityRatio', label: 'Target Compression Quality Level (%)', type: 'number', defaultValue: 75 }
    ],
    formula: 'Estimated Size = Original Size * (Quality / 100)',
    explanation: 'Modern image formats (like WebP and AVIF) can compress large media files by over 70% with minimal loss in visual quality.',
    example: 'Compressing a 6.5 MB original image to 75% quality yields an estimated file size of 4.88 MB, saving approximately 1.62 MB in storage.',
    faq: [{ question: 'What is lossy versus lossless compression?', answer: 'Lossly permanently discards redundant pixel data to optimize files, while lossless reduces file sizes without changing pixel values.' }],
    relatedSlugs: ['photo-storage-calculator', 'photo-backup-calculator'],
    keywords: ['jpeg webp sizing conversion', 'image file size compression', 'web asset speed optimization'],
    calculate: (inputs) => {
      const size = Number(inputs.baseSize || 6.5);
      const qual = Number(inputs.qualityRatio || 75) / 100;

      const expectedSize = size * qual;
      const saved = size - expectedSize;

      return {
        results: [
          { label: 'Estimated Output Size', value: `${expectedSize.toFixed(2)} MB`, isPrimary: true },
          { label: 'Saved Storage Space', value: `${saved.toFixed(2)} MB` }
        ],
        chartData: [
          { name: 'Final compressed size', value: Math.round(expectedSize * 100) / 100 },
          { name: 'Discarded redundant weight', value: Math.round(saved * 100) / 100 }
        ]
      };
    }
  },
  {
    id: 'photo-storage-calculator',
    name: 'Photo Storage Calculator',
    slug: 'photo-storage-calculator',
    category: 'photography',
    description: 'Calculate the total number of images you can store based on media resolution and card memory limits.',
    seoTitle: 'Camera SD Card Photo Storage capacity Calculator',
    seoDescription: 'Calculate the total number of images you can store on an SD memory card based on camera resolution.',
    inputs: [
      { id: 'megapixels', label: 'Camera Megapixel Class (MP)', type: 'number', defaultValue: 24 },
      { id: 'cardSize', label: 'SD Memory Card Size (GB)', type: 'number', defaultValue: 64 },
      { id: 'fileFormat', label: 'Selected File Sizing format', type: 'select', defaultValue: 'raw', options: [
        { label: 'Uncompressed RAW (3MB / Megapixel)', value: 'raw' },
        { label: 'Standard compressed JPEG (0.4MB / Megapixel)', value: 'jpeg' }
      ]}
    ],
    formula: 'File Size = Megapixels * Multiplier\nTotal Photos = Card Capacity / File Size',
    explanation: 'High-resolution uncompressed RAW files preserve excellent pixel data, but require significantly more cards and storage capacity than JPEGs.',
    example: 'A 64 GB SD memory card can store approximately 880 uncompressed RAW images from a 24 MP camera.',
    faq: [{ question: 'How much larger is a RAW file than a JPEG?', answer: 'Uncompressed RAW files are typically 6 to 10 times larger than standard compressed JPEGs.' }],
    relatedSlugs: ['image-compression-calculator', 'photo-backup-calculator'],
    keywords: ['sd card photo capacity', 'raw file size calculation', 'megapixel memory footprint'],
    calculate: (inputs) => {
      const mp = Number(inputs.megapixels || 24);
      const card = Number(inputs.cardSize || 64);
      const isRaw = inputs.fileFormat === 'raw';

      const fileWeightMb = isRaw ? (mp * 3) : (mp * 0.4);
      const cardMb = card * 1024;
      const count = cardMb / fileWeightMb;

      return {
        results: [
          { label: 'Expected Max Photos count', value: Math.floor(count).toLocaleString(), isPrimary: true },
          { label: 'Est Size per individual File', value: `${fileWeightMb.toFixed(1)} MB` }
        ],
        chartData: [
          { name: 'Allocated Photos', value: Math.floor(count) }
        ]
      };
    }
  },
  {
    id: 'image-aspect-ratio',
    name: 'Image Aspect Ratio Calculator',
    slug: 'image-aspect-ratio-calculator',
    category: 'photography',
    description: 'Calculate pro-rata image dimensions to preserve design aspect ratios.',
    seoTitle: 'Image Aspect Ratio Pro-Rata Dimension Calculator',
    seoDescription: 'Find pro-rata image dimensions to preserve your design aspect ratios.',
    inputs: [
      { id: 'srcWidth', label: 'Original Width (Pixels)', type: 'number', defaultValue: 1920 },
      { id: 'srcHeight', label: 'Original Height (Pixels)', type: 'number', defaultValue: 1080 },
      { id: 'targetWidth', label: 'Desired Target Width (Pixels)', type: 'number', defaultValue: 800 }
    ],
    formula: 'Target Height = Target Width * (Original Height / Original Width)',
    explanation: 'Calculating pro-rata coordinates is essential to prevent squishing or skewing images across different display screens.',
    example: 'A standard 1920x1080 image scaled down to a target width of 800 pixels maintains a height of 450 pixels to preserve a 16:9 aspect ratio.',
    faq: [{ question: 'What is the Golden Ratio in design?', answer: 'A 1.618 aspect ratio commonly used in layout design to create visually and balanced compositions.' }],
    relatedSlugs: ['print-resolution-calculator'],
    keywords: ['image dimension scaling', 'aspect ratio constraint', 'retina pixel matching'],
    calculate: (inputs) => {
      const w1 = Number(inputs.srcWidth || 1920);
      const h1 = Number(inputs.srcHeight || 1080);
      const w2 = Number(inputs.targetWidth || 800);

      const ratio = w1 > 0 ? h1 / w1 : 0;
      const h2 = w2 * ratio;

      // Find greatest common divisor to represent ratio nicely
      const getGcd = (a: number, b: number): number => {
        return b === 0 ? a : getGcd(b, a % b);
      };
      const divisor = getGcd(w1, h1);
      const ratioRepr = divisor > 0 ? `${w1 / divisor}:${h1 / divisor}` : 'N/A';

      return {
        results: [
          { label: 'Required Target Height', value: `${Math.round(h2)} Pixels`, isPrimary: true },
          { label: 'Simplified Aspect Ratio', value: ratioRepr }
        ]
      };
    }
  },
  {
    id: 'print-resolution',
    name: 'Print Resolution Calculator',
    slug: 'print-resolution-calculator',
    category: 'photography',
    description: 'Calculate printable physical sizes based on canvas pixel bounds and printer target DPI/PPI.',
    seoTitle: 'Print Resolution & Physical PPI Dimension Calculator',
    seoDescription: 'Find printable physical sizes based on pixel dimensions and printer target PPI/DPI.',
    inputs: [
      { id: 'widthPixels', label: 'Horizontal Canvas Width (Pixels)', type: 'number', defaultValue: 3000 },
      { id: 'heightPixels', label: 'Vertical Canvas Height (Pixels)', type: 'number', defaultValue: 2000 },
      { id: 'targetDpi', label: 'Printer Output Density (DPI / PPI)', type: 'number', defaultValue: 300 }
    ],
    formula: 'Print Width (Inches) = Width Pixels / DPI\nPrint Height (Inches) = Height Pixels / DPI',
    explanation: 'High-density fine-art prints require a default resolution of 300 DPI to avoid visible pixelation.',
    example: 'A 3000x2000 pixel image printed at a standard 300 DPI yields a sharp, high-quality 10x6.6-inch canvas.',
    faq: [{ question: 'What is PPI versus DPI?', answer: 'PPI measures digital pixels per inch on displays, while DPI measures physical ink dots printed per inch.' }],
    relatedSlugs: ['image-aspect-ratio-calculator'],
    keywords: ['magazine resolution density ppi', 'fine art printing inches', 'canvas print size limit'],
    calculate: (inputs) => {
      const w = Number(inputs.widthPixels || 3000);
      const h = Number(inputs.heightPixels || 2000);
      const dpi = Math.max(10, Number(inputs.targetDpi || 300));

      const inW = w / dpi;
      const inH = h / dpi;

      return {
        results: [
          { label: 'Printable Width size', value: `${inW.toFixed(1)} Inches`, isPrimary: true },
          { label: 'Printable Height size', value: `${inH.toFixed(1)} Inches` },
          { label: 'Total image scale megapixels', value: `${((w * h) / 1_000_000).toFixed(1)} MP` }
        ]
      };
    }
  },
  {
    id: 'camera-lens',
    name: 'Camera Lens Calculator',
    slug: 'camera-lens-calculator',
    category: 'photography',
    description: 'Calculate equivalent lens focal lengths by balancing camera crop factors against sensor standards.',
    seoTitle: 'Lens Focal Length Crop Factor Comparison Calculator',
    seoDescription: 'Calculate 35mm equivalent focal lengths based on camera sensor sizes and crop factors.',
    inputs: [
      { id: 'focal', label: 'Physical Lens Focal Length (mm)', type: 'number', defaultValue: 50 },
      { id: 'sensorSize', label: 'Camera Sensor Type (Crop Factor)', type: 'select', defaultValue: 'aps_c', options: [
        { label: 'APS-C (1.5x Crop)', value: 'aps_c' },
        { label: 'Micro Four Thirds (2.0x Crop)', value: 'mft' },
        { label: 'Medium Format (0.79x Crop)', value: 'medium' }
      ]}
    ],
    formula: 'Equivalent Focal Length = Physical Focal Length * Crop Factor',
    explanation: 'Using lenses on cropped sensors narrows your field of view, multiplying the physical focal length to match 35mm film standards.',
    example: 'A standard 50mm lens mounted on an APS-C sensor (1.5x crop) delivers an equivalent telephoto field of view of 75mm.',
    faq: [{ question: 'What is full-frame?', answer: 'A digital sensor matching traditional 35mm film dimensions with a baseline 1.0x crop factor.' }],
    relatedSlugs: ['print-resolution-calculator', 'image-aspect-ratio-calculator'],
    keywords: ['lens crop factor converter', '35mm focal equivalent size', 'micro four thirds multiplier'],
    calculate: (inputs) => {
      const focal = Number(inputs.focal || 50);
      const sensor = inputs.sensorSize || 'aps_c';

      let factor = 1.0;
      if (sensor === 'aps_c') factor = 1.5;
      else if (sensor === 'mft') factor = 2.0;
      else if (sensor === 'medium') factor = 0.79;

      const equiv = focal * factor;

      return {
        results: [
          { label: '35mm Equivalent Focal Length', value: `${equiv.toFixed(1)} mm`, isPrimary: true },
          { label: 'Combined Lens View Profile', value: equiv >= 70 ? 'Telephoto Zoom' : equiv >= 35 ? 'Standard Portrait' : 'Wide Angle field' }
        ]
      };
    }
  },
  {
    id: 'photo-backup',
    name: 'Photo Backup Calculator',
    slug: 'photo-backup-calculator',
    category: 'photography',
    description: 'Forecast the time needed to backup and sync your photo library to target cloud hosting directories.',
    seoTitle: 'Camera Folder Network Sync Time Solver',
    seoDescription: 'Project the time required to sync photo folders to cloud servers based on network bandwidth limits.',
    inputs: [
      { id: 'folderSize', label: 'Folder Library Sizing (GB)', type: 'number', defaultValue: 32 },
      { id: 'uploadSpeed', label: 'Network Upload Speed (Mbps)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Total Bits = Size in Gigabytes * 8 * 10^9\nSync Seconds = Total Bits / Speed in Megabits per second',
    explanation: 'Upload times can be surprisingly slow, as residential broadband connections typically restrict upstream bandwidth far below download speeds.',
    example: 'Syncing a 32 GB photo folder over a 10 Mbps home upstream connection requires approximately 7.2 hours to complete.',
    faq: [{ question: 'Why are uploads slower?', answer: 'Asymmetrical broadband routes prioritize downstream speeds for media consumption over upstream uploads.' }],
    relatedSlugs: ['photo-storage-calculator', 'image-compression-calculator'],
    keywords: ['photo cloud sync hours', 'broadband upload duration calculator', 'camera library network limits'],
    calculate: (inputs) => {
      const size = Number(inputs.folderSize || 32);
      const speed = Number(inputs.uploadSpeed || 10);

      const sizeBits = size * 8 * 1024 * 1024 * 1024;
      const speedBitsSec = speed * 1000 * 1000;

      const seconds = speedBitsSec > 0 ? sizeBits / speedBitsSec : 0;
      const hours = seconds / 3600;

      return {
        results: [
          { label: 'Predicted Backup Sync Time', value: `${hours.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Average Sync bytes limit', value: `${(speed / 8).toFixed(1)} MB / Sec` }
        ],
        chartData: [
          { name: 'Sync Hours Needed', value: Math.round(hours) }
        ]
      };
    }
  }
];
