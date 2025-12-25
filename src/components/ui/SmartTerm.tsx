
'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { glossary } from '@/lib/glossary-terms';

type SmartTermProps = {
  termKey: keyof typeof glossary;
  children: React.ReactNode;
};

export function SmartTerm({ termKey, children }: SmartTermProps) {
  const definition = glossary[termKey];

  if (!definition) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="border-b-2 border-dotted border-blue-400 cursor-help transition-colors hover:border-blue-300">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-right" side="top">
          <p>{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
