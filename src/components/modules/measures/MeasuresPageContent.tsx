
'use client';

import React from 'react';
import { MeasuresDataInput } from '@/components/modules/measures/MeasuresDataInput';
import { MeasuresResults } from '@/components/modules/measures/MeasuresResults';
import { useStatistics, RawData, GroupedData } from '@/hooks/use-statistics';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function MeasuresPageContent() {
  const [data, setData] = React.useState<RawData | GroupedData>({ type: 'raw', values: [] });
  
  const stats = useStatistics(data);

  const analysisAvailable = stats && !stats.error;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <header className="text-right">
        <h1 className="text-4xl font-bold text-gradient">شاخص‌های مرکزی و پراکندگی</h1>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <MeasuresDataInput onAnalyze={setData} />
        </div>
        
        <div className="lg:col-span-8">
          {analysisAvailable ? (
            <MeasuresResults stats={stats} />
          ) : (
            <Card className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-white/10 bg-transparent shadow-none">
              <CardContent className="text-center p-10">
                 <BarChart3 className="mx-auto h-16 w-16 text-slate-500 opacity-20" />
                 <h3 className="mt-4 text-lg font-bold text-slate-300">
                    {stats.error 
                      ? `خطا: ${stats.error}`
                      : "آماده برای محاسبه"
                    }
                 </h3>
                 <p className="mt-2 text-sm text-slate-500">
                   {!stats.error && "برای محاسبه شاخص‌ها، داده‌های خود را در پنل سمت راست وارد کنید."}
                 </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
