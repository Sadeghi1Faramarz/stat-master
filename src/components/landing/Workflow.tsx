
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Cpu, Presentation, ChevronLeft } from 'lucide-react';
import { TiltCard } from '@/components/modules/landing/TiltCard';

const steps = [
  {
    icon: Keyboard,
    title: 'ورود داده خام',
    description: 'نمرات یا اعداد خود را به سادگی تایپ یا کپی کنید.',
  },
  {
    icon: Cpu,
    title: 'پردازش هوشمند',
    description: 'محاسبه آنی شاخص‌ها و ایجاد جدول فراوانی.',
  },
  {
    icon: Presentation,
    title: 'تصویرسازی',
    description: 'دریافت نمودارهای استاندارد مانند هیستوگرام.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

export function Workflow() {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto my-32 px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl md:text-4xl font-bold text-gradient mb-16"
      >
        مسیر تحلیل داده در سه گام
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.div
              className="flex flex-col items-center text-center"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              custom={index}
            >
              <div className="mb-4 rounded-full bg-white/10 p-4 ring-1 ring-white/15">
                <step.icon className="h-10 w-10 text-cyan-300" />
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-1 max-w-[200px] text-sm text-slate-400">{step.description}</p>
            </motion.div>

            {index < steps.length - 1 && (
              <motion.div 
                className="flex-1 w-full h-px md:h-auto md:w-auto relative mx-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
                style={{ transformOrigin: 'right' }}
              >
                  <div className="hidden md:block w-full h-px bg-gradient-to-l from-white/0 via-white/30 to-white/0" />
                  <div className="block md:hidden h-full w-px bg-gradient-to-b from-white/0 via-white/30 to-white/0 mx-auto" />
                   <ChevronLeft className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 animate-pulse" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
