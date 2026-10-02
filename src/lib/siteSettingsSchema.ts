/**
 * Curated `site_settings` key catalogue for the admin CMS — all keys are
 * wired into the storefront components that read them (Home, About, Story
 * pages). Per-item content in fixed-count grids (trust-bar pillars, about
 * pillars/process/stats, story milestones/values) is stored as a JSON string
 * in a single key and edited via `JsonListEditor` in the admin UI — icons
 * stay fixed by array position (they're React components, not DB-storable),
 * only their text is editable. This file only defines the schema
 * (default value/category/description) consumed by
 * `src/actions/admin/siteSettings.ts` for the upsert-by-key CRUD.
 */

export type SiteSettingMeta = {
  value: string;
  category: 'home' | 'about' | 'story';
  description: string;
};

export type SiteSettingsDefaults = Record<string, SiteSettingMeta>;

/**
 * Home page — general text settings.
 * Maps to: SplitBanner (CraftedComfort), the About teaser block
 * (AboutSection — also reused as-is on the About page), OurStory,
 * MomentsSection, ContactSection and Newsletter.
 */
export const HOME_SETTINGS_DEFAULTS: SiteSettingsDefaults = {
  // SplitBanner / "Crafted For Comfort" panel
  home_splitbanner_heading: {
    value: 'Made For Comfort,\nMade For You',
    category: 'home',
    description: 'Split Banner — headline (line break shown as a second, italicized line)',
  },
  home_splitbanner_description: {
    value: 'Breathable fabric, good stitching, and classic cuts that are comfortable to wear.',
    category: 'home',
    description: 'Split Banner — description paragraph',
  },

  // AboutSection teaser block (also rendered as-is on the About page)
  home_aboutteaser_heading: {
    value: 'Traditional Look,\nModern Fit',
    category: 'home',
    description: 'About teaser block — headline, shown on both Home and About pages (line break shown as a second, italicized line)',
  },
  home_aboutteaser_paragraph: {
    value: 'Al Hareer makes comfortable traditional clothes for men.',
    category: 'home',
    description: 'About teaser block — first paragraph (shown on both Home and About pages)',
  },
  home_aboutteaser_paragraph2: {
    value: 'Our kurtas work for festivals, weddings, and everyday wear.',
    category: 'home',
    description: 'About teaser block — second paragraph (shown on both Home and About pages)',
  },

  // TrustBar (dark strip, 4 items) — icons stay fixed by position, only text is editable
  home_trustbar_items: {
    value: JSON.stringify([
      { title: 'Traditional Style', subtitle: 'Rooted in Heritage' },
      { title: 'Modern Comfort', subtitle: 'Made for Today' },
      { title: 'Simple Designs', subtitle: 'For Every Occasion' },
      { title: 'Better Choices', subtitle: 'Responsible Fashion' },
    ]),
    category: 'home',
    description: 'Trust bar — 4 items (title + subtitle each), icons fixed by position',
  },

  // OurStory
  home_ourstory_heading: {
    value: 'Rooted in Tradition.\nStyled for Today.',
    category: 'home',
    description: 'Our Story — headline (line break shown as a second, italicized line)',
  },
  home_ourstory_paragraph: {
    value:
      'We keep tradition alive through our clothing. Our kurtas and pajamas are made with care, using traditional weaving methods, and designed for everyday life.',
    category: 'home',
    description: 'Our Story — description paragraph',
  },

  // MomentsSection
  home_moments_heading: {
    value: 'Not Just Outfits,\nBut Moments',
    category: 'home',
    description: 'Moments & Celebrations — headline (line break shown as a second, italicized line)',
  },
  home_moments_paragraph: {
    value: 'From festivals to weddings, our clothes are part of your best memories.',
    category: 'home',
    description: 'Moments & Celebrations — description paragraph',
  },

  // ContactSection
  home_contact_heading: {
    value: "We'd Love To Hear From You",
    category: 'home',
    description: 'Contact section — headline',
  },
  home_contact_subtitle: {
    value: "Have a question about sizing, an order, or anything else? We're here to help.",
    category: 'home',
    description: 'Contact section — subtitle',
  },
  home_contact_phone: {
    value: '+91 73966 90308',
    category: 'home',
    description: 'Contact section — phone number shown to customers',
  },
  home_contact_email: {
    value: 'support@alhareer.com',
    category: 'home',
    description: 'Contact section — support email address',
  },
  home_contact_address: {
    value: 'Jabalpur, Madhya Pradesh, India',
    category: 'home',
    description: 'Contact section — design studio address',
  },
  home_contact_hours: {
    value: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
    category: 'home',
    description: 'Contact section — business hours',
  },

  // Newsletter
  home_newsletter_heading: {
    value: 'Be the First\nto Experience More',
    category: 'home',
    description: 'Newsletter / Privilege Club — headline (line break shown as a second, italicized line)',
  },
  home_newsletter_subtitle: {
    value: 'Sign up for new arrivals, offers, and updates.',
    category: 'home',
    description: 'Newsletter / Privilege Club — subtitle',
  },

  // Images — uploaded via admin (empty = use built-in fallback image)
  footer_arch_image: { value: '', category: 'home', description: 'Footer — arch portrait image URL' },
  home_splitbanner_image1: { value: '', category: 'home', description: 'Split Banner — left portrait image URL' },
  home_splitbanner_image2: { value: '', category: 'home', description: 'Split Banner — right fabric image URL' },
  home_ourstory_image1: { value: '', category: 'home', description: 'Our Story — left image URL' },
  home_ourstory_image2: { value: '', category: 'home', description: 'Our Story — right image URL' },
  home_aboutteaser_image: { value: '', category: 'home', description: 'About teaser block — main hero image URL' },
  home_newsletter_image: { value: '', category: 'home', description: 'Newsletter section — right panel image URL' },
  // CategoryShowcase — "Shop By Collection" section
  home_showcase_heading: {
    value: 'Shop By Category',
    category: 'home',
    description: 'Shop By Collection section — headline',
  },
  home_showcase_subtitle: {
    value: 'From everyday kurtas to full festive sets — find your fit.',
    category: 'home',
    description: 'Shop By Collection section — subtitle',
  },

  home_showcase_images: {
    value: '{}',
    category: 'home',
    description: 'Shop By Category — custom image overrides per product type, JSON {productType: imageUrl}',
  },
  home_showcase_labels: {
    value: '{}',
    category: 'home',
    description: 'Shop By Category — custom display labels per product type, JSON {productType: label}',
  },
  home_showcase_links: {
    value: '{}',
    category: 'home',
    description: 'Shop By Category — custom redirect links per product type, JSON {productType: url}',
  },

  // FeaturedCollection section
  home_featured_heading: {
    value: 'Featured Products',
    category: 'home',
    description: 'Featured Products section — headline',
  },

  // ShopByOccasion section
  home_occasions_heading: {
    value: 'Shop By Occasion',
    category: 'home',
    description: 'Shop By Occasion section — headline',
  },
  home_occasions_subtitle: {
    value: 'Find the right look for family functions, festivals, and celebrations.',
    category: 'home',
    description: 'Shop By Occasion section — subtitle',
  },
  home_shopby_occasions: {
    value: JSON.stringify([
      { title: 'Wedding', tag: 'SHAADI', image: '' },
      { title: 'Festival', tag: 'TYOHAAR', image: '' },
      { title: 'Eid Special', tag: 'EID MUBARAK', image: '' },
      { title: 'Casual Wear', tag: 'ROZNAAMCHA', image: '' },
      { title: 'Party Night', tag: 'JASHN', image: '' },
      { title: 'Office Look', tag: 'DAFTAR', image: '' },
    ]),
    category: 'home',
    description: 'Shop By Occasion — occasion cards (title + tag + image each)',
  },

  // ShopByCategory — "Shop By Kurta Type" circle row
  home_kurtatype_heading: {
    value: 'Shop By Kurta Type',
    category: 'home',
    description: 'Shop By Kurta Type section — headline',
  },
  home_kurtatype_subtitle: {
    value: 'Explore our curated collections, crafted for every occasion.',
    category: 'home',
    description: 'Shop By Kurta Type section — subtitle',
  },
  home_kurta_styles: {
    value: JSON.stringify([
      { name: 'Saudi', slug: 'saudi', image: '', link: '' },
      { name: 'Designer', slug: 'designer', image: '', link: '' },
      { name: 'Emarati', slug: 'emarati', image: '', link: '' },
      { name: 'Moroccan', slug: 'moroccan', image: '', link: '' },
      { name: 'Omani', slug: 'omani', image: '', link: '' },
      { name: 'Qatari', slug: 'qatari', image: '', link: '' },
    ]),
    category: 'home',
    description: 'Shop By Kurta Type — style circle cards (name + slug + image + link)',
  },

  // Moments cards — 3 cards with title, subtitle, image
  home_moments_cards: {
    value: JSON.stringify([
      { title: 'Festivals Feel Brighter', subtitle: 'Diwali, Eid & Celebrations', image: '' },
      { title: 'Weddings Look Grand', subtitle: 'Sangeet, Baraat & Receptions', image: '' },
      { title: 'Everyday Feels Better', subtitle: 'Casual Grace & Comfort', image: '' },
    ]),
    category: 'home',
    description: 'Moments & Celebrations — 3 cards (title + subtitle + image each)',
  },
};

