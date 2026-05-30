import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client init.
 *
 * The client is created lazily and only when both env vars are present. When
 * they are absent, getSupabase() returns null and lib/members falls back to the
 * in-memory store — so the app still runs with zero configuration (stage 1
 * behavior) and lights up the real DB the moment the env vars are supplied.
 *
 * This uses the SERVICE ROLE key, which bypasses Row Level Security. That is
 * appropriate here because this module is a trusted, server-only writer: it is
 * imported only by lib/members (itself imported only by route handlers) and the
 * key is never NEXT_PUBLIC_-prefixed, so it never reaches the client bundle.
 * The service role key MUST stay server-side — never log it or return it.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }

  return cachedClient;
}
