import { NextResponse } from "next/server";
import { DuplicateEmailError, getOrCreateAuthMember } from "@/lib/members";
import { setSessionCookie } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

// POST /api/auth/signup
// Validates the body, creates a Supabase Auth user, links/creates the member
// profile row, signs the caller in when Supabase returns a session, and returns
// { ok, serial }.
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

  const { name, email, password } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: { name: trimmedName },
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create account." },
      { status: error?.status ?? 400 }
    );
  }

  try {
    const member = await getOrCreateAuthMember(
      data.user.id,
      trimmedName,
      data.user.email || trimmedEmail
    );

    if (!data.session) {
      return NextResponse.json(
        {
          error:
            "Account created. Check your email to confirm your address, then log in.",
        },
        { status: 202 }
      );
    }

    const response = NextResponse.json({ ok: true, serial: member.serial_number });
    setSessionCookie(response, data.user.id);
    return response;
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }
    throw err;
  }
}
