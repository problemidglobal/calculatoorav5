import { Calculator } from '../types';

export const V19_PART1_CALCULATORS: Calculator[] = [
  // ====================================== SECURITY & PRIVACY ======================================
  {
    id: 'data-privacy-risk',
    name: 'Data Privacy Risk Calculator',
    slug: 'data-privacy-risk',
    category: 'security-privacy',
    description: 'Calculate your online data privacy risk rating based on active personal data exposures.',
    formula: 'Risk Score = (Data Share Index * 0.4) + (Service Exposure * 0.3) + (Security Auditing * 0.3)',
    explanation: 'Evaluates your privacy score across multiple data dimensions: social footprint size, public registry exposures, tracking cookie consent preferences, and multi-factor sign-on behaviors.',
    example: 'Sharing plain email, phone numbers, and home addresses across 15+ services with default tracking enabled yields high risk.',
    inputs: [
      { id: 'dataExposed', label: 'Types of Personal Data Shared Publicly', type: 'select', defaultValue: 3, options: [
        { label: 'Minimal (Basic Email/Username only)', value: 1 },
        { label: 'Moderate (Real Name, DoB, Phone Number)', value: 2 },
        { label: 'High (Home Address, Phone, Work details)', value: 3 },
        { label: 'Critical (SSN, Identity Docs, Financial Accounts)', value: 4 }
      ]},
      { id: 'servicesCount', label: 'Number of Active Online Accounts/Services', type: 'number', defaultValue: 35, min: 1, max: 500, step: 1 },
      { id: 'mfaPercent', label: 'Percentage of Accounts with MFA Enabled', type: 'number', defaultValue: 50, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'trackingConsent', label: 'Ad Tracking Consent Behavior', type: 'select', defaultValue: 'allowAll', options: [
        { label: 'Accept All Cookies / No VPN', value: 'allowAll' },
        { label: 'Sometimes Reject / Occasional VPN', value: 'partial' },
        { label: 'Strict Limits / Consistent Privacy Tools', value: 'strict' }
      ]}
    ],
    faq: [
      { question: 'What is a personal data share index?', answer: 'The share index measures the density of your Personally Identifiable Information (PII) distributed on public indices. The higher the breadth of PII shared, the higher your likelihood of spear-phishing or identity theft.' }
    ],
    relatedSlugs: ['privacy-exposure', 'account-safety', 'online-risk'],
    seoTitle: 'Online Data Privacy Risk Calculator | Evaluate PII Exposure Score',
    seoDescription: 'Benchmark your personal data threat vectors. Get an interactive privacy risk percentage and actionable advice to lock down accounts.',
    calculate: (inputs) => {
      const dataS = Number(inputs.dataExposed || 2) * 25; // max 100
      const count = Number(inputs.servicesCount || 20);
      const mfa = Number(inputs.mfaPercent || 0);
      const tracking = inputs.trackingConsent || 'allowAll';
      
      const exposureFactor = Math.min(100, (count / 100) * 100);
      const mfaMitigation = mfa; // 0 to 100
      
      let trackRisk = 90;
      if (tracking === 'partial') trackRisk = 50;
      if (tracking === 'strict') trackRisk = 15;

      const rawRisk = (dataS * 0.35) + (exposureFactor * 0.25) + ((100 - mfaMitigation) * 0.25) + (trackRisk * 0.15);
      const finalRisk = Math.min(100, Math.max(0, Math.round(rawRisk)));
      
      let rating = 'Low Risk';
      if (finalRisk > 75) rating = 'Critical Risk';
      else if (finalRisk > 50) rating = 'High Risk';
      else if (finalRisk > 25) rating = 'Moderate Risk';

      return {
        results: [
          { label: 'Privacy Risk Rating', value: rating, isPrimary: true },
          { label: 'Raw Risk Score', value: finalRisk, unit: '%', isPrimary: true },
          { label: 'PII Exposure Level', value: dataS, unit: '/100' },
          { label: 'Mitigated Risk (MFA Impact)', value: Math.round(mfaMitigation), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'privacy-exposure',
    name: 'Privacy Exposure Calculator',
    slug: 'privacy-exposure',
    category: 'security-privacy',
    description: 'Track aggregate data footprint volume and leakage indexes on major repositories.',
    formula: 'Exposure Volume = Account Factor * Device Risk * Data Sensitivity Scale',
    explanation: 'Scours user parameters to model overall digital footprint surface area. Gives a detailed rating of searchability indices.',
    example: 'An individual with 3 public emails, 4 devices logged in, and active social profiles might scale over 70% footprint exposure.',
    inputs: [
      { id: 'emails', label: 'Number of Active Personal Emails', type: 'number', defaultValue: 3, min: 1, max: 20 },
      { id: 'devices', label: 'Active Connected Devices (Phones, Laptops, IoT)', type: 'number', defaultValue: 5, min: 1, max: 50 },
      { id: 'socials', label: 'Active Social Media Profiles', type: 'number', defaultValue: 4, min: 0, max: 25 },
      { id: 'brokerOptOut', label: 'Data Broker Site Opt-Out Done?', type: 'select', defaultValue: 'no', options: [
        { label: 'Yes, fully opted out', value: 'yes' },
        { label: 'No, never opted out', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'How do data brokers obtain my information?', answer: 'Data brokers aggregate public court logs, commercial purchasing history, property registrations, and web-traffic profiles to resell highly specific individual files.' }
    ],
    relatedSlugs: ['data-privacy-risk', 'identity-protection'],
    seoTitle: 'Privacy Exposure Score Calculator | Digital Footprint Audit',
    seoDescription: 'Evaluate your surface level digital footprint across emails, active IoT smart devices, social handles, and data broker listings.',
    calculate: (inputs) => {
      const emailFactor = Math.min(100, Number(inputs.emails || 1) * 15);
      const deviceFactor = Math.min(100, Number(inputs.devices || 1) * 10);
      const socialFactor = Math.min(100, Number(inputs.socials || 0) * 12);
      const optOut = inputs.brokerOptOut === 'yes' ? 10 : 90;

      const avgExposure = (emailFactor * 0.3) + (deviceFactor * 0.25) + (socialFactor * 0.25) + (optOut * 0.2);
      const finalExposure = Math.min(100, Math.max(5, Math.round(avgExposure)));

      let textResult = 'Minimal Footprint';
      if (finalExposure > 70) textResult = 'Widespread Footprint';
      else if (finalExposure > 40) textResult = 'Moderate Footprint';

      return {
        results: [
          { label: 'Footprint Exposure Score', value: finalExposure, unit: '%', isPrimary: true },
          { label: 'Overall Exposure Status', value: textResult },
          { label: 'Est. Broker Listings Containing PII', value: inputs.brokerOptOut === 'yes' ? 'Low (< 5)' : 'High (40+)' }
        ]
      };
    }
  },
  {
    id: 'account-safety',
    name: 'Account Safety Calculator',
    slug: 'account-safety',
    category: 'security-privacy',
    description: 'Grade security of critical credentials like bank accounts, work platforms, and personal emails.',
    formula: 'Safety Score = Average(Weight * SecurityLevel)',
    explanation: 'Ranks safety index utilizing criteria such as password managers, biometric options, security keys, and MFA protocols.',
    example: 'Using a dedicated password manager and physical security keys can boost your safety level to 98/100.',
    inputs: [
      { id: 'manager', label: 'Password Manager Usage', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes, modern cloud/local manager', value: 'yes' },
        { label: 'No, write them down or memorize', value: 'no' },
        { label: 'Reuse 1-3 simple variations everywhere', value: 'reuse' }
      ]},
      { id: 'authMethod', label: 'Primary Two-Factor Method', type: 'select', defaultValue: 'sms', options: [
        { label: 'Hardware Key (YubiKey / Passkey)', value: 'hardware' },
        { label: 'Authenticator App (TOTP codes)', value: 'totp' },
        { label: 'SMS / Text Messages OTP', value: 'sms' },
        { label: 'None Enabled', value: 'none' }
      ]},
      { id: 'checkFrequence', label: 'HaveIBeenPwned Audit Routine', type: 'select', defaultValue: 'yearly', options: [
        { label: 'Monthly / Active Alerts', value: 'monthly' },
        { label: 'Yearly / Spot-checking', value: 'yearly' },
        { label: 'Never audited', value: 'never' }
      ]}
    ],
    faq: [
      { question: 'Why is SMS 2FA discouraged?', answer: 'SMS is vulnerable to SIM-swapping and cellular intercept hacks, whereas TOTP (like Google Authenticator) and Hardware Security Keys (FIDO2) run locally on offline structures.' }
    ],
    relatedSlugs: ['security-checklist', 'digital-safety-score'],
    seoTitle: 'Interactive Account Safety Calculator | Passkey & 2FA Audit',
    seoDescription: 'Verify credential integrity. Audit your multi-factor credentials, password patterns, and verification mechanisms.',
    calculate: (inputs) => {
      let managerPoints = 100;
      if (inputs.manager === 'no') managerPoints = 40;
      if (inputs.manager === 'reuse') managerPoints = 5;

      let authPoints = 100;
      if (inputs.authMethod === 'totp') authPoints = 85;
      if (inputs.authMethod === 'sms') authPoints = 50;
      if (inputs.authMethod === 'none') authPoints = 0;

      let auditPoints = 100;
      if (inputs.checkFrequence === 'yearly') auditPoints = 60;
      if (inputs.checkFrequence === 'never') auditPoints = 15;

      const finalSafety = Math.round((managerPoints * 0.4) + (authPoints * 0.45) + (auditPoints * 0.15));

      let safetyLabel = 'Critically Weak';
      if (finalSafety >= 90) safetyLabel = 'Excellent Secure Safeguard';
      else if (finalSafety >= 70) safetyLabel = 'Moderately Defended';
      else if (finalSafety >= 40) safetyLabel = 'Insufficient Security';

      return {
        results: [
          { label: 'Account Safety Score', value: finalSafety, unit: '/100', isPrimary: true },
          { label: 'Credential Security Status', value: safetyLabel, isPrimary: true },
          { label: 'MFA Safeguard Efficiency', value: inputs.authMethod === 'hardware' || inputs.authMethod === 'totp' ? 'Strong' : 'Fragile' }
        ]
      };
    }
  },
  {
    id: 'security-checklist',
    name: 'Security Checklist Calculator',
    slug: 'security-checklist',
    category: 'security-privacy',
    description: 'Verify your digital posture across systems, email controls, smart home networks, and devices.',
    formula: 'Score = (Completed Tasks / Total Actions) * 100',
    explanation: 'Audits essential device setups like automatic security patching, router firmware safety, storage encryption, and backup loops.',
    example: 'Completing 8 of 10 security audits establishes your posture within the top 20% of internet citizens.',
    inputs: [
      { id: 'autoUpdate', label: 'System Automatic Updates On?', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes, always auto-update', value: 'yes' },
        { label: 'Manual audits only', value: 'no' }
      ]},
      { id: 'diskEncrypt', label: 'Local Hard Drive Encryption Enabled?', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (BitLocker / FileVault / LUKS)', value: 'yes' },
        { label: 'No, unencrypted storage', value: 'no' }
      ]},
      { id: 'wifiSecurity', label: 'Home WiFi Password Setting', type: 'select', defaultValue: 'wpa3', options: [
        { label: 'WPA3 / WPA2-Enterprise with strong key', value: 'wpa3' },
        { label: 'Legacy WPA2 / Default Router Key', value: 'wpa2' },
        { label: 'Open network or WEP standard', value: 'open' }
      ]},
      { id: 'backup', label: 'Off-device Backup Implementation', type: 'select', defaultValue: 'encrypted-cloud', options: [
        { label: '3-2-1 Secure Copying (Encrypted & Disconnected)', value: 'encrypted-cloud' },
        { label: 'Vague cloud sync only', value: 'cloud-sync' },
        { label: 'No regular off-device backups', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'What is disk encryption?', answer: 'Disk encryption ensures that if your physical device (laptop/phone) is stolen, unauthorized parties cannot pull data files directly from storage sectors without the secret keys.' }
    ],
    relatedSlugs: ['account-safety', 'digital-safety-score'],
    seoTitle: 'Digital Security Posture Checklist & Audit Calculator',
    seoDescription: 'Verify backup pathways, home routing security boundaries, auto-patches, and drive partition schemes.',
    calculate: (inputs) => {
      let checksPassed = 0;
      let totalChecks = 4;

      if (inputs.autoUpdate === 'yes') checksPassed++;
      if (inputs.diskEncrypt === 'yes') checksPassed++;
      if (inputs.wifiSecurity === 'wpa3') checksPassed++;
      if (inputs.backup === 'encrypted-cloud') checksPassed++;

      const pct = Math.round((checksPassed / totalChecks) * 100);

      let recommendation = 'Critical Setup Needed';
      if (pct === 100) recommendation = 'Optimal Hardened Security';
      else if (pct >= 50) recommendation = 'Baseline Configured; Needs Polishing';

      return {
        results: [
          { label: 'Completed Actions Ratio', value: `${checksPassed} / ${totalChecks}`, isPrimary: true },
          { label: 'Calculated Defense Indicator', value: pct, unit: '%', isPrimary: true },
          { label: 'Security Recommendation', value: recommendation }
        ]
      };
    }
  },
  {
    id: 'digital-safety-score',
    name: 'Digital Safety Score Calculator',
    slug: 'digital-safety-score',
    category: 'security-privacy',
    description: 'Interactive index reflecting your defenses against malicious scripts, tracking, and malware.',
    formula: 'Safety Score = Baseline (100) - Action Flaws + Protective Virtues',
    explanation: 'Collates web habits like link clicking hygiene, VPN use, backup routine verification, and software repositories to model defense stats.',
    example: 'Avoiding sketchy downloads and holding regular browser updates results in a high 92 Safety Score.',
    inputs: [
      { id: 'installRep', label: 'Typical App Downloading Destination', type: 'select', defaultValue: 'trusted', options: [
        { label: 'Official Stores & Verified Packages only', value: 'trusted' },
        { label: 'Direct web download links / Unofficial mirrors', value: 'web' },
        { label: 'Cracked software sites / Torrent sites', value: 'shady' }
      ]},
      { id: 'phishingHabits', label: 'Link Validation Strategy', type: 'select', defaultValue: 'hover', options: [
        { label: 'Inspect protocols & fully parse domains first', value: 'hover' },
        { label: 'Rely blindly on sender name card graphic', value: 'blind' }
      ]},
      { id: 'adBlocker', label: 'Web Tracker/Ad Blocker Usage', type: 'select', defaultValue: 'yes-strict', options: [
        { label: 'Active Privacy Extensions (uBlock/Brave/Pi-hole)', value: 'yes-strict' },
        { label: 'Standard default web browser shields only', value: 'standard' },
        { label: 'None, ads and scripts run unrestrained', value: 'none' }
      ]}
    ],
    faq: [
      { question: 'Do ad blockers increase safety?', answer: 'Yes. Ad blockers disrupt drive-by malware attacks hosted on hijacked ad exchange servers (malvertising).' }
    ],
    relatedSlugs: ['online-risk', 'account-safety'],
    seoTitle: 'Interactive Web Digital Safety Score Calculator',
    seoDescription: 'Benchmark your malware defenses, phishing resilience, and dynamic tracking immunity profiles online.',
    calculate: (inputs) => {
      let score = 100;
      
      if (inputs.installRep === 'web') score -= 25;
      if (inputs.installRep === 'shady') score -= 60;
      
      if (inputs.phishingHabits === 'blind') score -= 25;
      
      if (inputs.adBlocker === 'yes-strict') score += 5;
      if (inputs.adBlocker === 'none') score -= 15;

      const finalScore = Math.min(100, Math.max(5, score));
      let stat = 'Highly Resilient';
      if (finalScore < 50) stat = 'High Exposure Warning';
      else if (finalScore < 80) stat = 'Moderate Safety Defense';

      return {
        results: [
          { label: 'Calculated Safety Index', value: finalScore, unit: '/100', isPrimary: true },
          { label: 'Resilience Grade', value: stat, isPrimary: true },
          { label: 'Malvertising Immunity', value: inputs.adBlocker === 'yes-strict' ? 'Excellent' : 'Weak' }
        ]
      };
    }
  },
  {
    id: 'online-risk',
    name: 'Online Risk Calculator',
    slug: 'online-risk',
    category: 'security-privacy',
    description: 'Track your vulnerability to data losses, banking fraudulent attempts, and account locks.',
    formula: 'Threat Risk = (Value Exposed * Vulnerability Scale) / Safety Factor',
    explanation: 'Assesses financial digital exposure, backup protocols, and network hygiene parameters to isolate threat percentages.',
    example: 'Managing high liquid balance accounts on open public airport WiFi creates critical online risks.',
    inputs: [
      { id: 'financeExposure', label: 'Online Account Portfolio Asset Value', type: 'select', defaultValue: 10000, options: [
        { label: 'Under $5,000 (Basic Assets)', value: 5000 },
        { label: '$5,000 to $50,000 (Medium Exposure)', value: 30000 },
        { label: 'Over $50,000 (High-Profile Accounts)', value: 100000 }
      ]},
      { id: 'wifiUse', label: 'Typical Public WiFi Protocol', type: 'select', defaultValue: 'vpn', options: [
        { label: 'Always connect with encrypted VPN', value: 'vpn' },
        { label: 'Direct unencrypted login to public hotspots', value: 'freewifi' },
        { label: 'Cellular mobile hot-spot tethering only', value: 'cellular' }
      ]},
      { id: 'phishingTest', label: 'Trained on Social Engineering Identification?', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes, trained on simulation scenarios', value: 'yes' },
        { label: 'No formal cybersecurity awareness training', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'Why is public Wi-Fi insecure?', answer: 'Public Wi-Fi lacks active peer protection, making it simple for malicious entities on the same routing grid to deploy Man-in-the-Middle (MitM) tools to log target session headers.' }
    ],
    relatedSlugs: ['digital-safety-score', 'data-privacy-risk'],
    seoTitle: 'Cyber Threat & Online Risk Evaluator | Calculatoora',
    seoDescription: 'Assess threat likelihood profiles across finance systems, physical network intercept traps, and phishing schemes.',
    calculate: (inputs) => {
      let threatBase = 20;

      const assets = Number(inputs.financeExposure || 5000);
      if (assets > 50000) threatBase += 35;
      else if (assets > 5000) threatBase += 15;

      if (inputs.wifiUse === 'freewifi') threatBase += 35;
      if (inputs.wifiUse === 'cellular') threatBase += 10;

      if (inputs.phishingTest === 'no') threatBase += 20;

      const finalRisk = Math.min(99, Math.max(5, threatBase));

      let rating = 'Negligible Online Risk';
      if (finalRisk > 70) rating = 'Severe Digital Danger';
      else if (finalRisk > 40) rating = 'Moderate Hazard Presence';

      return {
        results: [
          { label: 'Calculated Threat Index', value: finalRisk, unit: '%', isPrimary: true },
          { label: 'Vulnerability Appraisal', value: rating, isPrimary: true },
          { label: 'Asset Profile Intensity', value: assets >= 100000 ? 'Magnified Target' : 'Standard Target' }
        ]
      };
    }
  },
  {
    id: 'identity-protection',
    name: 'Identity Protection Calculator',
    slug: 'identity-protection',
    category: 'security-privacy',
    description: 'Assess individual defenses against state-level fraud, tax-refund scams, and identity hijacking.',
    formula: 'Protection Scale = WeightSum(Audit Measures) * 100',
    explanation: 'Scans metrics including credit agency freezing statuses, mailbox locks, dumpster shredding routines, and social security storage rules.',
    example: 'Freezing credit bureaus creates an iron-clad layer against fraudulent loan lines.',
    inputs: [
      { id: 'creditFreeze', label: 'Credit Bureau Freezing Status', type: 'select', defaultValue: 'no', options: [
        { label: 'Frozen at all active bureaus (Equifax, Experian, TransUnion)', value: 'yes' },
        { label: 'No, bureaus remain open and active', value: 'no' }
      ]},
      { id: 'shredder', label: 'Mail/Documents Shredding Hygiene', type: 'select', defaultValue: 'shred', options: [
        { label: 'Shred all mail containing PII/Financial statements', value: 'shred' },
        { label: 'Dump raw matching items directly in recycle binds', value: 'toss' }
      ]},
      { id: 'monitoring', label: 'Identity/Credit Monitoring Service Active?', type: 'select', defaultValue: 'no', options: [
        { label: 'Yes, with immediate SMS/Email logging notifications', value: 'yes' },
        { label: 'No monitoring, manual check-in only', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'Does a credit freeze impact current utility credit scores?', answer: 'No. A credit freeze temporarily blocks credit history checks for new credit request events, protecting from rogue entries while preserving current account activity scores.' }
    ],
    relatedSlugs: ['privacy-exposure', 'data-privacy-risk'],
    seoTitle: 'Identity Theft Protection & Security Defense Calculator',
    seoDescription: 'Audit your defense configurations against social tax filing hacks, malicious credit creation, and physical record theft.',
    calculate: (inputs) => {
      let frozenScore = inputs.creditFreeze === 'yes' ? 100 : 20;
      let shredScore = inputs.shredder === 'shred' ? 100 : 30;
      let monitorScore = inputs.monitoring === 'yes' ? 100 : 40;

      const finalAvg = Math.round((frozenScore * 0.5) + (shredScore * 0.25) + (monitorScore * 0.25));

      let posture = 'Strongly Hardened';
      if (finalAvg < 50) posture = 'Severely Vulnerable';
      else if (finalAvg < 80) posture = 'Moderately Shielded';

      return {
        results: [
          { label: 'Identity Protection Score', value: finalAvg, unit: '%', isPrimary: true },
          { label: 'Defense Posture Rating', value: posture, isPrimary: true },
          { label: 'Unauthorized Loan Immunity', value: inputs.creditFreeze === 'yes' ? 'Almost Complete' : 'High Vulnerability' }
        ]
      };
    }
  },

  // ====================================== PRODUCTIVITY ======================================
  {
    id: 'time-blocking',
    name: 'Time Blocking Calculator',
    slug: 'time-blocking',
    category: 'productivity',
    description: 'Structure and optimize your active wake schedule into strategic focus bins and buffer times.',
    formula: 'Productive Hours = Wake Hours - Core Overhead Meetings - Buffer Margin',
    explanation: 'Facilitates robust schedules by identifying deep focus zones, administrative segments, buffer zones, and physical recovery windows.',
    example: 'A 16-hour wake day split into four 90-minute blocks creates 6 hours of high-productivity flow.',
    inputs: [
      { id: 'wakeHours', label: 'Target Wake Hours per Day', type: 'number', defaultValue: 16, min: 2, max: 24 },
      { id: 'focusBlockLength', label: 'Deep Focus Block Duration (mins)', type: 'number', defaultValue: 90, min: 15, max: 240, step: 5 },
      { id: 'focusBlocksCount', label: 'Target Number of Deep Focus Blocks', type: 'number', defaultValue: 4, min: 1, max: 10 },
      { id: 'bufferPct', label: 'Emergency Buffer Margin', type: 'number', defaultValue: 15, min: 0, max: 50, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'What is deep focus time blocking?', answer: 'Time blocking segments daylight hours into singular focus tasks, preventing multi-task context swaps which deplete executive brain resources.' }
    ],
    relatedSlugs: ['daily-schedule', 'work-balance'],
    seoTitle: 'Dynamic Time Blocking & Task Segmentation Calculator',
    seoDescription: 'Optimize daily hours with deep-work focus intervals, administrative time boxing, and dedicated buffer cushions.',
    calculate: (inputs) => {
      const wakeVal = Number(inputs.wakeHours || 16);
      const wakeMins = wakeVal * 60;
      
      const blockLength = Number(inputs.focusBlockLength || 90);
      const blockCount = Number(inputs.focusBlocksCount || 4);
      const totalFocusMins = blockLength * blockCount;
      
      const bufferPct = Number(inputs.bufferPct || 15) / 100;
      const bufferMins = wakeMins * bufferPct;
      
      const adminMins = Math.max(0, wakeMins - totalFocusMins - bufferMins);

      let feasibility = 'Optimally Balanced';
      if (totalFocusMins + bufferMins > wakeMins) feasibility = 'Over-scheduled Alert';
      else if (totalFocusMins < 120) feasibility = 'Low Focus Priority';

      return {
        results: [
          { label: 'Total Deep Work Flow', value: (totalFocusMins / 60).toFixed(1), unit: 'hours', isPrimary: true },
          { label: 'Required Cushion Time', value: (bufferMins / 60).toFixed(1), unit: 'hours' },
          { label: 'Remaining Admin & Social Cap', value: (adminMins / 60).toFixed(1), unit: 'hours' },
          { label: 'Schedule Feasibility Rating', value: feasibility }
        ]
      };
    }
  },
  {
    id: 'daily-schedule',
    name: 'Daily Schedule Calculator',
    slug: 'daily-schedule',
    category: 'productivity',
    description: 'Evaluate chronological hour usage to determine efficiency indices of standard work routines.',
    formula: 'Efficiency Index = (Productive Tasks / Committed Awake Time) * 100',
    explanation: 'Audits commutes, meetings, actual task runs, breaks, and screen distractions to return an absolute efficiency scoring diagram.',
    example: 'By trimming 1 hour of scroll distraction, you can improve daily scheduling efficiency from 55% to 75%.',
    inputs: [
      { id: 'workSleep', label: 'Average Rest/Sleep Hours', type: 'number', defaultValue: 8, min: 3, max: 14, step: 0.5 },
      { id: 'taskTime', label: 'Direct Work/Task Execution Hours', type: 'number', defaultValue: 5, min: 0, max: 16, step: 0.5 },
      { id: 'distractionTime', label: 'Disorganized App Scrolling & Video Distractions', type: 'number', defaultValue: 2.5, min: 0, max: 12, step: 0.5 },
      { id: 'vitalActivities', label: 'Meals, Health, Transit & Household Upkeep', type: 'number', defaultValue: 4, min: 0, max: 12, step: 0.5 }
    ],
    faq: [
      { question: 'What is a typical healthy efficiency score?', answer: 'A score between 70% and 85% is ideal. Targeting 100% is counterproductive, as humans require cognitive recharge spaces to retain creativity and block burnout.' }
    ],
    relatedSlugs: ['time-blocking', 'work-balance'],
    seoTitle: 'Hourly Daily Schedule & Time Efficiency Audit Calculator',
    seoDescription: 'Benchmark sleep limits, productive deep work spans, household maintenance loops, and digital screen distractions.',
    calculate: (inputs) => {
      const sleep = Number(inputs.workSleep || 8);
      const task = Number(inputs.taskTime || 5);
      const scroll = Number(inputs.distractionTime || 2);
      const upkeep = Number(inputs.vitalActivities || 4);

      const totalHours = sleep + task + scroll + upkeep;
      const discrepancy = 24 - totalHours; // remaining unaccounted buffer

      const awakeHours = 24 - sleep;
      const efficiency = awakeHours > 0 ? (task / (awakeHours - upkeep)) * 100 : 0;
      const constrainedEff = Math.min(100, Math.max(0, Math.round(efficiency)));

      return {
        results: [
          { label: 'Schedule Efficiency Index', value: constrainedEff, unit: '%', isPrimary: true },
          { label: 'Unaccounted Idle Gap', value: discrepancy.toFixed(1), unit: 'hours' },
          { label: 'Productive Work Span Ratio', value: `${task} hrs / ${awakeHours.toFixed(1)} awake hrs` }
        ]
      };
    }
  },
  {
    id: 'weekly-planning',
    name: 'Weekly Planning Calculator',
    slug: 'weekly-planning',
    category: 'productivity',
    description: 'Map out weekly targets across work, training, family, sleep, and recreational milestones.',
    formula: 'Available Margin = 168 Hours - SUM(Activity Categories)',
    explanation: 'Sums committed block hours across 7 days to preserve margins and verify balanced task distributions.',
    example: 'An individual working 45 hours, exercising 6 hours, and sleeping 56 hours maintains a healthy 61-hour margin for social lives.',
    inputs: [
      { id: 'workCommit', label: 'Weekly Professional Work Hours', type: 'number', defaultValue: 40, min: 0, max: 100, step: 1 },
      { id: 'sleepCommit', label: 'Target Sleep Hours (e.g. 8h/night)', type: 'number', defaultValue: 56, min: 10, max: 112, step: 1 },
      { id: 'routineCommit', label: 'Weekly Commutes + Personal Admin Hours', type: 'number', defaultValue: 14, min: 0, max: 60, step: 1 },
      { id: 'healthCommit', label: 'Exercise & Outdoor Training Hours', type: 'number', defaultValue: 5, min: 0, max: 30, step: 0.5 }
    ],
    faq: [
      { question: 'How is weekly planning beneficial over daily?', answer: 'Weekly horizons accommodate periodic fluctuations, allowing team members and freelancers to scale effort dynamically without feeling behind on a single interrupted day.' }
    ],
    relatedSlugs: ['daily-schedule', 'task-completion'],
    seoTitle: 'Interactive Weekly Planning & Allocation Margin Calculator',
    seoDescription: 'Audit your 168-hour weekly threshold. Maintain an ideal balance between career tracks, fitness hours, sleep, and social margins.',
    calculate: (inputs) => {
      const work = Number(inputs.workCommit || 40);
      const sleep = Number(inputs.sleepCommit || 56);
      const admin = Number(inputs.routineCommit || 14);
      const health = Number(inputs.healthCommit || 5);

      const totalCommitted = work + sleep + admin + health;
      const remainingFree = Math.max(0, 168 - totalCommitted);

      let profile = 'Highly Balanced';
      if (remainingFree < 15) profile = 'Overcommitted Burnout Threat';
      else if (work > 55) profile = 'Career Dominated Structure';

      return {
        results: [
          { label: 'Weekly Discretionary Margin', value: remainingFree, unit: 'hours', isPrimary: true },
          { label: 'Allocated Hour Sum', value: totalCommitted, unit: 'hours / 168' },
          { label: 'Workforce Load Balance', value: profile }
        ]
      };
    }
  },
  {
    id: 'task-completion',
    name: 'Task Completion Calculator',
    slug: 'task-completion',
    category: 'productivity',
    description: 'Determine estimated durations for backlog lists utilizing completion rates, focus buffers, and backlog sizing.',
    formula: 'Time to Liquidate Backlog = (Pending Backlog Count * Task Time) / Completion Velocity',
    explanation: 'Computes schedule velocity parameters using current backlog counts, historical completion rates, and average task focus buffers.',
    example: 'A backlog of 15 key milestones takes 2.5 working weeks if your output averages 6 tasks weekly.',
    inputs: [
      { id: 'backlogSize', label: 'Outstanding Task List Count', type: 'number', defaultValue: 18, min: 1, max: 200 },
      { id: 'avgDuration', label: 'Average Hour Spend per Task', type: 'number', defaultValue: 2.5, min: 0.1, max: 40, step: 0.1 },
      { id: 'velocity', label: 'Tasks Resolved per Standard Week', type: 'number', defaultValue: 8, min: 1, max: 100 }
    ],
    faq: [
      { question: 'How can I increase task resolution velocity?', answer: 'Reduce WIP (Work In Progress) bounds. Focus strictly on finishing 1 to 2 tasks completely before opening secondary backlog tickets.' }
    ],
    relatedSlugs: ['weekly-planning', 'deadline-calc'],
    seoTitle: 'Backlog Task Completion Velocity Calculator | Calculatoora',
    seoDescription: 'Estimate exactly how long it takes to clear pending lists based on historical velocity, item count, and complexity weight.',
    calculate: (inputs) => {
      const backlog = Number(inputs.backlogSize || 10);
      const hoursPerTask = Number(inputs.avgDuration || 2.5);
      const weeklyTickets = Number(inputs.velocity || 5);

      const totalWorkloadHours = backlog * hoursPerTask;
      const estimatedWeeks = backlog / weeklyTickets;
      const completionDays = estimatedWeeks * 5; // standard business days

      return {
        results: [
          { label: 'Target Completion Period', value: estimatedWeeks.toFixed(1), unit: 'weeks', isPrimary: true },
          { label: 'Calculated Workload Volume', value: totalWorkloadHours.toFixed(1), unit: 'hours', isPrimary: true },
          { label: 'Calendar Workday Span', value: Math.ceil(completionDays), unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'deadline-calc',
    name: 'Deadline Calculator',
    slug: 'deadline-calc',
    category: 'productivity',
    description: 'Configure and track targets for milestone releases by implementing custom work parameters and contingency limits.',
    formula: 'Contingency Deadline = Baseline Days * (1 + Buffer Factor)',
    explanation: 'Inputs standard development milestones and overlays buffer ratios (contingency margins) to output secure calendar release coordinates.',
    example: 'A design phase expected to consume 10 workdays with a 30% contingency margin delivers safely in 13 workdays.',
    inputs: [
      { id: 'baseDays', label: 'Estimated Clean Project Workdays', type: 'number', defaultValue: 15, min: 1, max: 365 },
      { id: 'contingencyFactor', label: 'Contingency Buffer Margin', type: 'number', defaultValue: 25, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'dailyHours', label: 'Effective Production Hours per Day', type: 'number', defaultValue: 6, min: 1, max: 12 }
    ],
    faq: [
      { question: 'Why do projects consistently run past initial deadlines?', answer: 'Due to "planning fallacy": humans regularly underestimate task complexity, ignore peripheral chores, and fail to account for communication blockages.' }
    ],
    relatedSlugs: ['task-completion', 'project-planning'],
    seoTitle: 'Milestone Deadline & Buffer Contingency Calculator',
    seoDescription: 'Avoid delivery friction. Calculate safe target release schedules utilizing dynamic contingency buffers.',
    calculate: (inputs) => {
      const days = Number(inputs.baseDays || 10);
      const speed = Number(inputs.dailyHours || 6);
      const buffer = Number(inputs.contingencyFactor || 20) / 100;

      const totalDirectHours = days * speed;
      const robustDays = Math.ceil(days * (1 + buffer));
      const contingencyAddition = robustDays - days;

      return {
        results: [
          { label: 'Buffered Release Target', value: robustDays, unit: 'workdays', isPrimary: true },
          { label: 'Net Production Hours', value: totalDirectHours, unit: 'hours' },
          { label: 'Structured Buffer Added', value: contingencyAddition, unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'work-balance',
    name: 'Work Balance Calculator',
    slug: 'work-balance',
    category: 'productivity',
    description: 'Diagnose work-life balance ratios by auditing hours committed to career, family, and health priorities.',
    formula: 'Discrepancy Score = SumOfDifferences(Actual vs Ideal Ratio)',
    explanation: 'Contrast current hourly investments with personal targets to calculate a Work-Life Health Index.',
    example: 'Shifting 5 hours from overtime work to family or active rest resolves severe burnout indicators.',
    inputs: [
      { id: 'careerHours', label: 'Weekly Career & Overtime Hours', type: 'number', defaultValue: 50, min: 1, max: 100 },
      { id: 'familyHours', label: 'Weekly Family, Friends & Relationship Hours', type: 'number', defaultValue: 12, min: 1, max: 100 },
      { id: 'selfHours', label: 'Weekly Self Care, Hobbies & Wellness Hours', type: 'number', defaultValue: 6, min: 1, max: 100 },
      { id: 'restHours', label: 'Weekly Sleep Allocation Hours', type: 'number', defaultValue: 49, min: 1, max: 100 }
    ],
    faq: [
      { question: 'What is a balanced weekly breakdown?', answer: 'Ideally, the remaining waking hours should follow an approximate 50:30:20 split: 50% for core career goals, 30% for social relationships and family, and 20% for self-care and renewal.' }
    ],
    relatedSlugs: ['weekly-planning', 'focus-improvement'],
    seoTitle: 'Work-Life Balance & Wellbeing Ratio Calculator',
    seoDescription: 'Are you overworking? Audit your time split, compare splits against sustainable ratios, and obtain targeted advice.',
    calculate: (inputs) => {
      const c = Number(inputs.careerHours || 40);
      const f = Number(inputs.familyHours || 20);
      const s = Number(inputs.selfHours || 10);
      const r = Number(inputs.restHours || 50);

      const total = c + f + s + r;
      const careerPct = (c / total) * 100;
      const familyPct = (f / total) * 100;
      const selfPct = (s / total) * 100;

      let score = 100;
      if (careerPct > 35) score -= (careerPct - 35) * 2;
      if (familyPct < 15) score -= (15 - familyPct) * 2.5;
      if (selfPct < 10) score -= (10 - selfPct) * 3;

      const finalScore = Math.min(100, Math.max(10, Math.round(score)));

      let rating = 'Healthy Equitableness';
      if (finalScore < 45) rating = 'Severe Burnout Warning';
      else if (finalScore < 75) rating = 'Moderate Shift Needed';

      return {
        results: [
          { label: 'Work-Life Harmony Index', value: finalScore, unit: '/100', isPrimary: true },
          { label: 'Wellbeing Appraisal', value: rating, isPrimary: true },
          { label: 'Career Share of Lifetime', value: Math.round(careerPct), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'focus-improvement',
    name: 'Focus Improvement Calculator',
    slug: 'focus-improvement',
    category: 'productivity',
    description: 'Calculate cognitive performance boosts by auditing multitasking habits and focus windows.',
    formula: 'Effective Flow = Base Efficiency * (1 - Multitask Penalty)',
    explanation: 'Isolates the time lost due to "attention residue" when swapping back and forth between screens, notifications, and mail.',
    example: 'Silencing mobile screens can lower distraction penalties, reclaiming up to 12 hours of weekly output.',
    inputs: [
      { id: 'workDuration', label: 'Aggregate Weekly Work Hours', type: 'number', defaultValue: 40, min: 5, max: 100 },
      { id: 'notificationFreq', label: 'Average Notifications Checked per Hour', type: 'number', defaultValue: 6, min: 0, max: 60 },
      { id: 'blockFlow', label: 'Average Continuous Block Span (mins)', type: 'number', defaultValue: 25, min: 5, max: 180 }
    ],
    faq: [
      { question: 'What is attention residue?', answer: 'Attention residue occurs when swapping tasks causes your brain to keep processing the prior assignment, decreasing visual acuity and logical processing on the new task.' }
    ],
    relatedSlugs: ['time-blocking', 'work-balance'],
    seoTitle: 'Continuous Focus Flow & Attention Reclaim Calculator',
    seoDescription: 'Calculate structural productivity losses from cognitive switching penalties. Learn how to reclaim lost focus.',
    calculate: (inputs) => {
      const hours = Number(inputs.workDuration || 40);
      const checks = Number(inputs.notificationFreq || 5);
      const span = Number(inputs.blockFlow || 20);

      const switchCostMins = 3.5; // average minutes to regain deep focus after an alert check
      const totalChecksWeekly = hours * checks;
      const switchLossHours = (totalChecksWeekly * switchCostMins) / 60;
      
      const netEffectiveHours = Math.max(2, hours - switchLossHours);
      const wastePct = Math.min(95, Math.round((switchLossHours / hours) * 100));

      return {
        results: [
          { label: 'Weekly Focus Reclaim Potential', value: Math.min(hours - 2, switchLossHours).toFixed(1), unit: 'hours', isPrimary: true },
          { label: 'Attention Switch Cost Penalty', value: wastePct, unit: '% of total time' },
          { label: 'Actual Undisturbed Deep Work', value: netEffectiveHours.toFixed(1), unit: 'hours / week' }
        ]
      };
    }
  },

  // ====================================== PROJECT MANAGEMENT ======================================
  {
    id: 'project-planning',
    name: 'Project Planning Calculator',
    slug: 'project-planning',
    category: 'project-management',
    description: 'Structure custom project timelines by managing milestone work estimates, dependencies, and staff size indicators.',
    formula: 'Time Estimate = Total Story Points / (Staff Count * Velocity Index)',
    explanation: 'Models project calendars cleanly by linking design, development, and QA efforts to specific release milestones.',
    example: 'A project of 300 story points staffed by 4 developers averaging 12 points weekly completes in 6.25 weeks.',
    inputs: [
      { id: 'totalPoints', label: 'Project Backlog Volume (Story Points)', type: 'number', defaultValue: 150, min: 10, max: 2000 },
      { id: 'teamCapacity', label: 'Active Team Count', type: 'number', defaultValue: 5, min: 1, max: 50 },
      { id: 'ptsPerSprint', label: 'Weekly Story Points Per Person', type: 'number', defaultValue: 8, min: 1, max: 50 }
    ],
    faq: [
      { question: 'How do story points describe real calendar hours?', answer: 'Rather than predicting precise clock hours, story points quantify complexity, security risks, and technical blockages relative to target standards.' }
    ],
    relatedSlugs: ['project-completion', 'team-workload'],
    seoTitle: 'Milestone Agile Project Planning & Release Timeline Calculator',
    seoDescription: 'Map out development, review, and shipping milestones based on team scale, backlog density, and sprint velocity.',
    calculate: (inputs) => {
      const points = Number(inputs.totalPoints || 100);
      const team = Number(inputs.teamCapacity || 4);
      const speed = Number(inputs.ptsPerSprint || 8);

      const combinedWeeklyCapacity = team * speed;
      const weeksNeeded = points / combinedWeeklyCapacity;

      return {
        results: [
          { label: 'Milestone Timetable Target', value: weeksNeeded.toFixed(1), unit: 'weeks', isPrimary: true },
          { label: 'Sprint Capacity Sum', value: combinedWeeklyCapacity, unit: 'points / week' },
          { label: 'Aggregate Deliverday Units', value: Math.ceil(weeksNeeded * 5), unit: 'workdays' }
        ]
      };
    }
  },
  {
    id: 'project-completion',
    name: 'Project Completion Calculator',
    slug: 'project-completion',
    category: 'project-management',
    description: 'Calculate real-time progress percentages and date horizons for current enterprise assignments.',
    formula: 'Completion % = (Completed Artifacts / Total Plan) * 100',
    explanation: 'Calculates active trajectory bounds by tracking actual versus planned task completions to flag delays early.',
    example: 'An assignment with 65 of 90 tasks closed operates at 72% completion, with an estimated 4 weeks remaining.',
    inputs: [
      { id: 'doneTasks', label: 'Completed Deliverables/Tasks', type: 'number', defaultValue: 45, min: 0, max: 1000 },
      { id: 'totalTasks', label: 'Total Backlog Items in Scope', type: 'number', defaultValue: 80, min: 1, max: 2000 },
      { id: 'daysElapsed', label: 'Development Days Elapsed', type: 'number', defaultValue: 20, min: 1, max: 365 }
    ],
    faq: [
      { question: 'What does a negative scheduling buffer suggest?', answer: 'A negative scheduling buffer indicates your actual development velocity is too low to hit the target date, requiring scope cuts or team additions.' }
    ],
    relatedSlugs: ['project-planning', 'project-health-score'],
    seoTitle: 'Dynamic Project Progress & Completion Timeline Calculator',
    seoDescription: 'Verify actual project scope percentages, task resolution speeds, and estimated final calendar targets.',
    calculate: (inputs) => {
      const done = Number(inputs.doneTasks || 0);
      const total = Math.max(1, Number(inputs.totalTasks || 1));
      const elapsed = Number(inputs.daysElapsed || 10);

      const realDone = Math.min(total, done);
      const pct = Math.round((realDone / total) * 100);

      const solveRatio = realDone > 0 ? elapsed / realDone : 0;
      const forecastRemainingDays = Math.ceil((total - realDone) * solveRatio);

      return {
        results: [
          { label: 'Aggregate Scope Completion', value: pct, unit: '%', isPrimary: true },
          { label: 'Est. Days to Reach 100%', value: realDone === 0 ? 'TBD' : forecastRemainingDays, unit: 'elapsed days', isPrimary: true },
          { label: 'Calculated Resolution Rate', value: realDone > 0 ? (realDone / elapsed).toFixed(2) : '0', unit: 'tasks / day' }
        ]
      };
    }
  },
  {
    id: 'project-budget-forecast',
    name: 'Project Budget Forecast Calculator',
    slug: 'project-budget-forecast',
    category: 'project-management',
    description: 'Track spending patterns, project overrun likelihoods, and cost at completion parameters.',
    formula: 'Cost Forecast = (Budget / Completion Rate) * Remaining BalanceFactor',
    explanation: 'Implements standard Earned Value Management (EVM) parameters such as Planned Value, Actual Cost, and Earned Value bounds.',
    example: 'With a $50,000 budget and a 0.85 Cost Performance Index, your projected final cost runs near $58,820.',
    inputs: [
      { id: 'budgetPlanned', label: 'Aggregate Target Budget ($)', type: 'number', defaultValue: 50000, min: 100, step: 1000 },
      { id: 'spentActual', label: 'Actual Funding Spent to Date ($)', type: 'number', defaultValue: 25000, min: 0, step: 500 },
      { id: 'progressPct', label: 'Verifiable Progress Closed', type: 'number', defaultValue: 45, min: 1, max: 100, step: 1, unit: '%' }
    ],
    faq: [
      { question: 'What is Cost Performance Index (CPI)?', answer: 'CPI measures cost efficiency. A CPI of 1.0 means you are billing exactly as planned. Above 1.0 indicates under budget; below 1.0 flags budget overruns.' }
    ],
    relatedSlugs: ['project-health-score', 'resource-allocation'],
    seoTitle: 'EVM Project Budget Forecast & Cost Overrun Calculator',
    seoDescription: 'Utilize Earned Value Management standards. Calculate CPI and project final budgets cleanly.',
    calculate: (inputs) => {
      const budget = Number(inputs.budgetPlanned || 10000);
      const spent = Number(inputs.spentActual || 0);
      const progress = Number(inputs.progressPct || 10) / 100;

      const earnedValue = budget * progress;
      const cpi = spent > 0 ? earnedValue / spent : 1.0;
      const estimateAtCompletion = cpi > 0 ? budget / cpi : budget;
      const deviation = estimateAtCompletion - budget;

      let status = 'Within Bounds';
      if (cpi < 0.9) status = 'Risk of Cost Overrun';
      else if (cpi > 1.1) status = 'Under Budget Savings';

      return {
        results: [
          { label: 'Projected Total Cost', value: Math.round(estimateAtCompletion), unit: '$', isPrimary: true },
          { label: 'Variance at Completion', value: Math.round(deviation), unit: '$', isPrimary: true },
          { label: 'Cost Performance Index (CPI)', value: cpi.toFixed(2) },
          { label: 'Economic Health Status', value: status }
        ]
      };
    }
  },
  {
    id: 'resource-allocation',
    name: 'Resource Allocation Calculator',
    slug: 'resource-allocation',
    category: 'project-management',
    description: 'Evaluate staffing profiles and optimize human resource assignments across multiple streams.',
    formula: 'Individual Allocation = (Project Hours Needed / Team Weekly Capacity) * 100',
    explanation: 'Maps available team hours to parallel projects to identify over or underutilization states.',
    example: 'Dividing 30 hours of tasks across a developer on a 40-hour pipeline establishes a healthy 75% utilization.',
    inputs: [
      { id: 'taskHoursNeeded', label: 'Weekly Tasks Hours Required', type: 'number', defaultValue: 120, min: 1, max: 1000 },
      { id: 'availableContractors', label: 'Available Full-Time Team Staff', type: 'number', defaultValue: 4, min: 1, max: 100 },
      { id: 'weeklyLimit', label: 'Safe Weekly Work Hours Limit per Staff', type: 'number', defaultValue: 38, min: 10, max: 80 }
    ],
    faq: [
      { question: 'What is the optimal resource utilization target?', answer: 'Unlocking 75% to 80% utilization is ideal. Pushing for 100% leaves no time for onboarding, team communication, or task switching, causing project lag.' }
    ],
    relatedSlugs: ['team-workload', 'project-budget-forecast'],
    seoTitle: 'Resource Allocation & Labor Utilization Calculator',
    seoDescription: 'Plan individual capacities, check for overutilization risk, and optimize multi-stream personnel budgets.',
    calculate: (inputs) => {
      const taskHours = Number(inputs.taskHoursNeeded || 40);
      const staff = Number(inputs.availableContractors || 1);
      const hLimit = Number(inputs.weeklyLimit || 40);

      const totalPoolCapacity = staff * hLimit;
      const pctUtilization = Math.round((taskHours / totalPoolCapacity) * 100);

      let balanceRating = 'Healthy Resource Margin';
      if (pctUtilization > 95) balanceRating = 'Critical Overload Threat';
      else if (pctUtilization < 60) balanceRating = 'Underutilized Staff Margin';

      return {
        results: [
          { label: 'Consolidated Team Utilization', value: Math.min(200, pctUtilization), unit: '%', isPrimary: true },
          { label: 'Aggregate Max Hour Pool', value: totalPoolCapacity, unit: 'hours / week' },
          { label: 'Staff Resource Posture', value: balanceRating }
        ]
      };
    }
  },
  {
    id: 'team-workload',
    name: 'Team Workload Calculator',
    slug: 'team-workload',
    category: 'project-management',
    description: 'Track individual employee workloads to distribute assignments fairly and prevent burnout.',
    formula: 'Workload Surcharge = Assigned Tickets * Complexity Index - Capacity Balance',
    explanation: 'Aggregates individual point targets against historical output metrics to optimize task distributions.',
    example: 'Redistributing two high-complexity tasks from an overloaded lead to junior staff balances core sprint speeds.',
    inputs: [
      { id: 'totalAssigned', label: 'Total Assigned Tasks This Cycle', type: 'number', defaultValue: 25, min: 1, max: 150 },
      { id: 'complexityWeight', label: 'Average Task Complexity Multiplier', type: 'select', defaultValue: 2, options: [
        { label: 'Low (Simple clean-ups)', value: 1.2 },
        { label: 'Moderate (Standard features)', value: 2.0 },
        { label: 'High (Core logic redesign)', value: 3.5 }
      ]},
      { id: 'staffSize', label: 'Deployable Team Workers', type: 'number', defaultValue: 4, min: 1, max: 30 }
    ],
    faq: [
      { question: 'How is a task complexity multiplier selected?', answer: 'We evaluate tasks based on technical risk, external integration requirements, and necessary testing effort to verify code logic.' }
    ],
    relatedSlugs: ['resource-allocation', 'project-planning'],
    seoTitle: 'Team Workload Distribution & Burnout Prevention Calculator',
    seoDescription: 'Audit task lists across team members. Balance technical assignments fairly.',
    calculate: (inputs) => {
      const tickets = Number(inputs.totalAssigned || 10);
      const factor = Number(inputs.complexityWeight || 2);
      const staff = Number(inputs.staffSize || 3);

      const computedWorkloadUnit = tickets * factor;
      const sharePerStaff = computedWorkloadUnit / staff;

      let overloadState = 'Balanced Delivery Load';
      if (sharePerStaff > 15) overloadState = 'High Stress Pressure';
      else if (sharePerStaff < 6) overloadState = 'Excess Available Bandwidth';

      return {
        results: [
          { label: 'Workload Density Unit per Staff', value: sharePerStaff.toFixed(1), isPrimary: true },
          { label: 'Aggregate Complexity Load', value: Math.round(computedWorkloadUnit), unit: 'points' },
          { label: 'Team Stress Appraisal', value: overloadState }
        ]
      };
    }
  },
  {
    id: 'project-health-score',
    name: 'Project Health Score Calculator',
    slug: 'project-health-score',
    category: 'project-management',
    description: 'Generate an aggregate health score based on timeline delays, budget status, and scope changes.',
    formula: 'Health Index = (Schedule Weight * SPI) + (Budget Weight * CPI) - Change Creep Impact',
    explanation: 'Combines Cost (CPI), Schedule (SPI), Scope Creep, and Team morale stats to render a single project health indicator.',
    example: 'A project with 1.0 CPI, 0.95 SPI, and low scope changes secures an Excellent Health Score of 94%.',
    inputs: [
      { id: 'spi', label: 'Schedule Performance Index (SPI)', type: 'number', defaultValue: 0.95, min: 0.1, max: 2.0, step: 0.01 },
      { id: 'cpi', label: 'Cost Performance Index (CPI)', type: 'number', defaultValue: 1.02, min: 0.1, max: 2.0, step: 0.01 },
      { id: 'scopeCreep', label: 'Scope Expansion / Creep Level', type: 'select', defaultValue: 'low', options: [
        { label: 'Low (Strictly bounded roadmap)', value: 'low' },
        { label: 'Moderate (Some change requests)', value: 'med' },
        { label: 'High (Continuous pivot cycles)', value: 'high' }
      ]}
    ],
    faq: [
      { question: 'What do SPI and CPI mean in management?', answer: 'SPI calculates timetable adherence (Planned work vs. Elapsed timeline progress). CPI represents funding efficiency (Earned Value relative to actual spent capital).' }
    ],
    relatedSlugs: ['project-budget-forecast', 'project-planning'],
    seoTitle: 'Project Health Score & Risk Audit Calculator',
    seoDescription: 'Get a clear overview of project health. Analyze schedule adherence, budget trends, and roadmap stability.',
    calculate: (inputs) => {
      const spi = Number(inputs.spi || 1.0);
      const cpi = Number(inputs.cpi || 1.0);
      const creep = inputs.scopeCreep || 'low';

      let creepPen = 0;
      if (creep === 'med') creepPen = 15;
      if (creep === 'high') creepPen = 40;

      // Map indices into score metrics (target 100 for normal 1.0 indexes)
      const healthFromSchedule = Math.min(100, spi * 100);
      const healthFromCost = Math.min(100, cpi * 100);

      const netHealth = Math.round((healthFromSchedule * 0.5) + (healthFromCost * 0.5) - creepPen);
      const finalScore = Math.min(100, Math.max(5, netHealth));

      let ranking = 'On Track (Healthy)';
      if (finalScore < 60) ranking = 'At Risk (Recovery Action Required)';
      else if (finalScore < 80) ranking = 'Under Observation (Minor Issues)';

      return {
        results: [
          { label: 'Calculated Health Score', value: finalScore, unit: '%', isPrimary: true },
          { label: 'Project Health Classification', value: ranking, isPrimary: true },
          { label: 'Creep Level Performance Drag', value: `-${creepPen} points`, unit: 'penalties' }
        ]
      };
    }
  },

  // ====================================== SOFTWARE ENGINEERING ======================================
  {
    id: 'software-dev-cost',
    name: 'Software Development Cost Calculator',
    slug: 'software-dev-cost',
    category: 'software-engineering',
    description: 'Obtain precise project estimates for building Web, Mobile, or Custom SaaS architectures.',
    formula: 'Cost = Dev Hours * Hourly Rate + Infrastructure Provision',
    explanation: 'Models costs across standard screens, database complexity, security levels, and platform integrations.',
    example: 'An iOS and Android application with 15 dynamic screens and basic dashboard flows averages $24,500.',
    inputs: [
      { id: 'devPlatform', label: 'Primary Target Platform', type: 'select', defaultValue: 'web-responsive', options: [
        { label: 'Web Application (Responsive Portal)', value: 'web-responsive' },
        { label: 'Native Mobile (iOS + Android)', value: 'native-mobile' },
        { label: 'Full-Stack SaaS (Dashboard + API)', value: 'saas' }
      ]},
      { id: 'screenComplexityCount', label: 'Target Interactive Screen Count', type: 'number', defaultValue: 12, min: 1, max: 150 },
      { id: 'devHourlyRate', label: 'Engineering Hourly Billing Rate ($)', type: 'number', defaultValue: 85, min: 10, max: 500, step: 5 }
    ],
    faq: [
      { question: 'How is dev complexity determined?', answer: 'Complexity scales with external integrations, real-time sync systems, multi-tiered user permissions, and custom analytics.' }
    ],
    relatedSlugs: ['software-timeline', 'software-maintenance'],
    seoTitle: 'Software Development Cost & Budget Estimate Calculator',
    seoDescription: 'Estimate development costs based on targeted platforms, screen count, database tiers, and designer hours.',
    calculate: (inputs) => {
      const platform = inputs.devPlatform || 'web-responsive';
      const screens = Number(inputs.screenComplexityCount || 10);
      const rate = Number(inputs.devHourlyRate || 85);

      let hoursMultiplier = 15; // default web screen
      if (platform === 'native-mobile') hoursMultiplier = 25;
      if (platform === 'saas') hoursMultiplier = 35;

      const directCodeHours = screens * hoursMultiplier;
      const designHours = screens * 6;
      const QAAndProjectHours = (directCodeHours + designHours) * 0.25;

      const aggregateHours = directCodeHours + designHours + QAAndProjectHours;
      const computedCost = aggregateHours * rate;

      return {
        results: [
          { label: 'Estimated Overall Budget', value: Math.round(computedCost), unit: '$', isPrimary: true },
          { label: 'Target Architecture Hours', value: Math.ceil(aggregateHours), unit: 'hours', isPrimary: true },
          { label: 'QA & Testing Cycle Split', value: Math.ceil(QAAndProjectHours), unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'software-timeline',
    name: 'Software Timeline Calculator',
    slug: 'software-timeline',
    category: 'software-engineering',
    description: 'Calculate development sprints and secure calendar horizons based on team velocity.',
    formula: 'Duration Weeks = Total Hours / (Staff Count * Weekly Efficiency Output)',
    explanation: 'Translates development requirements into scheduled calendar milestones, highlighting sprint stages.',
    example: 'A project with 400 effort hours assigned to 2 developers delivers in approximately 8 calendar weeks.',
    inputs: [
      { id: 'reqHours', label: 'Total Expected Development Code Hours', type: 'number', defaultValue: 350, min: 10, max: 5000 },
      { id: 'devCount', label: 'Active Assigned Software Engineers', type: 'number', defaultValue: 2, min: 1, max: 50 },
      { id: 'sprintOverhead', label: 'Communication & Meeting Time', type: 'number', defaultValue: 15, min: 0, max: 50, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'Why does adding engineers sometimes delay software releases?', answer: 'Known as Brooks\' Law: Onboarding new engineers increases communication overhead and training requirements, temporarily slowing velocity.' }
    ],
    relatedSlugs: ['software-dev-cost', 'project-planning'],
    seoTitle: 'Software Timelines & Agile Sprint Scheduling Calculator',
    seoDescription: 'Project software launch dates, analyze communication overhead, and plan agile sprint cycles.',
    calculate: (inputs) => {
      const hours = Number(inputs.reqHours || 300);
      const devs = Number(inputs.devCount || 1);
      const overhead = Number(inputs.sprintOverhead || 15) / 100;

      const directWeeklyHoursPerPerson = 35;
      const effectiveWeeklyMinutesPerPerson = directWeeklyHoursPerPerson * (1 - overhead);
      const totalWeeklyPointsCompleted = devs * effectiveWeeklyMinutesPerPerson;

      const weeksTotal = hours / totalWeeklyPointsCompleted;

      return {
        results: [
          { label: 'Release Timeline Duration', value: weeksTotal.toFixed(1), unit: 'weeks', isPrimary: true },
          { label: 'Overhead Velocity Drain', value: (overhead * 100).toFixed(0), unit: '%' },
          { label: 'Estimated Monthly Sprints', value: (weeksTotal / 2).toFixed(1), unit: 'sprints' }
        ]
      };
    }
  },
  {
    id: 'software-maintenance',
    name: 'Software Maintenance Cost Calculator',
    slug: 'software-maintenance',
    category: 'software-engineering',
    description: 'Forecast annual expenses for cloud servers, API fees, bug fixing, and software updates.',
    formula: 'Maintenance Cost = (Build Cost * 0.2) + Annual Cloud Cost',
    explanation: 'Estimates annual app maintenance using industry benchmarks (typically 15% to 25% of the original build budget).',
    example: 'A platform built for $40,000 averages about $8,000 annually for patches, cloud database updates, and security logs.',
    inputs: [
      { id: 'originalBuildBudget', label: 'Original Project Build Cost ($)', type: 'number', defaultValue: 35000, min: 1000, step: 1000 },
      { id: 'cloudUsageLevel', label: 'Annual Server & DB Load Infrastructure ($)', type: 'number', defaultValue: 2400, min: 100, step: 100 },
      { id: 'vendorPatches', label: 'Annual Third-Party License & API Fees ($)', type: 'number', defaultValue: 1200, min: 0, step: 100 }
    ],
    faq: [
      { question: 'Why is software maintenance ongoing?', answer: 'Regular maintenance is required for security updates, browser compatibility adjustments, API updates, and performance tuning.' }
    ],
    relatedSlugs: ['software-dev-cost', 'technical-debt'],
    seoTitle: 'Annual Software Maintenance & Cloud Hosting Cost Calculator',
    seoDescription: 'Calculate server hosting, database maintenance, licensing fees, and general patch costs.',
    calculate: (inputs) => {
      const buildCost = Number(inputs.originalBuildBudget || 20000);
      const cloud = Number(inputs.cloudUsageLevel || 1200);
      const api = Number(inputs.vendorPatches || 600);

      const standardDeveloperHoursCost = buildCost * 0.18; // 18% benchmark
      const aggregateMaintenance = standardDeveloperHoursCost + cloud + api;

      return {
        results: [
          { label: 'Est. Annual Maintenance Cost', value: Math.round(aggregateMaintenance), unit: '$ / year', isPrimary: true },
          { label: 'Monthly Care Installment', value: Math.round(aggregateMaintenance / 12), unit: '$ / month', isPrimary: true },
          { label: 'Code Upgrade Allocation', value: Math.round(standardDeveloperHoursCost), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'app-performance',
    name: 'Application Performance Calculator',
    slug: 'app-performance',
    category: 'software-engineering',
    description: 'Monitor API response averages, page speed trends, core web vitals, and error ratios.',
    formula: 'Apdex Score = (Satisfied Requests + 0.5 * Tolerating Requests) / Total Requests',
    explanation: 'Computes Apdex performance ratings (index from 0 to 1) based on user response times and configured thresholds.',
    example: 'With a 1.2-second threshold, achieving 85 satisfied and 10 tolerated requests yields an 0.90 Apdex score.',
    inputs: [
      { id: 'satisfiedCount', label: 'Satisfied Requests (Fast Response)', type: 'number', defaultValue: 820, min: 0 },
      { id: 'toleratedCount', label: 'Tolerating Requests (Acceptable Delay)', type: 'number', defaultValue: 140, min: 0 },
      { id: 'failedCount', label: 'Frustrated / Failed Requests', type: 'number', defaultValue: 40, min: 0 }
    ],
    faq: [
      { question: 'What is APDEX?', answer: 'APDEX (Application Performance Index) is an open standard that measures server performance relative to a defined response time expectation.' }
    ],
    relatedSlugs: ['code-quality', 'web-ops'],
    seoTitle: 'Application APDEX Performance Score Calculator',
    seoDescription: 'Benchmark web interface speed, monitor user response ratings, and track system latency levels.',
    calculate: (inputs) => {
      const sat = Number(inputs.satisfiedCount || 0);
      const tol = Number(inputs.toleratedCount || 0);
      const fail = Number(inputs.failedCount || 0);

      const total = sat + tol + fail;
      if (total === 0) {
        return {
          results: [{ label: 'APDEX Level Score', value: '0.00' }]
        };
      }

      const apdex = (sat + (tol * 0.5)) / total;
      const pctErrors = (fail / total) * 100;

      let status = 'Excellent UI Speed';
      if (apdex < 0.7) status = 'Severe Performance Delay';
      else if (apdex < 0.85) status = 'Tolerable Speed Posture';

      return {
        results: [
          { label: 'APDEX Level Score', value: apdex.toFixed(2), unit: 'Index [0-1]', isPrimary: true },
          { label: 'Overall App Experience', value: status, isPrimary: true },
          { label: 'System Failure Code Ratio', value: pctErrors.toFixed(1), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'code-quality',
    name: 'Code Quality Calculator',
    slug: 'code-quality',
    category: 'software-engineering',
    description: 'Grade codebases using test coverage, lint deviations, duplication, and modularity.',
    formula: 'Quality Index = (Test Coverage * 0.4) + (Maintainability Index * 0.4) - Complexity Penality',
    explanation: 'Audits structural quality indicators like cyclomatic complexity, code duplication densities, and unit test ratios.',
    example: 'An 85% test coverage codebase with low duplication scores earns an Excellent Quality rating of 91/100.',
    inputs: [
      { id: 'testCoveragePct', label: 'Unit Test Suite Line Coverage', type: 'number', defaultValue: 75, min: 0, max: 100, step: 1, unit: '%' },
      { id: 'duplicatedLinesPct', label: 'Duplicated / Copy-Paste Code Ratio', type: 'number', defaultValue: 8, min: 0, max: 100, step: 0.5, unit: '%' },
      { id: 'cyclomaticComplexity', label: 'Average Method Cyclomatic Complexity', type: 'number', defaultValue: 6, min: 1, max: 50, step: 1 }
    ],
    faq: [
      { question: 'What is cyclomatic complexity?', answer: 'Cyclomatic complexity counts the number of linearly independent paths through your code, reflecting its cognitive load and the difficulty of testing it.' }
    ],
    relatedSlugs: ['technical-debt', 'app-performance'],
    seoTitle: 'Codebase Quality Index & Static Analysis Calculator',
    seoDescription: 'Input test coverage percentages, cyclomatic complexity scores, and duplication ratios to grade your codebase.',
    calculate: (inputs) => {
      const coverage = Number(inputs.testCoveragePct || 0);
      const dup = Number(inputs.duplicatedLinesPct || 0);
      const complexity = Number(inputs.cyclomaticComplexity || 5);

      let quality = 100;

      // Penalize missing test coverage
      quality -= (100 - coverage) * 0.35;
      
      // Penalize duplicated lines
      quality -= dup * 2.5;

      // Penalize cyclomatic complexity
      if (complexity > 10) quality -= (complexity - 10) * 4;

      const finalGrade = Math.min(100, Math.max(5, Math.round(quality)));

      let text = 'Highly Maintainable Code';
      if (finalGrade < 50) text = 'Legacy Refactoring Alert';
      else if (finalGrade < 80) text = 'Standard Tech Structure';

      return {
        results: [
          { label: 'Code Quality Rating', value: finalGrade, unit: '/100', isPrimary: true },
          { label: 'Technical Quality Posture', value: text, isPrimary: true },
          { label: 'Estimated Maintenance Risk', value: complexity > 15 ? 'Critical' : 'Low' }
        ]
      };
    }
  },
  {
    id: 'technical-debt',
    name: 'Technical Debt Calculator',
    slug: 'technical-debt',
    category: 'software-engineering',
    description: 'Estimate refactoring hours and identify the high-cost impact of deferred engineering work.',
    formula: 'Remediation Effort = Complexity Hours + Outdated API Replacement Days',
    explanation: 'Assesses technical debt ratios by calculating development time spent on bug patches versus building new features.',
    example: 'A 50,000-line codebase with outdated packages might require 160 engineering hours of cleanup.',
    inputs: [
      { id: 'frameworkVersionAge', label: 'Core Libraries / Framework Lifespan Outdated', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Up-to-Date / Modern releases', value: 'clean' },
        { label: '1 to 2 major versions behind', value: 'moderate' },
        { label: 'Severely outdated / EOL frameworks', value: 'severe' }
      ]},
      { id: 'bypassLintRuleLogs', label: 'Number of Active Linter Bypass Rules / TODOs', type: 'number', defaultValue: 45, min: 0, max: 1000 },
      { id: 'originalBuildHours', label: 'Original Project Construction (hours)', type: 'number', defaultValue: 1000, min: 100, max: 100000, step: 100 }
    ],
    faq: [
      { question: 'What is technical debt ratio?', answer: 'The technical debt ratio is the cost of refactoring software divided by the cost of rebuilding it of scratch. A ratio under 5% reflects a healthy, easily maintained system.' }
    ],
    relatedSlugs: ['code-quality', 'software-maintenance'],
    seoTitle: 'Technical Debt Index & Refactoring Hour Estimator',
    seoDescription: 'Estimate refactoring costs, analyze linter trends, and determine software rewrite timelines.',
    calculate: (inputs) => {
      const age = inputs.frameworkVersionAge || 'moderate';
      const bypassCount = Number(inputs.bypassLintRuleLogs || 0);
      const buildHours = Number(inputs.originalBuildHours || 1000);

      // Estimate rewrite/refactoring effort
      let refactorHours = 0;
      if (age === 'moderate') refactorHours += buildHours * 0.1;
      if (age === 'severe') refactorHours += buildHours * 0.35;

      refactorHours += bypassCount * 1.5; // average 1.5h to resolve a bypass/TODO correctly

      const debtRatio = buildHours > 0 ? (refactorHours / buildHours) * 100 : 0;

      return {
        results: [
          { label: 'Estimated Refactoring Time', value: Math.ceil(refactorHours), unit: 'hours', isPrimary: true },
          { label: 'Technical Debt Ratio', value: Math.min(100, Number(debtRatio.toFixed(1))), unit: '%', isPrimary: true },
          { label: 'Recommended Action', value: debtRatio > 30 ? 'Rebuild/Major Rewrite Needed' : 'Incremental Refactoring' }
        ]
      };
    }
  },

  // ====================================== CYBERSECURITY PROFESSIONAL ======================================
  {
    id: 'vulnerability-priority',
    name: 'Vulnerability Priority Calculator',
    slug: 'vulnerability-priority',
    category: 'cybersecurity',
    description: 'Structure custom vulnerability priority scores using CVSS metrics and operational data.',
    formula: 'Score = CVSS Base * (Asset Value Multiplier) * (Exploitability Index)',
    explanation: 'Uses OWASP and CVSS v3 patterns to calculate vulnerability urgency ratings, helping team members resolve threats quickly.',
    example: 'An SQL Injection vulnerability (CVSS 9.8) in a main checkout database yields immediate emergency priorities.',
    inputs: [
      { id: 'cvssBaseScore', label: 'CVSS v3 Base Score', type: 'number', defaultValue: 7.8, min: 0.1, max: 10.0, step: 0.1 },
      { id: 'assetValueScale', label: 'Target System Priority Classification', type: 'select', defaultValue: 'high', options: [
        { label: 'Critical Core System (Billing Gateway, Customer DB)', value: 'critical' },
        { label: 'Standard Portal (Corporate Website, Help desks)', value: 'high' },
        { label: 'Internal Sandboxed Network (Test environment)', value: 'low' }
      ]},
      { id: 'exploitAvailability', label: 'Public Exploit Availability State', type: 'select', defaultValue: 'poc', options: [
        { label: 'Active Wild Exploit (Immediate Threat)', value: 'wild' },
        { label: 'Proof-of-Concept Exploit Published', value: 'poc' },
        { label: 'Theoretical / No Public Exploit Available', value: 'theoretical' }
      ]}
    ],
    faq: [
      { question: 'What is cvss v3?', answer: 'The Common Vulnerability Scoring System (CVSS) is an open industry standard that rates cybersecurity vulnerabilities based on exploitability and impact.' }
    ],
    relatedSlugs: ['risk-assessment', 'incident-impact'],
    seoTitle: 'CVSS Vulnerability Priority & Remediation Calculator',
    seoDescription: 'Calculate actual vulnerability priority metrics. Prioritize software dependency risks and system vulnerabilities.',
    calculate: (inputs) => {
      const cvss = Number(inputs.cvssBaseScore || 7.0);
      const asset = inputs.assetValueScale || 'high';
      const exploit = inputs.exploitAvailability || 'poc';

      let assetMultiplier = 1.0;
      if (asset === 'critical') assetMultiplier = 1.5;
      if (asset === 'low') assetMultiplier = 0.5;

      let exploitMultiplier = 1.0;
      if (exploit === 'wild') exploitMultiplier = 1.6;
      if (exploit === 'theoretical') exploitMultiplier = 0.6;

      const priorityScore = cvss * assetMultiplier * exploitMultiplier;
      const constrainedPriority = Math.min(10, Math.max(0.1, Number(priorityScore.toFixed(1))));

      let color = 'High Priority Patch';
      if (constrainedPriority >= 9.0) color = 'Immediate emergency Patch';
      else if (constrainedPriority < 5.0) color = 'Low priority backlog';

      return {
        results: [
          { label: 'Calculated Action Priority', value: constrainedPriority, unit: '/10.0', isPrimary: true },
          { label: 'Priority Classification', value: color, isPrimary: true },
          { label: 'Adjusted Score Impact Factor', value: `${Math.round(assetMultiplier * exploitMultiplier * 100)}%`, unit: 'of CVSS scale' }
        ]
      };
    }
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Calculator',
    slug: 'risk-assessment',
    category: 'cybersecurity',
    description: 'Calculate risk scores using threat likelihood and damage values.',
    formula: 'Risk Score = Threat Likelihood * Damage Impact Scale',
    explanation: 'Helps IT coordinators plan defense configurations using qualitative risk evaluation models.',
    example: 'A threat with a High (4/5) likelihood and High (4/5) impact yields a critical risk index of 16/25.',
    inputs: [
      { id: 'likelihoodValue', label: 'Potential Threat Likelihood Rating', type: 'select', defaultValue: 3, options: [
        { label: 'Almost certain to manifest (5)', value: 5 },
        { label: 'Frequent occurrences expected (4)', value: 4 },
        { label: 'Moderate occurrence likelihood (3)', value: 3 },
        { label: 'Unlikely / Isolated edge event (2)', value: 2 },
        { label: 'Extremely remote threat (1)', value: 1 }
      ]},
      { id: 'damageImpactScale', label: 'Operational Impact Scale if Realized', type: 'select', defaultValue: 4, options: [
        { label: 'Catastrophic (Total system compromise / Legal bankruptcy) (5)', value: 5 },
        { label: 'Major (System offline, data loss) (4)', value: 4 },
        { label: 'Moderate (Isolated customer interruption) (3)', value: 3 },
        { label: 'Minor (Slight inconvenience) (2)', value: 2 },
        { label: 'Negligible impact (1)', value: 1 }
      ]}
    ],
    faq: [
      { question: 'How is risk mitigated?', answer: 'Risk is addressed through four core actions: avoidance (changing processes), transfer (cyber insurance), mitigation (improving security), or acceptance (retaining low impact risks).' }
    ],
    relatedSlugs: ['vulnerability-priority', 'incident-impact'],
    seoTitle: 'Interactive Information Security Risk Matrix Calculator',
    seoDescription: 'Benchmark IT vulnerabilities. Calculate risk scores using likelihood and impact coordinates.',
    calculate: (inputs) => {
      const l = Number(inputs.likelihoodValue || 3);
      const i = Number(inputs.damageImpactScale || 3);

      const computedValue = l * i;

      let riskText = 'Low Risk Tolerance';
      if (computedValue >= 16) riskText = 'Immediate Mitigation Required';
      else if (computedValue >= 9) riskText = 'Active Monitoring Advisory';

      return {
        results: [
          { label: 'Risk Assessment Level', value: computedValue, unit: '/25', isPrimary: true },
          { label: 'Security Classification', value: riskText, isPrimary: true },
          { label: 'Qualitative Vector Coordinate', value: `L:${l} x I:${i}` }
        ]
      };
    }
  },
  {
    id: 'security-maturity',
    name: 'Security Maturity Calculator',
    slug: 'security-maturity',
    category: 'cybersecurity',
    description: 'Grade security governance using the NIST framework, measuring patch routines, auditing, and controls.',
    formula: 'Maturity Level = Average(Controls Score)',
    explanation: 'Grades cybersecurity capability (scale 1 to 5) across major security categories: Identify, Protect, Detect, Respond, and Recover.',
    example: 'Establishing continuous monitoring features upgrades your posture to Maturity Level 4 (Managed).',
    inputs: [
      { id: 'nistIdentify', label: 'Identify Level (Asset & Identity audits)', type: 'select', defaultValue: 3, options: [
        { label: 'No structured tracking lists', value: 1 },
        { label: 'Basic manual sheets (Initial)', value: 2 },
        { label: 'Active automated system listings (Targeted)', value: 3 },
        { label: 'Policies reviewed regularly by executives (Strategic)', value: 4 },
        { label: 'Continuous AI/automated tracking audits (Advanced)', value: 5 }
      ]},
      { id: 'nistProtect', label: 'Protect Level (Drives, keys, patching safety)', type: 'select', defaultValue: 2, options: [
        { label: 'Simple manual tracking tools (1)', value: 1 },
        { label: 'Baseline credentials locked down (2)', value: 2 },
        { label: 'Proactive MFA & encryption policies (3)', value: 3 },
        { label: 'Standard zero-trust isolation networks (4)', value: 4 },
        { label: 'AI threat intercept configurations (5)', value: 5 }
      ]},
      { id: 'nistDetect', label: 'Detect Level (Log monitoring, SIEM rules)', type: 'select', defaultValue: 2, options: [
        { label: 'Zero centralized logs', value: 1 },
        { label: 'Basic cloud tracing enabled', value: 2 },
        { label: 'Centralized SIEM monitoring with priority triage rules', value: 3 },
        { label: 'Continuous human threat hunting loops', value: 4 }
      ]}
    ],
    faq: [
      { question: 'What are the NIST cybersecurity maturity tiers?', answer: 'The tiers are: 1 (Ad-hoc Initial), 2 (Risk Informed), 3 (Repeatable/Documented), 4 (Managed Measureable), and 5 (Optimized Continuous adaptation).' }
    ],
    relatedSlugs: ['risk-assessment', 'security-checklist'],
    seoTitle: 'NIST Framework Security Maturity Audit & Scoring Calculator',
    seoDescription: 'Audit organizational security governance. Identify capabilities and benchmark controls against the NIST cyber framework.',
    calculate: (inputs) => {
      const iden = Number(inputs.nistIdentify || 1);
      const prot = Number(inputs.nistProtect || 1);
      const det = Number(inputs.nistDetect || 1);

      const finalMaturityIndex = (iden + prot + det) / 3;

      let maturityLabel = 'Ad-Hoc / Initial';
      if (finalMaturityIndex >= 4.5) maturityLabel = 'Optimized & Continuously Evaluated';
      else if (finalMaturityIndex >= 3.5) maturityLabel = 'Proactively Managed & Measured';
      else if (finalMaturityIndex >= 2.5) maturityLabel = 'Repeatable Controls Standardized';
      else if (finalMaturityIndex >= 1.5) maturityLabel = 'Informal / Risk Aware';

      return {
        results: [
          { label: 'Maturity Level Rating', value: finalMaturityIndex.toFixed(2), unit: 'Level [1-5]', isPrimary: true },
          { label: 'NIST Maturity Classification', value: maturityLabel, isPrimary: true },
          { label: 'Identified Process Repeatability', value: finalMaturityIndex >= 3.0 ? 'High repeatability' : 'Fragile manual workflow' }
        ]
      };
    }
  },
  {
    id: 'incident-impact',
    name: 'Incident Impact Calculator',
    slug: 'incident-impact',
    category: 'cybersecurity',
    description: 'Calculate the total cost of a data breach, including downtime, legal expenses, and forensics.',
    formula: 'Incident Cost = Workload Downtime Loss + Legal Fines + PR Rescue Expense + Forensics',
    explanation: 'Models total monetary losses from security breaches by calculating forensic costs, lost business hours, regulatory fines, and customer support remediation efforts.',
    example: 'A ransomware breach that locks system servers for 3 days can cost mid-size corporations upwards of $78,000.',
    inputs: [
      { id: 'downtimeHours', label: 'Critical Service Interruption (Hours)', type: 'number', defaultValue: 24, min: 1, max: 720 },
      { id: 'hourlyOfflineLoss', label: 'Average Corporate Revenue Loss per Hour ($)', type: 'number', defaultValue: 1200, min: 0, step: 100 },
      { id: 'compromisedRecords', label: 'Number of Compromised PII User Records', type: 'number', defaultValue: 5000, min: 0, step: 100 },
      { id: 'forensicFinesS', label: 'Estimated Forensics, Legal Counsel & PR Fines ($)', type: 'number', defaultValue: 15000, min: 0, step: 500 }
    ],
    faq: [
      { question: 'What is the average cost of a compromised PII record?', answer: 'IBM reports average costs of about $150 to $180 per compromised record, factoring in discovery efforts, regulatory penalties, and customer churn.' }
    ],
    relatedSlugs: ['recovery-time', 'risk-assessment'],
    seoTitle: 'Cyber Security Breach Incident Financial Impact Calculator',
    seoDescription: 'Calculate the true financial impact of security incidents, including ransomware blockages, customer record leaks, and server downtime.',
    calculate: (inputs) => {
      const downtime = Number(inputs.downtimeHours || 0);
      const revPerHour = Number(inputs.hourlyOfflineLoss || 100);
      const records = Number(inputs.compromisedRecords || 0);
      const overhead = Number(inputs.forensicFinesS || 5000);

      const systemDowntimeCost = downtime * revPerHour;
      
      // industry standard of $150 per file data compromise
      const userRemediationCost = records * 155; 

      const aggregateBreachImpact = systemDowntimeCost + userRemediationCost + overhead;

      return {
        results: [
          { label: 'Projected Breach Impact Cost', value: Math.round(aggregateBreachImpact), unit: '$', isPrimary: true },
          { label: 'Lost Operating Revenue', value: systemDowntimeCost, unit: '$', isPrimary: true },
          { label: 'Record Leak Liability Cost', value: userRemediationCost, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'recovery-time',
    name: 'Recovery Time Calculator',
    slug: 'recovery-time',
    category: 'cybersecurity',
    description: 'Determine recovery timelines based on database size, network bandwidth, and server validation routines.',
    formula: 'Restore Hours = DB Size / Download Bandwidth + Server Configuration + QA checks',
    explanation: 'Calculates active backup restore times, network ingestion speeds, and server validation limits to define Recovery Time Objectives (RTO).',
    example: 'Restoring a 500 GB backup image over a 150 Mbps network connection requires about 7.4 hours in transit.',
    inputs: [
      { id: 'dbSizeGb', label: 'Aggregate Target Database Size (GB)', type: 'number', defaultValue: 450, min: 1, max: 100000, step: 10 },
      { id: 'networkTransitSpeed', label: 'Ingestion Download Connection (Mbps)', type: 'number', defaultValue: 100, min: 10, max: 10000, step: 10 },
      { id: 'serverConfigHours', label: 'Server Provisioning & Partition Setup (Hours)', type: 'number', defaultValue: 3, min: 0.5, max: 48, step: 0.5 }
    ],
    faq: [
      { question: 'What are RPO and RTO?', answer: 'RTO (Recovery Time Objective) targets how quickly systems must be restored after a crash. RPO (Recovery Point Objective) targets allowable data loss based on backup update intervals.' }
    ],
    relatedSlugs: ['backup-strategy', 'incident-impact'],
    seoTitle: 'RTO Recovery Time & Data Restoration Speed Calculator',
    seoDescription: 'Estimate data restore times and system rebuilding schedules to calculate business resumption dates.',
    calculate: (inputs) => {
      const sizeGb = Number(inputs.dbSizeGb || 100);
      const speedMbps = Number(inputs.networkTransitSpeed || 100);
      const configH = Number(inputs.serverConfigHours || 2);

      // Convert size in GB to Megabits
      const gigabits = sizeGb * 8;
      const megabits = gigabits * 1000;
      const downloadSeconds = megabits / speedMbps;
      const downloadHours = downloadSeconds / 3600;

      const totalRequiredRecoveryH = downloadHours + configH;

      return {
        results: [
          { label: 'Total Estimated RTO Timeline', value: totalRequiredRecoveryH.toFixed(2), unit: 'hours', isPrimary: true },
          { label: 'Data Download Duration', value: downloadHours.toFixed(2), unit: 'hours', isPrimary: true },
          { label: 'Server Configuration Window', value: configH, unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'backup-strategy',
    name: 'Backup Strategy Calculator',
    slug: 'backup-strategy',
    category: 'cybersecurity',
    description: 'Optimize backup strategies by calculating data growth rates, retention rules, and required storage pools.',
    formula: 'Required Storage = Full Image Density + Delta Size * Lifecycle SpanCount',
    explanation: 'Assesses storage consumption over time based on deduplication ratios, delta size estimates, active retention policies, and incremental backup schedules.',
    example: 'Storing a 200 GB baseline seed with a 15 GB daily delta with WORM security models requires over 1.25 TB of storage over 90 days.',
    inputs: [
      { id: 'seedSizeGb', label: 'Baseline Seed File Size (GB)', type: 'number', defaultValue: 250, min: 10, max: 50000, step: 10 },
      { id: 'dailyDeltaGb', label: 'Average Daily Incremental Change (GB)', type: 'number', defaultValue: 12, min: 1, max: 1000, step: 1 },
      { id: 'retentionDays', label: 'Retention Period Schedule (Days)', type: 'number', defaultValue: 45, min: 1, max: 365, step: 5 }
    ],
    faq: [
      { question: 'What is the 3-2-1 backup strategy?', answer: 'Maintain at least 3 total copies of critical files: 1 active work copy, 2 local backup copies stored on different media types, and 1 offsite/cloud copy.' }
    ],
    relatedSlugs: ['recovery-time', 'storage-planning'],
    seoTitle: 'IT Backup Strategy & Cumulative Storage Space Calculator',
    seoDescription: 'Structure daily incremental delta logs and calculate required backup storage pools with deduplication factors.',
    calculate: (inputs) => {
      const seed = Number(inputs.seedSizeGb || 100);
      const delta = Number(inputs.dailyDeltaGb || 5);
      const retention = Number(inputs.retentionDays || 30);

      const totalBaseSpace = seed + (delta * retention);
      // Deduplication mitigation usually manages 20% savings on standard filesystems
      const dedupSpace = totalBaseSpace * 0.8;

      return {
        results: [
          { label: 'Backup Storage Required', value: Math.ceil(totalBaseSpace / 1000), unit: 'TB (No Dedup)', isPrimary: true },
          { label: 'Deduplicated Storage Estimate', value: Math.ceil(dedupSpace / 1000), unit: 'TB (Deduplicated)', isPrimary: true },
          { label: 'Retention Period Frame', value: retention, unit: 'days retention' }
        ]
      };
    }
  },

  // ====================================== AI / MACHINE LEARNING ======================================
  {
    id: 'ai-model-cost',
    name: 'AI Model Cost Calculator',
    slug: 'ai-model-cost',
    category: 'ai',
    description: 'Forecast monthly AI API expenditures for models like Gemini, Claude, or GPT-4.',
    formula: 'Expenses = (Input Tokens * Input rate) + (Output Tokens * Output rate)',
    explanation: 'Collates average prompt sizes, daily user sessions, and engine types (Light, Medium, Heavy) to project monthly software bills.',
    example: 'An app serving 8,000 monthly prompts using standard model configurations averages about $120.00 in cloud API costs.',
    inputs: [
      { id: 'dailyQueries', label: 'Expected Active Queries per Day', type: 'number', defaultValue: 300, min: 1, max: 100000 },
      { id: 'avgInputTokens', label: 'Average Input Tokens per Query', type: 'number', defaultValue: 800, min: 10, max: 128000, step: 10 },
      { id: 'avgOutputTokens', label: 'Average Expected Output response', type: 'number', defaultValue: 450, min: 10, max: 16000, step: 10 },
      { id: 'apiModelTier', label: 'Model API Rate Tier Setting', type: 'select', defaultValue: 'gemini-flash', options: [
        { label: 'Gemini flash (Highly Cost-Efficient - $0.075 /M)', value: 'gemini-flash' },
        { label: 'Standard Tier (Claude Haiku / GPT-4o-mini - $0.15 /M)', value: 'standard-mini' },
        { label: 'Heavy/Premium (GPT-4o / Claude Sonnet - $2.50 /M)', value: 'premium' }
      ]}
    ],
    faq: [
      { question: 'What is a token in LLM APIs?', answer: 'A token is a structural fragment of a word (averaging about 4 characters or 0.75 words in English), serving as the baseline billing metric for AI architectures.' }
    ],
    relatedSlugs: ['ai-token-usage', 'ai-compute'],
    seoTitle: 'AI LLM API Monthly Cost & Query Forecast Calculator',
    seoDescription: 'Forecast monthly AI model bills. Plan budgets across Gemini, Claude, and GPT-4 tiers using token metrics.',
    calculate: (inputs) => {
      const daily = Number(inputs.dailyQueries || 100);
      const incomingK = Number(inputs.avgInputTokens || 500);
      const outgoingK = Number(inputs.avgOutputTokens || 300);
      const tier = inputs.apiModelTier || 'gemini-flash';

      let inputRatePerMillion = 0.075;
      let outputRatePerMillion = 0.3;

      if (tier === 'standard-mini') {
        inputRatePerMillion = 0.15;
        outputRatePerMillion = 0.6;
      } else if (tier === 'premium') {
        inputRatePerMillion = 2.5;
        outputRatePerMillion = 10.0;
      }

      const dailyInputTokens = daily * incomingK;
      const dailyOutputTokens = daily * outgoingK;

      const monthlyInputCost = (dailyInputTokens * 30 * inputRatePerMillion) / 1000000;
      const monthlyOutputCost = (dailyOutputTokens * 30 * outputRatePerMillion) / 1000000;
      const totalMonthlyCost = monthlyInputCost + monthlyOutputCost;

      return {
        results: [
          { label: 'Projected Monthly Bill', value: totalMonthlyCost.toFixed(2), unit: '$ / month', isPrimary: true },
          { label: 'Daily Processing Volume', value: ((dailyInputTokens + dailyOutputTokens) / 1000).toFixed(0), unit: 'k Tokens / day' },
          { label: 'Est. Quarterly Expense', value: (totalMonthlyCost * 3).toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'ai-usage',
    name: 'AI Usage Calculator',
    slug: 'ai-usage',
    category: 'ai',
    description: 'Track aggregate model transactions, cache hit ratios, and API throughput limits.',
    formula: 'Throughput = Success Transactions / Elapsed System Span',
    explanation: 'Audits request success metrics to monitor concurrency loads, active caching benefits, and api quota use.',
    example: 'Implementing prompt caching can boost cost savings up to 45% on similar recurrent requests.',
    inputs: [
      { id: 'totalRequests', label: 'Aggregated Monthly Operations', type: 'number', defaultValue: 15000, min: 0 },
      { id: 'cachedHitsPct', label: 'Average Caching Reuse / Hit Ratio', type: 'number', defaultValue: 30, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'errorRatioPct', label: 'Request Error/Retry Rate', type: 'number', defaultValue: 2.5, min: 0, max: 100, step: 0.5, unit: '%' }
    ],
    faq: [
      { question: 'What is prompt caching?', answer: 'Prompt caching stores long context elements (system prompts, pdf additions) on the API servers so developers only pay a small lookup rate rather than parsing the document each turn.' }
    ],
    relatedSlugs: ['ai-model-cost', 'ai-token-usage'],
    seoTitle: 'AI API Usage Rate & Caching Performance Calculator',
    seoDescription: 'Benchmark AI application throughput, tracking API errors, concurrency margins, and cash savings from cached prompt structures.',
    calculate: (inputs) => {
      const requests = Number(inputs.totalRequests || 1000);
      const cachePct = Number(inputs.cachedHitsPct || 0) / 100;
      const errorPct = Number(inputs.errorRatioPct || 0) / 100;

      const failedCount = requests * errorPct;
      const completedRequests = requests - failedCount;
      const cachedSavingsCount = completedRequests * cachePct;

      return {
        results: [
          { label: 'Verifiable Saved Requests', value: Math.round(cachedSavingsCount), isPrimary: true },
          { label: 'Failed Transaction Rescues', value: Math.round(failedCount), isPrimary: true },
          { label: 'Successful Pipeline Outputs', value: Math.round(completedRequests - cachedSavingsCount), unit: 'raw processing' }
        ]
      };
    }
  },
  {
    id: 'ai-token-usage',
    name: 'AI Token Usage Calculator',
    slug: 'ai-token-usage',
    category: 'ai',
    description: 'Estimate word-to-token conversions and calculate token density for long documents.',
    formula: 'Tokens = English Character Count / 4 * Language Multiplier',
    explanation: 'Converts file character metrics, paragraphs, and multi-language inputs into approximate token metrics to prevent API failures.',
    example: 'An English document of 3,000 words yields approximately 4,000 prompt tokens.',
    inputs: [
      { id: 'wordCountVal', label: 'Source Document Word Count', type: 'number', defaultValue: 2500, min: 1, max: 1000000, step: 100 },
      { id: 'langSelection', label: 'Primary Language Selection', type: 'select', defaultValue: 'en', options: [
        { label: 'English (Character packing)', value: 'en' },
        { label: 'Spanish / French (1.3x token expansion)', value: 'eu' },
        { label: 'Korean / Chinese / Japanese (2-3x token expansion)', value: 'asia' }
      ]}
    ],
    faq: [
      { question: 'Why does language impact token sizes?', answer: 'Tokenizers are trained heavily on English texts. Standard sub-word splits in other languages or multi-byte characters require more splits, increasing token sizes.' }
    ],
    relatedSlugs: ['ai-model-cost', 'ai-storage'],
    seoTitle: 'Interactive Document Word-to-Token Count Calculator',
    seoDescription: 'Convert plain words into approximate API token parameters across diverse languages and models.',
    calculate: (inputs) => {
      const words = Number(inputs.wordCountVal || 1000);
      const lang = inputs.langSelection || 'en';

      let factor = 1.33; // English standard: 100 words = ~133 tokens
      if (lang === 'eu') factor = 1.75;
      if (lang === 'asia') factor = 3.2;

      const estimatedTokens = words * factor;

      return {
        results: [
          { label: 'Projected Token Count', value: Math.round(estimatedTokens), unit: 'tokens', isPrimary: true },
          { label: 'Est. Paragraph Splits', value: Math.ceil(words / 150), isPrimary: true },
          { label: 'Token packing density multiplier', value: factor.toFixed(2), unit: 'x ratio' }
        ]
      };
    }
  },
  {
    id: 'ai-storage',
    name: 'AI Storage Calculator',
    slug: 'ai-storage',
    category: 'ai',
    description: 'Calculate vector store database dimensions, embedding pools, and metadata footprints.',
    formula: 'Memory Size = Item Count * Dimension Size * Precision Bytes + Metadata Allowance',
    explanation: 'Calculates structural storage sizes (KB/MB) for Vector DB platforms (Pinecone, pgvector) using vector count and dimensions.',
    example: 'A vector database of 100,000 vectors with 1536 dimensions using float32 precision requires ~614 MB of storage.',
    inputs: [
      { id: 'vectorCount', label: 'Total Vector Embedding Entries', type: 'number', defaultValue: 250000, min: 100, step: 1000 },
      { id: 'embeddingDim', label: 'Embedding Dimension size (e.g., text-embedding-3-small)', type: 'select', defaultValue: 1536, options: [
        { label: '1536 Dimension (OpenAI / standard modern text)', value: 1536 },
        { label: '768 Dimension (Gemini embeddings)', value: 768 },
        { label: '384 Dimension (Lightweight / SentenceTransformers)', value: 384 }
      ]},
      { id: 'precisionBit', label: 'Storage Precision Standard', type: 'select', defaultValue: 'float32', options: [
        { label: 'Float32 (4 bytes per coordinate)', value: 'float32' },
        { label: 'Float16 (2 bytes per coordinate)', value: 'float16' },
        { label: 'Binary / Quantized (1 bit per coordinate)', value: 'binary' }
      ]}
    ],
    faq: [
      { question: 'What is vector quantization?', answer: 'Quantization compresses float embeddings (like float32) into smaller bits (like float16 or binary) to reduce database memory use, with minimal impact on retrieval quality.' }
    ],
    relatedSlugs: ['ai-model-cost', 'storage-planning'],
    seoTitle: 'RAG Vector Store Database Storage Space Calculator',
    seoDescription: 'Estimate vector indexes, memory requirements, and embedding metadata storage sizes for AI search pipelines.',
    calculate: (inputs) => {
      const count = Number(inputs.vectorCount || 1000);
      const dim = Number(inputs.embeddingDim || 1536);
      const prec = inputs.precisionBit || 'float32';

      let bytesPerVal = 4;
      if (prec === 'float16') bytesPerVal = 2;
      if (prec === 'binary') bytesPerVal = 1 / 8;

      const singleVectorBytes = dim * bytesPerVal;
      const indexOverheadFactor = 1.25; // standard vector index indexing overhead (e.g. HNSW graph)
      
      const totalIndexSpaceBytes = count * singleVectorBytes * indexOverheadFactor;
      const totalMb = totalIndexSpaceBytes / (1024 * 1024);

      return {
        results: [
          { label: 'Estimated Storage Required', value: totalMb.toFixed(1), unit: 'MB', isPrimary: true },
          { label: 'Single Vector Dimension Size', value: Math.ceil(singleVectorBytes), unit: 'bytes' },
          { label: 'Indexing Structures Overhead', value: '+25%', unit: 'HNSW Graph' }
        ]
      };
    }
  },
  {
    id: 'ai-training-cost',
    name: 'AI Training Cost Calculator',
    slug: 'ai-training-cost',
    category: 'ai',
    description: 'Estimate GPU computing bills, dataset processing spans, and pre-training overhead budgets.',
    formula: 'Cost = GPU Count * Hours * GPU Hourly Charge Rate',
    explanation: 'Models custom fine-tuning and pre-training budgets using cluster size, dataset passes (epochs), and server types.',
    example: 'Fine-tuning a Llama-3 model on a 15,000-sample dataset using 8x A100 GPUs for 6 hours costs about $168.',
    inputs: [
      { id: 'gpuNodeCount', label: 'Allocated GPU Node Count', type: 'number', defaultValue: 8, min: 1, max: 2048 },
      { id: 'gpuTypeSelection', label: 'Cloud GPU Machine Type', type: 'select', defaultValue: 'a100-s', options: [
        { label: 'NVIDIA H100 GPU cluster node ($4.50 /h)', value: 'h100-s' },
        { label: 'NVIDIA A100 GPU cluster node ($3.50 /h)', value: 'a100-s' },
        { label: 'NVIDIA L4/T4 Efficiency node ($0.75 /h)', value: 'l4-s' }
      ]},
      { id: 'runDurationHours', label: 'Projected Training Code Time (Hours)', type: 'number', defaultValue: 12, min: 1, max: 8760 }
    ],
    faq: [
      { question: 'What is deep-learning training efficiency?', answer: 'GPU training efficiency measures actual compute utilization, tracking communication overhead, network traffic bottlenecks, and memory limitations.' }
    ],
    relatedSlugs: ['ai-compute', 'ai-model-cost'],
    seoTitle: 'AI Deep Learning Training & GPU Farm Budget Calculator',
    seoDescription: 'Calculate training costs. Plan budgets across H100 and A100 instances for your fine-tuning project.',
    calculate: (inputs) => {
      const gpus = Number(inputs.gpuNodeCount || 4);
      const gpuType = inputs.gpuTypeSelection || 'a100-s';
      const duration = Number(inputs.runDurationHours || 8);

      let hourlyRate = 3.50;
      if (gpuType === 'h100-s') hourlyRate = 4.50;
      if (gpuType === 'l4-s') hourlyRate = 0.75;

      const totalComputeHours = gpus * duration;
      const combinedSurcharge = totalComputeHours * hourlyRate;

      return {
        results: [
          { label: 'Estimated Compute Budget', value: Math.round(combinedSurcharge), unit: '$', isPrimary: true },
          { label: 'Aggregate Compute Engine Volume', value: totalComputeHours, unit: 'GPU-hours', isPrimary: true },
          { label: 'System Billing Hourly RunRate', value: (gpus * hourlyRate).toFixed(2), unit: '$ / hour' }
        ]
      };
    }
  },
  {
    id: 'ai-compute',
    name: 'AI Compute Calculator',
    slug: 'ai-compute',
    category: 'ai',
    description: 'Determine required FLOPS scale and parallel GPU memory sizes for handling model parameters.',
    formula: 'Needed GPU vRAM = Parameter Count in Billions * Precision Factor (Bytes)',
    explanation: 'Calculates active vRAM memory and FP16 compute targets for model weights, enabling correct server sizing.',
    example: 'Deploying a 70B parameter model at 8-bit quantization requires at least 70 GB of vRAM for weights.',
    inputs: [
      { id: 'modelParamsBillion', label: 'Model Parameter Count (Billion)', type: 'number', defaultValue: 70, min: 1, max: 2000 },
      { id: 'quantizationBits', label: 'Quantization Type (vRAM Precision)', type: 'select', defaultValue: 'bf16', options: [
        { label: 'Uncompressed (BF16 / FP16 - 2 bytes/param)', value: 'bf16' },
        { label: 'Int8 Quantized (1 byte/param)', value: 'int8' },
        { label: 'Int4 Quantized (0.5 byte/param)', value: 'int4' }
      ]},
      { id: 'concurrentContextK', label: 'Target Context / Prompts Size (K Tokens)', type: 'number', defaultValue: 8, min: 1, max: 128 }
    ],
    faq: [
      { question: 'How is prompt context vRAM calculated?', answer: 'Context storage space scales using quadratic complexity indices relative to token count (due to KV cache storage needs in attention layers).' }
    ],
    relatedSlugs: ['ai-training-cost', 'ai-model-cost'],
    seoTitle: 'AI Parameter vRAM Space & Model Compute Calculator',
    seoDescription: 'Determine GPU hardware requirements, analyze parameter quantization footprints, and calculate KV-cache memory sizes.',
    calculate: (inputs) => {
      const params = Number(inputs.modelParamsBillion || 8);
      const quant = inputs.quantizationBits || 'bf16';
      const context = Number(inputs.concurrentContextK || 4);

      let bytesPerParam = 2.0;
      if (quant === 'int8') bytesPerParam = 1.0;
      if (quant === 'int4') bytesPerParam = 0.55; // factor in some tiny quantization group scales

      const parameterVramGb = params * bytesPerParam;
      
      // Rough estimate of KV Cache overhead in standard Transformer architecture
      const kvCacheGb = (params * context * 0.05);
      const totalNeededGb = (parameterVramGb + kvCacheGb) * 1.2; // 20% system CUDA runtime safety headroom

      return {
        results: [
          { label: 'Recommended Minimum GPU vRAM', value: Math.ceil(totalNeededGb), unit: 'GB', isPrimary: true },
          { label: 'Weight Storage Fraction', value: parameterVramGb.toFixed(1), unit: 'GB', isPrimary: true },
          { label: 'Context KV-Cache Overhead', value: Math.ceil(kvCacheGb), unit: 'GB' }
        ]
      };
    }
  }
];
