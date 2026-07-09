import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { getMemberByUserId, updateMemberProfile } from "@/lib/members";

// PATCH /api/account
// Updates the signed-in member's editable personal details.
export async function PATCH(request: Request) {
  const userId = await readSession();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { firstName, lastName, faculty, program, year } = (body ?? {}) as Record<
    string,
    unknown
  >;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (str(firstName) === "") {
    return NextResponse.json(
      { error: "First name is required." },
      { status: 400 }
    );
  }

  const member = await getMemberByUserId(userId);
  if (!member) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const name = [str(firstName), str(lastName)].filter(Boolean).join(" ");

  const updated = await updateMemberProfile(member.serial_number, {
    name,
    faculty: str(faculty),
    program: str(program),
    year: str(year),
  });

  if (!updated) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    member: {
      name: updated.name,
      faculty: updated.faculty ?? "",
      program: updated.program ?? "",
      year: updated.year ?? "",
    },
  });
}
