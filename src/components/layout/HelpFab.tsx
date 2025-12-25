"use client";

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { HelpCircle, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const helpContent: Record<string, { title: string; description: React.ReactNode; extra?: React.ReactNode }> = {
  '/dashboard/concepts': {
    title: 'راهنمای مفاهیم پایه',
    description: 'در این بخش با تعاریف اصلی و بلوک‌های سازنده آمار آشنا می‌شوید. می‌توانید انواع متغیرها را در نمودار درختی تعاملی کاوش کرده و مقیاس‌های اندازه‌گیری را با هم مقایسه کنید.',
  },
  '/dashboard/data': {
    title: 'راهنمای سازماندهی داده‌ها',
    description: 'اینجا جایی است که داده‌های خام خود را به اطلاعات معنادار تبدیل می‌کنید. اعداد خود را وارد کرده، جدول فراوانی را مشاهده کنید و نمودارهای بصری مانند هیستوگرام را تحلیل نمایید.',
  },
  '/dashboard/measures': {
    title: 'راهنمای شاخص‌های آماری',
    description: 'در این ماژول، می‌توانید شاخص‌های مرکزی (مانند میانگین، میانه، مد) و شاخص‌های پراکندگی (مانند واریانس و انحراف معیار) را برای داده‌های خود محاسبه کنید.',
    extra: (
      <>
        <Separator className="my-4" />
        <h4 className="font-bold text-lg text-white mb-2">نمایش فرمول‌ها</h4>
        <p className="text-sm text-slate-300">
          برای دیدن فرمول استفاده شده در محاسبه هر شاخص، ماوس خود را روی آیکون <HelpCircle className="inline h-4 w-4" /> کنار عنوان کارت نگه دارید.
        </p>
      </>
    )
  },
  'default': {
    title: 'به StatsNav خوش آمدید!',
    description: 'این یک ابزار مدرن برای یادگیری آمار و احتمالات مهندسی است. برای شروع، یکی از بخش‌ها را از منوی سمت راست انتخاب کنید.',
  }
};

export function HelpFab() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const content = useMemo(() => {
    return helpContent[pathname] || helpContent.default;
  }, [pathname]);

  return (
    <>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 8,
        }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg shadow-primary/30"
          onClick={() => setIsOpen(true)}
          aria-label="Help"
        >
          <HelpCircle className="h-7 w-7" />
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glassmorphism">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-white">
                <Sigma />
                {content.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300 pt-2 text-base">
                {content.description}
            </DialogDescription>
          </DialogHeader>
          {content.extra}
        </DialogContent>
      </Dialog>
    </>
  );
}
