import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createOAuthClient, OAUTH_CODE_VERIFIER_KEY } from "@/lib/supabase";

// GET /api/account/providers/google/link/callback
// Completes the manual Google link started in ../start. The link grant was bound
// to the member at the linkIdentity authorize step, so all we need here is the
// PKCE verifier to redeem the code — same pattern as the Google login callback
// (no setSession; that would clear the verifier before the exchange reads it).
// The app's own session cookie is untouched throughout.

const VERIFIER_COOKIE = "aiyara_google_link_verifier";

function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

function clearCookies(response: NextResponse) {
  response.cookies.delete(VERIFIER_COOKIE);
  return response;
}

function fail(base: string, reason?: string) {
  const q = reason ? `&reason=${encodeURIComponent(reason)}` : "";
  return clearCookies(
    NextResponse.redirect(new URL(`/dashboard?error=google-link${q}`, base))
  );
}

export async function GET(request: Request) {
  const base = getBaseUrl(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const cookieStore = await cookies();
  const verifier = cookieStore.get(VERIFIER_COOKIE)?.value;

  if (!code || !verifier) {
    return fail(base);
  }

  const store: Record<string, string> = { [OAUTH_CODE_VERIFIER_KEY]: verifier };
  const client = createOAuthClient(store);
  if (!client) {
    return fail(base, "Supabase is not configured.");
  }

  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) {
    return fail(base, error.message);
  }

  return clearCookies(
    NextResponse.redirect(new URL("/dashboard?connected=google", base))
  );
}
