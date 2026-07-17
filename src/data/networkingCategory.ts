import { Calculator } from '../types';

export const NETWORKING_CALCULATORS: Calculator[] = [
  {
    id: 'net-ip-address',
    name: 'IP Address Analyzer',
    slug: 'ip-address',
    category: 'programming',
    description: 'Deconstruct solid IPv4 networks, identify standard address classes, and check private scopes.',
    seoTitle: 'IPv4 Address Analyzer & Class Calculator | Calculatoora',
    seoDescription: 'Decode IP addresses to reveal their subnet class (A, B, C, D, E), binary structure, block scopes, and public/private status.',
    inputs: [
      { id: 'ipStr', label: 'IPv4 Address', type: 'text', defaultValue: '192.168.1.15' }
    ],
    formula: 'Class checking via first octet thresholds: A (<128), B (<191), C (<223), D (<239), E (<255).',
    explanation: 'IPv4 addresses are 32-bit values split into four 8-bit registers (octets). They define device identities and topological scopes.',
    example: 'Input "192.168.1.1" falls in Class C, marked as private subnet range.',
    faq: [
      { question: 'What is a private IP address?', answer: 'Special network scopes reserved for local routing networks. They do not route over public internet networks (e.g., 192.168.x.x, 10.x.x.x).' }
    ],
    relatedSlugs: ['subnet-mask', 'cidr-range', 'ipv4-to-binary'],
    calculate: (inputs) => {
      const parts = (inputs.ipStr || '').split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return {
          results: [{ label: 'Validation', value: '❌ Invalid IPv4 Format', isPrimary: true }]
        };
      }

      const oct1 = parts[0];
      let addrClass = 'Unknown';
      let scope = 'Public IP Route';

      if (oct1 >= 1 && oct1 <= 127) {
        addrClass = 'Class A';
        if (oct1 === 10) scope = 'Private Subnet Range (RFC 1918)';
        if (oct1 === 127) scope = 'Local loopback target';
      } else if (oct1 >= 128 && oct1 <= 191) {
        addrClass = 'Class B';
        if (oct1 === 172 && parts[1] >= 16 && parts[1] <= 31) scope = 'Private Subnet Range (RFC 1918)';
      } else if (oct1 >= 192 && oct1 <= 223) {
        addrClass = 'Class C';
        if (oct1 === 192 && parts[1] === 168) scope = 'Private Subnet Range (RFC 1918)';
      } else if (oct1 >= 224 && oct1 <= 239) {
        addrClass = 'Class D (Multicast)';
        scope = 'Reserved Multicast Routing';
      } else if (oct1 >= 240 && oct1 <= 255) {
        addrClass = 'Class E (Experimental)';
        scope = 'Reserved Experimental Range';
      }

      const binaryString = parts.map(p => p.toString(2).padStart(8, '0')).join('.');

      return {
        results: [
          { label: 'Address IP', value: parts.join('.'), isPrimary: true },
          { label: 'Subnet Routing Class', value: addrClass },
          { label: 'Network Scope Security', value: scope },
          { label: 'Binary Translation', value: binaryString }
        ]
      };
    }
  },
  {
    id: 'net-subnet-mask',
    name: 'Subnet Mask Calculator',
    slug: 'subnet-mask',
    category: 'programming',
    description: 'Deconstruct subnet bitmasks, retrieve CIDR notation, and evaluate IP addresses available.',
    seoTitle: 'Subnet Mask, Wilcard & CIDR Solver | Calculatoora',
    seoDescription: 'Convert standard subnet masks into CIDR length, determine wildcard components, and calculate host counts.',
    inputs: [
      { id: 'mask', label: 'Choose Subnet Mask', type: 'select', defaultValue: '255.255.255.0', options: [
        { label: '255.255.255.252 (/30)', value: '255.255.255.252' },
        { label: '255.255.255.248 (/29)', value: '255.255.255.248' },
        { label: '255.255.255.240 (/28)', value: '255.255.255.240' },
        { label: '255.255.255.224 (/27)', value: '255.255.255.224' },
        { label: '255.255.255.192 (/26)', value: '255.255.255.192' },
        { label: '255.255.255.128 (/25)', value: '255.255.255.128' },
        { label: '255.255.255.0 (/24)', value: '255.255.255.0' },
        { label: '255.255.254.0 (/23)', value: '255.255.254.0' },
        { label: '255.255.240.0 (/20)', value: '255.255.240.0' },
        { label: '255.255.0.0 (/16)', value: '255.255.0.0' },
        { label: '255.0.0.0 (/8)', value: '255.0.0.0' }
      ]}
    ],
    formula: 'CIDR Prefix = Count(binary bits = 1); Wildcard = 255.255.255.255 - Mask',
    explanation: 'Subnet masks split networks into subnetworks, allowing routers to isolate local broadcast domains from target internet scopes.',
    example: 'Mask "255.255.255.0" yields 256 addresses total, with 254 assignable hosts.',
    faq: [
      { question: 'Why are there two fewer hosts than total addresses?', answer: 'The first address represents the network identifying number, and the last represents the broadcast router, which cannot be assigned to hosts.' }
    ],
    relatedSlugs: ['ip-address', 'cidr-range', 'host-calc'],
    calculate: (inputs) => {
      const maskStr = inputs.mask || '255.255.255.0';
      const parts = maskStr.split('.').map(Number);
      
      const binStr = parts.map(p => p.toString(2).padStart(8, '0')).join('');
      const cidr = binStr.split('1').length - 1;
      
      const wildcard = parts.map(p => 255 - p).join('.');
      const hostBits = 32 - cidr;
      const totalHosts = Math.pow(2, hostBits);
      const assignableHosts = hostBits > 1 ? totalHosts - 2 : 0;

      return {
        results: [
          { label: 'Subnet Mask', value: maskStr, isPrimary: true },
          { label: 'CIDR Prefix length', value: `/${cidr}` },
          { label: 'Wildcard Inverse Mask', value: wildcard },
          { label: 'Total Internal Addresses', value: totalHosts },
          { label: 'Usable Device Hosts count', value: assignableHosts }
        ]
      };
    }
  },
  {
    id: 'net-network-range',
    name: 'Network Range Calculator',
    slug: 'network-range',
    category: 'programming',
    description: 'Calculate start and end address scopes given an IP address and host configuration.',
    seoTitle: 'Network Ranges IP Routing Solver | Calculatoora',
    seoDescription: 'Obtain precise network segment boundaries, start IPs, and end routing endpoints based on masks.',
    inputs: [
      { id: 'ipStr', label: 'Base Device IP', type: 'text', defaultValue: '10.0.0.51' },
      { id: 'cidr', label: 'CIDR Mask (/x)', type: 'range', defaultValue: 24, min: 1, max: 32, step: 1 }
    ],
    formula: 'Network Boundary = Base IP with host bits zeroed; Usable scope extends past next network ID.',
    explanation: 'Calculating range structures prevents network oversubscription and assists engineers in setting up DHCP pools.',
    example: 'A "/24" partition on IP "10.0.0.51" delivers network range "10.0.0.1" through "10.0.0.254".',
    faq: [
      { question: 'What is the role of DHCP range?', answer: 'DHCP pools dynamically hand out IPs inside the usable network range without causing conflicts.' }
    ],
    relatedSlugs: ['ip-address', 'subnet-mask', 'cidr-range'],
    calculate: (inputs) => {
      const ip = inputs.ipStr || '10.0.0.51';
      const cidr = Number(inputs.cidr || 24);
      
      const ipParts = ip.split('.').map(Number);
      if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return {
          results: [{ label: 'Status', value: 'Invalid IP address format', isPrimary: true }]
        };
      }

      // Convert IP to 32bit integer
      const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
      const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr));
      
      const netNum = ipNum & maskNum;
      const broadNum = netNum | ~maskNum;

      const numToIp = (num: number) => {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255
        ].join('.');
      };

      const startUsable = numToIp(netNum + 1);
      const endUsable = numToIp(broadNum - 1);

      return {
        results: [
          { label: 'Subnet Range', value: `${numToIp(netNum)} to ${numToIp(broadNum)}`, isPrimary: true },
          { label: 'Network identification ID', value: numToIp(netNum) },
          { label: 'First Usable Host IP', value: startUsable },
          { label: 'Last Usable Host IP', value: endUsable },
          { label: 'Subnet Broadcast Address', value: numToIp(broadNum) }
        ]
      };
    }
  },
  {
    id: 'net-cidr-range',
    name: 'CIDR Subnet Calculator',
    slug: 'cidr-range',
    category: 'programming',
    description: 'Transform Classless Inter-Domain Routing (CIDR) blocks to host counts and standard subnet mask notations.',
    seoTitle: 'CIDR Prefix IP Subnetting Solver | Calculatoora',
    seoDescription: 'Analyze CIDR classless layouts, resolving netmasks, wildecard masks, and total IP capacities in real-time.',
    inputs: [
      { id: 'cidr', label: 'CIDR / Class Prefix', type: 'range', defaultValue: 28, min: 1, max: 32, step: 1 }
    ],
    formula: 'Addresses = 2^(32 - Prefix); Mask = (Prefix count of 1 bits) trailing with zero bits.',
    explanation: 'CIDR (Classless Inter-Domain Routing) replaced older rigid IP class partitions in 1993, enhancing address allocation efficiency.',
    example: 'CIDR prefix "/28" represents a subnet of 16 IPs with 14 assignable hosts.',
    faq: [
      { question: 'Why did CIDR replace Class-based routing?', answer: 'Class allocations (A, B, C) were highly wasteful, forcing organizations to acquire large blocks they rarely fully utilized.' }
    ],
    relatedSlugs: ['subnet-mask', 'host-calc'],
    calculate: (inputs) => {
      const cidr = Number(inputs.cidr || 28);
      
      const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr));
      const maskStr = [
        (maskInt >>> 24) & 255,
        (maskInt >>> 16) & 255,
        (maskInt >>> 8) & 255,
        maskInt & 255
      ].join('.');

      const ips = Math.pow(2, 32 - cidr);
      const usable = cidr >= 31 ? 0 : ips - 2;

      return {
        results: [
          { label: 'Bit Prefix Length', value: `/${cidr}`, isPrimary: true },
          { label: 'Equivalent Subnet Mask', value: maskStr },
          { label: 'Total Address Bounds', value: ips },
          { label: 'Assignable Interfaces', value: usable }
        ]
      };
    }
  },
  {
    id: 'net-host-calc',
    name: 'Host Capacity Calculator',
    slug: 'host-calc',
    category: 'programming',
    description: 'Calculate usable host capacities from CIDR prefixes or custom address allocations.',
    seoTitle: 'Usable IP Hosts & Interface Solver | Calculatoora',
    seoDescription: 'Input CIDR prefixes to compute maximum assignable network interfaces and subnet addresses.',
    inputs: [
      { id: 'cidr', label: 'Network CIDR Prefix', type: 'range', defaultValue: 22, min: 8, max: 30, step: 1 }
    ],
    formula: 'Assignable hosts = 2^(32 - Prefix) - 2',
    explanation: 'Host capacity calculations help system engineers allocate appropriate subnets for corporate VLANs, wireless scopes, and server corridors.',
    example: 'A "/22" subnet yields a total of 1022 usable network host interfaces.',
    faq: [
      { question: 'What is a loopback IP host?', answer: 'The loopback IP (usually 127.0.0.1) points directly back to the physical source machine, bypassing local routing hardware.' }
    ],
    relatedSlugs: ['cidr-range', 'subnet-mask'],
    calculate: (inputs) => {
      const cidr = Number(inputs.cidr || 22);
      const power = 32 - cidr;
      const total = Math.pow(2, power);
      const usable = total - 2;

      return {
        results: [
          { label: 'Usable Device Interfaces', value: usable.toLocaleString(), isPrimary: true },
          { label: 'Total IP Space addresses', value: total.toLocaleString() },
          { label: 'Host Bits Registered', value: `${power} bits` }
        ],
        chartData: [
          { name: 'Devices IP Bounds', value: usable, color: '#39FF14' },
          { name: 'Gateway/Broadcast Routing', value: 2, color: '#475569' }
        ]
      };
    }
  },
  {
    id: 'net-broadcast-address',
    name: 'Broadcast Address Calculator',
    slug: 'broadcast-address',
    category: 'programming',
    description: 'Identify the exact broadcast destination IP for any target IPv4 subnet.',
    seoTitle: 'IP Broadcast Destination boundary Solver | Calculatoora',
    seoDescription: 'Obtain exact IPv4 broadcast addresses based on custom CIDR subnet inputs.',
    inputs: [
      { id: 'ipStr', label: 'Device IPv4 Address', type: 'text', defaultValue: '172.16.42.127' },
      { id: 'cidr', label: 'CIDR Subnet Prefix', type: 'range', defaultValue: 20, min: 1, max: 32, step: 1 }
    ],
    formula: 'Broadcast = IP OR (NOT SubnetMask)',
    explanation: 'The broadcast address allows a host to broadcast data requests to all devices on a subnet simultaneously.',
    example: 'For IP "172.16.42.127/20", the broadcast IP resolves to "172.16.47.255".',
    faq: [
      { question: 'Does a broadcast IP accept user host assignments?', answer: 'No. Designing networks requires locking broadcast boundaries. Assigning it to a device causes network failures.' }
    ],
    relatedSlugs: ['network-range', 'ip-address'],
    calculate: (inputs) => {
      const ip = inputs.ipStr || '172.16.42.127';
      const cidr = Number(inputs.cidr || 20);

      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return {
          results: [{ label: 'Status', value: 'Invalid IP Target format', isPrimary: true }]
        };
      }

      const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr));
      const broadInt = ipInt | ~maskInt;

      const numToIp = (num: number) => {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255
        ].join('.');
      };

      return {
        results: [
          { label: 'Subnet Broadcast IP', value: numToIp(broadInt), isPrimary: true },
          { label: 'Subnet Network ID', value: numToIp(ipInt & maskInt) },
          { label: 'Equivalent Mask', value: numToIp(maskInt) }
        ]
      };
    }
  },
  {
    id: 'net-ipv4-to-binary',
    name: 'IPv4 to Binary Converter',
    slug: 'ipv4-to-binary',
    category: 'programming',
    description: 'Convert standard dot-decimal IP addresses into distinct raw binary groups.',
    seoTitle: 'IPv4 Decimal to 32-Bit Binary Solver | Calculatoora',
    seoDescription: 'Translate standard dot-decimal IPv4 addresses into formatted 32-bit binary strings.',
    inputs: [
      { id: 'ipStr', label: 'IPv4 Address', type: 'text', defaultValue: '10.200.41.254' }
    ],
    formula: 'Each decimal octet corresponds to 8 binary bits (e.g. 255 -> 11111111).',
    explanation: 'Routers interpret routing rules as binary code. Converting IP addresses to binary reveals how hardware handles routing tables.',
    example: '"10.1.1.1" translates to "00001010.00000001.00000001.00000001".',
    faq: [
      { question: 'What is an octet?', answer: 'An 8-bit section of an IP address. Subnetting configurations modify these bits to create distinct network IDs.' }
    ],
    relatedSlugs: ['ip-address', 'binary-ip'],
    calculate: (inputs) => {
      const parts = (inputs.ipStr || '').split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return {
          results: [{ label: 'Status', value: 'Invalid IPv4 String', isPrimary: true }]
        };
      }

      const binaryParts = parts.map(o => o.toString(2).padStart(8, '0'));

      return {
        results: [
          { label: 'Binary Output', value: binaryParts.join('.'), isPrimary: true },
          { label: 'Full 32bit Raw value', value: binaryParts.join('') },
          { label: 'Integer Decimal conversion', value: parseInt(binaryParts.join(''), 2) }
        ]
      };
    }
  },
  {
    id: 'net-binary-ip',
    name: 'Binary IP to Decimal Converter',
    slug: 'binary-ip',
    category: 'programming',
    description: 'Transform raw binary IP representations back to standardized dot-decimal notation.',
    seoTitle: '32-Bit Binary IP to Decimal Solver | Calculatoora',
    seoDescription: 'Convert 32-character binary address strings back to standardized dot-decimal IPv4 formats.',
    inputs: [
      { id: 'binIp', label: 'Binary Stream (dotted or raw)', type: 'text', defaultValue: '01111111.00000000.00000000.00000001' }
    ],
    formula: 'Decimal value = Sum(bit * 2^(position)) for each 8-bit group.',
    explanation: 'The logical conversion of 1s and 0s back into human-readable dot-decimal formats used on operating system network screens.',
    example: '"11000000.10101000.00000001.00000001" translates back to "192.168.1.1".',
    faq: [
      { question: 'How many IPv4 addresses exist?', answer: 'Approximately 4.29 billion (2^32), which led to the development of Classless Inter-Domain Routing (CIDR) and IPv6.' }
    ],
    relatedSlugs: ['ipv4-to-binary', 'ip-address'],
    calculate: (inputs) => {
      const cleaned = (inputs.binIp || '').replace(/[^01]/g, '');
      if (cleaned.length !== 32) {
        return {
          results: [{ label: 'Error Status', value: '⚠️ Input must contain exactly 32 trailing 1s or 0s.', isPrimary: true }]
        };
      }

      const octets = [
        parseInt(cleaned.slice(0, 8), 2),
        parseInt(cleaned.slice(8, 16), 2),
        parseInt(cleaned.slice(16, 24), 2),
        parseInt(cleaned.slice(24, 32), 2)
      ];

      return {
        results: [
          { label: 'Standard IPv4 Decimal', value: octets.join('.'), isPrimary: true },
          { label: 'Hexadecimal Translation', value: octets.map(o => o.toString(16).toUpperCase().padStart(2, '0')).join(':') }
        ]
      };
    }
  },
  {
    id: 'net-mac-address',
    name: 'MAC Address Format Tool',
    slug: 'mac-address',
    category: 'programming',
    description: 'Validate, clean, and format MAC addresses into standard hexadecimal delimiters.',
    seoTitle: 'MAC Address Cloner & Format Solver | Calculatoora',
    seoDescription: 'Reformat MAC address blocks into standard Cisco, IEEE, or UNIX directory representations.',
    inputs: [
      { id: 'macAddr', label: 'Raw Address string', type: 'text', defaultValue: '001A2B3C4D5E' }
    ],
    formula: 'Hex character grouping of 48-bit media hardware markers.',
    explanation: 'A MAC (Media Access Control) address is a permanent hardware identifier assigned to network cards by manufacturers.',
    example: '"001a2b3c4d5e" formats to "00:1A:2B:3C:4D:5E".',
    faq: [
      { question: 'What is the OUI?', answer: 'The Organizationally Unique Identifier. The first 3 bytes of a MAC address identify the product manufacturer.' }
    ],
    relatedSlugs: ['ip-address', 'ascii-converter-tool'],
    calculate: (inputs) => {
      const raw = (inputs.macAddr || '').replace(/[^0-9a-fA-F]/g, '').toUpperCase();
      
      if (raw.length !== 12) {
        return {
          results: [{ label: 'Validation', value: '❌ Invalid Hex character length. Standard MACs must have 12 hex identifiers.', isPrimary: true }]
        };
      }

      // Format combinations
      const colonSeparated = raw.match(/.{2}/g)?.join(':') || '';
      const dashSeparated = raw.match(/.{2}/g)?.join('-') || '';
      const ciscoSeparated = raw.match(/.{4}/g)?.join('.') || '';

      return {
        results: [
          { label: 'Standard Colon notation', value: colonSeparated, isPrimary: true },
          { label: 'Hyphenated Notation', value: dashSeparated },
          { label: 'Cisco Routing Format', value: ciscoSeparated }
        ]
      };
    }
  },
  {
    id: 'net-bandwidth-calc',
    name: 'Bandwidth Limit Calculator',
    slug: 'bandwidth-calc',
    category: 'programming',
    description: 'Estimate required connection bandwidths to support simultaneous end-user streams.',
    seoTitle: 'Network Bandwidth Capacity Solver | Calculatoora',
    seoDescription: 'Calculate required network speeds based on active user counts and streaming requirements.',
    inputs: [
      { id: 'users', label: 'Simultaneous Active Users', type: 'number', defaultValue: 15 },
      { id: 'service', label: 'Average App usage activity', type: 'select', defaultValue: 'hd-stream', options: [
        { label: 'Browsing, Email & SSH (1 Mbps)', value: '1' },
        { label: 'Interactive Remote VoIP Meetings (3 Mbps)', value: '3' },
        { label: 'Full HD 1080p Video Streaming (10 Mbps)', value: '10' },
        { label: 'UHD 4K High-Bitrate Steaming (25 Mbps)', value: '25' }
      ]}
    ],
    formula: 'Required bandwidth = Active Users * Service Requirement * Overhead Multiplier (1.20).',
    explanation: 'Bandwidth calculations help system architects provision internet lines to prevent congestion during peak usage hours.',
    example: '15 users streaming full HD video require a minimum bandwidth of ~180 Mbps.',
    faq: [
      { question: 'How is packet loss related to bandwidth?', answer: 'When bandwidth demand exceeds capacity, routers drop packets, causing lag and buffering.' }
    ],
    relatedSlugs: ['download-time', 'upload-time'],
    calculate: (inputs) => {
      const users = Number(inputs.users || 15);
      const svcSpeed = Number(inputs.service || 10);
      
      const baseline = users * svcSpeed;
      const overhead = baseline * 1.2; // 20% network allocation overhead buffer

      return {
        results: [
          { label: 'Required Bandwidth Speed', value: `${overhead.toLocaleString()} Mbps`, isPrimary: true },
          { label: 'Active User Load Speed', value: `${baseline.toLocaleString()} Mbps` },
          { label: 'Headroom Allocation Budget', value: `${(overhead - baseline).toLocaleString()} Mbps` }
        ],
        chartData: [
          { name: 'Core Payload', value: baseline, color: '#39FF14' },
          { name: 'Overhead Headroom', value: overhead - baseline, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'net-download-time',
    name: 'Download Time Calculator',
    slug: 'download-time',
    category: 'programming',
    description: 'Determine exact download times based on file weights and connection speeds.',
    seoTitle: 'Download Speed & Time Duration Solver | Calculatoora',
    seoDescription: 'Calculate download times in hours, minutes, and seconds based on network speeds and file weights.',
    inputs: [
      { id: 'fileSize', label: 'File Size', type: 'number', defaultValue: 10 },
      { id: 'fileUnit', label: 'File Unit', type: 'select', defaultValue: 'GB', options: [
        { label: 'Megabytes (MB)', value: 'MB' },
        { label: 'Gigabytes (GB)', value: 'GB' },
        { label: 'Terabytes (TB)', value: 'TB' }
      ]},
      { id: 'linkSpeed', label: 'Net Link Download speed', type: 'number', defaultValue: 100 },
      { id: 'speedUnit', label: 'Speed Unit', type: 'select', defaultValue: 'Mbps', options: [
        { label: 'Megabits per sec (Mbps)', value: 'Mbps' },
        { label: 'Gigabits per sec (Gbps)', value: 'Gbps' }
      ]}
    ],
    formula: 'Time (s) = (File size in bits) / Speed (bps)',
    explanation: 'Network transfer calculations help estimate the time required to sync storage buckets, compile build bundles, or download assets.',
    example: 'Downloading a 10 GB file over a 100 Mbps connection takes approximately 13 minutes and 20 seconds.',
    faq: [
      { question: 'Why does my download take longer than estimated?', answer: 'Real-world factors like network overhead (IP, TCP), routing delays, heat throttle, and hardware writing speeds can reduce effective transfer speed.' }
    ],
    relatedSlugs: ['upload-time', 'bandwidth-calc', 'data-transfer'],
    calculate: (inputs) => {
      const size = Number(inputs.fileSize || 10);
      const sizeUnit = inputs.fileUnit || 'GB';
      const speed = Number(inputs.linkSpeed || 100);
      const speedUnit = inputs.speedUnit || 'Mbps';

      // Convert size to Gigabits (Gb)
      let sizeInGb = size;
      if (sizeUnit === 'MB') sizeInGb = size / 1000;
      if (sizeUnit === 'TB') sizeInGb = size * 1000;
      const sizeInBits = sizeInGb * 8; // Files in Bytes to bits conversions

      // Convert speed to Gbps
      let speedInGbps = speed;
      if (speedUnit === 'Mbps') speedInGbps = speed / 1000;

      const durationSeconds = speedInGbps > 0 ? (sizeInBits / speedInGbps) : 0;
      
      const humanDuration = (secs: number) => {
        if (secs < 60) return `${secs.toFixed(1)} seconds`;
        const mins = Math.floor(secs / 60);
        const remSecs = Math.floor(secs % 60);
        if (mins < 60) return `${mins} min, ${remSecs} sec`;
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        return `${hrs} hr, ${remMins} min, ${remSecs} sec`;
      };

      return {
        results: [
          { label: 'Estimated Download Duration', value: humanDuration(durationSeconds), isPrimary: true },
          { label: 'Total bits transferred', value: `${(sizeInBits).toFixed(2)} Gb` },
          { label: 'Estimated time in raw seconds', value: `${durationSeconds.toFixed(0)} s` }
        ]
      };
    }
  },
  {
    id: 'net-upload-time',
    name: 'Upload Time Calculator',
    slug: 'upload-time',
    category: 'programming',
    description: 'Calculate file uploading durations based on specific file sizes and connection configurations.',
    seoTitle: 'Upload Duration & Internet Bandwidth Solver | Calculatoora',
    seoDescription: 'Obtain precise upload durations for assets, build bundles, or backups using custom bandwidth configurations.',
    inputs: [
      { id: 'fSize', label: 'File Size', type: 'number', defaultValue: 500 },
      { id: 'sizeUnit', label: 'Size Unit', type: 'select', defaultValue: 'MB', options: [
        { label: 'Megabytes (MB)', value: 'MB' },
        { label: 'Gigabytes (GB)', value: 'GB' }
      ]},
      { id: 'upSpeed', label: 'Average Upload Bandwidth', type: 'number', defaultValue: 20 },
      { id: 'speedUnit', label: 'Speed Unit', type: 'select', defaultValue: 'Mbps', options: [
        { label: 'Megabits per sec (Mbps)', value: 'Mbps' },
        { label: 'Gigabits per sec (Gbps)', value: 'Gbps' }
      ]}
    ],
    formula: 'Time = Size in Bits / Upload Speed',
    explanation: 'Symmetric internet provider connections offer equal download and upload speeds. Asymmetric networks (e.g. standard home DSL) limit upload speeds, increasing project upload times.',
    example: 'Uploading a 500 MB backup archive over a typical 20 Mbps connection takes approximately 3 minutes and 20 seconds.',
    faq: [
      { question: 'What is asymmetric routing?', answer: 'Residential networks often assign higher bandwidth for descending packets (download) than ascending packets (upload).' }
    ],
    relatedSlugs: ['download-time', 'data-transfer'],
    calculate: (inputs) => {
      const size = Number(inputs.fSize || 500);
      const sUnit = inputs.sizeUnit || 'MB';
      const speed = Number(inputs.upSpeed || 20);
      const spUnit = inputs.speedUnit || 'Mbps';

      let sizeInGb = size / 1000;
      if (sUnit === 'GB') sizeInGb = size;
      const sizeInBits = sizeInGb * 8;

      let speedInGbps = speed / 1000;
      if (spUnit === 'Gbps') speedInGbps = speed;

      const durationSeconds = speedInGbps > 0 ? (sizeInBits / speedInGbps) : 0;

      const getHMS = (secs: number) => {
        if (secs < 60) return `${secs.toFixed(1)} seconds`;
        const mins = Math.floor(secs / 60);
        const remSecs = Math.floor(secs % 60);
        if (mins < 60) return `${mins} m ${remSecs} s`;
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        return `${hrs} h ${remMins} m ${remSecs} s`;
      };

      return {
        results: [
          { label: 'Estimated Upload Duration', value: getHMS(durationSeconds), isPrimary: true },
          { label: 'Payload binary size equivalent', value: `${sizeInBits.toFixed(2)} Gb` },
          { label: 'Symmetric line capacity (20% safety)', value: `${(durationSeconds * 1.2).toFixed(0)} seconds` }
        ]
      };
    }
  },
  {
    id: 'net-data-transfer',
    name: 'Data Transfer Rate Calculator',
    slug: 'data-transfer',
    category: 'programming',
    description: 'Calculate average transfer speeds of network pipelines given total sizes and durations.',
    seoTitle: 'Network Data Transfer Rate Solver | Calculatoora',
    seoDescription: 'Input transmission weights and duration records to measure real-world network throughput.',
    inputs: [
      { id: 'dataWeight', label: 'Payload Volume Transfered', type: 'number', defaultValue: 12 },
      { id: 'weightUnit', label: 'Volume Unit', type: 'select', defaultValue: 'GB', options: [
        { label: 'Megabytes (MB)', value: 'MB' },
        { label: 'Gigabytes (GB)', value: 'GB' },
        { label: 'Terabytes (TB)', value: 'TB' }
      ]},
      { id: 'durationSecs', label: 'Transmission Duration (Seconds)', type: 'number', defaultValue: 450 }
    ],
    formula: 'Throughput Speed = (Data volume in bits) / Duration in seconds',
    explanation: 'Calculating network speeds based on real-world file transfers helps optimize file distribution channels and measure actual bandwidth performance.',
    example: 'Transferring a 12 GB file in 450 seconds requires an average transfer speed of 213.33 Mbps.',
    faq: [
      { question: 'What is overhead in network transfers?', answer: 'The extra bits added to payloads for protocol routing (TCP headers, handshakes, packet checks), which reduces actual transfer speeds.' }
    ],
    relatedSlugs: ['bandwidth-calc', 'download-time'],
    calculate: (inputs) => {
      const vol = Number(inputs.dataWeight || 12);
      const unit = inputs.weightUnit || 'GB';
      const duration = Number(inputs.durationSecs || 450);

      if (duration <= 0) {
        return { results: [{ label: 'Data rate', value: 'Duration must exceed 0', isPrimary: true }] };
      }

      let gigabits = vol;
      if (unit === 'MB') gigabits = vol / 1000;
      if (unit === 'TB') gigabits = vol * 1000;
      const bits = gigabits * 8 * 1000; // Megabits

      const mbps = bits / duration;
      const gbps = mbps / 1000;

      return {
        results: [
          { label: 'Effective Throughput speed', value: `${mbps.toFixed(2)} Mbps`, isPrimary: true },
          { label: 'Throughput in Gigabits equivalent', value: `${gbps.toFixed(4)} Gbps` },
          { label: 'Actual Transfer efficiency', value: `${(mbps * 0.125).toFixed(2)} MB/s` }
        ]
      };
    }
  }
];
