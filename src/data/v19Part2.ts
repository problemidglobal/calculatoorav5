import { Calculator } from '../types';

export const V19_PART2_CALCULATORS: Calculator[] = [
  // ====================================== DATA SCIENCE ======================================
  {
    id: 'dataset-size',
    name: 'Dataset Size Calculator',
    slug: 'dataset-size',
    category: 'data-science',
    description: 'Calculate raw disk size and memory footprint for tabular, text, or image datasets.',
    formula: 'Dataset Size = Row Count * Column Count * Bytes per Cell * Compression Factor',
    explanation: 'Calculates active storage needs using row sizes, formatting types (CSV, Parquet, JSON), and features counts.',
    example: 'A dataset of 10,000,000 cells using float64 numbers takes about 80 Megabytes in uncompressed RAM.',
    inputs: [
      { id: 'rowCount', label: 'Total Row/Sample Count', type: 'number', defaultValue: 100000, min: 1, max: 100000000, step: 1000 },
      { id: 'colCount', label: 'Average Numerical Columns/Features', type: 'number', defaultValue: 50, min: 1, max: 5000, step: 5 },
      { id: 'storageFormat', label: 'Disk Storage Serialization Format', type: 'select', defaultValue: 'parquet', options: [
        { label: 'Apache Parquet (Optimized columnar compression)', value: 'parquet' },
        { label: 'Plain Comma Separated (CSV text)', value: 'csv' },
        { label: 'Uncompressed RAM Float Array', value: 'ram' }
      ]}
    ],
    faq: [
      { question: 'Why is Parquet smaller than CSV?', answer: 'Parquet uses dictionary encoding, run-length limiting, and column-level SNAPPY compression, achieving up to 5x better compression than verbose plaintext CSV.' }
    ],
    relatedSlugs: ['data-sampling', 'data-processing'],
    seoTitle: 'Data Science Dataset Disk & Memory Size Calculator',
    seoDescription: 'Estimate plain text CSV, compressed Parquet disk sizes, and RAM heap allocations for machine learning backlogs.',
    calculate: (inputs) => {
      const rows = Number(inputs.rowCount || 1000);
      const cols = Number(inputs.colCount || 10);
      const format = inputs.storageFormat || 'parquet';

      const cellCount = rows * cols;
      let bytesPerCell = 8; // default standard float64/string mix

      let compressionMultiplier = 1.0;
      if (format === 'parquet') {
        compressionMultiplier = 0.18; // 82% compression ratio
      } else if (format === 'csv') {
        bytesPerCell = 15; // string text character counts take more space on disk
        compressionMultiplier = 0.75;
      }

      const rawBytes = cellCount * bytesPerCell * compressionMultiplier;
      const totalMb = rawBytes / (1024 * 1024);

      return {
        results: [
          { label: 'Projected File Size On Disk', value: totalMb.toFixed(1), unit: 'MB', isPrimary: true },
          { label: 'Total Grid Coordinates', value: cellCount.toLocaleString(), unit: 'cells' },
          { label: 'RAM Operational Heap Space', value: ((cellCount * 8) / (1024 * 1024)).toFixed(1), unit: 'MB' }
        ]
      };
    }
  },
  {
    id: 'data-sampling',
    name: 'Data Sampling Calculator',
    slug: 'data-sampling',
    category: 'data-science',
    description: 'Calculate sample sizes based on population thresholds, margin of error, and confidence levels.',
    formula: 'n = [Z^2 * p * (1-p)] / e^2',
    explanation: 'Uses Cochran\'s formula to calculate the minimum sample size required to represent a population.',
    example: 'For a population of 50,000, achieving a 5% margin of error at 95% confidence targets 382 samples.',
    inputs: [
      { id: 'popSize', label: 'Target Population Size', type: 'number', defaultValue: 50000, min: 1, max: 100000000 },
      { id: 'marginOfError', label: 'Desired Margin of Error', type: 'number', defaultValue: 5, min: 0.1, max: 20, step: 0.5, unit: '%' },
      { id: 'confidenceLevel', label: 'Confidence Level Setting', type: 'select', defaultValue: '95', options: [
        { label: '99% Confidence Level (Z-score: 2.576)', value: '99' },
        { label: '95% Confidence Level (Z-score: 1.96)', value: '95' },
        { label: '90% Confidence Level (Z-score: 1.645)', value: '90' }
      ]}
    ],
    faq: [
      { question: 'What is margin of error in sampling?', answer: 'The margin of error defines the range around the sample result where the true population value is likely to fall.' }
    ],
    relatedSlugs: ['dataset-size', 'data-distribution'],
    seoTitle: 'Interactive Cochran Data Sampling Size Calculator',
    seoDescription: 'Find required survey sample sizes based on target populations, margin of error, and confidence scores.',
    calculate: (inputs) => {
      const nTotal = Number(inputs.popSize || 1000);
      const e = Number(inputs.marginOfError || 5) / 100;
      const conf = inputs.confidenceLevel || '95';

      let z = 1.96;
      if (conf === '99') z = 2.576;
      if (conf === '90') z = 1.645;

      const p = 0.55; // standard worst-case proportion for high variance
      const n0 = (z * z * p * (1 - p)) / (e * e);
      const finiteSample = n0 / (1 + ((n0 - 1) / nTotal));

      const finalSampleNeeded = Math.ceil(finiteSample);

      return {
        results: [
          { label: 'Minimum Samples Required', value: finalSampleNeeded, isPrimary: true },
          { label: 'Population Fraction Covered', value: ((finalSampleNeeded / nTotal) * 100).toFixed(2), unit: '%' },
          { label: 'Critical Z-Score Value', value: z }
        ]
      };
    }
  },
  {
    id: 'data-distribution',
    name: 'Data Distribution Calculator',
    slug: 'data-distribution',
    category: 'data-science',
    description: 'Analyze distribution shapes using mean, variance, skewness, and Kurtosis formulas.',
    formula: 'Skewness = E[(X - Mean)^3] / std_dev^3',
    explanation: 'Input list coordinates to review variance, standard deviation offsets, skewness profiles, and percentile divisions.',
    example: 'An input data array [10, 15, 20, 25, 90] yields positive skewness due to the high outlier (90).',
    inputs: [
      { id: 'datasetValues', label: 'Raw Dataset Array Input (comma-separated)', type: 'text', defaultValue: '12, 14, 18, 15, 26, 30, 11, 14' }
    ],
    faq: [
      { question: 'What does positive skewness say about data?', answer: 'Positive skewness means the distribution has an elongated right tail. The majority of values cluster on the lower side, while a few high outliers pull the mean upwards.' }
    ],
    relatedSlugs: ['data-sampling', 'model-evaluation'],
    seoTitle: 'Data Distribution Statistics & Standard Deviation Calculator',
    seoDescription: 'Input comma-separated data values to calculate variance, standard deviation indices, percentiles, and skewness shapes.',
    calculate: (inputs) => {
      const dataStr = String(inputs.datasetValues || '0');
      const numArr = dataStr.split(',')
        .map(x => Number(x.trim()))
        .filter(x => !isNaN(x) && x !== 0);

      if (numArr.length < 2) {
        return {
          results: [{ label: 'Error Status', value: 'Provide at least two values' }]
        };
      }

      const meanVal = numArr.reduce((a, b) => a + b, 0) / numArr.length;
      const sumSqrDiff = numArr.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0);
      const varianceVal = sumSqrDiff / (numArr.length - 1);
      const stdDevVal = Math.sqrt(varianceVal);

      // Skewness calculation
      const sumCubeDiff = numArr.reduce((a, b) => a + Math.pow(b - meanVal, 3), 0);
      const skewness = stdDevVal > 0 ? (sumCubeDiff / numArr.length) / Math.pow(stdDevVal, 3) : 0;

      return {
        results: [
          { label: 'Dataset Mean Average', value: meanVal.toFixed(2), isPrimary: true },
          { label: 'Standard Deviation Variance', value: stdDevVal.toFixed(2), isPrimary: true },
          { label: 'Calculated Sample Skewness', value: skewness.toFixed(3) },
          { label: 'Analyzed Item Count', value: numArr.length, unit: 'items' }
        ]
      };
    }
  },
  {
    id: 'model-evaluation',
    name: 'Model Evaluation Calculator',
    slug: 'model-evaluation',
    category: 'data-science',
    description: 'Verify model performance with accurate metrics like F1-Score, Precision, Recall, and AUC vectors.',
    formula: 'F1-Score = 2 * (Precision * Recall) / (Precision + Recall)',
    explanation: 'Uses confusion matrix coordinates (TP, FP, TN, FN) to compute metrics for classification models.',
    example: 'With 80 True Positives, 10 False Positives, and 20 False Negatives, you achieve an 84% F1-score.',
    inputs: [
      { id: 'truePositives', label: 'True Positives (TP)', type: 'number', defaultValue: 82, min: 0 },
      { id: 'falsePositives', label: 'False Positives (FP)', type: 'number', defaultValue: 12, min: 0 },
      { id: 'trueNegatives', label: 'True Negatives (TN)', type: 'number', defaultValue: 780, min: 0 },
      { id: 'falseNegatives', label: 'False Negatives (FN)', type: 'number', defaultValue: 18, min: 0 }
    ],
    faq: [
      { question: 'What is the F1-Score?', answer: 'The F1-Score represents the harmonic mean of precision and recall. It balances these metrics, providing a clearer evaluation on imbalanced datasets compared to accuracy alone.' }
    ],
    relatedSlugs: ['data-distribution', 'accuracy-improvement'],
    seoTitle: 'ML Classification Model Confusion Matrix & F1-Score Calculator',
    seoDescription: 'Calculate F1-Score, sensitivity, recall, and specificity using standard Confusion Matrix inputs.',
    calculate: (inputs) => {
      const tp = Number(inputs.truePositives || 0);
      const fp = Number(inputs.falsePositives || 0);
      const tn = Number(inputs.trueNegatives || 0);
      const fn = Number(inputs.falseNegatives || 0);

      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
      const accuracy = (tp + tn) / Math.max(1, (tp + fp + tn + fn));

      return {
        results: [
          { label: 'F1 Classification Score', value: (f1 * 100).toFixed(1), unit: '%', isPrimary: true },
          { label: 'Calculated Precision Index', value: (precision * 100).toFixed(1), unit: '%', isPrimary: true },
          { label: 'Measured Sensitivity / Recall', value: (recall * 100).toFixed(1), unit: '%' },
          { label: 'Overall Metric Accuracy', value: (accuracy * 100).toFixed(1), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'accuracy-improvement',
    name: 'Accuracy Improvement Calculator',
    slug: 'accuracy-improvement',
    category: 'data-science',
    description: 'Calculate learning rate decay paths, epochs, and parameter boosts for ML accuracy.',
    formula: 'Target Accuracy = Base + (Limit - Base) * (1 - e^(-Epochs * ScalingFactor))',
    explanation: 'Models accuracy growth curves during neural network training runs, estimating when returns begin to plateau.',
    example: 'Shifting dataset size from 10k to 50k samples can raise base accuracy from 78% to 91%.',
    inputs: [
      { id: 'baseAccuracy', label: 'Current Base Model Accuracy (%)', type: 'number', defaultValue: 72, min: 1, max: 99.9, step: 0.1 },
      { id: 'scalingStepsCount', label: 'Incremental Epoch Runs Target', type: 'number', defaultValue: 30, min: 1, max: 1000 },
      { id: 'plateauLevel', label: 'Theoretical Model Ceiling Accuracy (%)', type: 'number', defaultValue: 96, min: 50, max: 100, step: 0.5 }
    ],
    faq: [
      { question: 'Why does model accuracy plateau?', answer: 'Plateaus occur as optimization algorithms settle into local minima, or when the dataset size limits further learning of general features.' }
    ],
    relatedSlugs: ['model-evaluation', 'data-processing'],
    seoTitle: 'ML Model Accuracy Growth Curve & Decay Calculator',
    seoDescription: 'Project classification precision over training steps, evaluating returns and optimization plateaus.',
    calculate: (inputs) => {
      const base = Number(inputs.baseAccuracy || 70);
      const steps = Number(inputs.scalingStepsCount || 10);
      const limit = Number(inputs.plateauLevel || 95);

      const remainingSpace = limit - base;
      const exponentialImprovement = remainingSpace * (1 - Math.exp(-steps * 0.12));
      const projectedAccuracy = base + exponentialImprovement;

      return {
        results: [
          { label: 'Projected Accuracy Target', value: projectedAccuracy.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Aggregated Gained Balance', value: exponentialImprovement.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Theoretical Room Remaining', value: (limit - projectedAccuracy).toFixed(2), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'data-processing',
    name: 'Data Processing Calculator',
    slug: 'data-processing',
    category: 'data-science',
    description: 'Estimate pipeline times for data cleaning, features mapping, indexing, and ingestion.',
    formula: 'Time Needed = Total Data Records / Processing Throughput Speed',
    explanation: 'Calculates data preprocessing times using system core structures and single-thread parser processing throughput speeds.',
    example: 'Parsing 50,000,000 transaction rows using a 1,200 rows/sec pipeline takes 11.6 hours.',
    inputs: [
      { id: 'recordCount', label: 'Total Ingestion Rows / Logs Count', type: 'number', defaultValue: 5000000, min: 0 },
      { id: 'parserSpeed', label: 'Processing Throughput Speed (Rows/sec)', type: 'number', defaultValue: 850, min: 1, max: 500000 },
      { id: 'parallelCoreNode', label: 'Allocated Parallel Core Processes', type: 'number', defaultValue: 4, min: 1, max: 128 }
    ],
    faq: [
      { question: 'How does parallel processing help ingestion speeds?', answer: 'Splitting datasets into independent shards allows multi-core CPUs to parse rows in parallel, reducing total ingestion times.' }
    ],
    relatedSlugs: ['dataset-size', 'accuracy-improvement'],
    seoTitle: 'Big Data Pipeline Processing Ingestion Time Calculator',
    seoDescription: 'Calculate data cleanup speeds, evaluating parallel worker improvements and total execution times.',
    calculate: (inputs) => {
      const rows = Number(inputs.recordCount || 100000);
      const speed = Number(inputs.parserSpeed || 100);
      const workers = Number(inputs.parallelCoreNode || 1);

      const combinedSpeed = speed * workers * 0.9; // 10% coordination overhead penalty
      const secondsNeeded = rows / combinedSpeed;
      const hoursNeeded = secondsNeeded / 3600;

      return {
        results: [
          { label: 'Data Pipeline Ingestion Time', value: hoursNeeded.toFixed(2), unit: 'hours', isPrimary: true },
          { label: 'Overall Pipeline Speed', value: Math.round(combinedSpeed), unit: 'rows / sec', isPrimary: true },
          { label: 'Single Thread Baseline Task Speed', value: speed, unit: 'rows / sec' }
        ]
      };
    }
  },

  // ====================================== ENGINEERING ======================================
  {
    id: 'engineering-material',
    name: 'Engineering Material Calculator',
    slug: 'engineering-material',
    category: 'engineering',
    description: 'Calculate safety stress loads, elastic limits, and mechanical yield bounds for structure designs.',
    formula: 'Allowable Stress = Yield Strength / Safety Factor',
    explanation: 'Uses standard material properties (Steel, Aluminum, Concrete) and safety factors to verify compliance with load limits.',
    example: 'Using structural steel (250 MPa yield strength) with a safety factor of 2.0 targets a 125 MPa allowable stress limit.',
    inputs: [
      { id: 'alloySelection', label: 'Structural Material Type', type: 'select', defaultValue: 'steel-36', options: [
        { label: 'Structural Steel (Yield point: 250 MPa)', value: 'steel-36' },
        { label: 'Aluminum 6061-T6 (Yield point: 240 MPa)', value: 'al-t6' },
        { label: 'Standard Concrete (Yield compressive: 30 MPa)', value: 'concrete' }
      ]},
      { id: 'safetyFactorGoal', label: 'Design Safety Factor', type: 'number', defaultValue: 2.0, min: 1.1, max: 10.0, step: 0.1 }
    ],
    faq: [
      { question: 'Why is a safety factor required in engineering?', answer: 'Safety factors account for unpredictable structural loads, minor material defects, construction limitations, and weathering degradation over time.' }
    ],
    relatedSlugs: ['beam-load', 'structural-weight'],
    seoTitle: 'Engineering Allowable Stress & Material Yield Calculator',
    seoDescription: 'Calculate material safety factors, allowable stress parameters, and structural limits across multiple materials.',
    calculate: (inputs) => {
      const alloy = inputs.alloySelection || 'steel-36';
      const factor = Number(inputs.safetyFactorGoal || 2.0);

      let baseYieldMpa = 250;
      if (alloy === 'al-t6') baseYieldMpa = 240;
      if (alloy === 'concrete') baseYieldMpa = 30;

      const allowableStress = baseYieldMpa / factor;

      return {
        results: [
          { label: 'Allowable Operational Stress', value: allowableStress.toFixed(1), unit: 'MPa', isPrimary: true },
          { label: 'Configured Safety Margin', value: `${Math.round((factor - 1) * 100)}%`, isPrimary: true },
          { label: 'Ultimate Material Elastic Point', value: baseYieldMpa, unit: 'MPa' }
        ]
      };
    }
  },
  {
    id: 'beam-load',
    name: 'Beam Load Calculator',
    slug: 'beam-load',
    category: 'engineering',
    description: 'Determine bending moments, shear forces, and elastic deflections in standard beam layouts.',
    formula: 'Max Deflection = (5 * w * L^4) / (384 * E * I) [Uniformly Distributed Load]',
    explanation: 'Calculates load limits for uniformly distributed loads (UDL) on steel beams, modeling physical moments and deflections.',
    example: 'An I-beam spanning 6 meters under a 12 kN load displays deflections well within safe margins.',
    inputs: [
      { id: 'spanLengthM', label: 'Support Span Length (m)', type: 'number', defaultValue: 5.0, min: 0.5, max: 40.0, step: 0.1 },
      { id: 'totalLoadKn', label: 'Uniformly Distributed Load (kN/m)', type: 'number', defaultValue: 15.0, min: 0.1, max: 500.0, step: 0.5 },
      { id: 'elasticityGPa', label: 'Elastic Modulus parameter (E) (GPa)', type: 'number', defaultValue: 200, min: 10, max: 300, step: 5 }
    ],
    faq: [
      { question: 'What is Youngs Modulus?', answer: 'Young\'s Modulus (E) measures a solid material\'s stiffness, quantifying the relationship between elastic stress and strain.' }
    ],
    relatedSlugs: ['engineering-material', 'structural-weight'],
    seoTitle: 'Beam Load Deflection & Structural Bending Calculator',
    seoDescription: 'Calculate bending moments and shear deflections for standard uniformly distributed loads across physical support spans.',
    calculate: (inputs) => {
      const l = Number(inputs.spanLengthM || 5);
      const w = Number(inputs.totalLoadKn || 10);
      const eGpa = Number(inputs.elasticityGPa || 200);

      // Max bending moment for simply supported UDL load = w * L^2 / 8
      const maxMoment = (w * l * l) / 8;
      
      // Moment of inertia estimate (I) for standard wide-flange profiles (~8.0e-5 m4)
      const I = 8.5e-5; 
      const E_Pascal = eGpa * 1e9;
      const w_Nm = w * 1000;

      const deflectionM = (5 * w_Nm * Math.pow(l, 4)) / (384 * E_Pascal * I);
      const deflectionMm = deflectionM * 1000;

      return {
        results: [
          { label: 'Maximum Bending Moment', value: maxMoment.toFixed(1), unit: 'kN·m', isPrimary: true },
          { label: 'Projected Central Deflection', value: deflectionMm.toFixed(2), unit: 'mm', isPrimary: true },
          { label: 'Shear Boundary Load Cap', value: (w * l / 2).toFixed(1), unit: 'kN' }
        ]
      };
    }
  },
  {
    id: 'structural-weight',
    name: 'Structural Weight Calculator',
    slug: 'structural-weight',
    category: 'engineering',
    description: 'Calculate overall weights for profiles like I-Beams, channels, plates, and pipes.',
    formula: 'Weight = Volume * Density',
    explanation: 'Uses cross-sectional areas, lengths, and specific densities to calculate correct structural weights.',
    example: 'An I-Beam spanning 6 meters weighing 45 kilograms per meter scales exactly to 270 kilograms.',
    inputs: [
      { id: 'profileShape', label: 'Cross-Section Profile Shape', type: 'select', defaultValue: 'ibeam', options: [
        { label: 'Standard Wide-Flange I-Beam (45 kg/m)', value: 'ibeam' },
        { label: 'Heavy Steel Plate (7850 kg/m3 density)', value: 'plate' },
        { label: 'Round Steel Pipe / Tube', value: 'pipe' }
      ]},
      { id: 'aggregateLengthM', label: 'Aggregate Target Length (m)', type: 'number', defaultValue: 6.0, min: 0.1, max: 200.0, step: 0.5 },
      { id: 'plateThicknessMm', label: 'Material Thickness (if Plate or Tube) (mm)', type: 'number', defaultValue: 10, min: 1, max: 100, step: 1 }
    ],
    faq: [
      { question: 'What is the density of structural steel?', answer: 'Standard carbon steel has a density of about 7,850 kg/m³ (490 lbs/ft³), serving as a core benchmark for engineering and construction weight formulas.' }
    ],
    relatedSlugs: ['engineering-material', 'beam-load'],
    seoTitle: 'Structural Metal Profile & Steel Weight Calculator',
    seoDescription: 'Calculate structural weights for standard shapes, I-Beams, channel sections, hollow pipes, and plates.',
    calculate: (inputs) => {
      const shape = inputs.profileShape || 'ibeam';
      const len = Number(inputs.aggregateLengthM || 1);
      const thick = Number(inputs.plateThicknessMm || 10);

      let computedWeight = 0;
      if (shape === 'ibeam') {
        computedWeight = len * 45; // 45 kg per meter
      } else if (shape === 'plate') {
        // Assume default plate width of 1.2 meters
        const volume = 1.2 * len * (thick / 1000);
        computedWeight = volume * 7850;
      } else {
        // Pipe estimate
        const outerD = 0.15; // 150mm diam
        const innerD = outerD - (thick * 2 / 1000);
        const area = Math.PI * (Math.pow(outerD, 2) - Math.pow(innerD, 2)) / 4;
        const volume = area * len;
        computedWeight = volume * 7850;
      }

      return {
        results: [
          { label: 'Calculated Cargo Weight', value: Math.round(computedWeight), unit: 'kg', isPrimary: true },
          { label: 'Force Due to Gravity Load', value: (computedWeight * 0.00981).toFixed(2), unit: 'kN', isPrimary: true },
          { label: 'Standard Transport Logistics', value: computedWeight > 1000 ? 'Freight vehicle Required' : 'Light truck pickup possible' }
        ]
      };
    }
  },
  {
    id: 'heat-transfer',
    name: 'Heat Transfer Calculator',
    slug: 'heat-transfer',
    category: 'engineering',
    description: 'Model thermal losses, conductive dynamics, and heat flows across multiple layers of material.',
    formula: 'Q = (k * A * dT) / d',
    explanation: 'Uses Fourier\'s Law of Heat Conduction to solve conductive thermal heat flows in watts.',
    example: 'An insulated brick wall (thickness: 0.2m) under standard temperature differences experiences ~150 Watts of thermal flux.',
    inputs: [
      { id: 'surfaceAreaM2', label: 'Conductive Surface Area (m2)', type: 'number', defaultValue: 15, min: 0.1, max: 10000 },
      { id: 'tempDiffCelsius', label: 'Temperature Gradient (dT) (C)', type: 'number', defaultValue: 20, min: 1, max: 1500 },
      { id: 'materialk', label: 'Thermal Conductive Coefficient (k) (W/m·K)', type: 'select', defaultValue: 0.04, options: [
        { label: 'Fiberglass Insulation (Highly insulating: 0.04)', value: 0.04 },
        { label: 'Building Brick / Concrete structural (0.8)', value: 0.8 },
        { label: 'Aluminum metal (Highly conductive: 205.0)', value: 205.0 }
      ]},
      { id: 'layerThicknessM', label: 'Wall Layer Thickness (d) (m)', type: 'number', defaultValue: 0.12, min: 0.001, max: 5.0, step: 0.01 }
    ],
    faq: [
      { question: 'What is thermal conductivity (k)?', answer: 'Thermal conductivity (k) measures a material\'s ability to conduct heat. Low coefficients indicate insulation, while high values represent metal thermal conductors.' }
    ],
    relatedSlugs: ['fluid-flow', 'engineering-cost'],
    seoTitle: 'Thermal Energy Conduction & Insulating Loss Calculator',
    seoDescription: 'Calculate thermal leakage, insulation resistance, and conductive heat flows across materials using Fourier\'s laws.',
    calculate: (inputs) => {
      const area = Number(inputs.surfaceAreaM2 || 1);
      const dT = Number(inputs.tempDiffCelsius || 10);
      const k = Number(inputs.materialk || 0.04);
      const d = Math.max(0.001, Number(inputs.layerThicknessM || 0.1));

      const heatFlowWatts = (k * area * dT) / d;
      const thermalResistance = d / (k * area);

      return {
        results: [
          { label: 'Aggregated Thermal Conduction', value: Math.round(heatFlowWatts), unit: 'Watts', isPrimary: true },
          { label: 'Total Thermal Resistance (R)', value: thermalResistance.toFixed(3), unit: 'K/W', isPrimary: true },
          { label: 'Approximate Daily BTU Loss', value: Math.round(heatFlowWatts * 3.412 * 24), unit: 'BTU / day' }
        ]
      };
    }
  },
  {
    id: 'fluid-flow',
    name: 'Fluid Flow Calculator',
    slug: 'fluid-flow',
    category: 'engineering',
    description: 'Calculate pipeline volumetric flow rates, speeds, and cross-section areas.',
    formula: 'Q = A * v',
    explanation: 'Applies flow conservation principles, converting pipe diameters and linear speeds to evaluate volumetric capacities.',
    example: 'A 50mm dynamic intake pipe running water at 2 meters/second carries 0.0039 cubic meters/second.',
    inputs: [
      { id: 'pipeInDiameterMm', label: 'Internal Conduit Diameter (mm)', type: 'number', defaultValue: 50, min: 1, max: 5000 },
      { id: 'velocityMs', label: 'Linear Fluid Speed (v) (m/s)', type: 'number', defaultValue: 2.0, min: 0.1, max: 100.0, step: 0.1 }
    ],
    faq: [
      { question: 'What is the ideal fluid velocity in a pipe?', answer: 'For standard municipal pumping lines, water flow speeds between 1.0 m/s and 2.5 m/s minimize friction losses and avoid damaging the pipes.' }
    ],
    relatedSlugs: ['heat-transfer', 'engineering-cost'],
    seoTitle: 'Volumetric Pipeline Fluid Flow & Velocity Calculator',
    seoDescription: 'Calculate volumetric flow rates and conduit velocities using pipe diameter and linear speeds.',
    calculate: (inputs) => {
      const dMm = Number(inputs.pipeInDiameterMm || 25);
      const v = Number(inputs.velocityMs || 1);

      const radiusM = (dMm / 2) / 1000;
      const crossAreaSqrM = Math.PI * Math.pow(radiusM, 2);
      const flowRateM3s = crossAreaSqrM * v;
      const flowRateLpm = flowRateM3s * 60000; // liters per minute

      return {
        results: [
          { label: 'Volumetric Flow Capacity', value: flowRateLpm.toFixed(1), unit: 'Liters / min', isPrimary: true },
          { label: 'Pipeline Cross-Section Area', value: (crossAreaSqrM * 10000).toFixed(2), unit: 'cm²', isPrimary: true },
          { label: 'Seconds to Fill 1000L tank', value: flowRateLpm > 0 ? Math.ceil(1000 / (flowRateLpm / 60)) : 'TBD', unit: 'seconds' }
        ]
      };
    }
  },
  {
    id: 'engineering-cost',
    name: 'Engineering Cost Calculator',
    slug: 'engineering-cost',
    category: 'engineering',
    description: 'Structure design phase budgets, feasibility studies, drafting hours, and consulting fees.',
    formula: 'Total Cost = (Engineering Hours * Consulting Rate) + Prototype Fab Overhead',
    explanation: 'Details full project design phase workloads, including mechanical drawings, thermal stress audits, and compliance processing.',
    example: 'An initial design package requiring 120 consulting hours and 2 drafting cycles totals $11,400.',
    inputs: [
      { id: 'engHoursReq', label: 'Total Professional Engineering Hours', type: 'number', defaultValue: 80, min: 1, max: 1000 },
      { id: 'hourlyConsultRate', label: 'Senior PE Consulting Hourly Rate ($)', type: 'number', defaultValue: 125, min: 15, max: 500, step: 5 },
      { id: 'prototypeMfgOverhead', label: 'Testing Lab & Validation Overhead ($)', type: 'number', defaultValue: 2500, min: 0, step: 100 }
    ],
    faq: [
      { question: 'What is a PE license in engineering?', answer: 'A Professional Engineer (PE) license requires passing standardized national exams and satisfying active practice laws to certify public works systems.' }
    ],
    relatedSlugs: ['engineering-material', 'project-budget-forecast'],
    seoTitle: 'PE Consultant & CAD Mechanical Engineering Cost Calculator',
    seoDescription: 'Estimate prototype manufacturing overhead, senior consulting fees, and total engineering budgets.',
    calculate: (inputs) => {
      const hours = Number(inputs.engHoursReq || 40);
      const rate = Number(inputs.hourlyConsultRate || 100);
      const labFee = Number(inputs.prototypeMfgOverhead || 1000);

      const baseConsultingBilling = hours * rate;
      const draftingHoursBudget = hours * 0.4 * (rate * 0.6); // junior draftsman budget rates
      const overallConsultingBudget = baseConsultingBilling + draftingHoursBudget + labFee;

      return {
        results: [
          { label: 'Projected Engineering Phase Cost', value: Math.round(overallConsultingBudget), unit: '$', isPrimary: true },
          { label: 'Base Consulting Fee', value: Math.round(baseConsultingBilling), unit: '$', isPrimary: true },
          { label: 'Drafting & CAD Service Support', value: Math.round(draftingHoursBudget), unit: '$' }
        ]
      };
    }
  },

  // ====================================== CONSTRUCTION ======================================
  {
    id: 'wall-material',
    name: 'Wall Material Calculator',
    slug: 'wall-material',
    category: 'construction',
    description: 'Calculate drywalls, baseboards, studs, and nails required to build standard partitions.',
    formula: 'Stud Count = (Wall Length / Stud Spacing) + 1 (plus plates)',
    explanation: 'Translates physical wall length and height dimensions into stud counts, tracking bottom and top wood plate layouts.',
    example: 'A standard partition spanning 12 feet at 16 inches stud spacing requires 10 structural studs.',
    inputs: [
      { id: 'wallLengthFt', label: 'Partition Wall Length (feet)', type: 'number', defaultValue: 16, min: 1, max: 500 },
      { id: 'studSpacingIn', label: 'Center Stud Spacing Interval (inches)', type: 'select', defaultValue: 16, options: [
        { label: '16 inches (Residential Standard)', value: 16 },
        { label: '24 inches (Utility / Minimal standard)', value: 24 }
      ]},
      { id: 'wallHeightFt', label: 'Partition Wall Height (feet)', type: 'number', defaultValue: 8, min: 4, max: 20 }
    ],
    faq: [
      { question: 'Do stud estimates include top and bottom plates?', answer: 'Yes. Standard logic counts 2 top plates and 1 bottom plate for structural load-bearing frame designs, which is calculated as raw linear wood.' }
    ],
    relatedSlugs: ['flooring-calc', 'tile-calc'],
    seoTitle: 'Drywall, Stud & Wall Material Construction Calculator',
    seoDescription: 'Calculate required framing studs, raw drywall sheets, and linear plates for target partition sizes.',
    calculate: (inputs) => {
      const length = Number(inputs.wallLengthFt || 10);
      const spacing = Number(inputs.studSpacingIn || 16);
      const heights = Number(inputs.wallHeightFt || 8);

      const spacingFt = spacing / 12;
      const baseStudsCount = Math.ceil(length / spacingFt) + 1;
      
      // Add plates (3 linear plates per length span)
      const plateWoodNeededFt = length * 3;
      const studStandard8ftEquivalent = Math.ceil(plateWoodNeededFt / heights);

      const drywalls4x8SqFt = 32;
      const area = length * heights;
      const sheetsRequiredSingleSided = Math.ceil(area / drywalls4x8SqFt);

      return {
        results: [
          { label: 'Framing Studs Needed', value: baseStudsCount + 2, unit: 'studs', isPrimary: true },
          { label: 'Standard 4x8 Drywall Sheets', value: sheetsRequiredSingleSided * 2, unit: 'double sided', isPrimary: true },
          { label: 'Required Structural Linear Plates', value: Math.ceil(plateWoodNeededFt), unit: 'ft' }
        ]
      };
    }
  },
  {
    id: 'flooring-calc',
    name: 'Flooring Calculator',
    slug: 'flooring-calc',
    category: 'construction',
    description: 'Calculate plank flooring sizes, layout waste offsets, and carpet roll parameters.',
    formula: 'Material Required = Room Area * (1 + Layout Waste Factor)',
    explanation: 'Converts length and width dimensions into square footage estimates, applying layout waste coefficients for angled patterns.',
    example: 'A room measuring 12x15 feet with a 10% waste buffer requires exactly 198 square feet of wood planks.',
    inputs: [
      { id: 'roomLengthFt', label: 'Room Length Dimension (feet)', type: 'number', defaultValue: 15, min: 1, max: 200 },
      { id: 'roomWidthFt', label: 'Room Width Dimension (feet)', type: 'number', defaultValue: 12, min: 1, max: 200 },
      { id: 'wasteAllowancePct', label: 'Waste Buffer Allowance', type: 'number', defaultValue: 10, min: 0, max: 50, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'Why is a waste buffer allowance required for flooring?', answer: 'Planks must be trimmed to fit wall boundaries, yielding unusable cutoffs. Complex rooms with columns or fireplaces demand larger buffers (typically 15%).' }
    ],
    relatedSlugs: ['tile-calc', 'paint-calc'],
    seoTitle: 'Wood Plank, Carpet, & Square Feet Flooring Calculator',
    seoDescription: 'Calculate wood flooring, tile boxes, carpet rolls, and overall square footage with custom waste margins.',
    calculate: (inputs) => {
      const l = Number(inputs.roomLengthFt || 10);
      const w = Number(inputs.roomWidthFt || 10);
      const waste = Number(inputs.wasteAllowancePct || 10) / 100;

      const baseArea = l * w;
      const grossAreaWithWaste = baseArea * (1 + waste);

      return {
        results: [
          { label: 'Gross Tile/Plank SqFt Required', value: Math.ceil(grossAreaWithWaste), unit: 'sq ft', isPrimary: true },
          { label: 'Room Net Area Dimension', value: baseArea, unit: 'sq ft', isPrimary: true },
          { label: 'Wasted Scrap Allocation', value: Math.ceil(baseArea * waste), unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'tile-calc',
    name: 'Tile Calculator',
    slug: 'tile-calc',
    category: 'construction',
    description: 'Estimate required tile counts and grout volumes for kitchen, bath, and flooring layouts.',
    formula: 'Tile Units = Floor Area / Size of Single Tile',
    explanation: 'Calculates overall tile count based on spacing grout lines, floor areas, and waste parameters.',
    example: 'A 100-square-foot pattern using 12x12-inch tiles requires exactly 110 tiles, including a 10% waste buffer.',
    inputs: [
      { id: 'targetAreaSqFt', label: 'Target Tile Coverage Area (sq ft)', type: 'number', defaultValue: 120, min: 1, max: 5000 },
      { id: 'tileFormatSize', label: 'Tile Dimension Format', type: 'select', defaultValue: '12x12', options: [
        { label: 'Standard Square (12" x 12")', value: '12x12' },
        { label: 'Large Format (24" x 24")', value: '24x24' },
        { label: 'Subway Brick Style (3" x 6")', value: '3x6' }
      ]},
      { id: 'layingWastePercent', label: 'Cutting & Shard Waste Margin', type: 'number', defaultValue: 12, min: 0, max: 40, step: 2, unit: '%' }
    ],
    faq: [
      { question: 'Should I increase waste buffers for herringbone layouts?', answer: 'Yes. Intricate tile patterns (like herringbone or diagonal offsets) require many angled perimeter cuts, increasing waste to ~15%.' }
    ],
    relatedSlugs: ['flooring-calc', 'wall-material'],
    seoTitle: 'Tile Count, Grout Coverage & Construction Layout Calculator',
    seoDescription: 'Calculate accurate tile quantities, box requirements, and laying patterns with user-configured grout margins.',
    calculate: (inputs) => {
      const area = Number(inputs.targetAreaSqFt || 50);
      const format = inputs.tileFormatSize || '12x12';
      const waste = Number(inputs.layingWastePercent || 10) / 100;

      let singleTileAreaSqFt = 1.0;
      if (format === '24x24') singleTileAreaSqFt = 4.0;
      if (format === '3x6') singleTileAreaSqFt = 0.125;

      const baseTileCountNoWaste = area / singleTileAreaSqFt;
      const tileWithWaste = baseTileCountNoWaste * (1 + waste);

      return {
        results: [
          { label: 'Total Individual Tiles Needed', value: Math.ceil(tileWithWaste), isPrimary: true },
          { label: 'Theoretical Tile Count', value: Math.ceil(baseTileCountNoWaste), isPrimary: true },
          { label: 'Estimated Grout Mix Weight', value: Math.ceil(area * 0.35), unit: 'lbs' }
        ]
      };
    }
  },
  {
    id: 'paint-calc',
    name: 'Paint Calculator',
    slug: 'paint-calc',
    category: 'construction',
    description: 'Calculate paint volume bounds for target wall areas while managing doors and windows.',
    formula: 'Paint Volume (Gallons) = (Wall Area - Openings Area) * Coats / 350 sq ft',
    explanation: 'Estimates required paint volumes using standard coverage metrics (typically 350-400 sq ft per gallon).',
    example: 'A 15x12-foot room with standard trim needs about 2 gallons of paint for 2 solid coats.',
    inputs: [
      { id: 'perimeterFt', label: 'Total Combined Wall Perimeter (feet)', type: 'number', defaultValue: 54, min: 4, max: 1000 },
      { id: 'wallHeightFt', label: 'Wall Height Dimension (feet)', type: 'number', defaultValue: 8, min: 4, max: 20 },
      { id: 'coatRuns', label: 'Desired Coat Coverage passes', type: 'select', defaultValue: 2, options: [
        { label: '2 Coats (Recommended finish)', value: 2 },
        { label: '1 Coat (Simple freshen-up)', value: 1 }
      ]},
      { id: 'exclusionsCount', label: 'Number of Doors / Major Windows', type: 'number', defaultValue: 3, min: 0, max: 20 }
    ],
    faq: [
      { question: 'Does open drywall absorb paint faster?', answer: 'Yes. Raw, unprimed drywall absorbs moisture aggressively, requiring up to 50% more base coat volume if primer is omitted.' }
    ],
    relatedSlugs: ['flooring-calc', 'tile-calc'],
    seoTitle: 'Interactive Wall Paint Gallon & Coverage Calculator',
    seoDescription: 'Calculate required paint gallons for walls and trim, factoring in door and window openings.',
    calculate: (inputs) => {
      const perim = Number(inputs.perimeterFt || 40);
      const height = Number(inputs.wallHeightFt || 8);
      const coats = Number(inputs.coatRuns || 2);
      const openings = Number(inputs.exclusionsCount || 2);

      const netWallArea = (perim * height) - (openings * 21); // standard opening takes ~21 sq ft
      const grossCoverageSqFtNeeded = Math.max(20, netWallArea * coats);
      
      const standardGallonSqFtMatch = 350;
      const gallonsNeeded = grossCoverageSqFtNeeded / standardGallonSqFtMatch;

      return {
        results: [
          { label: 'Paint Volume Needed', value: gallonsNeeded.toFixed(2), unit: 'gallons', isPrimary: true },
          { label: 'Net Area to Cover', value: Math.ceil(netWallArea), unit: 'sq ft', isPrimary: true },
          { label: 'Quart Cans Alternative', value: Math.ceil(gallonsNeeded * 4), unit: 'quarts' }
        ]
      };
    }
  },
  {
    id: 'roofing-material',
    name: 'Roofing Material Calculator',
    slug: 'roofing-material',
    category: 'construction',
    description: 'Estimate required roof shingles, underlayment rolls, and wood decking coordinates.',
    formula: 'Roof Area = Floor Area / COS(Pitch Angle) * (1 + Waste Factor)',
    explanation: 'Converts length, width, and roof pitch into total roofing square requirements (1 roofing square = 100 sq ft).',
    example: 'A 1,500 sq ft building under a 6:12 sloped roof requires approximately 19 squares of shingles.',
    inputs: [
      { id: 'footprintSqFt', label: 'Building Floor Footprint Area (sq ft)', type: 'number', defaultValue: 1500, min: 100, max: 50000 },
      { id: 'roofPitchInches', label: 'Roof Slope Pitch (rise inches/12)', type: 'select', defaultValue: 6, options: [
        { label: 'Flat or Low Pitch (2/12)', value: 2 },
        { label: 'Standard Gable (5/12)', value: 5 },
        { label: 'Moderate Roof Pitch (6/12)', value: 6 },
        { label: 'Steep Sloped Roof (9/12)', value: 9 }
      ]},
      { id: 'wasteAllowancePct', label: 'Layout Cutting Waste Factor', type: 'number', defaultValue: 15, min: 0, max: 40, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'What is a shingle square in roofing?', answer: 'A "square" in roofing represents exactly 100 square feet of shingles, equivalent to about 3 standard shingle bundles.' }
    ],
    relatedSlugs: ['construction-waste', 'wall-material'],
    seoTitle: 'Roofing Shingles, Slope Area & Square Calculator',
    seoDescription: 'Calculate shingle bundles, underlayment sheets, and sloped roofing areas based on floor sizes and pitch ratios.',
    calculate: (inputs) => {
      const ftPr = Number(inputs.footprintSqFt || 1000);
      const pitch = Number(inputs.roofPitchInches || 6);
      const waste = Number(inputs.wasteAllowancePct || 10) / 100;

      // Calculate slant factor
      const angleRad = Math.atan(pitch / 12);
      const slopeFactor = 1 / Math.cos(angleRad);

      const netSlopedArea = ftPr * slopeFactor;
      const slopedAreaWithWaste = netSlopedArea * (1 + waste);
      const roofingSquares = slopedAreaWithWaste / 100;

      return {
        results: [
          { label: 'Required Shingle Bundles', value: Math.ceil(roofingSquares * 3), unit: 'bundles', isPrimary: true },
          { label: 'Total Sloped Area Covered', value: Math.round(slopedAreaWithWaste), unit: 'sq ft', isPrimary: true },
          { label: 'Shingle Squares Volume', value: roofingSquares.toFixed(1), unit: 'Squares' }
        ]
      };
    }
  },
  {
    id: 'construction-waste',
    name: 'Construction Waste Calculator',
    slug: 'construction-waste',
    category: 'construction',
    description: 'Forecast scrap yields and required dumpster volumes for demolition and building projects.',
    formula: 'Waste Tons = Building Area (sq ft) * Material Specific Weight',
    explanation: 'Estimates demolition scraps and scrap wood tonnage, helping managers allocate recycling resources.',
    example: 'Remodeling a 1,200 sq ft home can yield around 4 to 5 tons of construction timber and drywall scraps.',
    inputs: [
      { id: 'buildingSqFtVal', label: 'Development/Renovation Area (sq ft)', type: 'number', defaultValue: 1200, min: 10, max: 100000 },
      { id: 'jobTypeCategory', label: 'Construction Project Archetype', type: 'select', defaultValue: 'remodel', options: [
        { label: 'Renovation / Interior Remodeling (Drywall/Floors)', value: 'remodel' },
        { label: 'Completely New construction', value: 'new' },
        { label: 'Total Building Demolition (Max scrap load)', value: 'demo' }
      ]}
    ],
    faq: [
      { question: 'How is construction waste handled?', answer: 'Waste is sorted onsite or transported to specialized material recovery facilities (MRFs) to recycle wood, metals, and concrete, lowering footprint costs.' }
    ],
    relatedSlugs: ['roofing-material', 'wall-material'],
    seoTitle: 'Construction Dumpster Size & Demolition Scrap Weight Calculator',
    seoDescription: 'Eestimate waste tonnage, dumpster yards, and recycling ratios for residential remodel projects.',
    calculate: (inputs) => {
      const area = Number(inputs.buildingSqFtVal || 1000);
      const job = inputs.jobTypeCategory || 'remodel';

      let lbsPerSqFt = 4.3; // standard light residential remodel
      if (job === 'new') lbsPerSqFt = 3.9;
      if (job === 'demo') lbsPerSqFt = 75.0; // heavy brick, structure weights

      const totalLbs = area * lbsPerSqFt;
      const totalTons = totalLbs / 2000;
      
      // 1 cubic yard of standard construction debris averages ~350 lbs
      const dumpsterYards = totalLbs / 350;

      return {
        results: [
          { label: 'Estimated Scrap Weight', value: totalTons.toFixed(1), unit: 'U.S. Tons', isPrimary: true },
          { label: 'Recommended Dumpster Size', value: Math.ceil(dumpsterYards), unit: 'Cubic Yards', isPrimary: true },
          { label: 'Project Debris Category', value: job === 'demo' ? 'Heavy Masonry and Masonry Mix' : 'Light wood, drywall & frames' }
        ]
      };
    }
  },

  // ====================================== HOME IMPROVEMENT ======================================
  {
    id: 'furniture-cost',
    name: 'Furniture Cost Calculator',
    slug: 'furniture-cost',
    category: 'home-improvement',
    description: 'Plan home staging budgets for living rooms, master bedrooms, and dining spaces.',
    formula: 'Budget = SUM(Unit price * count) * TAX + Delivery fees',
    explanation: 'Models space budgets using target categories, quality tiers, and additional delivery overheads.',
    example: 'Staging a full living room with standard-category seating and storage averages $3,250.',
    inputs: [
      { id: 'qualityTierOption', label: 'Preferred Quality/Brand Profile', type: 'select', defaultValue: 'standard', options: [
        { label: 'Self-Assemble / Flat Pack (Budget)', value: 'budget' },
        { label: 'Mainstream Retail (Comfort / Built to last)', value: 'standard' },
        { label: 'Premium Artisan (Solid wood, bespoke builds)', value: 'premium' }
      ]},
      { id: 'roomsStaged', label: 'Total Rooms to Furnish', type: 'number', defaultValue: 3, min: 1, max: 15 },
      { id: 'salesTaxPct', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: 8.25, min: 0, max: 25, step: 0.1 }
    ],
    faq: [
      { question: 'What is furniture staging?', answer: 'Staging enhances home interiors using clean, coordinated furniture configurations, helping prospective home-buyers envision the space.' }
    ],
    relatedSlugs: ['interior-budget', 'room-size'],
    seoTitle: 'Home Staging & Furniture Budget Planning Calculator',
    seoDescription: 'Plan staging costs and furniture investments across multiple rooms using standard quality benchmarks.',
    calculate: (inputs) => {
      const tier = inputs.qualityTierOption || 'standard';
      const count = Number(inputs.roomsStaged || 1);
      const tax = Number(inputs.salesTaxPct || 0) / 100;

      let baseCostPerRoom = 1200;
      if (tier === 'standard') baseCostPerRoom = 3200;
      if (tier === 'premium') baseCostPerRoom = 7800;

      const baseStagingCost = baseCostPerRoom * count;
      const combinedSurcharge = baseStagingCost * (1 + tax) + 250; // standard flat delivery fee

      return {
        results: [
          { label: 'Staged Project Budget', value: Math.round(combinedSurcharge), unit: '$', isPrimary: true },
          { label: 'Base Furniture Cost', value: baseStagingCost, unit: '$', isPrimary: true },
          { label: 'Calculated Delivery & Tax', value: Math.round((baseStagingCost * tax) + 250), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'room-size',
    name: 'Room Size Calculator',
    slug: 'room-size',
    category: 'home-improvement',
    description: 'Determine floor areas, perimeters, and diagonal spans for staging prep and renovation layout design.',
    formula: 'Area = Length * Width',
    explanation: 'Converts length and width dimensions into total square feet or square meters, calculating diagonal spacing.',
    example: 'A room measuring 12x14 feet has an area of 168 sq ft and a 18.4-foot corner-to-corner diagonal.',
    inputs: [
      { id: 'lengthFtVal', label: 'Room Length Dimension (feet)', type: 'number', defaultValue: 14, min: 1, max: 100 },
      { id: 'widthFtVal', label: 'Room Width Dimension (feet)', type: 'number', defaultValue: 12, min: 1, max: 100 }
    ],
    faq: [
      { question: 'Standard corner diagonal formula?', answer: 'Diagonal is computed using the Pythagorean theorem: Diagonal = SQRT(Length² + Width²).' }
    ],
    relatedSlugs: ['furniture-cost', 'lighting-calculator'],
    seoTitle: 'Room Floor Area & Diagonal Corner Space Calculator',
    seoDescription: 'Calculate room perimeters, square footage, and diagonal spans for carpet, drywall, and furniture layout designs.',
    calculate: (inputs) => {
      const l = Number(inputs.lengthFtVal || 10);
      const w = Number(inputs.widthFtVal || 10);

      const area = l * w;
      const perm = (l + w) * 2;
      const diag = Math.sqrt(Math.pow(l, 2) + Math.pow(w, 2));

      return {
        results: [
          { label: 'Overall Floor Area', value: area, unit: 'sq ft', isPrimary: true },
          { label: 'Measured Perimeter Span', value: perm, unit: 'ft', isPrimary: true },
          { label: 'Diagonal Corner-to-Corner', value: diag.toFixed(1), unit: 'ft' }
        ]
      };
    }
  },
  {
    id: 'interior-budget',
    name: 'Interior Budget Calculator',
    slug: 'interior-budget',
    category: 'home-improvement',
    description: 'Track wallpaper, baseboard, accent lighting, and contractor installation costs.',
    formula: 'Cost = Material Cost + Contractor DayRate * Days Needed',
    explanation: 'Combines decor choices, wall scaling, and general contractor rates to estimate interior remodeling budgets.',
    example: 'A bedroom decorative paint remodel spanning 3 weekdays averages $1,800 under standard contractor rates.',
    inputs: [
      { id: 'materialTierSelect', label: 'Interior Material Quality Tier', type: 'select', defaultValue: 'retail-med', options: [
        { label: 'Retail Standard (Hardware store paint & baseboards)', value: 'retail-med' },
        { label: 'Designer Specialty (Exotic wallpapers & solid crown moldings)', value: 'designer' }
      ]},
      { id: 'contractorDays', label: 'Contractor Days Booked', type: 'number', defaultValue: 3, min: 0, max: 60 },
      { id: 'roomFootprintSqFt', label: 'Remodeling Room Area (sq ft)', type: 'number', defaultValue: 150, min: 10, max: 5000 }
    ],
    faq: [
      { question: 'What are typical contractor interior day-rates?', answer: 'Skilled trade day-rates average between $350 and $650 per worker, depending on regional licenses and project complexity.' }
    ],
    relatedSlugs: ['furniture-cost', 'home-project-calc'],
    seoTitle: 'Interior Design Remodeling & DIY Budget Planner',
    seoDescription: 'Forecast wallpaper, trim, crown moldings, accent paint, and contractor day-rates for home remodels.',
    calculate: (inputs) => {
      const tier = inputs.materialTierSelect || 'retail-med';
      const days = Number(inputs.contractorDays || 0);
      const area = Number(inputs.roomFootprintSqFt || 100);

      let matCostPerSqFt = 4;
      if (tier === 'designer') matCostPerSqFt = 18;

      const materialCost = area * matCostPerSqFt;
      const contractorFees = days * 450; // standard $450/day interior carpenter estimate
      const overallCost = materialCost + contractorFees;

      return {
        results: [
          { label: 'Projected Interior Budget', value: Math.round(overallCost), unit: '$', isPrimary: true },
          { label: 'Material Costs Allocation', value: materialCost, unit: '$', isPrimary: true },
          { label: 'Contractor Fees Allocation', value: contractorFees, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'lighting-calculator',
    name: 'Lighting Calculator',
    slug: 'lighting-calculator',
    category: 'home-improvement',
    description: 'Calculate required lumens and fixture counts, planning modern layouts based on room dimensions.',
    formula: 'Total Lumens = Area in sq ft * Foot-candles Target',
    explanation: 'Uses lighting design principles (foot-candles per room archetype) to calculate required lumen outputs and fixture counts.',
    example: 'An office room measuring 150 sq ft needs ~6,000 lumens, equivalent to about 8 standard LED recess fixtures.',
    inputs: [
      { id: 'roomRoleType', label: 'Room Lighting Purpose', type: 'select', defaultValue: 'office', options: [
        { label: 'Office/Workspace Focus (High: 40 foot-candles)', value: 'office' },
        { label: 'Kitchen / Meal Prep (Moderate: 35 foot-candles)', value: 'kitchen' },
        { label: 'Living Room / Bedroom Reading (Relax: 15 foot-candles)', value: 'rest' }
      ]},
      { id: 'spaceAreaSqFt', label: 'Room Footprint (sq ft)', type: 'number', defaultValue: 150, min: 10, max: 5000 },
      { id: 'fixtureLumenOutput', label: 'Single Light Bulb/LED output (Lumens)', type: 'number', defaultValue: 800, min: 100, max: 5000, step: 100 }
    ],
    faq: [
      { question: 'What is a foot-candle?', answer: 'A foot-candle measures light density, equivalent to one lumen per square foot. Workspace tasks require 40+ foot-candles, while relaxation areas need only 10-15.' }
    ],
    relatedSlugs: ['room-size', 'home-project-calc'],
    seoTitle: 'Lumens, Foot-candles, & Recessed LED Lighting Calculator',
    seoDescription: 'Calculate required light fixture counts and lumen targets across home offices, kitchens, and bedrooms.',
    calculate: (inputs) => {
      const role = inputs.roomRoleType || 'office';
      const area = Number(inputs.spaceAreaSqFt || 100);
      const bulkLumen = Number(inputs.fixtureLumenOutput || 800);

      let fcTarget = 40;
      if (role === 'kitchen') fcTarget = 35;
      if (role === 'rest') fcTarget = 15;

      const totalRequiredLumens = area * fcTarget;
      const fixturesCountFraction = totalRequiredLumens / bulkLumen;

      return {
        results: [
          { label: 'Required Fixture Count', value: Math.ceil(fixturesCountFraction), unit: 'fixtures', isPrimary: true },
          { label: 'Overall Lumens Target', value: totalRequiredLumens, unit: 'lumens', isPrimary: true },
          { label: 'Average Light Density Result', value: fcTarget, unit: 'foot-candles' }
        ]
      };
    }
  },
  {
    id: 'home-project-calc',
    name: 'Home Project Calculator',
    slug: 'home-project-calc',
    category: 'home-improvement',
    description: 'Structure custom milestones, permits, material lines, and labor allowances for home remodels.',
    formula: 'Total Project Cost = SUM(Material Lines) + SUM(Permits / Delivery Fees) + Labor Hours * Labor Rate',
    explanation: 'Provides a structural layout to plan home improvement budgets, helping DIY builders manage contingency reserves.',
    example: 'A patio installation budget with $2,000 in materials with a 15% contingency reserve totals $2,300.',
    inputs: [
      { id: 'aggregateMatSpent', label: 'Raw Building Material Costs ($)', type: 'number', defaultValue: 2500, min: 0, step: 100 },
      { id: 'laborOptionSpent', label: 'Project Execution Route', type: 'select', defaultValue: 'diy-help', options: [
        { label: 'Complete DIY (No Labor Costs)', value: 'diy' },
        { label: 'Assisted Help / Handyman Support ($350 baseline)', value: 'diy-help' },
        { label: 'Full Contractor Job ($1,500 baseline)', value: 'pro' }
      ]},
      { id: 'permitBidsS', label: 'Local Permits, Design & Survey Fees ($)', type: 'number', defaultValue: 250, min: 0, step: 50 }
    ],
    faq: [
      { question: 'When are building permits required?', answer: 'Permits are typically required for structural modifications, deck footings, structural walls, principal roofing changes, or new wiring lines.' }
    ],
    relatedSlugs: ['interior-budget', 'furniture-cost'],
    seoTitle: 'DIY Home Renovation & Deck Project Budget Planner',
    seoDescription: 'Estimate permit fees, material bids, labor costs, and contingencies for home improvement projects.',
    calculate: (inputs) => {
      const mat = Number(inputs.aggregateMatSpent || 1000);
      const labor = inputs.laborOptionSpent || 'diy-help';
      const permits = Number(inputs.permitBidsS || 0);

      let laborSurcharge = 350;
      if (labor === 'diy') laborSurcharge = 0;
      if (labor === 'pro') laborSurcharge = 1500;

      const baseRawTotal = mat + laborSurcharge + permits;
      const structuralContingencyBuffer = baseRawTotal * 0.15; // 15% safety buffer for unplanned expenses

      return {
        results: [
          { label: 'Project Budget with Buffer', value: Math.round(baseRawTotal + structuralContingencyBuffer), unit: '$', isPrimary: true },
          { label: 'Permits & Base Fees', value: permits, unit: '$', isPrimary: true },
          { label: '15% Contingency Reserve', value: Math.round(structuralContingencyBuffer), unit: '$' }
        ]
      };
    }
  },

  // ====================================== AUTOMOTIVE ======================================
  {
    id: 'car-ownership-cost',
    name: 'Car Ownership Cost Calculator',
    slug: 'car-ownership-cost',
    category: 'automotive',
    description: 'Plan weekly and annual car ownership budgets, tracking loans, gas, insurance, and parking.',
    formula: 'Annual Cost = Loan Payments + Monthly Insurance * 12 + Annual Gas + Service allowance',
    explanation: 'Aggregates monthly auto loan bills, standard insurance rates, fuel costs, and registration fees to model true annual ownership costs.',
    example: 'A car with a $350 monthly payment and standard fuel costs averages ~$6,800 annually to operate.',
    inputs: [
      { id: 'monthlyLoanPayment', label: 'Monthly Auto Loan Payment ($)', type: 'number', defaultValue: 320, min: 0, step: 10 },
      { id: 'monthlyInsuranceCost', label: 'Monthly Care Insurance Premium ($)', type: 'number', defaultValue: 130, min: 0, step: 5 },
      { id: 'milesDrivenPerYear', label: 'Estimative Miles Driven per Year', type: 'number', defaultValue: 12000, min: 100, max: 100000, step: 500 },
      { id: 'fuelEconomyMpg', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 28, min: 5, max: 100, step: 1 }
    ],
    faq: [
      { question: 'What is the largest hidden cost of car ownership?', answer: 'Depreciation represents the largest hidden cost, accounts for ~40% of standard vehicle operations over the first 3 years.' }
    ],
    relatedSlugs: ['vehicle-depreciation', 'maintenance-cost-calc'],
    seoTitle: 'Car Ownership & Monthly Travel Commute Cost Calculator',
    seoDescription: 'Calculate annual car ownership costs, analyzing auto loan splits, monthly insurance premiums, and fuel consumption.',
    calculate: (inputs) => {
      const loan = Number(inputs.monthlyLoanPayment || 0);
      const ins = Number(inputs.monthlyInsuranceCost || 100);
      const miles = Number(inputs.milesDrivenPerYear || 12000);
      const mpg = Math.max(1, Number(inputs.fuelEconomyMpg || 25));

      const gallonsNeeded = miles / mpg;
      const annualGasSpent = gallonsNeeded * 3.65; // standard $3.65 per gallon index

      const fixedLoanAndIns = (loan + ins) * 12;
      const annualMaintenanceAllowance = 800; // standard $800 care allowance

      const totalAnnualCost = fixedLoanAndIns + annualGasSpent + annualMaintenanceAllowance;

      return {
        results: [
          { label: 'True Annual Car Cost', value: Math.round(totalAnnualCost), unit: '$ / year', isPrimary: true },
          { label: 'True Monthly Owner Operating Rate', value: Math.round(totalAnnualCost / 12), unit: '$ / month', isPrimary: true },
          { label: 'Annual Fuel Cost', value: Math.round(annualGasSpent), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'vehicle-depreciation',
    name: 'Vehicle Depreciation Calculator',
    slug: 'vehicle-depreciation',
    category: 'automotive',
    description: 'Calculate vehicle value loss over a 5-year span based on initial price and vehicle type.',
    formula: 'Value_Year_X = Purchase_Price * (1 - Depreciation_Rate)^X',
    explanation: 'Models car depreciation over time using purchase price, mileage splits, and standard model classifications.',
    example: 'A $35,000 car depreciating 15% annually retains about $15,500 in value after 5 years.',
    inputs: [
      { id: 'purchaseCostVal', label: 'Original Vehicle Purchase Price ($)', type: 'number', defaultValue: 32000, min: 1000, step: 500 },
      { id: 'vehicleTypeClass', label: 'Vehicle Segments Profile', type: 'select', defaultValue: 'sedan', options: [
        { label: 'Compact / Sedan (Standard: 15% rate)', value: 'sedan' },
        { label: 'Large SUV / Truck (Retains value better: 12% rate)', value: 'suv' },
        { label: 'Electric Vehicle / EV (Faster: 20% depreciation)', value: 'ev' }
      ]},
      { id: 'ownershipAgeYears', label: 'Asset Hold Duration (Years)', type: 'number', defaultValue: 3, min: 1, max: 20 }
    ],
    faq: [
      { question: 'Why do EVs depreciate more rapidly?', answer: 'EVs often face faster depreciation due to rapid battery upgrades and shifts in government tax incentives, lowering the pricing footprint on secondary markets.' }
    ],
    relatedSlugs: ['car-ownership-cost', 'maintenance-cost-calc'],
    seoTitle: 'Car & EV Residual Value Depreciation Calculator',
    seoDescription: 'Calculate the residual value of your car over time, evaluating depreciation across SUVs, sedans, and EVs.',
    calculate: (inputs) => {
      const price = Number(inputs.purchaseCostVal || 20000);
      const vehicle = inputs.vehicleTypeClass || 'sedan';
      const age = Number(inputs.ownershipAgeYears || 3);

      let depreciationRate = 0.15;
      if (vehicle === 'suv') depreciationRate = 0.12;
      if (vehicle === 'ev') depreciationRate = 0.20;

      const retainedValue = price * Math.pow(1 - depreciationRate, age);
      const totalLostCapital = price - retainedValue;

      return {
        results: [
          { label: 'Projected Vehicle Residual Value', value: Math.round(retainedValue), unit: '$', isPrimary: true },
          { label: 'Total Lost Capital Span', value: Math.round(totalLostCapital), unit: '$', isPrimary: true },
          { label: 'Average Annual Value Loss', value: Math.round(totalLostCapital / age), unit: '$ / year' }
        ]
      };
    }
  },
  {
    id: 'maintenance-cost-calc',
    name: 'Maintenance Cost Calculator',
    slug: 'maintenance-cost-calc',
    category: 'automotive',
    description: 'Plan budgets for routine car maintenance, including oil changes, tires, and brake pads.',
    formula: 'Maintenance cost = SUM(Frequency per Mile * Replacement Standard)',
    explanation: 'Estimates annual car maintenance based on mileage splits, vehicle age, and scheduled service intervals.',
    example: 'A 5-year-old vehicle driven 12,000 miles standard averages ~$1,100 annually for routine services.',
    inputs: [
      { id: 'milesDrivenAnnual', label: 'Annual Mileage Driven (miles)', type: 'number', defaultValue: 12000, min: 100, max: 100000 },
      { id: 'vehicleHoldAge', label: 'Current Vehicle Age (Years)', type: 'number', defaultValue: 5, min: 0, max: 30 },
      { id: 'maintenanceCategory', label: 'Service Sourcing Strategy', type: 'select', defaultValue: 'mechanic', options: [
        { label: 'Independent Specialized Mechanic (Standard rates)', value: 'mechanic' },
        { label: 'Official Brand Dealership (Premium diagnostic rates)', value: 'dealer' },
        { label: 'DIY Driveway upkeep (Save on labor fees)', value: 'diy' }
      ]}
    ],
    faq: [
      { question: 'How do car maintenance costs change as the vehicle ages?', answer: 'Maintenance costs typically increase after 5 years or 60,000 miles as warranties expire and major components (timing belts, suspension, water pumps) require service.' }
    ],
    relatedSlugs: ['car-ownership-cost', 'vehicle-depreciation'],
    seoTitle: 'Interactive Car Maintenance & Servicing Budget Calculator',
    seoDescription: 'Schedule oil changes, brake pads, and tire rotations. Plan annual maintenance budgets based on vehicle mileage and age.',
    calculate: (inputs) => {
      const miles = Number(inputs.milesDrivenAnnual || 10000);
      const age = Number(inputs.vehicleHoldAge || 3);
      const source = inputs.maintenanceCategory || 'mechanic';

      let baseCostPerMile = 0.06; // standard baseline is ~6 cents per mile for new cars
      if (age > 4) baseCostPerMile = 0.11;
      if (age > 9) baseCostPerMile = 0.16;

      let sourceMultiplier = 1.0;
      if (source === 'dealer') sourceMultiplier = 1.45;
      if (source === 'diy') sourceMultiplier = 0.40;

      const annualMaintenancePrice = miles * baseCostPerMile * sourceMultiplier;

      return {
        results: [
          { label: 'Annual Maintenance Budget', value: Math.round(annualMaintenancePrice), unit: '$ / year', isPrimary: true },
          { label: 'Recommended Monthly Reserve', value: Math.round(annualMaintenancePrice / 12), unit: '$ / month', isPrimary: true },
          { label: 'Estimated Major Repairs Chance', value: age > 8 ? 'High (60%+)' : 'Minimal' }
        ]
      };
    }
  },
  {
    id: 'fuel-cost',
    name: 'Fuel Cost Calculator',
    slug: 'fuel-cost',
    category: 'automotive',
    description: 'Calculate fuel consumption and trip costs based on distance and fuel prices.',
    formula: 'Cost = (Distance / MPG) * Price per Gallon',
    explanation: 'Converts road distances to isolate fuel volumes and calculate total gas costs.',
    example: 'Driving 350 miles with a 30 MPG vehicle under $3.50 gas costs exactly $40.83.',
    inputs: [
      { id: 'tripTotalMiles', label: 'Road Travel Distance (miles)', type: 'number', defaultValue: 450, min: 1, max: 50000 },
      { id: 'fuelConsumptionMpg', label: 'Vehicle Average Economy (MPG)', type: 'number', defaultValue: 26, min: 2, max: 120 },
      { id: 'fuelGallonCost', label: 'Average Gasoline Cost ($ / gallon)', type: 'number', defaultValue: 3.65, min: 0.5, max: 15.0, step: 0.05 }
    ],
    faq: [
      { question: 'How can I lower fuel costs?', answer: 'Maintain optimal tire pressure, remove cargo weight, and avoid rapid acceleration to improve fuel economy.' }
    ],
    relatedSlugs: ['trip-cost-calc', 'ev-charging-cost'],
    seoTitle: 'Gas Price, Mileage & Fuel Consumption Calculator',
    seoDescription: 'Calculate dynamic fuel costs and fuel volume requirements for road trips based on distance and MPG.',
    calculate: (inputs) => {
      const dist = Number(inputs.tripTotalMiles || 100);
      const mpg = Math.max(1, Number(inputs.fuelConsumptionMpg || 25));
      const price = Number(inputs.fuelGallonCost || 3.5);

      const standardGallons = dist / mpg;
      const finalCostOutcome = standardGallons * price;

      return {
        results: [
          { label: 'Total Estimated Fuel Cost', value: finalCostOutcome.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Required Gasoline Volume', value: standardGallons.toFixed(1), unit: 'gallons', isPrimary: true },
          { label: 'Expense Rate per Mile', value: (finalCostOutcome / dist).toFixed(3), unit: '$ / mile' }
        ]
      };
    }
  },
  {
    id: 'trip-cost-calc',
    name: 'Trip Cost Calculator',
    slug: 'trip-cost-calc',
    category: 'automotive',
    description: 'Forecast total road trip costs, including fuel, tolls, dining, and hotel stays.',
    formula: 'Trip Cost = Gas Spent + Tolls bid + Hotel + Meals * Days',
    explanation: 'Calculates road trip budgets by combining fuel costs, highway tolls, hotel stays, and dining allowances over the planned travel days.',
    example: 'A 2-day, 600-mile road trip with hotel stays and dining allowances totals $460.',
    inputs: [
      { id: 'roadDistanceMiles', label: 'Road Trip Distance (miles)', type: 'number', defaultValue: 650, min: 5, max: 30000 },
      { id: 'mpgTripRating', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 28, min: 2, max: 120 },
      { id: 'mealsStopsBudget', label: 'Daily Dining & Food Allowance ($)', type: 'number', defaultValue: 65, min: 0, step: 5 },
      { id: 'lodgingRentCost', label: 'Nightly Hotel & Lodging Budget ($)', type: 'number', defaultValue: 110, min: 0, step: 10 },
      { id: 'travelDurationDays', label: 'Total Road Trip Duration (days)', type: 'number', defaultValue: 3, min: 1, max: 90 }
    ],
    faq: [
      { question: 'How are highway tolls estimated?', answer: 'Tolling depends on your specific route. Long interstate highway systems (like the Pennsylvania Turnpike or New York Thruway) charge by axle mile.' }
    ],
    relatedSlugs: ['fuel-cost', 'ev-charging-cost'],
    seoTitle: 'Road Trip Budget, Lodging & Toll Cost Calculator',
    seoDescription: 'Plan road trip costs, tracking gas consumption, toll margins, hotel lodging weights, and dining allowances.',
    calculate: (inputs) => {
      const dist = Number(inputs.roadDistanceMiles || 200);
      const mpg = Math.max(1, Number(inputs.mpgTripRating || 25));
      const food = Number(inputs.mealsStopsBudget || 50);
      const room = Number(inputs.lodgingRentCost || 100);
      const days = Number(inputs.travelDurationDays || 1);

      const standardGasGallons = dist / mpg;
      const gasTotalBudget = standardGasGallons * 3.65; // standard $3.65 gallon

      const overallLodgingPrice = (days - 1) * room;
      const foodOverallPrice = days * food;
      const estimatedHighwayTolls = (dist / 100) * 3.5; // estimate $3.50 tolls per 100 miles

      const finalAggregatedCommuteCost = gasTotalBudget + overallLodgingPrice + foodOverallPrice + estimatedHighwayTolls;

      return {
        results: [
          { label: 'Overall Road Trip Cost', value: Math.round(finalAggregatedCommuteCost), unit: '$', isPrimary: true },
          { label: 'Estimated Gas Spent', value: Math.round(gasTotalBudget), unit: '$', isPrimary: true },
          { label: 'Lodging & Meals Combined', value: Math.round(overallLodgingPrice + foodOverallPrice), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'ev-charging-cost',
    name: 'EV Charging Cost Calculator',
    slug: 'ev-charging-cost',
    category: 'automotive',
    description: 'Compare EV charging costs with standard gasoline vehicle expenditures.',
    formula: 'Cost = Battery Size (kWh) * Electricity Price per kWh',
    explanation: 'Calculates the cost to charge an electric car using battery capacity, local electric rates, and charging efficiency.',
    example: 'Charging an 82 kWh battery at $0.16/kWh costs about $13.12, providing roughly 260 miles of range.',
    inputs: [
      { id: 'batteryPackKwh', label: 'Battery Capacity Size (kWh)', type: 'number', defaultValue: 75, min: 10, max: 250 },
      { id: 'localElecRateKwh', label: 'Local Residential Electric Rate ($/kWh)', type: 'number', defaultValue: 0.16, min: 0.02, max: 1.0, step: 0.01 },
      { id: 'drivingRangeMiles', label: 'Full State-of-Charge Driving Range (miles)', type: 'number', defaultValue: 250, min: 40, max: 800 }
    ],
    faq: [
      { question: 'What is charging efficiency loss?', answer: 'Charging naturally experiences energy conversion losses (usually 10% to 15%) as heat, meaning chargers draw slightly more kWh than the battery retains.' }
    ],
    relatedSlugs: ['fuel-cost', 'car-ownership-cost'],
    seoTitle: 'Electric Vehicle EV Charging Cost vs Gas Calculator',
    seoDescription: 'Estimate residential and public charging costs, comparing EV operating expenditures with gasoline options.',
    calculate: (inputs) => {
      const pack = Number(inputs.batteryPackKwh || 75);
      const rate = Number(inputs.localElecRateKwh || 0.15);
      const range = Number(inputs.drivingRangeMiles || 240);

      const netHomeChargeCost = pack * rate * 1.15; // include 15% efficiency loss
      const costPerMile = netHomeChargeCost / range;

      // Equivalent gas model spending ~15 cents per mile under current MPG averages
      const comparativeGasCostPerMile = 0.145;
      const overallEVHome15kAnnualSavings = (comparativeGasCostPerMile - costPerMile) * 15000;

      return {
        results: [
          { label: 'Full Charge Charging Cost', value: netHomeChargeCost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Estimated Cost per Mile', value: (costPerMile * 100).toFixed(1), unit: 'cents', isPrimary: true },
          { label: 'Annual Savings (vs. Gas SUV)', value: Math.round(overallEVHome15kAnnualSavings), unit: '$ / year' }
        ]
      };
    }
  },

  // ====================================== TRAVEL ======================================
  {
    id: 'trip-budget-calculator',
    name: 'Trip Budget Calculator',
    slug: 'trip-budget-calculator',
    category: 'travel',
    description: 'Plan comprehensive travel budgets, including flights, lodging, dining, and activities.',
    formula: 'Travel Budget = Flights + (Hotel + Food + Activities) * Days',
    explanation: 'Calculates overall vacation budgets by combining airfare overheads, daily hotel rates, food allowances, and emergency contingencies.',
    example: 'A 7-day international trip with $800 flights and $150 daily lodging averages ~$2,350 total.',
    inputs: [
      { id: 'mainAirfareTickets', label: 'Flight/Interstate Transit Tickets ($)', type: 'number', defaultValue: 650, min: 0, step: 50 },
      { id: 'hotelNightlyCost', label: 'Nightly Hotel Lodging Rate ($)', type: 'number', defaultValue: 140, min: 0, step: 10 },
      { id: 'diningDailyAllowance', label: 'Daily Dining & Shopping Allowance ($)', type: 'number', defaultValue: 80, min: 0, step: 5 },
      { id: 'vacationLengthDays', label: 'Trip Duration (Days)', type: 'number', defaultValue: 7, min: 1, max: 365 }
    ],
    faq: [
      { question: 'How much contingency reservation is recommended for international travel?', answer: 'We recommend adding a 15% to 20% contingency reserve to cover unexpected events like transit delays, baggage issues, or medical emergencies.' }
    ],
    relatedSlugs: ['travel-savings', 'vacation-cost-calc'],
    seoTitle: 'Dynamic Vacation & International Trip Budget Calculator',
    seoDescription: 'Estimate flight, lodging, dining, and daily activity costs. Plan vacation budgets with emergency contingency options.',
    calculate: (inputs) => {
      const fly = Number(inputs.mainAirfareTickets || 500);
      const rent = Number(inputs.hotelNightlyCost || 120);
      const food = Number(inputs.diningDailyAllowance || 75);
      const length = Number(inputs.vacationLengthDays || 7);

      const lodgingTotal = rent * (length - 1); // standard nights counts are days-1
      const mealsTotal = food * length;
      const baseRawTotal = fly + lodgingTotal + mealsTotal;
      const structuredContingencyReserves = baseRawTotal * 0.15; // 15% safety buffer

      return {
        results: [
          { label: 'Projected Total Travel Cost', value: Math.round(baseRawTotal + structuredContingencyReserves), unit: '$', isPrimary: true },
          { label: 'Required Emergency Reserves', value: Math.round(structuredContingencyReserves), unit: '$', isPrimary: true },
          { label: 'Per-Day Operating Cost', value: Math.round(baseRawTotal / length), unit: '$ / day' }
        ]
      };
    }
  },
  {
    id: 'travel-savings',
    name: 'Travel Savings Calculator',
    slug: 'travel-savings',
    category: 'travel',
    description: 'Calculate monthly savings goals to fund your next dream coordinates.',
    formula: 'Monthly Savings Needed = (Target Budget - Current Savings) / Months Remaining',
    explanation: 'Calculates the recurring monthly savings needed to reach your travel budget during a planned timeline.',
    example: 'To fund a $3,000 vacation in 10 months with $500 already saved, you need to save $250 monthly.',
    inputs: [
      { id: 'destBudgetGoal', label: 'Target Travel Budget ($)', type: 'number', defaultValue: 3500, min: 100, step: 100 },
      { id: 'currentTravelReserve', label: 'Current Savings already Set Aside ($)', type: 'number', defaultValue: 800, min: 0, step: 50 },
      { id: 'preparationMonths', label: 'Months Left to Save', type: 'number', defaultValue: 8, min: 1, max: 120 }
    ],
    faq: [
      { question: 'How can I save for travel efficiently?', answer: 'Set up automated transfers to transfer a fixed portion of your paycheck into a dedicated high-yield savings account (HYSA).' }
    ],
    relatedSlugs: ['trip-budget-calculator', 'vacation-cost-calc'],
    seoTitle: 'Travel Savings Goal & Vacation Funding Calculator',
    seoDescription: 'Calculate the monthly savings needed to fund your vacation based on your target timeline and current savings.',
    calculate: (inputs) => {
      const target = Number(inputs.destBudgetGoal || 2000);
      const current = Number(inputs.currentTravelReserve || 0);
      const months = Math.max(1, Number(inputs.preparationMonths || 6));

      const balanceNeeded = Math.max(0, target - current);
      const monthlyPace = balanceNeeded / months;

      return {
        results: [
          { label: 'Required Monthly Savings Rate', value: Math.round(monthlyPace), unit: '$ / month', isPrimary: true },
          { label: 'Aggregate Balance to Acquire', value: balanceNeeded, unit: '$', isPrimary: true },
          { label: 'Weekly Savings Equivalent', value: Math.round(monthlyPace / 4.3), unit: '$ / week' }
        ]
      };
    }
  },
  {
    id: 'vacation-cost-calc',
    name: 'Vacation Cost Calculator',
    slug: 'vacation-cost-calc',
    category: 'travel',
    description: 'Compare vacation costs across different destinations, options, and seasons.',
    formula: 'Overall Cost = Standard Costs * Rating Index',
    explanation: 'Models costs across budget and luxury tiers, sizing accommodations and activities to estimate final vacation spending.',
    example: 'Upgrading from mid-range to luxury staging tiers typically increases budgets by 2.2x.',
    inputs: [
      { id: 'travelClassSet', label: 'Travel Comfort Tier Setting', type: 'select', defaultValue: 'mid', options: [
        { label: 'Budget Comfort (Hostels, local transit, public beaches)', value: 'budget' },
        { label: 'Mid-Tier Comfort (Standard hotels, casual restaurants)', value: 'mid' },
        { label: 'Luxury Comfort (5-star resorts, private tours, fine dining)', value: 'luxury' }
      ]},
      { id: 'groupSizingPersons', label: 'Number of Travelers in Party', type: 'number', defaultValue: 2, min: 1, max: 20 },
      { id: 'tripSpanDays', label: 'Vacation Duration (Days)', type: 'number', defaultValue: 5, min: 1, max: 60 }
    ],
    faq: [
      { question: 'How can I save money when booking family vacations?', answer: 'Book during "shoulder seasons" (between peak and off-peak periods) to save up to 40% on lodging and flight costs.' }
    ],
    relatedSlugs: ['trip-budget-calculator', 'travel-savings'],
    seoTitle: 'Family Vacation & Group Travel Budget Calculator',
    seoDescription: 'Compare vacation costs across budget, mid-tier, and luxury plans. Calculate budgets based on group size.',
    calculate: (inputs) => {
      const cls = inputs.travelClassSet || 'mid';
      const size = Number(inputs.groupSizingPersons || 1);
      const days = Number(inputs.tripSpanDays || 5);

      let costPerPersonPerDay = 60; // budget baseline
      if (cls === 'mid') costPerPersonPerDay = 160;
      if (cls === 'luxury') costPerPersonPerDay = 550;

      const baseRawTotal = costPerPersonPerDay * size * days;

      return {
        results: [
          { label: 'Projected Total Vacation Cost', value: Math.round(baseRawTotal), unit: '$', isPrimary: true },
          { label: 'Average Cost per Traveler', value: Math.round(baseRawTotal / size), unit: '$', isPrimary: true },
          { label: 'Daily Group Operating Budget', value: Math.round(costPerPersonPerDay * size), unit: '$ / day' }
        ]
      };
    }
  },
  {
    id: 'travel-time-planner',
    name: 'Travel Time Planner',
    slug: 'travel-time-planner',
    category: 'travel',
    description: 'Determine flight and road trip travel times, factoring in transit zones and required stops.',
    formula: 'Duration = Distance / Average Speed + Buffer Stop times',
    explanation: 'Calculates overall travel times by factoring in driving speed bounds, mandatory driver rest stops, and terminal delays.',
    example: 'A 600-mile drive averaging 65 mph with two 30-minute rest stops takes about 10.2 hours in transit.',
    inputs: [
      { id: 'transitRouteType', label: 'Primary Transportation Mode', type: 'select', defaultValue: 'drive', options: [
        { label: 'Driving (Express Autoway road transit)', value: 'drive' },
        { label: 'Aviation Flight (Factoring in 2h airport security gate boarding)', value: 'fly' }
      ]},
      { id: 'conduitDistanceMiles', label: 'Total Distance to Coordinate (miles)', type: 'number', defaultValue: 480, min: 10, max: 15000 },
      { id: 'averageCommuteSpeedMph', label: 'Average Speed in Motion (mph)', type: 'number', defaultValue: 65, min: 10, max: 600 }
    ],
    faq: [
      { question: 'Do flight duration estimates include airport layovers?', answer: 'Our standard flight calculation adds 2.5 hours of processing overhead (for security and gate check-in) and assumes direct flights, unless custom layovers are factored in.' }
    ],
    relatedSlugs: ['trip-budget-calculator', 'distance-cost-calculator'],
    seoTitle: 'Travel Duration & Flight Boarding Time Planner',
    seoDescription: 'Calculate road trip and flight travel times, factoring in rest stops and airport boarding buffers.',
    calculate: (inputs) => {
      const type = inputs.transitRouteType || 'drive';
      const dist = Number(inputs.conduitDistanceMiles || 100);
      const speed = Math.max(1, Number(inputs.averageCommuteSpeedMph || 60));

      let directInTransitHours = dist / speed;
      let overheadHCount = 0;

      if (type === 'drive') {
        const structuralStopsCount = Math.floor(directInTransitHours / 3); // stop for rest every 3 hours
        overheadHCount = structuralStopsCount * 0.5; // 30-minute rest sessions
      } else {
        overheadHCount = 2.5; // general airport security, baggage checks, and boarding queues
      }

      const totalRequiredH = directInTransitHours + overheadHCount;

      return {
        results: [
          { label: 'Total Estimated Travel Time', value: totalRequiredH.toFixed(1), unit: 'hours', isPrimary: true },
          { label: 'Net Duration in Active Motion', value: directInTransitHours.toFixed(1), unit: 'hours', isPrimary: true },
          { label: 'Rest Stops & Boarding Delays', value: overheadHCount.toFixed(1), unit: 'hours' }
        ]
      };
    }
  },
  {
    id: 'distance-cost-calculator',
    name: 'Distance Cost Calculator',
    slug: 'distance-cost-calculator',
    category: 'travel',
    description: 'Calculate travel costs per mile, comparing driving costs with flight options.',
    formula: 'Cost per Mile = Overall Driving Cost / Total Distance',
    explanation: 'Compares the costs of driving vs flying by analyzing fuel consumption, tolls, and flight tickets.',
    example: 'Driving 400 miles costs about $0.18 per mile in fuel and tolls, making driving highly cost-effective for groups of two or more.',
    inputs: [
      { id: 'aggregateMilesCount', label: 'Travel Distance (one-way miles)', type: 'number', defaultValue: 400, min: 10, max: 10000 },
      { id: 'gasPriceGallonVal', label: 'Average Gas Cost ($ / Gallon)', type: 'number', defaultValue: 3.65, min: 1.0, max: 10.0, step: 0.05 },
      { id: 'individualFlightTicketPrice', label: 'Equivalent Flight Ticket Cost ($ / seat)', type: 'number', defaultValue: 220, min: 10, step: 10 }
    ],
    faq: [
      { question: 'When does flying become cheaper than driving?', answer: 'Flying is often more cost-effective for solo travelers covering distances over 600 miles. For groups of two or more, driving remains cheaper for most domestic trips.' }
    ],
    relatedSlugs: ['trip-budget-calculator', 'travel-time-planner'],
    seoTitle: 'Driving vs. Flying Travel Distance Cost Calculator',
    seoDescription: 'Compare fuel and toll driving costs against flight tickets. Calculate travel costs per mile to find the best route.',
    calculate: (inputs) => {
      const miles = Number(inputs.aggregateMilesCount || 300);
      const gas = Number(inputs.gasPriceGallonVal || 3.5);
      const flyPrice = Number(inputs.individualFlightTicketPrice || 150);

      // Assume average highway vehicle MPG is 27.5 mpg
      const gallonsNeeded = miles / 27.5;
      const gasTotalBudget = gallonsNeeded * gas;
      const structuralTollsAndWearFraction = miles * 0.08 + 15; // standard toll estimation and minor wear
      
      const overallRoadCost = gasTotalBudget + structuralTollsAndWearFraction;

      return {
        results: [
          { label: 'Total Projected Cost to Drive', value: Math.round(overallRoadCost), unit: '$', isPrimary: true },
          { label: 'Cost to Fly (1 Passenger)', value: flyPrice, unit: '$', isPrimary: true },
          { label: 'Calculated Road Rate', value: (overallRoadCost / miles).toFixed(2), unit: '$ / mile' }
        ]
      };
    }
  }
];
