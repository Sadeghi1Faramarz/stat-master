
'use client';

import React from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Label } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HistogramData } from '@/hooks/use-stats-engine';

type ChartWidgetProps = {
  data: HistogramData[];
};

export function ChartWidget({ data }: ChartWidgetProps) {
  return (
    <Card className="glassmorphism h-[450px]">
      <CardHeader>
        <CardTitle>نمودار هیستوگرام</CardTitle>
      </CardHeader>
      <CardContent className="h-full pb-12 pr-8">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
             <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" />
            <XAxis 
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                height={60}
                dy={10}
            >
              <Label value="مرکز طبقات" offset={-10} position="insideBottom" fill="hsl(var(--foreground))" />
            </XAxis>
            <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'فراوانی', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border) / 0.2)',
                    color: 'hsl(var(--popover-foreground))',
                    direction: 'rtl'
                }}
                cursor={{ fill: 'hsl(var(--secondary) / 0.5)' }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ color: 'white', direction: 'rtl', paddingTop: '20px', paddingBottom: '10px' }} />
            <Bar 
                dataKey="frequency" 
                name="فراوانی" 
                fill="url(#chartFill)" 
                radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
