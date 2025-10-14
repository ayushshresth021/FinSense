import { createClient, SupabaseClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Admin client with service role key (bypasses RLS)
// Use this for server-side operations where you've already verified the user
export const supabaseAdmin: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Regular client with anon key (respects RLS)
// Use this when you want RLS policies to apply
export const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!
);

/**
 * Get Supabase client with user's JWT token
 * This creates a client scoped to a specific user's session
 */
export const getSupabaseClient = (accessToken: string): SupabaseClient => {
  return createClient(
    process.env.SUPABASE_URL!,
    (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};