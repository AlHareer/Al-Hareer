'use client';

import { useActionState } from 'react';
import { ShieldCheck, Check, AlertCircle, Mail, User, Loader2 } from 'lucide-react';
import { updateAdminProfile, type AdminProfileFormState, type AdminProfile } from '@/actions/admin/profile';

const inputClass =
  'w-full rounded-xl border border-cream-300 bg-cream-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-brand-700 placeholder:text-muted/60 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-700';

function getInitials(name?: string | null) {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfileForm({ profile }: { profile: AdminProfile | null }) {
  const [state, formAction, pending] = useActionState<AdminProfileFormState, FormData>(updateAdminProfile, {});
  const initial = getInitials(profile?.full_name);

  return (
    <div className="max-w-2xl space-y-6">
      <form
        action={formAction}
        className="rounded-2xl border border-cream-200/80 bg-white p-5 sm:p-7 shadow-2xs space-y-6"
      >
        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 border-b border-cream-200 pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-200/80 font-heading text-xl font-bold text-brand-700 shadow-2xs">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-brand-700 truncate">
                {profile?.full_name || 'Administrator'}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-200/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                <ShieldCheck className="h-3 w-3 text-brand-600" />
                <span>Super Admin</span>
              </span>
            </div>
            <p className="text-xs text-muted truncate mt-0.5">{profile?.email || '—'}</p>
          </div>
        </div>

        {/* Feedback Messages */}
        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{state.error}</span>
          </div>
        )}
        {state?.success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm font-semibold text-emerald-800">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Profile name updated successfully.</span>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                required
                name="full_name"
                defaultValue={profile?.full_name ?? ''}
                placeholder="e.g. Al Hareer Administrator"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                disabled
                value={profile?.email ?? ''}
                className={`${inputClass} pl-10 opacity-70 bg-cream-100 cursor-not-allowed`}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted">
              Used as the primary administrative login identifier.
            </p>
          </div>
        </div>


        {/* Save Button */}
        <div className="border-t border-cream-200 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-luxury hover:shadow-luxury-hover disabled:opacity-60 transition-all cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
