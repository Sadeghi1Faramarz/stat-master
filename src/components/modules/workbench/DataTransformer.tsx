
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Activity, Merge, TestTube } from 'lucide-react';
import { useStatsEngine } from '@/hooks/use-stats-engine';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type DataTransformerProps = {
  onTransform: (newData: string) => void;
  rawData: number[];
};

export function DataTransformer({ onTransform, rawData }: DataTransformerProps) {
  const [addValue, setAddValue] = useState(10);
  const [multiplyValue, setMultiplyValue] = useState(2);
  const [mergeData, setMergeData] = useState('');
  const [noise, setNoise] = useState(0);

  const stats = useStatsEngine(rawData.join(', '));

  const handleTransform = (transformFunc: (x: number) => number) => {
    if (rawData.length === 0) return;
    const transformedData = rawData.map(transformFunc);
    const newDataString = transformedData.map(n => n.toFixed(2)).join(', ');
    onTransform(newDataString);
  };

  const handleAdd = () => {
    handleTransform(x => x + addValue);
  };

  const handleMultiply = () => {
    handleTransform(x => x * multiplyValue);
  };

  const handleStandardize = () => {
    if (!stats) return;
    const mean = parseFloat(stats.stats.mean.value);
    const stdDev = parseFloat(stats.stats.stdDev.value);
    if (stdDev === 0) return; // Avoid division by zero
    handleTransform(x => (x - mean) / stdDev);
  };

  const handleMerge = () => {
    const newNumbers = mergeData.split(/[\s,]+/).filter(n => n.trim() !== '').map(Number).filter(n => !isNaN(n));
    if (newNumbers.length === 0) return;
    const mergedData = [...rawData, ...newNumbers];
    onTransform(mergedData.join(', '));
    setMergeData('');
  }
  
  const handleNoiseChange = (value: number) => {
    setNoise(value);
  };

  const applyNoise = () => {
      if (rawData.length === 0 || noise === 0) return;
      
      const dataCopy = [...rawData];
      const randomIndex = Math.floor(Math.random() * dataCopy.length);
      dataCopy[randomIndex] += noise;

      onTransform(dataCopy.join(', '));
      setNoise(0); // Reset after applying
  }

  return (
    <Card className="glassmorphism border-none">
      <Collapsible>
        <CollapsibleTrigger className="w-full text-right">
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                <div>
                    <CardTitle>🛠️ ابزارهای داده</CardTitle>
                    <CardDescription>تبدیل و ترکیب داده‌ها</CardDescription>
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400 transition-transform [&[data-state=open]]:-rotate-180" />
            </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <CardContent className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                    <Button onClick={handleAdd} className="flex-shrink-0 justify-start">
                        <Plus className="ml-2"/>
                        افزودن
                    </Button>
                    <Input
                        type="number"
                        value={addValue}
                        onChange={(e) => setAddValue(parseFloat(e.target.value) || 0)}
                        className="bg-slate-900/50 border-white/10 w-24"
                    />
                </div>
                <div className="flex items-center gap-2">
                     <Button onClick={handleMultiply} className="flex-shrink-0 justify-start">
                        <X className="ml-2"/>
                        ضرب
                    </Button>
                    <Input
                        type="number"
                        value={multiplyValue}
                        onChange={(e) => setMultiplyValue(parseFloat(e.target.value) || 0)}
                        className="bg-slate-900/50 border-white/10 w-24"
                    />
                </div>
                <div className="border-t border-white/10 pt-4">
                    <Button onClick={handleStandardize} variant="secondary" className="w-full justify-start">
                        <Activity className="ml-2"/>
                        استانداردسازی (Z-Score)
                    </Button>
                </div>
                 <div className="border-t border-white/10 pt-4 space-y-2">
                    <p className="text-sm text-slate-300">ترکیب با داده‌های جدید:</p>
                    <Textarea
                        value={mergeData}
                        onChange={(e) => setMergeData(e.target.value)}
                        placeholder="داده‌های گروه دوم..."
                        rows={3}
                        className="bg-slate-900/50 border-white/10"
                    />
                     <Button onClick={handleMerge} variant="secondary" className="w-full">
                        <Merge className="ml-2"/>
                        ترکیب داده‌ها
                    </Button>
                 </div>
                 <div className="border-t border-white/10 pt-4 space-y-3">
                    <Label className="text-sm text-slate-300 flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-cyan-400"/>
                      تست حساسیت (افزودن نویز)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                          value={[noise]}
                          onValueChange={([v]) => handleNoiseChange(v)}
                          min={-10}
                          max={10}
                          step={0.5}
                          disabled={rawData.length === 0}
                          className="flex-1"
                      />
                      <span className="font-mono text-lg text-white w-12 text-center">{noise}</span>
                    </div>
                     <Button onClick={applyNoise} variant="outline" size="sm" className="w-full" disabled={noise === 0}>
                        اعمال نویز
                    </Button>
                </div>
            </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
