import { NextResponse } from "next/server";
import { getSupabaseAuth } from "@/lib/supabase";

// POST /api/auth/otp/start
// Sends a Supabase email OTP. Login requires an existing auth user; signup can
// create one and stores the submitted name in user metadata.
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

  const { email, name, mode } = (body ?? {}) as {
    email?: unknown;
    name?: unknown;
    mode?: unknown;
  };

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  const isSignup = mode === "signup";
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (isSignup && trimmedName.length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: isSignup,
      data: isSignup ? { name: trimmedName } : undefined,
    },
  });

  if (error) {
    // On login we don't create users, so an unregistered email comes back as
    // Supabase's generic "signups not allowed" rejection. Surface it as a clear
    // "no matching account" error instead.
    if (!isSignup && (error.code === "otp_disabled" || error.status === 422)) {
      return NextResponse.json(
        { error: "We couldn't find an account with that email." },
        { status: 404 }
      );
    }

    // Reword Supabase's rate-limit message ("For security purposes, you can only
    // request this after N seconds.") into something friendlier.
    const rateLimit = /request this after (\d+) seconds/i.exec(error.message);
    if (rateLimit || error.status === 429) {
      const seconds = rateLimit?.[1];
      return NextResponse.json(
        {
          error: seconds
            ? `Please wait ${seconds} seconds before requesting a new code.`
            : "Too many attempts. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
