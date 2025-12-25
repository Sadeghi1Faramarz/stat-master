
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ConceptsPageContent = dynamic(
  () => import('@/components/modules/concepts/ConceptsPageContent').then(mod => mod.ConceptsPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-10 w-1/2" />
        </div>
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
      </div>
    ),
  }
);

export function ConceptsPageLoader() {
  return <ConceptsPageContent />;
}
