import React from 'react';
import { Header } from '@/components/layout/Header';
import { HelpFab } from '@/components/layout/HelpFab';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="relative flex-1 w-full">
        <div className="fixed top-0 right-0 h-96 w-96 bg-blue-600/10 blur-[100px] -z-10" />
        <main className={cn('w-full max-w-7xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8', 'animate-enter')}>
          {children}
        </main>
      </div>
       <HelpFab />
    </div>
  );
}
