import { NextResponse } from "next/server";
import { createMember } from "@/lib/members";

// POST /api/passes/issue
// Validates the body, creates a member, and returns the URL where the pass can
// be downloaded. lib/members is imported here (server-side) only.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { name, email } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
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

  const member = await createMember(name.trim(), email.trim());

  return NextResponse.json({
    downloadUrl: `/api/passes/${member.serial_number}`,
  });
}
