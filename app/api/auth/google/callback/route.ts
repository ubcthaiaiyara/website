import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getOrCreateAuthMember } from "@/lib/members";
import { setSessionCookie } from "@/lib/session";
import { createOAuthClient, OAUTH_CODE_VERIFIER_KEY } from "@/lib/supabase";

const MODE_COOKIE = "aiyara_google_oauth_mode";
const VERIFIER_COOKIE = "aiyara_google_oauth_verifier";

function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete(MODE_COOKIE);
  response.cookies.delete(VERIFIER_COOKIE);
  return response;
}

function redirectToAuth(request: Request, mode: string | undefined) {
  // Connecting Google from the account page: the member is already signed in,
  // so send them back to the dashboard rather than a login screen.
  const path =
    mode === "link" ? "/dashboard" : mode === "signup" ? "/join" : "/login";
  return clearOAuthCookies(
    NextResponse.redirect(new URL(path, getBaseUrl(request)))
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const cookieStore = await cookies();
  const mode = cookieStore.get(MODE_COOKIE)?.value;
  const verifier = cookieStore.get(VERIFIER_COOKIE)?.value;

  if (!code || !verifier) {
    return redirectToAuth(request, mode);
  }

  // Re-seed the PKCE verifier captured in /start so exchangeCodeForSession can
  // complete the flow.
  const store: Record<string, string> = { [OAUTH_CODE_VERIFIER_KEY]: verifier };
  const supabase = createOAuthClient(store);
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Auth is not configured." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return redirectToAuth(request, mode);
  }

  const email = data.user.email;
  if (!email) {
    return redirectToAuth(request, mode);
  }

  const name =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.name ||
    email.split("@")[0];

  await getOrCreateAuthMember(data.user.id, name, email);

  const response = clearOAuthCookies(
    NextResponse.redirect(new URL("/dashboard", getBaseUrl(request)))
  );
  setSessionCookie(response, data.user.id);
  return response;
}
