import React, { useState } from 'react';
import { BookOpen, HelpCircle, FileText, ChevronDown, ChevronUp, Link as LinkIcon, Compass } from 'lucide-react';

export function EducationalContent() {
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      q: "How many cubic feet are in a cubic yard?",
      a: "There are exactly 27 cubic feet in 1 cubic yard. To convert cubic feet to cubic yards, divide the cubic feet value by 27."
    },
    {
      q: "How much concrete does one 80 lb (36 kg) bag yield?",
      a: "An 80-pound bag of pre-mixed concrete yields approximately 0.60 cubic feet (0.017 m³) of wet concrete. Therefore, you need about 45 bags of 80 lb concrete to make one cubic yard."
    },
    {
      q: "What is a safe waste allowance percentage for concrete?",
      a: "A standard waste allowance is 5% to 10%. For unlevel ground, post holes, or irregular trenches, 10% is recommended. For highly regular formwork or small slabs, 5% is usually sufficient."
    },
    {
      q: "What is the standard density of concrete?",
      a: "Standard concrete has a cured density of approximately 150 pounds per cubic foot (lbs/ft³), which equals 2,400 kilograms per cubic meter (kg/m³) or 2.02 short tons per cubic yard (tons/yd³)."
    },
    {
      q: "How long does concrete take to cure to full strength?",
      a: "Concrete achieves about 70% of its design strength within 7 days, and reaches its full rated design strength (typically 3,000 to 4,000 PSI) after 28 days of wet curing."
    }
  ];

  return (
    <div className="space-y-12 mt-16 max-w-5xl mx-auto border-t border-neutral-200 dark:border-neutral-800 pt-12">
      {/* SECTION 1: DETAILED GUIDES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/40 dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            How to Calculate Concrete Volume
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Calculating concrete volume follows a simple formula: multiply the total area by the thickness. To calculate the yardage for a rectangular slab, find the length and width in feet, multiply them, and then multiply by the depth converted into feet (inches divided by 12).
          </p>
          <div className="bg-blue-50/50 dark:bg-cyan-950/20 p-4 rounded-xl border border-blue-100 dark:border-cyan-950/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-cyan-400 mb-1">
              Slab Volume Formula
            </h4>
            <code className="text-sm font-mono block text-neutral-800 dark:text-neutral-200">
              Volume (Cubic Feet) = Length (ft) × Width (ft) × [Thickness (in) ÷ 12]
            </code>
            <code className="text-sm font-mono block text-neutral-800 dark:text-neutral-200 mt-2">
              Volume (Cubic Yards) = Volume (Cubic Feet) ÷ 27
            </code>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Concrete Mix Ratios (By Parts)
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Standard high-strength concrete follows a <strong>1:2:4</strong> mix ratio by volume: 1 part cement, 2 parts sand (fine aggregate), and 4 parts gravel (coarse aggregate). This produces concrete with a rated strength of approximately 3,000 PSI (C20/C25 equivalents).
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg">
              <span className="block font-bold text-neutral-800 dark:text-neutral-200">1:1.5:3 (M20)</span>
              <span className="text-neutral-500">Foundation columns, slabs</span>
            </div>
            <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg">
              <span className="block font-bold text-neutral-800 dark:text-neutral-200">1:2:4 (M15)</span>
              <span className="text-neutral-500">Patios, walkways, driveways</span>
            </div>
            <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg">
              <span className="block font-bold text-neutral-800 dark:text-neutral-200">1:3:6 (M10)</span>
              <span className="text-neutral-500">Mass concrete, thick base fill</span>
            </div>
            <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg">
              <span className="block font-bold text-neutral-800 dark:text-neutral-200">1:4:8 (M7.5)</span>
              <span className="text-neutral-500">Leveling layers, sub-bases</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: WORKED EXAMPLES */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white text-center">
          Worked Engineering Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h4 className="text-lg font-bold text-blue-600 dark:text-cyan-400 mb-2">
              Example 1: Backyard Patio Slab
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Suppose you need to pour a concrete slab that measures <strong>15 feet long</strong>, <strong>12 feet wide</strong>, and is <strong>4 inches deep</strong>. We will assume a 10% waste contingency.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
              <li>Convert thickness to feet: 4 in ÷ 12 = 0.333 ft.</li>
              <li>Calculate raw volume: 15 × 12 × 0.333 = 60 cu ft.</li>
              <li>Apply 10% waste: 60 × 1.10 = 66 cu ft.</li>
              <li>Convert to cubic yards: 66 ÷ 27 = 2.44 cu yd.</li>
              <li>Standard 80 lb bags needed: 66 cu ft ÷ 0.60 cu ft/bag = 110 bags.</li>
            </ol>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h4 className="text-lg font-bold text-blue-600 dark:text-cyan-400 mb-2">
              Example 2: Circular Fence Post Holes
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Let's calculate the concrete for <strong>15 fence post holes</strong>. Each hole is <strong>10 inches in diameter</strong> and <strong>3 feet deep</strong>, using a 5% waste margin.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
              <li>Convert diameter to feet: 10 in ÷ 12 = 0.833 ft.</li>
              <li>Radius = 0.833 ÷ 2 = 0.417 ft.</li>
              <li>Single hole volume: π × (0.417)² × 3 = 1.636 cu ft.</li>
              <li>Total for 15 holes: 1.636 × 15 = 24.54 cu ft.</li>
              <li>Add 5% waste: 24.54 × 1.05 = 25.77 cu ft (0.95 cu yd).</li>
              <li>Standard 80 lb bags: 25.77 ÷ 0.60 = 43 bags.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* SECTION 3: DRY BAGS VS READY-MIX COMPARISON */}
      <div className="bg-neutral-100 dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Ready-Mix Trucks vs. Bagged Concrete
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Deciding whether to mix dry bags yourself or order a ready-mix truck depends primarily on the volume of concrete required. Mixing concrete manually is physically demanding and slow, making trucks ideal for larger pours.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-bold text-neutral-800 dark:text-white mb-2">When to Use Dry Bags</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <li>Total volume is under 1 cubic yard (approx 27 cu ft)</li>
              <li>Small DIY projects like single fence posts or patio repairs</li>
              <li>When the worksite has restricted heavy truck access</li>
              <li>Cost effective for micro-pours with zero delivery fees</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-bold text-neutral-800 dark:text-white mb-2">When to Order Ready-Mix</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <li>Total volume exceeds 1 to 1.5 cubic yards</li>
              <li>Requires high strength and aggregate consistency</li>
              <li>Saves hours of physical labor and mixing equipment rental</li>
              <li>Perfect for structural footings, driveways, and large slabs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 4: FAQ */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white text-center flex items-center justify-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-2 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = !!openFaq[idx];
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 font-semibold text-sm text-left text-neutral-800 dark:text-neutral-200 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: GLOSSARY */}
      <div className="p-6 bg-white/40 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Concrete Terminology & Glossary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <strong className="block text-neutral-800 dark:text-neutral-200">Aggregates</strong>
            <span className="text-neutral-500">Granular materials such as sand, gravel, or crushed stone mixed with cement paste to form concrete.</span>
          </div>
          <div>
            <strong className="block text-neutral-800 dark:text-neutral-200">Cubic Yard (cu yd)</strong>
            <span className="text-neutral-500">The standard trade volumetric unit for ordering concrete in North America, equal to 27 cubic feet.</span>
          </div>
          <div>
            <strong className="block text-neutral-800 dark:text-neutral-200">Curing</strong>
            <span className="text-neutral-500">Maintaining correct temperature and humidity in fresh concrete to allow hydration and strength gain.</span>
          </div>
          <div>
            <strong className="block text-neutral-800 dark:text-neutral-200">Hydration</strong>
            <span className="text-neutral-500">The chemical reaction between cement particles and water which binds aggregates together into rock.</span>
          </div>
        </div>
      </div>

      {/* SECTION 6: RELATED LINKS */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-2">
          <LinkIcon className="h-4 w-4" />
          Related Construction & Material Calculators
        </h4>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {['Construction Calculator', 'Gravel Calculator', 'Sand Calculator', 'Asphalt Calculator', 'Brick Calculator', 'Tile Calculator', 'Paint Calculator', 'Roofing Calculator'].map((calc) => (
            <span 
              key={calc} 
              className="px-3 py-1.5 bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-full cursor-not-allowed"
            >
              {calc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
