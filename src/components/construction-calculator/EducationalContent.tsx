import React from 'react';

export default function EducationalContent() {
  return (
    <div className="mt-12 space-y-12 text-neutral-800 dark:text-neutral-200">
      
      {/* Educational Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Comprehensive Construction Estimation Guide
        </h2>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Learn professional tips, material metrics, and methodologies used by certified estimators to plan budgets, manage wastage, and timeline building structures.
        </p>
      </div>

      {/* Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            How to Estimate Construction Materials
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Material estimation bridges mathematical design with real-world procurement. The core principle centers on calculating structural volume or area, and dividing by unit components. For example:
          </p>
          <ul className="mt-3 list-disc pl-5 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <li><strong>Concrete Slabs:</strong> Volume calculated as Length × Width × Thickness. Poured volume must be ordered in Cubic Yards or Cubic Meters.</li>
            <li><strong>Brick Wall Cladding:</strong> Length of wall × Height of wall gives facial area. Bricks are estimated using face areas plus the surrounding mortar joints (typically 10mm or 3/8&quot;).</li>
            <li><strong>Framing Studs:</strong> Usually spaced at 16 inches (400mm) or 24 inches (600mm) on center. Standard practice assumes 1 stud per linear foot of wall to cover plates, headers, and corners.</li>
          </ul>
        </div>

        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            Construction Cost Estimation
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            A comprehensive bid breaks down into several key cost classes:
          </p>
          <ul className="mt-3 list-disc pl-5 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <li><strong>Direct Materials:</strong> Physical resources permanent to the final build (lumber, dry concrete, steel rebar, cladding sheets).</li>
            <li><strong>Labor Charges:</strong> The wage-hours of carpenters, bricklayers, concrete pourers, and supervisors. Usually estimated by (Crew Size × Hours Worked × Rate).</li>
            <li><strong>Equipment Rentals:</strong> Excavators, concrete mixers, scaffolding setups, and dumpster rentals.</li>
            <li><strong>Waste &amp; Contingencies:</strong> Materials lost due to cut offsets or shipping damage. Generally loaded as a multiplier (e.g., 5% to 15%) onto physical needs.</li>
          </ul>
        </div>

        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            Material Waste Calculation
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Wastage in construction is inevitable. Custom tile cuts, corner-lumber trimmings, concrete spills, and bricks chipped during transit must be estimated beforehand to avoid costly mid-project job pauses.
          </p>
          <div className="mt-3 p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl font-mono text-xs text-neutral-700 dark:text-neutral-300">
            Required Order Volume = Perfect Architectural Volume × (1 + Waste % / 100)
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Standard recommended waste ratios: Simple slabs (5%), intricate tiling layouts (10% to 15%), structural framing lumber (10%).
          </p>
        </div>

        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            Labor Cost Estimation &amp; Timelines
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Labor represents the highest variance item in custom construction. Calculating crew sizing and daily productivity rates helps project realistic durations:
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            If a 4-man crew covers 100 square feet of drywall hanging per day, a 1,200 square foot project will require exactly:
          </p>
          <div className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl font-mono text-xs text-neutral-700 dark:text-neutral-300">
            Estimated Duration = 1,200 sq ft / 100 sq ft/day = 12 working days.
            <br />
            Total Labor Cost = 4 workers × 12 days × 8 hrs/day × $35/hr = $13,440.
          </div>
        </div>

        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            Building Envelope Volume &amp; Area
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Thermal efficiency, HVAC sizing, and structural weight rely heavily on total building envelope dimensions.
          </p>
          <ul className="mt-3 list-disc pl-5 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <li><strong>Building Floor Area:</strong> Length × Width. Governs foundation footprints, sub-flooring layout, and roofing spans.</li>
            <li><strong>Internal Volume:</strong> Length × Width × Ceiling Height. Governs mechanical heating/cooling BTU estimates and insulation coverage volumes.</li>
          </ul>
        </div>

        <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            Pro Construction Planning Steps
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            A successful build follows a strict sequencing pattern:
          </p>
          <ol className="mt-2 list-decimal pl-5 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <li><strong>Site Survey:</strong> Confirming grades, setbacks, utilities, and soil load-bearing capacities.</li>
            <li><strong>Architectural Sizing:</strong> Generating detailed isometric dimensions, floor elevations, and sections.</li>
            <li><strong>Takeoff List:</strong> Extracting physical material counts (rebar, concrete volumes, blocks) using high-precision construction calculators.</li>
            <li><strong>Bid Sourcing:</strong> Multiplying takeoff counts with current material and local labor rates.</li>
          </ol>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-red-500/5 dark:bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3">
          Critical Mistakes in Construction Estimation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 dark:text-neutral-400">
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">1. Ignoring Joint &amp; Cut Waste</h4>
            <p>Failing to account for the thickness of mortar joints (brickwork) or lumber kerfs leads to purchasing 5-10% fewer materials than physically necessary.</p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">2. Blind Unit Mix-Ups</h4>
            <p>Mixing up Imperial inches with structural feet or Metric centimeters often causes devastating volume calculation errors (e.g. pouring concrete slabs 4 feet thick instead of 4 inches).</p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">3. Forgetting Site Setups</h4>
            <p>Omitting site overhead items like tool storage locks, toilet rentals, delivery fees, and municipal building permit taxes. These often run up to 15% of the total cost.</p>
          </div>
        </div>
      </div>

      {/* Worked Examples */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Worked Estimation Examples</h3>
        
        <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Example 1: Concrete Driveway Slab (Imperial)</h4>
            <p className="text-xs text-neutral-500">Pouring a driveway 12 feet wide by 30 feet long, with a standard thickness of 4 inches.</p>
          </div>
          <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl">
            <strong>Step 1: Convert thickness from inches to feet:</strong>
            <br />
            4 inches ÷ 12 = 0.333 feet
            <br /><br />
            <strong>Step 2: Calculate basic cubic volume in cubic feet:</strong>
            <br />
            Volume = 12 ft × 30 ft × 0.333 ft = 120 Cubic Feet
            <br /><br />
            <strong>Step 3: Convert to Cubic Yards (standard commercial concrete unit):</strong>
            <br />
            120 Cubic Feet ÷ 27 = 4.44 Cubic Yards
            <br /><br />
            <strong>Step 4: Add 10% Waste Buffer:</strong>
            <br />
            Ordered Volume = 4.44 × 1.10 = 4.88 Cubic Yards
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="border-l-4 border-cyan-500 pl-4">
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Example 2: Brick Wall Cladding (Metric)</h4>
            <p className="text-xs text-neutral-500">Estimating standard bricks for a garden wall 6 meters long and 1.8 meters high.</p>
          </div>
          <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl">
            <strong>Step 1: Calculate total facial area:</strong>
            <br />
            Wall Area = 6.0 m × 1.8 m = 10.8 Square Meters
            <br /><br />
            <strong>Step 2: Calculate effective single brick area:</strong>
            <br />
            Standard Brick length is 190mm (0.19m) and height is 90mm (0.09m).
            <br />
            Mortar joint is 10mm (0.01m).
            <br />
            Effective Brick length = 0.19 + 0.01 = 0.20m
            <br />
            Effective Brick height = 0.09 + 0.01 = 0.10m
            <br />
            Effective Brick Area = 0.20m × 0.10m = 0.02 Square Meters
            <br /><br />
            <strong>Step 3: Calculate basic brick count:</strong>
            <br />
            Bricks required = 10.8 sq m ÷ 0.02 sq m = 540 bricks
            <br /><br />
            <strong>Step 4: Add 5% breakage allowance:</strong>
            <br />
            Total Order Count = 540 × 1.05 = 567 bricks
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">How do I choose between Metric and Imperial units?</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              In general, construction projects in the United States, United Kingdom, and Canada utilize Imperial standards (inches, feet, yards), while European, Australian, and global regions utilize Metric standards (millimeters, centimeters, meters). Our calculator handles automatic cross-conversions seamlessly.
            </p>
          </div>
          <div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">What is the standard waste factor for masonry walls?</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Typically, 5% is added for standard straight masonry, while 10% is recommended for complex architectural layouts with multiple corners, doorways, or sloped brick lines requiring custom cuts.
            </p>
          </div>
          <div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">How much structural support sand and gravel do I need for a driveway base?</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              For standard residential driveways, a minimum of 4 inches (100mm) of crushed aggregate (gravel and fine sand) should be leveled and compacted before pouring concrete to prevent sinking and horizontal shifts.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Construction Glossary</h3>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden text-xs">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-bold text-neutral-500 uppercase tracking-wider">Term</th>
                <th scope="col" className="px-6 py-3 text-left font-bold text-neutral-500 uppercase tracking-wider">Definition</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400">
              <tr>
                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">Takeoff</td>
                <td className="px-6 py-4">The physical process of identifying and measuring material lists from structural blueprints.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">Wastage Contingency</td>
                <td className="px-6 py-4">An added percentage buffer to physical counts compensating for breakage, trims, and spills.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">Mortar Joint</td>
                <td className="px-6 py-4">The structural binder layer between stacked bricks or concrete blocks, usually 10mm or 3/8&quot; thick.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">Rebar</td>
                <td className="px-6 py-4">Steel reinforcement bars inserted inside wet concrete pours to elevate structural load capacities.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">Slab Thickness</td>
                <td className="px-6 py-4">The depth of poured concrete, critical in calculating cubic capacities for footings or pavements.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
