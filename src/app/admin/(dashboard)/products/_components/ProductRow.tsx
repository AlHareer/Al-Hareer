'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/actions/admin/products';

type Product = {
  id: string;
  name: string;
  featured_image_url: string | null;
  is_active: boolean;
  categoryName: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  totalStock: number;
  outOfStock: boolean;
  lowStock: boolean;
};

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteProduct(product.id);
      router.refresh();
    });
  };

  const stockBadgeClass = product.outOfStock
    ? 'bg-red-50 text-red-700 border-red-200'
    : product.lowStock
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-cream-100 text-brand-700 border-cream-300';

  const priceLabel =
    product.minPrice == null
      ? '—'
      : product.maxPrice != null && product.maxPrice !== product.minPrice
        ? `${formatPrice(product.minPrice)} – ${formatPrice(product.maxPrice)}`
        : formatPrice(product.minPrice);

  return (
    <tr className="hover:bg-cream-100 transition-colors">
      <td className="py-3.5 pr-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-white">
            {product.featured_image_url && (
              <Image src={product.featured_image_url} alt="" fill sizes="44px" className="object-cover" unoptimized />
            )}
          </div>
          <span className="text-sm font-semibold text-brand-700">{product.name}</span>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-xs text-muted">{product.categoryName || '—'}</td>
      <td className="py-3.5 pr-4 text-sm text-brand-700">{priceLabel}</td>
      <td className="py-3.5 pr-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${stockBadgeClass}`}>{product.totalStock}</span>
      </td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase border ${
            product.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-cream-100 text-muted border-cream-300'
          }`}
        >
          {product.is_active ? 'Active' : 'Hidden'}
        </span>
      </td>
      <td className="py-3.5 pr-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-lg p-2 transition-all ${
              confirming ? 'text-red-600 bg-red-50' : 'text-muted hover:text-red-500 hover:bg-red-50'
            }`}
            title={confirming ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
