import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";
import { getSupabaseAuth } from "@/lib/supabase";

// POST /api/auth/logout
// Clears the session cookie. Always succeeds (idempotent).
export async function POST() {
  await getSupabaseAuth()?.auth.signOut();
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
