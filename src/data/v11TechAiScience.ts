import { Calculator } from '../types';

export const V11_TECH_AI_SCIENCE_CALCULATORS: Calculator[] = [
  // ==================== LANGUAGE ====================
  {
    id: 'reading-level-calculator',
    name: 'Flesch-Kincaid Reading Level Calculator',
    slug: 'reading-level-calculator',
    category: 'language',
    description: 'Calculate readability metrics, including the Flesch-Kincaid Reading Ease and Grade Level index from text copy sample lengths.',
    seoTitle: 'Flesch-Kincaid Text Reading Level | Calculatoora',
    seoDescription: 'Benchmark the editorial difficulty of your text. Generates exact Flesch-Kincaid readability indices and grades.',
    inputs: [
      { id: 'totalWords', label: 'Total Words Count', type: 'number', defaultValue: 340, step: 20 },
      { id: 'totalSentences', label: 'Total Sentences Count', type: 'number', defaultValue: 18, step: 2 },
      { id: 'totalSyllables', label: 'Total Syllables Count', type: 'number', defaultValue: 520, step: 20 }
    ],
    formula: 'Flesch Ease = 206.835 - 1.015*(Words/Sentences) - 84.6*(Syllables/Words)\nFlesch Grade = 0.39*(Words/Sentences) + 11.8*(Syllables/Words) - 15.59',
    explanation: 'Readability indexes evaluate how easily a consumer understands text content. The Flesch-Kincaid system awards higher ease points to texts with shorter sentences and simpler, single-syllable vocabulary.',
    example: 'A 340-word article formatted inside 18 sentences, with 520 syllables, scores a 65 on the Flesch Ease index, which is suitable for standard eighth-grade readers.',
    faq: [
      { question: 'What is a good Flesch Reading Ease score for web copy?', answer: 'We recommend aiming for a score of 60 to 70. This makes your copy highly accessible to general web consumers.' }
    ],
    relatedSlugs: ['text-difficulty-calculator', 'writing-improvement-calculator'],
    keywords: ['flesch kincaid ease index', 'readability grade score', 'text copywriting benchmark', 'syllable sentence ratios'],
    calculate: (inputs) => {
      const words = Number(inputs.totalWords || 340);
      const sentences = Number(inputs.totalSentences || 18);
      const syllables = Number(inputs.totalSyllables || 520);

      const w_s = sentences > 0 ? words / sentences : 0;
      const s_w = words > 0 ? syllables / words : 0;

      const ease = 206.835 - (1.015 * w_s) - (84.6 * s_w);
      const grade = (0.39 * w_s) + (11.8 * s_w) - 15.59;

      let category = 'Academic / Very difficult';
      if (ease >= 90) category = 'Very Easy (5th Grade)';
      else if (ease >= 80) category = 'Easy (6th Grade)';
      else if (ease >= 70) category = 'Fairly Easy (7th Grade)';
      else if (ease >= 60) category = 'Standard (8th-9th Grade)';
      else if (ease >= 50) category = 'Fairly Difficult (High School)';
      else if (ease >= 30) category = 'Difficult (College)';

      return {
        results: [
          { label: 'Flesch Reading Ease Score', value: ease.toFixed(1), isPrimary: true },
          { label: 'Flesch-Kincaid Grade Level', value: Math.max(0, grade).toFixed(1) },
          { label: 'Estimated Reader Category', value: category }
        ],
        chartData: [
          { name: 'Words Per Sentence', value: Math.round(w_s) },
          { name: 'Syllables Per Word', value: Math.round(s_w * 10) / 10 }
        ]
      };
    }
  },
  {
    id: 'text-difficulty-calculator',
    name: 'Automated Text Difficulty Index',
    slug: 'text-difficulty-calculator',
    category: 'language',
    description: 'Structure automated difficulty logs by compiling average letter counts per word and character benchmarks on complex writings.',
    seoTitle: 'Automated Readability Index (ARI) | Calculatoora',
    seoDescription: 'Obtain exact ARI difficulty values. Calculates characters-per-word formulas to rank text grades.',
    inputs: [
      { id: 'textWords', label: 'Total Words in Sample', type: 'number', defaultValue: 500, step: 25 },
      { id: 'textChars', label: 'Total Characters (No Spaces)', type: 'number', defaultValue: 2450, step: 50 },
      { id: 'textSentences', label: 'Total Sentences in Sample', type: 'number', defaultValue: 25, step: 2 }
    ],
    formula: 'ARI Grade = 4.71 * (Chars / Words) + 0.5 * (Words / Sentences) - 21.43',
    explanation: 'The Automated Readability Index (ARI) estimates a text\'s grade difficulty. Unlike Flesch models that require syllable counting, ARI uses character counts, making it ideal for programmed text analysis.',
    example: 'A 500-word excerpt of 2450 characters grouped in 25 sentences scores a 10.27 on the ARI difficulty scale, which is typical for secondary school content.',
    faq: [
      { question: 'Who uses the ARI index?', answer: 'Educators, publishers, and copywriters use the ARI to verify that instruction textbooks and brochures suit their target reader cohorts.' }
    ],
    relatedSlugs: ['reading-level-calculator', 'writing-improvement-calculator'],
    keywords: ['automated readability index ari', 'letter count difficulty', 'sentence structure index', 'academic copy assessment'],
    calculate: (inputs) => {
      const words = Number(inputs.textWords || 500);
      const chars = Number(inputs.textChars || 2450);
      const sentences = Number(inputs.textSentences || 25);

      const c_w = words > 0 ? chars / words : 0;
      const w_s = sentences > 0 ? words / sentences : 0;

      const ari = (4.71 * c_w) + (0.5 * w_s) - 21.43;

      return {
        results: [
          { label: 'Automated Readability Grade (ARI)', value: Math.max(1, ari).toFixed(2), isPrimary: true },
          { label: 'Average Characters per Word', value: c_w.toFixed(2) },
          { label: 'Average Words per Sentence', value: w_s.toFixed(2) }
        ],
        chartData: [
          { name: 'Chars Per Word', value: Math.round(c_w * 10) / 10 },
          { name: 'Words Per Sentence', value: Math.round(w_s) }
        ]
      };
    }
  },
  {
    id: 'vocabulary-calculator',
    name: 'Vocabulary Size Estimator',
    slug: 'vocabulary-calculator',
    category: 'language',
    description: 'Estimate your active English vocabulary size using statistically representative corpus sample thresholds.',
    seoTitle: 'Active English Vocabulary Size Estimator | Calculatoora',
    seoDescription: 'Obtain an estimate of your English vocabulary size. Based on standard word lists and reading volume factors.',
    inputs: [
      { id: 'correctSamples', label: 'Recognized Words in 100-word Test', type: 'number', defaultValue: 76, min: 0, max: 100, step: 1 },
      { id: 'readingHabit', label: 'Typical Book Reading Volume', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Heavy Reader (1+ Books / Week)', value: 'heavy' },
        { label: 'Moderate (1 Book / Month)', value: 'moderate' },
        { label: 'Occasional (Rarely Read)', value: 'light' }
      ]}
    ],
    formula: 'Vocab Size = (Sample Score % * 35,000) * Reading Habit Coefficient',
    explanation: 'An average native adult recognizes 20,000 to 35,000 English root words. This calculator projects your complete vocabulary size by combining your score on a standard 100-word test with your reading habits.',
    example: 'Recognizing 76 out of 100 sample words combined with moderate reading habits projects an active vocabulary of approximately 23,940 English words.',
    faq: [
      { question: 'What is a typical vocabulary size for non-native speakers?', answer: 'Conversational English fluency requires 3,000 to 5,000 words. Dedicated learners often reach 10,000 to 15,000 words.' }
    ],
    relatedSlugs: ['reading-level-calculator'],
    keywords: ['active english vocabulary size', 'lexicon test scale', 'word recognition database', 'reading habit metrics'],
    calculate: (inputs) => {
      const score = Number(inputs.correctSamples || 76);
      const habit = inputs.readingHabit || 'moderate';

      const weight = habit === 'heavy' ? 1.15 : habit === 'moderate' ? 0.95 : 0.75;
      const baseEstimate = (score / 100) * 35000;
      const finalEst = baseEstimate * weight;

      return {
        results: [
          { label: 'Projected English Word Vocabulary', value: finalEst.toFixed(0), isPrimary: true },
          { label: 'Raw Test Success Ratio', value: `${score}%` },
          { label: 'Reading Habit Coefficient Applied', value: weight.toFixed(2) }
        ],
        chartData: [
          { name: 'Your Lexicon Sizing', value: Math.round(finalEst) }
        ]
      };
    }
  },
  {
    id: 'writing-improvement-calculator',
    name: 'Writing Density & Clarity Optimizer',
    slug: 'writing-improvement-calculator',
    category: 'language',
    description: 'Analyze text samples to flag passive voice helper verbs, excessively long adverbs, and run-on sentences.',
    seoTitle: 'Text density and writing quality checker | Calculatoora',
    seoDescription: 'Check text clarity metrics. Highlight excessive passive sentence structure to improve writing quality.',
    inputs: [
      { id: 'wordCount', label: 'Total Draft Words', type: 'number', defaultValue: 600, step: 25 },
      { id: 'passiveCount', label: 'Passive Voice Verb Markers', type: 'number', defaultValue: 15, min: 0, max: 200, step: 1 },
      { id: 'longAdverbs', label: 'Complex Adverbs count', type: 'number', defaultValue: 14, min: 0, max: 100, step: 1 }
    ],
    formula: 'Clarity Score = 100 - (100 * Passive / Words * 10) - (100 * Adverbs / Words * 4)',
    explanation: 'Impactful prose avoids passive voice. While passive voice is correct, replacing it with active verbs and stripping unnecessary adverbs directly improves writing clarity.',
    example: 'A 600-word draft containing 15 passive voice verbs and 14 adverbs achieves a Clarity Score of 61.33% out of 100.',
    faq: [
      { question: 'What is passive voice in writing?', answer: 'A sentence structure where the object being acted upon is placed first (e.g., "The ball was kicked by Arthur" instead of "Arthur kicked the ball").' }
    ],
    relatedSlugs: ['reading-level-calculator', 'text-difficulty-calculator'],
    keywords: ['active voice conversion', 'prose optimization density', 'adverb density factor', 'clunky draft tracker'],
    calculate: (inputs) => {
      const words = Number(inputs.wordCount || 600);
      const pass = Number(inputs.passiveCount || 0);
      const adv = Number(inputs.longAdverbs || 0);

      // Penalize clarity based on clunky density
      const passPct = words > 0 ? (pass / words) * 100 : 0;
      const advPct = words > 0 ? (adv / words) * 100 : 0;

      const score = Math.max(0, Math.min(100, 100 - (passPct * 8) - (advPct * 4)));

      return {
        results: [
          { label: 'Overall Text Clarity Score', value: score.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Passive Auxiliary Verb Density', value: passPct.toFixed(2), unit: '%' },
          { label: 'Adverb Frequency Ratio', value: advPct.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Draft Words', value: words },
          { name: 'Clarity Score', value: Math.round(score) }
        ]
      };
    }
  },
  {
    id: 'typing-accuracy-calculator',
    name: 'Typing Accuracy & Speed Solver',
    slug: 'typing-accuracy-calculator',
    category: 'language',
    description: 'Calculate typing accuracy percentages and net Words Per Minute (WPM) speeds from key hit parameters.',
    seoTitle: 'Typing Net WPM & Accuracy Calculator | Calculatoora',
    seoDescription: 'Estimate your Net Words Per Minute typing speed based on errors and gross key presses.',
    inputs: [
      { id: 'totalKeystrokes', label: 'Gross Character Keystrokes Entered', type: 'number', defaultValue: 320, step: 20 },
      { id: 'errorCount', label: 'Uncorrected Typing Errors', type: 'number', defaultValue: 4, min: 0, max: 100, step: 1 },
      { id: 'timeAllowed', label: 'Typing Interval (Seconds)', type: 'number', defaultValue: 60, step: 10 }
    ],
    formula: 'Gross WPM = (Keystrokes / 5) / (Minutes)\nAccuracy % = (Gross Keystrokes - Errors) / Gross Keystrokes * 100\nNet WPM = Gross WPM - (Errors / Minutes)',
    explanation: 'Standard typing metrics treat five keystrokes as a single word. Uncorrected errors are penalized directly, lowering your net writing speed below your gross typing speed.',
    example: 'Entering 320 characters in one minute with 4 errors yields a Gross Speed of 64 WPM, a 98.75% Accuracy, and a Net typing speed of 60 WPM.',
    faq: [
      { question: 'What is a professional typing speed?', answer: 'Administrative roles require 50 to 80 WPM. Competitive coders and professional typists frequently log speeds exceeding 100 WPM.' }
    ],
    relatedSlugs: ['typing-speed-calculator'],
    keywords: ['typing speed test', 'net words per minute wpm', 'keystroke errors ratio', 'keyboard finger accuracy'],
    calculate: (inputs) => {
      const keys = Number(inputs.totalKeystrokes || 320);
      const err = Number(inputs.errorCount || 0);
      const secs = Number(inputs.timeAllowed || 60);

      const mins = secs / 60;
      const grossWpm = mins > 0 ? (keys / 5) / mins : 0;
      const acc = keys > 0 ? ((keys - err) / keys) * 100 : 100;
      const netWpm = mins > 0 ? grossWpm - (err / mins) : 0;

      return {
        results: [
          { label: 'Calculated Net Speed Speed', value: Math.max(0, netWpm).toFixed(1), unit: 'WPM', isPrimary: true },
          { label: 'Typing Accurancy Ratio', value: acc.toFixed(2), unit: '%' },
          { label: 'Total Keystrokes Logged', value: keys }
        ],
        chartData: [
          { name: 'Net Speed (WPM)', value: Math.round(netWpm) },
          { name: 'Errors Penalty', value: err }
        ]
      };
    }
  },
  {
    id: 'typing-speed-calculator',
    name: 'Typing Speed Run Duration Calculator',
    slug: 'typing-speed-calculator',
    category: 'language',
    description: 'Calculate the total time required to transcribe large text documents based on your words-per-minute speed.',
    seoTitle: 'Typing Speed and Transcription Duration | Calculatoora',
    seoDescription: 'Obtain exact completion time estimates to type or transcribe any document based on your WPM speed.',
    inputs: [
      { id: 'wordsCount', label: 'Total Document Words Count', type: 'number', defaultValue: 3500, step: 250 },
      { id: 'wpmSpeed', label: 'Your Typing Speed (WPM)', type: 'number', defaultValue: 65, step: 5 }
    ],
    formula: 'Typing Duration (Minutes) = Document Words / WPM Speed',
    explanation: 'Transcribing long documents is a time-consuming task. Estimating the time needed based on your average typing speed helps you organize and plan your writing schedule.',
    example: 'Typing a 3,500-word document at a speed of 65 words per minute requires approximately 53 minutes and 50 seconds.',
    faq: [
      { question: 'How can I increase my typing speed?', answer: 'Practice touch typing without looking down at the keyboard, focus on accuracy first, and use typing tutors to develop muscle memory.' }
    ],
    relatedSlugs: ['typing-accuracy-calculator'],
    keywords: ['transcribe duration estimator', 'typing completion hours', 'words per minute tracker', 'office keyboard tasks'],
    calculate: (inputs) => {
      const words = Number(inputs.wordsCount || 3500);
      const wpm = Number(inputs.wpmSpeed || 65);

      const minsTotal = wpm > 0 ? words / wpm : 0;
      const hrs = Math.floor(minsTotal / 60);
      const mins = Math.floor(minsTotal % 60);

      return {
        results: [
          { label: 'Estimated Completion Duration', value: `${hrs}h ${mins}m`, isPrimary: true },
          { label: 'Exact typing time in minutes', value: minsTotal.toFixed(1), unit: 'm' }
        ]
      };
    }
  },

  // ==================== COMMUNICATION ====================
  {
    id: 'presentation-time-calculator',
    name: 'Presentation slide and speech duration',
    slug: 'presentation-time-calculator',
    category: 'communication',
    description: 'Determine presentation and speech durations based on your slide count, text pacing, and slide interaction times.',
    seoTitle: 'Slide Presentation Speech Duration | Calculatoora',
    seoDescription: 'Obtain presentation slide timings. Calculates delivery durations based on verbal speech speeds.',
    inputs: [
      { id: 'slides', label: 'Number of Slides in Deck', type: 'number', defaultValue: 12, step: 1 },
      { id: 'wordsPerSlide', label: 'Average Speech Words per Slide', type: 'number', defaultValue: 150, step: 10 },
      { id: 'speakingRate', label: 'Speaking Rate Speed', type: 'select', defaultValue: '130', options: [
        { label: 'Deliberate / Slow (110 Words/Min)', value: '110' },
        { label: 'Standard Presenter (130 Words/Min)', value: '130' },
        { label: 'Rapid / Fast (160 Words/Min)', value: '160' }
      ]},
      { id: 'qnaBuffer', label: 'Q&A Buffer time added (Minutes)', type: 'number', defaultValue: 5, step: 1 }
    ],
    formula: 'Time = [Slides * Words per Slide / Rate] + Q&A Buffer',
    explanation: 'Creating a clean, engaging slide deck requires careful timing. Speakers should plan for approximately 130 words per minute to ensure their audience stays engaged without feeling rushed.',
    example: 'Delivering a 12-slide presentation with 150 words per slide (1,800 words total) at a standard rate of 130 words per minute takes approximately 18 minutes and 50 seconds, including a 5-minute Q&A buffer.',
    faq: [
      { question: 'What is the standard 10-20-30 Rule of PowerPoint?', answer: 'Coined by Guy Kawasaki, this rule suggests a presentation should have no more than 10 slides, last no longer than 20 minutes, and use a font size of at least 30 point.' }
    ],
    relatedSlugs: ['speech-length-calculator'],
    keywords: ['deck slide pacing', 'speech length timer', 'public speaking countdown', 'slide deck script timing'],
    calculate: (inputs) => {
      const slides = Number(inputs.slides || 12);
      const wps = Number(inputs.wordsPerSlide || 150);
      const rate = Number(inputs.speakingRate || 130);
      const qna = Number(inputs.qnaBuffer || 5);

      const totalWords = slides * wps;
      const speakMins = totalWords / rate;
      const totalMins = speakMins + qna;

      const minPart = Math.floor(totalMins);
      const secPart = Math.round((totalMins - minPart) * 60);

      return {
        results: [
          { label: 'Estimated Total Delivery Duration', value: `${minPart}m ${secPart}s`, isPrimary: true },
          { label: 'Calculated Speech-only portion', value: speakMins.toFixed(1), unit: 'mins' },
          { label: 'Cumulative Script Words Count', value: totalWords }
        ],
        chartData: [
          { name: 'Speech Portion', value: Math.round(speakMins) },
          { name: 'Q&A Buffer', value: qna }
        ]
      };
    }
  },
  {
    id: 'speech-length-calculator',
    name: 'Speech Delivery Length Calculator',
    slug: 'speech-length-calculator',
    category: 'communication',
    description: 'Calculate the total spoken delivery duration of scripts based on word counts and speaking speeds.',
    seoTitle: 'Script Word Count to Spoken Duration | Calculatoora',
    seoDescription: 'Convert a written speech script word count into estimated spoken delivery duration.',
    inputs: [
      { id: 'wordsCount', label: 'Total Script Word Count', type: 'number', defaultValue: 1200, step: 100 },
      { id: 'speakingRate', label: 'Speaking Pace (Words/Min)', type: 'number', defaultValue: 130, step: 5 }
    ],
    formula: 'Duration (Minutes) = Word Count / Speaking Rate',
    explanation: 'This calculator converts a written script\'s word count into spoken time. Knowing this duration helps public speakers refine their scripts and respect their allotted presentation time.',
    example: 'A 1,200-word script delivered at a standard speaking pace of 130 words per minute takes approximately 9 minutes and 14 seconds.',
    faq: [
      { question: 'What is the average conversational speaking speed?', answer: 'Standard conversational speaking speeds typically range from 120 to 150 words per minute. Professional presenters and public speakers usually target 130 words per minute.' }
    ],
    relatedSlugs: ['presentation-time-calculator'],
    keywords: ['speech word count time', 'toastmasters speech length', 'script word count timer', 'script voice timing'],
    calculate: (inputs) => {
      const words = Number(inputs.wordsCount || 1200);
      const rate = Number(inputs.speakingRate || 130);

      const totalMins = words / rate;
      const mins = Math.floor(totalMins);
      const secs = Math.round((totalMins - mins) * 60);

      return {
        results: [
          { label: 'Estimated Spoken Duration', value: `${mins}m ${secs}s`, isPrimary: true },
          { label: 'Exact Speaking Time in minutes', value: totalMins.toFixed(1), unit: 'mins' }
        ]
      };
    }
  },
  {
    id: 'meeting-time-calculator',
    name: 'Meeting Operational Cost Calculator',
    slug: 'meeting-time-calculator',
    category: 'communication',
    description: 'Calculate the total human financial and operational cost of business meetings based on payroll rates.',
    seoTitle: 'Corporate Board Meeting Operational Cost | Calculatoora',
    seoDescription: 'Deduct and tally corporate meeting costs. Calculates cumulative personnel hours and salary rates.',
    inputs: [
      { id: 'attendees', label: 'Average Attendees headcount', type: 'number', defaultValue: 8, step: 1 },
      { id: 'durationHours', label: 'Meeting length (Hours)', type: 'number', defaultValue: 1.5, step: 0.25 },
      { id: 'avgHourlyRate', label: 'Average Attendee Hourly Rate ($)', type: 'number', defaultValue: 65, step: 5 }
    ],
    formula: 'Total Cost = Attendees * Duration * Hourly Rate\nTotal Person-Hours = Attendees * Duration',
    explanation: 'Calculating the true cost of business meetings helps companies keep team schedules streamlined and productive. Consolidating attendee counts and hourly salary rates reveals the true financial investment of each meeting.',
    example: 'An 8-person meeting lasting 1.5 hours with an average salary rate of $65 per hour costs approximately $780 in total personnel hours.',
    faq: [
      { question: 'How can we shorten corporate billing meetings?', answer: 'Set a clear agenda, start and end meetings on time, and limit attendee lists to key stakeholders to keep team schedules productive.' }
    ],
    relatedSlugs: ['speech-length-calculator'],
    keywords: ['meeting financial cost', 'corporate personnel hours', 'meeting efficiency index', 'meeting ROI cost'],
    calculate: (inputs) => {
      const att = Number(inputs.attendees || 8);
      const dur = Number(inputs.durationHours || 1.5);
      const rate = Number(inputs.avgHourlyRate || 65);

      const hours = att * dur;
      const cost = hours * rate;

      return {
        results: [
          { label: 'Total Meeting Personnel Cost', value: cost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Personnel Hours Devoted', value: `${hours.toFixed(1)} hrs` },
          { label: 'Average cost per individual', value: (cost / att).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Estimated Cost', value: Math.round(cost) }
        ]
      };
    }
  },
  {
    id: 'conversation-time-calculator',
    name: 'Conversation Time & Word Count Estimator',
    slug: 'conversation-time-calculator',
    category: 'communication',
    description: 'Estimate the total word count exchanged during a team conversation or verbal interview.',
    seoTitle: 'Verbal Conversation Word Density | Calculatoora',
    seoDescription: 'Estimate the total word count of a verbal conversation based on duration and participation rates.',
    inputs: [
      { id: 'durationMinutes', label: 'Conversation Duration (Minutes)', type: 'number', defaultValue: 45, step: 5 },
      { id: 'speakersCount', label: 'Number of Active Speakers', type: 'number', defaultValue: 2, min: 1, max: 10, step: 1 },
      { id: 'wordsPerMinute', label: 'Average Speaking Rate (WPM)', type: 'number', defaultValue: 140, step: 10 }
    ],
    formula: 'Total Words Exchanged = Duration * WPM\nAverage Words per Speaker = Total Words / Speakers',
    explanation: 'This calculator estimates the total word count of a verbal conversation. Knowing these volumes is highly useful for planning transcription projects and managing writing schedules.',
    example: 'A 2-person conversation lasting 45 minutes at an average rate of 140 words per minute yields approximately 6,300 total words.',
    faq: [
      { question: 'What is the average transcription typing time ratio?', answer: 'Transcribing conversational recordings usually requires a 4:1 time ratio, meaning a 1-hour recording takes approximately 4 hours to transcribe.' }
    ],
    relatedSlugs: ['speech-length-calculator', 'typing-speed-calculator'],
    keywords: ['verbal word count estimator', 'conversation length hours', 'conversational transcription metrics', 'vocal exchange wordcount'],
    calculate: (inputs) => {
      const mins = Number(inputs.durationMinutes || 45);
      const speakers = Number(inputs.speakersCount || 2);
      const wpm = Number(inputs.wordsPerMinute || 140);

      const totalWords = mins * wpm;
      const perSpeaker = speakers > 0 ? totalWords / speakers : 0;

      return {
        results: [
          { label: 'Estimated Total Words Exchanged', value: totalWords, isPrimary: true },
          { label: 'Average Words per Participant', value: perSpeaker.toFixed(0) },
          { label: 'Average Exchange Duration', value: `${mins} mins` }
        ],
        chartData: [
          { name: 'Your Conversation', value: totalWords }
        ]
      };
    }
  },
  {
    id: 'message-length-calculator',
    name: 'SMS Segment & Character Limit Calculator',
    slug: 'message-length-calculator',
    category: 'communication',
    description: 'Calculate character boundaries, GSM-7 encoding parameters, and SMS message segments to prevent cellular data overages.',
    seoTitle: 'SMS Segment & GSM-7 Character Limit | Calculatoora',
    seoDescription: 'Obtain exact GSM-7 segment allocations. Counts characters to calculate carrier SMS texting volumes.',
    inputs: [
      { id: 'charCount', label: 'Total Message Characters', type: 'number', defaultValue: 280, step: 20 },
      { id: 'useUnicode', label: 'Includes Emojis / Special characters', type: 'select', defaultValue: 'no', options: [
        { label: 'GSM-7 Standard (Plain Text)', value: 'no' },
        { label: 'UCS-2 Encoding (Emojis / Unicode)', value: 'yes' }
      ]}
    ],
    formula: 'GSM-7 Segment: 160 chars (1 segment), above is split at 153 chars per segment.\nUCS-2 Segment: 70 chars (1 segment), above is split at 67 chars per segment.',
    explanation: 'Cellular networks split long text messages into segments. Standard GSM-7 encoding allows 160 characters per segment. Adding emojis or special characters triggers UCS-2 encoding, reducing the segment limit to 70 characters.',
    example: 'A plain-text message of 280 characters splits across 2 GSM-7 segments (153 characters per segment after splitting).',
    faq: [
      { question: 'Why does adding one emoji reduce my character limit?', answer: 'Emojis require UCS-2 encoding. This increases the space needed to store each character from 7 bits to 16 bits, lowering the segment limit from 160 to 70 characters.' }
    ],
    relatedSlugs: ['text-difficulty-calculator'],
    keywords: ['gsm-7 encoder limits', 'sms carrier segments', 'twilo text boundary checker', 'emoji ucs-2 limits'],
    calculate: (inputs) => {
      const chars = Number(inputs.charCount || 280);
      const isUnicode = inputs.useUnicode === 'yes';

      let limitFirst = isUnicode ? 70 : 160;
      let limitMulti = isUnicode ? 67 : 153;

      let segments = 0;
      if (chars <= limitFirst) {
        segments = chars === 0 ? 0 : 1;
      } else {
        segments = Math.ceil(chars / limitMulti);
      }

      return {
        results: [
          { label: 'Total Billable SMS Segments', value: segments, isPrimary: true },
          { label: 'Message Encoding Protocol', value: isUnicode ? 'UCS-2 (Unicode)' : 'GSM-7 (Standard Plain Text)' },
          { label: 'Typical Carrier Cost Factor', value: `${segments}x Rate` }
        ],
        chartData: [
          { name: 'Used Characters', value: chars },
          { name: 'Segment Limit', value: limitFirst * segments }
        ]
      };
    }
  },

  // ==================== DATA SCIENCE ====================
  {
    id: 'data-size-calculator',
    name: 'Dataset Memory Sizing Calculator',
    slug: 'data-size-calculator',
    category: 'data-science',
    description: 'Calculate complete RAM and disk storage sizing requirements for datasets based on rows, columns, and data types.',
    seoTitle: 'RAM Dataset Memory Sizing Calculator | Calculatoora',
    seoDescription: 'Estimate exact computer RAM and disk footprint sizing required to load data models.',
    inputs: [
      { id: 'rowCount', label: 'Total Rows (Million)', type: 'number', defaultValue: 10, step: 5 },
      { id: 'colFloat', label: 'Float Columns Count (64-bit)', type: 'number', defaultValue: 12, step: 2 },
      { id: 'colInt', label: 'Integer Columns Count (32-bit)', type: 'number', defaultValue: 8, step: 2 }
    ],
    formula: 'Row Size (Bytes) = (Float * 8) + (Integer * 4)\nTotal Size = Row Size * Rows\nIncludes 25% indexing RAM overhead.',
    explanation: 'Data scientists need to estimate memory footprints to prevent out-of-memory errors. Floating-point numeric columns require 8 bytes (64-bit), while standard integer columns require 4 bytes (32-bit). We include a standard 25% overhead to account for index mapping.',
    example: 'A dataset of 10 million rows with 12 float columns and 8 integer columns requires approximately 1.28 GB of RAM floor space (including index overhead).',
    faq: [
      { question: 'Why does loading a dataset require more memory than its size on disk?', answer: 'Disk files like CSVs are stored as compressed text. Loading data into RAM requires expanding values into uncompressed binary types, which increases memory consumption.' }
    ],
    relatedSlugs: ['dataset-split-calculator'],
    keywords: ['pandas ram memory calculator', 'dataset binary footprint sizing', 'data storage bytes', 'database memory index limits'],
    calculate: (inputs) => {
      const rows = Number(inputs.rowCount || 10) * 1000000;
      const floats = Number(inputs.colFloat || 12);
      const ints = Number(inputs.colInt || 8);

      const bytesPerRow = (floats * 8) + (ints * 4);
      let totalBytes = bytesPerRow * rows;
      totalBytes = totalBytes * 1.25; // 25% pandas/index overhead

      const megabytes = totalBytes / (1024 * 1024);
      const gigabytes = megabytes / 1024;

      return {
        results: [
          { label: 'Projected RAM Sizing Required', value: gigabytes.toFixed(2), unit: 'GB', isPrimary: true },
          { label: 'Base Byte Length per Row', value: bytesPerRow, unit: 'Bytes' },
          { label: 'Active Memory Overhead Included', value: '25% index buffer' }
        ],
        chartData: [
          { name: 'Floating Point columns', value: floats * 8 },
          { name: 'Integer columns', value: ints * 4 }
        ]
      };
    }
  },
  {
    id: 'dataset-split-calculator',
    name: 'ML Dataset Training Split Calculator',
    slug: 'dataset-split-calculator',
    category: 'data-science',
    description: 'Calculate sample sizes for training, validation, and testing splits in machine learning models.',
    seoTitle: 'ML Training Dataset Split Sizing | Calculatoora',
    seoDescription: 'Divide your total dataset size into training, validation, and test samples.',
    inputs: [
      { id: 'totalSamples', label: 'Total Samples in Dataset', type: 'number', defaultValue: 150000, step: 10000 },
      { id: 'trainPct', label: 'Training Set Split Ratio (%)', type: 'number', defaultValue: 80, min: 50, max: 95, step: 5 },
      { id: 'valPct', label: 'Validation Set Split Ratio (%)', type: 'number', defaultValue: 10, min: 0, max: 40, step: 5 }
    ],
    formula: 'Train Count = Total * (Train% / 100)\nValidation Count = Total * (Val% / 100)\nTest Count = Total - Train - Val',
    explanation: 'Machine learning datasets are split into three sets: training, validation, and testing. The validation set is used to optimize hyperparameters, while the test set evaluates final model accuracy.',
    example: 'Splitting a dataset of 150,000 samples with an 80-10-10 ratio allocates 120,000 samples for training, 15,000 for validation, and 15,000 for testing.',
    faq: [
      { question: 'What is the standard standard split ratio?', answer: 'Typical split ratios are 80-10-10 for moderate datasets and 70-15-15 or 90-5-5 for larger neural network models.' }
    ],
    relatedSlugs: ['data-size-calculator', 'precision-recall-calculator'],
    keywords: ['train test split machine learning', 'validation subset index', 'dataset partitions statistics', 'data science sample sizes'],
    calculate: (inputs) => {
      const tot = Number(inputs.totalSamples || 150000);
      const train = Number(inputs.trainPct || 80);
      const val = Number(inputs.valPct || 10);

      const test = Math.max(0, 100 - train - val);

      const nTrain = Math.round(tot * (train / 100));
      const nVal = Math.round(tot * (val / 100));
      const nTest = Math.max(0, tot - nTrain - nVal);

      return {
        results: [
          { label: 'Training Samples Count', value: nTrain, isPrimary: true },
          { label: 'Validation Samples Count', value: nVal },
          { label: 'Testing Evaluation Samples Count', value: nTest }
        ],
        chartData: [
          { name: 'Train Set', value: nTrain, color: '#3b82f6' },
          { name: 'Validation Set', value: nVal, color: '#f59e0b' },
          { name: 'Test Set', value: nTest, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'precision-recall-calculator',
    name: 'Precision, Recall & F1-Score Solver',
    slug: 'precision-recall-calculator',
    category: 'data-science',
    description: 'Calculate classification performance metrics including Precision, Recall, and F1-Score from confusion matrix parameters.',
    seoTitle: 'Precision Recall F1 Confusion Matrix | Calculatoora',
    seoDescription: 'Evaluate classification model performance. Calculates precision, recall, and combined F1-scores.',
    inputs: [
      { id: 'truePositives', label: 'True Positives (TP)', type: 'number', defaultValue: 180, step: 10 },
      { id: 'falsePositives', label: 'False Positives (FP)', type: 'number', defaultValue: 25, step: 5 },
      { id: 'falseNegatives', label: 'False Negatives (FN)', type: 'number', defaultValue: 15, step: 5 }
    ],
    formula: 'Precision = TP / (TP + FP)\nRecall = TP / (TP + FN)\nF1-Score = 2 * (Precision * Recall) / (Precision + Recall)',
    explanation: 'These metrics evaluate classification performance, especially on imbalanced datasets. Precision measures the accuracy of positive predictions, while recall measures the model\'s ability to identify all positive instances.',
    example: 'A model with 180 True Positives, 25 False Positives, and 15 False Negatives achieves an 87.80% Precision, a 92.31% Recall, and an F1-Score of 90.00%.',
    faq: [
      { question: 'What is the F1-Score?', answer: 'The F1-Score is the harmonic mean of precision and recall. It provides a single performance metric that balances both factors.' }
    ],
    relatedSlugs: ['dataset-split-calculator'],
    keywords: ['confusion matrix metrics machine learning', 'recall f1 statistics', 'binary precision checker', 'model diagnostics performance'],
    calculate: (inputs) => {
      const tp = Number(inputs.truePositives || 180);
      const fp = Number(inputs.falsePositives || 25);
      const fn = Number(inputs.falseNegatives || 15);

      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

      return {
        results: [
          { label: 'Calculated F1-Score Quality', value: f1.toFixed(4), isPrimary: true },
          { label: 'Precision Metric (Positive accuracy)', value: (precision * 100).toFixed(2), unit: '%' },
          { label: 'Recall Metric (True positive rate)', value: (recall * 100).toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Precision (%)', value: Math.round(precision * 100) },
          { name: 'Recall (%)', value: Math.round(recall * 100) }
        ]
      };
    }
  },

  // ==================== AI / MACHINE LEARNING ====================
  {
    id: 'token-calculator',
    name: 'LLM Token and Word Estimator',
    slug: 'token-calculator',
    category: 'ai',
    description: 'Calculate LLM token limits and content lengths using native words-to-tokens conversion parameters.',
    seoTitle: 'LLM Token to Word Count Converter | Calculatoora',
    seoDescription: 'Convert draft word counts into estimated LLM token limits. Uses standard 3/4-word ratios.',
    inputs: [
      { id: 'wordsCount', label: 'Raw Script Words Count', type: 'number', defaultValue: 1500, step: 100 },
      { id: 'tokenRatio', label: 'Estimating Ratio (Tokens / Word)', type: 'number', defaultValue: 1.33, step: 0.05 }
    ],
    formula: 'Tokens Count = Word Count * Token Ratio',
    explanation: 'Large Language Models (LLMs) process text in units called tokens. A standard English rule of thumb is that 100 words equate to approximately 133 tokens.',
    example: 'Earning a 1,500-word draft text projects to approximately 1,995 total LLM tokens.',
    faq: [
      { question: 'How do tokens compare to syllables?', answer: 'Tokens do not map directly to English syllables. Models split long words and punctuation into sub-words based on training corpus frequencies.' }
    ],
    relatedSlugs: ['ai-cost-calculator', 'model-size-calculator'],
    keywords: ['llm token checker', 'prompt context length calculator', 'word token count estimator', 'inference bounds scaling'],
    calculate: (inputs) => {
      const words = Number(inputs.wordsCount || 1500);
      const ratio = Number(inputs.tokenRatio || 1.33);

      const tokens = words * ratio;

      return {
        results: [
          { label: 'Estimated LLM Tokens Count', value: tokens.toFixed(0), isPrimary: true },
          { label: 'Used Words Count', value: words },
          { label: 'Used Tokens/Word Ratio', value: ratio.toFixed(3) }
        ],
        chartData: [
          { name: 'Words Count', value: words },
          { name: 'Estimated Tokens', value: Math.round(tokens) }
        ]
      };
    }
  },
  {
    id: 'ai-cost-calculator',
    name: 'LLM API Costs Calculator',
    slug: 'ai-cost-calculator',
    category: 'ai',
    description: 'Calculate LLM API pricing, comparing prompt and completion costs across multiple models.',
    seoTitle: 'LLM API Prompt Pricing Cost | Calculatoora',
    seoDescription: 'Estimate API transaction pricing costs for your conversational model, factoring in prompt and generation token volumes.',
    inputs: [
      { id: 'promptTokens', label: 'Prompt / Input Tokens', type: 'number', defaultValue: 25000, step: 5000 },
      { id: 'completionTokens', label: 'Completion / Output Tokens', type: 'number', defaultValue: 5000, step: 1000 },
      { id: 'pricingTiers', label: 'Target Model Tier', type: 'select', defaultValue: 'gemini_flash', options: [
        { label: 'Gemini Flash ($0.075 / $0.3 per Million)', value: '0.075,0.30' },
        { label: 'Gemini Pro ($1.25 / $5.00 per Million)', value: '1.25,5.00' },
        { label: 'General Pro Vision ($2.50 / $10.00 per Million)', value: '2.50,10.00' }
      ]}
    ],
    formula: 'Cost = (Input Tokens * Input Price / 1M) + (Output Tokens * Output Price / 1M)',
    explanation: 'API providers charge separate rates for input and output. Input processing (prompt) is usually much cheaper than generation (output). Estimating these costs helps you budget for large production applications.',
    example: 'For 25,000 prompt tokens and 5,000 completion tokens under Gemini Pro pricing ($1.25/$5.00 per million): Prompt cost is $0.0313, completion cost is $0.0250, totaling $0.0563.',
    faq: [
      { question: 'Why does generation cost more than input processing?', answer: 'Input tokens are processed in parallel, while output generation is auto-regressive (generating one token at a time), which requires more GPU compute.' }
    ],
    relatedSlugs: ['token-calculator', 'model-size-calculator'],
    keywords: ['llm api pricing calculator', 'token billing cost', 'gemini pro generation pricing', 'application processing finance'],
    calculate: (inputs) => {
      const prompt = Number(inputs.promptTokens || 25000);
      const compl = Number(inputs.completionTokens || 5000);
      const ratesStr = inputs.pricingTiers || '0.075,0.30';

      const parts = ratesStr.split(',');
      const inputRate = Number(parts[0] || 0.075);
      const outputRate = Number(parts[1] || 0.30);

      const promptCost = (prompt / 1000000) * inputRate;
      const complCost = (compl / 1000000) * outputRate;
      const total = promptCost + complCost;

      return {
        results: [
          { label: 'Total Transactional Cost', value: total.toFixed(5), unit: '$', isPrimary: true },
          { label: 'Prompt Input Portion Cost', value: promptCost.toFixed(5), unit: '$' },
          { label: 'Completion Output Portion Cost', value: complCost.toFixed(5), unit: '$' }
        ],
        chartData: [
          { name: 'Input cost ($)', value: promptCost },
          { name: 'Output cost ($)', value: complCost }
        ]
      };
    }
  },
  {
    id: 'model-size-calculator',
    name: 'Neural Model VRAM Calculator',
    slug: 'model-size-calculator',
    category: 'ai',
    description: 'Calculate the physical VRAM and hardware memory footprint required to run machine learning models based on parameter size and quantization.',
    seoTitle: 'Neural Network Model RAM VRAM Sizing | Calculatoora',
    seoDescription: 'Obtain estimated memory requirements to run large language models on your hardware.',
    inputs: [
      { id: 'paramBillion', label: 'Model Parameters (Billion)', type: 'number', defaultValue: 7, step: 1 },
      { id: 'quantizationBits', label: 'Precision Level / Quantization', type: 'select', defaultValue: '16', options: [
        { label: 'FP16 (Half precision - 16-bit)', value: '16' },
        { label: 'INT8 (8-bit Quantized)', value: '8' },
        { label: 'INT4 (4-bit Quantized)', value: '4' }
      ]}
    ],
    formula: 'Memory (GB) = (Parameters * bits / 8) * 1.2\nIncludes 20% system cache and CUDA overhead.',
    explanation: 'Running machine learning models requires significant VRAM. FP16 precision requires 2 bytes of RAM per parameter. Quantization compresses weights (e.g., to 4 bits), reducing memory limits at a small cost to accuracy.',
    example: 'Running a 7 billion parameter model at FP16 precision requires approximately 16.80 GB of VRAM (including 20% overhead).',
    faq: [
      { question: 'What is model quantization?', answer: 'The process of compressing a model\'s weights from standard 16-bit precision to 8-bit or 4-bit integers, reducing memory limits and speed limits.' }
    ],
    relatedSlugs: ['token-calculator', 'ai-cost-calculator'],
    keywords: ['vram model sizing', 'quantization limits fp16', 'gpu memory requirements', 'llm local deployment'],
    calculate: (inputs) => {
      const b = Number(inputs.paramBillion || 7);
      const prec = Number(inputs.quantizationBits || 16);

      const baseBytes = b * (prec / 8);
      const totalGB = baseBytes * 1.20; // 20% system overhead buffer

      return {
        results: [
          { label: 'Projected VRAM Sizing Required', value: totalGB.toFixed(2), unit: 'GB', isPrimary: true },
          { label: 'Net Parameter Storage size', value: baseBytes.toFixed(2), unit: 'GB' },
          { label: 'System Cache Overhead Included', value: '20% CUDA buffer' }
        ],
        chartData: [
          { name: 'Model Weights (GB)', value: baseBytes },
          { name: 'System Cache (GB)', value: totalGB - baseBytes }
        ]
      };
    }
  },

  // ==================== CYBERSECURITY ====================
  {
    id: 'password-strength-calculator',
    name: 'Password Strength & Entropy Calculator',
    slug: 'password-strength-calculator',
    category: 'cybersecurity',
    description: 'Calculate password strength entropy in bits, and estimate the time required to crack them via brute force attacks.',
    seoTitle: 'Password Strength Entropy Bit Rate | Calculatoora',
    seoDescription: 'Assess password strength. Calculates information entropy bits and brute force crack times.',
    inputs: [
      { id: 'passLen', label: 'Password Length Count', type: 'number', defaultValue: 12, min: 1, max: 128, step: 1 },
      { id: 'useLower', label: 'Includes Lowercase Letters (a-z)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'useUpper', label: 'Includes Uppercase Letters (A-Z)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'useNumbers', label: 'Includes Numbers (0-9)', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]},
      { id: 'useSymbols', label: 'Includes Symbols (!@#...)', type: 'select', defaultValue: 'no', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]}
    ],
    formula: 'Pool Size (L) = Sum of active character sets capacities\nEntropy = Length * log2(L)',
    explanation: 'Password strength depends on character entropy. A larger character pool dramatically increases the total combinations, extending brute force crack times exponentially.',
    example: 'A 12-character password using uppercase, lowercase, and numbers (62-character pool) achieves 71.45 bits of entropy, taking years to crack.',
    faq: [
      { question: 'What is a secure entropy rating?', answer: 'We recommend aiming for at least 80 bits of entropy. Passwords with over 100 bits of entropy are considered exceptionally secure.' }
    ],
    relatedSlugs: ['password-strength-calculator'],
    keywords: ['password strength entropy', 'brute force crack time', 'cybersecurity password security', 'character set complexity'],
    calculate: (inputs) => {
      const len = Number(inputs.passLen || 12);
      const low = inputs.useLower === 'yes';
      const up = inputs.useUpper === 'yes';
      const num = inputs.useNumbers === 'yes';
      const sym = inputs.useSymbols === 'yes';

      let pool = 0;
      if (low) pool += 26;
      if (up) pool += 26;
      if (num) pool += 10;
      if (sym) pool += 33;

      if (pool === 0) pool = 1;

      const entropy = len * (Math.log(pool) / Math.log(2));

      let level = 'Critically Weak';
      if (entropy >= 80) level = 'Very Secure';
      else if (entropy >= 60) level = 'Strong';
      else if (entropy >= 40) level = 'Fair';

      return {
        results: [
          { label: 'Information Entropy Score', value: entropy.toFixed(2), unit: 'Bits', isPrimary: true },
          { label: 'Assessed Security Level', value: level },
          { label: 'Character Pool Volume sizing', value: pool }
        ]
      };
    }
  }
];
