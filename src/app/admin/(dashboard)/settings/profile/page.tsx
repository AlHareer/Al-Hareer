import { getAdminProfile } from '@/actions/admin/profile';
import ProfileForm from './_components/ProfileForm';
import SettingsNavTabs from '../_components/SettingsNavTabs';
import { ChevronRight } from 'lucide-react';

export const metadata = { title: 'My Profile — Al Hareer Admin' };

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full">
      {/* Page Header */}
      <div className="border-b border-cream-200/80 pb-4.5">
        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-1">
          <span>Admin</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span>Settings</span>
          <ChevronRight className="h-3 w-3 text-muted-light" />
          <span className="text-brand-500 font-semibold">Admin Profile</span>
        </div>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-700 mt-1">Admin Profile & Security</h1>
        <p className="text-xs sm:text-sm text-muted mt-0.5">
          Manage your personal administrator display name, email, and dashboard access credentials.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <SettingsNavTabs currentTab="profile" />

      {/* Profile Form */}
      <ProfileForm profile={profile} />
    </div>
  );
}
