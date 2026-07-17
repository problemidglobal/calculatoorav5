import { Calculator } from '../types';

export const V15_LAW_EVENTS_TRADES_CALCULATORS: Calculator[] = [
  // LAW & DOCUMENTS (Category: 'legal')
  {
    id: 'v15-child-support',
    name: 'Child Support Calculator',
    slug: 'v15-child-support-calculator',
    category: 'legal',
    description: 'Calculate baseline monthly child support obligations based on standard income ratios and custody splits.',
    seoTitle: 'Family Law Child Support Obligation Calculator',
    seoDescription: 'Find baseline child support requirements. Input incomes and custody splits based on standard family law guidelines.',
    inputs: [
      { id: 'grossIncomeA', label: 'Monthly Income Parent A ($)', type: 'number', defaultValue: 5500 },
      { id: 'grossIncomeB', label: 'Monthly Income Parent B ($)', type: 'number', defaultValue: 3500 },
      { id: 'childCount', label: 'Number of Children', type: 'number', defaultValue: 2 },
      { id: 'custodySplit', label: 'Parent A Custody Share (%)', type: 'number', defaultValue: 60 }
    ],
    formula: 'Joint Support Need = Total Income * Children Rate multiplier (approx 16% for 1, 24% for 2)\nSupport Share = Joint Support Need * Share of Income',
    explanation: 'Standard child support models use the income shares approach, calculating a joint household support requirement and splitting it in proportion to each parent\'s income.',
    example: 'Parent A with $5,500 and Parent B with $3,500 monthly income supporting 2 children with parent A retaining 60% custody yields an estimated monthly support payment of $672 from Parent A to Parent B.',
    faq: [
      { question: 'What is the income shares model?', answer: 'A child support calculation methodology that estimates what parents would spend on their children if they remained in a single household.' },
      { question: 'Does child support cover school fees?', answer: 'Basic support covers food, shelter, clothing, and normal school expenses. Private schooling or health insurance is typically divided separately.' }
    ],
    relatedSlugs: ['v15-legal-fees-calculator', 'v15-divorce-settlement-calculator'],
    calculate: (inputs) => {
      const incA = Number(inputs.grossIncomeA || 1000);
      const incB = Number(inputs.grossIncomeB || 1000);
      const kids = Number(inputs.childCount || 1);
      const splitA = Number(inputs.custodySplit || 50) / 100;

      const totalInc = incA + incB;
      // standard guideline multiplier
      const multiplier = kids === 1 ? 0.16 : kids === 2 ? 0.24 : kids === 3 ? 0.29 : 0.33;
      const basicNeed = totalInc * multiplier;

      const shareA = totalInc > 0 ? (incA / totalInc) * basicNeed : 0;
      const shareB = totalInc > 0 ? (incB / totalInc) * basicNeed : 0;

      // support adjustments based on custody offsets
      let finalSupport = 0;
      let payor = 'None';
      if (shareA * (1 - splitA) > shareB * splitA) {
        finalSupport = shareA * (1 - splitA) - shareB * splitA;
        payor = 'Parent A to Parent B';
      } else {
        finalSupport = shareB * splitA - shareA * (1 - splitA);
        payor = 'Parent B to Parent A';
      }

      return {
        results: [
          { label: 'Estimated Monthly Support Payment', value: `$${Math.round(finalSupport).toLocaleString()}`, isPrimary: true },
          { label: 'Calculated Payor Parent', value: payor },
          { label: 'Estimated Joint Childcare Needs', value: `$${Math.round(basicNeed).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Parent A share', value: Math.round(shareA) },
          { name: 'Parent B share', value: Math.round(shareB) }
        ]
      };
    }
  },
  {
    id: 'v15-legal-fees',
    name: 'Legal Fees Calculator',
    slug: 'v15-legal-fees-calculator',
    category: 'legal',
    description: 'Calculate approximate legal expenses and retainer balances based on attorney hourly rates and billed increments.',
    seoTitle: 'Hourly Attorney Fees & Retainer Calculator',
    seoDescription: 'Find estimated law fees. Input attorney hourly rates and expected active research hours to model budget requirements.',
    inputs: [
      { id: 'attorneyHourly', label: 'Attorney Hourly Rate ($ / Hr)', type: 'number', defaultValue: 350 },
      { id: 'estimatedHours', label: 'Expected Total Billed Hours', type: 'number', defaultValue: 25 },
      { id: 'filingCourtsFee', label: 'Court & Administrative Filing Fees ($)', type: 'number', defaultValue: 450 }
    ],
    formula: 'Total Legal Fee = (Hourly Rate * Billed Hours) + Filing Fees',
    explanation: 'Attorneys typically bill their time in 6-minute (0.1 hour) increments, drafting retainers and tracking legal costs dynamically.',
    example: 'A lawyer billing at $350 per hour for 25 hours with $450 in court filing fees totals exactly $9,200 in overall legal expenses.',
    faq: [
      { question: 'What is a legal retainer?', answer: 'An upfront deposit paid to reserve an attorney\'s services. The lawyer bills their hourly work against this balance as tasks are completed.' },
      { question: 'Why are lawyers charging in 6-minute increments?', answer: 'This is the standard billing increment in law practices, keeping time tracking precise and standardized.' }
    ],
    relatedSlugs: ['v15-child-support-calculator', 'v15-nda-protection-calculator'],
    calculate: (inputs) => {
      const rate = Number(inputs.attorneyHourly || 100);
      const hrs = Number(inputs.estimatedHours || 1);
      const court = Number(inputs.filingCourtsFee || 0);

      const subtotal = rate * hrs;
      const total = subtotal + court;

      return {
        results: [
          { label: 'Estimated Overall Legal cost', value: `$${total.toLocaleString()}`, isPrimary: true },
          { label: 'Attorney service subtotal', value: `$${subtotal.toLocaleString()}` },
          { label: 'Recommended retainer deposit', value: `$${Math.round(total * 0.5).toLocaleString()} (50% upfront standard)` }
        ],
        chartData: [
          { name: 'Attorney Services', value: subtotal },
          { name: 'Admin Fees', value: court }
        ]
      };
    }
  },
  {
    id: 'v15-divorce-settlement',
    name: 'Divorce Settlement Calculator',
    slug: 'v15-divorce-settlement-calculator',
    category: 'legal',
    description: 'Calculate asset distributions splits and compensation requirements during a divorce settlement.',
    seoTitle: 'Family Law Divorce Asset Split Solver',
    seoDescription: 'Allocate divorce settlement assets. Split joint homes, investments, and debts fairly between spouses.',
    inputs: [
      { id: 'maritalAssetVal', label: 'Joint Net Assets (Home, Savings, Investments) ($)', type: 'number', defaultValue: 750000 },
      { id: 'targetSplitA', label: 'Target Allocation Percent Spouse A (%)', type: 'number', defaultValue: 50 },
      { id: 'separateAssetA', label: 'Spouse A Sole Pre-Marital Assets ($)', type: 'number', defaultValue: 120000 }
    ],
    formula: 'Share A = Separate Assets A + (Marital Assets * Split A %)\nEqual split applies to joint assets.',
    explanation: 'Divorce laws evaluate assets as marital (jointly owned physical or financial items acquired during marriage) or separate (assets owned before the marriage).',
    example: 'Spouse A with $120,000 in separate assets, splitting a $750,000 joint marital asset pool at 50% receives $495,000 in overall assets.',
    faq: [
      { question: 'What represents an equitable distribution?', answer: 'In non-community property states, marital assets are divided "fairly" based on spouses\' financial needs and contributions, which may not be exactly 50/50.' },
      { question: 'Are pre-marital assets always safe?', answer: 'Separate assets remain separate unless they are commingled, such as depositing pre-marital funds into a joint bank account.' }
    ],
    relatedSlugs: ['v15-child-support-calculator', 'v15-inheritance-calculator'],
    calculate: (inputs) => {
      const marital = Number(inputs.maritalAssetVal || 0);
      const splitA = Number(inputs.targetSplitA || 50) / 100;
      const sepA = Number(inputs.separateAssetA || 0);

      const netSpouseA = sepA + (marital * splitA);
      const netSpouseB = marital * (1 - splitA);

      return {
        results: [
          { label: 'Spouse A Combined Assets Share', value: `$${Math.round(netSpouseA).toLocaleString()}`, isPrimary: true },
          { label: 'Spouse B Combined Assets Share', value: `$${Math.round(netSpouseB).toLocaleString()}`, isPrimary: true },
          { label: 'Marital asset Pool split portion', value: `$${Math.round(marital * splitA).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Spouse A Total', value: Math.round(netSpouseA) },
          { name: 'Spouse B Total', value: Math.round(netSpouseB) }
        ]
      };
    }
  },
  {
    id: 'v15-inheritance',
    name: 'Estate & Inheritance Calculator',
    slug: 'v15-inheritance-calculator',
    category: 'legal',
    description: 'Calculate expected estate distributions and inheritance tax rates based on federal and state guidelines.',
    seoTitle: 'Family Law Estate & Inheritance Tax Solver',
    seoDescription: 'Estime estate planning taxes and heir portions. Calculate tax liability thresholds and tax percentages.',
    inputs: [
      { id: 'totalEstateValue', label: 'Overall Estate Valuation ($)', type: 'number', defaultValue: 1500000 },
      { id: 'heirCountLimit', label: 'Number of Named Beneficiaries', type: 'number', defaultValue: 3 },
      { id: 'estateTaxExemption', label: 'State Estate Tax Exclusion Limit ($)', type: 'number', defaultValue: 1000000 }
    ],
    formula: 'Taxable estate = Max(0, estate - exclusion)\nInherit share = (Valuation - Tax) / Heirs',
    explanation: 'This calculator targets local estate exclusion rules, estimating the net funds distributed to heirs after any applicable estate taxes are paid.',
    example: 'An estate valued at $1,500,000 with a $1,000,000 tax exclusion is subject to tax on $500,000. At a 10% tax rate, each of the 3 heirs receives a net inheritance of $483,333.',
    faq: [
      { question: 'What is the federal estate tax threshold?', answer: 'The federal estate tax exemption is high (over $13 million), but many states apply their own inheritance taxes starting much lower.' },
      { question: 'Why does estate planning matter?', answer: 'Early estate planning allows you to set up trusts and lifetime gifts, reducing overall tax exposure for your beneficiaries.' }
    ],
    relatedSlugs: ['v15-divorce-settlement-calculator', 'v15-nda-protection-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.totalEstateValue || 0);
      const heirs = Number(inputs.heirCountLimit || 1);
      const exclusion = Number(inputs.estateTaxExemption || 1000000);

      const taxableAmt = Math.max(0, val - exclusion);
      // estimated combined rate standard for threshold states
      const taxRate = 0.12;
      const taxPaid = taxableAmt * taxRate;
      const netEstate = val - taxPaid;
      const sharePerHeir = heirs > 0 ? netEstate / heirs : 0;

      return {
        results: [
          { label: 'Net Inheritance per Named Heir', value: `$${Math.round(sharePerHeir).toLocaleString()}`, isPrimary: true },
          { label: 'Estimated Estate Tax Paid', value: `$${Math.round(taxPaid).toLocaleString()} (approximate)` },
          { label: 'Overall Net Inherit Pool', value: `$${Math.round(netEstate).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Distributed to Heirs', value: Math.round(netEstate) },
          { name: 'Paid in estate tax', value: Math.round(taxPaid) }
        ]
      };
    }
  },
  {
    id: 'v15-nda-protection',
    name: 'NDA Protection Expense Calculator',
    slug: 'v15-nda-protection-calculator',
    category: 'legal',
    description: 'Calculate recommended damage remedies and legal protective values when drafting Non-Disclosure Agreements.',
    seoTitle: 'NDA Protective Value & Liquidated Damages Solver',
    seoDescription: 'Find reasonable liquidated damages for NDAs. Balance intellectual property valuation to justify legal safeguards.',
    inputs: [
      { id: 'proprietaryTechVal', label: 'Estimated Value of Secret Technology ($)', type: 'number', defaultValue: 450000 },
      { id: 'expectedBreachImpact', label: 'Potential Impact of Information Leak (%)', type: 'number', defaultValue: 35 }
    ],
    formula: 'Liquidated Damages (Recommended) = Secret Value * Impact Ratio',
    explanation: 'When drafting NDAs, specifying "liquidated damages" helps establish a clear, court-supported remedy if a breach of confidentiality occurs.',
    example: 'An NDA protecting a $450,000 technology with a potential 35% breach impact should specify a liquidated damages clause of approximately $157,500.',
    faq: [
      { question: 'What are liquidated damages in an NDA?', answer: 'A predetermined cash remedy agreed upon by both parties to settle damages if a confidentiality breach occurs.' },
      { question: 'How can we ensure our NDA is enforceable?', answer: 'Make sure your liquidated damages are reasonable estimates of actual harm rather than arbitrary punitive penalties, which courts may strike down.' }
    ],
    relatedSlugs: ['v15-legal-fees-calculator', 'v15-inheritance-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.proprietaryTechVal || 10000);
      const pct = Number(inputs.expectedBreachImpact || 10) / 100;

      const recommendedRemedy = val * pct;

      return {
        results: [
          { label: 'Recommended Liquidated Damages', value: `$${Math.round(recommendedRemedy).toLocaleString()}`, isPrimary: true },
          { label: 'Enforceability Risk Rating', value: pct > 0.65 ? 'High Risk (Courts may reject excessive penalties)' : 'Reasonable (Highly enforceable)' },
          { label: 'Maximum Intellectual Property Cover', value: `$${val.toLocaleString()}` }
        ],
        chartData: [
          { name: 'NDA Liquidated Damages', value: Math.round(recommendedRemedy) }
        ]
      };
    }
  },

  // EVENT MANAGEMENT (Category: 'events')
  {
    id: 'v15-catering-food',
    name: 'Catering Food Calculator',
    slug: 'v15-catering-food-calculator',
    category: 'events',
    description: 'Calculate the total amount of food required for catering an event based on guest counts and menu courses.',
    seoTitle: 'Event Catering Food Quantity Calculator',
    seoDescription: 'Calculate required catering food. Input guest counts and dining styles to estimate main courses and side dish portions.',
    inputs: [
      { id: 'cateringGuests', label: 'Expected Guest Count', type: 'number', defaultValue: 120 },
      { id: 'mealTypeRatio', label: 'Catering Menu Style', type: 'select', defaultValue: 'buffet', options: [
        { label: 'Buffet Style: Multi-option (High portion density)', value: 'buffet' },
        { label: 'Plated Dinner: Controlled portions (Standard)', value: 'plated' }
      ]}
    ],
    formula: 'Appetizers = Guest Count * 6\nProtein Required (Pounds) = Guest Count * 0.45',
    explanation: 'Sizing catering portions accurately ensures your guests are well-fed while preventing unnecessary food waste and costs.',
    example: 'Catering a buffet-style dinner for 120 guests requires approximately 60 pounds of protein and exactly 720 individual appetizers.',
    faq: [
      { question: 'How many appetizers should I estimate per guest?', answer: 'Plan 4 to 6 appetizers per person for pre-dinner cocktail hours, and 10 to 12 per person for appetizer-only events.' },
      { question: 'Is it better to round up food proportions?', answer: 'Yes! Always round up your food estimates by 5% to 10% to accommodate unexpected guests or larger appetite preferences.' }
    ],
    relatedSlugs: ['v15-drink-beverage-calculator', 'v15-event-seating-calculator'],
    calculate: (inputs) => {
      const guests = Number(inputs.cateringGuests || 10);
      const meal = String(inputs.mealTypeRatio || 'buffet');

      const multiplier = meal === 'buffet' ? 0.5 : 0.4;
      const proteinLbs = guests * multiplier;
      const appsCount = guests * 6;
      const sidesLbs = guests * 0.35;

      return {
        results: [
          { label: 'Required Protein (Beef, Chicken, Vegetarian)', value: `${proteinLbs.toFixed(1)} Pounds`, isPrimary: true },
          { label: 'Total Appetizer Units needed', value: `${appsCount} Appetizers` },
          { label: 'Required Side Dishes weight', value: `${sidesLbs.toFixed(1)} Pounds` }
        ],
        chartData: [
          { name: 'Protein (Lbs)', value: Math.round(proteinLbs) },
          { name: 'Side Dishes (Lbs)', value: Math.round(sidesLbs) }
        ]
      };
    }
  },
  {
    id: 'v15-drink-beverage',
    name: 'Event Drink & Beverage Calculator',
    slug: 'v15-drink-beverage-calculator',
    category: 'events',
    description: 'Calculate beverage volumes, wine bottles, and soft drink crates for events based on party hours.',
    seoTitle: 'Party Beverage & Wine Bottles Solver',
    seoDescription: 'Find party drink and beverage needs. Input guest counts and event hours to estimate wine, beer, and soft drink orders.',
    inputs: [
      { id: 'beverageGuests', label: 'Expected Guest Count', type: 'number', defaultValue: 150 },
      { id: 'partyDurationHours', label: 'Party Duration (Hours)', type: 'number', defaultValue: 4 },
      { id: 'alcoholTypeSplit', label: 'Alcohol Menu Level', type: 'select', defaultValue: 'beer-wine', options: [
        { label: 'Beer, Wine, and Soft Drinks only', value: 'beer-wine' },
        { label: 'Full Premium open open bar', value: 'full-open' }
      ]}
    ],
    formula: 'Total Servings = Guests * ((Duration * 1.2 drinks) + 1)',
    explanation: 'Event planners assume guests consume an average of 2 drinks during the first hour and 1 drink per hour thereafter.',
    example: 'Hosting a 150-guest party lasting 4 hours requires approximately 870 total servings, equivalent to 70 wine bottles and 12 crates of beer.',
    faq: [
      { question: 'How many glasses of wine are in a bottle?', answer: 'A standard 750ml bottle of wine provides exactly 5 pours of 5 ounces each.' },
      { question: 'What is a typical beverage split for open bars?', answer: 'A standard drink budget allocation: 40% beer, 35% wine, and 25% liquor or soft drinks.' }
    ],
    relatedSlugs: ['v15-catering-food-calculator', 'v15-event-seating-calculator'],
    calculate: (inputs) => {
      const guests = Number(inputs.beverageGuests || 10);
      const hours = Number(inputs.partyDurationHours || 3);
      const split = String(inputs.alcoholTypeSplit || 'beer-wine');

      const totalServings = guests * (1 + (hours * 1.1));
      const wineBottles = (totalServings * 0.35) / 5; // 35% wine, 5 glasses per bottle
      const beerCans = totalServings * 0.40; // 40% beer standard
      const softDrinks = totalServings * 0.25; // 25% non-alcoholic or mixers

      return {
        results: [
          { label: 'Recommended Total Drink Servings', value: `${Math.round(totalServings)} Servings`, isPrimary: true },
          { label: 'Standard Wine Bottles Needed', value: `${Math.ceil(wineBottles)} Bottles (750ml)` },
          { label: 'Beer Cans / Craft Bottles Required', value: `${Math.ceil(beerCans)} Units` },
          { label: 'Soft Drinks & Water portions', value: `${Math.ceil(softDrinks)} Portions` }
        ],
        chartData: [
          { name: 'Wine Glasses', value: Math.round(wineBottles * 5) },
          { name: 'Beer Servings', value: Math.round(beerCans) },
          { name: 'Soft Drinks', value: Math.round(softDrinks) }
        ]
      };
    }
  },
  {
    id: 'v15-event-seating',
    name: 'Event Seating Area Calculator',
    slug: 'v15-event-seating-calculator',
    category: 'events',
    description: 'Calculate and plan required room square footage based on guest counts and table styles.',
    seoTitle: 'Event Venue Seating & Floor Area Planner',
    seoDescription: 'Find room square footage for events. Input target guest counts and table spacing to plan safe room seating.',
    inputs: [
      { id: 'layoutGuests', label: 'Expected Seating Guests', type: 'number', defaultValue: 100 },
      { id: 'seatingLayoutType', label: 'Table & Seating Layout Style', type: 'select', defaultValue: 'banquet', options: [
        { label: 'Banquet Style: 60" Round Tables (12 sq ft / guest)', value: 'banquet' },
        { label: 'Theater Style: Rows of Chairs (6 sq ft / guest)', value: 'theater' },
        { label: 'Classroom Style: Rectangular Desk tables (15 sq ft / guest)', value: 'classroom' }
      ]}
    ],
    formula: 'Area Required (Sq Ft) = Guest Count * Layout space multiplier',
    explanation: 'Calculating floor space ensures your venue can accommodate your guests comfortably while meeting local fire safety exit requirements.',
    example: 'Seating 100 guests banquet-style around round tables requires a minimum venue space of 1,200 square feet.',
    faq: [
      { question: 'Why does banquet seating require more space?', answer: 'Round tables require significant clearance for chair backing, waiter paths, and comfortable guest movement.' },
      { question: 'Should I budget separate space for a dance screen?', answer: 'Yes! Add an extra 3 to 5 square feet per dancing guest when sizing your event dance floor.' }
    ],
    relatedSlugs: ['v15-catering-food-calculator', 'v15-event-budget-calculator'],
    calculate: (inputs) => {
      const guests = Number(inputs.layoutGuests || 10);
      const layout = String(inputs.seatingLayoutType || 'banquet');

      const multiplier = layout === 'banquet' ? 12 : layout === 'theater' ? 6 : 15;
      const areaSqFt = guests * multiplier;
      const areaSqM = areaSqFt / 10.764; // convert to square meters

      return {
        results: [
          { label: 'Minimum Required Venue Floor Area', value: `${Math.ceil(areaSqFt).toLocaleString()} Sq. Feet`, isPrimary: true },
          { label: 'Metric Floor Space representation', value: `${areaSqM.toFixed(1)} Square Meters (sq. m)` },
          { label: 'Recommended Number of Round Tables', value: `${Math.ceil(guests / 8)} Tables (assuming 8 guests per table)` }
        ],
        chartData: [
          { name: 'Core Seating Space', value: Math.ceil(areaSqFt) },
          { name: 'Exit safety paths', value: Math.round(areaSqFt * 0.15) }
        ]
      };
    }
  },
  {
    id: 'v15-event-budget',
    name: 'Event Budget Calculator',
    slug: 'v15-event-budget-calculator',
    category: 'events',
    description: 'Track and balance your corporate event or wedding expenses across standard vendor segments.',
    seoTitle: 'Wedding & Social Event Budget Solver',
    seoDescription: 'Manage your event budget. Balance venue hire, catering costs, and emergency buffers to stay on budget.',
    inputs: [
      { id: 'maximumTotalBudget', label: 'Maximum Overall Event Budget ($)', type: 'number', defaultValue: 25000 },
      { id: 'venueCateringPct', label: 'Venue & Catering share (%)', type: 'number', defaultValue: 45 },
      { id: 'decorEntertainmentPct', label: 'Entertainment & Decor share (%)', type: 'number', defaultValue: 35 }
    ],
    formula: 'Category Budget = Overall Budget * (Category Percent / 100)',
    explanation: 'Sizing vendor budgets prevents unplanned expenses from inflating costs, helping you stay within your overall budget.',
    example: 'An overall event budget of $25,000 allocates $11,250 for the venue and catering (45%) and $8,750 for entertainment and decor (35%).',
    faq: [
      { question: 'What is a typical margin for emergency buffers?', answer: 'Always set aside 10% to 15% of your overall budget as a separate buffer to cover last-minute emergencies.' },
      { question: 'What is the largest single cost for social events?', answer: 'Venue rental and catering typically consume 40% to 50% of the entire budget for social events.' }
    ],
    relatedSlugs: ['v15-event-seating-calculator', 'v15-ticket-pricing-calculator'],
    calculate: (inputs) => {
      const budget = Number(inputs.maximumTotalBudget || 1000);
      const catPct = Number(inputs.venueCateringPct || 40);
      const decorPct = Number(inputs.decorEntertainmentPct || 30);

      const venueCost = budget * (catPct / 100);
      const decorCost = budget * (decorPct / 100);
      const buffer = budget * 0.10; // 10% safety buffer
      const otherCosts = budget - venueCost - decorCost - buffer;

      return {
        results: [
          { label: 'Venue & Catering Allocation', value: `$${venueCost.toLocaleString()}`, isPrimary: true },
          { label: 'Entertainment & Décor Allocation', value: `$${decorCost.toLocaleString()}` },
          { label: 'Emergency Safety Buffer (10%)', value: `$${buffer.toLocaleString()}` },
          { label: 'Miscellaneous Vendor Funds', value: `$${otherCosts.toLocaleString()}` }
        ],
        chartData: [
          { name: 'Venue & Food', value: venueCost },
          { name: 'Decor & Entertainment', value: decorCost },
          { name: 'Emergency Buffer', value: buffer },
          { name: 'Miscellaneous', value: otherCosts }
        ]
      };
    }
  },
  {
    id: 'v15-ticket-pricing',
    name: 'Ticket Pricing & Profit Calculator',
    slug: 'v15-ticket-pricing-calculator',
    category: 'events',
    description: 'Calculate ticket pricing structures to cover venue venue bills and hit target event profits.',
    seoTitle: 'Concert & Event Ticket Pricing Profit Estimator',
    seoDescription: 'Find profitable event ticket prices. Determine required ticket prices based on venue costs and target profits.',
    inputs: [
      { id: 'fixedExesCost', label: 'Overall Fixed Event Costs ($)', type: 'number', defaultValue: 12000, helpText: 'Venue hire, staff, talent fees' },
      { id: 'targetEventProfit', label: 'Target Desired Net Profit ($)', type: 'number', defaultValue: 8000 },
      { id: 'ticketsAvailableCount', label: 'Expected Tickets Sold Count', type: 'number', defaultValue: 400 }
    ],
    formula: 'Ticket Price = (Fixed Costs + Desired Profit) / Expected Tickets Sold',
    explanation: 'Calculating ticket pricing structures ensures you cover all upfront expenses while hitting your net profit goals.',
    example: 'To cover $12,000 in fixed costs and generate $8,000 in profit from selling 400 tickets, the required ticket price is exactly $50.',
    faq: [
      { question: 'What are fixed vs variable event costs?', answer: 'Fixed costs (venue hire, sound equipment) remain constant regardless of attendance, while variable costs (catering, programs) scale with guest count.' },
      { question: 'Should I assume all available tickets will sell out?', answer: 'No! Model your budget conservatively, assuming you sell 70% to 80% of available tickets, to protect against unexpected deficits.' }
    ],
    relatedSlugs: ['v15-event-budget-calculator', 'v15-catering-food-calculator'],
    calculate: (inputs) => {
      const costs = Number(inputs.fixedExesCost || 1000);
      const profit = Number(inputs.targetEventProfit || 0);
      const tickets = Number(inputs.ticketsAvailableCount || 100);

      const requiredTotal = costs + profit;
      const ticketPrice = tickets > 0 ? requiredTotal / tickets : 0;

      return {
        results: [
          { label: 'Required Ticket Price / Ticket', value: `$${ticketPrice.toFixed(2)}`, isPrimary: true },
          { label: 'Overall Revenue Target', value: `$${requiredTotal.toLocaleString()}` },
          { label: 'Break-Even Tickets Sold Count', value: `${Math.ceil(costs / ticketPrice)} Tickets` }
        ],
        chartData: [
          { name: 'Fixed Event Costs', value: costs },
          { name: 'Target Desired Profit', value: profit }
        ]
      };
    }
  },

  // TRADES & PROFESSIONS (Category: 'trades')
  {
    id: 'v15-concrete-slab',
    name: 'Concrete Slab Calculator',
    slug: 'v15-concrete-slab-calculator',
    category: 'trades',
    description: 'Calculate the volume of concrete required for a flat yard or shed slab in yards and bags.',
    seoTitle: 'Construction Concrete Slab Volume Calculator',
    seoDescription: 'Find required concrete slab volumes. Input width, length, and depth to calculate concrete bags or cubic yards.',
    inputs: [
      { id: 'slabLengthFt', label: 'Slab Length (Feet)', type: 'number', defaultValue: 12 },
      { id: 'slabWidthFt', label: 'Slab Width (Feet)', type: 'number', defaultValue: 10 },
      { id: 'slabThicknessIn', label: 'Slab Thickness / Depth (Inches)', type: 'number', defaultValue: 4 }
    ],
    formula: 'Volume (Cubic Feet) = Length * Width * (Thickness / 12)\nCubic Yards = Cubic Feet / 27',
    explanation: 'Concrete volume is ordered in cubic yards. This tool converts feet and inches into yards, making it easy to order precise matching volumes.',
    example: 'A 12ft x 10ft shed slab at 4 inches thick requires exactly 1.48 Cubic Yards (or approximately sixty-seven 80lb bags).',
    faq: [
      { question: 'What is a typical slab depth for garden sheds?', answer: 'A depth of 4 inches is the industry standard for light yard sheds, patios, and residential walkways.' },
      { question: 'How much safety allowance should I add to my order?', answer: 'Always add a 10% safety margin to cover soil settlement and spills during the pour.' }
    ],
    relatedSlugs: ['v15-drywall-studs-calculator', 'v15-tile-layout-calculator'],
    calculate: (inputs) => {
      const len = Number(inputs.slabLengthFt || 0);
      const wid = Number(inputs.slabWidthFt || 0);
      const thick = Number(inputs.slabThicknessIn || 4);

      const cuFt = len * wid * (thick / 12);
      const cuYds = cuFt / 27;

      // 80lb bag yields approx 0.60 cu ft
      const bags80 = cuFt / 0.60;
      // 60lb bag yields approx 0.45 cu ft
      const bags60 = cuFt / 0.45;

      return {
        results: [
          { label: 'Required Concrete Volume', value: `${cuYds.toFixed(2)} Cubic Yards`, isPrimary: true },
          { label: '80lb Premix Bags Count', value: `${Math.ceil(bags80)} Bags` },
          { label: '60lb Premix Bags Count', value: `${Math.ceil(bags60)} Bags` }
        ],
        chartData: [
          { name: 'Cubic Feet Volume', value: Math.round(cuFt) }
        ]
      };
    }
  },
  {
    id: 'v15-drywall-studs',
    name: 'Drywall & Studs Calculator',
    slug: 'v15-drywall-studs-calculator',
    category: 'trades',
    description: 'Calculate drywall panels, joint compound weight, and 2x4 framing studs needed to build a partition wall.',
    seoTitle: 'Framing Drywall Panel & Studs Calculator',
    seoDescription: 'Determine partition wall materials. Find required 4x8 drywall panels and framing studs in real-time.',
    inputs: [
      { id: 'wallLengthFeet', label: 'Wall Length (Feet)', type: 'number', defaultValue: 24 },
      { id: 'wallHeightFeet', label: 'Wall Height (Feet)', type: 'number', defaultValue: 8 },
      { id: 'studSpacingIn', label: 'Stud Spacing (On-Center Inches)', type: 'number', defaultValue: 16 }
    ],
    formula: 'Studs needed = (Wall Length * 12 / Spacing) + 1\nDrywall panels (4x8) = (Wall Length * Wall Height) / 32',
    explanation: 'Framing walls requires planning spacing (usually 16 or 24 inches on-center) to align studs with standard 4x8 drywall panels.',
    example: 'A 24ft wall standing 8ft high with 16" stud spacing requires exactly 19 framing studs and six 4x8 drywall panels per side.',
    faq: [
      { question: 'What does "on-center" (OC) spacing mean?', answer: 'OC measures the distance from the center of one framing stud to the center of the next, ensuring panels align properly.' },
      { question: 'Why are drywall panels exactly 4x8 feet?', answer: 'This is the standard building footprint, designed to align with 16" and 24" stud spacing without excess cutting.' }
    ],
    relatedSlugs: ['v15-concrete-slab-calculator', 'v15-tile-layout-calculator'],
    calculate: (inputs) => {
      const len = Number(inputs.wallLengthFeet || 1);
      const high = Number(inputs.wallHeightFeet || 8);
      const spacing = Number(inputs.studSpacingIn || 16);

      // studs count = (len in inches / spacing) + 1 for start/end
      const studs = (len * 12) / spacing + 1;
      // standard drywall panel is 4x8 = 32 sq ft
      const area = len * high;
      const panelsOneSide = area / 32;

      // joint compound is approx 0.05 lbs per sq ft
      const compoundLbs = area * 0.05;

      return {
        results: [
          { label: 'Required Drywall Panels (4\'x8\')', value: `${Math.ceil(panelsOneSide)} Panels (one side)`, isPrimary: true },
          { label: 'Required 2x4 Framing Studs', value: `${Math.ceil(studs)} Studs`, isPrimary: true },
          { label: 'Estimated joint compound weight', value: `${Math.ceil(compoundLbs)} lbs` }
        ],
        chartData: [
          { name: 'Panels Needed', value: Math.ceil(panelsOneSide) },
          { name: 'Studs Needed', value: Math.ceil(studs) }
        ]
      };
    }
  },
  {
    id: 'v15-tile-layout',
    name: 'Tile Layout & Grout Calculator',
    slug: 'v15-tile-layout-calculator',
    category: 'trades',
    description: 'Calculate the number of floor tiles, mortar, and grout weight needed to cover a tiled room area.',
    seoTitle: 'Tile Material & Grout Weight Calculator',
    seoDescription: 'Find floor tiling materials. Input room area size and layout parameters to calculate tile boxes and grout weights.',
    inputs: [
      { id: 'roomAreaSqFt', label: 'Tiling Room Area (Sq. Feet)', type: 'number', defaultValue: 180 },
      { id: 'tileDimInches', label: 'Tile Dimensions (Square Inches)', type: 'select', defaultValue: '12', options: [
        { label: '12" x 12" Standard tile', value: '12' },
        { label: '18" x 18" Medium tile', value: '18' },
        { label: '24" x 24" Large format', value: '24' }
      ]},
      { id: 'groutJointWidth', label: 'Grout Joint Spacing (Inches)', type: 'select', defaultValue: '0.125', options: [
        { label: '1/8" (0.125 Inches)', value: '0.125' },
        { label: '1/16" (0.0625 Inches)', value: '0.0625' },
        { label: '1/4" (0.25 Inches)', value: '0.25' }
      ]}
    ],
    formula: 'Tile count = Room Sq Ft / Tile Sq Ft\nAdd 10% to tile counts for waste cuts.',
    explanation: 'Professional tilers always add a safety margin to layout orders to cover waste from edge cuts, corner fits, and accidental breaks during installation.',
    example: 'Tiling a 180 sq ft room with 12"x12" standard tiles requires exactly 198 tiles (including standard 10% waste cuts).',
    faq: [
      { question: 'Why is a 10% waste cut allowance necessary?', answer: 'Tiling walls or floors requires cutting tiles to fit around borders and corners, making the cut-offs unusable for the rest of the layout.' },
      { question: 'How is thinset mortar packaged?', answer: 'Thinset mortar is sold in 50lb bags, with each bag covering approximately 50 to 80 square feet depending on trowel notch size.' }
    ],
    relatedSlugs: ['v15-concrete-slab-calculator', 'v15-paint-coverage-calculator'],
    calculate: (inputs) => {
      const area = Number(inputs.roomAreaSqFt || 10);
      const tDim = Number(inputs.tileDimInches || 12);
      const grout = Number(inputs.groutJointWidth || 0.125);

      const tileAreaSqFt = (tDim * tDim) / 144;
      const rawTiles = area / tileAreaSqFt;
      const safeTiles = rawTiles * 1.10; // add 10% safety index

      // thinset mortar yields 1 bag (50lb) for 65 sq ft
      const mortarBags = area / 65;

      return {
        results: [
          { label: 'Required Tiles Count (inc. 10% safety)', value: `${Math.ceil(safeTiles)} Tiles`, isPrimary: true },
          { label: 'Estimated Thinset Mortar Bags', value: `${Math.ceil(mortarBags)} Bags (50lbs)` },
          { label: 'Calculated raw tiles without waste', value: `${Math.ceil(rawTiles)} Tiles` }
        ],
        chartData: [
          { name: 'Tiles needed', value: Math.ceil(safeTiles) }
        ]
      };
    }
  },
  {
    id: 'v15-roofing-shingles',
    name: 'Roofing Shingles Calculator',
    slug: 'v15-roofing-shingles-calculator',
    category: 'trades',
    description: 'Calculate roofing squares, shingle bundles, and underlayment rolls needed for custom roof installations.',
    seoTitle: 'Construction roofing Shingles Bundle Calculator',
    seoDescription: 'Estimate roofing shingle bundles. Input roof footprint footprint and pitch values to calculate material needs.',
    inputs: [
      { id: 'houseFootprintSqFt', label: 'House Footprint Area (Sq. Feet)', type: 'number', defaultValue: 2000 },
      { id: 'roofPitchIndex', label: 'Roof Pitch Slope Rise / 12', type: 'select', defaultValue: '1.08', options: [
        { label: 'Low Slope: 4/12 Pitch (factor 1.05)', value: '1.05' },
        { label: 'Standard: 6/12 Pitch (factor 1.12)', value: '1.12' },
        { label: 'Steep: 9/12 Pitch (factor 1.25)', value: '1.25' }
      ]}
    ],
    formula: 'Roof Area = House Footprint * Pitch factor\nRoof Squares = Roof Area / 100\nBundles = Roof Squares * 3',
    explanation: 'Roofing materials are measured in "squares," where 1 square covers exactly 100 square feet of roof surface. Shingles are typically sold in bundles of 3 per square.',
    example: 'Shingling standard 6/12 pitch roofs on a 2,000 sq ft house footprint requires exactly 22.4 squares, or 68 bundles of shingles.',
    faq: [
      { question: 'What is a roofing square?', answer: 'A common industry measurement representing exactly 100 square feet of roof area.' },
      { question: 'How many shingles are in a standard bundle?', answer: 'A standard bundle contains approximately 26 to 29 individual asphalt shingles, designed to cover 33.3 square feet.' }
    ],
    relatedSlugs: ['v15-concrete-slab-calculator', 'v15-paint-coverage-calculator'],
    calculate: (inputs) => {
      const footprint = Number(inputs.houseFootprintSqFt || 1000);
      const pitch = Number(inputs.roofPitchIndex || 1.12);

      const actualArea = footprint * pitch;
      const squares = actualArea / 100;
      const bundles = squares * 3;

      return {
        results: [
          { label: 'Required Shingle Bundles (inc. overlap)', value: `${Math.ceil(bundles)} Bundles`, isPrimary: true },
          { label: 'Calculated Roofing Squares', value: `${squares.toFixed(2)} Squares` },
          { label: 'Estimated Roof Surface Area', value: `${Math.ceil(actualArea).toLocaleString()} Sq. Feet` }
        ],
        chartData: [
          { name: 'Bundles Needed', value: Math.ceil(bundles) }
        ]
      };
    }
  },
  {
    id: 'v15-paint-coverage',
    name: 'Paint Area & Volume Calculator',
    slug: 'v15-paint-coverage-calculator',
    category: 'trades',
    description: 'Calculate paint volume requirements in gallons based on room surface dimensions and coat counts.',
    seoTitle: 'Room Paint Volume & Gallon Coverage Solver',
    seoDescription: 'Find room paint volumes. Input wall dimensions and doors to calculate required paint gallons.',
    inputs: [
      { id: 'roomWallWidthFt', label: 'Sum of Wall Lengths (Feet)', type: 'number', defaultValue: 48 },
      { id: 'roomWallHeightFt', label: 'Wall Height (Feet)', type: 'number', defaultValue: 8 },
      { id: 'paintCoatsCount', label: 'Number of Paint Coats', type: 'number', defaultValue: 2 }
    ],
    formula: 'Paint Area = Walls Length * Height - (Number of doors/windows * 21 sq ft standard)\nPaint Volume (Gallons) = Paint Area / 350',
    explanation: 'A standard gallon of wall paint covers approximately 350 square feet of smooth wall with a single coat.',
    example: 'Painting a room with 48ft of walls height standing 8ft high with 2 coats requires exactly 2.19 gallons of paint.',
    faq: [
      { question: 'Why does dry drywall absorb more paint?', answer: 'Unpainted drywall is highly porous and absorbs water from paint, making a primer coat necessary to seal the surface first.' },
      { question: 'Is it better to own extra paint?', answer: 'Yes! Save at least a quart of paint for future touch-ups to fix scuffs and scratches.' }
    ],
    relatedSlugs: ['v15-tile-layout-calculator', 'v15-concrete-slab-calculator'],
    calculate: (inputs) => {
      const width = Number(inputs.roomWallWidthFt || 10);
      const height = Number(inputs.roomWallHeightFt || 8);
      const coats = Number(inputs.paintCoatsCount || 1);

      const totalArea = width * height;
      const deductedArea = totalArea - 40; // subtract a standard door & window (40 sq ft)
      const accumArea = deductedArea * coats;
      const gallonsNeeded = accumArea / 350;

      return {
        results: [
          { label: 'Required Paint Volume', value: `${gallonsNeeded.toFixed(2)} Gallons`, isPrimary: true },
          { label: 'Surface area to paint', value: `${deductedArea.toFixed(0)} Sq. Feet` },
          { label: 'Litres equivalent volume', value: `${(gallonsNeeded * 3.78541).toFixed(2)} Litres` }
        ],
        chartData: [
          { name: 'Primary Coat Area (sq. ft)', value: Math.round(deductedArea) }
        ]
      };
    }
  }
];
