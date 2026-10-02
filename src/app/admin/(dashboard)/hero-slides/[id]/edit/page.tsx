import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getHeroSlideById } from '@/actions/admin/heroSlides';
import HeroSlideForm from '../../_components/HeroSlideForm';

export const metadata = { title: 'Edit Hero Slide' };

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await getHeroSlideById(id);
  if (!slide) notFound();

  return (
    <div>
      <Link href="/admin/hero-slides" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-600 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home Customization
      </Link>
      <h1 className="font-heading text-2xl font-bold text-brand-700 mb-6">Edit Hero Slide</h1>
      <HeroSlideForm slide={slide} />
    </div>
  );
}
