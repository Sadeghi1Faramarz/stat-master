
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { TestTube2, RotateCw, AlertCircle, SlidersHorizontal, Lightbulb, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateGaussianData } from '@/lib/data-generator';
import { Slider } from '@/components/ui/slider';
import { useDebounce } from '@/hooks/use-debounce';
import { usePersistedState } from '@/hooks/usePersistedState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type DataInputProps = {
  setData: (data: number[]) => void;
  setNumClasses: (k: number | undefined) => void;
  setMode: (mode: 'manual' | 'simulation') => void;
  currentMode: 'manual' | 'simulation';
  initialTextData?: string;
  dataCount: number;
};

const SCENARIOS = {
  outlier: {
    label: "اثر داده پرت",
    data: [18, 19, 19, 20, 18, 2, 19, 20],
    tip: "یک داده پرت اضافه شد! حالا به نمودار نگاه کنید: میانگین به سمت داده پرت کشیده شد، اما میانه تقریباً ثابت ماند."
  },
  uniform: {
    label: "توزیع یکنواخت",
    data: [15, 15, 15, 15, 15, 15, 15],
    tip: "وقتی تمام داده‌ها یکسان هستند، پراکندگی (واریانس و انحراف معیار) صفر می‌شود، زیرا هیچ تغییری وجود ندارد."
  },
  skew_right: {
    label: "چولگی به راست",
    data: [2, 3, 3, 4, 5, 8, 12, 20],
    tip: "در این توزیع، اکثر داده‌ها در مقادیر پایین قرار دارند. این باعث می‌شود میانگین از میانه بزرگتر شود."
  },
  normal: {
    label: "توزیع نرمال (تقریبی)",
    data: [10, 12, 14, 15, 15, 16, 18, 20],
    tip: "در یک توزیع متقارن یا نرمال، شاخص‌های مرکزی (میانگین، میانه و مد) به یکدیگر بسیار نزدیک هستند."
  }
};


const sampleGrades = [
    18.5, 14, 17, 12, 19, 20, 11.5, 15, 16, 13,
    17.5, 18, 10, 9, 14.5, 19.5, 12.5, 8, 16.5, 15.5
];

const validationRegex = /[^0-9,.\s-]/;

