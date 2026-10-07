'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Download,
  Mail,
  Trash2,
  Copy,
  Check,
  Calendar,
  Users,
} from 'lucide-react';
import { deleteNewsletterSubscriber } from '@/actions/admin/newsletter';

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
};

export default function NewsletterList({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  const handleCopySingle = (id: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = () => {
    const allEmails = filtered.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    if (!filtered.length) return;
    const headers = ['Email', 'Subscribed Date'];
    const rows = filtered.map((s) => [
      `"${s.email}"`,
      `"${new Date(s.created_at).toLocaleDateString('en-IN')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `al-hareer-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    startTransition(async () => {
      await deleteNewsletterSubscriber(id);
      setConfirmingId(null);
      router.refresh();
    });
  };

  if (subscribers.length === 0) {
    return (
      <div className="rounded-2xl border border-cream-200 bg-white p-12 text-center shadow-2xs">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-muted mb-2">
          <Mail className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-brand-700">No subscribers yet</p>
        <p className="text-xs text-muted mt-1">
          When visitors subscribe from your footer or checkout, their emails will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriber email..."
            className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-9 py-2 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons: Copy All & Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-cream-50 hover:border-brand-400 transition-all shadow-2xs cursor-pointer"
            title="Copy all filtered emails separated by comma"
          >
            {copiedAll ? <Check className="h-3.5 w-3.5 text-[#024F5F]" /> : <Copy className="h-3.5 w-3.5 text-muted" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#CFAC64] hover:bg-[#B08F4F] px-4 py-2 text-xs font-semibold text-white shadow-luxury hover:shadow-luxury-hover transition-all cursor-pointer"
            title="Download subscribers list as CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Subscribers Table Card */}
      <div className="overflow-hidden rounded-2xl border border-cream-200/80 bg-white shadow-2xs">
        <div className="border-b border-cream-100 bg-cream-50/60 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            {filtered.length} {filtered.length === 1 ? 'Subscriber' : 'Subscribers'}
          </span>
          {search && (
            <span className="text-[11px] text-muted">Filtered from {subscribers.length} total</span>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted">No subscribers match your search.</p>
        ) : (
          <ul className="divide-y divide-cream-100 text-xs sm:text-sm">
            {filtered.map((s) => {
              const dateStr = new Date(s.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-cream-50/50 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200 text-brand-600">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-700">{s.email}</p>
                      <div className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>Subscribed {dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy & Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopySingle(s.id, s.email)}
                      className="inline-flex items-center gap-1 rounded-lg border border-cream-200 bg-cream-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-cream-100 transition-colors"
                      title="Copy email address"
                    >
                      {copiedId === s.id ? (
                        <Check className="h-3 w-3 text-[#024F5F]" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted" />
                      )}
                      <span className="hidden sm:inline">{copiedId === s.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      disabled={pending}
                      title={confirmingId === s.id ? 'Click again to confirm delete' : 'Delete subscriber'}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        confirmingId === s.id
                          ? 'bg-[#F6F1EC] text-[#024F5F] border border-[#CFAC64]'
                          : 'text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC]'
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {confirmingId === s.id && <span>Confirm</span>}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
