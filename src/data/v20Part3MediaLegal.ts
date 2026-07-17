import { Calculator } from '../types';

export const V20_PART3_CALCULATORS: Calculator[] = [
  // ====================================== PHOTOGRAPHY PROFESSIONAL ======================================
  {
    id: 'lens-calculator',
    name: 'Camera Lens Focal Length Calculator',
    slug: 'lens-calculator',
    category: 'photography',
    description: 'Calculate equivalent focal lengths and fields of view across different camera sensor crop factors.',
    formula: 'Equivalent Focal Length = Physical Focal Length * Crop Factor of Sensor',
    explanation: 'Helps photographers translate focal lengths between APS-C, Micro Four Thirds, and full-frame standard 35mm formats to match equivalent angles of view.',
    example: 'A 50mm physical prime lens mounted on an APS-C camera (1.5x crop factor) has an equivalent focal reach of 75mm.',
    inputs: [
      { id: 'focalLength', label: 'Physical Lens Focal Length (mm)', type: 'number', defaultValue: 50, min: 1, max: 2000 },
      { id: 'sensorType', label: 'Camera Sensor Format', type: 'select', defaultValue: 'aps-c-sony', options: [
        { label: 'Full Frame (35mm) (1.0x Shift)', value: '1.0' },
        { label: 'APS-C Sony/Fuji/Nikon (1.5x Crop)', value: '1.5' },
        { label: 'APS-C Canon (1.6x Crop)', value: '1.6' },
        { label: 'Micro Four Thirds (MFT) (2.0x Crop)', value: '2.0' },
        { label: 'Medium Format (0.79x Crop)', value: '0.79' }
      ]}
    ],
    faq: [
      { question: 'Why does crop factor impact focal length?', answer: 'The crop factor represents the ratio of a camera sensor\'s diagonal dimensions relative to a standard 35mm full frame sensor. Smaller sensors capture a cropped portion of the lens image circle, narrow the field of view, creating a simulated telephoto reach.' }
    ],
    relatedSlugs: ['depth-of-field', 'exposure-calculator', 'shutter-speed'],
    seoTitle: 'Equivalent Lens Focal Length & Crop Factor Calculator | Photography',
    seoDescription: 'Accurately convert lens focal lengths from APS-C, Canon and Micro Four Thirds sensors into classic 35mm full-frame equivalent standards.',
    calculate: (inputs) => {
      const fl = Number(inputs.focalLength || 50);
      const crop = Number(inputs.sensorType || '1.5');

      const equivalentFl = fl * crop;
      const verticalAov = 2 * Math.atan(24 / (2 * equivalentFl)) * (180 / Math.PI); // approx vertical
      const horizontalAov = 2 * Math.atan(36 / (2 * equivalentFl)) * (180 / Math.PI); // approx horizontal

      return {
        results: [
          { label: '35mm Equivalent Focal Length', value: `${equivalentFl.toFixed(1)} mm`, isPrimary: true },
          { label: 'Horizontal Angle of View (AOV)', value: `${horizontalAov.toFixed(1)}°`, isPrimary: true },
          { label: 'Vertical Angle of View (AOV)', value: `${verticalAov.toFixed(1)}°` },
          { label: 'Calculated Crop Factor', value: `${crop}x` }
        ]
      };
    }
  },
  {
    id: 'depth-of-field',
    name: 'Depth of Field (DoF) Calculator',
    slug: 'depth-of-field',
    category: 'photography',
    description: 'Calculate focus limits, hyperfocal distances, and acceptable sharpness spans.',
    formula: 'Hyperfocal Distance = Focal Length^2 / (Aperture * Circle of Confusion)',
    explanation: 'Depth of Field (DoF) is the range of distances in front of and behind a subject that appear acceptably sharp. This calculator computes boundaries using focal lengths, apertures, and sensor circles of confusion.',
    example: 'A photo on a Full Frame camera using a 85mm lens at f/1.8, subject standing 10 ft away, yields very thin background defocus.',
    inputs: [
      { id: 'focalLength', label: 'Lens Focal Length (mm)', type: 'number', defaultValue: 85, min: 1 },
      { id: 'aperture', label: 'Aperture (f-stop value)', type: 'number', defaultValue: 1.8, min: 0.95, max: 64, step: 0.1 },
      { id: 'distance', label: 'Subject Distance (Feet)', type: 'number', defaultValue: 10, min: 1 },
      { id: 'sensorCrop', label: 'Sensor Format', type: 'select', defaultValue: '1.0', options: [
        { label: 'Full Frame (CoC 0.03mm)', value: '1.0' },
        { label: 'APS-C Crop (CoC 0.02mm)', value: '1.5' },
        { label: 'Micro Four Thirds (CoC 0.015mm)', value: '2.0' }
      ]}
    ],
    faq: [
      { question: 'What is the Circle of Confusion (CoC)?', answer: 'Circle of Confusion represents the maximum diameter of an out-of-focus point that the human eye still perceives as a sharp point. Typically, 0.03mm is the industry standard for 35mm full frame film formats.' }
    ],
    relatedSlugs: ['lens-calculator', 'aperture-calculator', 'shutter-speed'],
    seoTitle: 'Depth of Field (DoF) Calculator | Professional Photography Focus Tool',
    seoDescription: 'Accurately solve hyperfocal focus distances and find near and far limits of sharpness. Supports multiple sensor sizes.',
    calculate: (inputs) => {
      const fl = Number(inputs.focalLength || 85);
      const fNum = Number(inputs.aperture || 1.8);
      const distFt = Number(inputs.distance || 10);
      const crop = Number(inputs.sensorCrop || '1.0');

      // Convert distance to mm: 1 ft = 304.8 mm
      const s = distFt * 304.8;
      // Default CoC (Circle of Confusion)
      let coc = 0.03;
      if (crop === 1.5) coc = 0.02;
      else if (crop === 2.0) coc = 0.015;

      // Hyperfocal distance (H) in mm
      const h = Math.pow(fl, 2) / (fNum * coc);

      // Near limit (Dn) and Far limit (Df) in mm
      const dn = (s * (h - fl)) / (h + s - (2 * fl));
      const df = (s * (h - fl)) / (h - s); // note: could result in infinity if s >= H

      const nearLimitFt = dn / 304.8;
      const farLimitFt = df <= 0 || df > 5000000 ? Infinity : df / 304.8;
      const totalDoFFt = farLimitFt === Infinity ? Infinity : farLimitFt - nearLimitFt;

      const hyperfocalFt = h / 304.8;

      return {
        results: [
          { label: 'Hyperfocal Distance', value: `${hyperfocalFt.toFixed(1)} ft`, isPrimary: true },
          { label: 'Total Depth of Field', value: farLimitFt === Infinity ? 'Infinite Focus' : `${totalDoFFt.toFixed(2)} ft`, isPrimary: true },
          { label: 'Near Limit of Sharpness', value: `${nearLimitFt.toFixed(2)} ft` },
          { label: 'Far Limit of Sharpness', value: farLimitFt === Infinity ? 'Infinity' : `${farLimitFt.toFixed(2)} ft` }
        ]
      };
    }
  },
  {
    id: 'exposure-calculator',
    name: 'Camera ND Filter Exposure Calculator',
    slug: 'exposure-calculator',
    category: 'photography',
    description: 'Calculate optimal shutter speed adjustments when installing Neutral Density (ND) filters or shifting ISO/aperture levels.',
    formula: 'Compensated Shutter Speed = Original Shutter Speed * 2^Filter Stop Density',
    explanation: 'Neutral Density (ND) filters block light to create artistic motion blur (E.g. silky smooth waterfalls). This calculator tracks the correct exposure shifts to apply.',
    example: 'Installing a 10-stop ND filter translates a 1/125s standard shutter speed into an 8-second exposure.',
    inputs: [
      { id: 'shutterSpeed', label: 'Base Shutter Speed (Seconds)', type: 'select', defaultValue: '0.008', options: [
        { label: '1/1000s', value: '0.001' },
        { label: '1/500s', value: '0.002' },
        { label: '1/250s', value: '0.004' },
        { label: '1/125s', value: '0.008' },
        { label: '1/60s', value: '0.016' },
        { label: '1/30s', value: '0.033' },
        { label: '1/15s', value: '0.066' },
        { label: '1/4s', value: '0.25' },
        { label: '1s', value: '1.0' }
      ]},
      { id: 'ndStops', label: 'ND Filter Strength (Stops Of Light Reduced)', type: 'number', defaultValue: 10, min: 0, max: 20 }
    ],
    faq: [
      { question: 'What does a 10-stop ND filter represent?', answer: 'It blocks 99.9% of incoming light, allowing you to use wide apertures or long shutter speeds under bright sunlight to eliminate moving tourists or smooth out ocean waves.' }
    ],
    relatedSlugs: ['lens-calculator', 'shutter-speed', 'aperture-calculator'],
    seoTitle: 'Neutral Density (ND) Filter Exposure Calculator | Long Exposure',
    seoDescription: 'Compute shutter speed compensations for ND solid density filters. Instant long exposure conversion reference chart.',
    calculate: (inputs) => {
      const baseSpeed = Number(inputs.shutterSpeed || 0.008);
      const ndStops = Number(inputs.ndStops || 0);

      const computedSpeed = baseSpeed * Math.pow(2, ndStops);

      let formattedTime = `${computedSpeed.toFixed(3)} seconds`;
      if (computedSpeed >= 60) {
        const mins = Math.floor(computedSpeed / 60);
        const secs = Math.round(computedSpeed % 60);
        formattedTime = `${mins}m ${secs}s`;
      } else if (computedSpeed < 1) {
        const fract = Math.round(1 / computedSpeed);
        formattedTime = `1/${fract}s`;
      }

      return {
        results: [
          { label: 'Compensated Exposure Speed', value: formattedTime, isPrimary: true },
          { label: 'Decimal Duration', value: `${computedSpeed.toFixed(2)} s`, isPrimary: true },
          { label: 'Relative Exposure Multiplying Factor', value: `${Math.pow(2, ndStops).toLocaleString()}x` }
        ]
      };
    }
  },
  {
    id: 'shutter-speed',
    name: 'Action Freeze Shutter Speed Calculator',
    slug: 'shutter-speed',
    category: 'photography',
    description: 'Calculate the maximum allowable shutter speed to freeze motion without suffering motion blur.',
    formula: 'Max Shutter Speed = Subject Distance * Blur Circle Tolerance / (Focal Length * Subject Speed)',
    explanation: 'Avoid blur under fast motion (E.g. athletic sports, wild leopards, flying bullet trains) by matching velocity angles with speed adjustments.',
    example: 'Freezing a sprinter running at 20 mph, standing 30 ft away with an 200mm telephoto lens.',
    inputs: [
      { id: 'targetSpeed', label: 'Subject Motion Speed (MPH)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'subjectDistance', label: 'Subject Distance from Camera (Feet)', type: 'number', defaultValue: 40, min: 1 },
      { id: 'focalLength', label: 'Lens Focal Length (mm)', type: 'number', defaultValue: 135, min: 10 },
      { id: 'direction', label: 'Direction of Subject Motion relative to Camera', type: 'select', defaultValue: 'diagonal', options: [
        { label: 'Cross Screen (Parallel)', value: '1.0' },
        { label: 'Diagonal Motion (45°)', value: '0.7' },
        { label: 'Straight Towards / Away', value: '0.33' }
      ]}
    ],
    faq: [
      { question: 'Why does direction change the freeze shutter speed?', answer: 'A subject running across the frame sweeps pixels over the sensor at a faster rate than a subject approaching directly towards the lens, requiring a faster shutter speed to freeze the motion.' }
    ],
    relatedSlugs: ['exposure-calculator', 'lens-calculator', 'aperture-calculator'],
    seoTitle: 'Sports Motion Shutter Speed Calculator | Freeze Athletics Blur',
    seoDescription: 'Find the maximum shutter speed to safely freeze moving subjects. Handles car speeds, athletic motion angles, and focal dimensions.',
    calculate: (inputs) => {
      const speed = Number(inputs.targetSpeed || 15);
      const dist = Number(inputs.subjectDistance || 40);
      const fl = Number(inputs.focalLength || 135);
      const dirCoeff = Number(inputs.direction || 0.7);

      // Simplified scientific motion freeze solver
      // Speed in in/sec * focal length represents speed on sensor
      const val = (speed * 17.6) * (fl / 25.4) / (dist * 12);
      const rawLimit = 0.001 / (val * dirCoeff);
      const solvedFractions = Math.max(100, Math.round(1 / rawLimit));

      let cleanSpeedLabel = `1/${solvedFractions} seconds`;
      if (solvedFractions > 8000) cleanSpeedLabel = '1/8000s (Limit of major pro shutters)';

      return {
        results: [
          { label: 'Target Minimum Shutter Speed', value: cleanSpeedLabel, isPrimary: true },
          { label: 'Fractions Suggested', value: `1/${solvedFractions}s`, isPrimary: true },
          { label: 'Direction Coefficient Impact', value: `${(dirCoeff * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'aperture-calculator',
    name: 'Lens Entrance Pupil Aperture Calculator',
    slug: 'aperture-calculator',
    category: 'photography',
    description: 'Calculate a lens\'s f-number aperture using its physical entrance pupil diameter and focal length.',
    formula: 'Aperture (f-stop) = Focal Length / Entrance Pupil Diameter',
    explanation: 'Defines lens speed and light-gathering limits of optical systems.',
    example: 'An 100mm lens with a physical circle glass entrance pupil of 50mm yields an optic speed of f/2.0.',
    inputs: [
      { id: 'focalLength', label: 'Focal Length (mm)', type: 'number', defaultValue: 100, min: 1 },
      { id: 'diameter', label: 'Entrance Pupil Diameter (mm)', type: 'number', defaultValue: 50, min: 1 }
    ],
    faq: [
      { question: 'Does a lower f-number allow more light?', answer: 'Yes, a lower f-number indicates a larger physical aperture diameter relative to focal lengths, letting more light hit the sensor.' }
    ],
    relatedSlugs: ['lens-calculator', 'depth-of-field', 'exposure-calculator'],
    seoTitle: 'Lens Aperture f-Number Calculator | Entrance Pupil Diameter Solver',
    seoDescription: 'Calculate the f-stop aperture of lenses using physical aperture pupil diameter and focal length metrics.',
    calculate: (inputs) => {
      const fl = Number(inputs.focalLength || 100);
      const dia = Number(inputs.diameter || 50);

      const fStop = fl / dia;

      return {
        results: [
          { label: 'Lens Aperture Value', value: `f/${fStop.toFixed(1)}`, isPrimary: true },
          { label: 'Optical Velocity Index', value: fStop < 2.0 ? 'Exceedingly Bright (Elite)' : fStop < 4.0 ? 'Fast Portrait Optic' : 'Standard Utility Optic' }
        ]
      };
    }
  },
  {
    id: 'photography-pricing',
    name: 'Photography Pricing & Rate Calculator',
    slug: 'photography-pricing',
    category: 'photography',
    description: 'Structure custom photography pricing models to map out sustainable billable shoot rates.',
    formula: 'Billable Session Charge = (Desired Income + Overheads) / Annual shootsCount',
    explanation: 'Provides freelancers with direct calculations of necessary hourly minimum bookings, factoring in camera gear insurance, computing software, studio leases, and marketing plans.',
    example: 'Hoping to make $65K net with $15K yearly business expenses over 50 shoots.',
    inputs: [
      { id: 'incomeGoal', label: 'Desired Net Annual Income ($)', type: 'number', defaultValue: 70000, min: 1000 },
      { id: 'overheadCost', label: 'Annual Business Expenses / Gear Overheads ($)', type: 'number', defaultValue: 12000, min: 0 },
      { id: 'shootsPerYear', label: 'Estimated Billable Sessions per Year', type: 'number', defaultValue: 45, min: 1 },
      { id: 'hoursPerShoot', label: 'Average Hours Spent (Shoot + Edit + Delivery) (Hours)', type: 'number', defaultValue: 10, min: 1 }
    ],
    faq: [
      { question: 'Why aggregate hours spent per shoot?', answer: 'Many novices only compute standard shooting hours. To make sustainable pricing, you must count administrative emailing, client travel, raw editing, and sorting hours.' }
    ],
    relatedSlugs: ['photo-storage', 'lens-calculator', 'depth-of-field'],
    seoTitle: 'Professional Photographer Session Pricing Calculator | Freelance Rates',
    seoDescription: 'Structure your freelance photography career pricing. Calculates mandatory session and hourly rates based on goals and business overheads.',
    calculate: (inputs) => {
      const income = Number(inputs.incomeGoal || 0);
      const overhead = Number(inputs.overheadCost || 0);
      const sessions = Number(inputs.shootsPerYear || 1);
      const hours = Number(inputs.hoursPerShoot || 10);

      const totalGrossNeeded = income + overhead;
      const minSessionPrice = totalGrossNeeded / sessions;
      const effectiveHourlyRate = minSessionPrice / hours;

      return {
        results: [
          { label: 'Minimum Price Per Session', value: minSessionPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Minimum Billing Hourly Rate', value: effectiveHourlyRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Total Gross Revenues Needed', value: totalGrossNeeded.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Total Billing Hours Year', value: (sessions * hours), unit: 'hrs' }
        ]
      };
    }
  },
  {
    id: 'photo-storage',
    name: 'RAW Photo Session Storage Calculator',
    slug: 'photo-storage',
    category: 'photography',
    description: 'Calculate RAW image file size loads and project the aggregate storage capacity required for a photo session.',
    formula: 'File Size (MB) = Megapixels * Bit Depth / 8',
    explanation: 'Quickly estimate disk sizes needed for wedding archives or massive commercial campaigns. Accounts for raw uncompressed files.',
    example: 'E.g., Shooting 14-bit uncompressed files on a high-density 45 Megapixel sensor camera.',
    inputs: [
      { id: 'megapixels', label: 'Camera Sensor Resolution (Megapixels)', type: 'number', defaultValue: 33, min: 1 },
      { id: 'bitDepth', label: 'Color RAW Bit Depth Rating', type: 'select', defaultValue: '14', options: [
        { label: '14-Bit (High Quality Uncompressed)', value: '14' },
        { label: '12-bit (Standard RAW Compressed)', value: '12' },
        { label: 'jpeg (8-bit Compressed)', value: '8' }
      ]},
      { id: 'shotsCount', label: 'Estimated Number of Shots to Take', type: 'number', defaultValue: 1500, min: 1 }
    ],
    faq: [
      { question: 'Why does bit depth change the image storage size?', answer: 'Higher bit depth records higher color precision (16,384 levels per channel on 14-bit vs 4,096 levels on 12-bit), expanding raw data bits per pixel.' }
    ],
    relatedSlugs: ['photography-pricing', 'lens-calculator', 'shutter-speed'],
    seoTitle: 'RAW Photo File Storage & Memory Card Calculator | DSLR Specs',
    seoDescription: 'Estimate image file weight dimensions. Calculate aggregate storage required for photos based on megapixels and bit depths.',
    calculate: (inputs) => {
      const mp = Number(inputs.megapixels || 33);
      const bits = Number(inputs.bitDepth || '14');
      const count = Number(inputs.shotsCount || 1000);

      // Simple uncompressed RAW calculation
      // File = megapixels * (bit_depth_bits / 8)
      let byteCoeff = bits === 14 ? 1.75 : bits === 12 ? 1.5 : 0.35; // jpeg is highly compressed
      const singleFileSizeMB = mp * byteCoeff;
      const totalMB = singleFileSizeMB * count;
      const totalGB = totalMB / 1024;

      return {
        results: [
          { label: 'Single RAW File Weight', value: `${singleFileSizeMB.toFixed(1)} MB`, isPrimary: true },
          { label: 'Total Session Storage Required', value: `${totalGB.toFixed(2)} GB`, isPrimary: true },
          { label: 'Estimated Average Shots on 128GB Card', value: Math.round((128 * 1024) / singleFileSizeMB).toLocaleString() }
        ]
      };
    }
  },

  // ====================================== VIDEO PRODUCTION PROFESSIONAL ======================================
  {
    id: 'video-production-budget',
    name: 'Video Production Budget Calculator',
    slug: 'video-production-budget',
    category: 'video-production',
    description: 'Calculate and structure video budgeting guidelines across pre-production, active filming, and editing phases.',
    formula: 'Total Budget = Equipment Rental + Actor Fees + (Staff Count * Staff Day Rate * Days) + Admin Post-Production',
    explanation: 'Designed for commercial creatives and directors to formulate quick pitch deck totals. It structures crew labor budgets, camera hires, and voiceover costs.',
    example: 'Planning a 3-day video shoot, using 4 crew members, hire gear at $800, plus active script drafting.',
    inputs: [
      { id: 'shootDays', label: 'Active Filming Days (Production)', type: 'number', defaultValue: 3, min: 1 },
      { id: 'gearRentals', label: 'Camera / Gear Commercial Hire Costs ($/day)', type: 'number', defaultValue: 650, min: 0 },
      { id: 'crewMultiplier', label: 'Crew Size Count (Staff)', type: 'number', defaultValue: 3, min: 1 },
      { id: 'crewDailyRate', label: 'Avg Crew Member Rate ($/day)', type: 'number', defaultValue: 450, min: 0 },
      { id: 'talentFees', label: 'Actors / Talent Fees Daily Allocation ($)', type: 'number', defaultValue: 1000, min: 0 },
      { id: 'editingPackage', label: 'Fixed Post-Production & Sound Design Costs ($)', type: 'number', defaultValue: 2500, min: 0 }
    ],
    faq: [
      { question: 'What is a typical daily rate for professional freelance camera operators?', answer: 'Depending on the market, camera crew operator day rates average between $500 and $1,200, often incorporating their basic gear package.' }
    ],
    relatedSlugs: ['editing-time', 'video-render-cost', 'video-storage'],
    seoTitle: 'Commercial Video Production Budget Calculator | Filmmaker Tools',
    seoDescription: 'Accurately structure video filming costs. Evaluates talent fees, camera kit hire rates, staff sizes, and post-production allocations.',
    calculate: (inputs) => {
      const days = Number(inputs.shootDays || 1);
      const gear = Number(inputs.gearRentals || 0);
      const crewCount = Number(inputs.crewMultiplier || 1);
      const crewRate = Number(inputs.crewDailyRate || 0);
      const talent = Number(inputs.talentFees || 0);
      const editing = Number(inputs.editingPackage || 0);

      const productionLabor = crewCount * crewRate * days;
      const productionGear = gear * days;
      const totalProductionCost = productionLabor + productionGear + (talent * days);
      const overallTotalBudget = totalProductionCost + editing;

      return {
        results: [
          { label: 'Total Video Project Budget', value: overallTotalBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Active Production Expenses', value: totalProductionCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Crew Labor Allocation', value: productionLabor.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Post-Production & Export Cost', value: editing.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ],
        chartData: [
          { name: 'Crew Salaries', value: productionLabor, color: '#3b82f6' },
          { name: 'Camera Gear', value: productionGear, color: '#10b981' },
          { name: 'Talent Payouts', value: talent * days, color: '#f59e0b' },
          { name: 'Post Production', value: editing, color: '#ec4899' }
        ]
      };
    }
  },
  {
    id: 'editing-time',
    name: 'Video Editing Time Estimator',
    slug: 'editing-time',
    category: 'video-production',
    description: 'Estimate expected video editing post-production hours based on raw shoot volumes and complex styling requests.',
    formula: 'Editing Hours = Final Cut Duration * Complexity Modifier * Raw Ratio',
    explanation: 'Models timeframes for video editors. Post-production timelines scale dramatically depending on color grading needs, complex multi-cam syncing, and custom 3D VFX rendering requests.',
    example: 'A highly structured 10-minute corporate marketing cut using 40 minutes of raw 4K clip footage.',
    inputs: [
      { id: 'finalDuration', label: 'Expected Final Cut Duration (Minutes)', type: 'number', defaultValue: 10, min: 1 },
      { id: 'rawFootageDuration', label: 'Total Raw Footage Shot (Minutes)', type: 'number', defaultValue: 60, min: 1 },
      { id: 'complexity', label: 'VFX / Post-Production Complexity', type: 'select', defaultValue: 'corporate', options: [
        { label: 'Simple (Cut/Join, Minimal Graphics) (1x)', value: '1.0' },
        { label: 'Corporate Style (Color Grade, Sound Design) (3x)', value: '3.0' },
        { label: 'Advanced Cine/VFX (Heavily Animated, Custom Motion) (10x)', value: '10.0' }
      ]}
    ],
    faq: [
      { question: 'What is the standard standard editing ratio?', answer: 'A common baseline for talking-head, corporate videos is 3 to 5 hours of intensive post-work for every finished minute of video.' }
    ],
    relatedSlugs: ['video-production-budget', 'video-render-cost', 'video-storage'],
    seoTitle: 'Video Editing Time Estimator | Post-Production Timelines',
    seoDescription: 'Forecast appropriate editing timelines for client video shoots based on raw hours, motion graphics, and sound design expectations.',
    calculate: (inputs) => {
      const finalDur = Number(inputs.finalDuration || 10);
      const rawFootage = Number(inputs.rawFootageDuration || 60);
      const coeff = Number(inputs.complexity || '3.0');

      const fileRatioMod = Math.max(1.0, Math.log10(rawFootage / finalDur));
      const baselineHours = finalDur * 0.5 * coeff * fileRatioMod;

      const reviewTuning = baselineHours * 0.2; // 20% feedback revisions buffer
      const aggregateHours = baselineHours + reviewTuning;

      return {
        results: [
          { label: 'Estimated Total Post Hours', value: Math.ceil(aggregateHours), unit: 'hrs', isPrimary: true },
          { label: 'Base Video Editing Time', value: Math.ceil(baselineHours), unit: 'hrs', isPrimary: true },
          { label: 'Revisions & Audio Tuning Buffer', value: Math.ceil(reviewTuning), unit: 'hrs' },
          { label: 'Project Turnover Calendar Days', value: Math.ceil(aggregateHours / 6), unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'video-render-cost',
    name: 'Video Render Cost Calculator',
    slug: 'video-render-cost',
    category: 'video-production',
    description: 'Calculate rendering times and estimate financial costs of utilizing personal setups or decentralized render farms for computer graphics.',
    formula: 'Total Render Cost = Frame Count * Time Per Frame * Machine Core Hourly Cost',
    explanation: '3D modeling outputs and cinema CGI require extensive processing workloads. Evaluates cluster parameters to estimate render costs.',
    example: 'Rendering an animation project with 1,800 frames, taking an average of 45 seconds per frame using cloud-nodes.',
    inputs: [
      { id: 'frameCount', label: 'Total Video Frames in Project', type: 'number', defaultValue: 3000, min: 1 },
      { id: 'secPerFrame', label: 'Average Rendering Speed Per Frame (Seconds)', type: 'number', defaultValue: 25, min: 0.1, step: 0.1 },
      { id: 'nodeHourlyCost', label: 'Render Farm Server Node Rate ($/hour)', type: 'number', defaultValue: 1.5, min: 0.1, step: 0.05 }
    ],
    faq: [
      { question: 'What is a cloud render farming node?', answer: 'It is a high-performance dedicated CPU or GPU workstation hosted in a server center primed for processing 3D visual graphics (such as Blender, Unreal, or Cinema4D projects).' }
    ],
    relatedSlugs: ['video-production-budget', 'editing-time', 'video-storage'],
    seoTitle: '3D & VFX Cloud Render Cost Calculator | Animation Solver',
    seoDescription: 'Predict local or cloud farming project render expenses using target frame counts and processing hardware expenses.',
    calculate: (inputs) => {
      const frames = Number(inputs.frameCount || 1);
      const secPerFrame = Number(inputs.secPerFrame || 1);
      const nodeRate = Number(inputs.nodeHourlyCost || 1);

      const totalRenderSec = frames * secPerFrame;
      const totalRenderHours = totalRenderSec / 3600;
      const totalCost = totalRenderHours * nodeRate;

      return {
        results: [
          { label: 'Total Projected Render Cost', value: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Required Hardware Process Hours', value: totalRenderHours.toFixed(2), unit: 'hrs', isPrimary: true },
          { label: 'Estimated Frame Render Pace', value: `${(frames / 24).toFixed(1)} sec video`, unit: 'at 24fps' }
        ]
      };
    }
  },
  {
    id: 'video-storage',
    name: 'Video File Storage Calculator',
    slug: 'video-storage',
    category: 'video-production',
    description: 'Calculate video storage requirements based on resolutions, frame rates, and encoding bitrates.',
    formula: 'File Size (GB) = (Bitrate in Mbps / 8) * Duration in Seconds / 1024',
    explanation: 'Helps camera operators prepare adequate hard drive sizing for massive RAW recording tasks.',
    example: 'Filming high-density ProRes 422 4K clips at 400 Mbps.',
    inputs: [
      { id: 'targetBitrate', label: 'Video Encoding Bitrate (Mbps)', type: 'number', defaultValue: 100, min: 1 },
      { id: 'clipDuration', label: 'Aggregate Shooting Duration (Minutes)', type: 'number', defaultValue: 60, min: 1 }
    ],
    faq: [
      { question: 'Why does 4K require so much storage capacity?', answer: '4K contains four times the pixel volume of standard 1080p, demanding high coding bitrates (e.g. 100-400 Mbps) to maintain high visual crispness.' }
    ],
    relatedSlugs: ['video-production-budget', 'editing-time', 'streaming-bandwidth'],
    seoTitle: 'RAW Video File Storage Dimensions Calculator | SSD Capacity',
    seoDescription: 'Obtain required space for camera footage projects. Calculates video files sizes based on arbitrary bitrates and duration times.',
    calculate: (inputs) => {
      const bitrate = Number(inputs.targetBitrate || 100);
      const min = Number(inputs.clipDuration || 60);

      const megabitsPerSec = bitrate;
      const gigabytesPerMin = (megabitsPerSec / 8) * 60 / 1024;
      const overallSizeGB = gigabytesPerMin * min;

      return {
        results: [
          { label: 'Total Session Storage Needed', value: `${overallSizeGB.toFixed(2)} GB`, isPrimary: true },
          { label: 'Storage Requirement Per Minute', value: `${(gigabytesPerMin * 1024).toFixed(1)} MB` },
          { label: 'Storage Requirement Per Hour', value: `${(gigabytesPerMin * 60).toFixed(1)} GB`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'streaming-bandwidth',
    name: 'Streaming Video Bandwidth Calculator',
    slug: 'streaming-bandwidth',
    category: 'video-production',
    description: 'Calculate upload bandwidth speeds and total data transfer consumption for live streaming video sessions.',
    formula: 'Total Transfer = Stream Bitrate * Concurrent Listeners * Duration',
    explanation: 'Models streaming budgets. Lets network operators compute required upload pipe capacities and predict total CDN data transfer invoices.',
    example: 'Hosting a webinar with 250 concurrent viewers using an HD 4500 Kbps encoding stream.',
    inputs: [
      { id: 'streamBitrate', label: 'Stream Bitrate (Kbps)', type: 'number', defaultValue: 5000, min: 100 },
      { id: 'viewers', label: 'Max Expected Concurrent Viewers', type: 'number', defaultValue: 100, min: 1 },
      { id: 'streamHours', label: 'Live Stream Duration (Hours)', type: 'number', defaultValue: 2, min: 1 }
    ],
    faq: [
      { question: 'What is the standard upload safety margin when live streaming?', answer: 'Always aim to have double your stream\'s encoding bitrate in available upload speed. If streaming at 5,000 Kbps (5 Mbps), try to have at least a 10 Mbps upstream connection.' }
    ],
    relatedSlugs: ['video-storage', 'video-production-budget', 'video-quality'],
    seoTitle: 'Live Streaming Bandwidth & CDN Cost Calculator | Video Specs',
    seoDescription: 'Calculate direct upload speeds needed to stream and find overall CDN network transfer sizes based on concurrent viewers.',
    calculate: (inputs) => {
      const bitrate = Number(inputs.streamBitrate || 5000);
      const viewers = Number(inputs.viewers || 100);
      const hours = Number(inputs.streamHours || 2);

      const streamMbps = bitrate / 1000;
      const safetyUploadRequired = streamMbps * 1.5; // 50% safety margin

      const singleTransferGBPerHour = (bitrate / 8) * 3600 / 1000000;
      const totalTransferAllViewersGB = singleTransferGBPerHour * viewers * hours;

      return {
        results: [
          { label: 'Safety ISP Upload Speed Required', value: `${safetyUploadRequired.toFixed(1)} Mbps`, isPrimary: true },
          { label: 'Total Network Data Consumed', value: `${totalTransferAllViewersGB.toFixed(1)} GB`, isPrimary: true },
          { label: 'Average CDN Data Cost (at $0.05/GB)', value: (totalTransferAllViewersGB * 0.05).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'video-quality',
    name: 'Video Encoding Bitrate & Quality Calculator',
    slug: 'video-quality',
    category: 'video-production',
    description: 'Estimate optimal video encoding bitrates using resolutions, framerates, and target Bits Per Pixel (BPP) visual density standards.',
    formula: 'Bitrate (Kbps) = Height * Width * FPS * BPP / 1000',
    explanation: 'BPP measures compression tightness. Low BPP (0.05) creates blocky artifacts, whereas high BPP (0.15) produces pristine web video results.',
    example: 'Encoding 1080p web-video files (1920x1080) at 30fps using a balanced 0.10 BPP ratio.',
    inputs: [
      { id: 'resolutionWidth', label: 'Encoding Resolution Width (Pixels)', type: 'number', defaultValue: 1920, min: 1 },
      { id: 'resolutionHeight', label: 'Encoding Resolution Height (Pixels)', type: 'number', defaultValue: 1080, min: 1 },
      { id: 'frameRate', label: 'Target Frame Rate (FPS)', type: 'number', defaultValue: 30, min: 1, max: 240 },
      { id: 'bppValue', label: 'Bits Per Pixel (BPP) Compression Density', type: 'select', defaultValue: '0.10', options: [
        { label: 'Compressed/Fast (0.06 BPP)', value: '0.06' },
        { label: 'Balanced Web standard (0.10 BPP)', value: '0.10' },
        { label: 'Pristine Cinema Upload (0.15 BPP)', value: '0.15' }
      ]}
    ],
    faq: [
      { question: 'What does BPP stand for?', answer: 'Bits Per Pixel. It represents the number of digital bits allocated to code color changes for an individual pixel area during a single frame step.' }
    ],
    relatedSlugs: ['video-storage', 'streaming-bandwidth', 'editing-time'],
    seoTitle: 'Optimal Video Encoding Bitrate Calculator | BPP Solver',
    seoDescription: 'Accurately solve recommended H.264/H.265 compression bitrate standards based on target pixel resolutions and BPP ratios.',
    calculate: (inputs) => {
      const w = Number(inputs.resolutionWidth || 1920);
      const h = Number(inputs.resolutionHeight || 1080);
      const fps = Number(inputs.frameRate || 30);
      const bpp = Number(inputs.bppValue || '0.10');

      const bitsPerSec = w * h * fps * bpp;
      const bitrateMbps = bitsPerSec / 1000000;

      return {
        results: [
          { label: 'Recommended Bitrate Target', value: `${bitrateMbps.toFixed(2)} Mbps`, isPrimary: true },
          { label: 'Total Pixels Per Second Processed', value: (w * h * fps).toLocaleString(), unit: 'pixels' },
          { label: 'Target Quality Level', value: bpp >= 0.15 ? 'Excellent (Cinema Master)' : bpp >= 0.10 ? 'High Quality Web Standard' : 'Medium (Efficient)' }
        ]
      };
    }
  },

  // ====================================== LEGAL DOCUMENTS ======================================
  {
    id: 'date-difference',
    name: 'Legal Date Difference Calculator',
    slug: 'date-difference',
    category: 'legal',
    description: 'Calculate absolute calendar count deviations and count business workweeks between target date coordinates.',
    formula: 'Days = End Date - Start Date (Excluding custom Weekends/Holidays optional)',
    explanation: 'Quickly audits litigation periods, notice constraints, and default lease time spans for administrative court compliance.',
    example: 'Measuring the exact litigation preparation duration between two calendar dates.',
    inputs: [
      { id: 'startDate', label: 'Contract / Action Start Date', type: 'date', defaultValue: '2026-06-19' },
      { id: 'endDate', label: 'Filing Deadline / Target End Date', type: 'date', defaultValue: '2026-09-30' },
      { id: 'excludeWeekends', label: 'Count ONLY business working days (Mon-Fri)?', type: 'select', defaultValue: 'no', options: [
        { label: 'No, count all calendar days', value: 'no' },
        { label: 'Yes, exclude weekends', value: 'yes' }
      ]}
    ],
    faq: [
      { question: 'Why does business days counting matter in contracts?', answer: 'Many commercial service SLAs specify deliverables within "10 business days", which can translate to 14 or 15 absolute calendar days depending on holidays.' }
    ],
    relatedSlugs: ['contract-duration', 'legal-deadline', 'document-expiration'],
    seoTitle: 'Contract & Business Day Difference Calculator | Legal Deadlines',
    seoDescription: 'Obtain precise calendar and workweek durations between dates. Supports option to filter out weekend gaps for administrative plans.',
    calculate: (inputs) => {
      const d1 = new Date(inputs.startDate || '2026-06-19');
      const d2 = new Date(inputs.endDate || '2026-09-30');
      const omitWeekends = inputs.excludeWeekends === 'yes';

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return { results: [{ label: 'Error', value: 'Please enter valid date inputs' }] };
      }

      const diffMs = d2.getTime() - d1.getTime();
      const rawDays = Math.round(diffMs / 86400000);

      let businessDaysCount = 0;
      if (omitWeekends) {
        let tempDate = new Date(d1.getTime());
        while (tempDate <= d2) {
          const day = tempDate.getUTCDay();
          if (day !== 0 && day !== 6) {
            businessDaysCount++;
          }
          tempDate.setDate(tempDate.getDate() + 1);
        }
      }

      return {
        results: [
          { label: 'Total Calendar Days', value: `${rawDays} days`, isPrimary: true },
          { label: 'Calculated Business Days', value: omitWeekends ? `${businessDaysCount} days` : 'N/A', isPrimary: true },
          { label: 'Estimated Total Weeks Span', value: (rawDays / 7).toFixed(1) }
        ]
      };
    }
  },
  {
    id: 'contract-duration',
    name: 'Contract Duration & Notice Calculator',
    slug: 'contract-duration',
    category: 'legal',
    description: 'Calculate contractual endings and find precise automatic renewal (lock-in) termination caution thresholds.',
    formula: 'End Date = Start Date + Months Offset | Notice Trigger Date = End Date - Renewal Days Offset',
    explanation: 'Prevents automatic rollover lock-ins by modeling notice periods, ensuring timely renegotiations and cancellations.',
    example: 'A 12-month commercial lease starting on June 19th with a mandatory 30-day cancellation notice.',
    inputs: [
      { id: 'startDate', label: 'Contract Effective State Date', type: 'date', defaultValue: '2026-06-19' },
      { id: 'durationMonths', label: 'Contract Duration Length (Months)', type: 'number', defaultValue: 12, min: 1 },
      { id: 'noticeDays', label: 'Mandatory Non-Renewal Notice Period (Days)', type: 'number', defaultValue: 60, min: 0 }
    ],
    faq: [
      { question: 'What is an evergreen rollover clause?', answer: 'An evergreen clause automatically renews contract durations for consecutive periods unless a party provides formal notice of termination prior to the contract expiration date.' }
    ],
    relatedSlugs: ['date-difference', 'legal-deadline', 'document-expiration'],
    seoTitle: 'Contract End Date & Auto-Renewal Notice Calculator | Compliance',
    seoDescription: 'Find contract end dates and identify exact deadlines for cancellation notifications. Prevents unwanted rollovers.',
    calculate: (inputs) => {
      const start = new Date(inputs.startDate || '2026-06-19');
      const months = Number(inputs.durationMonths || 12);
      const notice = Number(inputs.noticeDays || 60);

      if (isNaN(start.getTime())) {
        return { results: [{ label: 'Error', value: 'Please provide a valid start date' }] };
      }

      const endDate = new Date(start.getTime());
      endDate.setMonth(endDate.getMonth() + months);

      const noticeDeadline = new Date(endDate.getTime());
      noticeDeadline.setDate(noticeDeadline.getDate() - notice);

      const formatting = (d: Date) => d.toISOString().split('T')[0];

      return {
        results: [
          { label: 'Contract Expiration Date', value: formatting(endDate), isPrimary: true },
          { label: 'Must Notify Non-Renewal By Date', value: formatting(noticeDeadline), isPrimary: true },
          { label: 'Fulfillment Gap Allowed', value: `${notice} calendar days prior` }
        ]
      };
    }
  },
  {
    id: 'legal-deadline',
    name: 'Statute of Limitations Deadline Calculator',
    slug: 'legal-deadline',
    category: 'legal',
    description: 'Track the absolute legal statute of limitations expiration schedules for filing litigations or claims.',
    formula: 'Filing Expiry Date = Accident Date + Statute Limitation (Years)',
    explanation: 'Helps legal counsels assess client timelines and calculate warning zones to avoid losing filing rights.',
    example: 'An accident occurring in June, under a strict 3-year local statute of limitations ruleset.',
    inputs: [
      { id: 'incidentDate', label: 'Date of Injury / Incident Occurrence', type: 'date', defaultValue: '2026-06-19' },
      { id: 'statuteYears', label: 'Jurisdiction Statute of Limitations (Years)', type: 'number', defaultValue: 3, min: 1, max: 20 },
      { id: 'warningDays', label: 'Caution Notification Alert Margin (Days)', type: 'number', defaultValue: 90, min: 0 }
    ],
    faq: [
      { question: 'Can statue of limitations boundaries be paused?', answer: 'Yes, in rare legal circumstances (E.g. "tolling"), limits can temporarily pause if a key plaintiff is a minor or critically incapacitated.' }
    ],
    relatedSlugs: ['date-difference', 'contract-duration', 'document-expiration'],
    seoTitle: 'Litigation Statute of Limitations Date Calculator | Filing Timelines',
    seoDescription: 'Find absolute filing deadlines based on incident dates and regional statutory constraints. Includes warning notifications.',
    calculate: (inputs) => {
      const start = new Date(inputs.incidentDate || '2026-06-19');
      const years = Number(inputs.statuteYears || 3);
      const warning = Number(inputs.warningDays || 90);

      if (isNaN(start.getTime())) {
        return { results: [{ label: 'Error', value: 'Please enter a valid incident date' }] };
      }

      const limitDate = new Date(start.getTime());
      limitDate.setFullYear(limitDate.getFullYear() + years);

      const warnDate = new Date(limitDate.getTime());
      warnDate.setDate(warnDate.getDate() - warning);

      const formatting = (d: Date) => d.toISOString().split('T')[0];

      return {
        results: [
          { label: 'Absolute Expiration Deadline', value: formatting(limitDate), isPrimary: true },
          { label: 'Urgent Filing Kickoff Alert', value: formatting(warnDate), isPrimary: true },
          { label: 'Active Filing Capacity remaining', value: `${years} Years total limit` }
        ]
      };
    }
  },
  {
    id: 'document-expiration',
    name: 'Document Expiration & Renewal Tracker',
    slug: 'document-expiration',
    category: 'legal',
    description: 'Track validity periods for critical licenses, passports, and certifications, with recommended renewal dates.',
    formula: 'Expiry Date = Issue Date + Validity Years | Renewal Notice = Expiry Date - Warning Months',
    explanation: 'Maintains organizational compliance by alerting users well before certificates, safety audits, and operational permits expire.',
    example: 'E.g., Renewing a professional compliance credentials baseline issued for 5 years.',
    inputs: [
      { id: 'issueDate', label: 'Document Issue / Certification Date', type: 'date', defaultValue: '2026-01-15' },
      { id: 'validityYears', label: 'Validity Lifespan (Years)', type: 'number', defaultValue: 5, min: 1, max: 50 },
      { id: 'warningMonths', label: 'Renewal Notification Buffer (Months)', type: 'number', defaultValue: 6, min: 1, max: 12 }
    ],
    faq: [
      { question: 'Why plan renewals six months early?', answer: 'Many international security clearance visas or government permits require at least 6 months of validity remaining on passports to allow active border passage.' }
    ],
    relatedSlugs: ['date-difference', 'contract-duration', 'legal-deadline'],
    seoTitle: 'Document Expiration & Safety Permit Renewal Calculator | Compliance',
    seoDescription: 'Prevent administrative compliance lapses. Calculate passport, license, and safety certificate expiration dates and renewal buffer zones.',
    calculate: (inputs) => {
      const issue = new Date(inputs.issueDate || '2026-01-15');
      const years = Number(inputs.validityYears || 5);
      const monthsWarn = Number(inputs.warningMonths || 6);

      if (isNaN(issue.getTime())) {
        return { results: [{ label: 'Error', value: 'Please select a valid date parameter' }] };
      }

      const expiry = new Date(issue.getTime());
      expiry.setFullYear(expiry.getFullYear() + years);

      const renewDate = new Date(expiry.getTime());
      renewDate.setMonth(renewDate.getMonth() - monthsWarn);

      const formatting = (d: Date) => d.toISOString().split('T')[0];

      return {
        results: [
          { label: 'Document Expiration Date', value: formatting(expiry), isPrimary: true },
          { label: 'Recommended Renewal Launch', value: formatting(renewDate), isPrimary: true },
          { label: 'Notification Prep Interval', value: `${monthsWarn} Months before expiry` }
        ]
      };
    }
  },
  {
    id: 'payment-schedule',
    name: 'Legal Milestone Payment Schedule Calculator',
    slug: 'payment-schedule',
    category: 'legal',
    description: 'Calculate progressive retainer downpayments and design milestone due dates for contracts.',
    formula: 'Remaining Sum = Contract Value * (100 - Retainer %) / Milestones Count',
    explanation: 'Assists contractors, legal departments, and consultants in structuring billing schedules with distinct payment steps.',
    example: 'Structuring a $50K engineering consultancy contract with a 25% upfront retainer and 3 progressive progress steps.',
    inputs: [
      { id: 'totalValue', label: 'Overall Contract Financial Value ($)', type: 'number', defaultValue: 40000, min: 100 },
      { id: 'retainerPercent', label: 'Retainer Downpayment Fee (%)', type: 'number', defaultValue: 25, min: 0, max: 100 },
      { id: 'milestonesCount', label: 'Planned Milestone Checkpoints Count', type: 'number', defaultValue: 3, min: 1, max: 10 },
      { id: 'contractStartDate', label: 'Contract Execution Date', type: 'date', defaultValue: '2026-06-19' }
    ],
    faq: [
      { question: 'Why is a 20-30% retainer considered standard?', answer: 'Having an upfront retainer secures client commitment, covers initial operational costs, and minimizes risk before launching a project.' }
    ],
    relatedSlugs: ['date-difference', 'contract-duration', 'legal-timeline'],
    seoTitle: 'Contract Milestones & Retainer Payment Schedule Calculator',
    seoDescription: 'Structure consulting milestone payments. Set upfront retainers and divide remaining balances across progress checkpoints.',
    calculate: (inputs) => {
      const val = Number(inputs.totalValue || 40000);
      const retPct = Number(inputs.retainerPercent || 25) / 100;
      const count = Number(inputs.milestonesCount || 3);
      const start = new Date(inputs.contractStartDate || '2026-06-19');

      const retainerAmount = val * retPct;
      const remainingBalance = val - retainerAmount;
      const progressPayment = remainingBalance / count;

      const schedule = [];
      const formatting = (d: Date) => d.toISOString().split('T')[0];

      // Add project milestones with 30 day gaps for illustration
      for (let i = 1; i <= count; i++) {
        const milestoneDate = new Date(start.getTime());
        milestoneDate.setDate(milestoneDate.getDate() + (i * 30));
        schedule.push({
          step: `Milestone ${i}`,
          date: formatting(milestoneDate),
          amount: progressPayment
        });
      }

      return {
        results: [
          { label: 'Initial Retainer Downpayment', value: retainerAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Subsequent Progress Payment Amount', value: progressPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), unit: `(x${count})`, isPrimary: true },
          { label: 'Outstanding Balance Sum', value: remainingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ],
        breakdown: schedule
      };
    }
  },
  {
    id: 'legal-timeline',
    name: 'Litigation & Court Case Timeline Calculator',
    slug: 'legal-timeline',
    category: 'legal',
    description: 'Calculate litigation milestones and court discovery deadlines based on civil procedure rules.',
    formula: 'Deadline = Action Date + Service Days Offset',
    explanation: 'Helps legal teams track filing deadlines, scheduling orders, discovery cutoffs, and summary judgment timelines.',
    example: 'E.g., Initiating a lawsuit from June 19, tracking civil timeline limits.',
    inputs: [
      { id: 'filingDate', label: 'Initial Lawsuit Filing Date', type: 'date', defaultValue: '2026-06-19' },
      { id: 'serviceLimit', label: 'Limit Days to Serve Defendant (days)', type: 'number', defaultValue: 90, min: 1 },
      { id: 'answerLimit', label: 'Limit Days to Answer Complaint (days)', type: 'number', defaultValue: 21, min: 1 },
      { id: 'discoveryLimit', label: 'Discovery Complete Target (days)', type: 'number', defaultValue: 120, min: 10 }
    ],
    faq: [
      { question: 'What is discovery in civil cases?', answer: 'Discovery is the formal process during a lawsuit where both parties exchange information, documents, and witness depositions ahead of trial.' }
    ],
    relatedSlugs: ['date-difference', 'contract-duration', 'legal-deadline'],
    seoTitle: 'Litigation Court Calendar & Discovery Timeline Calculator',
    seoDescription: 'Forecast litigation calendar milestones for civil lawsuits. Accounts for defendant service windows and discovery deadlines.',
    calculate: (inputs) => {
      const file = new Date(inputs.filingDate || '2026-06-19');
      const service = Number(inputs.serviceLimit || 90);
      const answer = Number(inputs.answerLimit || 21);
      const discovery = Number(inputs.discoveryLimit || 120);

      if (isNaN(file.getTime())) {
        return { results: [{ label: 'Error', value: 'Please enter a valid filing date' }] };
      }

      const getWithOffset = (days: number) => {
        const d = new Date(file.getTime());
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
      };

      return {
        results: [
          { label: 'Deadline to Serve Complaint', value: getWithOffset(service), isPrimary: true },
          { label: 'Defendant Answer Deadline', value: getWithOffset(service + answer), isPrimary: true },
          { label: 'Discovery Phase Cutoff', value: getWithOffset(service + answer + discovery) }
        ]
      };
    }
  }
];
