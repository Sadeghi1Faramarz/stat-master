'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { conceptsData } from '@/lib/concepts-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ScalesTable() {
  const { items, properties } = conceptsData.scales;

  const Icon = ({ value }: { value: boolean }) => 
    value 
      ? <Check className="h-5 w-5 text-green-400 mx-auto" /> 
      : <X className="h-5 w-5 text-red-400 mx-auto" />;

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 glassmorphism">
      <Table>
        <TableHeader>
          <TableRow className="border-b-white/10 hover:bg-white/5">
            <TableHead className="text-right font-bold text-white">مقیاس</TableHead>
            <TableHead className="text-center font-bold text-white">{properties.order}</TableHead>
            <TableHead className="text-center font-bold text-white">{properties.distance}</TableHead>
            <TableHead className="text-center font-bold text-white">{properties.zero}</TableHead>
            <TableHead className="text-center font-bold text-white">{properties.operations}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((scale, index) => (
            <TableRow
              key={index}
              className={cn("border-b-white/10 hover:bg-white/5 transition-colors", index === items.length - 1 && "border-none")}
              as={motion.tr}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
            >
              <TableCell className="text-right font-medium text-slate-200">{scale.name}</TableCell>
              <TableCell><Icon value={scale.order} /></TableCell>
              <TableCell><Icon value={scale.distance} /></TableCell>
              <TableCell><Icon value={scale.zero} /></TableCell>
              <TableCell className="text-center text-slate-300">{scale.operations}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
