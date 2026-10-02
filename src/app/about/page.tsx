import { getTestimonials, getHomeContentSettings, getAboutContentSettings } from '@/lib/siteSettings';
import AboutPageClient from './AboutPageClient';

export default async function AboutPage() {
  const [testimonials, homeSettings, aboutSettings] = await Promise.all([
    getTestimonials(),
    getHomeContentSettings(),
    getAboutContentSettings(),
  ]);
  return <AboutPageClient testimonials={testimonials} homeSettings={homeSettings} aboutSettings={aboutSettings} />;
}
