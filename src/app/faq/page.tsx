import { getFaqs, getFooterSettings } from '@/lib/siteSettings';
import FAQPageClient from './FAQPageClient';

export default async function FAQPage() {
  const [faqs, contact] = await Promise.all([getFaqs(), getFooterSettings()]);
  return <FAQPageClient faqData={faqs} phone={contact.home_contact_phone} />;
}
