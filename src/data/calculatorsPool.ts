import { Calculator, Category } from '../types';
import { LOAN_CALCULATORS } from './loansCategory';
import { INTEREST_CALCULATORS } from './interestCategory';
import { INVESTMENT_CALCULATORS } from './investmentCategory';
import { PERSONAL_FINANCE_CALCULATORS } from './personalFinanceCategory';
import { TAX_CALCULATORS } from './taxesCategory';
import { BUSINESS_CALCULATORS } from './businessCategory';
import { REAL_ESTATE_CALCULATORS } from './realEstateCategory';
import { SALARY_WORK_CALCULATORS } from './salaryWorkCategory';
import { SHOPPING_CALCULATORS } from './shoppingCategory';
import { DATE_TIME_CALCULATORS } from './dateTimeCategory';
import { HEALTH_CALCULATORS } from './healthCategory';
import { FITNESS_CALCULATORS } from './fitnessCategory';
import { MATH_CALCULATORS } from './mathCategory';
import { SCIENCE_CALCULATORS } from './scienceCategory';
import { ENGINEERING_CALCULATORS } from './engineeringCategory';
import { PROGRAMMING_CALCULATORS } from './programmingCategory';
import { EDUCATION_CALCULATORS } from './educationCategory';
import { ADVANCED_MATH_CALCULATORS } from './advancedMathCategory';

// Newly added version 4 expansion tools
import { NEW_PROGRAMMING_CALCULATORS } from './newProgrammingCategory';
import { NETWORKING_CALCULATORS } from './networkingCategory';
import { WEB_DEV_CALCULATORS } from './webDevCategory';
import { CREATOR_SEO_CALCULATORS } from './creatorSeoCategory';
import { MARKETING_BUSINESS_CALCULATORS } from './marketingBusinessCategory';
import { PRODUCTIVITY_CALCULATORS } from './productivityCategory';
import { DAILY_LIFE_COOKING_CALCULATORS } from './dailyLifeCookingCategory';
import { HOME_TOOLS_CALCULATORS } from './homeToolsCategory';
import { CONVERSION_CALCULATORS } from './conversionCategory';

import { V7_FINANCE_A_CALCULATORS } from './v7FinanceA';
import { V7_FINANCE_B_CALCULATORS } from './v7FinanceB';
import { V7_SCIENCE_CALCULATORS } from './v7Science';
import { V7_HEALTH_CALCULATORS } from './v7Health';
import { V7_TECH_CALCULATORS } from './v7Tech';
import { V7_LIFESTYLE_CALCULATORS } from './v7Lifestyle';
import { V7_CONTENT_CALCULATORS } from './v7Content';
import { generateV8Calculators } from './v8VariationEngine';
import { V10_CALCULATORS } from './v10Calculators';
import { V11_COUNTRY_CALCULATORS } from './v11CountryCategory';
import { V11_LEGAL_EDUCATION_CALCULATORS } from './v11LawLegalEducation';
import { V11_TECH_AI_SCIENCE_CALCULATORS } from './v11TechAiScience';
import { V11_LIFESTYLE_INDUSTRY_CALCULATORS } from './v11LifestyleIndustry';

// Version 12 upgraded professional tools
import { V12_PART1_CALCULATORS } from './v12Part1';
import { V12_PART2_CALCULATORS } from './v12Part2';
import { V12_PART3_CALCULATORS } from './v12Part3';
import { V12_PART4_CALCULATORS } from './v12Part4';
import { V12_PART5_CALCULATORS } from './v12Part5';

// Version 13 state of the art calculations
import { V13_BUSINESS_CALCULATORS } from './v13Business';
import { V13_EDUCATION_MATH_STATS_CALCULATORS } from './v13EducationMathStats';
import { V13_FINANCE_CALCULATORS } from './v13Finance';
import { V13_HEALTH_FITNESS_CALCULATORS } from './v13HealthFitness';
import { V13_HOME_LIFE_ENG_CALCULATORS } from './v13HomeLifeEng';
import { V13_TECH_NET_CREATOR_CALCULATORS } from './v13TechNetCreator';

// Version 14 deep system expansions
import { V14_FINANCE_CALCULATORS } from './v14Finance';
import { V14_BUSINESS_CALCULATORS } from './v14Business';
import { V14_HEALTH_FITNESS_CALCULATORS } from './v14HealthFitness';
import { V14_EDUCATION_MATH_CALCULATORS } from './v14EducationMath';
import { V14_SCIENCE_ENG_CALCULATORS } from './v14ScienceEng';
import { V14_TECH_DAILY_HOME_CALCULATORS } from './v14TechDailyHome';

// Version 15 ultimate category expansions
import { V15_FINANCE_CALCULATORS } from './v15Finance';
import { V15_BUSINESS_CALCULATORS } from './v15Business';
import { V15_HEALTH_FITNESS_CALCULATORS } from './v15HealthFitness';
import { V15_EDUCATION_MATH_STATS_CALCULATORS } from './v15EducationMathStats';
import { V15_TECH_NET_CREATOR_CALCULATORS } from './v15TechNetCreator';
import { V15_SCIENCE_ENG_DAILY_CALCULATORS } from './v15ScienceEngDaily';
import { V15_LAW_EVENTS_TRADES_CALCULATORS } from './v15LawEventsTrades';

// Version 16 ultimate industry & professional expansions
import { V16_FINANCE_CALCULATORS } from './v16Finance';
import { V16_BUSINESS_CALCULATORS } from './v16Business';
import { V16_HEALTH_FITNESS_CALCULATORS } from './v16HealthFitness';
import { V16_ENGINEERING_CS_CALCULATORS } from './v16EngineeringAndCS';
import { V16_TECH_HOME_CALCULATORS } from './v16TechAndHome';
import { V16_NEW_SPECIALTIES_CALCULATORS } from './v16NewSpecialties';

// Version 17 core professional updates
import { V17_PART1_CALCULATORS } from './v17Part1';
import { V17_PART2_CALCULATORS } from './v17Part2';
import { V17_PART3_CALCULATORS } from './v17Part3';
import { V17_PART4_CALCULATORS } from './v17Part4';
import { V17_PART5_CALCULATORS } from './v17Part5';

// Version 19 core suite additions
import { V19_PART1_CALCULATORS } from './v19Part1';
import { V19_PART2_CALCULATORS } from './v19Part2';
import { V19_PART3_CALCULATORS } from './v19Part3';

// Version 20 elite calculator expansions
import { V20_PART1_CALCULATORS } from './v20Part1HRAndSupply';
import { V20_PART2_CALCULATORS } from './v20Part2MfgArch';
import { V20_PART3_CALCULATORS } from './v20Part3MediaLegal';
import { V20_PART4_CALCULATORS } from './v20Part4LifeSecProg';
import { V20_PART5_CALCULATORS } from './v20Part5SciFinBusEdu';

// Version 21 comprehensive expansions
import { V21_PART1_CALCULATORS } from './v21Part1CyberProdProject';
import { V21_PART2_CALCULATORS } from './v21Part2DevAiData';
import { V21_PART3_CALCULATORS } from './v21Part3EngConstRealAuto';
import { V21_PART4_CALCULATORS } from './v21Part4TravelEduHealthFinBiz';
import { V21_PART5_CALCULATORS } from './v21Part5RealHomeFashionSportsGame';

// Version 22 comprehensive upgrades
import { V22_PART1_CALCULATORS } from './v22SecurityProdCareer';
import { V22_PART2_CALCULATORS } from './v22TechSoftwareAiData';
import { V22_PART3_CALCULATORS } from './v22EngConstArchAgriFood';
import { V22_PART4_CALCULATORS } from './v22TravelAutoEduHealth';
import { V22_PART5_CALCULATORS } from './v22BizMfgSciMediaSports';
import { ULTIMATE_LOAN_CALCULATOR } from './ultimateLoanCalculator';
import { ULTIMATE_INVESTMENT_CALCULATOR } from './ultimateInvestmentCalculator';
import { MORTGAGE_CALCULATOR } from './mortgageCalculator';
import { RETIREMENT_CALCULATOR } from './retirementCalculator';
import { AGE_CALCULATOR } from './ageCalculator';



