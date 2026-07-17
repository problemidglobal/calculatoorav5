import React, { useState, useEffect, useRef } from 'react';
import { 
  Square, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon, 
  Grid, 
  Compass, 
  Sliders, 
  RefreshCw, 
  Download, 
  Printer, 
  Layers, 
  Info, 
  Trash2, 
  Check, 
  Activity, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Copy,
  TrendingUp,
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LengthUnit, 
  UNIT_LABELS, 
  convertValue, 
  convertArea, 
  convertVolume, 
  solveTriangle, 
  getTriangleCoordinates, 
  calculateSquare, 
  calculateRectangle, 
  calculateCircle, 
  calculateEllipse, 
  calculateParallelogram, 
  calculateRhombus, 
  calculateTrapezoid, 
  calculateKite, 
  calculateRegularPolygon, 
  calculateIrregularPolygon, 
  calculateCube, 
  calculateCuboid, 
  calculateSphere, 
  calculateHemisphere, 
  calculateCylinder, 
  calculateCone, 
  calculateFrustum, 
  calculatePyramid, 
  calculatePrism, 
  calculateTorus,
  solveTwoPoints,
  transformPoint,
  Point
} from '../utils/geometryMath';
import GeometrySeoContent from './GeometrySeoContent';

// Define layout modes
type TabType = 'solver' | 'coordinate' | 'whatif' | 'formulas';

