
'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const TiltCard = ({ children, className }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className="relative h-full w-full group"
    >
      <div
        style={{
          transform: 'translateZ(20px) scale(0.95)',
          transformStyle: 'preserve-3d',
        }}
        className={cn(
            "absolute inset-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-shadow duration-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
            className
        )}
      >
         <div 
            className="absolute inset-0"
            style={{ transform: 'translateZ(25px)' }}
         >
            {children}
         </div>
         <div className="card-prism-borders" />
      </div>
    </motion.div>
  );
};
