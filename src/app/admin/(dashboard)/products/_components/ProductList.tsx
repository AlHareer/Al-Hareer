'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ExternalLink,
  Pencil,
  Trash2,
  Package,
  Eye,
  EyeOff,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import { deleteProduct, toggleProductStatus } from '@/actions/admin/products';

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  featured_image_url: string | null;
  is_active: boolean;
  categoryName: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  totalStock: number;
  outOfStock: boolean;
  lowStock: boolean;
};

interface ProductListProps {
  products: ProductItem[];
}

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden' | 'lowStock' | 'outOfStock'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Toggle active status
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    startTransition(async () => {
      await toggleProductStatus(id, currentStatus);
      setTogglingId(null);
      router.refresh();
    });
  };

  // Delete product with confirmation
  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setConfirmDeleteId(null);
      setDeletingId(null);
      router.refresh();
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'active') return p.is_active;
    if (statusFilter === 'hidden') return !p.is_active;
    if (statusFilter === 'lowStock') return p.lowStock;
    if (statusFilter === 'outOfStock') return p.outOfStock;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-cream-300 bg-white p-3.5 sm:p-4 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-cream-300 bg-cream-50 pl-9 pr-3 text-xs text-brand-700 placeholder:text-muted focus:border-brand-400 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs thin-scrollbar">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-2.5 py-1.5 font-semibold shrink-0 transition-all ${
              statusFilter === 'all'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'bg-cream-100 text-muted hover:text-brand-700'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`rounded-lg px-2.5 py-1.5 font-semibold shrink-0 transition-all ${
              statusFilter === 'active'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'bg-cream-100 text-muted hover:text-brand-700'
            }`}
          >
            Active ({products.filter((p) => p.is_active).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('lowStock')}
            className={`rounded-lg px-2.5 py-1.5 font-semibold shrink-0 transition-all ${
              statusFilter === 'lowStock'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'bg-cream-100 text-muted hover:text-brand-700'
            }`}
          >
            Low Stock ({products.filter((p) => p.lowStock).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('outOfStock')}
            className={`rounded-lg px-2.5 py-1.5 font-semibold shrink-0 transition-all ${
              statusFilter === 'outOfStock'
                ? 'bg-brand-500 text-white shadow-2xs'
                : 'bg-cream-100 text-muted hover:text-brand-700'
            }`}
          >
            Out of Stock ({products.filter((p) => p.outOfStock).length})
          </button>
        </div>
      </div>

      {/* Product List Content */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-cream-300 bg-white py-14 text-center shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-muted">
            <Package className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-700">No products found</p>
          <p className="text-xs text-muted mt-1">
            {searchTerm || statusFilter !== 'all'
              ? 'Try changing your search terms or active filter.'
              : 'Add your first product to start selling.'}
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-3 text-xs font-semibold text-brand-500 hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs overflow-hidden">
          {/* 1. Mobile Cards View (No Horizontal Scrolling) */}
          <div className="sm:hidden divide-y divide-cream-100">
            {filteredProducts.map((p) => {
              const priceLabel =
                p.minPrice == null
                  ? '—'
                  : p.maxPrice != null && p.maxPrice !== p.minPrice
                    ? `${formatPrice(p.minPrice)} – ${formatPrice(p.maxPrice)}`
                    : formatPrice(p.minPrice);

              const stockBadgeClass = p.outOfStock
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : p.lowStock
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-cream-100 text-brand-700 border-cream-300';

              return (
                <div key={p.id} className="py-3.5 first:pt-1 last:pb-1 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                        {p.featured_image_url ? (
                          <Image src={p.featured_image_url} alt="" fill sizes="44px" className="object-cover" unoptimized />
                        ) : (
                          <Package className="h-5 w-5 m-auto text-muted opacity-50" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="font-heading text-xs font-bold text-brand-700 hover:text-brand-500 truncate block"
                        >
                          {p.name}
                        </Link>
                        <p className="text-[11px] text-muted truncate">{p.categoryName || 'Uncategorized'}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p.id, p.is_active)}
                      disabled={togglingId === p.id}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border shrink-0 transition-all ${
                        p.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-cream-100 text-muted border-cream-300'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-cream-100 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-brand-700">{priceLabel}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${stockBadgeClass}`}>
                        {p.outOfStock ? 'Out of stock' : `${p.totalStock} in stock`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/product/${encodeURIComponent(p.slug)}`}
                        target="_blank"
                        className="p-1.5 text-muted hover:text-brand-600 transition-colors"
                        title="View on store"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>

                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 text-muted hover:text-brand-600 transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className={`p-1.5 transition-all ${
                          confirmDeleteId === p.id ? 'text-rose-600 font-bold text-xs' : 'text-muted hover:text-rose-600'
                        }`}
                        title={confirmDeleteId === p.id ? 'Click to confirm' : 'Delete'}
                      >
                        {confirmDeleteId === p.id ? <span>Confirm?</span> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredProducts.map((p) => {
                  const priceLabel =
                    p.minPrice == null
                      ? '—'
                      : p.maxPrice != null && p.maxPrice !== p.minPrice
                        ? `${formatPrice(p.minPrice)} – ${formatPrice(p.maxPrice)}`
                        : formatPrice(p.minPrice);

                  const stockBadgeClass = p.outOfStock
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : p.lowStock
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-cream-100 text-brand-700 border-cream-300';

                  return (
                    <tr key={p.id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3.5 pr-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                            {p.featured_image_url ? (
                              <Image src={p.featured_image_url} alt="" fill sizes="44px" className="object-cover" unoptimized />
                            ) : (
                              <Package className="h-5 w-5 m-auto text-muted opacity-50" />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="text-sm font-semibold text-brand-700 hover:text-brand-500 transition-colors block"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[11px] font-mono text-muted">/{p.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 text-xs text-muted font-medium">
                        {p.categoryName || '—'}
                      </td>

                      <td className="py-3.5 pr-4 font-heading text-sm font-bold text-brand-700">
                        {priceLabel}
                      </td>

                      <td className="py-3.5 pr-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${stockBadgeClass}`}>
                          {p.outOfStock ? 'Out of stock' : `${p.totalStock} in stock`}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p.id, p.is_active)}
                          disabled={togglingId === p.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                            p.is_active
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-cream-100 text-muted border-cream-300 hover:bg-cream-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {p.is_active ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3" />}
                          <span>{p.is_active ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${encodeURIComponent(p.slug)}`}
                            target="_blank"
                            className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
                            title="View on store"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className={`rounded-lg p-2 transition-all ${
                              confirmDeleteId === p.id
                                ? 'bg-rose-50 text-rose-600 font-bold text-xs px-2'
                                : 'text-muted hover:text-rose-500 hover:bg-rose-50'
                            }`}
                            title={confirmDeleteId === p.id ? 'Click to confirm delete' : 'Delete'}
                          >
                            {confirmDeleteId === p.id ? <span>Confirm?</span> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
