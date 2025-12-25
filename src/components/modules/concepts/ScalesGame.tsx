
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check, X, RotateCw } from 'lucide-react';

type Scale = 'اسمی' | 'ترتیبی' | 'فاصله‌ای' | 'نسبی';

const questions: { variable: string; correctScale: Scale }[] = [
  { variable: 'وزن (کیلوگرم)', correctScale: 'نسبی' },
  { variable: 'رنگ چشم', correctScale: 'اسمی' },
  { variable: 'دمای هوا (سانتی‌گراد)', correctScale: 'فاصله‌ای' },
  { variable: 'سطح رضایت (کم، متوسط، زیاد)', correctScale: 'ترتیبی' },
  { variable: 'تعداد فرزندان', correctScale: 'نسبی' },
  { variable: 'نوع گروه خونی', correctScale: 'اسمی' },
  { variable: 'سال تولد میلادی', correctScale: 'فاصله‌ای' },
  { variable: 'رتبه در کنکور', correctScale: 'ترتیبی' },
];

const scales: Scale[] = ['اسمی', 'ترتیبی', 'فاصله‌ای', 'نسبی'];

export function ScalesGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ answer: Scale; status: 'correct' | 'incorrect' } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = (currentQuestionIndex / questions.length) * 100;

  const handleAnswer = (selectedScale: Scale) => {
    if (feedback) return; // Prevent multiple answers

    const isCorrect = selectedScale === currentQuestion.correctScale;
    setFeedback({ answer: selectedScale, status: isCorrect ? 'correct' : 'incorrect' });

    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setIsFinished(true);
      }
      setFeedback(null);
    }, 1500);
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };
  
  const getButtonClass = (scale: Scale) => {
    if (!feedback) return 'bg-white/10 hover:bg-white/20';
    if (scale === currentQuestion.correctScale) return 'bg-green-500/30 border-green-500 text-white animate-pulse';
    if (scale === feedback.answer && feedback.status === 'incorrect') return 'bg-red-500/30 border-red-500 text-white animate-shake';
    return 'bg-white/10 opacity-50';
  }

  if (isFinished) {
    return (
        <Card className="border-white/10 bg-white/5">
            <CardHeader>
                <CardTitle>نتیجه بازی</CardTitle>
                <CardDescription>عملکرد شما در تشخیص مقیاس‌ها</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
                <p className="text-2xl text-slate-300 mb-4">امتیاز شما:</p>
                <p className="text-6xl font-bold text-white">{score} <span className="text-3xl text-slate-400">/ {questions.length}</span></p>
            </CardContent>
            <CardFooter>
                 <Button onClick={restartGame} className="w-full">
                    <RotateCw className="ml-2 h-4 w-4" />
                    بازی مجدد
                </Button>
            </CardFooter>
        </Card>
    );
  }


  return (
    <Card className="border-white/10 bg-white/5 mt-12">
      <CardHeader>
        <CardTitle>بازی تشخیص مقیاس</CardTitle>
        <CardDescription>مقیاس اندازه‌گیری صحیح را برای متغیر زیر انتخاب کنید.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="relative h-32 flex items-center justify-center bg-slate-900/50 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"/>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
            >
              {currentQuestion.variable}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {scales.map(scale => (
            <Button
              key={scale}
              onClick={() => handleAnswer(scale)}
              disabled={!!feedback}
              className={cn(
                'h-16 text-lg glassmorphism border-white/10 transition-all duration-300',
                getButtonClass(scale)
              )}
            >
              {scale}
              {feedback && scale === feedback.answer && (
                  feedback.status === 'correct' ? <Check className="mr-2"/> : <X className="mr-2"/>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="w-full text-right text-sm text-slate-400 mb-1">
            امتیاز: {score}
        </div>
        <Progress value={progressValue} className="w-full h-2" />
      </CardFooter>
    </Card>
  );
}
