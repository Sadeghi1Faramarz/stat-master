
'use client';

import React, { useState, useMemo } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label, ReferenceLine, ReferenceArea, Line } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label as SwitchLabel } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingDown, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StatisticsResult } from '@/hooks/use-statistics';

type HistogramDatum = {
  name: string; // Midpoint
  frequency: number;
};

type ChartsPanelProps = {
  data: HistogramDatum[];
  rawData: number[];
  stats: StatisticsResult;
  classWidth: number;
};

const CustomTooltip = ({ active, payload, label, totalCount, maxFreq }: any) => {
  if (active && payload && payload.length) {
    const mainPayload = payload.find(p => p.dataKey === 'frequency');
    if (!mainPayload) return null;

    const freq = mainPayload.value;
    const percentage = ((freq / totalCount) * 100).toFixed(1);
    const isMode = freq === maxFreq;
    const isLowDensity = freq <= totalCount * 0.05 && !isMode;
    
    let insight = null;
    if(isMode) {
      insight = <Badge variant="default" className="bg-amber-500/80 text-white border-amber-400"><Trophy className="ml-1 h-3 w-3" /> پرتکرارترین رده (مد)</Badge>;
    } else if (isLowDensity) {
      insight = <Badge variant="secondary" className="bg-slate-600/80"><TrendingDown className="ml-1 h-3 w-3" /> تراکم پایین</Badge>;
    }
    
    return (
      <div className="p-3 glassmorphism rounded-lg border border-white/10 text-white shadow-lg min-w-[200px] text-right">
        <p className="label font-bold mb-1">{`مرکز طبقه: ${label}`}</p>
        <div className="border-t border-white/10 my-2"/>
        <p className="text-sm">
            فراوانی: <span className="font-bold text-purple-300 tabular-nums">{freq}</span>
        </p>
         <p className="text-sm">
            درصد از کل: <span className="font-bold text-purple-300 tabular-nums">{percentage}%</span>
        </p>
        {insight && <div className="mt-3">{insight}</div>}
      </div>
    );
  }

  return null;
};

// Normal distribution PDF
const normalPDF = (x: number, mean: number, stdDev: number) => {
  if (stdDev === 0) return x === mean ? Infinity : 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  return coefficient * Math.exp(exponent);
};

