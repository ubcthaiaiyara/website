import { NextResponse } from "next/server";
import { getOrCreateAuthMember } from "@/lib/members";
import { setSessionCookie } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

// POST /api/auth/otp/verify
// Verifies a user-supplied Supabase email OTP, links/creates the member profile,
// and sets the app session cookie.
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

  const { email, token, name } = (body ?? {}) as {
    email?: unknown;
    token?: unknown;
    name?: unknown;
  };

  if (typeof email !== "string" || typeof token !== "string") {
    return NextResponse.json(
      { error: "Email and confirmation code are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: "email",
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Invalid or expired confirmation code." },
      { status: error?.status ?? 401 }
    );
  }

  const userEmail = data.user.email || email.trim();
  const displayName =
    (typeof name === "string" && name.trim()) ||
    data.user.user_metadata?.name ||
    data.user.user_metadata?.full_name ||
    userEmail.split("@")[0];

  const member = await getOrCreateAuthMember(data.user.id, displayName, userEmail);
  const response = NextResponse.json({ ok: true, serial: member.serial_number });
  setSessionCookie(response, data.user.id);
  return response;
}
