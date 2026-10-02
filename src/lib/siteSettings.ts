import { createPublicClient } from '@/lib/supabase/public';
import type { Testimonial, OccasionItem } from '@/types';
import {
  HOME_SETTINGS_DEFAULTS,
  ABOUT_SETTINGS_DEFAULTS,
  STORY_SETTINGS_DEFAULTS,
  type SiteSettingsDefaults,
} from '@/lib/siteSettingsSchema';

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, customer_name, role, location, review_text, rating, image_url, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((t) => ({
    id: t.id,
    name: t.customer_name,
    role: t.role ?? 'Verified Buyer',
    location: t.location ?? '',
    rating: t.rating,
    comment: t.review_text,
    image: t.image_url ?? '',
  }));
}

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  show_on_home?: boolean;
};

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('faqs')
    .select('id, category, question, answer, display_order')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((f) => ({
    id: f.id,
    category: f.category,
    question: f.question,
    answer: f.answer,
  }));
}

export async function getHomeFaqs(): Promise<Faq[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('faqs')
    .select('id, category, question, answer, display_order')
    .eq('is_active', true)
    .eq('show_on_home', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((f) => ({
    id: f.id,
    category: f.category,
    question: f.question,
    answer: f.answer,
    show_on_home: true,
  }));
}

export type HeroSlideRow = {
  id: number;
  image: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
};

export async function getActiveHeroSlides(): Promise<HeroSlideRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('image_url, tag, title, subtitle, button_text, button_link')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row, index) => {
    const [line1 = '', line2 = '', line3 = ''] = (row.title ?? '').split('\n');
    return {
      id: index + 1,
      image: row.image_url,
      tag: row.tag ?? '',
      titleLine1: line1,
      titleLine2: line2,
      titleLine3: line3,
      subtitle: row.subtitle ?? '',
      buttonText: row.button_text ?? '',
      buttonLink: row.button_link ?? '',
    };
  });
}

export async function getShopByOccasions(): Promise<OccasionItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'home_shopby_occasions')
    .maybeSingle();
  if (error) throw error;
  if (!data?.value) return [];
  try {
    return JSON.parse(data.value) as OccasionItem[];
  } catch {
    return [];
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
}

// Plain { key: value } map, merged over the curated defaults (src/lib/siteSettingsSchema.ts)
// so a section renders its original copy until an admin explicitly edits it.
export type ContentSettings = Record<string, string>;

async function getSettingsByKeys(keys: string[], defaults: SiteSettingsDefaults): Promise<ContentSettings> {
  const result: ContentSettings = {};
  for (const key of keys) result[key] = defaults[key]?.value ?? '';

  const supabase = createPublicClient();
  const { data, error } = await supabase.from('site_settings').select('key, value').in('key', keys);
  if (error) throw error;
  for (const row of data ?? []) {
    if (row.value) result[row.key] = row.value;
  }
  return result;
}

export async function getHomeContentSettings(): Promise<ContentSettings> {
  return getSettingsByKeys(Object.keys(HOME_SETTINGS_DEFAULTS), HOME_SETTINGS_DEFAULTS);
}

export async function getAboutContentSettings(): Promise<ContentSettings> {
  return getSettingsByKeys(Object.keys(ABOUT_SETTINGS_DEFAULTS), ABOUT_SETTINGS_DEFAULTS);
}

export async function getStoryContentSettings(): Promise<ContentSettings> {
  return getSettingsByKeys(Object.keys(STORY_SETTINGS_DEFAULTS), STORY_SETTINGS_DEFAULTS);
}

// Footer/FloatingWhatsApp read this directly (client-side, self-fetched — see
// Navbar's announcements for the same pattern) rather than via props, since
// Footer/FloatingWhatsApp are rendered from ~10 different pages and prop
// drilling through all of them isn't worth it for rarely-changing content.
export async function getFooterSettings(): Promise<ContentSettings> {
  return getSettingsByKeys(
    ['home_contact_phone', 'home_contact_email', 'home_contact_address', 'footer_arch_image'],
    HOME_SETTINGS_DEFAULTS
  );
}

// Reads the social-link keys owned by the admin "Site Settings" page (see
// src/actions/admin/siteBrandSettings.ts) — falls back to the current
// hardcoded placeholder URLs when an admin hasn't set a real one yet, so
// Footer/social icons never end up with an empty href.
const SOCIAL_LINK_DEFAULTS: ContentSettings = {
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  youtube_url: 'https://youtube.com',
  whatsapp_number: '917396690308',
};

export async function getSocialLinks(): Promise<ContentSettings> {
  const supabase = createPublicClient();
  const result: ContentSettings = { ...SOCIAL_LINK_DEFAULTS };
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', Object.keys(SOCIAL_LINK_DEFAULTS));
  if (error) throw error;
  for (const row of data ?? []) {
    if (row.value) result[row.key] = row.value;
  }
  return result;
}

export async function getActiveAnnouncements(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('message')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((a) => a.message).filter(Boolean);
}