export default function GeometryCalculator() {
  const [activeTab, setActiveTab] = useState<TabType>('solver');
  const [unit, setUnit] = useState<LengthUnit>('cm');

  // Shape solver states
  const [selectedShape, setSelectedShape] = useState<string>('circle');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 3D viewer configuration
  const [viewer3DMode, setViewer3DMode] = useState<'solid' | 'wireframe' | 'exploded'>('solid');
  const [pitch, setPitch] = useState<number>(-25); // X rotation
  const [yaw, setYaw] = useState<number>(35);    // Y rotation
  const [zoom, setZoom] = useState<number>(1.2);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);

  // Interactive SVG variables
  const [svgZoom, setSvgZoom] = useState<number>(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Triangle Center display settings
  const [showCentroid, setShowCentroid] = useState<boolean>(false);
  const [showIncenter, setShowIncenter] = useState<boolean>(false);
  const [showCircumcenter, setShowCircumcenter] = useState<boolean>(false);
  const [showOrthocenter, setShowOrthocenter] = useState<boolean>(false);

  // Coordinate Geometry states
  const [coordX1, setCoordX1] = useState<string>('');
  const [coordY1, setCoordY1] = useState<string>('');
  const [coordX2, setCoordX2] = useState<string>('');
  const [coordY2, setCoordY2] = useState<string>('');
  const [coordResults, setCoordResults] = useState<any>(null);

  const [transX, setTransX] = useState<string>('');
  const [transY, setTransY] = useState<string>('');
  const [transAngle, setTransAngle] = useState<string>('');
  const [transScale, setTransScale] = useState<string>('');
  const [transResult, setTransResult] = useState<string>('');

  // What-If analysis states
  const [compareShapeType, setCompareShapeType] = useState<'circle' | 'square' | 'rectangle' | 'sphere'>('circle');
  const [compValA1, setCompValA1] = useState<string>('');
  const [compValA2, setCompValA2] = useState<string>('');
  const [compValB1, setCompValB1] = useState<string>('');
  const [compValB2, setCompValB2] = useState<string>('');
  const [compareResults, setCompareResults] = useState<any>(null);

  // Collapsible steps
  const [stepsExpanded, setStepsExpanded] = useState<boolean>(true);

  // Clear All
  const handleClearAll = () => {
    setInputs({});
    setResults(null);
    setErrorMsg(null);
    setCoordX1('');
    setCoordY1('');
    setCoordX2('');
    setCoordY2('');
    setCoordResults(null);
    setTransX('');
    setTransY('');
    setTransAngle('');
    setTransScale('');
    setTransResult('');
    setCompValA1('');
    setCompValA2('');
    setCompValB1('');
    setCompValB2('');
    setCompareResults(null);
  };

  // Pre-load Realistic Examples
  const loadExample = (shape: string) => {
    setSelectedShape(shape);
    setErrorMsg(null);
    if (shape === 'circle') {
      setInputs({ radius: '8' });
    } else if (shape === 'triangle') {
      setInputs({ sideA: '7', sideB: '10', sideC: '13' });
    } else if (shape === 'cylinder') {
      setInputs({ radius: '5', height: '12' });
    } else if (shape === 'cone') {
      setInputs({ radius: '6', height: '15' });
    } else if (shape === 'sphere') {
      setInputs({ radius: '10' });
    } else if (shape === 'polygon') {
      setInputs({ numSides: '6', sideLength: '5' });
    }
  };

  // Solve primary shape solver
  useEffect(() => {
    setErrorMsg(null);
    const parse = (v?: string) => (v && !isNaN(Number(v)) ? Number(v) : undefined);

    try {
      let res: any = null;

      if (selectedShape === 'square') {
        const side = parse(inputs.side);
        const perimeter = parse(inputs.perimeter);
        const area = parse(inputs.area);
        const diagonal = parse(inputs.diagonal);

        if (side !== undefined || perimeter !== undefined || area !== undefined || diagonal !== undefined) {
          res = calculateSquare(side, perimeter, area, diagonal);
        }
      } 
      else if (selectedShape === 'rectangle') {
        const length = parse(inputs.length);
        const width = parse(inputs.width);
        const area = parse(inputs.area);
        const perimeter = parse(inputs.perimeter);
        const diagonal = parse(inputs.diagonal);

        if (length !== undefined || width !== undefined || area !== undefined || perimeter !== undefined || diagonal !== undefined) {
          res = calculateRectangle(length, width, area, perimeter, diagonal);
        }
      } 
      else if (selectedShape === 'circle') {
        const radius = parse(inputs.radius);
        const diameter = parse(inputs.diameter);
        const circumference = parse(inputs.circumference);
        const area = parse(inputs.area);

        if (radius !== undefined || diameter !== undefined || circumference !== undefined || area !== undefined) {
          res = calculateCircle(radius, diameter, circumference, area);
        }
      } 
      else if (selectedShape === 'ellipse') {
        const semiMajor = parse(inputs.semiMajor);
        const semiMinor = parse(inputs.semiMinor);

        if (semiMajor !== undefined && semiMinor !== undefined) {
          res = calculateEllipse(semiMajor, semiMinor);
        }
      } 
      else if (selectedShape === 'parallelogram') {
        const base = parse(inputs.base);
        const side = parse(inputs.side);
        const height = parse(inputs.height);
        const angle = parse(inputs.angle);

        if (base !== undefined && (side !== undefined || height !== undefined || angle !== undefined)) {
          res = calculateParallelogram(base, side, height, angle);
        }
      } 
      else if (selectedShape === 'rhombus') {
        const side = parse(inputs.side);
        const angle = parse(inputs.angle);
        const d1 = parse(inputs.d1);
        const d2 = parse(inputs.d2);

        if (solderCheckRhombus(side, angle, d1, d2)) {
          res = calculateRhombus(side, angle, d1, d2);
        }
      } 
      else if (selectedShape === 'trapezoid') {
        const baseA = parse(inputs.baseA);
        const baseB = parse(inputs.baseB);
        const sideC = parse(inputs.sideC);
        const sideD = parse(inputs.sideD);
        const height = parse(inputs.height);

        if (baseA !== undefined && baseB !== undefined && (height !== undefined || (sideC !== undefined && sideD !== undefined))) {
          res = calculateTrapezoid(baseA, baseB, sideC, sideD, height);
        }
      } 
      else if (selectedShape === 'kite') {
        const sideA = parse(inputs.sideA);
        const sideB = parse(inputs.sideB);
        const d1 = parse(inputs.d1);
        const d2 = parse(inputs.d2);

        if ((sideA !== undefined && sideB !== undefined && d1 !== undefined) || (d1 !== undefined && d2 !== undefined)) {
          res = calculateKite(sideA, sideB, d1, d2);
        }
      } 
      else if (selectedShape === 'polygon') {
        const numSides = parse(inputs.numSides);
        const sideLength = parse(inputs.sideLength);
        const apothem = parse(inputs.apothem);
        const circumradius = parse(inputs.circumradius);

        if (numSides !== undefined && (sideLength !== undefined || apothem !== undefined || circumradius !== undefined)) {
          res = calculateRegularPolygon(numSides, sideLength, apothem, circumradius);
        }
      } 
      else if (selectedShape === 'irregular') {
        const coords = inputs.coords;
        if (coords) {
          res = calculateIrregularPolygon(coords);
        }
      } 
      else if (selectedShape === 'triangle') {
        // Complete Triangle Solver
        const sideA = parse(inputs.sideA);
        const sideB = parse(inputs.sideB);
        const sideC = parse(inputs.sideC);
        const alpha = parse(inputs.alpha);
        const beta = parse(inputs.beta);
        const gamma = parse(inputs.gamma);

        if (sideA !== undefined || sideB !== undefined || sideC !== undefined || alpha !== undefined || beta !== undefined || gamma !== undefined) {
          const triRes = solveTriangle({ a: sideA, b: sideB, c: sideC, alpha, beta, gamma });
          if (triRes.valid && triRes.solved.area) {
            const s = triRes.solved;
            const pts = getTriangleCoordinates(s.a!, s.b!, s.c!, s.alpha!, s.beta!, s.gamma!);
            res = {
              valid: true,
              primary: { label: 'Area', value: s.area!.toFixed(3), unit: '²' },
              secondary: [
                { label: 'Perimeter', value: s.perimeter!.toFixed(3), unit: '' },
                { label: 'Side a', value: s.a!.toFixed(3), unit: '' },
                { label: 'Side b', value: s.b!.toFixed(3), unit: '' },
                { label: 'Side c', value: s.c!.toFixed(3), unit: '' },
                { label: 'Angle α (alpha)', value: s.alpha!.toFixed(2), unit: '°' },
                { label: 'Angle β (beta)', value: s.beta!.toFixed(2), unit: '°' },
                { label: 'Angle γ (gamma)', value: s.gamma!.toFixed(2), unit: '°' },
                { label: 'Incircle Radius (r)', value: s.inradius!.toFixed(3), unit: '' },
                { label: 'Circumcircle (R)', value: s.circumradius!.toFixed(3), unit: '' },
                { label: 'Altitude on a (ha)', value: s.heightA!.toFixed(3), unit: '' },
                { label: 'Altitude on b (hb)', value: s.heightB!.toFixed(3), unit: '' },
                { label: 'Altitude on c (hc)', value: s.heightC!.toFixed(3), unit: '' },
              ],
              steps: triRes.steps,
              insights: [
                s.alpha === 90 || s.beta === 90 || s.gamma === 90 ? 'This is a Right Triangle, satisfying the Pythagorean Theorem.' : 'This is an oblique triangle.',
                Math.abs(s.a! - s.b!) < 0.01 && Math.abs(s.b! - s.c!) < 0.01 ? 'This is an Equilateral Triangle.' : Math.abs(s.a! - s.b!) < 0.01 || Math.abs(s.b! - s.c!) < 0.01 || Math.abs(s.a! - s.c!) < 0.01 ? 'This is an Isosceles Triangle.' : 'This is a Scalene Triangle.'
              ],
              properties: [
                { name: 'Inscribed Circle', value: 'Supported' },
                { name: 'Circumscribed Circle', value: 'Supported' },
              ],
              drawingData: { s, pts }
            };
          } else {
            setErrorMsg(triRes.error || 'Impossible triangle bounds.');
          }
        }
      } 
      else if (selectedShape === 'cube') {
        const side = parse(inputs.side);
        if (side !== undefined) res = calculateCube(side);
      } 
      else if (selectedShape === 'cuboid') {
        const length = parse(inputs.length);
        const width = parse(inputs.width);
        const height = parse(inputs.height);
        if (length !== undefined && width !== undefined && height !== undefined) {
          res = calculateCuboid(length, width, height);
        }
      } 
      else if (selectedShape === 'sphere') {
        const radius = parse(inputs.radius);
        if (radius !== undefined) res = calculateSphere(radius);
      } 
      else if (selectedShape === 'hemisphere') {
        const radius = parse(inputs.radius);
        if (radius !== undefined) res = calculateHemisphere(radius);
      } 
      else if (selectedShape === 'cylinder') {
        const radius = parse(inputs.radius);
        const height = parse(inputs.height);
        if (radius !== undefined && height !== undefined) {
          res = calculateCylinder(radius, height);
        }
      } 
      else if (selectedShape === 'cone') {
        const radius = parse(inputs.radius);
        const height = parse(inputs.height);
        if (radius !== undefined && height !== undefined) {
          res = calculateCone(radius, height);
        }
      } 
      else if (selectedShape === 'frustum') {
        const radiusR = parse(inputs.radiusR);
        const radiusr = parse(inputs.radiusr);
        const height = parse(inputs.height);
        if (radiusR !== undefined && radiusr !== undefined && height !== undefined) {
          res = calculateFrustum(radiusR, radiusr, height);
        }
      } 
      else if (selectedShape === 'pyramid') {
        const baseEdge = parse(inputs.baseEdge);
        const height = parse(inputs.height);
        if (baseEdge !== undefined && height !== undefined) {
          res = calculatePyramid(baseEdge, height);
        }
      } 
      else if (selectedShape === 'prism') {
        const baseSide = parse(inputs.baseSide);
        const height = parse(inputs.height);
        if (baseSide !== undefined && height !== undefined) {
          res = calculatePrism(baseSide, height);
        }
      } 
      else if (selectedShape === 'torus') {
        const majorR = parse(inputs.majorR);
        const minorR = parse(inputs.minorR);
        if (majorR !== undefined && minorR !== undefined) {
          res = calculateTorus(majorR, minorR);
        }
      }

      if (res && res.valid) {
        setResults(res);
        setErrorMsg(null);
      } else if (res && !res.valid) {
        setErrorMsg(res.message || 'Invalid calculation parameters.');
        setResults(null);
      } else {
        setResults(null);
      }
    } catch (err: any) {
      setErrorMsg('Syntax or logic discrepancy. Check dimensions.');
      setResults(null);
    }

    function solderCheckRhombus(side?: number, angle?: number, d1?: number, d2?: number) {
      return (side !== undefined && angle !== undefined) || (d1 !== undefined && d2 !== undefined);
    }
  }, [inputs, selectedShape]);

  // Coordinate Geometry calculations
  useEffect(() => {
    const x1 = parseFloat(coordX1);
    const y1 = parseFloat(coordY1);
    const x2 = parseFloat(coordX2);
    const y2 = parseFloat(coordY2);

    if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
      const info = solveTwoPoints({ x: x1, y: y1 }, { x: x2, y: y2 });
      setCoordResults(info);
    } else {
      setCoordResults(null);
    }
  }, [coordX1, coordY1, coordX2, coordY2]);

  // Point transformations
  const runTransformation = (type: 'rotate' | 'reflect_x' | 'reflect_y' | 'translate' | 'scale') => {
    const x1 = parseFloat(coordX1);
    const y1 = parseFloat(coordY1);
    if (isNaN(x1) || isNaN(y1)) {
      setTransResult('Point (X1, Y1) coordinates are required to transform.');
      return;
    }

    const startPt = { x: x1, y: y1 };
    let finalPt: Point;

    if (type === 'rotate') {
      const degAng = parseFloat(transAngle);
      if (isNaN(degAng)) { setTransResult('Enter valid angle parameter.'); return; }
      finalPt = transformPoint(startPt, 'rotate', degAng);
      setTransResult(`Rotated point: (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`);
    } else if (type === 'reflect_x') {
      finalPt = transformPoint(startPt, 'reflect_x', 0);
      setTransResult(`Reflected across X-axis: (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`);
    } else if (type === 'reflect_y') {
      finalPt = transformPoint(startPt, 'reflect_y', 0);
      setTransResult(`Reflected across Y-axis: (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`);
    } else if (type === 'translate') {
      const tx = parseFloat(transX);
      const ty = parseFloat(transY);
      if (isNaN(tx) || isNaN(ty)) { setTransResult('Enter valid translation factors (X, Y).'); return; }
      finalPt = transformPoint(startPt, 'translate', { x: tx, y: ty });
      setTransResult(`Translated point: (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`);
    } else if (type === 'scale') {
      const s = parseFloat(transScale);
      if (isNaN(s)) { setTransResult('Enter valid scaling multiplier.'); return; }
      finalPt = transformPoint(startPt, 'scale', s);
      setTransResult(`Scaled point: (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`);
    }
  };

  // What-If comparisons
  useEffect(() => {
    const a1 = parseFloat(compValA1);
    const a2 = parseFloat(compValA2);
    const b1 = parseFloat(compValB1);
    const b2 = parseFloat(compValB2);

    if (compareShapeType === 'circle') {
      if (!isNaN(a1) && !isNaN(b1) && a1 > 0 && b1 > 0) {
        const areaA = Math.PI * a1 * a1;
        const areaB = Math.PI * b1 * b1;
        const cA = 2 * Math.PI * a1;
        const cB = 2 * Math.PI * b1;
        setCompareResults({
          metric1: { name: 'Radius', valA: a1, valB: b1, diff: b1 - a1, pct: ((b1 - a1) / a1) * 100 },
          metric2: { name: 'Circumference', valA: cA, valB: cB, diff: cB - cA, pct: ((cB - cA) / cA) * 100 },
          metric3: { name: 'Area', valA: areaA, valB: areaB, diff: areaB - areaA, pct: ((areaB - areaA) / areaA) * 100 },
          insights: `The Area of Circle B is ${Math.abs(areaB / areaA).toFixed(2)}x times the Area of Circle A. Doubling any circle's radius increases its area 4-fold.`
        });
      } else { setCompareResults(null); }
    } else if (compareShapeType === 'square') {
      if (!isNaN(a1) && !isNaN(b1) && a1 > 0 && b1 > 0) {
        const areaA = a1 * a1;
        const areaB = b1 * b1;
        const pA = 4 * a1;
        const pB = 4 * b1;
        setCompareResults({
          metric1: { name: 'Side', valA: a1, valB: b1, diff: b1 - a1, pct: ((b1 - a1) / a1) * 100 },
          metric2: { name: 'Perimeter', valA: pA, valB: pB, diff: pB - pA, pct: ((pB - pA) / pA) * 100 },
          metric3: { name: 'Area', valA: areaA, valB: areaB, diff: areaB - areaA, pct: ((areaB - areaA) / areaA) * 100 },
          insights: `The Area of Square B is ${Math.abs(areaB / areaA).toFixed(2)}x times Square A.`
        });
      } else { setCompareResults(null); }
    } else if (compareShapeType === 'rectangle') {
      if (!isNaN(a1) && !isNaN(a2) && !isNaN(b1) && !isNaN(b2) && a1 > 0 && a2 > 0 && b1 > 0 && b2 > 0) {
        const areaA = a1 * a2;
        const areaB = b1 * b2;
        const pA = 2 * (a1 + a2);
        const pB = 2 * (b1 + b2);
        setCompareResults({
          metric1: { name: 'Dimensions', valA: `${a1}x${a2}`, valB: `${b1}x${b2}`, diff: 0, pct: 0 },
          metric2: { name: 'Perimeter', valA: pA, valB: pB, diff: pB - pA, pct: ((pB - pA) / pA) * 100 },
          metric3: { name: 'Area', valA: areaA, valB: areaB, diff: areaB - areaA, pct: ((areaB - areaA) / areaA) * 100 },
          insights: `Rectangle B is ${Math.abs(areaB / areaA).toFixed(2)}x times the area of Rectangle A.`
        });
      } else { setCompareResults(null); }
    } else if (compareShapeType === 'sphere') {
      if (!isNaN(a1) && !isNaN(b1) && a1 > 0 && b1 > 0) {
        const saA = 4 * Math.PI * a1 * a1;
        const saB = 4 * Math.PI * b1 * b1;
        const vA = (4/3) * Math.PI * Math.pow(a1, 3);
        const vB = (4/3) * Math.PI * Math.pow(b1, 3);
        setCompareResults({
          metric1: { name: 'Radius', valA: a1, valB: b1, diff: b1 - a1, pct: ((b1 - a1) / a1) * 100 },
          metric2: { name: 'Surface Area', valA: saA, valB: saB, diff: saB - saA, pct: ((saB - saA) / saA) * 100 },
          metric3: { name: 'Volume', valA: vA, valB: vB, diff: vB - vA, pct: ((vB - vA) / vA) * 100 },
          insights: `Solid B is ${Math.abs(vB / vA).toFixed(2)}x times larger in cubic Volume than Solid A.`
        });
      } else { setCompareResults(null); }
    }
  }, [compareShapeType, compValA1, compValA2, compValB1, compValB2]);

  // Redraw 3D solid viewer canvas when mode or angle sliders shift
  useEffect(() => {
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.classList.contains('dark');
    ctx.strokeStyle = isDark ? '#22d3ee' : '#3b82f6';
    ctx.lineWidth = 1.5;

    const scaleFactor = zoom * 32;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Generate vertices for the selected 3D shape dynamically
    let vertices: Array<[number, number, number]> = [];
    let faces: Array<number[]> = [];

    if (selectedShape === 'cube' || selectedShape === 'cuboid') {
      const dx = selectedShape === 'cube' ? 1.5 : 2;
      const dy = selectedShape === 'cube' ? 1.5 : 1.2;
      const dz = selectedShape === 'cube' ? 1.5 : 1.5;
      vertices = [
        [-dx, -dy, -dz], [dx, -dy, -dz], [dx, dy, -dz], [-dx, dy, -dz],
        [-dx, -dy, dz], [dx, -dy, dz], [dx, dy, dz], [-dx, dy, dz],
      ];
      faces = [
        [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
        [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4]
      ];
    } else if (selectedShape === 'cylinder') {
      const segments = 16;
      const r = 1.3;
      const h = 1.8;
      // Top base
      for (let i = 0; i < segments; i++) {
        const a = (i * 2 * Math.PI) / segments;
        vertices.push([r * Math.cos(a), -h, r * Math.sin(a)]);
      }
      // Bottom base
      for (let i = 0; i < segments; i++) {
        const a = (i * 2 * Math.PI) / segments;
        vertices.push([r * Math.cos(a), h, r * Math.sin(a)]);
      }
      // Sidewall faces
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        faces.push([i, next, next + segments, i + segments]);
      }
    } else if (selectedShape === 'cone') {
      const segments = 16;
      const r = 1.4;
      const h = 2.0;
      // Apex point
      vertices.push([0, -h, 0]);
      // Base circle
      for (let i = 0; i < segments; i++) {
        const a = (i * 2 * Math.PI) / segments;
        vertices.push([r * Math.cos(a), h, r * Math.sin(a)]);
      }
      // Tri faces
      for (let i = 1; i <= segments; i++) {
        const next = i === segments ? 1 : i + 1;
        faces.push([0, i, next]);
      }
    } else if (selectedShape === 'sphere' || selectedShape === 'hemisphere' || selectedShape === 'torus') {
      // Simplified representation of Sphere wireframe rings
      const rings = 8;
      const points = 12;
      const r = 1.6;
      for (let ring = 0; ring <= rings; ring++) {
        const phi = (ring * Math.PI) / rings;
        if (selectedShape === 'hemisphere' && phi > Math.PI / 2 + 0.05) continue;
        for (let pt = 0; pt < points; pt++) {
          const theta = (pt * 2 * Math.PI) / points;
          vertices.push([
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
          ]);
        }
      }
      // Wireframe connectivity loops
      for (let i = 0; i < vertices.length; i++) {
        const nextPt = (i + 1) % points === 0 ? i + 1 - points : i + 1;
        if (nextPt < vertices.length) faces.push([i, nextPt]);
      }
    } else {
      // Standard Pyramid (Base edge / apex)
      vertices = [
        [0, -1.8, 0], // Apex
        [-1.4, 1.4, -1.4], [1.4, 1.4, -1.4], [1.4, 1.4, 1.4], [-1.4, 1.4, 1.4] // base
      ];
      faces = [
        [1, 2, 3, 4], // base
        [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1] // triangles
      ];
    }

    // 3D rotation math
    const radP = (pitch * Math.PI) / 180;
    const radY = (yaw * Math.PI) / 180;

    const rotatedPoints = vertices.map(([x, y, z]) => {
      // Rotate around X axis (pitch)
      let y1 = y * Math.cos(radP) - z * Math.sin(radP);
      let z1 = y * Math.sin(radP) + z * Math.cos(radP);
      
      // Rotate around Y axis (yaw)
      let x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
      let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

      return { x: x2, y: y1, z: z2 };
    });

    // Render faces (or lines) using solid sorting if requested
    if (viewer3DMode === 'solid') {
      // Compute center depth of faces
      const sortedFaces = faces
        .map((faceIndices) => {
          const pts = faceIndices.map(idx => rotatedPoints[idx]);
          const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / (pts.length || 1);
          return { indices: faceIndices, pts, avgZ };
        })
        .sort((a, b) => b.avgZ - a.avgZ); // far to near

      for (const face of sortedFaces) {
        ctx.beginPath();
        face.pts.forEach((pt, idx) => {
          // Exploded offset factor
          const explodedOffset = viewer3DMode === 'exploded' ? 1.3 : 1.0;
          const sx = cx + pt.x * scaleFactor;
          const sy = cy + pt.y * scaleFactor;
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();

        // Shading based on simulated light source
        ctx.fillStyle = isDark ? 'rgba(8, 145, 178, 0.25)' : 'rgba(59, 130, 246, 0.15)';
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // Wireframe only
      for (const face of faces) {
        ctx.beginPath();
        face.forEach((idx, step) => {
          const pt = rotatedPoints[idx];
          const sx = cx + pt.x * scaleFactor;
          const sy = cy + pt.y * scaleFactor;
          if (step === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.stroke();
      }
    }
  }, [pitch, yaw, zoom, viewer3DMode, selectedShape]);

  // Export handlers
  const handleDownloadSVG = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `calculatoora-geometry-${selectedShape}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Title block */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
            Geometry Calculator
          </span>
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm max-w-xl mx-auto">
          The World&apos;s Most Advanced Measurement and Analytical Geometry Solver. Supports step-by-step proofs, 3D interactive rotation, and live SVG measurements.
        </p>
      </div>

      {/* Main navigation menu */}
      <div className="flex justify-center border-b border-neutral-200 dark:border-neutral-800 p-1">
        <nav className="flex gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'solver'
                ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            Shape Solver (2D/3D)
          </button>
          <button
            onClick={() => setActiveTab('coordinate')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'coordinate'
                ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            Coordinate Plane
          </button>
          <button
            onClick={() => setActiveTab('whatif')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'whatif'
                ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            What-If Comparison
          </button>
        </nav>
      </div>

      {/* Controls & Examples Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Unit System:</span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as LengthUnit)}
            className="text-xs font-bold border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 p-1 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Object.keys(UNIT_LABELS).map((u) => (
              <option key={u} value={u}>{u.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Realistic Examples trigger */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2 whitespace-nowrap">Load Examples:</span>
          {['circle', 'triangle', 'cylinder', 'cone', 'sphere', 'polygon'].map((shape) => (
            <button
              key={shape}
              onClick={() => loadExample(shape)}
              className="px-2.5 py-1 text-[11px] font-bold border border-neutral-200 dark:border-neutral-800 rounded-full hover:border-blue-500 dark:hover:border-cyan-400 hover:text-blue-500 dark:hover:text-cyan-400 transition bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400"
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
          <button
            onClick={handleClearAll}
            className="ml-3 px-2.5 py-1 text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full transition flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear All
          </button>
        </div>
      </div>

      {/* Primary Panels rendering based on active tab */}
      <div>
        {activeTab === 'solver' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left selector and inputs (4 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Shape classification selector */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Select Geometric Shape
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase tracking-wider">2D Plane Geometry</span>
                    <select
                      value={selectedShape}
                      onChange={(e) => { setSelectedShape(e.target.value); setInputs({}); }}
                      className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="circle">Circle</option>
                      <option value="triangle">Triangle Solver</option>
                      <option value="square">Square</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="ellipse">Ellipse</option>
                      <option value="parallelogram">Parallelogram</option>
                      <option value="rhombus">Rhombus</option>
                      <option value="trapezoid">Trapezoid</option>
                      <option value="kite">Kite</option>
                      <option value="polygon">Regular Polygon</option>
                      <option value="irregular">Irregular Polygon (Coords)</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase tracking-wider">3D Solid Geometry</span>
                    <select
                      value={selectedShape}
                      onChange={(e) => { setSelectedShape(e.target.value); setInputs({}); }}
                      className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="cube">Cube</option>
                      <option value="cuboid">Cuboid</option>
                      <option value="sphere">Sphere</option>
                      <option value="hemisphere">Hemisphere</option>
                      <option value="cylinder">Cylinder</option>
                      <option value="cone">Cone</option>
                      <option value="frustum">Frustum (Truncated Cone)</option>
                      <option value="pyramid">Square Pyramid</option>
                      <option value="prism">Triangular Prism</option>
                      <option value="torus">Torus</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Input fields based on selected shape */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-sm uppercase tracking-wide">
                    Dimensions <span className="text-xs font-bold text-blue-500">({unit})</span>
                  </h3>
                  <span className="text-[10px] font-bold text-neutral-400">All fields start empty</span>
                </div>

                <div className="space-y-3">
                  {selectedShape === 'circle' && (
                    <>
                      {renderEmptyInput('radius', 'Radius', 'e.g. 8')}
                      {renderEmptyInput('diameter', 'Diameter', 'e.g. 16')}
                      {renderEmptyInput('circumference', 'Circumference', 'e.g. 50.27')}
                      {renderEmptyInput('area', 'Area', 'e.g. 201.06')}
                    </>
                  )}
                  {selectedShape === 'triangle' && (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        {renderEmptyInput('sideA', 'Side a', 'e.g. 7')}
                        {renderEmptyInput('sideB', 'Side b', 'e.g. 10')}
                        {renderEmptyInput('sideC', 'Side c', 'e.g. 13')}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {renderEmptyInput('alpha', 'α (opposite a)', 'e.g. 30')}
                        {renderEmptyInput('beta', 'β (opposite b)', 'e.g. 50')}
                        {renderEmptyInput('gamma', 'γ (opposite c)', 'e.g. 100')}
                      </div>
                    </>
                  )}
                  {selectedShape === 'square' && (
                    <>
                      {renderEmptyInput('side', 'Side length (s)', 'e.g. 8')}
                      {renderEmptyInput('perimeter', 'Perimeter', 'e.g. 32')}
                      {renderEmptyInput('area', 'Area', 'e.g. 64')}
                      {renderEmptyInput('diagonal', 'Diagonal', 'e.g. 11.31')}
                    </>
                  )}
                  {selectedShape === 'rectangle' && (
                    <>
                      {renderEmptyInput('length', 'Length (l)', 'e.g. 15')}
                      {renderEmptyInput('width', 'Width (w)', 'e.g. 6')}
                      {renderEmptyInput('area', 'Area', 'e.g. 90')}
                      {renderEmptyInput('perimeter', 'Perimeter', 'e.g. 42')}
                      {renderEmptyInput('diagonal', 'Diagonal', 'e.g. 16.16')}
                    </>
                  )}
                  {selectedShape === 'ellipse' && (
                    <>
                      {renderEmptyInput('semiMajor', 'Semi-Major Axis (a)', 'e.g. 12')}
                      {renderEmptyInput('semiMinor', 'Semi-Minor Axis (b)', 'e.g. 6')}
                    </>
                  )}
                  {selectedShape === 'parallelogram' && (
                    <>
                      {renderEmptyInput('base', 'Base width (b)', 'e.g. 15')}
                      {renderEmptyInput('side', 'Slant side (s)', 'e.g. 8')}
                      {renderEmptyInput('height', 'Vertical height (h)', 'e.g. 6')}
                      {renderEmptyInput('angle', 'Acute Angle (θ)', 'e.g. 45')}
                    </>
                  )}
                  {selectedShape === 'rhombus' && (
                    <>
                      {renderEmptyInput('side', 'Side length (s)', 'e.g. 10')}
                      {renderEmptyInput('angle', 'Acute Angle (θ)', 'e.g. 60')}
                      {renderEmptyInput('d1', 'Diagonal 1 (d1)', 'e.g. 12')}
                      {renderEmptyInput('d2', 'Diagonal 2 (d2)', 'e.g. 16')}
                    </>
                  )}
                  {selectedShape === 'trapezoid' && (
                    <>
                      {renderEmptyInput('baseA', 'Bottom Base (a)', 'e.g. 15')}
                      {renderEmptyInput('baseB', 'Top Base (b)', 'e.g. 9')}
                      {renderEmptyInput('sideC', 'Left Slant (c)', 'e.g. 8')}
                      {renderEmptyInput('sideD', 'Right Slant (d)', 'e.g. 8')}
                      {renderEmptyInput('height', 'Vertical Height (h)', 'e.g. 6')}
                    </>
                  )}
                  {selectedShape === 'kite' && (
                    <>
                      {renderEmptyInput('sideA', 'Upper side (a)', 'e.g. 6')}
                      {renderEmptyInput('sideB', 'Lower side (b)', 'e.g. 12')}
                      {renderEmptyInput('d1', 'Transverse Diagonal 1', 'e.g. 8')}
                      {renderEmptyInput('d2', 'Longitudinal Diagonal 2', 'e.g. 14')}
                    </>
                  )}
                  {selectedShape === 'polygon' && (
                    <>
                      {renderEmptyInput('numSides', 'Number of Sides (n)', 'e.g. 6')}
                      {renderEmptyInput('sideLength', 'Side Length (s)', 'e.g. 5')}
                      {renderEmptyInput('apothem', 'Apothem (a)', 'e.g. 4.33')}
                      {renderEmptyInput('circumradius', 'Circumradius (R)', 'e.g. 5')}
                    </>
                  )}
                  {selectedShape === 'irregular' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                        Vertex Coordinates (X, Y)
                      </label>
                      <textarea
                        value={inputs.coords || ''}
                        onChange={(e) => setInputs(prev => ({ ...prev, coords: e.target.value }))}
                        placeholder="0,0&#10;5,0&#10;5,5&#10;0,5"
                        rows={4}
                        className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-neutral-400"
                      />
                    </div>
                  )}
                  {/* Solid dimensions */}
                  {selectedShape === 'cube' && renderEmptyInput('side', 'Side length (s)', 'e.g. 8')}
                  {selectedShape === 'cuboid' && (
                    <>
                      {renderEmptyInput('length', 'Length (l)', 'e.g. 10')}
                      {renderEmptyInput('width', 'Width (w)', 'e.g. 6')}
                      {renderEmptyInput('height', 'Height (h)', 'e.g. 8')}
                    </>
                  )}
                  {selectedShape === 'sphere' && renderEmptyInput('radius', 'Radius', 'e.g. 8')}
                  {selectedShape === 'hemisphere' && renderEmptyInput('radius', 'Radius', 'e.g. 8')}
                  {selectedShape === 'cylinder' && (
                    <>
                      {renderEmptyInput('radius', 'Radius', 'e.g. 5')}
                      {renderEmptyInput('height', 'Height', 'e.g. 12')}
                    </>
                  )}
                  {selectedShape === 'cone' && (
                    <>
                      {renderEmptyInput('radius', 'Radius', 'e.g. 6')}
                      {renderEmptyInput('height', 'Height', 'e.g. 15')}
                    </>
                  )}
                  {selectedShape === 'frustum' && (
                    <>
                      {renderEmptyInput('radiusR', 'Bottom Base Radius (R)', 'e.g. 8')}
                      {renderEmptyInput('radiusr', 'Top Base Radius (r)', 'e.g. 4')}
                      {renderEmptyInput('height', 'Vertical Height (h)', 'e.g. 10')}
                    </>
                  )}
                  {selectedShape === 'pyramid' && (
                    <>
                      {renderEmptyInput('baseEdge', 'Base side edge (a)', 'e.g. 6')}
                      {renderEmptyInput('height', 'Apex Height (h)', 'e.g. 10')}
                    </>
                  )}
                  {selectedShape === 'prism' && (
                    <>
                      {renderEmptyInput('baseSide', 'Equilateral Base Side', 'e.g. 5')}
                      {renderEmptyInput('height', 'Prism Length (h)', 'e.g. 12')}
                    </>
                  )}
                  {selectedShape === 'torus' && (
                    <>
                      {renderEmptyInput('majorR', 'Major Radius R (Center to tube)', 'e.g. 10')}
                      {renderEmptyInput('minorR', 'Minor Radius r (Tube thickness)', 'e.g. 3')}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Interactive Canvas/SVG and results dashboard (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Error boundary display */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {errorMsg}
                </div>
              )}

              {/* Diagram / wireframe stage */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Interactive Visualization</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrint}
                      className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                      title="Print Page"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleDownloadSVG}
                      className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                      title="Download Vector SVG"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2D shapes SVG drawing stage */}
                {is2DShape(selectedShape) ? (
                  <div className="flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900/30 rounded-xl p-4 border border-neutral-200/40 dark:border-neutral-800/60 min-h-[220px]">
                    <svg
                      ref={svgRef}
                      viewBox="0 0 200 200"
                      className="w-48 h-48 drop-shadow-sm text-blue-500 transition-transform duration-300"
                      style={{ transform: `scale(${svgZoom})` }}
                    >
                      {/* Grid background */}
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neutral-200 dark:text-neutral-800" />
                      </pattern>
                      <rect width="200" height="200" fill="url(#grid)" />

                      {renderShapeSVG()}
                    </svg>

                    {/* SVG controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button 
                        onClick={() => setSvgZoom(prev => Math.max(0.6, prev - 0.2))}
                        className="px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:border-blue-500"
                      >
                        Zoom Out
                      </button>
                      <button 
                        onClick={() => setSvgZoom(1)}
                        className="px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:border-blue-500"
                      >
                        100%
                      </button>
                      <button 
                        onClick={() => setSvgZoom(prev => Math.min(1.8, prev + 0.2))}
                        className="px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:border-blue-500"
                      >
                        Zoom In
                      </button>
                    </div>

                    {selectedShape === 'triangle' && results && (
                      <div className="flex flex-wrap gap-3 mt-4 items-center justify-center border-t border-neutral-200/50 dark:border-neutral-800/50 pt-3 w-full">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer">
                          <input type="checkbox" checked={showCentroid} onChange={(e) => setShowCentroid(e.target.checked)} className="rounded text-blue-500" />
                          Centroid (G)
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer">
                          <input type="checkbox" checked={showIncenter} onChange={(e) => setShowIncenter(e.target.checked)} className="rounded text-blue-500" />
                          Incenter (I)
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer">
                          <input type="checkbox" checked={showCircumcenter} onChange={(e) => setShowCircumcenter(e.target.checked)} className="rounded text-blue-500" />
                          Circumcenter (O)
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer">
                          <input type="checkbox" checked={showOrthocenter} onChange={(e) => setShowOrthocenter(e.target.checked)} className="rounded text-blue-500" />
                          Orthocenter (H)
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 3D solid viewer */
                  <div className="flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900/30 rounded-xl p-4 border border-neutral-200/40 dark:border-neutral-800/60 min-h-[220px]">
                    <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                      <canvas
                        ref={canvas3DRef}
                        width={220}
                        height={220}
                        className="cursor-move w-full h-full"
                      />
                    </div>

                    {/* 3D Sliders and toggles */}
                    <div className="w-full mt-3 space-y-2">
                      <div className="flex gap-2 justify-center border-b border-neutral-200/50 dark:border-neutral-800/50 pb-2">
                        {['solid', 'wireframe', 'exploded'].map((m) => (
                          <button
                            key={m}
                            onClick={() => setViewer3DMode(m as any)}
                            className={`px-3 py-1 rounded text-xs font-bold transition uppercase tracking-wide ${
                              viewer3DMode === m
                                ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-neutral-950 shadow-sm'
                                : 'bg-white dark:bg-neutral-950 text-neutral-500 border border-neutral-200 dark:border-neutral-800'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <span>Pitch (X Angle)</span>
                            <span>{pitch}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={pitch}
                            onChange={(e) => setPitch(Number(e.target.value))}
                            className="w-full accent-blue-500 h-1 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <span>Yaw (Y Angle)</span>
                            <span>{yaw}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={yaw}
                            onChange={(e) => setYaw(Number(e.target.value))}
                            className="w-full accent-blue-500 h-1 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Solved Results Dashboard */}
              {results ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b border-neutral-100 dark:border-neutral-900 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Primary Result</span>
                        <h4 className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1">
                          {results.primary.value} <span className="text-sm font-semibold text-neutral-400">{unit}{results.primary.unit}</span>
                        </h4>
                        <span className="text-xs font-bold text-neutral-400">Calculated Shape {results.primary.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                      {results.secondary.map((sec: any) => (
                        <div key={sec.label} className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-100 dark:border-neutral-850" title={sec.tooltip}>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{sec.label}</span>
                          <p className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">
                            {sec.value} <span className="text-xs font-semibold text-neutral-400">{unit}{sec.unit}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Insights Block */}
                  {results.insights && results.insights.length > 0 && (
                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Aesthetic & Geometric Insights
                      </h4>
                      <ul className="space-y-1.5">
                        {results.insights.map((ins: string, idx: number) => (
                          <li key={idx} className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-indigo-500 select-none">•</span>
                            {ins}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Collapsible Step-by-Step Proof solver */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-neutral-950">
                    <button
                      onClick={() => setStepsExpanded(!stepsExpanded)}
                      className="w-full p-4 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50"
                    >
                      <span>Step-by-Step Mathematical Derivations</span>
                      {stepsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {stepsExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="divide-y divide-neutral-100 dark:divide-neutral-900 overflow-hidden"
                        >
                          <div className="p-4 space-y-4">
                            {results.steps.map((st: any, idx: number) => (
                              <div key={idx} className="space-y-1.5 text-xs">
                                <h5 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                                  <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-cyan-400 w-4 h-4 rounded-full flex items-center justify-center">{idx + 1}</span>
                                  {st.title}
                                </h5>
                                <div className="pl-5 space-y-1">
                                  <div>
                                    <span className="text-neutral-400 font-medium">Formula: </span>
                                    <code className="text-blue-600 dark:text-cyan-400 font-semibold font-mono">{st.formula}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-medium">Substitution: </span>
                                    <code className="font-mono text-neutral-600 dark:text-neutral-300">{st.substitution}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-medium">Calculation: </span>
                                    <code className="font-mono text-neutral-600 dark:text-neutral-300">{st.calculation}</code>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-medium">Result: </span>
                                    <code className="font-bold text-neutral-900 dark:text-white font-mono">{st.result}</code>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-neutral-400 bg-white dark:bg-neutral-950">
                  <Sliders className="w-8 h-8 mb-2 text-neutral-300 dark:text-neutral-700" />
                  <p className="text-xs font-bold uppercase tracking-wider">No Parameters Entered Yet</p>
                  <p className="text-xs max-w-xs mx-auto mt-1">Provide any valid geometric variables on the left panel to trigger automatic calculations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coordinate geometry tab */}
        {activeTab === 'coordinate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-900 dark:text-white">
                  Coordinate Inputs
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Point A (X1)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      value={coordX1}
                      onChange={(e) => setCoordX1(e.target.value)}
                      className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Point A (Y1)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={coordY1}
                      onChange={(e) => setCoordY1(e.target.value)}
                      className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Point B (X2)</label>
                    <input
                      type="number"
                      placeholder="e.g. 8"
                      value={coordX2}
                      onChange={(e) => setCoordX2(e.target.value)}
                      className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Point B (Y2)</label>
                    <input
                      type="number"
                      placeholder="e.g. 11"
                      value={coordY2}
                      onChange={(e) => setCoordY2(e.target.value)}
                      className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Transformations solver */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-900 dark:text-white">
                  Coordinate Transformations
                </h3>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Perform coordinate reflections, point rotations, scaling, and translation relative to Point A (X1, Y1).
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Point Translation (dx, dy)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="dx e.g. 5" value={transX} onChange={(e) => setTransX(e.target.value)} className="text-xs p-2 border rounded border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                      <input type="number" placeholder="dy e.g. -2" value={transY} onChange={(e) => setTransY(e.target.value)} className="text-xs p-2 border rounded border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                    </div>
                    <button onClick={() => runTransformation('translate')} className="w-full mt-1.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition">Apply Translation</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-neutral-150 dark:border-neutral-850 pt-3">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Rotation (Degrees)</span>
                      <input type="number" placeholder="θ e.g. 90" value={transAngle} onChange={(e) => setTransAngle(e.target.value)} className="w-full text-xs p-2 border rounded border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                      <button onClick={() => runTransformation('rotate')} className="w-full mt-1.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition">Rotate Pt A</button>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Scaling Multiplier</span>
                      <input type="number" placeholder="k e.g. 2" value={transScale} onChange={(e) => setTransScale(e.target.value)} className="w-full text-xs p-2 border rounded border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                      <button onClick={() => runTransformation('scale')} className="w-full mt-1.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition">Scale Pt A</button>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-neutral-150 dark:border-neutral-850 pt-3">
                    <button onClick={() => runTransformation('reflect_x')} className="flex-1 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-bold hover:border-blue-500">Reflect X-Axis</button>
                    <button onClick={() => runTransformation('reflect_y')} className="flex-1 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-bold hover:border-blue-500">Reflect Y-Axis</button>
                  </div>

                  {transResult && (
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-blue-600 dark:text-cyan-400 border border-neutral-200 dark:border-neutral-800">
                      {transResult}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {coordResults ? (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-6">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-400">
                    Two-Point Coordinates Analysis
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Euclidean Distance</span>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                        {coordResults.distance.toFixed(4)} <span className="text-xs font-normal text-neutral-400">units</span>
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Midpoint Coords</span>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                        ({coordResults.midpoint.x.toFixed(2)}, {coordResults.midpoint.y.toFixed(2)})
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Line Slope (m)</span>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                        {coordResults.slope}
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Slope Angle</span>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                        {coordResults.angle.toFixed(2)}°
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Standard Line Equation (y = mx + c)</span>
                      <code className="text-xs block p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {coordResults.lineEquation}
                      </code>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Equation of Circle (AB as Diameter)</span>
                      <code className="text-xs block p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {coordResults.circleEquation}
                      </code>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-400">
                  <Grid className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                  <p className="text-xs font-bold uppercase tracking-wider">Awaiting Coordinates</p>
                  <p className="text-[11px] mt-1">Provide both Point A and Point B dimensions on the left panel to trigger Coordinate analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What-If shape comparison tab */}
        {activeTab === 'whatif' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-900 dark:text-white">
                  Compare Two Shapes
                </h3>

                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Select Shape Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['circle', 'square', 'rectangle', 'sphere'].map((t) => (
                      <button
                        key={t}
                        onClick={() => { setCompareShapeType(t as any); setCompValA1(''); setCompValA2(''); setCompValB1(''); setCompValB2(''); }}
                        className={`py-1.5 rounded text-xs font-bold capitalize transition ${
                          compareShapeType === t
                            ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-neutral-950 shadow-sm'
                            : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input forms for A and B */}
                <div className="space-y-4 pt-3 border-t border-neutral-150 dark:border-neutral-850">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Shape A dimensions</h4>
                  {compareShapeType === 'circle' && renderCompareInput(compValA1, setCompValA1, 'Radius (rA)', 'e.g. 5')}
                  {compareShapeType === 'square' && renderCompareInput(compValA1, setCompValA1, 'Side length (sA)', 'e.g. 8')}
                  {compareShapeType === 'rectangle' && (
                    <div className="grid grid-cols-2 gap-2">
                      {renderCompareInput(compValA1, setCompValA1, 'Length (lA)', 'e.g. 10')}
                      {renderCompareInput(compValA2, setCompValA2, 'Width (wA)', 'e.g. 5')}
                    </div>
                  )}
                  {compareShapeType === 'sphere' && renderCompareInput(compValA1, setCompValA1, 'Radius (rA)', 'e.g. 6')}
                </div>

                <div className="space-y-4 pt-3 border-t border-neutral-150 dark:border-neutral-850">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Shape B dimensions</h4>
                  {compareShapeType === 'circle' && renderCompareInput(compValB1, setCompValB1, 'Radius (rB)', 'e.g. 10')}
                  {compareShapeType === 'square' && renderCompareInput(compValB1, setCompValB1, 'Side length (sB)', 'e.g. 16')}
                  {compareShapeType === 'rectangle' && (
                    <div className="grid grid-cols-2 gap-2">
                      {renderCompareInput(compValB1, setCompValB1, 'Length (lB)', 'e.g. 15')}
                      {renderCompareInput(compValB2, setCompValB2, 'Width (wB)', 'e.g. 10')}
                    </div>
                  )}
                  {compareShapeType === 'sphere' && renderCompareInput(compValB1, setCompValB1, 'Radius (rB)', 'e.g. 12')}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {compareResults ? (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm space-y-6">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-neutral-400">
                    What-If Comparative Dashboard
                  </h3>

                  <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                    <div className="grid grid-cols-4 py-2 text-xs font-bold text-neutral-400">
                      <span>Property</span>
                      <span>Shape A</span>
                      <span>Shape B</span>
                      <span>Difference %</span>
                    </div>

                    {['metric1', 'metric2', 'metric3'].map((key) => {
                      const m = compareResults[key];
                      if (!m) return null;
                      const isPctPositive = m.pct >= 0;
                      return (
                        <div key={key} className="grid grid-cols-4 py-3 text-xs items-center">
                          <span className="font-bold text-neutral-950 dark:text-white capitalize">{m.name}</span>
                          <span className="font-mono text-neutral-600 dark:text-neutral-400">
                            {typeof m.valA === 'number' ? m.valA.toFixed(2) : m.valA}
                          </span>
                          <span className="font-mono text-neutral-600 dark:text-neutral-400">
                            {typeof m.valB === 'number' ? m.valB.toFixed(2) : m.valB}
                          </span>
                          <span className={`font-bold font-mono ${isPctPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {m.pct === 0 ? '-' : `${isPctPositive ? '+' : ''}${m.pct.toFixed(1)}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {compareResults.insights && (
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs font-semibold text-neutral-600 dark:text-neutral-400 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      {compareResults.insights}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-400">
                  <Sliders className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                  <p className="text-xs font-bold uppercase tracking-wider">Awaiting Parameters</p>
                  <p className="text-[11px] mt-1">Supply complete variables for both Shape A and B to generate comparative scale metrics.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Embedded educational content panel */}
      <GeometrySeoContent />
    </div>
  );

  // Helper inside renderer for clean standard label-inputs
  function renderEmptyInput(id: string, label: string, placeholder: string) {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          {label}
        </label>
        <input
          type="number"
          placeholder={placeholder}
          value={inputs[id] || ''}
          onChange={(e) => {
            const val = e.target.value;
            setInputs(prev => ({ ...prev, [id]: val }));
          }}
          className="w-full text-sm font-semibold border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-neutral-400"
        />
      </div>
    );
  }

  // Helper inside comparative panel for inputs
  function renderCompareInput(val: string, setter: (v: string) => void, label: string, placeholder: string) {
    return (
      <div className="space-y-1 flex-1">
        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</label>
        <input
          type="number"
          placeholder={placeholder}
          value={val}
          onChange={(e) => setter(e.target.value)}
          className="w-full text-xs p-2 border rounded border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
        />
      </div>
    );
  }

  // Identify if selected shape is 2D Plane
  function is2DShape(shape: string): boolean {
    return [
      'circle', 'triangle', 'square', 'rectangle', 'ellipse', 
      'parallelogram', 'rhombus', 'trapezoid', 'kite', 'polygon', 'irregular'
    ].includes(shape);
  }

  // Custom live SVG vector renderer based on parameters
  function renderShapeSVG() {
    if (!results) {
      // Draw dummy preview shape
      if (selectedShape === 'circle') return <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500/20" />;
      if (selectedShape === 'square') return <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500/20" />;
      if (selectedShape === 'triangle') return <polygon points="100,30 30,160 170,160" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500/20" />;
      return <polygon points="100,40 160,80 140,150 60,150 40,80" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500/20" />;
    }

    const { drawingData } = results;

    if (selectedShape === 'circle' && drawingData) {
      return (
        <g>
          <circle cx="100" cy="100" r="70" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
          {/* Radius line */}
          <line x1="100" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3" className="text-neutral-500" />
          <circle cx="100" cy="100" r="3" fill="currentColor" className="text-neutral-900 dark:text-white" />
          <text x="135" y="93" className="text-[10px] font-bold fill-neutral-600 dark:fill-neutral-400">r</text>
        </g>
      );
    }

    if (selectedShape === 'square') {
      return (
        <g>
          <rect x="30" y="30" width="140" height="140" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
          <text x="100" y="23" textAnchor="middle" className="text-[9px] font-bold fill-neutral-400">s</text>
          <text x="178" y="105" className="text-[9px] font-bold fill-neutral-400">s</text>
        </g>
      );
    }

    if (selectedShape === 'rectangle' && drawingData) {
      const { l, w } = drawingData;
      // Fit dynamically
      const maxSide = Math.max(l, w) || 1;
      const drawWidth = (l / maxSide) * 140;
      const drawHeight = (w / maxSide) * 140;
      const rx = 100 - drawWidth / 2;
      const ry = 100 - drawHeight / 2;

      return (
        <g>
          <rect x={rx} y={ry} width={drawWidth} height={drawHeight} fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
          <text x="100" y={ry - 6} textAnchor="middle" className="text-[9px] font-bold fill-neutral-400">Length (l)</text>
          <text x={rx + drawWidth + 6} y="103" className="text-[9px] font-bold fill-neutral-400">Width (w)</text>
        </g>
      );
    }

    if (selectedShape === 'ellipse' && drawingData) {
      return (
        <g>
          <ellipse cx="100" cy="100" rx="80" ry="50" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
          <line x1="100" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-neutral-400" />
          <line x1="100" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-neutral-400" />
          <text x="140" y="94" className="text-[8px] font-bold fill-neutral-400">a</text>
          <text x="104" y="75" className="text-[8px] font-bold fill-neutral-400">b</text>
        </g>
      );
    }

    if (selectedShape === 'triangle' && drawingData) {
      const { pA, pB, pC, centroid, incenter, circumcenter, orthocenter } = drawingData.pts;

      return (
        <g>
          <polygon
            points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500"
          />

          {/* Render Triangle Centers dynamically */}
          {showCentroid && (
            <g>
              <circle cx={centroid.x} cy={centroid.y} r="4" fill="#10b981" />
              <text x={centroid.x + 6} y={centroid.y + 4} className="text-[8px] font-bold fill-emerald-500">G (Centroid)</text>
            </g>
          )}

          {showIncenter && (
            <g>
              <circle cx={incenter.x} cy={incenter.y} r="4" fill="#a855f7" />
              <text x={incenter.x + 6} y={incenter.y + 4} className="text-[8px] font-bold fill-purple-500">I (Incenter)</text>
            </g>
          )}

          {showCircumcenter && (
            <g>
              <circle cx={circumcenter.x} cy={circumcenter.y} r="4" fill="#f59e0b" />
              <text x={circumcenter.x + 6} y={circumcenter.y + 4} className="text-[8px] font-bold fill-amber-500">O (Circumcenter)</text>
            </g>
          )}

          {showOrthocenter && (
            <g>
              <circle cx={orthocenter.x} cy={orthocenter.y} r="4" fill="#ec4899" />
              <text x={orthocenter.x + 6} y={orthocenter.y + 4} className="text-[8px] font-bold fill-pink-500">H (Orthocenter)</text>
            </g>
          )}

          {/* Vertices labels */}
          <text x={pA.x - 8} y={pA.y + 4} className="text-[8px] font-extrabold fill-neutral-500">A</text>
          <text x={pB.x + 4} y={pB.y + 4} className="text-[8px] font-extrabold fill-neutral-500">B</text>
          <text x={pC.x} y={pC.y - 6} textAnchor="middle" className="text-[8px] font-extrabold fill-neutral-500">C</text>
        </g>
      );
    }

    if (selectedShape === 'polygon' && drawingData) {
      const { n } = drawingData;
      const pointsArray: string[] = [];
      const cx = 100, cy = 100, r = 70;

      for (let i = 0; i < n; i++) {
        const a = (i * 2 * Math.PI) / n - Math.PI / 2;
        pointsArray.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      }

      return (
        <g>
          <polygon points={pointsArray.join(' ')} fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
          <circle cx={cx} cy={cy} r="2" fill="currentColor" className="text-neutral-600" />
          <line x1={cx} y1={cy} x2={cx + r * Math.cos(0)} y2={cy + r * Math.sin(0)} stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-neutral-400" />
          <text x="135" y="112" className="text-[8px] font-bold fill-neutral-400">R</text>
        </g>
      );
    }

    if (selectedShape === 'irregular' && drawingData) {
      const { pts } = drawingData;
      if (!pts || pts.length === 0) return null;

      // Fit pts within 150x150 box inside 200x200 viewport
      const minX = Math.min(...pts.map((p: any) => p.x));
      const maxX = Math.max(...pts.map((p: any) => p.x));
      const minY = Math.min(...pts.map((p: any) => p.y));
      const maxY = Math.max(...pts.map((p: any) => p.y));

      const w = maxX - minX || 1;
      const h = maxY - minY || 1;
      const scale = 140 / Math.max(w, h);

      const mappedPoints = pts.map((p: any) => {
        return {
          x: 30 + (p.x - minX) * scale,
          y: 170 - (p.y - minY) * scale
        };
      });

      const polyString = mappedPoints.map((p: any) => `${p.x},${p.y}`).join(' ');

      return (
        <g>
          <polygon points={polyString} fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
          {mappedPoints.map((p: any, idx: number) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="3" fill="currentColor" className="text-neutral-900 dark:text-white" />
              <text x={p.x + 5} y={p.y + 3} className="text-[7px] font-extrabold fill-neutral-500">P{idx + 1}</text>
            </g>
          ))}
        </g>
      );
    }

    // Default basic shapes
    return <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500/20" />;
  }
}
