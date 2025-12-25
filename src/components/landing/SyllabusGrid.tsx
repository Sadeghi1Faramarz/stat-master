
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const syllabus = {
  concepts: {
    title: 'مفاهیم',
    items: ['تعاریف پایه', 'انواع متغیرها', 'مقیاس‌های اندازه‌گیری', 'پارامتر و آماره'],
  },
  data: {
    title: 'داده‌ها',
    items: ['جدول فراوانی', 'قانون استورجس', 'هیستوگرام', 'چندبر فراوانی', 'نمودار جعبه‌ای'],
  },
  measures: {
    title: 'شاخص‌ها',
    items: ['شاخص‌های مرکزی', 'شاخص‌های پراکندگی', 'واریانس (جامعه/نمونه)', 'انحراف معیار'],
  },
};

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

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
    },
  }),
};

export function SyllabusGrid() {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto my-24 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl md:text-4xl font-bold text-gradient mb-16"
      >
        سرفصل‌های تحت پوشش
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.values(syllabus).map((category, index) => (
          <motion.div
            key={category.title}
            className="border border-white/10 rounded-2xl p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">{category.title}</h3>
            <ul className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  variants={listItemVariants}
                  custom={index * category.items.length + itemIndex}
                >
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
