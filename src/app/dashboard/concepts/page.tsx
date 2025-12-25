import type { Metadata } from 'next';
import { ConceptsPageLoader } from '@/components/modules/concepts/ConceptsPageLoader';

export const metadata: Metadata = {
  title: 'مفاهیم پایه | StatsNav',
};

export default function ConceptsPage() {
  return <ConceptsPageLoader />;
}
