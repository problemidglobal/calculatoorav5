import { Calculator } from '../types';

export const WEB_DEV_CALCULATORS: Calculator[] = [
  {
    id: 'web-website-cost',
    name: 'Website Cost Estimator',
    slug: 'website-cost',
    category: 'programming',
    description: 'Calculate development cost ranges based on page layout count, design requirements, and custom feature sets.',
    seoTitle: 'Website Development Cost Calculator | Calculatoora',
    seoDescription: 'Obtain instant design and development estimates for websites based on page counts, e-commerce integrations, CMS setups, and developer rates.',
    inputs: [
      { id: 'pages', label: 'Number of Custom Pages', type: 'number', defaultValue: 5 },
      { id: 'designType', label: 'Design Style Complexity', type: 'select', defaultValue: 'custom-template', options: [
        { label: 'Basic Theme Layout ($40/page)', value: 'basic' },
        { label: 'Custom Tailored Design ($120/page)', value: 'custom-template' },
        { label: 'High-Fidelity Branded UI/UX ($250/page)', value: 'branded' }
      ]},
      { id: 'features', label: 'E-Commerce Integrations', type: 'select', defaultValue: 'none', options: [
        { label: 'No Store Requirements ($0)', value: 'none' },
        { label: 'Simple Store - up to 20 products ($500)', value: 'simple' },
        { label: 'Enterprise Complex E-Shop ($2500)', value: 'enterprise' }
      ]},
      { id: 'rate', label: 'Developer Hour Rate ($)', type: 'number', defaultValue: 75 }
    ],
    formula: 'Cost = (Pages * DesignRate) + FeatureSet + (EstimatedHours * DevHourRate)',
    explanation: 'Website budget planning relies on structural page volumes and engineering complexity. Custom designs require design passes, increasing hours.',
    example: 'A 5-page custom templated site ($600) with a simple e-commerce setup ($500) and 20 developer hours at $75/hr evaluates to a $2600 budget.',
    faq: [
      { question: 'Why does Custom Branded UI cost more?', answer: 'Branded layouts require custom Figma designs, high-end motion animations, and iterative feedback cycles, increasing development time.' }
    ],
    relatedSlugs: ['website-loading', 'image-size-calc'],
    calculate: (inputs) => {
      const pages = Number(inputs.pages || 5);
      const style = inputs.designType || 'custom-template';
      const ecommerce = inputs.features || 'none';
      const baseHourRate = Number(inputs.rate || 75);

      // Resolve design weights
      let designRate = 120;
      let estHoursPerPage = 6;
      if (style === 'basic') {
        designRate = 40;
        estHoursPerPage = 3;
      } else if (style === 'branded') {
        designRate = 250;
        estHoursPerPage = 12;
      }

      // Feature pricing
      let featureCost = 0;
      let featureHours = 0;
      if (ecommerce === 'simple') {
        featureCost = 500;
        featureHours = 10;
      } else if (ecommerce === 'enterprise') {
        featureCost = 2500;
        featureHours = 40;
      }

      const totalDesignCost = pages * designRate;
      const totalDevHours = (pages * estHoursPerPage) + featureHours;
      const totalLabourCost = totalDevHours * baseHourRate;
      const totalBudget = totalDesignCost + featureCost + totalLabourCost;

      return {
        results: [
          { label: 'Estimated Project Budget', value: `$${totalBudget.toLocaleString()}`, isPrimary: true },
          { label: 'Design & UX Mockups Cost', value: `$${totalDesignCost.toLocaleString()}` },
          { label: 'Engineering Implementation Hours', value: `${totalDevHours} hrs` },
          { label: 'Developer Labour Cost', value: `$${totalLabourCost.toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'web-website-loading',
    name: 'Website Load Time Analyzer',
    slug: 'website-loading',
    category: 'programming',
    description: 'Calculate page loading ratios based on specific asset weights and user connection speeds.',
    seoTitle: 'Web Page Load and Speed Estimator | Calculatoora',
    seoDescription: 'Estimate loading duration and performance score predictions based on aggregate asset weights (HTML, JS, CSS, Images).',
    inputs: [
      { id: 'htmlKb', label: 'HTML Size (kB)', type: 'number', defaultValue: 45 },
      { id: 'jsKb', label: 'JavaScript Bundles (kB)', type: 'number', defaultValue: 320 },
      { id: 'cssKb', label: 'CSS Stylesheets (kB)', type: 'number', defaultValue: 65 },
      { id: 'imgKb', label: 'Images / Assets weight (kB)', type: 'number', defaultValue: 1200 },
      { id: 'connection', label: 'User Network Speed', type: 'select', defaultValue: '4g', options: [
        { label: 'Fast 3G Mobile (1.6 Mbps)', value: '1.6' },
        { label: 'Standard 4G Mobile (12 Mbps)', value: '12' },
        { label: 'High-speed Fiber (100 Mbps)', value: '100' }
      ]}
    ],
    formula: 'Load Time = Total Payload size in bits / Connection Speed in bps + Latency penalty.',
    explanation: 'Page load speed impacts bounce rates and SEO ranking. Offloading unused JavaScript and formatting images reduces critical path latency.',
    example: 'Loading 1630 kB of payloads on a 12 Mbps 4G connection with a latency penalty takes approximately 1.5 seconds.',
    faq: [
      { question: 'What is the critical rendering path?', answer: 'The sequence of steps the browser takes to convert HTML, CSS, and JS into visible pixels on the screen.' }
    ],
    relatedSlugs: ['website-cost', 'image-compression-ratio', 'js-size'],
    calculate: (inputs) => {
      const html = Number(inputs.htmlKb || 45);
      const js = Number(inputs.jsKb || 320);
      const css = Number(inputs.cssKb || 65);
      const img = Number(inputs.imgKb || 1200);
      const speedMbps = Number(inputs.connection || 12);

      const totalKb = html + js + css + img;
      const totalBits = totalKb * 8 * 1000; // kB to bits

      const speedBps = speedMbps * 1000000;
      const transferSecs = speedBps > 0 ? (totalBits / speedBps) : 0;
      
      // Add latency penalty based on performance thresholds
      const latencyPenalty = speedMbps < 5 ? 0.35 : 0.08;
      const overallLoadTime = transferSecs + latencyPenalty;

      // Score calculation
      let score = 100 - (overallLoadTime * 15);
      if (score < 10) score = 10;
      if (score > 99) score = 99;

      return {
        results: [
          { label: 'Estimated Page Load Time', value: `${overallLoadTime.toFixed(2)} seconds`, isPrimary: true },
          { label: 'Combined Page Weight', value: `${(totalKb / 1000).toFixed(2)} MB` },
          { label: 'Performance Speed Score', value: `${score.toFixed(0)} / 100` }
        ],
        chartData: [
          { name: 'JavaScript Bundle', value: js, color: '#f59e0b' },
          { name: 'Images & Assets', value: img, color: '#10b981' },
          { name: 'HTML & CSS Styles', value: html + css, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'web-image-size-calc',
    name: 'Uncompressed Image Size Calculator',
    slug: 'image-size-calc',
    category: 'programming',
    description: 'Calculate uncompressed raw bitmap file size based on image dimensions and bit depth.',
    seoTitle: 'Raw Bitmap Image Size solver | Calculatoora',
    seoDescription: 'Calculate target raw uncompressed bitmap file weight in bytes or megabytes based on width, height, and color channels.',
    inputs: [
      { id: 'width', label: 'Image Width (pixels)', type: 'number', defaultValue: 1920 },
      { id: 'height', label: 'Image Height (pixels)', type: 'number', defaultValue: 1080 },
      { id: 'bitDepth', label: 'Color Format / Depth', type: 'select', defaultValue: '24', options: [
        { label: '8-bit Grayscale (1 byte/p)', value: '8' },
        { label: '16-bit High Color (2 bytes/p)', value: '16' },
        { label: '24-bit True Color RGB (3 bytes/p)', value: '24' },
        { label: '32-bit Deep Color RGBA (4 bytes/p)', value: '32' }
      ]}
    ],
    formula: 'Size = Width * Height * (BitDepth / 8)',
    explanation: 'Uncompressed image sizes represent raw GPU memory footprints before compression algorithms (PNG, Jpeg, WebP) are applied.',
    example: 'A Full HD image (1920 x 1080) in 24-bit True Color occupies exactly 6.22 Megabytes of raw system memory.',
    faq: [
      { question: 'Why are compressed PNGs smaller?', answer: 'PNG uses DEFLATE compression to compress repeating color sequences, reducing size while maintaining lossless quality.' }
    ],
    relatedSlugs: ['image-compression-ratio', 'website-loading'],
    calculate: (inputs) => {
      const w = Number(inputs.width || 1920);
      const h = Number(inputs.height || 1080);
      const depth = Number(inputs.bitDepth || 24);

      const totalPixels = w * h;
      const bytes = totalPixels * (depth / 8);
      const kb = bytes / 1024;
      const mb = kb / 1024;

      return {
        results: [
          { label: 'Raw Uncompressed Size', value: `${mb.toFixed(2)} MB`, isPrimary: true },
          { label: 'Resolution Count', value: `${(totalPixels / 1000000).toFixed(2)} Megapixels` },
          { label: 'Octet Bytes Count', value: `${bytes.toLocaleString()} Bytes` }
        ]
      };
    }
  },
  {
    id: 'web-image-compression',
    name: 'Image Compression Ratio Calculator',
    slug: 'image-compression-ratio',
    category: 'programming',
    description: 'Evaluate compression efficiency and data savings between original and compressed image files.',
    seoTitle: 'Image Compression Ratio & Savings Meter | Calculatoora',
    seoDescription: 'Obtain compression ratios and total storage byte reductions based on raw and compressed image file sizes.',
    inputs: [
      { id: 'orig', label: 'Original File Size (MB)', type: 'number', defaultValue: 6.2 },
      { id: 'comp', label: 'Compressed File Size (MB)', type: 'number', defaultValue: 0.45 }
    ],
    formula: 'Ratio = Original_Size / Compressed_Size; Savings = (1 - (Compressed_Size / Original_Size)) * 100',
    explanation: 'Compression ratio calculations show how effectively encoders reduce image redundancy while preserving visual detail.',
    example: 'Compressing a 6.2 MB raw photo to a lightweight 0.45 MB JPEG delivers a 13.8:1 compression ratio with 92.7% space savings.',
    faq: [
      { question: 'What is lossy vs lossless compression?', answer: 'Lossy (JPEG, WebP) removes less perceptible color detail to gain file size. Lossless (PNG) compresses data reversibly without any loss of quality.' }
    ],
    relatedSlugs: ['image-size-calc', 'website-loading'],
    calculate: (inputs) => {
      const orig = Number(inputs.orig || 6.2);
      const comp = Number(inputs.comp || 0.45);

      if (comp <= 0 || orig <= 0) {
        return {
          results: [{ label: 'Compression Ratio', value: 'Values must exceed 0', isPrimary: true }]
        };
      }

      const ratio = orig / comp;
      const savings = (1 - (comp / orig)) * 100;

      return {
        results: [
          { label: 'Compression Savings', value: `${savings.toFixed(1)}%`, isPrimary: true },
          { label: 'Compression Ratio', value: `${ratio.toFixed(1)}:1` },
          { label: 'Recovered Disk Space', value: `${(orig - comp).toFixed(2)} MB` }
        ],
        chartData: [
          { name: 'Compressed Size', value: comp, color: '#39FF14' },
          { name: 'Storage Saved', value: orig - comp, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'web-responsive-screen',
    name: 'Screen Aspect Ratio Calculator',
    slug: 'responsive-screen',
    category: 'programming',
    description: 'Calculate screen aspect ratios and find corresponding responsive CSS containers.',
    seoTitle: 'Responsive Screen & Aspect Ratio Solver | Calculatoora',
    seoDescription: 'Find proportional aspect ratios (16:9, 4:3, 21:9) and CSS clamp/padding values for responsive media containers.',
    inputs: [
      { id: 'w', label: 'Monitor Pixel Width', type: 'number', defaultValue: 1440 },
      { id: 'h', label: 'Monitor Pixel Height', type: 'number', defaultValue: 900 }
    ],
    formula: 'Aspect Ratio = Simplified fraction of Width / Height.',
    explanation: 'Responsive layouts use aspect ratios to maintain consistent element proportions across diverse desktop and mobile screens.',
    example: 'A physical resolution of 1440 x 900 pixels simplifies to an aspect ratio of 16:10.',
    faq: [
      { question: 'What is modern standard padding-top aspect ratio hack?', answer: 'For older browsers without CSS aspect-ratio properties, padding-top: 56.25% maintains a responsive 16:9 box container ratio.' }
    ],
    relatedSlugs: ['css-unit-converter', 'pixel-converter'],
    calculate: (inputs) => {
      const w = Number(inputs.w || 1440);
      const h = Number(inputs.h || 900);

      const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
      };

      const devGcd = gcd(w, h);
      const simplerWidth = devGcd > 0 ? (w / devGcd) : w;
      const simplerHeight = devGcd > 0 ? (h / devGcd) : h;

      const paddingPercent = w > 0 ? (h / w) * 100 : 0;

      return {
        results: [
          { label: 'Simplified Aspect Ratio', value: `${simplerWidth}:${simplerHeight}`, isPrimary: true },
          { label: 'Aspect decimal quotient', value: (w / h).toFixed(3) },
          { label: 'CSS Padding-Top Ratio Box Hack', value: `${paddingPercent.toFixed(2)}%` }
        ]
      };
    }
  },
  {
    id: 'web-css-unit-converter',
    name: 'CSS Aspect & Unit Converter',
    slug: 'css-unit-converter',
    category: 'programming',
    description: 'Convert base pixels (px) into scalable CSS layout units (REM, EM, VW, VH).',
    seoTitle: 'CSS Units & Scalable REM / EM Solver | Calculatoora',
    seoDescription: 'Transform layout pixels into scalable modern CSS units, maintaining responsive layouts.',
    inputs: [
      { id: 'pixels', label: 'Input Layout Pixels (px)', type: 'number', defaultValue: 32 },
      { id: 'fontSize', label: 'Root Font Size (standard is 16px)', type: 'number', defaultValue: 16 },
      { id: 'viewportW', label: 'Viewport Width (px)', type: 'number', defaultValue: 1920 },
      { id: 'viewportH', label: 'Viewport Height (px)', type: 'number', defaultValue: 1080 }
    ],
    formula: 'REM = Pixels / RootSize; VW = (Pixels / ViewportW) * 100',
    explanation: 'Scalable units (REM, EM) automatically adapt when users change their default browser font sizes, improving website accessibility.',
    example: 'An input value of 32px translates to exactly 2.00 REM under standard 16px root font parameters.',
    faq: [
      { question: 'What is the key difference between EM and REM?', answer: 'REM is relative to the root (html) font size, while EM is relative to the element’s immediate parent font size.' }
    ],
    relatedSlugs: ['rem-converter', 'em-converter', 'pixel-converter'],
    calculate: (inputs) => {
      const px = Number(inputs.pixels || 32);
      const base = Number(inputs.fontSize || 16);
      const vw = Number(inputs.viewportW || 1920);
      const vh = Number(inputs.viewportH || 1080);

      const remVal = base > 0 ? (px / base) : 0;
      const vwVal = vw > 0 ? (px / vw) * 100 : 0;
      const vhVal = vh > 0 ? (px / vh) * 100 : 0;

      return {
        results: [
          { label: 'REM scalings', value: `${remVal.toFixed(3)} rem`, isPrimary: true },
          { label: 'EM parent scalings', value: `${remVal.toFixed(3)} em` },
          { label: 'Viewport Width (VW) Equivalent', value: `${vwVal.toFixed(3)} vw` },
          { label: 'Viewport Height (VH) Equivalent', value: `${vhVal.toFixed(3)} vh` }
        ]
      };
    }
  },
  {
    id: 'web-pixel-converter',
    name: 'Pixels to Physical Inches Converter',
    slug: 'pixel-converter',
    category: 'programming',
    description: 'Convert layout pixels to physical screen inches based on target screen PPI parameters.',
    seoTitle: 'Pixels to Real World Inches PPI Solver | Calculatoora',
    seoDescription: 'Transform pixel values to real-world inches (or mm/cm) based on custom PPI and DPI configurations.',
    inputs: [
      { id: 'px', label: 'Layout Pixels (px)', type: 'number', defaultValue: 300 },
      { id: 'ppi', label: 'Screen Density (PPI / DPI)', type: 'number', defaultValue: 96 }
    ],
    formula: 'Inches = Pixels / PPI; Centimeters = Inches * 2.54',
    explanation: 'Screen resolution determines physical pixel density. High-density screens (like Retina displays) contain more pixels per inch, resulting in sharper visuals.',
    example: 'An input of 300px on a standard 96 PPI workspace monitor translates to 3.125 inches of physical display space.',
    faq: [
      { question: 'What is PPI?', answer: 'Pixels Per Inch. It measures display pixel density, indicating how sharp images and text will render on a physical screen.' }
    ],
    relatedSlugs: ['css-unit-converter', 'responsive-screen'],
    calculate: (inputs) => {
      const px = Number(inputs.px || 300);
      const ppi = Number(inputs.ppi || 96);

      const inches = ppi > 0 ? (px / ppi) : 0;
      const cm = inches * 2.54;
      const mm = cm * 10;

      return {
        results: [
          { label: 'Physical Inches', value: `${inches.toFixed(3)} in`, isPrimary: true },
          { label: 'Centimeters Equivalent', value: `${cm.toFixed(3)} cm` },
          { label: 'Millimeters Equivalent', value: `${mm.toFixed(1)} mm` }
        ]
      };
    }
  },
  {
    id: 'web-rem-converter',
    name: 'REM to Pixel Easy Converter',
    slug: 'rem-converter',
    category: 'programming',
    description: 'Quickly convert relative REM units back to browser pixel values based on font configurations.',
    seoTitle: 'REM to Pixels Conversions Solver | Calculatoora',
    seoDescription: 'Quickly convert REM values back to physical pixels based on custom web root typography sizes.',
    inputs: [
      { id: 'rem', label: 'Value (rem)', type: 'number', defaultValue: 1.5 },
      { id: 'base', label: 'Base Root Setting (px)', type: 'number', defaultValue: 16 }
    ],
    formula: 'Pixels = REM * BaseRoot',
    explanation: 'Converting REM measurements back to standard pixels is essential for verifying matching designs in tools like Figma.',
    example: 'Converting 1.5rem under standard 16px root settings yields exactly 24 pixels.',
    faq: [
      { question: 'Why use REM instead of absolute px?', answer: 'REM units allow layout scales to adapt dynamically when users adjust their default browser zoom settings, improving accessibility.' }
    ],
    relatedSlugs: ['em-converter', 'css-unit-converter'],
    calculate: (inputs) => {
      const rem = Number(inputs.rem || 1.5);
      const base = Number(inputs.base || 16);
      const px = rem * base;

      return {
        results: [
          { label: 'Equivalent Pixels', value: `${px.toFixed(1)} px`, isPrimary: true },
          { label: 'Double scale px (e.g. mobile HD)', value: `${(px * 2).toFixed(0)} px` }
        ]
      };
    }
  },
  {
    id: 'web-em-converter',
    name: 'EM to Pixel Relative Converter',
    slug: 'em-converter',
    category: 'programming',
    description: 'Convert localized EM values back to pixels based on parent element typography settings.',
    seoTitle: 'EM to Pixels Relative Conversions Solver | Calculatoora',
    seoDescription: 'Convert EM units to pixels based on relative parent element font sizes.',
    inputs: [
      { id: 'em', label: 'Value (em)', type: 'number', defaultValue: 1.25 },
      { id: 'parentPx', label: 'Parent Element Font Size (px)', type: 'number', defaultValue: 20 }
    ],
    formula: 'Pixels = EM * ParentFontSize',
    explanation: 'EM units scale relative to their parent element’s font size, making them ideal for localized padding, margins, and nested lists.',
    example: 'An input value of 1.25 em within a parent container configured at 20px yields 25 standard pixels.',
    faq: [
      { question: 'Do EM nesting chains cause compounding scaling?', answer: 'Yes. Nesting EM elements can cause text to become progressively larger or smaller because each child’s font size scales relative to its parent.' }
    ],
    relatedSlugs: ['rem-converter', 'css-unit-converter'],
    calculate: (inputs) => {
      const em = Number(inputs.em || 1.25);
      const parent = Number(inputs.parentPx || 20);
      const px = em * parent;

      return {
        results: [
          { label: 'Resolved absolute layout pixels', value: `${px.toFixed(1)} px`, isPrimary: true },
          { label: 'One level nested child equivalent', value: `${(px * em).toFixed(1)} px` }
        ]
      };
    }
  }
];
