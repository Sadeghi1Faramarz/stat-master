
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { conceptsData } from "@/lib/concepts-data";
import { ScalesTable } from "@/components/modules/concepts/ScalesTable";
import { RefreshCw, Search, Users } from "lucide-react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { FlipCard } from "@/components/ui/FlipCard";
import { ScalesGame } from "@/components/modules/concepts/ScalesGame";
import { ExpandableCard } from "@/components/ui/ExpandableCard";

const VariablesTree = dynamic(() => import('@/components/modules/concepts/VariablesTree').then(mod => mod.VariablesTree), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false,
});

const conceptCards = [
    {
        key: 'descriptiveVsInferential',
        icon: Search,
        title: conceptsData.definitions.descriptiveVsInferential.title,
        description: (
            <p>
                آمار <span className="font-bold text-cyan-400">توصیفی</span> به خلاصه‌سازی و توصیف ویژگی‌های یک مجموعه داده می‌پردازد (مانند میانگین)، در حالی که آمار <span className="font-bold text-cyan-400">استنباطی</span> از داده‌های نمونه برای نتیجه‌گیری و پیش‌بینی در مورد یک جمعیت بزرگتر استفاده می‌کند.
            </p>
        ),
    },
    {
        key: 'populationVsSample',
        icon: Users,
        title: conceptsData.definitions.populationVsSample.title,
        description: (
             <p>
                <span className="font-bold text-cyan-400">جمعیت</span> کل گروهی است که می‌خواهیم در مورد آن نتیجه‌گیری کنیم (مثلاً تمام دانشجویان یک دانشگاه). <span className="font-bold text-cyan-400">نمونه</span> یک زیرمجموعه انتخاب شده از جمعیت است که برای جمع‌آوری داده استفاده می‌شود.
            </p>
        ),
    }
]


export function ConceptsPageContent() {
  return (
    <div className="space-y-8" dir="rtl">
      
      <header className="text-right space-y-2">
        <h1 className="text-4xl font-bold text-gradient">مفاهیم پایه آمار</h1>
      </header>

      <Tabs defaultValue="definitions" className="w-full">
        <div className="flex w-full mb-8">
             <TabsList className="ml-auto w-full md:w-fit justify-start md:justify-center overflow-x-auto scrollbar-hide bg-white/5 p-1 rounded-full border border-white/10">
                <TabsTrigger value="definitions" className="rounded-full text-slate-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap flex-shrink-0">تعاریف کلیدی</TabsTrigger>
                <TabsTrigger value="variables" className="rounded-full text-slate-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap flex-shrink-0">انواع متغیرها</TabsTrigger>
                <TabsTrigger value="scales" className="rounded-full text-slate-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap flex-shrink-0">مقیاس‌ها</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="definitions" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            {conceptCards.map((concept) => (
              <FlipCard
                key={concept.key}
                front={
                  <>
                    <RefreshCw className="absolute top-4 right-4 h-5 w-5 text-white/30" />
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative rounded-full bg-white/5 p-4 ring-1 ring-white/10">
                        <concept.icon className="h-16 w-16 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white text-center">{concept.title}</h3>
                  </>
                }
                back={
                  <div>
                    <h3 className="mb-4 text-xl font-bold text-white text-right">{concept.title}</h3>
                    <div className="text-right text-slate-300 leading-relaxed [direction:rtl]">
                        {concept.description}
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="variables" className="mt-6">
          <ExpandableCard
            title="درخت انواع متغیرها"
            cardClassName="glassmorphism border border-white/5 shadow-2xl"
          >
             <p className="text-right text-sm text-muted-foreground px-6 [direction:rtl]">
                برای مشاهده تعریف هر نوع، ماوس را روی گره مربوطه نگه دارید.
              </p>
              <VariablesTree />
          </ExpandableCard>
        </TabsContent>

        <TabsContent value="scales" className="mt-6">
            <div className="space-y-12">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="text-right">مقایسه مقیاس‌های اندازه‌گیری</CardTitle>
                  <CardDescription className="text-right">
                    ویژگی‌ها و عملیات مجاز برای هر مقیاس
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScalesTable />
                </CardContent>
              </Card>
              <ScalesGame />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
