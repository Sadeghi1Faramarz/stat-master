
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { StatsEngineResult } from '@/hooks/use-stats-engine';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type DistributionSuiteProps = {
  engineResult: StatsEngineResult;
};

const FiveNumberSummary = ({ stats, quartiles }: { stats: StatsEngineResult['stats'], quartiles: StatsEngineResult['quartiles'] }) => {
    const summary = [
        { label: 'حداقل', value: stats.min.value },
        { label: 'چارک اول (Q1)', value: quartiles.q1.toFixed(2) },
        { label: 'میانه', value: stats.median.value },
        { label: 'چارک سوم (Q3)', value: quartiles.q3.toFixed(2) },
        { label: 'حداکثر', value: stats.max.value },
    ];
    return (
        <Card className="glassmorphism h-full">
            <CardHeader>
                <CardTitle>خلاصه ۵ عددی</CardTitle>
                <CardDescription>نمای کلی از پراکندگی داده‌ها.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-stretch bg-secondary p-3 rounded-lg text-center gap-2">
                    {summary.map((item, index) => (
                        <div key={item.label} className={cn(
                            "flex-1 flex flex-col justify-center p-2", 
                            index < summary.length - 1 && "md:border-l md:border-r-0 border-b md:border-b-0 border-white/10"
                        )}>
                            <p className="text-xs text-slate-400">{item.label}</p>
                            <p className="text-lg font-bold text-white font-mono tabular-nums">{item.value}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

const StemAndLeafPlot = ({ data }: { data: number[] }) => {
    const plot = useMemo(() => {
        const stems: Record<string, number[]> = {};
        const sortedData = data.map(n => Math.round(n)).sort((a, b) => a - b);

        sortedData.forEach(num => {
            const stem = Math.floor(num / 10);
            const leaf = num % 10;
            if (!stems[stem]) {
                stems[stem] = [];
            }
            stems[stem].push(leaf);
        });

        return Object.entries(stems).map(([stem, leaves]) => ({
            stem: parseInt(stem),
            leaves: leaves.sort((a,b)=>a-b).join(' '),
        }));
    }, [data]);

    return (
        <Card className="glassmorphism h-full">
            <CardHeader>
                <CardTitle>نمودار ساقه و برگ</CardTitle>
                <CardDescription>نمایش توزیع داده‌ها به صورت متنی.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-40 w-full bg-slate-900/50 rounded-md p-4" dir="ltr">
                    <pre className="font-mono text-white text-left whitespace-pre-wrap">
                        {plot.map(({ stem, leaves }) => (
                            <div key={stem}>
                                <span className="text-cyan-400">{String(stem).padStart(2, ' ')}</span>
                                <span className="mx-2 border-r border-slate-500 pr-2"></span>
                                <span>{leaves}</span>
                            </div>
                        ))}
                         {plot.length === 0 && <span className="text-slate-500">داده کافی برای نمایش وجود ندارد.</span>}
                    </pre>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

const PercentileRank = ({ sortedData }: { sortedData: number[] }) => {
    const [value, setValue] = useState<number | null>(sortedData.length > 0 ? sortedData[Math.floor(sortedData.length / 2)] : null);

    const rank = useMemo(() => {
        if (value === null || sortedData.length === 0) return null;
        
        const countBelow = sortedData.filter(d => d < value).length;
        const countEqual = sortedData.filter(d => d === value).length;
        const n = sortedData.length;

        if (n === 0) return 0;
        
        const percentileRank = ((countBelow + 0.5 * countEqual) / n) * 100;
        return percentileRank;
    }, [value, sortedData]);

    return (
        <Card className="glassmorphism h-full">
            <CardHeader>
                <CardTitle>محاسبه‌گر رتبه درصدی</CardTitle>
                <CardDescription>جایگاه یک مقدار خاص در توزیع را بیابید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 text-right">
                    <Label htmlFor="rank-input" className="text-sm font-medium text-slate-300">
                        مقدار مورد نظر
                    </Label>
                    <Input
                        id="rank-input"
                        type="number"
                        value={value ?? ''}
                        onChange={(e) => setValue(parseFloat(e.target.value))}
                        className="bg-slate-900/50 border-white/10 font-mono text-lg"
                    />
                </div>
                {rank !== null && (
                    <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className="text-slate-400">
                            رتبه درصدی:
                        </p>
                        <p className="text-3xl font-bold text-white font-mono tabular-nums mt-1">
                            {rank.toFixed(1)}%
                        </p>
                         <p className="text-xs text-slate-500 mt-2">
                            این مقدار از {rank.toFixed(1)}% داده‌ها بزرگتر است.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


export function DistributionSuite({ engineResult }: DistributionSuiteProps) {
  const { stats, quartiles, sortedData } = engineResult;

  return (
    <div className="grid grid-cols-1 gap-6">
      <FiveNumberSummary stats={stats} quartiles={quartiles} />
      <StemAndLeafPlot data={sortedData} />
      <PercentileRank sortedData={sortedData} />
    </div>
  );
}
