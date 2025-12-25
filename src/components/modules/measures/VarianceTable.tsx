
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

type VarianceTableProps = {
  data: number[];
  mean: number;
};

export function VarianceTable({ data, mean }: VarianceTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const calculations = data.map(val => {
    const deviation = val - mean;
    const squaredDeviation = Math.pow(deviation, 2);
    return { val, deviation, squaredDeviation };
  });

  const sumOfSquaredDeviations = calculations.reduce((acc, curr) => acc + curr.squaredDeviation, 0);

  return (
    <div className="rounded-lg border border-white/10 glassmorphism p-1">
      <ScrollArea className="h-full max-h-60 w-full">
        <Table className="text-white">
          <TableHeader>
            <TableRow className="border-b-white/10 hover:bg-white/5">
              <TableHead className="text-center font-mono">xᵢ</TableHead>
              <TableHead className="text-center font-mono">xᵢ - x̄</TableHead>
              <TableHead className="text-center font-mono">(xᵢ - x̄)²</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculations.map((row, index) => (
              <TableRow key={index} className="border-b-white/10 hover:bg-white/5 font-mono text-sm">
                <TableCell className="text-center tabular-nums">{row.val.toFixed(2)}</TableCell>
                <TableCell className="text-center tabular-nums">{row.deviation.toFixed(2)}</TableCell>
                <TableCell className="text-center tabular-nums">{row.squaredDeviation.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="font-bold bg-secondary/60 hover:bg-secondary/70">
              <TableHead className="text-center tabular-nums">n = {data.length}</TableHead>
              <TableHead className="text-center">Σ ≈ 0</TableHead>
              <TableHead className="text-center text-amber-300 tabular-nums">
                Σ = {sumOfSquaredDeviations.toFixed(2)}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
}
