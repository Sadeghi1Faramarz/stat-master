
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type ExpandableCardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  contentClassName?: string;
};

export function ExpandableCard({
  title,
  children,
  className,
  cardClassName,
  contentClassName,
}: ExpandableCardProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
        <Card className={cn('relative group', className, cardClassName)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className={contentClassName}>{children}</CardContent>
        </Card>
    )
  }
  
  return (
    <Dialog>
      <Card className={cn('relative group', className, cardClassName)}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className={contentClassName}>{children}</CardContent>
      </Card>

      <DialogContent className="p-0 md:p-6 w-screen h-screen md:w-full md:h-[90vh] md:max-w-6xl flex flex-col glassmorphism md:rounded-lg">
        <DialogHeader className="p-6 md:p-0">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 md:px-0 pb-6 md:pb-0">{children}</div>
         <DialogClose asChild>
          <Button variant="outline" className="absolute top-4 left-4 h-9 w-9 p-0">
             <Minimize2 className="h-5 w-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