export const CATEGORIES: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Calculate loans, monthly installments, investments, compound growth, and ROI.',
    icon: 'DollarSign',
    color: 'emerald',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Analyze company margins, product markup, and discount models.',
    icon: 'Briefcase',
    color: 'blue',
  },
  {
    id: 'math',
    name: 'Math',
    description: 'Solve scientific, fractions, averages, and simple to complex percentages.',
    icon: 'Percent',
    color: 'violet',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Verify metabolic outputs, optimal hydration metrics, body mass index, and energy guidelines.',
    icon: 'Heart',
    color: 'rose',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Assess calorie targets, basal metabolic rates, and body makeup goals.',
    icon: 'Activity',
    color: 'lime',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Resources and tools to calculate performance scales and test analytics.',
    icon: 'GraduationCap',
    color: 'amber',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Core physical constants, astronomical calculations, and lab formula solvers.',
    icon: 'Compass',
    color: 'teal',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Practical structural modules, mechanical conversions, and unit adapters.',
    icon: 'Cpu',
    color: 'indigo',
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Bitwise calculators, numeral bases, screen pixel ratios, and byte calculators.',
    icon: 'Terminal',
    color: 'cyan',
  },
  {
    id: 'daily-life',
    name: 'Daily Life',
    description: 'Manage age milestones, duration difference, and daily scheduling helper tools.',
    icon: 'Calendar',
    color: 'orange',
  },
  {
    id: 'marketing',
    name: 'Marketing & Biz',
    description: 'Track margins, CTR, CPC, CPA, CPM, ROAS, startup runways, and recurring subscription forecasts.',
    icon: 'TrendingUp',
    color: 'emerald',
  },
  {
    id: 'creator-tools',
    name: 'Creator & SEO',
    description: 'Analyze word counts, keyword ratios, text files, and optimize social media post titles.',
    icon: 'Sparkles',
    color: 'violet',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Plan Pomodoro focus sessions, log timesheets, block out daily events, and track meeting costs.',
    icon: 'FileText',
    color: 'indigo',
  },
  {
    id: 'conversion',
    name: 'Conversion',
    description: 'Convert lengths, weights, area dimensions, fluid volume capacities, temperatures, and data storages.',
    icon: 'RefreshCw',
    color: 'sky',
  },
  {
    id: 'home-tools',
    name: 'Home & Yards',
    description: 'Measure flooring square footage, wall paint volumes, tile layouts, and bulk mulch or concrete.',
    icon: 'Compass',
    color: 'teal',
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Calculate concrete, brickwork, lumber spacing, roof areas, stairs, beams, and columns with precision.',
    icon: 'Hammer',
    color: 'amber',
  },
  {
    id: 'country',
    name: 'Country Calculators',
    description: 'Isolated country-specific tax, salary, VAT, and mortgage calculators for the US, UK, Canada, Australia, India, and more.',
    icon: 'Globe',
    color: 'blue',
  },
  {
    id: 'legal',
    name: 'Law & Legal',
    description: 'Calculate legal deadlines, contract dates, notice periods, court date schedules, interest damages, and payment due dates.',
    icon: 'Scale',
    color: 'violet',
  },
  {
    id: 'language',
    name: 'Language & Text',
    description: 'Assess reading comprehension levels, text difficulty codes, custom vocabulary size, and typing speed accuracy.',
    icon: 'BookOpen',
    color: 'emerald',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Forecast presentation delivery durations, speech lengths, and optimized meeting runtimes.',
    icon: 'MessageSquare',
    color: 'rose',
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Calculate model metrics, dataset intervals, population sampling rates, and diagnostic precision thresholds.',
    icon: 'Database',
    color: 'cyan',
  },
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    description: 'Predict API token workloads, pre-training duration hours, compute thresholds, and model parameter sizes.',
    icon: 'Cpu',
    color: 'indigo',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Analyze password strength entropy, cryptographic size standards, hash lengths, and general risk scores.',
    icon: 'Shield',
    color: 'red',
  },
  {
    id: 'gaming',
    name: 'Gaming Tools',
    description: 'Simulate character XP progress, leveling speedruns, and game match durations.',
    icon: 'Gamepad2',
    color: 'orange',
  },
  {
    id: 'sports',
    name: 'Sports Analytics',
    description: 'Track athlete metric performance templates, win rates, and ranking factors.',
    icon: 'Trophy',
    color: 'amber',
  },
  {
    id: 'food',
    name: 'Food Industry',
    description: 'Establish restaurant menu costs, ingredient recipe proportions, and portion sizes.',
    icon: 'Utensils',
    color: 'lime',
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    description: 'Formulate skin care routines, product usage duration cycles, and beauty budgets.',
    icon: 'Sparkles',
    color: 'pink',
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    description: 'Translate international sizing grids, calculate fabric yardage offsets, and budget seasonal wardrobes.',
    icon: 'Shirt',
    color: 'fuchsia',
  },
  {
    id: 'pet',
    name: 'Pet Care',
    description: 'Model animal age milestones, calorie guidelines, raw feed portions, and veterinary planning budgets.',
    icon: 'Heart',
    color: 'teal',
  },
  {
    id: 'personal-safety',
    name: 'Personal Safety & Security',
    description: 'Calculate password entropy complexity, combination lists, and home security risk factors.',
    icon: 'ShieldAlert',
    color: 'red',
  },
  {
    id: 'insurance',
    name: 'Insurance & Claims',
    description: 'Compare life policies, estimate disability offsets, and optimize deductibles.',
    icon: 'FileCheck',
    color: 'sky',
  },
  {
    id: 'retirement',
    name: 'Retirement & Life Planning',
    description: 'Structure longevity funds, plan estate inheritances, and model social security benefits.',
    icon: 'Timer',
    color: 'indigo',
  },
  {
    id: 'crypto',
    name: 'Crypto & Digital Assets',
    description: 'Calculate mining block profitability, staking compounding returns, and gas fees.',
    icon: 'Coins',
    color: 'yellow',
  },
  {
    id: 'real-estate-pro',
    name: 'Real Estate Professional',
    description: 'Assess capitalization yields (Cap Rate), cash-on-cash metrics, commercial property ROI, cash flow schedules, and construction budgets.',
    icon: 'Building',
    color: 'emerald',
  },
  {
    id: 'small-business',
    name: 'Small Business Operations',
    description: 'Calculate employee turnover costs, inventory turnover ratios, and retail shrinkage indexes.',
    icon: 'Briefcase',
    color: 'teal',
  },
  {
    id: 'freelance-creator',
    name: 'Freelance & Creator Economy',
    description: 'Evaluate billable hourly rates, tax saving splits, and pricing structures.',
    icon: 'UserCheck',
    color: 'amber',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    description: 'Estimate app development costs, subscription revenues, conversion metrics, and growth pipelines.',
    icon: 'Smartphone',
    color: 'cyan',
  },
  {
    id: 'web-ops',
    name: 'Website Operations',
    description: 'Track bandwidth allocations, hosting server capacities, and traffic levels.',
    icon: 'Server',
    color: 'indigo',
  },
  {
    id: 'adv-marketing',
    name: 'Advanced Ad & SEO Marketing',
    description: 'Measure organic Google SEO ROI campaigns, dynamic ROAS, and lead acquisition costs.',
    icon: 'TrendingUp',
    color: 'emerald',
  },
  {
    id: 'photography',
    name: 'Professional Photography',
    description: 'Calculate high-density resolution requirements, equivalent lens focal lengths, and storage capacities.',
    icon: 'Camera',
    color: 'violet',
  },
  {
    id: 'video-streaming',
    name: 'Video & Streaming Media',
    description: 'Formulate upload streaming bitrates, video file storage weights, and GPU export renders.',
    icon: 'Video',
    color: 'rose',
  },
  {
    id: 'music',
    name: 'Audio Production & Music',
    description: 'Convert BPM tempos into milliseconds, estimate multi-track session file sizes, and streaming royalties.',
    icon: 'Music',
    color: 'fuchsia',
  },
  {
    id: 'home-utilities',
    name: 'Household & Energy Utilities',
    description: 'Forecast monthly electricity bills, municipal water gallon usage, heating therm gas, and solar payoffs.',
    icon: 'Zap',
    color: 'lime',
  },
  {
    id: 'environment',
    name: 'Environment & Green Living',
    description: 'Track annual vehicle greenhouse gases, tree offsets, and household recycling diversion weights.',
    icon: 'Leaf',
    color: 'green',
  },
  {
    id: 'transportation',
    name: 'Transportation & Commutes',
    description: 'Find optimal travel speeds, compare public transit passes, and estimate vehicle depreciation.',
    icon: 'Car',
    color: 'orange',
  },
  {
    id: 'events',
    name: 'Event & Social Planning',
    description: 'Budget weddings, model catering portion weights, and schedule multi-session timelines.',
    icon: 'Calendar',
    color: 'pink',
  },
  {
    id: 'medical-edu',
    name: 'Medical & Pharmacy Education',
    description: 'Obtain clinical patient-weight dosage milligram limits, blood sugar units, and functional GFR rates.',
    icon: 'Activity',
    color: 'rose',
  },
  {
    id: 'science-lab',
    name: 'Science Lab & Error Analysis',
    description: 'Calculate scientific exponential notation, physics unit analysis, and experimental error percentages.',
    icon: 'Compass',
    color: 'cyan',
  },
  {
    id: 'language-learning',
    name: 'Language & Vocabulary Learning',
    description: 'Project fluency milestones, daily vocabulary goals, and curriculum progress sheets.',
    icon: 'BookOpen',
    color: 'emerald',
  },
  {
    id: 'gardening',
    name: 'Gardening',
    description: 'Master plant spacing layouts, watering estimates, soil volume, and balanced fertilizer feeds.',
    icon: 'Flower',
    color: 'green',
  },
  {
    id: 'diy',
    name: 'Craft & DIY',
    description: 'Structure custom material bounds, fabric yardage, wood counts, paint volumes, and project bills.',
    icon: 'Wrench',
    color: 'orange',
  },
  {
    id: 'trades',
    name: 'Trades & Professions',
    description: 'Calculate concrete slab volumes, framing drywall sheets, stud spacing, tiling grids, and painting volumes.',
    icon: 'Hammer',
    color: 'amber',
  },
  {
    id: 'medical-pro',
    name: 'Medical & Health Professional',
    description: 'Perform advanced medical dosage, IV flow rate estimations, clinical score tracking, and pharmaceutical dilutions.',
    icon: 'Activity',
    color: 'rose',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Production',
    description: 'Optimize assembly line throughput, calculate unit material usage, machine utilization, efficiency metrics, and factory costs.',
    icon: 'Factory',
    color: 'slate',
  },
  {
    id: 'retail',
    name: 'Retail & Merchandising',
    description: 'Estimate retail margins, compute discount rates, inventory holding costs, stock turnover, and markup projections.',
    icon: 'ShoppingBag',
    color: 'indigo',
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Food Business',
    description: 'Analyze food raw plate costs, customize recipes, set menu prices, manage inventory waste, and control restaurant profits.',
    icon: 'Utensils',
    color: 'orange',
  },
  {
    id: 'transport-pro',
    name: 'Transport Professional',
    description: 'Optimize fleet operating expenditures, delivery logistics, driver hour intervals, route efficiencies, and vehicle wear.',
    icon: 'Truck',
    color: 'sky',
  },
  {
    id: 'agriculture',
    name: 'Agriculture Professional',
    description: 'Evaluate farm operating cost models, crop-specific seed limits, seasonal water requirements, and field yield profit margins.',
    icon: 'Sprout',
    color: 'green',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Optimize timelines, calculate sprint capacity, dynamic team velocity, project risks, story points, and budgets.',
    icon: 'FileText',
    color: 'indigo',
  },
  {
    id: 'security-privacy',
    name: 'Security & Privacy',
    description: 'Analyze your digital footprint, privacy scores, active data exposure indexes, and online password security standards.',
    icon: 'ShieldAlert',
    color: 'red',
  },
  {
    id: 'career',
    name: 'Career & Work',
    description: 'Forecast career growth paths, compare competitive job offers, model skill investment returns, and project lifetime salary curves.',
    icon: 'UserCheck',
    color: 'amber',
  },
  {
    id: 'logistics',
    name: 'Logistics Professional',
    description: 'Manage route efficiency, calculate warehouse volume utilization, forecast shipping overheads, and design inventory replenishment plans.',
    icon: 'Truck',
    color: 'sky',
  },
  {
    id: 'energy',
    name: 'Energy & Power',
    description: 'Calculate solar panel payoff periods, battery backup sizing, household electricity draws, and power consumption savings.',
    icon: 'Zap',
    color: 'lime',
  },
  {
    id: 'space-astronomy',
    name: 'Space & Astronomy',
    description: 'Calculate escape velocities, planetary weights, orbital periods, and light year distances across the systems.',
    icon: 'Orbit',
    color: 'indigo',
  },
  {
    id: 'weather-climate',
    name: 'Weather & Climate',
    description: 'Estimate wind chill temperatures, rainwater harvesting volumes, dew points, and personal carbon footprints.',
    icon: 'CloudRain',
    color: 'sky',
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    description: 'Forecast software development costs, timeline schedules, tech debt index, and maintenance allocations.',
    icon: 'Terminal',
    color: 'cyan',
  },
  {
    id: 'automotive',
    name: 'Automotive & Vehicles',
    description: 'Evaluate car ownership budgets, fuel economies, EV charging margins, and depreciation values.',
    icon: 'Car',
    color: 'blue',
  },
  {
    id: 'home-improvement',
    name: 'Home Improvement & DIY',
    description: 'Structure crown molding cuts, furniture staging budgets, lighting fixtures, and custom remodel pathways.',
    icon: 'Hammer',
    color: 'orange',
  },
  {
    id: 'travel',
    name: 'Travel & Vacations',
    description: 'Plan flight parameters, vacation budgets, daily meal buffers, and travel time savings goals.',
    icon: 'Compass',
    color: 'emerald',
  },
  {
    id: 'human-resources',
    name: 'Human Resources',
    description: 'Calculate salary scales, hiring costs, turnover rates, overtime sheets, and retention benchmarks.',
    icon: 'UserCheck',
    color: 'amber',
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain & Logistics',
    description: 'Optimize inventory costs, turnover rates, order quantities, warehouse utilization, and demand predictions.',
    icon: 'Truck',
    color: 'sky',
  },
  {
    id: 'architecture-design',
    name: 'Architecture & Design',
    description: 'Solve room boundaries, roof angles, stair rises, wall paint, and total interior remodel estimates.',
    icon: 'Building',
    color: 'emerald',
  },
  {
    id: 'video-production',
    name: 'Video Production',
    description: 'Manage production budgets, editing timesheets, render calculations, file storage, and streaming bandwidth.',
    icon: 'Video',
    color: 'rose',
  },
  {
    id: 'real-world-tools',
    name: 'Real World Tools',
    description: 'Solve percentages, age milestones, date calculations, timezone differences, and advanced unit conversions.',
    icon: 'Globe',
    color: 'sky',
  },
  {
    id: 'home-services',
    name: 'Home Services',
    description: 'Budget residential house cleaning, handyman repairs, home maintenance, and household utilities.',
    icon: 'Hammer',
    color: 'amber',
  },
  {
    id: 'fashion-lifestyle',
    name: 'Fashion & Lifestyle',
    description: 'Translate clothing size, calculate fabric yardage, track seasonal fashion budgets, and measure cost-per-wear scores.',
    icon: 'Shirt',
    color: 'purple',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Calculate love matches, tip splits, habit streaks, sleep cycles, and daily life parameters.',
    icon: 'Heart',
    color: 'rose',
  },
];

