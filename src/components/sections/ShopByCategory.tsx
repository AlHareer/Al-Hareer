import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { ContentSettings } from '@/lib/siteSettings';

type KurtaStyle = { name: string; slug: string; image: string; link?: string };

export default function ShopByCategory({ settings }: { settings: ContentSettings }) {
  let styles: KurtaStyle[] = [];
  try {
    const parsed = JSON.parse(settings.home_kurta_styles || '[]');
    if (Array.isArray(parsed)) styles = parsed.filter((s) => s.name && s.slug);
  } catch { /* ignore */ }

  if (styles.length === 0) return null;

  const heading = settings.home_kurtatype_heading || 'Our Collections';
  const subtitle = settings.home_kurtatype_subtitle || 'Authentic Styles for Every Occasion';

  return (
    <section className="py-10 sm:py-14 bg-cream-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-8 sm:mb-10">
          <div className="text-center">
            <h2 className="section-title">{heading}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <Link
            href="/shop"
            className="btn-gold mt-5 mx-auto w-fit md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 !py-2.5 !px-5 text-xs"
          >
            View All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar px-4 -mx-4 sm:px-0 sm:mx-0 snap-x snap-mandatory sm:snap-none">
          {styles.map((style, idx) => (
            <Link
              key={idx}
              href={style.link || `/shop?category=${encodeURIComponent(style.slug)}`}
              className="group flex flex-col items-center shrink-0 w-28 sm:w-auto snap-start"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 shrink-0 overflow-hidden rounded-full border border-cream-300 bg-cream-200 shadow-sm transition-all duration-300 group-hover:border-gold group-hover:shadow-luxury-hover">
                {style.image ? (
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 160px"
                    className="object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-heading font-bold text-brand-500">
                    {style.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-xs sm:text-sm font-semibold text-brand-500 transition-colors group-hover:text-gold-dark">
                {style.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
