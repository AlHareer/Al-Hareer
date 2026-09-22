import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
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
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-cream-100 selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* Trust & Value Pillars (Dark Olive Strip) */}
      <TrustBar />

      {/* Shop by Occasion Grid */}
      <ShopByOccasion />

      {/* Comfort & Fabric Split Banner */}
      <SplitBanner />

      {/* Featured Collection & Product Catalog */}
      <FeaturedCollection />

      {/* About Us Brand Heritage */}
      <AboutSection />

      {/* Our Story 3-Column Showcase */}
      <OurStory />

      {/* Moments & Celebration Outfits */}
      <MomentsSection />

      {/* Verified Customer Reviews */}
      <Testimonials />

      {/* Contact Concierge & Location */}
      <ContactSection />

      {/* VIP Club Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </main>
  );
}
