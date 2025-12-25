'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbNameMap: { [key: string]: string } = {
  'dashboard': 'داشبورد',
  'concepts': 'مفاهیم پایه',
  'data': 'سازماندهی داده',
  'measures': 'شاخص‌های آماری',
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  if (pathSegments.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('hidden md:block w-fit', className)}>
      <ol className="flex items-center gap-1 text-sm text-slate-400 py-2">
        <li>
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home className="h-4 w-4" />
            <span>خانه</span>
          </Link>
        </li>
        {pathSegments.slice(1).map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 2).join('/')}`;
          const isLast = index === pathSegments.length - 2;
          const name = breadcrumbNameMap[segment] || segment;

          return (
            <li key={href} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              {isLast ? (
                <span className="font-medium text-white">{name}</span>
              ) : (
                <Link href={href} className="hover:text-white transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
