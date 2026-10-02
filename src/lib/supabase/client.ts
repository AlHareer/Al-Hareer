import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Browser client for real customer auth (session persisted in localStorage by
// default). Used by AuthContext, the account page, and checkout — never
// import this into a Server Component/Action. Singleton: supabase-js warns
// (and session state can get inconsistent) if multiple GoTrueClient
// instances exist on the same page.
let client: SupabaseClient | undefined;

export function createBrowserSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
