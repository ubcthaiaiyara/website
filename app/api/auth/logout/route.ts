import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

// POST /api/auth/logout
// Clears the session cookie. Always succeeds (idempotent).
export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
