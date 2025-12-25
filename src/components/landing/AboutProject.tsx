
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const textVariants = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -50 : 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
});

const visualVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
};

export function AboutProject() {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto my-32 px-4 space-y-24">
      {/* Section 1: The Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="text-center md:text-right"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariants(true)}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">چالش آموزش سنتی</h2>
          <p className="text-lg leading-relaxed text-slate-300">
            درک مفاهیم انتزاعی آمار صرفاً با فرمول‌های روی کاغذ دشوار است. دانشجویان نیاز دارند تا "رفتار" داده‌ها را ببینند، نه فقط نتیجه نهایی را.
          </p>
        </motion.div>
        <motion.div
          className="flex justify-center items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={visualVariants}
        >
          <div className="glassmorphism rounded-xl p-8 w-full max-w-sm h-56 flex items-center justify-center">
            <div className="font-mono text-slate-500 text-center leading-loose blur-[1px] select-none">
              14.5, 9, 18, 12.5, 17, 20, 11, 15, 16.5, 13, 8.5, 19, 10
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section 2: The Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="flex justify-center items-center md:order-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={visualVariants}
        >
           <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute inset-0 glassmorphism rounded-full flex items-center justify-center">
                <BarChart3 className="w-20 h-20 text-primary" />
              </div>
           </div>
        </motion.div>
        <motion.div
          className="text-center md:text-right md:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={textVariants(false)}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">تجربه‌ای تعاملی</h2>
          <p className="text-lg leading-relaxed text-slate-300">
            ما آمار را لمس‌کردنی کرده‌ایم. با تغییر ورودی‌ها، نمودارها و شاخص‌ها در لحظه تغییر می‌کنند و شما تاثیر هر داده را به چشم می‌بینید.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
