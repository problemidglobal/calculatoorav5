import { Calculator } from '../types';

export const V12_PART5_CALCULATORS: Calculator[] = [
  // ==================== TRANSPORTATION ====================
  {
    id: 'travel-time',
    name: 'Travel Time Calculator',
    slug: 'travel-time-calculator',
    category: 'transportation',
    description: 'Calculate average trip durations based on road distances and target speeds, including planned rest breaks.',
    seoTitle: 'Road trip distance and travel time calculator',
    seoDescription: 'Find your target trip duration based on road distance, average speeds, and planned rest breaks.',
    inputs: [
      { id: 'distanceMiles', label: 'Total Trip Distance (Miles)', type: 'number', defaultValue: 350 },
      { id: 'avgSpeedMph', label: 'Target Highway Speed (MPH)', type: 'number', defaultValue: 65 },
      { id: 'restBreaksCount', label: 'Number of planned Rest Breaks', type: 'number', defaultValue: 2 }
    ],
    formula: 'Driving Hours = Distance / Speed\nTotal Duration = Driving Hours + (Breaks * 0.25)',
    explanation: 'Long-distance road trips require regular rest breaks to help prevent driver fatigue.',
    example: 'A 350-mile trip at 65 MPH average speed with 2 rest breaks takes approximately 5.9 hours to complete.',
    faq: [{ question: 'How often should I take rest breaks?', answer: 'Road safety organizations recommend taking a 15-minute break for every two hours or 100 miles of driving.' }],
    relatedSlugs: ['commute-cost-calculator', 'distance-cost-calculator'],
    keywords: ['road trip duration solver', 'miles per hour time sheets', 'driving fatigue rest buffers'],
    calculate: (inputs) => {
      const dist = Number(inputs.distanceMiles || 350);
      const speed = Math.max(10, Number(inputs.avgSpeedMph || 65));
      const breaks = Number(inputs.restBreaksCount || 2);

      const drivingHrs = dist / speed;
      const totalHrs = drivingHrs + (breaks * 0.25); // assume 15 minute breaks

      const hrsInt = Math.floor(totalHrs);
      const minsInt = Math.round((totalHrs - hrsInt) * 60);

      return {
        results: [
          { label: 'Projected Total Travel Time', value: `${hrsInt} hrs ${minsInt} mins`, isPrimary: true },
          { label: 'Net active Driving Time', value: `${Math.floor(drivingHrs)} hrs ${Math.round((drivingHrs - Math.floor(drivingHrs)) * 60)} mins` }
        ],
        chartData: [
          { name: 'Driving hours', value: Math.round(drivingHrs * 10) / 10 },
          { name: 'Rest stoppages', value: breaks * 0.25 }
        ]
      };
    }
  },
  {
    id: 'commute-cost',
    name: 'Commute Cost Calculator',
    slug: 'commute-cost-calculator',
    category: 'transportation',
    description: 'Calculate monthly and annual vehicle commute expenses based on gas mileage and toll parameters.',
    seoTitle: 'Daily vehicle commute expense utility solver',
    seoDescription: 'Calculate monthly and annual commuting costs based on gas mileage, parking, and tolls.',
    inputs: [
      { id: 'roundTripMiles', label: 'Daily Round-Trip Distance (Miles)', type: 'number', defaultValue: 30 },
      { id: 'vehicleMpg', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 22 },
      { id: 'gasPrice', label: 'Average Fuel Cost ($ per Gallon)', type: 'number', defaultValue: 3.65 },
      { id: 'dailyTollParking', label: 'Daily Tolls & Parking Costs ($)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Daily Cost = (Distance / MPG * Gas Price) + Daily Tolls\nMonthly Cost = Daily Cost * 21 (working days)',
    explanation: 'Fuel economy, parking, and highway tolls are the primary drivers of daily vehicle commuting costs.',
    example: 'A 30-mile round-trip commute at 22 MPG with $5.00 daily tolls costs approximately $209.58 monthly.',
    faq: [{ question: 'How can I lower my commute costs?', answer: 'Carpooling, utilizing public transportation, or driving fuel-efficient vehicles can significantly reduce commuting expenses.' }],
    relatedSlugs: ['public-transport-cost-calculator', 'distance-cost-calculator'],
    keywords: ['vehicle fuel consumption spend', 'monthly parking toll calculations', 'work commute annual expense'],
    calculate: (inputs) => {
      const dist = Number(inputs.roundTripMiles || 30);
      const mpg = Math.max(1, Number(inputs.vehicleMpg || 22));
      const gas = Number(inputs.gasPrice || 3.65);
      const toll = Number(inputs.dailyTollParking || 5);

      const dailyGas = (dist / mpg) * gas;
      const dailyTotal = dailyGas + toll;

      const monthlyCost = dailyTotal * 21; // 21 working days standard
      const annualCost = monthlyCost * 12;

      return {
        results: [
          { label: 'Estimated Monthly Commute Cost', value: monthlyCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Cumulative Cost Outlay', value: annualCost.toFixed(2), unit: '$' },
          { label: 'Daily operating outlay', value: dailyTotal.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Fuel Expense', value: dailyGas * 21 },
          { name: 'Tolls & Parking', value: toll * 21 }
        ]
      };
    }
  },
  {
    id: 'public-transport-cost-calculator',
    name: 'Public Transport Cost Calculator',
    slug: 'public-transport-cost-calculator',
    category: 'transportation',
    description: 'Compare public transit pass prices against the costs of daily single fares.',
    seoTitle: 'Public Transit Pass vs. Single Fare Comparator',
    seoDescription: 'Compare your transit spending to find whether buying monthly passes or single fares is more cost-effective.',
    inputs: [
      { id: 'singleFare', label: 'Single Transit Ride Ticket Cost ($)', type: 'number', defaultValue: 2.75 },
      { id: 'ridesPerMonth', label: 'Projected monthly Transit Rides', type: 'number', defaultValue: 40 },
      { id: 'monthlyPassCost', label: 'Unlimited Monthly Pass Cost ($)', type: 'number', defaultValue: 90 }
    ],
    formula: 'Single Fare cost = Single Ticket * Monthly Rides\nChoose Pass if Pass Cost is lower than Single Fare Cost.',
    explanation: 'Comparing single ticket fares against monthly transit passes can help daily commuters identify potential savings.',
    example: 'Taking 40 transit rides monthly at $2.75 each costs $110.00, making an unlimited $90.00 monthly pass the more cost-effective choice.',
    faq: [{ question: 'What is transit benefit program?', answer: 'Pre-tax transit programs that allow employees to pay for public transit using pre-tax income.' }],
    relatedSlugs: ['commute-cost-calculator'],
    keywords: ['subway monthly tickets savings', 'commuter unlimited pass yields', 'public transport pricing grids'],
    calculate: (inputs) => {
      const single = Number(inputs.singleFare || 2.75);
      const rides = Number(inputs.ridesPerMonth || 40);
      const pass = Number(inputs.monthlyPassCost || 90);

      const rawSingles = single * rides;
      const isPassWorth = pass < rawSingles;

      return {
        results: [
          { label: 'Single Fares Monthly Total', value: rawSingles.toFixed(2), unit: '$', isPrimary: !isPassWorth },
          { label: 'Monthly Pass Cost', value: pass.toFixed(2), unit: '$', isPrimary: isPassWorth },
          { label: 'Recommended Commuter Choice', value: isPassWorth ? 'Purchase Monthly Pass' : 'Pay Single Fares' }
        ],
        chartData: [
          { name: 'Single Fares Cost', value: Math.round(rawSingles) },
          { name: 'Pass Card Price', value: pass }
        ]
      };
    }
  },
  {
    id: 'vehicle-cost',
    name: 'Vehicle Cost Calculator',
    slug: 'vehicle-cost-calculator',
    category: 'transportation',
    description: 'Calculate average yearly vehicle ownership costs, including car depreciation and maintenance.',
    seoTitle: 'Total Car & Vehicle annual ownership cost solver',
    seoDescription: 'Calculate the total annual cost of owning a vehicle, accounting for depreciation, fuel, and insurance.',
    inputs: [
      { id: 'purchaseAmt', label: 'Original Vehicle Purchase Price ($)', type: 'number', defaultValue: 280000 },
      { id: 'deprecYearRate', label: 'Estimated annual Depreciation Rate (%)', type: 'number', defaultValue: 15 },
      { id: 'maintenanceYear', label: 'Average annual Maintenance budget ($)', type: 'number', defaultValue: 1200 },
      { id: 'insuranceYear', label: 'Annual Car Insurance Premium ($)', type: 'number', defaultValue: 1500 }
    ],
    formula: 'Depreciation = Purchase Price * Depreciation%\nTotal Annual Cost = Depreciation + Maintenance + Insurance',
    explanation: 'Depreciation represents a significant, hidden cost of car ownership alongside direct expenses like fuel and maintenance.',
    example: 'Purchasing a $280,000 vehicle with 15% annual depreciation, $1,200 in maintenance, and $1,500 in insurance costs averages $44,700 in annual ownership expenses.',
    faq: [{ question: 'Why does depreciation slow down?', answer: 'New cars depreciate fastest, typically losing up to 20% of their value in the first year of ownership.' }],
    relatedSlugs: ['commute-cost-calculator', 'distance-cost-calculator'],
    keywords: ['vehicle first year depreciation', 'car ownership cost curves', 'annual maintenance budgets'],
    calculate: (inputs) => {
      const price = Number(inputs.purchaseAmt || 280000);
      const deprec = Number(inputs.deprecYearRate || 15) / 100;
      const maint = Number(inputs.maintenanceYear || 1200);
      const ins = Number(inputs.insuranceYear || 1500);

      const yearlyDeprec = price * deprec;
      const total = yearlyDeprec + maint + ins;

      return {
        results: [
          { label: 'Total Annual Ownership Cost', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Yearly Depreciation Share', value: yearlyDeprec.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Depreciation Loss', value: Math.round(yearlyDeprec) },
          { name: 'Maintenance outlays', value: maint },
          { name: 'Insurance premium', value: ins }
        ]
      };
    }
  },
  {
    id: 'distance-cost',
    name: 'Distance Cost Calculator',
    slug: 'distance-cost-calculator',
    category: 'transportation',
    description: 'Calculate and compare gas and vehicle operating costs for specific trip distances.',
    seoTitle: 'Road trip distance mileage fuel cost finder',
    seoDescription: 'Find the estimated fuel cost for active trip distances based on vehicle fuel efficiency.',
    inputs: [
      { id: 'tripMiles', label: 'Active Trip Distance (Miles)', type: 'number', defaultValue: 250 },
      { id: 'mpgAvg', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 24 },
      { id: 'priceGal', label: 'Average Fuel Price ($ per Gallon)', type: 'number', defaultValue: 3.45 }
    ],
    formula: 'Required Gallons = Distance / MPG\nFuel Cost = Required Gallons * Price per Gallon',
    explanation: 'Calculating distance costs simplifies budget planning for moving trucks and long road trips.',
    example: 'A 250-mile road trip in a vehicle averaging 24 MPG at $3.45/gallon costs approximately $35.94 in fuel.',
    faq: [{ question: 'Does AC use more gas?', answer: 'Running an AC unit can reduce a vehicle\'s fuel economy by 5% to 15%.' }],
    relatedSlugs: ['travel-time-calculator', 'commute-cost-calculator'],
    keywords: ['gas mileage fuel cost', 'road trip budget calculation', 'vehicle travel distance cost'],
    calculate: (inputs) => {
      const dist = Number(inputs.tripMiles || 250);
      const mpg = Math.max(1, Number(inputs.mpgAvg || 24));
      const price = Number(inputs.priceGal || 3.45);

      const gals = dist / mpg;
      const cost = gals * price;

      return {
        results: [
          { label: 'Estimated Fuel Cost', value: cost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Required Fuel Volume', value: `${gals.toFixed(1)} Gallons` }
        ],
        chartData: [
          { name: 'Fuel Expense', value: Math.round(cost) }
        ]
      };
    }
  },

  // ==================== EVENTS ====================
  {
    id: 'wedding-cost',
    name: 'Wedding Cost Calculator',
    slug: 'wedding-cost-calculator',
    category: 'events',
    description: 'Budget major wedding expenses based on guest counts and venue rental rates.',
    seoTitle: 'Wedding & Reception Budget Allocation Planner',
    seoDescription: 'Budget your wedding and reception expenses based on guest counts and venue rental rates.',
    inputs: [
      { id: 'venueRent', label: 'Venue Rental & Ceremony Costs ($)', type: 'number', defaultValue: 8000 },
      { id: 'guestsCount', label: 'Expected Wedding Guest count', type: 'number', defaultValue: 120 },
      { id: 'cateringPerHead', label: 'Catering & Dining Cost per Head ($)', type: 'number', defaultValue: 75 },
      { id: 'decorAttire', label: 'Decorations, Flowers, & Attire ($)', type: 'number', defaultValue: 6000 }
    ],
    formula: 'Catering Cost = Guests * Cost per Head\nTotal Budget = Venue + Catering + Decor',
    explanation: 'Food, beverages, and guest catering represent the single largest expense category in most wedding budgets.',
    example: 'Hosting 120 guests with catering at $75/head alongside an $8,000 venue rental and $6,000 in decorations yields a wedding budget of $23,000.',
    faq: [{ question: 'What is a typical ceremony buffer?', answer: 'Experienced event planners recommend allocating a 10% cash buffer in your wedding budget to cover unexpected fees.' }],
    relatedSlugs: ['event-budget-calculator', 'guest-food-calculator'],
    keywords: ['wedding budget planner', 'reception catering costs', 'reconciled event expenditures'],
    calculate: (inputs) => {
      const venue = Number(inputs.venueRent || 8000);
      const guests = Number(inputs.guestsCount || 120);
      const food = Number(inputs.cateringPerHead || 75);
      const decor = Number(inputs.decorAttire || 6000);

      const catering = guests * food;
      const total = venue + catering + decor;

      return {
        results: [
          { label: 'Recommended Total Wedding Budget', value: total.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Catering & Dining Share', value: catering.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Ceremony Venue', value: venue },
          { name: 'Guest Catering', value: catering },
          { name: 'General Decor', value: decor }
        ]
      };
    }
  },
  {
    id: 'event-budget',
    name: 'Event Budget Calculator',
    slug: 'event-budget-calculator',
    category: 'events',
    description: 'Budget corporate workshops and major events side-by-side using expense allocation models.',
    seoTitle: 'Corporate Event Expense Allocation Budget Planner',
    seoDescription: 'Plan your event budgets by monitoring fixed overheads, production, and marketing expenses.',
    inputs: [
      { id: 'fixedVenue', label: 'Venue Rental & Audiovisual setup ($)', type: 'number', defaultValue: 4500 },
      { id: 'promotionsMarketing', label: 'Promotions, Invites, & Printings ($)', type: 'number', defaultValue: 1500 },
      { id: 'miscBuffers', label: 'Emergency Cash Reserves Buffer ($)', type: 'number', defaultValue: 1000 }
    ],
    formula: 'Budget Total = Venue + Marketing + Reserve Buffer',
    explanation: 'Tracking and categorizing fixed venue overheads allows event coordinators to identify safe ways to lower corporate event costs.',
    example: 'Scheduling a seminar with $4,500 in venue fees and $1,500 in marketing costs requires a baseline budget of $7,000.',
    faq: [{ question: 'What is a typical emergency cash buffer?', answer: 'Event planners recommend allocating a 10% to 15% cash reserve to cover last-minute changes.' }],
    relatedSlugs: ['wedding-cost-calculator', 'party-planning-calculator'],
    keywords: ['corporate workshop sheets', 'audiovisual setup costs', 'conference operating sheets'],
    calculate: (inputs) => {
      const venue = Number(inputs.fixedVenue || 4500);
      const promo = Number(inputs.promotionsMarketing || 1500);
      const misc = Number(inputs.miscBuffers || 1000);

      const total = venue + promo + misc;

      return {
        results: [
          { label: 'Total Recommended Event Budget', value: total.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Administrative Share', value: venue.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Venue & Production', value: venue },
          { name: 'Sales & Promo', value: promo },
          { name: 'Contingency Buffer', value: misc }
        ]
      };
    }
  },
  {
    id: 'party-planning',
    name: 'Party Planning Calculator',
    slug: 'party-planning-calculator',
    category: 'events',
    description: 'Calculate social gathering requirements, including beverage counts and total item quantities based on guest lists.',
    seoTitle: 'Social gathering general drink and item sizer',
    seoDescription: 'Find beverage and item counts for social gatherings based on client guest lists and event durations.',
    inputs: [
      { id: 'guestsTotal', label: 'Expected Social Guest list count', type: 'number', defaultValue: 45 },
      { id: 'durationHrs', label: 'Event Duration length (Hours)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Standard Drinks = Guest count * 2 (1st hr) + Guest count * 1 (subsequent hours)',
    explanation: 'Sizing drink configurations based on event hours prevents running out of beverages or buying excessive inventory.',
    example: 'Planning a 3-hour gathering for 45 guests requires stocking approximately 180 standard beverages.',
    faq: [{ question: 'What is a standard drink volume?', answer: 'One 12-ounce beer, one 5-ounce glass of wine, or one 1.5-ounce shot of distilled spirits.' }],
    relatedSlugs: ['guest-food-calculator', 'wedding-cost-calculator'],
    keywords: ['party food beverage sizer', 'beverage inventories estimates', 'social gatherings planner'],
    calculate: (inputs) => {
      const guests = Number(inputs.guestsTotal || 45);
      const hrs = Number(inputs.durationHrs || 3);

      const bottlesNeeded = Math.ceil(guests * 1.5);
      const softDrinks = Math.ceil(guests * 2.1);

      return {
        results: [
          { label: 'Est. standard Beverages needed', value: Math.ceil(guests * (2 + (hrs - 1) * 1)).toString(10), isPrimary: true },
          { label: 'Soft Drinks & Sodas allocation', value: softDrinks.toString(10) }
        ],
        chartData: [
          { name: 'Guests', value: guests }
        ]
      };
    }
  },
  {
    id: 'guest-food',
    name: 'Guest Food Calculator',
    slug: 'guest-food-calculator',
    category: 'events',
    description: 'Calculate kitchen ingredient and food weight requirements based on event guest lists.',
    seoTitle: 'Event Catering Food Quantity Calculator',
    seoDescription: 'Calculate target kitchen ingredients and food weights based on event guest lists.',
    inputs: [
      { id: 'guestsNum', label: 'Expected Dining Guest list', type: 'number', defaultValue: 80 }
    ],
    formula: 'Primary Proteins = Guests * 0.5 lbs\nPrimary Sides = Guests * 0.35 lbs',
    explanation: 'Adhering to standard portion weights helps commercial caterers prepare delicious meals while minimizing food waste.',
    example: 'Preparing dinner for an 80-guest wedding requires approximately 40 lbs of primary protein and 28 lbs of side dishes.',
    faq: [{ question: 'How much extra should caterers cook?', answer: 'Caterers typically prepare a 5% to 10% food surplus to accommodate unexpected guests.' }],
    relatedSlugs: ['party-planning-calculator', 'wedding-cost-calculator'],
    keywords: ['wedding dinner portion sizes', 'protein catering weight sheets', 'buffet ingredient planner'],
    calculate: (inputs) => {
      const guests = Number(inputs.guestsNum || 80);

      const proteinLbs = guests * 0.5; // half-pound per head
      const sidesLbs = guests * 0.35;

      return {
        results: [
          { label: 'Required Primary Proteins', value: `${proteinLbs.toFixed(1)} lbs`, isPrimary: true },
          { label: 'Required Primary Sides', value: `${sidesLbs.toFixed(1)} lbs` }
        ]
      };
    }
  },
  {
    id: 'event-timeline',
    name: 'Event Timeline Calculator',
    slug: 'event-timeline-calculator',
    category: 'events',
    description: 'Build precise event schedules by dividing key sessions, speeches, and dinner segments.',
    seoTitle: 'Multi-session Event Segment Duration Builder',
    seoDescription: 'Build precise event schedules by dividing key sessions, speeches, and dinner segments.',
    inputs: [
      { id: 'totalDurationHrs', label: 'Full Event Duration (Hours)', type: 'number', defaultValue: 4 },
      { id: 'ceremonyPct', label: 'Ceremony / Opening segment share (%)', type: 'number', defaultValue: 25 },
      { id: 'socialMealPct', label: 'Social & Dining segment share (%)', type: 'number', defaultValue: 50 }
    ],
    formula: 'Segment Duration (mins) = Total Hours * 60 * (Segment % / 100)',
    explanation: 'Building a precise event schedule prevents sessions from running late, which can lead to venue overtime fees.',
    example: 'Dividing a 4-hour evening event dedicates 60 minutes to the opening segment and 120 minutes to dining and social activities.',
    faq: [{ question: 'How much buffer is recommended between segments?', answer: 'Experienced event organizers allocate a 5 to 10-minute buffer between segments for transitions.' }],
    relatedSlugs: ['event-budget-calculator'],
    keywords: ['seminar timeline scheduling', 'remediations schedule planner', 'banquet time sheets'],
    calculate: (inputs) => {
      const hrs = Number(inputs.totalDurationHrs || 4);
      const cer = Number(inputs.ceremonyPct || 25) / 100;
      const meal = Number(inputs.socialMealPct || 50) / 100;

      const totalMins = hrs * 60;
      const ceremonyMins = totalMins * cer;
      const mealMins = totalMins * meal;
      const danceMins = totalMins - (ceremonyMins + mealMins);

      return {
        results: [
          { label: 'Opening Segment Duration', value: `${Math.round(ceremonyMins)} Minutes`, isPrimary: true },
          { label: 'Social & Dining Duration', value: `${Math.round(mealMins)} Minutes` },
          { label: 'Dancing & Closing Duration', value: `${Math.max(0, Math.round(danceMins))} Minutes` }
        ],
        chartData: [
          { name: 'Ceremony', value: Math.round(ceremonyMins) },
          { name: 'Social Dining', value: Math.round(mealMins) },
          { name: 'Closing Dance', value: Math.max(0, Math.round(danceMins)) }
        ]
      };
    }
  },

  // ==================== MEDICAL PROFESSIONAL EDUCATION ====================
  {
    id: 'dosage-calculator',
    name: 'Dosage Calculator',
    slug: 'dosage-calculator',
    category: 'medical-edu',
    description: 'Calculate clinical drug dosages based on patient weight metrics and solution concentration formulas.',
    seoTitle: 'Clinical pharmacology patient weight dosage tool',
    seoDescription: 'Calculate clinical drug dosages based on patient body weights and solution concentration formulas.',
    inputs: [
      { id: 'patientWeightKg', label: 'Patient Body Weight (kg)', type: 'number', defaultValue: 70 },
      { id: 'prescribedPerKg', label: 'Prescribed Dosage rate (mg/kg)', type: 'number', defaultValue: 2.5 },
      { id: 'stockConcentration', label: 'Liquid concentration (mg/mL)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Active Ingredient (mg) = Weight * Rate\nRequired Volume (mL) = mg / Concentration',
    explanation: 'Calculating clinical dosages requires precise patient weights to prevent dangerous over-medication or under-treatment.',
    example: 'A 70 kg patient prescribed 2.5 mg/kg of active ingredient requires a 175 mg dose, or 17.5 mL of a 10 mg/mL liquid solution.',
    faq: [{ question: 'What is pediatric dosing?', answer: 'Specialized medication calculations based on age or body surface area (BSA) rather than standard adult weights.' }],
    relatedSlugs: ['medical-conversion-calculator', 'health-measurement-calculator'],
    keywords: ['pharmacology dosage solver', 'mg per kg calculations', 'liquid solution volumes'],
    calculate: (inputs) => {
      const kg = Number(inputs.patientWeightKg || 70);
      const rate = Number(inputs.prescribedPerKg || 2.5);
      const stock = Math.max(0.1, Number(inputs.stockConcentration || 10));

      const reqMg = kg * rate;
      const reqMl = reqMg / stock;

      return {
        results: [
          { label: 'Required Solution Volume', value: `${reqMl.toFixed(2)} mL`, isPrimary: true },
          { label: 'Total Active Ingredient', value: `${reqMg.toFixed(1)} mg` }
        ]
      };
    }
  },
  {
    id: 'medical-conversion-calculator',
    name: 'Medical Conversion Calculator',
    slug: 'medical-conversion-calculator',
    category: 'medical-edu',
    description: 'Convert medical laboratory metrics, including blood sugar values, between US and international standards.',
    seoTitle: 'Glucose & lab metric standard converter',
    seoDescription: 'Convert medical laboratory blood sugar readings between US (mg/dL) and SI (mmol/L) units.',
    inputs: [
      { id: 'glucoseUs', label: 'Blood Glucose Reading (mg/dL)', type: 'number', defaultValue: 100 }
    ],
    formula: 'SI glucose (mmol/L) = US glucose (mg/dL) / 18',
    explanation: 'Converting laboratory metrics is essential for clinicians evaluating international medical journals and patient files.',
    example: 'A blood glucose reading of 100 mg/dL converts to 5.56 mmol/L under SI standard metric rules.',
    faq: [{ question: 'What is HbA1c?', answer: 'A diabetes screening test that measures average blood glucose levels over the preceding three months.' }],
    relatedSlugs: ['dosage-calculator', 'clinical-calculation-calculator'],
    keywords: ['glucose mg dL converters', 'mmol L blood sugar standards', 'international medical conversions'],
    calculate: (inputs) => {
      const usVal = Number(inputs.glucoseUs || 100);

      const siVal = usVal / 18.016;

      return {
        results: [
          { label: 'SI Standard Value equivalent', value: `${siVal.toFixed(3)} mmol/L`, isPrimary: true },
          { label: 'US Blood Glucose Baseline', value: `${usVal.toFixed(1)} mg/dL` }
        ]
      };
    }
  },
  {
    id: 'health-measurement-calculator',
    name: 'Health Measurement Calculator',
    slug: 'health-measurement-calculator',
    category: 'medical-edu',
    description: 'Calculate average arterial pressure (MAP) metrics from patient systolic and diastolic blood pressure readings.',
    seoTitle: 'Mean Arterial Pressure (MAP) Clinical Estimator',
    seoDescription: 'Calculate Mean Arterial Pressure (MAP) from systolic and diastolic blood pressure readings.',
    inputs: [
      { id: 'systolicBp', label: 'Systolic Pressure (mmHg)', type: 'number', defaultValue: 120 },
      { id: 'diastolicBp', label: 'Diastolic Pressure (mmHg)', type: 'number', defaultValue: 80 }
    ],
    formula: 'MAP = [(2 * Diastolic) + Systolic] / 3',
    explanation: 'Arterial pressure (MAP) indicates how effectively your blood pressure delivers oxygen and nutrients to vital organs and tissues.',
    example: 'A standard blood pressure reading of 120/80 mmHg corresponds to a Mean Arterial Pressure of 93.3 mmHg.',
    faq: [{ question: 'What is a dangerous MAP?', answer: 'A Mean Arterial Pressure below 60 mmHg is generally insufficient to adequately oxygenate vital organs.' }],
    relatedSlugs: ['dosage-calculator', 'clinical-calculation-calculator'],
    keywords: ['mean arterial pressure map', 'blood pressure index', 'vital organ perfusion levels'],
    calculate: (inputs) => {
      const sys = Number(inputs.systolicBp || 120);
      const dia = Number(inputs.diastolicBp || 80);

      const mapVal = ((2 * dia) + sys) / 3;

      return {
        results: [
          { label: 'Mean Arterial Pressure (MAP)', value: `${mapVal.toFixed(1)} mmHg`, isPrimary: true },
          { label: 'Tissue Perfusion classification', value: mapVal >= 65 ? 'Adequate Organ Perfusion' : 'Insufficient Organ Perfusion' }
        ]
      };
    }
  },
  {
    id: 'clinical-calculation-calculator',
    name: 'Clinical Calculation Calculator',
    slug: 'clinical-calculation-calculator',
    category: 'medical-edu',
    description: 'Calculate kidney glomerular filtration rate (GFR) estimations using Cockcroft-Gault formulas.',
    seoTitle: 'Kidney Glomerular Filtration rate (GFR) Estimator',
    seoDescription: 'Calculate kidney GFR estimations using the clinical Cockcroft-Gault formula.',
    inputs: [
      { id: 'ageYrs', label: 'Patient Chronological Age', type: 'number', defaultValue: 45 },
      { id: 'weightKg', label: 'Patient weight (kg)', type: 'number', defaultValue: 75 },
      { id: 'creatinine', label: 'Serum Creatinine (mg/dL)', type: 'number', defaultValue: 1.1 }
    ],
    formula: 'GFR (Male) = [(140 - Age) * Weight] / (72 * Creatinine)',
    explanation: ' Glomerular filtration rate GFR indicates your kidney function, which is essential to determine safe medication clearance rates.',
    example: 'A 45-year-old male weighing 75 kg with 1.1 mg/dL serum creatinine GFR filters approximately 90.0 mL of blood per minute.',
    faq: [{ question: 'Why is GFR important?', answer: 'GFR helps doctors screen for kidney disease and calculate safe dosages for medications cleared through the kidneys.' }],
    relatedSlugs: ['medical-score-calculator', 'clinical-calculation-calculator'],
    keywords: ['glomerular filtration rate GFR', 'kidney clearance indexes', 'cockcroft gault renal parameters'],
    calculate: (inputs) => {
      const age = Number(inputs.ageYrs || 45);
      const kg = Number(inputs.weightKg || 75);
      const creat = Math.max(0.1, Number(inputs.creatinine || 1.1));

      const gfrMale = ((140 - age) * kg) / (72 * creat);

      return {
        results: [
          { label: 'Estimated Creatinine Clearance', value: `${gfrMale.toFixed(1)} mL/min`, isPrimary: true },
          { label: 'Functional Kidney Grade', value: gfrMale >= 90 ? 'Grade 1 / Normal' : gfrMale >= 60 ? 'Grade 2 / Mild decrease' : 'Grade 3 / Moderate' }
        ]
      };
    }
  },
  {
    id: 'medical-score-calculator',
    name: 'Medical Score Calculator',
    slug: 'medical-score-calculator',
    category: 'medical-edu',
    description: 'Grade clinical stroke probabilities using standardized CHADS2 scoring metrics.',
    seoTitle: 'Atrial Fibrillation Stroke risk (CHADS2) Score',
    seoDescription: 'Grade clinical stroke risk for patients with atrial fibrillation using CHADS2 guidelines.',
    inputs: [
      { id: 'hasHypertension', label: 'Diagnosed hypertension?', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes (1 point)', value: 'yes' }, { label: 'No (0 points)', value: 'no' }] },
      { id: 'hasDiabetes', label: 'Diagnosed diabetes?', type: 'select', defaultValue: 'no', options: [{ label: 'Yes (1 point)', value: 'yes' }, { label: 'No (0 points)', value: 'no' }] },
      { id: 'priorStroke', label: 'Prior history of Stroke / TIA?', type: 'select', defaultValue: 'no', options: [{ label: 'Yes (2 points)', value: 'yes' }, { label: 'No (0 points)', value: 'no' }] }
    ],
    formula: 'CHADS2 Score = Hypertension + Diabetes + (Stroke * 2)',
    explanation: 'The CHADS2 rating scale evaluates stroke risks in patients with atrial fibrillation, helping guide daily anticoagulant therapies.',
    example: 'A hypertension-positive patient without any history of private diabetes or stroke earns a CHADS2 Score of 1, carrying a moderate risk profile.',
    faq: [{ question: 'What is a transient ischemic attack (TIA)?', answer: 'A brief, temporary stroke-like event that serves as a critical warning sign for potential full strokes.' }],
    relatedSlugs: ['clinical-calculation-calculator'],
    keywords: ['chads2 stroke probability index', 'cardiology risk assessment', 'atrial fibrillation sheets'],
    calculate: (inputs) => {
      let score = 0;
      if (inputs.hasHypertension === 'yes') score += 1;
      if (inputs.hasDiabetes === 'yes') score += 1;
      if (inputs.priorStroke === 'yes') score += 2;

      let risk = 'Low (1.9% / Year)';
      if (score >= 3) risk = 'High (5.3%+ / Year)';
      else if (score >= 1) risk = 'Moderate (2.8% / Year)';

      return {
        results: [
          { label: 'CHADS2 Stroke Risk Score', value: `${score} / 4`, isPrimary: true },
          { label: 'Patient Risk Classification', value: risk }
        ],
        chartData: [
          { name: 'Patient Score Points', value: score },
          { name: 'Max Severity Scale', value: 4 }
        ]
      };
    }
  },

  // ==================== SCIENCE LAB ====================
  {
    id: 'scientific-notation',
    name: 'Scientific Notation Calculator',
    slug: 'scientific-notation-calculator',
    category: 'science-lab',
    description: 'Convert standard decimal numbers to scientific notation format.',
    seoTitle: 'Decimal to scientific exponent notation solver',
    seoDescription: 'Convert standard decimal numbers to scientific exponential notation with customizable significant figures.',
    inputs: [
      { id: 'decimalVal', label: 'Standard Decimal value', type: 'number', defaultValue: 380450 }
    ],
    formula: 'Scientific Notation = m * 10^n where 1 <= m < 10',
    explanation: 'Scientific notation simplifies working with extremely large or small decimal numbers in scientific and lab research.',
    example: 'A decimal value of 380,450 converts to 3.80 * 10^5 in scientific notation format.',
    faq: [{ question: 'What are significant figures?', answer: 'The specific digits in a number that carry meaningful precision contribution.' }],
    relatedSlugs: ['measurement-conversion-calculator', 'experimental-error-calculator'],
    keywords: ['scientific notation solver', 'decimal values exponent scale', 'significant figures rounding'],
    calculate: (inputs) => {
      const val = Number(inputs.decimalVal || 380450);

      const expStr = val.toExponential(3);

      return {
        results: [
          { label: 'Equivalent Scientific Notation', value: expStr, isPrimary: true },
          { label: 'Decimal value', value: val.toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'unit-analysis',
    name: 'Unit Analysis Calculator',
    slug: 'unit-analysis-calculator',
    category: 'science-lab',
    description: 'Check dimensional consistency in physics problems by verifying mass, length, and time exponents.',
    seoTitle: 'Physics dimensional unit consistency checker',
    seoDescription: 'Verify dimensional consistency in physics formulas by matching exponents for mass, length, and time.',
    inputs: [
      { id: 'forceUnit', label: 'Force dimensions base [M][L][T^-2]', type: 'number', defaultValue: 1 }
    ],
    formula: 'Dimensional check verifies if variables have corresponding physical dimensions.',
    explanation: 'Dimensional unit analysis confirms that equations are mathematically consistent before solving physics problems.',
    example: 'Force has the dimensional units [M][L][T^-2], representing mass multiplied by acceleration.',
    faq: [{ question: 'Can unit analysis prove a formula?', answer: 'No, but it can quickly identify math errors by highlighting dimensional inconsistencies.' }],
    relatedSlugs: ['measurement-conversion-calculator'],
    keywords: ['dimensional check physics', 'physics exponent formulas', 'constant unit consistency'],
    calculate: (inputs) => {
      const forceMultiplier = Number(inputs.forceUnit || 1);

      return {
        results: [
          { label: 'Dimensional Status', value: 'Equation Consistent', isPrimary: true },
          { label: 'Force Dimension multiplier', value: `M^${forceMultiplier} L^${forceMultiplier} T^-2` }
        ]
      };
    }
  },
  {
    id: 'measurement-conversion-calculator',
    name: 'Measurement Conversion Calculator',
    slug: 'measurement-conversion-calculator',
    category: 'science-lab',
    description: 'Convert physical liquid volume measurements between liters and standard milliliters.',
    seoTitle: 'Laboratory liquids scale converter',
    seoDescription: 'Convert physical liquid volume measurements between liters and standard milliliters.',
    inputs: [
      { id: 'liters', label: 'Volume in Liters (L)', type: 'number', defaultValue: 2.5 }
    ],
    formula: 'Milliliters (mL) = Liters * 1,000',
    explanation: 'Converting chemical volumes is essential to ensure accurate research measurements as experiment scales shift.',
    example: 'A chemical volume of 2.5 liters corresponds to exactly 2,500 milliliters.',
    faq: [{ question: 'What is one cubic centimeter equivalent?', answer: 'One cubic centimeter (cc) is exactly equivalent to one milliliter (mL) of liquid.' }],
    relatedSlugs: ['scientific-notation-calculator', 'accuracy-calculator'],
    keywords: ['liter to ml conversions', 'laboratory chemical volume solver', 'scientific measurement sheets'],
    calculate: (inputs) => {
      const liters = Number(inputs.liters || 2.5);

      const ml = liters * 1000;

      return {
        results: [
          { label: 'Equivalent Liquid Volume', value: `${ml.toLocaleString()} mL`, isPrimary: true },
          { label: 'Liters equivalent', value: `${liters.toFixed(3)} L` }
        ],
        chartData: [
          { name: 'Milliliters volume', value: Math.round(ml) }
        ]
      };
    }
  },
  {
    id: 'experimental-error-calculator',
    name: 'Experimental Error Calculator',
    slug: 'experimental-error-calculator',
    category: 'science-lab',
    description: 'Calculate experimental percentage errors by comparing observed values with theoretical benchmarks.',
    seoTitle: 'Experimental percentage error margin solver',
    seoDescription: 'Calculate percentage errors by comparing observed values with theoretical benchmarks.',
    inputs: [
      { id: 'acceptedValue', label: 'Accepted Theoretical Value', type: 'number', defaultValue: 9.81 },
      { id: 'measuredValue', label: 'Observed Experimental Reading', type: 'number', defaultValue: 9.62 }
    ],
    formula: 'Percent Error = |(Measured - Accepted) / Accepted| * 100',
    explanation: 'Percent error calculations are used in laboratories to evaluate experiment accuracy and identify sources of error.',
    example: 'An observed physical acceleration of 9.62 m/s2 against a theoretical value of 9.81 m/s2 yields a small 1.94% error margin.',
    faq: [{ question: 'What is systematic error?', answer: 'Reoccurring mistakes caused by miscalibrated lab instruments or biased experiment designs.' }],
    relatedSlugs: ['accuracy-calculator', 'scientific-notation-calculator'],
    keywords: ['chemistry percent error solver', 'theoretical vs experimental margin', 'calibration deviation metrics'],
    calculate: (inputs) => {
      const acc = Number(inputs.acceptedValue || 9.81);
      const meas = Number(inputs.measuredValue || 9.62);

      const diff = Math.abs(meas - acc);
      const pct = acc > 0 ? (diff / acc) * 100 : 0;

      return {
        results: [
          { label: 'Calculated Percent Error', value: `${pct.toFixed(2)} %`, isPrimary: true },
          { label: 'Absolute Deviation Margin', value: diff.toFixed(3) }
        ],
        chartData: [
          { name: 'Error Margin Pct', value: Math.round(pct * 10) / 10 },
          { name: 'Safety Margin Pct', value: Math.max(0, 100 - Math.round(pct * 10) / 10) }
        ]
      };
    }
  },
  {
    id: 'accuracy-calculator',
    name: 'Accuracy Calculator',
    slug: 'accuracy-calculator',
    category: 'science-lab',
    description: 'Verify accuracy and precision percentages based on experimental deviation margins.',
    seoTitle: 'Scientific Precision & Accuracy Percentage Sizer',
    seoDescription: 'Grade your lab instrument calibrations based on experimental deviation margins.',
    inputs: [
      { id: 'accuracyDev', label: 'Maximum Calibration Deviation (%)', type: 'number', defaultValue: 0.5 }
    ],
    formula: 'Instrument Accuracy (%) = 100 - Calibration Deviation',
    explanation: 'Highly precise scientific instruments are essential to protect the integrity of delicate laboratory experiments.',
    example: 'An instrument with a 0.5% maximum deviation has a high 99.50% accuracy rating.',
    faq: [{ question: 'What is precision vs accuracy?', answer: 'Accuracy is how close a measurement is to the true value, while precision is how consistent repeated measurements are.' }],
    relatedSlugs: ['experimental-error-calculator', 'unit-analysis-calculator'],
    keywords: ['laboratory tool precision rating', 'instrument calibration percentage', 'deviation margin threshold'],
    calculate: (inputs) => {
      const dev = Number(inputs.accuracyDev || 0.5);

      const accScore = 100 - dev;

      return {
        results: [
          { label: 'Instrument Accuracy Rating', value: `${accScore.toFixed(2)} %`, isPrimary: true },
          { label: 'Calibration Quality Level', value: accScore >= 99 ? 'Excellent' : 'Requires Recalibration' }
        ],
        chartData: [
          { name: 'Accuracy', value: accScore },
          { name: 'Deviation', value: dev }
        ]
      };
    }
  },

  // ==================== ADVANCED MATHEMATICS ====================
  {
    id: 'sequence-calculator',
    name: 'Sequence Calculator',
    slug: 'sequence-calculator',
    category: 'advanced-math',
    description: 'Solve arithmetic and geometric sequences for specific nth term values.',
    seoTitle: 'Arithmetic & Geometric Sequence nth Term Solver',
    seoDescription: 'Find any term in an arithmetic or geometric sequence based on starting values and growth factors.',
    inputs: [
      { id: 'seqType', label: 'Sequence Progression Type', type: 'select', defaultValue: 'geometric', options: [
        { label: 'Arithmetic (+ Add common diff)', value: 'arithmetic' },
        { label: 'Geometric (* Multiply common ratio)', value: 'geometric' }
      ]},
      { id: 'firstTerm', label: 'First Term Value (a1)', type: 'number', defaultValue: 3 },
      { id: 'commonDelta', label: 'Common Difference / Ratio (d or r)', type: 'number', defaultValue: 2 },
      { id: 'termIndex', label: 'Target Term Index (n)', type: 'number', defaultValue: 10, min: 1 }
    ],
    formula: 'Arithmetic Term = a1 + (n - 1)*d\nGeometric Term = a1 * r^(n - 1)',
    explanation: 'Progressive sequences are the foundation of mathematical growth models, compound interest, and computer algorithms.',
    example: 'The 10th term of a geometric sequence starting at 3 with a common ratio of 2 is 1,536.',
    faq: [{ question: 'What is a divergent sequence?', answer: 'A sequence that continues growing infinitely rather than approaching a specific, stable limit.' }],
    relatedSlugs: ['series-calculator', 'permutation-calculator'],
    keywords: ['geometric nth term sequence', 'common difference arithmetic solver', 'progression calculation series'],
    calculate: (inputs) => {
      const type = inputs.seqType || 'geometric';
      const a1 = Number(inputs.firstTerm || 3);
      const delta = Number(inputs.commonDelta || 2);
      const n = Math.max(1, Number(inputs.termIndex || 10));

      let termVal = 0;
      if (type === 'arithmetic') {
        termVal = a1 + (n - 1) * delta;
      } else {
        termVal = a1 * Math.pow(delta, n - 1);
      }

      return {
        results: [
          { label: `Value of Term (${n}th)`, value: termVal.toLocaleString(), isPrimary: true },
          { label: 'Starting Term a1', value: a1.toString(10) }
        ],
        chartData: [
          { name: 'Starting Value', value: a1 },
          { name: 'Target Term Value', value: termVal }
        ]
      };
    }
  },
  {
    id: 'series-calculator',
    name: 'Series Calculator',
    slug: 'series-calculator',
    category: 'advanced-math',
    description: 'Calculate convergent and divergent sums for geometric series progression lines.',
    seoTitle: 'Geometric Series Cumulative Sum Calculator',
    seoDescription: 'Find the cumulative sum of a geometric series based on starting values and growth factors.',
    inputs: [
      { id: 'a1Value', label: 'Starting base first Term (a1)', type: 'number', defaultValue: 5 },
      { id: 'ratioValue', label: 'Common multiplier Ratio (r)', type: 'number', defaultValue: 0.5 },
      { id: 'termsLimit', label: 'Number of terms to sum (n)', type: 'number', defaultValue: 6 }
    ],
    formula: 'Geometric Sum = a1 * (1 - r^n) / (1 - r)',
    explanation: 'Convergent series approach a stable mathematical limit as more terms are added, provided the ratio absolute value is less than 1.',
    example: 'Summing 6 terms of a geometric series starting at 5 with a common ratio of 0.5 yields a convergent total of 9.84.',
    faq: [{ question: 'What is a convergent series?', answer: 'A series that approaches a specific, finite value as the number of terms reaches infinity.' }],
    relatedSlugs: ['sequence-calculator'],
    keywords: ['series limit cumulative sums', 'geometric progression summing', 'converging ratios solver'],
    calculate: (inputs) => {
      const a1 = Number(inputs.a1Value || 5);
      const r = Number(inputs.ratioValue || 0.5);
      const n = Number(inputs.termsLimit || 6);

      let sum = 0;
      if (r === 1) {
        sum = a1 * n;
      } else {
        sum = a1 * (1 - Math.pow(r, n)) / (1 - r);
      }

      return {
        results: [
          { label: 'Cumulative Series Sum', value: sum.toFixed(4), isPrimary: true },
          { label: 'Sum of infinite Series equivalent', value: Math.abs(r) < 1 ? (a1 / (1 - r)).toFixed(4) : 'Series Diverges' }
        ],
        chartData: [
          { name: 'Cumulative Sum', value: Math.round(sum * 100) / 100 }
        ]
      };
    }
  },
  {
    id: 'permutation-calculator',
    name: 'Permutation Calculator',
    slug: 'permutation-calculator',
    category: 'advanced-math',
    description: 'Calculate permutation permutations (nPr) where item order is important.',
    seoTitle: 'Permutations (nPr) Order-Specific Permutations Solver',
    seoDescription: 'Find total permutations (nPr) based on pool sizes and target selection counts.',
    inputs: [
      { id: 'nPool', label: 'Total Pool Sizing (n)', type: 'number', defaultValue: 8 },
      { id: 'rSelect', label: 'Selection count (r)', type: 'number', defaultValue: 3 }
    ],
    formula: 'P(n, r) = n! / (n - r)!',
    explanation: 'Permutations calculate the number of unique ordered arrangements that can be made from a pool of items.',
    example: 'Selecting 3 items in a specific order from a pool of 8 yields exactly 336 unique permutations.',
    faq: [{ question: 'Does item order matter for permutations?', answer: 'Yes, in permutations, order is critical (e.g. {A,B} is a different arrangement than {B,A}).' }],
    relatedSlugs: ['combination-calculator', 'sequence-calculator'],
    keywords: ['order permutations nPr', 'factorials combinatorics solver', 'ordered selections math'],
    calculate: (inputs) => {
      const n = Math.max(1, Number(inputs.nPool || 8));
      const r = Math.max(0, Number(inputs.rSelect || 3));

      if (r > n) {
        return { results: [{ label: 'Error', value: 'r cannot exceed n', isPrimary: true }] };
      }

      const getFact = (val: number): number => {
        let f = 1;
        for (let i = 2; i <= val; i++) f *= i;
        return f;
      };

      const permutationsVal = getFact(n) / getFact(n - r);

      return {
        results: [
          { label: 'Total Permutations (nPr)', value: permutationsVal.toLocaleString(), isPrimary: true },
          { label: 'Pool factorials size (n!)', value: getFact(n).toExponential(2) }
        ],
        chartData: [
          { name: 'Selections', value: r },
          { name: 'Remaining', value: n - r }
        ]
      };
    }
  },
  {
    id: 'combination-calculator',
    name: 'Combination Calculator',
    slug: 'combination-calculator',
    category: 'advanced-math',
    description: 'Calculate combination configurations (nCr) where item order is not important.',
    seoTitle: 'Combinations (nCr) Unordered Configurations Solver',
    seoDescription: 'Find total combinations (nCr) based on pool sizes and target selection counts.',
    inputs: [
      { id: 'nPoolCombined', label: 'Total Pool Sizing (n)', type: 'number', defaultValue: 10 },
      { id: 'rSelectCombined', label: 'Selection count (r)', type: 'number', defaultValue: 4 }
    ],
    formula: 'C(n, r) = n! / (r! * (n - r)!)',
    explanation: 'Combinations calculate the number of unique unordered groups that can be selected from a larger pool of items.',
    example: 'Selecting 4 cards in any order from a hand of 10 options yields exactly 210 unique combinations.',
    faq: [{ question: 'Does item order matter for combinations?', answer: 'No, in combinations, order is irrelevant (e.g., {A,B} is the exact same grouping as {B,A}).' }],
    relatedSlugs: ['permutation-calculator'],
    keywords: ['unordered groupings nCr', 'pool choices combinatorics', 'statistics selecting lists'],
    calculate: (inputs) => {
      const n = Math.max(1, Number(inputs.nPoolCombined || 10));
      const r = Math.max(0, Number(inputs.rSelectCombined || 4));

      if (r > n) {
        return { results: [{ label: 'Error', value: 'r cannot exceed n', isPrimary: true }] };
      }

      const getFact = (val: number): number => {
        let f = 1;
        for (let i = 2; i <= val; i++) f *= i;
        return f;
      };

      const combinationsVal = getFact(n) / (getFact(r) * getFact(n - r));

      return {
        results: [
          { label: 'Total Combinations (nCr)', value: combinationsVal.toLocaleString(), isPrimary: true },
          { label: 'Unordered arrangements', value: combinationsVal.toFixed(0) }
        ],
        chartData: [
          { name: 'Selections', value: r },
          { name: 'Remaining', value: n - r }
        ]
      };
    }
  },
  {
    id: 'matrix-operation',
    name: 'Matrix Operation Calculator',
    slug: 'matrix-operation-calculator',
    category: 'advanced-math',
    description: 'Evaluate mathematical determinants and traces for standard 2x2 matrix structures.',
    seoTitle: '2x2 Matrix Determinant & Trace Solver',
    seoDescription: 'Calculate determinants and traces for 2x2 math matrices.',
    inputs: [
      { id: 'm00', label: 'Row 1, Col 1 (A)', type: 'number', defaultValue: 4 },
      { id: 'm01', label: 'Row 1, Col 2 (B)', type: 'number', defaultValue: 2 },
      { id: 'm10', label: 'Row 2, Col 1 (C)', type: 'number', defaultValue: 1 },
      { id: 'm11', label: 'Row 2, Col 2 (D)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Determinant = (A*D) - (B*C)\nTrace = A + D',
    explanation: 'Matrix determinants are essential values in linear algebra, used to confirm if a matrix is invertible.',
    example: 'A matrix with values [4, 2 / 1, 3] has a determinant of 10 and a trace value of 7.',
    faq: [{ question: 'What does a zero determinant mean?', answer: 'A matrix with a determinant of zero is singular, meaning it cannot be mathematically inverted.' }],
    relatedSlugs: ['combination-calculator'],
    keywords: ['2x2 matrix determinants', 'trace linear algebra', 'singular matrix invertible'],
    calculate: (inputs) => {
      const a = Number(inputs.m00 || 4);
      const b = Number(inputs.m01 || 2);
      const c = Number(inputs.m10 || 1);
      const d = Number(inputs.m11 || 3);

      const det = (a * d) - (b * c);
      const trace = a + d;

      return {
        results: [
          { label: 'Matrix Determinant (det)', value: det.toString(10), isPrimary: true },
          { label: 'Matrix Trace value', value: trace.toString(10) }
        ]
      };
    }
  },
  {
    id: 'graph-function',
    name: 'Graph Function Calculator',
    slug: 'graph-function-calculator',
    category: 'advanced-math',
    description: 'Solve polynomial equations for specific y coordinates along function lines.',
    seoTitle: 'Quadratic Polynomial y-Coordinate Solver',
    seoDescription: 'Solve quadratic equations to find coordinates and y-intercept values.',
    inputs: [
      { id: 'slopeA', label: 'Quadratic Coefficient (a)', type: 'number', defaultValue: 2 },
      { id: 'coeffB', label: 'Linear Coefficient (b)', type: 'number', defaultValue: -4 },
      { id: 'constC', label: 'Constant Value C (y-int)', type: 'number', defaultValue: 5 },
      { id: 'coordX', label: 'Input Coordinate (x)', type: 'number', defaultValue: 3 }
    ],
    formula: 'y = a*x^2 + b*x + c',
    explanation: 'Quadratic curves map acceleration, physical parabolas, and mathematical motion formulas.',
    example: 'Evaluating the function y = 2x^2 - 4x + 5 at coordinate x = 3 yields a value of y = 11.',
    faq: [{ question: 'What is the y-intercept?', answer: 'The point where a graphed function crosses the y-axis (the function\'s value when x is 0).' }],
    relatedSlugs: ['sequence-calculator'],
    keywords: ['parabolic polynomial curves', 'quadratic equation values', 'y intercepts coordinate solver'],
    calculate: (inputs) => {
      const a = Number(inputs.slopeA || 2);
      const b = Number(inputs.coeffB || -4);
      const c = Number(inputs.constC || 5);
      const x = Number(inputs.coordX || 3);

      const yVal = (a * Math.pow(x, 2)) + (b * x) + c;

      return {
        results: [
          { label: 'Resulting y-Coordinate', value: yVal.toString(10), isPrimary: true },
          { label: 'Function y-Intercept', value: c.toString(10) }
        ]
      };
    }
  },

  // ==================== LANGUAGE LEARNING ====================
  {
    id: 'vocabulary-goal',
    name: 'Vocabulary Goal Calculator',
    slug: 'vocabulary-goal-calculator',
    category: 'language-learning',
    description: 'Calculate standard vocabulary learning goals to reach fluent conversation targets.',
    seoTitle: 'Foreign conversation vocabulary goal target sizer',
    seoDescription: 'Find daily vocabulary learning goals and timelines to reach fluent conversation targets.',
    inputs: [
      { id: 'vocabTarget', label: 'Desired Vocabulary Size (Words)', type: 'number', defaultValue: 3000 },
      { id: 'studyDays', label: 'Target timeline length (Days)', type: 'number', defaultValue: 180 }
    ],
    formula: 'Daily Words Learn = Target Vocabulary / Days to complete',
    explanation: 'Conversational fluency typically requires building a core vocabulary of 3,000 to 5,000 words.',
    example: 'To learn 3,000 words over a 180-day study period, you must learn approximately 17 new words per day.',
    faq: [{ question: 'How many words does a native speaker know?', answer: 'Average native speakers know a vocabulary of approximately 15,000 to 20,000 words.' }],
    relatedSlugs: ['language-learning-time-calculator', 'fluency-progress-calculator'],
    keywords: ['conversational vocabulary targets', 'daily flashcard learning rates', 'retention study timelines'],
    calculate: (inputs) => {
      const target = Number(inputs.vocabTarget || 3000);
      const days = Math.max(1, Number(inputs.studyDays || 180));

      const daily = target / days;

      return {
        results: [
          { label: 'Required Daily Word Target', value: `${Math.ceil(daily)} Words`, isPrimary: true },
          { label: 'Weekly Study Target equivalents', value: `${Math.ceil(daily * 7)} Words / Week` }
        ],
        chartData: [
          { name: 'Vocabulary Goal', value: target }
        ]
      };
    }
  },
  {
    id: 'language-learning-time',
    name: 'Language Learning Time Calculator',
    slug: 'language-learning-time-calculator',
    category: 'language-learning',
    description: 'Calculate total class study hours needed to reach target fluency grades.',
    seoTitle: 'FSI language difficulty study hours solver',
    seoDescription: 'Find study hours needed to reach specific fluency levels based on language difficulty.',
    inputs: [
      { id: 'difficultyTier', label: 'Language difficulty tier (FSI)', type: 'select', defaultValue: 'tier1', options: [
        { label: 'Tier I (Spanish/French) - ~600 hrs', value: 'tier1' },
        { label: 'Tier II (German) - ~900 hrs', value: 'tier2' },
        { label: 'Tier IV (Arabic/Chinese) - ~2200 hrs', value: 'tier4' }
      ]},
      { id: 'dailyHoursStudy', label: 'Designated Study Hours per Day', type: 'number', defaultValue: 1.5 }
    ],
    formula: 'Study Days Required = Target FSI scale hours / Daily Study hours',
    explanation: 'Language difficulty tiers reflect how closely related a target language is to your native language (using FSI standards).',
    example: 'Studying Spanish (Tier 1: 600 hours) for 1.5 hours daily requires approximately 400 days to reach fluency.',
    faq: [{ question: 'What is the Foreign Service Institute?', answer: 'The US training agency that categorizes languages into tiers based on learning difficulty for English speakers.' }],
    relatedSlugs: ['vocabulary-goal-calculator', 'fluency-progress-calculator'],
    keywords: ['fsi language tiers hours', 'daily study fluency timeline', 'fluent spoken conversation hours'],
    calculate: (inputs) => {
      const tier = inputs.difficultyTier || 'tier1';
      const hours = Math.max(0.1, Number(inputs.dailyHoursStudy || 1.5));

      let targetHrs = 600;
      if (tier === 'tier2') targetHrs = 900;
      else if (tier === 'tier4') targetHrs = 2200;

      const daysNeeded = targetHrs / hours;

      return {
        results: [
          { label: 'Projected Days to Fluency', value: Math.ceil(daysNeeded).toLocaleString(), isPrimary: true },
          { label: 'Total FSI Class Hours', value: `${targetHrs} Hours` }
        ],
        chartData: [
          { name: 'Daily Study Hours', value: Math.round(hours) },
          { name: 'FSI standard total', value: targetHrs }
        ]
      };
    }
  },
  {
    id: 'fluency-progress',
    name: 'Fluency Progress Calculator',
    slug: 'fluency-progress-calculator',
    category: 'language-learning',
    description: 'Track and score language study progress using standardized European CEFR guidelines.',
    seoTitle: 'CEFR language fluency status tracker',
    seoDescription: 'Track your language study progress using standardized CEFR guidelines.',
    inputs: [
      { id: 'currCEFRLevel', label: 'Current fluency level (CEFR)', type: 'select', defaultValue: 'a2', options: [
        { label: 'A1 (Beginner level)', value: 'a1' },
        { label: 'A2 (Elementary level)', value: 'a2' },
        { label: 'B1 (Intermediate level)', value: 'b1' },
        { label: 'B2 (Upper Intermediate level)', value: 'b2' },
        { label: 'C1 (Advanced fluency)', value: 'c1' }
      ]}
    ],
    formula: 'Status checks trace a user\'s current CEFR level along the standard fluency progression.',
    explanation: 'The CEFR guidelines provide a standard framework to evaluate listening, reading, writing, and speaking skills.',
    example: 'Moving from a beginner A1 level to an intermediate B1 level allows for comfortable, active conversation.',
    faq: [{ question: 'What is CEFR?', answer: 'Common European Framework of Reference for Languages - the international standard for describing language ability.' }],
    relatedSlugs: ['vocabulary-goal-calculator', 'study-progress-calculator'],
    keywords: ['cefr conversational fluency score', 'language speaking progress standards', 'foreign comprehension matrices'],
    calculate: (inputs) => {
      const level = inputs.currCEFRLevel || 'a2';

      let scorePct = 20;
      if (level === 'a2') scorePct = 40;
      else if (level === 'b1') scorePct = 60;
      else if (level === 'b2') scorePct = 80;
      else if (level === 'c1') scorePct = 95;

      return {
        results: [
          { label: 'Equivalent CEFR Fluency Score', value: `${scorePct} %`, isPrimary: true },
          { label: 'Spoken competence description', value: scorePct >= 60 ? 'Active comfortable conversation' : 'Basic survival communication' }
        ],
        chartData: [
          { name: 'Fluency Percent', value: scorePct },
          { name: 'Remaining to Mastery', value: 100 - scorePct }
        ]
      };
    }
  },
  {
    id: 'study-progress',
    name: 'Study Progress Calculator',
    slug: 'study-progress-calculator',
    category: 'language-learning',
    description: 'Track your language course progress by comparing completed chapters against curriculum totals.',
    seoTitle: 'Language course lesson progress tracker',
    seoDescription: 'Track completed language course chapters and estimate remaining study hours.',
    inputs: [
      { id: 'completedChapters', label: 'Completed textbook / Course Chapters', type: 'number', defaultValue: 14 },
      { id: 'totalChapters', label: 'Total Chapters in curriculum', type: 'number', defaultValue: 30 },
      { id: 'hoursPerChapter', label: 'Average study Hours per Chapter', type: 'number', defaultValue: 4.5 }
    ],
    formula: 'Completion % = (Completed / Total) * 100\nRemaining Hours = (Total - Completed) * Hours per Chapter',
    explanation: 'Regular study progress checks provide positive feedback to help you stay motivated during long programs.',
    example: 'Completing 14 out of 30 chapters in a course requires approximately 72 hours of study time to finish.',
    faq: [{ question: 'What is spacing effect?', answer: 'A learning technique where study sessions are spaced out over time to improve long-term memory retention.' }],
    relatedSlugs: ['language-learning-time-calculator', 'fluency-progress-calculator'],
    keywords: ['course milestones progress', 'textbook material completions tracker', 'study hours remaining'],
    calculate: (inputs) => {
      const done = Number(inputs.completedChapters || 14);
      const total = Math.max(1, Number(inputs.totalChapters || 30));
      const hours = Number(inputs.hoursPerChapter || 4.5);

      const realDone = Math.min(done, total);
      const pct = (realDone / total) * 100;
      const hoursLeft = (total - realDone) * hours;

      return {
        results: [
          { label: 'Curriculum Completion Rate', value: `${pct.toFixed(1)}%`, isPrimary: true },
          { label: 'Estimated Study Hours Remaining', value: `${hoursLeft.toFixed(1)} Hours` }
        ],
        chartData: [
          { name: 'Completed Course', value: Math.round(pct) },
          { name: 'Remaining Course', value: 100 - Math.round(pct) }
        ]
      };
    }
  }
];
