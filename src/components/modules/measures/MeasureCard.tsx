
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Formula } from '@/hooks/use-statistics';
import { Button } from '@/components/ui/button';
import { VarianceTable } from './VarianceTable';
import { ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";


type MeasureCardProps = {
  title: React.ReactNode;
  value: string;
  unit?: string;
  formula?: Formula;
  icon?: LucideIcon;
  color?: 'blue' | 'amber';
  data?: number[]; // Raw data for variance table
  interpretation?: string;
};

const Fraction = ({ top, bottom }: { top: string | number; bottom: string | number }) => (
    <div className="inline-flex flex-col items-center mx-3 font-mono tabular-nums">
      <span className="px-2 pb-1">{top}</span>
      <span className="border-t border-slate-500 w-full"></span>
      <span className="px-2 pt-1">{bottom}</span>
    </div>
);


export function MeasureCard({ title, value, unit, formula, icon: Icon, color = 'blue', data, interpretation }: MeasureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isVarianceCard = !!data;

  const accentColor = color === 'blue' ? 'text-blue-400' : 'text-amber-400';
  const shadowColor = color === 'blue' 
    ? 'shadow-blue-500/10' 
    : 'shadow-amber-500/10';

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card from toggling when clicking inside the dialog trigger
    if ((e.target as HTMLElement).closest('[data-dialog-trigger]')) {
      return;
    }
    if (formula) {
        setIsExpanded(!isExpanded);
    }
  }

  return (
    <Dialog>
      <Card 
        className={cn(
          "relative overflow-hidden group glassmorphism transition-all duration-300 hover:border-white/20", 
          shadowColor,
          formula ? 'cursor-pointer' : ''
        )}
        onClick={handleCardClick}
      >
        <div className={cn("absolute top-0 right-0 h-full w-1 transition-all duration-300 group-hover:w-2", color === 'blue' ? 'bg-blue-500' : 'bg-amber-500')} />
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-bold text-slate-200 text-right">{title}</CardTitle>
          {Icon && <Icon className={cn("h-6 w-6", accentColor)} />}
        </CardHeader>
        <CardContent className="text-right">
          <div className="text-4xl font-bold text-white font-mono tabular-nums">{value}</div>
          {interpretation && <p className="text-xs text-slate-400 mt-1">{interpretation}</p>}
          <div className="flex justify-between items-center mt-1">
              {unit ? <p className="text-xs text-slate-400">{unit}</p> : <div />}
              {formula && (
                <div className='flex items-center gap-1 text-slate-500'>
                  <HelpCircle className="h-4 w-4" />
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </div>
              )}
          </div>
        </CardContent>

        <AnimatePresence>
          {isExpanded && formula && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 mx-6 my-4" />
              <div className="px-6 pb-4 text-right space-y-4">
                  <p className="text-center text-lg text-slate-200 mb-4 font-mono">{formula.expression}</p>
                  {formula.parts ? (
                      <div className="flex items-center justify-center text-lg text-slate-300">
                          <span>=</span>
                          <Fraction top={formula.parts.numerator} bottom={formula.parts.denominator} />
                          <span>=</span>
                          <span className="mx-3 font-mono tabular-nums">{formula.parts.result}</span>
                      </div>
                  ) : formula.calculation && (
                      <p className="text-center text-slate-300 tabular-nums">{formula.calculation}</p>
                  )}

                  {isVarianceCard && data && (
                    <div className="pt-2">
                      <DialogTrigger asChild data-dialog-trigger>
                         <Button 
                            variant="outline"
                            size="sm"
                            className='w-full'
                          >
                            نمایش جدول محاسبات
                          </Button>
                      </DialogTrigger>
                    </div>
                  )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </Card>
      
      {isVarianceCard && data && (
        <DialogContent className="p-0 md:p-6 w-screen h-screen md:w-full md:h-auto md:max-w-4xl flex flex-col glassmorphism md:rounded-lg">
          <DialogHeader className="p-6 md:p-0">
            <DialogTitle className="text-right text-2xl font-bold text-white">جدول محاسبات واریانس</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto px-6 md:px-0">
             <VarianceTable data={data} mean={parseFloat(value)} />
          </div>
          <DialogFooter className="mt-4 p-6 md:p-0">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full md:w-auto">
                بستن
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}

    </Dialog>
  );
}
