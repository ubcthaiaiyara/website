import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { getMemberByUserId, setMemberPasswordHash } from "@/lib/members";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getSupabase } from "@/lib/supabase";

// PUT /api/account/password
// Sets or changes the signed-in member's password. Members who signed up
// passwordless (email OTP or Google) have no password yet and can add one here.
// If they already have one, the current password must be supplied and verified.
// The update uses the service-role admin API (no Supabase session needed); we
// also keep members.password_hash in sync so we can tell whether a password is
// set and verify the current one locally.
export async function PUT(request: Request) {
  const userId = await readSession();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { password, currentPassword } = (body ?? {}) as {
    password?: unknown;
    currentPassword?: unknown;
  };

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const member = await getMemberByUserId(userId);
  if (!member) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  // If a password is already set, require and verify the current one before
  // allowing a change. Passwordless members skip this and set their first one.
  if (member.password_hash) {
    if (typeof currentPassword !== "string" || currentPassword.length === 0) {
      return NextResponse.json(
        { error: "Enter your current password." },
        { status: 400 }
      );
    }
    if (!verifyPassword(currentPassword, member.password_hash)) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 400 }
    );
  }

  await setMemberPasswordHash(userId, hashPassword(password));

  return NextResponse.json({ ok: true });
}
