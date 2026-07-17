import { NextResponse } from "next/server";
import { buildIcs, getEvent } from "@/lib/events";

// GET /api/events/[slug]/ics
// Serves a downloadable .ics file so the event can be added to Apple
// Calendar (or any other calendar app that speaks iCalendar).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return new NextResponse(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
