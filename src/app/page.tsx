
'use client';

import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import FeatureGrid from '@/components/landing/FeatureGrid';
import { Footer } from '@/components/landing/Footer';
import { ArrowRight } from 'lucide-react';
import { Workflow } from '@/components/landing/Workflow';
import { UseCases } from '@/components/landing/UseCases';
import { AboutProject } from '@/components/landing/AboutProject';
import { SyllabusGrid } from '@/components/landing/SyllabusGrid';
import { StudyTips } from '@/components/landing/StudyTips';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';


export default function CinematicLandingPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-start bg-[#0F1535] p-6 text-white overflow-x-hidden pt-12 md:pt-24">
            <Hero />
            <div className="mt-16 md:mt-32 w-full">
              <FeatureGrid />
            </div>
            
            <div className="w-full max-w-5xl mx-auto space-y-16 md:space-y-32">
              <Workflow />
              <UseCases />
              <AboutProject />
              <SyllabusGrid />
              <StudyTips />
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="my-16 md:my-32 text-center"
            >
              <Link href="/dashboard/concepts">
                <Button 
                    size="lg" 
                    className="h-16 px-10 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg shadow-blue-500/50 animate-pulse hover:animate-none transition-all duration-300 hover:scale-105 hover:shadow-blue-500/70"
                >
                    همین حالا شروع کنید
                    <ArrowRight className="mr-3 h-6 w-6 -scale-x-100" />
                </Button>
              </Link>
            </motion.div>

            <Footer />
        </div>
    );
}
