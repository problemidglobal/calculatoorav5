import { FAQItem, CategoryType } from '../types';

export interface CategorySeoDetail {
  id: CategoryType;
  seoTitle: string;
  seoHeading: string;
  seoSubtitle: string;
  paragraphs: string[];
  faqs: FAQItem[];
}

export const CATEGORY_SEO_DATA: Record<string, CategorySeoDetail> = {
  finance: {
    id: 'finance',
    seoTitle: 'Advanced Personal Finance & Loan Calculators | Calculatoora',
    seoHeading: 'Advanced Personal Finance & Loan Calculators',
    seoSubtitle: 'Design repayment, future value growth, and mortgage schedules with precision.',
    paragraphs: [
      'Welcome to the premier personal finance and loan modeling pavilion. Liquid cash management requires rigorous, compounded mathematical validation before committing capital. Whether you are modeling a thirty-year fixed home mortgage, checking personal loan APR repayments, or configuring early-prepayment amortization tables, our real-time algorithms deliver standard outputs instantly.',
      'Our financial calculations support multiple global interest compounding systems, such as monthly, semi-annual, or quarterly intervals, ensuring compatibility with regional standards. You can simulate accelerated debt payoff horizons, extra monthly additions, and long-term future wealth projections securely in your local browser.',
      'To manage your portfolio effectively, explore our integrated wealth projections and dividend reinvestment (DRIP) estimators. All calculations are run entirely client-side, keeping your budgets private and protected from tracking code.'
    ],
    faqs: [
      {
        question: 'How does interest compounding affect my long-term debt cost?',
        answer: 'Compounding frequency determines how often interest is calculated of your principal balance. More frequent compounding (such as daily or monthly instead of annually) slightly increases the total interest accrued over the life of the loan.'
      },
      {
        question: 'What is the benefit of adding extra payments to a loan?',
        answer: 'Making additional payments directly reduces the remaining principal balance on which future interest is calculated, shortening the overall repayment timeline.'
      },
      {
        question: 'How do inflation baselines shift long-term savings goal calculations?',
        answer: 'Over decades, inflation lowers purchasing power. Our wealth managers incorporate adjustable inflation offsets, allowing you to estimate your future retirement corpus in today’s real dollars.'
      }
    ]
  },
  health: {
    id: 'health',
    seoTitle: 'Body Mass Index & Metabolic Energy Calculators | Calculatoora',
    seoHeading: 'Body Mass Index & Metabolic Energy Calculators',
    seoSubtitle: 'Verify healthy weight targets, body fat percentages, and physical metabolic thresholds.',
    paragraphs: [
      'Optimize your physical well-being using our medical-grade health indicators and metabolic estimators. Keeping body proportions aligned is crucial for long-term respiratory and cardiovascular health. Calculate your body mass index (BMI) instantly using standard metric and imperial configurations.',
      'Our systems also feature advanced metabolic formula solvers, including the Harris-Benedict and Mifflin-St Jeor equations. These help you estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), letting you plan meal programs and caloric deficits with confidence.',
      'Additionally, you can calculate optimal hydration values, daily protein distributions, and body fat percentages using the standard US Navy body circumference guidelines. Standard calculations are loaded instantly with zero server wait times.'
    ],
    faqs: [
      {
        question: 'Is BMI a reliable metric for athletic body compositions?',
        answer: 'While BMI is an effective screening tool for the general population, it only measures weight-to-height ratio and may not accurately reflect health for muscular athletes with high lean mass.'
      },
      {
        question: 'How does the Mifflin-St Jeor equation compute my daily calorie needs?',
        answer: 'It calculates your BMR based on weight, height, age, and gender, and then multiplies it by an activity index corresponding to your lifestyle to find your maintenance calories (TDEE).'
      },
      {
        question: 'How do hydration targets scale with climate and training levels?',
        answer: 'Hydration needs scale with metabolic activity and sweat loss. Our calculators apply adjustments for hot climates and intense training to ensure proper water recovery.'
      }
    ]
  },
  math: {
    id: 'math',
    seoTitle: 'Advanced Percentage, Fraction, & Ratio Calculators | Calculatoora',
    seoHeading: 'Advanced Percentage, Fraction, & Ratio Calculators',
    seoSubtitle: 'Solve complex equations, proportional ratios, and statistics variables in real-time.',
    paragraphs: [
      'Solve everyday math problems, fraction operations, and statistical samples using our high-precision math solvers. Proportional reasoning is the foundation of structural and commercial calculations. Easily compute percentage increases, discounted markdowns, and relative ratio margins.',
      'Our math engines support fractional additions, decimal conversions, divisor listings, and sample variance standard deviation. This serves as a reliable mathematical resource for students, teachers, planners, and field researchers.',
      'All calculations are completed with decimal-precision arithmetic. No figures are logged on external servers, providing a fast and secure environment for all your calculations.'
    ],
    faqs: [
      {
        question: 'What is the difference between percentage change and percentage point change?',
        answer: 'Percentage change measures the relative growth or decline between two values, while percentage point change measures the absolute difference between two percentages (e.g., an increase from 10% to 15% is a 5 percentage point increase, but a 50% relative growth).'
      },
      {
        question: 'How are statistical variance and standard deviation related?',
        answer: 'Variance measures the average squared deviation of data points from their mean. Standard deviation is the square root of the variance, returning the dispersion metric to the original unit scale for easier analysis.'
      },
      {
        question: 'How do ratio division scales convert with total quantities?',
        answer: 'Ratios divide a total quantity into proportional parts. To find the value of each part, divide the total quantity by the sum of all ratio elements, and multiply the result by each individual ratio. (e.g., a 3:5 ratio of 800 divides into 300 and 500).'
      }
    ]
  },
  business: {
    id: 'business',
    seoTitle: 'Business Profit Margin & Retail Markup Calculators | Calculatoora',
    seoHeading: 'Business Profit Margin & Retail Markup Calculators',
    seoSubtitle: 'Analyze corporate profit, break-even unit sales, and retail inventory price lists.',
    paragraphs: [
      'Evaluate your company’s profit margins, wholesale pricing, and break-even points using our business planning tools. Sustainable retail operations depend on healthy margin structures. Compare cost-of-goods-sold (COGS) and operational overhead to find your optimal pricing targets.',
      'Our systems also feature margin-to-markup converters and unit sales volume planners. These allow you to set prices that maximize retail profits while remaining competitive in your market.',
      'Additionally, you can plan initial startup capital costs, calculate cash runways, and project monthly burn rates. Visual charts help you easily identify opportunities to increase business profitability.'
    ],
    faqs: [
      {
        question: 'Why should businesses separate Gross Margin from Net Margin?',
        answer: 'Gross margin only accounts for direct cost of production (COGS) relative to sales, while net margin includes all operating overhead, rent, taxes, and marketing expenses, showing the company’s true final profitability.'
      },
      {
        question: 'How does markup differ from margin in product inventory pricing?',
        answer: 'Markup is the percentage added to the cost price to find the selling price, while margin is the percentage of the selling price that is profit. For example, a $50 cost marked up 100% sells for $100, resulting in a 50% margin.'
      },
      {
        question: 'What factors determine a company’s break-even point?',
        answer: 'The break-even point is determined by monthly fixed costs, unit sales prices, and variable product costs. Lowering fixed costs or variable costs, or increasing the sales price, lowers your break-even point.'
      }
    ]
  },
  science: {
    id: 'science',
    seoTitle: 'Scientific Formulas & Astro Constant Calculators | Calculatoora',
    seoHeading: 'Scientific Formulas & Astro Constant Calculators',
    seoSubtitle: 'Solve physical constants, astronomical calculations, and lab formula solvers.',
    paragraphs: [
      'Access physical constants, astronomical models, and laboratory formula solvers in our scientific pavilion. Precision and accuracy are essential for scientific calculations. Easily convert temperature scales, calculate gravitational forces, and evaluate standard chemistry concentrations.',
      'Our science tools support advanced mathematical models, chemical dilutions, and light wave frequency conversions. This serves as a reliable resource for researchers, students, and lab technicians.',
      'All equations use standard SI metrics and physical constant values, providing accurate and reliable results instantly.'
    ],
    faqs: [
      {
        question: 'What units are used for chemical concentrations?',
        answer: 'Chemistry calculations use standard Molarity (moles of solute per liter of solution) as the primary unit of concentration.'
      },
      {
        question: 'Are cosmic distances calculated using light-years or parsecs?',
        answer: 'Our orbital and astronomical tools support both light-years and parsecs, using standard conversions (1 parsec equals approximately 3.26 light-years).'
      },
      {
        question: 'How are thermal conversions calculated between Kelvin and Celsius?',
        answer: 'These scales are offset by a constant. To convert Celsius to Kelvin, add 273.15 to the Celsius temperature.'
      }
    ]
  },
  programming: {
    id: 'programming',
    seoTitle: 'Developer Subnet & Digital Data Converters | Calculatoora',
    seoHeading: 'Developer Subnet & Digital Data Converters',
    seoSubtitle: 'Calculate CIDR masks, IP host ranges, and digital data sizes on the fly.',
    paragraphs: [
      'Optimize your workflows with our developer-focused networking, base conversion, and data size tools. Network engineering requires precise subnet, host, and numeric base configurations. Easily convert numbers between binary, decimal, and hexadecimal bases.',
      'Our developer suite features advanced IP subnet calculators, CIDR mask planners, and download speed estimators. These help you plan IP allocations and estimate file transfer times with confidence.',
      'Additionally, you can convert digital data units using 1024-byte binary scale increments. All calculations are completed entirely client-side, ensuring complete privacy for your network configurations.'
    ],
    faqs: [
      {
        question: 'Why does 1024 instead of 1000 serve as the base for computer data conversions?',
        answer: 'Computers operate on base-2 (binary) logic. 2 to the 10th power equals 1,024, making it the natural scale for digital memory and data organization.'
      },
      {
        question: 'What host capacities are supported by a standard Class C /24 subnet mask?',
        answer: 'A /24 subnet mask allocation supports 254 usable host IP addresses. The total pool size is 256 addresses, with 2 reserved for the network identifier and broadcast address.'
      },
      {
        question: 'How can I estimate file transfer speeds based on connections?',
        answer: 'Divide the file size in Megabytes by your connection speed in Megabits per second (Mbps). Multiply by 8 to convert from bits to bytes, giving you an accurate estimate of transfer times.'
      }
    ]
  },
  country: {
    id: 'country',
    seoTitle: 'Country-Specific Tax, Salary, & Mortgage Calculators | Calculatoora',
    seoHeading: 'Country-Specific Tax, Salary, & Mortgage Calculators',
    seoSubtitle: 'Analyze regional taxes, net salaries, and regulated mortgages with localized parameters.',
    paragraphs: [
      'Welcome to our dedicated country calculator directory. Many calculators are universal, but tax brackets, sales levies, and home financing compounded structures are highly dependent on local regulations. Here, you will find localized tools designed specifically for the US, UK, Canada, Australia, India, and other major regions.',
      'Our systems incorporate up-to-date tax brackets and banking compounding formulas (like Canadian semi-annual mortage rules). This ensures you get accurate, compliant results for your specific location.',
      'All calculations are completed entirely client-side, keeping your personal financial data completely private and secure.'
    ],
    faqs: [
      {
        question: 'Why are country calculators separated from global tools on Calculatoora?',
        answer: 'Separating localized calculators ensures that general tools (like standard interest or amortization calculators) remain simple and accessible globally, while keeping country-specific tax rules highly accurate and easy to navigate.'
      }
    ]
  },
  legal: {
    id: 'legal',
    seoTitle: 'Statutory Legal Deadline & Contract Date Calculators | Calculatoora',
    seoHeading: 'Statutory Legal Deadline & Contract Date Calculators',
    seoSubtitle: 'Calculate litigation scheduling deadlines, notice periods, and contractual milestones with confidence.',
    paragraphs: [
      'Calculate important legal dates, response filing limits, and contract timeline milestones using our legal planners. Meeting deadlines is essential for successful civil litigation. Easily convert calendar days or court days to plan summons responses and motion schedules.',
      'Our legal tools are designed to help lawyers, legal assistants, and business owners stay organized. Project renewal alert dates, resignation notice periods, and statutory interest damages for defaulted invoices.'
    ],
    faqs: [
      {
        question: 'Is a courtroom day measured differently than calendar days?',
        answer: 'Yes. Court rules often specify "court days" for short response windows, which exclude weekends and judicial holidays. Longer statutory deadlines typically use standard calendar days.'
      }
    ]
  },
  language: {
    id: 'language',
    seoTitle: 'Readability Indices and Typing Speed Calculators | Calculatoora',
    seoHeading: 'Readability Indices and Typing Speed Calculators',
    seoSubtitle: 'Analyze text difficulty metrics, active vocabulary size, and typing speed accuracy.',
    paragraphs: [
      'Evaluate your written copy, assess text readability, and measure typing performance using our language tools. Effective communication depends on clear, accessible writing. Analyze syllable-to-word ratios and sentence structures using standard Flesch-Kincaid and ARI indices.'
    ],
    faqs: [
      {
        question: 'What is a good Flesch-Kincaid readability score for public copy?',
        answer: 'We recommend aiming for a score between 60 and 70 (8th to 9th-grade level) to ensure your writing is highly accessible to general public audiences.'
      }
    ]
  },
  communication: {
    id: 'communication',
    seoTitle: 'Presentation Timers and Speech Length Calculators | Calculatoora',
    seoHeading: 'Presentation Timers and Speech Length Calculators',
    seoSubtitle: 'Project presentation slide timings, speech delivery durations, and corporate meeting costs.',
    paragraphs: [
      'Refine your public speaking and plan your team schedules using our communication calculators. Estimate script delivery durations and structure slide deck timings based on target speaking speeds.',
      'Additionally, you can calculate the true financial and operational cost of business meetings to keep your team\'s schedules streamlined and productive.'
    ],
    faqs: [
      {
        question: 'What is the average human speaking speed for presentations?',
        answer: 'Standard conversational speaking speeds typically range from 120 to 150 words per minute. Professional presenters and public speakers usually target a deliberate rate of 130 words per minute.'
      }
    ]
  },
  'data-science': {
    id: 'data-science',
    seoTitle: 'Machine Learning Train-Split & RAM Capacity Calculators | Calculatoora',
    seoHeading: 'Machine Learning Train-Split & RAM Capacity Calculators',
    seoSubtitle: 'Calculate classification metrics, dataset splitting ratios, and memory footprints on the fly.',
    paragraphs: [
      'Optimize your workflows using our data science and machine learning calculators. Estimate RAM footprints for large datasets based on column types and rows. Solve classification confusion matrices to find Precision, Recall, and F1-Scores.'
    ],
    faqs: [
      {
        question: 'What is the F1-Score?',
        answer: 'The F1-Score is the harmonic mean of precision and recall. It provides a single performance metric that balances both factors, especially on imbalanced datasets.'
      }
    ]
  },
  ai: {
    id: 'ai',
    seoTitle: 'LLM Token Builders & GPU Memory Footprint Calculators | Calculatoora',
    seoHeading: 'LLM Token Builders & GPU Memory Footprint Calculators',
    seoSubtitle: 'Calculate API token costs, model parameter weights, and hardware memory requirements.',
    paragraphs: [
      'Budget and optimize your artificial intelligence applications using our deployment calculators. Convert draft word counts to estimated LLM token lengths. Compare prompt and generation costs across multiple LLM APIs, and calculate GPU VRAM footprint limits.'
    ],
    faqs: [
      {
        question: 'Why does model generation cost more than input processing?',
        answer: 'Input tokens are processed in parallel, while output generation is auto-regressive (generating one token at a time), which requires more GPU compute.'
      }
    ]
  },
  cybersecurity: {
    id: 'cybersecurity',
    seoTitle: 'Password Entropy Checkers and Risk Sizers | Calculatoora',
    seoHeading: 'Password Entropy Checkers and Risk Sizers',
    seoSubtitle: 'Analyze password strength entropy and estimate brute force crack times.',
    paragraphs: [
      'Strengthen your digital security using our cybersecurity analyzers. Calculate password strength entropy in bits to evaluate brute force crack resistance across varied character pools.'
    ],
    faqs: [
      {
        question: 'What is a strong password entropy rating?',
        answer: 'We recommend aiming for at least 80 bits of entropy. Passwords with over 100 bits of entropy are considered exceptionally secure.'
      }
    ]
  },
  gaming: {
    id: 'gaming',
    seoTitle: 'Gaming Level Speed & DPS Simulator Calculators | Calculatoora',
    seoHeading: 'Gaming Level Speed & DPS Simulator Calculators',
    seoSubtitle: 'Simulate character DPS, level progress speeds, and total leveling times.',
    paragraphs: [
      'Optimize your gameplay and plan your speedrun sessions using our gaming calculators. Estimate the experience points (XP) and total playtime required to reach your target level, and simulate character damage output (DPS).'
    ],
    faqs: [
      {
        question: 'Why is DPS more useful than base weapon damage?',
        answer: 'DPS balances raw weapon damage, attack speed, and critical strike multipliers into a single metric that represents your character\'s true damage output over time.'
      }
    ]
  },
  sports: {
    id: 'sports',
    seoTitle: 'Sports Win Percentage & Match Odds Calculators | Calculatoora',
    seoHeading: 'Sports Win Percentage & Match Odds Calculators',
    seoSubtitle: 'Track team win-loss percentages and predict match win probabilities.',
    paragraphs: [
      'Track your team\'s standings and predict competitive match outcomes using our sports analyzers. Calculate seasonal win-loss ratios and estimate win probabilities using the standard Elo rating formula.'
    ],
    faqs: [
      {
        question: 'What is the standard base rating in the Elo system?',
        answer: 'The Elo rating system typically sets a baseline rating of 1500 for chess players and competitive sports teams entering a new league.'
      }
    ]
  },
  food: {
    id: 'food',
    seoTitle: 'Restaurant Menu Cost & Recipe Margin Calculators | Calculatoora',
    seoHeading: 'Restaurant Menu Cost & Recipe Margin Calculators',
    seoSubtitle: 'Calculate recipe portion costs and optimize your restaurant\'s menu pricing.',
    paragraphs: [
      'Manage your restaurant\'s profitability using our food industry business calculators. Cost your recipes, calculate raw ingredient portions, and optimize your menu pricing based on target food cost percentages.'
    ],
    faqs: [
      {
        question: 'What is the standard target food cost percentage for restaurants?',
        answer: 'Most profitable commercial restaurants target a food cost percentage of 25% to 33% to cover operating overhead, rent, and staff payroll.'
      }
    ]
  },
  beauty: {
    id: 'beauty',
    seoTitle: 'Cosmetics Expenses and Styling Budget Planners | Calculatoora',
    seoHeading: 'Cosmetics Expenses and Styling Budget Planners',
    seoSubtitle: 'Track your routines spending and project annual skincare budgets.',
    paragraphs: [
      'Organize your cosmetics spending and styling expenses using our personal care budget trackers. Project your annual skincare, makeup, and salon costs with custom purchase frequencies.'
    ],
    faqs: [
      {
        question: 'How do styling and salon costs scale annually?',
        answer: 'Even infrequent salon visits can add up to high annual costs. Our beauty calculators help you project these routine expenses to keep your personal care spending sustainable.'
      }
    ]
  },
  fashion: {
    id: 'fashion',
    seoTitle: 'International Shoe & Clothing Size Converters | Calculatoora',
    seoHeading: 'International Shoe & Clothing Size Converters',
    seoSubtitle: 'Convert shoe and clothing sizes between US, UK, EU, and Japanese grids.',
    paragraphs: [
      'Translate international size charts and calculate custom fabric yardages using our fashion tools. Convert shoe sizes instantly between US, UK, Europe, and Japan sizing grids.'
    ],
    faqs: [
      {
        question: 'How does Japanese shoe sizing differ from other systems?',
        answer: 'Japan uses actual foot length in centimeters by default. This makes their sizing highly precise and easy to verify compared to traditional imperial systems.'
      }
    ]
  },
  pet: {
    id: 'pet',
    seoTitle: 'Pet Age Human Equivalent & Calorie Calculators | Calculatoora',
    seoHeading: 'Pet Age Human Equivalent & Calorie Calculators',
    seoSubtitle: 'Convert pet ages to human equivalent milestones and calculate daily calories.',
    paragraphs: [
      'Manage your pet\'s wellness using our companion care estimators. Convert your dog or cat\'s chronological age to human biological equivalents, and calculate optimal daily calories.'
    ],
    faqs: [
      {
        question: 'Do larger dog breeds age faster than smaller breeds?',
        answer: 'Yes. Larger dog breeds mature physically more quickly, which places greater wear on their joints and cardiovascular systems over their lifespans.'
      }
    ]
  }
};
