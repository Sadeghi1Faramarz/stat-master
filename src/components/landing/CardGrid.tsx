
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/modules/landing/TiltCard';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Module {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CardGridProps {
  modules: Module[];
}

const cardContexts = [
    { 
        glowClass: "group-hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.3)]", 
        iconColor: "text-cyan-400" 
    },
    { 
        glowClass: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]", 
        iconColor: "text-purple-400" 
    },
    { 
        glowClass: "group-hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]", 
        iconColor: "text-amber-400" 
    },
    { 
        glowClass: "group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]", 
        iconColor: "text-green-400" 
    },
];

export function CardGrid({ modules }: CardGridProps) {
  return (
    <main className="relative z-10 mt-32 mb-32 w-full">
        <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-8 px-4 md:px-0">
            {modules.map((module, index) => (
                <motion.div
                    key={module.href}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
                    className="w-full"
                >
                    <Link href={module.href}>
                        <TiltCard className={cn("h-auto min-h-[180px] w-full !rounded-xl md:!rounded-2xl", cardContexts[index % cardContexts.length].glowClass)}>
                        <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8 text-center">
                            <div className="mb-3 md:mb-4 rounded-full bg-white/5 p-3 md:p-4 ring-1 ring-white/10">
                                <module.icon className={cn("h-8 w-8 md:h-12 md:w-12", cardContexts[index % cardContexts.length].iconColor)} />
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-white whitespace-normal">{module.title}</h3>
                            <p className="mt-1 md:mt-2 max-w-[200px] text-xs md:text-sm text-slate-300">{module.description}</p>
                        </div>
                        </TiltCard>
                    </Link>
                </motion.div>
            ))}
        </div>
    </main>
  );
}
