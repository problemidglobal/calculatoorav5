import { Calculator } from '../types';

export const NEW_PROGRAMMING_CALCULATORS: Calculator[] = [
  {
    id: 'prog-json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'programming',
    description: 'Format, prettify, beatify, and validate your raw JSON payload locally.',
    seoTitle: 'Online JSON Formatter & Validator | Calculatoora',
    seoDescription: 'Validate raw JSON strings, perform deep formatting with customizable indentation, and check syntaxes.',
    inputs: [
      { id: 'jsonInput', label: 'Raw JSON Payload', type: 'text', defaultValue: '{"name":"Calculatoora","version":4,"features":["static","fast","offline"],"meta":{"active":true}}' },
      { id: 'indent', label: 'Indentation Spacing', type: 'select', defaultValue: '2', options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
        { label: 'Tab Character', value: 'tab' }
      ]}
    ],
    formula: 'JSON.parse(input) -> JSON.stringify(obj, null, space)',
    explanation: 'JSON (JavaScript Object Notation) requires balanced braces, quoted keys, and conforming commas. pre-formatting validates structure and clarifies readability.',
    example: 'Raw: {"a":1} becomes formatted multi-line block with indentation.',
    faq: [
      { question: 'Why does my JSON fail to format?', answer: 'Common syntax issues include missing ending commas, unquoted keys, single quotes instead of double quotes, or trailing commas.' }
    ],
    relatedSlugs: ['json-size', 'string-length'],
    calculate: (inputs) => {
      const raw = inputs.jsonInput || '';
      const spaceOpt = inputs.indent || '2';
      const space = spaceOpt === 'tab' ? '\t' : Number(spaceOpt);

      if (!raw.trim()) {
        return {
          results: [{ label: 'Format Status', value: 'Empty Input', isPrimary: true }]
        };
      }

      try {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, space);
        return {
          results: [
            { label: 'Validation Status', value: '✅ Valid JSON Syntax', isPrimary: true },
            { label: 'Formatted JSON Result', value: formatted },
            { label: 'Compact JSON Result', value: JSON.stringify(parsed) }
          ]
        };
      } catch (err: any) {
        return {
          results: [
            { label: 'Validation Status', value: '❌ Invalid JSON Syntax', isPrimary: true },
            { label: 'Parser Error Description', value: err.message || 'Syntax Error' }
          ]
        };
      }
    }
  },
  {
    id: 'prog-json-size',
    name: 'JSON Size Calculator',
    slug: 'json-size',
    category: 'programming',
    description: 'Calculate the size of a JSON string in bytes, kilobytes, and analyze compressions.',
    seoTitle: 'JSON Size and Byte Calculator | Calculatoora',
    seoDescription: 'Accurately measure raw JSON payload sizes, evaluate white-space savings, and project API transmission times.',
    inputs: [
      { id: 'jsonInput', label: 'JSON String', type: 'text', defaultValue: '{"user":{"id":12345,"displayName":"Developer","roles":["admin","billing"],"settings":{"theme":"dark","notifications":{"email":true,"sms":false}}}}' }
    ],
    formula: 'Payload Bytes = UTF-8 Encoded representation length of text stream.',
    explanation: 'JSON transmission costs depend directly on payload sizes. Removing whitespace (minify) reduces transmission overhead on bandwidth.',
    example: 'Minified JSON consumes 30-40% less bandwidth than fully indented JSON formats.',
    faq: [
      { question: 'Does formatting affect API payload transfer speed?', answer: 'Yes, white spaces, line breaks, and tabs contribute to the total transferred byte count. Minifying payloads is recommended before transmission.' }
    ],
    relatedSlugs: ['json-formatter', 'xml-size', 'text-byte-calculator'],
    calculate: (inputs) => {
      const raw = inputs.jsonInput || '';
      const encoder = new TextEncoder();
      const rawBytes = encoder.encode(raw).length;
      
      let minifiedBytes = rawBytes;
      let minifiedText = raw;
      try {
        const parsed = JSON.parse(raw);
        minifiedText = JSON.stringify(parsed);
        minifiedBytes = encoder.encode(minifiedText).length;
      } catch {
        // Fallback simple regex replace for minifying if invalid JSON
        minifiedText = raw.replace(/\s+/g, '');
        minifiedBytes = encoder.encode(minifiedText).length;
      }

      const diff = rawBytes - minifiedBytes;
      const pctSaved = rawBytes > 0 ? (diff / rawBytes) * 100 : 0;

      return {
        results: [
          { label: 'Raw Byte Size', value: `${rawBytes} bytes`, isPrimary: true },
          { label: 'Minified Byte Size', value: `${minifiedBytes} bytes` },
          { label: 'Space Savings via Minification', value: `${pctSaved.toFixed(1)}% (${diff} bytes)` }
        ],
        chartData: [
          { name: 'Minified Bytes', value: minifiedBytes, color: '#39FF14' },
          { name: 'Redundant Spaces', value: diff, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'prog-xml-size',
    name: 'XML Size Calculator',
    slug: 'xml-size',
    category: 'programming',
    description: 'Calculate the accurate size of XML documents in bytes and estimate SOAP/REST overheads.',
    seoTitle: 'XML Payload Size Estimator & Analyzer | Calculatoora',
    seoDescription: 'Obtain precise sizing profiles of XML files, identify redundant tags, and assess bandwidth footprints.',
    inputs: [
      { id: 'xmlInput', label: 'XML Payload Content', type: 'text', defaultValue: '<?xml version="1.0" encoding="UTF-8"?>\n<response>\n  <status>success</status>\n  <data>\n    <user id="12345">\n      <name>Developer</name>\n      <role>Admin</role>\n    </user>\n  </data>\n</response>' }
    ],
    formula: 'Size = Sum(Character Unicode bytes under UTF-8 specification)',
    explanation: 'XML tends to have a larger structural footprint due to opening and closing tags. Mini-compression strips comments, carriage returns, and excess whitespace.',
    example: 'A structured XML layout of 300 bytes can be minified down to ~190 bytes.',
    faq: [
      { question: 'Why is XML larger than JSON?', answer: 'XML requires matching closing tag tokens (e.g. </username> instead of a simple parenthesis or quote in JSON).' }
    ],
    relatedSlugs: ['json-size', 'html-size', 'text-byte-calculator'],
    calculate: (inputs) => {
      const raw = inputs.xmlInput || '';
      const byteLen = new TextEncoder().encode(raw).length;
      
      // Simple regex compression (strip comments and whitespace between tag elements)
      const compressed = raw
        .replace(/<!--[\s\S]*?-->/g, '') // remove comments
        .replace(/>\s+?</g, '><')        // remove whitespace between tags
        .trim();
      const compBytes = new TextEncoder().encode(compressed).length;
      const difference = byteLen - compBytes;
      const savingPct = byteLen > 0 ? (difference / byteLen) * 100 : 0;

      return {
        results: [
          { label: 'Raw Character Bytes', value: `${byteLen} B`, isPrimary: true },
          { label: 'Compressed XML Size', value: `${compBytes} B` },
          { label: 'Whitespace Reduction', value: `${savingPct.toFixed(1)}% (${difference} B)` }
        ],
        chartData: [
          { name: 'Core Data Size', value: compBytes, color: '#0ea5e9' },
          { name: 'Indent Noise', value: difference, color: '#475569' }
        ]
      };
    }
  },
  {
    id: 'prog-html-size',
    name: 'HTML Size Calculator',
    slug: 'html-size',
    category: 'programming',
    description: 'Inspect HTML string sizes, identify tag densities, and estimate layout speeds.',
    seoTitle: 'HTML Document Size & Tag Density Solver | Calculatoora',
    seoDescription: 'Analyze weights of HTML payloads, stripped of tags, and calculate structural ratios.',
    inputs: [
      { id: 'htmlInput', label: 'HTML Raw Code', type: 'text', defaultValue: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Landing Page</title>\n</head>\n<body>\n  <h1>Welcome to calculatoora</h1>\n  <p>Static sub-microsecond calculation engines.</p>\n</body>\n</html>' }
    ],
    formula: 'Text Ratio = (PlainText Bytes / Overall Document Bytes) * 100',
    explanation: 'A healthy HTML document carries a lightweight DOM hierarchy. Large markup ratios slow browser painting threads.',
    example: 'A 200-byte HTML core containing 60 bytes of plain reading text indicates a 30% text-to-code balance.',
    faq: [
      { question: 'What is DOM bloat?', answer: 'Excessive nested tag hierarchies (div within div) which increases parsing time, memory consumption, and file sizes.' }
    ],
    relatedSlugs: ['css-size', 'js-size', 'xml-size'],
    calculate: (inputs) => {
      const html = inputs.htmlInput || '';
      const totalBytes = new TextEncoder().encode(html).length;
      
      // Strip tag markers
      const plainText = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const textBytes = new TextEncoder().encode(plainText).length;
      const tagBytes = Math.max(0, totalBytes - textBytes);
      const textRatio = totalBytes > 0 ? (textBytes / totalBytes) * 100 : 0;

      return {
        results: [
          { label: 'Overall HTML Document Size', value: `${totalBytes} B`, isPrimary: true },
          { label: 'Isolated Plain Text Content Size', value: `${textBytes} B` },
          { label: 'Markup & Tag Overhead Size', value: `${tagBytes} B` },
          { label: 'Text-to-Code Efficiency Ratio', value: `${textRatio.toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Plain Text bytes', value: textBytes, color: '#eab308' },
          { name: 'Tags overhead bytes', value: tagBytes, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'prog-css-size',
    name: 'CSS Size & Weight Calculator',
    slug: 'css-size',
    category: 'programming',
    description: 'Calculate CSS file sizes, measure comment overheads, and see savings from clean parsing.',
    seoTitle: 'CSS Payload Weight & Comment Meter | Calculatoora',
    seoDescription: 'Obtain precise file weight measurements of CSS code blocks, detailing minification statistics.',
    inputs: [
      { id: 'cssInput', label: 'CSS Stylesheet Script', type: 'text', defaultValue: '/* Root variables configuration */\n:root {\n  --brand-green: #39ff14;\n  --background-dark: #000000;\n}\n\n.glass-card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 24px;\n  padding: 2rem;\n}' }
    ],
    formula: 'Stipped Size = Raw CSS minus comment strings, line breaks, and redundant spaces.',
    explanation: 'Cascading stylesheets containing heavy comment chains can slow resource loading. Compiling stylesheets into a single minified delivery stream enhances performance.',
    example: 'Minified CSS can save up to 45% in byte count compared to raw, highly-commented configurations.',
    faq: [
      { question: 'Should I minify CSS in production?', answer: 'Yes. Minification merges directives, reduces round-tripping files, and optimizes overall rendering speed.' }
    ],
    relatedSlugs: ['html-size', 'js-size'],
    calculate: (inputs) => {
      const raw = inputs.cssInput || '';
      const rawBytes = new TextEncoder().encode(raw).length;
      
      // Minify logic: remove comments and whitespace
      const minified = raw
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s+/g, ' ')             // collapse whitespace
        .replace(/\s*([\{\};:,])\s*/g, '$1') // remove spaces around syntax markers
        .trim();
      const minBytes = new TextEncoder().encode(minified).length;
      const savedBytes = Math.max(0, rawBytes - minBytes);
      const savedPct = rawBytes > 0 ? (savedBytes / rawBytes) * 100 : 0;

      return {
        results: [
          { label: 'Uncompressed CSS Size', value: `${rawBytes} B`, isPrimary: true },
          { label: 'Minified Stylesheet Size', value: `${minBytes} B` },
          { label: 'Bandwidth Saved', value: `${savedBytes} B (${savedPct.toFixed(1)}%)` }
        ],
        chartData: [
          { name: 'Core Rules Bytes', value: minBytes, color: '#a855f7' },
          { name: 'Redundant Whitespaces Bytes', value: savedBytes, color: '#475569' }
        ]
      };
    }
  },
  {
    id: 'prog-js-size',
    name: 'JavaScript Size Calculator',
    slug: 'js-size',
    category: 'programming',
    description: 'Calculate JavaScript syntax weights, analyze character distributions, and project payloads.',
    seoTitle: 'JavaScript File Weight & Character Analyzer | Calculatoora',
    seoDescription: 'Explore file transmission properties of JavaScript files. Measure raw inputs and minification.',
    inputs: [
      { id: 'jsInput', label: 'Raw JavaScript Code', type: 'text', defaultValue: '// Simple analytical callback\nfunction checkCalculations(inputs) {\n  const startTime = Date.now();\n  console.log("Analyzing data stream: " + inputs.length);\n  const output = inputs.map(i => i * 1.15);\n  return {\n    data: output,\n    duration: Date.now() - startTime\n  };\n}' }
    ],
    formula: 'Calculated Bytes = Character UTF-8 bytes matching variable names and runtime commands.',
    explanation: 'Modern packaging pipelines use bundlers to scrub debuggers, logs, and comments from JavaScript code, minimizing startup time in browsers.',
    example: 'Minified output compresses generic helper callbacks from 210 bytes to under 125 bytes using variable renaming.',
    faq: [
      { question: 'What is tree-shaking?', answer: 'A dead-code elimination process that removes unused exports and modules during production compilation.' }
    ],
    relatedSlugs: ['css-size', 'code-line-counter'],
    calculate: (inputs) => {
      const raw = inputs.jsInput || '';
      const totalBytes = new TextEncoder().encode(raw).length;
      
      // Standard local regex compression approximation
      const compressed = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')  // remove multiline comments
        .replace(/\/\/[^\n]*/g, '')        // remove slick inline comments
        .replace(/\s+/g, ' ')             // collapse whitespace
        .trim();
      const compBytes = new TextEncoder().encode(compressed).length;
      const difference = Math.max(0, totalBytes - compBytes);
      const savings = totalBytes > 0 ? (difference / totalBytes) * 100 : 0;

      return {
        results: [
          { label: 'Original Source Size', value: `${totalBytes} B`, isPrimary: true },
          { label: 'Stripped Script Size', value: `${compBytes} B` },
          { label: 'Space Scrubbed', value: `${savings.toFixed(1)}% (${difference} B)` }
        ],
        chartData: [
          { name: 'Executing Logic Code', value: compBytes, color: '#f59e0b' },
          { name: 'Discarded Comments & Spacing', value: difference, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'prog-code-line-counter',
    name: 'Code Line Counter',
    slug: 'code-line-counter',
    category: 'programming',
    description: 'Scan code blocks to count total, blank, and comment lines in scripts.',
    seoTitle: 'Line of Code (LOC) Metrics Scanner | Calculatoora',
    seoDescription: 'Run instant scans on your codebase to measure raw metrics: lines of code, blank breaks, and single/multiline comments.',
    inputs: [
      { id: 'codeIn', label: 'Paste Code Block', type: 'text', defaultValue: '#!/usr/bin/env python\n# Module calculating physical limits\nimport math\n\ndef check_limits(n):\n    # Core sanity checks\n    if n <= 0:\n        return None\n\n    # Calculate loop boundaries\n    return math.sqrt(n) * 1.5\n' }
    ],
    formula: 'Total LOC = Logic Lines + Comment Lines + Blank Spacers',
    explanation: 'Lines of Code (LOC) acts as an indicator of program size. Organizing code into smaller, cohesive modules promotes long-term maintainability.',
    example: 'A script can contain 12 overall lines: 7 containing logic boundaries, 3 comments, and 2 blank spacings.',
    faq: [
      { question: 'Is higher LOC better?', answer: 'Not necessarily. Clean, concise, and modular code is generally preferred over overly verbose or repetitive scripts.' }
    ],
    relatedSlugs: ['string-length', 'js-size'],
    calculate: (inputs) => {
      const raw = inputs.codeIn || '';
      const lines = raw.split(/\r?\n/);
      const total = lines.length;

      let blanks = 0;
      let comments = 0;
      let logic = 0;

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.length === 0) {
          blanks++;
        } else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          comments++;
        } else {
          logic++;
        }
      });

      return {
        results: [
          { label: 'Total Lines detected', value: total, isPrimary: true },
          { label: 'Logic lines (LOC)', value: logic },
          { label: 'Comment Lines', value: comments },
          { label: 'Blank Spacing Breaks', value: blanks }
        ],
        chartData: [
          { name: 'Executing logic', value: logic, color: '#39FF14' },
          { name: 'Documentation Commentaries', value: comments, color: '#3b82f6' },
          { name: 'Structural Whitespaces', value: blanks, color: '#475569' }
        ]
      };
    }
  },
  {
    id: 'prog-char-encoding',
    name: 'Character Encoding Calculator',
    slug: 'char-encoding',
    category: 'programming',
    description: 'Calculate the size of text across common binary encodings like UTF-8, UTF-16, and UTF-32.',
    seoTitle: 'UTF-8, UTF-16, UTF-32 Byte Size Solver | Calculatoora',
    seoDescription: 'Evaluate differences in storage sizes when encoding text ranges across international standards.',
    inputs: [
      { id: 'textIn', label: 'Source Text to Test', type: 'text', defaultValue: 'Calculatoora V4: Speed, Precision & Integrity 💎' }
    ],
    formula: 'UTF-8 uses variable 1-4 bytes; UTF-16 uses 2 or 4 bytes; UTF-32 always uses 4 bytes per char.',
    explanation: 'Modern systems use Unicode. UTF-8 is highly efficient for western alphanumeric texts, while UTF-16 and UTF-32 offer fixed-width binary alignments.',
    example: '"Calculatoora" uses 12 bytes in UTF-8, 24 bytes in UTF-16, and 48 bytes in UTF-32 format.',
    faq: [
      { question: 'Why does UTF-8 dominate the internet?', answer: 'ASCII transparency: standard English characters consume exactly 1 byte, saving up to 50% bandwidth compared to UTF-16.' }
    ],
    relatedSlugs: ['text-byte-calculator', 'ascii-converter-tool', 'unicode-converter'],
    calculate: (inputs) => {
      const raw = inputs.textIn || '';

      const bytesUtf8 = new TextEncoder().encode(raw).length;
      
      // UTF-16 bytes calculation (each character is 2 bytes, except surrogate pairs which are 4 bytes)
      let bytesUtf16 = 0;
      for (let i = 0; i < raw.length; i++) {
        const code = raw.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff) {
          bytesUtf16 += 4;
          i++; // Skip surrogate pair index
        } else {
          bytesUtf16 += 2;
        }
      }

      // UTF-32 is always 4 bytes for every code point
      const codePointCount = [...raw].length;
      const bytesUtf32 = codePointCount * 4;

      return {
        results: [
          { label: 'UTF-8 Storage Weight', value: `${bytesUtf8} Bytes`, isPrimary: true },
          { label: 'UTF-16 Storage Weight', value: `${bytesUtf16} Bytes` },
          { label: 'UTF-32 Storage Weight', value: `${bytesUtf32} Bytes` },
          { label: 'Raw Unicode Code Points Count', value: codePointCount }
        ],
        chartData: [
          { name: 'UTF-8', value: bytesUtf8, color: '#39FF14' },
          { name: 'UTF-16', value: bytesUtf16, color: '#0ea5e9' },
          { name: 'UTF-32', value: bytesUtf32, color: '#f43f5e' }
        ]
      };
    }
  },
  {
    id: 'prog-ascii-converter-tool',
    name: 'ASCII Code Converter',
    slug: 'ascii-converter-tool',
    category: 'programming',
    description: 'Transform characters to/from their decimal, hexadecimal, and binary ASCII equivalents.',
    seoTitle: 'ASCII Encoder, Decoder & Translator | Calculatoora',
    seoDescription: 'Translate standard ASCII table codes into decimal indices, hex streams, and binary blocks.',
    inputs: [
      { id: 'mode', label: 'Direction', type: 'select', defaultValue: 'toAscii', options: [
        { label: 'Text characters to ASCII', value: 'toAscii' },
        { label: 'ASCII decimals back to Text', value: 'fromAscii' }
      ]},
      { id: 'payload', label: 'Value String (e.g., text or spaces-separated decimals)', type: 'text', defaultValue: 'Calculatoora' }
    ],
    formula: 'ASCII codes map values from 0 to 127 to represent characters on digital screens.',
    explanation: 'ASCII (American Standard Code for Information Interchange) is a subset of UTF-8, providing the baseline for character encoding.',
    example: 'Evaluating "Abc" yields decimals [65, 98, 99]. Translating "[65, 32, 66]" yields characters "A B".',
    faq: [
      { question: 'Can ASCII represent emojis?', answer: 'No. ASCII is limited to 128 characters, which includes standard English keys and system controls. Emojis require Unicode.' }
    ],
    relatedSlugs: ['unicode-converter', 'char-encoding'],
    calculate: (inputs) => {
      const mode = inputs.mode || 'toAscii';
      const text = inputs.payload || 'Calculatoora';

      if (mode === 'toAscii') {
        const decs: number[] = [];
        const hexes: string[] = [];
        const bins: string[] = [];

        for (let i = 0; i < text.length; i++) {
          const code = text.charCodeAt(i);
          decs.push(code);
          hexes.push(code.toString(16).toUpperCase().padStart(2, '0'));
          bins.push(code.toString(2).padStart(8, '0'));
        }

        return {
          results: [
            { label: 'Decimal List', value: decs.join(' '), isPrimary: true },
            { label: 'Hexadecimal Sequence', value: hexes.join(' ') },
            { label: 'Binary Bytes', value: bins.join(' ') }
          ]
        };
      } else {
        const parts = text.split(/\s+/).map(Number).filter(n => !isNaN(n));
        const resolved = parts.map(code => String.fromCharCode(code)).join('');
        return {
          results: [
            { label: 'Decoded Text Output', value: resolved, isPrimary: true }
          ]
        };
      }
    }
  },
  {
    id: 'prog-unicode-converter',
    name: 'Unicode Escape Sequencer',
    slug: 'unicode-converter',
    category: 'programming',
    description: 'Convert characters to escaped hexadecimal sequences (e.g. \\u0041) for programmatic strings.',
    seoTitle: 'Unicode Escape & String Sequenced Solver | Calculatoora',
    seoDescription: 'Translate standard text characters into program-compliant unicode hex sequences seamlessly.',
    inputs: [
      { id: 'textIn', label: 'Raw String', type: 'text', defaultValue: 'Hello ⚡' }
    ],
    formula: '\\u + Hexadecimal representation of character code point.',
    explanation: 'Using unicode escape sequences allows developers to include special characters or emojis in source code files while avoiding encoding errors.',
    example: 'Writing "Hello ⚡" converts to "Hello \\u26a1".',
    faq: [
      { question: 'Why use escape sequences in code?', answer: 'It ensures special characters render correctly regardless of the environment’s default text encoding (e.g., ISO-8859-1 vs UTF-8).' }
    ],
    relatedSlugs: ['ascii-converter-tool', 'char-encoding'],
    calculate: (inputs) => {
      const raw = inputs.textIn || '';
      
      const escapedParts = [];
      const codePointsList = [];
      
      for (const char of raw) {
        const code = char.codePointAt(0);
        if (code !== undefined) {
          codePointsList.push(`U+${code.toString(16).toUpperCase().padStart(4, '0')}`);
          if (code > 0xffff) {
            // Surrogate pair translation
            const hex = code.toString(16).toUpperCase();
            escapedParts.push(`\\u{${hex}}`);
          } else {
            const hex = code.toString(16).padStart(4, '0').toUpperCase();
            escapedParts.push(`\\u${hex}`);
          }
        }
      }

      return {
        results: [
          { label: 'Escaped String Output', value: escapedParts.join(''), isPrimary: true },
          { label: 'Unicode Code Points', value: codePointsList.join(', ') }
        ]
      };
    }
  },
  {
    id: 'prog-base64-encoder',
    name: 'Base64 Encoder Tool',
    slug: 'base64-encoder',
    category: 'programming',
    description: 'Encode text blocks into clean printable Base64 ASCII strings.',
    seoTitle: 'Base64 Binary text Encoder | Calculatoora',
    seoDescription: 'Transform standard text into robust Base64 binary ASCII strings, suitable for email attachments and URI parameters.',
    inputs: [
      { id: 'textIn', label: 'Plain Text Stream', type: 'text', defaultValue: 'Calculatoora offline core math' }
    ],
    formula: 'Base64 converts groups of 3 bytes (24 bits) into 4 characters (6 bits each) from a 64-character alphabet.',
    explanation: 'Base64 encoding is used to compress binary data for transmission over text-only transport layers, such as email attachments or HTTP query strings.',
    example: '"Calculatoora" translates to "Q2FsY3VsYXRvb3Jh".',
    faq: [
      { question: 'Does Base64 count as encryption?', answer: 'No. Base64 is a reversible encoding method. It is used to format data for transmission, not to secure or encrypt it.' }
    ],
    relatedSlugs: ['base64-decoder', 'string-length'],
    calculate: (inputs) => {
      const raw = inputs.textIn || '';
      
      try {
        // Handle utf-8 correctly inside standard JS btoa
        const utf8Bytes = new TextEncoder().encode(raw);
        let binaryStr = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
          binaryStr += String.fromCharCode(utf8Bytes[i]);
        }
        const encoded = btoa(binaryStr);

        return {
          results: [
            { label: 'Base64 Encoded Result', value: encoded, isPrimary: true },
            { label: 'Output Character Count', value: encoded.length },
            { label: 'URI Component Variant', value: encodeURIComponent(encoded) }
          ]
        };
      } catch (err) {
        return {
          results: [{ label: 'Status Error', value: 'Could not perform base64 compression.', isPrimary: true }]
        };
      }
    }
  },
  {
    id: 'prog-base64-decoder',
    name: 'Base64 Decoder Tool',
    slug: 'base64-decoder',
    category: 'programming',
    description: 'Decode Base64 strings back to readable human text.',
    seoTitle: 'Base64 String Decoder & Validator | Calculatoora',
    seoDescription: 'Validate and decode raw Base64 data streams back into readable plain text.',
    inputs: [
      { id: 'b64In', label: 'Base64 Input Payload', type: 'text', defaultValue: 'UTJsc2MzVnNZWFJ2YjNKaFFtOXliM009' }
    ],
    formula: 'Decode: maps base-64 indices back into groups of 3 8-bit bytes.',
    explanation: 'Base64 strings are mapped back to their original byte representations to reconstruct the original plain text.',
    example: '"R29vZ2xl" decodes to "Google".',
    faq: [
      { question: 'How can I spot a Base64 string?', answer: 'They typically consist of letters (A-Z, a-z), numbers (0-9), and are padded with "=" characters at the end.' }
    ],
    relatedSlugs: ['base64-encoder'],
    calculate: (inputs) => {
      const raw = (inputs.b64In || '').trim();
      
      if (!raw) {
        return {
          results: [{ label: 'Status', value: 'Empty Input', isPrimary: true }]
        };
      }

      try {
        const decodedBinStr = atob(raw);
        const bytes = new Uint8Array(decodedBinStr.length);
        for (let i = 0; i < decodedBinStr.length; i++) {
          bytes[i] = decodedBinStr.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);

        return {
          results: [
            { label: 'Decoded Text Output', value: decoded, isPrimary: true },
            { label: 'Character Count', value: decoded.length }
          ]
        };
      } catch (err) {
        return {
          results: [
            { label: 'Decoder Status', value: '❌ Invalid Base64 Syntax', isPrimary: true },
            { label: 'Resolution Help', value: 'Ensure characters conform to base64 guidelines (letters, numbers, +, /, and = padding).' }
          ]
        };
      }
    }
  },
  {
    id: 'prog-hash-length',
    name: 'Hash Length & Standard Checker',
    slug: 'hash-length',
    category: 'programming',
    description: 'Analyze cryptographic hashes to identify potential algorithms (e.g. MD5, SHA-256) based on length and encoding.',
    seoTitle: 'Cryptographic Hash Identifier Solver | Calculatoora',
    seoDescription: 'Analyze hash lengths (MD5, SHA-1, SHA-256) and character distributions to identify potential cryptographic algorithms.',
    inputs: [
      { id: 'hashInput', label: 'Raw Hash Signature', type: 'text', defaultValue: 'e10adc3949ba59abbe56e057f20f883e' }
    ],
    formula: 'Hash Classification based on Hexadecimal length (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars).',
    explanation: 'Cryptographic hash functions generate fixed-width signatures. This calculator analyzes the signature pattern to identify the potential hashing algorithm.',
    example: 'A 32-character hexadecimal signature typically points to an MD5 hash algorithm.',
    faq: [
      { question: 'Can two different files have the same hash?', answer: 'In theory yes, this is called a hash collision. However, secure algorithms like SHA-256 make collisions virtually impossible.' }
    ],
    relatedSlugs: ['char-encoding', 'string-length'],
    calculate: (inputs) => {
      const hex = (inputs.hashInput || '').trim().replace(/\s/g, '');
      const len = hex.length;
      
      let matchedAlgo = 'Unknown Signature Format';
      let bitSize = 0;
      let safetyLevel = 'Inspection Pending 🟡';

      // Check format
      const isHex = !/[^0-9a-fA-F]/g.test(hex);

      if (isHex) {
        if (len === 32) {
          matchedAlgo = 'MD5 Hash';
          bitSize = 128;
          safetyLevel = 'Low Security (Collision Risks) 🔴';
        } else if (len === 40) {
          matchedAlgo = 'SHA-1 Hash';
          bitSize = 160;
          safetyLevel = 'Caution (Deprecating Standards) 🟡';
        } else if (len === 56) {
          matchedAlgo = 'SHA-224 / SHA3-224';
          bitSize = 224;
          safetyLevel = 'Cryptographically Secure ✅';
        } else if (len === 64) {
          matchedAlgo = 'SHA-256 / SHA3-256';
          bitSize = 256;
          safetyLevel = 'Highly Secure Standard ✅';
        } else if (len === 96) {
          matchedAlgo = 'SHA-384 / SHA3-384';
          bitSize = 384;
          safetyLevel = 'Extreme Security (Enterprise Rails) ✅';
        } else if (len === 128) {
          matchedAlgo = 'SHA-512 / SHA3-512';
          bitSize = 512;
          safetyLevel = 'Top-grade Quantum-Resistant ✅';
        }
      }

      return {
        results: [
          { label: 'Identified Algorithm', value: matchedAlgo, isPrimary: true },
          { label: 'Estimated Key Bit Depth', value: `${bitSize} bits` },
          { label: 'Security Classification', value: safetyLevel },
          { label: 'Detected Length', value: `${len} characters` }
        ]
      };
    }
  },
  {
    id: 'prog-string-length',
    name: 'String Length Calculator',
    slug: 'string-length',
    category: 'programming',
    description: 'Calculate detailed character, word, non-space, and sentence metrics of any text block.',
    seoTitle: 'String Length and Text Analyzer | Calculatoora',
    seoDescription: 'Obtain precise character counts, byte densities, and sentence metrics for custom strings.',
    inputs: [
      { id: 'stringIn', label: 'Paste Raw String Block', type: 'text', defaultValue: 'Calculatoora Version 4 contains offline computational tools.' }
    ],
    formula: 'Length = character code point segments; Words = regex space splits.',
    explanation: 'Basic text metrics help developers enforce layout constraints, configure payload limits, and plan database column sizes.',
    example: '"Hello World" contains 11 characters (including spaces) and 2 words.',
    faq: [
      { question: 'Do spaces count as characters?', answer: 'Yes, spaces are represented by standard ASCII code 32 (or Unicode equivalent) and consume storage bytes.' }
    ],
    relatedSlugs: ['text-byte-calculator', 'code-line-counter'],
    calculate: (inputs) => {
      const txt = inputs.stringIn || '';
      
      const charCount = txt.length;
      const noSpaceCount = txt.replace(/\s+/g, '').length;
      const words = txt.trim().split(/\s+/).filter(w => w.length > 0).length;
      const sentences = txt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      return {
        results: [
          { label: 'Total Characters (with spaces)', value: charCount, isPrimary: true },
          { label: 'Isolated Words Count', value: words },
          { label: 'Character Count (excluding spaces)', value: noSpaceCount },
          { label: 'Estimated Sentences', value: sentences }
        ],
        chartData: [
          { name: 'Core Words Character', value: noSpaceCount, color: '#39FF14' },
          { name: 'Spaces spacing count', value: charCount - noSpaceCount, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'prog-text-byte-calculator',
    name: 'Text Byte Size Calculator',
    slug: 'text-byte-calculator',
    category: 'programming',
    description: 'Analyze precise binary storage footprints of raw string blocks using text encoder mappings.',
    seoTitle: 'Text Byte Weight Calculator | Calculatoora',
    seoDescription: 'Input target text strings and select binary encoding standards to inspect storage byte counts.',
    inputs: [
      { id: 'textIn', label: 'Enter Text Payload', type: 'text', defaultValue: 'Web Platform speed is key! 🚀' }
    ],
    formula: 'Byte Size = UTF-8 variable byte values matching unicode code levels.',
    explanation: 'Character footprints vary by encoding. Modern emoji or multi-byte unicode symbols can consume up to 4 bytes each, increasing payload weights.',
    example: '"🚀" represents a surrogate unicode symbol, consuming exactly 4 bytes in UTF-8.',
    faq: [
      { question: 'Why does a simple emoji consume multiple bytes?', answer: 'Emojis sit high in the unicode code point space, requiring more binary bits to represent compared to basic alphanumeric characters.' }
    ],
    relatedSlugs: ['char-encoding', 'string-length'],
    calculate: (inputs) => {
      const raw = inputs.textIn || '';
      
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(raw).length;
      
      // Approximation for ASCII only (1 byte per char)
      const asciiLength = raw.replace(/[^\x00-\x7F]/g, '').length;

      return {
        results: [
          { label: 'UTF-8 Encoded weight', value: `${utf8Bytes} Bytes`, isPrimary: true },
          { label: 'Plain ASCII character byte weight', value: `${asciiLength} Bytes` },
          { label: 'Multi-byte symbols footprint', value: `${utf8Bytes - asciiLength} Bytes` }
        ]
      };
    }
  }
];
