import { Calculator } from '../types';

export const PRODUCTIVITY_CALCULATORS: Calculator[] = [
  {
    id: 'prod-pomodoro',
    name: 'Pomodoro Interval Planner',
    slug: 'pomodoro-calc',
    category: 'productivity',
    description: 'Structure work and rest intervals over specific session counts to optimize daily focus.',
    seoTitle: 'Pomodoro Study Interval Planner | Calculatoora',
    seoDescription: 'Plan your study sessions using standard Pomodoro work and rest cycles to improve productivity.',
    inputs: [
      { id: 'cycles', label: 'Number of Focus Cycles', type: 'number', defaultValue: 4 },
      { id: 'workTime', label: 'Focus Period Duration (Minutes)', type: 'number', defaultValue: 25 },
      { id: 'shortBreak', label: 'Short Break Duration (Minutes)', type: 'number', defaultValue: 5 },
      { id: 'longBreak', label: 'Long Break Duration (Minutes)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Total = (Cycles * FocusTime) + ((Cycles-1) * ShortBreak) + LongBreak',
    explanation: 'The Pomodoro Technique breaks work into highly focused intervals separated by short breaks. This structured schedule helps sustain concentration and prevent mental fatigue.',
    example: 'A 4-cycle plan with 25-minute focus intervals and 5-minute short breaks takes a total of 130 minutes (2.17 hours) to complete.',
    faq: [
      { question: 'What is the standard Pomodoro interval?', answer: 'The traditional standard is 25 minutes of focused work followed by a 5-minute rest break.' }
    ],
    relatedSlugs: ['focus-time', 'work-hours'],
    calculate: (inputs) => {
      const cycles = Number(inputs.cycles || 4);
      const work = Number(inputs.workTime || 25);
      const short = Number(inputs.shortBreak || 5);
      const long = Number(inputs.longBreak || 15);

      const totalWorkTime = cycles * work;
      const totalShortBreaks = (cycles - 1) * short;
      const overallMinutes = totalWorkTime + totalShortBreaks + long;

      const hrs = Math.floor(overallMinutes / 60);
      const mins = overallMinutes % 60;

      return {
        results: [
          { label: 'Total Session Duration', value: `${hrs}h ${mins}m`, isPrimary: true },
          { label: 'Focused Work Time', value: `${totalWorkTime} mins` },
          { label: 'Rest Break Time', value: `${totalShortBreaks + long} mins` }
        ],
        chartData: [
          { name: 'Focused Work', value: totalWorkTime, color: '#39FF14' },
          { name: 'Rest Breaks', value: totalShortBreaks + long, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'prod-productivity-score',
    name: 'Personal Productivity Evaluator',
    slug: 'productivity-score',
    category: 'productivity',
    description: 'Estimate daily performance scores based on focused hours and completed tasks.',
    seoTitle: 'Daily Personal Productivity Score Solver | Calculatoora',
    seoDescription: 'Obtain daily productivity ratings based on focused hours, completed tasks, and meeting overhead.',
    inputs: [
      { id: 'focusHours', label: 'Deep Focus Hours worked', type: 'number', defaultValue: 4.5 },
      { id: 'tasksDone', label: 'Critical Tasks Completed', type: 'number', defaultValue: 6 },
      { id: 'meetingHours', label: 'Meeting Overhead (Hours)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Score = (FocusHours * 15) + (TasksCompleted * 5) - (MeetingHours * 8)',
    explanation: 'Minimizing non-vital interruptions (like excessive status meetings) preserves cognitive energy for highly productive deep work.',
    example: 'A day with 4.5 focus hours and 6 completed tasks alongside 2 hours of meetings scores 81.5 out of 100.',
    faq: [
      { question: 'Why penalize meeting hours?', answer: 'Status update meetings can cause context switching, reducing the time and focus available for deep creative and technical work.' }
    ],
    relatedSlugs: ['pomodoro-calc', 'focus-time', 'meeting-cost'],
    calculate: (inputs) => {
      const focus = Number(inputs.focusHours || 4.5);
      const tasks = Number(inputs.tasksDone || 6);
      const meet = Number(inputs.meetingHours || 2);

      let pScore = (focus * 15) + (tasks * 5) - (meet * 8);
      if (pScore < 10) pScore = 15;
      if (pScore > 100) pScore = 100;

      return {
        results: [
          { label: 'Overall Productivity Score', value: `${pScore.toFixed(0)} / 100`, isPrimary: true },
          { label: 'High-Impact Work output rating', value: focus > 4 ? 'Optimal Focus ✅' : 'Moderate Focus 🟡' }
        ],
        chartData: [
          { name: 'Your Score', value: pScore, color: '#39FF14' },
          { name: 'Remaining Margin', value: 100 - pScore, color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'prod-time-blocking',
    name: 'Daily Time Blocking Planner',
    slug: 'time-blocking',
    category: 'productivity',
    description: 'Calculate remaining available daylight focus margins based on pre-planned calendar events.',
    seoTitle: 'Daily Time Blocking & Available Hours Planner | Calculatoora',
    seoDescription: 'Input recurring task durations to plan a visual schedule for highly focused deep work.',
    inputs: [
      { id: 'sleep', label: 'Night Sleep Target (Hours)', type: 'number', defaultValue: 8 },
      { id: 'routine', label: 'Morning & Evening Routines (Hours)', type: 'number', defaultValue: 2 },
      { id: 'job', label: 'Standard Office/Work Hours', type: 'number', defaultValue: 8.5 }
    ],
    formula: 'Remaining Focus Time = 24 - Sleep - Routines - OfficeHours',
    explanation: 'Time blocking allocates specific hours to distinct tasks, helping developers protect deep work slots and prevent overcommitment.',
    example: 'Planning 8 sleep hours, 2 routine hours, and 8.5 work hours leaves exactly 5.5 hours for personal projects and exercise.',
    faq: [
      { question: 'What is time blocking?', answer: 'A scheduling strategy where you split the day into specific blocks of time, each dedicated to a single activity.' }
    ],
    relatedSlugs: ['work-hours', 'pomodoro-calc'],
    calculate: (inputs) => {
      const sleep = Number(inputs.sleep || 8);
      const routine = Number(inputs.routine || 2);
      const job = Number(inputs.job || 8.5);

      const allocated = sleep + routine + job;
      const remaining = Math.max(0, 24 - allocated);

      return {
        results: [
          { label: 'Unallocated Time Remaining', value: `${remaining.toFixed(1)} Hours`, isPrimary: true },
          { label: 'Planned Calendar Commitments', value: `${allocated.toFixed(1)} Hours` }
        ],
        chartData: [
          { name: 'Sleep', value: sleep, color: '#3b82f6' },
          { name: 'Admin/Work', value: routine + job, color: '#f43f5e' },
          { name: 'Free Space', value: remaining, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'prod-goal-date',
    name: 'Goal Target Date Finder',
    slug: 'goal-date',
    category: 'productivity',
    description: 'Determine required daily hours to reach project goals by your target deadline date.',
    seoTitle: 'Project Goal Target Hours Solver | Calculatoora',
    seoDescription: 'Input a project deadline and total scope hours to calculate the required daily study or work hours.',
    inputs: [
      { id: 'targetHours', label: 'Total Estimated Project Scope (Hours)', type: 'number', defaultValue: 120 },
      { id: 'daysLeft', label: 'Days Remaining until Target Date', type: 'number', defaultValue: 45 }
    ],
    formula: 'Daily hours = Total hours / Days left',
    explanation: 'Estimating task velocity helps teams set realistic project milestones and prevent burnout during critical launch weeks.',
    example: 'Completing a 120-hour coursework scope across 45 available days requires exactly 2.67 focus hours daily.',
    faq: [
      { question: 'How is task velocity measured?', answer: 'By tracking the completed scope hours per week to understand and project realistic project completion targets.' }
    ],
    relatedSlugs: ['deadline-calc', 'work-hours'],
    calculate: (inputs) => {
      const hours = Number(inputs.targetHours || 120);
      const days = Number(inputs.daysLeft || 45);

      const daily = days > 0 ? (hours / days) : hours;

      return {
        results: [
          { label: 'Required Focus Daily', value: `${daily.toFixed(2)} Hours`, isPrimary: true },
          { label: 'Weekly Velocity Target', value: `${(daily * 7).toFixed(1)} Hours` }
        ]
      };
    }
  },
  {
    id: 'prod-deadline',
    name: 'Milestone Deadline Buffer Calculator',
    slug: 'deadline-calc',
    category: 'productivity',
    description: 'Calculate milestone delivery safety buffers based on historical task delays.',
    seoTitle: 'Milestone Deadline Safety Buffer Estimator | Calculatoora',
    seoDescription: 'Obtain realistic milestone deliveries, factoring in historical task delays and planning buffer margins.',
    inputs: [
      { id: 'estimate', label: 'Normal Estimate (Days)', type: 'number', defaultValue: 14 },
      { id: 'risk', label: 'Risk Factor Overhead (%)', type: 'range', defaultValue: 25, min: 5, max: 100, step: 5 }
    ],
    formula: 'Adjusted Target = Ideal Days * (1 + RiskFactor / 100)',
    explanation: 'Unforeseen complexities often delay software and creative projects. Planning safety buffers protects launch dates from sudden delays.',
    example: 'A standard 14-day estimate with a 25% risk factor buffer extends the safe delivery target to 17.5 days.',
    faq: [
      { question: 'What is Hofstadter\'s Law?', answer: 'A humorous adage warning that projects always take longer than expected, even when you take the law into account.' }
    ],
    relatedSlugs: ['goal-date', 'work-hours'],
    calculate: (inputs) => {
      const base = Number(inputs.estimate || 14);
      const pct = Number(inputs.risk || 25) / 100;

      const safeValue = base * (1 + pct);
      const addedBuffer = safeValue - base;

      return {
        results: [
          { label: 'Safe Delivery Target', value: `${safeValue.toFixed(1)} Days`, isPrimary: true },
          { label: 'Safety Buffer Added', value: `${addedBuffer.toFixed(1)} Days` }
        ],
        chartData: [
          { name: 'Ideal Tasks time', value: base, color: '#39FF14' },
          { name: 'Overhead Buffer', value: addedBuffer, color: '#475569' }
        ]
      };
    }
  },
  {
    id: 'prod-focus-time',
    name: 'Mental Focus Time Solver',
    slug: 'focus-time',
    category: 'productivity',
    description: 'Evaluate active mental stamina durations, accounting for standard cognitive fatigue curves.',
    seoTitle: 'Active Cognitive Focus Stamina Solver | Calculatoora',
    seoDescription: 'Optimize creative productivity schedules, calculating resting block requirements based on cognitive work tasks.',
    inputs: [
      { id: 'focusStreak', label: 'Planned Continuous Focus (Minutes)', type: 'number', defaultValue: 90 }
    ],
    formula: 'Resting index = (Streak duration / 5) + baseline rest multipliers.',
    explanation: 'Continuous mental strain degrades decision-making quality. Scheduling strategic breaks helps sustain creative focus across long workdays.',
    example: 'A 90-minute design session requires at least 18 minutes of rest to restore cognitive stamina.',
    faq: [
      { question: 'What is cognitive fatigue?', answer: 'The decline in mental performance and decision-making quality that occurs during extended periods of continuous attention.' }
    ],
    relatedSlugs: ['pomodoro-calc', 'productivity-score'],
    calculate: (inputs) => {
      const streak = Number(inputs.focusStreak || 90);

      const requiredRest = Math.max(5, Math.round(streak / 5));
      let state = 'Sustainable Focus ✅';
      if (streak > 120) state = 'Fatigue Risk Zone ⚠️';
      if (streak > 240) state = 'Severe Cognitive Exhaustion 🛑';

      return {
        results: [
          { label: 'Required Rest Duration', value: `${requiredRest} Minutes`, isPrimary: true },
          { label: 'Cognitive Session State', value: state }
        ]
      };
    }
  },
  {
    id: 'prod-work-hours',
    name: 'Work Hours & Timesheet Calculator',
    slug: 'work-hours',
    category: 'productivity',
    description: 'Calculate actual billable work hours, deducting lunch breaks from start and end times.',
    seoTitle: 'Work Hours & Timesheet Calculator | Calculatoora',
    seoDescription: 'Input shifts, start/end hours, and break periods to calculate net billable timesheet hours.',
    inputs: [
      { id: 'startHr', label: 'Shift Start (Hour - 24h format)', type: 'number', defaultValue: 9 },
      { id: 'startMin', label: 'Shift Start (Minute)', type: 'number', defaultValue: 0 },
      { id: 'endHr', label: 'Shift End (Hour - 24h format)', type: 'number', defaultValue: 17 },
      { id: 'endMin', label: 'Shift End (Minute)', type: 'number', defaultValue: 30 },
      { id: 'breakMin', label: 'Lunch / Rest Deductions (Minutes)', type: 'number', defaultValue: 45 }
    ],
    formula: 'Net Minutes = (End_Minutes - Start_Minutes) - Rest_Deductions',
    explanation: 'Tracking shifts and deducting break periods is essential for preparing payroll, invoicing clients, and managing billable hours.',
    example: 'A 9:00 AM shift ending at 5:30 PM (17:30) with a 45-minute lunch break results in 7.75 net billable work hours.',
    faq: [
      { question: 'How do you convert minutes to decimal hours?', answer: 'Divide minutes by 60. For example, 45 minutes converts to 0.75 billable hours.' }
    ],
    relatedSlugs: ['time-blocking', 'goal-date'],
    calculate: (inputs) => {
      const sh = Number(inputs.startHr || 9);
      const sm = Number(inputs.startMin || 0);
      const eh = Number(inputs.endHr || 17);
      const em = Number(inputs.endMin || 30);
      const deductions = Number(inputs.breakMin || 45);

      const totalStartMins = (sh * 60) + sm;
      const totalEndMins = (eh * 60) + em;
      
      const overallMins = totalEndMins - totalStartMins;
      const netMins = overallMins - deductions;

      const decimalHours = Math.max(0, netMins / 60);

      return {
        results: [
          { label: 'Net Billable Work Hours', value: `${decimalHours.toFixed(2)} Hours`, isPrimary: true },
          { label: 'Shift Duration', value: `${Math.floor(overallMins / 60)}h ${overallMins % 60}m` },
          { label: 'Unpaid rest times', value: `${deductions} mins` }
        ]
      };
    }
  },
  {
    id: 'prod-meeting-cost',
    name: 'Corporate Meeting Cost Calculator',
    slug: 'meeting-cost',
    category: 'productivity',
    description: 'Calculate real-world financial cost profiles of team meetings based on duration and attendee rates.',
    seoTitle: 'Corporate Meeting Cost & Efficiency Solver | Calculatoora',
    seoDescription: 'Measure the financial cost of business meetings based on attendee count, average salary, and duration.',
    inputs: [
      { id: 'attendees', label: 'Number of Attendees', type: 'number', defaultValue: 12 },
      { id: 'wage', label: 'Average Hour Wage ($/hr)', type: 'number', defaultValue: 65 },
      { id: 'hoursDuration', label: 'Meeting Duration (Hours)', type: 'number', defaultValue: 1.5 }
    ],
    formula: 'Meeting Cost = Attendees * HourlyWage * Duration',
    explanation: 'Calculating meeting costs helps teams assess session relevance and prioritize focused work over non-essential status updates.',
    example: 'A 1.5-hour meeting with 12 attendees earning an average of $65/hr costs the company $1,170 in direct employee wages.',
    faq: [
      { question: 'How can teams optimize meeting costs?', answer: 'To keep meetings productive and cost-effective, hold shorter stand-ups, define clear agendas, and invite only essential stakeholders.' }
    ],
    relatedSlugs: ['productivity-score', 'time-blocking'],
    calculate: (inputs) => {
      const crew = Number(inputs.attendees || 12);
      const pay = Number(inputs.wage || 65);
      const duration = Number(inputs.hoursDuration || 1.5);

      const cost = crew * pay * duration;

      return {
        results: [
          { label: 'Direct Meeting Labor Cost', value: `$${cost.toLocaleString()}`, isPrimary: true },
          { label: 'Attendee Hours Consumed', value: `${(crew * duration).toFixed(1)} hours` },
          { label: 'Hourly cash burn rate', value: `$${(crew * pay).toLocaleString()}/hr` }
        ],
        chartData: [
          { name: 'Core Meeting Cost', value: cost, color: '#f43f5e' },
          { name: 'Alternative Value Created', value: cost * 1.5, color: '#39FF14' }
        ]
      };
    }
  }
];
