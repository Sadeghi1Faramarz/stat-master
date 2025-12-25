
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatsEngineResult } from '@/hooks/use-stats-engine';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

type PercentileWidgetProps = {
  engineResult: StatsEngineResult;
};

const calculatePercentile = (sortedData: number[], p: number): number => {
    if (p < 0 || p > 100) return NaN;
    if (sortedData.length === 0) return 0;
    if (p === 0) return sortedData[0];
    if (p === 100) return sortedData[sortedData.length - 1];

    const n = sortedData.length;
    // Using the linear interpolation method (as used by Excel's PERCENTILE.INC and NumPy)
    const index = (p / 100) * (n - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const fraction = index - lowerIndex;

    if (lowerIndex === upperIndex) {
        return sortedData[lowerIndex];
    }
    
    return sortedData[lowerIndex] + (sortedData[upperIndex] - sortedData[lowerIndex]) * fraction;
};

const AreaEstimator = ({ sortedData }: { sortedData: number[] }) => {
    const [min, setMin] = useState(sortedData.length > 0 ? sortedData[0] : 0);
    const [max, setMax] = useState(sortedData.length > 0 ? sortedData[sortedData.length-1] : 100);

    const percentageInRange = useMemo(() => {
        if (sortedData.length === 0) return 0;
        const count = sortedData.filter(d => d >= min && d <= max).length;
        return (count / sortedData.length) * 100;
    }, [sortedData, min, max]);

    return (
        <div className="space-y-4">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-2">
                    <label htmlFor="range-min-input" className="text-sm font-medium text-slate-300">
                        حداقل بازه
                    </label>
                    <Input
                        id="range-min-input"
                        type="number"
                        value={min}
                        onChange={(e) => setMin(parseFloat(e.target.value))}
                        className="bg-slate-900/50 border-white/10 font-mono text-lg"
                    />
                </div>
                 <div className="flex-1 w-full space-y-2">
                    <label htmlFor="range-max-input" className="text-sm font-medium text-slate-300">
                        حداکثر بازه
                    </label>
                    <Input
                        id="range-max-input"
                        type="number"
                        value={max}
                        onChange={(e) => setMax(parseFloat(e.target.value))}
                        className="bg-slate-900/50 border-white/10 font-mono text-lg"
                    />
                </div>
            </div>
             <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
                <p className="text-slate-400">
                    درصد داده‌های بین <span className="font-bold text-cyan-400">{min}</span> و <span className="font-bold text-cyan-400">{max}</span>:
                </p>
                <p className="text-4xl font-bold text-white font-mono tabular-nums mt-2">
                    {percentageInRange.toFixed(1)}%
                </p>
             </div>
        </div>
    );
};


export function PercentileWidget({ engineResult }: PercentileWidgetProps) {
  const [percentile, setPercentile] = useState(50);
  const [inputValue, setInputValue] = useState("50");
  
  const { sortedData, frequencyTable, stats } = engineResult;

  const percentileValue = useMemo(() => {
    if (sortedData.length === 0) return null;
    return calculatePercentile(sortedData, percentile);
  }, [sortedData, percentile]);

  const ogiveData = useMemo(() => {
     if (frequencyTable.length === 0 || stats.count.value === 0) return [];
     
     const n = stats.count.value as number;
     
     const data = frequencyTable.map(row => ({
        value: row.classLimits.upper,
        cumulativePercent: (row.cumulativeFrequency / n) * 100
     }));

     // Add a starting point for the Ogive chart at 0%
     return [{ value: frequencyTable[0].classLimits.lower, cumulativePercent: 0 }, ...data];
  }, [frequencyTable, stats.count.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setPercentile(numValue);
    }
  };

  const setQuickPercentile = (p: number) => {
    setPercentile(p);
    setInputValue(String(p));
  };
  

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>📈 صدک‌ها و تجمع</CardTitle>
        <CardDescription>جایگاه داده‌های خود را در توزیع پیدا کنید.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">ماشین‌حساب صدک</TabsTrigger>
            <TabsTrigger value="estimator">تخمین‌گر بازه</TabsTrigger>
            <TabsTrigger value="ogive">نمودار تجمعی (Ogive)</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator" className="pt-6 text-right">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-2">
                    <label htmlFor="percentile-input" className="text-sm font-medium text-slate-300">
                        صدک مورد نظر (۰ تا ۱۰۰)
                    </label>
                    <Input
                        id="percentile-input"
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="bg-slate-900/50 border-white/10 font-mono text-lg"
                    />
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setQuickPercentile(25)}>Q1 (۲۵)</Button>
                    <Button variant="outline" onClick={() => setQuickPercentile(50)}>میانه (۵۰)</Button>
                    <Button variant="outline" onClick={() => setQuickPercentile(75)}>Q3 (۷۵)</Button>
                </div>
            </div>
            {percentileValue !== null && (
                 <div className="mt-6 p-4 bg-secondary rounded-lg text-center">
                    <p className="text-slate-400">
                        مقدار صدک <span className="font-bold text-cyan-400">{percentile}</span> برابر است با:
                    </p>
                    <p className="text-4xl font-bold text-white font-mono tabular-nums mt-2">
                        {percentileValue.toFixed(2)}
                    </p>
                 </div>
            )}
          </TabsContent>
          <TabsContent value="estimator" className="pt-6 text-right">
            <AreaEstimator sortedData={sortedData} />
          </TabsContent>
          <TabsContent value="ogive" className="pt-6 h-80">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={ogiveData}
                margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
              >
                <defs>
                    <linearGradient id="ogiveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" />
                <XAxis dataKey="value" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} name="مقدار">
                  <Label value="مقادیر داده" offset={-20} position="insideBottom" fill="hsl(var(--foreground))" />
                </XAxis>
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} name="درصد تجمعی" tickFormatter={(v) => `${v}%`}>
                   <Label value="درصد تجمعی" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="hsl(var(--foreground))" />
                </YAxis>
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border) / 0.2)',
                        color: 'hsl(var(--popover-foreground))',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "درصد تجمعی"]}
                />
                <Area type="monotone" dataKey="cumulativePercent" stroke="#8b5cf6" fill="url(#ogiveFill)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