export function DataInput({ setData, setNumClasses, setMode, currentMode, initialTextData = '', dataCount }: DataInputProps) {
  const [textData, setTextData] = usePersistedState('statmaster_raw_data', initialTextData);
  const [kMethod, setKMethod] = useState<'sturges' | 'manual'>('sturges');
  const [manualK, setManualK] = useState<number>(7);
  const [error, setError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<{label: string; tip: string} | null>(null);

  // Simulation state
  const [simMean, setSimMean] = useState(50);
  const [simStdDev, setSimStdDev] = useState(10);
  const [simCount, setSimCount] = useState(200);

  const debouncedMean = useDebounce(simMean, 300);
  const debouncedStdDev = useDebounce(simStdDev, 300);
  const debouncedCount = useDebounce(simCount, 300);

  useEffect(() => {
    if (validationRegex.test(textData)) {
      setError("لطفاً فقط از اعداد و جداکننده (ویرگول/فاصله) استفاده کنید.");
    } else {
      setError(null);
    }
  }, [textData]);

  const runSimulation = useCallback(() => {
    const simData = generateGaussianData(debouncedMean, debouncedStdDev, debouncedCount);
    setData(simData);
    setKMethod('sturges');
    setNumClasses(undefined);
    setActiveScenario(null);
  }, [debouncedMean, debouncedStdDev, debouncedCount, setData, setNumClasses]);

  const parseNumbers = (str: string) => {
     return str
      .split(/[\s,]+/)
      .filter(n => n.trim() !== '')
      .map(Number)
      .filter(n => !isNaN(n));
  }
  
  useEffect(() => {
      if (currentMode === 'simulation') {
        runSimulation();
      }
  }, [currentMode, runSimulation]);
  
    // Effect to analyze persisted data on initial load
  useEffect(() => {
    if (textData && currentMode === 'manual') {
      const numbers = parseNumbers(textData);
      if (numbers.length > 0) {
        setData(numbers);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect to update numClasses when slider or method changes
  useEffect(() => {
    if (dataCount > 0) {
        if (kMethod === 'sturges') {
            setNumClasses(undefined); // Signal to use Sturges' rule
        } else {
            setNumClasses(manualK);
        }
    }
  }, [kMethod, manualK, setNumClasses, dataCount]);

  const handleAnalyze = () => {
    if (error) return;
    const numbers = parseNumbers(textData);
      
    setData(numbers);
    setActiveScenario(null);
  };

  const handleScenarioChange = (scenarioKey: string) => {
    const scenario = SCENARIOS[scenarioKey as keyof typeof SCENARIOS];
    if (!scenario) return;

    let newData;
    let newText;

    if (scenarioKey === 'outlier') {
        const currentNumbers = parseNumbers(textData);
        if (currentNumbers.length === 0) {
            newData = scenario.data;
        } else {
            const maxVal = Math.max(...currentNumbers);
            const range = maxVal - Math.min(...currentNumbers);
            const outlier = maxVal + Math.max(20, range * 1.5)
            newData = [...currentNumbers, outlier];
        }
        newText = newData.join(', ');
    } else {
        newData = scenario.data;
        newText = scenario.data.join(', ');
    }

    setTextData(newText);
    setError(null);
    setData(newData);
    setActiveScenario({ label: scenario.label, tip: scenario.tip });
    setMode('manual');
  };

  const handleLoadSample = () => {
    setMode('manual');
    const sampleText = sampleGrades.join(', ');
    setTextData(sampleText);
    setError(null);
    setData(sampleGrades);
    setActiveScenario(null);
  };
  
  const handleReset = () => {
    setTextData('');
    setData([]);
    setNumClasses(undefined);
    setKMethod('sturges');
    setManualK(7);
    setError(null);
    setActiveScenario(null);
  };

  return (
    <Card className="sticky top-24 glassmorphism border-none">
      <CardHeader>
        <CardTitle>ورود و تنظیمات داده</CardTitle>
        <CardDescription>داده‌های خود را وارد یا از یک توزیع شبیه‌سازی کنید.</CardDescription>
      </CardHeader>
      <CardContent>
          <Tabs value={currentMode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">ورودی دستی</TabsTrigger>
                <TabsTrigger value="simulation">شبیه‌سازی</TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="space-y-6 pt-4">
                
                <div className="space-y-2">
                  <Label htmlFor="scenario-select" className="text-slate-300">آموزش با سناریو</Label>
                   <Select onValueChange={handleScenarioChange}>
                    <SelectTrigger id="scenario-select" className="w-full bg-slate-900/50 border-white/10">
                        <SelectValue placeholder="یک سناریوی آموزشی انتخاب کنید..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(SCENARIOS).map(([key, scenario]) => (
                            <SelectItem key={key} value={key} className={key === 'outlier' ? 'text-amber-400' : ''}>
                                <div className="flex items-center gap-2">
                                     {key === 'outlier' && <AlertTriangle className="h-4 w-4" />}
                                     {scenario.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <AnimatePresence>
                    {activeScenario && (
                        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, height:0}}>
                             <Alert className={cn(
                                'border-blue-500/30 text-blue-200',
                                activeScenario.label.includes('پرت') && 'bg-amber-900/40 border-amber-500/30 text-amber-200'
                             )}>
                                <Lightbulb className={cn(
                                    'h-5 w-5 !text-blue-300',
                                    activeScenario.label.includes('پرت') && '!text-amber-300'
                                )} />
                                <AlertTitle>{activeScenario.label}</AlertTitle>
                                <AlertDescription>
                                    {activeScenario.tip}
                                </AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>


                <div className="space-y-2">
                <Label htmlFor="data-input" className="text-slate-300">داده‌های خام</Label>
                <Textarea
                    id="data-input"
                    value={textData}
                    onChange={(e) => setTextData(e.target.value)}
                    placeholder="مثال: 18.5, 14, 17, 12, 19.5"
                    rows={5}
                    className={cn("bg-slate-900/50 border-white/10 focus:border-purple-500 font-mono", error && "border-red-500/50 focus-visible:ring-red-500/50")}
                />
                <AnimatePresence>
                    {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-400"
                    >
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </motion.p>
                    )}
                </AnimatePresence>
                </div>
                <div className="flex gap-2">
                <Button onClick={handleLoadSample} variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-slate-300">
                    <TestTube2 className="ml-2 h-4 w-4" />
                    داده نمونه
                </Button>
                <Button onClick={handleReset} variant="ghost" size="icon" className="text-slate-400 hover:bg-white/10 hover:text-white">
                    <RotateCw className="h-4 w-4" />
                </Button>
                </div>

                <Separator className="bg-white/10" />
                
                <div className="space-y-3">
                    <Label className="text-slate-300">روش تعیین تعداد طبقات (k)</Label>
                    <Tabs value={kMethod} onValueChange={(v) => setKMethod(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-full border border-white/10">
                            <TabsTrigger value="sturges" className="rounded-full data-[state=active]:bg-purple-600">خودکار (استورجس)</TabsTrigger>
                            <TabsTrigger value="manual" className="rounded-full data-[state=active]:bg-purple-600">دستی</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <AnimatePresence>
                        {kMethod === 'manual' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden pt-2 space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Label htmlFor="k-slider">تعداد طبقات</Label>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="max-w-xs text-right">
                                                <p>تعداد رده کم = از دست رفتن جزئیات.</p>
                                                <p>تعداد رده زیاد = نویز و بی‌نظمی.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <span className="font-mono text-lg text-white">{manualK}</span>
                                </div>
                                <Slider 
                                    id="k-slider"
                                    value={[manualK]} 
                                    onValueChange={([v]) => setManualK(v)} 
                                    min={3} 
                                    max={20} 
                                    step={1}
                                    disabled={dataCount === 0}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                 <AnimatedButton 
                    onClick={handleAnalyze} 
                    disabled={!textData || !!error}
                    className="w-full text-lg font-bold h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                >
                    تحلیل داده‌ها
                </AnimatedButton>
            </TabsContent>
            <TabsContent value="simulation" className="space-y-8 pt-6">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="mean-slider">میانگین (μ)</Label>
                            <span className="font-mono text-lg text-white">{simMean}</span>
                        </div>
                        <Slider id="mean-slider" value={[simMean]} onValueChange={([v]) => setSimMean(v)} min={0} max={100} step={1} />
                    </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="stddev-slider">انحراف معیار (σ)</Label>
                            <span className="font-mono text-lg text-white">{simStdDev}</span>
                        </div>
                        <Slider id="stddev-slider" value={[simStdDev]} onValueChange={([v]) => setSimStdDev(v)} min={1} max={30} step={1} />
                    </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="count-slider">تعداد داده (n)</Label>
                            <span className="font-mono text-lg text-white">{simCount}</span>
                        </div>
                        <Slider id="count-slider" value={[simCount]} onValueChange={([v]) => setSimCount(v)} min={10} max={1000} step={10} />
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-900/40 border border-purple-500/30">
                    <SlidersHorizontal className="h-6 w-6 text-purple-400"/>
                    <p className="text-xs text-purple-200">
                        اسلایدرها را حرکت دهید تا تاثیر هر پارامتر را بر روی توزیع داده‌ها به صورت زنده مشاهده کنید.
                    </p>
                 </div>
            </TabsContent>
          </Tabs>
      </CardContent>
    </Card>
  );
}

    