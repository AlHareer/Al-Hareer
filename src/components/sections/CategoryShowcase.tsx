import Link from 'next/link';
import Image from 'next/image';
import type { ProductTypeShowcaseItem } from '@/lib/products';
import type { ContentSettings } from '@/lib/siteSettings';

export default function CategoryShowcase({ items, settings }: { items: ProductTypeShowcaseItem[]; settings: ContentSettings }) {
  if (items.length === 0) return null;

  const heading = settings.home_showcase_heading || 'Shop By Category';
  const subtitle = settings.home_showcase_subtitle || 'From everyday kurtas to full festive sets — find your fit.';

  let imageOverrides: Record<string, string> = {};
  try { imageOverrides = JSON.parse(settings.home_showcase_images || '{}'); } catch { /* ignore */ }

  let labelOverrides: Record<string, string> = {};
  try { labelOverrides = JSON.parse(settings.home_showcase_labels || '{}'); } catch { /* ignore */ }

  let linkOverrides: Record<string, string> = {};
  try { linkOverrides = JSON.parse(settings.home_showcase_links || '{}'); } catch { /* ignore */ }

  const resolvedItems = items.map((item) => ({
    ...item,
    image: imageOverrides[item.productType] || item.image,
    label: labelOverrides[item.productType] || item.productType,
    href: linkOverrides[item.productType] || `/shop?category=${encodeURIComponent(item.productType)}`,
  }));

  const [big, ...rest] = resolvedItems;

  return (
    <section className="py-10 sm:py-14 bg-cream-50 border-b border-cream-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-700 tracking-tight">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-3.5 sm:gap-4">
          <ShowcaseBlock item={big} className="lg:row-span-2 aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px]" priority />
          {rest.map((item) => (
            <ShowcaseBlock key={item.productType} item={item} className="aspect-[4/3]" />
          ))}
        </div>

      </div>
    </section>
  );
}

function ShowcaseBlock({
  item,
  className,
  priority,
}: {
  item: ProductTypeShowcaseItem & { label?: string; href?: string };
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={item.href ?? `/shop?category=${encodeURIComponent(item.productType)}`}
      className={`group relative block overflow-hidden rounded-2xl border border-cream-300 shadow-sm transition-all duration-500 hover:shadow-luxury-hover ${className ?? ''}`}
    >
      <Image
        src={item.image}
        alt={item.label ?? item.productType}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
        <span className="block text-base sm:text-lg md:text-xl font-heading font-bold uppercase tracking-wide text-white drop-shadow-sm">
          {item.label ?? item.productType}
        </span>
      </div>
    </Link>
  );
}
