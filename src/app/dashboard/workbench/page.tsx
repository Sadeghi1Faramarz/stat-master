
'use client';

import React, { useState } from 'react';
import { useStatsEngine } from '@/hooks/use-stats-engine';
import { DataInputPanel } from '@/components/modules/workbench/DataInputPanel';
import { StatsSummaryWidget } from '@/components/modules/workbench/StatsSummaryWidget';
import { ChartWidget } from '@/components/modules/workbench/ChartWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { DataTransformer } from '@/components/modules/workbench/DataTransformer';
import { DistributionWidget } from '@/components/modules/workbench/DistributionWidget';
import { PercentileWidget } from '@/components/modules/workbench/PercentileWidget';
import { DistributionSuite } from '@/components/modules/workbench/DistributionSuite';

export default function WorkbenchPage() {
  const [rawData, setRawData] = useState('18.5, 14, 17, 12, 19, 20, 11.5, 15, 16, 13, 17.5, 18, 10, 9, 14.5, 19.5, 12.5, 8, 16.5, 15.5');
  const [isSample, setIsSample] = useState(false);
  
  const engineResult = useStatsEngine(rawData, isSample);

  const rawNumbers = React.useMemo(() => {
    return rawData.split(/[\s,]+/).filter(n => n.trim() !== '').map(Number).filter(n => !isNaN(n));
  }, [rawData]);
  
  const handleOutlierRemoval = () => {
    if (!engineResult || engineResult.outliers.length === 0) return;
    const outlierSet = new Set(engineResult.outliers);
    const cleanedData = rawNumbers.filter(n => !outlierSet.has(n));
    setRawData(cleanedData.join(', '));
  }

  return (
    <div dir="rtl" className="min-h-screen w-full flex flex-col lg:flex-row gap-6 p-4 md:p-6">
      
      {/* Right Sidebar */}
      <aside className="w-full lg:w-96 lg:h-fit lg:sticky lg:top-24 flex flex-col gap-6">
        <DataInputPanel 
          value={rawData} 
          onValueChange={setRawData}
          isSample={isSample}
          setIsSample={setIsSample}
          onRemoveOutliers={handleOutlierRemoval}
          outlierCount={engineResult?.outliers.length ?? 0}
          validDataCount={rawNumbers.length}
        />
        {engineResult && <DataTransformer onTransform={setRawData} rawData={rawNumbers} />}
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 min-w-0">
        {engineResult ? (
          <div className="flex flex-col gap-6">
            <ChartWidget data={engineResult.histogramData} />
            <StatsSummaryWidget stats={engineResult.stats} numClasses={engineResult.numClasses} classWidth={engineResult.classWidth} />
            <DistributionWidget engineResult={engineResult} />
            <PercentileWidget engineResult={engineResult} />
            <DistributionSuite engineResult={engineResult} />
          </div>
        ) : (
          <Card className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-white/10 bg-transparent shadow-none">
            <CardContent className="text-center p-10">
              <BarChart3 className="mx-auto h-16 w-16 text-slate-500 opacity-20" />
              <h3 className="mt-4 text-lg font-bold text-slate-300">
                داده کافی برای تحلیل وجود ندارد
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                حداقل ۲ داده عددی برای شروع محاسبات وارد کنید.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

    </div>
  );
}
