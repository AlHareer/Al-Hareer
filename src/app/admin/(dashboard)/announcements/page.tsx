import { getAllAnnouncementsAdmin } from '@/actions/admin/announcements';
import AnnouncementManager from './_components/AnnouncementManager';

export const metadata = { title: 'Storefront Announcements — Al Hareer Admin' };

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncementsAdmin();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header */}
      <div className="border-b border-cream-200/80 pb-4">
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700">
          Storefront Announcements
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Manage promotional alerts, discount notices, and shipping banners displayed across your website&apos;s top announcement bar.
        </p>
      </div>

      <AnnouncementManager announcements={announcements} />
    </div>
  );
}
