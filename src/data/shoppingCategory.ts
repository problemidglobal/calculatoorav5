import { Calculator } from '../types';

export const SHOPPING_CALCULATORS: Calculator[] = [
  {
    id: 'sale-price-calculator',
    name: 'Sale Price Calculator',
    slug: 'sale-price-calculator',
    category: 'daily-life',
    description: 'Calculate marked-down sales prices and raw cash savings during major shopping promotions.',
    seoTitle: 'Retail Sale Price & Markdown Calculator | Calculatoora',
    seoDescription: 'Obtain final sales tag valuations inside retail environments. Save time figuring discounts with our online calculator.',
    inputs: [
      { id: 'original', label: 'Item Original Retail price', type: 'number', defaultValue: 80, step: 1, unit: '$' },
      { id: 'discount', label: 'Discount percentage (%)', type: 'number', defaultValue: 30, step: 5, unit: '%' }
    ],
    formula: 'Sale Price = Original Price * (1 - Discount / 100)\nSavings = Original Price - Sale Price',
    explanation: 'Quickly find how much cash stays in your wallet during percent-off store events.',
    example: 'A $80.00 designer shirt marked down by 30% yields a final sale price of $56.00, saving you exactly $24.00.',
    faq: [
      { question: 'What is a double markdown discount?', answer: 'Stores sometimes apply a secondary clearance discount (e.g. extra 10% off) on top of an already discounted price rather than summing them directly to 40%.' }
    ],
    relatedSlugs: ['coupon-savings-calculator', 'discount-calculator-advanced', 'price-difference-calculator'],
    calculate: (inputs) => {
      const orig = Number(inputs.original) || 0;
      const disc = Number(inputs.discount) || 0;

      const savings = orig * (disc / 100);
      const sale = orig - savings;

      return {
        results: [
          { label: 'Discounted Sale Price', value: sale.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Your Absolute Cash Savings', value: savings.toFixed(2), unit: '$' },
          { label: 'Reference Original Price', value: orig.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Your Cash Paid', value: Math.round(sale), color: '#39FF14' },
          { name: 'Discount Dollars Saved', value: Math.round(savings), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'discount-percentage-calculator',
    name: 'Discount Percentage Calculator',
    slug: 'discount-percentage-calculator',
    category: 'daily-life',
    description: 'Solve for the missing discount percentage when knowing the original pricing tag and final sale price.',
    seoTitle: 'Find Discount Percentage Calculator | Calculatoora',
    seoDescription: 'Calculate the accurate discount percentage of any coupon or sale markdown. Enter starting and ending product costs.',
    inputs: [
      { id: 'original', label: 'Original Pricing Tag Value', type: 'number', defaultValue: 150, step: 5, unit: '$' },
      { id: 'sale', label: 'Promotional Sale Price Paid', type: 'number', defaultValue: 105, step: 5, unit: '$' }
    ],
    formula: 'Discount % = [ (Original - Sale) / Original ] * 100',
    explanation: 'Find exactly what percentage reduction you are receiving on any retail product transaction.',
    example: 'Buying a $150 premium suitcase on promotion for $105 means you secured a 30.0% discount.',
    faq: [
      { question: 'Why verify discount percentages?', answer: 'Retail outlets sometimes inflate normal pricing anchors to exaggerate discount percentages. Evaluating actual savings relative to market rates prevents impulse spending.' }
    ],
    relatedSlugs: ['sale-price-calculator', 'discount-calculator-advanced', 'price-difference-calculator'],
    calculate: (inputs) => {
      const orig = Number(inputs.original) || 1;
      const sale = Number(inputs.sale) || 0;

      const diff = Math.max(0, orig - sale);
      const pct = (diff / orig) * 100;

      return {
        results: [
          { label: 'Discount Percentage Secured', value: pct.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Absolute Dollars Saved', value: diff.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Amount Paid', value: sale, color: '#312e81' },
          { name: 'Savings Amount', value: Math.round(diff), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'coupon-savings-calculator',
    name: 'Coupon Savings Calculator',
    slug: 'coupon-savings-calculator',
    category: 'daily-life',
    description: 'Calculate net transaction totals when applying dollar-off or percentage discount coupons.',
    seoTitle: 'Coupon Code checkout Calculator | Calculatoora',
    seoDescription: 'Accurately model coupon savings during checkouts. Choose flat deductions or percentage vouchers.',
    inputs: [
      { id: 'bill', label: 'Shopping Cart Subtotal', type: 'number', defaultValue: 120, step: 5, unit: '$' },
      { id: 'couponType', label: 'Coupon Deduction Mode', type: 'select', defaultValue: 'percent', options: [
        { label: 'Percentage Off (%)', value: 'percent' },
        { label: 'Flat Cash Off ($)', value: 'cash' }
      ]},
      { id: 'value', label: 'Coupon Magnitude Value', type: 'number', defaultValue: 15, step: 1 }
    ],
    formula: 'Cash Discount: Bill - Coupon Value\nPercent Discount: Bill - (Bill * Coupon Value / 100)',
    explanation: 'Helps online and physically situated supermarket shoppers compare different stackable or singular coupon codes.',
    example: 'Applying an 15% promotional code to an $120.00 subtotal slices the price down to $102.00, achieving $18.00 in absolute savings.',
    faq: [
      { question: 'Should I pick percent off or cash off?', answer: 'For large transactions, percentage off is usually superior. For minor shopping runs, flat cash deductions can yield higher percentage discounts.' }
    ],
    relatedSlugs: ['sale-price-calculator', 'discount-calculator-advanced', 'price-difference-calculator'],
    calculate: (inputs) => {
      const bill = Number(inputs.bill) || 0;
      const type = inputs.couponType || 'percent';
      const val = Number(inputs.value) || 0;

      let savings = 0;
      if (type === 'percent') {
        savings = bill * (val / 100);
      } else {
        savings = Math.min(bill, val);
      }

      const total = Math.max(0, bill - savings);

      return {
        results: [
          { label: 'Net Checkout Bill', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Coupon Savings Realized', value: savings.toFixed(2), unit: '$' },
          { label: 'Original Cart Subtotal', value: bill.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Post-Coupon Cart Balance', value: Math.round(total), color: '#39FF14' },
          { name: 'Coupon Savings', value: Math.round(savings), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'tax-included-price-calculator',
    name: 'Tax Included Price Calculator',
    slug: 'tax-included-price-calculator',
    category: 'daily-life',
    description: 'Calculate gross checkout sums inclusive of local sales taxes, or extract pre-tax prices.',
    seoTitle: 'Post-Tax Shopping Cart Calculator | Calculatoora',
    seoDescription: 'Obtain tax inclusive or pre-tax prices instantly. Supports robust consumer budgeting.',
    inputs: [
      { id: 'price', label: 'Item Retail Price', type: 'number', defaultValue: 100, step: 5, unit: '$' },
      { id: 'tax', label: 'Tax Rate (%)', type: 'number', defaultValue: 8.5, step: 0.1, unit: '%' }
    ],
    formula: 'Inclusive Price = Pre-tax Price * (1 + Tax / 100)',
    explanation: 'Shopping in different US states adds variable sales taxes at checkout. Knowing post-tax prices secures accurate shopping limits.',
    example: 'An $100.00 tag in a district with 8.5% sales tax costs $108.50 at checkout, representing $8.50 in tax.',
    faq: [
      { question: 'Does are some goods exempt from taxes?', answer: 'Yes, most states do not tax raw groceries or specific basic medication items.' }
    ],
    relatedSlugs: ['sales-tax-calculator', 'sale-price-calculator', 'gst-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.price) || 0;
      const taxRate = Number(inputs.tax) || 0;

      const taxAmount = p * (taxRate / 100);
      const total = p + taxAmount;

      return {
        results: [
          { label: 'Total Post-Tax final price', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Paid Sales Tax dollars', value: taxAmount.toFixed(2), unit: '$' },
          { label: 'Base Pre-tax Price', value: p.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Item Price', value: p, color: '#39FF14' },
          { name: 'Checkout Sales Tax', value: Math.round(taxAmount), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'price-difference-calculator',
    name: 'Price Difference Calculator',
    slug: 'price-difference-calculator',
    category: 'daily-life',
    description: 'Input prices and packaging ounce/gram sizes of two products to see which offers the cheaper price per unit.',
    seoTitle: 'Supermarket Unit Price Compare Calculator | Calculatoora',
    seoDescription: 'Find the cheaper package deals in grocery stores. Compares unit cost across variable ounce, gram, or pound values.',
    inputs: [
      { id: 'priceA', label: 'Product A Price', type: 'number', defaultValue: 5.99, step: 0.01, unit: '$' },
      { id: 'sizeA', label: 'Product A Pack Size (e.g. oz or g)', type: 'number', defaultValue: 16, step: 1 },
      { id: 'priceB', label: 'Product B Price', type: 'number', defaultValue: 8.49, step: 0.01, unit: '$' },
      { id: 'sizeB', label: 'Product B Pack Size (e.g. oz or g)', type: 'number', defaultValue: 24, step: 1 }
    ],
    formula: 'Unit Cost = Product Price / Pack Size',
    explanation: 'Bulk items are not always cheaper. Comparing price-per-ounce metrics reveals deceptive packaging practices.',
    example: 'Product A at 16oz for $5.99 costs $0.37/oz. Product B at 24oz for $8.49 costs $0.35/oz, making Product B 5.9% cheaper per unit and saving you money.',
    faq: [
      { question: 'What is a unit price?', answer: 'A unit price is the cost of a single unit of measurement (such as an ounce, pound, or gram) of an item, making it easy to compare different package sizes.' }
    ],
    relatedSlugs: ['sale-price-calculator', 'discount-percentage-calculator', 'coupon-savings-calculator'],
    calculate: (inputs) => {
      const pA = Number(inputs.priceA) || 0;
      const sA = Number(inputs.sizeA) || 1;
      const pB = Number(inputs.priceB) || 0;
      const sB = Number(inputs.sizeB) || 1;

      const unitA = pA / sA;
      const unitB = pB / sB;

      const cheaperAStr = unitA < unitB ? 'Product A is cheaper!' : (unitB < unitA ? 'Product B is cheaper!' : 'Both have equal unit price!');
      const percentageDiff = Math.abs((unitA - unitB) / Math.max(unitA, unitB)) * 100;

      return {
        results: [
          { label: 'Unit Analysis Winner', value: cheaperAStr, unit: 'WINNER', isPrimary: true },
          { label: 'Product A Unit price', value: unitA.toFixed(4), unit: 'per unit' },
          { label: 'Product B Unit price', value: unitB.toFixed(4), unit: 'per unit' },
          { label: 'Value Spread difference', value: percentageDiff.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Product A Unit Cost', value: Math.round(unitA * 1000), color: '#ef4444' },
          { name: 'Product B Unit Cost', value: Math.round(unitB * 1000), color: '#39FF14' }
        ]
      };
    }
  }
];
