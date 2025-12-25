'use client';

import { useMemo } from 'react';

// Data Structures
export type GroupedDataItem = {
  lower: number;
  upper: number;
  frequency: number;
};
export type RawData = { type: 'raw'; values: number[] };
export type GroupedData = { type: 'grouped'; values: GroupedDataItem[] };

// Result Structures
export type Formula = {
  expression: string;
  parts?: {
    numerator: string | number;
    denominator: string | number;
    result: string | number;
  };
  calculation?: string; // Fallback for simple calcs
};
export type Statistic = {
  value: any;
  formula: Formula;
  values?: number[]; // To pass raw data for table display
};

export interface StatisticsResult {
  mean: Statistic;
  median: Statistic;
  mode: Statistic;
  variance: Statistic;
  range: Statistic;
  stdDev: Statistic;
  cv: Statistic;
  error?: string;
}

// --- Calculation Engines ---

// Raw Data Calculations
const calcRaw = (data: number[]): Partial<StatisticsResult> | { error: string } => {
  if (data.length === 0) return { error: 'داده‌ای برای تحلیل وجود ندارد.' };
  
  const isSample = data.length > 1 && data.length < 30; // Common heuristic for sample vs population
  const n = data.length;
  const variance_n = isSample ? n - 1 : n;

  if (isSample && n < 2) return { error: 'حداقل به دو داده برای محاسبه واریانس نمونه نیاز است.'}

  const sortedData = [...data].sort((a, b) => a - b);
  
  // Mean
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Median
  let median: number;
  if (n % 2 === 0) {
    median = (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
  } else {
    median = sortedData[Math.floor(n / 2)];
  }

  // Mode
  const frequencyMap: { [key: number]: number } = {};
  data.forEach(num => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
  });
  let maxFreq = 0;
  for (const num in frequencyMap) {
    if (frequencyMap[num] > maxFreq) {
      maxFreq = frequencyMap[num];
    }
  }
  let mode: number[] = [];
  const allSameFreq = Object.values(frequencyMap).every(freq => freq === Object.values(frequencyMap)[0]);
  
  if (maxFreq > 1 && !allSameFreq) {
    for (const num in frequencyMap) {
      if (frequencyMap[num] === maxFreq) {
        mode.push(Number(num));
      }
    }
  }

  // Variance
  const varianceSum = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const variance = varianceSum / variance_n;

  // Standard Deviation
  const stdDev = Math.sqrt(variance);
  
  // Range
  const range = sortedData[n-1] - sortedData[0];
  
  // Coefficient of Variation
  const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

  return {
    mean: {
      value: mean,
      formula: { 
        expression: 'x̄ = Σx / n', 
        parts: { numerator: sum.toFixed(2), denominator: n, result: mean.toFixed(3) }
      },
    },
    median: {
      value: median,
      formula: { expression: 'مقدار میانی در داده مرتب‌شده', calculation: `مقدار در جایگاه ${(n + 1) / 2}` },
    },
    mode: {
      value: mode,
      formula: { expression: 'مقداری با بیشترین فراوانی', calculation: `بیشترین فراوانی: ${maxFreq}` },
    },
    variance: {
      value: variance,
      formula: { 
        expression: isSample ? 'S² = Σ(x - x̄)² / (n-1)' : 'σ² = Σ(x - x̄)² / n', 
        parts: { numerator: varianceSum.toFixed(2), denominator: variance_n, result: variance.toFixed(3) } 
      },
      values: data,
    },
    stdDev: {
        value: stdDev,
        formula: {
            expression: isSample ? "S = √S²" : "σ = √σ²",
            calculation: `√${variance.toFixed(3)} = ${stdDev.toFixed(3)}`
        }
    },
    range: {
        value: range,
        formula: { 
            expression: 'R = Max(x) - Min(x)', 
            calculation: `${sortedData[n-1]} - ${sortedData[0]} = ${range}` 
        }
    },
    cv: {
        value: cv,
        formula: {
            expression: 'CV = (S / |x̄|) * 100',
            calculation: `(${stdDev.toFixed(3)} / |${mean.toFixed(3)}|) * 100 = ${cv.toFixed(2)}%`
        }
    }
  };
};

