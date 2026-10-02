import { ChevronRight } from 'lucide-react';
import { getBrandSettings } from '@/actions/admin/siteBrandSettings';
import SettingsForm from './_components/SettingsForm';

export const metadata = { title: 'Store Settings — Al Hareer Admin' };

export default async function AdminSiteSettingsPage() {
  const settings = await getBrandSettings();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Settings</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Store Settings</span>
        </div>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-700 tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Manage your store name, phone, email, social links, and payment options.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
