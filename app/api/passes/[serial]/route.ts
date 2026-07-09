import { NextResponse } from "next/server";
import { getMemberByUserId } from "@/lib/members";
import { generatePass } from "@/lib/applePass";
import { readSession } from "@/lib/session";

// GET /api/passes/<serial>
// Looks up the member and streams a signed Apple Wallet pass on demand. The
// pass is not stored — it is generated per request from the member record.
//
// Auth-gated: the caller must be signed in AS this member. A logged-in member
// can only download their own pass, never someone else's by guessing a serial.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ serial: string }> }
) {
  const { serial } = await params;

  const userId = await readSession();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const member = await getMemberByUserId(userId);
  if (!member || member.serial_number !== serial) {
    return NextResponse.json(
      { error: "You can only download your own pass." },
      { status: 403 }
    );
  }

  const pkpass = await generatePass(member);

  return new NextResponse(pkpass as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": `attachment; filename="aiyara-${member.serial_number}.pkpass"`,
    },
  });
}