/**
 * About page — general text settings.
 * Maps to the top hero intro, the "Four Pillars" section (header + 4 cards),
 * the "Artisanal Journey" process section (header + 4 steps), the stats
 * strip (4 cards), and the bottom CTA banner in
 * `src/app/about/AboutPageClient.tsx`. The page also renders the shared
 * `AboutSection` component (covered by `home_aboutteaser_*` above).
 */
export const ABOUT_SETTINGS_DEFAULTS: SiteSettingsDefaults = {
  // Top hero / intro banner
  about_hero_eyebrow: {
    value: 'ABOUT US',
    category: 'about',
    description: 'Top intro banner — eyebrow tag text',
  },
  about_hero_title: {
    value: 'About Al Hareer',
    category: 'about',
    description: 'Top intro banner — main title',
  },
  about_hero_subtitle: {
    value: 'Good Clothes, Made Well',
    category: 'about',
    description: 'Top intro banner — subtitle',
  },

  // "Our Four Pillars" section
  about_pillars_eyebrow: {
    value: 'OUR FOUR PILLARS',
    category: 'about',
    description: 'Pillars section — eyebrow tag text',
  },
  about_pillars_heading: {
    value: 'What Makes Us Different',
    category: 'about',
    description: 'Pillars section — headline',
  },
  about_pillars_subtitle: {
    value: 'We check every piece for comfort and quality.',
    category: 'about',
    description: 'Pillars section — subtitle',
  },
  about_pillars_items: {
    value: JSON.stringify([
      {
        title: 'Quality Fabrics',
        desc: "We use cotton and silk that's pre-washed so it won't shrink.",
        badge: 'No Synthetic Blends',
      },
      {
        title: 'Good Fit',
        desc: 'Made to fit well and feel comfortable.',
        badge: 'Comfortable Fit',
      },
      {
        title: 'Made Thoughtfully',
        desc: 'We make in small batches and pay our weavers fairly.',
        badge: 'Fair to Weavers',
      },
      {
        title: 'Handcrafted Details',
        desc: 'Collars and embroidery are stitched by hand.',
        badge: 'Made by Hand',
      },
    ]),
    category: 'about',
    description: 'Pillars section — 4 cards (title + description + badge each), icons fixed by position',
  },

  // "How It's Made" process section
  about_process_eyebrow: {
    value: "HOW IT'S MADE",
    category: 'about',
    description: 'Process/Making timeline — eyebrow tag text',
  },
  about_process_heading: {
    value: 'How We Make Your Clothes',
    category: 'about',
    description: 'Process/Making timeline — headline',
  },
  about_process_subtitle: {
    value: 'Here is how each piece is made, step by step.',
    category: 'about',
    description: 'Process/Making timeline — subtitle',
  },
  about_process_items: {
    value: JSON.stringify([
      {
        title: 'Sourcing the Fabric',
        desc: 'We buy good cotton, linen, and silk directly from suppliers.',
      },
      {
        title: 'Weaving',
        desc: 'Our fabric is handwoven on traditional looms.',
      },
      {
        title: 'Tailoring',
        desc: 'Tailors cut and stitch each piece by hand.',
      },
      {
        title: 'Quality Check & Packing',
        desc: 'Every garment is checked, pressed, and packed before it ships to you.',
      },
    ]),
    category: 'about',
    description: 'Process timeline — 4 steps (title + description each), numbered 01-04 by position',
  },

  about_stats_items: {
    value: JSON.stringify([
      { value: '100%', label: 'Handloom Fabric', desc: 'Ethically sourced natural fibres' },
      { value: '50k+', label: 'Customers Served', desc: 'Across India and abroad' },
      { value: '120+', label: 'Weavers We Work With', desc: 'Supporting traditional weaving families' },
      { value: '4.9★', label: 'Customer Rating', desc: 'From over 1,200 verified reviews' },
    ]),
    category: 'about',
    description: 'Stats grid — 4 cards (value + label + description each)',
  },

  // Hero image — uploaded via admin (empty = use built-in fallback)
  about_hero_image: { value: '', category: 'about', description: 'Top hero banner — arch background image URL' },

  // Bottom call-to-action banner
  about_cta_heading: {
    value: 'Shop Al Hareer',
    category: 'about',
    description: 'Bottom CTA banner — headline',
  },
  about_cta_subtitle: {
    value: 'Kurtas, kurta sets, and waistcoats, made by hand.',
    category: 'about',
    description: 'Bottom CTA banner — subtitle',
  },
  about_cta_button_text: {
    value: 'Shop Now',
    category: 'about',
    description: 'Bottom CTA banner — button text',
  },
};

