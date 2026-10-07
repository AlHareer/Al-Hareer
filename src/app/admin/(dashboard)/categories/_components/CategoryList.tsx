'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutGrid,
  List,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  Check,
  Package,
  Eye,
  EyeOff,
  FolderTree,
  ArrowRight,
  Filter,
  Home,
} from 'lucide-react';
import { deleteCategory, toggleCategoryStatus } from '@/actions/admin/categories';

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  show_on_homepage?: boolean;
  product_count: number;
  parent_id?: string | null;
};

interface CategoryListProps {
  categories: CategoryItem[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden' | 'empty'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Copy storefront link
  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/shop?category=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Toggle active/hidden status
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    startTransition(async () => {
      await toggleCategoryStatus(id, currentStatus);
      setTogglingId(null);
      router.refresh();
    });
  };

  // Delete category
  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      await deleteCategory(id);
      setConfirmDeleteId(null);
      setDeletingId(null);
      router.refresh();
    });
  };

  // Filter & Search logic
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'active') return cat.is_active;
    if (filterStatus === 'hidden') return !cat.is_active;
    if (filterStatus === 'empty') return cat.product_count === 0;
    return true;
  });

  // Build parent-first display order: parents first, each followed by its children
  const orderedCategories = (() => {
    const parents = filteredCategories.filter((c) => !c.parent_id);
    const childrenOf = (id: string) => filteredCategories.filter((c) => c.parent_id === id);
    const result: (CategoryItem & { isChild?: boolean })[] = [];
    for (const p of parents) {
      result.push(p);
      for (const child of childrenOf(p.id)) result.push({ ...child, isChild: true });
    }
    // Orphaned children (parent filtered out) go at the end
    const placed = new Set(result.map((c) => c.id));
    for (const c of filteredCategories) if (!placed.has(c.id)) result.push({ ...c, isChild: true });
    return result;
  })();

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Filters, View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-cream-300 bg-white p-3.5 sm:p-4 shadow-2xs">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-cream-300 bg-cream-50 pl-9 pr-3 text-xs text-brand-700 placeholder:text-muted focus:border-brand-400 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Right: Filter tabs & View toggle */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {/* Status filter tabs */}
          <div className="inline-flex rounded-xl bg-cream-100 p-1 border border-cream-300 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-muted hover:text-brand-700'
              }`}
            >
              All ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('active')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                filterStatus === 'active'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-muted hover:text-brand-700'
              }`}
            >
              Active ({categories.filter((c) => c.is_active).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('hidden')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                filterStatus === 'hidden'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-muted hover:text-brand-700'
              }`}
            >
              Hidden ({categories.filter((c) => !c.is_active).length})
            </button>
          </div>

          {/* List vs Grid View switcher */}
          <div className="inline-flex rounded-xl bg-cream-100 p-1 border border-cream-300">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-muted hover:text-brand-700'
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-muted hover:text-brand-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: Empty State, Grid View, or Table View */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-cream-300 bg-white py-14 text-center shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-muted">
            <FolderTree className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-700">No categories found</p>
          <p className="text-xs text-muted mt-1">
            {searchTerm || filterStatus !== 'all'
              ? 'Try changing your search keywords or filter.'
              : 'Click "New Category" above to create your first collection.'}
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="mt-3 text-xs font-semibold text-brand-500 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* 1. VISUAL GRID VIEW (Card Mode) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderedCategories.map((cat) => (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-luxury"
            >
              {/* Category Cover Image Header */}
              <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-cream-100 border-b border-cream-200">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-cream-100 text-cream-400">
                    <FolderTree className="h-12 w-12 opacity-40" />
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-xs ${
                      cat.is_active
                        ? 'bg-[#024F5F]/90 text-white border-[#CFAC64]'
                        : 'bg-[#F6F1EC]/80 text-cream-200 border-[#CFAC64]'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </span>

                  <span className="rounded-full bg-[#00303A]/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                    Order #{cat.sort_order}
                  </span>

                  {cat.show_on_homepage && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-brand-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-brand-400"
                      title="Shown on homepage"
                    >
                      <Home className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Products Count Badge */}
                <div className="absolute right-3 bottom-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-brand-700 shadow-sm border border-cream-300">
                    <Package className="h-3.5 w-3.5 text-brand-500" />
                    <span>{cat.product_count} product{cat.product_count === 1 ? '' : 's'}</span>
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading text-base sm:text-lg font-bold text-brand-700 truncate">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Slug with Copy action */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span className="font-mono text-[11px] text-brand-600 bg-cream-100 px-2 py-0.5 rounded border border-cream-200 truncate">
                      /{cat.slug}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(cat.slug)}
                      className="p-1 text-muted hover:text-brand-700 transition-colors"
                      title="Copy Storefront Link"
                    >
                      {copiedSlug === cat.slug ? (
                        <Check className="h-3.5 w-3.5 text-[#024F5F]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    {copiedSlug === cat.slug && (
                      <span className="text-[10px] text-[#024F5F] font-semibold animate-fade-in">
                        Copied!
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-muted line-clamp-2 min-h-[32px]">
                    {cat.description || 'No description added yet for this collection.'}
                  </p>
                </div>

                {/* Action Bar */}
                <div className="mt-4 pt-3.5 border-t border-cream-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View in Storefront */}
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-lg border border-cream-300 bg-cream-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-all hover:bg-white hover:border-brand-400"
                      title="View category on storefront"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-brand-500" />
                      <span className="hidden sm:inline">Store</span>
                    </Link>

                    {/* Quick Active/Hidden toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat.id, cat.is_active)}
                      disabled={togglingId === cat.id}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                        cat.is_active
                          ? 'border-[#CFAC64] bg-[#F6F1EC] text-[#024F5F] hover:bg-[#F6F1EC]'
                          : 'border-cream-300 bg-cream-100 text-muted hover:text-brand-700'
                      }`}
                      title={cat.is_active ? 'Click to hide category' : 'Click to activate category'}
                    >
                      {cat.is_active ? <Eye className="h-3.5 w-3.5 text-[#024F5F]" /> : <EyeOff className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{cat.is_active ? 'Active' : 'Hidden'}</span>
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="rounded-lg p-2 text-muted hover:bg-brand-500/10 hover:text-brand-600 transition-colors"
                      title="Edit Category"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      disabled={deletingId === cat.id}
                      className={`rounded-lg p-2 transition-all ${
                        confirmDeleteId === cat.id
                          ? 'bg-[#F6F1EC] text-[#024F5F] font-bold text-xs px-2.5'
                          : 'text-muted hover:bg-[#F6F1EC] hover:text-[#024F5F]'
                      }`}
                      title={confirmDeleteId === cat.id ? 'Click again to confirm delete' : 'Delete category'}
                    >
                      {confirmDeleteId === cat.id ? (
                        <span>Confirm?</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 2. TABLE VIEW */
        <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-6 shadow-2xs overflow-hidden">
          {/* Mobile Card fallback */}
          <div className="sm:hidden divide-y divide-cream-100">
            {orderedCategories.map((cat) => (
              <div key={cat.id} className="py-3.5 first:pt-1 last:pb-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                      {cat.image_url ? (
                        <Image src={cat.image_url} alt="" fill sizes="40px" className="object-cover" unoptimized />
                      ) : (
                        <FolderTree className="h-5 w-5 m-auto text-muted opacity-50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading text-xs font-bold text-brand-700 truncate">{cat.name}</p>
                      <p className="font-mono text-[10px] text-muted truncate">/{cat.slug}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border shrink-0 ${
                      cat.is_active ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]' : 'bg-cream-100 text-muted border-cream-300'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted border-t border-cream-100 pt-2">
                  <span>{cat.product_count} products</span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                      target="_blank"
                      className="p-1 text-muted hover:text-brand-600"
                      title="Store"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="p-1 text-muted hover:text-brand-600"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 text-muted hover:text-[#024F5F]"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[560px] text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 text-[10px] font-bold uppercase tracking-wider text-muted">
                  <th className="pb-3 pl-2">Category</th>
                  <th className="pb-3">Slug</th>
                  <th className="pb-3">Products</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orderedCategories.map((cat) => (
                  <tr key={cat.id} className={`hover:bg-cream-50/70 transition-colors ${cat.isChild ? 'bg-cream-50/40' : ''}`}>
                    <td className="py-3.5 pr-4 pl-2">
                      <div className={`flex items-center gap-3 ${cat.isChild ? 'pl-5' : ''}`}>
                        {cat.isChild && <ArrowRight className="h-3 w-3 text-muted shrink-0 -ml-1" />}
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                          {cat.image_url ? (
                            <Image src={cat.image_url} alt="" fill sizes="44px" className="object-cover" unoptimized />
                          ) : (
                            <FolderTree className="h-5 w-5 m-auto text-muted opacity-50" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-700">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[11px] text-muted line-clamp-1 max-w-xs">{cat.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 text-xs font-mono text-muted">
                      <div className="flex items-center gap-1.5">
                        <span>/{cat.slug}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(cat.slug)}
                          className="text-muted hover:text-brand-700 transition-colors"
                          title="Copy Link"
                        >
                          {copiedSlug === cat.slug ? <Check className="h-3 w-3 text-[#024F5F]" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                          cat.product_count === 0
                            ? 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
                            : 'bg-cream-100 text-brand-700 border-cream-300'
                        }`}
                      >
                        {cat.product_count} product{cat.product_count === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat.id, cat.is_active)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                          cat.is_active
                            ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64] hover:bg-[#F6F1EC]'
                            : 'bg-cream-100 text-muted border-cream-300 hover:bg-cream-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {cat.is_active ? <Eye className="h-3 w-3 text-[#024F5F]" /> : <EyeOff className="h-3 w-3" />}
                        <span>{cat.is_active ? 'Active' : 'Hidden'}</span>
                      </button>
                      {cat.show_on_homepage && (
                        <span
                          className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 px-2 py-1 text-[10px] font-semibold"
                          title="Shown on homepage"
                        >
                          <Home className="h-3 w-3" />
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                          target="_blank"
                          className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
                          title="View on storefront"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="rounded-lg p-2 text-muted hover:text-brand-600 hover:bg-brand-500/10 transition-all"
                          title="Edit Category"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className={`rounded-lg p-2 transition-all ${
                            confirmDeleteId === cat.id
                              ? 'bg-[#F6F1EC] text-[#024F5F] font-bold text-xs px-2'
                              : 'text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC]'
                          }`}
                          title={confirmDeleteId === cat.id ? 'Click again to confirm delete' : 'Delete'}
                        >
                          {confirmDeleteId === cat.id ? 'Confirm?' : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
