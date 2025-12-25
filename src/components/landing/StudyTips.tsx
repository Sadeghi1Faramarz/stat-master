
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const tips = [
  {
    title: 'دقت در واریانس',
    description: 'همیشه به یاد داشته باشید که مخرج واریانس برای جامعه (n) و برای نمونه (n-1) است. این تفاوت کوچک، نتایج بزرگی را رقم می‌زند.',
  },
  {
    title: 'تحلیل داده‌های پرت',
    description: 'نمودار جعبه‌ای بهترین دوست شما برای شناسایی سریع داده‌های پرت (Outliers) است. این داده‌ها می‌توانند میانگین را به شدت تحت تاثیر قرار دهند.',
  },
  {
    title: 'انتخاب نمودار مناسب',
    description: 'از هیستوگرام برای داده‌های کمی پیوسته و از نمودار میله‌ای برای داده‌های کیفی یا کمی گسسته استفاده کنید تا تصویر دقیقی از توزیع ارائه دهید.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function StudyTips() {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto my-24 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl md:text-4xl font-bold text-gradient mb-16"
      >
        نکات کلیدی برای موفقیت در آمار
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            className="relative glassmorphism rounded-xl p-8 overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-cyan-400/50" />
            <div className="flex items-start gap-4">
                <div className="mt-1">
                    <Lightbulb className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                    <p className="text-slate-400 text-base leading-relaxed">{tip.description}</p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
