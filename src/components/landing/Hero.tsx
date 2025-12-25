
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function Hero() {
  return (
    <>
      <ParticleBackground />
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="relative z-10 text-center"
      >
        <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="relative mx-auto mb-4 w-36 h-36 md:w-48 md:h-48"
        >
            <div className="absolute inset-0 bg-blue-500/50 rounded-full blur-2xl animate-pulse" />
            <Image 
                src={`${basePath}/logo.svg`}
                width={200} 
                height={200} 
                alt="Logo" 
                className="mx-auto drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]"
            />
        </motion.div>
        <motion.h1
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-headline text-5xl md:text-7xl font-black tracking-tighter glitch-text"
            data-text="آمار و احتمالات مهندسی"
        >
            آمار و احتمالات مهندسی
            <div className="glitch-scanline" />
        </motion.h1>
        
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-10"
        >
          <Link href="/dashboard/concepts">
            <Button 
                size="lg" 
                className="h-auto px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg shadow-blue-500/40 animate-pulse hover:animate-none shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
            >
                شروع
                <ArrowRight className="h-5 w-5 -scale-x-100" />
            </Button>
          </Link>
        </motion.div>
      </motion.header>
    </>
  );
}
