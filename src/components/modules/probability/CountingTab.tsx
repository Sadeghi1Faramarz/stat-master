
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { permutation, combination, generatePermutations, generateCombinations } from '@/lib/probability';
import { ArrowDown, AlertTriangle, Lightbulb, BookOpen, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ResultCard = ({ title, formula, value, calculation }: { title: string; formula: string; value: number | string, calculation?: string }) => (
  <Card className="glassmorphism flex-1 min-w-[300px]">
    <CardHeader>
      <CardTitle className="text-xl text-green-400">{title}</CardTitle>
      <CardDescription className="font-mono text-lg">{formula}</CardDescription>
    </CardHeader>
    <CardContent>
      {calculation && <p className="text-center font-mono text-slate-400 mb-4 text-sm">{calculation}</p>}
      <p className="text-5xl font-bold text-white text-center font-mono tabular-nums">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </CardContent>
  </Card>
);

const VISUALIZATION_LIMIT = 5;
const ITEMS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function CountingTab() {
  const [n, setN] = useState(4);
  const [r, setR] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [showSampleProblem, setShowSampleProblem] = useState(false);

  const results = useMemo(() => {
    if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
      setError('ورودی‌ها باید اعداد صحیح و مثبت باشند.');
      return null;
    }
    if (r > n) {
      setError('r (تعداد انتخاب) نمی‌تواند بزرگتر از n (تعداد کل) باشد.');
      return null;
    }
    if (n > 170) {
        setError('برای جلوگیری از سرریز، n نمی‌تواند بزرگتر از 170 باشد.');
        return null;
    }
    setError(null);
    
    const itemsSubset = ITEMS.slice(0, n);

    return {
      permutations: permutation(n, r),
      combinations: combination(n, r),
      permutationSets: n <= VISUALIZATION_LIMIT ? generatePermutations(itemsSubset, r) : null,
      combinationSets: n <= VISUALIZATION_LIMIT ? generateCombinations(itemsSubset, r) : null,
    };
  }, [n, r]);
  
  const handleSampleProblem = () => {
    setN(5);
    setR(3);
    setShowSampleProblem(true);
  }

  const formattedCalculation = (op: 'P' | 'C') => {
      if(op === 'P') {
          return `${n}! / (${n} - ${r})!`;
      }
      return `${n}! / (${r}! * (${n} - ${r})!)`;
  }

  const renderSet = (set: string[], isPermutation: boolean) => {
    const content = isPermutation ? `(${set.join(', ')})` : `{${set.join(', ')}}`;
    return (
        <Badge variant="outline" className="text-lg font-mono bg-white/10 border-white/20 text-slate-200 px-3 py-1 tabular-nums">
            {content}
        </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>ورودی‌های محاسبه</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="n-input">تعداد کل آیتم‌ها (n)</Label>
            <Input
              id="n-input"
              type="number"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value, 10) || 0)}
              min="0"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-input">تعداد آیتم‌های انتخابی (r)</Label>
            <Input
              id="r-input"
              type="number"
              value={r}
              onChange={(e) => setR(parseInt(e.target.value, 10) || 0)}
              min="0"
              max={n}
              className="bg-white/5 border-white/10"
            />
          </div>
        </CardContent>
        <CardFooter>
            <Button variant="secondary" onClick={handleSampleProblem} className="w-full">
                <BookOpen className="ml-2 h-4 w-4" />
                مثال آموزشی
            </Button>
        </CardFooter>
      </Card>
      
      <AnimatePresence>
        {showSampleProblem && (
             <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                <Alert className="bg-blue-900/40 border-blue-500/30 text-blue-200 relative text-right">
                    <Lightbulb className="h-5 w-5 !text-blue-300" />
                    <AlertTitle>مسئله نمونه</AlertTitle>
                    <AlertDescription>
                        انتخاب ۳ نفر از ۵ نفر برای سکوی قهرمانی (ترتیب مهم است). بنابراین جایگشت P(5,3) محاسبه می‌شود.
                    </AlertDescription>
                     <Button variant="ghost" size="icon" className="absolute top-2 left-2 h-6 w-6" onClick={() => setShowSampleProblem(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            </motion.div>
        )}
        {error && (
            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                <Alert variant="destructive" className="bg-red-900/40 border-red-500/50 text-red-300">
                    <AlertTriangle className="h-4 w-4 !text-red-300" />
                    <AlertTitle>خطا در ورودی</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </motion.div>
        )}
      </AnimatePresence>


      <div className="relative flex flex-col items-center justify-center gap-8">
        <ArrowDown className="h-8 w-8 text-slate-500 animate-bounce" />
        <div className="flex flex-wrap items-stretch justify-center gap-8">
            {results && !error && (
            <>
                <ResultCard 
                    title="جایگشت (Permutation)" 
                    formula={`P(n, r) = n! / (n-r)!`}
                    calculation={formattedCalculation('P')}
                    value={results.permutations}
                />
                <ResultCard 
                    title="ترکیب (Combination)" 
                    formula={`C(n, r) = n! / (r! * (n-r)!)`}
                    calculation={formattedCalculation('C')}
                    value={results.combinations}
                />
            </>
            )}
        </div>
      </div>

      {results && !error && n <= VISUALIZATION_LIMIT && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}} className="space-y-6">
             <Alert className="bg-blue-900/40 border-blue-500/30 text-blue-200 text-right">
                <Lightbulb className="h-5 w-5 !text-blue-300" />
                <AlertTitle>تفاوت جایگشت و ترکیب</AlertTitle>
                <AlertDescription>
                   در جایگشت ترتیب مهم است (مثلاً AB با BA متفاوت است)، اما در ترکیب ترتیب مهم نیست (AB و BA یکی هستند).
                </AlertDescription>
            </Alert>

            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>فضای حالت‌ها</CardTitle>
                    <CardDescription>نمایش تمام حالات ممکن برای جایگشت و ترکیب.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="permutations">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="permutations">حالت‌های جایگشت ({results.permutationSets?.length})</TabsTrigger>
                            <TabsTrigger value="combinations">حالت‌های ترکیب ({results.combinationSets?.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="permutations" className="pt-4">
                             <ScrollArea className="h-48">
                                <div className="flex flex-wrap gap-3">
                                    {results.permutationSets?.map((p, i) => <div key={i}>{renderSet(p, true)}</div>)}
                                </div>
                             </ScrollArea>
                        </TabsContent>
                        <TabsContent value="combinations" className="pt-4">
                           <ScrollArea className="h-48">
                                <div className="flex flex-wrap gap-3">
                                    {results.combinationSets?.map((c, i) => <div key={i}>{renderSet(c, false)}</div>)}
                                </div>
                           </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
      )}

    </div>
  );
}