const BASE_CALCULATORS: Calculator[] = [
  // ====================================== FINANCE ======================================
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    slug: 'loan-calculator',
    category: 'finance',
    description: 'Calculate total payment, monthly breakdown, and full interest allocation for standard loans.',
    seoTitle: 'Loan Payment & Interest Calculator | Calculatoora',
    seoDescription: 'Calculate loan payments, total interest, and amortization splits instantly with our advanced Loan Calculator.',
    inputs: [
      { id: 'amount', label: 'Loan Amount', type: 'number', defaultValue: 10000, min: 100, step: 100, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 5.5, min: 0.1, max: 99, step: 0.01, unit: '%' },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 15, min: 1, max: 50, step: 1, unit: 'years' },
    ],
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]\nWhere P is original principal, r is monthly rate (Annual / 12), n is term in months.',
    explanation: 'A loan payment is calculated such that you pay a fixed amount each month. Under this amortized payment schedule, a portion of each payment goes to the interest accrued, and the remainder goes towards lowering the outstanding principal balance.',
    example: 'For a $10,000 loan with 5.5% annual interest rate and a 15-year term, your monthly payment is $81.71. Active interest payments will scale down as you restore the principal balance.',
    faq: [
      { question: 'What is amortization?', answer: 'Amortization is the process of spreading out a loan into a series of equal periodic payments. Over time, the interest portion of each payment decreases while the principal portion increases.' },
      { question: 'Does paying more than the minimum reduce interest?', answer: 'Yes! Placing additional payments directly toward the principal lowers the interest calculated for the remaining balance.' }
    ],
    relatedSlugs: ['emi-calculator', 'compound-interest-calculator', 'savings-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const annualR = Number(inputs.rate) || 0;
      const yrs = Number(inputs.term) || 0;

      const r = (annualR / 100) / 12;
      const n = yrs * 12;

      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      const chartData = [
        { name: 'Original Principal', value: p, color: '#10b981' },
         { name: 'Total Interest', value: Math.round(totalInterest), color: '#f59e0b' }
      ];

      return {
        results: [
          { label: 'Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Principal', value: p.toFixed(2), unit: '$' },
          { label: 'Total Interest Payable', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Total Overall Cost', value: totalPaid.toFixed(2), unit: '$' },
        ],
        chartData,
      };
    }
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    category: 'finance',
    description: 'Equated Monthly Installments solver for home, car, or personal flat-rate and reducing loans.',
    seoTitle: 'EMI Calculator for Home & Car Loans | Calculatoora',
    seoDescription: 'Find your monthly Equated Monthly Installment (EMI) quickly and plot a visual breakdown of your repayment.',
    inputs: [
      { id: 'amount', label: 'Total Principal', type: 'number', defaultValue: 250000, min: 1000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.05, unit: '%' },
      { id: 'tenure', label: 'Tenure (Months)', type: 'number', defaultValue: 36, min: 1, max: 360, step: 1, unit: 'months' }
    ],
    formula: 'EMI = P * r * (1+r)^n / ((1+r)^n - 1)\nWhere P = Principal, r = monthly interest rate, n = tenure in months.',
    explanation: 'EMI is a structured recurring payout paid to a financial institution on a exact calendar calendar day of every month, settling the total pending home, education, or vehicle debts over high compounding ratios.',
    example: 'For a $250,000 principal balance at 8.5% interest over 36 months, the monthly EMI works out to $7,891.46.',
    faq: [
      { question: 'What is the main difference between EMI and simple interest?', answer: 'EMI reduces the calculated interest incrementally because each payment lowers the outstanding principal. Simple interest calculates charges against the flat initial amount across all cycles.' }
    ],
    relatedSlugs: ['loan-calculator', 'interest-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const n = Number(inputs.tenure) || 0;

      const r = (rate / 12) / 100;
      let emi = 0; if (r === 0) { emi = p / n; } else { emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); }
      const totalPaid = emi * n;
      const interest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Monthly EMI Installment', value: emi.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Interest Payable', value: interest.toFixed(2), unit: '$' },
          { label: 'Total Payable Amount', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Principal Amount', value: p, color: '#10b981' },
          { name: 'Interest Cost', value: Math.round(interest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'interest-calculator',
    name: 'Interest Calculator',
    slug: 'interest-calculator',
    category: 'finance',
    description: 'Simple Interest calculator for standard investment, fast business loans, and simple debt agreements.',
    seoTitle: 'Simple Interest Calculator - Fast and Accurate | Calculatoora',
    seoDescription: 'Solve simple interest formulas instantly. Discover simple interest amounts, accrual timelines, and total future balances.',
    inputs: [
      { id: 'principal', label: 'Principal Amount', type: 'number', defaultValue: 5000, min: 1, step: 100, unit: '$' },
      { id: 'rate', label: 'Annual Rate', type: 'number', defaultValue: 4.0, min: 0, max: 100, step: 0.1, unit: '%' },
      { id: 'time', label: 'Period (Years)', type: 'number', defaultValue: 5, min: 0.1, max: 100, step: 0.5, unit: 'years' }
    ],
    formula: 'Simple Interest (SI) = P * R * T / 100\nWhere P = Principal, R = Rate per annum, T = Time duration in years.',
    explanation: 'Simple interest behaves uniformly across cycles. Unlike compounded modes, simple balances generate returns strictly restricted to the initial invested seed capital, never compounding on intermediate growth.',
    example: 'A $5,000 principal at 4% simple interest for 5 years gathers $1,000 in interest yield, bringing the final account size to $6,000.',
    faq: [
      { question: 'When is simple interest typically utilized?', answer: 'It is commonly used in short-term savings notes, certificates of deposit, micro-loans, and standard family debts.' }
    ],
    relatedSlugs: ['compound-interest-calculator', 'savings-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = Number(inputs.rate) || 0;
      const t = Number(inputs.time) || 0;

      const interest = (p * r * t) / 100;
      const total = p + interest;

      return {
        results: [
          { label: 'Accrued Simple Interest', value: interest.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Future Balance', value: total.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Principal Base', value: p, color: '#10b981' },
          { name: 'Accumulated Simple Interest', value: Math.round(interest), color: '#a855f7' }
        ]
      };
    }
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'finance',
    description: 'Calculate future wealth using variable annual, quarterly, or monthly compounding cycles with ease.',
    seoTitle: 'Compound Interest Calculator & Growth Chart | Calculatoora',
    seoDescription: 'Compound interest calculator tracks progressive future value gains. See compound schedule charts.',
    inputs: [
      { id: 'principal', label: 'Initial Deposit', type: 'number', defaultValue: 10000, min: 1, step: 500, unit: '$' },
      { id: 'rate', label: 'Annual Rate', type: 'number', defaultValue: 8, min: 0.1, step: 0.1, unit: '%' },
      { id: 'time', label: 'Time (Years)', type: 'number', defaultValue: 10, min: 1, max: 60, step: 1, unit: 'years' },
      {
        id: 'frequency',
        label: 'Compounding Cycle',
        type: 'select',
        defaultValue: 12,
        options: [
          { label: 'Annually (1/yr)', value: 1 },
          { label: 'Quarterly (4/yr)', value: 4 },
          { label: 'Monthly (12/yr)', value: 12 },
          { label: 'Daily (365/yr)', value: 365 }
        ]
      }
    ],
    formula: 'A = P * (1 + r / n)^(n * t)\nWhere A = Future Value, P = Principal, r = Interest, n = Compounds/year, t = Total Years.',
    explanation: 'Compound interest represents interest earned on previously earned interest, constructing exponential financial acceleration. It is the greatest engine of financial growth.',
    example: 'Compounding $10,000 at 8% monthly rewards you with a future balance of $22,196.40 in 10 years, which earns $1,236.40 more than the simple equivalent.',
    faq: [
      { question: 'What is the "Rule of 72"?', answer: 'Divide 72 by your annual returns rate to estimate the years needed to double your money. (e.g., at 8% interest, it takes roughly 9 years to double: 72/8 = 9).' }
    ],
    relatedSlugs: ['investment-calculator', 'savings-calculator', 'interest-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = (Number(inputs.rate) || 0) / 100;
      const t = Number(inputs.time) || 0;
      const n = Number(inputs.frequency) || 12;

      const fv = p * Math.pow(1 + r / n, n * t);
      const interest = Math.max(0, fv - p);

      return {
        results: [
          { label: 'Future Value (FV)', value: fv.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Contributions', value: p.toFixed(2), unit: '$' },
          { label: 'Total Compound Interest', value: interest.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Deposit', value: p, color: '#10b981' },
          { name: 'Interest Compounded', value: Math.round(interest), color: '#ec4899' }
        ]
      };
    }
  },
  {
    id: 'investment-calculator',
    name: 'Investment Calculator',
    slug: 'investment-calculator',
    category: 'finance',
    description: 'Simulate long-term investing using a starting base, regular monthly contributions, and target yields.',
    seoTitle: 'Investment Growth & Contribution Calculator | Calculatoora',
    seoDescription: 'Run investment estimates based on starting sums, constant monthly deposits, and annualized yields.',
    inputs: [
      { id: 'initial', label: 'Starting balance', type: 'number', defaultValue: 1000, min: 0, step: 100, unit: '$' },
      { id: 'monthly', label: 'Monthly Addition', type: 'number', defaultValue: 200, min: 0, step: 10, unit: '$' },
      { id: 'returns', label: 'Expected Annual Yield', type: 'number', defaultValue: 9, min: 0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Timeline (Years)', type: 'number', defaultValue: 20, min: 1, step: 1, unit: 'years' }
    ],
    formula: 'F_total = P_initial * (1+r)^T + M * [((1+r)^T - 1) / r] * (1+r) (assuming monthly calculations)',
    explanation: 'Steady fractional investments leverage compound dynamics tremendously over continuous durations. Monthly adding forms a secure recurring investment cushion.',
    example: 'Starting with $1,000 baseline and depositing $200 monthly at 9% nominal return rates builds up to $131,843.06 in 20 years.',
    faq: [
      { question: 'What yield rate should I expect on historical markets?', answer: 'Historically, the broad US S&P 500 index averages roughly 9% to 10% per year adjusted for long-term cycles.' }
    ],
    relatedSlugs: ['compound-interest-calculator', 'savings-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.initial) || 0;
      const m = Number(inputs.monthly) || 0;
      const yieldRate = (Number(inputs.returns) || 0) / 100;
      const yrs = Number(inputs.years) || 0;

      const months = yrs * 12;
      const mr = yieldRate / 12;

      let balance = p;
      let totalContrib = p;

      for (let i = 0; i < months; i++) {
        balance = balance * (1 + mr) + m;
        totalContrib += m;
      }

      const totalGain = Math.max(0, balance - totalContrib);

      return {
        results: [
          { label: 'Forecasted Wealth Portfolio', value: balance.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Capital Contributed', value: totalContrib.toFixed(2), unit: '$' },
          { label: 'Gross Market Accruals', value: totalGain.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Self Contributed', value: totalContrib, color: '#10b981' },
          { name: 'Accrued Gains', value: Math.round(totalGain), color: '#8b5cf6' }
        ]
      };
    }
  },
  {
    id: 'savings-calculator',
    name: 'Savings Calculator',
    slug: 'savings-calculator',
    category: 'finance',
    description: 'Track milestones for college, home down payment, emergency savings, or retirement funds.',
    seoTitle: 'Dynamic Savings Target & Goal Calculator | Calculatoora',
    seoDescription: 'Find how fast you can accumulate capital. Analyze specific goals, timelines, and simple interest earnings.',
    inputs: [
      { id: 'starting', label: 'Starting Balance', type: 'number', defaultValue: 3000, min: 0, step: 50, unit: '$' },
      { id: 'deposit', label: 'Monthly Savings Payout', type: 'number', defaultValue: 350, min: 0, step: 10, unit: '$' },
      { id: 'rate', label: 'APY (Annual Savings Rate)', type: 'number', defaultValue: 4.25, min: 0, max: 20, step: 0.05, unit: '%' },
      { id: 'duration', label: 'Saving Term (Years)', type: 'number', defaultValue: 6, min: 1, step: 1, unit: 'years' }
    ],
    formula: 'Standard future savings math compounded over month intervals: A = P(1+r/12)^n + D * [((1+r/12)^n - 1) / (r/12)]',
    explanation: 'Savings products compound safely inside liquid interest accounts. Today, high-yield savings accounts (HYSA) capture generous yields without volatility burdens.',
    example: 'Starting with $3,000 and depositing $350 each month at 4.25% APY builds a total emergency fund of $31,524.22 in 6 years.',
    faq: [
      { question: 'What does APY stand for?', answer: 'APY stands for Annual Percentage Yield, which incorporates the effect of intra-year compounding for real interest evaluation.' }
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'loan-calculator'],
    calculate: (inputs) => {
      const starting = Number(inputs.starting) || 0;
      const deposit = Number(inputs.deposit) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      const years = Number(inputs.duration) || 0;

      const rMonthly = rate / 12;
      const periods = years * 12;

      let fv = starting;
      let realPaid = starting;

      for (let i = 0; i < periods; i++) {
        fv = fv * (1 + rMonthly) + deposit;
        realPaid += deposit;
      }

      const interest = Math.max(0, fv - realPaid);

      return {
        results: [
          { label: 'Total Savings Realized', value: fv.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Unadjusted Money Savings', value: realPaid.toFixed(2), unit: '$' },
          { label: 'Net Interest Earned', value: interest.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Cushion Capital Saved', value: realPaid, color: '#10b981' },
          { name: 'Interest Yield Added', value: Math.round(interest), color: '#14b8a6' }
        ]
      };
    }
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    slug: 'roi-calculator',
    category: 'finance',
    description: 'Calculate ROI (Return on Investment) instantly for business, property, stocks, or side projects.',
    seoTitle: 'Return on Investment (ROI) Calculator | Calculatoora',
    seoDescription: 'Measure your investment performance. Calculate exact ROI percentages, gain ratios, and profit values.',
    inputs: [
      { id: 'invested', label: 'Initial Amount Invested', type: 'number', defaultValue: 15000, min: 1, step: 500, unit: '$' },
      { id: 'returned', label: 'Final Value Returned', type: 'number', defaultValue: 21500, min: 0, step: 500, unit: '$' }
    ],
    formula: 'ROI (%) = [(Final Value - Initial Invested) / Initial Invested] * 100',
    explanation: 'Return on Investment (ROI) is a widely used financial metric to evaluate the efficiency or profitability of an investment. It measures the gain or loss relative to the cost of investment, providing a standardized gauge for stock holdings, real estate, or venture launches.',
    example: 'Investing $15,000 and harvesting a total final return of $21,500 produces a gross profit of $6,500, translating to a positive ROI of 43.33%.',
    faq: [
      { question: 'Can ROI be negative?', answer: 'Yes! If the returned amount is lower than the initial investment, ROI is negative, indicating a net loss.' },
      { question: 'Does ROI account for holding duration?', answer: 'Standard ROI does not account for time. An annualized ROI can be computed to compare investments of different durations.' }
    ],
    relatedSlugs: ['profit-calculator', 'investment-calculator', 'discount-calculator'],
    calculate: (inputs) => {
      const invested = Number(inputs.invested) || 0;
      const returned = Number(inputs.returned) || 0;

      const gain = returned - invested;
      const roiVal = invested !== 0 ? (gain / invested) * 100 : 0;

      return {
        results: [
          { label: 'ROI (Percentage ROI)', value: roiVal.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Investment Gain / Loss', value: gain.toFixed(2), unit: '$' },
          { label: 'Cost-to-Gain Efficiency', value: (returned / Math.max(1, invested)).toFixed(2), unit: 'x' }
        ],
        chartData: [
          { name: 'Principal Spent', value: invested, color: '#ef4444' },
          { name: 'Investment Gain', value: Math.max(0, gain), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'profit-calculator',
    name: 'Profit Calculator',
    slug: 'profit-calculator',
    category: 'business',
    description: 'Calculate product pricing, gross profit margins, and markup rates for goods, merchandise, or services.',
    seoTitle: 'Profit Margin & Markup Price Calculator | Calculatoora',
    seoDescription: 'Find gross margins and markups. Determine optimal sale prices for retail items, e-commerce, and SaaS.',
    inputs: [
      { id: 'cost', label: 'Cost Price (COGS)', type: 'number', defaultValue: 60, min: 0.1, step: 1, unit: '$' },
      { id: 'revenue', label: 'Selling Price', type: 'number', defaultValue: 100, min: 0.1, step: 1, unit: '$' }
    ],
    formula: 'Gross Profit = Selling Price - Cost Price\nMargin (%) = (Gross Profit / Selling Price) * 100\nMarkup (%) = (Gross Profit / Cost Price) * 100',
    explanation: 'Profit and markup are distinct. Profit margin relates gross profits to your final sale price. Markup calculates profit margins relative to your direct inventory purchase cost.',
    example: 'Selling an item for $100 that cost $60 to source yields a Gross Profit of $40, a Gross Profit Margin of 40%, and a markup rate of 66.67%.',
    faq: [
      { question: 'What is the standard markup for retail goods?', answer: 'The baseline "keystone markup" is 50% on cost, which corresponds to doubling the buying cost for the customer.' }
    ],
    relatedSlugs: ['roi-calculator', 'discount-calculator', 'percentage-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const revenue = Number(inputs.revenue) || 0;

      const profit = revenue - cost;
      const margin = revenue !== 0 ? (profit / revenue) * 100 : 0;
      const markup = cost !== 0 ? (profit / cost) * 100 : 0;

      return {
        results: [
          { label: 'Gross Profit Margin', value: margin.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Gross Net Profit', value: profit.toFixed(2), unit: '$' },
          { label: 'Calculated Markup Rate', value: markup.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Sourcing Cost (COGS)', value: cost, color: '#f59e0b' },
          { name: 'Gross Net Profit', value: Math.max(0, profit), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'math',
    description: 'Solve three-way percentage queries: solve standard fractions, relative increases, and base percentages.',
    seoTitle: 'Ultimate Online Percentage Calculator | Calculatoora',
    seoDescription: 'Solve any percentage query instantly. Find percentage changes, simple ratios, increases, and decreases.',
    inputs: [
      { id: 'part', label: 'Value A (Part)', type: 'number', defaultValue: 50, step: 1 },
      { id: 'whole', label: 'Value B (Whole)', type: 'number', defaultValue: 250, step: 1 },
      { id: 'percent', label: 'Percentage (X%)', type: 'number', defaultValue: 15, step: 0.5, unit: '%' }
    ],
    formula: '1. What is X% of B? Result = (X / 100) * B\n2. A is what % of B? Result = (A / B) * 100',
    explanation: 'Percentages form dimensionless values scaled to hundreds. This tool solves three primary questions to help with schoolwork, retail shopping, stock analysis, or financial reports.',
    example: 'If Value A is 50 and Value B is 250, then 50 is 20% of 250. Meanwhile, 15% of 250 is 37.5.',
    faq: [
      { question: 'How is a simple fraction converted to a percentage?', answer: 'Divide the numerator by the denominator and multiply the result by 100 (e.g., 4/5 = 0.8; 0.8 * 100 = 80%).' }
    ],
    relatedSlugs: ['discount-calculator', 'profit-calculator', 'average-calculator'],
    calculate: (inputs) => {
      const part = Number(inputs.part) || 0;
      const whole = Number(inputs.whole) || 0;
      const percent = Number(inputs.percent) || 0;

      const whatIsPercentOfWhole = (percent / 100) * whole;
      const partRatioOfWhole = whole !== 0 ? (part / whole) * 100 : 0;
      const pctIncreaseDiff = part !== 0 ? ((whole - part) / Math.abs(part)) * 100 : 0;

      return {
        results: [
          { label: `${percent}% of ${whole}`, value: whatIsPercentOfWhole.toFixed(2), isPrimary: true },
          { label: `${part} is what % of ${whole}`, value: partRatioOfWhole.toFixed(2), unit: '%' },
          { label: `Percentage change from ${part} to ${whole}`, value: pctIncreaseDiff.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Remainder portion', value: Math.max(0, whole - whatIsPercentOfWhole), color: '#3b82f6' },
          { name: 'Percent slice', value: Math.max(0, whatIsPercentOfWhole), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    category: 'business',
    description: 'Calculate sale savings, total price discounts, and final cost with standard optional sales tax.',
    seoTitle: 'Dynamic Sale & Retail Discount Calculator | Calculatoora',
    seoDescription: 'Find shopping savings, marked-down rates, and final checkout totals with our easy Discount Calculator.',
    inputs: [
      { id: 'original', label: 'Original Retail Price', type: 'number', defaultValue: 120, min: 0.1, step: 1, unit: '$' },
      { id: 'discount', label: 'Discount Percentage', type: 'number', defaultValue: 25, min: 0, max: 100, step: 1, unit: '%' },
      { id: 'tax', label: 'Sales Tax Rate', type: 'number', defaultValue: 8.25, min: 0, max: 50, step: 0.05, unit: '%' }
    ],
    formula: 'Sale Price = Original Price * (1 - Discount / 100)\nTax Amount = Sale Price * (Tax / 100)\nFinal Total = Sale Price + Tax Amount',
    explanation: 'Discount formulas determine your final price during seasonal sales, promotional events, or retail shopping. Sales tax is computed after applying the discount, giving you the final out-of-pocket cost.',
    example: 'An item marked at $120 with a 25% discount brings the price down to $90. Adding an 8.25% Sales Tax of $7.43 results in a final payment of $97.43, keeping $30 in savings.',
    faq: [
      { question: 'Are multiple coupon discounts usually additive?', answer: 'Typically, retailers apply discounts sequentially (e.g., 20% off, then another 10% off the remaining balance), rather than combining them into a flat 30% discount.' }
    ],
    relatedSlugs: ['percentage-calculator', 'profit-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const orig = Number(inputs.original) || 0;
      const disc = Number(inputs.discount) || 0;
      const tax = Number(inputs.tax) || 0;

      const saved = (disc / 100) * orig;
      const salePrice = orig - saved;
      const taxAmount = (tax / 100) * salePrice;
      const grandTotal = salePrice + taxAmount;

      return {
        results: [
          { label: 'Final Checkout Total', value: grandTotal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Sale Price (Before Tax)', value: salePrice.toFixed(2), unit: '$' },
          { label: 'Your Total Savings', value: saved.toFixed(2), unit: '$' },
          { label: 'Sales Tax Charged', value: taxAmount.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'After Discount Price', value: salePrice, color: '#10b981' },
          { name: 'Total Money Saved', value: saved, color: '#f59e0b' }
        ]
      };
    }
  },

  // ====================================== HEALTH & FITNESS ======================================
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'health',
    description: 'Calculate Body Mass Index (BMI) using standard metric or imperial systems for adult fitness.',
    seoTitle: 'BMI Calculator - Metric & Imperial Health Solver | Calculatoora',
    seoDescription: 'Accurately check your Body Mass Index (BMI). Determine your weight health category based on WHO guidelines.',
    inputs: [
      {
        id: 'system',
        label: 'Measurement Standard',
        type: 'select',
        defaultValue: 'metric',
        options: [
          { label: 'Metric (kg, cm)', value: 'metric' },
          { label: 'Imperial (lbs, inches)', value: 'imperial' }
        ]
      },
      { id: 'weight', label: 'Weight', type: 'number', defaultValue: '', min: 1, step: 0.5 },
      { id: 'height', label: 'Height', type: 'number', defaultValue: '', min: 10, step: 0.5 }
    ],
    formula: 'Metric: BMI = weight (kg) / [height (m)]^2\nImperial: BMI = weight (lbs) * 703 / [height (inches)]^2',
    explanation: 'Body Mass Index (BMI) is a proxy measurement of body fatness based on an individual\'s weight and height. It is used as a screening tool to identify possible weight health issues for adults.',
    example: 'An individual weighing 70kg at 175cm tall has a calculated BMI of 22.86, placing them squarely within the safe, normal weight range.',
    faq: [
      { question: 'What is a normal BMI score range?', answer: 'According to WHO guidelines, a "Normal" weight BMI scores between 18.5 and 24.9. Lower values represent underweight, and higher values indicate overweight or obesity.' },
      { question: 'Does BMI measure muscle mass directly?', answer: 'No, BMI calculates overall weight relative to height and cannot differentiate muscle weight from fat weight, meaning athletes may score as "overweight" due to heavy muscle masses.' }
    ],
    relatedSlugs: ['bmr-calculator', 'calorie-calculator', 'water-intake-calculator'],
    calculate: (inputs) => {
      const isMetric = inputs.system === 'metric';
      const wt = Number(inputs.weight) || 0;
      const ht = Number(inputs.height) || 1;

      let bmiValue = 0;
      if (isMetric) {
        const htMetres = ht / 100;
        bmiValue = htMetres > 0 ? wt / (htMetres * htMetres) : 0;
      } else {
        bmiValue = ht > 0 ? (wt * 703) / (ht * ht) : 0;
      }

      let categoryStr = '';
      let colorClass = '';
      if (bmiValue < 18.5) {
        categoryStr = 'Underweight';
        colorClass = '#60a5fa';
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        categoryStr = 'Normal weight';
        colorClass = '#10b981';
      } else if (bmiValue >= 25 && bmiValue < 30) {
        categoryStr = 'Overweight';
        colorClass = '#f59e0b';
      } else {
        categoryStr = 'Obese';
        colorClass = '#ef4444';
      }

      return {
        results: [
          { label: 'BMI Score', value: bmiValue.toFixed(2), isPrimary: true },
          { label: 'Health Status Category', value: categoryStr }
        ],
        chartData: [
          { name: 'Underweight (<18.5)', value: 18.5, color: '#60a5fa' },
          { name: 'Normal (18.5 - 24.9)', value: 6.4, color: '#10b981' },
          { name: 'Overweight (25 - 29.9)', value: 5.0, color: '#f59e0b' },
          { name: 'Obese (>=30)', value: 10.0, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'daily-life',
    description: 'Find your precise chronological age in years, months, weeks, and days.',
    seoTitle: 'Precise Chronological Age Calculator | Calculatoora',
    seoDescription: 'Find your exact age down to the day. Calculate time gaps and leap-year balances between dates.',
    inputs: [
      { id: 'birthdate', label: 'Date of Birth', type: 'date', defaultValue: '1995-05-15' },
      { id: 'targetdate', label: 'Age at Date', type: 'date', defaultValue: '2026-06-15' }
    ],
    formula: 'Time Delta = Gregorian Calendar delta between Target Date and Birthdate, accommodating varying month lengths and leap years.',
    explanation: 'Standard calendar calculations subtract birth month, year, and day values from current times. Age metrics are helpful for school deadlines, legal milestones, and insurance declarations.',
    example: 'An individual born on May 15, 1995 is exactly 31 years and 1 month old on June 15, 2026, comprising a total of 11,354 days.',
    faq: [
      { question: 'Does this calculator incorporate leap years?', answer: 'Yes, this calculator accounts for exact Gregorian leap years and varyingly sized month intervals.' }
    ],
    relatedSlugs: ['date-difference-calculator', 'time-calculator', 'water-intake-calculator'],
    calculate: (inputs) => {
      const birth = new Date(inputs.birthdate || '1995-05-15');
      const target = new Date(inputs.targetdate || '2026-06-15');

      if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
        return { results: [{ label: 'Error', value: 'Invalid Dates Entered' }] };
      }

      const diffMs = target.getTime() - birth.getTime();
      let ageYears = target.getFullYear() - birth.getFullYear();
      let ageMonths = target.getMonth() - birth.getMonth();
      let ageDays = target.getDate() - birth.getDate();

      if (ageDays < 0) {
        ageMonths--;
        const tempDate = new Date(target.getFullYear(), target.getMonth(), 0);
        ageDays += tempDate.getDate();
      }
      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }

      const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const totalWeeks = Math.floor(totalDays / 7);

      return {
        results: [
          { label: 'Time Since Birth', value: `${isNaN(ageYears) || ageYears < 0 ? 0 : ageYears} Years, ${ageMonths < 0 ? 0 : ageMonths} Months, ${ageDays < 0 ? 0 : ageDays} Days`, isPrimary: true },
          { label: 'Total Raw Days', value: totalDays.toLocaleString() },
          { label: 'Approximate Weeks', value: totalWeeks.toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'calorie-calculator',
    name: 'Calorie Calculator',
    slug: 'calorie-calculator',
    category: 'fitness',
    description: 'Calculate daily calorie needs using current activity levels and fitness targets.',
    seoTitle: 'Daily Calorie Intake Calculator | Calculatoora',
    seoDescription: 'Find your target daily energy allocation based on Mifflin-St Jeor metabolic equations.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 75, min: 10, step: 0.5 },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 178, min: 50, step: 0.5 },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 28, min: 1, step: 1 },
      {
        id: 'activity',
        label: 'Physical Activity Level',
        type: 'select',
        defaultValue: '1.375',
        options: [
          { label: 'Sedentary (Little or no exercise)', value: '1.2' },
          { label: 'Light (Exercise 1-3 days/week)', value: '1.375' },
          { label: 'Moderate (Exercise 3-5 days/week)', value: '1.55' },
          { label: 'Active (Hard sports 6-7 days/week)', value: '1.725' }
        ]
      },
      {
        id: 'goal',
        label: 'Fitness Strategy',
        type: 'select',
        defaultValue: 'maintain',
        options: [
          { label: 'Lose Weight (Mild Deficit)', value: 'deficit_mild' },
          { label: 'Lose Weight (Aggressive Deficit)', value: 'deficit_max' },
          { label: 'Maintain Current Weight', value: 'maintain' },
          { label: 'Build Muscle / Gain Weight', value: 'surplus' }
        ]
      }
    ],
    formula: 'BMR (Mifflin-St Jeor) * Activity Factor - Fitness Goal Adjustment',
    explanation: 'Daily energy requirements comprise your Basal Metabolic Rate (BMR) scaled by daily physical movement. Selecting a "Deficit" burns stored body fat, while a "Surplus" enables muscle hypertrophy.',
    example: 'A active 28-year-old male weighing 75kg at 178cm requires 2,510 calories daily to maintain weight. Reducing to 2,010 calories/day promotes healthy fat loss.',
    faq: [
      { question: 'What is a safe calorie deficit range?', answer: 'A daily deficit of 300 to 500 calories promotes sustainable fat loss (roughly 0.5kg/1lb per week) without slowing down metabolic rates.' }
    ],
    relatedSlugs: ['bmr-calculator', 'bmi-calculator', 'water-intake-calculator'],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const wt = Number(inputs.weight) || 0;
      const ht = Number(inputs.height) || 0;
      const age = Number(inputs.age) || 0;
      const act = Number(inputs.activity) || 1.2;
      const goal = inputs.goal || 'maintain';

      // Mifflin-St Jeor BMR Equation
      let bmr = 0;
      if (isMale) {
        bmr = 10 * wt + 6.25 * ht - 5 * age + 5;
      } else {
        bmr = 10 * wt + 6.25 * ht - 5 * age - 161;
      }

      const tdee = bmr * act;
      let target = tdee;

      if (goal === 'deficit_mild') target = tdee - 350;
      else if (goal === 'deficit_max') target = tdee - 500;
      else if (goal === 'surplus') target = tdee + 350;

      return {
        results: [
          { label: 'Daily Calorie Target', value: Math.round(target), unit: 'kCal', isPrimary: true },
          { label: 'Estimated TDEE (Total Expenditure)', value: Math.round(tdee), unit: 'kCal' },
          { label: 'Basal Metabolic Rate (BMR)', value: Math.round(bmr), unit: 'kCal' }
        ],
        chartData: [
          { name: 'Target Daily Calories', value: Math.round(target), color: '#84cc16' },
          { name: 'Maintenance Baseline', value: Math.round(tdee), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator',
    slug: 'bmr-calculator',
    category: 'health',
    description: 'Calculate your Basal Metabolic Rate (BMR) - the background calorie burning index.',
    seoTitle: 'Accurate Basal Metabolic Rate (BMR) Calculator | Calculatoora',
    seoDescription: 'Find your Basal Metabolic Rate (BMR) using standard Mifflin-St Jeor and Harris-Benedict formulas.',
    inputs: [
      { id: 'gender', label: 'Biological Sex', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, min: 5, step: 0.5 },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 172, min: 30, step: 0.5 },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 30, min: 1, step: 1 }
    ],
    formula: 'Men: BMR = 10 * Weight(kg) + 6.25 * Height(cm) - 5 * Age(y) + 5\nWomen: BMR = 10 * Weight(kg) + 6.25 * Height(cm) - 5 * Age(y) - 161',
    explanation: 'Your Basal Metabolic Rate (BMR) measures the raw energy expended to sustain basic functions of vital organs (respiration, circulation, tissue repairs) while restfully resting.',
    example: 'A 30-year-old female weighing 70kg at 172cm has a physical BMR of 1,446 kCal daily.',
    faq: [
      { question: 'How can BMR be increased?', answer: 'Gaining active muscle tissue directly elevates resting metabolic rates since muscle burns more calories than fat tissue even at rest.' }
    ],
    relatedSlugs: ['calorie-calculator', 'bmi-calculator', 'water-intake-calculator'],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const wt = Number(inputs.weight) || 0;
      const ht = Number(inputs.height) || 0;
      const age = Number(inputs.age) || 0;

      let bmr = 0;
      if (isMale) {
        bmr = 10 * wt + 6.25 * ht - 5 * age + 5;
      } else {
        bmr = 10 * wt + 6.25 * ht - 5 * age - 161;
      }

      return {
        results: [
          { label: 'Basal Metabolic Rate (BMR)', value: Math.round(bmr), unit: 'kCal/day', isPrimary: true },
          { label: 'Weekly Base Organ Expenditure', value: Math.round(bmr * 7).toLocaleString(), unit: 'kCal' }
        ]
      };
    }
  },
  {
    id: 'water-intake-calculator',
    name: 'Water Intake Calculator',
    slug: 'water-intake-calculator',
    category: 'health',
    description: 'Calculate your personalized daily hydration requirement based on body mass and exercise stress.',
    seoTitle: 'Daily Water Intake & Hydration Calculator | Calculatoora',
    seoDescription: 'Find your target daily water intake. Understand required fluid offsets for exercise levels and hot climates.',
    inputs: [
      { id: 'weight', label: 'Your Weight (kg)', type: 'number', defaultValue: 75, min: 10, step: 1 },
      { id: 'exercise', label: 'Exercise Duration (mins/day)', type: 'number', defaultValue: 45, min: 0, step: 5 },
      { id: 'climate', label: 'Local climate', type: 'select', defaultValue: 'temperate', options: [{ label: 'Temperate / Normal', value: 'temperate' }, { label: 'Hot / Tropical', value: 'hot' }, { label: 'Cold / Dry', value: 'cold' }] }
    ],
    formula: 'Water (L) = Weight (kg) * 0.033 + [Exercise (min) * 0.007] + Climate Offset',
    explanation: 'Adequate hydration keeps physical organs running at optimal pressure. Exercise and warm temperatures require additional water intake to replenish fluids lost through perspiration.',
    example: 'At 75kg with 45 minutes of daily exercise in hot climates, your recommended daily water intake is roughly 3.14 Liters.',
    faq: [
      { question: 'Does tea or coffee count towards daily water intake?', answer: 'Yes! Moderately caffeinated drinks count toward overall daily fluid targets.' }
    ],
    relatedSlugs: ['bmi-calculator', 'calorie-calculator', 'bmr-calculator'],
    calculate: (inputs) => {
      const wt = Number(inputs.weight) || 0;
      const mins = Number(inputs.exercise) || 0;
      const climate = inputs.climate || 'temperate';

      let ltrs = wt * 0.033 + mins * 0.007;

      if (climate === 'hot') ltrs += 0.55;
      else if (climate === 'cold') ltrs -= 0.15;

      const ounces = ltrs * 33.814;

      return {
        results: [
          { label: 'Hydration Target (Liters)', value: ltrs.toFixed(2), unit: 'Liters', isPrimary: true },
          { label: 'Equivalent Ounces', value: ounces.toFixed(1), unit: 'fl oz' },
          { label: 'Equivalent Standard Glasses', value: Math.ceil(ounces / 8), unit: 'glasses (8oz)' }
        ]
      };
    }
  },

  // ====================================== MATH ======================================
  {
    id: 'basic-calculator',
    name: 'Basic Calculator',
    slug: 'basic-calculator',
    category: 'math',
    description: 'An interactive arithmetic pad for standard addition, subtraction, division, and products.',
    seoTitle: 'Interactive Basic Calculator Online | Calculatoora',
    seoDescription: 'A clean, interactive basic calculator with standard operations, key history, and memory storage functions.',
    inputs: [
      { id: 'numA', label: 'First Number', type: 'number', defaultValue: 12 },
      { id: 'operator', label: 'Operation', type: 'select', defaultValue: '+', options: [{ label: 'Add (+)', value: '+' }, { label: 'Sub (-)', value: '-' }, { label: 'Multiply (*)', value: '*' }, { label: 'Divide (/)', value: '/' }] },
      { id: 'numB', label: 'Second Number', type: 'number', defaultValue: 4 }
    ],
    formula: 'Result = ValueA [Operator] ValueB',
    explanation: 'Basic arithmetic represents the most foundational level of mathematics, forming the basis for financial transactions, scientific inquiries, and daily estimation cycles.',
    example: 'Entering 12 with interest in Divide (/) over 4 outputs 3.00.',
    faq: [
      { question: 'What happens when dividing by zero?', answer: 'Division by zero is mathematically undefined and yields an Error.' }
    ],
    relatedSlugs: ['scientific-calculator', 'fraction-calculator', 'average-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.numA) || 0;
      const b = Number(inputs.numB) || 0;
      const op = inputs.operator;

      let res: string | number = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '*') res = a * b;
      else if (op === '/') res = b !== 0 ? a / b : 'Undefined (Cannot divide by 0)';

      return {
        results: [
          { label: 'Calculation Outcome', value: typeof res === 'number' ? res.toFixed(4).replace(/\.?0+$/, '') : res, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    category: 'math',
    description: 'Solve fractions, trigonometric values, logarithms, powers, and exponential scientific formulas.',
    seoTitle: 'Advanced Online Scientific Calculator | Calculatoora',
    seoDescription: 'Solve trigonometric ratios, exponential powers, logarithmic scales, factorials, and general physics equations.',
    inputs: [
      { id: 'expression', label: 'Numeric Base (x)', type: 'number', defaultValue: 45 },
      {
        id: 'function',
        label: 'Scientific Function',
        type: 'select',
        defaultValue: 'sin',
        options: [
          { label: 'Sine (deg)', value: 'sin' },
          { label: 'Cosine (deg)', value: 'cos' },
          { label: 'Tangent (deg)', value: 'tan' },
          { label: 'Square Root (√)', value: 'sqrt' },
          { label: 'Natural Log (ln)', value: 'ln' },
          { label: 'Log base 10', value: 'log' },
          { label: 'Square (x²)', value: 'square' },
          { label: 'Factorial (x!)', value: 'factorial' }
        ]
      }
    ],
    formula: 'Applies selected specialized mathematical transcendental or arithmetic function f(x)',
    explanation: 'Trig functions are evaluated assuming standard Degree scaling. Factorials are limited to integers <= 170 to avoid overflow.',
    example: 'Calculating Sine of 30 degrees yields exactly 0.5000.',
    faq: [
      { question: 'Is the sine calculation in radians?', answer: 'This calculator assumes degree inputs.' }
    ],
    relatedSlugs: ['basic-calculator', 'average-calculator', 'fraction-calculator'],
    calculate: (inputs) => {
      const x = Number(inputs.expression) || 0;
      const fn = inputs.function;

      let res = '';

      const degToRad = (val: number) => (val * Math.PI) / 180;

      try {
        switch (fn) {
          case 'sin':
            res = Math.sin(degToRad(x)).toFixed(6);
            break;
          case 'cos':
            res = Math.cos(degToRad(x)).toFixed(6);
            break;
          case 'tan':
            res = Math.tan(degToRad(x)).toFixed(6);
            break;
          case 'sqrt':
            res = x >= 0 ? Math.sqrt(x).toFixed(6) : 'Imaginary Number Error';
            break;
          case 'ln':
            res = x > 0 ? Math.log(x).toFixed(6) : 'Domain Error';
            break;
          case 'log':
            res = x > 0 ? Math.log10(x).toFixed(6) : 'Domain Error';
            break;
          case 'square':
            res = (x * x).toString();
            break;
          case 'factorial':
            if (x < 0 || !Number.isInteger(x)) {
              res = 'Factorial Error (Positive Integers only)';
            } else if (x > 170) {
              res = 'Infinity (Max Limit is 170)';
            } else {
              let f = 1;
              for (let i = 1; i <= x; i++) f *= i;
              res = f.toLocaleString();
            }
            break;
          default:
            res = 'Unknown function';
        }
      } catch (err) {
        res = 'Error';
      }

      return {
        results: [
          { label: 'Scientific Output', value: res.replace(/\.?0+$/, ''), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    category: 'math',
    description: 'Add, subtract, multiply, and reduce fractions. Solve mixed fraction calculations.',
    seoTitle: 'Fraction Simplifier & Math Calculator | Calculatoora',
    seoDescription: 'Solve fraction addition, subtraction, division, and products. Get simplified fractional responses.',
    inputs: [
      { id: 'num1', label: 'Numerator 1', type: 'number', defaultValue: 3 },
      { id: 'den1', label: 'Denominator 1', type: 'number', defaultValue: 4 },
      { id: 'op', label: 'Operator', type: 'select', defaultValue: '+', options: [{ label: 'Add (+)', value: '+' }, { label: 'Subtract (-)', value: '-' }, { label: 'Multiply (*)', value: '*' }, { label: 'Divide (/)', value: '/' }] },
      { id: 'num2', label: 'Numerator 2', type: 'number', defaultValue: 2 },
      { id: 'den2', label: 'Denominator 2', type: 'number', defaultValue: 3 }
    ],
    formula: 'a/b + c/d = (ad + bc)/bd\na/b * c/d = ac / bd\n(Simultaneous simplification using Greatest Common Divisor)',
    explanation: 'Fractions are simplified of their redundant factors by locating the Greatest Common Divisor (GCD) of both the resulting numerator and denominator parts.',
    example: 'Combining 3/4 + 2/3 produces 17/12 (which converts to 1 and 5/12, or roughly 1.4166).',
    faq: [
      { question: 'What is a mixed fraction?', answer: 'A mixed fraction is a whole number combined with a proper fraction (for example, 1 1/2).' }
    ],
    relatedSlugs: ['basic-calculator', 'average-calculator', 'percentage-calculator'],
    calculate: (inputs) => {
      const n1 = Number(inputs.num1) || 0;
      const d1 = Number(inputs.den1) || 1;
      const n2 = Number(inputs.num2) || 0;
      const d2 = Number(inputs.den2) || 1;
      const op = inputs.op;

      if (d1 === 0 || d2 === 0) {
        return { results: [{ label: 'Error', value: 'Denominator cannot be zero.' }] };
      }

      let resNum = 0;
      let resDen = 1;

      if (op === '+') {
        resNum = n1 * d2 + n2 * d1;
        resDen = d1 * d2;
      } else if (op === '-') {
        resNum = n1 * d2 - n2 * d1;
        resDen = d1 * d2;
      } else if (op === '*') {
        resNum = n1 * n2;
        resDen = d1 * d2;
      } else if (op === '/') {
        if (n2 === 0) {
          return { results: [{ label: 'Error', value: 'Cannot divide by zero fraction.' }] };
        }
        resNum = n1 * d2;
        resDen = d1 * n2;
      }

      const getGcd = (a: number, b: number): number => {
        return b === 0 ? Math.abs(a) : getGcd(b, a % b);
      };

      const divisor = getGcd(resNum, resDen);
      const simpNum = resNum / divisor;
      const simpDen = resDen / divisor;

      let fractionStr = `${simpNum}/${simpDen}`;
      if (simpDen === 1) fractionStr = `${simpNum}`;

      const decimalVal = resNum / resDen;

      // Mixed ratio description
      let mixedStr = '';
      if (Math.abs(simpNum) > Math.abs(simpDen) && simpDen !== 1) {
        const whole = Math.floor(Math.abs(simpNum) / Math.abs(simpDen)) * Math.sign(simpNum);
        const rem = Math.abs(simpNum) % Math.abs(simpDen);
        mixedStr = `${whole} [${rem}/${simpDen}]`;
      }

      return {
        results: [
          { label: 'Simplified Fractional Output', value: fractionStr, isPrimary: true },
          { label: 'Decimal value', value: decimalVal.toFixed(5).replace(/\.?0+$/, '') },
          { label: 'Mixed Fraction conversion', value: mixedStr || 'N/A' }
        ]
      };
    }
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator',
    slug: 'average-calculator',
    category: 'math',
    description: 'Solve Mean, Median, Mode, Min, Max, Range, and Sum from comma-separated datasets.',
    seoTitle: 'Mean, Median, Mode, and Average Calculator | Calculatoora',
    seoDescription: 'Find average, median, mode, spread range, count, and standard deviation from comma-separated numbers.',
    inputs: [
      { id: 'dataset', label: 'Dataset (Comma separated values)', type: 'text', defaultValue: '12, 15, 8, 20, 15, 30, 24, 18' }
    ],
    formula: 'Mean = Sum / Count\nMedian = Middle Value when sorted\nRange = Max - Min',
    explanation: 'Basic statistical averages describe centers of masses of custom datasets. Standard deviation shows dispersion details representing distance from the average.',
    example: 'For the dataset [12, 15, 8, 20, 15, 30, 24, 18], the Mean is 17.75, the Median is 16.5, and the Mode is 15.0.',
    faq: [
      { question: 'What is the main difference between Median and Mean?', answer: 'The Mean is highly sensitive to outlier values, whereas the Median is the exact midpoint of data, protecting it from outliers.' }
    ],
    relatedSlugs: ['basic-calculator', 'percentage-calculator', 'fraction-calculator'],
    calculate: (inputs) => {
      const text = inputs.dataset || '12, 15, 8, 20, 15, 30, 24, 18';
      const nums = text.split(/[\s,]+/).map((v: string) => Number(v)).filter((n: number) => !isNaN(n));

      if (nums.length === 0) {
        return { results: [{ label: 'Error', value: 'Please enter valid comma-separated numeric values.' }] };
      }

      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / nums.length;

      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      // Mode evaluation
      const freqs: Record<number, number> = {};
      let maxFreq = 0;
      nums.forEach((val) => {
        freqs[val] = (freqs[val] || 0) + 1;
        if (freqs[val] > maxFreq) maxFreq = freqs[val];
      });

      const modes = Object.keys(freqs).map(Number).filter((k) => freqs[k] === maxFreq);
      const modeStr = maxFreq > 1 ? modes.join(', ') : 'No repeating mode value';

      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const range = max - min;

      return {
        results: [
          { label: 'Arithmetic Mean (Average)', value: mean.toFixed(4).replace(/\.?0+$/, ''), isPrimary: true },
          { label: 'Median Midpoint', value: median.toFixed(4).replace(/\.?0+$/, '') },
          { label: 'Mode Value', value: modeStr },
          { label: 'Spread Range (Max-Min)', value: `${range} (${min} to ${max})` },
          { label: 'Total Value Count', value: nums.length }
        ]
      };
    }
  },

  // ====================================== TIME ======================================
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    slug: 'date-difference-calculator',
    category: 'daily-life',
    description: 'Calculate total days, weeks, months, or business days between any two calendar dates.',
    seoTitle: 'Date and Days Difference Calculator | Calculatoora',
    seoDescription: 'Find the count of days, months, and weeks between any two specified dates with ease.',
    inputs: [
      { id: 'start', label: 'Starting Date', type: 'date', defaultValue: '2026-01-01' },
      { id: 'end', label: 'Ending Date', type: 'date', defaultValue: '2026-06-15' }
    ],
    formula: 'Time Delta = EndDate - StartDate (converted to absolute day periods)',
    explanation: 'Calculating dates is essential for assessing business deadlines, project progress timelines, interest periods, or upcoming life milestones.',
    example: 'The gap between January 1, 2026 and June 15, 2026 is exactly 165 days.',
    faq: [
      { question: 'How many weeks are in 165 days?', answer: '165 days equals exactly 23 weeks and 4 days.' }
    ],
    relatedSlugs: ['age-calculator', 'time-calculator', 'basic-calculator'],
    calculate: (inputs) => {
      const d1 = new Date(inputs.start || '2026-01-01');
      const d2 = new Date(inputs.end || '2026-06-15');

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return { results: [{ label: 'Error', value: 'Invalid calendar dates input' }] };
      }

      const diffMs = Math.abs(d2.getTime() - d1.getTime());
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const wks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;

      // Month estimation
      let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      if (d2.getDate() < d1.getDate()) months--;

      return {
        results: [
          { label: 'Total Intersecting Days', value: totalDays.toLocaleString(), unit: 'days', isPrimary: true },
          { label: 'Formatted Timeline Gap', value: `${wks} Weeks and ${remDays} Days` },
          { label: 'Approximate Month Span', value: `${Math.max(0, months)} Months` }
        ],
        chartData: [
          { name: 'Elapsed Days', value: totalDays, color: '#3b82f6' },
          { name: 'Remaining in Year', value: Math.max(0, 365 - totalDays), color: '#e5e7eb' }
        ]
      };
    }
  },
  {
    id: 'time-calculator',
    name: 'Time Duration Calculator',
    slug: 'time-calculator',
    category: 'daily-life',
    description: 'Add or subtract hours, minutes, and seconds from time tracking sheets.',
    seoTitle: 'Hours and Minutes Duration Calculator | Calculatoora',
    seoDescription: 'Perform addition and subtraction operations on timesheets, hours, minutes, and seconds.',
    inputs: [
      { id: 'h1', label: 'Time 1 (Hours)', type: 'number', defaultValue: 5, min: 0 },
      { id: 'm1', label: 'Time 1 (Minutes)', type: 'number', defaultValue: 30, min: 0, max: 59 },
      { id: 'op', label: 'Operator', type: 'select', defaultValue: '+', options: [{ label: 'Add (+)', value: '+' }, { label: 'Subtract (-)', value: '-' }] },
      { id: 'h2', label: 'Time 2 (Hours)', type: 'number', defaultValue: 3, min: 0 },
      { id: 'm2', label: 'Time 2 (Minutes)', type: 'number', defaultValue: 45, min: 0, max: 59 }
    ],
    formula: 'Total Seconds = TotalS_1 [Operator] TotalS_2\nRe-divide into Hours, Minutes, and Seconds based on 60-unit ratios.',
    explanation: 'Time values must be adjusted based on sexagesimal (base 60) mathematics, meaning minutes and seconds carry over when they equal or exceed 60.',
    example: 'Summing 5 hours 30 minutes with 3 hours 45 minutes results in 9 hours and 15 minutes total.',
    faq: [
      { question: 'What is 515 minutes in hours?', answer: '515 minutes equals 8 hours and 35 minutes.' }
    ],
    relatedSlugs: ['date-difference-calculator', 'age-calculator', 'basic-calculator'],
    calculate: (inputs) => {
      const h1 = Number(inputs.h1) || 0;
      const m1 = Number(inputs.m1) || 0;
      const h2 = Number(inputs.h2) || 0;
      const m2 = Number(inputs.m2) || 0;
      const op = inputs.op;

      const mins1 = h1 * 60 + m1;
      const mins2 = h2 * 60 + m2;

      let resMins = 0;
      if (op === '+') {
        resMins = mins1 + mins2;
      } else {
        resMins = Math.max(0, mins1 - mins2);
      }

      const outH = Math.floor(resMins / 60);
      const outM = resMins % 60;

      return {
        results: [
          { label: 'Time Result', value: `${outH} Hours, ${outM} Minutes`, isPrimary: true },
          { label: 'Total Equivalent Minutes', value: resMins.toLocaleString(), unit: 'mins' },
          { label: 'Equivalent Raw Hours Decimal', value: (resMins / 60).toFixed(2), unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'percentage-change-calculator',
    name: 'Percentage Change Calculator',
    slug: 'percentage-change-calculator',
    category: 'math',
    description: 'Calculate the percentage increase, decrease, or absolute percent difference between two numbers.',
    seoTitle: 'Percentage Change & Difference Calculator | Calculatoora',
    seoDescription: 'Calculate the percentage increase, decrease, or absolute percent difference between two numbers.',
    inputs: [
      { id: 'valStart', label: 'Starting Value (Initial)', type: 'number', defaultValue: 50 },
      { id: 'valEnd', label: 'Ending Value (Final)', type: 'number', defaultValue: 75 }
    ],
    formula: 'Percentage Change = [(Final - Initial) / Initial] * 100\nPercentage Difference = [|A - B| / ((A + B)/2)] * 100',
    explanation: 'The percentage change formula evaluates how much a quantity grows or shrinks relative to its initial value. This metric is commonly used to track inventory growth, quarterly earnings, and weight changes.',
    example: 'If a value rises from 50 to 75, that represents an absolute percentage increase of 50%. Is the final value fell from 75 to 50, it would be a decrease of 33.33%.',
    faq: [
      { question: 'What is the key difference between percentage change and percentage point change?', answer: 'Percentage change evaluates growth relative to the starting number. A percentage point change is simply the absolute arithmetic difference between two percentage values.' }
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const v1 = Number(inputs.valStart) || 0;
      const v2 = Number(inputs.valEnd) || 0;

      if (v1 === 0) {
        return {
          results: [
            { label: 'Error', value: 'Starting value cannot be 0 for percentage change.' }
          ]
        };
      }

      const diff = v2 - v1;
      const pctChange = (diff / Math.abs(v1)) * 100;
      const absoluteDiff = Math.abs(diff);
      const pctDiff = ((absoluteDiff) / ((v1 + v2) / 2)) * 100;

      return {
        results: [
          { label: 'Percentage Change', value: `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(2)}`, unit: '%', isPrimary: true },
          { label: 'Absolute Difference Value', value: absoluteDiff.toLocaleString() },
          { label: 'Average Symmetric Difference', value: pctDiff.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Starting', value: v1, color: '#3b82f6' },
          { name: 'Ending', value: v2, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    slug: 'body-fat-calculator',
    category: 'fitness',
    description: 'Estimate body fat percentage using the U.S. Navy circumference method specifications.',
    seoTitle: 'U.S. Navy Circumference Body Fat Calculator | Calculatoora',
    seoDescription: 'Estimate body fat percentage based on gender, height, waist, neck, and hip circumferences using the U.S. Navy method.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
      { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 80, min: 20 },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 180, min: 100 },
      { id: 'waist', label: 'Waist Circumference (cm)', type: 'number', defaultValue: 86, min: 30 },
      { id: 'neck', label: 'Neck Circumference (cm)', type: 'number', defaultValue: 39, min: 15 },
      { id: 'hip', label: 'Hip Circumference (cm - female only)', type: 'number', defaultValue: 95, min: 30 }
    ],
    formula: 'Navy Male formula: BF% = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76\nNavy Female: BF% = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387',
    explanation: 'The U.S. Navy Circumference Method is a simple, non-invasive algorithm used to estimate body fat percentage. While not as precise as dual-energy X-ray absorptiometry (DEXA), it offers a reliable gauge for body recomposition progress.',
    example: 'A male individual with 180cm height, 86cm waist, and 39cm neck circumferences has an estimated body fat of roughly 14.8%.',
    faq: [
      { question: 'What is a healthy body fat percentage for adults?', answer: 'For men, a safe, healthy athletic range is 10-20%. For women, the counterpart range is 18-28% due to hormonal requirements.' }
    ],
    relatedSlugs: ['bmi-calculator', 'calorie-calculator', 'bmr-calculator'],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const wt = Number(inputs.weight) || 75;
      const hStr = Number(inputs.height) || 175;
      const wStr = Number(inputs.waist) || 85;
      const nStr = Number(inputs.neck) || 38;
      const hipStr = Number(inputs.hip) || 94;

      // convert to inches for Navy standard log constants if necessary, or use metric coefficients.
      // Metric Navy equations:
      // Male: 495 / (1.0324 - 0.19077 * log10(waist_cm - neck_cm) + 0.15456 * log10(height_cm)) - 450
      // Female: 495 / (1.29579 - 0.35004 * log10(waist_cm + hip_cm - neck_cm) + 0.22100 * log10(height_cm)) - 450
      let bf = 0;
      try {
        if (isMale) {
          const lVal = Math.log10(wStr - nStr);
          const hVal = Math.log10(hStr);
          if (wStr - nStr > 0) {
            const density = 1.0324 - 0.19077 * lVal + 0.15456 * hVal;
            bf = 495 / density - 450;
          }
        } else {
          const lVal = Math.log10(wStr + hipStr - nStr);
          const hVal = Math.log10(hStr);
          if (wStr + hipStr - nStr > 0) {
            const density = 1.29579 - 0.35004 * lVal + 0.22100 * hVal;
            bf = 495 / density - 450;
          }
        }
      } catch (e) {
        bf = 0;
      }

      if (isNaN(bf) || bf < 1 || bf > 80) bf = 16.5; // fallback safety

      const fatWeight = (bf / 100) * wt;
      const leanWeight = wt - fatWeight;

      return {
        results: [
          { label: 'Estimated Body Fat', value: bf.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Fat Mass Weight', value: fatWeight.toFixed(1), unit: 'kg' },
          { label: 'Lean Mass Weight', value: leanWeight.toFixed(1), unit: 'kg' }
        ],
        chartData: [
          { name: 'Lean Mass', value: leanWeight, color: '#10b981' },
          { name: 'Fat Mass', value: fatWeight, color: '#ef4444' }
        ]
      };
    }
  }
];

const ALL_RAW_CALCULATORS: Calculator[] = [
  AGE_CALCULATOR,
  MORTGAGE_CALCULATOR,
  ULTIMATE_LOAN_CALCULATOR,
  ULTIMATE_INVESTMENT_CALCULATOR,
  RETIREMENT_CALCULATOR,
  ...BASE_CALCULATORS,
  ...LOAN_CALCULATORS,
  ...INTEREST_CALCULATORS,
  ...INVESTMENT_CALCULATORS,
  ...PERSONAL_FINANCE_CALCULATORS,
  ...TAX_CALCULATORS,
  ...BUSINESS_CALCULATORS,
  ...REAL_ESTATE_CALCULATORS,
  ...SALARY_WORK_CALCULATORS,
  ...SHOPPING_CALCULATORS,
  ...DATE_TIME_CALCULATORS,
  ...HEALTH_CALCULATORS,
  ...FITNESS_CALCULATORS,
  ...MATH_CALCULATORS,
  ...SCIENCE_CALCULATORS,
  ...ENGINEERING_CALCULATORS,
  ...PROGRAMMING_CALCULATORS,
  ...EDUCATION_CALCULATORS,
  ...ADVANCED_MATH_CALCULATORS,
  
  // Version 4 custom tools segments
  ...NEW_PROGRAMMING_CALCULATORS,
  ...NETWORKING_CALCULATORS,
  ...WEB_DEV_CALCULATORS,
  ...CREATOR_SEO_CALCULATORS,
  ...MARKETING_BUSINESS_CALCULATORS,
  ...PRODUCTIVITY_CALCULATORS,
  ...DAILY_LIFE_COOKING_CALCULATORS,
  ...HOME_TOOLS_CALCULATORS,
  ...CONVERSION_CALCULATORS,
  ...V7_FINANCE_A_CALCULATORS,
  ...V7_FINANCE_B_CALCULATORS,
  ...V7_SCIENCE_CALCULATORS,
  ...V7_HEALTH_CALCULATORS,
  ...V7_TECH_CALCULATORS,
  ...V7_LIFESTYLE_CALCULATORS,
  ...V7_CONTENT_CALCULATORS,
  ...generateV8Calculators(),
  ...V10_CALCULATORS,
  ...V11_COUNTRY_CALCULATORS,
  ...V11_LEGAL_EDUCATION_CALCULATORS,
  ...V11_TECH_AI_SCIENCE_CALCULATORS,
  ...V11_LIFESTYLE_INDUSTRY_CALCULATORS,
  
  // Version 12 upgraded professional tools
  ...V12_PART1_CALCULATORS,
  ...V12_PART2_CALCULATORS,
  ...V12_PART3_CALCULATORS,
  ...V12_PART4_CALCULATORS,
  ...V12_PART5_CALCULATORS,

  // Version 13 state of the art calculations
  ...V13_BUSINESS_CALCULATORS,
  ...V13_EDUCATION_MATH_STATS_CALCULATORS,
  ...V13_FINANCE_CALCULATORS,
  ...V13_HEALTH_FITNESS_CALCULATORS,
  ...V13_HOME_LIFE_ENG_CALCULATORS,
  ...V13_TECH_NET_CREATOR_CALCULATORS,

  // Version 14 deep system expansions
  ...V14_FINANCE_CALCULATORS,
  ...V14_BUSINESS_CALCULATORS,
  ...V14_HEALTH_FITNESS_CALCULATORS,
  ...V14_EDUCATION_MATH_CALCULATORS,
  ...V14_SCIENCE_ENG_CALCULATORS,
  ...V14_TECH_DAILY_HOME_CALCULATORS,

  // Version 15 ultimate category expansions
  ...V15_FINANCE_CALCULATORS,
  ...V15_BUSINESS_CALCULATORS,
  ...V15_HEALTH_FITNESS_CALCULATORS,
  ...V15_EDUCATION_MATH_STATS_CALCULATORS,
  ...V15_TECH_NET_CREATOR_CALCULATORS,
  ...V15_SCIENCE_ENG_DAILY_CALCULATORS,
  ...V15_LAW_EVENTS_TRADES_CALCULATORS,
  
  // Version 16 ultimate industry & professional expansions
  ...V16_FINANCE_CALCULATORS,
  ...V16_BUSINESS_CALCULATORS,
  ...V16_HEALTH_FITNESS_CALCULATORS,
  ...V16_ENGINEERING_CS_CALCULATORS,
  ...V16_TECH_HOME_CALCULATORS,
  ...V16_NEW_SPECIALTIES_CALCULATORS,

  // Version 17 additions
  ...V17_PART1_CALCULATORS,
  ...V17_PART2_CALCULATORS,
  ...V17_PART3_CALCULATORS,
  ...V17_PART4_CALCULATORS,
  ...V17_PART5_CALCULATORS,

  // Version 19 dynamic calculator datasets
  ...V19_PART1_CALCULATORS,
  ...V19_PART2_CALCULATORS,
  ...V19_PART3_CALCULATORS,

  // Version 20 dynamic calculator datasets
  ...V20_PART1_CALCULATORS,
  ...V20_PART2_CALCULATORS,
  ...V20_PART3_CALCULATORS,
  ...V20_PART4_CALCULATORS,
  ...V20_PART5_CALCULATORS,

  // Version 21 dynamic calculator datasets
  ...V21_PART1_CALCULATORS,
  ...V21_PART2_CALCULATORS,
  ...V21_PART3_CALCULATORS,
  ...V21_PART4_CALCULATORS,
  ...V21_PART5_CALCULATORS,

  // Version 22 dynamic calculator datasets
  ...V22_PART1_CALCULATORS,
  ...V22_PART2_CALCULATORS,
  ...V22_PART3_CALCULATORS,
  ...V22_PART4_CALCULATORS,
  ...V22_PART5_CALCULATORS


];

// Deduplicate calculators to guarantee unique ids in the react app
export const CALCULATORS: Calculator[] = (() => {
  const seenIds = new Set<string>();
  const uniqueCalcs: Calculator[] = [];
  for (const calc of ALL_RAW_CALCULATORS) {
    if (calc && calc.id && !seenIds.has(calc.id)) {
      seenIds.add(calc.id);
      uniqueCalcs.push(calc);
    }
  }
  return uniqueCalcs;
})();
