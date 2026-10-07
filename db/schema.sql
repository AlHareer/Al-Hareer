-- Al Hareer database schema.
-- Safe to re-run: every statement is create-if-not-exists / insert-on-conflict-do-nothing.
-- Run with: npm run db:migrate

create extension if not exists pgcrypto;

-- ── Catalog ──────────────────────────────────────────────────────────────

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references categories(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  show_on_homepage boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_categories_parent_id on categories(parent_id);
-- Backfill for tables created before parent_id/show_on_homepage existed.
alter table categories add column if not exists parent_id uuid references categories(id) on delete set null;
alter table categories add column if not exists show_on_homepage boolean not null default false;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category_id uuid references categories(id) on delete set null,
  short_description text,
  description text,
  color text,
  fabric text,
  fit_type text,
  care_instructions text,
  occasion text,
  badge text,
  product_type text,
  colors jsonb not null default '[]'::jsonb,
  featured_image_url text,
  video_url text,
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  show_in_shop boolean not null default true,
  average_rating numeric not null default 0,
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_slug on products(slug);
-- Backfills for tables created before product_type/colors/details existed.
alter table products add column if not exists product_type text;
alter table products add column if not exists colors jsonb not null default '[]'::jsonb;
-- Full source `details` object (material/setIncludes/work/etc.), stored losslessly
-- alongside the individual occasion/fit_type/care_instructions/color columns above
-- (those stay for admin-form/filter convenience; this is the read-mapping source of truth).
alter table products add column if not exists details jsonb not null default '{}'::jsonb;

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  variant_name text,
  color text
);
create index if not exists idx_product_images_product_id on product_images(product_id);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_name text not null,
  color text,
  color_hex text,
  price numeric not null,
  original_price numeric,
  stock_quantity int not null default 0,
  weight_grams int,
  is_active boolean not null default true,
  image_url text
);
-- Backfill for tables created before image_url existed — lets admins set a
-- distinct photo per exact size+color combination (e.g. "S / Red" vs "S / Blue"),
-- not just one photo per color.
alter table product_variants add column if not exists image_url text;
create index if not exists idx_product_variants_product_id on product_variants(product_id);

create table if not exists product_faqs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order int not null default 0
);

-- ── Users / orders ───────────────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  role text not null default 'customer',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  full_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  address_type text not null default 'Home',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_addresses_user_id on addresses(user_id);
-- Backfill for tables created before address_type existed.
alter table addresses add column if not exists address_type text not null default 'Home';

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references profiles(id) on delete set null,
  guest_email text,
  guest_phone text,
  address_id uuid references addresses(id) on delete set null,
  subtotal numeric not null default 0,
  shipping_cost numeric not null default 0,
  discount_amount numeric not null default 0,
  coupon_discount numeric not null default 0,
  quantity_discount numeric not null default 0,
  coupon_code text,
  total_amount numeric not null default 0,
  payment_method text not null default 'COD',
  payment_status text not null default 'pending',
  order_status text not null default 'processing',
  tracking_number text,
  tracking_url text,
  courier_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_user_id on orders(user_id);
-- Drop the old constraint that only ever allowed 'COD' — it silently broke
-- every Razorpay (online) order, since placeOrder() inserts 'Online Payment'
-- for those. payment_method is free text now, same as COD/online elsewhere.
alter table orders drop constraint if exists orders_payment_method_check;
-- Razorpay payment id (pay_...) of a successful online payment, shown to the
-- customer and admin as the payment reference.
alter table orders add column if not exists razorpay_payment_id text;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  color text,
  color_hex text,
  image_url text,
  price_at_purchase numeric not null,
  quantity int not null,
  line_total numeric not null
);
create index if not exists idx_order_items_order_id on order_items(order_id);
-- Backfills for tables created before color/image_url existed.
alter table order_items add column if not exists color text;
alter table order_items add column if not exists image_url text;

-- ── Engagement / marketing ───────────────────────────────────────────────

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  reviewer_name text,
  rating int not null check (rating between 1 and 5),
  review_text text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_reviews_product_id on reviews(product_id);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('flat', 'percent')),
  value numeric not null,
  min_purchase numeric not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  shipping jsonb not null default '{"flat_rate": 0, "free_threshold": 999, "cod_charge": 0}',
  quantity_discount jsonb not null default '{"enabled": false, "tiers": []}'
);
insert into settings (id) values (1) on conflict (id) do nothing;

create table if not exists site_settings (
  key text primary key,
  value text,
  category text,
  description text,
  updated_at timestamptz not null default now()
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  tag text,
  title text,
  subtitle text,
  button_text text,
  button_link text,
  display_order int not null default 0,
  is_active boolean not null default true
);
-- Backfill for tables created before `tag` existed.
alter table hero_slides add column if not exists tag text;

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  role text,
  location text,
  review_text text not null,
  rating int not null default 5,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true
);
alter table testimonials add column if not exists role text;

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────
-- All writes go through the service-role client (admin actions, seed script,
-- checkout server action), which bypasses RLS. Only public-read policies are
-- needed for the tables the storefront reads directly with the anon key.

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table product_faqs enable row level security;
alter table hero_slides enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table announcements enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table coupons enable row level security;
alter table settings enable row level security;
alter table inquiries enable row level security;
alter table newsletter_subscribers enable row level security;

drop policy if exists public_read on categories;
create policy public_read on categories for select using (is_active = true);

drop policy if exists public_read on products;
create policy public_read on products for select using (is_active = true and show_in_shop = true);

drop policy if exists public_read on product_images;
create policy public_read on product_images for select using (true);

drop policy if exists public_read on product_variants;
create policy public_read on product_variants for select using (true);

drop policy if exists public_read on product_faqs;
create policy public_read on product_faqs for select using (true);

drop policy if exists public_read on hero_slides;
create policy public_read on hero_slides for select using (is_active = true);

drop policy if exists public_read on testimonials;
create policy public_read on testimonials for select using (is_active = true);

drop policy if exists public_read on faqs;
create policy public_read on faqs for select using (is_active = true);

drop policy if exists public_read on announcements;
create policy public_read on announcements for select using (is_active = true);

drop policy if exists public_read on reviews;
create policy public_read on reviews for select using (is_approved = true);

drop policy if exists public_read on site_settings;
create policy public_read on site_settings for select using (true);

-- A signed-in customer may read (but not write — that stays service-role-only,
-- via placeOrder / admin actions) their own orders/order_items/addresses/profile.
drop policy if exists own_rows on orders;
create policy own_rows on orders for select using (auth.uid() = user_id);

drop policy if exists own_rows on order_items;
create policy own_rows on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

drop policy if exists own_rows on addresses;
create policy own_rows on addresses for select using (auth.uid() = user_id);

drop policy if exists own_rows on profiles;
create policy own_rows on profiles for select using (auth.uid() = id);
