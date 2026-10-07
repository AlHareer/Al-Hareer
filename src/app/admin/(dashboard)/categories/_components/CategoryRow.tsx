'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteCategory } from '@/actions/admin/categories';

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  product_count: number;
};

export default function CategoryRow({ category }: { category: Category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteCategory(category.id);
      router.refresh();
    });
  };

  return (
    <tr className="hover:bg-cream-100 transition-colors">
      <td className="py-3.5 pr-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-white">
            {category.image_url && (
              <Image src={category.image_url} alt="" fill sizes="44px" className="object-cover" unoptimized />
            )}
          </div>
          <span className="text-sm font-semibold text-brand-700">{category.name}</span>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-xs font-mono text-muted">{category.slug}</td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
            category.product_count === 0 ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]' : 'bg-cream-100 text-brand-700 border-cream-300'
          }`}
        >
          {category.product_count}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase border ${
            category.is_active ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]' : 'bg-cream-100 text-muted border-cream-300'
          }`}
        >
          {category.is_active ? 'Active' : 'Hidden'}
        </span>
      </td>
      <td className="py-3.5 pr-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-lg p-2 transition-all ${
              confirming ? 'text-[#024F5F] bg-[#F6F1EC]' : 'text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC]'
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
