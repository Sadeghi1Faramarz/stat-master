
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatsEngineResult } from '@/hooks/use-stats-engine';
import { Crown, Sigma, Columns, MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { glossary } from '@/lib/glossary-terms';

type StatsSummaryWidgetProps = {
  stats: StatsEngineResult['stats'];
  numClasses: number;
  classWidth: number;
};

const StatItem = ({ label, value, termKey }: { label: string, value: string, termKey: keyof typeof glossary }) => {
    const definition = glossary[termKey] || "توضیحی یافت نشد.";
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <div className="flex justify-between items-baseline cursor-help border-b border-white/5 py-2">
                      <dt className="text-sm text-slate-400">{label}</dt>
                      <dd className="text-xl font-bold font-mono text-white tabular-nums">{value}</dd>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-right">
                    <p>{definition}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export function StatsSummaryWidget({ stats, numClasses, classWidth }: StatsSummaryWidgetProps) {

  const centralMeasures = [
      { label: 'میانگین', value: parseFloat(stats.mean.value) },
      { label: 'میانه', value: parseFloat(stats.median.value) },
      { label: 'مد', value: parseFloat(stats.mode.value.split(',')[0] || 'NaN') },
  ];

  const validCentralMeasures = centralMeasures.filter(m => !isNaN(m.value));
  const maxCentralMeasure = validCentralMeasures.length > 0
    ? validCentralMeasures.reduce((max, current) => current.value > max.value ? current : max)
    : { label: '', value: -Infinity };

  const isModeNonExistent = stats.mode.value === 'ندارد';
  
  const structureStats = [
      { label: 'تعداد داده (N)', value: stats.count.value, icon: Sigma },
      { label: 'تعداد طبقات (K)', value: numClasses, icon: Columns },
      { label: 'عرض طبقات (W)', value: classWidth.toFixed(2), icon: MoveHorizontal }
  ]

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>خلاصه آمار</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
         <div className="grid grid-cols-3 gap-4 text-center">
            {structureStats.map(stat => (
                 <div key={stat.label} className="p-3 bg-secondary rounded-lg">
                    <stat.icon className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold font-mono text-white tabular-nums">{stat.value}</p>
                </div>
            ))}
        </div>

        <dl className="space-y-1">
          <StatItem label={stats.mean.label} value={stats.mean.value} termKey="mean" />
          <StatItem label={stats.median.label} value={stats.median.value} termKey="median" />
          <StatItem label={stats.mode.label} value={stats.mode.value} termKey="mode" />
          <StatItem label={stats.variance.label} value={stats.variance.value} termKey="variance" />
          <StatItem label={stats.stdDev.label} value={stats.stdDev.value} termKey="stdDev" />
          <StatItem label={stats.range.label} value={stats.range.value} termKey="range" />
          <StatItem label={stats.cv.label} value={stats.cv.value} termKey="cv" />
          <StatItem label={stats.skewness.label} value={stats.skewness.value} termKey="skewness" />
        </dl>
        
        <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm text-slate-300 mb-2 text-right">مقایسه شاخص‌های مرکزی:</h4>
             <TooltipProvider>
                <div className="flex justify-around items-center p-3 bg-secondary rounded-lg">
                    {centralMeasures.map(measure => (
                        <div key={measure.label} className="text-center">
                            <p className="text-xs text-slate-400">{measure.label}</p>
                            <p className={cn(
                                "text-lg font-bold font-mono",
                                measure.label === maxCentralMeasure.label && !isModeNonExistent ? 'text-amber-400' : 'text-white'
                            )}>
                                {(isModeNonExistent && measure.label === 'مد') 
                                    ? '-' 
                                    : measure.value.toFixed(2)
                                }
                                {measure.label === maxCentralMeasure.label && !isModeNonExistent && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Crown className="inline-block h-4 w-4 ml-1 text-amber-400 animate-pulse" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>بزرگترین شاخص مرکزی</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </TooltipProvider>
        </div>

      </CardContent>
    </Card>
  );
}
