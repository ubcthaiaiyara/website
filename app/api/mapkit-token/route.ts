import { NextResponse } from "next/server";
import { createPrivateKey, sign } from "crypto";

// GET /api/mapkit-token
// Mints a short-lived ES256 JWT for MapKit JS, signed with the Apple Maps
// private key. Requires three env vars from the Apple Developer portal
// (Certificates, Identifiers & Profiles → Keys, with the Maps service):
//   MAPKIT_TEAM_ID      — 10-char Apple Developer Team ID (the token's `iss`)
//   MAPKIT_KEY_ID       — the Maps key's Key ID (the JWT header `kid`)
//   MAPKIT_PRIVATE_KEY  — the .p8 key contents (PEM; literal \n allowed)
// Optionally MAPKIT_ORIGIN (e.g. "https://ubcthaiaiyara.com") to lock the
// token to your domain. Until these are set the route returns 503 and the map
// component falls back to an "Open in Apple Maps" link.
export const runtime = "nodejs";

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function GET() {
  const teamId = process.env.MAPKIT_TEAM_ID;
  const keyId = process.env.MAPKIT_KEY_ID;
  const rawKey = process.env.MAPKIT_PRIVATE_KEY;

  if (!teamId || !keyId || !rawKey) {
    return NextResponse.json(
      { error: "MapKit is not configured." },
      { status: 503 },
    );
  }

  // Accept the .p8 either as raw PEM (literal \n allowed) or base64-encoded —
  // base64 avoids newline/quoting issues in env vars (handy on Vercel).
  const pem = rawKey.includes("BEGIN")
    ? rawKey.replace(/\\n/g, "\n")
    : Buffer.from(rawKey, "base64").toString("utf8");

  let key;
  try {
    key = createPrivateKey(pem);
  } catch {
    return NextResponse.json(
      { error: "Invalid MapKit private key." },
      { status: 500 },
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", kid: keyId, typ: "JWT" };
  const payload: Record<string, unknown> = {
    iss: teamId,
    iat: now,
    exp: now + 30 * 60,
  };
  const origin = process.env.MAPKIT_ORIGIN;
  if (origin) payload.origin = origin;

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(payload),
  )}`;
  // ES256 JWTs need the raw R||S signature (ieee-p1363), not DER.
  const signature = sign("sha256", Buffer.from(signingInput), {
    key,
    dsaEncoding: "ieee-p1363",
  });
  const token = `${signingInput}.${base64url(signature)}`;

  return new NextResponse(token, {
    headers: {
      "Content-Type": "text/plain",
      // Cache a little under the token lifetime.
      "Cache-Control": "private, max-age=1500",
    },
  });
}
