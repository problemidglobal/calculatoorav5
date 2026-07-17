import React from 'react';

interface EducationalContentProps {
  onNavigate: (view: string) => void;
}

export const EducationalContent: React.FC<EducationalContentProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: "What is the difference between Radian and Degree mode?",
      a: "Degrees divide a full circle into 360 units, which is common in geometry and engineering. Radians measure angles based on the radius of a circle (a full circle is 2π radians), which is the standard in calculus and physics because it simplifies mathematical derivatives."
    },
    {
      q: "How do I perform custom base logarithm calculations?",
      a: "Use the custom log log_b(x) feature. In standard terms, log_b(x) is equal to ln(x) / ln(b). Our scientific calculator lets you select custom bases easily."
    },
    {
      q: "Can this scientific calculator handle imaginary numbers?",
      a: "Yes! You can enter complex expressions in rectangular form (e.g., 3 + 4i). You can convert them instantly to Polar form (r∠θ) or Euler's Exponential form (r·e^(iθ))."
    },
    {
      q: "What is a Singular Matrix?",
      a: "A singular matrix is a square matrix whose determinant is exactly 0. Singular matrices do not have a multiplicative inverse, and trying to invert them will trigger a warning in our smart insights."
    }
  ];

  const glossary = [
    { term: "Determinant", def: "A scalar value computed from a square matrix that encodes scaling behavior and invertibility." },
    { term: "Eigenvector", def: "A non-zero vector that changes only by a scalar factor when that linear transformation is applied." },
    { term: "Gamma Function (Γ)", def: "An extension of the factorial function to real and complex numbers, defined as Γ(n) = (n-1)! for positive integers." },
    { term: "Polar Form", def: "A representation of a complex number using its distance from the origin (magnitude) and angle (argument) as r∠θ." }
  ];

  const related = [
    { name: "Graphing Calculator", slug: "graphing-calculator", category: "math" },
    { name: "Algebra Calculator", slug: "algebra-calculator", category: "math" },
    { name: "GPA Calculator", slug: "gpa-calculator", category: "education" },
    { name: "Age Calculator", slug: "age-calculator", category: "daily-life" },
    { name: "Calorie Calculator", slug: "calorie-calculator", category: "fitness" },
    { name: "Pregnancy Calculator", slug: "pregnancy-calculator", category: "health" }
  ];

  return (
    <div className="mt-16 border-t border-neutral-200/50 dark:border-neutral-800/50 pt-12 text-left max-w-5xl mx-auto">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 font-sans tracking-tight">
          Comprehensive Guide to the Scientific Calculator
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
          A <strong>Scientific Calculator</strong> is a specialized mathematical tool designed to evaluate complex formulas, advanced transcendental functions, and algebra, trigonometry, and statistical equations. Unlike standard calculators, which are restricted to basic operations like addition or multiplication, a scientific calculator supports exponential powers, multi-dimensional vectors, matrices, polar complex planes, and calculus-assisting concepts.
        </p>

        {/* --- GRID SECTIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">Core Trigonometric Modes</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Our hub supports calculations in three coordinate systems:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li><strong>Degrees (Deg):</strong> Full rotation is 360°.</li>
              <li><strong>Radians (Rad):</strong> Full rotation is 2π radians. Essential for limits and derivatives.</li>
              <li><strong>Gradians (Grad):</strong> Full rotation is 400 gradians. Common in survey design.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">Complex Matrix & Vector Calculus</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Solve multi-variable linear algebra directly in your browser. Design matrices up to 4x4, compute cross products of 3D vectors, extract eigenvalues, transpose coordinates, and review visual heatmaps representing numerical magnitude gradients in real time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">Probability Distributions</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Compute Binomial, Poisson, and Normal distributions using standard parameters. Access randomized probability simulations such as virtual multi-dice rolling or coin flips to review large-scale law-of-large-numbers distributions visually.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">Over 100+ Physical Constants</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Includes physical, atomic, universal, and mathematical constants. Reference values such as the speed of light (<i>c</i>), Planck constant (<i>h</i>), Euler's number, standard gravity, and electron charge instantly.
            </p>
          </div>

        </div>

        {/* --- WORKED EXAMPLES --- */}
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">Worked Mathematical Examples</h3>
        <div className="space-y-4 mb-10">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest font-mono">Example 1: Complex Plane</span>
            <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-1">Convert 3 + 4i into Polar Exponential Form</p>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 font-mono">
              <div>Magnitude: r = √(3² + 4²) = √25 = 5</div>
              <div>Angle: θ = arctan(4 / 3) ≈ 0.9273 rad (53.13°)</div>
              <div>Euler Form: 5 · e^(i · 0.9273)</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest font-mono">Example 2: Probability Distribution</span>
            <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-1">Find the Poisson probability of getting exactly 3 successes with an average rate of 2</p>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 font-mono">
              <div>P(k=3; λ=2) = (e⁻² · 2³) / 3!</div>
              <div>P(k=3; λ=2) = (0.13533 · 8) / 6</div>
              <div>Result = 1.08264 / 6 ≈ 0.1804 (18.04%)</div>
            </div>
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-6 mb-10">
          {faqs.map((faq, i) => (
            <div key={i}>
              <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                {faq.q}
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* --- GLOSSARY --- */}
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">Mathematical Glossary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {glossary.map((g, i) => (
            <div key={i} className="p-4 rounded-xl border border-neutral-150 dark:border-neutral-800/80">
              <strong className="text-neutral-800 dark:text-neutral-200 text-sm">{g.term}</strong>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{g.def}</p>
            </div>
          ))}
        </div>

        {/* --- RELATED CALCULATORS --- */}
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">Related Calculations</h3>
        <div className="flex flex-wrap gap-2 mb-10">
          {related.map((item, i) => (
            <a
              key={i}
              href={`#/${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.slug === "home" ? "home" : `category:${item.category}`);
              }}
              className="px-4 py-2 text-xs font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-blue-50 dark:hover:bg-cyan-950/30 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg transition-all border border-neutral-200 dark:border-neutral-800"
            >
              {item.name}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
};
