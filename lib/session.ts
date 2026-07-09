import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/**
 * Minimal signed-cookie sessions — no external dependency.
 *
 * The session is just the Supabase Auth user id plus an HMAC signature:
 *   <userId>.<hmacHex>
 * so the client cannot forge or tamper with it, and the server can recover the
 * user id without a session store. httpOnly keeps it out of client JS.
 *
 * Server-only: imported by route handlers and server components. The signing
 * secret is read from SESSION_SECRET, with a dev fallback so the app still runs
 * with zero config (mirroring lib/supabase). Set SESSION_SECRET in production.
 */

const COOKIE_NAME = "aiyara_session";
const DEV_FALLBACK_SECRET = "dev-insecure-session-secret-change-me";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return process.env.SESSION_SECRET || DEV_FALLBACK_SECRET;
}

function sign(userId: string): string {
  return createHmac("sha256", getSecret()).update(userId).digest("hex");
}

/** Build the signed cookie value for a Supabase Auth user id. */
function encode(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

/** Verify a cookie value and return the user id it carries, or null if invalid. */
function decode(value: string | undefined): string | null {
  if (!value) return null;

  const idx = value.lastIndexOf(".");
  if (idx <= 0) return null;

  const userId = value.slice(0, idx);
  const signature = value.slice(idx + 1);
  const expected = sign(userId);

  // Constant-time compare; guard equal length first (timingSafeEqual throws otherwise).
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  return userId;
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

/**
 * Set the session cookie directly on a response. All auth routes return their
 * own NextResponse, and cookies written via next/headers `cookies()` are not
 * reliably applied to a response object you construct and return yourself
 * (especially a redirect, or when the response's own cookies are also touched),
 * so we always set the session on the response we hand back.
 */
export function setSessionCookie(response: NextResponse, userId: string): void {
  response.cookies.set(COOKIE_NAME, encode(userId), cookieOptions());
}

/** Read the current session's Supabase Auth user id, or null if not signed in. */
export async function readSession(): Promise<string | null> {
  const store = await cookies();
  return decode(store.get(COOKIE_NAME)?.value);
}

/** Clear the session cookie on a response (logout). */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME);
}
