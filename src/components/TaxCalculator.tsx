import React, { useState, useMemo, useRef } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Info, 
  Layers, 
  RefreshCw, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Download,
  Plus,
  Trash2,
  Copy,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  PiggyBank,
  CheckCircle2,
  Percent,
  FileText,
  ShieldCheck,
  Search,
  ArrowUpDown,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  FAQ_ARTICLES, 
  GLOSSARY_ITEMS, 
  WORKED_EXAMPLES, 
  RELATED_CALCULATORS 
} from '../data/taxCalculatorSeo';

interface TaxBracket {
  id: string;
  minIncome: number | '';
  maxIncome: number | '';
  taxRate: number | '';
}

interface Scenario {
  name: string;
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  taxRate: number;
  credits: number;
  totalTax: number;
  netIncome: number;
  taxSaved: number;
  extraTax: number;
  netDiff: number;
  tag?: string;
}

export default function TaxCalculator() {
  // --- CORE STATE ---
  // Mandatory Inputs (Must start empty)
  const [taxableIncomeInput, setTaxableIncomeInput] = useState<number | ''>(''); // This acts as base taxable income
  const [taxRateInput, setTaxRateInput] = useState<number | ''>(''); // Basic flat rate
  const [currency, setCurrency] = useState<string>('$');

  // Optional Income Inputs
  const [additionalIncome, setAdditionalIncome] = useState<number | ''>('');
  const [businessIncome, setBusinessIncome] = useState<number | ''>('');
  const [investmentIncome, setInvestmentIncome] = useState<number | ''>('');
  const [rentalIncome, setRentalIncome] = useState<number | ''>('');
  const [capitalGains, setCapitalGains] = useState<number | ''>('');
  const [bonuses, setBonuses] = useState<number | ''>('');
  const [commissions, setCommissions] = useState<number | ''>('');
  const [foreignIncome, setForeignIncome] = useState<number | ''>('');
  const [otherIncome, setOtherIncome] = useState<number | ''>('');

  // Optional Deductions Inputs
  const [retirementContributions, setRetirementContributions] = useState<number | ''>('');
  const [insuranceContributions, setInsuranceContributions] = useState<number | ''>('');
  const [standardDeduction, setStandardDeduction] = useState<number | ''>('');
  const [itemizedDeductions, setItemizedDeductions] = useState<number | ''>('');
  const [charitableDonations, setCharitableDonations] = useState<number | ''>('');
  const [medicalExpenses, setMedicalExpenses] = useState<number | ''>('');
  const [educationExpenses, setEducationExpenses] = useState<number | ''>('');
  const [mortgageInterest, setMortgageInterest] = useState<number | ''>('');
  const [businessExpenses, setBusinessExpenses] = useState<number | ''>('');
  const [otherDeductions, setOtherDeductions] = useState<number | ''>('');

  // Optional Credits, Surcharges & Paid Pools
  const [taxCredits, setTaxCredits] = useState<number | ''>('');
  const [surcharge, setSurcharge] = useState<number | ''>('');
  const [taxRebate, setTaxRebate] = useState<number | ''>('');
  const [penalty, setPenalty] = useState<number | ''>('');
  const [taxWithheld, setTaxWithheld] = useState<number | ''>('');
  const [estimatedAdvanceTax, setEstimatedAdvanceTax] = useState<number | ''>('');

  // Custom Multiple Tax Brackets State (Starts empty)
  const [brackets, setBrackets] = useState<TaxBracket[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'summary' | 'scenarios' | 'breakdown' | 'distribution'>('summary');
  const [showIncomes, setShowIncomes] = useState<boolean>(false);
  const [showDeductions, setShowDeductions] = useState<boolean>(false);
  const [showCreditsPool, setShowCreditsPool] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableSortKey, setTableSortKey] = useState<string>('year');
  const [tableSortDesc, setTableSortDesc] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- FRIENDLY VALIDATION ENGINE ---
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (taxableIncomeInput === '') {
      errors.push("Taxable Income (Base Income) is required to perform calculations.");
    } else if (Number(taxableIncomeInput) < 0) {
      errors.push("Base Income cannot be negative.");
    }

    if (brackets.length === 0) {
      if (taxRateInput === '') {
        errors.push("Tax Rate (or active custom brackets) is required.");
      } else {
        const r = Number(taxRateInput);
        if (r < 0 || r > 100) {
          errors.push("Tax Rate must be between 0% and 100%.");
        }
      }
    }

    // Secondary positive bounds checks
    const list = [
      { val: additionalIncome, label: "Additional Income" },
      { val: businessIncome, label: "Business Income" },
      { val: investmentIncome, label: "Investment Income" },
      { val: rentalIncome, label: "Rental Income" },
      { val: capitalGains, label: "Capital Gains" },
      { val: bonuses, label: "Bonuses" },
      { val: commissions, label: "Commissions" },
      { val: foreignIncome, label: "Foreign Income" },
      { val: otherIncome, label: "Other Income" },
      { val: retirementContributions, label: "Retirement Contributions" },
      { val: insuranceContributions, label: "Insurance Contributions" },
      { val: standardDeduction, label: "Standard Deduction" },
      { val: itemizedDeductions, label: "Itemized Deductions" },
      { val: charitableDonations, label: "Charitable Donations" },
      { val: medicalExpenses, label: "Medical Expenses" },
      { val: educationExpenses, label: "Education Expenses" },
      { val: mortgageInterest, label: "Mortgage Interest" },
      { val: businessExpenses, label: "Business Expenses" },
      { val: otherDeductions, label: "Other Deductions" },
      { val: taxCredits, label: "Tax Credits" },
      { val: surcharge, label: "Surcharge" },
      { val: taxRebate, label: "Tax Rebate" },
      { val: penalty, label: "Penalty" },
      { val: taxWithheld, label: "Tax Withheld" },
      { val: estimatedAdvanceTax, label: "Estimated Advance Tax" },
    ];

    list.forEach(item => {
      if (item.val !== '' && Number(item.val) < 0) {
        errors.push(`${item.label} cannot be a negative value.`);
      }
    });

    return errors;
  }, [
    taxableIncomeInput, taxRateInput, brackets, additionalIncome, businessIncome, investmentIncome,
    rentalIncome, capitalGains, bonuses, commissions, foreignIncome, otherIncome,
    retirementContributions, insuranceContributions, standardDeduction, itemizedDeductions,
    charitableDonations, medicalExpenses, educationExpenses, mortgageInterest, businessExpenses,
    otherDeductions, taxCredits, surcharge, taxRebate, penalty, taxWithheld, estimatedAdvanceTax
  ]);

  const isFormValid = validationErrors.length === 0;

  // --- CORE MATHEMATICAL MATHEMATICS ENGINE ---
  const results = useMemo(() => {
    if (!isFormValid) return null;

    // Sum Income
    const baseInc = Number(taxableIncomeInput) || 0;
    const addInc = Number(additionalIncome) || 0;
    const busInc = Number(businessIncome) || 0;
    const invInc = Number(investmentIncome) || 0;
    const rentInc = Number(rentalIncome) || 0;
    const capGains = Number(capitalGains) || 0;
    const bon = Number(bonuses) || 0;
    const comm = Number(commissions) || 0;
    const forInc = Number(foreignIncome) || 0;
    const othInc = Number(otherIncome) || 0;

    const grossIncome = baseInc + addInc + busInc + invInc + rentInc + capGains + bon + comm + forInc + othInc;

    // Sum Deductions
    const retDeduct = Number(retirementContributions) || 0;
    const insDeduct = Number(insuranceContributions) || 0;
    const stdDeduct = Number(standardDeduction) || 0;
    const itemDeduct = Number(itemizedDeductions) || 0;
    const charDeduct = Number(charitableDonations) || 0;
    const medDeduct = Number(medicalExpenses) || 0;
    const eduDeduct = Number(educationExpenses) || 0;
    const mortDeduct = Number(mortgageInterest) || 0;
    const busDeduct = Number(businessExpenses) || 0;
    const othDeduct = Number(otherDeductions) || 0;

    const totalDeductions = retDeduct + insDeduct + stdDeduct + itemDeduct + charDeduct + medDeduct + eduDeduct + mortDeduct + busDeduct + othDeduct;

    // Taxable Income (Gross - Deductions)
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    // ORDINARY TAXABLE INCOME (isolated from Capital Gains if needed, but since we model capital gains tax separately, let's subtract capital gains from progressive pool to avoid double taxing!)
    const ordinaryTaxableIncome = Math.max(0, taxableIncome - capGains);

    // Compute Income Tax
    let incomeTax = 0;
    let marginalRate = Number(taxRateInput) || 0;

    if (brackets.length > 0) {
      // Progressive Bracket Tax
      const sortedBrackets = [...brackets]
        .filter(b => b.minIncome !== '' && b.taxRate !== '')
        .sort((a, b) => Number(a.minIncome) - Number(b.minIncome));

      let activeMarginal = 0;
      sortedBrackets.forEach((b) => {
        const min = Number(b.minIncome) || 0;
        const max = b.maxIncome === '' ? Infinity : Number(b.maxIncome);
        const rate = Number(b.taxRate) || 0;

        if (ordinaryTaxableIncome > min) {
          const portion = Math.min(ordinaryTaxableIncome - min, max - min);
          if (portion > 0) {
            incomeTax += portion * (rate / 100);
            activeMarginal = Math.max(activeMarginal, rate);
          }
        }
      });
      marginalRate = activeMarginal;
    } else {
      // Flat Rate Tax
      incomeTax = ordinaryTaxableIncome * (marginalRate / 100);
    }

    // Capital Gains Tax (Preferential flat rate e.g. 15% or normal rate if brackets are empty)
    const capGainsRate = brackets.length > 0 ? 15 : (Number(taxRateInput) || 15);
    const capitalGainsTax = capGains * (capGainsRate / 100);

    // Additional surcharge & penalties
    const addTaxSurcharge = Number(surcharge) || 0;
    const addPenalties = Number(penalty) || 0;

    const totalBeforeCredits = incomeTax + capitalGainsTax + addTaxSurcharge + addPenalties;

    // Tax Credits and Rebates (dollar for dollar reduction)
    const creditsValue = Number(taxCredits) || 0;
    const rebatesValue = Number(taxRebate) || 0;
    let totalCredits = creditsValue + rebatesValue;

    // Rule: Credits cannot exceed calculated tax
    let creditsExceeded = false;
    if (totalCredits > totalBeforeCredits) {
      creditsExceeded = true;
      totalCredits = totalBeforeCredits;
    }

    // Net calculated tax liability
    const netTax = Math.max(0, totalBeforeCredits - totalCredits);

    // Tax pre-payments / withheld
    const withheld = Number(taxWithheld) || 0;
    const advancePaid = Number(estimatedAdvanceTax) || 0;
    const totalPaidAlready = withheld + advancePaid;

    // Refund vs Balance Due
    let refundEstimate = 0;
    let balanceDue = 0;

    if (totalPaidAlready > netTax) {
      refundEstimate = totalPaidAlready - netTax;
    } else {
      balanceDue = netTax - totalPaidAlready;
    }

    const netIncome = grossIncome - netTax;

    // Effective rates
    const effectiveTaxRate = grossIncome > 0 ? (netTax / grossIncome) * 100 : 0;

    // Table Generation over 5 income projection steps
    const tableRecords = Array.from({ length: 5 }).map((_, idx) => {
      const scaleFactor = 0.8 + idx * 0.15; // 80%, 95%, 110%, 125%, 140%
      const stepGross = Math.round(grossIncome * scaleFactor);
      const stepDeductions = Math.round(totalDeductions * scaleFactor);
      const stepTaxable = Math.max(0, stepGross - stepDeductions);
      const stepOrdinaryTaxable = Math.max(0, stepTaxable - (capGains * scaleFactor));
      
      let stepTax = 0;
      if (brackets.length > 0) {
        const sortedBrackets = [...brackets]
          .filter(b => b.minIncome !== '' && b.taxRate !== '')
          .sort((a, b) => Number(a.minIncome) - Number(b.minIncome));

        sortedBrackets.forEach((b) => {
          const min = Number(b.minIncome) || 0;
          const max = b.maxIncome === '' ? Infinity : Number(b.maxIncome);
          const rate = Number(b.taxRate) || 0;

          if (stepOrdinaryTaxable > min) {
            const portion = Math.min(stepOrdinaryTaxable - min, max - min);
            if (portion > 0) {
              stepTax += portion * (rate / 100);
            }
          }
        });
      } else {
        stepTax = stepOrdinaryTaxable * (marginalRate / 100);
      }

      const stepCapTax = (capGains * scaleFactor) * (capGainsRate / 100);
      const stepTotalBeforeCredits = stepTax + stepCapTax + (addTaxSurcharge * scaleFactor) + addPenalties;
      const stepCredits = Math.min(stepTotalBeforeCredits, totalCredits * scaleFactor);
      const stepNetTax = Math.max(0, stepTotalBeforeCredits - stepCredits);
      const stepNetIncome = stepGross - stepNetTax;

      return {
        year: idx + 1,
        projection: `${Math.round(scaleFactor * 100)}% Projection`,
        grossIncome: stepGross,
        taxableIncome: stepTaxable,
        taxAmount: stepNetTax,
        credits: stepCredits,
        deductions: stepDeductions,
        netIncome: stepNetIncome
      };
    });

    return {
      grossIncome,
      totalDeductions,
      taxableIncome,
      incomeTax,
      capitalGainsTax,
      additionalTax: addTaxSurcharge,
      credits: creditsValue,
      rebates: rebatesValue,
      totalCredits,
      netTax,
      effectiveTaxRate,
      marginalRate,
      refundEstimate,
      balanceDue,
      netIncome,
      creditsExceeded,
      tableRecords
    };
  }, [
    isFormValid, taxableIncomeInput, taxRateInput, brackets, additionalIncome, businessIncome,
    investmentIncome, rentalIncome, capitalGains, bonuses, commissions, foreignIncome, otherIncome,
    retirementContributions, insuranceContributions, standardDeduction, itemizedDeductions,
    charitableDonations, medicalExpenses, educationExpenses, mortgageInterest, businessExpenses,
    otherDeductions, taxCredits, surcharge, taxRebate, penalty, taxWithheld, estimatedAdvanceTax
  ]);

  // --- WHAT-IF COMPREHENSIVE SCENARIO PLANNER ---
  const scenarios: Scenario[] = useMemo(() => {
    if (!isFormValid || !results) return [];

    const baseGross = results.grossIncome;
    const baseDeductions = results.totalDeductions;
    const baseCredits = results.totalCredits;
    const baseRate = results.marginalRate;
    const baseTax = results.netTax;

    const runMathScenario = (gross: number, deducts: number, rate: number, credits: number): number => {
      const taxable = Math.max(0, gross - deducts);
      let tax = taxable * (rate / 100);
      tax = Math.max(0, tax - credits);
      return tax;
    };

    // Scenario 2: +5% Higher Tax rate
    const taxS2 = runMathScenario(baseGross, baseDeductions, baseRate + 5, baseCredits);
    // Scenario 3: +20% Higher Income
    const taxS3 = runMathScenario(baseGross * 1.2, baseDeductions, baseRate, baseCredits);
    // Scenario 4: Maxing Deductions (Add $10,000 to current deductions)
    const taxS4 = runMathScenario(baseGross, baseDeductions + 10000, baseRate, baseCredits);
    // Scenario 5: Add $2,500 extra tax credits
    const taxS5 = runMathScenario(baseGross, baseDeductions, baseRate, baseCredits + 2500);

    const builder = (name: string, gross: number, deducts: number, rate: number, credits: number, finalTax: number, tag: string): Scenario => {
      const taxable = Math.max(0, gross - deducts);
      const saved = Math.max(0, baseTax - finalTax);
      const extra = Math.max(0, finalTax - baseTax);
      const netInc = gross - finalTax;
      const netDiff = netInc - results.netIncome;

      return {
        name,
        grossIncome: gross,
        deductions: deducts,
        taxableIncome: taxable,
        taxRate: rate,
        credits,
        totalTax: finalTax,
        netIncome: netInc,
        taxSaved: saved,
        extraTax: extra,
        netDiff,
        tag
      };
    };

    return [
      builder("Current Plan", baseGross, baseDeductions, baseRate, baseCredits, baseTax, "Base Line"),
      builder("Tax Rate Spike (+5% Rate)", baseGross, baseDeductions, baseRate + 5, baseCredits, taxS2, "Tax Penalty Shock"),
      builder("Higher Earnings (+20% gross)", baseGross * 1.2, baseDeductions, baseRate, baseCredits, taxS3, "Wealth Boost"),
      builder("Aggressive Deductions (+$10k)", baseGross, baseDeductions + 10000, baseRate, baseCredits, taxS4, "Optimal Protection"),
      builder("Credits Injection (+$2.5k)", baseGross, baseDeductions, baseRate, baseCredits + 2500, taxS5, "Direct Relief")
    ];
  }, [isFormValid, results]);

  // --- RULE-BASED SMART INSIGHTS ---
  const smartInsights = useMemo(() => {
    if (!results) return [];
    const insights: { title: string; desc: string; type: 'info' | 'success' | 'warn' }[] = [];

    const deductionsPct = results.grossIncome > 0 ? (results.totalDeductions / results.grossIncome) * 100 : 0;
    const effective = results.effectiveTaxRate;
    const nominal = results.marginalRate;

    // Insight 1: Deductions efficacy
    if (deductionsPct > 0) {
      insights.push({
        title: `Taxshield Active: Deductions reduce gross income by ${deductionsPct.toFixed(1)}%`,
        desc: `By declaring ${currency}${results.totalDeductions.toLocaleString()} in standard and itemized deductions, you successfully sheltered part of your wealth from immediate tax collection.`,
        type: 'success'
      });
    } else {
      insights.push({
        title: "Maximize Deductions to Shield Income 🛡️",
        desc: "You are currently claiming $0 in standard or itemized deductions. Subtracting charity gifts, retirement savings, or mortgage costs directly shrinks your taxable income.",
        type: 'info'
      });
    }

    // Insight 2: Effective vs Nominal Rate drag
    if (effective < nominal && effective > 0) {
      insights.push({
        title: `Smart Allocation: Effective rate is ${(nominal - effective).toFixed(1)}% lower than nominal!`,
        desc: `Thanks to active deductions and direct credits, your real taxation drag is only ${effective.toFixed(1)}% instead of the base ${nominal}% rate.`,
        type: 'success'
      });
    }

    // Insight 3: Credit bounds check
    if (results.creditsExceeded) {
      insights.push({
        title: "Credit Over-allocation Capped ⚠️",
        desc: "Your combined tax credits and rebates exceeded your calculated raw tax liability. Since credits cannot push regular final tax below zero, they have been capped at the liability threshold.",
        type: 'warn'
      });
    }

    // Insight 4: Balance Due Alert
    if (results.balanceDue > 0) {
      insights.push({
        title: `Unpaid Balance Due: ${currency}${Math.round(results.balanceDue).toLocaleString()}`,
        desc: "Your pre-withholdings and advanced payments do not cover your net tax liability. Consider increasing withholdings on paycheck schedules to avoid end-of-year penalties.",
        type: 'warn'
      });
    } else if (results.refundEstimate > 0) {
      insights.push({
        title: `Estimated Refund Claim: ${currency}${Math.round(results.refundEstimate).toLocaleString()} 🎉`,
        desc: "Excellent! Your withheld tax payments exceed your real net tax obligations. You are on track to secure a tax refund upon filing.",
        type: 'success'
      });
    }

    return insights;
  }, [results, currency]);

  // --- ACTIONS ---
  const handleLoadDemo = () => {
    setCurrency('$');
    setTaxableIncomeInput(85000);
    setTaxRateInput(22);
    setAdditionalIncome(15000);
    setBusinessIncome(8000);
    setInvestmentIncome(4500);
    setRentalIncome(3000);
    setCapitalGains(12000);
    setBonuses(6000);
    setCommissions(2500);
    setForeignIncome('');
    setOtherIncome('');

    setRetirementContributions(6500);
    setInsuranceContributions(2400);
    setStandardDeduction(14600);
    setItemizedDeductions(3500);
    setCharitableDonations(1500);
    setMedicalExpenses(1200);
    setEducationExpenses(2000);
    setMortgageInterest(4000);
    setBusinessExpenses(1800);
    setOtherDeductions('');

    setTaxCredits(2500);
    setSurcharge(500);
    setTaxRebate(400);
    setPenalty('');
    setTaxWithheld(18500);
    setEstimatedAdvanceTax(2000);

    setBrackets([
      { id: "1", minIncome: 0, maxIncome: 25000, taxRate: 10 },
      { id: "2", minIncome: 25000, maxIncome: 75000, taxRate: 15 },
      { id: "3", minIncome: 75000, maxIncome: 150000, taxRate: 22 },
      { id: "4", minIncome: 150000, maxIncome: '', taxRate: 32 }
    ]);

    setShowIncomes(true);
    setShowDeductions(true);
    setShowCreditsPool(true);
  };

  const handleClearAll = () => {
    setTaxableIncomeInput('');
    setTaxRateInput('');
    setAdditionalIncome('');
    setBusinessIncome('');
    setInvestmentIncome('');
    setRentalIncome('');
    setCapitalGains('');
    setBonuses('');
    setCommissions('');
    setForeignIncome('');
    setOtherIncome('');

    setRetirementContributions('');
    setInsuranceContributions('');
    setStandardDeduction('');
    setItemizedDeductions('');
    setCharitableDonations('');
    setMedicalExpenses('');
    setEducationExpenses('');
    setMortgageInterest('');
    setBusinessExpenses('');
    setOtherDeductions('');

    setTaxCredits('');
    setSurcharge('');
    setTaxRebate('');
    setPenalty('');
    setTaxWithheld('');
    setEstimatedAdvanceTax('');

    setBrackets([]);
    setShowIncomes(false);
    setShowDeductions(false);
    setShowCreditsPool(false);
  };

  // --- INTERACTIVE BRACKETS BUILDER OPERATIONS ---
  const addBracketRow = () => {
    setBrackets(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        minIncome: '',
        maxIncome: '',
        taxRate: ''
      }
    ]);
  };

  const deleteBracketRow = (id: string) => {
    setBrackets(prev => prev.filter(b => b.id !== id));
  };

  const duplicateBracketRow = (id: string) => {
    const src = brackets.find(b => b.id === id);
    if (!src) return;
    setBrackets(prev => [
      ...prev,
      {
        ...src,
        id: Date.now().toString() + "-dup"
      }
    ]);
  };

  const updateBracketRow = (id: string, key: keyof TaxBracket, value: any) => {
    setBrackets(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, [key]: value };
      }
      return b;
    }));
  };

  // --- SEARCHABLE AND SORTABLE PROJECTIONS TABLE ---
  const filteredProjectionsTable = useMemo(() => {
    if (!results) return [];
    let records = [...results.tableRecords];

    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      records = records.filter(r => 
        r.projection.toLowerCase().includes(q) ||
        r.grossIncome.toString().includes(q) ||
        r.taxableIncome.toString().includes(q) ||
        r.taxAmount.toString().includes(q) ||
        r.netIncome.toString().includes(q)
      );
    }

    records.sort((a: any, b: any) => {
      const valA = a[tableSortKey];
      const valB = b[tableSortKey];
      if (valA === undefined) return 0;
      if (typeof valA === 'string') {
        return tableSortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return tableSortDesc ? valB - valA : valA - valB;
    });

    return records;
  }, [results, tableSearch, tableSortKey, tableSortDesc]);

  const handleCsvExport = () => {
    if (!results) return;
    let csv = "data:text/csv;charset=utf-8,";
    csv += "Projection Tier,Gross Income,Deductions Claimed,Taxable Base,Estimated Net Tax,Net Post-Tax Income\n";
    results.tableRecords.forEach(r => {
      csv += `"${r.projection}",${r.grossIncome},${r.deductions},${r.taxableIncome},${r.taxAmount},${r.netIncome}\n`;
    });
    const uri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", "Calculatoora_Global_Tax_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printDocument = () => {
    window.print();
  };

  // --- PREPARE DATA FOR RECHARTS VISUALS ---
  const mainPieData = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Net Income Retention', value: Math.round(results.netIncome), color: '#3b82f6' },
      { name: 'Total Tax Drag', value: Math.round(results.netTax), color: '#f43f5e' },
      { name: 'Sheltered Deductions', value: Math.round(results.totalDeductions), color: '#10b981' }
    ];
  }, [results]);

  const scenarioChartData = useMemo(() => {
    return scenarios.map(s => ({
      name: s.name,
      'Net Income': Math.round(s.netIncome),
      'Tax Amount': Math.round(s.totalTax)
    }));
  }, [scenarios]);

  const distributionBarData = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Retirement', value: Number(retirementContributions) || 0 },
      { name: 'Insurance', value: Number(insuranceContributions) || 0 },
      { name: 'Std Deduction', value: Number(standardDeduction) || 0 },
      { name: 'Medical', value: Number(medicalExpenses) || 0 },
      { name: 'Charity', value: Number(charitableDonations) || 0 },
      { name: 'Mortgage', value: Number(mortgageInterest) || 0 },
      { name: 'Business Exp', value: Number(businessExpenses) || 0 }
    ].filter(d => d.value > 0);
  }, [results, retirementContributions, insuranceContributions, standardDeduction, medicalExpenses, charitableDonations, mortgageInterest, businessExpenses]);

  return (
    <div className="space-y-10" id="tax-calculator-core">
      
      {/* Dynamic JSON-LD Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Tax Calculator",
          "description": "The world's most advanced client-side country-agnostic global tax calculator.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5 and JavaScript support."
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Calculatoora", "item": "https://calculatoora.com/" },
            { "@type": "ListItem", "position": 2, "name": "Finance", "item": "https://calculatoora.com/#/finance" },
            { "@type": "ListItem", "position": 3, "name": "Tax Calculator", "item": "https://calculatoora.com/#/finance/tax-calculator" }
          ]
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_ARTICLES.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
          }))
        })}
      </script>

      {/* Hero Title Block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-200/40 dark:border-neutral-800/40 pb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-none flex items-center gap-3">
            Tax Calculator <Sparkles className="w-6 h-6 text-blue-500 dark:text-cyan-400 animate-pulse" />
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mt-2.5 max-w-2xl leading-relaxed">
            The world's most customizable client-side tax planner. Input custom brackets, deduct liabilities, simulate progressive tiers, and run what-if scenarios with full privacy.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleLoadDemo}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-cyan-400 dark:bg-cyan-500/5 dark:hover:bg-cyan-500/10 dark:border-cyan-400/15 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-97"
            id="tax-btn-demo"
          >
            <Sparkles className="w-4 h-4" /> Load Realistic Case
          </button>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-97"
            id="tax-btn-clear"
          >
            <RefreshCw className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Inputs Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[32px] border border-white/90 dark:border-neutral-800/90 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-2xl p-6 sm:p-8 transition-all">
            
            <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/60 pb-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4" /> Core Required Parameters
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                Realtime calculations
              </span>
            </div>

            {/* Core Required Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100" htmlFor="taxableIncomeInput">
                    Base Income Subject to Tax <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold border-0 rounded px-1.5 py-0.5"
                    aria-label="Select Currency Icon"
                  >
                    <option value="$">$ USD</option>
                    <option value="₹">₹ INR</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                    <option value="¥">¥ JPY</option>
                  </select>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">{currency}</span>
                  <input
                    id="taxableIncomeInput"
                    type="number"
                    min={0}
                    placeholder="e.g. 75000"
                    value={taxableIncomeInput}
                    onChange={(e) => setTaxableIncomeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all duration-300"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100" htmlFor="taxRateInput">
                  Assessed Flat Tax Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">%</span>
                  <input
                    id="taxRateInput"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 18"
                    value={taxRateInput}
                    onChange={(e) => setTaxRateInput(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={brackets.length > 0}
                    className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all duration-300 ${brackets.length > 0 ? 'border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-100 dark:bg-neutral-900 opacity-50 cursor-not-allowed' : 'border-neutral-200 dark:border-neutral-800'}`}
                    aria-required="true"
                  />
                </div>
                {brackets.length > 0 && (
                  <span className="text-[10px] text-blue-500 dark:text-cyan-400 font-bold block mt-1">
                    * Interactive progressive brackets overrides the simple flat rate!
                  </span>
                )}
              </div>
            </div>

            {/* Optional Income Accordion Drawer */}
            <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setShowIncomes(!showIncomes)}
                className="w-full flex justify-between items-center py-2 text-neutral-800 dark:text-neutral-100 font-bold hover:text-blue-500 dark:hover:text-cyan-400 transition"
                aria-expanded={showIncomes}
              >
                <span className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> Additional Global Income Streams
                </span>
                {showIncomes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showIncomes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-2">
                      {[
                        { label: "Additional Income", state: additionalIncome, set: setAdditionalIncome, place: "e.g. 5000" },
                        { label: "Business Net Earnings", state: businessIncome, set: setBusinessIncome, place: "e.g. 12000" },
                        { label: "Dividend/Investment Yield", state: investmentIncome, set: setInvestmentIncome, place: "e.g. 1500" },
                        { label: "Rental Real Estate Income", state: rentalIncome, set: setRentalIncome, place: "e.g. 6000" },
                        { label: "Capital Gains", state: capitalGains, set: setCapitalGains, place: "e.g. 8000" },
                        { label: "Bonuses", state: bonuses, set: setBonuses, place: "e.g. 3000" },
                        { label: "Commissions", state: commissions, set: setCommissions, place: "e.g. 1500" },
                        { label: "Foreign Income", state: foreignIncome, set: setForeignIncome, place: "e.g. 4500" },
                        { label: "Other Income", state: otherIncome, set: setOtherIncome, place: "e.g. 1000" },
                      ].map((field, idx) => (
                        <div className="space-y-1" key={idx}>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">{field.label}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">{currency}</span>
                            <input
                              type="number"
                              min={0}
                              placeholder={field.place}
                              value={field.state}
                              onChange={(e) => field.set(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Optional Deductions Accordion Drawer */}
            <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setShowDeductions(!showDeductions)}
                className="w-full flex justify-between items-center py-2 text-neutral-800 dark:text-neutral-100 font-bold hover:text-blue-500 dark:hover:text-cyan-400 transition"
                aria-expanded={showDeductions}
              >
                <span className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Deductions, Exemptions & Write-offs
                </span>
                {showDeductions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showDeductions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-2">
                      {[
                        { label: "Standard Deduction", state: standardDeduction, set: setStandardDeduction, place: "e.g. 14600" },
                        { label: "Itemized Deductions", state: itemizedDeductions, set: setItemizedDeductions, place: "e.g. 4500" },
                        { label: "Retirement Contributions", state: retirementContributions, set: setRetirementContributions, place: "e.g. 6500" },
                        { label: "Health Insurance Premium", state: insuranceContributions, set: setInsuranceContributions, place: "e.g. 2400" },
                        { label: "Charitable Donations", state: charitableDonations, set: setCharitableDonations, place: "e.g. 1000" },
                        { label: "Medical Write-offs", state: medicalExpenses, set: setMedicalExpenses, place: "e.g. 2000" },
                        { label: "Education Expenses", state: educationExpenses, set: setEducationExpenses, place: "e.g. 1500" },
                        { label: "Mortgage Interest Cost", state: mortgageInterest, set: setMortgageInterest, place: "e.g. 5000" },
                        { label: "Unreimbursed Business Costs", state: businessExpenses, set: setBusinessExpenses, place: "e.g. 2500" },
                        { label: "Other Deductions", state: otherDeductions, set: setOtherDeductions, place: "e.g. 800" },
                      ].map((field, idx) => (
                        <div className="space-y-1" key={idx}>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">{field.label}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">{currency}</span>
                            <input
                              type="number"
                              min={0}
                              placeholder={field.place}
                              value={field.state}
                              onChange={(e) => field.set(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Surcharges, Credits & Pre-payments Accordion Drawer */}
            <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-4">
              <button
                onClick={() => setShowCreditsPool(!showCreditsPool)}
                className="w-full flex justify-between items-center py-2 text-neutral-800 dark:text-neutral-100 font-bold hover:text-blue-500 dark:hover:text-cyan-400 transition"
                aria-expanded={showCreditsPool}
              >
                <span className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4 text-purple-500" /> Surcharges, Credits & Already Paid
                </span>
                {showCreditsPool ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showCreditsPool && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-2">
                      {[
                        { label: "Tax Credits", state: taxCredits, set: setTaxCredits, place: "e.g. 2000" },
                        { label: "Tax Surcharges / Extra Levy", state: surcharge, set: setSurcharge, place: "e.g. 500" },
                        { label: "Tax Rebates", state: taxRebate, set: setTaxRebate, place: "e.g. 350" },
                        { label: "Fines & Penalties Accrued", state: penalty, set: setPenalty, place: "e.g. 150" },
                        { label: "Tax Withheld on Paychecks", state: taxWithheld, set: setTaxWithheld, place: "e.g. 12000" },
                        { label: "Advance Tax Already Paid", state: estimatedAdvanceTax, set: setEstimatedAdvanceTax, place: "e.g. 3000" },
                      ].map((field, idx) => (
                        <div className="space-y-1" key={idx}>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">{field.label}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">{currency}</span>
                            <input
                              type="number"
                              min={0}
                              placeholder={field.place}
                              value={field.state}
                              onChange={(e) => field.set(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-semibold focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Multiple Tax Brackets Builder */}
            <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-6 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-400" /> Multiple Progressive Tax Brackets (Unlimited)
                </span>
                <button
                  onClick={addBracketRow}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/15 dark:text-cyan-400 rounded-lg text-xs font-bold transition shadow-sm"
                  id="tax-btn-add-bracket"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bracket Tier
                </button>
              </div>

              {brackets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 p-6 text-center">
                  <p className="text-xs text-neutral-400 font-medium">
                    No progressive tiers added. Computing tax using simple flat rate entered above. Add bracket rows to model progressive policies.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {brackets.map((b, idx) => (
                    <div 
                      key={b.id} 
                      className="grid grid-cols-12 gap-2 items-center bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200/55 dark:border-neutral-800/60"
                    >
                      <div className="col-span-1 text-[11px] font-bold text-neutral-400 text-center">
                        #{idx + 1}
                      </div>
                      
                      {/* Min Income */}
                      <div className="col-span-3 space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Min ({currency})</span>
                        <input
                          type="number"
                          placeholder="e.g. 0"
                          value={b.minIncome}
                          onChange={(e) => updateBracketRow(b.id, 'minIncome', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full text-xs font-semibold px-2 py-1.5 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Max Income */}
                      <div className="col-span-3 space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Max ({currency})</span>
                        <input
                          type="number"
                          placeholder="Infinity"
                          value={b.maxIncome}
                          onChange={(e) => updateBracketRow(b.id, 'maxIncome', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full text-xs font-semibold px-2 py-1.5 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Rate Percentage */}
                      <div className="col-span-3 space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Rate (%)</span>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={b.taxRate}
                          onChange={(e) => updateBracketRow(b.id, 'taxRate', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full text-xs font-semibold px-2 py-1.5 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-center gap-1.5 pt-4">
                        <button
                          onClick={() => duplicateBracketRow(b.id)}
                          className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition"
                          title="Duplicate Bracket Row"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBracketRow(b.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition"
                          title="Delete Bracket Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Hand: Realtime Dashboard Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Validation Alert Box */}
          {!isFormValid && (
            <div className="rounded-[24px] border border-red-200 dark:border-red-900/30 bg-red-50/70 dark:bg-red-950/20 p-6 flex gap-3.5 shadow-md">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-red-950 dark:text-red-200 leading-none">Please complete the required fields.</h4>
                <ul className="text-xs text-red-700 dark:text-red-300 mt-2.5 space-y-1.5 list-disc pl-4 font-medium">
                  {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Results Summary Cards */}
          {isFormValid && results && (
            <div className="space-y-6">
              
              {/* Primary Key Metric Block */}
              <div className="rounded-[32px] overflow-hidden relative border border-blue-500/10 dark:border-cyan-400/10 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-neutral-900 dark:to-neutral-950 p-8 shadow-xl text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-6 translate-x-6" />
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest font-mono text-blue-100/80 uppercase font-black">Computed Final Burden</span>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-1">
                      {currency}{Math.round(results.netTax).toLocaleString()}
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono tracking-wider font-bold">
                    Effective: {results.effectiveTaxRate.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 mt-6 text-sm">
                  <div>
                    <span className="text-white/60 text-xs">Total Gross Income</span>
                    <p className="font-bold text-lg mt-0.5">{currency}{Math.round(results.grossIncome).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs">Post-Tax Retention</span>
                    <p className="font-bold text-lg mt-0.5">{currency}{Math.round(results.netIncome).toLocaleString()}</p>
                  </div>
                </div>

                {/* Refund vs Due Status bar */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  {results.refundEstimate > 0 ? (
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-400/20">
                      <CheckCircle2 className="w-4 h-4" /> Refund Estimate: {currency}{Math.round(results.refundEstimate).toLocaleString()}
                    </div>
                  ) : results.balanceDue > 0 ? (
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-400/20">
                      <AlertCircle className="w-4 h-4 animate-bounce" /> Balance Due: {currency}{Math.round(results.balanceDue).toLocaleString()}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs bg-white/5 px-3 py-2 rounded-xl">
                      <Check className="w-4 h-4" /> Tax is perfectly balanced
                    </div>
                  )}
                </div>
              </div>

              {/* KPI Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-neutral-400 font-mono block">TAXABLE INCOME</span>
                  <p className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">
                    {currency}{Math.round(results.taxableIncome).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-neutral-400 font-mono block">MARGINAL RATE</span>
                  <p className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">
                    {results.marginalRate}%
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-neutral-400 font-mono block">TOTAL DEDUCTIONS</span>
                  <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                    {currency}{Math.round(results.totalDeductions).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-neutral-400 font-mono block">TOTAL CREDITS</span>
                  <p className="text-xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                    {currency}{Math.round(results.totalCredits).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Rule-based Smart Insights Container */}
              <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950 p-5 rounded-3xl border border-neutral-200/55 dark:border-neutral-800/60">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-black block">Smart Tax Planner Insights</span>
                {smartInsights.length === 0 ? (
                  <p className="text-xs text-neutral-400">Insights will generate once tax metrics are registered.</p>
                ) : (
                  <div className="space-y-3 mt-2">
                    {smartInsights.map((ins, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed flex gap-2.5 items-start ${
                          ins.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                          ins.type === 'warn' ? 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300' :
                          'bg-blue-500/5 border-blue-500/20 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">{ins.title}</strong>
                          {ins.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Visualizations Panel */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-md space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <span className="text-xs font-bold text-neutral-800 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-neutral-400" /> Interactive Tax Charts
                  </span>
                  <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-[10px] font-black">
                    {[
                      { id: 'summary', label: 'Summary' },
                      { id: 'scenarios', label: 'Scenarios' },
                      { id: 'breakdown', label: 'Breakdown' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-2.5 py-1 rounded-md transition ${activeTab === tab.id ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Charts */}
                <div className="h-64 flex items-center justify-center">
                  {activeTab === 'summary' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mainPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mainPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => [`${currency}${val.toLocaleString()}`, '']} />
                        <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}

                  {activeTab === 'scenarios' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scenarioChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#888888" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#888888" />
                        <Tooltip formatter={(val) => `${currency}${val.toLocaleString()}`} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="Net Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Tax Amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {activeTab === 'breakdown' && (
                    <div className="w-full space-y-3 pt-2 text-xs">
                      {[
                        { label: 'Ordinary Income Tax', value: results.incomeTax, color: 'bg-blue-500' },
                        { label: 'Capital Gains Tax', value: results.capitalGainsTax, color: 'bg-orange-500' },
                        { label: 'Additional Levy / Surcharges', value: results.additionalTax, color: 'bg-rose-500' },
                        { label: 'Applied Credits & Rebates', value: results.totalCredits, color: 'bg-emerald-500', isSub: true }
                      ].map((item, idx) => {
                        const maxVal = Math.max(results.incomeTax + results.capitalGainsTax + results.additionalTax, 1);
                        const pct = Math.min(100, (item.value / maxVal) * 100);
                        return (
                          <div className="space-y-1" key={idx}>
                            <div className="flex justify-between items-center font-semibold">
                              <span className="text-neutral-500 dark:text-neutral-400">{item.label}</span>
                              <span className="text-neutral-800 dark:text-white">{currency}{Math.round(item.value).toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                              <div className={`${item.color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Print and Export Buttons inside visualization panel */}
                <div className="flex gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button 
                    onClick={printDocument}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                  >
                    <Printer className="w-4 h-4" /> Print Dashboard
                  </button>
                  <button 
                    onClick={handleCsvExport}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Export projections to CSV
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* WHAT-IF SCENARIOS GRID SECTION */}
      {isFormValid && results && (
        <div className="rounded-[32px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              What-If Financial Scenarios Comparison
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Compare your current active tax configuration with simulated spikes in tax rates, higher gross earnings, maxing out write-offs, or injecting credit subsidies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {scenarios.map((sc, idx) => {
              const isBase = sc.name === "Current Plan";
              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border transition-all ${isBase ? 'bg-blue-500/5 border-blue-500/30' : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200/50 dark:border-neutral-800/60'}`}
                >
                  <span className="text-[9px] uppercase tracking-wider font-mono font-black text-blue-500 dark:text-cyan-400 block mb-1">
                    {sc.tag || "Alternative"}
                  </span>
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white truncate">{sc.name}</h4>
                  
                  <div className="space-y-2 mt-4 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>
                      <strong className="text-neutral-900 dark:text-white">{currency}{Math.round(sc.grossIncome).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deducts:</span>
                      <strong className="text-neutral-900 dark:text-white">{currency}{Math.round(sc.deductions).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Tax:</span>
                      <strong className="text-neutral-900 dark:text-white">{currency}{Math.round(sc.totalTax).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200/50 dark:border-neutral-800/50 pt-2 font-bold text-neutral-900 dark:text-white">
                      <span>Net Cash:</span>
                      <span>{currency}{Math.round(sc.netIncome).toLocaleString()}</span>
                    </div>
                  </div>

                  {!isBase && (
                    <div className="mt-3.5 pt-2.5 border-t border-neutral-200/50 dark:border-neutral-800/50 text-[10px] font-bold">
                      {sc.taxSaved > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Saves {currency}{Math.round(sc.taxSaved).toLocaleString()} in taxes!
                        </span>
                      )}
                      {sc.extraTax > 0 && (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          + {currency}{Math.round(sc.extraTax).toLocaleString()} extra tax burden
                        </span>
                      )}
                      <div className="text-[9px] text-neutral-400 mt-1">
                        Difference in net pay: <span className={sc.netDiff >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                          {sc.netDiff >= 0 ? '+' : ''}{currency}{Math.round(sc.netDiff).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {isBase && (
                    <div className="mt-3.5 pt-2.5 border-t border-blue-500/10 text-[10px] text-blue-500 dark:text-cyan-400 font-bold text-center uppercase tracking-widest">
                      Active Scenario
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DYNAMIC TAX PROJECTIONS SCHEDULE TABLE */}
      {isFormValid && results && (
        <div className="rounded-[32px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-md">
          <div className="p-6 sm:p-8 border-b border-neutral-200/50 dark:border-neutral-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                Tax Projections & Growth Table
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                A fully searchable, sortable list showing the tax liability outcomes at varying income projections relative to your base declaration.
              </p>
            </div>
            
            {/* Search and Sort controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projections table..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none w-full sm:w-56 font-semibold"
                />
              </div>
              <button
                onClick={() => {
                  setTableSortDesc(!tableSortDesc);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-500 hover:text-neutral-800 transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5" /> Toggle Order
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-400 font-mono text-[10px] uppercase border-b border-neutral-200/50 dark:border-neutral-800/50">
                  <th className="p-4 font-bold">Projection Tier</th>
                  <th className="p-4 font-bold">Gross Income</th>
                  <th className="p-4 font-bold">Deductions</th>
                  <th className="p-4 font-bold">Taxable Base</th>
                  <th className="p-4 font-bold">Estimated Net Tax</th>
                  <th className="p-4 font-bold">Net Retention Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/40">
                {filteredProjectionsTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 font-semibold text-neutral-700 dark:text-neutral-300">
                    <td className="p-4 text-blue-600 dark:text-cyan-400 font-bold">{row.projection}</td>
                    <td className="p-4 text-neutral-900 dark:text-white">{currency}{row.grossIncome.toLocaleString()}</td>
                    <td className="p-4 text-emerald-500">{currency}{row.deductions.toLocaleString()}</td>
                    <td className="p-4">{currency}{row.taxableIncome.toLocaleString()}</td>
                    <td className="p-4 text-rose-500">{currency}{row.taxAmount.toLocaleString()}</td>
                    <td className="p-4 text-neutral-900 dark:text-white font-bold">{currency}{row.netIncome.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE EDUCATIONAL MARKETING SEO SECTION */}
      <div className="rounded-[32px] border border-neutral-200/60 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-950/20 p-6 sm:p-10 space-y-10">
        
        {/* Intro */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
            Comprehensive Tax Planning Guide & Information Hub
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-4xl">
            Sovereign nations and state tax collection frameworks require citizens and business corporations to declare annual earnings to balance public infrastructure projects. Read below to study progressive tax schedules, marginal write-offs, credits, planning tips, and structured worked examples.
          </p>
        </div>

        {/* Education grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          
          <div className="space-y-4">
            <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-500" /> What Is Tax & Taxable Income?
            </h3>
            <p>
              A <strong>tax</strong> is a statutory financial charge levied on individuals, corporations, and properties by government administrative structures. While gross annual revenues aggregate all earnings across salaries, business margins, rental projects, and trading portfolios, <strong>Taxable Income</strong> represents the adjusted base that actually incurs taxation. Subtracting eligible allowances like standard deductions, charitable donations, and pension savings shelters capital and minimizes total base calculations.
            </p>
            <p>
              By minimizing your taxable income base, you automatically lower the threshold at which your highest tax brackets trigger, guaranteeing significant annual tax shield preservation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-indigo-500" /> Marginal vs Effective Tax Rates
            </h3>
            <p>
              Modern tax structures are often categorized as either <strong>progressive tax systems</strong> or <strong>flat tax systems</strong>. A progressive curve divides taxable income into sequential steps (brackets). As income climbs higher, each segment incurs a progressively larger tax rate percentage.
            </p>
            <p>
              The <strong>Marginal Tax Rate</strong> denotes the specific percentage tier levied on your final, highest dollar of earnings. Conversely, the <strong>Effective Tax Rate</strong> indicates the aggregate share of your total gross wealth paid in tax. Because lower income portions are taxed in cheaper brackets, effective tax rates are almost always lower than marginal rates.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Deductions vs direct Tax Credits
            </h3>
            <p>
              Optimizing individual filings requires utilizing both <strong>tax deductions</strong> and <strong>tax credits</strong>. A deduction operates by shrinking your total taxable base before brackets are calculated. For example, registering a $1,000 deduction saves you $250 if your highest bracket rate triggers at 25%.
            </p>
            <p>
              Conversely, a <strong>tax credit</strong> provides a direct, dollar-for-dollar reduction of your final computed tax liability. Claiming a $1,000 credit saves you exactly $1,000, irrespective of your tax bracket. Therefore, tax credits are highly prized as powerful mechanisms for tax relief.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-orange-500" /> Capital Gains & Long-term holding
            </h3>
            <p>
              Selling investment assets like equities, bonds, or real estate generates <strong>capital gains</strong>. Tax systems worldwide incentivize long-term capitalization by taxing gains realized on holdings kept for over a year at preferential, lower rates (such as 15% or 20% instead of standard progressive ordinary rates). Maintaining standard portfolio holding times ensures you retain more investment growth compounding over multi-decade lifespans.
            </p>
          </div>

        </div>

        {/* Worked Examples */}
        <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-8 space-y-4">
          <h3 className="text-lg font-black text-neutral-950 dark:text-white">
            Tax Calculation Worked Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORKED_EXAMPLES.map((ex, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm">
                <span className="text-[9px] uppercase font-mono text-blue-500 font-black block mb-1">Worked Case Study {idx + 1}</span>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-2">{ex.title}</h4>
                <p className="text-neutral-500 dark:text-neutral-400 mb-3">{ex.scenario}</p>
                <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg font-mono text-[11px] whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                  {ex.calculation}
                </div>
                <div className="mt-3 font-bold text-blue-600 dark:text-cyan-400">
                  {ex.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-8 space-y-4">
          <h3 className="text-lg font-black text-neutral-950 dark:text-white">
            Tax Planning Terminology Glossary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {GLOSSARY_ITEMS.map((g, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/50 dark:border-neutral-800/60">
                <strong className="text-neutral-900 dark:text-white block font-bold mb-1">{g.term}</strong>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{g.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-8 space-y-4">
          <h3 className="text-lg font-black text-neutral-950 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-2 max-w-4xl">
            {FAQ_ARTICLES.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-neutral-200/65 dark:border-neutral-800/70 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-4 text-left text-neutral-900 dark:text-white font-bold text-xs sm:text-sm bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-neutral-50 dark:bg-neutral-950"
                      >
                        <div className="p-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Calculators */}
        <div className="border-t border-neutral-200/50 dark:border-neutral-800/60 pt-8 space-y-4">
          <h3 className="text-lg font-black text-neutral-950 dark:text-white">
            Related Calculators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {RELATED_CALCULATORS.map((tc, idx) => (
              <a
                key={idx}
                href={`#/${tc.category}/${tc.slug}`}
                className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:shadow-md rounded-xl text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 transition block"
              >
                {tc.name}
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
