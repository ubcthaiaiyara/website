import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase";

const MODE_COOKIE = "aiyara_google_oauth_mode";

function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function GET(request: Request) {
  const supabase = getSupabaseAuth();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Auth is not configured." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "signup" ? "signup" : "login";
  const redirectTo = `${getBaseUrl(request)}/api/auth/google/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { error: error?.message ?? "Could not start Google sign-in." },
      { status: 500 }
    );
  }

  const response = NextResponse.redirect(data.url);
  response.cookies.set(MODE_COOKIE, mode, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
