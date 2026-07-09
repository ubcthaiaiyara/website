import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import {
  createOAuthClient,
  getSupabase,
  OAUTH_CODE_VERIFIER_KEY,
} from "@/lib/supabase";

// GET /api/account/providers/google/link/start
// Connects Google to the signed-in member, even when the Google email differs
// from the account email (Supabase auto-linking only handles matching emails).
// This uses manual linkIdentity, which needs a Supabase user session — the app
// keeps its own cookie session, so we mint a short-lived Supabase session for
// the member (admin magic-link token → verifyOtp), start linkIdentity, and carry
// the PKCE verifier + session tokens to the callback via httpOnly cookies.
//
// Requires "manual linking" enabled in the Supabase project, and this callback
// URL added to the Auth redirect allow list.

const VERIFIER_COOKIE = "aiyara_google_link_verifier";

function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

function fail(base: string, reason?: string) {
  const q = reason ? `&reason=${encodeURIComponent(reason)}` : "";
  return NextResponse.redirect(new URL(`/dashboard?error=google-link${q}`, base));
}

export async function GET(request: Request) {
  const base = getBaseUrl(request);
  const userId = await readSession();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", base));
  }

  const admin = getSupabase();
  if (!admin) {
    return fail(base, "Supabase is not configured.");
  }

  const { data: userData, error: userErr } =
    await admin.auth.admin.getUserById(userId);
  const email = userData?.user?.email;
  if (userErr || !email) {
    return fail(base);
  }

  // Mint a session for this member without sending an email.
  const { data: linkData, error: genErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const tokenHash = linkData?.properties?.hashed_token;
  if (genErr || !tokenHash) {
    return fail(base, genErr?.message);
  }

  const store: Record<string, string> = {};
  const client = createOAuthClient(store);
  if (!client) {
    return fail(base, "Supabase is not configured.");
  }

  const { error: verifyErr } = await client.auth.verifyOtp({
    type: "magiclink",
    token_hash: tokenHash,
  });
  if (verifyErr) {
    return fail(base, verifyErr.message);
  }

  const { data: oauth, error: linkErr } = await client.auth.linkIdentity({
    provider: "google",
    options: {
      redirectTo: `${base}/api/account/providers/google/link/callback`,
      skipBrowserRedirect: true,
      queryParams: { prompt: "select_account" },
    },
  });

  const verifier = store[OAUTH_CODE_VERIFIER_KEY];
  if (linkErr || !oauth?.url || !verifier) {
    return fail(base, linkErr?.message);
  }

  const response = NextResponse.redirect(oauth.url);
  response.cookies.set(VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
