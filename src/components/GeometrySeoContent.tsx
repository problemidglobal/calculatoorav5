import React from 'react';
import { BookOpen, HelpCircle, GraduationCap, ArrowRight, Table } from 'lucide-react';

interface RelatedLinkProps {
  label: string;
  slug: string;
}

const RELATED_CALCULATORS: RelatedLinkProps[] = [
  { label: 'Triangle Calculator', slug: 'triangle-calculator' },
  { label: 'Circle Calculator', slug: 'circle-calculator' },
  { label: 'Area Calculator', slug: 'area-calculator' },
  { label: 'Volume Calculator', slug: 'volume-calculator' },
  { label: 'Pythagorean Theorem', slug: 'pythagorean-theorem' },
  { label: 'Distance Calculator', slug: 'distance-calculator' },
  { label: 'Slope Calculator', slug: 'slope-calculator' },
  { label: 'Polygon Calculator', slug: 'polygon-calculator' },
  { label: 'Graphing Calculator', slug: 'graphing-calculator' },
  { label: 'Algebra Calculator', slug: 'algebra-calculator' },
];

export default function GeometrySeoContent() {
  return (
    <div className="mt-16 border-t border-neutral-200 dark:border-neutral-800 pt-10 text-neutral-700 dark:text-neutral-300 space-y-12 max-w-4xl mx-auto">
      {/* Educational Header */}
      <div className="text-center space-y-3">
        <GraduationCap className="w-12 h-12 text-blue-500 dark:text-cyan-400 mx-auto" />
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Comprehensive Guide to Geometry
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          Explore plane & solid geometry, essential equations, coordinate proofs, step-by-step visual calculations, and fundamental formulas.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> What Is Geometry?
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Geometry (from Ancient Greek <i>geometria</i>, meaning "earth-measuring") is a branch of mathematics concerned with the properties of space, including the shape, size, relative position of figures, and properties of space.
          </p>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            It is split broadly into two main areas: <strong>Plane Geometry</strong> (flat two-dimensional shapes like circles, triangles, and polygons) and <strong>Solid Geometry</strong> (three-dimensional objects like spheres, cylinders, and polyhedra).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Coordinate & 3D Geometry
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            <strong>Coordinate Geometry</strong> (or Analytic Geometry) bridges algebra and geometry by defining shapes using numerical coordinates on a Cartesian plane. It allows equations to represent lines, circles, and polygons.
          </p>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            <strong>3D Geometry</strong> focuses on finding the volumetric capacity and surface envelope of spatial objects. Calculating these values is essential in logistics, construction, physics, and product design.
          </p>
        </div>
      </div>

      {/* Formula Cheat Sheet */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Table className="w-5 h-5 text-blue-500" /> Common Geometry Formulas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                <th className="py-2 font-medium">Shape</th>
                <th className="py-2 font-medium">Perimeter / Circumference</th>
                <th className="py-2 font-medium">Area / Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60 text-neutral-800 dark:text-neutral-300">
              <tr>
                <td className="py-3 font-semibold text-neutral-900 dark:text-white">Square</td>
                <td className="py-3">P = 4s</td>
                <td className="py-3">A = s²</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900 dark:text-white">Circle</td>
                <td className="py-3">C = 2πr</td>
                <td className="py-3">A = πr²</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900 dark:text-white">Triangle</td>
                <td className="py-3">P = a + b + c</td>
                <td className="py-3">A = 0.5 × b × h</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900 dark:text-white">Sphere</td>
                <td className="py-3">SA = 4πr²</td>
                <td className="py-3">V = (4/3)πr³</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-neutral-900 dark:text-white">Cylinder</td>
                <td className="py-3">TSA = 2πr(r + h)</td>
                <td className="py-3">V = πr²h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Worked Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> Worked Example: Solving a Scalene Triangle
        </h3>
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 bg-white dark:bg-neutral-950">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">Problem Statement:</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
            Find the area of a triangle with side lengths a = 7 cm, b = 10 cm, and c = 13 cm.
          </p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">Solution Steps:</p>
          <ol className="list-decimal pl-5 text-sm space-y-2 text-neutral-600 dark:text-neutral-400">
            <li>
              Calculate the semi-perimeter <i>s</i>:<br />
              <code className="text-xs bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">s = (7 + 10 + 13) / 2 = 15 cm</code>
            </li>
            <li>
              Apply Heron&apos;s formula:<br />
              <code className="text-xs bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">Area = √(s(s - a)(s - b)(s - c))</code>
            </li>
            <li>
              Substitute the values:<br />
              <code className="text-xs bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">Area = √(15(15 - 7)(15 - 10)(15 - 13)) = √(15 × 8 × 5 × 2) = √1200</code>
            </li>
            <li>
              Solve:<br />
              <code className="text-xs bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">Area ≈ 34.641 cm²</code>
            </li>
          </ol>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-500" /> Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-950">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
              What is the triangle inequality theorem?
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              It states that for any triangle, the sum of the lengths of any two sides must be strictly greater than the length of the remaining third side (a + b &gt; c). If this is not satisfied, the endpoints can never meet to form a closed triangle.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-950">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
              Why does doubling a radius increase circular area fourfold?
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Area is a two-dimensional quadratic measurement proportional to the square of linear dimensions (r²). Therefore, scaling the radius by k = 2 scales the overall area by k² = 4.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-950">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
              What is the difference between an apothem and a radius?
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              An apothem is the distance from the center of a regular polygon perpendicular to any of its flat side edges, representing the radius of its inscribed circle. The circumradius is the distance from the center straight to any vertex.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Glossary of Geometric Terms</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <dt className="font-bold text-neutral-900 dark:text-white">Circumcenter</dt>
            <dd className="text-neutral-600 dark:text-neutral-400 mt-1">The point where the perpendicular bisectors of a triangle intersect. It is the center of the circle that circumscribes all three vertices.</dd>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <dt className="font-bold text-neutral-900 dark:text-white">Incenter</dt>
            <dd className="text-neutral-600 dark:text-neutral-400 mt-1">The intersection point of the interior angle bisectors of a triangle, representing the center of the largest inscribed circle.</dd>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <dt className="font-bold text-neutral-900 dark:text-white">Frustum</dt>
            <dd className="text-neutral-600 dark:text-neutral-400 mt-1">The solid portion that remains when a cone or pyramid is cut parallel to its base by a plane slicing through it.</dd>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <dt className="font-bold text-neutral-900 dark:text-white">Shoelace Formula</dt>
            <dd className="text-neutral-600 dark:text-neutral-400 mt-1">An algebraic algorithm used to calculate the exact area of any non-self-intersecting polygon given its vertex coordinates on a Cartesian plane.</dd>
          </div>
        </dl>
      </div>

      {/* Related Calculators */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Related Calculators</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {RELATED_CALCULATORS.map((link) => (
            <div 
              key={link.slug}
              className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-blue-500 dark:hover:border-cyan-400 transition flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-300"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
