
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountingTab } from './CountingTab';
import { VennDiagram } from './VennDiagram';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ExperimentsTab = dynamic(() => import('./ExperimentsTab').then(mod => mod.ExperimentsTab), {
  ssr: false,
  loading: () => (
    <div className="space-y-8">
      <Skeleton className="h-[350px] w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    </div>
  ),
});


export function ProbabilityPageContent() {
  return (
    <div className="space-y-8 text-right" dir="rtl">
      <header className="text-right space-y-2">
        <h1 className="text-4xl font-bold text-gradient">تئوری و آزمایشگاه احتمالات</h1>
        <p className="text-lg text-slate-300">
          محاسبه شانس و تحلیل پدیده‌های تصادفی
        </p>
      </header>
       <Tabs defaultValue="counting" className="w-full">
        <div className="flex w-full mb-8">
             <TabsList className="ml-auto w-full md:w-fit justify-start md:justify-center overflow-x-auto scrollbar-hide bg-white/5 p-1 rounded-full border border-white/10">
                <TabsTrigger value="counting" className="rounded-full text-slate-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap flex-shrink-0">آنالیز ترکیبی</TabsTrigger>
                <TabsTrigger value="set-theory" className="rounded-full text-slate-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap flex-shrink-0">نظریه مجموعه‌ها</TabsTrigger>
                <TabsTrigger value="experiments" className="rounded-full text-slate-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap flex-shrink-0">آزمایشگاه</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="counting" className="mt-6">
            <CountingTab />
        </TabsContent>

        <TabsContent value="set-theory" className="mt-6">
            <VennDiagram />
        </TabsContent>

        <TabsContent value="experiments" className="mt-6">
            <ExperimentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
