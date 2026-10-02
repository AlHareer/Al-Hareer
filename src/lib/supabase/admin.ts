import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS. Used by Server Actions only (checkout writes,
// admin dashboard CRUD). Never import this into client components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
