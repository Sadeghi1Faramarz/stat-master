
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { StatsEngineResult } from '@/hooks/use-stats-engine';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

type DistributionWidgetProps = {
  engineResult: StatsEngineResult;
};

const SkewnessBar = ({ value }: { value: number }) => {
    const skewValue = Math.max(-1, Math.min(1, value)); 
    const percentage = (skewValue + 1) / 2 * 100;
    
    let color = 'bg-green-500';
    if (value > 0.2) {
        color = 'bg-red-500'; // Right skew
    } else if (value < -0.2) {
        color = 'bg-amber-500'; // Left skew
    }

    return (
        <div className="w-full">
            <div className="h-3 w-full bg-secondary rounded-full relative overflow-hidden">
                <motion.div 
                    className="absolute h-full"
                    style={{ 
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: `${Math.abs(percentage-50)*2}%`,
                        ...(percentage > 50 ? { left: '50%' } : { right: '50%' })
                     }}
                    initial={{ scaleX: 0, originX: percentage > 50 ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className={cn("w-full h-full", color)} />
                </motion.div>
                 <div 
                    className="absolute top-0 bottom-0 w-px bg-white/50" 
                    style={{ left: '50%'}}
                />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                <span>چپ (منفی)</span>
                <span>متقارن</span>
                <span>راست (مثبت)</span>
            </div>
        </div>
    )
}

export function DistributionWidget({ engineResult }: DistributionWidgetProps) {
  const { outliers, stats } = engineResult;
  const skewness = parseFloat(stats.skewness.value);
  const cv = parseFloat(stats.cv.value);

  const getSkewnessLabel = (value: number) => {
    if (value > 0.5) return "چولگی به راست شدید";
    if (value > 0.1) return "چولگی به راست";
    if (value < -0.5) return "چولگی به چپ شدید";
    if (value < -0.1) return "چولگی به چپ";
    return "تقریبا متقارن";
  };
  
  const getCVColor = (value: number) => {
    if (value > 30) return 'hsl(var(--destructive))';
    if (value > 15) return '#f59e0b'; // amber-500
    return '#22c55e'; // green-500
  };
  
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>📊 تحلیل توزیع</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-slate-200 mb-3 text-right">داده‌های پرت (Outliers)</h3>
          {outliers.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-end">
              {outliers.map((o, i) => (
                <Badge key={i} variant="destructive" className="font-mono text-base">
                  {o.toFixed(2)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-400 text-right">✅ داده پرت قابل توجهی مشاهده نشد.</p>
          )}
        </div>
        
        <div className="border-t border-white/10 pt-4 space-y-2">
            <div className='flex justify-between items-center'>
                 <h3 className="text-base font-medium text-slate-200 text-right">شکل توزیع (چولگی)</h3>
                 <Badge variant="outline" className="font-mono text-base tabular-nums">{skewness.toFixed(2)}</Badge>
            </div>
            <p className='text-sm text-slate-400 text-right'>{getSkewnessLabel(skewness)}</p>
             <div className="mt-2">
                <SkewnessBar value={skewness} />
            </div>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2">
            <div className='flex justify-between items-center'>
                 <h3 className="text-base font-medium text-slate-200 text-right">همگنی داده‌ها (CV)</h3>
                 <Badge variant="outline" className="font-mono text-base tabular-nums">{cv.toFixed(1)}%</Badge>
            </div>
            <p className='text-sm text-slate-400 text-right'>
                {cv > 30 ? 'پراکندگی بالا (ناهمگن)' : cv > 15 ? 'پراکندگی متوسط' : 'پراکندگی پایین (همگن)'}
            </p>
             <div className="mt-2">
                <Progress value={Math.min(cv, 100)} className="h-3" style={{ '--progress-color': getCVColor(cv) } as any} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
