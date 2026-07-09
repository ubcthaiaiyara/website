import { NextResponse } from "next/server";
import { getMemberByUserId } from "@/lib/members";
import { readSession } from "@/lib/session";
import { unlinkUserIdentityProvider } from "@/lib/supabase";

// DELETE /api/account/providers/google
// Disconnects Google as a sign-in method. Require a password first so members
// do not remove their only practical way back into the account.
export async function DELETE() {
  const userId = await readSession();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const member = await getMemberByUserId(userId);
  if (!member) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  if (!member.password_hash) {
    return NextResponse.json(
      { error: "Set a password before disconnecting Google." },
      { status: 400 }
    );
  }

  try {
    await unlinkUserIdentityProvider(userId, "google");
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not disconnect Google.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
