
import type { Metadata, Viewport } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { cn } from '@/lib/utils';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: {
    template: '%s | StatMaster',
    default: 'StatMaster | داشبورد آمار مهندسی',
  },
  description: 'ابزار تحلیل آماری، رسم نمودار و یادگیری مفاهیم مهندسی.',
  authors: [{ name: 'Faramarz Sadeghi' }],
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StatMaster',
  },
  icons: {
    icon: `${basePath}/logo.svg`,
    apple: `${basePath}/logo.svg`,
  },
};

export const viewport: Viewport = {
  themeColor: '#0F1535',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={cn('font-body antialiased', vazir.variable)}>
        <AmbientBackground />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
