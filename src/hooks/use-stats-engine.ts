
'use client';

import { useMemo } from 'react';

// --- Type Definitions ---

export interface ClassData {
  classLimits: { lower: number; upper: number };
  midpoint: number;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
}

export interface HistogramData {
  name: string; // Midpoint as a string
  frequency: number;
}

export interface Statistic {
  value: any;
  label: string;
}

export interface Quartiles {
    q1: number;
    q3: number;
    iqr: number;
}

export interface StatsEngineResult {
  stats: {
    mean: Statistic;
    median: Statistic;
    mode: Statistic;
    variance: Statistic;
    stdDev: Statistic;
    range: Statistic;
    cv: Statistic;
    count: Statistic;
    min: Statistic;
    max: Statistic;
    skewness: Statistic;
  };
  quartiles: Quartiles;
  outliers: number[];
  sortedData: number[];
  frequencyTable: ClassData[];
  histogramData: HistogramData[];
  numClasses: number;
  classWidth: number;
  error: string | null;
}

// --- Helper Functions ---

const parseRawData = (input: string): number[] => {
  return input
    .split(/[\s,]+/)
    .filter(n => n.trim() !== '')
    .map(Number)
    .filter(n => !isNaN(n));
};

const calculateSturges = (n: number): number => {
  if (n === 0) return 0;
  return Math.round(1 + 3.322 * Math.log10(n));
};

const getQuartiles = (sortedData: number[]): { q1: number, q3: number } => {
    const n = sortedData.length;
    if (n === 0) return { q1: 0, q3: 0};
    
    const getVal = (p: number) => {
        const pos = p * (n - 1);
        const base = Math.floor(pos);
        const rest = pos - base;
        if (sortedData[base + 1] !== undefined) {
             return sortedData[base] + rest * (sortedData[base + 1] - sortedData[base]);
        }
        return sortedData[base];
    };
    
    return { q1: getVal(0.25), q3: getVal(0.75) };
}


// --- Main Hook ---

export function useStatsEngine(rawData?: string, isSample?: boolean): StatsEngineResult | null {
  return useMemo(() => {
    const data = parseRawData(rawData || '');

    if (data.length < 2) {
      return null;
    }

    // --- Core Statistics Calculation ---
    const n = data.length;
    const variance_n = isSample ? n - 1 : n;
    
    if (isSample && n < 2) return null; // Cannot calculate sample variance with < 2 items

    const sortedData = [...data].sort((a, b) => a - b);
    
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    let median: number;
    if (n % 2 === 0) {
      median = (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
    } else {
      median = sortedData[Math.floor(n / 2)];
    }

    const frequencyMap: { [key: number]: number } = {};
    data.forEach(num => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
    let maxFreq = 0;
    Object.values(frequencyMap).forEach(freq => {
        if (freq > maxFreq) maxFreq = freq;
    });

    let mode: number[] = [];
    if (maxFreq > 1 && !Object.values(frequencyMap).every(freq => freq === maxFreq)) {
        for (const num in frequencyMap) {
            if (frequencyMap[num] === maxFreq) mode.push(Number(num));
        }
    }

    const varianceSum = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const variance = varianceSum / variance_n;
    const stdDev = Math.sqrt(variance);
    const minVal = sortedData[0];
    const maxVal = sortedData[sortedData.length - 1];
    const range = maxVal - minVal;
    
    // --- Advanced Analytics ---
    const { q1, q3 } = getQuartiles(sortedData);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = data.filter(d => d < lowerBound || d > upperBound);
    
    // Pearson's second skewness coefficient
    const skewness = stdDev > 0 ? (3 * (mean - median)) / stdDev : 0;
    
    // Coefficient of Variation
    const cv = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;


    // --- Frequency Distribution Calculation ---
    const rangeFreq = maxVal - minVal;
    const numClasses = calculateSturges(n);
    
    if (rangeFreq === 0 || numClasses === 0) {
        return {
            stats: {
                mean: { label: 'میانگین', value: mean.toFixed(2) },
                median: { label: 'میانه', value: median.toFixed(2) },
                mode: { label: 'مد', value: mode.length > 0 ? mode.join(', ') : 'ندارد' },
                variance: { label: isSample ? 'واریانس نمونه' : 'واریانس جامعه', value: variance.toFixed(2) },
                stdDev: { label: 'انحراف معیار', value: stdDev.toFixed(2) },
                range: { label: 'دامنه', value: range.toFixed(2) },
                cv: { label: 'ضریب تغییرات', value: cv.toFixed(2) },
                count: { label: 'تعداد داده', value: n },
                min: { label: 'حداقل', value: minVal.toFixed(2) },
                max: { label: 'حداکثر', value: maxVal.toFixed(2) },
                skewness: { label: 'چولگی', value: skewness.toFixed(2) },
            },
            quartiles: { q1, q3, iqr },
            outliers,
            sortedData,
            frequencyTable: [],
            histogramData: [],
            numClasses: 0,
            classWidth: 0,
            error: "داده‌ها یکسان هستند، جدول فراوانی تشکیل نمی‌شود.",
        };
    }

    const classWidth = Math.ceil(rangeFreq / numClasses);
    let cumulativeFrequency = 0;
    const frequencyTable: ClassData[] = Array.from({ length: numClasses }).map((_, i) => {
        const lowerBound = minVal + i * classWidth;
        const upperBound = minVal + (i + 1) * classWidth;
        
        const frequency = (i === numClasses - 1)
            ? data.filter(d => d >= lowerBound && d <= upperBound).length
            : data.filter(d => d >= lowerBound && d < upperBound).length;

        cumulativeFrequency += frequency;
        
        return {
            classLimits: { lower: lowerBound, upper: upperBound },
            midpoint: (lowerBound + upperBound) / 2,
            frequency,
            relativeFrequency: frequency / n,
            cumulativeFrequency,
        };
    });

    const histogramData = frequencyTable.map(row => ({
      name: row.midpoint.toFixed(1),
      frequency: row.frequency,
    }));


    return {
      stats: {
        mean: { label: 'میانگین', value: mean.toFixed(2) },
        median: { label: 'میانه', value: median.toFixed(2) },
        mode: { label: 'مد', value: mode.length > 0 ? mode.join(', ') : 'ندارد' },
        variance: { label: isSample ? 'واریانس نمونه' : 'واریانس جامعه', value: variance.toFixed(2) },
        stdDev: { label: 'انحراف معیار', value: stdDev.toFixed(2) },
        range: { label: 'دامنه', value: range.toFixed(2) },
        cv: { label: 'ضریب تغییرات', value: cv.toFixed(1) + '%' },
        count: { label: 'تعداد داده', value: n },
        min: { label: 'حداقل', value: minVal.toFixed(2) },
        max: { label: 'حداکثر', value: maxVal.toFixed(2) },
        skewness: { label: 'چولگی', value: skewness.toFixed(2) },
      },
      quartiles: { q1, q3, iqr },
      outliers,
      sortedData,
      frequencyTable,
      histogramData,
      numClasses,
      classWidth,
      error: null,
    };
  }, [rawData, isSample]);
}
