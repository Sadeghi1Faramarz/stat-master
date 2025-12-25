
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Mode = 'union' | 'intersection' | 'diffA' | 'diffB' | null;

const modes: { [key in NonNullable<Mode>]: { label: string; definition: string; math: string; } } = {
  union: { 
    label: 'اجتماع', 
    math: 'A ∪ B',
    definition: 'شامل تمام عناصری است که حداقل در یکی از مجموعه‌های A یا B قرار دارند.' 
  },
  intersection: { 
    label: 'اشتراک', 
    math: 'A ∩ B',
    definition: 'شامل تمام عناصری است که هم در مجموعه A و هم در مجموعه B وجود دارند.' 
  },
  diffA: { 
    label: 'تفاضل A از B',
    math: 'A - B',
    definition: 'شامل تمام عناصری است که در مجموعه A هستند اما در مجموعه B وجود ندارند.'
  },
  diffB: { 
    label: 'تفاضل B از A',
    math: 'B - A',
    definition: 'شامل تمام عناصری است که در مجموعه B هستند اما در مجموعه A وجود ندارند.'
  },
};

const svgPaths = {
    // Left crescent shape for A-only
    aOnly: "M150 150 a 100 100 0 1 0 0.1 0 Z M 215 150 a 100 100 0 1 1 -0.1 0",
    // Right crescent shape for B-only
    bOnly: "M250 150 a 100 100 0 1 1 -0.1 0 Z M 185 150 a 100 100 0 1 0 0.1 0",
    // Center lens shape for intersection
    intersection: "M215 150 a 100 100 0 0 0 -65 -92.7 a 100 100 0 0 0 0 185.4 a 100 100 0 0 0 65 -92.7",
};

const pathVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function VennDiagram() {
  const [activeMode, setActiveMode] = useState<Mode>(null);

  const getIsActive = (path: 'a' | 'b' | 'intersection') => {
    if (!activeMode) return false;
    switch (activeMode) {
      case 'union': return true;
      case 'intersection': return path === 'intersection';
      case 'diffA': return path === 'a';
      case 'diffB': return path === 'b';
      default: return false;
    }
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>دیاگرام ون تعاملی</CardTitle>
        <CardDescription>برای درک بهتر عملیات روی مجموعه‌ها، روی دکمه‌ها کلیک کنید.</CardDescription>
      </CardHeader>
      <CardContent dir="rtl" className="w-full flex flex-col items-center gap-8">
        <svg viewBox="0 0 400 300" className="w-full h-auto max-w-lg" aria-label="Venn diagram of two overlapping circles, A and B">
          {/* Main circle outlines */}
          <circle cx="150" cy="150" r="100" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2" />
          <circle cx="250" cy="150" r="100" fill="none" stroke="#a855f7" strokeWidth="2" />

          {/* Animated fill paths */}
          <g>
            {/* A-Only Path */}
            <motion.path
                d={svgPaths.aOnly}
                fill="hsl(var(--primary) / 0.7)"
                variants={pathVariants}
                animate={getIsActive('a') ? 'visible' : 'hidden'}
            />
            {/* B-Only Path */}
             <motion.path
                d={svgPaths.bOnly}
                fill="rgb(168 85 247 / 0.7)"
                variants={pathVariants}
                animate={getIsActive('b') ? 'visible' : 'hidden'}
            />
            {/* Intersection Path */}
             <motion.path
                d={svgPaths.intersection}
                fill="#fde047"
                variants={pathVariants}
                animate={getIsActive('intersection') ? 'visible' : 'hidden'}
            />
          </g>

          {/* Labels */}
          <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="white">A</text>
          <text x="250" y="150" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="white">B</text>
        </svg>

        <div className="w-full flex flex-wrap justify-center gap-4 mt-8">
          {(Object.keys(modes) as Mode[]).filter(m => m !== null).map((mode) => (
            <Button
              key={mode}
              variant={activeMode === mode ? 'default' : 'outline'}
              className={cn(activeMode === mode && 'bg-green-600 hover:bg-green-700', 'font-mono text-lg')}
              onClick={() => setActiveMode(activeMode === mode ? null : mode)}
            >
              {modes[mode!].math}
            </Button>
          ))}
        </div>
        
        <div className="h-20 text-center">
            <AnimatePresence mode="wait">
                {activeMode && (
                     <motion.div
                        key={activeMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        <Badge className="text-xl py-1 px-4">{modes[activeMode].label}</Badge>
                        <p className="text-slate-300 max-w-md mx-auto">{modes[activeMode].definition}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
