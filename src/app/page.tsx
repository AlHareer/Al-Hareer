import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import ShopByCategory from '@/components/sections/ShopByCategory';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import ShopByOccasion from '@/components/shopby/ShopByOccasion';
import SplitBanner from '@/components/sections/SplitBanner';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import TrustBar from '@/components/sections/TrustBar';
import AboutSection from '@/components/sections/AboutSection';
import OurStory from '@/components/sections/OurStory';
import MomentsSection from '@/components/sections/MomentsSection';
import Testimonials from '@/components/sections/Testimonials';
import ContactSection from '@/components/sections/ContactSection';
import Newsletter from '@/components/sections/Newsletter';
import HomeFaqSection from '@/components/sections/HomeFaqSection';
import Footer from '@/components/layout/Footer';
import { getFeaturedProducts, getProductTypeShowcase } from '@/lib/products';
import { getTestimonials, getHomeContentSettings, getActiveHeroSlides, getSocialLinks, getHomeFaqs } from '@/lib/siteSettings';
import type { OccasionItem } from '@/types';

export default async function HomePage() {
  const [products, testimonials, homeSettings, heroSlides, showcase, socialLinks, faqs] = await Promise.all([
    getFeaturedProducts(),
    getTestimonials(),
    getHomeContentSettings(),
    getActiveHeroSlides(),
    getProductTypeShowcase(),
    getSocialLinks(),
    getHomeFaqs(),
  ]);
  const mergedSettings = { ...homeSettings, ...socialLinks };

  let occasions: OccasionItem[] = [];
  try {
    occasions = JSON.parse(mergedSettings.home_shopby_occasions || '[]');
  } catch { occasions = []; }

  return (
    <main className="min-h-screen flex flex-col bg-cream-100 selection:bg-brand-500 selection:text-white [&>*]:min-w-0">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner */}
      <Hero slides={heroSlides} settings={mergedSettings} />

      {/* Teal feature band */}
      <TrustBar settings={mergedSettings} />

      {/* Shop By Kurta Type (circular avatars) */}
      <ShopByCategory settings={mergedSettings} />

      {/* Shop By Category (big image block grid) */}
      <CategoryShowcase items={showcase} settings={mergedSettings} />

      {/* Premium Fabrics & Elegant Styles banner */}
      <SplitBanner settings={mergedSettings} />

      {/* Shop by Occasion Grid */}
      <ShopByOccasion occasions={occasions} settings={mergedSettings} />

      {/* Featured Collection & Product Catalog */}
      <FeaturedCollection products={products} settings={mergedSettings} />

      {/* About Us Brand Heritage */}
      <AboutSection settings={mergedSettings} />

      {/* Our Story 3-Column Showcase */}
      <OurStory settings={mergedSettings} />

      {/* Moments & Celebration Outfits */}
      <MomentsSection settings={mergedSettings} />

      {/* Verified Customer Reviews */}
      <Testimonials testimonials={testimonials} />

      {/* FAQ Preview */}
      <HomeFaqSection faqs={faqs} />

      {/* Contact Concierge & Location */}
      <ContactSection settings={mergedSettings} />

      {/* VIP Club Newsletter */}
      <Newsletter settings={mergedSettings} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
