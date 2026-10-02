import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HeroSlideForm from '../_components/HeroSlideForm';

export const metadata = { title: 'New Hero Slide' };

export default function NewHeroSlidePage() {
  return (
    <div>
      <Link href="/admin/hero-slides" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-600 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home Customization
      </Link>
      <h1 className="font-heading text-2xl font-bold text-brand-700 mb-6">New Hero Slide</h1>
      <HeroSlideForm />
    </div>
  );
}
