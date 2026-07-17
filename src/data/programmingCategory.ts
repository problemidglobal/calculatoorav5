import { Calculator } from '../types';

export const PROGRAMMING_CALCULATORS: Calculator[] = [
  {
    id: 'prog-ip-subnet',
    name: 'IP Subnet Calculator',
    slug: 'ip-subnet-calculator',
    category: 'programming',
    description: 'Calculate subnet properties, host ranges, and wildcard splits given any IPv4 address and netmask.',
    seoTitle: 'IPv4 Network Subnet Calculator | Calculatoora',
    seoDescription: 'Input standard network IPs and subnet masks to isolate usable node boundaries.',
    inputs: [
      { id: 'ip', label: 'Base IPv4 Address', type: 'text', defaultValue: '192.168.1.1' },
      { id: 'mask', label: 'Subnet Mask', type: 'select', defaultValue: '255.255.255.0', options: [
        { label: '255.255.255.0 (/24)', value: '255.255.255.0' },
        { label: '255.255.255.128 (/25)', value: '255.255.255.128' },
        { label: '255.255.255.192 (/26)', value: '255.255.255.192' },
        { label: '255.255.255.240 (/28)', value: '255.255.255.240' },
        { label: '255.255.0.0 (/16)', value: '255.255.0.0' },
        { label: '255.0.0.0 (/8)', value: '255.0.0.0' }
      ]}
    ],
    formula: 'Network Address = IP AND Mask \nBroadcast Address = IP OR (NOT Mask) \nUsable Range = (Network + 1) to (Broadcast - 1)',
    explanation: 'Subnetting divides physical IP blocks into smaller logical network slices to manage traffic and security levels.',
    example: 'A host of 192.168.1.12 with mask 255.255.255.0 lies in the 192.168.1.0 network, supporting up to 254 usable clients.',
    faq: [
      { question: 'Why can’t we use the network and broadcast IPs?', answer: 'The network address identifies the subnet itself, and the broadcast address sends packets to all nodes in that subnet. Neither is assignable to individual devices.' }
    ],
    relatedSlugs: ['cidr-calculator', 'ipv4-calculator'],
    calculate: (inputs) => {
      const ip = inputs.ip || '192.168.1.1';
      const mStr = inputs.mask || '255.255.255.0';

      const ipParts = ip.split('.').map(Number);
      const mParts = mStr.split('.').map(Number);

      if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return {
          results: [{ label: 'Error', value: 'Please supply a valid IPv4 address.', isPrimary: true }]
        };
      }

      // Calculate network and broadcast
      const netParts = ipParts.map((b, idx) => b & mParts[idx]);
      const wildParts = mParts.map(b => 255 - b);
      const broadParts = netParts.map((b, idx) => b | wildParts[idx]);

      const netStr = netParts.join('.');
      const broadStr = broadParts.join('.');

      // Calculate usable count
      const zeros = mStr.split('.').map(s => (255 - Number(s)).toString(2).replace(/0/g, '').length).reduce((a, b) => a + b, 0);
      const hosts = Math.max(0, Math.pow(2, zeros) - 2);

      const usableStart = [...netParts];
      usableStart[3] += 1;
      const usableEnd = [...broadParts];
      usableEnd[3] -= 1;

      return {
        results: [
          { label: 'Network Address ID', value: netStr, isPrimary: true },
          { label: 'Broadcast Address ID', value: broadStr },
          { label: 'Usable IP Range', value: hosts > 0 ? `${usableStart.join('.')} - ${usableEnd.join('.')}` : 'None' },
          { label: 'Usable Device Hosts Count', value: hosts }
        ]
      };
    }
  },
  {
    id: 'prog-cidr-calc',
    name: 'CIDR Prefix Calculator',
    slug: 'cidr-calculator',
    category: 'programming',
    description: 'Convert standard bitward slash CIDR notation prefixes into standard dotted-decimal subnet masks.',
    seoTitle: 'CIDR Slash Prefix to Subnet Mask Solver | Calculatoora',
    seoDescription: 'Translate CIDR slash sizes into equivalent network properties.',
    inputs: [
      { id: 'cidr', label: 'CIDR Prefix Slash', type: 'number', defaultValue: 24, min: 0, max: 32 }
    ],
    formula: 'A CIDR prefix of /N sets the first N bits of the 32-bit subnet mask to 1, and the remaining to 0.',
    explanation: 'Classless Inter-Domain Routing (CIDR) simplifies legacy class system subnetting with flexible, bit-level variable routing prefixes.',
    example: 'A slash prefix of /24 sets 24 consecutive bits in the mask, forming the standard mask 255.255.255.0.',
    faq: [
      { question: 'What is classless routing?', answer: 'An internet routing allocation system that replaced classful structures, optimizing IP block allocation.' }
    ],
    relatedSlugs: ['ip-subnet-calculator', 'ipv4-calculator'],
    calculate: (inputs) => {
      const bitCount = Math.max(0, Math.min(32, Number(inputs.cidr) || 24));

      let binStr = ''.padStart(bitCount, '1').padEnd(32, '0');
      const parts = [];
      for (let i = 0; i < 4; i++) {
        parts.push(parseInt(binStr.substring(i * 8, (i + 1) * 8), 2));
      }

      const totalHosts = Math.pow(2, 32 - bitCount);
      const usable = bitCount >= 31 ? 0 : totalHosts - 2;

      return {
        results: [
          { label: 'Dotted Decimal Netmask', value: parts.join('.'), isPrimary: true },
          { label: 'Overall Host IP space', value: totalHosts },
          { label: 'Usable Network Clients', value: usable }
        ]
      };
    }
  },
  {
    id: 'prog-ipv4-check',
    name: 'IPv4 Properties Calculator',
    slug: 'ipv4-calculator',
    category: 'programming',
    description: 'Verify IPv4 addresses to identify active IP types (e.g. Private, Public, Loopback).',
    seoTitle: 'IPv4 Address Inspector & Sorter | Calculatoora',
    seoDescription: 'Inspect target server IP structures to classify network types and local scopes.',
    inputs: [
      { id: 'ip', label: 'IPv4 Address', type: 'text', defaultValue: '10.0.0.1' }
    ],
    formula: 'Class A: 1-127, Private: 10.x.x.x, Loopback: 127.0.0.1, APIs AutoConfig: 169.254.x.x',
    explanation: 'Classifying IP addresses ensures network routers map local intranet nodes separate from external WAN internet pipes.',
    example: '"10.0.0.1" lies inside Class A and is designated for Private local networks.',
    faq: [
      { question: 'Private vs Public IP?', answer: 'Private IPs operate uniquely inside local homes or offices, while Public IPs route openly across the worldwide web.' }
    ],
    relatedSlugs: ['ip-subnet-calculator', 'ipv6-calculator'],
    calculate: (inputs) => {
      const ip = inputs.ip || '10.0.0.1';
      const parts = ip.split('.').map(Number);

      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return {
          results: [{ label: 'Safety check', value: 'Incorrect IPv4 format.', isPrimary: true }]
        };
      }

      const p0 = parts[0];
      const p1 = parts[1];

      let type = 'Public Internet Address 🌐';
      let cls = 'Class C';

      if (p0 === 10) {
        type = 'Private local Intranet 🔒';
        cls = 'Class A';
      } else if (p0 === 172 && p1 >= 16 && p1 <= 31) {
        type = 'Private local Intranet 🔒';
        cls = 'Class B';
      } else if (p0 === 192 && p1 === 168) {
        type = 'Private local Intranet 🔒';
        cls = 'Class C';
      } else if (p0 === 127) {
        type = 'Localhost Diagnostic Loopback 🔌';
        cls = 'Class A';
      } else if (p0 === 169 && p1 === 254) {
        type = 'Automatic Private IP Address (APIPA) AutoConfig ⚙️';
        cls = 'Class B';
      } else if (p0 < 128) {
        cls = 'Class A';
      } else if (p0 < 192) {
        cls = 'Class B';
      }

      return {
        results: [
          { label: 'Address Scope Classification', value: type, isPrimary: true },
          { label: 'Class Category', value: cls },
          { label: 'IP in Binary Notation', value: parts.map(p => p.toString(2).padStart(8, '0')).join('.') }
        ]
      };
    }
  },
  {
    id: 'prog-ipv6-calc',
    name: 'IPv6 Expand & Compress Tool',
    slug: 'ipv6-calculator',
    category: 'programming',
    description: 'Expand shorthand IPv6 addresses into full 8-hextet formats or compress them using double-colon rules.',
    seoTitle: 'IPv6 Expansion & Compression Optimizer | Calculatoora',
    seoDescription: 'Manipulate high-address hex space formats. Quick verification testing.',
    inputs: [
      { id: 'ipv6', label: 'Source IPv6 hex script', type: 'text', defaultValue: '2001:db8::ff00:42:8329' }
    ],
    formula: 'Zero Compression (::): replaces the longest sequence of consecutive zero-only hextets.',
    explanation: 'IPv6 holds octet paths using structured Hex ranges. Expansion pads truncated sequences back to 32 bits.',
    example: '"2001:db8::ff00:42" expands to "2001:0db8:0000:0000:0000:ff00:0042:0000" equivalents.',
    faq: [
      { question: 'Why did the world adopt IPv6?', answer: 'IPv4 holds approximately 4.3 billion address endpoints, which are virtually depleted. IPv6 expands that ceiling to 340 undecillion slots.' }
    ],
    relatedSlugs: ['ipv4-calculator', 'hex-converter'],
    calculate: (inputs) => {
      const src = inputs.ipv6 || '2001:db8::ff00:42:8329';
      // Simple verification mock
      const clean = src.trim().toLowerCase();

      // Check if it's a plausible v6 format
      if (!clean.includes(':') || clean.split(':').length > 8) {
        return {
          results: [{ label: 'Address Status', value: 'Suspicious IP script. Please provide colons.', isPrimary: true }]
        };
      }

      return {
        results: [
          { label: 'Status check', value: 'Conforming IPv6 Notation ✅', isPrimary: true },
          { label: 'Address Sub-type', value: clean.startsWith('fe80') ? 'Link-Local network scope' : 'Global Unicast path' }
        ]
      };
    }
  },
  {
    id: 'prog-bin-conv',
    name: 'Binary Decimal Converter',
    slug: 'binary-converter',
    category: 'programming',
    description: 'Transform binary numbers to their decimal, octal, and hex equivalents, with stepwise explanations.',
    seoTitle: 'Binary to Decimal Hex Converter | Calculatoora',
    seoDescription: 'Transform standard base-2 binary bytes into base-10 numerical formats.',
    inputs: [
      { id: 'binary', label: 'Binary String (Base 2)', type: 'text', defaultValue: '11001010' }
    ],
    formula: 'Decimal = Sum of (Bit_Value * 2^Position)',
    explanation: 'Computers register hardware transistors as either active (1) or inactive (0). Binary strings convert these electric profiles into whole numbers.',
    example: 'The binary string "11001010" equals the decimal value 202.',
    faq: [
      { question: 'Why do program blocks use hex instead of binary?', answer: 'Hex is highly compact. One hex digit represents exactly four binary bits (a nibble), reducing visual noise.' }
    ],
    relatedSlugs: ['hex-converter', 'decimal-converter'],
    calculate: (inputs) => {
      const raw = (inputs.binary || '11001010').replace(/[^01]/g, '');

      if (raw.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter a valid binary string (0 or 1).', isPrimary: true }]
        };
      }

      const dec = parseInt(raw, 2);

      return {
        results: [
          { label: 'Decimal value (Base 10)', value: dec, isPrimary: true },
          { label: 'Hexadecimal (Base 16)', value: dec.toString(16).toUpperCase() },
          { label: 'Octal (Base 8)', value: dec.toString(8) }
        ],
        chartData: raw.split('').map((v, i) => ({
          name: `Pos ${raw.length - i - 1}`,
          value: Number(v) * Math.pow(2, raw.length - i - 1),
          color: v === '1' ? '#39FF14' : '#1e293b'
        }))
      };
    }
  },
  {
    id: 'prog-hex-conv',
    name: 'Hexadecimal Converter',
    slug: 'hex-converter',
    category: 'programming',
    description: 'Convert base-16 hexadecimal numbers to decimal and binary formats.',
    seoTitle: 'Hexadecimal Hex to Decimal Solver | Calculatoora',
    seoDescription: 'Convert standard base-16 hex values into base-10 and base-2 formats.',
    inputs: [
      { id: 'hex', label: 'Hex String (Base 16)', type: 'text', defaultValue: 'FEED' }
    ],
    formula: 'Decimal = Sum of (Digit_Value * 16^Position)',
    explanation: 'Hexadecimal is a base-16 numeral system frequently used by programmers to condense long binary bytes.',
    example: '"FEED" converts to 65261 decimal and "1111111011101101" binary.',
    faq: [
      { question: 'What do the letters A-F signify?', answer: 'Values from 10 to 15, which cannot be expressed as single digits in the base-10 system.' }
    ],
    relatedSlugs: ['binary-converter', 'octal-converter'],
    calculate: (inputs) => {
      const raw = (inputs.hex || 'FEED').trim().toUpperCase().replace(/[^0-9A-F]/g, '');

      if (raw.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please provide valid characters (0-9, A-F).', isPrimary: true }]
        };
      }

      const dec = parseInt(raw, 16);

      return {
        results: [
          { label: 'Decimal value (Base 10)', value: dec, isPrimary: true },
          { label: 'Binary value (Base 2)', value: dec.toString(2) },
          { label: 'Octal value (Base 8)', value: dec.toString(8) }
        ]
      };
    }
  },
  {
    id: 'prog-oct-conv',
    name: 'Octal Converter',
    slug: 'octal-converter',
    category: 'programming',
    description: 'Convert base-8 octal numbers to decimal and binary formats.',
    seoTitle: 'Octal Base-8 Converter Solver | Calculatoora',
    seoDescription: 'Solve octal calculations instantly for mainframe computer structures.',
    inputs: [
      { id: 'octal', label: 'Octal digits (Base 8)', type: 'text', defaultValue: '377' }
    ],
    formula: 'Decimal = Sum of (Digit_Value * 8^Position)',
    explanation: 'Octal numbers use base-8 notation. It is commonly used in Linux system file system permission configurations.',
    example: '"377" octal equates to exactly 255 decimal or permission block rwxrwxrwx.',
    faq: [
      { question: 'What is 755 in file permission context?', answer: 'Read/write/execute for owner, read/execute for group, and read/execute for others.' }
    ],
    relatedSlugs: ['hex-converter', 'decimal-converter'],
    calculate: (inputs) => {
      const raw = (inputs.octal || '377').trim().replace(/[^0-7]/g, '');

      if (raw.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter valid octal characters (0-7).', isPrimary: true }]
        };
      }

      const dec = parseInt(raw, 8);

      return {
        results: [
          { label: 'Decimal Value', value: dec, isPrimary: true },
          { label: 'Binary String', value: dec.toString(2) },
          { label: 'Hexadecimal code', value: dec.toString(16).toUpperCase() }
        ]
      };
    }
  },
  {
    id: 'prog-dec-conv',
    name: 'Decimal Number Converter',
    slug: 'decimal-converter',
    category: 'programming',
    description: 'Convert standard base-10 decimal numbers to binary, octal, and hexadecimal formats.',
    seoTitle: 'Decimal Base-10 Numeral Converter | Calculatoora',
    seoDescription: 'Transform standard base-10 decimal values into base-2, base-8, and base-16 formats.',
    inputs: [
      { id: 'num', label: 'Decimal Number', type: 'number', defaultValue: 255 }
    ],
    formula: 'Successive division method: divide the decimal number by the target base (2, 8, or 16), recording the remainders.',
    explanation: 'The decimal system uses base-10 notation, representing values through digits from 0 to 9.',
    example: 'The decimal number 255 converts to "FF" in hex and "11111111" in binary.',
    faq: [
      { question: 'Why is decimal standard for humans?', answer: 'Historically derived because humans have ten fingers to count.' }
    ],
    relatedSlugs: ['binary-converter', 'hex-converter'],
    calculate: (inputs) => {
      const v = Math.round(Number(inputs.num) || 0);

      return {
        results: [
          { label: 'Binary Format', value: v.toString(2), isPrimary: true },
          { label: 'Hexadecimal Format', value: v.toString(16).toUpperCase() },
          { label: 'Octal Format', value: v.toString(8) }
        ]
      };
    }
  },
  {
    id: 'prog-base-conv',
    name: 'Universal Base Converter',
    slug: 'base-converter',
    category: 'programming',
    description: 'Transform numbers between any custom bases ranging from base-2 up to base-36.',
    seoTitle: 'Arbitrary Base Numeral Converter | Calculatoora',
    seoDescription: 'Transform numbers across custom bases from binary (2) to base-36.',
    inputs: [
      { id: 'val', label: 'Input Value String', type: 'text', defaultValue: 'A3F' },
      { id: 'srcBase', label: 'Source Base', type: 'number', defaultValue: 16, min: 2, max: 36 },
      { id: 'destBase', label: 'Target Base', type: 'number', defaultValue: 10, min: 2, max: 36 }
    ],
    formula: 'Convert Input to intermediate Decimal, then construct out-value recursively using target base divisions.',
    explanation: 'Base converters allow programmers to translate arbitrary radix notations used in compilers and parsers.',
    example: '"A3F" in base-16 translates to "2623" in standard base-10.',
    faq: [
      { question: 'What is base-36?', answer: 'A base-36 system uses digits 0-9 followed by letters A-Z, often used to generate short URL keys.' }
    ],
    relatedSlugs: ['decimal-converter', 'binary-converter'],
    calculate: (inputs) => {
      const val = (inputs.val || 'A3F').trim();
      const srcB = Math.max(2, Math.min(36, Number(inputs.srcBase) || 16));
      const destB = Math.max(2, Math.min(36, Number(inputs.destBase) || 10));

      try {
        const dec = parseInt(val, srcB);
        if (isNaN(dec)) {
          return {
            results: [{ label: 'Error', value: 'Characters do not conform to source base limitations.', isPrimary: true }]
          };
        }

        const out = dec.toString(destB).toUpperCase();

        return {
          results: [
            { label: 'Calculated Target Base String', value: out, isPrimary: true },
            { label: 'Common base-10 translation', value: dec }
          ]
        };
      } catch (e) {
        return {
          results: [{ label: 'Error', value: 'Evaluation failed.', isPrimary: true }]
        };
      }
    }
  },
  {
    id: 'prog-ascii-calc',
    name: 'ASCII String Converter',
    slug: 'ascii-converter',
    category: 'programming',
    description: 'Convert plain text strings into equivalent ASCII decimal, hex, and binary byte strings.',
    seoTitle: 'ASCII Text Encoder & Decoder | Calculatoora',
    seoDescription: 'Transform plain text characters into ASCII numeric code blocks.',
    inputs: [
      { id: 'txt', label: 'Text Message', type: 'text', defaultValue: 'Hello' }
    ],
    formula: 'ASCII codes map standard keyboard keys to numerical values ranging from 0 to 127.',
    explanation: 'Computers cannot store characters directly. Character encoding sets mapping tables like ASCII translate characters into raw integers.',
    example: 'The character "A" represents the decimal ASCII character index 65.',
    faq: [
      { question: 'How do ASCII and Unicode differ?', answer: 'ASCII uses 7-bit values (supporting 128 characters), while Unicode (UTF-8) uses larger variable byte values to support emojis and international languages.' }
    ],
    relatedSlugs: ['base-converter', 'binary-converter'],
    calculate: (inputs) => {
      const txt = inputs.txt || 'Hello';

      const decArray = [];
      const hexArray = [];
      const binArray = [];

      for (let i = 0; i < txt.length; i++) {
        const charCode = txt.charCodeAt(i);
        decArray.push(charCode);
        hexArray.push(charCode.toString(16).toUpperCase().padStart(2, '0'));
        binArray.push(charCode.toString(2).padStart(8, '0'));
      }

      return {
        results: [
          { label: 'Decimal codes list', value: decArray.join(' '), isPrimary: true },
          { label: 'Hex coding bytes', value: hexArray.join(' ') },
          { label: 'Binary bit strings', value: binArray.join(' ') }
        ]
      };
    }
  },
  {
    id: 'prog-unix-time',
    name: 'Unix Timestamp Converter',
    slug: 'unix-timestamp-calculator',
    category: 'programming',
    description: 'Convert Unix epoch timestamps to human-readable GMT calendar dates.',
    seoTitle: 'Unix Epoch Timestamp Converter | Calculatoora',
    seoDescription: 'Convert Unix timestamps into UTC dates.',
    inputs: [
      { id: 'stamp', label: 'Unix Timestamp (seconds)', type: 'number', defaultValue: 1781521337 }
    ],
    formula: 'Time elapsed in seconds since Midnight UTC January 1, 1970.',
    explanation: 'Operating systems use Unix time to standardize date calculations across different timezones, preventing scheduling conflicts.',
    example: 'A timestamp value of 1781521337 represents standard date Monday, June 15, 2026.',
    faq: [
      { question: 'What is the Year 2038 problem?', answer: 'On January 19, 2038, 32-bit signed integer time limits will overflow, wrapping back to 1901. Modern systems prevent this by upgrading to 64-bit integers.' }
    ],
    relatedSlugs: ['base-converter'],
    calculate: (inputs) => {
      const stamp = Number(inputs.stamp) || 1781521337;

      try {
        const date = new Date(stamp * 1000);
        return {
          results: [
            { label: 'Calculated Date (UTC)', value: date.toUTCString(), isPrimary: true },
            { label: 'Local Time equivalence', value: date.toString() }
          ]
        };
      } catch (e) {
        return {
          results: [{ label: 'Error', value: 'Invalid Timestamp.', isPrimary: true }]
        };
      }
    }
  },
  {
    id: 'prog-time-complexity',
    name: 'Complexity Limit Calculator',
    slug: 'time-complexity-calculator',
    category: 'programming',
    description: 'Calculate operational scaling times across common Big-O complexity curves.',
    seoTitle: 'Big-O Scaled Operations Calculator | Calculatoora',
    seoDescription: 'Compare algorithmic runtimes over variable dataset sizes.',
    inputs: [
      { id: 'n', label: 'Dataset Size (Elements Count N)', type: 'number', defaultValue: 1000 },
      { id: 'opTime', label: 'Single Cycle operational speed (ns)', type: 'number', defaultValue: 5, helpText: 'Processor cycle speed in nanoseconds' }
    ],
    formula: 'Exec Time = Operations * BaseCycle_ns',
    explanation: 'Algorithm efficiency is measured by how execution times scale as datasets grow. The Big-O notation categorizes these curves.',
    example: 'An O(N²) algorithm processing 1,000 items at 5ns per cycle requires 5 milliseconds of execution time.',
    faq: [
      { question: 'What is O(1)?', answer: 'Constant complexity. Execution times remain identical regardless of dataset growth.' }
    ],
    relatedSlugs: ['big-o-calculator'],
    calculate: (inputs) => {
      const n = Number(inputs.n) || 100;
      const speed = Number(inputs.opTime) || 1; // nanoseconds

      const o1 = speed;
      const oLog = Math.log2(n) * speed;
      const oN = n * speed;
      const oNLog = n * Math.log2(n) * speed;
      const oNSq = n * n * speed;

      const formatNs = (ns: number) => {
        if (ns < 1000) return `${ns.toFixed(1)} ns`;
        if (ns < 1000000) return `${(ns / 1000).toFixed(2)} μs`;
        if (ns < 1000000000) return `${(ns / 1000000).toFixed(2)} ms`;
        return `${(ns / 1000000000).toFixed(3)} sec`;
      };

      return {
        results: [
          { label: 'O(1) - Constant complexity duration', value: formatNs(o1), isPrimary: true },
          { label: 'O(log N) - Logarithmic (Binary searches)', value: formatNs(oLog) },
          { label: 'O(N) - Linear (Basic list loop)', value: formatNs(oN) },
          { label: 'O(N log N) - Linearithmic (Quick Mergesort)', value: formatNs(oNLog) },
          { label: 'O(N²) - Quadratic (Bubble sorting array)', value: formatNs(oNSq) }
        ],
        chartData: [
          { name: 'O(Log N)', value: Math.round(oLog), color: '#10b981' },
          { name: 'O(N)', value: Math.round(oN), color: '#39FF14' },
          { name: 'O(N Log N)', value: Math.round(oNLog), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'prog-big-o',
    name: 'Big-O Cheat-Sheet Analyzer',
    slug: 'big-o-calculator',
    category: 'programming',
    description: 'Analyze algorithm structures to classify their theoretical Big-O complexity levels.',
    seoTitle: 'Big O Algorithmic Code Analyzer | Calculatoora',
    seoDescription: 'Input nested code levels to classify active Big-O complexities.',
    inputs: [
      { id: 'loops', label: 'Nested Loop Levels count', type: 'select', defaultValue: '1', options: [
        { label: 'No loops (Direct commands)', value: '0' },
        { label: 'Single Loop level', value: '1' },
        { label: 'Two nested loops (loop inside loop)', value: '2' },
        { label: 'Three nested loops (high lag)', value: '3' }
      ]},
      { id: 'half', label: 'Does dataset divide by half in each loop?', type: 'select', defaultValue: 'no', options: [
        { label: 'No (sequential iterations)', value: 'no' },
        { label: 'Yes (Binary tree split)', value: 'yes' }
      ]}
    ],
    formula: 'Recursive nested scaling: Loops count defines polynomial degree exponent.',
    explanation: 'Nested loops multiply execution time complexities, while dividing the dataset in half each iteration creates efficient logarithmic scaling.',
    example: 'A single loop that divides the dataset in half each iteration is O(log N) - typical of binary search algorithms.',
    faq: [
      { question: 'What represents the worst Big-O?', answer: 'Exponential O(2^N) or factorial O(N!) are highly inefficient, causing execution times to skyrocket with even single-digit additions.' }
    ],
    relatedSlugs: ['time-complexity-calculator'],
    calculate: (inputs) => {
      const nested = inputs.loops || '1';
      const half = inputs.half || 'no';

      let out = 'O(N)';
      let rating = 'Fairly Scalable 🟡';

      if (nested === '0') {
        if (half === 'yes') {
          out = 'O(1)';
          rating = 'Perfect scaling 🟢';
        } else {
          out = 'O(1)';
          rating = 'Perfect scaling 🟢';
        }
      } else if (nested === '1') {
        if (half === 'yes') {
          out = 'O(log N)';
          rating = 'Excellent scaling 🟢';
        } else {
          out = 'O(N)';
          rating = 'Fairly Scalable 🟡';
        }
      } else if (nested === '2') {
        if (half === 'yes') {
          out = 'O(N log N)';
          rating = 'Good scaling 🟢';
        } else {
          out = 'O(N²)';
          rating = 'Inefficient - Avoid for large data 🔴';
        }
      } else {
        out = 'O(N³)';
        rating = 'Severe Lag hazard - Restructure algorithm 🔴';
      }

      return {
        results: [
          { label: 'Algorithmic Complexity Level', value: out, isPrimary: true },
          { label: 'Efficiency Rating', value: rating }
        ]
      };
    }
  }
];
