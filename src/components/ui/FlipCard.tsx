'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type FlipCardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
};

export const FlipCard = ({ front, back, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleMouseEnter = () => setIsFlipped(true);
  const handleMouseLeave = () => setIsFlipped(false);

  return (
    <div
      className={cn('group h-80 w-full [perspective:1000px]', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleFlip}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
          <div className="relative flex h-full flex-col items-center justify-center rounded-xl p-6 text-center glassmorphism bg-gradient-to-br from-white/5 to-white/0 shadow-lg">
            {front}
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
           <div className="flex h-full flex-col justify-center rounded-xl p-8 bg-slate-900/95 border border-white/20 shadow-xl">
            {back}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
