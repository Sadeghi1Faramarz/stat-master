import type { Metadata } from 'next';
import { DataPageContent } from '@/components/modules/data/DataPageContent';

export const metadata: Metadata = {
  title: 'سازماندهی داده',
};

export default function DataPage() {
  return <DataPageContent />;
}
