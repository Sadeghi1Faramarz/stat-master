
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BrainCircuit, BarChart3, Calculator, Dices, Menu, X, type LucideIcon, LayoutGrid } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const menuItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard/concepts', label: 'مفاهیم پایه', icon: BrainCircuit },
  { href: '/dashboard/data', label: 'تنظیم داده‌ها', icon: BarChart3 },
  { href: '/dashboard/measures', label: 'شاخص‌های آماری', icon: Calculator },
  { href: '/dashboard/probability', label: 'احتمالات', icon: Dices },
  { href: '/dashboard/workbench', label: 'میزکار', icon: LayoutGrid },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {menuItems.map(item => {
        const isActive = pathname.startsWith(item.href);
        const linkContent = (
          <div
            className={cn(
              'relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white whitespace-nowrap rounded-md hover:bg-white/10',
              isActive && 'text-white bg-white/10',
              isMobile && 'w-full justify-start text-base p-4 border-b border-white/10 rounded-none'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
            {!isMobile && isActive && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-500 rounded-full"
              />
            )}
          </div>
        );

        return isMobile ? (
          <SheetClose key={item.href} asChild>
            <Link href={item.href}>{linkContent}</Link>
          </SheetClose>
        ) : (
          <Link key={item.href} href={item.href}>
            {linkContent}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0F1535]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Desktop Header */}
        <div className="hidden md:flex w-full items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
            <Image
                src={`${basePath}/logo.svg`}
                width={40}
                height={40}
                alt="Logo"
                className="drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            />
            <h1 className="text-xl font-bold text-white">StatsNav</h1>
            </Link>

            <nav className="flex items-center gap-2">
            <NavLinks />
            </nav>
            
            <div className='w-40' />
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden relative">
            <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                <Image src={`${basePath}/logo.svg`} width={32} height={32} alt="Logo" />
                <span className="font-bold text-lg text-white">StatsNav</span>
            </Link>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild className="absolute right-0 top-1/2 -translate-y-1/2">
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6 text-white" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0F1535] border-l-white/10 p-0 pt-10">
                    <SheetTitle className="sr-only">منوی ناوبری</SheetTitle>
                    <SheetDescription className="sr-only">
                        لینک‌های اصلی برای ناوبری در سایت.
                    </SheetDescription>
                    <div className="flex flex-col">
                        <Link href="/" className="flex items-center gap-3 px-4 pb-6 border-b border-white/10" onClick={() => setIsSheetOpen(false)}>
                        <Image src={`${basePath}/logo.svg`} width={40} height={40} alt="Logo" />
                        <h1 className="text-xl font-bold text-white">StatsNav</h1>
                        </Link>
                        <nav className="flex flex-col mt-4">
                        <NavLinks isMobile />
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
