import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/members";
import { createSession } from "@/lib/session";

// POST /api/auth/login
// Verifies email + password and, on success, sets the session cookie. Returns a
// single generic error for both unknown-email and wrong-password so we don't
// reveal which emails are registered.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const member = await verifyCredentials(email, password);
  if (!member) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  await createSession(member.serial_number);

  return NextResponse.json({ ok: true });
}
