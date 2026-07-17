import { Calculator } from '../types';

export const DAILY_LIFE_COOKING_CALCULATORS: Calculator[] = [
  {
    id: 'daily-tip',
    name: 'Standard Tip Calculator',
    slug: 'tip-calculator',
    category: 'daily-life',
    description: 'Calculate average tip amounts and split bills across diners.',
    seoTitle: 'Standard Tip & Gratuity Solver | Calculatoora',
    seoDescription: 'Calculate tip percentages and split total bills evenly among diners.',
    inputs: [
      { id: 'bill', label: 'Overall Bill Amount ($)', type: 'number', defaultValue: 85 },
      { id: 'tipPct', label: 'Tip Percentage (%)', type: 'range', defaultValue: 18, min: 5, max: 35, step: 1 },
      { id: 'diners', label: 'Number of Diners', type: 'number', defaultValue: 2 }
    ],
    formula: 'Tip = Bill * (TipPct / 100); Share = (Bill + Tip) / Diners',
    explanation: 'Splitting tips and bills ensures dining costs are distributed fairly among parties.',
    example: 'An $85.00 bill with an 18% tip ($15.30) split among 2 diners results in $50.15 per person.',
    faq: [
      { question: 'What is the standard tipping rate?', answer: 'In US dining, 15% to 20% of the pre-tax bill standardly serves as gratuity depending on service quality.' }
    ],
    relatedSlugs: ['split-bill', 'shopping-budget'],
    calculate: (inputs) => {
      const bill = Number(inputs.bill || 85);
      const tipPct = Number(inputs.tipPct || 18) / 100;
      const diners = Number(inputs.diners || 2);

      const tipVal = bill * tipPct;
      const total = bill + tipVal;
      const share = diners > 0 ? (total / diners) : total;

      return {
        results: [
          { label: 'Individal Share Cost', value: `$${share.toFixed(2)}`, isPrimary: true },
          { label: 'Tip Amount', value: `$${tipVal.toFixed(2)}` },
          { label: 'Combined Total with gratuity', value: `$${total.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Base Bill Cost', value: bill, color: '#39FF14' },
          { name: 'Diner Gratuity', value: tipVal, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'daily-split-bill',
    name: 'Bill Splitter Tool',
    slug: 'split-bill',
    category: 'daily-life',
    description: 'Split shared house, dinner, and purchase receipts evenly among friends.',
    seoTitle: 'Multi-party Bill Splitter Solver | Calculatoora',
    seoDescription: 'Split shared house or outing receipts evenly among custom counts of friends.',
    inputs: [
      { id: 'receiptTotal', label: 'Combined Receipt Cost ($)', type: 'number', defaultValue: 154.5 },
      { id: 'people', label: 'Number of Friends', type: 'number', defaultValue: 3 }
    ],
    formula: 'Individual Share = Combined Cost / People count',
    explanation: 'Splitting group expenses instantly avoids calculations during outings.',
    example: 'A $154.50 house warming receipt split among 3 roommates amounts to $51.50 each.',
    faq: [
      { question: 'Does this handle custom splits?', answer: 'This tool is designed for equal splits. For unequal shares, calculate each person\'s custom percentage separately.' }
    ],
    relatedSlugs: ['tip-calculator', 'shopping-budget'],
    calculate: (inputs) => {
      const rawCost = Number(inputs.receiptTotal || 154.5);
      const num = Number(inputs.people || 3);

      const share = num > 0 ? (rawCost / num) : rawCost;

      return {
        results: [
          { label: 'Share per Person', value: `$${share.toFixed(2)}`, isPrimary: true },
          { label: 'Transaction Total', value: `$${rawCost.toFixed(2)}` }
        ]
      };
    }
  },
  {
    id: 'daily-grocery-budget',
    name: 'Grocery Budget Planner',
    slug: 'grocery-budget',
    category: 'daily-life',
    description: 'Calculate average monthly grocery spending budgets based on family sizes and shopping frequencies.',
    seoTitle: 'Family Grocery budget Planner | Calculatoora',
    seoDescription: 'Plan your family grocery budgets based on family size and average weekly expenses.',
    inputs: [
      { id: 'members', label: 'People in Household', type: 'number', defaultValue: 3 },
      { id: 'weeklySub', label: 'Average weekly spend per person ($)', type: 'number', defaultValue: 65 }
    ],
    formula: 'Monthly target = Members * WeeklyCost * 4.33',
    explanation: 'Tracking grocery spending helps households manage essential food costs and optimize monthly budgets.',
    example: 'A 3-member household spending $65 per person weekly has an estimated monthly grocery budget of $844.',
    faq: [
      { question: 'What is a typical weekly grocery budget per person?', answer: 'In the US, average weekly grocery costs range from $50 to $85 per person, depending on location and diet.' }
    ],
    relatedSlugs: ['shopping-budget', 'tip-calculator'],
    calculate: (inputs) => {
      const base = Number(inputs.members || 3);
      const cost = Number(inputs.weeklySub || 65);

      const weeklyTotal = base * cost;
      const monthlyTotal = weeklyTotal * 4.33;

      return {
        results: [
          { label: 'Monthly Grocery Budget', value: `$${monthlyTotal.toFixed(0)}`, isPrimary: true },
          { label: 'Weekly Combined Spend', value: `$${weeklyTotal.toFixed(0)}` }
        ]
      };
    }
  },
  {
    id: 'daily-shopping-budget',
    name: 'Shopping Discount Calculator',
    slug: 'shopping-budget',
    category: 'daily-life',
    description: 'Calculate final prices on discounted items, factoring in promotional sales taxes.',
    seoTitle: 'Shopping Discount & Coupon Solver | Calculatoora',
    seoDescription: 'Find net shopping cost savings on items based on deal coupon rates and sales taxes.',
    inputs: [
      { id: 'price', label: 'Standard Price Tag ($)', type: 'number', defaultValue: 120 },
      { id: 'discount', label: 'Discount coupon Rate (%)', type: 'range', defaultValue: 25, min: 0, max: 90, step: 5 },
      { id: 'tax', label: 'Sales Tax rate (%)', type: 'number', defaultValue: 8.5 }
    ],
    formula: 'Final = Price * (1 - Discount/100) * (1 + Tax/100)',
    explanation: 'Calculating the final price of discounted items helps shoppers make informed purchasing decisions.',
    example: 'A $120.00 jacket discounted by 25% with an 8.5% sales tax costs exactly $97.65.',
    faq: [
      { question: 'Are multiple discounts cumulative?', answer: 'In retail, sequential discounts are usually applied one after another rather than added together (e.g., 20% off plus 10% off is a 28% total discount, not 30%).' }
    ],
    relatedSlugs: ['tip-calculator', 'split-bill'],
    calculate: (inputs) => {
      const price = Number(inputs.price || 120);
      const discount = Number(inputs.discount || 25) / 100;
      const tax = Number(inputs.tax || 8.5) / 100;

      const subtotal = price * (1 - discount);
      const taxAmount = subtotal * tax;
      const finalPrice = subtotal + taxAmount;

      return {
        results: [
          { label: 'Final Net Purchase Price', value: `$${finalPrice.toFixed(2)}`, isPrimary: true },
          { label: 'Amount Saved', value: `$${(price - subtotal).toFixed(2)}` },
          { label: 'Sales tax cost', value: `$${taxAmount.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Discounted Price', value: subtotal, color: '#39FF14' },
          { name: 'Promotional Savings', value: price - subtotal, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'daily-travel-budget',
    name: 'Travel Destination Budget Planner',
    slug: 'travel-budget-calc',
    category: 'daily-life',
    description: 'Estimate overall travel expenses, factoring in flights, accommodation, and daily activities.',
    seoTitle: 'Travel Destination Budget Planner | Calculatoora',
    seoDescription: 'Estimate overall expenses for trips based on lodging costs, flight prices, and daily spending.',
    inputs: [
      { id: 'flights', label: 'Flights / Train Transit Cost ($)', type: 'number', defaultValue: 650 },
      { id: 'lodging', label: 'Lodging / Hotel per Night ($)', type: 'number', defaultValue: 120 },
      { id: 'nights', label: 'Number of Nights on Trip', type: 'number', defaultValue: 5 },
      { id: 'dailySpend', label: 'Daily Food & Activity Budget ($)', type: 'number', defaultValue: 75 }
    ],
    formula: 'Cost = Flights + (Lodging * Nights) + (DailySpend * Nights)',
    explanation: 'Planning travel costs in advance helps vacationers budget for activities and enjoy trips without financial stress.',
    example: 'A 5-night trip with a $650 flight, $120/night lodging, and a $75/day activity budget has an estimated cost of $1,625.',
    faq: [
      { question: 'Why plan a daily contingency budget?', answer: 'A daily buffer (typically 15%) covers emergencies, unexpected transit fares, and spontaneous activities.' }
    ],
    relatedSlugs: ['trip-cost-calc', 'fuel-cost'],
    calculate: (inputs) => {
      const transit = Number(inputs.flights || 650);
      const bed = Number(inputs.lodging || 120);
      const days = Number(inputs.nights || 5);
      const meals = Number(inputs.dailySpend || 75);

      const totalLodging = bed * days;
      const totalDaily = meals * days;
      const totalBudget = transit + totalLodging + totalDaily;

      return {
        results: [
          { label: 'Estimated Trip Budget', value: `$${totalBudget.toLocaleString()}`, isPrimary: true },
          { label: 'Accommodation cost', value: `$${totalLodging.toLocaleString()}` },
          { label: 'Out-and-About Budget', value: `$${totalDaily.toLocaleString()}` }
        ],
        chartData: [
          { name: 'Transit Link', value: transit, color: '#3b82f6' },
          { name: 'Housing', value: totalLodging, color: '#f43f5e' },
          { name: 'Food & Fun', value: totalDaily, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'daily-trip-cost',
    name: 'Road Trip Cost Estimator',
    slug: 'trip-cost-calc',
    category: 'daily-life',
    description: 'Calculate road trip expenses based on distance, driving fuel efficiency, and fuel prices.',
    seoTitle: 'Road Trip Fuel Cost Solver | Calculatoora',
    seoDescription: 'Estimate gasoline costs for road trips based on driving distances, fuel economy, and gas prices.',
    inputs: [
      { id: 'distance', label: 'One-Way Distance (Miles)', type: 'number', defaultValue: 350 },
      { id: 'mpg', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 28 },
      { id: 'gasPrice', label: 'Fuel Price per Gallon ($)', type: 'number', defaultValue: 3.65 },
      { id: 'roundTrip', label: 'Round-Trip', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No (One-Way)', value: 'no' }
      ]}
    ],
    formula: 'Gallons = Distance / MPG; Fuel Cost = Gallons * Price',
    explanation: 'Calculating fuel costs helps drivers budget for road trips and split expenses fairly among passengers.',
    example: 'A 350-mile round trip (700 miles total) in a 28 MPG vehicle with fuel at $3.65/gallon costs approximately $91.25 in gasoline.',
    faq: [
      { question: 'What is the most fuel-efficient speed for driving?', answer: 'For most passenger cars, maintaining a steady speed between 50 and 60 miles per hour yields optimal fuel efficiency.' }
    ],
    relatedSlugs: ['fuel-cost', 'mileage-calculator', 'travel-budget-calc'],
    calculate: (inputs) => {
      const oneWay = Number(inputs.distance || 350);
      const economy = Number(inputs.mpg || 28);
      const fuelPrice = Number(inputs.gasPrice || 3.65);
      const direct = inputs.roundTrip || 'yes';

      const finalDist = direct === 'yes' ? (oneWay * 2) : oneWay;
      const gallonsNeeded = economy > 0 ? (finalDist / economy) : 0;
      const costRaw = gallonsNeeded * fuelPrice;

      return {
        results: [
          { label: 'Estimated Fuel Cost', value: `$${costRaw.toFixed(2)}`, isPrimary: true },
          { label: 'Total Distance traveled', value: `${finalDist} Miles` },
          { label: 'Fuel Consumed', value: `${gallonsNeeded.toFixed(1)} Gallons` }
        ]
      };
    }
  },
  {
    id: 'daily-fuel-cost',
    name: 'Weekly Commute Fuel Cost Calculator',
    slug: 'fuel-cost',
    category: 'daily-life',
    description: 'Calculate weekly commute fuel costs based on daily mileage and fuel prices.',
    seoTitle: 'Weekly Commute Fuel Cost Calculator | Calculatoora',
    seoDescription: 'Obtain estimated weekly gas costs based on daily miles and average vehicle fuel economy.',
    inputs: [
      { id: 'dailyMiles', label: 'Average Daily Commute (Miles)', type: 'number', defaultValue: 24 },
      { id: 'mpgAvg', label: 'Vehicle fuel efficiency (MPG)', type: 'number', defaultValue: 25 },
      { id: 'gasCost', label: 'Gas Price ($ / Gallon)', type: 'number', defaultValue: 3.75 }
    ],
    formula: 'Cost = (DailyMiles * 5 / MPG) * GasPrice',
    explanation: 'Calculating weekly fuel costs highlights the financial impact of daily commuting and helps workers evaluate the benefits of public transport or remote work.',
    example: 'A 24-mile daily commute in a 25 MPG vehicle with gas at $3.75/gallon costs approximately $18.00 in fuel for a 5-day workweek.',
    faq: [
      { question: 'How is vehicle MPG calculated?', answer: 'By dividing the miles driven between fill-ups by the gallons of fuel required to refill the tank.' }
    ],
    relatedSlugs: ['trip-cost-calc', 'mileage-calculator'],
    calculate: (inputs) => {
      const miles = Number(inputs.dailyMiles || 24);
      const economy = Number(inputs.mpgAvg || 25);
      const gas = Number(inputs.gasCost || 3.75);

      const weeklyDistance = miles * 5; // Standard work week
      const weeklyGallons = economy > 0 ? (weeklyDistance / economy) : 0;
      const cost = weeklyGallons * gas;

      return {
        results: [
          { label: 'Weekly Commute Fuel Cost', value: `$${cost.toFixed(2)}`, isPrimary: true },
          { label: 'Weekly Gas Volume', value: `${weeklyGallons.toFixed(1)} Gallons` },
          { label: 'Annual Fuel Cost estimate', value: `$${(cost * 52).toFixed(0)}` }
        ]
      };
    }
  },
  {
    id: 'daily-mileage-calculator',
    name: 'Vehicle Fuel Economy (MPG) Calculator',
    slug: 'mileage-calculator',
    category: 'daily-life',
    description: 'Calculate vehicle fuel economy (MPG) based on trip odometer readings and fuel consumption.',
    seoTitle: 'Vehicle Fuel Economy (MPG) Calculator | Calculatoora',
    seoDescription: 'Measure your vehicle\'s actual Miles Per Gallon (MPG) using odometer logs and fuel refill amounts.',
    inputs: [
      { id: 'startOdo', label: 'Starting Odometer Reading (Miles)', type: 'number', defaultValue: 45000 },
      { id: 'endOdo', label: 'Ending Odometer Reading (Miles)', type: 'number', defaultValue: 45310 },
      { id: 'gallonsAdded', label: 'Fuel Added to Refill (Gallons)', type: 'number', defaultValue: 11.2 }
    ],
    formula: 'MPG = (EndingOdo - StartingOdo) / GallonsAdded',
    explanation: 'Tracking actual fuel economy helps vehicle owners monitor fuel efficiency and identify potential engine or maintenance issues early.',
    example: 'Driving 310 miles (45,000 to 45,310) and refilling with 11.2 gallons of fuel yields an average of 27.68 Miles Per Gallon.',
    faq: [
      { question: 'Why is my calculated MPG lower than the official rating?', answer: 'Aggressive driving, frequent idling, heavy cargo, cold weather, and city traffic can significantly reduce actual fuel efficiency compared to manufacturer highway ratings.' }
    ],
    relatedSlugs: ['trip-cost-calc', 'fuel-cost'],
    calculate: (inputs) => {
      const startingOdo = Number(inputs.startOdo || 45000);
      const endingOdo = Number(inputs.endOdo || 45310);
      const gallons = Number(inputs.gallonsAdded || 11.2);

      const diff = endingOdo - startingOdo;

      if (diff <= 0 || gallons <= 0) {
        return {
          results: [{ label: 'Fuel Economy (MPG)', value: 'Values must exceed 0', isPrimary: true }]
        };
      }

      const mpg = diff / gallons;
      const l100k = 235.215 / mpg; // standard constant to convert MPG to Liters/100km

      return {
        results: [
          { label: 'Calculated Fuel Economy', value: `${mpg.toFixed(2)} MPG`, isPrimary: true },
          { label: 'Distance Traveled', value: `${diff} Miles` },
          { label: 'Metric Fuel Consumption', value: `${l100k.toFixed(1)} L/100km` }
        ]
      };
    }
  },
  {
    id: 'cook-recipe-scaling',
    name: 'Recipe Scaling Calculator',
    slug: 'recipe-scaling',
    category: 'daily-life',
    description: 'Scale ingredient quantities up or down to match a different serving count.',
    seoTitle: 'Recipe Scaling & Batch Solver | Calculatoora',
    seoDescription: 'Scale recipe ingredient weights and measurements to easily adjust servings for dining parties.',
    inputs: [
      { id: 'origServings', label: 'Current Recipe Servings', type: 'number', defaultValue: 4 },
      { id: 'targetServings', label: 'Desired Servings Target', type: 'number', defaultValue: 10 },
      { id: 'measure', label: 'Ingredient Measurement to scale', type: 'number', defaultValue: 250 }
    ],
    formula: 'Scaled Measure = Measure * (TargetServings / OriginalServings)',
    explanation: 'Scaling ingredients proportionally keeps recipe ratios consistent, ensuring dishes taste great whether cooking for a family or a large party.',
    example: 'A recipe for 4 servings calling for 250g of flour scales up to 625g of flour to serve 10 dinner guests.',
    faq: [
      { question: 'Do cooking times scale proportionally with guest counts?', answer: 'No. While ingredient quantities scale proportionally, oven and cooking times scale based on pan dimensions and thermal transfer rates.' }
    ],
    relatedSlugs: ['ingredient-converter-tool', 'cooking-unit-converter'],
    calculate: (inputs) => {
      const orig = Number(inputs.origServings || 4);
      const target = Number(inputs.targetServings || 10);
      const qty = Number(inputs.measure || 250);

      const factor = orig > 0 ? (target / orig) : 1;
      const finalVal = qty * factor;

      return {
        results: [
          { label: 'Scaled Ingredient Amount', value: `${finalVal.toFixed(1)}`, isPrimary: true },
          { label: 'Scaling Multiplier Factor', value: `${factor.toFixed(2)}x` }
        ]
      };
    }
  },
  {
    id: 'cook-ingredient-converter',
    name: 'Ingredient Weight Converter',
    slug: 'ingredient-converter-tool',
    category: 'daily-life',
    description: 'Convert recipe volumes (cups) to weight standards (grams) for common cooking ingredients.',
    seoTitle: 'Ingredient Cups to Grams Converter | Calculatoora',
    seoDescription: 'Convert recipe volumes to weight standards for flour, sugar, and baking bases.',
    inputs: [
      { id: 'cups', label: 'Volume (Cups)', type: 'number', defaultValue: 2 },
      { id: 'ingredient', label: 'Baking Ingredient', type: 'select', defaultValue: 'flour', options: [
        { label: 'All-Purpose Flour (1 cup = 120g)', value: '120' },
        { label: 'Granulated Sugar (1 cup = 200g)', value: '200' },
        { label: 'Brown Sugar Packed (1 cup = 220g)', value: '220' },
        { label: 'Unsalted Butter (1 cup = 227g)', value: '227' }
      ]}
    ],
    formula: 'Weight (Grams) = Cups count * Cup density weight',
    explanation: 'Measuring ingredients by weight is more accurate than relying on volumetric cups, which can vary depending on how compact materials are packed.',
    example: 'Converting 2 cups of sifted all-purpose flour yields approximately 240 grams.',
    faq: [
      { question: 'Why is baking by weight preferred?', answer: 'Professional bakers measure ingredients in grams because ambient humidity and packing density can cause cup sizes to vary by up to 20%.' }
    ],
    relatedSlugs: ['recipe-scaling', 'cooking-unit-converter'],
    calculate: (inputs) => {
      const cupsInt = Number(inputs.cups || 2);
      const factor = Number(inputs.ingredient || 120);

      const g = cupsInt * factor;
      const oz = g * 0.035274;

      return {
        results: [
          { label: 'Equivalent Weight', value: `${g.toFixed(0)} Grams`, isPrimary: true },
          { label: 'Weight in Ounces (oz)', value: `${oz.toFixed(2)} oz` }
        ]
      };
    }
  },
  {
    id: 'cook-cooking-unit-converter',
    name: 'Culinary Unit Converter',
    slug: 'cooking-unit-converter',
    category: 'daily-life',
    description: 'Convert culinary volume measurements between Tablespoons, Teaspoons, Cups, Fl Oz, and Milliliters.',
    seoTitle: 'Culinary Volume Unit Converter | Calculatoora',
    seoDescription: 'Transform home recipe liquid measurements between teaspoons, tablesoons, fluid ounces, and milliliters.',
    inputs: [
      { id: 'volValue', label: 'Input Quantity', type: 'number', defaultValue: 3 },
      { id: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'tbsp', options: [
        { label: 'Teaspoon (tsp)', value: 'tsp' },
        { label: 'Tablespoon (tbsp)', value: 'tbsp' },
        { label: 'Cups', value: 'cup' },
        { label: 'Fluid Ounces (fl oz)', value: 'floz' },
        { label: 'Milliliter (ml)', value: 'ml' }
      ]}
    ],
    formula: 'Conversions use standard culinary multipliers (e.g., 1 tbsp = 3 tsp = 14.78 ml).',
    explanation: 'Converting cooking measurements is essential for adapting recipes to standard measuring spoons or fluid cups found in home kitchens.',
    example: 'Inputs of 3 Tablespoons convert to exactly 9 Teaspoons or 44.37 Milliliters of liquid.',
    faq: [
      { question: 'Is a US tablespoon equal to a UK tablespoon?', answer: 'No. A US tablespoon contains 14.8 ml, while a UK tablespoon contains 15 ml. The variance is rarely large enough to impact standard home recipes.' }
    ],
    relatedSlugs: ['recipe-scaling', 'ingredient-converter-tool'],
    calculate: (inputs) => {
      const val = Number(inputs.volValue || 3);
      const from = inputs.fromUnit || 'tbsp';

      // base ml references
      let mlVal = val;
      if (from === 'tsp') mlVal = val * 4.929;
      else if (from === 'tbsp') mlVal = val * 14.787;
      else if (from === 'cup') mlVal = val * 240;
      else if (from === 'floz') mlVal = val * 29.5735;

      const tsp = mlVal / 4.929;
      const tbsp = mlVal / 14.787;
      const cups = mlVal / 240;
      const floz = mlVal / 29.5735;

      return {
        results: [
          { label: 'Milliliters (ml)', value: `${mlVal.toFixed(1)} ml`, isPrimary: true },
          { label: 'Teaspoon (tsp)', value: `${tsp.toFixed(2)} tsp` },
          { label: 'Tablespoon (tbsp)', value: `${tbsp.toFixed(2)} tbsp` },
          { label: 'Cups metric', value: `${cups.toFixed(2)} cup` },
          { label: 'Fluid Ounces (fl oz)', value: `${floz.toFixed(2)} fl oz` }
        ]
      };
    }
  },
  {
    id: 'cook-food-cost',
    name: 'Dish Portion Cost Solver',
    slug: 'food-cost',
    category: 'daily-life',
    description: 'Calculate average recipe ingredient cost per individual serving portion.',
    seoTitle: 'Dish Portion Cost & Retail Solver | Calculatoora',
    seoDescription: 'Obtain average cost estimates per serving and suggest restaurant menu pricing based on raw ingredient costs.',
    inputs: [
      { id: 'totalMat', label: 'Total Ingredient Costs ($)', type: 'number', defaultValue: 18.5 },
      { id: 'servings', label: 'Servings Yielded', type: 'number', defaultValue: 4 },
      { id: 'targetCostPct', label: 'Desired Food Cost Percentage (%)', type: 'number', defaultValue: 30 }
    ],
    formula: 'Portion Cost = MaterialCost / Servings; Retail Price = PortionCost / (TargetPct / 100)',
    explanation: 'Calculating portion costs helps managers price restaurant menu items to cover overhead and maintain profitable margins.',
    example: 'An ingredient cost of $18.50 yielding 4 servings results in a $4.63 portion cost. Applying a 30% food cost target suggests a retail menu price of $15.42.',
    faq: [
      { question: 'What is a typical restaurant food cost percentage?', answer: 'Most restaurants aim to keep food costs between 28% and 35% of menu prices to remain profitable after paying labor and lease overhead.' }
    ],
    relatedSlugs: ['recipe-scaling', 'serving-size'],
    calculate: (inputs) => {
      const mat = Number(inputs.totalMat || 18.5);
      const serv = Number(inputs.servings || 4);
      const targetPct = Number(inputs.targetCostPct || 30);

      const portionCost = serv > 0 ? (mat / serv) : mat;
      const suggestedPrice = targetPct > 0 ? (portionCost / (targetPct / 100)) : portionCost;

      return {
        results: [
          { label: 'Raw Cost per Portion', value: `$${portionCost.toFixed(2)}`, isPrimary: true },
          { label: 'Suggested Menu Retail Price', value: `$${suggestedPrice.toFixed(2)}` },
          { label: 'Gross margin per portion sales', value: `$${(suggestedPrice - portionCost).toFixed(2)}` }
        ]
      };
    }
  },
  {
    id: 'cook-serving-size',
    name: 'Nutritional Serving Calculator',
    slug: 'serving-size',
    category: 'daily-life',
    description: 'Convert aggregate batch nutritional properties to single-serving portion values.',
    seoTitle: 'Portion Nutrition Serving Solver | Calculatoora',
    seoDescription: 'Evaluate single serving nutrition, fat weights, and sodium records from overall batch profiles.',
    inputs: [
      { id: 'batchCalories', label: 'Overall Batch Calories (kcal)', type: 'number', defaultValue: 1500 },
      { id: 'batchProtein', label: 'Overall Batch Protein (grams)', type: 'number', defaultValue: 60 },
      { id: 'servingYield', label: 'Portions yielded', type: 'number', defaultValue: 5 }
    ],
    formula: 'Serving kcal = Batch kcal / Serving count.',
    explanation: 'Converting batch nutritional stats to single servings is essential for tracking macro and micronutrients in home recipes.',
    example: 'A 1,500 kcal batch recipe split into 5 equal portions provides exactly 300 kcal and 12g of protein per serving.',
    faq: [
      { question: 'Does cooking reduce calorie counts?', answer: 'No. While ingredients may shrink in size (via water loss), calorie and macronutrient values remain standard throughout the cooking process.' }
    ],
    relatedSlugs: ['food-cost', 'recipe-scaling'],
    calculate: (inputs) => {
      const kcal = Number(inputs.batchCalories || 1500);
      const protein = Number(inputs.batchProtein || 60);
      const parts = Number(inputs.servingYield || 5);

      const pkcal = parts > 0 ? (kcal / parts) : kcal;
      const ppro = parts > 0 ? (protein / parts) : protein;

      return {
        results: [
          { label: 'Calories per Portion', value: `${pkcal.toFixed(0)} kcal`, isPrimary: true },
          { label: 'Protein per Portion', value: `${ppro.toFixed(1)} g` }
        ]
      };
    }
  },
  {
    id: 'fun-random-number-gen',
    name: 'Random Number Generator',
    slug: 'random-number-gen',
    category: 'daily-life',
    description: 'Generate high-quality random integers within customizable search thresholds.',
    seoTitle: 'Random Number & Integer Generator | Calculatoora',
    seoDescription: 'Generate truly random numbers or sequences of integers within custom min/max bounds locally.',
    inputs: [
      { id: 'minVal', label: 'Minimum boundary value', type: 'number', defaultValue: 1 },
      { id: 'maxVal', label: 'Maximum boundary value', type: 'number', defaultValue: 100 },
      { id: 'count', label: 'Numbers to Generate', type: 'number', defaultValue: 5 }
    ],
    formula: 'Random = Math.floor(Math.random() * (Max - Min + 1)) + Min',
    explanation: 'Uses browser-native, pseudo-random math arrays to return unbiased integer distributions.',
    example: 'Generating 5 numbers between 1 and 100 produces unbiased results, which are ideal for giveaways or random draws.',
    faq: [
      { question: 'Are these numbers cryptographically secure?', answer: 'This tool uses standard pseudo-random algorithms. For high-security purposes, use cryptographically secure web API primitives (e.g. crypto.getRandomValues).' }
    ],
    relatedSlugs: ['dice-roller-tool', 'coin-flip', 'random-choice'],
    calculate: (inputs) => {
      const min = Number(inputs.minVal || 1);
      const max = Number(inputs.maxVal || 100);
      const qty = Number(inputs.count || 5);

      if (min >= max) {
        return { results: [{ label: 'Random Output', value: 'Max must exceed Min', isPrimary: true }] };
      }

      const resultsList = [];
      for (let i = 0; i < qty; i++) {
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        resultsList.push(rand);
      }

      return {
        results: [
          { label: 'Generated Random Array', value: resultsList.join(', '), isPrimary: true },
          { label: 'Mean Average of generated subset', value: (resultsList.reduce((a, b) => a + b, 0) / qty).toFixed(1) }
        ]
      };
    }
  },
  {
    id: 'fun-dice-roller',
    name: 'Interactive Virtual Dice Roller',
    slug: 'dice-roller-tool',
    category: 'daily-life',
    description: 'Roll modern polyhedral game dice (D6, D20, D100) and track cumulative sums.',
    seoTitle: 'Interactive Polyhedral Dice Roller | Calculatoora',
    seoDescription: 'Roll virtual polyhedral RPG game dice (D6, D20, D100) and obtain unbiased, cumulative outcomes.',
    inputs: [
      { id: 'diceType', label: 'Choose Dice faces', type: 'select', defaultValue: '6', options: [
        { label: 'Standard D6 (6 Sides)', value: '6' },
        { label: 'D10 gaming dice (10 Sides)', value: '10' },
        { label: 'RPG D20 dice (20 Sides)', value: '20' },
        { label: 'D100 percenter (100 Sides)', value: '100' }
      ]},
      { id: 'qty', label: 'Dice count (Number of Dice)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Roll = Math.floor(Math.random() * Faces) + 1',
    explanation: 'Uses browser-native, pseudo-random math arrays to calculate cumulative outcome tallies, mimicking polyhedral gaming dice.',
    example: 'Rolling 3 6-sided dice (D6) yields results like [3, 5, 2] for a cumulative total of 10.',
    faq: [
      { question: 'What are polyhedral dice?', answer: 'Three-dimensional geometric shapes (ranging from 4 to 100 faces) used commonly in tabletop role-playing games.' }
    ],
    relatedSlugs: ['random-number-gen', 'coin-flip'],
    calculate: (inputs) => {
      const faces = Number(inputs.diceType || 6);
      const qty = Number(inputs.qty || 3);

      const rollsList = [];
      let total = 0;
      for (let i = 0; i < qty; i++) {
        const roll = Math.floor(Math.random() * faces) + 1;
        rollsList.push(roll);
        total += roll;
      }

      return {
        results: [
          { label: 'Cumulative Dice Sum', value: total, isPrimary: true },
          { label: 'Individual Rolls', value: rollsList.join(' , ') }
        ]
      };
    }
  },
  {
    id: 'fun-coin-flip',
    name: 'Virtual Coin Flipper',
    slug: 'coin-flip',
    category: 'daily-life',
    description: 'Perform virtual coin flips and track statistics for Heads and Tails.',
    seoTitle: 'Unbiased Virtual Coin Flipper | Calculatoora',
    seoDescription: 'Simulate virtual coin flips to make unbiased decisions and track outcome statistics.',
    inputs: [
      { id: 'flips', label: 'Flips count run', type: 'number', defaultValue: 10 }
    ],
    formula: 'Outcome = Math.random() < 0.50 ? Heads : Tails',
    explanation: 'Each coin flip represents an independent event with a 50% probability of landing on either heads or tails, serving as a simple way to resolve choices.',
    example: 'Flipping a virtual coin 10 times yields outcomes like 4 Heads (40%) and 6 Tails (60%).',
    faq: [
      { question: 'Can coin flips ever land perfectly on the edge?', answer: 'In physical models, yes, though the chance of a coin landing and staying on its edge is extremely rare (under 1 in 6,000 flips).' }
    ],
    relatedSlugs: ['random-number-gen', 'dice-roller-tool', 'random-choice'],
    calculate: (inputs) => {
      const countVal = Number(inputs.flips || 10);
      
      let heads = 0;
      let tails = 0;
      for (let i = 0; i < countVal; i++) {
        if (Math.random() < 0.5) heads++;
        else tails++;
      }

      return {
        results: [
          { label: 'Result Breakdown', value: `${heads} Heads | ${tails} Tails`, isPrimary: true },
          { label: 'Heads Share Ratio', value: `${((heads / countVal) * 100).toFixed(0)}%` },
          { label: 'Tails Share Ratio', value: `${((tails / countVal) * 100).toFixed(0)}%` }
        ],
        chartData: [
          { name: 'Heads', value: heads, color: '#39FF14' },
          { name: 'Tails', value: tails, color: '#de1c71' }
        ]
      };
    }
  },
  {
    id: 'fun-random-choice',
    name: 'Random Choice Selector',
    slug: 'random-choice',
    category: 'daily-life',
    description: 'Pick an unbiased winner from a comma-separated list of items.',
    seoTitle: 'Random Decision Picker Tool | Calculatoora',
    seoDescription: 'Unbias decisions by randomly picking a single item from a comma-separated list.',
    inputs: [
      { id: 'itemsList', label: 'Enter choices (comma separated)', type: 'text', defaultValue: 'Pizza, Sushi, Tacos, Burgers, Salad' }
    ],
    formula: 'Winner = Choices[Math.floor(Math.random() * ChoicesLength)]',
    explanation: 'An unbiased way to settle debates, pick winners for giveaways, or resolve simple group choices.',
    example: 'Selecting from "Pizza, Sushi, Tacos" randomly picks Tacos as the chosen choice.',
    faq: [
      { question: 'How is the choice randomized?', answer: 'The list is split by commas, cleaned of spaces, and selected using browser-native pseudo-random number indices.' }
    ],
    relatedSlugs: ['random-number-gen', 'coin-flip'],
    calculate: (inputs) => {
      const raw = inputs.itemsList || 'Pizza, Sushi, Tacos';
      const parts = raw.split(',').map(p => p.trim()).filter(Boolean);

      if (parts.length === 0) {
        return { results: [{ label: 'Picked Choice', value: 'Empty List', isPrimary: true }] };
      }

      const idx = Math.floor(Math.random() * parts.length);
      const picked = parts[idx];

      return {
        results: [
          { label: 'Picked Winner Option', value: picked, isPrimary: true },
          { label: 'Analyzed Options count', value: parts.length }
        ]
      };
    }
  },
  {
    id: 'fun-password-generator',
    name: 'Secure Password Generator',
    slug: 'password-generator',
    category: 'daily-life',
    description: 'Generate high-entropy, secure passwords to protect account security.',
    seoTitle: 'Random Password Generator Tool | Calculatoora',
    seoDescription: 'Generate custom secure, high-entropy passwords including special characters and numbers.',
    inputs: [
      { id: 'length', label: 'Password Character Length', type: 'range', defaultValue: 16, min: 8, max: 48, step: 1 },
      { id: 'includeSpecial', label: 'Include Special Characters (!@#$%)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No (Alphanumeric only)', value: 'no' }
      ]}
    ],
    formula: 'Entropy = Length * log2(AlphabetSize)',
    explanation: 'Creating strong, high-entropy passwords prevents dictionary attacks and unauthorized account access.',
    example: 'A 16-character alphanumeric password is extremely secure and virtually impossible to break using brute force.',
    faq: [
      { question: 'What makes a password strong?', answer: 'Length and character variety. Passwords with 16 characters mixing symbols and numbers are much stronger than short, complex codes.' }
    ],
    relatedSlugs: ['username-generator', 'hash-length'],
    calculate: (inputs) => {
      const len = Number(inputs.length || 16);
      const spec = inputs.includeSpecial || 'yes';

      const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

      let alphabet = letters + numbers;
      if (spec === 'yes') alphabet += symbols;

      let pw = '';
      for (let i = 0; i < len; i++) {
        pw += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      const entropy = len * Math.log2(alphabet.length);

      return {
        results: [
          { label: 'Generated Password Token', value: pw, isPrimary: true },
          { label: 'Cryptographic Entropy Score', value: `${Math.round(entropy)} bits` },
          { label: 'Suggested Safety Rating', value: len >= 12 ? 'Very Strong ✅' : 'Moderate 🟡' }
        ]
      };
    }
  },
  {
    id: 'fun-username-generator',
    name: 'Creative Username Generator',
    slug: 'username-generator',
    category: 'daily-life',
    description: 'Generate unique, modern usernames combining tech words and numeric suffixes.',
    seoTitle: 'Random Profile Username Generator | Calculatoora',
    seoDescription: 'Instantly generate unique username combinations for developers, gamers, and creator profiles.',
    inputs: [
      { id: 'themeWord', label: 'Profile Focus Theme', type: 'select', defaultValue: 'developer', options: [
        { label: 'Developer / Technical', value: 'dev' },
        { label: 'Sci-Fi / Space', value: 'space' },
        { label: 'Gaming / Esports', value: 'gaming' }
      ]},
      { id: 'numericSuffix', label: 'Add Numeric Suffix (1-99)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]}
    ],
    formula: 'Selection = RandomPrefix + RandomSuffix + OptionalDigits',
    explanation: 'Generates unique usernames by combining creative prefixes and suffixes based on your selected profile theme.',
    example: 'Selecting "Developer" with a suffix might generate usernames like "CodeNova85".',
    faq: [
      { question: 'Are these usernames checked for platform availability?', answer: 'No. Platform availability must be verified manually on individual social and developer networks.' }
    ],
    relatedSlugs: ['password-generator', 'random-choice'],
    calculate: (inputs) => {
      const spec = inputs.themeWord || 'dev';
      const num = inputs.numericSuffix || 'yes';

      let prefixes: string[] = [];
      let suffixes: string[] = [];

      if (spec === 'dev') {
        prefixes = ['Code', 'Stack', 'Byte', 'Kernel', 'Bit', 'Logic', 'Algor', 'Node'];
        suffixes = ['Vortex', 'Dev', 'Craft', 'Flow', 'Forge', 'Mind', 'Scripter', 'Loop'];
      } else if (spec === 'space') {
        prefixes = ['Cosmo', 'Astro', 'Solar', 'Nova', 'Nebula', 'Orion', 'Pulse', 'Lunar'];
        suffixes = ['Rover', 'Voyage', 'Orbit', 'Flare', 'Horizon', 'Core', 'Vanguard', 'Apex'];
      } else {
        prefixes = ['Alpha', 'Shadow', 'Apex', 'Phantom', 'Neo', 'Gamer', 'Legacy', 'Saber'];
        suffixes = ['Strike', 'Hunter', 'Helix', 'Nexus', 'Gamer', 'Pro', 'Evolve', 'Pulse'];
      }

      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      const valDigits = num === 'yes' ? Math.floor(Math.random() * 98) + 1 : '';

      return {
        results: [
          { label: 'Generated Profile Handle', value: `${p}${s}${valDigits}`, isPrimary: true },
          { label: 'Option alternative profile', value: `${s}_${p}` }
        ]
      };
    }
  }
];
