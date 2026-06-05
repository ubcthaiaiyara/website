import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Minimal signed-cookie sessions — no external dependency.
 *
 * The session is just the member's serial_number plus an HMAC signature:
 *   <serial>.<hmacHex>
 * so the client cannot forge or tamper with it, and the server can recover the
 * serial without a session store. httpOnly keeps it out of client JS.
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

function sign(serial: string): string {
  return createHmac("sha256", getSecret()).update(serial).digest("hex");
}

/** Build the signed cookie value for a member serial. */
function encode(serial: string): string {
  return `${serial}.${sign(serial)}`;
}

/** Verify a cookie value and return the serial it carries, or null if invalid. */
function decode(value: string | undefined): string | null {
  if (!value) return null;

  const idx = value.lastIndexOf(".");
  if (idx <= 0) return null;

  const serial = value.slice(0, idx);
  const signature = value.slice(idx + 1);
  const expected = sign(serial);

  // Constant-time compare; guard equal length first (timingSafeEqual throws otherwise).
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  return serial;
}

/** Set the session cookie for the given member serial. */
export async function createSession(serial: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encode(serial), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Read the current session's member serial, or null if not signed in. */
export async function readSession(): Promise<string | null> {
  const store = await cookies();
  return decode(store.get(COOKIE_NAME)?.value);
}

/** Clear the session cookie (logout). */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