/**
 * Story page (src/app/story/page.tsx) — "Our Heritage" narrative page.
 * Per-milestone/per-value card copy is stored as JSON, same convention as
 * the About page's pillars/process/stats above.
 */
export const STORY_SETTINGS_DEFAULTS: SiteSettingsDefaults = {
  story_hero_eyebrow: { value: 'OUR STORY', category: 'story', description: 'Top banner — eyebrow tag text' },
  story_hero_title: { value: 'Our Story', category: 'story', description: 'Top banner — main title' },
  story_hero_subtitle: { value: 'Rooted in Tradition. Styled for Today.', category: 'story', description: 'Top banner — subtitle' },

  story_ch1_eyebrow: { value: 'CHAPTER ONE', category: 'story', description: 'Chapter 1 — eyebrow tag text' },
  story_ch1_heading: {
    value: 'Why We Started',
    category: 'story',
    description: 'Chapter 1 — headline',
  },
  story_ch1_paragraph1: {
    value: "You need an outfit for a wedding or festival. Most store options are uncomfortable, or they just don't fit well.",
    category: 'story',
    description: 'Chapter 1 — first paragraph',
  },
  story_ch1_paragraph2: {
    value: 'We started Al Hareer in 2018 to make ethnic wear that is actually comfortable to wear.',
    category: 'story',
    description: 'Chapter 1 — second paragraph',
  },
  story_ch1_quote: {
    value: "You shouldn't have to choose between looking good and feeling comfortable.",
    category: 'story',
    description: 'Chapter 1 — pull-quote text',
  },
  story_ch1_quote_attribution: {
    value: 'Al Hareer',
    category: 'story',
    description: 'Chapter 1 — pull-quote attribution line',
  },

  story_ch2_eyebrow: { value: 'CHAPTER TWO', category: 'story', description: 'Chapter 2 — eyebrow tag text' },
  story_ch2_heading: { value: 'The People Behind Our Fabric', category: 'story', description: 'Chapter 2 — headline' },
  story_ch2_paragraph1: {
    value: 'Real people make every Al Hareer kurta. Our weavers have done this work for decades.',
    category: 'story',
    description: 'Chapter 2 — first paragraph',
  },
  story_ch2_paragraph2: {
    value: 'We use traditional handlooms, not factory machines. We pay our weavers fairly and give them work all year.',
    category: 'story',
    description: 'Chapter 2 — second paragraph',
  },
  story_ch2_weaver_name: {
    value: 'Ramzan Ali and Family',
    category: 'story',
    description: 'Chapter 2 — featured weaver photo caption, name line',
  },
  story_ch2_weaver_desc: {
    value: 'Third-generation weavers from Chanderi.',
    category: 'story',
    description: 'Chapter 2 — featured weaver photo caption, description line',
  },
  story_ch2_stats_items: {
    value: JSON.stringify([
      { label: 'No Synthetic Fabric', desc: 'Pre-washed, natural fibres only', value: '100%' },
      { label: 'Direct to Weavers', desc: 'No middlemen taking a cut', value: 'Fair-Pay' },
    ]),
    category: 'story',
    description: 'Chapter 2 — 2 small stat callouts (value + label + description each)',
  },

  story_ch3_eyebrow: { value: 'CHAPTER THREE', category: 'story', description: 'Chapter 3 — eyebrow tag text' },
  story_ch3_heading: { value: 'Our Journey So Far', category: 'story', description: 'Chapter 3 — headline' },
  story_ch3_subtitle: {
    value: 'From a handful of kurtas to shipping across the world.',
    category: 'story',
    description: 'Chapter 3 — subtitle',
  },
  story_milestones_items: {
    value: JSON.stringify([
      {
        year: '2018',
        title: 'The First Kurtas',
        desc: 'Tired of uncomfortable synthetic kurtas in the market, we partnered with two weaving families in Varanasi to make our first 4 cotton kurtas.',
      },
      {
        year: '2020',
        title: 'Adding Silk',
        desc: 'We introduced Chanderi silk and silk-cotton blends, and expanded into new colours beyond white.',
      },
      {
        year: '2023',
        title: 'Going Global',
        desc: 'Started shipping to customers in 20+ countries, including the US, UK, Canada, and UAE.',
      },
      {
        year: 'Today',
        title: '48 Styles and Growing',
        desc: 'From waistcoats to pajamas to kurtas — we keep adding new styles, made the same careful way.',
      },
    ]),
    category: 'story',
    description: 'Chapter 3 — 4 timeline milestones (year + title + description each)',
  },

  story_ch4_eyebrow: { value: 'WHAT WE BELIEVE', category: 'story', description: 'Chapter 4 — eyebrow tag text' },
  story_ch4_heading: { value: 'What We Stand For', category: 'story', description: 'Chapter 4 — headline' },
  story_values_items: {
    value: JSON.stringify([
      {
        title: 'Everyday Tradition',
        desc: 'You can wear our clothes anytime, not just for special occasions.',
      },
      {
        title: 'Good Tailoring',
        desc: 'Our clothes are shaped to fit real bodies well.',
      },
      {
        title: 'Responsible Production',
        desc: 'We pay fair wages, avoid waste, and use plastic-free packaging.',
      },
      {
        title: 'Quality Control',
        desc: 'We test every fabric before we use it.',
      },
    ]),
    category: 'story',
    description: 'Chapter 4 — 4 core-values cards (title + description each), icons fixed by position',
  },

  story_cta_heading: { value: 'Shop Our Collection', category: 'story', description: 'Bottom CTA banner — headline' },
  story_cta_subtitle: {
    value: 'Handmade kurtas, kurta sets, and waistcoats.',
    category: 'story',
    description: 'Bottom CTA banner — subtitle',
  },

  // Images — uploaded via admin (empty = use built-in fallback image)
  story_hero_image: { value: '', category: 'story', description: 'Top hero banner — arch background image URL' },
  story_ch1_image1: { value: '', category: 'story', description: 'Chapter 1 — left portrait image URL' },
  story_ch1_image2: { value: '', category: 'story', description: 'Chapter 1 — right portrait image URL' },
  story_ch2_image: { value: '', category: 'story', description: 'Chapter 2 — featured weaver portrait image URL' },
};

export const ALL_SETTINGS_DEFAULTS: SiteSettingsDefaults = {
  ...HOME_SETTINGS_DEFAULTS,
  ...ABOUT_SETTINGS_DEFAULTS,
  ...STORY_SETTINGS_DEFAULTS,
};
