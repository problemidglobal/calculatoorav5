import { Calculator } from '../types';

export const V11_LIFESTYLE_INDUSTRY_CALCULATORS: Calculator[] = [
  // ==================== GAMING ====================
  {
    id: 'gaming-xp-calculator',
    name: 'Gaming XP & Level Progress Calculator',
    slug: 'gaming-xp-calculator',
    category: 'gaming',
    description: 'Calculate experience points (XP) required per level and project game hours needed to reach a target tier.',
    seoTitle: 'Gaming XP Level Progress Estimator | Calculatoora',
    seoDescription: 'Obtain exact XP progression details. Project game play hours based on average XP rewards.',
    inputs: [
      { id: 'currentLvl', label: 'Current Level', type: 'number', defaultValue: 15, step: 1 },
      { id: 'targetLvl', label: 'Target Level', type: 'number', defaultValue: 50, step: 1 },
      { id: 'xpPerActivity', label: 'Average XP per Quest / Match', type: 'number', defaultValue: 1200, step: 100 },
      { id: 'timePerActivity', label: 'Average Duration per Activity (Min)', type: 'number', defaultValue: 20, step: 5 }
    ],
    formula: 'XP For Level (L) = 1000 * L^1.5\nTotal XP needed = Sum(XP for each level from Current to Target)',
    explanation: 'Most RPG games use a power-curve progression formula where each subsequent level requires exponentially more XP. Planning your sessions helps you optimize your leveling speedruns.',
    example: 'Going from Level 15 to 50 requires approximately 1,280,000 XP. At 1,200 XP per 20-minute quest, this takes approximately 1,066 quests, or 355 hours of active play.',
    faq: [
      { question: 'What is a typical gaming XP progression curve?', answer: 'Most games use an exponential power-curve (usually L^1.5 or L^2) to ensure high-level play remains challenging.' }
    ],
    relatedSlugs: ['gaming-xp-calculator'],
    keywords: ['rpg leveling speedrun', 'experience points required', 'target level countdown', 'gameplay session hours'],
    calculate: (inputs) => {
      const cur = Number(inputs.currentLvl || 15);
      const tar = Number(inputs.targetLvl || 50);
      const xpQuest = Number(inputs.xpPerActivity || 1200);
      const timeQuest = Number(inputs.timePerActivity || 20);

      const realTar = Math.max(cur, tar);
      let totalXP = 0;

      // Calculate cumulative XP needed based on level curving: XP(L) = 1000 * L^1.5
      for (let l = cur; l < realTar; l++) {
        totalXP += Math.round(1000 * Math.pow(l, 1.5));
      }

      const quests = xpQuest > 0 ? Math.ceil(totalXP / xpQuest) : 0;
      const totalMins = quests * timeQuest;
      const totalHrs = totalMins / 60;

      return {
        results: [
          { label: 'Total Experience Points (XP) Needed', value: totalXP.toLocaleString(), isPrimary: true },
          { label: 'Required Quests / Matches Count', value: quests.toLocaleString() },
          { label: 'Estimated Playtime Duration Required', value: `${totalHrs.toFixed(1)} hrs` }
        ],
        chartData: [
          { name: 'XP Needed', value: totalXP }
        ]
      };
    }
  },
  {
    id: 'character-damage-simulator',
    name: 'Character Damage & DPS Calculator',
    slug: 'character-damage-simulator',
    category: 'gaming',
    description: 'Calculate character Damage Per Second (DPS) based on attack speed, base weapon damage, and critical strike modifiers.',
    seoTitle: 'Character Damage & DPS Simulator | Calculatoora',
    seoDescription: 'Optimize your character build. Simulates damage per second, crit factors, and physical armor deductions.',
    inputs: [
      { id: 'weaponDmg', label: 'Base Weapon Damage', type: 'number', defaultValue: 140, step: 10 },
      { id: 'atkSpeed', label: 'Attack Speed (Attacks/Sec)', type: 'number', defaultValue: 1.6, step: 0.1 },
      { id: 'critChance', label: 'Critical Strike Chance (%)', type: 'number', defaultValue: 25, min: 0, max: 100, step: 5 },
      { id: 'critDmg', label: 'Critical Damage Multiplier (%)', type: 'number', defaultValue: 200, step: 10 }
    ],
    formula: 'Average Hit = Base Damage * [1 + (Crit Chance / 100) * (Crit Multiplier / 100 - 1)]\nDPS = Average Hit * Attacks per Second',
    explanation: 'In action and role-playing games, item performance is summarized as Damage Per Second (DPS). This metric balances raw weapon damage, attack speed, and critical hit spikes to identify your character\'s true damage output.',
    example: 'A weapon with 140 base damage, attacking 1.6 times per second with a 25% crit chance and 200% crit multiplier, delivers an average hit of 175 and a total of 280.00 DPS.',
    faq: [
      { question: 'Why does attack speed matter for DPS?', answer: 'Faster attack speeds trigger on-hit effects more frequently, raising your overall damage output even with lower base weapon damage.' }
    ],
    relatedSlugs: ['gaming-xp-calculator'],
    keywords: ['character dps builder', 'critical strike multiplier', 'weapon scaling factor', 'combat build stats'],
    calculate: (inputs) => {
      const dmg = Number(inputs.weaponDmg || 140);
      const speed = Number(inputs.atkSpeed || 1.6);
      const critP = Number(inputs.critChance || 25);
      const critMult = Number(inputs.critDmg || 200);

      const critFactor = 1 + (critP / 100) * ((critMult / 100) - 1);
      const avgHit = dmg * critFactor;
      const dps = avgHit * speed;

      return {
        results: [
          { label: 'Calculated Damage Per Second (DPS)', value: dps.toFixed(1), isPrimary: true },
          { label: 'Average Damage of single Hit', value: avgHit.toFixed(1) },
          { label: 'Critical Damage Factor Multiplier', value: critFactor.toFixed(3) }
        ],
        chartData: [
          { name: 'Normal Hit', value: dmg },
          { name: 'Average Hit', value: Math.round(avgHit) }
        ]
      };
    }
  },

  // ==================== SPORTS ANALYTICS ====================
  {
    id: 'sports-win-loss-calculator',
    name: 'Sports Win-Loss Ratio Calculator',
    slug: 'sports-win-loss-calculator',
    category: 'sports',
    description: 'Calculate team win percentages and overall win-loss ratios based on seasonal game histories.',
    seoTitle: 'Sports Win Percentage & W-L Ratio | Calculatoora',
    seoDescription: 'Calculate seasonal sports team standings, win percentages, and overall win-loss ratios.',
    inputs: [
      { id: 'gamesWon', label: 'Games Won count', type: 'number', defaultValue: 42, step: 1 },
      { id: 'gamesLost', label: 'Games Lost count', type: 'number', defaultValue: 28, step: 1 },
      { id: 'gamesTied', label: 'Games Drawn / Tied count', type: 'number', defaultValue: 5, step: 1 }
    ],
    formula: 'Win Ratio = Wins / Losses\nWin Percentage = Wins / (Wins + Losses + Ties) * 100',
    explanation: 'Standing calculations determine division seeds. In standard tournament systems, ties are treated as half-wins to calculate a balanced win percentage.',
    example: 'A sports team with 42 wins, 28 losses, and 5 ties achieves a win-loss ratio of 1.50 and an overall win percentage of 56.00%.',
    faq: [
      { question: 'How are tied games counted in the NHL?', answer: 'The NHL awards two standing points for a win and one point for an overtime or shootout loss to keep seasonal rankings competitive.' }
    ],
    relatedSlugs: ['match-win-probability'],
    keywords: ['team standings tracker', 'win loss ratio stats', 'division seeded percent', 'seasonal tournament points'],
    calculate: (inputs) => {
      const wins = Number(inputs.gamesWon || 42);
      const losses = Number(inputs.gamesLost || 28);
      const ties = Number(inputs.gamesTied || 0);

      const total = wins + losses + ties;
      const wlRatio = losses > 0 ? wins / losses : wins;
      const pct = total > 0 ? (wins / total) * 100 : 0;

      return {
        results: [
          { label: 'Overall Win Percentage', value: pct.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Standing Win-Loss Ratio', value: wlRatio.toFixed(2) },
          { label: 'Total Career Games Played', value: total }
        ],
        chartData: [
          { name: 'Wins', value: wins, color: '#10b981' },
          { name: 'Losses', value: losses, color: '#ef4444' },
          { name: 'Ties', value: ties, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'match-win-probability',
    name: 'Match Win Probability Calculator',
    slug: 'match-win-probability',
    category: 'sports',
    description: 'Predict match win probabilities using the standard Elo rating formula.',
    seoTitle: 'Sports Match Win Probability with Elo | Calculatoora',
    seoDescription: 'Predict win percentages for competitive team sports based on Elo and power ranking differences.',
    inputs: [
      { id: 'teamARating', label: 'Team A (Your Team) Rating', type: 'number', defaultValue: 1650, step: 25 },
      { id: 'teamBRating', label: 'Team B (Opponent Team) Rating', type: 'number', defaultValue: 1520, step: 25 }
    ],
    formula: 'Probability A = 1 / [1 + 10^(RatingB - RatingA) / 400]',
    explanation: 'The Elo rating system predicts head-to-head match outcomes. The probability of winning increases exponentially with the rating gap between the two teams.',
    example: 'A team rated 1650 playing an opponent rated 1520 has approximately a 67.90% chance of winning the match.',
    faq: [
      { question: 'What is a typical default Elo rating?', answer: 'Competitive Chess and FIFA leagues usually set a default rating of 1500 for new players entering the system.' }
    ],
    relatedSlugs: ['sports-win-loss-calculator'],
    keywords: ['match prediction database', 'elo formula ratings', 'win rate probability chess', 'team comparison odds'],
    calculate: (inputs) => {
      const ratingA = Number(inputs.teamARating || 1650);
      const ratingB = Number(inputs.teamBRating || 1520);

      const probA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
      const probB = 1 - probA;

      return {
        results: [
          { label: 'Team A Win Probability', value: (probA * 100).toFixed(1), unit: '%', isPrimary: true },
          { label: 'Team B Win Probability', value: (probB * 100).toFixed(1), unit: '%' },
          { label: 'Point Rating Spread', value: Math.abs(ratingA - ratingB) }
        ],
        chartData: [
          { name: 'Team A Odds', value: Math.round(probA * 100), color: '#3b82f6' },
          { name: 'Team B Odds', value: Math.round(probB * 100), color: '#ef4444' }
        ]
      };
    }
  },

  // ==================== FOOD INDUSTRY ====================
  {
    id: 'recipe-cost-calculator',
    name: 'Recipe Cost Sheet Calculator',
    slug: 'recipe-cost-calculator',
    category: 'food',
    description: 'Calculate total recipe ingredient expenses, portion costs, and suggested menu prices based on targeted food cost percentages.',
    seoTitle: 'Recipe Ingredient Cost Calculator | Calculatoora',
    seoDescription: 'Calculate food costs and adjust portions to optimize your restaurant\'s menu pricing indices.',
    inputs: [
      { id: 'rawMaterialsCost', label: 'Raw Ingredients Total Cost ($)', type: 'number', defaultValue: 14.5, step: 0.5 },
      { id: 'yieldPortions', label: 'Recipe Yield Portions', type: 'number', defaultValue: 4, min: 1, max: 100, step: 1 },
      { id: 'targetFoodCostPct', label: 'Target Food Cost (%)', type: 'number', defaultValue: 28, min: 10, max: 60, step: 1 }
    ],
    formula: 'Cost per Portion = Raw Cost / Yield\nSuggested Retail Price = Cost per Portion / (Target Cost % / 100)',
    explanation: 'Managing food costs is essential for restaurant profitability. To keep your menu prices sustainable, aim to keep raw ingredient costs below 30% of the retail price.',
    example: 'A recipe costing $14.50 that yields 4 portions has a portion cost of $3.63. With a 28% target food cost, the suggested menu price is $12.95 per portion.',
    faq: [
      { question: 'What is a typical restaurant food cost percentage?', answer: 'Most profitable commercial restaurants target a food cost percentage of 25% to 33% to cover operating overhead and rent.' }
    ],
    relatedSlugs: ['recipe-cost-calculator'],
    keywords: ['recipe costing sheets', 'menu price optimization', 'portion price calculations', 'food wholesale cost'],
    calculate: (inputs) => {
      const raw = Number(inputs.rawMaterialsCost || 14.5);
      const portions = Number(inputs.yieldPortions || 4);
      const pct = Number(inputs.targetFoodCostPct || 28);

      const costPerPortion = portions > 0 ? raw / portions : 0;
      const suggestedPrice = pct > 0 ? costPerPortion / (pct / 100) : 0;
      const profitMarginPerPortion = suggestedPrice - costPerPortion;

      return {
        results: [
          { label: 'Suggested Menu Price per portion', value: suggestedPrice.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Ingredient Cost per portion', value: costPerPortion.toFixed(2), unit: '$' },
          { label: 'Profit Margin per serving', value: profitMarginPerPortion.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Cost', value: Math.round(costPerPortion * 100) / 100, color: '#ef4444' },
          { name: 'Gross Margin', value: Math.round(profitMarginPerPortion * 100) / 100, color: '#10b981' }
        ]
      };
    }
  },

  // ==================== BEAUTY & PERSONAL CARE ====================
  {
    id: 'beauty-budget-calculator',
    name: 'Cosmetics & Beauty Budget Tracker',
    slug: 'beauty-budget-calculator',
    category: 'beauty',
    description: 'Track and project your annual cosmetics, skincare, and beauty expenses based on purchase frequencies.',
    seoTitle: 'Annual Skincare & Cosmetics Budget | Calculatoora',
    seoDescription: 'Tally your cosmetics and beauty care spending to keep your personal styling expenses sustainable.',
    inputs: [
      { id: 'skincareMonthly', label: 'Monthly Skincare Products ($)', type: 'number', defaultValue: 45, step: 5 },
      { id: 'makeupQuarterly', label: 'Quarterly Makeup Purchases ($)', type: 'number', defaultValue: 120, step: 10 },
      { id: 'hairSalonTrip', label: 'Average Salon Visit Cost ($)', type: 'number', defaultValue: 90, step: 10 },
      { id: 'salonTripsYearly', label: 'Salon Visits per Year', type: 'number', defaultValue: 6, step: 1 }
    ],
    formula: 'Annual Budget = (Skincare * 12) + (Makeup * 4) + (Salon Cost * Salon Visits)',
    explanation: 'Skincare, makeup, and salon visits can quietly add up to high annual expenses. Tracking these routine purchases helps you organize your stylings within a sustainable personal budget.',
    example: 'Spending $45 monthly on skincare, $120 quarterly on makeup, and $90 on 6 salon visits results in an annual beauty care budget of $1,560.',
    faq: [
      { question: 'What is the standard standard makeup shelf-life?', answer: 'Most cosmetic products should be replaced periodically. Liquid foundations typically last 12 months, while powder shadows are safe to use for up to 2 years.' }
    ],
    relatedSlugs: ['beauty-budget-calculator'],
    keywords: ['beauty budget planner', 'cosmetic annual cost', 'skincare routine budget', 'salon visit savings'],
    calculate: (inputs) => {
      const skin = Number(inputs.skincareMonthly || 45);
      const makeup = Number(inputs.makeupQuarterly || 120);
      const salon = Number(inputs.hairSalonTrip || 90);
      const trips = Number(inputs.salonTripsYearly || 6);

      const yrSkin = skin * 12;
      const yrMakeup = makeup * 4;
      const yrSalon = salon * trips;
      const annualTotal = yrSkin + yrMakeup + yrSalon;

      return {
        results: [
          { label: 'Annual Beauty Care Budget', value: annualTotal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Average Monthly Styling equivalent', value: (annualTotal / 12).toFixed(2), unit: '$' },
          { label: 'Yearly Salon Expenses Portion', value: yrSalon.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Skincare', value: yrSkin },
          { name: 'Makeup', value: yrMakeup },
          { name: 'Salon visits', value: yrSalon }
        ]
      };
    }
  },

  // ==================== FASHION ====================
  {
    id: 'shoe-size-converter',
    name: 'International Shoe Size Converter',
    slug: 'shoe-size-converter',
    category: 'fashion',
    description: 'Convert shoe sizes between US, UK, EU, and Japanese international measurement grids.',
    seoTitle: 'International Shoe Size Conversion Grids | Calculatoora',
    seoDescription: 'Instantly convert shoe sizing grids between standard US, UK, Europe, and Japan sizing levels.',
    inputs: [
      { id: 'genderSystem', label: 'Sizing Department', type: 'select', defaultValue: 'mens', options: [
        { label: 'Men\'s Department', value: 'mens' },
        { label: 'Women\'s Department', value: 'womens' }
      ]},
      { id: 'usSize', label: 'US Department Size Rating', type: 'number', defaultValue: 9, min: 4, max: 15, step: 0.5 }
    ],
    formula: 'Calculates equivalent sizes using standard physical dimensions conversion offsets.',
    explanation: 'Shoe sizing standards vary significantly by region. EU sizes use a metric-based "Paris Point" system, while US and UK sizes depend on historical barleycorn measurements.',
    example: 'A US Men\'s size 9 on the international conversion grids corresponds to a UK size 8.5, an EU size 42, and a Japanese size of 27.0 cm.',
    faq: [
      { question: 'Why is Japanese shoe sizing unique?', answer: 'Japan uses actual foot length in centimeters by default. This makes their sizing highly precise and easy to verify.' }
    ],
    relatedSlugs: ['shoe-size-converter'],
    keywords: ['shoe sizing conversions US UK', 'metric shoe sizes Europe', 'japan shoe centimeters', 'international shoe converter'],
    calculate: (inputs) => {
      const isMens = inputs.genderSystem === 'mens';
      const us = Number(inputs.usSize || 9);

      let eu = 42;
      let uk = 8.5;
      let jp = 27;

      if (isMens) {
        uk = us - 0.5;
        eu = Math.round(us + 33);
        jp = Math.round((us + 18) * 10) / 10;
      } else {
        uk = us - 2;
        eu = Math.round(us + 31);
        jp = Math.round((us + 17) * 10) / 10;
      }

      return {
        results: [
          { label: 'Equivalent European EU Size', value: eu, isPrimary: true },
          { label: 'Equivalent United Kingdom UK Size', value: uk },
          { label: 'Equivalent Japanese JP Size', value: `${jp} cm` }
        ]
      };
    }
  },

  // ==================== PET CARE ====================
  {
    id: 'pet-age-calculator',
    name: 'Pet Age Human Equivalent Calculator',
    slug: 'pet-age-calculator',
    category: 'pet',
    description: 'Convert your dog or cat\'s age into equivalent human biological age milestones.',
    seoTitle: 'Dog & Cat Age Human equivalent | Calculatoora',
    seoDescription: 'Instantly convert your pet\'s age to human years using standard veterinary development curves.',
    inputs: [
      { id: 'animalBreed', label: 'Companion Class Typology', type: 'select', defaultValue: 'dog_mid', options: [
        { label: 'Dog (Medium Breed - 20 to 50 lbs)', value: 'dog_mid' },
        { label: 'Dog (Small Breed - < 20 lbs)', value: 'dog_small' },
        { label: 'Dog (Large Breed - > 50 lbs)', value: 'dog_large' },
        { label: 'Feline (Standard Domestic Cat)', value: 'cat' }
      ]},
      { id: 'chronologicalYears', label: 'Real Calendar Age (Years)', type: 'number', defaultValue: 4, min: 1, max: 22, step: 1 }
    ],
    formula: 'First Year = 15 human years; Second Year = 9 human years; Each subsequent year = 4-5 human years depending on breed size.',
    explanation: 'The classic "one dog year equals seven human years" is a myth. Animals develop rapidly during their first two calendar years, reaching the biological equivalent of late adolescence before their physical aging process plateaus.',
    example: 'A medium-breed dog at 4 calendar years of age has reached the biological equivalent of approximately 32 human years.',
    faq: [
      { question: 'Why do larger dogs age faster than small breeds?', answer: 'Large dog breeds mature more quickly physically, which places greater wear on their joints and cardiovascular systems over their lifespans.' }
    ],
    relatedSlugs: ['pet-age-calculator'],
    keywords: ['veterinary age equivalents', 'dog year human converter', 'cat age curves', 'companion life milestones'],
    calculate: (inputs) => {
      const type = inputs.animalBreed || 'dog_mid';
      const age = Number(inputs.chronologicalYears || 4);

      let hYears = 15;
      if (age > 1) {
        hYears += 9;
      }
      if (age > 2) {
        const factor = type === 'dog_large' ? 7 : type === 'dog_small' || type === 'cat' ? 4 : 5;
        hYears += (age - 2) * factor;
      }

      return {
        results: [
          { label: 'Equivalent Human Biological Age', value: `${hYears} Years`, isPrimary: true },
          { label: 'Pet Milestones Class', value: hYears >= 55 ? 'Senior' : hYears >= 30 ? 'Fully Mature Adult' : 'Junior Adolescent' }
        ]
      };
    }
  }
];
