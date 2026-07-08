import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

// POST /api/auth/logout
// Clears the session cookie. Always succeeds (idempotent).
export async function POST() {
  await getSupabaseAuth()?.auth.signOut();
  await clearSession();
  return NextResponse.json({ ok: true });
}
