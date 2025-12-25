
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DistributionResult, ClassData } from '@/hooks/use-frequency-distribution';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type FrequencyTableProps = {
  data: ClassData[];
  setData: (data: ClassData[]) => void;
  isEditable: boolean;
  range?: number;
  classWidth?: number;
  numClasses?: number;
};

const headers = [
  { key: 'classLimits', label: 'حدود طبقه', tooltip: 'بازه مقادیر برای هر طبقه' },
  { key: 'midpoint', label: 'مرکز طبقه (xi)', tooltip: 'نقطه میانی هر طبقه، (حد بالا + حد پایین) / 2' },
  { key: 'frequency', label: 'فراوانی (fi)', tooltip: 'تعداد داده‌های موجود در هر طبقه' },
  { key: 'relativeFrequency', label: 'فراوانی نسبی (ri)', tooltip: 'نسبت فراوانی طبقه به کل فراوانی‌ها' },
  { key: 'cumulativeFrequency', label: 'فراوانی تجمعی (Fi)', tooltip: 'مجموع فراوانی‌ها تا آن طبقه' },
];

export function FrequencyTable({ data, setData, isEditable, range, classWidth, numClasses }: FrequencyTableProps) {
  if (!data || data.length === 0) {
    return <p>داده‌ای برای نمایش وجود ندارد.</p>;
  }
  
  const handleFrequencyChange = (index: number, newFreq: string) => {
    const freqValue = parseInt(newFreq, 10);
    if (!isNaN(freqValue) && freqValue >= 0) {
        const newData = [...data];
        newData[index].frequency = freqValue;
        
        // Recalculate totals and cumulative values
        let cumulativeFrequency = 0;
        const totalFrequency = newData.reduce((sum, row) => sum + row.frequency, 0);

        const updatedData = newData.map(row => {
            cumulativeFrequency += row.frequency;
            return {
                ...row,
                relativeFrequency: totalFrequency > 0 ? row.frequency / totalFrequency : 0,
                cumulativeFrequency: cumulativeFrequency
            };
        });

        setData(updatedData);
    }
  };

  const totalFrequency = data.reduce((sum, row) => sum + row.frequency, 0);
  const totalRelativeFrequency = data.reduce((sum, row) => sum + row.relativeFrequency, 0);

  return (
     <>
        <div className="overflow-hidden rounded-lg border-t border-white/10">
          <TooltipProvider>
            <div className="w-full overflow-x-auto">
              <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow className="border-b-white/10 hover:bg-white/5">
                      {headers.map(header => (
                        <TableHead key={header.key} className="text-center font-bold text-white">
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <span className="cursor-help border-b border-dashed border-white/30 pb-1">
                                {header.label}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{header.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} className="border-b-white/10 hover:bg-white/5 transition-colors text-slate-300 text-center">
                        <TableCell className="tabular-nums font-mono">[{row.classLimits.lower.toFixed(2)}, {row.classLimits.upper.toFixed(2)})</TableCell>
                        <TableCell className="tabular-nums">{row.midpoint.toFixed(2)}</TableCell>
                        <TableCell>
                           <Input
                              type="number"
                              value={row.frequency}
                              onChange={(e) => handleFrequencyChange(index, e.target.value)}
                              disabled={!isEditable}
                              className={cn(
                                  "bg-transparent border-0 text-center text-white tabular-nums font-mono w-20 mx-auto",
                                  isEditable ? "focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:bg-slate-800" : "cursor-not-allowed"
                              )}
                           />
                        </TableCell>
                        <TableCell className="tabular-nums">{row.relativeFrequency.toFixed(3)}</TableCell>
                        <TableCell className="tabular-nums">{row.cumulativeFrequency}</TableCell>
                      </TableRow>
                    ))}
                     <TableRow className="border-b-white/10 bg-secondary/60 font-bold text-white hover:bg-secondary/70 text-center">
                        <TableCell colSpan={2}>مجموع</TableCell>
                        <TableCell className="tabular-nums">{totalFrequency}</TableCell>
                        <TableCell className="tabular-nums">{totalRelativeFrequency.toFixed(3)}</TableCell>
                        <TableCell>--</TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
            </div>
          </TooltipProvider>
        </div>
       <CardFooter className="flex justify-between items-center text-sm text-slate-400 pt-4 px-6">
          <div className="flex flex-col md:flex-row gap-x-4 gap-y-2 text-right">
            <span className="tabular-nums">دامنه (R): <span className="font-bold text-slate-300 font-mono">{range?.toFixed(2)}</span></span>
            <span className="tabular-nums">طبقات (k): <span className="font-bold text-slate-300 font-mono">{numClasses}</span></span>
            <span className="tabular-nums">عرض (W): <span className="font-bold text-slate-300 font-mono">{classWidth?.toFixed(2)}</span></span>
          </div>
           {!isEditable && (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Lock className="h-4 w-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>ویرایش جدول فقط در حالت "ورودی دستی" امکان‌پذیر است.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
           )}
       </CardFooter>
    </>
  );
}
