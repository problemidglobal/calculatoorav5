import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  Trash2, 
  Download, 
  User, 
  Users, 
  Compass, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Info,
  CalendarDays,
  Share2,
  Calendar,
  Gift,
  Zap,
  RotateCcw,
  Plus,
  Eye,
  HeartHandshake,
  MessageCircle,
  HeartCrack,
  Smile,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

// Types of modes
type CalculatorMode = 'classic' | 'plus' | 'crush' | 'anniversary';

// Floaty Heart Interface
interface FloatingHeart {
  id: number;
  x: number; // horizontal percentage (0-100)
  size: number; // scale / size
  delay: number; // animation delay
  duration: number; // animation duration
}

export default function LoveCalculator() {
  // Navigation/mode state
  const [activeMode, setActiveMode] = useState<CalculatorMode>('classic');

  // Input states (MUST start strictly empty, only placeholders!)
  const [yourName, setYourName] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');

  // Mode 2: Love Match Plus additional inputs
  const [yourBirthDate, setYourBirthDate] = useState<string>('');
  const [partnerBirthDate, setPartnerBirthDate] = useState<string>('');
  const [yourNickname, setYourNickname] = useState<string>('');
  const [partnerNickname, setPartnerNickname] = useState<string>('');

  // Mode 3: Crush Calculator inputs
  const [crushYourName, setCrushYourName] = useState<string>('');
  const [crushName, setCrushName] = useState<string>('');

  // Mode 4: Anniversary Counter inputs
  const [anniversaryDate, setAnniversaryDate] = useState<string>('');

  // Floaty heart burst state
  const [floatyHearts, setFloatyHearts] = useState<FloatingHeart[]>([]);
  const nextHeartId = useRef<number>(0);

  // What-If comparisons state
  const [whatIfName1, setWhatIfName1] = useState<string>('');
  const [whatIfName2, setWhatIfName2] = useState<string>('');
  const [comparisons, setComparisons] = useState<Array<{ id: string; name1: string; name2: string; score: number; level: string }>>([]);

  // Ref to download element
  const shareCardRef = useRef<HTMLDivElement | null>(null);

  // Current Local Date
  const currentDate = new Date('2026-07-17T04:28:27-07:00');

  // Trigger floating hearts burst when score changes
  const triggerHeartsBurst = () => {
    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 18; i++) {
      newHearts.push({
        id: nextHeartId.current++,
        x: Math.random() * 90 + 5, // random x coordinate
        size: Math.random() * 20 + 12, // size in px
        delay: Math.random() * 0.4,
        duration: Math.random() * 1.5 + 1.2
      });
    }
    setFloatyHearts((prev) => [...prev, ...newHearts].slice(-40)); // limit to max 40 hearts in state
  };

  // Run confetti/hearts burst upon successful calculations
  useEffect(() => {
    const hasNames = (activeMode === 'classic' && yourName && partnerName) ||
                     (activeMode === 'plus' && yourName && partnerName) ||
                     (activeMode === 'crush' && crushYourName && crushName);
    if (hasNames) {
      triggerHeartsBurst();
    }
  }, [yourName, partnerName, crushYourName, crushName, activeMode]);

  // Clean floaty hearts after animation
  useEffect(() => {
    if (floatyHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatyHearts([]);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [floatyHearts]);

  // Loading mock examples
  const handleLoadExample = () => {
    if (activeMode === 'classic') {
      setYourName('Alex');
      setPartnerName('Taylor');
    } else if (activeMode === 'plus') {
      setYourName('William');
      setPartnerName('Sophia');
      setYourBirthDate('1998-05-14');
      setPartnerBirthDate('1999-09-22');
      setYourNickname('Will');
      setPartnerNickname('Sophy');
    } else if (activeMode === 'crush') {
      setCrushYourName('Emma');
      setCrushName('Jordan');
    } else if (activeMode === 'anniversary') {
      setAnniversaryDate('2022-10-15');
    }
  };

  // Clearing all inputs
  const handleClearAll = () => {
    setYourName('');
    setPartnerName('');
    setYourBirthDate('');
    setPartnerBirthDate('');
    setYourNickname('');
    setPartnerNickname('');
    setCrushYourName('');
    setCrushName('');
    setAnniversaryDate('');
    setWhatIfName1('');
    setWhatIfName2('');
    setComparisons([]);
    setFloatyHearts([]);
  };

  // Deterministic Love score calculation
  const getLoveScoreAndLevel = () => {
    let name1 = '';
    let name2 = '';
    let extraPoints = 0;

    if (activeMode === 'classic') {
      name1 = yourName;
      name2 = partnerName;
    } else if (activeMode === 'plus') {
      name1 = yourName;
      name2 = partnerName;
      if (yourNickname) extraPoints += yourNickname.length * 2;
      if (partnerNickname) extraPoints += partnerNickname.length * 2;
      if (yourBirthDate) extraPoints += new Date(yourBirthDate).getDate();
      if (partnerBirthDate) extraPoints += new Date(partnerBirthDate).getDate();
    } else if (activeMode === 'crush') {
      name1 = crushYourName;
      name2 = crushName;
    }

    if (!name1.trim() || !name2.trim()) {
      return null;
    }

    const n1Clean = name1.trim().toLowerCase();
    const n2Clean = name2.trim().toLowerCase();

    // Symmetrical sorting so Name1 + Name2 is identical to Name2 + Name1
    const sorted = [n1Clean, n2Clean].sort();
    const combinedString = sorted[0] + '💘' + sorted[1];

    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      hash = (hash * 31 + combinedString.charCodeAt(i)) % 10000;
    }

    hash += extraPoints;

    // Generate deterministic compatibility score between 45% and 99% for fun and encouragement
    let score = 48 + (hash % 51);

    // Fun exceptions: if names are the same, give high rating
    if (n1Clean === n2Clean) {
      score = 99;
    }

    let level = 'Growing Together';
    let description = '';
    let color = 'from-rose-500 to-pink-500';
    let emoji = '💖';

    if (score >= 90) {
      level = 'Best Friends & Soulmates';
      description = 'An extraordinary alignment of hearts. Your chemistry is absolutely magnetic, intuitive, and filled with deep laughter!';
      color = 'from-rose-500 to-pink-600';
      emoji = '👑';
    } else if (score >= 80) {
      level = 'Great Match';
      description = 'A beautiful harmony of values, rhythm, and wit. You support and complement each other like perfect puzzle pieces.';
      color = 'from-pink-500 to-rose-500';
      emoji = '🔥';
    } else if (score >= 70) {
      level = 'Strong Connection';
      description = 'Dynamic energy and vibrant sparks! There is a high level of mutual fascination and emotional warmth between you.';
      color = 'from-pink-500 to-orange-400';
      emoji = '💫';
    } else if (score >= 60) {
      level = 'Good Chemistry';
      description = 'Wonderful compatibility with comfortable trust. Shared hobbies and fun times make this bond uniquely pleasant.';
      color = 'from-violet-500 to-pink-500';
      emoji = '⭐';
    } else if (score >= 50) {
      level = 'Growing Together';
      description = 'A lovely, steady friendship that holds sweet potential. Taking time to understand each other leads to great discoveries.';
      color = 'from-indigo-500 to-purple-500';
      emoji = '🌱';
    } else if (score >= 40) {
      level = 'Adventure Awaits';
      description = 'Full of spontaneous fun and contrasting viewpoints! Your unique differences can spark incredible adventures together.';
      color = 'from-emerald-500 to-teal-500';
      emoji = '🎒';
    } else {
      level = 'Needs Communication';
      description = 'A unique, gentle bond. Heart-to-heart conversations, deep patience, and quiet dates will reveal your beautiful hidden connections.';
      color = 'from-amber-500 to-orange-500';
      emoji = '💬';
    }

    // Playful insight rules based on score
    const insights = [
      'Communication is your absolute superpower.',
      'Remember that mutual trust and respect matter infinitely more than any score.',
      'A surprise date night or an unexpected tiny gift would spark beautiful joy today.',
      'You are highly likely to share matching tastes in music, movies, or late-night snacks!'
    ];

    return { score, level, description, color, emoji, insights };
  };

  const currentResult = getLoveScoreAndLevel();

  // Mode 4: Anniversary Time calculations
  const getAnniversaryStats = () => {
    if (!anniversaryDate) return null;

    const start = new Date(anniversaryDate);
    if (isNaN(start.getTime())) return null;

    // Time difference in milliseconds
    const diffMs = currentDate.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (totalDays < 0) {
      // Future date chosen
      return {
        isFuture: true,
        daysToStart: Math.abs(totalDays)
      };
    }

    const totalWeeks = (totalDays / 7).toFixed(1);
    const totalMonths = (totalDays / 30.43).toFixed(1);
    const totalYears = (totalDays / 365.24).toFixed(1);

    // Calculate Countdown to Next Anniversary
    const startMonth = start.getMonth();
    const startDay = start.getDate();

    let nextAnniversaryYear = currentDate.getFullYear();
    let nextAnniversary = new Date(nextAnniversaryYear, startMonth, startDay);

    if (nextAnniversary.getTime() < currentDate.getTime()) {
      nextAnniversaryYear += 1;
      nextAnniversary = new Date(nextAnniversaryYear, startMonth, startDay);
    }

    const msToNext = nextAnniversary.getTime() - currentDate.getTime();
    const daysToNext = Math.ceil(msToNext / (1000 * 60 * 60 * 24));

    // Milestones calculations
    const milestones = [
      { label: '100 Days', days: 100 },
      { label: '6 Months (182 Days)', days: 182 },
      { label: '1 Year (365 Days)', days: 365 },
      { label: '2 Years (730 Days)', days: 730 },
      { label: '5 Years (1826 Days)', days: 1826 },
      { label: '10 Years (3652 Days)', days: 3652 }
    ].map(m => {
      const milestoneDate = new Date(start.getTime() + m.days * 24 * 60 * 60 * 1000);
      const isPassed = totalDays >= m.days;
      const daysDiff = m.days - totalDays;
      return {
        ...m,
        dateString: milestoneDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isPassed,
        daysDiff
      };
    });

    return {
      isFuture: false,
      totalDays,
      totalWeeks,
      totalMonths,
      totalYears,
      daysToNext,
      nextAnniversaryString: nextAnniversary.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      milestones
    };
  };

  const anniversaryStats = getAnniversaryStats();

  // Add comparison for What-If Mode
  const addWhatIfComparison = () => {
    if (!whatIfName1.trim() || !whatIfName2.trim()) return;

    const n1 = whatIfName1.trim();
    const n2 = whatIfName2.trim();

    const n1Clean = n1.toLowerCase();
    const n2Clean = n2.toLowerCase();
    const sorted = [n1Clean, n2Clean].sort();
    const combinedString = sorted[0] + '💘' + sorted[1];

    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      hash = (hash * 31 + combinedString.charCodeAt(i)) % 10000;
    }
    const score = 48 + (hash % 51);

    let level = 'Growing Together';
    if (score >= 90) level = 'Soulmates';
    else if (score >= 80) level = 'Great Match';
    else if (score >= 70) level = 'Strong Bond';
    else if (score >= 60) level = 'Good Chem';
    else if (score >= 50) level = 'Nice Vibe';
    else if (score >= 40) level = 'Adventure';
    else level = 'Quiet Connection';

    const newCompare = {
      id: Date.now().toString(),
      name1: n1,
      name2: n2,
      score,
      level
    };

    setComparisons([newCompare, ...comparisons]);
    setWhatIfName1('');
    setWhatIfName2('');
    triggerHeartsBurst();
  };

  // Remove comparison from list
  const removeComparison = (id: string) => {
    setComparisons(comparisons.filter(c => c.id !== id));
  };

  // Download Share Card as PNG
  const downloadShareCard = () => {
    if (!shareCardRef.current) return;
    
    // Smooth high-res rendering with html2canvas
    html2canvas(shareCardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false
    }).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const partnerText = activeMode === 'crush' ? crushName : partnerName;
      const selfText = activeMode === 'crush' ? crushYourName : yourName;
      link.download = `Calculatoora_LoveMatch_${selfText}_and_${partnerText}.png`;
      link.href = image;
      link.click();
    });
  };

  return (
    <div className="space-y-12">
      {/* Decorative Rising Floaty Hearts Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatyHearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute bottom-10 animate-float-heart text-red-500 opacity-80"
            style={{
              left: `${heart.x}%`,
              fontSize: `${heart.size}px`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Main Glassmorphic Panel Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest rounded-full border border-red-500/20">
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-red-500" />
          The Ultimate Match Hub
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Love <span className="text-red-500 drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">Calculator</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Unveil relationship compatibility percentages, chronological anniversary milestones, and premium digital share cards instantly.
        </p>
      </div>

      {/* Action Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveMode('classic'); }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${activeMode === 'classic' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Classic Mode
          </button>
          <button
            onClick={() => { setActiveMode('plus'); }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${activeMode === 'plus' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Love Match Plus
          </button>
          <button
            onClick={() => { setActiveMode('crush'); }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${activeMode === 'crush' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Crush Calculator
          </button>
          <button
            onClick={() => { setActiveMode('anniversary'); }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${activeMode === 'anniversary' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
          >
            Anniversary Counter
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLoadExample}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 hover:bg-blue-500/20 rounded-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Example
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-500 dark:text-neutral-400 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Realtime Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Config Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              Configure Compatibility Metrics
            </h3>

            {/* Render Inputs dynamically depending on mode */}
            {activeMode === 'classic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Partner's Full Name
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="e.g. Taylor"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'plus' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        placeholder="e.g. William"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Partner's Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="e.g. Sophia"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Your Birth Date <span className="text-[10px] text-neutral-400 lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="date"
                        value={yourBirthDate}
                        onChange={(e) => setYourBirthDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Partner's Birth Date <span className="text-[10px] text-neutral-400 lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="date"
                        value={partnerBirthDate}
                        onChange={(e) => setPartnerBirthDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Your Nickname <span className="text-[10px] text-neutral-400 lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={yourNickname}
                      onChange={(e) => setYourNickname(e.target.value)}
                      placeholder="e.g. Will"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                      Partner's Nickname <span className="text-[10px] text-neutral-400 lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={partnerNickname}
                      onChange={(e) => setPartnerNickname(e.target.value)}
                      placeholder="e.g. Sophy"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'crush' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={crushYourName}
                      onChange={(e) => setCrushYourName(e.target.value)}
                      placeholder="e.g. Emma"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Your Crush's Name
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={crushName}
                      onChange={(e) => setCrushName(e.target.value)}
                      placeholder="e.g. Jordan"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'anniversary' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                    Relationship Start Date
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/30 transition text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick What-If Comparison Module */}
          <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <Plus className="w-4 h-4 text-pink-500" />
              What-If Match Comparator
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Instantly compare alternative potential partner combinations side-by-side.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name A"
                value={whatIfName1}
                onChange={(e) => setWhatIfName1(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Name B"
                value={whatIfName2}
                onChange={(e) => setWhatIfName2(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <button
              onClick={addWhatIfComparison}
              disabled={!whatIfName1.trim() || !whatIfName2.trim()}
              className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              Add Comparison Match
            </button>

            {comparisons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 max-h-48 overflow-y-auto">
                {comparisons.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 text-xs">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {item.name1} & {item.name2}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-500 dark:text-pink-400">{item.score}%</span>
                      <span className="px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-[10px] text-pink-600 dark:text-pink-400 font-semibold">{item.level}</span>
                      <button onClick={() => removeComparison(item.id)} className="text-neutral-400 hover:text-red-500 transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Entertainment Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              <strong>Disclaimer:</strong> This calculator is for entertainment and fun purposes only. Relationships thrive on communication, mutual trust, and compatibility that cannot be measured by algorithm hashes. Always trust your heart!
            </span>
          </div>
        </div>

        {/* Right Hand: Dynamic Results / Empty State */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!currentResult && !anniversaryStats && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center border-2 border-dashed border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl min-h-[400px] bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mb-4 animate-bounce">
                  <Heart className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Awaiting Cosmic Alignment</h3>
                <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  {activeMode === 'anniversary' 
                    ? 'Please select your special relationship start date to calculate beautiful milestone anniversaries and ticking counters.' 
                    : 'Fill in your name and partner details to instantly calculate your cosmic compatibility score, insights, and premium share cards.'}
                </p>
                <button
                  onClick={handleLoadExample}
                  className="mt-6 px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 text-white dark:text-neutral-900 font-bold rounded-2xl text-xs sm:text-sm tracking-wide transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Load Sample Data
                </button>
              </motion.div>
            )}

            {/* Render Love Match Results (Classic, Plus, Crush) */}
            {currentResult && activeMode !== 'anniversary' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Result Hero Header */}
                <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-xl space-y-6 text-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-b ${currentResult.color} opacity-5 dark:opacity-10 pointer-events-none`} />

                  {/* Liquid Heart compatibility indicator */}
                  <div className="relative inline-flex items-center justify-center mb-2">
                    <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl animate-pulse" />
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Track Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-neutral-100 dark:stroke-neutral-800"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-red-500"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - currentResult.score / 100)}`}
                        strokeLinecap="round"
                        fill="none"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                    </svg>
                    {/* Centered text */}
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                        {currentResult.score}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                        Love Match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
                      <span>{currentResult.emoji}</span>
                      {currentResult.level}
                    </h3>
                    <p className="max-w-md mx-auto text-sm text-neutral-500 dark:text-neutral-400 italic">
                      "{currentResult.description}"
                    </p>
                  </div>

                  {/* Heart Strength Meter */}
                  <div className="space-y-1.5 text-left max-w-sm mx-auto">
                    <div className="flex justify-between text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      <span>Relationship Connection Gauge</span>
                      <span className="text-rose-500">{currentResult.score}%</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                        style={{ width: `${currentResult.score}%`, transition: 'width 1s ease-out' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Fun insights checklist */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500 fill-current" />
                    Real-time Relationship Insights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentResult.insights.map((insight, idx) => (
                      <div key={idx} className="flex gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/30 dark:border-neutral-800/30 text-xs text-neutral-600 dark:text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium digital share card - DOM element that gets downloaded */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
                      Digital Share Card preview
                    </h4>
                    <button
                      onClick={downloadShareCard}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition shadow-md shadow-rose-500/10"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save PNG Card
                    </button>
                  </div>

                  {/* Share Card Container */}
                  <div 
                    ref={shareCardRef}
                    className="p-8 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-rose-950 text-white border border-rose-900/40 shadow-2xl relative overflow-hidden select-none max-w-lg mx-auto"
                  >
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Watermark/Branding */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                      <span className="text-xs tracking-[0.2em] font-extrabold uppercase text-rose-400">
                        Calculatoora Match
                      </span>
                      <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    </div>

                    {/* Names Block */}
                    <div className="text-center space-y-1 mb-8">
                      <div className="text-2xl font-black tracking-tight flex items-center justify-center gap-2 text-white">
                        <span>{activeMode === 'crush' ? crushYourName : yourName}</span>
                        <Heart className="w-5 h-5 text-red-500 fill-current shrink-0" />
                        <span>{activeMode === 'crush' ? crushName : partnerName}</span>
                      </div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest">
                        Cosmic Couple Assessment
                      </p>
                    </div>

                    {/* compatibility Circle Score */}
                    <div className="flex justify-center items-center gap-6 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <div className="text-5xl font-black text-rose-500 tracking-tighter drop-shadow-lg">
                        {currentResult.score}%
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div className="text-left">
                        <div className="text-xs text-rose-400 uppercase font-black tracking-wider">
                          {currentResult.level}
                        </div>
                        <div className="text-[10px] text-neutral-300 mt-0.5 line-clamp-2">
                          {currentResult.description}
                        </div>
                      </div>
                    </div>

                    {/* Aesthetic quote */}
                    <p className="text-center italic text-xs text-neutral-300 px-4">
                      "True companionship is mapped not by stars or scores, but by the laughter shared and the storms weather-proofed together."
                    </p>

                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest">
                      <span>Calculatoora.com</span>
                      <span>Verified Fun Match</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Render Anniversary Stats (Countdown & Timeline) */}
            {anniversaryStats && activeMode === 'anniversary' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {anniversaryStats.isFuture ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-xl text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Future Milestone Selected</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Your anniversary starts in <strong>{anniversaryStats.daysToStart}</strong> days! We look forward to counting the wonderful moments together.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Anniversary Hero Counters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-center shadow">
                        <div className="text-2xl sm:text-3xl font-black text-red-500">{anniversaryStats.totalDays}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Days Together</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-center shadow">
                        <div className="text-2xl sm:text-3xl font-black text-rose-500">{anniversaryStats.totalWeeks}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Weeks Together</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-center shadow">
                        <div className="text-2xl sm:text-3xl font-black text-purple-500">{anniversaryStats.totalMonths}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Months Together</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-center shadow">
                        <div className="text-2xl sm:text-3xl font-black text-pink-500">{anniversaryStats.totalYears}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Years Together</div>
                      </div>
                    </div>

                    {/* Next Anniversary Countdown Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-xl space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-100">
                        <Gift className="w-4 h-4 text-white fill-current animate-bounce" />
                        Next Anniversary Countdown
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-4xl font-extrabold tracking-tight">{anniversaryStats.daysToNext}</span>
                          <span className="text-lg font-bold ml-1 text-pink-100">Days Remaining</span>
                        </div>
                        <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                          {anniversaryStats.nextAnniversaryString}
                        </span>
                      </div>
                    </div>

                    {/* Milestone Timeline Checklist */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-xl space-y-4">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        Relationship Journey Milestones
                      </h4>
                      <div className="space-y-3">
                        {anniversaryStats.milestones.map((m, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-xl border transition ${
                              m.isPassed
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                                : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200/40 dark:border-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-2.5 h-2.5 rounded-full ${m.isPassed ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                              <div>
                                <div className="text-xs font-bold uppercase tracking-wide">{m.label}</div>
                                <div className="text-[10px] mt-0.5 opacity-80">{m.dateString}</div>
                              </div>
                            </div>

                            <span className="text-xs font-bold">
                              {m.isPassed ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  Achieved!
                                </span>
                              ) : (
                                `In ${m.daysDiff} days`
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Structured educational / SEO Sections */}
      <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 pt-10 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white text-center">
            Love compatibility, Science, and Communication Guide
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            Understand how our deterministic love match tool parses characteristics, and learn tips for building resilient bonds.
          </p>

          {/* Accordion Panels */}
          <div className="space-y-4">
            <details className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 cursor-pointer">
              <summary className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex justify-between items-center select-none list-none">
                How Do Love Calculators Work?
                <span className="transition group-open:rotate-180 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-2 cursor-default">
                <p>
                  Most love compatibility tools utilize deterministic character mapping algorithms. This application maps the Unicode values of user-entered characters and nicknames to establish a fixed relational key. Symmetrical sorting guarantees that Alex and Taylor receive the exact same score regardless of who is entered in input block one or two.
                </p>
                <p>
                  By processing values locally on the client side, results are generated instantly with zero delay, high privacy, and absolute security.
                </p>
              </div>
            </details>

            <details className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 cursor-pointer">
              <summary className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex justify-between items-center select-none list-none">
                Are Love Calculators Accurate?
                <span className="transition group-open:rotate-180 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-2 cursor-default">
                <p>
                  No, love compatibility calculators are for **fun and entertainment purposes only**. Real relationship compatibility cannot be summarized by names or birthdays. Mutual values, empathy, shared aspirations, active communication, and a decision to support each other through seasons determine actual relationship health.
                </p>
              </div>
            </details>

            <details className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 cursor-pointer">
              <summary className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex justify-between items-center select-none list-none">
                3 Key Tips for Building Stronger Relationships
                <span className="transition group-open:rotate-180 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-3 cursor-default">
                <div>
                  <h5 className="font-bold text-neutral-800 dark:text-neutral-200">1. Practice Active Listening</h5>
                  <p>Acknowledge your partner's feelings without planning a counter-argument immediately. Mirroring statements helps both parties feel validated.</p>
                </div>
                <div>
                  <h5 className="font-bold text-neutral-800 dark:text-neutral-200">2. Cultivate Shared Rituals</h5>
                  <p>Whether it's Sunday morning walks, weekly game nights, or cooking an unusual recipe together, regular positive activities establish stable anchor points.</p>
                </div>
                <div>
                  <h5 className="font-bold text-neutral-800 dark:text-neutral-200">3. Express Consistent Gratitude</h5>
                  <p>Explicitly thank your partner for simple daily tasks. Small tokens of recognition prevent relationships from feeling stagnant or taken for granted.</p>
                </div>
              </div>
            </details>

            <details className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 cursor-pointer">
              <summary className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex justify-between items-center select-none list-none">
                Frequently Asked Questions (FAQ)
                <span className="transition group-open:rotate-180 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-3 cursor-default">
                <div>
                  <h5 className="font-bold text-neutral-800 dark:text-neutral-200">Q: Does order of entry change the percentage?</h5>
                  <p>A: No. Symmetrical sorting guarantees entering "Emma and Jordan" is calculated identically to "Jordan and Emma".</p>
                </div>
                <div>
                  <h5 className="font-bold text-neutral-800 dark:text-neutral-200">Q: Is my data saved anywhere or shared?</h5>
                  <p>A: Your inputs are completely private, computed entirely in the browser, and never transmitted over the internet or logged in a database.</p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
