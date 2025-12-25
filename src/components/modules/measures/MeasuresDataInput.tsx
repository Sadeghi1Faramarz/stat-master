'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RotateCw, TestTube2, Trash2, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { RawData, GroupedData, GroupedDataItem } from '@/hooks/use-statistics';
import { AnimatedButton } from '@/components/ui/animated-button';

type DataInputProps = {
  onAnalyze: (data: RawData | GroupedData) => void;
};

const sampleGrades = [18.5, 14, 17, 12, 19, 20, 11.5, 15, 16, 13, 17.5, 18, 10, 9, 14.5, 19.5, 12.5, 8, 16.5, 15.5];

export function MeasuresDataInput({ onAnalyze }: DataInputProps) {
  const [mode, setMode] = useState<'raw' | 'grouped'>('raw');
  const [textData, setTextData] = useState('');
  const [groupedData, setGroupedData] = useState<GroupedDataItem[]>([
    { lower: 0, upper: 5, frequency: 0 },
    { lower: 5, upper: 10, frequency: 0 },
    { lower: 10, upper: 15, frequency: 0 },
    { lower: 15, upper: 20, frequency: 0 },
  ]);

  const handleAnalyze = () => {
    if (mode === 'raw') {
      const numbers = textData
        .split(/[\s,]+/)
        .filter(n => n.trim() !== '')
        .map(Number)
        .filter(n => !isNaN(n));
      onAnalyze({ type: 'raw', values: numbers });
    } else {
       const validGroupedData = groupedData.filter(
        item => typeof item.lower === 'number' && typeof item.upper === 'number' && typeof item.frequency === 'number'
      );
      onAnalyze({ type: 'grouped', values: validGroupedData });
    }
  };

  const handleLoadSample = () => {
    setMode('raw');
    setTextData(sampleGrades.join(', '));
  };
  
  const handleReset = () => {
    setTextData('');
    setGroupedData([
      { lower: 0, upper: 5, frequency: 0 }, { lower: 5, upper: 10, frequency: 0 },
      { lower: 10, upper: 15, frequency: 0 }, { lower: 15, upper: 20, frequency: 0 }
    ]);
    onAnalyze({ type: 'raw', values: [] });
  };

  const handleGroupedChange = (index: number, field: keyof GroupedDataItem, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newData = [...groupedData];
      newData[index] = { ...newData[index], [field]: numValue };
      setGroupedData(newData);
    }
  };
  
  const addGroup = () => {
    const lastGroup = groupedData[groupedData.length - 1] || { upper: 0 };
    const newLower = lastGroup.upper;
    const newUpper = newLower + (lastGroup.upper - lastGroup.lower || 5);
    setGroupedData([...groupedData, { lower: newLower, upper: newUpper, frequency: 0 }]);
  };
  
  const removeGroup = (index: number) => {
    setGroupedData(groupedData.filter((_, i) => i !== index));
  };

  const isAnalyzeDisabled = mode === 'raw' ? !textData : groupedData.length === 0;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>ورود داده</CardTitle>
        <CardDescription>داده‌های خام یا گروه‌بندی شده را وارد کنید.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'raw' | 'grouped')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/80">
            <TabsTrigger value="raw">داده خام</TabsTrigger>
            <TabsTrigger value="grouped">داده طبقه‌بندی شده</TabsTrigger>
          </TabsList>
          <TabsContent value="raw" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-input">داده‌های خام (جدا شده با کاما یا فاصله)</Label>
              <Textarea
                id="data-input"
                value={textData}
                onChange={(e) => setTextData(e.target.value)}
                placeholder="مثال: 18.5, 14, 17, 12, 19.5"
                rows={5}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLoadSample} variant="secondary" className="w-full">
                <TestTube2 className="ml-2 h-4 w-4" />
                بارگذاری داده نمونه
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="grouped" className="mt-4 space-y-4">
             <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
               <div className="grid grid-cols-12 gap-2 text-xs text-center font-bold text-slate-400">
                  <div className="col-span-5">حد پایین</div>
                  <div className="col-span-5">حد بالا</div>
                  <div className="col-span-2">فراوانی</div>
               </div>
               <AnimatePresence>
                {groupedData.map((item, index) => (
                  <motion.div 
                    key={index}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <Input className="col-span-5 text-center" type="number" value={item.lower} onChange={e => handleGroupedChange(index, 'lower', e.target.value)} />
                    <Input className="col-span-5 text-center" type="number" value={item.upper} onChange={e => handleGroupedChange(index, 'upper', e.target.value)} />
                    <Input className="col-span-2 text-center" type="number" value={item.frequency} onChange={e => handleGroupedChange(index, 'frequency', e.target.value)} />
                  </motion.div>
                ))}
               </AnimatePresence>
             </div>
             <div className="flex justify-between gap-2">
                <Button onClick={addGroup} variant="outline" size="sm">
                  <Plus className="ml-1 h-4 w-4" /> افزودن طبقه
                </Button>
                 <Button onClick={() => groupedData.length > 0 && removeGroup(groupedData.length - 1)} variant="ghost" size="sm" disabled={groupedData.length === 0}>
                  <Trash2 className="ml-1 h-4 w-4" /> حذف آخرین
                </Button>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <AnimatedButton onClick={handleAnalyze} disabled={isAnalyzeDisabled}>
          محاسبه شاخص‌ها
        </AnimatedButton>
        <Button onClick={handleReset} variant="ghost" className="w-full">
           <RotateCw className="ml-2 h-4 w-4" />
           پاکسازی همه
        </Button>
      </CardFooter>
    </Card>
  );
}
