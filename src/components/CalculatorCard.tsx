import React, { useState, useEffect } from 'react';
import { 
  Play, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Info, 
  Layers, 
  RefreshCw, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Calculator } from '../types';
import VisualChart from './VisualChart';
import SponsorSpace from './SponsorSpace';
import UltimateLoanCalculator from './UltimateLoanCalculator';
import UltimateInvestmentCalculator from './UltimateInvestmentCalculator';
import CarLoanCalculator from './CarLoanCalculator';
import PaycheckCalculator from './PaycheckCalculator';
import CumulativeInterestCalculator from './CumulativeInterestCalculator';
import MortgageCalculator from './MortgageCalculator';
import PayrollCalculator from './PayrollCalculator';
import GraphingCalculator from './GraphingCalculator';
import GpaCalculator from './GpaCalculator';
import SipCalculator from './SipCalculator';
import TaxCalculator from './TaxCalculator';
import SavingsCalculator from './SavingsCalculator';
import AlgebraCalculator from './AlgebraCalculator';
import GeometryCalculator from './GeometryCalculator';
import RetirementCalculator from './RetirementCalculator';
import AgeCalculator from './AgeCalculator';
import CalorieCalculator from './CalorieCalculator';
import PregnancyCalculator from './PregnancyCalculator';
import ScientificCalculator from './ScientificCalculator';
import EMICalculator from './EMICalculator';
import OvulationCalculator from './OvulationCalculator';
import BMICalculator from './BMICalculator';
import ProbabilityCalculator from './ProbabilityCalculator';
import StatisticsCalculator from './StatisticsCalculator';
import CalculusCalculator from './CalculusCalculator';
import GasMileageCalculator from './GasMileageCalculator';
import ConcreteCalculator from './concrete-calculator/ConcreteCalculator';
import ConstructionCalculator from './construction-calculator/ConstructionCalculator';
import LoveCalculator from './love-calculator/LoveCalculator';
import CarPaymentCalculator from './car-payment-calculator/CarPaymentCalculator';
import SubnetMaskCalculator from './SubnetMaskCalculator';

interface CalculatorCardProps {
  calculator: Calculator;
  onNavigate: (page: string) => void;
}

