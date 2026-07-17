import { Calculator } from '../types';

export const V16_TECH_HOME_CALCULATORS: Calculator[] = [
  // NETWORKING ADVANCED (56-60)
  {
    id: 'network-planning',
    name: 'Network Planning & Subnet Calculator',
    slug: 'network-planning',
    category: 'tech',
    description: 'Calculate classless IPv4 subnets, CIDR prefix sizes, usable host ranges, and broadcast bounds.',
    formula: 'Subnets Count = 2^(New Prefix - Base Prefix); Hosts = 2^(32 - Prefix) - 2',
    explanation: 'Splits networking IP ranges using CIDR masks to reveal network IDs and host capacity boundaries.',
    example: 'Dividing a Class C block under CIDR /26 creates 4 subnets with exactly 62 usable IP hosts per range.',
    inputs: [
      { id: 'ipAddress', label: 'Network Starting IP', type: 'text', defaultValue: '192.168.1.0' },
      { id: 'cidrPrefix', label: 'CIDR Prefix Size', type: 'select', defaultValue: '24', options: [
        { label: '/24 (256 hosts - standard LAN)', value: '24' },
        { label: '/26 (64 hosts - department subnet)', value: '26' },
        { label: '/28 (16 hosts - secure server rack)', value: '28' },
        { label: '/30 (4 hosts - point-to-point link)', value: '30' }
      ]}
    ],
    faq: [
      { question: 'Why subtract 2 hosts from the total host capacity?', answer: 'The absolute lowest address is reserved for the Subnet Network ID, and the absolute highest address serves as the Broadcast target.' }
    ],
    relatedSlugs: ['wifi-range', 'network-capacity'],
    seoTitle: 'IPv4 CIDR Network Subnet Planner',
    seoDescription: 'Calculate network subnets, usable host IPs, and netmasks to split corporate business intranets.',
    calculate: (inputs) => {
      const p = Number(inputs.cidrPrefix || 24);
      const startingIp = String(inputs.ipAddress || '192.168.1.0');
      
      const totalHosts = Math.pow(2, 32 - p);
      const usableHosts = Math.max(0, totalHosts - 2);
      
      return {
        results: [
          { label: 'Usable IP Hosts per Subnet', value: usableHosts, unit: 'hosts', isPrimary: true },
          { label: 'Subnet Netmask', value: p === 24 ? '255.255.255.0' : p === 26 ? '255.255.255.192' : p === 28 ? '255.255.255.240' : '255.255.255.252', unit: '' },
          { label: 'Network Class Category', value: startingIp.startsWith('10.') ? 'Class A (Private)' : 'Class C (Private)', unit: '' }
        ]
      };
    }
  },
  {
    id: 'wifi-range',
    name: 'WiFi Range & Path Loss Calculator',
    slug: 'wifi-range',
    category: 'tech',
    description: 'Calculate physical wireless signal decay (Path Loss) and maximum predicted antenna ranges.',
    formula: 'FSPL (dB) = 20 log10(d) + 20 log10(f) + 92.44 - TxGain - RxGain',
    explanation: 'Uses Friis Free Space Path Loss algorithms to verify decibel (dBm) attenuation points at specified radial distances.',
    example: 'A standard 2.4 GHz router radiating at 20 dBm has a predicted path loss of ~80 dB at 100 meters.',
    inputs: [
      { id: 'frequency', label: 'WiFi Band Frequency', type: 'select', defaultValue: '2.4', options: [
        { label: '2.4 GHz (High Range, more penetration)', value: '2.4' },
        { label: '5.0 GHz (High speed, short range)', value: '5.0' }
      ]},
      { id: 'distance', label: 'Radial Path Distance', type: 'number', defaultValue: 50, min: 1, unit: 'meters' },
      { id: 'txPower', label: 'Router Transmitter Power (Tx)', type: 'number', defaultValue: 20, min: 1, max: 30, unit: 'dBm' }
    ],
    faq: [
      { question: 'Why does 5 GHz have less range than 2.4 GHz?', answer: 'Higher radio frequencies undergo higher atmospheric absorption and scatter far more when passing through physical obstacles like drywall and concrete.' }
    ],
    relatedSlugs: ['network-planning', 'network-capacity'],
    seoTitle: 'WiFi Signal attenuation & Link Path Loss Calculator',
    seoDescription: 'Benchmark open-air wireless signal attenuation in decibels over custom path distances.',
    calculate: (inputs) => {
      const f = Number(inputs.frequency || 2.4);
      const d = Number(inputs.distance || 30);
      const tx = Number(inputs.txPower || 20);
      
      // Free Space Path Loss calculation
      // FSPL (dB) = 20*log10(d in km) + 20*log10(f in MHz) + 32.44
      const dKm = d / 1000;
      const fMhz = f * 1000;
      const pathLoss = (20 * Math.log10(dKm)) + (20 * Math.log10(fMhz)) + 32.44;
      
      // Received signal power estimate (assuming 2 dBi antenna gains)
      const rxSignal = tx + 2 + 2 - pathLoss;
      
      return {
        results: [
          { label: 'Signal Path Loss Decay', value: Number(pathLoss.toFixed(1)), unit: 'dB', isPrimary: true },
          { label: 'Estimated Received Strength', value: Number(rxSignal.toFixed(1)), unit: 'dBm' },
          { label: 'WiFi Link Quality rating', value: rxSignal > -70 ? 'Excellent Connection' : rxSignal > -85 ? 'Weak Connection' : 'Disconnected (Too Far)', unit: '' }
        ]
      };
    }
  },
  {
    id: 'network-capacity',
    name: 'Network Capacity Planning Calculator',
    slug: 'network-capacity',
    category: 'tech',
    description: 'Calculate required internet backhaul bandwidth for complex corporate office client loads.',
    formula: 'Required Backhaul = Concurrent Clients * Throughput per Client * Concurrency Factor',
    explanation: 'Models offices, scaling aggregate optical fiber lines to prevent transaction routing blockages during peaks.',
    example: 'An office housing 150 concurrent users averaging 5 Mbps active video-conferencing needs clean 750 Mbps of backhaul bandwidth.',
    inputs: [
      { id: 'clients', label: 'Active Concurrent LAN Clients', type: 'number', defaultValue: 150, min: 1, unit: 'devices' },
      { id: 'perClientMbps', label: 'Guaranteed Rate per Client', type: 'number', defaultValue: 5, min: 0.1, step: 0.5, unit: 'Mbps' },
      { id: 'concurrency', label: 'Network Overcommit Factor', type: 'range', defaultValue: 70, min: 10, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What is network overcommit?', answer: 'The assumption that not all clients draw peak bandwidth simultaneously, allowing engineers to size pipes below peak additions.' }
    ],
    relatedSlugs: ['network-planning', 'data-usage'],
    seoTitle: 'Office LAN Broadband Backhaul Sizing Calculator',
    seoDescription: 'Dimension required office internet bandwidth to support massive business video and device loads.',
    calculate: (inputs) => {
      const clients = Number(inputs.clients || 50);
      const mbps = Number(inputs.perClientMbps || 5);
      const concurrency = (Number(inputs.concurrency || 80)) / 100;
      
      const totalPeakDemandVal = clients * mbps;
      const realisticDesignMbps = totalPeakDemandVal * concurrency;
      
      return {
        results: [
          { label: 'Required Backhaul Bandwidth', value: Math.round(realisticDesignMbps), unit: 'Mbps', isPrimary: true },
          { label: 'Absolute Peak Demand Raw', value: totalPeakDemandVal, unit: 'Mbps' },
          { label: 'Suggested Fiber Connection Spec', value: realisticDesignMbps > 1000 ? '10 Gbps Fiber' : realisticDesignMbps > 300 ? '1 Gbps Fiber' : '300 Mbps Coax', unit: '' }
        ]
      };
    }
  },
  {
    id: 'data-usage',
    name: 'Data Usage Calculator',
    slug: 'data-usage',
    category: 'tech',
    description: 'Calculate monthly GB bandwidth data consumed from streaming hours and download schedules.',
    formula: 'Monthly GB = Duration Hours * GB per Hour * 30 days',
    explanation: 'Compiles standard streaming video profiles, converting them to absolute gigabyte storage allocations.',
    example: 'Streaming UHD video for 3 hours daily at 7 GB/hour consumes exactly 630 GB of monthly broadband caps.',
    inputs: [
      { id: 'streamingHours', label: 'Daily Streaming Duration', type: 'number', defaultValue: 3, min: 0.1, max: 24, step: 0.1, unit: 'hrs/day' },
      { id: 'quality', label: 'Media Stream Quality', type: 'select', defaultValue: 'hd', options: [
        { label: 'SD Standard Definition (0.7 GB/hr)', value: 'sd' },
        { label: 'HD High Definition (3.0 GB/hr)', value: 'hd' },
        { label: 'UHD 4K Definition (7.0 GB/hr)', value: 'uhd' }
      ]}
    ],
    faq: [
      { question: 'Do uploads count toward monthly internet caps?', answer: 'Yes. Most internet operators sum both inbound downloads and outbound streams toward your hard monthly usage data ceilings.' }
    ],
    relatedSlugs: ['network-capacity', 'internet-cost'],
    seoTitle: 'Monthly Streaming Data Usage Bandwidth Calculator',
    seoDescription: 'Calculate estimated monthly bandwidth storage volumes based on daily streaming habits.',
    calculate: (inputs) => {
      const hrs = Number(inputs.streamingHours || 2);
      const qual = String(inputs.quality || 'hd');
      
      let gbPerHr = 3.0;
      if (qual === 'sd') gbPerHr = 0.7;
      else if (qual === 'uhd') gbPerHr = 7.0;
      
      const dailyGb = hrs * gbPerHr;
      const monthlyGb = dailyGb * 30;
      
      return {
        results: [
          { label: 'Estimated Monthly Bandwidth', value: Number(monthlyGb.toFixed(1)), unit: 'GB/mth', isPrimary: true },
          { label: 'Daily Data Footprint', value: Number(dailyGb.toFixed(1)), unit: 'GB/day' },
          { label: 'Percent of 1TB Data Cap', value: Number(((monthlyGb / 1000) * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'internet-cost',
    name: 'Internet Cost Calculator',
    slug: 'internet-cost',
    category: 'tech',
    description: 'Compare broadband fiber bills and data limit overage rates to determine the cheapest connection.',
    formula: 'Total = Flat rate base cost + Max(0, Usage - Allowance) * Overage rate',
    explanation: 'Collates base bills, data allowance buffers, and premium exceeded caps to protect home accounts.',
    example: 'A $50 plan housing a 500GB limit with $10 per 50GB overages costs $70 if you consume 580GB.',
    inputs: [
      { id: 'baseBill', label: 'Plan Monthly Flat Base Rate', type: 'number', defaultValue: 50, min: 10, unit: '$' },
      { id: 'dataCap', label: 'Included Data Cap Allowance', type: 'number', defaultValue: 500, min: 50, unit: 'GB' },
      { id: 'actualConsumed', label: 'Your Predicted Monthly Data', type: 'number', defaultValue: 580, min: 10, unit: 'GB' },
      { id: 'overageCost', label: 'Overage Cost per 50GB Block', type: 'number', defaultValue: 10, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'Are unlimited data plans cheaper?', answer: 'If your monthly data exceeds allowances by over 200 GB, selecting a $15-$25 "unlimited data" addon is typically much cheaper than individual overage bills.' }
    ],
    relatedSlugs: ['data-usage', 'network-capacity'],
    seoTitle: 'Broadband Plan Overage & Cost Comparison Calculator',
    seoDescription: 'Find cheaper internet service rates by integrating data caps and overage surcharge costs.',
    calculate: (inputs) => {
      const base = Number(inputs.baseBill || 50);
      const cap = Number(inputs.dataCap || 500);
      const actual = Number(inputs.actualConsumed || 500);
      const overPrice = Number(inputs.overageCost || 10);
      
      const excess = Math.max(0, actual - cap);
      // Overage billed in 50GB blocks
      const blocksUsed = Math.ceil(excess / 50);
      const surcharge = blocksUsed * overPrice;
      const totalMonthlyBill = base + surcharge;
      
      return {
        results: [
          { label: 'Projected Monthly Bill', value: totalMonthlyBill, unit: '$', isPrimary: true },
          { label: 'Exceeded Data Volume', value: excess, unit: 'GB' },
          { label: 'Surcharge Bill cost share', value: surcharge, unit: '$' }
        ]
      };
    }
  },

  // CONTENT CREATOR ADVANCED (61-65)
  {
    id: 'creator-revenue',
    name: 'Creator Revenue Projection',
    slug: 'creator-revenue',
    category: 'creator-tools',
    description: 'Project dynamic creator channels income streams from combined AdSense CPM, brand sponsors, and affiliate sales.',
    formula: 'Revenue = (Views / 1000) * CPM + Sponsor Fees + Views * Affiliate Conv % * Comm',
    explanation: 'Aggregates multiple platform commercialization funnels to present a unified creator revenue forecast.',
    example: 'Generating 500,000 monthly video views with a $6.00 CPM, 1 brand deal at $2,000, and 0.5% affiliate sales yielding $15 commissions yields $7,375 gross income.',
    inputs: [
      { id: 'monthlyViews', label: 'Monthly Video / Blog Page Views', type: 'number', defaultValue: 500000, min: 1000, step: 10000, unit: 'views' },
      { id: 'cpmRate', label: 'Ad Revenue CPM (per 1,000 views)', type: 'number', defaultValue: 6.0, min: 0.1, max: 50, step: 0.1, unit: '$' },
      { id: 'sponsors', label: 'Flat Sponsor Integration Deals', type: 'number', defaultValue: 2000, min: 0, unit: '$' },
      { id: 'affiliateCommission', label: 'Average Affiliate commission value', type: 'number', defaultValue: 15, min: 1, unit: '$' },
      { id: 'conversionPct', label: 'Audience Affiliate Purchase rate', type: 'number', defaultValue: 0.5, min: 0, max: 10, step: 0.05, unit: '%' }
    ],
    faq: [
      { question: 'What is CPM?', answer: 'Cost Per Mille. The advertiser-rate paid to platforms or publishers for every 1000 cumulative display views of an advertisement.' }
    ],
    relatedSlugs: ['content-roi', 'creator-sponsorship-value'],
    seoTitle: 'Multi-Stream Creator Channels Revenue Calculator',
    seoDescription: 'Forecast monthly income levels by compounding video AdSense CPM, flat sponsorships, and product affiliates.',
    calculate: (inputs) => {
      const views = Number(inputs.monthlyViews || 100000);
      const cpm = Number(inputs.cpmRate || 5.0);
      const flatSponsor = Number(inputs.sponsors || 0);
      const commissionVal = Number(inputs.affiliateCommission || 10);
      const conv = (Number(inputs.conversionPct || 0.1)) / 100;
      
      const adRevenue = (views / 1000) * cpm;
      const affiliateConversions = views * conv;
      const affiliateRevenue = affiliateConversions * commissionVal;
      
      const totalIncome = adRevenue + flatSponsor + affiliateRevenue;
      
      return {
        results: [
          { label: 'Estimated Monthly Earnings', value: Math.round(totalIncome), unit: '$', isPrimary: true },
          { label: 'Pure AdSense Revenue Share', value: Math.round(adRevenue), unit: '$' },
          { label: 'Affiliate Commissions Earned', value: Math.round(affiliateRevenue), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'content-roi',
    name: 'Content ROI Calculator',
    slug: 'content-roi',
    category: 'creator-tools',
    description: 'Compare content creation gear costs and labor hours against earned video revenue.',
    formula: 'ROI% = (Net Channel Income / Equipment Invested) * 100',
    explanation: 'Weights software seats, edit station setups, and mic arrays against campaign yields to calculate your true payback horizon.',
    example: 'An investment of $3,000 on camera gears with monthly channel payouts of $500/mo pays back entire setup costs in 6 months.',
    inputs: [
      { id: 'gearInvestment', label: 'Gear & Software Setup Capital', type: 'number', defaultValue: 3000, min: 1, unit: '$' },
      { id: 'laborHours', label: 'Weekly Production/Editing Hours', type: 'number', defaultValue: 15, min: 1, unit: 'hrs/wk' },
      { id: 'laborValuation', label: 'Your Implied Hourly Resource Cost', type: 'number', defaultValue: 35, min: 1, unit: '$/hr' },
      { id: 'campaignYield', label: 'Average Monthly Content Income', type: 'number', defaultValue: 1200, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'How can content creators measure labor costs?', answer: 'Price your editing time at your professional freelance rate. If you would charge $40/hr to select cut footage, account for this resource burn.' }
    ],
    relatedSlugs: ['creator-revenue', 'creator-production-cost'],
    seoTitle: 'Equipment Amortization & Content ROI Calculator',
    seoDescription: 'Benchmark equipment amortizations and calculate net channel ROIs based on production lab labor allocations.',
    calculate: (inputs) => {
      const gear = Number(inputs.gearInvestment || 1000);
      const hours = Number(inputs.laborHours || 10);
      const value = Number(inputs.laborValuation || 25);
      const yieldAmt = Number(inputs.campaignYield || 500);
      
      const monLaborCost = hours * 4.33 * value;
      const netMonthlyTrueYield = yieldAmt - monLaborCost;
      const paybackMths = netMonthlyTrueYield > 0 ? (gear / netMonthlyTrueYield) : 999;
      
      return {
        results: [
          { label: 'Net Monthly Income (With Labor)', value: Math.round(netMonthlyTrueYield), unit: '$', isPrimary: true },
          { label: 'Estimated Gear Payback Period', value: paybackMths > 100 ? 'Infinite (Deficit)' : `${paybackMths.toFixed(1)} months`, unit: '' },
          { label: 'Monthly Labor Value Cost', value: Math.round(monLaborCost), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'audience-growth-projection',
    name: 'Audience Growth Projection',
    slug: 'audience-growth-projection',
    category: 'creator-tools',
    description: 'Forecast compounding subscriber and follower fanbases over a 12-month calendar.',
    formula: 'End Subscribers = Start * (1 + Monthly Growth Rate%)^12',
    explanation: 'Models custom brand viral gains compounded monthly, net of community unsubscribes and user drop-offs.',
    example: 'Starting with 10,000 sub channels expanding at 8% monthly compiles over ~25,000 active fans in 1 year.',
    inputs: [
      { id: 'startSubs', label: 'Starting Followers/Subs Count', type: 'number', defaultValue: 10000, min: 10, unit: 'fans' },
      { id: 'growthMonth', label: 'Gross Monthly Growth Rate', type: 'number', defaultValue: 8, min: -10, max: 150, step: 0.1, unit: '%' },
      { id: 'churnSubscriber', label: 'Monthly Community Attrition', type: 'number', defaultValue: 1.5, min: 0, max: 30, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'Why track subscriber attrition rates?', answer: 'As audiences expand, a stable 2% churn represents an escalating absolute loss of users. Maintaining active user experience limits churn spikes.' }
    ],
    relatedSlugs: ['creator-revenue', 'creator-sponsorship-value'],
    seoTitle: 'Compounding Channel Follower Growth Calculator',
    seoDescription: 'Forecast monthly compounding brand fans and follower numbers net of seasonal attrition drops.',
    calculate: (inputs) => {
      const start = Number(inputs.startSubs || 1000);
      const growth = Number(inputs.growthMonth || 5) / 100;
      const churn = Number(inputs.churnSubscriber || 1) / 100;
      
      const netMonthlyRate = growth - churn;
      const projectedSubs = start * Math.pow(1 + netMonthlyRate, 12);
      
      return {
        results: [
          { label: 'Followers count at Year End', value: Math.round(projectedSubs).toLocaleString(), unit: 'subscribers', isPrimary: true },
          { label: 'Net Monthly Compounding Rate', value: Number((netMonthlyRate * 100).toFixed(1)), unit: '%' },
          { label: 'Annual Net Fan Increase', value: Math.round(projectedSubs - start).toLocaleString(), unit: 'subs' }
        ]
      };
    }
  },
  {
    id: 'creator-sponsorship-value',
    name: 'Sponsorship Value Calculator',
    slug: 'creator-sponsorship-value',
    category: 'creator-tools',
    description: 'Determine competitive brand integration flat pricing based on actual average video impressions and niche premiums.',
    formula: 'Flat Rate = (Impressions / 1000) * Flat CPV * Niche Multiplier',
    explanation: 'Multiplies predictable view tallies by industry CPV classes to supply solid baseline corporate campaign quotes.',
    example: 'Vlogging with 25,000 average views at a standard $25 CPV inside a finance niche (1.5x Premium) supports a solid $937 flat campaign rate.',
    inputs: [
      { id: 'avgViews', label: 'Average Video/Post Impressions', type: 'number', defaultValue: 25000, min: 100, step: 1000, unit: 'impressions' },
      { id: 'cpvBasis', label: 'Reference Platform CPV ($/1000 views)', type: 'number', defaultValue: 25, min: 1, max: 150, unit: '$/K' },
      { id: 'nichePremium', label: 'Audience Niche Multiplier', type: 'select', defaultValue: 'finance', options: [
        { label: 'Personal Finance & Tech SasS (1.5x Premium)', value: 'finance' },
        { label: 'Standard Lifestyle & Vlogs (1.0x Baseline)', value: 'lifestyle' },
        { label: 'General Gaming & Memes (0.7x Budget)', value: 'gaming' }
      ]}
    ],
    faq: [
      { question: 'What is CPV in sponsorships?', answer: 'Cost Per View. Refers to the flat rate brand marketers accept to pay content channels per actual viewing client.' }
    ],
    relatedSlugs: ['creator-revenue', 'content-roi'],
    seoTitle: 'Brand Video Sponsorship Valuation Calculator',
    seoDescription: 'Obtain balanced, data-justified flat brand rate quotes using actual average post impressions.',
    calculate: (inputs) => {
      const views = Number(inputs.avgViews || 10000);
      const cpv = Number(inputs.cpvBasis || 20);
      const niche = String(inputs.nichePremium || 'lifestyle');
      
      let mult = 1.0;
      if (niche === 'finance') mult = 1.5;
      else if (niche === 'gaming') mult = 0.7;
      
      const calculatedQuote = (views / 1000) * cpv * mult;
      
      return {
        results: [
          { label: 'Recommended Flat rate Campaign Quote', value: Math.round(calculatedQuote), unit: '$', isPrimary: true },
          { label: 'Sponsorship CPV Rate Equivalent', value: Number((cpv * mult).toFixed(2)), unit: '$/K views' }
        ]
      };
    }
  },
  {
    id: 'creator-production-cost',
    name: 'Content Production Cost Calculator',
    slug: 'creator-production-cost',
    category: 'creator-tools',
    description: 'Calculate average production costs per single upload item, aggregating flat labor and gear amortizations.',
    formula: 'Cost per Upload = (Annual Gear Depreciation + Software seats) / Yearly Uploads + (Prep Hours + Edit Hours) * Labor Rate',
    explanation: 'Models amortized equipment cost shares combined with total labor hours dedicated to scripting and editing and publishing.',
    example: 'An educational video needing 8 hours of total prep/edit time priced at $30/hr, with $500 annual gear amortization over 52 videos, costs select ~$250/episode.',
    inputs: [
      { id: 'prepEditHours', label: 'Prep, Directing & Editing Hours', type: 'number', defaultValue: 8, min: 1, unit: 'hrs/episode' },
      { id: 'hourlyLaborRate', label: 'Your Desired Content Labor Rate', type: 'number', defaultValue: 30, min: 5, unit: '$/hr' },
      { id: 'annualDepreciation', label: 'Annual Equipment Assets Cost Share', type: 'number', defaultValue: 500, min: 0, unit: '$/year' },
      { id: 'uploadsPerYear', label: 'Expected Upload Deliveries per Year', type: 'number', defaultValue: 52, min: 1, unit: 'uploads/yr' }
    ],
    faq: [
      { question: 'Why amortize camera gear costs?', answer: 'Purchasing a $2,000 professional camera should not be charged entirely to your first single video. Spreading the asset’s value over its estimated lifespan (e.g. 3 years) yields realistic cost boundaries.' }
    ],
    relatedSlugs: ['content-roi', 'creator-revenue'],
    seoTitle: 'Amortized Episode Production Cost Calculator',
    seoDescription: 'Evaluate the true baseline operating and labor cost required to deliver a single professional video.',
    calculate: (inputs) => {
      const hrs = Number(inputs.prepEditHours || 6);
      const rate = Number(inputs.hourlyLaborRate || 25);
      const deprecationVal = Number(inputs.annualDepreciation || 400);
      const totalUploads = Number(inputs.uploadsPerYear || 50);
      
      const laborCostPerUpload = hrs * rate;
      const assetCostPerUpload = deprecationVal / (totalUploads || 1);
      const grandTotalCost = laborCostPerUpload + assetCostPerUpload;
      
      return {
        results: [
          { label: 'True Cost per single Upload', value: Math.round(grandTotalCost), unit: '$', isPrimary: true },
          { label: 'Episode direct labor allocation', value: laborCostPerUpload, unit: '$' },
          { label: 'Episode asset depreciation share', value: Number(assetCostPerUpload.toFixed(2)), unit: '$' }
        ]
      };
    }
  },

  // HOME ADVANCED (66-70)
  {
    id: 'home-budget-planner',
    name: 'Home Budget & Utilities Planner',
    slug: 'home-budget',
    category: 'home-tools',
    description: 'Structure comprehensive residential operating budgets combining mortgage, repairs, insurance, and utilities.',
    formula: 'Annual Operating = Mortgage * 12 + Insurance + Property Taxes + Maintenance Buffer (1% Home Value)',
    explanation: 'Collates mortgage structures alongside home maintenance safety allocations (standard 1% rate) to output comprehensive monthly costs.',
    example: 'For a $350,050 home with standard mortgage, insurance, and utilities, the total operating budget sits around $2,500/month.',
    inputs: [
      { id: 'monthlyMortgage', label: 'Monthly Mortgage (P&I)', type: 'number', defaultValue: 1500, min: 0, unit: '$' },
      { id: 'propertyTaxVal', label: 'Average Annual Property Taxes', type: 'number', defaultValue: 4000, min: 0, unit: '$' },
      { id: 'insuranceAnnual', label: 'Annual Homeownership Insurance', type: 'number', defaultValue: 1200, min: 0, unit: '$' },
      { id: 'homeMarketValue', label: 'Estimated Home Market Value', type: 'number', defaultValue: 350000, min: 0, unit: '$' },
      { id: 'utilitiesMonthly', label: 'Combined Utilities / Internet', type: 'number', defaultValue: 350, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is the standard 1% physical maintenance rule?', answer: 'It is highly advised to bank exactly 1% of your home’s total physical market cost annually to cover unpredictable repairs like HVAC servicing, sewer backups, or roof decay.' }
    ],
    relatedSlugs: ['renovation-roi', 'home-energy-savings'],
    seoTitle: 'All-Inclusive Home Operating Cost Budget Planner',
    seoDescription: 'Plan your complete home ownership budget by merging primary payments, heating utilities, and emergency repair reserves.',
    calculate: (inputs) => {
      const mortgage = Number(inputs.monthlyMortgage || 1200);
      const tax = (Number(inputs.propertyTaxVal || 3000)) / 12;
      const ins = (Number(inputs.insuranceAnnual || 1200)) / 12;
      const val = Number(inputs.homeMarketValue || 300000);
      const util = Number(inputs.utilitiesMonthly || 300);
      
      const mBuffer = (val * 0.01) / 12; // 1% annual maintenance allocated monthly
      const totalMonthlyCost = mortgage + tax + ins + util + mBuffer;
      const totalAnnualCost = totalMonthlyCost * 12;
      
      return {
        results: [
          { label: 'Comprehensive Monthly Budget', value: Math.round(totalMonthlyCost), unit: '$', isPrimary: true },
          { label: 'Yearly Home Operating Cost', value: Math.round(totalAnnualCost), unit: '$' },
          { label: 'Monthly Emergency Repair Reserve', value: Math.round(mBuffer), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'renovation-roi',
    name: 'Renovation ROI & Equity Calculator',
    slug: 'renovation-roi',
    category: 'home-tools',
    description: 'Calculate property value increases (Equity additions) and the ROI yield of home remodeling projects.',
    formula: 'ROI% = (Estimated Added Home Value / Actual Cost of Project) * 100',
    explanation: 'Weighs contractor remodel invoices against local property appraisal values to reveal estimated equity returns.',
    example: 'A kitchen remodel cost of $25,000 that boosts home appraisal indicators by $18,000 recaptures 72% of investments in equity.',
    inputs: [
      { id: 'materialLaborCost', label: 'Renovation Materials & Labor Cost', type: 'number', defaultValue: 25000, min: 100, unit: '$' },
      { id: 'remodelType', label: 'Remodeling Project Sector', type: 'select', defaultValue: 'kitchen', options: [
        { label: 'Minor Kitchen Upgrade (Avg 72% return)', value: 'kitchen' },
        { label: 'Bathroom Remodel (Avg 65% return)', value: 'bathroom' },
        { label: 'Composite Deck Addition (Avg 60% return)', value: 'deck' },
        { label: 'Full Premium Attic Bedroom (Avg 55% return)', value: 'attic' }
      ]}
    ],
    faq: [
      { question: 'Why does no standard home remodel yield 100% ROI?', answer: 'Remodeling projects personalize your home. Direct buyers prioritize general square footages over localized customized features.' }
    ],
    relatedSlugs: ['home-budget-planner', 'home-improvement-cost'],
    seoTitle: 'Remodeling ROI & Added Home Equity Calculator',
    seoDescription: 'Estimate target equity valuation jumps when undergoing home improvement projects.',
    calculate: (inputs) => {
      const cost = Number(inputs.materialLaborCost || 10000);
      const mode = String(inputs.remodelType || 'kitchen');
      
      let rate = 0.65;
      if (mode === 'kitchen') rate = 0.72;
      else if (mode === 'deck') rate = 0.60;
      else if (mode === 'attic') rate = 0.55;
      
      const equityAdded = cost * rate;
      const loss = cost - equityAdded;
      
      return {
        results: [
          { label: 'Estimated Equity Value Added', value: Math.round(equityAdded), unit: '$', isPrimary: true },
          { label: 'Estimated Remodel ROI Yield', value: Math.round(rate * 100), unit: '%' },
          { label: 'Net Unrecovered personal Cost', value: Math.round(loss), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'home-energy-savings',
    name: 'Home Energy & LED Savings Calculator',
    slug: 'home-energy-savings',
    category: 'home-tools',
    description: 'Estimate utility cost reductions when upgrading fixtures to LEDs or installing smart thermostats.',
    formula: 'Annual Saved = [(Prev Watts - New Watts)/1000] * Hours * 365 * Rate',
    explanation: 'Models electricity loads, estimating the payback horizon of energy efficiency purchases.',
    example: 'Swapping 40 high-heat bulbs (60W) to LEDs (9W) running 5 hours daily saves ~$447 annually in utility bills.',
    inputs: [
      { id: 'bulbsCount', label: 'Number of Active Lighting Fixtures', type: 'number', defaultValue: 40, min: 1, unit: 'fixtures' },
      { id: 'prevWatts', label: 'Legacy Incandescent Watt Draw', type: 'number', defaultValue: 60, min: 5, unit: 'Watts' },
      { id: 'ledWatts', label: 'Upgraded Energy-Saving LED Draw', type: 'number', defaultValue: 9, min: 1, unit: 'Watts' },
      { id: 'dailyHours', label: 'Average Daily Running Duration', type: 'number', defaultValue: 5, min: 0.5, max: 24, step: 0.5, unit: 'hrs/day' },
      { id: 'powerRate', label: 'Electricity Cost Rate', type: 'number', defaultValue: 0.16, min: 0.01, max: 1.00, step: 0.01, unit: '$/kWh' }
    ],
    faq: [
      { question: 'Why are LEDs highly efficient?', answer: 'Unlike incandescent elements that waste 90% of current converting into ambient heat, LEDs convert raw electricity directly to light, drawing minimal energy.' }
    ],
    relatedSlugs: ['home-budget-planner', 'home-improvement-cost'],
    seoTitle: 'LED Upgrade Utility Payback & Energy Calculator',
    seoDescription: 'See exactly how much cash you save when swapping household lights to high-efficiency LEDs.',
    calculate: (inputs) => {
      const count = Number(inputs.bulbsCount || 10);
      const prevW = Number(inputs.prevWatts || 60);
      const ledW = Number(inputs.ledWatts || 9);
      const hrs = Number(inputs.dailyHours || 4);
      const rate = Number(inputs.powerRate || 0.15);
      
      const wattsSavedPerFixture = Math.max(0, prevW - ledW);
      const totalDailyWattsSaved = wattsSavedPerFixture * count * hrs;
      const dailyKwhSaved = totalDailyWattsSaved / 1000;
      const annualKwhSaved = dailyKwhSaved * 365;
      const annualCashSaved = annualKwhSaved * rate;
      
      return {
        results: [
          { label: 'Annual Utility Bills Saved', value: Number(annualCashSaved.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Annual Electricity Saved', value: Math.round(annualKwhSaved), unit: 'kWh' }
        ]
      };
    }
  },
  {
    id: 'home-improvement-cost',
    name: 'Home Improvement & Flooring Calculator',
    slug: 'home-improvement-cost',
    category: 'home-tools',
    description: 'Calculate square footage flooring laminates, trim tiles, or tile boxes required to cover room dimensions.',
    formula: 'Area = Length * Width; Dry Area = Area * (1 + Waste Factor); Boxes = Dry Area / Box Coverage',
    explanation: 'Takes wall or floor boundary dimensions, includes standard installation waste margins (10%), and outputs counts of materials required.',
    example: 'Floating flooring across a 15\' x 20\' master room requiring 10% safety waste mandates 330 sq ft of total planks.',
    inputs: [
      { id: 'roomLength', label: 'Room Length', type: 'number', defaultValue: 15, min: 1, unit: 'feet' },
      { id: 'roomWidth', label: 'Room Width', type: 'number', defaultValue: 20, min: 1, unit: 'feet' },
      { id: 'wasteFactorVal', label: 'Installation Waste Safety Buffer', type: 'number', defaultValue: 10, min: 0, max: 25, unit: '%' },
      { id: 'packCoverage', label: 'Flooring Box Coverage Rating', type: 'number', defaultValue: 21.5, min: 5, max: 100, step: 0.1, unit: 'sq ft/box' }
    ],
    faq: [
      { question: 'Why allocate a waste safety buffer?', answer: 'Cutting planks to match odd room dimensions and structural closets renders some planks unusable. A standard 10% buffer limits job-site delays.' }
    ],
    relatedSlugs: ['renovation-roi', 'home-budget-planner'],
    seoTitle: 'Tile and Wood Laminate Flooring Sizing Calculator',
    seoDescription: 'Accurately determine material square footages and box counts for household tile or wood remodeling projects.',
    calculate: (inputs) => {
      const len = Number(inputs.roomLength || 10);
      const wid = Number(inputs.roomWidth || 10);
      const waste = (Number(inputs.wasteFactorVal || 10)) / 100;
      const boxCap = Number(inputs.packCoverage || 20);
      
      const netArea = len * wid;
      const totalAreaNeeded = netArea * (1 + waste);
      const boxesNeeded = Math.ceil(totalAreaNeeded / boxCap);
      
      return {
        results: [
          { label: 'Total Material Area Sizing', value: Math.round(totalAreaNeeded), unit: 'sq ft', isPrimary: true },
          { label: 'Required Flooring Boxes', value: boxesNeeded, unit: 'boxes' },
          { label: 'Net Room Footprint Area', value: netArea, unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'maintenance-schedule',
    name: 'Home Maintenance & Budget Schedule',
    slug: 'maintenance-schedule',
    category: 'home-tools',
    description: 'Calculate average annual residential systems maintenance budgets based on equipment age.',
    formula: 'Cost Estimator = f(Age of Roof, HVAC, Water Heater)',
    explanation: 'Scores the aging spectrum of your home mechanical elements to schedule clean maintenance reserve needs.',
    example: 'A home carrying an 18-year old roof and an 11-year old furnace mandates aggressive emergency savings budgets of ~$300/mo.',
    inputs: [
      { id: 'roofAge', label: 'Age of Shingle Roof', type: 'number', defaultValue: 15, min: 0, max: 40, unit: 'years' },
      { id: 'hvacAge', label: 'Age of Furnace / AC Compressor', type: 'number', defaultValue: 8, min: 0, max: 25, unit: 'years' },
      { id: 'plumbingAge', label: 'Age of Main Water Heater', type: 'number', defaultValue: 6, min: 0, max: 20, unit: 'years' }
    ],
    faq: [
      { question: 'When do central HVAC compressors require replacement?', answer: 'Most residential condensing compressors operate reliably for 12 to 15 years before mechanical wear degrades efficiency.' }
    ],
    relatedSlugs: ['home-budget-planner', 'renovation-roi'],
    seoTitle: 'Residential Systems Maintenance Risk Budgeter',
    seoDescription: 'Forecast seasonal utility and structural maintenance reserve requirements based on appliance age logs.',
    calculate: (inputs) => {
      const roof = Number(inputs.roofAge || 5);
      const hvac = Number(inputs.hvacAge || 5);
      const heater = Number(inputs.plumbingAge || 5);
      
      let monthlyReserve = 100; // Baseline
      
      // Roof age alerts
      if (roof > 15) monthlyReserve += 120;
      else if (roof > 8) monthlyReserve += 50;
      
      // HVAC age alerts
      if (hvac > 10) monthlyReserve += 80;
      else if (hvac > 5) monthlyReserve += 30;
      
      // Water heater alerts
      if (heater > 8) monthlyReserve += 40;
      
      return {
        results: [
          { label: 'Advised Monthly Maintenance Reserve', value: monthlyReserve, unit: '$', isPrimary: true },
          { label: 'Systems Risk Classification', value: monthlyReserve > 200 ? 'High Replacement Risk' : monthlyReserve > 130 ? 'Moderate Alert' : 'Low Maintenance Risk', unit: '' }
        ]
      };
    }
  }
];
