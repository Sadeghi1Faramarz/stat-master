
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Footer() {
    return (
        <motion.footer 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="relative mt-20 mb-8 w-full z-20 md:fixed md:bottom-6 md:left-0 md:right-0 md:mt-0 md:mb-0"
        >
            <div className="max-w-2xl mx-auto glassmorphism rounded-full px-4 py-2">
                <div className="flex items-center justify-center text-[9px] text-slate-400">
                    <div className="text-center">
                        © ساخته شده با <span className="animate-pulse text-red-500">❤️</span> توسط <strong className="font-bold text-slate-300">فرامرز صادقی</strong> - دانشگاه آزاد اسلامی واحد سیرجان
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
