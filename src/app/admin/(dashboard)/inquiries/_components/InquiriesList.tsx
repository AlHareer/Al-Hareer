'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Inbox,
  Check,
  Eye,
  X,
  Calendar,
} from 'lucide-react';
import { resolveInquiry, deleteInquiry } from '@/actions/admin/inquiries';

type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_resolved: boolean;
  created_at: string;
};

function getInitials(name: string) {
  if (!name) return 'IN';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'new' | 'resolved'>('all');
  const [viewing, setViewing] = useState<Inquiry | null>(null);

  const unresolvedCount = inquiries.filter((i) => !i.is_resolved).length;
  const resolvedCount = inquiries.filter((i) => i.is_resolved).length;

  const toggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await resolveInquiry(id, !current);
      router.refresh();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete message from "${name}"?`)) return;
    startTransition(async () => {
      await deleteInquiry(id);
      router.refresh();
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return inquiries.filter((inq) => {
      // Tab filter
      if (tab === 'new' && inq.is_resolved) return false;
      if (tab === 'resolved' && !inq.is_resolved) return false;

      // Search filter
      if (!q) return true;
      const name = inq.name.toLowerCase();
      const email = (inq.email || '').toLowerCase();
      const phone = (inq.phone || '').toLowerCase();
      const message = inq.message.toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q) || message.includes(q);
    });
  }, [inquiries, search, tab]);

  return (
    <div className="space-y-4">
      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message..."
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

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setTab('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              tab === 'all'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            All ({inquiries.length})
          </button>

          <button
            onClick={() => setTab('new')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              tab === 'new'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#CFAC64]" />
            <span>New ({unresolvedCount})</span>
          </button>

          <button
            onClick={() => setTab('resolved')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              tab === 'resolved'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#024F5F]" />
            <span>Resolved ({resolvedCount})</span>
          </button>
        </div>
      </div>

      {/* Inquiries Cards List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-cream-200 bg-white p-12 text-center shadow-2xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-muted mb-2">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-brand-700">No inquiries found</p>
          <p className="text-xs text-muted mt-1">
            {search ? 'Try adjusting your search query.' : 'Customer contact messages will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const dateStr = new Date(inq.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const rawPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
            const whatsappNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

            return (
              <div
                key={inq.id}
                className={`rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs space-y-3 ${
                  inq.is_resolved
                    ? 'border-cream-200/70 bg-white/70'
                    : 'border-[#CFAC64]/80 bg-white hover:border-[#CFAC64]'
                }`}
              >
                {/* Header: Sender, Status Badge & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200 font-heading text-xs font-bold text-brand-700">
                      {getInitials(inq.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-sm font-bold text-brand-700">{inq.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            inq.is_resolved
                              ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]'
                              : 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
                          }`}
                        >
                          {inq.is_resolved ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          <span>{inq.is_resolved ? 'Resolved' : 'New'}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">{dateStr}</p>
                    </div>
                  </div>

                  {/* Top Right Action Buttons (Includes View Button) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewing(inq)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-500 hover:bg-cream-50 hover:text-brand-600 transition-all shadow-2xs cursor-pointer"
                      title="View full inquiry"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggle(inq.id, inq.is_resolved)}
                      disabled={pending}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                        inq.is_resolved
                          ? 'border-cream-300 bg-white text-muted hover:text-brand-700 hover:bg-cream-50'
                          : 'border-[#CFAC64] bg-[#F6F1EC] text-[#024F5F] hover:bg-[#F6F1EC]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{inq.is_resolved ? 'Mark New' : 'Resolve'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id, inq.name)}
                      disabled={pending}
                      className="p-1.5 text-muted hover:text-[#024F5F] hover:bg-[#F6F1EC] rounded-lg transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Row: Email, Phone & Direct Links */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted pt-0.5">
                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}?subject=Re: Inquiry - Al Hareer`}
                      className="inline-flex items-center gap-1 text-brand-700 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5 text-muted" />
                      <span>{inq.email}</span>
                    </a>
                  )}

                  {inq.phone && (
                    <div className="flex items-center gap-2">
                      <a href={`tel:${inq.phone}`} className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                        <Phone className="h-3.5 w-3.5 text-muted" />
                        <span>{inq.phone}</span>
                      </a>

                      {rawPhone && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-[#F6F1EC] border border-[#CFAC64] px-2 py-0.5 text-[11px] font-semibold text-[#024F5F] hover:bg-[#F6F1EC] transition-colors"
                        >
                          <MessageCircle className="h-3 w-3 text-[#024F5F]" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="rounded-xl border border-cream-200/80 bg-cream-50/60 p-3.5 text-xs sm:text-sm text-brand-700 leading-relaxed">
                  <p className="line-clamp-3 whitespace-pre-wrap">{inq.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal Dialog (100% Mobile Responsive) */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#00303A]/50 backdrop-blur-xs"
          onClick={() => setViewing(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90dvh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-cream-200 bg-white shadow-luxury animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cream-200 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 border border-brand-200 font-heading text-xs font-bold text-brand-700">
                  {getInitials(viewing.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-brand-700 truncate">
                      {viewing.name}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        viewing.is_resolved
                          ? 'bg-[#F6F1EC] text-[#024F5F] border-[#CFAC64]'
                          : 'bg-[#F6F1EC] text-[#B08F4F] border-[#CFAC64]'
                      }`}
                    >
                      {viewing.is_resolved ? 'Resolved' : 'New'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{new Date(viewing.created_at).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewing(null)}
                className="p-1.5 text-muted hover:text-brand-700 hover:bg-cream-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {/* Contact Links */}
              <div className="flex flex-wrap gap-2 text-xs">
                {viewing.email && (
                  <a
                    href={`mailto:${viewing.email}?subject=Re: Inquiry - Al Hareer`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-50 px-3 py-1.5 font-semibold text-brand-700 hover:bg-cream-100 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-muted" />
                    <span>{viewing.email}</span>
                  </a>
                )}

                {viewing.phone && (
                  <a
                    href={`tel:${viewing.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-50 px-3 py-1.5 font-semibold text-brand-700 hover:bg-cream-100 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-muted" />
                    <span>Call {viewing.phone}</span>
                  </a>
                )}

                {viewing.phone && (
                  <a
                    href={`https://wa.me/${viewing.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#CFAC64] bg-[#F6F1EC] px-3 py-1.5 font-semibold text-[#024F5F] hover:bg-[#F6F1EC] transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#024F5F]" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Full Message Container */}
              <div className="rounded-xl border border-cream-200 bg-cream-50/70 p-3.5 sm:p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">Inquiry Message</p>
                <p className="whitespace-pre-wrap text-xs sm:text-sm text-brand-700 leading-relaxed font-normal">
                  {viewing.message}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions (Sticky & Mobile Responsive) */}
            <div className="border-t border-cream-200 bg-cream-50/50 px-4 sm:px-6 py-3 shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleDelete(viewing.id, viewing.name);
                  setViewing(null);
                }}
                className="inline-flex items-center justify-center gap-1 py-1.5 text-xs text-[#024F5F] hover:text-[#024F5F] font-semibold cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggle(viewing.id, viewing.is_resolved);
                    setViewing(null);
                  }}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all cursor-pointer ${
                    viewing.is_resolved
                      ? 'border-cream-300 bg-white text-brand-700 hover:bg-cream-100'
                      : 'border-[#CFAC64] bg-[#F6F1EC] text-[#024F5F] hover:bg-[#F6F1EC]'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{viewing.is_resolved ? 'Mark New' : 'Mark Resolved'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  className="rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-xs font-semibold text-brand-700 hover:bg-cream-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
