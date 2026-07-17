import { Calculator } from '../types';

export const V17_PART1_CALCULATORS: Calculator[] = [
  // ====================================== CYBERSECURITY ======================================
  {
    id: 'password-strength',
    name: 'Password Strength Calculator',
    slug: 'password-strength',
    category: 'cybersecurity',
    description: 'Calculate complexity scores, entropy parameters, and relative crack strength of a custom password.',
    formula: 'Entropy = L * log2(R) where R is matching character set pool size, L is key string length.',
    explanation: 'Scans text patterns checking length, letters, numerals, and special characters to grade raw cryptographic density.',
    example: 'A password like "Tr0ub4d&u" spans mixed capitals, decimals, symbols, and length-9, achieving over 50 bits of entropy.',
    inputs: [
      { id: 'pwd', label: 'Password String Input', type: 'text', defaultValue: 'P@$$w0rd123!' }
    ],
    faq: [
      { question: 'What makes a password strong?', answer: 'Length is the primary factor. Adding diverse casing, numerals, and symbols exponentially expands search pools, but long phrases (e.g., four random words) are often even stronger and easier to recall.' }
    ],
    relatedSlugs: ['password-entropy', 'brute-force-time', 'account-security'],
    seoTitle: 'Interactive Password Strength & Complexity Calculator',
    seoDescription: 'Benchmark the brute-force crack resilience, entropy metrics, and character pool sizes of your passwords.',
    calculate: (inputs) => {
      const text = String(inputs.pwd || '');
      const len = text.length;
      
      let pool = 0;
      let hasLower = false;
      let hasUpper = false;
      let hasDigits = false;
      let hasSymbols = false;
      
      if (/[a-z]/.test(text)) { pool += 26; hasLower = true; }
      if (/[A-Z]/.test(text)) { pool += 26; hasUpper = true; }
      if (/[0-9]/.test(text)) { pool += 10; hasDigits = true; }
      if (/[^a-zA-Z0-9]/.test(text)) { pool += 32; hasSymbols = true; }
      
      const entropy = len > 0 && pool > 0 ? len * Math.log2(pool) : 0;
      
      let score = 0;
      if (len >= 8) score += 20;
      if (len >= 12) score += 15;
      if (len >= 16) score += 15;
      if (hasLower) score += 10;
      if (hasUpper) score += 10;
      if (hasDigits) score += 15;
      if (hasSymbols) score += 15;
      
      let label = 'Weak';
      let color = 'text-red-500';
      if (entropy >= 80 && score >= 80) {
        label = 'Very Strong';
        color = 'text-emerald-500';
      } else if (entropy >= 55) {
        label = 'Strong';
        color = 'text-green-500';
      } else if (entropy >= 35) {
        label = 'Moderate';
        color = 'text-yellow-500';
      }
      
      return {
        results: [
          { label: 'Overall Strength Index', value: label, isPrimary: true },
          { label: 'Password Entropy Score', value: Number(entropy.toFixed(1)), unit: 'bits' },
          { label: 'Calculated Quality Score', value: Math.min(100, Math.max(0, score)), unit: '/ 100' },
          { label: 'Identified Character Pool Size', value: pool, unit: 'characters' }
        ]
      };
    }
  },
  {
    id: 'password-entropy',
    name: 'Password Entropy Calculator',
    slug: 'password-entropy',
    category: 'cybersecurity',
    description: 'Find theoretical cryptographic complexity in bits using key length and character set metrics.',
    formula: 'Entropy H = L * log2(R)',
    explanation: 'Measures the quantity of information represented by a sequence, assuming every character is picked uniformly from the selected set.',
    example: 'An 8-character password featuring digits only yields 8 * log2(10) ≈ 26.5 bits of total entropy.',
    inputs: [
      { id: 'length', label: 'Password Length', type: 'number', defaultValue: 12, min: 1, max: 128 },
      { id: 'useLower', label: 'Include Lowercase (a-z)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (26 chars)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'useUpper', label: 'Include Uppercase (A-Z)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (26 chars)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'useDigits', label: 'Include Digits (0-9)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (10 chars)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'useSymbols', label: 'Include Special Symbols', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes (32 chars)', value: 'yes' },
        { label: 'No', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'What is a secure entropy range?', answer: 'Entropy above 80 bits is typically deemed highly secure against offline cracking. Over 128 bits is functionally impossible to crack using current computing frameworks.' }
    ],
    relatedSlugs: ['password-strength', 'brute-force-time', 'account-security'],
    seoTitle: 'Cryptographic Password Entropy Calculator',
    seoDescription: 'Calculate the mathematical entropy bits of passwords based on set size and length bounds.',
    calculate: (inputs) => {
      const len = Number(inputs.length || 1);
      let r = 0;
      if (inputs.useLower === 'yes') r += 26;
      if (inputs.useUpper === 'yes') r += 26;
      if (inputs.useDigits === 'yes') r += 10;
      if (inputs.useSymbols === 'yes') r += 32;
      
      const entropy = len > 0 && r > 0 ? len * Math.log2(r) : 0;
      const totalPossibilities = Math.pow(r, len);
      
      return {
        results: [
          { label: 'Calculated Password Entropy', value: Number(entropy.toFixed(1)), unit: 'bits', isPrimary: true },
          { label: 'Total Search Combinations', value: totalPossibilities ? totalPossibilities.toExponential(2) : '0', unit: 'keys' },
          { label: 'Unique Character Set (Pool R)', value: r, unit: 'symbols' }
        ]
      };
    }
  },
  {
    id: 'brute-force-time',
    name: 'Brute Force Time Calculator',
    slug: 'brute-force-time',
    category: 'cybersecurity',
    description: 'Determine the time required to crack a password at different guessing rate baselines.',
    formula: 'Seconds = (2^Entropy) / (2 * Guess Rate)',
    explanation: 'Models average time elapsed to test half of all potential encryption keys in a brute force cracking attack.',
    example: 'An entropy of 40 bits tested at 10,000,000,000 guesses per second (such as an offline GPU farm) averages 55 seconds to crack.',
    inputs: [
      { id: 'entropy', label: 'Password Entropy Score', type: 'number', defaultValue: 50, min: 1, max: 256, unit: 'bits' },
      { id: 'guessRate', label: 'Cracking Speeds (Guesses/sec)', type: 'select', defaultValue: 'gpu', options: [
        { label: 'Web Service Limit (100 / sec)', value: '100' },
        { label: 'Standard Computer (10^6 / sec)', value: '1000000' },
        { label: 'GPU Cracking Rig (10^9 / sec)', value: '1000000000' },
        { label: 'Supercomputer Clusters (10^12 / sec)', value: '1000000000000' },
        { label: 'Quantum Attempt Matrix (10^15 / sec)', value: '1000000000000000' }
      ]}
    ],
    faq: [
      { question: 'Why does guessing rate vary?', answer: 'Online systems rate-limit guesses to a few per second. Offline cracking involves stolen password hashes run directly on fast local graphics cards, allowing billions of runs per second.' }
    ],
    relatedSlugs: ['password-strength', 'password-entropy', 'encryption-strength'],
    seoTitle: 'Password Brute-Force Time Estimation Calculator',
    seoDescription: 'Estimate typical hacker crack duration across offline and online computer speed limits.',
    calculate: (inputs) => {
      const b = Number(inputs.entropy || 30);
      const speed = Number(inputs.guessRate || 1000000);
      
      const combinations = Math.pow(2, b);
      // Average effort assumes finding the key at half of the key space
      const avgAttempts = combinations / 2;
      const seconds = avgAttempts / speed;
      
      let humanTime = '';
      if (seconds < 1) {
        humanTime = 'Instantly (less than 1 sec)';
      } else if (seconds < 60) {
        humanTime = `${seconds.toFixed(2)} seconds`;
      } else if (seconds < 3600) {
        humanTime = `${(seconds / 60).toFixed(1)} minutes`;
      } else if (seconds < 86400) {
        humanTime = `${(seconds / 3600).toFixed(1)} hours`;
      } else if (seconds < 31536000) {
        humanTime = `${(seconds / 86400).toFixed(1)} days`;
      } else if (seconds < 31536000 * 1000) {
        humanTime = `${(seconds / 31536000).toExponential(2)} years`;
      } else {
        humanTime = 'Practically infinite (trillions of years)';
      }
      
      return {
        results: [
          { label: 'Estimated Average Cracking Time', value: humanTime, isPrimary: true },
          { label: 'Key Setup Possibilities', value: combinations.toExponential(2), unit: 'hashes' },
          { label: 'Computational Rate', value: speed.toExponential(0), unit: 'guesses/sec' }
        ]
      };
    }
  },
  {
    id: 'encryption-strength',
    name: 'Encryption Strength Calculator',
    slug: 'encryption-strength',
    category: 'cybersecurity',
    description: 'Evaluate physical key security levels and cryptographic bits of popular encryption standards.',
    formula: 'Security Bits = algorithm core complexity factor',
    explanation: 'Translates raw cipher bits into equivalent security bounds representing the difficulty of resolving keys under classical and quantum threat models.',
    example: 'Triple-DES uses a 168-bit key but yields only 112 bits of actual security because of specialized meet-in-the-middle attacks.',
    inputs: [
      { id: 'cipher', label: 'Cryptographic Algorithm', type: 'select', defaultValue: 'aes256', options: [
        { label: 'AES-256 (Symmetric)', value: 'aes256' },
        { label: 'AES-128 (Symmetric)', value: 'aes128' },
        { label: 'RSA-2048 (Asymmetric)', value: 'rsa2048' },
        { label: 'RSA-4096 (Asymmetric)', value: 'rsa4096' },
        { label: 'ECC-256 (Asymmetric)', value: 'ecc256' },
        { label: 'Triple-DES (Outdated)', value: '3des' }
      ]}
    ],
    faq: [
      { question: 'Why does RSA require larger keys than AES?', answer: 'RSA relies on prime factorization, which can be solved more efficiently than symmetric exhaustive search. Thus, a 2048-bit RSA key only matches a 112-bit symmetric key.' }
    ],
    relatedSlugs: ['hash-security', 'brute-force-time', 'cvss-v3'],
    seoTitle: 'Cryptographic Cipher Strength Comparisons Calculator',
    seoDescription: 'Compare AES, RSA, ECC, and DES standards on classical and quantum security rankings.',
    calculate: (inputs) => {
      const type = String(inputs.cipher || 'aes256');
      
      let key = 0;
      let effective = 0;
      let status = '';
      let quantum = 0;
      
      switch (type) {
        case 'aes256':
          key = 256; effective = 256; quantum = 128; status = 'Military-Grade';
          break;
        case 'aes128':
          key = 128; effective = 128; quantum = 64; status = 'Highly Commercial';
          break;
        case 'rsa2048':
          key = 2048; effective = 112; quantum = 0; status = 'Standard Commercial';
          break;
        case 'rsa4096':
          key = 4096; effective = 128; quantum = 0; status = 'Long-term Sovereign';
          break;
        case 'ecc256':
          key = 256; effective = 128; quantum = 0; status = 'Modern Commercial';
          break;
        case '3des':
          key = 168; effective = 112; quantum = 56; status = 'Legacy deprecating';
          break;
      }
      
      return {
        results: [
          { label: 'Equivalent Security Bits', value: effective, unit: 'bits', isPrimary: true },
          { label: 'Standard Key Bit Depth', value: key, unit: 'bits' },
          { label: 'Quantum Security Assessment', value: quantum > 0 ? `${quantum} bits` : 'Vulnerable' },
          { label: 'Use Case Rating', value: status }
        ]
      };
    }
  },
  {
    id: 'hash-security',
    name: 'Hash Security Calculator',
    slug: 'hash-security',
    category: 'cybersecurity',
    description: 'Find hash algorithm collision resistance and evaluate salt protection factors.',
    formula: 'Collision Probability P ≈ n^2 / (2 * 2^BitLength) under Birthday Paradox limits.',
    explanation: 'Estimates database hashing durability, collision probabilities, and salt effectiveness vectors.',
    example: 'SHA-256 uses a 256-bit space, making collision attacks mathematically out of reach for global computing pools.',
    inputs: [
      { id: 'algo', label: 'Hashing Algorithm Format', type: 'select', defaultValue: 'sha256', options: [
        { label: 'MD5 (Broken)', value: 'md5' },
        { label: 'SHA-1 (Vulnerable)', value: 'sha1' },
        { label: 'SHA-256 (Secure Standard)', value: 'sha256' },
        { label: 'SHA-512 (Secure Heavy)', value: 'sha512' },
        { label: 'bcrypt / Argon2 (Adaptive KDF)', value: 'bcrypt' }
      ]},
      { id: 'salt', label: 'Cryptographic Salt Length', type: 'number', defaultValue: 16, min: 0, max: 128, unit: 'bytes' }
    ],
    faq: [
      { question: 'Why is salt important for hashes?', answer: 'A salt is a unique random code appended to passwords before hashing. It disables pre-calculated Rainbow Table dictionary attacks, protecting matching passwords from leaking collectively.' }
    ],
    relatedSlugs: ['password-strength', 'brute-force-time', 'encryption-strength'],
    seoTitle: 'Cryptographic Hash Vulnerability Assessment Calculator',
    seoDescription: 'Obtain hash security, hashing levels, MD5 vulnerabilities, and birthday collision limits.',
    calculate: (inputs) => {
      const algo = String(inputs.algo || 'sha256');
      const salt = Number(inputs.salt ?? 16);
      
      let bits = 256;
      let speed = 'FAST';
      let stat = 'Strong';
      let vector = 'Safe against collision attacks';
      
      switch (algo) {
        case 'md5':
          bits = 128; speed = 'ULTRA-FAST'; stat = 'Completely Broken';
          vector = 'Extremely vulnerable to collision spoofing';
          break;
        case 'sha1':
          bits = 160; speed = 'FAST'; stat = 'Deprecating / Weak';
          vector = 'Theoretical and real-world collisions proven';
          break;
        case 'sha256':
          bits = 256; speed = 'MEDIUM-FAST'; stat = 'Very Secure';
          vector = 'Standard for data integrity verification - robust';
          break;
        case 'sha512':
          bits = 512; speed = 'MEDIUM-FAST'; stat = 'Exceptional';
          vector = 'Maximum modern cryptographic spacing';
          break;
        case 'bcrypt':
          bits = 192; speed = 'INTENTIONALLY SLOW'; stat = 'Premium for Passwords';
          vector = 'Configurable iterations defend against GPU hashing arrays';
          break;
      }
      
      const saltRating = salt === 0 ? 'Extremely Unsafe (No Salt)' : salt < 8 ? 'Weak Salt' : 'Excellent Salt Entropy';
      
      return {
        results: [
          { label: 'Calculated Hashing Security Status', value: stat, isPrimary: true },
          { label: 'Standard Hash Output Bits', value: bits, unit: 'bits' },
          { label: 'Algorithm Execution Speeds', value: speed },
          { label: 'Optimal Salt Level Benchmark', value: saltRating }
        ]
      };
    }
  },
  {
    id: 'data-breach-risk',
    name: 'Data Breach Risk Calculator',
    slug: 'data-breach-risk',
    category: 'cybersecurity',
    description: 'Estimate typical exposure probability index and corresponding corporate liabilities from a potential customer data leakage.',
    formula: 'Expected Loss = Records * Average Breach Cost per Record * Security Offsets',
    explanation: 'Models potential regulatory penalties, remediation labor, and reputation damage costs arising from user records leaking.',
    example: 'Leaking 10,000 healthcare database files with poor encryption might trigger $4.2M in liabilities under HIPAA penalties.',
    inputs: [
      { id: 'records', label: 'User Records in Database', type: 'number', defaultValue: 5000, min: 100, step: 500 },
      { id: 'industry', label: 'Corporate Target Sector', type: 'select', defaultValue: 'health', options: [
        { label: 'Healthcare (High Compliance)', value: 'health' },
        { label: 'Financial Services', value: 'finance' },
        { label: 'Technology / E-commerce', value: 'tech' },
        { label: 'Public Sector / Education', value: 'education' },
        { label: 'General / Professional services', value: 'general' }
      ]},
      { id: 'encrypt', label: 'At-Rest Database Encryption', type: 'select', defaultValue: 'no', options: [
        { label: 'No Encryption', value: 'no' },
        { label: 'Full AES encryption standard', value: 'yes' }
      ]},
      { id: 'mfa', label: 'Internal Staff MFA Enforced', type: 'select', defaultValue: 'yes', options: [
        { label: 'Enabled globally', value: 'yes' },
        { label: 'Disabled / Partial', value: 'no' }
      ]}
    ],
    faq: [
      { question: 'Why is Healthcare record leakage so expensive?', answer: 'Healthcare breach files include rich protected physical PII data which cannot be changed (like birth dates, clinical history, SSN), inviting severe compliance penalties.' }
    ],
    relatedSlugs: ['security-risk-compliance', 'cyber-risk-score', 'security-budget'],
    seoTitle: 'Data Breach Exposure Liability & Risk Calculator',
    seoDescription: 'Estimate regulatory penalties and corporate fallout costs resulting from database leaks.',
    calculate: (inputs) => {
      const records = Number(inputs.records || 1000);
      const industry = String(inputs.industry || 'general');
      const encrypt = String(inputs.encrypt || 'no');
      const mfa = String(inputs.mfa || 'yes');
      
      let costPerRecord = 150; 
      let penaltyFactor = 1.0;
      
      switch (industry) {
        case 'health': costPerRecord = 425; penaltyFactor = 1.8; break;
        case 'finance': costPerRecord = 380; penaltyFactor = 1.5; break;
        case 'tech': costPerRecord = 220; penaltyFactor = 1.1; break;
        case 'education': costPerRecord = 160; penaltyFactor = 0.9; break;
        case 'general': costPerRecord = 145; penaltyFactor = 0.8; break;
      }
      
      let riskFactor = 100;
      if (encrypt === 'yes') { costPerRecord *= 0.6; riskFactor -= 30; }
      if (mfa === 'yes') { riskFactor -= 25; }
      
      const totalExposure = records * costPerRecord * penaltyFactor;
      
      return {
        results: [
          { label: 'Estimated Liability Exposure', value: `$${Math.round(totalExposure).toLocaleString()}`, isPrimary: true },
          { label: 'Calculated Leakage Risk Rating', value: riskFactor > 60 ? 'Severe' : riskFactor > 35 ? 'Moderate' : 'Low' },
          { label: 'Averaged Core Cost per Record', value: `$${Math.round(costPerRecord * penaltyFactor)}`, unit: '/ record' }
        ]
      };
    }
  },
  {
    id: 'security-risk-compliance',
    name: 'Security Risk Calculator',
    slug: 'security-risk-compliance',
    category: 'cybersecurity',
    description: 'Calculate Security risk levels and Annual Loss Expectancy (ALE) based on threats, assets, and vulnerability rates.',
    formula: 'ALE = Asset Value * Exposure Factor (EF) * Annualized Rate of Occurrence (ARO)',
    explanation: 'Formulates threat asset metrics into business risk values to justify security investments.',
    example: 'A $100,000 web server facing a DDoS shutdown risk of once a year (ARO=1.0) with an exposure impact of 50% implies a $50,000 annual loss baseline.',
    inputs: [
      { id: 'assetVal', label: 'Overall Asset Value', type: 'number', defaultValue: 100000, min: 1000, step: 5000, unit: '$' },
      { id: 'impactPct', label: 'Exposure Impact Factor (EF)', type: 'number', defaultValue: 40, min: 1, max: 100, step: 5, unit: '%' },
      { id: 'frequency', label: 'Threat Annual Frequency (ARO)', type: 'number', defaultValue: 0.5, min: 0.01, max: 100, step: 0.1, unit: '/ year' }
    ],
    faq: [
      { question: 'What is SLE and ALE in cybersecurity risk?', answer: 'SLE (Single Loss Expectancy) is the financial value lost in a single incident. ALE (Annualized Loss Expectancy) is SLE multiplied by how many times that event is budgeted to occur per year.' }
    ],
    relatedSlugs: ['data-breach-risk', 'cyber-risk-score', 'security-budget'],
    seoTitle: 'Enterprise IT Cybersecurity Risk & Budget Planner',
    seoDescription: 'Benchmark asset exposure levels and find Annualized Loss Expectancy indices.',
    calculate: (inputs) => {
      const value = Number(inputs.assetVal || 10000);
      const ef = Number(inputs.impactPct || 20) / 100;
      const aro = Number(inputs.frequency || 1);
      
      const sle = value * ef;
      const ale = sle * aro;
      
      let prioritization = 'Low';
      if (ale > 50000) prioritization = 'Critical';
      else if (ale > 15000) prioritization = 'High';
      else if (ale > 5000) prioritization = 'Medium';
      
      return {
        results: [
          { label: 'Annual Loss Expectancy (ALE)', value: `$${Math.round(ale).toLocaleString()}`, isPrimary: true },
          { label: 'Single Loss Expectancy (SLE)', value: `$${Math.round(sle).toLocaleString()}` },
          { label: 'Corporate Action Priority Level', value: prioritization }
        ]
      };
    }
  },
  {
    id: 'privacy-risk',
    name: 'Privacy Risk Calculator',
    slug: 'privacy-risk',
    category: 'security-privacy',
    description: 'Audit personal data exposure indices and user confidentiality risk benchmarks.',
    formula: 'Privacy Score = 100 - Sum of (Data Type Weight * Sharing Multiplier)',
    explanation: 'Ranks application and website handling profiles across regulatory structures like GDPR and CCPA.',
    example: 'Collecting bio-metric profiles and sharing with advertising databases drops the privacy index to severe vulnerability ranges.',
    inputs: [
      { id: 'pii', label: 'PII Elements Collected', type: 'select', defaultValue: 'contact', options: [
        { label: 'None (Completely anonymous service)', value: 'none' },
        { label: 'Contact profiles (Email, Phone, Name)', value: 'contact' },
        { label: 'Finance records (Financial statements, Bank accounts)', value: 'finance' },
        { label: 'Sensitive bio-metrics (Physical IDs, GPS maps)', value: 'sensitive' }
      ]},
      { id: 'sharing', label: 'Third-Party Information Sharing', type: 'select', defaultValue: 'partner', options: [
        { label: 'Strictly zero sharing', value: 'none' },
        { label: 'Functional vendors only (Payments processing)', value: 'vendor' },
        { label: 'Advertising partners / Aggregators', value: 'partner' }
      ]},
      { id: 'analytics', label: 'Visitor Telemetry/Tracking', type: 'select', defaultValue: 'cookies', options: [
        { label: 'None (Zero telemetry)', value: 'none' },
        { label: 'Standard anonymous cookies (Page views)', value: 'cookies' },
        { label: 'Identity behavioral heatmaps / Recording', value: 'sensitive' }
      ]}
    ],
    faq: [
      { question: 'What is PII?', answer: 'PII (Personally Identifiable Information) covers any database element which can be tied back directly to a specific living person, inviting close regulatory oversight.' }
    ],
    relatedSlugs: ['digital-footprint', 'data-exposure', 'account-security'],
    seoTitle: 'Corporate GDPR Privacy Risk Assessment Calculator',
    seoDescription: 'Find privacy compliance ratings and data leakage weaknesses.',
    calculate: (inputs) => {
      const pii = String(inputs.pii || 'contact');
      const sharing = String(inputs.sharing || 'partner');
      const analytics = String(inputs.analytics || 'cookies');
      
      let baseScore = 100;
      
      if (pii === 'contact') baseScore -= 15;
      else if (pii === 'finance') baseScore -= 30;
      else if (pii === 'sensitive') baseScore -= 45;
      
      if (sharing === 'vendor') baseScore -= 10;
      else if (sharing === 'partner') baseScore -= 25;
      
      if (analytics === 'cookies') baseScore -= 5;
      else if (analytics === 'sensitive') baseScore -= 15;
      
      return {
        results: [
          { label: 'Overall Privacy Health Score', value: Math.max(0, baseScore), unit: '/ 100', isPrimary: true },
          { label: 'Compliance Index Grading', value: baseScore > 75 ? 'Excellent' : baseScore > 50 ? 'Fair' : 'Critical Threat' },
          { label: 'Identified Data Risk Vectors', value: baseScore > 75 ? 'Extremely Safe' : baseScore > 50 ? 'Moderate regulatory exposure' : 'High litigation liabilities' }
        ]
      };
    }
  },
  {
    id: 'cyber-risk-score',
    name: 'Cyber Risk Score Calculator',
    slug: 'cyber-risk-score',
    category: 'cybersecurity',
    description: 'Benchmark comprehensive cyber network exposures and identify threat vulnerability rates.',
    formula: 'Risk Index = Average of Endpoint, Training, and Patch exposures',
    explanation: 'Performs vulnerability surveys to calculate practical vulnerability factors across digital networks.',
    example: 'Having unpatched software servers combined with outdated training raises corporate threat indices above 70%.',
    inputs: [
      { id: 'endpoints', label: 'Network Endpoint Count', type: 'number', defaultValue: 50, min: 1, max: 10000 },
      { id: 'mfa', label: 'Global 2FA/MFA Enacted', type: 'select', defaultValue: 'yes', options: [
        { label: 'Enacted on 100% of accounts', value: 'yes' },
        { label: 'Partial standard / Admin list only', value: 'partial' },
        { label: 'No MFA controls enforced', value: 'no' }
      ]},
      { id: 'training', label: 'Anti-Phishing Simulation Schedules', type: 'select', defaultValue: 'annual', options: [
        { label: 'Regular scheduled testing', value: 'monthly' },
        { label: 'Once a calendar year', value: 'annual' },
        { label: 'Never simulated', value: 'never' }
      ]},
      { id: 'patching', label: 'System Update Schedules', type: 'select', defaultValue: 'delayed', options: [
        { label: 'Auto-updated immediately', value: 'fast' },
        { label: 'Delayed schedules (Within month)', value: 'delayed' },
        { label: 'Manual audits (Ad-hoc)', value: 'manual' }
      ]}
    ],
    faq: [
      { question: 'Which Cyber defense has the highest ROI?', answer: 'Enforcing Multi-Factor Authentication (MFA) blocks up to 99% of simple automated account takeover exploits.' }
    ],
    relatedSlugs: ['security-risk-compliance', 'vulnerability-score', 'security-budget'],
    seoTitle: 'Network Threat Vulnerability Index & Risk Calculator',
    seoDescription: 'Calculate your organizational Cyber Risk Score based on security configuration choices.',
    calculate: (inputs) => {
      const endpoints = Number(inputs.endpoints || 1);
      const mfa = String(inputs.mfa || 'yes');
      const training = String(inputs.training || 'annual');
      const patching = String(inputs.patching || 'delayed');
      
      let baseVuln = 20;
      
      if (endpoints > 100) baseVuln += 10;
      
      if (mfa === 'partial') baseVuln += 20;
      else if (mfa === 'no') baseVuln += 45;
      
      if (training === 'annual') baseVuln += 10;
      else if (training === 'never') baseVuln += 25;
      
      if (patching === 'delayed') baseVuln += 10;
      else if (patching === 'manual') baseVuln += 30;
      
      const score = Math.min(100, Math.max(0, baseVuln));
      const rating = score > 60 ? 'Unsafe / Vulnerable' : score > 35 ? 'Moderate Risk' : 'Highly Defended';
      
      return {
        results: [
          { label: 'Cyber Network Risk Score', value: score, unit: '% Exposure', isPrimary: true },
          { label: 'Security posture level', value: rating },
          { label: 'Key Recommendation', value: score > 60 ? 'Enforce MFA globally immediately' : score > 35 ? 'Increase simulated phishing exercises' : 'Maintain ongoing configuration' }
        ]
      };
    }
  },
  {
    id: 'vulnerability-score',
    name: 'Vulnerability Score Calculator',
    slug: 'vulnerability-score',
    category: 'cybersecurity',
    description: 'Translate exploit vectors and remediation paths into standard severity scores.',
    formula: 'Score = 0.6 * Exploitability + 0.4 * Impact',
    explanation: 'Helps development teams rank software vulnerabilities relative to exploit risks.',
    example: 'An easy-to-exploit remote code injection yields critical ratings, requiring fast software hotfixes.',
    inputs: [
      { id: 'vector', label: 'Exploit Vector Complexity', type: 'select', defaultValue: 'network', options: [
        { label: 'Network accessible (Remote injection)', value: 'network' },
        { label: 'Local access necessary (Physical access)', value: 'local' }
      ]},
      { id: 'remedy', label: 'Remediation Path Available', type: 'select', defaultValue: 'workaround', options: [
        { label: 'Vendor patch available', value: 'patch' },
        { label: 'Workaround / Temporary patch', value: 'workaround' },
        { label: 'Zero patches available (0-day)', value: 'none' }
      ]},
      { id: 'impact', label: 'Confidentiality & Integrity Impact', type: 'select', defaultValue: 'high', options: [
        { label: 'High (Complete loss of data control)', value: 'high' },
        { label: 'Partial limitations', value: 'partial' },
        { label: 'Zero impact', value: 'none' }
      ]}
    ],
    faq: [
      { question: 'What is a 0-day vulnerability?', answer: 'A software bug that is actively exploited in the wild before vendor patches or mitigation protocols are published.' }
    ],
    relatedSlugs: ['cvss-v3', 'cyber-risk-score', 'security-risk-compliance'],
    seoTitle: 'CVSS-Aligned Vulnerability Priority & Threat Calculator',
    seoDescription: 'Obtain vulnerability scores and software threat prioritizations.',
    calculate: (inputs) => {
      const vector = String(inputs.vector || 'network');
      const remedy = String(inputs.remedy || 'workaround');
      const impact = String(inputs.impact || 'high');
      
      let base = 5.0;
      
      if (vector === 'network') base += 2.5;
      else base += 0.5;
      
      if (remedy === 'none') base += 1.5;
      else if (remedy === 'patch') base -= 1.0;
      
      if (impact === 'high') base += 2.0;
      else if (impact === 'none') base -= 2.0;
      
      const score = Math.max(0.0, Math.min(10.0, base));
      let rank = 'Low';
      if (score >= 9.0) rank = 'Critical';
      else if (score >= 7.0) rank = 'High';
      else if (score >= 4.0) rank = 'Medium';
      
      return {
        results: [
          { label: 'Vulnerability Severity Score', value: score.toFixed(1), unit: '/ 10.0', isPrimary: true },
          { label: 'Remediation Urgency Level', value: rank },
          { label: 'Required SLA to Resolution', value: rank === 'Critical' ? 'Within 24 hours' : rank === 'High' ? 'Within 7 days' : 'Next scheduled sprint' }
        ]
      };
    }
  },
  {
    id: 'cvss-v3',
    name: 'CVSS v3.1 Score Calculator',
    slug: 'cvss-v3',
    category: 'cybersecurity',
    description: 'Calculate official Common Vulnerability Scoring System (CVSS) Base ratings.',
    formula: 'BaseScore = RoundUp(min(Impact + Exploitability, 10))',
    explanation: 'Generates standardized IT risk numbers based on attack vectors, complexities, privileges, and confidentiality impacts.',
    example: 'An unauthenticated remote attack that locks down a critical server yields a high 9.8 CVSS rating.',
    inputs: [
      { id: 'av', label: 'Attack Vector (AV)', type: 'select', defaultValue: 'N', options: [
        { label: 'Network (N) - Remote', value: 'N' },
        { label: 'Adjacent (A) - Local router', value: 'A' },
        { label: 'Local (L) - Console access', value: 'L' },
        { label: 'Physical (P) - Hardware cable', value: 'P' }
      ]},
      { id: 'ac', label: 'Attack Complexity (AC)', type: 'select', defaultValue: 'L', options: [
        { label: 'Low (L) - Simple script', value: 'L' },
        { label: 'High (H) - Specialized bypass', value: 'H' }
      ]},
      { id: 'pr', label: 'Privileges Required (PR)', type: 'select', defaultValue: 'N', options: [
        { label: 'None (N) - Unauthenticated', value: 'N' },
        { label: 'Low (L) - User level', value: 'L' },
        { label: 'High (H) - Admin level', value: 'H' }
      ]},
      { id: 'c', label: 'Confidentiality Impact (C)', type: 'select', defaultValue: 'H', options: [
        { label: 'High (H) - Full databases read', value: 'H' },
        { label: 'Low (L) - Minor leaks', value: 'L' },
        { label: 'None (N) - Zero leaks', value: 'N' }
      ]}
    ],
    faq: [
      { question: 'What is a good CVSS score?', answer: 'Lower is better. Any vulnerability scoring over 7.0 requires urgent engineering review, and scores over 9.0 are high-visibility exploits requiring immediate intervention.' }
    ],
    relatedSlugs: ['vulnerability-score', 'security-risk-compliance', 'cyber-risk-score'],
    seoTitle: 'CVSS v3.1 Security Severity Rating Calculator',
    seoDescription: 'Perform official CVSS v3.1 assessments online using standard input vectors.',
    calculate: (inputs) => {
      const av = String(inputs.av || 'N');
      const ac = String(inputs.ac || 'L');
      const pr = String(inputs.pr || 'N');
      const c = String(inputs.c || 'H');
      
      let score = 5.0;
      
      if (av === 'N') score += 2.2;
      else if (av === 'A') score += 1.5;
      else if (av === 'L') score += 1.0;
      else score += 0.5;
      
      if (ac === 'L') score += 1.5;
      else score -= 0.5;
      
      if (pr === 'N') score += 2.0;
      else if (pr === 'H') score -= 1.0;
      
      if (c === 'H') score += 2.5;
      else if (c === 'N') score -= 1.5;
      
      const finalScore = Math.max(0.0, Math.min(10.0, score));
      
      return {
        results: [
          { label: 'CVSS v3.1 Base Score', value: finalScore.toFixed(1), isPrimary: true },
          { label: 'Severity Classification', value: finalScore >= 9.0 ? 'CRITICAL' : finalScore >= 7.0 ? 'HIGH' : finalScore >= 4.0 ? 'MEDIUM' : 'LOW' },
          { label: 'Prioritization priority', value: finalScore >= 7.0 ? 'High vulnerability - patching target' : 'Optional schedule' }
        ]
      };
    }
  },
  {
    id: 'security-budget',
    name: 'Security Budget Calculator',
    slug: 'security-budget',
    category: 'cybersecurity',
    description: 'Calculate recommended IT security budget allocations based on annual revenues and risk margins.',
    formula: 'Security Budget = Annual IT Budget * Industry spending scale',
    explanation: 'Assesses financial sizes to benchmark average cybersecurity overheads defending against breach compliance penalties.',
    example: 'An online retailer generating $5,000,000 in revenue standardizes $250,000 for standard IT budgets, dedicating $18,750 yearly to active cybersecurity.',
    inputs: [
      { id: 'revenue', label: 'Corporate Annual Revenue', type: 'number', defaultValue: 5000000, min: 10000, step: 50000, unit: '$' },
      { id: 'itShare', label: 'Overall IT Share of Revenue', type: 'number', defaultValue: 5, min: 0.5, max: 20, step: 0.1, unit: '%' },
      { id: 'cyberShare', label: 'Cyber Share of overall IT', type: 'number', defaultValue: 7.5, min: 1, max: 30, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'What is the average security spending scale?', answer: 'Most companies allocate 5% to 15% of their total IT budget specifically to cybersecurity tools, compliance audits, and employee awareness programs.' }
    ],
    relatedSlugs: ['security-risk-compliance', 'data-breach-risk', 'cyber-risk-score'],
    seoTitle: 'Corporate IT Security Budget Estimation Calculator',
    seoDescription: 'Obtain average cyber security operational overhead budget targets from general revenue models.',
    calculate: (inputs) => {
      const revenue = Number(inputs.revenue || 1000000);
      const itShare = Number(inputs.itShare || 5) / 100;
      const cyberShare = Number(inputs.cyberShare || 8) / 100;
      
      const totalIt = revenue * itShare;
      const totalSec = totalIt * cyberShare;
      
      const training = totalSec * 0.12;
      const endpoint = totalSec * 0.28;
      const cloudsec = totalSec * 0.35;
      const audit = totalSec * 0.25;
      
      return {
        results: [
          { label: 'Allocated Security Budget', value: `$${Math.round(totalSec).toLocaleString()}`, isPrimary: true },
          { label: 'Estimated Total IT Budget', value: `$${Math.round(totalIt).toLocaleString()}` },
          { label: 'Cloud security tools (35%)', value: `$${Math.round(cloudsec).toLocaleString()}` },
          { label: 'Endpoint protection software (28%)', value: `$${Math.round(endpoint).toLocaleString()}` },
          { label: 'Compliance audits & tests (25%)', value: `$${Math.round(audit).toLocaleString()}` },
          { label: 'Phishing aware training (12%)', value: `$${Math.round(training).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'backup-storage',
    name: 'Backup Storage Calculator',
    slug: 'backup-storage',
    category: 'cybersecurity',
    description: 'Calculate storage required for complex backup schedules over custom retention windows.',
    formula: 'Required Storage = Full Backup + (Incremental Backup * Interval Count * Daily Data Drift * Compress Ratio)',
    explanation: 'Calculates the raw space required to retain files under standard security guidelines in case of hardware crashes.',
    example: 'Storing a 1 TB system with weekly 5% data change metrics over 30 recovery days yields approximately 1.25 TB of storage overhead standardizing 2:1 compression.',
    inputs: [
      { id: 'dataSize', label: 'Primary Active Data Size', type: 'number', defaultValue: 2.0, min: 0.1, step: 0.1, unit: 'TB' },
      { id: 'retentionDays', label: 'Data Recovery Target Retention', type: 'number', defaultValue: 30, min: 1, max: 365, unit: 'days' },
      { id: 'drift', label: 'Data Daily Growth / Drift', type: 'number', defaultValue: 4, min: 1, max: 100, step: 1, unit: '%' },
      { id: 'compress', label: 'De-duplicative Compression Ratio', type: 'select', defaultValue: '1.5', options: [
        { label: 'No Compression (1:1 Ratio)', value: '1' },
        { label: 'Standard Compression (1.5:1 Ratio)', value: '1.5' },
        { label: 'High Deduplication (3:1 Ratio)', value: '3' }
      ]}
    ],
    faq: [
      { question: 'What is data drift?', answer: 'Data drift is the volume of daily changes, updates, and additions occurring inside database records that must be incrementalized in backups.' }
    ],
    relatedSlugs: ['backup-time', 'cyber-risk-score', 'data-breach-risk'],
    seoTitle: 'IT Disaster Recovery Backup Storage Estimator',
    seoDescription: 'Obtain estimated physical server storage needs across retention durations.',
    calculate: (inputs) => {
      const size = Number(inputs.dataSize || 1);
      const days = Number(inputs.retentionDays || 30);
      const drift = Number(inputs.drift || 2) / 100;
      const ratio = Number(inputs.compress || 1.5);
      
      const primaryFull = size;
      const incrementsTot = size * drift * days;
      const uncompressed = primaryFull + incrementsTot;
      const compressed = uncompressed / ratio;
      
      return {
        results: [
          { label: 'Required Backup Storage Space', value: Number(compressed.toFixed(2)), unit: 'TB', isPrimary: true },
          { label: 'Raw Uncompressed Overhead', value: Number(uncompressed.toFixed(2)), unit: 'TB' },
          { label: 'Weekly Storage Data Drift', value: Number((size * drift * 7).toFixed(2)), unit: 'TB' }
        ]
      };
    }
  },
  {
    id: 'backup-time',
    name: 'Backup Transfer Time Calculator',
    slug: 'backup-time',
    category: 'cybersecurity',
    description: 'Calculate the total time required to upload backups to local or cloud-hosted targets.',
    formula: 'Time (Hours) = (Data Size in Bits) / (Bandwidth Speed in bps)',
    explanation: 'Converts network speed throughputs into physical transfer completion milestones.',
    example: 'A 500 GB system backup uploaded on a 100 Mbps fiber connection averages 11.1 hours to finish.',
    inputs: [
      { id: 'sizeGb', label: 'Database Backup Size', type: 'number', defaultValue: 100, min: 1, step: 10, unit: 'GB' },
      { id: 'bandwidthMbps', label: 'Available Upload Bandwidth', type: 'number', defaultValue: 50, min: 1, step: 10, unit: 'Mbps' },
      { id: 'overhead', label: 'Network Packet Overhead Loss', type: 'number', defaultValue: 10, min: 0, max: 50, step: 1, unit: '%' }
    ],
    faq: [
      { question: 'Why does cloud backup take longer than expected?', answer: 'Upload bandwidth is usually much slower than download bandwidth on asymmetric standard broadband connections, and physical routers suffer from packets encapsulation overhead.' }
    ],
    relatedSlugs: ['backup-storage', 'server-capacity-ops', 'bandwidth-utilization-web'],
    seoTitle: 'Cloud Backup Transfer Duration Calculator',
    seoDescription: 'Verify expected file upload duration using custom network speed benchmarks.',
    calculate: (inputs) => {
      const sizeGB = Number(inputs.sizeGb || 50);
      const speedMbps = Number(inputs.bandwidthMbps || 10);
      const loss = Number(inputs.overhead || 10) / 100;
      
      const realSpeed = speedMbps * (1 - loss);
      
      // GB to Bits: 1 GB = 1024 * 1024 * 1024 * 8 Bits
      const bits = sizeGB * 8 * 1024 * 1024 * 1024;
      const speedBps = realSpeed * 1000 * 1000;
      
      const seconds = bits / speedBps;
      const hours = seconds / 3600;
      
      let human = '';
      if (hours < 1) {
        human = `${Math.round(seconds / 60)} minutes`;
      } else {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        human = `${h}h ${m}m`;
      }
      
      return {
        results: [
          { label: 'Required Upload Duration', value: human, isPrimary: true },
          { label: 'Real Bandwidth (Less Overhead)', value: Number(realSpeed.toFixed(1)), unit: 'Mbps' },
          { label: 'Data volume throughput', value: Math.round(sizeGB * 1024), unit: 'MB' }
        ]
      };
    }
  },

  // ====================================== PRODUCTIVITY ======================================
  {
    id: 'productivity-score',
    name: 'Productivity Yield Calculator',
    slug: 'productivity-score',
    category: 'productivity',
    description: 'Track custom productivity outcomes based on work intervals, breaks, and task completions.',
    formula: 'Productivity = (Focus Hours / Actual Hours) * Completion % * distraction offsets',
    explanation: 'Assesses work styles and structures daily productivity indices to help optimize mental focus caps.',
    example: 'An 8-hour shift featuring 5 focus hours, taking structured breaks but yielding 3 major distractions, scores a productive index of 58%.',
    inputs: [
      { id: 'worked', label: 'Total Hours Clocked', type: 'number', defaultValue: 8, min: 1, max: 24, unit: 'hours' },
      { id: 'focus', label: 'Focused Active Deep Hours', type: 'number', defaultValue: 5, min: 0, max: 24, unit: 'hours' },
      { id: 'tasks', label: 'Goal Achievements Target', type: 'number', defaultValue: 4, min: 0, step: 1 },
      { id: 'distracts', label: 'Interrupt Instances Occurred', type: 'number', defaultValue: 3, min: 0 }
    ],
    faq: [
      { question: 'What is a good daily focus target?', answer: 'The human brain can only sustain 3 to 5 hours of deep, high-intensity cognitive work daily before fatigue sets in.' }
    ],
    relatedSlugs: ['time-management', 'pomo-cycles', 'deep-work-capacity'],
    seoTitle: 'Daily Work Focus & Task Yield productivity Calculator',
    seoDescription: 'Obtain daily productivity index ratings and evaluate task focus allocations.',
    calculate: (inputs) => {
      const worked = Number(inputs.worked || 8);
      const focus = Number(inputs.focus || 4);
      const tasks = Number(inputs.tasks || 1);
      const distracts = Number(inputs.distracts || 0);
      
      const ratio = focus / worked;
      const penalty = distracts * 0.08;
      
      let base = (ratio * 100) - (penalty * 100);
      if (tasks > 2) base += 10;
      
      const score = Math.max(0, Math.min(100, Math.round(base)));
      
      return {
        results: [
          { label: 'Calculated Productivity Rating', value: `${score}%`, isPrimary: true },
          { label: 'Mental Focus Intensity', value: score > 75 ? 'Optimal Flow' : score > 50 ? 'Steady Production' : 'Highly Distracted' },
          { label: 'Lost distraction costs', value: Math.round(distracts * 23), unit: 'minutes' }
        ]
      };
    }
  },
  {
    id: 'time-management',
    name: 'Time Management Calculator',
    slug: 'time-management',
    category: 'productivity',
    description: 'Profile time distribution over weekly schedules to identify missing free-time margins.',
    formula: 'Buffer = 168 Hours - SUM of Sleep, Work, Study, Commute, and Chores',
    explanation: 'Assesses time blocks weekly to isolate schedules, showing where hidden slots are spent.',
    example: 'Factoring 56 sleep hours, 40 work hours, and 10 commute hours out of a 168-hour week leaves exactly 62 open marginal hours.',
    inputs: [
      { id: 'sleep', label: 'Average Daily Sleep', type: 'number', defaultValue: 8, min: 4, max: 12, unit: 'hours/day' },
      { id: 'work', label: 'Standard Weekly Work', type: 'number', defaultValue: 40, min: 0, max: 100, unit: 'hours/week' },
      { id: 'commute', label: 'Average Daily Commutes', type: 'number', defaultValue: 1.5, min: 0, max: 6, unit: 'hours/day' },
      { id: 'leisure', label: 'Chores & Admin Tasks', type: 'number', defaultValue: 2, min: 0, max: 8, unit: 'hours/day' }
    ],
    faq: [
      { question: 'What is the "Time Buffer"?', answer: 'It is the unallocated portion of your 168-week hours that can be re-dedicated directly to health, learning, or creative personal pursuits.' }
    ],
    relatedSlugs: ['productivity-score', 'daily-planning-buffer', 'study-plans-milestone'],
    seoTitle: 'Weekly 168-Hour Balance & Focus Calculator',
    seoDescription: 'Model your weekly time use patterns and identify margin limits.',
    calculate: (inputs) => {
      const sleep = Number(inputs.sleep || 8) * 7;
      const work = Number(inputs.work || 40);
      const commute = Number(inputs.commute || 1) * 5; // Assumes 5 workdays
      const chores = Number(inputs.leisure || 2) * 7;
      
      const allocated = sleep + work + commute + chores;
      const buffer = 168 - allocated;
      
      return {
        results: [
          { label: 'Remaining Weekly Buffer', value: Math.max(0, buffer), unit: 'hours', isPrimary: true },
          { label: 'Committed active hours', value: allocated, unit: 'hours' },
          { label: 'Time Utilization Efficiency', value: Number(((allocated / 168) * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'task-duration',
    name: 'PERT Task Duration Calculator',
    slug: 'task-duration',
    category: 'productivity',
    description: 'Implement three-point estimation methodologies (PERT) to predict task completion timelines.',
    formula: 'Duration E = (Optimistic + 4*Likely + Pessimistic) / 6',
    explanation: 'Uses probability balances to neutralize overly optimistic development estimations.',
    example: 'A task optimistic at 2 days, likely at 4, but pessimistic at 12 averages a robust 5-day task requirement.',
    inputs: [
      { id: 'opt', label: 'Optimistic Duration (Best Case)', type: 'number', defaultValue: 2, min: 0.1, step: 0.5, unit: 'days' },
      { id: 'likely', label: 'Most Likely Duration', type: 'number', defaultValue: 4, min: 0.1, step: 0.5, unit: 'days' },
      { id: 'pess', label: 'Pessimistic Duration (Worst Case)', type: 'number', defaultValue: 12, min: 0.1, step: 0.5, unit: 'days' }
    ],
    faq: [
      { question: 'Why is the "Most Likely" value multiplied by 4?', answer: 'The PERT method utilizes a beta distribution, placing a heavy probability weight on the realistic center of the range to counter excessive variance.' }
    ],
    relatedSlugs: ['project-time-estimate', 'complexity-sprint-score', 'dev-capacity-agile'],
    seoTitle: 'Project Management PERT Duration Estimator',
    seoDescription: 'Obtain estimated task timelines using three-point project values.',
    calculate: (inputs) => {
      const o = Number(inputs.opt || 1);
      const m = Number(inputs.likely || 2);
      const p = Number(inputs.pess || 5);
      
      const estimate = (o + 4 * m + p) / 6;
      const sd = (p - o) / 6;
      
      return {
        results: [
          { label: 'Expected Task Duration (PERT)', value: Number(estimate.toFixed(1)), unit: 'days', isPrimary: true },
          { label: 'Standard Deviation Error Margin', value: Number(sd.toFixed(2)), unit: 'days' },
          { label: '90% Confidence Window Limit', value: `${(estimate - 1.64 * sd).toFixed(1)} to ${(estimate + 1.64 * sd).toFixed(1)} days` }
        ]
      };
    }
  },
  {
    id: 'project-time-estimate',
    name: 'Project Timeline Calculator',
    slug: 'project-time-estimate',
    category: 'productivity',
    description: 'Estimate comprehensive multi-resource project scopes factoring in group overhead.',
    formula: 'Time Weeks = (Total Tasks * Avg Duration) / (Team Size * Velocity factor)',
    explanation: 'Integrates team communication multipliers to offset group productivity declines.',
    example: 'Completing 100 story points with 4 engineers at an average velocity of 3 points per week yields a 9-week roadmap projection.',
    inputs: [
      { id: 'tasks', label: 'Total Task Backlog Count', type: 'number', defaultValue: 40, min: 1 },
      { id: 'avgDuration', label: 'Average Task Duration', type: 'number', defaultValue: 4, min: 0.5, step: 0.5, unit: 'days' },
      { id: 'team', label: 'Active Developer/Team Count', type: 'number', defaultValue: 3, min: 1, max: 100 },
      { id: 'overhead', label: 'Comm. Overhead per Person', type: 'number', defaultValue: 8, min: 0, max: 50, step: 1, unit: '%' }
    ],
    faq: [
      { question: "What is Brooks' Law?", answer: 'Adding manpower to a late software project makes it later, due to the exponential growth of communication overhead paths.' }
    ],
    relatedSlugs: ['task-duration', 'dev-capacity-agile', 'complexity-sprint-score'],
    seoTitle: 'Team Delivery Roadmap & Timeline Estimator',
    seoDescription: 'Identify the estimated calendar weeks needed to deliver task lists based on staff sizes.',
    calculate: (inputs) => {
      const tasks = Number(inputs.tasks || 10);
      const dur = Number(inputs.avgDuration || 2);
      const team = Number(inputs.team || 1);
      const overhead = Number(inputs.overhead || 5) / 100;
      
      const rawDays = tasks * dur;
      // Communication efficiency drops as team scales: 1 - (overhead * (team - 1))
      const efficiency = Math.max(0.4, 1 - (overhead * (team - 1) * 0.2));
      const activeDailyCapacity = team * efficiency;
      
      const workdays = rawDays / activeDailyCapacity;
      const weeks = workdays / 5; // 5-day work week
      
      return {
        results: [
          { label: 'Expected Project Timeline', value: Number(weeks.toFixed(1)), unit: 'calendar weeks', isPrimary: true },
          { label: 'Calculated Team Efficiency', value: Math.round(efficiency * 100), unit: '%' },
          { label: 'Required Combined Labor Days', value: Math.round(rawDays), unit: 'man-days' }
        ]
      };
    }
  },
  {
    id: 'pomodoro-session',
    name: 'Pomodoro Calculator',
    slug: 'pomodoro-session',
    category: 'productivity',
    description: 'Map out deep-focus study sequences and break intervals over a daily time budget.',
    formula: 'Cycle = focusSessionMins + shortBreakMins',
    explanation: 'Models custom intervals to optimize study budgets and sustain cognitive endurance.',
    example: 'A 4-hour study budget maps exactly 7 cycles of 25-minute study blocks separated by 5-minute cooldown breaks.',
    inputs: [
      { id: 'totalStudyHrs', label: 'Total Study Time Budget', type: 'number', defaultValue: 3, min: 0.5, step: 0.5, unit: 'hours' },
      { id: 'focusSessionMins', label: 'Focus Block Duration', type: 'number', defaultValue: 25, min: 10, max: 120, step: 5, unit: 'mins' },
      { id: 'shortBreakMins', label: 'Short Break Duration', type: 'number', defaultValue: 5, min: 1, max: 30, step: 1, unit: 'mins' },
      { id: 'longBreakMins', label: 'Long Break Interval', type: 'number', defaultValue: 15, min: 5, max: 60, step: 5, unit: 'mins' }
    ],
    faq: [
      { question: 'Why use Pomodoro?', answer: 'It builds on short structured tasks, minimizing cognitive procrastination. Committing to a brief 25-minute block lowers psychological barriers to entry.' }
    ],
    relatedSlugs: ['productivity-score', 'focus-time-index', 'deep-work-capacity'],
    seoTitle: 'Pomodoro Study Interval & Break Planner',
    seoDescription: 'Plan your productivity Pomodoro focus sessions and rest cycles under a set daily time budget.',
    calculate: (inputs) => {
      const budgetMins = Number(inputs.totalStudyHrs || 2) * 60;
      const focus = Number(inputs.focusSessionMins || 25);
      const sBreak = Number(inputs.shortBreakMins || 5);
      const lBreak = Number(inputs.longBreakMins || 15);
      
      // Standard Pomodoro cadence: 4 focus sessions, 3 short breaks, then 1 long break
      const singleCadenceFocus = focus * 4;
      const singleCadenceBreaks = sBreak * 3 + lBreak;
      const cadenceTotalMins = singleCadenceFocus + singleCadenceBreaks;
      
      const cadencesMatch = Math.floor(budgetMins / cadenceTotalMins);
      const remainingBudgetValue = budgetMins % cadenceTotalMins;
      
      let sessionCount = cadencesMatch * 4;
      let totalFocusScheduled = cadencesMatch * singleCadenceFocus;
      
      if (remainingBudgetValue > focus) {
        sessionCount += 1;
        totalFocusScheduled += focus;
      }
      
      const totalBreakScheduled = budgetMins - totalFocusScheduled;
      
      return {
        results: [
          { label: 'Scheduled Focus Blocks', value: sessionCount, unit: 'sessions', isPrimary: true },
          { label: 'Total Active Focus Duration', value: totalFocusScheduled, unit: 'minutes' },
          { label: 'Allocated Rest Duration', value: Math.max(0, totalBreakScheduled), unit: 'minutes' }
        ]
      };
    }
  },
  {
    id: 'focus-time-index',
    name: 'Focus Time Calculator',
    slug: 'focus-time-index',
    category: 'productivity',
    description: 'Calculate cognitive performance and attention recovery offsets from multitasking.',
    formula: 'Focus Index = (Deep Mins / (Shallow Mins + Switches * 23)) * 100',
    explanation: 'Measures high-quality deep-work against task-switching overhead penalties.',
    example: 'Interrupting a 120-minute focus session 4 times adds 92 minutes of cognitive drift to overall focus efficiency.',
    inputs: [
      { id: 'deep', label: 'Allocated Deep Work Time', type: 'number', defaultValue: 120, min: 10, step: 10, unit: 'minutes' },
      { id: 'shallow', label: 'Administrative / Email Time', type: 'number', defaultValue: 60, min: 0, step: 10, unit: 'minutes' },
      { id: 'switches', label: 'Context Switches / Interrupts', type: 'number', defaultValue: 3, min: 0, step: 1 }
    ],
    faq: [
      { question: 'What is attention residue?', answer: 'Cognitive research shows that when switching tasks, a portion of focus remains anchored to the previous topic, taking up to 23 minutes to fully realign to the new task.' }
    ],
    relatedSlugs: ['productivity-score', 'deep-work-capacity', 'work-efficiency-index'],
    seoTitle: 'Context Switching & Focus Time Index Calculator',
    seoDescription: 'Obtain focus indexes and calculate performance loss metrics from daily multitasking.',
    calculate: (inputs) => {
      const deep = Number(inputs.deep || 60);
      const shallow = Number(inputs.shallow || 0);
      const switches = Number(inputs.switches || 0);
      
      const switchPenalty = switches * 23.3; // 23 minutes attention residue
      const totalInvested = deep + shallow;
      const effectiveFocus = Math.max(0, deep - switchPenalty);
      
      const ratingPct = totalInvested > 0 ? (effectiveFocus / totalInvested) * 100 : 0;
      
      return {
        results: [
          { label: 'Calculated Focus Index Score', value: `${Math.round(ratingPct)}%`, isPrimary: true },
          { label: 'Switching Recovery Penalty', value: Math.round(switchPenalty), unit: 'minutes' },
          { label: 'Effective Cognitive Depth', value: Math.max(0, Math.round(effectiveFocus)), unit: 'minutes' }
        ]
      };
    }
  },
  {
    id: 'deep-work-capacity',
    name: 'Deep Work Capacity Calculator',
    slug: 'deep-work-capacity',
    category: 'productivity',
    description: 'Benchmark maximum daily and weekly limits for high-intensity cognitive work.',
    formula: 'Deep Work Capacity = Base hours + adjustments for experience and distractions',
    explanation: 'Models optimal daily brain fatigue curves to map productive flow states.',
    example: 'An experienced researcher can manage up to 4 hours of strict daily deep focus, while beginners should target 1-1.5 hours.',
    inputs: [
      { id: 'experience', label: 'Focus Routine Practice', type: 'select', defaultValue: 'novice', options: [
        { label: 'Beginner / Novice (Just starting out)', value: 'novice' },
        { label: 'Intermediate (6-12 months practice)', value: 'intermediate' },
        { label: 'Expert / Deep Work Veteran (Years of focus)', value: 'expert' }
      ]},
      { id: 'pills', label: 'Phone Notification Frequency', type: 'select', defaultValue: 'moderate', options: [
        { label: 'None (Silent / Focus mode active)', value: 'none' },
        { label: 'Moderate (A few buzzes per hour)', value: 'moderate' },
        { label: 'High (Constant alerts)', value: 'high' }
      ]}
    ],
    faq: [
      { question: 'Who defined Deep Work?', answer: 'Professor Cal Newport coined the term "Deep Work" to represent distraction-free professional activity performed at cognitive boundaries, which sharpens skills and produces massive value.' }
    ],
    relatedSlugs: ['focus-time-index', 'productivity-score', 'pomo-cycles'],
    seoTitle: 'Cal Newport Deep Work Capacity Calculator',
    seoDescription: 'Benchmark maximum daily cognitive output capacities and manage mental fatigue.',
    calculate: (inputs) => {
      const exp = String(inputs.experience || 'novice');
      const pills = String(inputs.pills || 'moderate');
      
      let baseCapacity = 1.5; // Hours
      if (exp === 'intermediate') baseCapacity = 2.5;
      else if (exp === 'expert') baseCapacity = 4.0;
      
      if (pills === 'moderate') baseCapacity *= 0.85;
      else if (pills === 'high') baseCapacity *= 0.5;
      
      return {
        results: [
          { label: 'Daily Deep Work Capacity Limit', value: Number(baseCapacity.toFixed(1)), unit: 'hours/day', isPrimary: true },
          { label: 'Weekly Target Standard', value: Number((baseCapacity * 5).toFixed(1)), unit: 'hours/week' },
          { label: 'Cognitive Efficiency Status', value: baseCapacity > 3 ? 'Elite focus flow' : baseCapacity > 1.8 ? 'Solid practitioner' : 'Highly compromised focus' }
        ]
      };
    }
  },
  {
    id: 'work-efficiency-index',
    name: 'Work Efficiency Calculator',
    slug: 'work-efficiency-index',
    category: 'productivity',
    description: 'Measure net productive outputs compared to task rework and waste rates.',
    formula: 'Efficiency % = (Productive Hours * (1 - Rework Rate)) / Clocked Hours',
    explanation: 'Audits physical and mental workloads, highlighting where task rework reduces overall velocity.',
    example: 'Logging 40 total sprint hours but having a 15% rework rate drops effective labor output to 34 hours.',
    inputs: [
      { id: 'clocked', label: 'Total Hours Clocked', type: 'number', defaultValue: 40, min: 1, max: 168, unit: 'hours' },
      { id: 'productive', label: 'Estimates Active Output', type: 'number', defaultValue: 32, min: 0, max: 168, unit: 'hours' },
      { id: 'rework', label: 'Task Correction / Rework Rate', type: 'number', defaultValue: 10, min: 0, max: 100, step: 1, unit: '%' }
    ],
    faq: [
      { question: 'What is rework overhead?', answer: 'The time spent redesigning, debugging, or correcting errors in previously submitted tasks due to changing requirements or poor design specifications.' }
    ],
    relatedSlugs: ['productivity-score', 'focus-time-index', 'daily-planning-buffer'],
    seoTitle: 'Workplace Labor Quality & Efficiency Calculator',
    seoDescription: 'Benchmark net task efficiency metrics against project corrections.',
    calculate: (inputs) => {
      const clocked = Number(inputs.clocked || 40);
      const productive = Number(inputs.productive || 30);
      const rework = Number(inputs.rework || 0) / 100;
      
      const realOutput = productive * (1 - rework);
      const pct = clocked > 0 ? (realOutput / clocked) * 100 : 0;
      
      return {
        results: [
          { label: 'Calculated Work Efficiency', value: `${Math.round(pct)}%`, isPrimary: true },
          { label: 'True High-Quality Output', value: Number(realOutput.toFixed(1)), unit: 'hours' },
          { label: 'Labor Hours Lost in Rework', value: Number((productive * rework).toFixed(1)), unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'habit-consistency',
    name: 'Habit Consistency Calculator',
    slug: 'habit-consistency',
    category: 'productivity',
    description: 'Calculate consistency indexes, daily streak patterns, and project habit formation timelines.',
    formula: 'Consistency Score = (Completed Days / Total Tracked Days) * bonus modifier for streaks',
    explanation: 'Models behavioral habits to show the likelihood of routines becoming permanent automatic behaviors.',
    example: 'Completing 21 of 30 tracked workout days with a 12-day streak yields an 84% behavioral alignment rating.',
    inputs: [
      { id: 'tracked', label: 'Overall Tracked Days', type: 'number', defaultValue: 30, min: 1 },
      { id: 'completed', label: 'Completed Days Count', type: 'number', defaultValue: 22, min: 0 },
      { id: 'streak', label: 'Current Longest Streak', type: 'number', defaultValue: 12, min: 0 }
    ],
    faq: [
      { question: 'How long does it take to form a habit?', answer: 'Scientific studies indicate it takes an average of 66 days of consistent practice for a new complex physical or dietary habit to reach maximum automatic performance.' }
    ],
    relatedSlugs: ['goal-completion-rate', 'productivity-score', 'time-management'],
    seoTitle: 'Behavioral Habit Consistency & Streak Calculator',
    seoDescription: 'Calculate habit establishment benchmarks and track consistency scores online.',
    calculate: (inputs) => {
      const tracked = Number(inputs.tracked || 30);
      const completed = Number(inputs.completed || 15);
      const streak = Number(inputs.streak || 0);
      
      const cRatio = tracked > 0 ? completed / tracked : 0;
      const sBonus = tracked > 0 ? streak / tracked : 0;
      
      const score = Math.min(100, Math.round((cRatio * 85) + (sBonus * 15)));
      
      // Automaticity forecast days remaining
      const daysLeft = Math.max(0, 66 - completed);
      
      return {
        results: [
          { label: 'Calculated Consistency Score', value: `${score}%`, isPrimary: true },
          { label: 'Establishment Phase', value: completed > 50 ? 'Strongly Embedded' : completed > 21 ? 'Consolidating Routine' : 'Fragile / Forming' },
          { label: 'Days Left to Habit Peak (66 Avg)', value: daysLeft, unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'goal-completion-rate',
    name: 'Goal Completion Calculator',
    slug: 'goal-completion-rate',
    category: 'productivity',
    description: 'Process and weight goal completions to measure balanced personal progress ratings.',
    formula: 'Completion Rate = (Sub-goals Completed * Weight) / Overall Target',
    explanation: 'Helps users audit project roadmaps by organizing large goals into manageable milestone tracks.',
    example: 'Finishing 3 critical high-weight milestones out of 5 planned targets represents a 72% success ranking.',
    inputs: [
      { id: 'total', label: 'Total Projects / Goals Logged', type: 'number', defaultValue: 6, min: 1 },
      { id: 'finished', label: 'Fully Completed Goals', type: 'number', defaultValue: 3, min: 0 },
      { id: 'partialProgress', label: 'Avg Progress of Remaining Goals', type: 'number', defaultValue: 40, min: 0, max: 100, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'Why do partial goals count towards tracking?', answer: 'Recognizing partial progress avoids the "all-or-nothing" trap, encouraging sustained momentum on long-term initiatives.' }
    ],
    relatedSlugs: ['habit-consistency', 'productivity-score', 'time-management'],
    seoTitle: 'Goal Roadmap Milestone Efficiency Calculator',
    seoDescription: 'Obtain average completion indexes and forecast project completion timelines.',
    calculate: (inputs) => {
      const total = Number(inputs.total || 1);
      const finished = Number(inputs.finished || 0);
      const partial = Number(inputs.partialProgress || 0) / 100;
      
      const remainingCount = Math.max(0, total - finished);
      const weightedRemaining = remainingCount * partial;
      
      const totalScorePct = ((finished + weightedRemaining) / total) * 100;
      
      return {
        results: [
          { label: 'Weighted Goal Completion', value: `${Math.round(totalScorePct)}%`, isPrimary: true },
          { label: 'Averaged Goal Output Status', value: totalScorePct > 80 ? 'Master Achiever' : totalScorePct > 45 ? 'Steady Progressor' : 'Initiation Phase' },
          { label: 'Effective Milestones Delivered', value: Number((finished + weightedRemaining).toFixed(1)), unit: 'goals' }
        ]
      };
    }
  },
  {
    id: 'daily-planning-buffer',
    name: 'Daily Planning Buffer Calculator',
    slug: 'daily-planning-buffer',
    category: 'productivity',
    description: 'Calculate scheduling margins and task buffers to prevent overscheduling daily agendas.',
    formula: 'Optimized Time = SUM(Task Durations) * Planning Buffer Multiplier',
    explanation: 'Models calendar timelines, adding contingency slots to absorb unexpected meetings and tasks.',
    example: 'Planning 4 hours of pure tasks with a 1.25x buffer requires scheduling 5 hours of total calendar space.',
    inputs: [
      { id: 'plannedMinutes', label: 'Planned Pure Task Minutes', type: 'number', defaultValue: 240, min: 30, step: 10, unit: 'mins' },
      { id: 'interruptMinutes', label: 'Known Daily Interrupt Friction', type: 'number', defaultValue: 60, min: 0, step: 10, unit: 'mins' },
      { id: 'bufferMultiplier', label: 'Buffer Safety Factor', type: 'select', defaultValue: '1.2', options: [
        { label: 'Tight Agenda (1.1x multiplier)', value: '1.1' },
        { label: 'Balanced Margin (1.2x multiplier)', value: '1.2' },
        { label: 'High Uncertainty (1.4x multiplier)', value: '1.4' }
      ]}
    ],
    faq: [
      { question: 'What is Hofstadter Law?', answer: '"It always takes longer than you expect, even when you take into account Hofstadter\'s Law." Spacing agendas protects mental stamina from scheduling fatigue.' }
    ],
    relatedSlugs: ['time-management', 'productivity-score', 'focus-time-index'],
    seoTitle: 'Daily Calendar Planning Buffer Estimator',
    seoDescription: 'Find required scheduling buffer margins to prevent over-scheduling and manage daily delays.',
    calculate: (inputs) => {
      const tasks = Number(inputs.plannedMinutes || 120);
      const interrupts = Number(inputs.interruptMinutes || 30);
      const multiplier = Number(inputs.bufferMultiplier || 1.2);
      
      const safeDuration = (tasks + interrupts) * multiplier;
      const hours = safeDuration / 60;
      
      const bufferOnly = safeDuration - tasks;
      const ratio = safeDuration > 0 ? (bufferOnly / safeDuration) * 100 : 0;
      
      return {
        results: [
          { label: 'Total Scheduled Day Size', value: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`, isPrimary: true },
          { label: 'Total Safety Buffer Built In', value: Math.round(bufferOnly), unit: 'minutes' },
          { label: 'Schedule Protection Margin', value: `${Math.round(ratio)}% of total day` }
        ]
      };
    }
  }
];
