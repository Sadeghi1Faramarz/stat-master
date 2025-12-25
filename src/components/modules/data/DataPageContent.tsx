
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FrequencyTable } from '@/components/modules/data/FrequencyTable';
import { useFrequencyDistribution, type ClassData, type HistogramData } from '@/hooks/use-frequency-distribution';
import { useStatistics, type RawData } from '@/hooks/use-statistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ExpandableCard } from '@/components/ui/ExpandableCard';

const ChartsPanel = dynamic(() => import('@/components/modules/data/ChartsPanel').then(mod => mod.ChartsPanel), {
  loading: () => <Skeleton className="h-[300px] md:h-[500px] w-full" />,
  ssr: false,
});

const DataInput = dynamic(() => import('@/components/modules/data/DataInput').then(mod => mod.DataInput), {
  loading: () => <Skeleton className="h-[700px] w-full" />,
  ssr: false,
});


// Helper function to reconstruct raw data from a frequency table
const reconstructRawData = (table: ClassData[]): number[] => {
  const MAX_ARRAY_SIZE = 10000; // Safety limit
  return table.flatMap(row => {
    // Validate frequency to prevent RangeError
    if (typeof row.frequency !== 'number' || !Number.isInteger(row.frequency) || row.frequency < 0 || row.frequency > MAX_ARRAY_SIZE) {
      return [];
    }
    return Array(row.frequency).fill(row.midpoint);
  });
};

export function DataPageContent() {
  const [rawData, setRawData] = useState<number[]>([]);
  const [numClasses, setNumClasses] = useState<number | undefined>(undefined);
  const [mode, setMode] = useState<'manual' | 'simulation'>('manual');
  
  // State for the editable table data
  const [tableData, setTableData] = useState<ClassData[]>([]);
  const [histogramData, setHistogramData] = useState<HistogramData[]>([]);
  const [chartRawData, setChartRawData] = useState<number[]>([]);
  
  const {
    tableData: initialTableData,
    histogramData: initialHistogramData,
    range,
    classWidth,
    error,
  } = useFrequencyDistribution(rawData, numClasses);
  
  // Calculate full statistics for the raw data
  const stats = useStatistics({ type: 'raw', values: chartRawData } as RawData);

  const isEditingTable = mode === 'manual';

  // Effect to initialize or update the table when rawData or its processing changes
  useEffect(() => {
    setTableData(initialTableData);
    setHistogramData(initialHistogramData);
    setChartRawData(rawData);
  }, [initialTableData, initialHistogramData, rawData]);

  // Effect to re-calculate charts when the user manually edits the frequency table
  useEffect(() => {
    if (isEditingTable) {
        // Recalculate histogram data from the current state of tableData
        const newHistogramData = tableData.map(row => ({
            name: row.midpoint.toFixed(1),
            frequency: row.frequency,
        }));
        setHistogramData(newHistogramData);

        // Reconstruct an approximate raw data set for statistical calculations in the chart
        const newRawData = reconstructRawData(tableData);
        setChartRawData(newRawData);
    }
  }, [tableData, isEditingTable]);

  const analysisAvailable = tableData.length > 0 && !error && 'mean' in stats;
  
  const EmptyState = () => (
    <Card className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-white/10 bg-transparent shadow-none">
      <CardContent className="text-center p-10">
        <BarChart3 className="mx-auto h-16 w-16 text-slate-500 opacity-20" />
        <h3 className="mt-4 text-lg font-bold text-slate-300 text-right">
          {error ? `خطا: ${error}` : "داده‌ای برای نمایش وجود ندارد"}
        </h3>
        <p className="mt-2 text-sm text-slate-500 text-right">
          {!error && "برای شروع تحلیل، لطفاً داده‌ها را در پنل سمت راست وارد کرده یا از داده‌های نمونه استفاده کنید."}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 text-right" dir="rtl">
       <header className="text-right">
        <h1 className="text-4xl font-bold text-gradient">سازماندهی و نمایش داده‌ها</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <DataInput 
            setData={setRawData} 
            setNumClasses={setNumClasses} 
            setMode={setMode} 
            currentMode={mode}
            dataCount={rawData.length}
          />
        </div>
        
        <div className="lg:col-span-8">
          {analysisAvailable ? (
            <div className="space-y-8">
                <ExpandableCard
                    title={<div className="text-right">نمودارهای آماری</div>}
                    contentClassName="h-[300px] md:h-[500px] p-0 pr-4"
                >
                    <ChartsPanel 
                        data={histogramData} 
                        rawData={chartRawData}
                        stats={stats}
                        classWidth={classWidth || 0}
                    />
                </ExpandableCard>

                 <ExpandableCard
                    title={<CardTitle className="text-right">جدول توزیع فراوانی</CardTitle>}
                    cardClassName='p-0'
                 >
                    <CardDescription className="text-right px-6 pb-4">
                      {isEditingTable 
                        ? 'مقادیر ستون فراوانی (fi) قابل ویرایش است. تغییرات شما مستقیماً روی نمودارها اعمال می‌شود.'
                        : 'خلاصه‌ای از نحوه توزیع داده‌ها در طبقات مختلف.'
                      }
                    </CardDescription>
                    <FrequencyTable 
                      data={tableData}
                      setData={setTableData}
                      isEditable={isEditingTable}
                      range={range} 
                      classWidth={classWidth} 
                      numClasses={tableData.length}
                    />
                 </ExpandableCard>
            </div>
          ) : (
             <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
