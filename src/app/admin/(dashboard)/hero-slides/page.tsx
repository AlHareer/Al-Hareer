import { getAllHeroSlidesAdmin } from '@/actions/admin/heroSlides';
import { getSiteSettings } from '@/actions/admin/siteSettings';
import HomeCustomizationTabs from './_components/HomeCustomizationTabs';
import HeroSlidesList from './_components/HeroSlidesList';
import HomeSettingsForm from './_components/HomeSettingsForm';

export const metadata = { title: 'Home Customization' };

export default async function AdminHomeCustomizationPage() {
  const [slides, settings] = await Promise.all([getAllHeroSlidesAdmin(), getSiteSettings()]);

  return (
    <div>
      <div className="mb-6 border-b border-cream-300 pb-5">
        <h1 className="font-heading text-2xl font-bold text-brand-700">Home Customization</h1>
        <p className="text-sm text-muted mt-1">
          Manage your homepage's hero slides and general text. For the About and Story pages,
          use their own pages in the sidebar.
        </p>
      </div>

      <HomeCustomizationTabs
        heroSlidesTab={<HeroSlidesList slides={slides} />}
        settingsTab={<HomeSettingsForm settings={settings} />}
      />
    </div>
  );
}
