import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  AlertTriangle, 
  Info,
  BadgeAlert,
  ShieldCheck
} from 'lucide-react';
import { EMICalculationResults } from '../../utils/emiMath';

interface EMISmartInsightsProps {
  results: EMICalculationResults;
  currency: string;
  loanAmount: number;
}

export default function EMISmartInsights({ results, currency, loanAmount }: EMISmartInsightsProps) {
  // Generate rule-based dynamic financial suggestions
  const insights = React.useMemo(() => {
    const list: { id: string; type: 'info' | 'warning' | 'success'; title: string; text: string }[] = [];
    if (results.rows.length === 0) return list;

    // 1. Interest exceeds Principal Check
    if (results.totalInterest > loanAmount) {
      list.push({
        id: 'interest-exceeds-principal',
        type: 'warning',
        title: 'Interest Exceeds Original Loan Balance',
        text: `Your total interest payable (${currency}${Math.round(results.totalInterest).toLocaleString()}) exceeds your original loan principal (${currency}${loanAmount.toLocaleString()}). Consider shortening the loan tenure or making small extra monthly payments to dramatically lower this cost.`
      });
    }

    // 2. Early interest ratio check
    const firstQuarterLength = Math.max(1, Math.floor(results.rows.length / 4));
    let firstQuarterInterest = 0;
    let firstQuarterEmi = 0;
    for (let i = 0; i < firstQuarterLength; i++) {
      firstQuarterInterest += results.rows[i].interestPaid;
      firstQuarterEmi += results.rows[i].emi;
    }
    const earlyInterestRatio = firstQuarterEmi > 0 ? (firstQuarterInterest / firstQuarterEmi) * 100 : 0;
    if (earlyInterestRatio > 55) {
      list.push({
        id: 'frontloaded-interest',
        type: 'info',
        title: 'Highly Frontloaded Interest Schedule',
        text: `In the first 25% of your loan timeline, ${earlyInterestRatio.toFixed(1)}% of your payments go directly to interest rather than principal. Any extra payments you make now will directly hit the principal, saving you compounding interest from the start.`
      });
    }

    // 3. Prepayment savings calculation helper
    if (results.hasExtraPayments && results.interestSaved > 0) {
      list.push({
        id: 'prepayment-impact-success',
        type: 'success',
        title: 'Prepayment Plan Activated Successfully!',
        text: `By submitting extra prepayments, you are saving ${currency}${Math.round(results.interestSaved).toLocaleString()} in overall interest and cutting your tenure short by ${results.timeSavedMonths.toFixed(1)} months. Keep going!`
      });
    } else {
      // Suggesting standard small prepayment rule of thumb (e.g. increase payment by 10%)
      const monthlyEmiVal = results.rows[0].emi;
      const extra10Percent = monthlyEmiVal * 0.10;
      
      // We can estimate the time saved:
      // A 10% increase in monthly payment typically reduces standard 20yr loans by 3-4 years and saves thousands.
      list.push({
        id: 'prepayment-suggestion',
        type: 'info',
        title: 'The 10% Accelerator Strategy',
        text: `By adding just ${currency}${Math.round(extra10Percent)} (10% of your EMI) as a recurring extra monthly payment, you could potentially save thousands in interest and pay off your loan years earlier without stretching your monthly budget.`
      });
    }

    // 4. Rate decrease comparison
    const rateDiffSaves = loanAmount * (0.005) * (results.rows.length / 12);
    if (results.effectiveInterestRate > 5 && rateDiffSaves > 1000) {
      list.push({
        id: 'refinance-opportunity',
        type: 'info',
        title: 'Refinancing Sweet Spot',
        text: `If you secure a 0.5% lower annual interest rate, you would save roughly ${currency}${Math.round(rateDiffSaves).toLocaleString()} in total overall cost. Monitor market interest rates closely for refinance opportunities.`
      });
    }

    return list;
  }, [results, currency, loanAmount]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
          Smart Financial Insights
        </h3>
      </div>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        Intelligent, mathematical guidelines tailored to your current amortization model.
      </p>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`p-4 rounded-2xl border flex gap-3 items-start transition ${
              insight.type === 'warning' 
                ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200' 
                : insight.type === 'success'
                ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                : 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-200'
            }`}
          >
            {insight.type === 'warning' && <BadgeAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />}
            {insight.type === 'success' && <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />}
            {insight.type === 'info' && <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />}

            <div>
              <h4 className="text-sm font-bold mb-1">{insight.title}</h4>
              <p className="text-xs font-medium leading-relaxed opacity-90">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
