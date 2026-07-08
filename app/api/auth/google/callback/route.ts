import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getOrCreateAuthMember } from "@/lib/members";
import { createSession } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

const MODE_COOKIE = "aiyara_google_oauth_mode";

function getBaseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

function redirectToAuth(request: Request, mode: string | undefined) {
  return NextResponse.redirect(
    new URL(mode === "signup" ? "/join" : "/login", getBaseUrl(request))
  );
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
  const code = url.searchParams.get("code");
  const cookieStore = await cookies();
  const mode = cookieStore.get(MODE_COOKIE)?.value;

  if (!code) {
    const response = redirectToAuth(request, mode);
    response.cookies.delete(MODE_COOKIE);
    return response;
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    const response = redirectToAuth(request, mode);
    response.cookies.delete(MODE_COOKIE);
    return response;
  }

  const email = data.user.email;
  if (!email) {
    const response = redirectToAuth(request, mode);
    response.cookies.delete(MODE_COOKIE);
    return response;
  }

  const name =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.name ||
    email.split("@")[0];

  await getOrCreateAuthMember(data.user.id, name, email);
  await createSession(data.user.id);

  const response = NextResponse.redirect(new URL("/dashboard", getBaseUrl(request)));
  response.cookies.delete(MODE_COOKIE);
  return response;
}
