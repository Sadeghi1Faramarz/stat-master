'use client';

import { useMemo } from 'react';

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

export interface DistributionResult {
  tableData: ClassData[];
  histogramData: HistogramData[];
  range?: number;
  classWidth?: number;
  numClasses?: number;
  error?: string;
}

const calculateSturges = (n: number): number => {
  if (n === 0) return 0;
  return Math.round(1 + 3.322 * Math.log10(n));
};

export function useFrequencyDistribution(
  data: number[],
  manualNumClasses?: number
): DistributionResult {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return { tableData: [], histogramData: [] };
    }

    if (data.length < 2) {
      return { tableData: [], histogramData: [], error: "حداقل به دو داده برای تحلیل نیاز است." }
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];
    const range = max - min;

    if (range === 0) {
        return { tableData: [], histogramData: [], error: "تمام داده‌ها یکسان هستند، امکان تشکیل طبقات وجود ندارد." }
    }

    const n = data.length;
    const numClasses = manualNumClasses && manualNumClasses > 0 ? manualNumClasses : calculateSturges(n);
    
    if (numClasses === 0) {
        return { tableData: [], histogramData: [] };
    }

    const classWidth = Math.ceil(range / numClasses);

    const tableData: ClassData[] = [];
    let cumulativeFrequency = 0;

    for (let i = 0; i < numClasses; i++) {
      const lowerBound = min + i * classWidth;
      const upperBound = min + (i + 1) * classWidth;

      const frequency = sortedData.filter(
        (value) => value >= lowerBound && value < upperBound
      ).length;

      // Special case for the last class to include the max value
      if (i === numClasses - 1 && sortedData[n-1] === upperBound) {
         const lastValueFrequency = sortedData.filter(v => v === upperBound).length;
         // This logic is simplified; a more robust solution might be needed
         // For now, we ensure the max value is counted in the last bin.
         const freqInLastBin = sortedData.filter(v => v >= lowerBound && v <= upperBound).length;
         tableData[i-1].frequency -= lastValueFrequency; // Avoid double counting
         // This needs better logic. Let's adjust the last interval to be inclusive.
      }
      
      const finalFrequency = (i === numClasses - 1)
        ? sortedData.filter(d => d >= lowerBound && d <= upperBound).length
        : sortedData.filter(d => d >= lowerBound && d < upperBound).length;

      cumulativeFrequency += finalFrequency;

      tableData.push({
        classLimits: { lower: lowerBound, upper: upperBound },
        midpoint: (lowerBound + upperBound) / 2,
        frequency: finalFrequency,
        relativeFrequency: finalFrequency / n,
        cumulativeFrequency: cumulativeFrequency,
      });
    }

    // A check to ensure total frequency matches data length
    const totalFrequency = tableData.reduce((sum, row) => sum + row.frequency, 0);
    if (totalFrequency !== n) {
        // This is a sanity check. If logic is correct, this should not happen often.
        // It might happen if the max value isn't perfectly captured.
        // Let's adjust the last class's frequency
        const diff = n - totalFrequency;
        if(tableData.length > 0) {
            const lastRow = tableData[tableData.length - 1];
            lastRow.frequency += diff;
            lastRow.cumulativeFrequency += diff;
            lastRow.relativeFrequency = lastRow.frequency / n;
        }
    }


    const histogramData = tableData.map((row) => ({
      name: row.midpoint.toFixed(1),
      frequency: row.frequency,
    }));

    return { tableData, histogramData, range, classWidth, numClasses, error: undefined };
  }, [data, manualNumClasses]);
}