// Grouped Data Calculations
const calcGrouped = (data: GroupedDataItem[]): Partial<StatisticsResult> | { error: string } => {
  if (data.length === 0 || data.every(d => d.frequency === 0)) return { error: 'داده‌ای برای تحلیل وجود ندارد.' };
  
  const table = data.map(item => ({
    ...item,
    midpoint: (item.lower + item.upper) / 2
  }));
  
  const n = table.reduce((sum, row) => sum + row.frequency, 0);
  if (n === 0) return { error: 'مجموع فراوانی‌ها صفر است.' };
  
  const isSample = n > 1 && n < 30;
  const variance_n = isSample ? n - 1 : n;
  if (isSample && n < 2) return { error: 'حداقل به دو داده برای محاسبه واریانس نمونه نیاز است.'}

  let cumulativeFrequency = 0;
  const fullTable = table.map(row => {
    cumulativeFrequency += row.frequency;
    return { ...row, cumulativeFrequency };
  });
  
  // Mean
  const sumFx = fullTable.reduce((sum, row) => sum + row.frequency * row.midpoint, 0);
  const mean = sumFx / n;

  // Median
  const medianClassIndex = fullTable.findIndex(row => row.cumulativeFrequency >= n / 2);
  const medianClass = fullTable[medianClassIndex];
  const Lm = medianClass.lower;
  const F_prev = medianClassIndex > 0 ? fullTable[medianClassIndex - 1].cumulativeFrequency : 0;
  const f_med = medianClass.frequency;
  const w = medianClass.upper - medianClass.lower;
  const median = f_med > 0 ? Lm + ((n / 2 - F_prev) / f_med) * w : Lm;

  // Mode
  const modeClassIndex = fullTable.reduce((maxIndex, row, i, arr) => arr[i].frequency > arr[maxIndex].frequency ? i : maxIndex, 0);
  const modeClass = fullTable[modeClassIndex];
  const L_M = modeClass.lower;
  const d1 = modeClass.frequency - (fullTable[modeClassIndex - 1]?.frequency || 0);
  const d2 = modeClass.frequency - (fullTable[modeClassIndex + 1]?.frequency || 0);
  const mode = (d1 + d2) > 0 ? L_M + (d1 / (d1 + d2)) * w : L_M;
  
  // Variance
  const sum_f_x_minus_x_bar_sq = fullTable.reduce((sum, row) => sum + row.frequency * Math.pow(row.midpoint - mean, 2), 0);
  const variance = sum_f_x_minus_x_bar_sq / variance_n;

  // Standard Deviation
  const stdDev = Math.sqrt(variance);

  // Range
  const minVal = data.length > 0 ? data[0].lower : 0;
  const maxVal = data.length > 0 ? data[data.length -1].upper : 0;
  const range = maxVal - minVal;

  // Coefficient of Variation
  const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

  return {
    mean: {
      value: mean,
      formula: { 
          expression: 'x̄ = Σ(fi * xi) / n', 
          parts: { numerator: sumFx.toFixed(2), denominator: n, result: mean.toFixed(3) } 
        },
    },
    median: {
      value: median,
      formula: { 
          expression: 'm = Lm + [((n/2) - F) / fm] * w', 
          calculation: `${Lm} + [(${n/2} - ${F_prev}) / ${f_med}] * ${w} = ${median.toFixed(3)}` 
        },
    },
    mode: {
      value: [mode],
      formula: { 
          expression: 'M = Lм + [d1 / (d1+d2)] * w', 
          calculation: `${L_M} + [${d1} / (${d1}+${d2})] * ${w} = ${mode.toFixed(3)}` 
        },
    },
    variance: {
      value: variance,
      formula: { 
          expression: isSample ? 'S² = Σ(fi * (xi - x̄)²) / (n-1)' : 'σ² = Σ(fi * (xi - x̄)²) / n', 
          parts: { numerator: sum_f_x_minus_x_bar_sq.toFixed(2), denominator: variance_n, result: variance.toFixed(3) }
      },
    },
    stdDev: {
        value: stdDev,
        formula: {
            expression: isSample ? "S = √S²" : "σ = √σ²",
            calculation: `√${variance.toFixed(3)} = ${stdDev.toFixed(3)}`
        }
    },
    range: {
        value: range,
        formula: { 
            expression: 'R = Max(upper) - Min(lower)', 
            calculation: `${maxVal} - ${minVal} = ${range}` 
        }
    },
    cv: {
        value: cv,
        formula: {
            expression: 'CV = (S / |x̄|) * 100',
            calculation: `(${stdDev.toFixed(3)} / |${mean.toFixed(3)}|) * 100 = ${cv.toFixed(2)}%`
        }
    }
  };
};


export function useStatistics(data: RawData | GroupedData): StatisticsResult | { error: string } {
  return useMemo(() => {
    try {
      if (!data || !data.type) {
         return { error: 'داده‌ای برای تحلیل وجود ندارد.' };
      }
      if (data.type === 'raw') {
        return calcRaw(data.values) as StatisticsResult;
      }
      if (data.type === 'grouped') {
        return calcGrouped(data.values) as StatisticsResult;
      }
      return { error: 'نوع داده نامعتبر است.' };
    } catch (e: any) {
       console.error("Statistics calculation error:", e);
       return { error: e.message || 'خطا در محاسبات آماری.' };
    }
  }, [data]);
}
