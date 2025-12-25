
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices, RotateCw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, ReferenceLine, Label, Cell, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

const DicePip = ({ isVisible }: { isVisible: boolean }) => (
  <motion.div 
    className="w-full h-full bg-slate-800 rounded-full" 
    initial={{ scale: 0 }}
    animate={{ scale: isVisible ? 1 : 0 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  />
);

const pipsForFace: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};


const Dice2D = ({ value, isRolling }: { value: number, isRolling: boolean }) => {
    const visiblePips = useMemo(() => new Set(pipsForFace[value]), [value]);

    return (
         <motion.div
            className="w-32 h-32 bg-white rounded-2xl shadow-lg p-4 border border-slate-200"
            animate={isRolling ? 'rolling' : 'still'}
            variants={{
                rolling: { 
                    rotate: [0, 360, -360, 0], 
                    scale: [1, 0.8, 1.2, 1],
                    transition: { duration: 1, ease: "easeInOut" }
                },
                still: { rotate: 0, scale: 1 }
            }}
        >
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                    <DicePip key={i} isVisible={!isRolling && visiblePips.has(i)} />
                ))}
            </div>
        </motion.div>
    )
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

export function ExperimentsTab() {
  const [history, setHistory] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<number>(1);

  const rollDice = (times = 1) => {
    if (isRolling) return;
    setIsRolling(true);

    let rolls: number[] = [];
    for (let i = 0; i < times; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    
    // Set a random roll for the animation to look at first
    setCurrentRoll(Math.floor(Math.random() * 6) + 1);

    setTimeout(() => {
      setHistory(prev => [...rolls, ...prev]);
      setCurrentRoll(rolls[0]);
      setIsRolling(false);
    }, 1000);
  };
  
  const reset = () => {
    setHistory([]);
    setCurrentRoll(1);
  };
  
  const analysisData = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    history.forEach(roll => {
      counts[roll]++;
    });

    const total = history.length;
    if (total === 0) {
      return Array.from({ length: 6 }, (_, i) => ({ face: i + 1, count: 0, percentage: 0 }));
    }

    return Object.entries(counts).map(([face, count]) => ({
      face: Number(face),
      count: count,
      percentage: (count / total) * 100,
    }));
  }, [history]);

  const convergenceData = useMemo(() => {
    let sixCount = 0;
    const data = history.slice().reverse().map((roll, index) => {
        if (roll === 6) {
            sixCount++;
        }
        return {
            rollNumber: index + 1,
            probability: (sixCount / (index + 1)) * 100
        };
    });
    // To keep the chart performant, we can sample the data for large histories
    if (data.length > 200) {
        const sampledData = [];
        const step = Math.floor(data.length / 200);
        for (let i = 0; i < data.length; i += step) {
            sampledData.push(data[i]);
        }
        return sampledData;
    }
    return data;
  }, [history]);

  const recentHistory = useMemo(() => history.slice(0, 10), [history]);
  const theoreticalCount = history.length / 6;
  const THEORETICAL_PROBABILITY = (1/6) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-3 glassmorphism rounded-lg text-right shadow-lg border border-white/10">
                <p className="font-bold text-white mb-2">نتیجه: {label}</p>
                <p className="text-sm text-slate-300">تعداد مشاهده شده: <span className="font-bold">{payload[0].value}</span></p>
                <p className="text-sm text-slate-400">تعداد مورد انتظار: <span className="font-bold">{theoreticalCount.toFixed(2)}</span></p>
            </div>
        );
    }
    return null;
  };
  
    const ConvergenceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 glassmorphism rounded-lg text-right shadow-lg border border-white/10">
                <p className="font-bold text-white mb-2">پرتاب شماره: {label}</p>
                <p className="text-sm text-slate-300">احتمال تجربی: <span className="font-bold text-blue-400">{payload[0].value.toFixed(2)}%</span></p>
                <p className="text-sm text-slate-400">احتمال نظری: <span className="font-bold text-red-400">{THEORETICAL_PROBABILITY.toFixed(2)}%</span></p>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <Card className="glassmorphism text-center">
        <CardHeader>
          <CardTitle className="text-2xl">آزمایشگاه پرتاب تاس</CardTitle>
          <CardDescription>
            قانون اعداد بزرگ را تجربه کنید. هر چه بیشتر پرتاب کنید، نتایج به احتمال واقعی (۱/۶ یا ۱۶.۷٪) نزدیک‌تر می‌شوند.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-[350px]">
          <Dice2D value={currentRoll} isRolling={isRolling} />
          <div className="flex flex-col items-center justify-center gap-3">
            <Button onClick={() => rollDice(1)} size="lg" className="w-48 bg-green-600 hover:bg-green-700" disabled={isRolling}>
              <Dices className="ml-2" />
              پرتاب تکی
            </Button>
             <Button onClick={() => rollDice(100)} variant="outline" size="lg" className="w-48" disabled={isRolling}>
              پرتاب ۱۰۰ تایی
            </Button>
            <Button onClick={reset} variant="ghost" size="sm" className="text-slate-400 hover:text-white" disabled={isRolling}>
              <RotateCw className="ml-2" />
              شروع مجدد
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="glassmorphism w-full">
          <CardHeader>
            <CardTitle>تاریخچه</CardTitle>
            <CardDescription>۱۰ پرتاب آخر نمایش داده می‌شود.</CardDescription>
          </CardHeader>
          <CardContent className="h-24 w-full flex items-center justify-start overflow-x-auto pb-4">
            <AnimatePresence>
              <div className="flex flex-row-reverse gap-3 flex-nowrap">
                {recentHistory.map((roll, i) => (
                  <motion.div
                    key={`${roll}-${history.length - i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="w-10 h-10 bg-white/80 text-slate-800 rounded-md flex items-center justify-center font-bold text-xl shadow shrink-0"
                  >
                    {roll}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
            {history.length === 0 && <p className="text-slate-400 w-full text-center">تاریخچه‌ای وجود ندارد.</p>}
          </CardContent>
        </Card>

        <Card className="glassmorphism w-full">
          <CardHeader>
            <CardTitle>تحلیل فراوانی</CardTitle>
            <CardDescription>فراوانی هر نتیجه (تعداد کل پرتاب‌ها: {history.length})</CardDescription>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="face" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--secondary) / 0.5)' }}
                  content={<CustomTooltip />}
                />
                {history.length > 0 && (
                  <ReferenceLine y={theoreticalCount} strokeDasharray="3 3" strokeWidth={2} stroke="hsl(var(--destructive) / 0.8)">
                    <Label 
                        value="احتمال نظری (۱/۶)" 
                        position="insideTopRight" 
                        fill="hsl(var(--destructive))"
                        className="text-xs"
                        offset={10}
                    />
                  </ReferenceLine>
                )}
                <Bar dataKey="count" name="تعداد" radius={[4, 4, 0, 0]}>
                   <LabelList 
                     dataKey="percentage" 
                     position="top" 
                     formatter={(value: number) => value > 0 ? `${value.toFixed(1)}%` : ''}
                     className="fill-slate-200 text-xs"
                   />
                   {analysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       {history.length > 1 && (
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-end">
                    نمودار همگرایی (قانون اعداد بزرگ)
                    <TrendingUp className="text-blue-400"/>
                </CardTitle>
                <CardDescription className="text-right">
                    این نمودار نشان می‌دهد که چطور احتمال تجربی مشاهده عدد ۶ با افزایش تعداد پرتاب‌ها به احتمال نظری (۱۶.۷٪) نزدیک می‌شود.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={convergenceData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" />
                        <XAxis 
                            dataKey="rollNumber" 
                            stroke="hsl(var(--muted-foreground))" 
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            type="number"
                            domain={['dataMin', 'dataMax']}
                        >
                            <Label value="تعداد پرتاب" offset={-15} position="insideBottom" fill="hsl(var(--foreground))" />
                        </XAxis>
                        <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        >
                            <Label value="احتمال" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="hsl(var(--foreground))" />
                        </YAxis>
                        <Tooltip content={<ConvergenceTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }} />
                        
                        <Line 
                            type="monotone" 
                            dataKey="probability"
                            name="احتمال تجربی (عدد ۶)" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={false}
                        />
                        <ReferenceLine 
                            y={THEORETICAL_PROBABILITY} 
                            stroke="hsl(var(--destructive))" 
                            strokeDasharray="4 4" 
                            strokeWidth={2}
                        >
                            <Label value={`نظری: ${THEORETICAL_PROBABILITY.toFixed(1)}%`} position="top" fill="hsl(var(--destructive))" fontSize={12} />
                        </ReferenceLine>

                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      )}

    </div>
  );
}

    