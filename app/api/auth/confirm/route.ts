import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getOrCreateAuthMember } from "@/lib/members";
import { setSessionCookie } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

// GET /api/auth/confirm?token_hash=...&type=email
// Handles the "click here to sign in" magic link in the OTP email. Verifies the
// token hash with Supabase (no PKCE verifier needed — unlike the OAuth flow, the
// hash is self-contained, so this works even when the link is opened on another
// device), links/creates the member, sets the session cookie, and lands on the
// dashboard.
function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = getSupabaseAuth();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Auth is not configured." },
      { status: 500 }
    );
  }

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login", getBaseUrl(request)));
  }

  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });
  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/login?error=expired-link", getBaseUrl(request))
    );
  }

  const email = data.user.email;
  const name =
    data.user.user_metadata?.name ||
    data.user.user_metadata?.full_name ||
    email?.split("@")[0] ||
    "Member";

  if (email) {
    await getOrCreateAuthMember(data.user.id, name, email);
  }

  const response = NextResponse.redirect(
    new URL("/dashboard", getBaseUrl(request))
  );
  setSessionCookie(response, data.user.id);
  return response;
}
