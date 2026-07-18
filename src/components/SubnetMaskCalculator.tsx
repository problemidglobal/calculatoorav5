import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Cpu, 
  HelpCircle, 
  Info, 
  Trash2, 
  Sparkles, 
  Share2, 
  BookOpen, 
  Check, 
  Layers, 
  ShieldAlert, 
  Globe, 
  Server,
  ArrowRight,
  Database,
  ArrowDownUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubnetMaskCalculatorProps {
  onNavigate?: (page: string) => void;
}

// Pre-compute CIDR prefixes 1 to 32
const CIDR_PREFIXES = Array.from({ length: 32 }, (_, i) => {
  const cidr = i + 1;
  const bits: number[] = [];
  for (let b = 0; b < 32; b++) {
    bits.push(b < cidr ? 1 : 0);
  }
  const octets: number[] = [];
  for (let o = 0; o < 4; o++) {
    let oct = 0;
    for (let s = 0; s < 8; s++) {
      oct = (oct << 1) | bits[o * 8 + s];
    }
    octets.push(oct);
  }
  const mask = octets.join('.');
  return { cidr, mask };
});

export default function SubnetMaskCalculator({ onNavigate }: SubnetMaskCalculatorProps) {
  // Input states (empty by default)
  const [ipAddress, setIpAddress] = useState<string>('');
  const [cidrPrefix, setCidrPrefix] = useState<string>('');
  const [subnetMask, setSubnetMask] = useState<string>('');
  
  // Validation state
  const [ipError, setIpError] = useState<string>('');
  const [maskError, setMaskError] = useState<string>('');

  // Tab selections
  const [activeTab, setActiveTab] = useState<'calculator' | 'binary' | 'diagram' | 'seo'>('calculator');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync Subnet Mask and CIDR
  const handleCidrChange = (val: string) => {
    setCidrPrefix(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 32) {
      const match = CIDR_PREFIXES.find(p => p.cidr === num);
      if (match) {
        setSubnetMask(match.mask);
        setMaskError('');
      }
    } else if (val === '') {
      setSubnetMask('');
    }
  };

  const handleMaskChange = (val: string) => {
    setSubnetMask(val);
    // Find matching CIDR
    const match = CIDR_PREFIXES.find(p => p.mask === val.trim());
    if (match) {
      setCidrPrefix(match.cidr.toString());
      setMaskError('');
    } else {
      // Custom subnet mask or incomplete
      if (val.trim() === '') {
        setCidrPrefix('');
      } else {
        // Validate custom mask format
        const parts = val.trim().split('.');
        if (parts.length === 4 && parts.every(p => {
          const n = parseInt(p, 10);
          return !isNaN(n) && n >= 0 && n <= 255;
        })) {
          // Convert parts to bits
          const bits: number[] = [];
          for (const p of parts) {
            const num = parseInt(p, 10);
            for (let i = 7; i >= 0; i--) {
              bits.push((num >> i) & 1);
            }
          }
          // Validate if bits are contiguous
          let ended = false;
          let isValid = true;
          let contiguousOnes = 0;
          for (const bit of bits) {
            if (bit === 1) {
              if (ended) {
                isValid = false;
                break;
              }
              contiguousOnes++;
            } else {
              ended = true;
            }
          }
          if (isValid && contiguousOnes > 0) {
            setCidrPrefix(contiguousOnes.toString());
            setMaskError('');
          } else {
            setMaskError('Invalid Subnet Mask format (must be contiguous 1 bits)');
          }
        } else {
          setMaskError('Invalid IP format (must be 4 octets between 0-255)');
        }
      }
    }
  };

  // Helper calculation functions
  const parseIp = (ipStr: string): number[] | null => {
    const parts = ipStr.trim().split('.');
    if (parts.length !== 4) return null;
    const octets = parts.map(p => {
      const num = parseInt(p, 10);
      return num;
    });
    if (octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;
    return octets;
  };

  const octetsToBits = (octets: number[]): number[] => {
    const bits: number[] = [];
    for (const oct of octets) {
      for (let i = 7; i >= 0; i--) {
        bits.push((oct >> i) & 1);
      }
    }
    return bits;
  };

  const bitsToOctets = (bits: number[]): number[] => {
    const octets: number[] = [];
    for (let i = 0; i < 4; i++) {
      let oct = 0;
      for (let j = 0; j < 8; j++) {
        oct = (oct << 1) | bits[i * 8 + j];
      }
      octets.push(oct);
    }
    return octets;
  };

  const bitsToNum = (bits: number[]): number => {
    let num = 0;
    for (const b of bits) {
      num = num * 2 + b;
    }
    return num;
  };

  const numToIp = (num: number): string => {
    const o1 = (num >>> 24) & 255;
    const o2 = (num >>> 16) & 255;
    const o3 = (num >>> 8) & 255;
    const o4 = num & 255;
    return `${o1}.${o2}.${o3}.${o4}`;
  };

  // Run validation
  useEffect(() => {
    if (ipAddress) {
      const parsed = parseIp(ipAddress);
      if (!parsed) {
        setIpError('Invalid IP format (must be e.g. 192.168.1.1)');
      } else {
        setIpError('');
      }
    } else {
      setIpError('');
    }
  }, [ipAddress]);

  // Load Example
  const loadExample = () => {
    setIpAddress('192.168.1.125');
    setCidrPrefix('24');
    setSubnetMask('255.255.255.0');
    setIpError('');
    setMaskError('');
  };

  // Clear All
  const clearAll = () => {
    setIpAddress('');
    setCidrPrefix('');
    setSubnetMask('');
    setIpError('');
    setMaskError('');
  };

  // Perform core calculation
  const getCalculationResults = () => {
    if (!ipAddress || !cidrPrefix || ipError || maskError) return null;

    const ipOctets = parseIp(ipAddress);
    const cidrNum = parseInt(cidrPrefix, 10);

    if (!ipOctets || isNaN(cidrNum) || cidrNum < 1 || cidrNum > 32) return null;

    // Get bit arrays
    const ipBits = octetsToBits(ipOctets);
    const maskBits = [];
    for (let i = 0; i < 32; i++) {
      maskBits.push(i < cidrNum ? 1 : 0);
    }

    const netBits = ipBits.map((b, idx) => b & maskBits[idx]);
    const wildcardBits = maskBits.map(b => b === 1 ? 0 : 1);
    const broadBits = netBits.map((b, idx) => b | wildcardBits[idx]);

    const netOctets = bitsToOctets(netBits);
    const broadOctets = bitsToOctets(broadBits);
    const wildcardOctets = bitsToOctets(wildcardBits);
    const maskOctets = bitsToOctets(maskBits);

    const netIpStr = netOctets.join('.');
    const broadIpStr = broadOctets.join('.');
    const wildcardIpStr = wildcardOctets.join('.');
    const maskIpStr = maskOctets.join('.');

    const netNum = bitsToNum(netBits);
    const broadNum = bitsToNum(broadBits);

    // Host ranges
    let firstHost = '';
    let lastHost = '';
    if (cidrNum === 32) {
      firstHost = ipAddress;
      lastHost = ipAddress;
    } else if (cidrNum === 31) {
      firstHost = netIpStr;
      lastHost = broadIpStr;
    } else {
      firstHost = numToIp(netNum + 1);
      lastHost = numToIp(broadNum - 1);
    }

    // Capacity
    const totalHosts = Math.pow(2, 32 - cidrNum);
    const usableHosts = cidrNum <= 30 ? totalHosts - 2 : cidrNum === 31 ? 2 : 1;

    // IP Class
    const firstOctet = ipOctets[0];
    let ipClass = 'Unknown';
    if (firstOctet >= 1 && firstOctet <= 127) ipClass = 'A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Experimental / Research)';

    // Private/Public address check
    let isPrivate = false;
    let locationScope = 'Public Global Internet';

    if (firstOctet === 10) {
      isPrivate = true;
      locationScope = 'Private RFC 1918 (Class A Subnet Range)';
    } else if (firstOctet === 172 && ipOctets[1] >= 16 && ipOctets[1] <= 31) {
      isPrivate = true;
      locationScope = 'Private RFC 1918 (Class B Subnet Range)';
    } else if (firstOctet === 192 && ipOctets[1] === 168) {
      isPrivate = true;
      locationScope = 'Private RFC 1918 (Class C Subnet Range)';
    } else if (firstOctet === 127) {
      isPrivate = true;
      locationScope = 'Loopback Diagnostic (Localhost)';
    } else if (firstOctet === 169 && ipOctets[1] === 254) {
      isPrivate = true;
      locationScope = 'Link-Local APIPA Address';
    }

    // Binary strings separated by dot
    const formatBitsStr = (bits: number[]) => {
      const p1 = bits.slice(0, 8).join('');
      const p2 = bits.slice(8, 16).join('');
      const p3 = bits.slice(16, 24).join('');
      const p4 = bits.slice(24, 32).join('');
      return `${p1}.${p2}.${p3}.${p4}`;
    };

    return {
      ipOctets,
      ipBits,
      maskBits,
      netBits,
      wildcardBits,
      broadBits,
      ipClass,
      isPrivate,
      locationScope,
      netIpStr,
      broadIpStr,
      wildcardIpStr,
      maskIpStr,
      firstHost,
      lastHost,
      totalHosts,
      usableHosts,
      cidrNum,
      ipBitsStr: formatBitsStr(ipBits),
      maskBitsStr: formatBitsStr(maskBits),
      netBitsStr: formatBitsStr(netBits),
      broadBitsStr: formatBitsStr(broadBits),
      wildcardBitsStr: formatBitsStr(wildcardBits),
    };
  };

  const results = getCalculationResults();

  // Highlight elements matching active status
  const isFormFilled = ipAddress !== '' && cidrPrefix !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="subnet_calculator_root">
      {/* Dynamic SEO breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
        <a 
          href="#/" 
          onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('home'); }}
          className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
        >
          Home
        </a>
        <span>/</span>
        <a 
          href="#/programming"
          onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('category:programming'); }}
          className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
        >
          Networking
        </a>
        <span>/</span>
        <span className="text-blue-600 dark:text-cyan-400 font-bold">Subnet Mask Calculator</span>
      </nav>

      {/* Main Title Block */}
      <div className="mb-10 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-3 bg-blue-500/10 dark:bg-cyan-400/10 rounded-2xl w-fit border border-blue-500/20 dark:border-cyan-400/20">
            <Network className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-none">
              Subnet Mask Calculator
            </h1>
            <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mt-2 max-w-3xl leading-relaxed">
              Calculate range limits, broadcast thresholds, client counts, CIDR lengths, and binary structures instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Inputs (Left) and Interactive Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Setup Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[32px] border border-white/60 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/60 pb-4 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Subnet Configurator
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={loadExample}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-500 dark:text-cyan-400 hover:opacity-80 transition"
                >
                  <Database className="w-3 h-3" /> Example
                </button>
                <span className="text-neutral-300">|</span>
                <button 
                  onClick={clearAll}
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* IP Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  IPv4 Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="e.g., 192.168.1.100"
                    className={`w-full px-4 py-3.5 rounded-2xl border ${
                      ipError ? 'border-red-500 focus:ring-red-400/10' : 'border-neutral-200 dark:border-neutral-800'
                    } bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all font-mono`}
                  />
                  {ipError && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> {ipError}
                    </span>
                  )}
                </div>
              </div>

              {/* Mask / CIDR block (Bidirectional Sync) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CIDR Prefix */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    CIDR Prefix
                  </label>
                  <select
                    value={cidrPrefix}
                    onChange={(e) => handleCidrChange(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all font-mono"
                  >
                    <option value="" className="dark:bg-neutral-950">Select Prefix</option>
                    {Array.from({ length: 32 }, (_, i) => {
                      const c = i + 1;
                      return (
                        <option key={c} value={c} className="dark:bg-neutral-950">
                          /{c}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Subnet Mask */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Subnet Mask
                  </label>
                  <select
                    value={subnetMask}
                    onChange={(e) => handleMaskChange(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all font-mono"
                  >
                    <option value="" className="dark:bg-neutral-950">Select Mask</option>
                    {CIDR_PREFIXES.map((p) => (
                      <option key={p.cidr} value={p.mask} className="dark:bg-neutral-950">
                        {p.mask}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {maskError && (
                <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/15 text-xs text-red-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  {maskError}
                </div>
              )}

              {/* Fast Example Helper Tags */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
                <span className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                  Quick Prefills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { ip: '10.0.0.1', cidr: '8', label: 'Class A (/8)' },
                    { ip: '172.16.0.1', cidr: '16', label: 'Class B (/16)' },
                    { ip: '192.168.1.1', cidr: '24', label: 'Class C (/24)' },
                    { ip: '192.168.100.1', cidr: '28', label: 'Small Subnet (/28)' },
                  ].map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIpAddress(tag.ip);
                        setCidrPrefix(tag.cidr);
                        const maskVal = CIDR_PREFIXES.find(p => p.cidr === parseInt(tag.cidr))?.mask || '255.255.255.0';
                        setSubnetMask(maskVal);
                        setIpError('');
                        setMaskError('');
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-neutral-100 hover:bg-blue-50 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg border border-neutral-200/55 dark:border-neutral-800 hover:text-blue-500 dark:hover:text-cyan-400 transition"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Helper Panel */}
          <div className="p-6 rounded-[24px] border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/30 dark:bg-neutral-950/10">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-mono flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4" /> Real-time Calculation Engine
            </h3>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              This engine processes address spaces dynamically using pure client-side mathematical binary arrays. No database lookups occur. Results adjust in real-time as you write or slide the prefix controls.
            </p>
          </div>
        </div>

        {/* Right column: Interactive Results & Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          {results ? (
            <div className="space-y-6">
              
              {/* Visual Tabs Selector */}
              <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                {[
                  { id: 'calculator', label: 'Key Details', icon: FileText },
                  { id: 'binary', label: 'Binary Breakdown', icon: Cpu },
                  { id: 'diagram', label: 'Network Layout', icon: Layers },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400' 
                          : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: KEY DETAILS */}
              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  {/* Glassmorphic High-contrast Primary Summary Badge */}
                  <div className="rounded-3xl border border-white/10 bg-neutral-950/95 text-white p-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono mb-1">
                          Network ID
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {results.netIpStr}/{results.cidrNum}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono mb-1">
                          Usable Hosts
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
                          {results.usableHosts.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 mt-4 pt-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                      <span>IP Class: <strong>{results.ipClass}</strong></span>
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Computed Instantly
                      </span>
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Subnet Mask', value: results.maskIpStr, icon: Server, color: 'text-blue-500' },
                      { label: 'Broadcast Address', value: results.broadIpStr, icon: Globe, color: 'text-orange-500' },
                      { label: 'First Usable Host', value: results.firstHost, icon: ArrowRight, color: 'text-emerald-500' },
                      { label: 'Last Usable Host', value: results.lastHost, icon: ArrowRight, color: 'text-emerald-500' },
                      { label: 'Wildcard Mask', value: results.wildcardIpStr, icon: Database, color: 'text-purple-500' },
                      { label: 'Total IPs in Subnet', value: results.totalHosts.toLocaleString(), icon: Cpu, color: 'text-sky-500' },
                    ].map((m, idx) => {
                      const Icon = m.icon;
                      return (
                        <div key={idx} className="p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 ${m.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                              {m.label}
                            </span>
                            <span className="font-bold text-base text-neutral-800 dark:text-neutral-100 font-mono">
                              {m.value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* IP Properties list */}
                  <div className="p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/10 space-y-3">
                    <span className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                      Security & Routing Scope
                    </span>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Address Category</span>
                      <span className={`font-bold ${results.isPrivate ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {results.isPrivate ? '🔒 Private Network' : '🌐 Public Address'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-100 dark:border-neutral-850">
                      <span className="text-neutral-500">Routing Target Location</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {results.locationScope}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BINARY BREAKDOWN MATRIX */}
              {activeTab === 'binary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-neutral-950 text-white font-mono text-xs overflow-x-auto border border-neutral-800 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-800 text-[10px] text-neutral-400">
                      <span>ENTITY</span>
                      <span className="tracking-[0.5em] mr-4">OCTET 1 . OCTET 2 . OCTET 3 . OCTET 4</span>
                    </div>

                    {[
                      { name: 'IP Address', ip: ipAddress, bits: results.ipBitsStr, color: 'text-white' },
                      { name: 'Subnet Mask', ip: results.maskIpStr, bits: results.maskBitsStr, color: 'text-cyan-400' },
                      { name: 'Network ID', ip: results.netIpStr, bits: results.netBitsStr, color: 'text-blue-500' },
                      { name: 'Broadcast', ip: results.broadIpStr, bits: results.broadBitsStr, color: 'text-orange-500' },
                      { name: 'Wildcard', ip: results.wildcardIpStr, bits: results.wildcardBitsStr, color: 'text-purple-500' },
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1 py-1.5 border-b border-white/5 last:border-0">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${row.color}`}>{row.name}</span>
                          <span className="text-neutral-400 text-[11px] font-semibold">{row.ip}</span>
                        </div>
                        <div className="text-right text-[11px] sm:text-xs tracking-wider whitespace-nowrap overflow-x-auto text-neutral-300 font-bold">
                          {/* Segment bits with custom color mapping */}
                          {row.bits.split('.').map((octet, oIdx) => (
                            <span key={oIdx} className="inline-block bg-neutral-900 px-1 py-0.5 rounded mx-0.5 first:ml-0">
                              {octet.split('').map((char, cIdx) => {
                                const globalIndex = oIdx * 8 + cIdx;
                                const isNetBit = globalIndex < results.cidrNum;
                                return (
                                  <span 
                                    key={cIdx} 
                                    className={isNetBit ? 'text-cyan-400 font-black' : 'text-neutral-500'}
                                  >
                                    {char}
                                  </span>
                                );
                              })}
                              {oIdx < 3 && <span className="text-white/20 mx-0.5">.</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-cyan-500/10 bg-cyan-400/5 text-xs text-cyan-600 dark:text-cyan-400 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Color Legend</p>
                      <p>
                        <span className="text-cyan-400 font-bold">Cyan bits</span> represent the network segment (derived from the CIDR prefix), while the <span className="text-neutral-500 font-bold">gray bits</span> represent host space assignable to clients.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NETWORK DIAGRAM */}
              {activeTab === 'diagram' && (
                <div className="space-y-6">
                  {/* Horizontal Bar Diagram of Address Space */}
                  <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md space-y-6 shadow-md">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        Subnet Partition Block View
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                        Visualizing how the /<strong>{results.cidrNum}</strong> mask divides the 32-bit address space.
                      </p>
                    </div>

                    {/* Horizontal split bar */}
                    <div className="h-10 rounded-xl overflow-hidden flex font-mono text-[10px] font-bold text-white shadow-inner border border-neutral-300 dark:border-neutral-700">
                      <div 
                        style={{ width: `${(results.cidrNum / 32) * 100}%` }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center relative group cursor-help"
                      >
                        <span className="truncate px-1">Network: {results.cidrNum} bits</span>
                      </div>
                      <div 
                        style={{ width: `${((32 - results.cidrNum) / 32) * 100}%` }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center relative group cursor-help"
                      >
                        <span className="truncate px-1">Host: {32 - results.cidrNum} bits</span>
                      </div>
                    </div>

                    {/* Step-by-step layout of IPs */}
                    <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-6">
                      
                      {/* Network Address milestone */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-blue-600 border-4 border-white dark:border-neutral-950" />
                        <div>
                          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono block">
                            NETWORK ADDRESS (ID)
                          </span>
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                            {results.netIpStr}
                          </span>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Identifies the entire subnet. Non-assignable.
                          </p>
                        </div>
                      </div>

                      {/* Usable Range milestone */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-4 border-white dark:border-neutral-950" />
                        <div>
                          <span className="text-xs font-bold text-emerald-500 font-mono block">
                            CLIENT HOST POOL ({results.usableHosts.toLocaleString()} Usable IPs)
                          </span>
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                            {results.firstHost} — {results.lastHost}
                          </span>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Ranges assignable to physical devices, routers, servers, and switches.
                          </p>
                        </div>
                      </div>

                      {/* Broadcast milestone */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-orange-500 border-4 border-white dark:border-neutral-950" />
                        <div>
                          <span className="text-xs font-bold text-orange-500 font-mono block">
                            SUBNET BROADCAST ADDRESS
                          </span>
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                            {results.broadIpStr}
                          </span>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Target for packages routed to every host in the network. Non-assignable.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md p-12 text-center text-neutral-400 dark:text-neutral-500 h-full flex flex-col items-center justify-center space-y-4">
              <Network className="w-12 h-12 text-neutral-300 dark:text-neutral-700 animate-pulse" />
              <div>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-300 mb-1">
                  Awaiting Subnet Details
                </h3>
                <p className="text-sm max-w-sm mx-auto leading-relaxed">
                  Enter an IP address and choose a subnet mask prefix on the left, or click "Load Example" to compute instant statistics.
                </p>
              </div>
              <button
                onClick={loadExample}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 dark:bg-cyan-400 dark:text-neutral-900 hover:opacity-90 shadow-md transition"
              >
                ⚡ Load Standard Example
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Educational Section & Glossary */}
      <div className="mt-16 pt-12 border-t border-neutral-200/50 dark:border-neutral-800/60 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        
        {/* Core Concepts and Glossary */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Detailed explanation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
              Comprehensive Subnetting Guide
            </h2>
            <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/20 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 space-y-4">
              <p>
                Subnetting is the practice of splitting a single physical network into multiple, smaller logical subnetworks (subnets). This helps isolate traffic, manage security, and optimize IP assignment.
              </p>
              <p>
                In a standard IPv4 network, addresses are 32 bits long, divided into four 8-bit octets. The <strong>Subnet Mask</strong> identifies which part of the address belongs to the network portion and which part belongs to the individual host portion.
              </p>
            </div>
          </section>

          {/* Core Formulas and Math models */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500 dark:text-cyan-400" /> Mathematical Models & Formulas
            </h3>
            <div className="p-6 rounded-2xl bg-neutral-900 text-cyan-400 font-mono text-xs overflow-x-auto border border-neutral-800 space-y-3 leading-relaxed">
              <p className="text-neutral-400 font-semibold uppercase text-[10px] tracking-wider">How host counts are computed:</p>
              <code>Total IP Capacity = 2^(32 - CIDR)</code>
              <br />
              <code>Usable Hosts = 2^(32 - CIDR) - 2   (For CIDR Prefix ≤ 30)</code>
              <p className="text-neutral-500 text-[11px] mt-2 italic">
                * Note: Under RFC 3021, /31 point-to-point subnets ignore the network/broadcast deduction, resulting in exactly 2 usable hosts.
              </p>
            </div>
          </section>

          {/* Educational Glossary Terminology */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500 dark:text-cyan-400" /> Glossary of Networking Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { term: 'Subnet Mask', definition: 'A 32-bit mask used to isolate network bits from host bits in an IP address.' },
                { term: 'CIDR Notation', definition: 'Classless Inter-Domain Routing notation. Represents the subnet mask by counting consecutive 1 bits (e.g. /24).' },
                { term: 'Network Address', definition: 'The first address in a subnet range. Used by routers to deliver packages to the subnet block.' },
                { term: 'Broadcast Address', definition: 'The final IP in a subnet block. Sending packets here distributes them to every host in that subnet.' },
                { term: 'Usable Host Range', definition: 'IP block excluding Network ID and Broadcast IP. These are assigned to devices like laptops, phones, and servers.' },
                { term: 'Wildcard Mask', definition: 'The logical inversion of a subnet mask. Often used in Cisco access control lists (ACLs) and OSPF routing setup.' },
              ].map((g, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white/30 dark:bg-neutral-950/10">
                  <span className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 block mb-1">
                    {g.term}
                  </span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {g.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* In-depth SEO content copy */}
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-850">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Why Use a CIDR & Subnet Calculator?
            </h2>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Whether you are designing corporate enterprise backbones or configuring a home routing access point, our <strong>Subnet Mask Calculator</strong> serves as a reliable reference. Manual binary conversions can be prone to typos, resulting in routing overlap or dead ip segments.
              </p>
              <p>
                As a versatile <strong>CIDR Calculator</strong>, this interface solves classless scopes easily. Older classful boundaries (Class A, B, and C) are no longer strict requirements, meaning subnets can span any size between /1 and /32. By utilizing this <strong>IP Calculator</strong>, network administrators can subdivide ranges to match precise employee numbers without wasting IP space.
              </p>
              <p>
                For advanced troubleshooting, this tool doubles as a <strong>Network Calculator</strong> and <strong>IPv4 Calculator</strong>, delivering precise binary segment translations, wildcard masks, and loopback flags instantly on your dashboard.
              </p>
            </div>
          </section>

        </div>

        {/* Sidebar: FAQs Accordion Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/20 backdrop-blur-md">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 font-mono flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </h4>
            <div className="space-y-3">
              {[
                { 
                  question: 'Why subtract 2 from host counts?', 
                  answer: 'The first address in any subnet represents the network identifier, and the very last IP represents the broadcast address. Neither of these can be assigned to individual client machines.' 
                },
                { 
                  question: 'What is RFC 3021 /31 subnetting?', 
                  answer: 'RFC 3021 allows point-to-point interface links to use /31 subnet masks. Since there are only two devices, separate network and broadcast addresses are redundant, so both addresses are usable hosts.' 
                },
                { 
                  question: 'What is APIPA / Link-local?', 
                  answer: 'APIPA (Automatic Private IP Addressing) allocates link-local IPs within the range of 169.254.0.0 to 169.254.255.255 when a DHCP server is unavailable.' 
                }
              ].map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-neutral-200/50 dark:border-neutral-800/60 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-2 flex items-center justify-between text-left font-semibold text-xs text-neutral-800 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-cyan-400 transition"
                    >
                      <span>{faq.question}</span>
                      <span className="text-xs font-mono">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed pl-1 border-l border-blue-500/25">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
