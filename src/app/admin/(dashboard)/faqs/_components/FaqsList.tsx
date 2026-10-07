'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plus,
  HelpCircle,
  ArrowUpDown,
  X,
  Home,
  LayoutList,
} from 'lucide-react';
import { reorderFaqs } from '@/actions/admin/faqs';
import FaqRow from './FaqRow';

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  show_on_home: boolean;
};

export default function FaqsList({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<'all' | 'home'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories list with count
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of faqs) {
      counts[f.category] = (counts[f.category] || 0) + 1;
    }
    const list = Object.entries(counts).map(([name, count]) => ({ name, count }));
    list.sort((a, b) => b.count - a.count);
    return [{ name: 'All', count: faqs.length }, ...list];
  }, [faqs]);

  // Filtered FAQs
  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      // Category filter
      if (selectedCategory !== 'All' && f.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'live' && !f.is_active) return false;
      if (statusFilter === 'draft' && f.is_active) return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQ = f.question.toLowerCase().includes(query);
        const matchesA = f.answer.toLowerCase().includes(query);
        const matchesC = f.category.toLowerCase().includes(query);
        if (!matchesQ && !matchesA && !matchesC) return false;
      }

      return true;
    });
  }, [faqs, selectedCategory, statusFilter, searchQuery]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;
    const reordered = [...filtered];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    startTransition(async () => {
      await reorderFaqs(reordered.map((f) => f.id));
      router.refresh();
    });
  };

  if (faqs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-300 bg-white p-12 text-center shadow-sm space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 mx-auto">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-base font-bold text-brand-700">No FAQs Added Yet</h3>
        <p className="text-xs text-muted max-w-md mx-auto">
          Create questions and answers covering sizing, bespoke tailoring, courier dispatch, and return policies.
        </p>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] text-white px-5 py-2 text-xs font-semibold shadow-sm transition-all mt-2"
        >
          <Plus className="h-4 w-4" /> Create First FAQ
        </Link>
      </div>
    );
  }

  const isFiltering = selectedCategory !== 'All' || statusFilter !== 'all' || searchQuery.trim().length > 0;
  const homeFaqs = faqs.filter((f) => f.show_on_home);

  return (
    <div className="space-y-4">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 rounded-2xl border border-cream-200 bg-white p-1 shadow-2xs self-start w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-muted hover:text-brand-700'
          }`}
        >
          <LayoutList className="h-3.5 w-3.5" />
          All FAQs
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-cream-100 text-muted'}`}>
            {faqs.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#024F5F] text-white shadow-sm'
              : 'text-muted hover:text-brand-700'
          }`}
        >
          <Home className="h-3.5 w-3.5" />
          Homepage
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === 'home' ? 'bg-white/20 text-white' : 'bg-cream-100 text-muted'}`}>
            {homeFaqs.length}
          </span>
        </button>
      </div>

      {/* Homepage Tab Content */}
      {activeTab === 'home' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-[#CFAC64] bg-[#F6F1EC]/50 px-4 py-3 text-xs text-[#024F5F]">
            <span className="font-bold">Homepage FAQs:</span> These {homeFaqs.length} questions appear in the FAQ preview section on the homepage. Toggle &quot;On Home&quot; button on any FAQ to add/remove it from homepage.
          </div>
          {homeFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CFAC64] bg-white p-10 text-center space-y-2">
              <Home className="h-8 w-8 text-[#024F5F] mx-auto" />
              <p className="font-heading text-sm font-bold text-brand-700">No FAQs on Homepage Yet</p>
              <p className="text-xs text-muted">Click the &quot;Home&quot; button on any FAQ below to feature it on the homepage.</p>
            </div>
          ) : (
            homeFaqs.map((f, index) => (
              <FaqRow
                key={f.id}
                faq={f}
                canMoveUp={index > 0}
                canMoveDown={index < homeFaqs.length - 1}
                onMove={(direction) => {
                  const allIndex = faqs.findIndex((x) => x.id === f.id);
                  handleMove(allIndex, direction);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* All FAQs Tab Content */}
      {activeTab === 'all' && (
      <>{/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, answers, keywords…"
            className="w-full rounded-xl border border-cream-300/80 bg-white pl-10 pr-9 py-2 text-xs text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <div className="inline-flex rounded-xl border border-cream-300 bg-white p-1 shadow-2xs">
            {(
              [
                { id: 'all', label: 'All Status' },
                { id: 'live', label: 'Live' },
                { id: 'draft', label: 'Hidden' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s.id
                    ? 'bg-brand-500 text-white shadow-2xs'
                    : 'text-muted hover:text-brand-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC] transition-all shadow-2xs"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categoriesWithCounts.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-luxury font-bold'
                  : 'border border-cream-300/80 bg-white text-brand-700 hover:bg-cream-50 hover:border-brand-300 shadow-2xs'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-cream-100 text-muted'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reorder Guidance Note */}
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-brand-500" />
          <span>Use up / down buttons to reorder questions on the live FAQ page.</span>
        </div>
        <span className="font-semibold text-brand-700">
          Showing {filtered.length} of {faqs.length} FAQs
        </span>
      </div>

      {/* FAQ Items List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-cream-300 bg-white p-12 text-center shadow-2xs space-y-2">
          <p className="font-heading text-sm font-bold text-brand-700">No matching FAQs found</p>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category from above.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-cream-100 border border-cream-300 px-3.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-[#B08F4F] hover:text-white transition-all mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f, index) => (
            <FaqRow
              key={f.id}
              faq={f}
              canMoveUp={index > 0}
              canMoveDown={index < filtered.length - 1}
              onMove={(direction) => handleMove(index, direction)}
            />
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
