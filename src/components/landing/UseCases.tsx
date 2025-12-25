
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Factory, FlaskConical } from 'lucide-react';

const useCases = [
  {
    icon: Factory,
    title: 'کنترل کیفیت صنعتی',
    description: 'استفاده از شاخص‌های پراکندگی مانند واریانس و انحراف معیار برای نظارت بر خطوط تولید، کاهش خطا و تضمین کیفیت یکنواخت محصولات.',
  },
  {
    icon: Target,
    title: 'تحلیل بازار و فروش',
    description: 'شناخت رفتار مشتریان، بخش‌بندی بازار و تعیین استراتژی‌های قیمت‌گذاری با استفاده از شاخص‌های مرکزی مانند مد و میانه.',
  },
  {
    icon: FlaskConical,
    title: 'پژوهش‌های علمی',
    description: 'کشف روابط پنهان بین متغیرها، اعتبارسنجی فرضیات و نتیجه‌گیری‌های قابل اتکا در تحقیقات دانشگاهی و علمی با آمار استنباطی.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function UseCases() {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto my-24 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl md:text-4xl font-bold text-gradient mb-16"
      >
        آمار در دنیای واقعی
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {useCases.map((useCase, index) => (
          <motion.div
            key={index}
            className="glassmorphism rounded-xl p-8 text-center flex flex-col items-center"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <div className="mb-6 rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
              <useCase.icon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
            <p className="text-slate-400 text-base leading-relaxed">{useCase.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
