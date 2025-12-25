
'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatisticsResult } from '@/hooks/use-statistics';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnalysisBoxProps = {
  stats: StatisticsResult;
};

const SKEW_THRESHOLD = 0.1; // 10% difference between mean and median to be considered skewed

export function AnalysisBox({ stats }: AnalysisBoxProps) {
  const analysis = useMemo(() => {
    if (!stats || !stats.mean || !stats.median || !stats.cv) return null;

    const { mean, median, cv } = stats;
    const insights = [];

    // 1. Skewness
    const meanMedianDiff = (mean.value - median.value) / median.value;
    if (Math.abs(meanMedianDiff) > SKEW_THRESHOLD) {
      if (mean.value > median.value) {
        insights.push({
          text: 'توزیع داده‌ها دارای چولگی به راست (مثبت) است.',
          detail: 'این یعنی تعداد داده‌های با مقدار کم، بیشتر از داده‌های با مقدار زیاد است و میانگین بزرگتر از میانه شده.',
          highlight: 'چولگی به راست',
          color: 'text-red-400',
        });
      } else {
        insights.push({
          text: 'توزیع داده‌ها دارای چولگی به چپ (منفی) است.',
          detail: 'این یعنی تعداد داده‌های با مقدار زیاد، بیشتر از داده‌های با مقدار کم است و میانگین کوچکتر از میانه شده.',
          highlight: 'چولگی به چپ',
          color: 'text-green-400',
        });
      }
    } else {
      insights.push({
        text: 'توزیع داده‌ها تقریباً متقارن به نظر می‌رسد.',
        detail: 'میانگین و میانه به هم نزدیک هستند که نشان‌دهنده توزیع یکنواخت داده‌ها در دو طرف مرکز است.',
        highlight: 'تقریباً متقارن',
        color: 'text-blue-400',
      });
    }

    // 2. Dispersion
    if (cv.value > 30) {
      insights.push({
        text: 'پراکندگی داده‌ها بالا (ناهمگن) است.',
        detail: `ضریب تغییرات (${cv.value.toFixed(1)}%) نشان می‌دهد که داده‌ها به طور گسترده‌ای پراکنده شده‌اند و یکنواخت نیستند.`,
        highlight: 'پراکندگی بالا',
        color: 'text-amber-400',
      });
    } else {
      insights.push({
        text: 'پراکندگی داده‌ها پایین (همگن) است.',
        detail: `ضریب تغییرات (${cv.value.toFixed(1)}%) نشان می‌دهد که داده‌ها به خوبی حول میانگین متمرکز شده‌اند.`,
        highlight: 'پراکندگی پایین',
        color: 'text-cyan-400',
      });
    }

    return insights;
  }, [stats]);

  if (!analysis) return null;

  const renderTextWithHighlight = (text: string, highlight: string, color: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className={cn('font-bold', color)}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <span className="p-2 bg-white/10 rounded-full"><Lightbulb className="h-5 w-5 text-amber-300" /></span>
          تحلیل هوشمند
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis.map((insight, index) => (
          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-base text-slate-200 font-medium">
              {renderTextWithHighlight(insight.text, insight.highlight, insight.color)}
            </p>
            <p className="text-sm text-slate-400 mt-1">{insight.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
