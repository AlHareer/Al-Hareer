import { getFaqs, getFooterSettings, getFaqContentSettings } from '@/lib/siteSettings';
import FAQPageClient from './FAQPageClient';

export default async function FAQPage() {
  const [faqs, contact, heroSettings] = await Promise.all([
    getFaqs(),
    getFooterSettings(),
    getFaqContentSettings(),
  ]);
  return <FAQPageClient faqData={faqs} phone={contact.home_contact_phone} heroSettings={heroSettings} />;
}
