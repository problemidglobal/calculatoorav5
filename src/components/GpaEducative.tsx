import React from 'react';

export default function GpaEducative() {
  const faqList = [
    {
      question: "What is a GPA (Grade Point Average)?",
      answer: "A Grade Point Average (GPA) is a standardized numeric representation of your academic performance. It converts letters or percentages from individual courses into a single score, usually ranging from 0.0 to 4.0 (or 4.3/5.0), representing your average achievement."
    },
    {
      question: "What is the difference between Weighted and Unweighted GPA?",
      answer: "An unweighted GPA treats all courses equally on a standard scale (usually 4.0 max), regardless of class difficulty. A weighted GPA adds extra points (e.g., +0.5 for Honors/College courses, +1.0 for AP/IB courses) or uses a multiplier to reflect the higher academic rigor of advanced coursework."
    },
    {
      question: "How do credit hours affect my GPA?",
      answer: "Your GPA is a weighted average where credit hours act as the weight. A 4-credit course has double the impact on your GPA compared to a 2-credit course. Quality Points (Grade Points × Credits) are summed and divided by the total credits to find the final average."
    },
    {
      question: "What are Quality Points?",
      answer: "Quality Points are the product of the grade points earned in a course and the credit value of that course. For example, earning an A (4.0 points) in a 3-credit course yields 12 Quality Points. These are used to calculate your overall cumulative average."
    },
    {
      question: "How do I calculate cumulative GPA?",
      answer: "To calculate cumulative GPA, sum the total Quality Points earned across all semesters, and divide that by the grand total of all credits attempted. Do not simply average your semester GPAs together, as semesters with different credit totals will skew the math."
    },
    {
      question: "Can I enter a prior GPA and credits to plan my cumulative average?",
      answer: "Yes! By entering your prior cumulative GPA and total earned credits, this calculator blends your historical average with the new courses you input, providing an exact combined current cumulative GPA."
    }
  ];

  return (
    <div className="mt-16 bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-neutral-800 shadow-md space-y-12 select-text">
      <header className="border-b border-slate-200 dark:border-neutral-800 pb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
          The Ultimate Guide to Understanding <span className="text-blue-600 dark:text-cyan-400">GPA Calculation</span>
        </h2>
        <p className="mt-2 text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          Master the mechanics of grade scale transformations, unweighted/weighted indices, and advanced future target planning.
        </p>
      </header>

      {/* 1. What Is GPA? */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          What Is GPA?
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          A <strong>GPA (Grade Point Average)</strong> is the standard metric used by high schools, colleges, and universities worldwide to quantify a student's collective academic performance. Rather than evaluating individual transcripts line-by-line, institutions compress letter grades or numerical percentages into a clean, weighted index. The resulting decimal serves as a key benchmark for university admissions, athletic eligibility, scholarship qualifications, and honors selections.
        </p>
      </section>

      {/* 2. How GPA Is Calculated */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          How GPA Is Calculated
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          A GPA is a weighted average where course credits represent the weight of each individual grade. To calculate it manually, follow these four simple steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-[#4B5563] dark:text-[#CBD5E1] pl-2">
          <li><strong>Assign Points:</strong> Convert each letter grade to its equivalent scale points (e.g., A = 4.0, B = 3.0, etc.).</li>
          <li><strong>Calculate Quality Points:</strong> Multiply each course's grade points by its credit hours.
            <div className="my-1.5 font-mono bg-slate-50 dark:bg-neutral-950/40 p-3 rounded-xl text-xs border border-slate-200 dark:border-neutral-800 text-[#111827] dark:text-[#F9FAFB] font-semibold">
              Quality Points = Grade Points × Course Credits
            </div>
          </li>
          <li><strong>Aggregate Totals:</strong> Sum all Quality Points earned across all courses, and sum all credits attempted.</li>
          <li><strong>Divide:</strong> Divide total Quality Points by total credits.
            <div className="my-1.5 font-mono bg-slate-50 dark:bg-neutral-950/40 p-3 rounded-xl text-xs border border-slate-200 dark:border-neutral-800 text-[#111827] dark:text-[#F9FAFB] font-semibold">
              GPA = Total Quality Points ÷ Total Credits
            </div>
          </li>
        </ol>
      </section>

      {/* 3. Weighted vs Unweighted GPA */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Weighted vs Unweighted GPA
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          Understanding the difference between weighted and unweighted averages is crucial for setting academic goals:
        </p>
        <ul className="list-disc list-inside space-y-3 text-sm text-[#4B5563] dark:text-[#CBD5E1] pl-2">
          <li>
            <strong>Unweighted GPA:</strong> Measured on a static scale from 0.0 to 4.0. It makes no distinction between class difficulties. An "A" in an introductory level course and an "A" in an Advanced Placement (AP) course are both valued at exactly 4.0. This measures raw consistency but doesn't reflect academic rigor.
          </li>
          <li>
            <strong>Weighted GPA:</strong> Reflects the difficulty of advanced classes (Honors, AP, IB, Dual Enrollment). Extra weight is added directly to the grade points before calculating (usually +0.5 for Honors/College classes, and +1.0 for AP/IB courses), pushing the maximum possible GPA above 4.0 (up to 5.0 or higher).
          </li>
        </ul>
      </section>

      {/* 4. Semester vs Cumulative GPA */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Semester vs Cumulative GPA
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm font-medium">
          Your transcript usually reports two distinct GPAs:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#4B5563] dark:text-[#CBD5E1]">
          <div className="bg-slate-50 dark:bg-neutral-950/40 p-5 rounded-xl border border-slate-200 dark:border-neutral-800">
            <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">Semester GPA</h4>
            <p className="text-xs leading-relaxed text-[#4B5563] dark:text-[#CBD5E1]">
              Calculates the academic average for a single term (e.g., Fall 2025). This is a helpful diagnostic to evaluate short-term performance, study habit changes, and immediate feedback on course adjustments.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-neutral-950/40 p-5 rounded-xl border border-slate-200 dark:border-neutral-800">
            <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">Cumulative GPA</h4>
            <p className="text-xs leading-relaxed text-[#4B5563] dark:text-[#CBD5E1]">
              The overarching average across your entire educational journey at that institution. Because it aggregates total lifetime credits, the cumulative average becomes increasingly stable (harder to raise or lower) as you progress from freshman to senior year.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Worked Examples */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Step-by-Step Worked Example
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          Let's analyze a standard semester with 4 classes to see how unweighted vs. weighted GPAs are calculated side-by-side:
        </p>
        <div className="overflow-x-auto border border-slate-200 dark:border-neutral-800 rounded-xl">
          <table className="w-full text-left text-sm text-[#4B5563] dark:text-[#CBD5E1]">
            <thead className="bg-slate-50 dark:bg-neutral-950/40 text-[#111827] dark:text-[#F9FAFB] text-xs uppercase font-mono">
              <tr className="divide-x divide-slate-200 dark:divide-neutral-800">
                <th className="p-3">Course</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Rigor / Weight</th>
                <th className="p-3">Unweighted Points</th>
                <th className="p-3">Weighted Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 text-xs">
              <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40">
                <td className="p-3 font-semibold text-[#111827] dark:text-[#F9FAFB]">AP Biology</td>
                <td className="p-3">4.0</td>
                <td className="p-3 font-mono">A- (3.70)</td>
                <td className="p-3">AP (+1.00)</td>
                <td className="p-3">3.70</td>
                <td className="p-3 font-mono text-blue-600 dark:text-cyan-400 font-bold">4.70</td>
              </tr>
              <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40">
                <td className="p-3 font-semibold text-[#111827] dark:text-[#F9FAFB]">Calculus I</td>
                <td className="p-3">4.0</td>
                <td className="p-3 font-mono">B+ (3.30)</td>
                <td className="p-3">None</td>
                <td className="p-3">3.30</td>
                <td className="p-3 font-mono text-blue-600 dark:text-cyan-400 font-bold">3.30</td>
              </tr>
              <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40">
                <td className="p-3 font-semibold text-[#111827] dark:text-[#F9FAFB]">Honors English</td>
                <td className="p-3">3.0</td>
                <td className="p-3 font-mono">A (4.00)</td>
                <td className="p-3">Honors (+0.50)</td>
                <td className="p-3">4.00</td>
                <td className="p-3 font-mono text-blue-600 dark:text-cyan-400 font-bold">4.50</td>
              </tr>
              <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40">
                <td className="p-3 font-semibold text-[#111827] dark:text-[#F9FAFB]">History Sem.</td>
                <td className="p-3">3.0</td>
                <td className="p-3 font-mono">B (3.00)</td>
                <td className="p-3">None</td>
                <td className="p-3">3.00</td>
                <td className="p-3 font-mono text-blue-600 dark:text-cyan-400 font-bold">3.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#4B5563] dark:text-[#CBD5E1] mt-4">
          <div className="bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
            <h5 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-2 text-sm">Unweighted Calculation:</h5>
            <ul className="space-y-1 text-xs">
              <li>Quality Points = (3.7*4) + (3.3*4) + (4.0*3) + (3.0*3) = 14.8 + 13.2 + 12 + 9 = <strong>49.0 Quality Points</strong></li>
              <li>Total Credits = 4 + 4 + 3 + 3 = <strong>14.0 Credits</strong></li>
              <li>Unweighted GPA = 49.0 ÷ 14.0 = <strong className="text-blue-600 dark:text-cyan-400 text-sm">3.50</strong></li>
            </ul>
          </div>
          <div className="bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
            <h5 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-2 text-sm">Weighted Calculation (+1.0 AP, +0.5 Honors):</h5>
            <ul className="space-y-1 text-xs">
              <li>Quality Points = (4.7*4) + (3.3*4) + (4.5*3) + (3.0*3) = 18.8 + 13.2 + 13.5 + 9 = <strong>54.5 Quality Points</strong></li>
              <li>Total Credits = 4 + 4 + 3 + 3 = <strong>14.0 Credits</strong></li>
              <li>Weighted GPA = 54.5 ÷ 14.0 = <strong className="text-blue-600 dark:text-cyan-400 text-sm">3.89</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Grade Point Scale Tables */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Standard Grade Point Scales
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          Universities vary in scale. Here is the standard reference point conversion chart mapped between Letter Grades, Percentage, and common Grade Point structures:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm mb-2">Standard 4.0 scale with Plus/Minus</h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-neutral-800 rounded-xl">
              <table className="w-full text-left text-xs text-[#4B5563] dark:text-[#CBD5E1]">
                <thead className="bg-slate-50 dark:bg-neutral-950/40 font-mono text-[#111827] dark:text-[#F9FAFB] font-bold">
                  <tr className="divide-x divide-slate-200 dark:divide-neutral-800">
                    <th className="p-2">Letter</th>
                    <th className="p-2">Percent</th>
                    <th className="p-2">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 font-medium">
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">A+ / A</td><td className="p-2">93 - 100%</td><td className="p-2">4.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">A-</td><td className="p-2">90 - 92%</td><td className="p-2">3.70</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">B+</td><td className="p-2">87 - 89%</td><td className="p-2">3.30</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">B</td><td className="p-2">83 - 86%</td><td className="p-2">3.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">B-</td><td className="p-2">80 - 82%</td><td className="p-2">2.70</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">C+</td><td className="p-2">77 - 79%</td><td className="p-2">2.30</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">C</td><td className="p-2">73 - 76%</td><td className="p-2">2.00</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm mb-2">Extended Scale benchmarks</h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-neutral-800 rounded-xl">
              <table className="w-full text-left text-xs text-[#4B5563] dark:text-[#CBD5E1]">
                <thead className="bg-slate-50 dark:bg-neutral-950/40 font-mono text-[#111827] dark:text-[#F9FAFB] font-bold">
                  <tr className="divide-x divide-slate-200 dark:divide-neutral-800">
                    <th className="p-2">Letter</th>
                    <th className="p-2">4.3 Scale</th>
                    <th className="p-2">5.0 Scale</th>
                    <th className="p-2">10.0 Scale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 font-medium">
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">A+</td><td className="p-2">4.30</td><td className="p-2">5.00</td><td className="p-2">10.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">A</td><td className="p-2">4.00</td><td className="p-2">5.00</td><td className="p-2">9.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">B</td><td className="p-2">3.00</td><td className="p-2">4.00</td><td className="p-2">7.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">C</td><td className="p-2">2.00</td><td className="p-2">3.00</td><td className="p-2">5.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">D</td><td className="p-2">1.00</td><td className="p-2">2.00</td><td className="p-2">4.00</td></tr>
                  <tr className="divide-x divide-slate-100 dark:divide-neutral-850/40"><td className="p-2 font-bold text-[#111827] dark:text-[#F9FAFB]">F</td><td className="p-2">0.00</td><td className="p-2">0.00</td><td className="p-2">0.00</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How to Improve GPA */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Effective Strategies to Improve Your GPA
        </h3>
        <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-sm">
          Struggling with a declining average? Use these strategic steps to systematically elevate your academic credentials:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-[#4B5563] dark:text-[#CBD5E1] pl-2">
          <li><strong>Leverage Grade Replacements:</strong> Retaking a course you failed or performed poorly in is the single fastest way to boost cumulative GPA, as many colleges replace the old grade rather than averaging them together.</li>
          <li><strong>Balance Course Credits:</strong> High-credit courses (e.g., 4 or 5 credits) represent major weight. Dedicate disproportionate study energy to high-credit classes.</li>
          <li><strong>Take Strategic Electives:</strong> Boost your average by selecting courses you are genuinely passionate about or introductory classes that play to your strengths.</li>
          <li><strong>Study in Waves (Spaced Repetition):</strong> Avoid late-night cram sessions. Regular, daily review of lecture contents encodes memories deeply, resulting in much higher retention.</li>
        </ul>
      </section>

      {/* 8. FAQ */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4">
          {faqList.map((faq, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-neutral-950/40 rounded-xl border border-slate-200 dark:border-neutral-800">
              <h5 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-1.5 text-sm">{faq.question}</h5>
              <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed text-xs">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Glossary */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
          Academic Glossary
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#4B5563] dark:text-[#CBD5E1]">
          <div>
            <dt className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-1">Dual Enrollment</dt>
            <dd className="leading-relaxed">Advanced academic programs where high schoolers enroll in accredited college courses, earning both high school and transferable college credits simultaneously.</dd>
          </div>
          <div>
            <dt className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-1">Quality Points</dt>
            <dd className="leading-relaxed">The mathematical score of a class (Grade Points × Credits) used as the absolute numerator in GPA averages.</dd>
          </div>
          <div>
            <dt className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-1">Dean's List</dt>
            <dd className="leading-relaxed">An academic honor roll recognition awarded to undergraduate students achieving outstanding term GPAs (usually 3.50 or above) with a full course load.</dd>
          </div>
          <div>
            <dt className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-1">Grade Replacement Policy</dt>
            <dd className="leading-relaxed">An academic policy where retaking a class overlays the previous poor grade on your transcript, ignoring the initial F or D in calculations.</dd>
          </div>
        </dl>
      </section>

      {/* 10. Related Calculators */}
      <section className="space-y-4 border-t border-slate-200 dark:border-neutral-800 pt-8">
        <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">Related Academic & Math Calculators</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { name: 'CGPA Calculator', link: '#/calculators/cgpa-calculator' },
            { name: 'Final Grade Calculator', link: '#/calculators/final-grade-calculator' },
            { name: 'Grade Calculator', link: '#/calculators/grade-calculator' },
            { name: 'Percentage Calculator', link: '#/calculators/percentage-calculator' },
            { name: 'Average Calculator', link: '#/calculators/average-calculator' },
            { name: 'Weighted Average Calculator', link: '#/calculators/weighted-average-calculator' },
            { name: 'Exam Score Calculator', link: '#/calculators/exam-score-calculator' }
          ].map((calc, index) => (
            <a
              key={index}
              href={calc.link}
              className="p-2.5 bg-slate-50 hover:bg-blue-50 dark:bg-white/5 dark:hover:bg-blue-950/20 text-[#4B5563] dark:text-[#CBD5E1] hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg transition border border-slate-200 dark:border-neutral-800/40 font-semibold"
            >
              {calc.name}
            </a>
          ))}
        </div>
      </section>

      {/* JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GPA Calculator",
              "description": "An advanced, high-performance client-side GPA calculator that computes weighted, unweighted, and cumulative GPA for students worldwide with custom scale builders, future planner, and charts.",
              "url": "https://calculatoora.com/calculators/gpa-calculator",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://calculatoora.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Calculators",
                  "item": "https://calculatoora.com/#/calculators"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "GPA Calculator",
                  "item": "https://calculatoora.com/calculators/gpa-calculator"
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqList.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }
          ])
        }}
      />
    </div>
  );
}
