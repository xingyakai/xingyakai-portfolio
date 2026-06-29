import { workSeries } from '@/data/works-data';
import WorkDetailClient from './WorkDetailClient';

export function generateStaticParams() {
  return workSeries.map(s => ({ slug: s.slug }));
}

export default function WorkDetailPage() {
  return <WorkDetailClient />;
}
