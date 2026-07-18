import { Calculator } from '../types';

export const V7_TECH_CALCULATORS: Calculator[] = [
  {
    id: 'subnet-mask-calculator',
    name: 'Subnet Mask Calculator',
    slug: 'subnet-mask-calculator',
    category: 'programming',
    description: 'Calculate subnetting information, CIDR notations, and IP ranges. Powerful IPv4, Subnet, and Network Calculator.',
    seoTitle: 'Subnet Mask Calculator | IP & CIDR Network Calculator',
    seoDescription: 'Calculate IP subnet details with our free Subnet Mask Calculator. Includes CIDR notations, IPv4 properties, usable hosts capacity, and IP subnet calculations.',
    inputs: [
      { id: 'ip', label: 'Network Base IP Address', type: 'text', defaultValue: '192.168.1.0' },
      { id: 'cidr', label: 'CIDR Subnet notation', type: 'number', defaultValue: 24, min: 1, max: 32, step: 1 }
    ],
    formula: 'Hosts = 2^(32 - CIDR) - 2',
    explanation: 'Subnetting simplifies network routing by grouping IP pools into smaller logical units.',
    example: 'A /24 subnet has 256 addresses, with 254 usable for network hosts.',
    faq: [{ question: 'Why subtract 2 from total subnet hosts?', answer: 'The first IP address is reserved for the network address, and the last is reserved for the broadcast address.' }],
    relatedSlugs: ['ip-subnet-calculator', 'bandwidth-calculator'],
    calculate: (inputs) => {
      const cidr = Number(inputs.cidr) || 24;
      const hosts = Math.pow(2, 32 - cidr) - 2;

      return {
        results: [
          { label: 'Usable Hosts Capacity', value: hosts < 0 ? 0 : hosts.toLocaleString(), isPrimary: true },
          { label: 'Subnet Wildcard Mask', value: cidr === 24 ? '0.0.0.255' : `1 / ${cidr}` }
        ]
      };
    }
  },
  {
    id: 'ip-subnet-calculator',
    name: 'IP Subnet Calculator',
    slug: 'ip-subnet-calculator',
    category: 'programming',
    description: 'Deconstruct IP networks to find network classes, wildcards, and broadcast addresses.',
    seoTitle: 'IP Subnet Deconstructor Solver | Calculatoora',
    seoDescription: 'Extract subnet parameters, network ranges, and wildcards from any IP network.',
    inputs: [
      { id: 'ipAddress', label: 'Network IP Address', type: 'text', defaultValue: '10.0.0.1' },
      { id: 'cidrSelect', label: 'CIDR Class Prefix', type: 'number', defaultValue: 8, min: 8, max: 30, step: 1 }
    ],
    formula: 'Calculates structural IP bounds using CIDR divisions.',
    explanation: 'Helps network engineers divide IP address spaces into smaller subnetworks.',
    example: 'For IP 10.0.0.1 on a /8 network: the subnet is 10.0.0.0, supporting 16.7 million hosts.',
    faq: [{ question: 'What is classless inter-domain routing (CIDR)?', answer: 'CIDR is an efficient method for allocating IP addresses and routing IP packets, replacing the older Classful network model.' }],
    relatedSlugs: ['subnet-mask-calculator', 'bandwidth-calculator'],
    calculate: (inputs) => {
      const cidr = Number(inputs.cidrSelect) || 8;
      const totalHosts = Math.pow(2, 32 - cidr);
      return {
        results: [
          { label: 'Subnet Host Capacity', value: totalHosts.toLocaleString(), isPrimary: true },
          { label: 'IP Address Prefix', value: `/${cidr}` }
        ]
      };
    }
  },
  {
    id: 'binary-converter',
    name: 'Binary Converter',
    slug: 'binary-converter',
    category: 'programming',
    description: 'Convert decimal numbers into binary strings and hexadecimal notation.',
    seoTitle: 'Decimal to Binary & Hex Converter | Calculatoora',
    seoDescription: 'Convert standard decimal numbers to binary strings and hexadecimal formats.',
    inputs: [
      { id: 'decimalVal', label: 'Decimal Integer', type: 'number', defaultValue: 255, step: 1 }
    ],
    formula: 'Binary = Decimal base-2 representation\nHex = Decimal base-16 representation',
    explanation: 'Converts base-10 numbers used by humans into the binary format (base-2) processed by computers.',
    example: 'Decimal 255 converts to binary "11111111" and hex "FF".',
    faq: [{ question: 'What is a byte?', answer: 'A common unit of digital information consisting of exactly 8 bits, capable of representing values from 0 to 255.' }],
    relatedSlugs: ['hexadecimal-converter', 'ascii-converter'],
    calculate: (inputs) => {
      const dec = Math.round(Number(inputs.decimalVal)) || 0;
      return {
        results: [
          { label: 'Binary Output (Base-2)', value: dec.toString(2), isPrimary: true },
          { label: 'Hexadecimal Output (Base-16)', value: dec.toString(16).toUpperCase() }
        ]
      };
    }
  },
  {
    id: 'hexadecimal-converter',
    name: 'Hexadecimal Converter',
    slug: 'hexadecimal-converter',
    category: 'programming',
    description: 'Convert hex strings into decimal and binary.',
    seoTitle: 'Hexadecimal to Decimal Converter | Calculatoora',
    seoDescription: 'Quickly convert hexadecimal strings to decimal and binary formats.',
    inputs: [
      { id: 'hexStr', label: 'Hex String (e.g. 1A, FF)', type: 'text', defaultValue: '1A' }
    ],
    formula: 'Hex = Base-16 representations.',
    explanation: 'Converts hexadecimal values into standard decimal and binary formats.',
    example: 'Hexadecimal "1A" converts to decimal 26 and binary "11010".',
    faq: [{ question: 'Why is hexadecimal used in computer science?', answer: 'Hexadecimal is a concise way to represent larger binary sequences, using one hex character for every four bits.' }],
    relatedSlugs: ['binary-converter', 'ascii-converter'],
    calculate: (inputs) => {
      const hex = (inputs.hexStr || '0').trim();
      const dec = parseInt(hex, 16);

      if (isNaN(dec)) return { results: [{ label: 'Error', value: 'Invalid Hex Input', isPrimary: true }] };
      return {
        results: [
          { label: 'Decimal Value', value: dec.toString(), isPrimary: true },
          { label: 'Binary Equivalency', value: dec.toString(2) }
        ]
      };
    }
  },
  {
    id: 'ascii-converter',
    name: 'ASCII Text Converter',
    slug: 'ascii-converter',
    category: 'programming',
    description: 'Convert plain text into ASCII binary codes.',
    seoTitle: 'Plain Text to ASCII Binary Converter | Calculatoora',
    seoDescription: 'Convert plain text into ASCII decimal and binary representations.',
    inputs: [
      { id: 'text', label: 'Plain Text Message', type: 'text', defaultValue: 'A' }
    ],
    formula: 'Translates character variables directly to ASCII decimal codes.',
    explanation: 'Reveals how text characters are represented as digital values inside computers.',
    example: 'The character "A" converts to ASCII decimal 65 and binary "01000001".',
    faq: [{ question: 'What is ASCII?', answer: 'The American Standard Code for Information Interchange is a character-encoding standard for electronic communication.' }],
    relatedSlugs: ['binary-converter', 'hexadecimal-converter'],
    calculate: (inputs) => {
      const txt = String(inputs.text || '');
      if (txt.length === 0) return { results: [{ label: 'Empty Text', value: '0', isPrimary: true }] };

      const codes = Array.from(txt).map((char: any) => char.charCodeAt(0));
      return {
        results: [
          { label: 'ASCII Code Decimal Values', value: codes.join(', '), isPrimary: true },
          { label: 'ASCII Code Binary Outputs', value: codes.map(c => c.toString(2).padStart(8, '0')).join(' ') }
        ]
      };
    }
  },
  {
    id: 'bandwidth-calculator',
    name: 'Bandwidth Speed Calculator',
    slug: 'bandwidth-calculator',
    category: 'programming',
    description: 'Calculate digital network download speeds.',
    seoTitle: 'Network Bandwidth Speed Calculator | Calculatoora',
    seoDescription: 'Determine estimated file download times based on network bandwidth speeds.',
    inputs: [
      { id: 'fileSize', label: 'File Size Goal', type: 'number', defaultValue: 1.5, step: 0.1, unit: 'GB' },
      { id: 'speedMbps', label: 'Bandwidth Download Speed', type: 'number', defaultValue: 100, step: 5, unit: 'Mbps' }
    ],
    formula: 'Time = File Size (bits) / Bandwidth Speed (bps)',
    explanation: 'Helps estimate file download times by factoring in network speed in megabits per second.',
    example: 'Downloading a 1.5 GB file on a 100 Mbps connection takes approximately 2 minutes.',
    faq: [{ question: 'Why are downloads slower than my ad capacity?', answer: 'Download speeds are often shared, throttled, or impacted by network latency and server overhead.' }],
    relatedSlugs: ['data-transfer-calculator', 'subnet-mask-calculator'],
    calculate: (inputs) => {
      const gb = Number(inputs.fileSize) || 1;
      const mbps = Number(inputs.speedMbps) || 10;

      const totalBits = gb * 8 * 1024 * 1024 * 1024;
      const speedBits = mbps * 1024 * 1024;
      const seconds = totalBits / speedBits;

      return {
        results: [
          { label: 'Estimated Download Duration', value: (seconds / 60).toFixed(1), unit: 'Minutes', isPrimary: true },
          { label: 'Required Seconds Output', value: Math.ceil(seconds), unit: 'Seconds' }
        ]
      };
    }
  },
  {
    id: 'network-latency-calculator',
    name: 'Network Latency Calculator',
    slug: 'network-latency-calculator',
    category: 'programming',
    description: 'Estimate network round-trip times (RTT) based on spatial distance and speed-of-light propagation.',
    seoTitle: 'Network latency RTT Estimator | Calculatoora',
    seoDescription: 'Find estimated physical latency round-trip time based on distance and transmission medium.',
    inputs: [
      { id: 'distanceKm', label: 'Physical Distance Target', type: 'number', defaultValue: 5000, step: 100, unit: 'km' },
      { id: 'medium', label: 'Fiber Speed Transmission Medium', type: 'select', defaultValue: '0.67', options: [
        { label: 'Standard Fiber Optic Cable (0.67 c)', value: '0.67' },
        { label: 'Satellite Vacuum Line (1.00 c)', value: '1.0' }
      ] }
    ],
    formula: 'Propagation Delay = Distance / (Speed of Light * Medium Index)',
    explanation: 'Calculates the baseline speed of light delay in fiber cables, excluding network routing swaps.',
    example: 'Sending packets 5,000 km over fiber optic cables results in a baseline latency of 24.9 ms.',
    faq: [{ question: 'Why is physical latency inevitable?', answer: 'Signal propagation is physically limited by the speed of light in fiber, which is slower than light traveling in a vacuum.' }],
    relatedSlugs: ['bandwidth-calculator', 'data-transfer-calculator'],
    calculate: (inputs) => {
      const d = Number(inputs.distanceKm) || 1000;
      const index = Number(inputs.medium) || 0.67;

      const c = 299792;
      const speedInMedium = c * index;

      const oneWay = d / speedInMedium;
      const rtt = oneWay * 2 * 1000;

      return {
        results: [
          { label: 'Round-Trip Time Latency (RTT)', value: rtt.toFixed(2), unit: 'ms', isPrimary: true },
          { label: 'One-Way Fiber Delay', value: (oneWay * 1000).toFixed(2), unit: 'ms' }
        ]
      };
    }
  },
  {
    id: 'password-strength-calculator',
    name: 'Password Strength Calculator',
    slug: 'password-strength-calculator',
    category: 'programming',
    description: 'Measure password strength and estimate brute-force cracking difficulty.',
    seoTitle: 'Password Entropy Strength Checker | Calculatoora',
    seoDescription: 'Analyze password security and estimate the time required to crack it using brute-force attacks.',
    inputs: [
      { id: 'pwd', label: 'Test Password Space', type: 'text', defaultValue: 'Pa$$w0rd123!' }
    ],
    formula: 'Entropy = Length * log2(Character Pool)',
    explanation: 'Measures password complexity using mathematical entropy to estimate resistance to automated brute-force attacks.',
    example: 'A 12-character password using letters, numbers, and symbols contains 78 bits of entropy.',
    faq: [{ question: 'What is a strong password entropy level?', answer: 'An entropy value of 80 bits or higher makes a password highly resistant to brute-force attacks.' }],
    relatedSlugs: ['ascii-converter', 'binary-converter'],
    calculate: (inputs) => {
      const p = inputs.pwd || '';
      if (!p) return { results: [{ label: 'Empty Password', value: '0 bits', isPrimary: true }] };

      let pool = 0;
      if (/[a-z]/.test(p)) pool += 26;
      if (/[A-Z]/.test(p)) pool += 26;
      if (/[0-9]/.test(p)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(p)) pool += 33;

      const entropy = p.length * Math.log2(pool || 1);
      let strength = 'Weak';
      let clr = '#ef4444';

      if (entropy > 80) {
        strength = 'Very Strong';
        clr = '#10b981';
      } else if (entropy > 50) {
        strength = 'Medium';
        clr = '#f59e0b';
      }

      return {
        results: [
          { label: 'Calculated Password Entropy', value: entropy.toFixed(1), unit: 'bits', isPrimary: true },
          { label: 'Estimated Security Level', value: strength }
        ],
        chartData: [
          { name: 'Your Entropy', value: entropy, color: clr },
          { name: 'Safe Threshold', value: 80, color: '#e5e7eb' }
        ]
      };
    }
  },
  {
    id: 'pixels-to-rem-converter',
    name: 'Pixels (px) to REM Converter',
    slug: 'pixels-to-rem-converter',
    category: 'programming',
    description: 'Convert interface pixels (px) to web standard REM units.',
    seoTitle: 'CSS Pixels to REM Unit Converter | Calculatoora',
    seoDescription: 'Convert UI design pixels (px) to mobile-friendly CSS REM units.',
    inputs: [
      { id: 'pixels', label: 'Enter Pixels (px)', type: 'number', defaultValue: 16, step: 1, unit: 'px' },
      { id: 'rootSize', label: 'Base Web Font Size', type: 'number', defaultValue: 16, step: 1, unit: 'px' }
    ],
    formula: 'REM = Pixels / Base Font Size',
    explanation: 'Converts pixel measurements to scalable REM units for accessible, responsive web designs.',
    example: 'Converting 24px with a standard 16px base font size yields 1.50 REM.',
    faq: [{ question: 'Why use REM over fixed px?', answer: 'REM units scale dynamically with user-defined browser font settings, improving baseline accessibility.' }],
    relatedSlugs: ['aspect-ratio-calculator', 'ascii-converter'],
    calculate: (inputs) => {
      const px = Number(inputs.pixels) || 0;
      const base = Number(inputs.rootSize) || 16;
      return {
        results: [
          { label: 'Converted REM Value', value: (px / base).toFixed(4), unit: 'rem', isPrimary: true },
          { label: 'Percentage scale equivalency', value: ((px / base) * 100).toFixed(0), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    slug: 'aspect-ratio-calculator',
    category: 'programming',
    description: 'Calculate design aspect ratios and solve for missing dimensions.',
    seoTitle: 'Design Aspect Ratio Calculator | Calculatoora',
    seoDescription: 'Calculate and solve aspect ratio dimensions for screen layouts and video assets.',
    inputs: [
      { id: 'width', label: 'Active Width (x)', type: 'number', defaultValue: 1920, step: 10 },
      { id: 'height', label: 'Active Height (y)', type: 'number', defaultValue: 1080, step: 10 }
    ],
    formula: 'Simplifies dimensions using the Greatest Common Divisor (GCD).',
    explanation: 'Simplifies screen dimensions into standardized image and video aspect ratios.',
    example: 'Dimensions of 1920x1080 simplify to a 16:9 aspect ratio.',
    faq: [{ question: 'What is a typical mobile aspect ratio?', answer: 'Most modern mobile devices use a tall 19.5:9 or 20:9 vertical aspect ratio.' }],
    relatedSlugs: ['pixels-to-rem-converter', 'binary-converter'],
    calculate: (inputs) => {
      const w = Math.round(Number(inputs.width)) || 1920;
      const h = Math.round(Number(inputs.height)) || 1080;

      const getGcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : getGcd(b, a % b);
      const gcd = getGcd(w, h);

      return {
        results: [
          { label: 'Resulting Aspect Ratio', value: `${w / gcd}:${h / gcd}`, isPrimary: true },
          { label: 'Decimal aspect Ratio Value', value: (w / h).toFixed(3) }
        ]
      };
    }
  },
  {
    id: 'grade-calculator',
    name: 'Grade Calculator',
    slug: 'grade-calculator',
    category: 'education',
    description: 'Calculate your current class grade based on weighted assignment scores.',
    seoTitle: 'Class Grade Weight Calculator | Calculatoora',
    seoDescription: 'Calculate your overall class grade by inputting weighted scores for tests, homework, and assignments.',
    inputs: [
      { id: 'homeworkScore', label: 'Average Homework Score', type: 'number', defaultValue: 85, step: 1, unit: '%' },
      { id: 'homeworkWeight', label: 'Homework Category weight', type: 'number', defaultValue: 30, step: 5, unit: '%' },
      { id: 'testsScore', label: 'Average Midterm Test Score', type: 'number', defaultValue: 78, step: 1, unit: '%' },
      { id: 'testsWeight', label: 'Midterm Test weight', type: 'number', defaultValue: 70, step: 5, unit: '%' }
    ],
    formula: 'Final Grade = (Score A * Weight A) + (Score B * Weight B) / Total Weight',
    explanation: 'Weights different academic assignments to determine your actual cumulative class grade.',
    example: 'An 85% homework grade (30% weight) and 78% test grade (70% weight) output a weighted average grade of 80.1%.',
    faq: [{ question: 'What if weights do not equal 100%?', answer: 'The calculator scales the results based on the sum of the input weights to ensure accurate grading.' }],
    relatedSlugs: ['gpa-calculator', 'semester-gpa-calculator'],
    calculate: (inputs) => {
      const hwS = Number(inputs.homeworkScore) || 0;
      const hwW = Number(inputs.homeworkWeight) || 0;
      const testS = Number(inputs.testsScore) || 0;
      const testW = Number(inputs.testsWeight) || 0;

      const totalWt = hwW + testW;
      const weighted = totalWt > 0 ? ((hwS * hwW) + (testS * testW)) / totalWt : 0;

      return {
        results: [
          { label: 'Calculated Class Grade', value: weighted.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Assumed Category Weight Sum', value: `${totalWt}%` }
        ]
      };
    }
  },
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    slug: 'gpa-calculator',
    category: 'education',
    description: 'Calculate your overall Grade Point Average (GPA) based on class grades and course credits.',
    seoTitle: 'Student GPA Calculator (4.0 Scale) | Calculatoora',
    seoDescription: 'Quickly calculate your university or high school GPA on a standard 4.0 scale.',
    inputs: [
      { id: 'classAGrade', label: 'Course A Grade (A=4, B=3, C=2, D=1)', type: 'number', defaultValue: 4, min: 0, max: 4, step: 1, unit: 'pts' },
      { id: 'classACredits', label: 'Course A Credit Hours', type: 'number', defaultValue: 3, step: 1, unit: 'hrs' },
      { id: 'classBGrade', label: 'Course B Grade (A=4, B=3, C=2, D=1)', type: 'number', defaultValue: 3, min: 0, max: 4, step: 1, unit: 'pts' },
      { id: 'classBCredits', label: 'Course B Credit Hours', type: 'number', defaultValue: 4, step: 1, unit: 'hrs' }
    ],
    formula: 'GPA = (Grade Points * Credits) / Total Credits',
    explanation: 'Converts course letter grades into standard points and weights them by class credit hours.',
    example: 'Getting an A (4.0) in a 3-credit course and a B (3.0) in a 4-credit course yields a 3.43 cumulative GPA.',
    faq: [{ question: 'How is a weighted GPA different?', answer: 'Weighted GPAs award extra points (up to 5.0) for Advanced Placement (AP) or honors courses.' }],
    relatedSlugs: ['cumulative-gpa-calculator', 'semester-gpa-calculator'],
    calculate: (inputs) => {
      const gA = Number(inputs.classAGrade) || 0;
      const cA = Number(inputs.classACredits) || 1;
      const gB = Number(inputs.classBGrade) || 0;
      const cB = Number(inputs.classBCredits) || 1;

      const totalCredits = cA + cB;
      const gpa = ((gA * cA) + (gB * cB)) / totalCredits;

      return {
        results: [
          { label: 'Cumulative GPA Result', value: gpa.toFixed(2), unit: '/ 4.00', isPrimary: true },
          { label: 'Total Course Credit Hours', value: totalCredits }
        ],
        chartData: [
          { name: 'Your GPA', value: gpa, color: '#10b981' },
          { name: 'Scale Target', value: 4.0, color: '#e5e7eb' }
        ]
      };
    }
  },
  {
    id: 'cumulative-gpa-calculator',
    name: 'Cumulative GPA Calculator',
    slug: 'cumulative-gpa-calculator',
    category: 'education',
    description: 'Calculate long-term cumulative GPA across multiple semesters.',
    seoTitle: 'Cumulative GPA Solver | Calculatoora',
    seoDescription: 'Find your overall cumulative GPA based on past grades and semester credits.',
    inputs: [
      { id: 'oldGpa', label: 'Prior Cumulative GPA', type: 'number', defaultValue: 3.2, step: 0.1, unit: 'pts' },
      { id: 'oldCredits', label: 'Prior Earned Credit Hours', type: 'number', defaultValue: 45, step: 1, unit: 'hrs' },
      { id: 'newGpa', label: 'Current Semester GPA', type: 'number', defaultValue: 3.8, step: 0.1, unit: 'pts' },
      { id: 'newCredits', label: 'Current Semester Credit Hours', type: 'number', defaultValue: 15, step: 1, unit: 'hrs' }
    ],
    formula: 'Cumulative GPA = (GPA1 * Credits1 + GPA2 * Credits2) / (Credits1 + Credits2)',
    explanation: 'Combines current semester performance with previous semesters to track overall academic GPA.',
    example: 'Adding a 3.80 semester (15 credits) to a prior 3.20 baseline (45 credits) raises your cumulative GPA to 3.35.',
    faq: [{ question: 'How do I raise my overall cumulative GPA?', answer: 'Consistently earning higher semester GPAs increases your overall cumulative GPA, though it becomes more stable as you earn more credits.' }],
    relatedSlugs: ['gpa-calculator', 'semester-gpa-calculator'],
    calculate: (inputs) => {
      const oG = Number(inputs.oldGpa) || 0;
      const oC = Number(inputs.oldCredits) || 1;
      const nG = Number(inputs.newGpa) || 0;
      const nC = Number(inputs.newCredits) || 1;

      const totalCredits = oC + nC;
      const cumGpa = ((oG * oC) + (nG * nC)) / totalCredits;

      return {
        results: [
          { label: 'New Cumulative GPA', value: cumGpa.toFixed(2), unit: '/ 4.00', isPrimary: true },
          { label: 'Total Accumulated Credits', value: totalCredits }
        ]
      };
    }
  },
  {
    id: 'final-exam-grade-calculator',
    name: 'Final Exam Grade Calculator',
    slug: 'final-exam-grade-calculator',
    category: 'education',
    description: 'Determine the final exam grade needed to achieve your target overall class grade.',
    seoTitle: 'Final Exam Grade Calculator | Calculatoora',
    seoDescription: 'Calculate the score you need on your final exam to reach your target grade in a course.',
    inputs: [
      { id: 'current', label: 'Current Class Grade', type: 'number', defaultValue: 78, step: 1, unit: '%' },
      { id: 'target', label: 'Desired Course Grade', type: 'number', defaultValue: 80, step: 1, unit: '%' },
      { id: 'weight', label: 'Final Exam Weight', type: 'number', defaultValue: 25, min: 5, max: 95, step: 1, unit: '%' }
    ],
    formula: 'Required Score = (Target - (Current * (1 - Weight))) / Weight',
    explanation: 'Uses your current grade and the final exam weight to determine the exact score you need on the final to reach your target course grade.',
    example: 'With a 78% current grade and a final exam worth 25%, you need an 86.00% on the final to reach an overall course grade of 80%.',
    faq: [{ question: 'What if the calculated grade is over 100%?', answer: 'This indicates that even with a perfect score on the final, you cannot reach your target grade without extra credit.' }],
    relatedSlugs: ['grade-calculator', 'gpa-calculator'],
    calculate: (inputs) => {
      const cur = Number(inputs.current) || 0;
      const tgt = Number(inputs.target) || 0;
      const wt = (Number(inputs.weight) || 20) / 100;

      const req = (tgt - (cur * (1 - wt))) / wt;
      return {
        results: [
          { label: 'Required Final Exam Score', value: req > 0 ? req.toFixed(1) : 'Any score is fine', unit: '%', isPrimary: true },
          { label: 'Course Weighting baseline', value: `${(1 - wt) * 100}% prior + ${(wt * 100)}% final` }
        ]
      };
    }
  },
  {
    id: 'semester-gpa-calculator',
    name: 'Semester GPA Calculator',
    slug: 'semester-gpa-calculator',
    category: 'education',
    description: 'Calculate your semester GPA using letter grades.',
    seoTitle: 'Student Semester GPA Solver | Calculatoora',
    seoDescription: 'Calculate your semester GPA by entering credits and letter grades.',
    inputs: [
      { id: 'classACredits', label: 'Class A Credits', type: 'number', defaultValue: 3, step: 1, unit: 'hrs' },
      { id: 'classAGradePoint', label: 'Class A Grade Point', type: 'number', defaultValue: 3.7, step: 0.1, unit: 'pts' },
      { id: 'classBCredits', label: 'Class B Credits', type: 'number', defaultValue: 4, step: 1, unit: 'hrs' },
      { id: 'classBGradePoint', label: 'Class B Grade Point', type: 'number', defaultValue: 3.0, step: 0.1, unit: 'pts' }
    ],
    formula: 'GPA = Sum(Credits * Grade Points) / Total Credits',
    explanation: 'Calculates your overall semester GPA based on individual class credits and grade points.',
    example: 'Earn a 3.7 (A-) in a 3-credit class and a 3.0 (B) in a 4-credit class to finish the semester with a 3.30 GPA.',
    faq: [{ question: 'How do pass/fail classes affect GPA?', answer: 'Pass/fail classes award course credits but do not affect your overall GPA point calculations.' }],
    relatedSlugs: ['gpa-calculator', 'cumulative-gpa-calculator'],
    calculate: (inputs) => {
      const cA = Number(inputs.classACredits) || 1;
      const gA = Number(inputs.classAGradePoint) || 0;
      const cB = Number(inputs.classBCredits) || 1;
      const gB = Number(inputs.classBGradePoint) || 0;

      const totCred = cA + cB;
      const gpa = ((cA * gA) + (cB * gB)) / totCred;

      return {
        results: [
          { label: 'Semester GPA Score', value: gpa.toFixed(2), unit: '/ 4.00', isPrimary: true },
          { label: 'Course Credits Logged', value: totCred }
        ]
      };
    }
  },
  {
    id: 'study-time-calculator',
    name: 'Study Time Budget Calculator',
    slug: 'study-time-calculator',
    category: 'education',
    description: 'Calculate study time recommendations based on course credit hours and difficulty.',
    seoTitle: 'Weekly Study Time Budget Calculator | Calculatoora',
    seoDescription: 'Calculate recommended weekly study time commitments based on your course schedule and difficulty.',
    inputs: [
      { id: 'totalCredits', label: 'Total Course Credit Hours', type: 'number', defaultValue: 15, step: 1, unit: 'hrs' },
      { id: 'difficulty', label: 'Average Course Difficulty Factor', type: 'select', defaultValue: '2', options: [
        { label: 'Standard Course (2 hours study per credit)', value: '2' },
        { label: 'Advanced Core Course (3 hours study per credit)', value: '3' }
      ] }
    ],
    formula: 'Study Hours = Credit Hours * Difficulty Factor',
    explanation: 'Uses academic guidelines to estimate weekly study time needs based on your course credits.',
    example: 'For a standard 15-credit schedule, aim for approximately 30 hours of study time weekly.',
    faq: [{ question: 'What is the standard credit hour rule?', answer: 'The traditional university guideline suggests studying 2 to 3 hours outside of class for every 1 credit hour of enrollment.' }],
    relatedSlugs: ['grade-calculator', 'gpa-calculator'],
    calculate: (inputs) => {
      const creds = Number(inputs.totalCredits) || 12;
      const factor = Number(inputs.difficulty) || 2;

      const hours = creds * factor;
      return {
        results: [
          { label: 'Recommended Weekly Study Hours', value: hours, unit: 'hrs/wk', isPrimary: true },
          { label: 'Recommended Daily study budget', value: (hours / 7).toFixed(1), unit: 'hrs/day' }
        ]
      };
    }
  }
];
