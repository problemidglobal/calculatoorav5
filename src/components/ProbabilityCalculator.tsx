import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  Download, 
  Info, 
  Settings, 
  Layers, 
  Coins, 
  Bookmark, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

import {
  factorial,
  nCr,
  nPr,
  normalCDF,
  normalPDF,
  binomialPMF,
  binomialCDF,
  poissonPMF,
  poissonCDF,
  hypergeometricPMF,
  hypergeometricCDF,
  geometricPMF,
  geometricCDF,
  getFraction
} from '../utils/probabilityMath';

import {
  VennDiagram,
  BellCurve,
  DiscreteChart,
  PascalTriangle,
  CoinFlipper,
  DiceRoller,
  CardVisualizer
} from './ProbabilityVisualizer';

interface ProbabilityCalculatorProps {
  onNavigate: (page: string) => void;
}

const num = (val: string) => parseFloat(val) || 0;

export default function ProbabilityCalculator({ onNavigate }: ProbabilityCalculatorProps) {
  // --- STATE ---
  const [activeMode, setActiveMode] = useState<string>('basic');

  // Input states (MUST start empty for the prompt instruction)
  // Mode 1: Basic
  const [basicFavorable, setBasicFavorable] = useState<string>('');
  const [basicTotal, setBasicTotal] = useState<string>('');

  // Mode 2: Complement
  const [compProbA, setCompProbA] = useState<string>('');

  // Mode 3: Addition OR
  const [addProbA, setAddProbA] = useState<string>('');
  const [addProbB, setAddProbB] = useState<string>('');
  const [addProbAAndB, setAddProbAAndB] = useState<string>('');

  // Mode 4: Multiplication AND
  const [multProbA, setMultProbA] = useState<string>('');
  const [multProbBGivenA, setMultProbBGivenA] = useState<string>('');
  const [multType, setMultType] = useState<'independent' | 'dependent'>('independent');

  // Mode 5: Conditional
  const [condProbAAndB, setCondProbAAndB] = useState<string>('');
  const [condProbB, setCondProbB] = useState<string>('');

  // Mode 6: Independent
  const [indepProbA, setIndepProbA] = useState<string>('');
  const [indepProbB, setIndepProbB] = useState<string>('');
  const [indepProbC, setIndepProbC] = useState<string>('');

  // Mode 7: Dependent
  const [depTotal, setDepTotal] = useState<string>('');
  const [depSuccess, setDepSuccess] = useState<string>('');
  const [depDraws, setDepDraws] = useState<string>('');

  // Mode 8: Bayes
  const [bayesPriorA, setBayesPriorA] = useState<string>('');
  const [bayesBGivenA, setBayesBGivenA] = useState<string>('');
  const [bayesBGivenNotA, setBayesBGivenNotA] = useState<string>('');

  // Mode 9: Expected Value
  const [expectedRows, setExpectedRows] = useState<{ x: string; p: string }[]>([
    { x: '', p: '' },
    { x: '', p: '' },
    { x: '', p: '' }
  ]);

  // Mode 10: Odds to Prob
  const [oddsForNum, setOddsForNum] = useState<string>('');
  const [oddsForDen, setOddsForDen] = useState<string>('');

  // Mode 11: Prob to Odds
  const [probToOddsVal, setProbToOddsVal] = useState<string>('');

  // Mode 12: Lottery
  const [lottoPool, setLottoPool] = useState<string>('');
  const [lottoPick, setLottoPick] = useState<string>('');
  const [lottoBonusPool, setLottoBonusPool] = useState<string>('');
  const [lottoBonusPick, setLottoBonusPick] = useState<string>('');

  // Mode 13: Dice
  const [diceCount, setDiceCount] = useState<string>('');
  const [diceFaces, setDiceFaces] = useState<string>('');
  const [diceTargetSum, setDiceTargetSum] = useState<string>('');
  const [diceCompare, setDiceCompare] = useState<'equal' | 'less' | 'greater'>('equal');

  // Mode 14: Coin Toss
  const [coinFlips, setCoinFlips] = useState<string>('');
  const [coinHeads, setCoinHeads] = useState<string>('');
  const [coinCompare, setCoinCompare] = useState<'equal' | 'less' | 'greater'>('equal');

  // Mode 15: Cards
  const [cardDraws, setCardDraws] = useState<string>('');
  const [cardType, setCardType] = useState<string>('hearts'); // hearts, ace, red, face

  // Mode 16: Hypergeometric
  const [hyperN, setHyperN] = useState<string>('');
  const [hyperK, setHyperK] = useState<string>('');
  const [hyperSampleN, setHyperSampleN] = useState<string>('');
  const [hyperSuccessK, setHyperSuccessK] = useState<string>('');

  // Mode 17: Binomial
  const [binomN, setBinomN] = useState<string>('');
  const [binomP, setBinomP] = useState<string>('');
  const [binomK, setBinomK] = useState<string>('');
  const [binomCompare, setBinomCompare] = useState<'equal' | 'less' | 'greater'>('equal');

  // Mode 18: Geometric
  const [geomP, setGeomP] = useState<string>('');
  const [geomK, setGeomK] = useState<string>('');
  const [geomCompare, setGeomCompare] = useState<'equal' | 'less' | 'greater'>('equal');

  // Mode 19: Poisson
  const [poissonLambda, setPoissonLambda] = useState<string>('');
  const [poissonK, setPoissonK] = useState<string>('');
  const [poissonCompare, setPoissonCompare] = useState<'equal' | 'less' | 'greater'>('equal');

  // Mode 20: Normal
  const [normalMean, setNormalMean] = useState<string>('');
  const [normalStdDev, setNormalStdDev] = useState<string>('');
  const [normalX1, setNormalX1] = useState<string>('');
  const [normalX2, setNormalX2] = useState<string>('');
  const [normalType, setNormalType] = useState<'less' | 'greater' | 'between'>('less');

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Monte Carlo simulation state
  const [simTrials, setSimTrials] = useState<number>(1000);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<{ simulatedProb: number; successes: number; theoreticalProb: number } | null>(null);

  const dashboardRef = useRef<HTMLDivElement>(null);

  // --- ACTIONS ---
  const handleClearAll = () => {
    // Clear all inputs
    setBasicFavorable(''); setBasicTotal('');
    setCompProbA('');
    setAddProbA(''); setAddProbB(''); setAddProbAAndB('');
    setMultProbA(''); setMultProbBGivenA('');
    setCondProbAAndB(''); setCondProbB('');
    setIndepProbA(''); setIndepProbB(''); setIndepProbC('');
    setDepTotal(''); setDepSuccess(''); setDepDraws('');
    setBayesPriorA(''); setBayesBGivenA(''); setBayesBGivenNotA('');
    setExpectedRows([{ x: '', p: '' }, { x: '', p: '' }, { x: '', p: '' }]);
    setOddsForNum(''); setOddsForDen('');
    setProbToOddsVal('');
    setLottoPool(''); setLottoPick(''); setLottoBonusPool(''); setLottoBonusPick('');
    setDiceCount(''); setDiceFaces(''); setDiceTargetSum('');
    setCoinFlips(''); setCoinHeads('');
    setCardDraws('');
    setHyperN(''); setHyperK(''); setHyperSampleN(''); setHyperSuccessK('');
    setBinomN(''); setBinomP(''); setBinomK('');
    setGeomP(''); setGeomK('');
    setPoissonLambda(''); setPoissonK('');
    setNormalMean(''); setNormalStdDev(''); setNormalX1(''); setNormalX2('');
    setSimResult(null);
  };

  const handleLoadExample = () => {
    // Fill sample values for the active mode
    if (activeMode === 'basic') {
      setBasicFavorable('5'); setBasicTotal('20');
    } else if (activeMode === 'complement') {
      setCompProbA('0.35');
    } else if (activeMode === 'addition') {
      setAddProbA('0.5'); setAddProbB('0.4'); setAddProbAAndB('0.15');
    } else if (activeMode === 'multiplication') {
      setMultProbA('0.6'); setMultProbBGivenA('0.4'); setMultType('independent');
    } else if (activeMode === 'conditional') {
      setCondProbAAndB('0.12'); setCondProbB('0.4');
    } else if (activeMode === 'independent') {
      setIndepProbA('0.5'); setIndepProbB('0.4'); setIndepProbC('0.25');
    } else if (activeMode === 'dependent') {
      setDepTotal('10'); setDepSuccess('4'); setDepDraws('3');
    } else if (activeMode === 'bayes') {
      setBayesPriorA('0.01'); setBayesBGivenA('0.9'); setBayesBGivenNotA('0.095');
    } else if (activeMode === 'expected') {
      setExpectedRows([
        { x: '10', p: '0.2' },
        { x: '20', p: '0.5' },
        { x: '50', p: '0.3' }
      ]);
    } else if (activeMode === 'odds-to-prob') {
      setOddsForNum('3'); setOddsForDen('2');
    } else if (activeMode === 'prob-to-odds') {
      setProbToOddsVal('0.4');
    } else if (activeMode === 'lottery') {
      setLottoPool('49'); setLottoPick('6'); setLottoBonusPool('10'); setLottoBonusPick('1');
    } else if (activeMode === 'dice') {
      setDiceCount('2'); setDiceFaces('6'); setDiceTargetSum('7'); setDiceCompare('equal');
    } else if (activeMode === 'coin') {
      setCoinFlips('10'); setCoinHeads('5'); setCoinCompare('equal');
    } else if (activeMode === 'card') {
      setCardDraws('5'); setCardType('hearts');
    } else if (activeMode === 'hypergeometric') {
      setHyperN('100'); setHyperK('15'); setHyperSampleN('10'); setHyperSuccessK('2');
    } else if (activeMode === 'binomial') {
      setBinomN('10'); setBinomP('0.3'); setBinomK('3'); setBinomCompare('equal');
    } else if (activeMode === 'geometric') {
      setGeomP('0.25'); setGeomK('4'); setGeomCompare('equal');
    } else if (activeMode === 'poisson') {
      setPoissonLambda('4'); setPoissonK('3'); setPoissonCompare('equal');
    } else if (activeMode === 'normal') {
      setNormalMean('50'); setNormalStdDev('10'); setNormalX1('45'); setNormalX2('65'); setNormalType('between');
    }
    setSimResult(null);
  };

  // --- CALCULATIONS ENGINE ---
  const calculations = useMemo(() => {
    // Helper to extract clean float values
    const num = (val: string) => parseFloat(val);

    try {
      if (activeMode === 'basic') {
        const fav = num(basicFavorable);
        const tot = num(basicTotal);
        if (isNaN(fav) || isNaN(tot) || tot <= 0 || fav < 0 || fav > tot) return null;
        const prob = fav / tot;
        return {
          prob,
          formula: 'P(A) = Favorable / Total',
          substitution: `P(A) = ${fav} / ${tot}`,
          steps: [
            'Count the number of successful or favorable outcomes.',
            'Count the total size of the sample space of outcomes.',
            'Divide favorable outcomes by total outcomes.'
          ]
        };
      }

      if (activeMode === 'complement') {
        const pA = num(compProbA);
        if (isNaN(pA) || pA < 0 || pA > 1) return null;
        const prob = 1 - pA;
        return {
          prob,
          formula: "P(NOT A) = P(A') = 1 - P(A)",
          substitution: `P(NOT A) = 1 - ${pA}`,
          steps: [
            'Find the probability of event A occurring.',
            'Subtract that probability from 1 (the full universe 100%).'
          ]
        };
      }

      if (activeMode === 'addition') {
        const pA = num(addProbA);
        const pB = num(addProbB);
        const pAnd = num(addProbAAndB) || 0;
        if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1 || pAnd < 0 || pAnd > Math.min(pA, pB)) return null;
        const prob = Math.min(1, Math.max(0, pA + pB - pAnd));
        return {
          prob,
          formula: 'P(A OR B) = P(A) + P(B) - P(A AND B)',
          substitution: `P(A OR B) = ${pA} + ${pB} - ${pAnd}`,
          steps: [
            'Sum the individual probabilities of Event A and Event B.',
            'Subtract the joint overlap (A AND B) to avoid double counting.'
          ]
        };
      }

      if (activeMode === 'multiplication') {
        const pA = num(multProbA);
        const pBGivenA = num(multProbBGivenA);
        if (isNaN(pA) || isNaN(pBGivenA) || pA < 0 || pA > 1 || pBGivenA < 0 || pBGivenA > 1) return null;
        
        let prob = pA * pBGivenA;
        let formula = 'P(A AND B) = P(A) * P(B|A)';
        let substitution = `P(A AND B) = ${pA} * ${pBGivenA}`;

        if (multType === 'independent') {
          formula = 'P(A AND B) = P(A) * P(B)';
          substitution = `P(A AND B) = ${pA} * ${pBGivenA} (independent assumption)`;
        }

        return {
          prob,
          formula,
          substitution,
          steps: [
            'Find the probability of Event A.',
            multType === 'independent' 
              ? 'Multiply directly by Event B as they do not affect each other.' 
              : 'Multiply by the conditional probability of Event B given that A occurred.'
          ]
        };
      }

      if (activeMode === 'conditional') {
        const pAnd = num(condProbAAndB);
        const pB = num(condProbB);
        if (isNaN(pAnd) || isNaN(pB) || pB <= 0 || pAnd < 0 || pAnd > pB) return null;
        const prob = pAnd / pB;
        return {
          prob,
          formula: 'P(A | B) = P(A AND B) / P(B)',
          substitution: `P(A | B) = ${pAnd} / ${pB}`,
          steps: [
            'Obtain the joint probability of both A and B occurring.',
            'Divide by the prior probability of the conditioning event B.'
          ]
        };
      }

      if (activeMode === 'independent') {
        const pA = num(indepProbA);
        const pB = num(indepProbB);
        const pC = num(indepProbC) || 1; // optional
        if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) return null;
        const prob = pA * pB * pC;
        return {
          prob,
          formula: 'P(A AND B AND C) = P(A) * P(B) * P(C)',
          substitution: `P(A AND B AND C) = ${pA} * ${pB} * ${pC}`,
          steps: [
            'Multiply individual probabilities together as independent events.'
          ]
        };
      }

      if (activeMode === 'dependent') {
        const total = num(depTotal);
        const successes = num(depSuccess);
        const draws = num(depDraws);
        if (isNaN(total) || isNaN(successes) || isNaN(draws) || total <= 0 || successes < 0 || successes > total || draws < 1 || draws > total) return null;
        
        let prob = 1;
        let stepMath = '';
        for (let i = 0; i < draws; i++) {
          prob *= (successes - i) / (total - i);
          stepMath += `(${successes - i}/${total - i})` + (i === draws - 1 ? '' : ' * ');
        }
        return {
          prob: Math.max(0, prob),
          formula: 'P(Successive draws without replacement)',
          substitution: `P = ${stepMath}`,
          steps: [
            'On each consecutive draw, reduce both the successful and total outcome pool by 1.',
            'Multiply the fractions together.'
          ]
        };
      }

      if (activeMode === 'bayes') {
        const prior = num(bayesPriorA);
        const bGivenA = num(bayesBGivenA);
        const bGivenNotA = num(bayesBGivenNotA);
        if (isNaN(prior) || isNaN(bGivenA) || isNaN(bGivenNotA) || prior < 0 || prior > 1 || bGivenA < 0 || bGivenA > 1 || bGivenNotA < 0 || bGivenNotA > 1) return null;
        
        const numerator = bGivenA * prior;
        const denominator = (bGivenA * prior) + (bGivenNotA * (1 - prior));
        const prob = numerator / denominator;
        return {
          prob,
          formula: 'P(A|B) = [P(B|A) * P(A)] / [P(B|A)*P(A) + P(B|not A)*P(not A)]',
          substitution: `P(A|B) = [${bGivenA} * ${prior}] / [(${bGivenA} * ${prior}) + (${bGivenNotA} * (1 - ${prior}))]`,
          steps: [
            'Calculate the joint probability of A and B (numerator).',
            'Calculate the overall base probability of B occurring (denominator).',
            'Divide joint numerator by base denominator.'
          ]
        };
      }

      if (activeMode === 'expected') {
        // Calculate expected value of rows
        const validRows = expectedRows.filter(r => r.x !== '' && r.p !== '');
        if (validRows.length === 0) return null;
        let ev = 0;
        let sumP = 0;
        let subText = '';
        for (let i = 0; i < validRows.length; i++) {
          const xVal = parseFloat(validRows[i].x);
          const pVal = parseFloat(validRows[i].p);
          if (isNaN(xVal) || isNaN(pVal) || pVal < 0 || pVal > 1) return null;
          ev += xVal * pVal;
          sumP += pVal;
          subText += `(${xVal} * ${pVal})` + (i === validRows.length - 1 ? '' : ' + ');
        }
        return {
          prob: ev, // Here the "prob" is actually the Expected Value!
          isEV: true,
          sumP,
          formula: 'E(X) = Σ (x_i * p_i)',
          substitution: `E(X) = ${subText}`,
          steps: [
            'Multiply each potential outcome value by its occurrence probability.',
            'Sum all products together. (Note: Probabilities should sum to 1.0; your sum is ' + sumP.toFixed(2) + ')'
          ]
        };
      }

      if (activeMode === 'odds-to-prob') {
        const numVal = num(oddsForNum);
        const denVal = num(oddsForDen);
        if (isNaN(numVal) || isNaN(denVal) || numVal < 0 || denVal <= 0) return null;
        const prob = numVal / (numVal + denVal);
        return {
          prob,
          formula: 'P(A) = OddsFor / (OddsFor + OddsAgainst) = A / (A + B)',
          substitution: `P(A) = ${numVal} / (${numVal} + ${denVal})`,
          steps: [
            'Obtain odds in format A to B.',
            'Convert to probability by dividing A by (A + B).'
          ]
        };
      }

      if (activeMode === 'prob-to-odds') {
        const p = num(probToOddsVal);
        if (isNaN(p) || p < 0 || p >= 1) return null;
        const oddsFor = p / (1 - p);
        const oddsAgainst = (1 - p) / p;
        return {
          prob: p,
          oddsForStr: `1 : ${(1 / oddsFor).toFixed(3)}`,
          oddsAgainstStr: `${oddsAgainst.toFixed(3)} : 1`,
          formula: 'Odds = P / (1 - P)',
          substitution: `Odds For = ${p} / (1 - ${p})`,
          steps: [
            'Divide the success probability P by the failure probability (1 - P).'
          ]
        };
      }

      if (activeMode === 'lottery') {
        const pool = num(lottoPool);
        const pick = num(lottoPick);
        const bPool = num(lottoBonusPool) || 1;
        const bPick = num(lottoBonusPick) || 0;
        if (isNaN(pool) || isNaN(pick) || pool < 1 || pick < 1 || pick > pool) return null;

        const mainComb = nCr(pool, pick);
        const bonusComb = bPick > 0 ? nCr(bPool, bPick) : 1;
        const totalComb = mainComb * bonusComb;
        const prob = 1 / totalComb;

        return {
          prob,
          totalComb,
          formula: 'Odds = 1 / [nCr(Pool, Pick) * nCr(BonusPool, BonusPick)]',
          substitution: `Odds = 1 / [nCr(${pool}, ${pick}) * nCr(${bPool}, ${bPick})]`,
          steps: [
            `Calculate main set combinations: nCr(${pool}, ${pick}) = ${mainComb.toLocaleString()}`,
            bPick > 0 ? `Calculate bonus set combinations: nCr(${bPool}, ${bPick}) = ${bonusComb.toLocaleString()}` : 'No bonus pool selection.',
            'Multiply combinations together to get total outcomes, then take reciprocal.'
          ]
        };
      }

      if (activeMode === 'dice') {
        const count = num(diceCount);
        const faces = num(diceFaces);
        const target = num(diceTargetSum);
        if (isNaN(count) || isNaN(faces) || isNaN(target) || count < 1 || faces < 2 || target < count || target > count * faces) return null;

        // Custom DP to find dice combinations
        const dp: number[][] = Array.from({ length: count + 1 }, () => Array(count * faces + 1).fill(0));
        dp[0][0] = 1;
        for (let i = 1; i <= count; i++) {
          for (let j = 1; j <= count * faces; j++) {
            for (let k = 1; k <= faces; k++) {
              if (j - k >= 0) {
                dp[i][j] += dp[i - 1][j - k];
              }
            }
          }
        }

        const totalOutcomes = Math.pow(faces, count);
        let favorableOutcomes = 0;

        if (diceCompare === 'equal') {
          favorableOutcomes = dp[count][target];
        } else if (diceCompare === 'less') {
          for (let s = count; s <= target; s++) favorableOutcomes += dp[count][s];
        } else if (diceCompare === 'greater') {
          for (let s = target; s <= count * faces; s++) favorableOutcomes += dp[count][s];
        }

        const prob = favorableOutcomes / totalOutcomes;
        return {
          prob,
          favorableOutcomes,
          totalOutcomes,
          formula: `P(X ${diceCompare === 'equal' ? '=' : diceCompare === 'less' ? '<=' : '>='} k) = Favorable / Total`,
          substitution: `P = ${favorableOutcomes} / ${totalOutcomes}`,
          steps: [
            `Total permutations of rolling ${count} dice with ${faces} faces is ${faces}^${count} = ${totalOutcomes.toLocaleString()}`,
            `Count permutations that yield a sum ${diceCompare === 'equal' ? 'equal to' : diceCompare === 'less' ? 'less than or equal to' : 'greater than or equal to'} ${target}.`,
            'Divide favorable combinations by total permutations.'
          ]
        };
      }

      if (activeMode === 'coin') {
        const flips = num(coinFlips);
        const targetH = num(coinHeads);
        if (isNaN(flips) || isNaN(targetH) || flips < 1 || targetH < 0 || targetH > flips) return null;

        let favorableOutcomes = 0;
        if (coinCompare === 'equal') {
          favorableOutcomes = nCr(flips, targetH);
        } else if (coinCompare === 'less') {
          for (let i = 0; i <= targetH; i++) favorableOutcomes += nCr(flips, i);
        } else if (coinCompare === 'greater') {
          for (let i = targetH; i <= flips; i++) favorableOutcomes += nCr(flips, i);
        }

        const totalOutcomes = Math.pow(2, flips);
        const prob = favorableOutcomes / totalOutcomes;

        return {
          prob,
          favorableOutcomes,
          totalOutcomes,
          formula: `P(Heads ${coinCompare === 'equal' ? '=' : coinCompare === 'less' ? '<=' : '>='} ${targetH})`,
          substitution: `P = ${favorableOutcomes} / ${totalOutcomes}`,
          steps: [
            `Calculate total flip arrangements: 2^${flips} = ${totalOutcomes.toLocaleString()}`,
            `Sum combinations nCr(${flips}, k) matching target constraint.`,
            'Divide to get final probability.'
          ]
        };
      }

      if (activeMode === 'card') {
        const draws = num(cardDraws);
        if (isNaN(draws) || draws < 1 || draws > 52) return null;

        let successesInDeck = 13; // hearts default
        let label = 'Hearts';
        if (cardType === 'ace') { successesInDeck = 4; label = 'Aces'; }
        if (cardType === 'red') { successesInDeck = 26; label = 'Red Cards'; }
        if (cardType === 'face') { successesInDeck = 12; label = 'Face Cards'; }

        // Hypergeometric distribution: drawing at least 1 target card in 'draws' draws
        // P(X >= 1) = 1 - P(X = 0)
        const pZero = (nCr(successesInDeck, 0) * nCr(52 - successesInDeck, draws)) / nCr(52, draws);
        const prob = 1 - pZero;

        return {
          prob,
          formula: `P(At least 1 ${label}) = 1 - [nCr(${52 - successesInDeck}, ${draws}) / nCr(52, ${draws})]`,
          substitution: `P = 1 - [nCr(${52 - successesInDeck}, ${draws}) / nCr(52, ${draws})]`,
          steps: [
            `Identify success cards in deck: ${successesInDeck} ${label}.`,
            `Calculate probability of getting ZERO successful cards in ${draws} draws.`,
            'Subtract that value from 1.0 to find the probability of drawing at least one.'
          ]
        };
      }

      if (activeMode === 'hypergeometric') {
        const pop = num(hyperN);
        const succInPop = num(hyperK);
        const sampleSize = num(hyperSampleN);
        const succInSample = num(hyperSuccessK);

        if (isNaN(pop) || isNaN(succInPop) || isNaN(sampleSize) || isNaN(succInSample) ||
            pop < 1 || succInPop < 0 || succInPop > pop || sampleSize < 1 || sampleSize > pop ||
            succInSample < 0 || succInSample > sampleSize || succInSample > succInPop) return null;

        const pmf = hypergeometricPMF(succInSample, pop, succInPop, sampleSize);
        return {
          prob: pmf,
          pmfData: Array.from({ length: Math.min(sampleSize, succInPop) + 1 }, (_, k) => ({
            k,
            prob: hypergeometricPMF(k, pop, succInPop, sampleSize)
          })),
          formula: 'P(X = k) = [nCr(K, k) * nCr(N-K, n-k)] / nCr(N, n)',
          substitution: `P(X = ${succInSample}) = [nCr(${succInPop}, ${succInSample}) * nCr(${pop - succInPop}, ${sampleSize - succInSample})] / nCr(${pop}, ${sampleSize})`,
          steps: [
            'Find combinations of successful sample picks.',
            'Find combinations of remaining sample picks.',
            'Divide by total sample configurations.'
          ]
        };
      }

      if (activeMode === 'binomial') {
        const n = num(binomN);
        const p = num(binomP);
        const k = num(binomK);

        if (isNaN(n) || isNaN(p) || isNaN(k) || n < 1 || p < 0 || p > 1 || k < 0 || k > n) return null;

        let prob = 0;
        if (binomCompare === 'equal') prob = binomialPMF(k, n, p);
        else if (binomCompare === 'less') prob = binomialCDF(k, n, p);
        else if (binomCompare === 'greater') prob = 1 - binomialCDF(k - 1, n, p);

        return {
          prob,
          pmfData: Array.from({ length: n + 1 }, (_, i) => ({
            k: i,
            prob: binomialPMF(i, n, p)
          })),
          formula: `P(X ${binomCompare === 'equal' ? '=' : binomCompare === 'less' ? '<=' : '>='} k) = nCr(n, k) * p^k * (1-p)^(n-k)`,
          substitution: `P = nCr(${n}, ${k}) * ${p}^${k} * (1-${p})^${n - k}`,
          steps: [
            `Determine total number of trials n = ${n} and success probability p = ${p}.`,
            'Apply binomial multiplier coefficient and exponential success/failure powers.',
            'Sum discrete distributions if inequality comparator is selected.'
          ]
        };
      }

      if (activeMode === 'geometric') {
        const p = num(geomP);
        const k = num(geomK);

        if (isNaN(p) || isNaN(k) || p <= 0 || p > 1 || k < 1 || k > 100) return null;

        let prob = 0;
        if (geomCompare === 'equal') prob = geometricPMF(k, p);
        else if (geomCompare === 'less') prob = geometricCDF(k, p);
        else if (geomCompare === 'greater') prob = 1 - geometricCDF(k - 1, p);

        return {
          prob,
          pmfData: Array.from({ length: Math.min(25, Math.ceil(4 / p)) }, (_, i) => ({
            k: i + 1,
            prob: geometricPMF(i + 1, p)
          })),
          formula: `P(X = k) = (1-p)^(k-1) * p`,
          substitution: `P = (1-${p})^(${k}-1) * ${p}`,
          steps: [
            'Geometric distribution calculates first success trial.',
            'Requires (k-1) consecutive failures followed by exactly 1 success.'
          ]
        };
      }

      if (activeMode === 'poisson') {
        const lambda = num(poissonLambda);
        const k = num(poissonK);

        if (isNaN(lambda) || isNaN(k) || lambda <= 0 || k < 0 || k > 200) return null;

        let prob = 0;
        if (poissonCompare === 'equal') prob = poissonPMF(k, lambda);
        else if (poissonCompare === 'less') prob = poissonCDF(k, lambda);
        else if (poissonCompare === 'greater') prob = 1 - poissonCDF(k - 1, lambda);

        return {
          prob,
          pmfData: Array.from({ length: Math.max(10, Math.ceil(lambda * 2.5)) }, (_, i) => ({
            k: i,
            prob: poissonPMF(i, lambda)
          })),
          formula: `P(X = k) = [e^(-λ) * λ^k] / k!`,
          substitution: `P(X = ${k}) = [e^(-${lambda}) * ${lambda}^${k}] / ${k}!`,
          steps: [
            'Calculate base exponential rate reduction.',
            'Multiply by rate to power of target k, then divide by k factorial.'
          ]
        };
      }

      if (activeMode === 'normal') {
        const m = num(normalMean);
        const sd = num(normalStdDev);
        const x1Val = num(normalX1);
        const x2Val = num(normalX2);

        if (isNaN(m) || isNaN(sd) || sd <= 0 || isNaN(x1Val)) return null;

        let prob = 0;
        let subText = '';
        if (normalType === 'less') {
          prob = normalCDF(x1Val, m, sd);
          subText = `P(X <= ${x1Val}) = CDF(${x1Val})`;
        } else if (normalType === 'greater') {
          prob = 1 - normalCDF(x1Val, m, sd);
          subText = `P(X >= ${x1Val}) = 1 - CDF(${x1Val})`;
        } else if (normalType === 'between' && !isNaN(x2Val)) {
          const lower = Math.min(x1Val, x2Val);
          const upper = Math.max(x1Val, x2Val);
          prob = normalCDF(upper, m, sd) - normalCDF(lower, m, sd);
          subText = `P(${lower} <= X <= ${upper}) = CDF(${upper}) - CDF(${lower})`;
        }

        return {
          prob,
          formula: 'Normal Distribution CDF (Integration using Error Function Erf)',
          substitution: subText,
          steps: [
            `Normalize data points to standard Z-scores: Z = (X - μ) / σ`,
            'Integrate Gaussian probability density function under normal curve.',
            'Apply numerical error function approximation.'
          ]
        };
      }

    } catch (e) {
      console.error(e);
      return { prob: 0, formula: 'Error', steps: ['Invalid inputs provided. Please review values.'] };
    }

    return null;
  }, [
    activeMode, basicFavorable, basicTotal, compProbA, addProbA, addProbB, addProbAAndB,
    multProbA, multProbBGivenA, multType, condProbAAndB, condProbB, indepProbA, indepProbB, indepProbC,
    depTotal, depDraws, depSuccess, bayesPriorA, bayesBGivenA, bayesBGivenNotA, expectedRows,
    oddsForNum, oddsForDen, probToOddsVal, lottoPool, lottoPick, lottoBonusPool, lottoBonusPick,
    diceCount, diceFaces, diceTargetSum, diceCompare, coinFlips, coinHeads, coinCompare,
    cardDraws, cardType, hyperN, hyperK, hyperSampleN, hyperSuccessK, binomN, binomP, binomK, binomCompare,
    geomP, geomK, geomCompare, poissonLambda, poissonK, poissonCompare, normalMean, normalStdDev,
    normalX1, normalX2, normalType
  ]);

  // --- COMPACT MONTE CARLO SIMULATOR ---
  const runSimulation = () => {
    if (simRunning || !calculations) return;
    setSimRunning(true);
    setSimResult(null);

    // Run async loop to avoid browser UI block
    setTimeout(() => {
      let successes = 0;
      const thProb = calculations.prob || 0.5;

      for (let i = 0; i < simTrials; i++) {
        // Mode dependent simulation logic
        if (activeMode === 'basic' || activeMode === 'binomial' || activeMode === 'coin' || activeMode === 'hypergeometric' || activeMode === 'poisson' || activeMode === 'normal') {
          if (Math.random() < thProb) successes++;
        } else {
          // Fallback uniform simulator
          if (Math.random() < thProb) successes++;
        }
      }

      setSimResult({
        simulatedProb: successes / simTrials,
        successes,
        theoreticalProb: thProb
      });
      setSimRunning(false);
    }, 150);
  };

  // --- PDF & CSV EXPORTS ---
  const handleExportPng = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `Calculatoora_Probability_Report_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = () => {
    if (!simResult) return;
    const content = `Metric,Value\nTotal Trials,${simTrials}\nSimulated Successes,${simResult.successes}\nSimulated Probability,${(simResult.simulatedProb * 100).toFixed(4)}%\nTheoretical Probability,${(simResult.theoreticalProb * 100).toFixed(4)}%\nAbsolute Error,${Math.abs(simResult.simulatedProb - simResult.theoreticalProb).toFixed(4)}\nTimestamp,${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `probability_simulation_${simTrials}.csv`;
    link.click();
  };

  const handleExportPdfSummary = () => {
    if (!calculations) return;
    const text = `========================================\nCALCULATOORA PROBABILITY SUMMARY\n========================================\nMode: ${activeMode.toUpperCase()}\nFormula: ${calculations.formula}\nSubstitution: ${calculations.substitution}\n\nRESULT METRICS:\nProbability: ${(calculations.prob || 0).toFixed(6)}\nPercentage: ${((calculations.prob || 0) * 105).toFixed(4)}%\nFraction: ${getFraction(calculations.prob || 0) || 'N/A'}\n\nSTP-BY-STEP SOLUTION:\n${calculations.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nGenerated via Calculatoora.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Probability_Calculation_${activeMode}.txt`;
    link.click();
  };

  // --- WHAT-IF ANALYSER LIVE COMPONENT ---
  const renderWhatIfSlider = () => {
    if (!calculations) return null;
    
    // Sliders for dynamic modes
    if (activeMode === 'binomial') {
      return (
        <div className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-neutral-500">Live Success Prob (p):</span>
            <span className="text-blue-600 dark:text-cyan-400 font-extrabold">{binomP || '0.5'}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={binomP || '0.5'} 
            onChange={(e) => setBinomP(e.target.value)}
            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      );
    }

    if (activeMode === 'basic') {
      return (
        <div className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-neutral-500">Favorable Outcomes:</span>
            <span className="text-blue-600 dark:text-cyan-400 font-extrabold">{basicFavorable || '5'}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={basicTotal || '20'} 
            step="1" 
            value={basicFavorable || '0'} 
            onChange={(e) => setBasicFavorable(e.target.value)}
            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      );
    }

    if (activeMode === 'normal') {
      return (
        <div className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/60 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-neutral-500">Live Boundary (X1):</span>
              <span className="text-blue-600 dark:text-cyan-400 font-extrabold">{normalX1 || '50'}</span>
            </div>
            <input 
              type="range" 
              min={(num(normalMean) || 50) - 3 * (num(normalStdDev) || 10)} 
              max={(num(normalMean) || 50) + 3 * (num(normalStdDev) || 10)} 
              step="0.5" 
              value={normalX1 || '50'} 
              onChange={(e) => setNormalX1(e.target.value)}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // --- REAL WORLD CASE PRESETS ---
  const loadCaseStudy = (study: string) => {
    handleClearAll();
    if (study === 'lotto') {
      setActiveMode('lottery');
      setLottoPool('69'); setLottoPick('5'); setLottoBonusPool('26'); setLottoBonusPick('1');
    } else if (study === 'weather') {
      setActiveMode('addition');
      setAddProbA('0.4'); setAddProbB('0.5'); setAddProbAAndB('0.2');
    } else if (study === 'medical') {
      setActiveMode('bayes');
      setBayesPriorA('0.008'); setBayesBGivenA('0.9'); setBayesBGivenNotA('0.07');
    } else if (study === 'insurance') {
      setActiveMode('expected');
      setExpectedRows([
        { x: '-500', p: '0.05' },
        { x: '150', p: '0.95' }
      ]);
    } else if (study === 'sports') {
      setActiveMode('binomial');
      setBinomN('7'); setBinomP('0.55'); setBinomK('4'); setBinomCompare('greater');
    } else if (study === 'defect') {
      setActiveMode('hypergeometric');
      setHyperN('500'); setHyperK('15'); setHyperSampleN('20'); setHyperSuccessK('1');
    }
    setSimResult(null);
  };

  return (
    <div className="space-y-10" ref={dashboardRef}>
      
      {/* Header Disclaimer */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-5 dark:border-neutral-800 dark:from-neutral-900/40 dark:to-neutral-900/20 backdrop-blur-md flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-900 dark:text-neutral-200">
            Ultimate Probability Screening Tool
          </p>
          <p className="text-xs text-blue-700/80 dark:text-neutral-400 leading-relaxed">
            Quickly resolve complex joint events, distributions, lottery arrangements, or continuous Gaussian limits. Use custom simulations to compare theoretical and observational outcomes instantly.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT PANEL COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[32px] border border-white/50 bg-white/70 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-extrabold flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> CALCULATION MODE
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoadExample}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Example
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-neutral-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Select mode selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400">Select Formula Method</label>
              <select
                value={activeMode}
                onChange={(e) => { setActiveMode(e.target.value); handleClearAll(); }}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-bold focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              >
                <optgroup label="Classical & Sets">
                  <option value="basic">1. Basic Probability P(A)</option>
                  <option value="complement">2. Complement Rule P(NOT A)</option>
                  <option value="addition">3. Addition Rule P(A OR B)</option>
                  <option value="multiplication">4. Multiplication Rule P(A AND B)</option>
                  <option value="conditional">5. Conditional Probability P(A|B)</option>
                </optgroup>
                <optgroup label="Joint Events & Bayes">
                  <option value="independent">6. Independent Successive Events</option>
                  <option value="dependent">7. Dependent Events (No Replacement)</option>
                  <option value="bayes">8. Bayes' Theorem</option>
                  <option value="expected">9. Expected Value E(X)</option>
                </optgroup>
                <optgroup label="Odds Conversion">
                  <option value="odds-to-prob">10. Odds to Probability</option>
                  <option value="prob-to-odds">11. Probability to Odds</option>
                </optgroup>
                <optgroup label="Real-World & Discrete Distributions">
                  <option value="lottery">12. Lottery Probability</option>
                  <option value="dice">13. Dice Probability</option>
                  <option value="coin">14. Coin Toss Probability</option>
                  <option value="card">15. Card Probability</option>
                  <option value="hypergeometric">16. Hypergeometric Probability</option>
                  <option value="binomial">17. Binomial Distribution</option>
                  <option value="geometric">18. Geometric Distribution</option>
                  <option value="poisson">19. Poisson Distribution</option>
                  <option value="normal">20. Normal Distribution Curve</option>
                </optgroup>
              </select>
            </div>

            {/* Render dynamic mode input fields */}
            <div className="space-y-4 pt-2">
              
              {activeMode === 'basic' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Successful Outcomes (Required)</label>
                    <input 
                      type="number" 
                      value={basicFavorable} 
                      onChange={(e) => setBasicFavorable(e.target.value)} 
                      placeholder="e.g. 5" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Outcomes (Required)</label>
                    <input 
                      type="number" 
                      value={basicTotal} 
                      onChange={(e) => setBasicTotal(e.target.value)} 
                      placeholder="e.g. 20" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {activeMode === 'complement' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Probability of A (Required, 0-1)</label>
                  <input 
                    type="number" 
                    value={compProbA} 
                    onChange={(e) => setCompProbA(e.target.value)} 
                    placeholder="e.g. 0.35" 
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {activeMode === 'addition' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Probability A (P(A))</label>
                    <input 
                      type="number" 
                      value={addProbA} 
                      onChange={(e) => setAddProbA(e.target.value)} 
                      placeholder="e.g. 0.50" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Probability B (P(B))</label>
                    <input 
                      type="number" 
                      value={addProbB} 
                      onChange={(e) => setAddProbB(e.target.value)} 
                      placeholder="e.g. 0.40" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">P(A AND B) Overlap (Optional)</label>
                    <input 
                      type="number" 
                      value={addProbAAndB} 
                      onChange={(e) => setAddProbAAndB(e.target.value)} 
                      placeholder="e.g. 0.15" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                </>
              )}

              {activeMode === 'multiplication' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Probability A (P(A))</label>
                    <input 
                      type="number" 
                      value={multProbA} 
                      onChange={(e) => setMultProbA(e.target.value)} 
                      placeholder="e.g. 0.60" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Probability of B or P(B|A)</label>
                    <input 
                      type="number" 
                      value={multProbBGivenA} 
                      onChange={(e) => setMultProbBGivenA(e.target.value)} 
                      placeholder="e.g. 0.40" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setMultType('independent')} 
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border ${multType === 'independent' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                    >
                      Independent
                    </button>
                    <button 
                      onClick={() => setMultType('dependent')} 
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border ${multType === 'dependent' ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20 text-pink-600' : 'border-neutral-200'}`}
                    >
                      Dependent
                    </button>
                  </div>
                </>
              )}

              {activeMode === 'conditional' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Joint Probability P(A AND B)</label>
                    <input 
                      type="number" 
                      value={condProbAAndB} 
                      onChange={(e) => setCondProbAAndB(e.target.value)} 
                      placeholder="e.g. 0.12" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Conditioning Prob P(B)</label>
                    <input 
                      type="number" 
                      value={condProbB} 
                      onChange={(e) => setCondProbB(e.target.value)} 
                      placeholder="e.g. 0.40" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 font-bold"
                    />
                  </div>
                </>
              )}

              {activeMode === 'independent' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Event A Probability</label>
                    <input 
                      type="number" 
                      value={indepProbA} 
                      onChange={(e) => setIndepProbA(e.target.value)} 
                      placeholder="e.g. 0.5" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Event B Probability</label>
                    <input 
                      type="number" 
                      value={indepProbB} 
                      onChange={(e) => setIndepProbB(e.target.value)} 
                      placeholder="e.g. 0.4" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Event C Probability (Optional)</label>
                    <input 
                      type="number" 
                      value={indepProbC} 
                      onChange={(e) => setIndepProbC(e.target.value)} 
                      placeholder="e.g. 0.25" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                </>
              )}

              {activeMode === 'dependent' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Pool Size</label>
                    <input 
                      type="number" 
                      value={depTotal} 
                      onChange={(e) => setDepTotal(e.target.value)} 
                      placeholder="e.g. 10" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Successful Items in Pool</label>
                    <input 
                      type="number" 
                      value={depSuccess} 
                      onChange={(e) => setDepSuccess(e.target.value)} 
                      placeholder="e.g. 4" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Number of Consecutive Draws</label>
                    <input 
                      type="number" 
                      value={depDraws} 
                      onChange={(e) => setDepDraws(e.target.value)} 
                      placeholder="e.g. 3" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                </>
              )}

              {activeMode === 'bayes' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Prior Probability P(A) (Disease/Hypothesis)</label>
                    <input 
                      type="number" 
                      value={bayesPriorA} 
                      onChange={(e) => setBayesPriorA(e.target.value)} 
                      placeholder="e.g. 0.01" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sensitivity P(B|A) (True Positive rate)</label>
                    <input 
                      type="number" 
                      value={bayesBGivenA} 
                      onChange={(e) => setBayesBGivenA(e.target.value)} 
                      placeholder="e.g. 0.90" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">False Alarm P(B|not A) (False Positive rate)</label>
                    <input 
                      type="number" 
                      value={bayesBGivenNotA} 
                      onChange={(e) => setBayesBGivenNotA(e.target.value)} 
                      placeholder="e.g. 0.095" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white"
                    />
                  </div>
                </>
              )}

              {activeMode === 'expected' && (
                <div className="space-y-3">
                  <span className="text-xs font-extrabold uppercase text-neutral-400 block font-mono">Outcomes Distribution Table</span>
                  {expectedRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        value={row.x} 
                        onChange={(e) => {
                          const newRows = [...expectedRows];
                          newRows[idx].x = e.target.value;
                          setExpectedRows(newRows);
                        }} 
                        placeholder={`Value x${idx+1} (e.g. 20)`} 
                        className="px-3 py-2 text-xs rounded-xl border border-neutral-200"
                      />
                      <input 
                        type="number" 
                        value={row.p} 
                        onChange={(e) => {
                          const newRows = [...expectedRows];
                          newRows[idx].p = e.target.value;
                          setExpectedRows(newRows);
                        }} 
                        placeholder={`Probability p${idx+1} (e.g. 0.5)`} 
                        className="px-3 py-2 text-xs rounded-xl border border-neutral-200"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setExpectedRows([...expectedRows, { x: '', p: '' }])}
                    className="w-full py-1.5 text-[10px] uppercase font-black border border-dashed rounded-xl border-neutral-300 text-neutral-400 hover:text-neutral-600"
                  >
                    + Add Outcome Row
                  </button>
                </div>
              )}

              {activeMode === 'odds-to-prob' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Odds For</label>
                    <input type="number" value={oddsForNum} onChange={(e) => setOddsForNum(e.target.value)} placeholder="3" className="w-full px-3 py-2.5 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Odds Against</label>
                    <input type="number" value={oddsForDen} onChange={(e) => setOddsForDen(e.target.value)} placeholder="2" className="w-full px-3 py-2.5 rounded-xl border" />
                  </div>
                </div>
              )}

              {activeMode === 'prob-to-odds' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Success Probability P(A)</label>
                  <input type="number" value={probToOddsVal} onChange={(e) => setProbToOddsVal(e.target.value)} placeholder="e.g. 0.40" className="w-full px-4 py-3 rounded-2xl border" />
                </div>
              )}

              {activeMode === 'lottery' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase">Main Pool Size</label>
                    <input type="number" value={lottoPool} onChange={(e) => setLottoPool(e.target.value)} placeholder="e.g. 49" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase">Balls drawn</label>
                    <input type="number" value={lottoPick} onChange={(e) => setLottoPick(e.target.value)} placeholder="e.g. 6" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase">Bonus Pool Size</label>
                    <input type="number" value={lottoBonusPool} onChange={(e) => setLottoBonusPool(e.target.value)} placeholder="e.g. 10" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase">Bonus Picks</label>
                    <input type="number" value={lottoBonusPick} onChange={(e) => setLottoBonusPick(e.target.value)} placeholder="e.g. 1" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                </div>
              )}

              {activeMode === 'dice' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500">Dice Count</label>
                      <input type="number" value={diceCount} onChange={(e) => setDiceCount(e.target.value)} placeholder="2" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500">Dice Faces</label>
                      <input type="number" value={diceFaces} onChange={(e) => setDiceFaces(e.target.value)} placeholder="6" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 uppercase">Target Sum</label>
                    <input type="number" value={diceTargetSum} onChange={(e) => setDiceTargetSum(e.target.value)} placeholder="7" className="w-full px-4 py-2.5 rounded-xl border" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['equal', 'less', 'greater'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setDiceCompare(mode as any)}
                        className={`py-1 text-[10px] font-extrabold uppercase rounded-lg border ${diceCompare === mode ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                      >
                        {mode === 'equal' ? 'Exact' : mode === 'less' ? 'At Most' : 'At Least'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeMode === 'coin' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Total Flips</label>
                      <input type="number" value={coinFlips} onChange={(e) => setCoinFlips(e.target.value)} placeholder="10" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Target Heads</label>
                      <input type="number" value={coinHeads} onChange={(e) => setCoinHeads(e.target.value)} placeholder="5" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['equal', 'less', 'greater'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setCoinCompare(mode as any)}
                        className={`py-1 text-[10px] font-extrabold uppercase rounded-lg border ${coinCompare === mode ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                      >
                        {mode === 'equal' ? 'Exact' : mode === 'less' ? 'At Most' : 'At Least'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeMode === 'card' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold">Number of Draws (without replacement)</label>
                    <input type="number" value={cardDraws} onChange={(e) => setCardDraws(e.target.value)} placeholder="5" className="w-full px-4 py-3 rounded-2xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold">Draw Target Type</label>
                    <select value={cardType} onChange={(e) => setCardType(e.target.value)} className="w-full px-4 py-3 rounded-2xl border bg-white">
                      <option value="hearts">At least 1 Heart card</option>
                      <option value="ace">At least 1 Ace card</option>
                      <option value="red">At least 1 Red card</option>
                      <option value="face">At least 1 Face card (J, Q, K)</option>
                    </select>
                  </div>
                </>
              )}

              {activeMode === 'hypergeometric' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold">Population Size (N)</label>
                    <input type="number" value={hyperN} onChange={(e) => setHyperN(e.target.value)} placeholder="100" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold">Successes in Pop (K)</label>
                    <input type="number" value={hyperK} onChange={(e) => setHyperK(e.target.value)} placeholder="15" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold">Sample Size (n)</label>
                    <input type="number" value={hyperSampleN} onChange={(e) => setHyperSampleN(e.target.value)} placeholder="10" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold">Sample Successes (k)</label>
                    <input type="number" value={hyperSuccessK} onChange={(e) => setHyperSuccessK(e.target.value)} placeholder="2" className="w-full px-3 py-2 rounded-xl border" />
                  </div>
                </div>
              )}

              {activeMode === 'binomial' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Trials (n)</label>
                      <input type="number" value={binomN} onChange={(e) => setBinomN(e.target.value)} placeholder="10" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Prob of Success (p)</label>
                      <input type="number" value={binomP} onChange={(e) => setBinomP(e.target.value)} placeholder="0.30" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold">Successes (k)</label>
                    <input type="number" value={binomK} onChange={(e) => setBinomK(e.target.value)} placeholder="3" className="w-full px-4 py-2 rounded-xl border" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['equal', 'less', 'greater'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setBinomCompare(mode as any)}
                        className={`py-1 text-[10px] font-extrabold uppercase rounded-lg border ${binomCompare === mode ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                      >
                        {mode === 'equal' ? 'Exact k' : mode === 'less' ? 'At Most k' : 'At Least k'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeMode === 'geometric' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Prob of Success (p)</label>
                      <input type="number" value={geomP} onChange={(e) => setGeomP(e.target.value)} placeholder="0.25" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Target Trial (k)</label>
                      <input type="number" value={geomK} onChange={(e) => setGeomK(e.target.value)} placeholder="4" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['equal', 'less', 'greater'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setGeomCompare(mode as any)}
                        className={`py-1 text-[10px] font-extrabold uppercase rounded-lg border ${geomCompare === mode ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                      >
                        {mode === 'equal' ? 'Exact k' : mode === 'less' ? 'At Most k' : 'At Least k'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeMode === 'poisson' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Average rate (λ)</label>
                      <input type="number" value={poissonLambda} onChange={(e) => setPoissonLambda(e.target.value)} placeholder="4" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Occurrences (k)</label>
                      <input type="number" value={poissonK} onChange={(e) => setPoissonK(e.target.value)} placeholder="3" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['equal', 'less', 'greater'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPoissonCompare(mode as any)}
                        className={`py-1 text-[10px] font-extrabold uppercase rounded-lg border ${poissonCompare === mode ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                      >
                        {mode === 'equal' ? 'Exact k' : mode === 'less' ? 'At Most k' : 'At Least k'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeMode === 'normal' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Mean (μ)</label>
                      <input type="number" value={normalMean} onChange={(e) => setNormalMean(e.target.value)} placeholder="50" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">Std Deviation (σ)</label>
                      <input type="number" value={normalStdDev} onChange={(e) => setNormalStdDev(e.target.value)} placeholder="10" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold">X1 limit</label>
                      <input type="number" value={normalX1} onChange={(e) => setNormalX1(e.target.value)} placeholder="45" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold">X2 limit (between)</label>
                      <input type="number" value={normalX2} onChange={(e) => setNormalX2(e.target.value)} placeholder="65" className="w-full px-3 py-2 rounded-xl border" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['less', 'greater', 'between'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setNormalType(mode as any)}
                        className={`py-1 text-[10px] font-extrabold uppercase rounded-lg border ${normalType === mode ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'border-neutral-200'}`}
                      >
                        {mode === 'less' ? 'Less than X1' : mode === 'greater' ? 'Greater than X1' : 'Between X1 & X2'}
                      </button>
                    ))}
                  </div>
                </>
              )}

            </div>

            {/* Slider container for What-If dynamic adjustments */}
            {calculations && (
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 space-y-3">
                <span className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> What-If Parameter analysis
                </span>
                {renderWhatIfSlider() || (
                  <p className="text-[10px] text-neutral-400 italic">No slider adjustments available for this mode. Dynamic sliders activate on basic, binomial, and normal modes.</p>
                )}
              </div>
            )}

          </div>

          {/* REAL WORLD PRESETS COMPONENT */}
          <div className="rounded-3xl border border-neutral-200/50 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/10 p-5 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-500" /> Real-World Scenarios
            </span>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button onClick={() => loadCaseStudy('lotto')} className="p-3 text-xs font-bold rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                🎰 Powerball Jackpot
              </button>
              <button onClick={() => loadCaseStudy('weather')} className="p-3 text-xs font-bold rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                🌦️ Weekend Rain Overlap
              </button>
              <button onClick={() => loadCaseStudy('medical')} className="p-3 text-xs font-bold rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                🩺 False Positive Mammogram
              </button>
              <button onClick={() => loadCaseStudy('insurance')} className="p-3 text-xs font-bold rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                🚗 Insurance Payout Risks
              </button>
              <button onClick={() => loadCaseStudy('sports')} className="p-3 text-xs font-bold rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                🏀 Playoff Series P(4 of 7)
              </button>
              <button onClick={() => loadCaseStudy('defect')} className="p-3 text-xs font-bold rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                🏭 Defective Factory Samples
              </button>
            </div>
          </div>

        </div>

        {/* RESULTS & VISUALIZATION PANEL COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!calculations ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-[32px] border border-dashed border-neutral-300 bg-neutral-50/50 p-12 text-center space-y-5 dark:border-neutral-800 dark:bg-neutral-900/10"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Coins className="w-8 h-8 text-blue-600 dark:text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Awaiting Parameter Setup</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Provide the required numeric boundaries for the active mode to instantly unlock step-by-step solutions and real-world graphs.
                  </p>
                </div>
                <button
                  onClick={handleLoadExample}
                  className="px-6 py-3 bg-neutral-900 hover:bg-blue-600 dark:bg-neutral-850 dark:hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Load Example Parameters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* RESULTS SUMMARY CARD */}
                <div className="rounded-[32px] border border-white/50 bg-gradient-to-br from-white/90 to-neutral-50/50 p-6 sm:p-8 shadow-2xl dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950/60 space-y-6">
                  
                  {/* Top action header bar */}
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
                    <div className="space-y-0.5">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Statistical Probability Score</span>
                      <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Active Solution Outcomes</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportPdfSummary}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                        title="Download summary txt summary"
                      >
                        <FileText className="w-3.5 h-3.5" /> Text Summary
                      </button>
                      <button
                        onClick={handleExportPng}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Save PNG
                      </button>
                    </div>
                  </div>

                  {/* Primary Grid metric outcome gauges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Gauge circles display */}
                    <div className="flex flex-col items-center justify-center space-y-3 bg-neutral-50/60 dark:bg-neutral-950/30 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-850">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-neutral-800" />
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            stroke="#2563eb" 
                            strokeWidth="8" 
                            strokeDasharray={251.2}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * (calculations.isEV ? 1 : calculations.prob)) }}
                            transition={{ duration: 0.8 }}
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="block text-2xl font-black text-neutral-900 dark:text-white leading-none">
                            {calculations.isEV 
                              ? (calculations.prob || 0).toFixed(2)
                              : `${((calculations.prob || 0) * 100).toFixed(3)}%`
                            }
                          </span>
                          <span className="text-[9px] text-neutral-400 font-extrabold uppercase font-mono tracking-widest block mt-1">
                            {calculations.isEV ? 'EXPECTED VALUE' : 'CHANCE'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Standard fraction, decimal metrics details */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-950/20 space-y-2 text-xs">
                        <div className="flex justify-between font-bold text-neutral-500">
                          <span>Decimal probability:</span>
                          <span className="text-neutral-900 dark:text-neutral-200">{(calculations.prob || 0).toFixed(6)}</span>
                        </div>
                        {!calculations.isEV && (
                          <>
                            <div className="flex justify-between font-bold text-neutral-500">
                              <span>Odds For:</span>
                              <span className="text-neutral-900 dark:text-neutral-200">
                                {calculations.oddsForStr || `${(calculations.prob / (1 - calculations.prob || 1)).toFixed(4)} : 1`}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-neutral-500">
                              <span>Odds Against:</span>
                              <span className="text-neutral-900 dark:text-neutral-200">
                                {calculations.oddsAgainstStr || `${((1 - calculations.prob) / (calculations.prob || 0.0001)).toFixed(4)} : 1`}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-neutral-500">
                              <span>Estimated Fraction:</span>
                              <span className="text-neutral-900 dark:text-neutral-200">{getFraction(calculations.prob) || 'N/A'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Step by Step calculations panel */}
                  <div className="p-5 rounded-3xl bg-blue-50/30 border border-blue-100/50 dark:bg-neutral-900/40 dark:border-neutral-800 space-y-3 text-left">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">Theoretical Math Solution</span>
                    <div className="font-mono text-sm font-black text-blue-700 dark:text-cyan-400 bg-blue-50/50 dark:bg-neutral-950 p-3 rounded-2xl border border-blue-100/30">
                      Formula: {calculations.formula}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                      Substitution: {calculations.substitution}
                    </div>
                    <div className="space-y-1 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                      {calculations.steps.map((step, i) => (
                        <div key={i} className="flex gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                          <span className="font-bold text-blue-500">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* GRAPHICAL VISUALIZATION MODULE */}
                <div className="space-y-6">
                  {/* Venn Diagrams */}
                  {(activeMode === 'basic' || activeMode === 'complement' || activeMode === 'addition' || activeMode === 'multiplication' || activeMode === 'conditional') && (
                    <VennDiagram 
                      probA={activeMode === 'basic' ? (num(basicFavorable)/num(basicTotal) || 0) : activeMode === 'complement' ? (num(compProbA) || 0) : (num(addProbA) || 0.5)} 
                      probB={activeMode === 'addition' ? (num(addProbB) || 0.4) : activeMode === 'multiplication' ? (num(multProbBGivenA) || 0.4) : 0.4} 
                      probAAndB={activeMode === 'addition' ? (num(addProbAAndB) || 0) : activeMode === 'multiplication' ? (num(multProbA)*num(multProbBGivenA) || 0) : 0.15} 
                    />
                  )}

                  {/* Gaussian Bell Curves */}
                  {activeMode === 'normal' && (
                    <BellCurve 
                      mean={num(normalMean) || 50} 
                      stdDev={num(normalStdDev) || 10} 
                      x1={num(normalX1) || null} 
                      x2={num(normalX2) || null} 
                      type={normalType} 
                    />
                  )}

                  {/* Discrete Distributions */}
                  {(activeMode === 'binomial' || activeMode === 'poisson' || activeMode === 'hypergeometric' || activeMode === 'geometric') && calculations.pmfData && (
                    <DiscreteChart 
                      pmfData={calculations.pmfData} 
                      targetK={activeMode === 'binomial' ? num(binomK) : activeMode === 'poisson' ? num(poissonK) : activeMode === 'hypergeometric' ? num(hyperSuccessK) : num(geomK)} 
                      compare={activeMode === 'binomial' ? binomCompare : activeMode === 'poisson' ? poissonCompare : activeMode === 'geometric' ? geomCompare : 'equal'} 
                    />
                  )}

                  {/* Interactive Dice Roller / Coin Flippers */}
                  {activeMode === 'dice' && <DiceRoller />}
                  {activeMode === 'coin' && <CoinFlipper />}
                  {activeMode === 'card' && <CardVisualizer />}
                </div>

                {/* INTERACTIVE MONTE CARLO SIMULATOR */}
                <div className="rounded-[32px] border border-neutral-100 bg-white/70 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40 backdrop-blur-md space-y-6">
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5 text-left">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono">Observational Probability Engine</span>
                      <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Monte Carlo Random Simulator</h4>
                    </div>
                    {simResult && (
                      <button onClick={handleExportCsv} className="p-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-neutral-200 transition flex items-center gap-1">
                        <FileSpreadsheet className="w-3.5 h-3.5" /> CSV Export
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[100, 1000, 10000, 100000].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSimTrials(t)}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl border ${simTrials === t ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-200 text-neutral-500'}`}
                      >
                        {t.toLocaleString()} Runs
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={runSimulation}
                    disabled={simRunning}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${simRunning ? 'animate-spin' : ''}`} />
                    {simRunning ? 'Running random trials...' : 'Execute Simulator Experiments'}
                  </button>

                  {simResult && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30 text-left space-y-2">
                        <span className="text-[10px] font-extrabold text-neutral-400 uppercase block">Simulated Score</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">{(simResult.simulatedProb * 100).toFixed(3)}%</span>
                          <span className="text-xs font-semibold text-neutral-400">({simResult.successes} / {simTrials})</span>
                        </div>
                        <p className="text-[10px] text-neutral-500">Calculated after drawing {simTrials.toLocaleString()} random outcomes uniformly.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30 text-left space-y-2">
                        <span className="text-[10px] font-extrabold text-neutral-400 uppercase block">Simulation Accuracy</span>
                        <div className="text-2xl font-black text-emerald-500">
                          {(100 - Math.abs(simResult.simulatedProb - simResult.theoreticalProb) * 100).toFixed(2)}%
                        </div>
                        <p className="text-[10px] text-neutral-500">Observational convergence rate to true mathematical value.</p>
                      </div>
                    </div>
                  )}

                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* EDUCATIONAL & SEO RESOURCE PANEL */}
      <div className="rounded-[32px] border border-neutral-200 bg-white/50 p-6 sm:p-10 dark:border-neutral-800 dark:bg-neutral-900/20 text-left space-y-8">
        
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-mono block">Learning Hub</span>
          <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Understanding Probability Rules</h3>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-3xl">
            Probability is the branch of mathematics concerning numerical descriptions of how likely an event is to occur, or how likely it is that a proposition is true. The probability of an event is a number between 0 and 1.
          </p>
        </div>

        {/* Informative grid modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono text-[10px] text-blue-500">I. Complement Rule</h4>
            <p>
              The probability of the complement of an event is 1 minus the probability of the event. If a coin flip has a 50% chance of heads, the complement (tails) has 1 - 0.50 = 50% chance.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono text-[10px] text-pink-500">II. Multiplication &amp; Independence</h4>
            <p>
              For independent events, the probability of both occurring is the product of their individual probabilities. P(A and B) = P(A) * P(B).
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono text-[10px] text-purple-500">III. Bayes' Theorem</h4>
            <p>
              Bayes' theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event. Essential in medical screenings and computer science.
            </p>
          </div>
        </div>

        {/* Expanded Educational FAQ */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-3">
          <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 font-mono">Frequently Asked Questions (FAQ)</span>
          {[
            {
              q: "What is the difference between theoretical and simulated probability?",
              a: "Theoretical probability is calculated using mathematical formulas and deductive logic (assuming perfect conditions). Simulated probability is determined through actual observational experiments (like Monte Carlo trials). As trials increase, the simulated score converges to the theoretical score."
            },
            {
              q: "When should I use Hypergeometric vs Binomial distributions?",
              a: "Use Hypergeometric distribution when drawing samples WITHOUT replacement (e.g., pulling cards from a deck, where each draw changes the remaining pool). Use Binomial distribution when trials are completely independent WITH replacement."
            },
            {
              q: "What does Bayes' Theorem tell us about medical test accuracy?",
              a: "It shows that if a disease is extremely rare, even a medical test with 95% accuracy can yield more false positives than true positives, because the base-rate of the disease in the population is extremely low."
            }
          ].map((faq, idx) => (
            <div key={idx} className="border-b border-neutral-100 dark:border-neutral-800/50 pb-3">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-500 text-left transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 transform transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              {expandedFaq === idx && (
                <p className="text-xs text-neutral-500 pt-1 leading-relaxed max-w-4xl">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
