import { createClient } from '@supabase/supabase-js';

// Anon-key, read-only client for public storefront queries (Server Components).
// RLS policies (db/schema.sql) restrict this to public_read rows only.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
