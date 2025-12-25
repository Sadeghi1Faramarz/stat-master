import type { Metadata } from 'next';
import React from 'react';
import { MeasuresDataInput } from '@/components/modules/measures/MeasuresDataInput';
import { MeasuresResults } from '@/components/modules/measures/MeasuresResults';
import { useStatistics, RawData, GroupedData } from '@/hooks/use-statistics';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3 } from 'lucide-react';
import { MeasuresPageContent } from '@/components/modules/measures/MeasuresPageContent';

export const metadata: Metadata = {
  title: 'شاخص‌های آماری',
};

export default function MeasuresPage() {
  return <MeasuresPageContent />;
}
