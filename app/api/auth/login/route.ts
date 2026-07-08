import { NextResponse } from "next/server";
import { getOrCreateAuthMember } from "@/lib/members";
import { setSessionCookie } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

// POST /api/auth/login
// Verifies email + password through Supabase Auth and, on success, sets the app
// session cookie to the Supabase Auth user id. Returns a single generic error
// for both unknown-email and wrong-password so we don't reveal registered emails.
export async function POST(request: Request) {
  const supabase = getSupabaseAuth();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Auth is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  await getOrCreateAuthMember(
    data.user.id,
    data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Member",
    data.user.email || email
  );
  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, data.user.id);
  return response;
}
