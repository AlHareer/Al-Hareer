'use client';

import { useState, useTransition, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Loader2,
  Radio,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncementActive,
  deleteAnnouncement,
} from '@/actions/admin/announcements';

type Announcement = {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
};

const PRESET_SUGGESTIONS = [
  '👑 Handcrafted Luxury Kurta Sets — Festive Collection Live',
  '⚡ Cash on Delivery & Express Dispatch across India',
  '🎁 New Arrivals — Explore our Latest Bespoke Collection',
];

export default function AnnouncementManager({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // New announcement state
  const [newMessage, setNewMessage] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirmation state (2-step with auto-timeout)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toggling state tracker for instant UI responsiveness
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Clear delete timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  // Stats calculation
  const totalCount = announcements.length;
  const liveAnnouncements = useMemo(() => announcements.filter((a) => a.is_active), [announcements]);
  const liveCount = liveAnnouncements.length;
  const draftCount = totalCount - liveCount;

  // Filtered list
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      // Tab filter
      if (activeTab === 'live' && !a.is_active) return false;
      if (activeTab === 'draft' && a.is_active) return false;
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return a.message.toLowerCase().includes(query);
      }
      return true;
    });
  }, [announcements, activeTab, searchQuery]);

  // Handle Add
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setAddError(null);

    startTransition(async () => {
      const result = await createAnnouncement(newMessage.trim());
      if (result.success) {
        setNewMessage('');
        router.refresh();
      } else {
        setAddError(result.error ?? 'Failed to create announcement.');
      }
    });
  };

  // Handle Toggle Active
  const handleToggle = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    startTransition(async () => {
      await toggleAnnouncementActive(id, !currentStatus);
      setTogglingId(null);
      router.refresh();
    });
  };

  // Start Edit
  const handleStartEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setEditMessage(announcement.message);
    setEditError(null);
  };

  // Save Edit
  const handleSaveEdit = (id: string) => {
    if (!editMessage.trim()) return;
    setEditError(null);

    startTransition(async () => {
      const result = await updateAnnouncement(id, editMessage.trim());
      if (result.success) {
        setEditingId(null);
        router.refresh();
      } else {
        setEditError(result.error ?? 'Failed to update.');
      }
    });
  };

  // Handle Delete with auto-reset confirmation
  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      setConfirmDeleteId(null);
      startTransition(async () => {
        await deleteAnnouncement(id);
        router.refresh();
      });
    } else {
      setConfirmDeleteId(id);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => {
        setConfirmDeleteId(null);
      }, 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Storefront Top Bar Preview */}
      <div className="rounded-2xl border border-cream-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 border border-brand-200/60 text-brand-700">
              <Eye className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-700">
                Storefront Ticker Preview
              </h2>
              <p className="text-[11px] text-muted">
                How visitors see your top announcement bar right now
              </p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            liveCount > 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-cream-100 border-cream-200 text-muted'
          }`}>
            {liveCount > 0 ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{liveCount} Live on Storefront</span>
              </>
            ) : (
              <span>Bar Hidden (0 active in DB)</span>
            )}
          </div>
        </div>

        {/* Realistic Mock Storefront Top Bar with Live Animated Marquee */}
        {liveCount > 0 ? (
          <div className="relative overflow-hidden rounded-xl border border-[#D4AF37]/35 bg-gradient-to-r from-[#120D09] via-[#211710] to-[#120D09] py-2.5 shadow-md select-none text-[#FAF6F0]">
            {/* Ambient Center Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1)_0%,_transparent_75%)] pointer-events-none" />

            {/* Left and Right Fade Masks */}
            <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-[#120D09] via-[#120D09]/95 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-[#120D09] via-[#120D09]/95 to-transparent z-10 pointer-events-none" />

            <div className="w-full overflow-hidden flex">
              <div className="animate-marquee-infinite flex items-center hover:[animation-play-state:paused] cursor-default">
                {[...Array(6)].map((_, setIdx) => (
                  <div key={setIdx} className="flex items-center shrink-0">
                    {liveAnnouncements.map((item, idx) => (
                      <div key={`${setIdx}-${idx}`} className="flex items-center shrink-0">
                        <div className="flex items-center gap-3 mx-4 sm:mx-8">
                          <span className="inline-flex items-center justify-center text-[#D4AF37] select-none text-xs drop-shadow-[0_0_8px_rgba(212,175,55,0.85)]">
                            ✦
                          </span>
                          <span className="font-heading text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#F5EDE4] whitespace-nowrap">
                            {item.message}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50/60 p-4 text-center">
            <p className="text-xs text-muted font-medium">
              Database me koi active announcement nahi hai. Website par announcement bar hidden hai — neeche kisi announcement ko toggle on karke live karein.
            </p>
          </div>
        )}
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total */}
        <div className="rounded-2xl border border-cream-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-200/70 text-brand-700">
            <Megaphone className="h-5 w-5 text-brand-600" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xl font-bold text-brand-700 leading-tight">{totalCount}</p>
            <p className="text-xs font-semibold text-muted">Total Announcements</p>
          </div>
        </div>

        {/* Active Live */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-700">
            <Radio className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-heading text-xl font-bold text-emerald-900 leading-tight">{liveCount}</p>
              <span className="inline-flex rounded-full bg-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-800/80">Active on Storefront</p>
          </div>
        </div>

        {/* Drafts / Off */}
        <div className="rounded-2xl border border-cream-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream-100 border border-cream-200 text-muted">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xl font-bold text-brand-700 leading-tight">{draftCount}</p>
            <p className="text-xs font-semibold text-muted">Inactive Drafts</p>
          </div>
        </div>
      </div>

      {/* 3. Create Announcement Card */}
      <div className="rounded-2xl border border-cream-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <h3 className="font-heading text-sm sm:text-base font-bold text-brand-700">
              Create New Announcement
            </h3>
          </div>
          <span className="text-[11px] text-muted font-medium">
            {newMessage.length} / 120 chars recommended
          </span>
        </div>

        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Megaphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="e.g. Free shipping on orders above ₹999 • Express Dispatch across India"
                className="w-full rounded-xl border border-cream-300 bg-cream-50/70 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10"
              />
            </div>
            <button
              type="submit"
              disabled={pending || !newMessage.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Announcement</span>
                </>
              )}
            </button>
          </div>

          {addError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{addError}</span>
            </div>
          )}

          {/* Quick Preset Chips */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Quick Suggestions (Click to fill):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SUGGESTIONS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setNewMessage(preset)}
                  className="rounded-lg border border-cream-200/90 bg-cream-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 hover:bg-cream-100 hover:border-brand-300 transition-colors text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'live'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            Live on Store ({liveCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('draft')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'draft'
                ? 'bg-brand-500 text-white shadow-luxury'
                : 'border border-cream-300 bg-white text-brand-700 hover:bg-cream-50'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-xl border border-cream-300 bg-white pl-9 pr-8 py-1.5 text-xs text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-brand-700"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 5. Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-cream-200/80 bg-white p-12 text-center shadow-2xs space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 border border-brand-200/60 text-brand-600">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-heading text-base font-bold text-brand-700">No Announcements Found</h4>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No announcement matches "${searchQuery}". Clear your search query to see all.`
                : activeTab !== 'all'
                ? `No ${activeTab === 'live' ? 'live' : 'draft'} announcements right now.`
                : 'No announcements created yet. Add your first promotional message above to display it on the storefront.'}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-cream-50"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((a) => {
            const isEditing = editingId === a.id;
            const isToggling = togglingId === a.id;
            const isConfirmingDelete = confirmDeleteId === a.id;
            const formattedDate = new Date(a.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            if (isEditing) {
              return (
                <div
                  key={a.id}
                  className="rounded-2xl border-2 border-brand-400 bg-brand-50/40 p-4 sm:p-5 shadow-luxury space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                      Edit Announcement
                    </span>
                    <span className="text-[11px] text-muted">{editMessage.length} / 120 chars</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(a.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-full rounded-xl border border-brand-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-brand-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(a.id)}
                        disabled={pending || !editMessage.trim()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-luxury transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {pending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>Save</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="inline-flex items-center gap-1 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 px-3 py-2 text-xs font-semibold text-muted transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>

                  {editError && (
                    <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{editError}</span>
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div
                key={a.id}
                className={`rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs hover:shadow-luxury ${
                  a.is_active
                    ? 'border-emerald-200/90 bg-white ring-1 ring-emerald-500/10'
                    : 'border-cream-200/80 bg-white opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Status & Message */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.is_active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span>Live on Store</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 border border-cream-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                          <span>Hidden / Draft</span>
                        </span>
                      )}
                      <span className="text-[11px] text-muted">Created {formattedDate}</span>
                    </div>

                    <p className="font-heading text-sm sm:text-base font-semibold text-brand-700 leading-snug break-words">
                      {a.message}
                    </p>
                  </div>

                  {/* Right: Controls (Toggle, Edit, Delete) */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t border-cream-100 sm:border-0 shrink-0">
                    {/* iOS-Style Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={a.is_active}
                        disabled={pending || isToggling}
                        onClick={() => handleToggle(a.id, a.is_active)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 ${
                          a.is_active ? 'bg-emerald-600' : 'bg-cream-300'
                        }`}
                        title={a.is_active ? 'Click to deactivate' : 'Click to activate on storefront'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            a.is_active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-brand-700 hidden xs:inline">
                        {a.is_active ? 'Active' : 'Off'}
                      </span>
                    </div>

                    <div className="h-4 w-px bg-cream-200 mx-0.5" />

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(a)}
                      disabled={pending}
                      className="rounded-xl border border-cream-200 bg-cream-50/60 p-2 text-brand-700 hover:bg-cream-100 hover:border-brand-300 transition-all cursor-pointer shadow-2xs"
                      title="Edit message"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Button with 2-Stage Confirmation */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(a.id)}
                      disabled={pending}
                      className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                        isConfirmingDelete
                          ? 'bg-red-600 text-white shadow-md animate-pulse'
                          : 'border border-cream-200 bg-cream-50/60 text-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                      }`}
                      title={isConfirmingDelete ? 'Click again to permanently delete' : 'Delete announcement'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isConfirmingDelete && <span>Confirm?</span>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