export function ChartsPanel({ data, rawData, stats, classWidth }: ChartsPanelProps) {
  const [showRefLines, setShowRefLines] = useState(true);
  const [showNormalCurve, setShowNormalCurve] = useState(false);
  const [showBoxPlot, setShowBoxPlot] = useState(true);

  const maxFrequency = useMemo(() => Math.max(...data.map(d => d.frequency)), [data]);

  const chartData = useMemo(() => {
    if (!stats.mean || !stats.stdDev || !data) return [];
    
    const mean = stats.mean.value;
    const stdDev = stats.stdDev.value;
    const N = rawData.length;
    const w = classWidth;

    return data.map(item => {
      const x = parseFloat(item.name);
      const theoreticalFrequency = N * w * normalPDF(x, mean, stdDev);
      return {
        name: x,
        frequency: item.frequency,
        normalValue: theoreticalFrequency > 0.01 ? theoreticalFrequency : null, // Prevent tiny values
      };
    }).sort((a, b) => a.name - b.name);
  }, [data, stats, rawData.length, classWidth]);


  if (!data || data.length === 0) {
    return <p>داده‌ای برای رسم نمودار وجود ندارد.</p>;
  }

  const numericData = useMemo(() => {
    return data.map(item => ({
      name: parseFloat(item.name),
      frequency: item.frequency
    })).sort((a, b) => a.name - b.name);
  }, [data]);
  
  const yAxisDomain = [0, maxFrequency > 0 ? maxFrequency + 2 : 10];
  
  const currentClassWidth = numericData.length > 1 ? numericData[1].name - numericData[0].name : 10;
  
  const getQuartileStats = (d: number[]) => {
      const sorted = [...d].sort((a,b) => a-b);
      const q = (p: number) => {
          const pos = (sorted.length - 1) * p;
          const base = Math.floor(pos);
          const rest = pos - base;
          if (sorted[base + 1] !== undefined) {
              return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
          }
          return sorted[base];
      };
      return { min: sorted[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: sorted[sorted.length - 1] };
  };
  
  const boxPlotStats = useMemo(() => getQuartileStats(rawData), [rawData]);

  const xAxisDomain = [
    Math.min(boxPlotStats.min, Math.min(...numericData.map(d => d.name)) - currentClassWidth / 2),
    Math.max(boxPlotStats.max, Math.max(...numericData.map(d => d.name)) + currentClassWidth / 2),
  ];


  return (
    <div className="h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-center px-6 pt-4 pb-2 gap-4">
            <h3 className="text-lg font-bold text-white text-right w-full md:w-auto">نمودار توزیع داده‌ها</h3>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-end gap-4 md:gap-6 w-full md:w-auto"
            >
                <div className="flex items-center space-x-2" dir="ltr">
                    <SwitchLabel htmlFor="boxplot-switch">نمودار جعبه‌ای</SwitchLabel>
                    <Switch id="boxplot-switch" checked={showBoxPlot} onCheckedChange={setShowBoxPlot} />
                </div>
                <div className="flex items-center space-x-2" dir="ltr">
                    <SwitchLabel htmlFor="ref-lines-switch">شاخص‌ها</SwitchLabel>
                    <Switch id="ref-lines-switch" checked={showRefLines} onCheckedChange={setShowRefLines} />
                </div>
                <div className="flex items-center space-x-2" dir="ltr">
                    <SwitchLabel htmlFor="normal-curve-switch">منحنی نرمال</SwitchLabel>
                    <Switch id="normal-curve-switch" checked={showNormalCurve} onCheckedChange={setShowNormalCurve} />
                </div>
            </motion.div>
        </div>
        <div className="flex-1 -mt-2">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
                barGap={0}
                barCategoryGap="0%"
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" />
                <XAxis 
                    dataKey="name" 
                    type="number"
                    domain={xAxisDomain}
                    ticks={numericData.map(d => d.name)}
                    tickFormatter={(val) => val.toFixed(1)}
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', className: 'tabular-nums' }}
                    allowDuplicatedCategory={false}
                >
                    <Label value="مقادیر" offset={-20} position="insideBottom" fill="hsl(var(--foreground))" />
                </XAxis>
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" domain={yAxisDomain} tick={{ fill: 'hsl(var(--muted-foreground))', className: 'tabular-nums' }}>
                    <Label value="فراوانی" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="hsl(var(--foreground))" />
                </YAxis>
                <Tooltip content={<CustomTooltip totalCount={rawData.length} maxFreq={maxFrequency} />} cursor={{ fill: 'hsl(var(--secondary) / 0.5)' }} />
                <Legend wrapperStyle={{ color: 'white', direction: 'rtl', bottom: -5 }} />
                
                {showBoxPlot && (
                    <>
                        <ReferenceArea yAxisId="left" x1={boxPlotStats.q1} x2={boxPlotStats.q3} stroke="hsl(var(--primary))" strokeOpacity={0.8} fill="hsl(var(--primary) / 0.2)" />
                        <ReferenceLine yAxisId="left" x={boxPlotStats.min} stroke="hsl(var(--primary))" strokeWidth={2} >
                           <Label value={`Min: ${boxPlotStats.min.toFixed(1)}`} position="top" fill="hsl(var(--foreground))" fontSize={11} />
                        </ReferenceLine>
                         <ReferenceLine yAxisId="left" x={boxPlotStats.max} stroke="hsl(var(--primary))" strokeWidth={2} >
                           <Label value={`Max: ${boxPlotStats.max.toFixed(1)}`} position="top" fill="hsl(var(--foreground))" fontSize={11} />
                        </ReferenceLine>
                         <ReferenceLine yAxisId="left" x={boxPlotStats.median} stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="3 3">
                           <Label value={`Median: ${boxPlotStats.median.toFixed(1)}`} position="top" fill="hsl(var(--foreground))" fontSize={11} />
                        </ReferenceLine>
                    </>
                )}


                <Bar 
                    yAxisId="left"
                    dataKey="frequency" 
                    name="هیستوگرام" 
                    fill="url(#colorUv)" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    opacity={0.9}
                    zIndex={2}
                />
                
                {showNormalCurve && (
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="normalValue"
                        name="توزیع نرمال (تئوری)"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        dot={false}
                        activeDot={false}
                        zIndex={3}
                    />
                )}

                {showRefLines && (
                <>
                    <ReferenceArea
                        yAxisId="left"
                        x1={boxPlotStats.min}
                        x2={boxPlotStats.median}
                        stroke="hsl(var(--primary))"
                        strokeOpacity={0.5}
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                    >
                         <Label value="۵۰٪ داده‌ها" position="insideTop" fill="#8b5cf6" fontSize={12} />
                    </ReferenceArea>
                    <ReferenceLine yAxisId="left" x={stats.mean.value} stroke="#10B981" strokeDasharray="3 3" zIndex={4}>
                        <Label value={`میانگین: ${stats.mean.value.toFixed(2)}`} position="top" fill="#10B981" fontSize={12} className="tabular-nums" />
                    </ReferenceLine>
                    {stats.mode.value.map((m: number, i: number) => (
                        <ReferenceLine yAxisId="left" key={`mode-${i}`} x={m} stroke="#EC4899" strokeDasharray="3 3" zIndex={4}>
                            <Label value={`مد: ${m.toFixed(2)}`} position="insideTopRight" fill="#EC4899" fontSize={12} className="tabular-nums" />
                        </ReferenceLine>
                    ))}
                </>
                )}

            </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
