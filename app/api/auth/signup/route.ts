import { NextResponse } from "next/server";
import { createMember, DuplicateEmailError } from "@/lib/members";
import { createSession } from "@/lib/session";

// POST /api/auth/signup
// Validates the body, creates a member (with a hashed password), signs the
// caller in, and returns { ok, serial }. Replaces the old /api/passes/issue:
// this is now the single member-creation path.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, password } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  let member;
  try {
    member = await createMember(name.trim(), email.trim(), password);
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }
    throw err;
  }

  await createSession(member.serial_number);

  return NextResponse.json({ ok: true, serial: member.serial_number });
}