export default function CalculatorCard({ calculator, onNavigate }: CalculatorCardProps) {
  // Store raw inputs state
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[] | undefined>(undefined);
  const [isCalculated, setIsCalculated] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Keypad simulation state for interactive basic/scientific screens
  const [keypadExpr, setKeypadExpr] = useState('');
  const [keypadAns, setKeypadAns] = useState('');

  // Re-initialize state when calculator changes
  useEffect(() => {
    const defaultVals: Record<string, any> = {};
    calculator.inputs.forEach((inp) => {
      defaultVals[inp.id] = inp.defaultValue;
    });
    setInputs(defaultVals);
    setIsCalculated(false);
    setOpenFaq(null);
    setKeypadExpr('');
    setKeypadAns('');

    // Pre-calculate initially so results appear instantly
    const initialCalc = calculator.calculate(defaultVals);
    setResults(initialCalc.results);
    setChartData(initialCalc.chartData);
  }, [calculator]);

  const handleInputChange = (id: string, value: any) => {
    const updated = { ...inputs, [id]: value };
    setInputs(updated);
    
    // Auto-calculate in real-time
    const calcOut = calculator.calculate(updated);
    setResults(calcOut.results);
    setChartData(calcOut.chartData);
  };

  const executeCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const calcOut = calculator.calculate(inputs);
    setResults(calcOut.results);
    setChartData(calcOut.chartData);
    setIsCalculated(true);
  };

  // Keyboard actions for basic/scientific keypad
  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setKeypadExpr('');
      setKeypadAns('');
    } else if (val === 'DEL') {
      setKeypadExpr(prev => prev.slice(0, -1));
    } else if (val === '=') {
      try {
        // Sanitize string to prevent security breaches, replace math terms with standard ones
        let sanitized = keypadExpr
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/\^/g, '**');

        const solution = Function(`"use strict"; return (${sanitized})`)();
        if (typeof solution === 'number') {
          setKeypadAns(solution.toFixed(6).replace(/\.?0+$/, ''));
        } else {
          setKeypadAns('Error');
        }
      } catch (err) {
        setKeypadAns('Synthesis Error');
      }
    } else {
      setKeypadExpr(prev => prev + val);
    }
  };

  // Inject dynamic JSON-LD structured schema for rich Google results
  useEffect(() => {
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': calculator.name,
      'description': calculator.description,
      'applicationCategory': 'EducationalApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires JavaScript',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    };

    // FAQ schema injection
    const faqSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': calculator.faq.map((item) => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    };

    // Breadcrumb schema injection
    const breadcrumbSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Calculatoora Hub',
          'item': `${window.location.origin}/#/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': calculator.category,
          'item': `${window.location.origin}/#/${calculator.category}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': calculator.name,
          'item': `${window.location.origin}/#/${calculator.category}/${calculator.slug}`
        }
      ]
    };

    const scriptId = 'calculatoora-jsonld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify([schemaData, faqSchemaData, breadcrumbSchemaData]);

    // Update dynamic SEO page Title and Meta Description
    const previousTitle = document.title;
    document.title = calculator.seoTitle || `${calculator.name} | Calculatoora`;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    let createdDesc = false;
    let previousDesc = metaDesc ? metaDesc.content : '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta') as HTMLMetaElement;
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
      createdDesc = true;
    }
    metaDesc.content = calculator.seoDescription || calculator.description;

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();

      // Restore previous title & meta value
      document.title = previousTitle;
      if (createdDesc) {
        metaDesc.remove();
      } else if (metaDesc) {
        metaDesc.content = previousDesc;
      }
    };
  }, [calculator]);

  // Determine if a calculator truly depends on geography to show country label
  const getGeoLocation = () => {
    const slug = calculator.slug.toLowerCase();
    const name = calculator.name.toLowerCase();
    
    const isRegionalCategory = 
      slug.includes('tax') || 
      name.includes('tax') || 
      slug.includes('gst') || 
      name.includes('gst') || 
      slug.includes('vat') || 
      name.includes('vat');
      
    if (!isRegionalCategory) return null;

    if (slug.includes('-us') || name.includes('us ') || name.includes('united states')) return 'United States';
    if (slug.includes('-uk') || name.includes('uk ') || name.includes('united kingdom')) return 'United Kingdom';
    if (slug.includes('-in') || name.includes('india') || name.includes('indian')) return 'India';
    if (slug.includes('-ca') || name.includes('canada') || name.includes('canadian')) return 'Canada';
    if (slug.includes('-au') || name.includes('australia') || name.includes('australian')) return 'Australia';
    if (slug.includes('-eu') || name.includes('europe') || name.includes('european')) return 'Europe';
    return null;
  };

  const geoLocation = getGeoLocation();

  if (calculator.slug === 'scientific-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <ScientificCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'emi-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <EMICalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'pregnancy-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <PregnancyCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'bmi-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <BMICalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'ovulation-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <OvulationCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'probability-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <ProbabilityCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'calculus-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <CalculusCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'gas-mileage-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <GasMileageCalculator />
      </div>
    );
  }

  if (calculator.slug === 'concrete-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <ConcreteCalculator />
      </div>
    );
  }

  if (calculator.slug === 'construction-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <ConstructionCalculator />
      </div>
    );
  }

  if (calculator.slug === 'love-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <LoveCalculator />
      </div>
    );
  }

  if (calculator.slug === 'car-payment-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <CarPaymentCalculator />
      </div>
    );
  }

  if (calculator.slug === 'subnet-mask-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SubnetMaskCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'statistics-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <StatisticsCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'bmi-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <BMICalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'calorie-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <CalorieCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'age-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <AgeCalculator onNavigate={onNavigate} />
      </div>
    );
  }

  if (calculator.slug === 'ultimate-loan-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <UltimateLoanCalculator />
      </div>
    );
  }

  if (calculator.slug === 'car-loan-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <CarLoanCalculator />
      </div>
    );
  }

  if (calculator.slug === 'ultimate-investment-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <UltimateInvestmentCalculator />
      </div>
    );
  }

  if (calculator.slug === 'retirement-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <RetirementCalculator />
      </div>
    );
  }

  if (calculator.slug === 'paycheck-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <PaycheckCalculator />
      </div>
    );
  }

  if (calculator.slug === 'payroll-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <PayrollCalculator />
      </div>
    );
  }

  if (calculator.slug === 'graphing-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <GraphingCalculator />
      </div>
    );
  }

  if (calculator.slug === 'gpa-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <GpaCalculator />
      </div>
    );
  }

  if (calculator.slug === 'sip-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <SipCalculator />
      </div>
    );
  }

  if (calculator.slug === 'tax-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <TaxCalculator />
      </div>
    );
  }

  if (calculator.slug === 'savings-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <SavingsCalculator />
      </div>
    );
  }

  if (calculator.slug === 'algebra-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <AlgebraCalculator />
      </div>
    );
  }

  if (calculator.slug === 'geometry-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <GeometryCalculator />
      </div>
    );
  }

  if (calculator.slug === 'cumulative-interest-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <CumulativeInterestCalculator />
      </div>
    );
  }

  if (calculator.slug === 'mortgage-calculator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
          <a 
            href="#/" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
          >
            Calculatoora
          </a>
          <span>/</span>
          <a 
            href={`#/${calculator.category}`}
            onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
            className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
          >
            {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
          </a>
          <span>/</span>
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
        </nav>
        <MortgageCalculator />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category link breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest select-none">
        <a 
          href="#/" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          className="hover:text-blue-500 dark:hover:text-cyan-400 transition"
        >
          Calculatoora
        </a>
        <span>/</span>
        <a 
          href={`#/${calculator.category}`}
          onClick={(e) => { e.preventDefault(); onNavigate(`category:${calculator.category}`); }}
          className="hover:text-blue-500 dark:hover:text-cyan-400 transition text-neutral-500 dark:text-neutral-400"
        >
          {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1).replace(/-/g, ' ')}
        </a>
        <span>/</span>
        <span className="text-blue-600 dark:text-cyan-400 font-bold">{calculator.name}</span>
      </nav>

      {/* Title block */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-none">
            {calculator.name}
          </h1>
          {geoLocation && (
            <span className="inline-flex self-start sm:self-center px-3 py-1.5 text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/5 dark:bg-cyan-400/10 rounded-full border border-blue-500/10 dark:border-cyan-400/15 uppercase tracking-widest font-mono">
              📍 {geoLocation}
            </span>
          )}
        </div>
        <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mt-3 max-w-3xl leading-relaxed">
          {calculator.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: The Interactive Glassmorphic Calculator Block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[32px] border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl overflow-hidden p-6 sm:p-8 transition-all">
            
            <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/60 pb-4 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Calculator Inputs
              </span>
              <button 
                onClick={() => {
                  const defaults: Record<string, any> = {};
                  calculator.inputs.forEach(i => defaults[i.id] = i.defaultValue);
                  setInputs(defaults);
                  const res = calculator.calculate(defaults);
                  setResults(res.results);
                  setChartData(res.chartData);
                  setIsCalculated(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> reset values
              </button>
            </div>
 
            {/* Render dynamically evaluated fields */}
            <form onSubmit={executeCalculation} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {calculator.inputs.map((inp) => (
                  <div 
                    key={inp.id} 
                    className={`space-y-2 ${inp.type === 'text' || inp.id === 'dataset' ? 'sm:col-span-2' : ''}`}
                  >
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      {inp.label} {inp.unit && <span className="text-xs text-neutral-400">({inp.unit})</span>}
                    </label>
 
                    {inp.type === 'select' ? (
                      <select
                        value={inputs[inp.id] ?? inp.defaultValue}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border border-white/60 dark:border-neutral-800 bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.12)] transition-all duration-300 shadow-sm backdrop-blur-md"
                      >
                        {inp.options?.map((opt) => (
                          <option key={opt.value} value={opt.value} className="dark:bg-neutral-950">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : inp.type === 'date' ? (
                      <input
                        type="date"
                        value={inputs[inp.id] ?? inp.defaultValue}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border border-white/60 dark:border-neutral-800 bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.12)] transition-all duration-300 shadow-sm backdrop-blur-md"
                      />
                    ) : inp.type === 'text' ? (
                      <input
                        type="text"
                        value={inputs[inp.id] ?? inp.defaultValue}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        placeholder="Comma separated numbers..."
                        className="w-full px-4 py-3.5 rounded-2xl border border-white/60 dark:border-neutral-800 bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.12)] transition-all duration-300 shadow-sm backdrop-blur-md font-mono"
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          min={inp.min}
                          max={inp.max}
                          step={inp.step || 'any'}
                          value={inputs[inp.id] ?? inp.defaultValue}
                          onChange={(e) => handleInputChange(inp.id, e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl border border-white/60 dark:border-neutral-800 bg-white/55 dark:bg-neutral-900/40 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 focus:shadow-[0_0_25px_rgba(0,240,255,0.12)] transition-all duration-300 shadow-sm backdrop-blur-md"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action trigger button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:opacity-95 hover:shadow-[0_4px_25px_rgba(0,240,255,0.25)] transition-all shadow-[0_4px_20px_rgba(0,140,255,0.2)] active:scale-99 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Calculate Now
              </button>
            </form>

            {/* Special scientific / basic interactive keypad layer */}
            {(calculator.slug === 'basic-calculator' || calculator.slug === 'scientific-calculator') && (
              <div className="mt-8 pt-8 border-t border-neutral-200/50 dark:border-neutral-800">
                <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 font-mono">
                  ⌨️ Interactive Physical Hardware Keypad
                </span>
                <div className="p-4 rounded-2xl bg-neutral-900 text-left border border-neutral-800">
                  <div className="h-10 text-neutral-500 font-mono text-xs overflow-x-auto text-right whitespace-nowrap">
                    {keypadExpr || '0'}
                  </div>
                  <div className="h-12 text-white font-mono text-2xl font-black text-right truncate">
                    {keypadAns || '0'}
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4 font-mono">
                  {/* Digital Key buttons board */}
                  {['C', 'DEL', '(', ')'].map(k => (
                    <button key={k} onClick={() => handleKeypadPress(k)} className="p-3 bg-neutral-800 hover:bg-neutral-700 text-blue-400 dark:text-cyan-400 font-bold rounded-lg transition active:scale-95">{k}</button>
                  ))}
                  {calculator.slug === 'scientific-calculator' && ['sin(', 'cos(', 'tan(', 'sqrt(', 'log(', 'ln('].map(k => (
                    <button key={k} onClick={() => handleKeypadPress(k)} className="p-3 bg-neutral-800 hover:bg-neutral-700 text-teal-400 text-xs rounded-lg transition active:scale-95">{k}</button>
                  ))}
                  {['7', '8', '9', '/'].map(k => (
                    <button key={k} onClick={() => handleKeypadPress(k)} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg transition active:scale-95">{k}</button>
                  ))}
                  {calculator.slug === 'scientific-calculator' && (
                    <React.Fragment key="scientific-extra-keypad-keys">
                      <button onClick={() => handleKeypadPress('^')} className="p-3 bg-neutral-800 text-teal-400 rounded-lg transition active:scale-95">^</button>
                      <button onClick={() => handleKeypadPress('π')} className="p-3 bg-neutral-800 text-teal-400 rounded-lg transition active:scale-95">π</button>
                    </React.Fragment>
                  )}
                  {['4', '5', '6', '*'].map(k => (
                    <button key={k} onClick={() => handleKeypadPress(k)} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg transition active:scale-95">{k}</button>
                  ))}
                  {['1', '2', '3', '-'].map(k => (
                    <button key={k} onClick={() => handleKeypadPress(k)} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg transition active:scale-95">{k}</button>
                  ))}
                  {['0', '.', '=', '+'].map(k => (
                    <button key={k} onClick={() => handleKeypadPress(k)} className={`p-3 rounded-lg transition active:scale-95 ${k === '=' ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-extrabold col-span-2' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100'}`}>{k}</button>
                  ))}
                </div>
              </div>
            )}

          </div>

          <SponsorSpace position="in-between" />
        </div>

        {/* Right Side: Primary dynamic results view and detailed calculation graph */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Results Presentation Block */}
          <div className="rounded-[32px] border border-white/10 dark:border-neutral-850 bg-neutral-950/90 text-white shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
            {/* Dark abstract lights */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 font-mono mb-4">
              ✨ Calculated Results
            </h3>

            {results && results.length > 0 ? (
              <div className="space-y-6">
                {results.map((res, idx) => (
                  <div 
                    key={idx} 
                    className={`pb-4 ${idx !== results.length - 1 ? 'border-b border-neutral-800/60' : ''}`}
                  >
                    <span className="block text-xs font-bold text-neutral-400 capitalize mb-1 font-sans">
                      {res.label}
                    </span>
                    <div className="flex items-baseline gap-1">
                      {res.isPrimary ? (
                        <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 tracking-tight leading-none">
                          {res.value}
                        </span>
                      ) : (
                        <span className="text-2xl font-bold text-neutral-100 tracking-tight">
                          {res.value}
                        </span>
                      )}
                      {res.unit && (
                        <span className="text-xs font-bold font-mono text-cyan-400 ml-1">
                          {res.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500">
                Awaiting input... Complete the fields on the left to see results.
              </div>
            )}
            
            <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-900 pt-4">
              <span>Verified Accuracy</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Computed Instantly
              </span>
            </div>
          </div>

          {/* Dynamic SVG Visual Charts */}
          {chartData && (
            <VisualChart data={chartData} title={`${calculator.name} Metric Chart`} />
          )}

          {/* Desktop Sidebar Sponsor Area */}
          <SponsorSpace position="sidebar" />

        </div>

      </div>

      {/* Calculator informational guides & documentation structured grid */}
      <div className="mt-16 pt-12 border-t border-neutral-200/50 dark:border-neutral-800/60 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* H2 details, Worked examples, and Formulas */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Detailed explanation markup */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
              Understanding the {calculator.name} Formulas
            </h2>
            <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/20 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              <p>{calculator.explanation}</p>
            </div>
          </section>

          {/* Formula specific segment */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500 dark:text-cyan-400" /> Mathematical Model
            </h3>
            <pre className="p-5 rounded-2xl bg-neutral-900 text-cyan-400 font-mono text-xs overflow-x-auto border border-neutral-800 whitespace-pre-wrap leading-relaxed">
              <code>{calculator.formula}</code>
            </pre>
          </section>

          {/* Concrete Worked Example */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500 dark:text-cyan-400" /> Concrete Worked-Out Example
            </h3>
            <div className="p-6 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-sm italic leading-relaxed text-neutral-500 dark:text-neutral-400">
              <p>{calculator.example}</p>
            </div>
          </section>

          {/* FAQ Accordion Block */}
          {calculator.faq && calculator.faq.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
                Frequently Asked Questions (FAQ)
              </h2>
              <div className="space-y-3">
                {calculator.faq.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 overflow-hidden bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                      >
                        <span>{item.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-blue-500 dark:text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-900/60">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>

        {/* Sidebar Related Calculators list */}
        {calculator.relatedSlugs && calculator.relatedSlugs.length > 0 && (
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/20 backdrop-blur-md">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 font-mono">
                🔗 Related Calculators
              </h4>
              <div className="space-y-3">
                {calculator.relatedSlugs.map((slug) => (
                  <button
                    key={slug}
                    onClick={() => onNavigate(`calculator:${slug}`)}
                    className="w-full p-4 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-neutral-900 bg-white dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between group transition-all text-left"
                  >
                    <div>
                      <span className="font-bold text-sm block text-neutral-800 dark:text-neutral-200 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors capitalize">
                        {slug.replace(/-/g, ' ')}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                        Calculator
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transform group-hover:translate-x-1 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
