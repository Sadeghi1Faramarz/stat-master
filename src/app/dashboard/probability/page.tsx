
import type { Metadata } from 'next';
import { ProbabilityPageLoader } from '@/components/modules/probability/ProbabilityPageLoader';

// This metadata can be exported from a Server Component.
export const metadata: Metadata = {
  title: 'احتمالات | StatsNav',
  description: 'محاسبه جایگشت، ترکیب و شبیه‌سازی آزمایش‌های تصادفی.',
};

export default function ProbabilityPage() {
  return <ProbabilityPageLoader />;
}
