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
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

let cachedClient: SupabaseClient | null = null;
let cachedAuthClient: SupabaseClient | null = null;

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

export function getSupabaseAuth(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  if (!cachedAuthClient) {
    cachedAuthClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
  }

  return cachedAuthClient;
}

// Fixed storage key so the PKCE code-verifier lands at a predictable slot we can
// read back. The OAuth flow spans two requests (start → provider → callback), so
// we can't share in-process state; the caller passes a plain object we read the
// verifier out of (start) or seed it into (callback).
export const OAUTH_STORAGE_KEY = "aiyara-oauth";
export const OAUTH_CODE_VERIFIER_KEY = `${OAUTH_STORAGE_KEY}-code-verifier`;

// Auth client for the Google OAuth (PKCE) flow, backed by a caller-provided
// storage map. supabase-js writes/reads the code verifier through this map, so
// the caller can persist it in a cookie between the two requests.
export function createOAuthClient(
  store: Record<string, string>
): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      detectSessionInUrl: false,
      // Must be true: auth-js ignores a custom `storage` unless the session is
      // "persisted". The store is a fresh per-request object, so nothing
      // actually leaks between requests — it just lets us capture/replay the
      // PKCE code verifier.
      persistSession: true,
      storageKey: OAUTH_STORAGE_KEY,
      storage: {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => {
          store[key] = value;
        },
        removeItem: (key) => {
          delete store[key];
        },
      },
    },
  });
}
