import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Trash2, 
  Download, 
  User, 
  Users, 
  Compass, 
  TrendingUp, 
  Heart, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Info,
  CalendarDays,
  Briefcase,
  Moon,
  Sun,
  Share2,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

// CHINESE ZODIAC ANIMALS
const CHINESE_ZODIAC_ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

// WESTERN ZODIAC SIGN DATA
const WESTERN_ZODIAC_SIGNS = [
  { name: "Capricorn", start: "12-22", end: "01-19", icon: "♑" },
  { name: "Aquarius", start: "01-20", end: "02-18", icon: "♒" },
  { name: "Pisces", start: "02-19", end: "03-20", icon: "♓" },
  { name: "Aries", start: "03-21", end: "04-19", icon: "♈" },
  { name: "Taurus", start: "04-20", end: "05-20", icon: "♉" },
  { name: "Gemini", start: "05-21", end: "06-20", icon: "♊" },
  { name: "Cancer", start: "06-21", end: "07-22", icon: "♋" },
  { name: "Leo", start: "07-23", end: "08-22", icon: "♌" },
  { name: "Virgo", start: "08-23", end: "09-22", icon: "♍" },
  { name: "Libra", start: "09-23", end: "10-22", icon: "♎" },
  { name: "Scorpio", start: "10-23", end: "11-21", icon: "♏" },
  { name: "Sagittarius", start: "11-22", end: "12-21", icon: "♐" }
];

