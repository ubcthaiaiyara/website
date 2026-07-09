import { NextResponse } from "next/server";
import {
  createOAuthClient,
  OAUTH_CODE_VERIFIER_KEY,
} from "@/lib/supabase";

const MODE_COOKIE = "aiyara_google_oauth_mode";
const VERIFIER_COOKIE = "aiyara_google_oauth_verifier";

function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function GET(request: Request) {
  // The PKCE code verifier supabase-js generates here must survive until the
  // callback request, so we back the client with a plain object and read the
  // verifier out of it afterwards.
  const store: Record<string, string> = {};
  const supabase = createOAuthClient(store);
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Auth is not configured." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const modeParam = url.searchParams.get("mode");
  // "link" is used from the account page to connect Google to an existing,
  // signed-in member; login/signup are the unauthenticated entry points.
  const mode =
    modeParam === "signup" || modeParam === "link" ? modeParam : "login";
  const redirectTo = `${getBaseUrl(request)}/api/auth/google/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  const verifier = store[OAUTH_CODE_VERIFIER_KEY];
  if (error || !data.url || !verifier) {
    return NextResponse.json(
      { error: error?.message ?? "Could not start Google sign-in." },
      { status: 500 }
    );
  }

  const response = NextResponse.redirect(data.url);
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  };
  response.cookies.set(MODE_COOKIE, mode, cookieOptions);
  response.cookies.set(VERIFIER_COOKIE, verifier, cookieOptions);
  return response;
}
