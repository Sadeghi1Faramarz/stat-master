
'use client';

import React from 'react';
import { MeasureCard } from './MeasureCard';
import { StatisticsResult } from '@/hooks/use-statistics';
import { Sigma, AlignCenterHorizontal, Users, Activity, BarChartHorizontalBig, ArrowRightLeft, Percent } from 'lucide-react';
import { SmartTerm } from '@/components/ui/SmartTerm';
import { AnalysisBox } from './AnalysisBox';

type MeasuresResultsProps = {
  stats: StatisticsResult;
};

export function MeasuresResults({ stats }: MeasuresResultsProps) {
  if (!stats || !stats.mean) {
    return null;
  }
  
  const isSample = stats.variance.formula.expression.includes('n-1');
  const varianceTitle = isSample ? "واریانس نمونه" : "واریانس جامعه";

  const dispersionInterpretation = stats.cv.value > 30 
    ? "پراکندگی بالا (داده‌ها ناهمگن)" 
    : "پراکندگی پایین (داده‌ها همگن)";

  return (
    <div className="space-y-12">
        <AnalysisBox stats={stats} />

        {/* Central Tendency */}
        <section>
             <h2 className="text-2xl font-bold text-right mb-6 text-gradient">شاخص‌های مرکزی</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MeasureCard 
                    title={<SmartTerm termKey="mean">میانگین</SmartTerm>}
                    value={stats.mean.value.toFixed(3)}
                    formula={stats.mean.formula}
                    icon={Sigma}
                    color="amber"
                    interpretation="نقطه تعادل داده‌ها"
                />
                <MeasureCard 
                    title={<SmartTerm termKey="median">میانه</SmartTerm>}
                    value={stats.median.value.toFixed(3)} 
                    formula={stats.median.formula}
                    icon={AlignCenterHorizontal}
                    color="amber"
                    interpretation="نقطه وسط (مقاوم در برابر داده پرت)"
                />
                <MeasureCard 
                    title={<SmartTerm termKey="mode">مد</SmartTerm>}
                    value={stats.mode.value.length > 0 ? stats.mode.value.map(v => v.toFixed(3)).join(', ') : 'ندارد'}
                    formula={stats.mode.formula}
                    icon={Users}
                    color="amber"
                    interpretation="محبوب‌ترین یا پرتکرارترین داده"
                />
            </div>
        </section>

        {/* Dispersion */}
        <section>
            <h2 className="text-2xl font-bold text-right mb-6 text-gradient">شاخص‌های پراکندگی</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                 <MeasureCard 
                    title={<SmartTerm termKey="variance">{varianceTitle}</SmartTerm>}
                    value={stats.variance.value.toFixed(3)} 
                    unit="واحد مربع"
                    formula={stats.variance.formula}
                    icon={Activity}
                    color="blue"
                    data={stats.variance.values}
                    interpretation={dispersionInterpretation}
                />
                 <MeasureCard 
                    title={<SmartTerm termKey="stdDev">انحراف معیار</SmartTerm>}
                    value={stats.stdDev.value.toFixed(3)}
                    unit="واحد"
                    formula={stats.stdDev.formula}
                    icon={BarChartHorizontalBig}
                    color="blue"
                    interpretation={dispersionInterpretation}
                />
                <MeasureCard 
                    title={<SmartTerm termKey="range">دامنه تغییرات</SmartTerm>}
                    value={stats.range.value.toFixed(3)}
                    unit="واحد"
                    formula={stats.range.formula}
                    icon={ArrowRightLeft}
                    color="blue"
                    interpretation="فاصله بین بزرگترین و کوچکترین داده"
                />
                <MeasureCard 
                    title={<SmartTerm termKey="cv">ضریب تغییرات (CV)</SmartTerm>}
                    value={stats.cv.value.toFixed(2)}
                    unit="درصد"
                    formula={stats.cv.formula}
                    icon={Percent}
                    color="blue"
                    interpretation="معیار مقایسه پراکندگی"
                />
            </div>
        </section>
    </div>
  );
}