interface AgeCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function AgeCalculator({ onNavigate }: AgeCalculatorProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison' | 'timeline' | 'seo'>('calculator');
  
  // Calculation Modes
  const [mode, setMode] = useState<'current' | 'specific' | 'difference' | 'future' | 'past'>('current');

  // Input states starting strictly EMPTY
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Comparison Inputs (Person 1 & 2)
  const [p1Name, setP1Name] = useState<string>('');
  const [p1Birth, setP1Birth] = useState<string>('');
  const [p2Name, setP2Name] = useState<string>('');
  const [p2Birth, setP2Birth] = useState<string>('');

  // Slider for custom life expectancy representation (default 80)
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(80);

  // Real-time ticking state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Interactive Life in Weeks tooltip hover states
  const [hoveredWeek, setHoveredWeek] = useState<{ year: number; week: number; age: number; date: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ref to print target
  const reportRef = useRef<HTMLDivElement | null>(null);

  // Set up real-time ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up Life in Weeks canvas rendering
  useEffect(() => {
    if (activeTab === 'timeline' && canvasRef.current && birthDate) {
      renderLifeInWeeksCanvas();
    }
  }, [activeTab, birthDate, lifeExpectancy]);

  // Load realistic mock examples
  const handleLoadExample = () => {
    if (activeTab === 'comparison') {
      setP1Name('Alice');
      setP1Birth('1992-04-12');
      setP2Name('Bob');
      setP2Birth('1995-10-15');
    } else {
      setBirthDate('1995-06-15');
      setTargetDate('2026-07-15');
      setStartDate('2020-01-01');
      setEndDate('2026-07-15');
    }
  };

  // Clear all states
  const handleClearAll = () => {
    setBirthDate('');
    setTargetDate('');
    setStartDate('');
    setEndDate('');
    setP1Name('');
    setP1Birth('');
    setP2Name('');
    setP2Birth('');
  };

  // Safe parsing helper
  const safeDate = (dStr: string) => {
    if (!dStr) return null;
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Get active inputs based on mode
  const getActiveDates = () => {
    const today = currentTime;
    let start: Date | null = null;
    let end: Date | null = null;

    if (mode === 'current') {
      start = safeDate(birthDate);
      end = today;
    } else if (mode === 'specific') {
      start = safeDate(birthDate);
      end = safeDate(targetDate);
    } else if (mode === 'difference') {
      start = safeDate(startDate);
      end = safeDate(endDate);
    } else if (mode === 'future') {
      start = safeDate(birthDate);
      end = safeDate(targetDate);
    } else if (mode === 'past') {
      start = safeDate(birthDate);
      end = safeDate(targetDate);
    }

    return { start, end };
  };

  const { start: dateStart, end: dateEnd } = getActiveDates();

  // Validate the inputs and return friendly alerts
  const getValidationError = (): string | null => {
    if (activeTab === 'comparison') {
      if (!p1Birth || !p2Birth) return 'Enter birth dates for both individuals to run comparisons.';
      const d1 = safeDate(p1Birth);
      const d2 = safeDate(p2Birth);
      if (!d1 || !d2) return 'Invalid birth dates entered.';
      return null;
    }

    if (mode === 'current') {
      if (!birthDate) return 'Enter your Date of Birth to calculate your current age.';
      const b = safeDate(birthDate);
      if (!b) return 'Please enter a valid Date of Birth.';
      if (b > currentTime) return 'Birth date cannot be in the future for current age mode.';
    } else if (mode === 'specific') {
      if (!birthDate) return 'Enter your Date of Birth.';
      if (!targetDate) return 'Enter the Target Date to evaluate age on.';
      const b = safeDate(birthDate);
      const t = safeDate(targetDate);
      if (!b || !t) return 'Enter valid dates.';
    } else if (mode === 'difference') {
      if (!startDate) return 'Enter the Start Date.';
      if (!endDate) return 'Enter the End Date.';
      const s = safeDate(startDate);
      const e = safeDate(endDate);
      if (!s || !e) return 'Enter valid dates.';
      if (s > e) return 'The End Date cannot sit chronologically before the Start Date.';
    } else if (mode === 'future') {
      if (!birthDate) return 'Enter your Date of Birth.';
      if (!targetDate) return 'Enter the Future Target Date.';
      const b = safeDate(birthDate);
      const t = safeDate(targetDate);
      if (!b || !t) return 'Enter valid dates.';
      if (t < b) return 'The target date must be after your birth date.';
      if (t < currentTime) return 'Target date must be a future date in Future Age mode.';
    } else if (mode === 'past') {
      if (!birthDate) return 'Enter your Date of Birth.';
      if (!targetDate) return 'Enter the Past Target Date.';
      const b = safeDate(birthDate);
      const t = safeDate(targetDate);
      if (!b || !t) return 'Enter valid dates.';
      if (t > b) return 'The target date must be before your birth date.';
      if (t > currentTime) return 'Target date must be a past date in Past Age mode.';
    }

    return null;
  };

  const validationError = getValidationError();

  // Primary math engines
  const computeAgeDetails = (start: Date, end: Date) => {
    // If reverse chronological, handle gracefully
    const isNegative = start > end;
    const s = isNegative ? end : start;
    const e = isNegative ? start : end;

    let years = e.getFullYear() - s.getFullYear();
    let months = e.getMonth() - s.getMonth();
    let days = e.getDate() - s.getDate();

    if (days < 0) {
      months--;
      // Get previous month length of the target date
      const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Totals in individual units
    const diffMs = e.getTime() - s.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    const totalHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    
    // Weeks calculation
    const totalWeeks = Math.max(0, Math.floor(totalDays / 7));
    const remainingDaysAfterWeeks = totalDays % 7;

    // Approximations
    const totalMonths = (years * 12 + months + (days / 30.4375)).toFixed(1);
    const totalWeeksDecimal = (totalDays / 7).toFixed(1);

    // Business Days vs Weekend Days lived
    const workingDaysData = getWorkingDaysO1(s, e);

    // Leap Years
    const leapYearData = getLeapYearsPassed(s, e);

    return {
      years,
      months,
      days,
      totalSeconds,
      totalMinutes,
      totalHours,
      totalDays,
      totalWeeks,
      remainingDaysAfterWeeks,
      totalMonths,
      totalWeeksDecimal,
      isNegative,
      businessDays: workingDaysData.businessDays,
      weekendDays: workingDaysData.weekendDays,
      leapYearsCount: leapYearData.count,
      leapYearsList: leapYearData.years
    };
  };

  // O(1) Fast business days counter
  const getWorkingDaysO1 = (start: Date, end: Date) => {
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0,0,0,0);
    e.setHours(0,0,0,0);

    const totalDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const fullWeeks = Math.floor(totalDays / 7);
    let businessDays = fullWeeks * 5;

    const remainder = totalDays % 7;
    let dayOfWeek = s.getDay(); // 0 = Sunday, 6 = Saturday
    for (let i = 0; i < remainder; i++) {
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      dayOfWeek = (dayOfWeek + 1) % 7;
    }

    return {
      businessDays,
      weekendDays: totalDays - businessDays,
      totalDays
    };
  };

  // Count leap years passed between two dates
  const getLeapYearsPassed = (start: Date, end: Date) => {
    let count = 0;
    const years: number[] = [];
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    for (let y = startYear; y <= endYear; y++) {
      const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
      if (isLeap) {
        // Did Feb 29 fall within start and end?
        const feb29 = new Date(y, 1, 29);
        if (feb29 >= start && feb29 <= end) {
          count++;
          years.push(y);
        }
      }
    }
    return { count, years };
  };

  // Next Birthday computations
  const getNextBirthdayData = (dob: Date, target: Date) => {
    const nextBday = new Date(dob);
    nextBday.setFullYear(target.getFullYear());
    
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }

    const diffMs = nextBday.getTime() - target.getTime();
    const daysRemaining = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    
    // Exact components
    let m = nextBday.getMonth() - target.getMonth();
    let d = nextBday.getDate() - target.getDate();
    let y = nextBday.getFullYear() - target.getFullYear();

    if (d < 0) {
      m--;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    // Weekday of next birthday
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const birthdayWeekday = weekdays[nextBday.getDay()];

    // Live countdown timer components (until the next midnight of next birthday)
    const targetMidnight = new Date(nextBday);
    targetMidnight.setHours(0,0,0,0);
    const liveDiffMs = targetMidnight.getTime() - currentTime.getTime();
    
    const liveDays = Math.max(0, Math.floor(liveDiffMs / (1000 * 60 * 60 * 24)));
    const liveHours = Math.max(0, Math.floor((liveDiffMs / (1000 * 60 * 60)) % 24));
    const liveMins = Math.max(0, Math.floor((liveDiffMs / (1000 * 60)) % 60));
    const liveSecs = Math.max(0, Math.floor((liveDiffMs / 1000) % 60));

    // Percentage of the year completed towards next birthday
    // Days since last birthday
    const lastBday = new Date(nextBday);
    lastBday.setFullYear(nextBday.getFullYear() - 1);
    const totalYearMs = nextBday.getTime() - lastBday.getTime();
    const elapsedMs = target.getTime() - lastBday.getTime();
    const elapsedPercent = Math.min(100, Math.max(0, (elapsedMs / totalYearMs) * 100));

    return {
      date: nextBday,
      daysRemaining,
      weeksRemaining: (daysRemaining / 7).toFixed(1),
      monthsRemaining: (daysRemaining / 30.4375).toFixed(1),
      birthdayWeekday,
      liveCountdown: {
        days: liveDays,
        hours: liveHours,
        minutes: liveMins,
        seconds: liveSecs
      },
      elapsedPercent
    };
  };

  // Astronomical & Cultural Birthday Information
  const getCulturalBirthData = (dob: Date) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const dayOfWeek = weekdays[dob.getDay()];
    const birthMonth = months[dob.getMonth()];
    const birthYear = dob.getFullYear();

    // Birth Quarter
    const quarter = Math.floor(dob.getMonth() / 3) + 1;

    // Leap Year Status
    const isLeap = (birthYear % 4 === 0 && birthYear % 100 !== 0) || (birthYear % 400 === 0);

    // Zodiac
    const month = dob.getMonth() + 1;
    const day = dob.getDate();
    let westernZodiac = WESTERN_ZODIAC_SIGNS[0];
    for (const sign of WESTERN_ZODIAC_SIGNS) {
      const [sM, sD] = sign.start.split('-').map(Number);
      const [eM, eD] = sign.end.split('-').map(Number);
      
      const startsInThisMonth = (month === sM && day >= sD);
      const endsInThisMonth = (month === eM && day <= eD);
      if (startsInThisMonth || endsInThisMonth) {
        westernZodiac = sign;
        break;
      }
    }

    // Chinese Zodiac Animal
    const animalIndex = ((birthYear - 1900) % 12 + 12) % 12;
    const chineseZodiac = CHINESE_ZODIAC_ANIMALS[animalIndex];

    // Birth Season
    let northernSeason = '';
    let southernSeason = '';
    if ([11, 0, 1].includes(dob.getMonth())) {
      northernSeason = 'Winter';
      southernSeason = 'Summer';
    } else if ([2, 3, 4].includes(dob.getMonth())) {
      northernSeason = 'Spring';
      southernSeason = 'Autumn';
    } else if ([5, 6, 7].includes(dob.getMonth())) {
      northernSeason = 'Summer';
      southernSeason = 'Winter';
    } else {
      northernSeason = 'Autumn';
      southernSeason = 'Spring';
    }

    // Day Number of the Year
    const startOfYear = new Date(birthYear, 0, 1);
    const dayNumberOfYear = Math.floor((dob.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      dayOfWeek,
      birthMonth,
      birthYear,
      birthQuarter: `Q${quarter}`,
      leapYearStatus: isLeap ? 'Leap Year' : 'Common Year',
      westernZodiac,
      chineseZodiac,
      northernSeason,
      southernSeason,
      dayNumberOfYear
    };
  };

  // Educational milestones calendar generator
  const getMilestones = (dob: Date) => {
    const milestonesList = [
      { id: '100d', label: '100-Day Milestone', type: 'days', value: 100 },
      { id: '500d', label: '500-Day Milestone', type: 'days', value: 500 },
      { id: '1000d', label: '1,000-Day Milestone', type: 'days', value: 1000 },
      { id: '5000d', label: '5,000-Day Milestone', type: 'days', value: 5000 },
      { id: '10000d', label: '10,000-Day Milestone', type: 'days', value: 10000 },
      { id: '20000d', label: '20,000-Day Milestone', type: 'days', value: 20000 },
      { id: '30000d', label: '30,000-Day Milestone', type: 'days', value: 30000 },
      { id: '500m', label: '500-Month Milestone', type: 'months', value: 500 },
      { id: '1000w', label: '1,000-Week Milestone', type: 'weeks', value: 1000 },
      { id: '1b_seconds', label: '1 Billion Seconds Old', type: 'seconds', value: 1000000000 },
      { id: 'half_bday', label: 'Half Birthday', type: 'months', value: 6 },
      { id: 'quarter_bday', label: 'Quarter Birthday', type: 'months', value: 3 },
      { id: 'golden_bday', label: 'Golden Birthday', type: 'golden', value: dob.getDate() }
    ];

    return milestonesList.map(item => {
      let targetDate = new Date(dob);
      if (item.type === 'days') {
        targetDate.setTime(dob.getTime() + (item.value * 24 * 60 * 60 * 1000));
      } else if (item.type === 'months') {
        targetDate.setMonth(dob.getMonth() + item.value);
      } else if (item.type === 'weeks') {
        targetDate.setTime(dob.getTime() + (item.value * 7 * 24 * 60 * 60 * 1000));
      } else if (item.type === 'seconds') {
        targetDate.setTime(dob.getTime() + (item.value * 1000));
      } else if (item.type === 'golden') {
        // When you turn D years old (D = day of birth)
        targetDate.setFullYear(dob.getFullYear() + item.value);
      }

      const passed = targetDate < currentTime;
      const daysDiff = Math.round((targetDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekdayStr = weekdays[targetDate.getDay()];

      return {
        id: item.id,
        label: item.label,
        date: targetDate,
        weekday: weekdayStr,
        passed,
        daysDiff: Math.abs(daysDiff)
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Specific age landmarks milestone checklist requested by the user
  const getSpecialBirthdays = (dob: Date) => {
    const specialAges = [
      { age: 18, label: "18th Birthday (Adulthood)" },
      { age: 21, label: "21st Birthday (Legal Milestone)" },
      { age: 30, label: "30th Birthday (Decade Marker)" },
      { age: 40, label: "40th Birthday (Over the Hill)" },
      { age: 50, label: "50th Birthday (Golden Jubilee)" },
      { age: 60, label: "60th Birthday (Diamond Milestone)" },
      { age: 65, label: "65th Birthday (Retirement Age)" },
      { age: 75, label: "75th Birthday (Platinum Jubilee)" },
      { age: 100, label: "100th Birthday (Centenarian)" }
    ];

    return specialAges.map(item => {
      const bdayDate = new Date(dob);
      bdayDate.setFullYear(dob.getFullYear() + item.age);
      const passed = bdayDate < currentTime;
      const daysDiff = Math.round((bdayDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekdayStr = weekdays[bdayDate.getDay()];

      return {
        age: item.age,
        label: item.label,
        date: bdayDate,
        weekday: weekdayStr,
        passed,
        daysDiff: Math.abs(daysDiff)
      };
    });
  };

  // Renders the signature "Life in Weeks" canvas
  const renderLifeInWeeksCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !birthDate) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dob = new Date(birthDate);
    const yearsToDraw = lifeExpectancy;
    const weeksPerYear = 52;

    const boxSize = 7;
    const gap = 3;
    const labelWidth = 35;
    const topPadding = 25;

    // Set high DPI dimensions
    const width = labelWidth + (weeksPerYear * (boxSize + gap)) + 20;
    const height = topPadding + (yearsToDraw * (boxSize + gap)) + 20;

    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(2, 2);

    // Clear and reset canvas background
    ctx.clearRect(0, 0, width, height);

    // Draw weeks labels at the top
    ctx.font = "8px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8"; // Slate text
    ctx.textAlign = "center";
    ctx.fillText("Week 1", labelWidth + 10, 15);
    ctx.fillText("Week 26", labelWidth + (26 * (boxSize + gap)), 15);
    ctx.fillText("Week 52", labelWidth + (52 * (boxSize + gap)) - 10, 15);

    // Compute the exact biological week count lived
    const elapsedMs = currentTime.getTime() - dob.getTime();
    const livedWeeks = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24 * 7)));

    // Render individual grid cells
    for (let y = 0; y < yearsToDraw; y++) {
      // Draw row labels (ages) every 5 years
      if (y % 5 === 0) {
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 9px Inter, system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`Age ${y}`, labelWidth - 6, topPadding + y * (boxSize + gap) + 7);
      }

      for (let w = 0; w < weeksPerYear; w++) {
        const weekIndex = y * weeksPerYear + w;
        const xPos = labelWidth + w * (boxSize + gap);
        const yPos = topPadding + y * (boxSize + gap);

        const isLived = weekIndex < livedWeeks;
        const isThisWeek = weekIndex === livedWeeks;

        if (isThisWeek) {
          ctx.fillStyle = "#f59e0b"; // Golden glow for current week
        } else if (isLived) {
          // Premium cyan gradient block
          ctx.fillStyle = "rgba(14, 116, 144, 0.85)"; // Cyan 700 Glass
        } else {
          ctx.fillStyle = "rgba(226, 232, 240, 0.4)"; // Faded empty
        }

        // Draw rounded box (approximated)
        ctx.beginPath();
        ctx.roundRect(xPos, yPos, boxSize, boxSize, 1.5);
        ctx.fill();
      }
    }
  };

  // Download PDF / PNG report using html2canvas
  const handleDownloadPNG = async () => {
    const element = reportRef.current;
    if (!element) return;

    // Scroll to top to catch full layout cleanly
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `Calculatoora_Ultimate_Age_Report_${birthDate || 'Empty'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute calculated metrics
  const hasResults = dateStart && dateEnd && !validationError;
  const metrics = hasResults ? computeAgeDetails(dateStart, dateEnd) : null;
  const bdayInfo = dateStart && !validationError ? getCulturalBirthData(dateStart) : null;
  const bdayNext = dateStart && !validationError ? getNextBirthdayData(dateStart, dateEnd || currentTime) : null;
  const milestones = dateStart && !validationError ? getMilestones(dateStart) : [];
  const specialBirthdays = dateStart && !validationError ? getSpecialBirthdays(dateStart) : [];

  // Comparison metrics calculations
  const isComparisonCalculated = p1Birth && p2Birth && !validationError;
  const comparisonResults = (() => {
    if (!isComparisonCalculated) return null;
    const d1 = safeDate(p1Birth)!;
    const d2 = safeDate(p2Birth)!;

    const p1Age = computeAgeDetails(d1, currentTime);
    const p2Age = computeAgeDetails(d2, currentTime);

    const olderPerson = d1 < d2 ? (p1Name || 'Person 1') : (p2Name || 'Person 2');
    const youngerPerson = d1 < d2 ? (p2Name || 'Person 2') : (p1Name || 'Person 1');
    const diffDetails = computeAgeDetails(d1 < d2 ? d1 : d2, d1 < d2 ? d2 : d1);

    return {
      p1Age,
      p2Age,
      olderPerson,
      youngerPerson,
      diffDetails
    };
  })();

  return (
    <div className="relative z-10 space-y-8" id="ultimate-age-calculator-root">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          The World's Most Advanced Chronological Engine
        </motion.div>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
          Age Calculator
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Accurately calculate biological ages, date differences, countdowns, milestones, business workdays, and generate custom Life-In-Weeks graphical reports.
        </p>
      </div>

      {/* QUICK COMMAND BAR */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center justify-between px-4">
        <div className="flex gap-2">
          {/* Main sections routing */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
            }`}
          >
            <Clock className="w-4 h-4" />
            Calculator Core
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
            }`}
          >
            <Users className="w-4 h-4" />
            Comparison Mode
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Life in Weeks
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'seo'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
            }`}
          >
            <Info className="w-4 h-4" />
            Education Content
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLoadExample}
            className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-bold transition cursor-pointer"
          >
            Load Example
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
          {hasResults && (
            <button
              onClick={handleDownloadPNG}
              className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Download Full PNG Report"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
          )}
        </div>
      </div>

      {/* CORE WORKSPACE CONTENT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4" ref={reportRef}>
        
        {/* TAB 1: CORE CALCULATOR */}
        {activeTab === 'calculator' && (
          <>
            {/* INPUT SIDEBAR (LHS) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl border border-neutral-200/65 dark:border-neutral-800/65 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md shadow-xl space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">
                    Calculation Engine
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Choose your mode and key in chronological markers.
                  </p>
                </div>

                {/* MODE CHANGER */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                    Calculation Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-sm font-bold border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="current">📅 Current Age (Birth Date → Today)</option>
                    <option value="specific">🎯 Age on Specific Date (Birth Date → Target Date)</option>
                    <option value="difference">⚖️ Date Difference (Start Date → End Date)</option>
                    <option value="future">🚀 Future Age (Birth Date → Future Date)</option>
                    <option value="past">⏳ Past Age (Birth Date → Past Date)</option>
                  </select>
                </div>

                {/* DYNAMIC FORMS */}
                <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  {/* Mode 1, 2, 4, 5: Birth Date required */}
                  {['current', 'specific', 'future', 'past'].includes(mode) && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex justify-between">
                        <span>Date of Birth</span>
                        <span className="text-[10px] text-rose-500 font-mono font-semibold">Starts empty *</span>
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        placeholder="Select your birth date"
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  )}

                  {/* Mode 2, 4, 5: Target Date required */}
                  {['specific', 'future', 'past'].includes(mode) && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={targetDate}
                        placeholder="Select a date"
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  )}

                  {/* Mode 3: Date Difference start/end */}
                  {mode === 'difference' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          placeholder="Select start date"
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          placeholder="Select end date"
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Validation and Empty warning status */}
                {validationError ? (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 flex gap-2 items-start text-xs leading-normal">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{validationError}</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 flex gap-2 items-center text-xs leading-normal">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Inputs validated mathematically. Running in local browser memory.</span>
                  </div>
                )}
              </div>
            </div>

            {/* RESULTS CONTENT (RHS) */}
            <div className="lg:col-span-8 space-y-8">
              {!hasResults ? (
                <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/10 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                    <Calendar className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-950 dark:text-white">Every input starts empty.</h3>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Please key in your birth date or use the <span className="font-bold text-blue-600 dark:text-cyan-400">"Load Example"</span> button above to trigger the ultimate calculated age reports.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* MAIN RETRO-GLASS RESULTS HEADER */}
                  <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl space-y-4">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono bg-white/20 px-2.5 py-1 rounded-full text-white">
                        Calculated Chronological Report
                      </span>
                      <span className="text-[10px] text-cyan-200 font-mono tracking-wider">
                        O(1) Accuracy
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-blue-100 uppercase tracking-widest font-mono block">Exact Elapsed Age</span>
                      <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                        {metrics!.years} <span className="text-cyan-200 text-lg font-medium">Years</span> {metrics!.months} <span className="text-cyan-200 text-lg font-medium">Months</span> {metrics!.days} <span className="text-cyan-200 text-lg font-medium">Days</span>
                      </h2>
                    </div>

                    {/* LIVE TICKER */}
                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <span className="text-[10px] text-cyan-100 block uppercase font-mono">Weeks Lived</span>
                        <span className="text-lg font-black">{metrics!.totalWeeks.toLocaleString()}</span>
                        <span className="text-[10px] text-cyan-200 block">+{metrics!.remainingDaysAfterWeeks} days</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-100 block uppercase font-mono">Total Hours</span>
                        <span className="text-lg font-black">{metrics!.totalHours.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-100 block uppercase font-mono">Total Minutes</span>
                        <span className="text-lg font-black">{metrics!.totalMinutes.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-100 block uppercase font-mono">Live Seconds</span>
                        <span className="text-lg font-black text-emerald-300 font-mono">
                          {metrics!.totalSeconds.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DOUBLE COLUMN: NEXT BIRTHDAY & BIRTH DETAILS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* NEXT BIRTHDAY WITH COUNTDOWN */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                          Next Birthday
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 font-bold font-mono">
                          {bdayNext!.birthdayWeekday}
                        </span>
                      </div>

                      <div className="text-center py-4 space-y-2">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Upcoming Date</span>
                        <div className="text-2xl font-black text-blue-600 dark:text-cyan-400">
                          {bdayNext!.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>

                      {/* LIVE RING GRAPH COUNTDOWN CONTAINER */}
                      <div className="relative flex justify-center items-center py-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            className="stroke-neutral-200 dark:stroke-neutral-800 fill-none"
                            strokeWidth="8"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            className="stroke-blue-600 dark:stroke-cyan-400 fill-none transition-all duration-1000"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={2 * Math.PI * 38 * (1 - bdayNext!.elapsedPercent / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-xs font-black text-neutral-900 dark:text-white">
                            {Math.round(bdayNext!.elapsedPercent)}%
                          </span>
                          <span className="text-[8px] text-neutral-400 uppercase tracking-wider font-mono">Year Progress</span>
                        </div>
                      </div>

                      {/* DETAILED REMAINING TICKER */}
                      <div className="p-3 bg-neutral-100/50 dark:bg-neutral-800/40 rounded-2xl grid grid-cols-4 gap-1 text-center font-mono">
                        <div>
                          <span className="text-sm font-black text-neutral-800 dark:text-white">{bdayNext!.liveCountdown.days}</span>
                          <span className="text-[7px] text-neutral-400 block uppercase">Days</span>
                        </div>
                        <div>
                          <span className="text-sm font-black text-neutral-800 dark:text-white">{bdayNext!.liveCountdown.hours}</span>
                          <span className="text-[7px] text-neutral-400 block uppercase">Hours</span>
                        </div>
                        <div>
                          <span className="text-sm font-black text-neutral-800 dark:text-white">{bdayNext!.liveCountdown.minutes}</span>
                          <span className="text-[7px] text-neutral-400 block uppercase">Mins</span>
                        </div>
                        <div>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{bdayNext!.liveCountdown.seconds}</span>
                          <span className="text-[7px] text-neutral-400 block uppercase">Secs</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-xl">
                          <span className="text-neutral-400 block text-[9px] font-mono">In Months</span>
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">{bdayNext!.monthsRemaining}</span>
                        </div>
                        <div className="p-2 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-xl">
                          <span className="text-neutral-400 block text-[9px] font-mono">In Weeks</span>
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">{bdayNext!.weeksRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {/* BIRTHDAY INFORMATION */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                          Birth Astrological &amp; Cultural Profile
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                          Day {bdayInfo!.dayNumberOfYear}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Birth Day of Week</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{bdayInfo!.dayOfWeek}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Birth Month</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{bdayInfo!.birthMonth}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Birth Year</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{bdayInfo!.birthYear}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Birth Seasons</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                            ❄️ {bdayInfo!.northernSeason} (North)
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Western Zodiac</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm flex items-center gap-1">
                            <span>{bdayInfo!.westernZodiac.icon}</span>
                            <span>{bdayInfo!.westernZodiac.name}</span>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Chinese Zodiac</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">🐉 {bdayInfo!.chineseZodiac}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Birth Quarter</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{bdayInfo!.birthQuarter}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block text-[9px] uppercase font-mono">Leap Year Status</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{bdayInfo!.leapYearStatus}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-100/50 dark:bg-neutral-800/40 rounded-2xl text-[10px] text-neutral-500 leading-normal flex items-start gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>Calculated locally against UTC meridians using custom Astro ephemeris offsets.</span>
                      </div>
                    </div>
                  </div>

                  {/* MULTI-UNIT TOTALS GRID */}
                  <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-4">
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      Single-Unit Breakdown Totals
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Total Months</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">{metrics!.totalMonths} Months</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Total Weeks</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">{metrics!.totalWeeksDecimal} Weeks</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50">
                        <span className="text-base font-black text-neutral-800 dark:text-white">{metrics!.totalDays.toLocaleString()} Days</span>
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Total Calendar Days</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Total Hours</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">{metrics!.totalHours.toLocaleString()} Hours</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Total Minutes</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">{metrics!.totalMinutes.toLocaleString()} Mins</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/50">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Total Seconds</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">{metrics!.totalSeconds.toLocaleString()} Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* DOUBLE COLUMN: WORKING DAYS & LEAP YEAR ANALYSIS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* WORKING DAYS & WEEKENDS */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          Business Days Lived
                        </h3>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-100/30 dark:bg-neutral-800/20">
                          <span className="text-neutral-500">Business Days (Mon-Fri)</span>
                          <span className="font-extrabold text-neutral-800 dark:text-white text-sm">
                            {metrics!.businessDays.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-100/30 dark:bg-neutral-800/20">
                          <span className="text-neutral-500">Weekend Days (Sat-Sun)</span>
                          <span className="font-extrabold text-neutral-800 dark:text-white text-sm">
                            {metrics!.weekendDays.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-100/30 dark:bg-neutral-800/20 border-t border-neutral-200 dark:border-neutral-800">
                          <span className="text-neutral-500 font-bold">Total Combined Days</span>
                          <span className="font-black text-blue-600 dark:text-cyan-400 text-sm">
                            {metrics!.totalDays.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LEAP YEAR ANALYSIS */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          Leap Year Analysis
                        </h3>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-100/30 dark:bg-neutral-800/20">
                          <span className="text-neutral-500">Leap Years Lived Through</span>
                          <span className="font-extrabold text-neutral-800 dark:text-white text-sm">
                            {metrics!.leapYearsCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-100/30 dark:bg-neutral-800/20">
                          <span className="text-neutral-500">Leap Days Experienced (Feb 29s)</span>
                          <span className="font-extrabold text-neutral-800 dark:text-white text-sm">
                            {metrics!.leapYearsCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-100/30 dark:bg-neutral-800/20">
                          <span className="text-neutral-500">Next Leap Year Date</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                            {Math.ceil(currentTime.getFullYear() / 4) * 4} (Feb 29)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ESTIMATED LIFE STATISTICS */}
                  <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                      <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                        Estimated Biological Totals Lived
                      </h3>
                    </div>
                    <p className="text-[10px] text-neutral-400 italic">
                      Disclaimer: These statistics represent calculated mathematical educational estimates based on standardized clinical averages.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2">
                      <div className="p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Estimated Heartbeats</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">
                          {(metrics!.totalMinutes * 72).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-neutral-400 block mt-1">Based on avg 72 BPM</span>
                      </div>
                      <div className="p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Breaths Taken</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">
                          {(metrics!.totalMinutes * 15).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-neutral-400 block mt-1">Based on avg 15 Breaths/min</span>
                      </div>
                      <div className="p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Hours Slept</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">
                          {Math.round(metrics!.totalDays * 8).toLocaleString()} Hrs
                        </span>
                        <span className="text-[8px] text-neutral-400 block mt-1">Based on avg 8 hours/night</span>
                      </div>
                      <div className="p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Sunrises Seen</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">
                          {metrics!.totalDays.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-neutral-400 block mt-1">One sunrise per calendar day</span>
                      </div>
                      <div className="p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Weekends Experienced</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">
                          {(metrics!.totalWeeks * 2).toLocaleString()} Days
                        </span>
                        <span className="text-[8px] text-neutral-400 block mt-1">Saturday and Sunday count</span>
                      </div>
                      <div className="p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl">
                        <span className="text-neutral-400 block text-[9px] uppercase font-mono">Leap Days Navigated</span>
                        <span className="text-base font-black text-neutral-800 dark:text-white">
                          {metrics!.leapYearsCount} Days
                        </span>
                        <span className="text-[8px] text-neutral-400 block mt-1">Leap days experienced since birth</span>
                      </div>
                    </div>
                  </div>

                  {/* SPECIAL AND REGULAR BIRTHDAY MILESTONES (CHRONOLOGICAL EVENT REGISTRY) */}
                  <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-4">
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      Special Birthdays &amp; Milestones Registry
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin text-xs">
                      {/* Special Ages */}
                      {specialBirthdays.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center p-2.5 rounded-xl border ${
                            item.passed 
                              ? 'bg-neutral-100/40 dark:bg-neutral-800/10 border-neutral-200/20 text-neutral-400' 
                              : 'bg-blue-500/5 dark:bg-cyan-500/5 border-blue-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.passed ? "🟢" : "🔵"}</span>
                            <div>
                              <div className="font-extrabold text-neutral-800 dark:text-neutral-200">{item.label}</div>
                              <div className="text-[10px] text-neutral-400">
                                {item.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} ({item.weekday})
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            item.passed ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800' : 'bg-blue-500 text-white animate-pulse'
                          }`}>
                            {item.passed ? "Completed" : `In ${item.daysDiff} Days`}
                          </span>
                        </div>
                      ))}

                      {/* Milestones */}
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 font-bold uppercase tracking-widest text-[9px] text-neutral-400">
                        Biological Distance Milestones
                      </div>
                      {milestones.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center p-2.5 rounded-xl border ${
                            item.passed 
                              ? 'bg-neutral-100/40 dark:bg-neutral-800/10 border-neutral-200/20 text-neutral-400' 
                              : 'bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.passed ? "✅" : "⏳"}</span>
                            <div>
                              <div className="font-bold text-neutral-800 dark:text-neutral-200">{item.label}</div>
                              <div className="text-[10px] text-neutral-400">
                                {item.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} ({item.weekday})
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            item.passed ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800' : 'bg-emerald-600 text-white'
                          }`}>
                            {item.passed ? "Passed" : `In ${item.daysDiff} Days`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: AGE COMPARISON */}
        {activeTab === 'comparison' && (
          <div className="lg:col-span-12 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  Comparative Age Calculator
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
                  Compare two people side-by-side. Calculate exact age differentials down to seconds and view live chronological comparisons.
                </p>
              </div>

              {/* INPUT MODULES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Person 1 */}
                <div className="p-5 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200/50 dark:border-neutral-800/60 space-y-4">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest font-mono">Person 1</span>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-500">Name</label>
                      <input
                        type="text"
                        placeholder="Name (e.g. Alice)"
                        value={p1Name}
                        onChange={(e) => setP1Name(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 text-sm border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-500">Date of Birth</label>
                      <input
                        type="date"
                        value={p1Birth}
                        onChange={(e) => setP1Birth(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 text-sm border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Person 2 */}
                <div className="p-5 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200/50 dark:border-neutral-800/60 space-y-4">
                  <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest font-mono">Person 2</span>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-500">Name</label>
                      <input
                        type="text"
                        placeholder="Name (e.g. Bob)"
                        value={p2Name}
                        onChange={(e) => setP2Name(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 text-sm border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-500">Date of Birth</label>
                      <input
                        type="date"
                        value={p2Birth}
                        onChange={(e) => setP2Birth(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 text-sm border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* COMPARATIVE RESULTS */}
              {!isComparisonCalculated ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center space-y-2">
                  <Users className="w-10 h-10 text-neutral-300" />
                  <span className="text-sm font-bold text-neutral-500">Enter dates above to compare age metrics.</span>
                </div>
              ) : (
                <div className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  
                  {/* DIFF REPORT SUMMARY */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center space-y-2 shadow-lg">
                    <span className="text-[10px] font-mono tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full">
                      Age Difference Report
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black">
                      {comparisonResults!.olderPerson} is older than {comparisonResults!.youngerPerson}
                    </h3>
                    <p className="text-sm text-cyan-100 max-w-xl mx-auto">
                      By exactly <span className="font-black text-white">{comparisonResults!.diffDetails.years} Years, {comparisonResults!.diffDetails.months} Months, and {comparisonResults!.diffDetails.days} Days</span>!
                    </p>
                  </div>

                  {/* DOUBLE COLUMN COMPARISON CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    {/* Person 1 details */}
                    <div className="p-5 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 space-y-3">
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                        {p1Name || 'Person 1'} Biological Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Current Age</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {comparisonResults!.p1Age.years} Years, {comparisonResults!.p1Age.months} Mos, {comparisonResults!.p1Age.days} Days
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Total Calendar Days</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {comparisonResults!.p1Age.totalDays.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Total Hours</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {comparisonResults!.p1Age.totalHours.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Heartbeats (estimate)</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {(comparisonResults!.p1Age.totalMinutes * 72).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Person 2 details */}
                    <div className="p-5 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 space-y-3">
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                        {p2Name || 'Person 2'} Biological Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Current Age</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {comparisonResults!.p2Age.years} Years, {comparisonResults!.p2Age.months} Mos, {comparisonResults!.p2Age.days} Days
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Total Calendar Days</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {comparisonResults!.p2Age.totalDays.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Total Hours</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {comparisonResults!.p2Age.totalHours.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-900/30">
                          <span className="text-neutral-500">Heartbeats (estimate)</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {(comparisonResults!.p2Age.totalMinutes * 72).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: LIFE IN WEEKS */}
        {activeTab === 'timeline' && (
          <div className="lg:col-span-12 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Life in Weeks Visualizer (Memento Mori)
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
                  Each dot represents one week of an <span className="font-bold text-blue-600 dark:text-cyan-400">{lifeExpectancy}-year</span> typical life span. Lived weeks are highlighted in premium cyan.
                </p>
              </div>

              {!birthDate ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center space-y-2">
                  <CalendarDays className="w-10 h-10 text-neutral-300 animate-pulse" />
                  <span className="text-sm font-bold text-neutral-500">Please enter your Birth Date to generate your Life-In-Weeks interactive canvas.</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Control Slider */}
                  <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-200 block">
                        Adjust Estimated Life Expectancy
                      </span>
                      <p className="text-[10px] text-neutral-400">
                        Default global human expectancy ranges between 75 and 85 years.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="50"
                        max="120"
                        value={lifeExpectancy}
                        onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                        className="flex-grow accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm font-black text-blue-600 dark:text-cyan-400 w-16 text-right">
                        {lifeExpectancy} Yrs
                      </span>
                    </div>
                  </div>

                  {/* CANVAS CONTAINER */}
                  <div className="flex justify-center p-4 rounded-3xl bg-neutral-950/5 border border-neutral-200/40 dark:border-neutral-800/50 overflow-x-auto">
                    <canvas ref={canvasRef} className="rounded-xl mx-auto shadow-sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center text-[10px] text-neutral-400 font-mono">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-cyan-700 inline-block" />
                      <span>Completed Weeks Lived</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                      <span>Current Biological Week</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-neutral-200/60 dark:bg-neutral-800 inline-block" />
                      <span>Remaining Unlocked Weeks</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: EDUCATIONAL CONTENT */}
        {activeTab === 'seo' && (
          <div className="lg:col-span-12 space-y-8">
            <div className="p-6 sm:p-10 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-10 prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed">
              
              {/* INTRO */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight border-b pb-2">
                  Chronological Age &amp; How It Is Calculated
                </h2>
                <p>
                  Biological age is a mathematical difference between a historical start coordinate (such as Date of Birth) and an ending coordinate (such as the current present time or a specified target calendar day). While it appears simple on the surface, astronomical irregularities inside solar calendars make exact biological tracking complex.
                </p>
                <p>
                  Specifically, the standard calendar utilizes Leap Year structures (adding February 29th) to correct the orbital period of the planet Earth around the Sun (which is approximately 365.2422 days). The world's largest calculators require precise O(1) algorithms to check and integrate these offsets without suffering performance lag.
                </p>
              </div>

              {/* CHRONOLOGICAL CALCULATION TYPES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Chronological Age Models</h3>
                  <p>
                    Chronological age is typically divided into decimal year metrics, absolute monthly durations, or aggregate week tallies. Standard biological models prefer integer calculations (Years, Months, Days) that conform to traditional legal requirements.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Date Differences &amp; Leap Years</h3>
                  <p>
                    Calculatoora accounts for all standard Gregorian leap anomalies. By checking if years are divisible by 4 but not 100 (unless also divisible by 400), our biological engine computes exactly how many February 29ths you have lived through.
                  </p>
                </div>
              </div>

              {/* FAQS SECTION */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-black text-neutral-950 dark:text-white">Frequently Asked Questions</h3>
                <div className="space-y-4 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                    <h4 className="font-bold text-neutral-800 dark:text-white mb-1">What is a Golden Birthday?</h4>
                    <p>
                      A Golden Birthday is a unique astrological event that happens when you reach the age equal to the numeric day of the month you were born. For example, if you were born on the 15th, your Golden Birthday occurs when you turn 15 years old.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                    <h4 className="font-bold text-neutral-800 dark:text-white mb-1">How are Heartbeats and Breaths calculated?</h4>
                    <p>
                      These values represent normalized educational estimates. We utilize standard resting clinical averages (72 heartbeats per minute and 15 breaths per minute) multiplied by your total lived lifetime in minutes.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                    <h4 className="font-bold text-neutral-800 dark:text-white mb-1">Why does date order matter?</h4>
                    <p>
                      To avoid impossible calculations, standard date arithmetic mandates that the End Date must sit chronologically after the Start Date. Our system provides responsive visual warnings if date violations occur.
                    </p>
                  </div>
                </div>
              </div>

              {/* GLOSSARY */}
              <div className="space-y-3 pt-6 border-t">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Glossary of Terms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Chronological Age:</span>
                    <p className="text-neutral-500 mt-1">The age of a person measured strictly in standard solar years, calendar months, and days from birth.</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Leap Day:</span>
                    <p className="text-neutral-500 mt-1">The extra day (February 29th) added to leap years to synchronize calendar systems with the Earth's orbit.</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">MEMENTO MORI:</span>
                    <p className="text-neutral-500 mt-1">An interactive visual calendar concept highlighting a standard 80-year lifespan represented in weeks.</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Zodiac Sign:</span>
                    <p className="text-neutral-500 mt-1">Standard constellations indicating where the sun was positioned during your calendar birth date.</p>
                  </div>
                </div>
              </div>

              {/* RELATED LINKS */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Related Calculators</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button onClick={() => onNavigate('calculator:retirement-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    Retirement Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:gpa-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    GPA Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:car-loan-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    Car Loan Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:paycheck-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    Paycheck Calculator
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
