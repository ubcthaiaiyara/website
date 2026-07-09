import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { deleteMemberByUserId, getMemberByUserId } from "@/lib/members";
import { clearSessionCookie } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/password";

// POST /api/account/delete
// Permanently deletes the signed-in member's account. Removes the Supabase Auth
// user (the members row cascades via the auth.users FK); falls back to removing
// the in-memory member when Supabase isn't configured. Clears the session.
export async function POST(request: Request) {
  const userId = await readSession();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { password } = (body ?? {}) as { password?: unknown };
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 }
    );
  }

  const member = await getMemberByUserId(userId);
  if (!member) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  if (!member.password_hash) {
    return NextResponse.json(
      { error: "Set a password before deleting your account." },
      { status: 400 }
    );
  }
  if (!verifyPassword(password, member.password_hash)) {
    return NextResponse.json(
      { error: "Password is incorrect." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 400 }
      );
    }
  } else {
    await deleteMemberByUserId(userId);
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
