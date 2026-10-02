import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getSiteSettings } from '@/actions/admin/siteSettings';
import StorySettingsForm from './_components/StorySettingsForm';

export const metadata = { title: 'Story Page — Al Hareer Admin' };

export default async function AdminStoryPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-5 pb-16 w-full max-w-full">
      {/* Header & Breadcrumbs */}
      <div className="border-b border-cream-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Content</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Story Page</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
              Brand Story &amp; Heritage
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Edit the chapters of our narrative page tab by tab. Each section publishes live to <code className="text-brand-600 bg-cream-100 px-1 py-0.5 rounded text-[11px]">/story</code>.
            </p>
          </div>
          <Link
            href="/story"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-white border border-cream-300 hover:border-gold/60 hover:bg-cream-50 shadow-xs transition-all self-start sm:self-auto shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5 text-gold" />
            <span>View Live (/story)</span>
          </Link>
        </div>
      </div>

      {/* Strict Tabbed Settings Form */}
      <StorySettingsForm settings={settings} />
    </div>
  );
}
