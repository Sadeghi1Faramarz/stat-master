
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ProbabilityPageContent = dynamic(
  () => import('@/components/modules/probability/ProbabilityPageContent').then(mod => mod.ProbabilityPageContent),
  {
    ssr: false,
    loading: () => (
       <div className="space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-12 w-full max-w-md" />
        <Skeleton className="h-96 w-full" />
      </div>
    ),
  }
);

export function ProbabilityPageLoader() {
  return <ProbabilityPageContent />;
}
