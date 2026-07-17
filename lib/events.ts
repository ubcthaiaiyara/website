// Club events shown on /events. Dates are Vancouver local time in
// "YYYY-MM-DDTHH:mm" form; the helpers below handle PST/PDT conversion for
// the calendar links, so entries here never need UTC offsets.
//
// TODO: keep this list current — add new events to the top of EVENTS and
// fill in real posters/links as they're confirmed.

export type EventCategory = "festival" | "social" | "community";

export const CATEGORY_LABELS: Record<EventCategory, string> = {
    festival: "Festivals",
    social: "Socials",
    community: "Community & fairs",
};

export type ClubEvent = {
    slug: string;
    category: EventCategory;
    title: string;
    description: string;
    /** Vancouver local time, e.g. "2026-04-11T13:00". */
    start: string;
    /** Vancouver local time. */
    end: string;
    location: {
        name: string;
        /** Full address handed to calendar apps and the maps link. */
        address: string;
    };
    /** Optional RSVP / info link (Instagram post, ticket page…). */
    link?: string;
};

export const EVENTS: ClubEvent[] = [
    {
        slug: "loy-krathong-2026",
        category: "festival",
        title: "Loy Krathong",
        description:
            "A gentle evening of floating krathong, candlelight, and reflection, celebrating one of the most beautiful traditions in Thailand. Krathong-making supplies provided — just bring yourself.",
        start: "2026-11-24T18:00",
        end: "2026-11-24T21:00",
        location: {
            name: "AMS Student Nest",
            address: "6133 University Blvd, Vancouver, BC V6T 1Z1",
        },
    },
    {
        slug: "welcome-back-social-2026",
        category: "social",
        title: "Welcome Back Social",
        description:
            "Kick off the school year with Thai snacks, games, and new friends. Open to everyone — members, new students, and the Thai-curious alike.",
        start: "2026-09-18T18:30",
        end: "2026-09-18T21:00",
        location: {
            name: "AMS Student Nest",
            address: "6133 University Blvd, Vancouver, BC V6T 1Z1",
        },
    },
    {
        slug: "imagine-day-2026",
        category: "community",
        title: "Imagine Day Clubs Fair",
        description:
            "Find our booth at the UBC clubs fair! Come say hi, learn about the club, and sign up for a membership on the spot.",
        start: "2026-09-08T11:00",
        end: "2026-09-08T15:00",
        location: {
            name: "Main Mall, UBC",
            address: "Main Mall, University of British Columbia, Vancouver, BC",
        },
    },
    {
        slug: "summer-picnic-2026",
        category: "social",
        title: "Summer Picnic",
        description:
            "A laid-back afternoon at the beach with Thai food, frisbee, and good company before the new term starts.",
        start: "2026-08-08T12:00",
        end: "2026-08-08T16:00",
        location: {
            name: "Spanish Banks Beach",
            address: "4801 NW Marine Dr, Vancouver, BC V6R 1B9",
        },
    },
    {
        slug: "songkran-2026",
        category: "festival",
        title: "Songkran",
        description:
            "Our Thai New Year celebration, complete with music, food, and a friendly water fight. One of the biggest events on our calendar and a favourite for new and returning members alike.",
        start: "2026-04-11T13:00",
        end: "2026-04-11T17:00",
        location: {
            name: "MacInnes Field, UBC",
            address: "6133 University Blvd, Vancouver, BC V6T 1Z1",
        },
    },
    {
        slug: "taste-of-sea-2026",
        category: "community",
        title: "Taste of SEA",
        description:
            "A collaboration with other Southeast Asian clubs at UBC that brings together food, performances, and community from across the region.",
        start: "2026-03-14T17:30",
        end: "2026-03-14T21:00",
        location: {
            name: "AMS Student Nest, Great Hall",
            address: "6133 University Blvd, Vancouver, BC V6T 1Z1",
        },
    },
    {
        slug: "loy-krathong-2025",
        category: "festival",
        title: "Loy Krathong",
        description:
            "An evening of floating krathong, candlelight, and reflection by the water — our take on one of Thailand's most beautiful traditions.",
        start: "2025-11-05T18:00",
        end: "2025-11-05T21:00",
        location: {
            name: "AMS Student Nest",
            address: "6133 University Blvd, Vancouver, BC V6T 1Z1",
        },
    },
    {
        slug: "welcome-night-2025",
        category: "social",
        title: "Welcome Night",
        description:
            "Our first social of the year: Thai snacks, icebreakers, and a chance to meet the exec team and fellow members.",
        start: "2025-09-12T18:30",
        end: "2025-09-12T21:00",
        location: {
            name: "AMS Student Nest",
            address: "6133 University Blvd, Vancouver, BC V6T 1Z1",
        },
    },
];

const TZ = "America/Vancouver";

/** Convert a Vancouver local time string ("YYYY-MM-DDTHH:mm") to a UTC Date,
 * accounting for PST/PDT. Two-pass: guess the offset from an initial UTC
 * reading, then re-check it against the corrected instant so times near a
 * DST switch land right. */
export function vancouverToUtc(local: string): Date {
    let utc = new Date(`${local}:00Z`);
    for (let i = 0; i < 2; i++) {
        const offset = tzOffsetMs(utc);
        utc = new Date(new Date(`${local}:00Z`).getTime() - offset);
    }
    return utc;
}

/** Milliseconds that TZ is ahead of UTC at the given instant (negative for
 * Vancouver). */
function tzOffsetMs(at: Date): number {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).formatToParts(at);
    const get = (type: string) =>
        Number(parts.find((p) => p.type === type)?.value ?? 0);
    const asUtc = Date.UTC(
        get("year"),
        get("month") - 1,
        get("day"),
        get("hour") % 24,
        get("minute"),
        get("second"),
    );
    return asUtc - at.getTime();
}

export function getEvent(slug: string): ClubEvent | undefined {
    return EVENTS.find((e) => e.slug === slug);
}

/** Stable brand-tone index (0–3) so an event keeps the same accent art on
 * the list card and its detail page. */
export function eventTone(event: ClubEvent): number {
    const i = EVENTS.findIndex((e) => e.slug === event.slug);
    return (i < 0 ? 0 : i) % 4;
}

/** Display strings for an event's Vancouver wall-clock times. The data file
 * stores local times, so the naive Dates format correctly on any host. */
export function formatEventParts(event: ClubEvent) {
    const start = new Date(`${event.start}:00`);
    const end = new Date(`${event.end}:00`);
    const time = (d: Date) =>
        d
            .toLocaleTimeString("en-CA", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            .replace(/\s?([ap])\.?m\.?/i, " $1m");
    return {
        month: start.toLocaleDateString("en-CA", { month: "short" }),
        day: start.toLocaleDateString("en-CA", { day: "numeric" }),
        year: start.toLocaleDateString("en-CA", { year: "numeric" }),
        weekday: start.toLocaleDateString("en-CA", { weekday: "long" }),
        weekdayShort: start.toLocaleDateString("en-CA", { weekday: "short" }),
        timeRange: `${time(start)} – ${time(end)}`,
    };
}

/** Events that haven't ended yet, soonest first. */
export function upcomingEvents(now = new Date()): ClubEvent[] {
    return EVENTS.filter((e) => vancouverToUtc(e.end) >= now).sort(
        (a, b) => a.start.localeCompare(b.start),
    );
}

/** Events that have ended, most recent first. */
export function pastEvents(now = new Date()): ClubEvent[] {
    return EVENTS.filter((e) => vancouverToUtc(e.end) < now).sort(
        (a, b) => b.start.localeCompare(a.start),
    );
}

/** "20260411T130000" — floating local time used by both calendar formats. */
function compactLocal(local: string): string {
    return `${local.replace(/[-:]/g, "")}00`;
}

export function googleCalendarUrl(event: ClubEvent): string {
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: `${event.title} — UBC Thai Aiyara`,
        dates: `${compactLocal(event.start)}/${compactLocal(event.end)}`,
        ctz: TZ,
        details: event.description,
        location: `${event.location.name}, ${event.location.address}`,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
}

// Apple Maps deep link for the venue. `q` is the pin label (venue name) and
// `address` is geocoded to the actual location, so it opens on the real spot
// rather than a plain text search.
export function mapsUrl(event: ClubEvent): string {
    const params = new URLSearchParams({
        q: event.location.name,
        address: event.location.address,
    });
    return `https://maps.apple.com/?${params}`;
}

/** RFC 5545 text escaping for ICS property values. */
function icsEscape(text: string): string {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r?\n/g, "\\n");
}

/** Fold ICS content lines at 75 octets per RFC 5545. */
function icsFold(line: string): string {
    const out: string[] = [];
    let rest = line;
    while (rest.length > 74) {
        out.push(rest.slice(0, 74));
        rest = ` ${rest.slice(74)}`;
    }
    out.push(rest);
    return out.join("\r\n");
}

/** Build a downloadable .ics for the event (Apple Calendar and friends).
 * Uses local times with a VTIMEZONE so the event stays correct across DST. */
export function buildIcs(event: ClubEvent): string {
    const stamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//UBC Thai Aiyara//Events//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VTIMEZONE",
        `TZID:${TZ}`,
        "BEGIN:DAYLIGHT",
        "TZOFFSETFROM:-0800",
        "TZOFFSETTO:-0700",
        "TZNAME:PDT",
        "DTSTART:19700308T020000",
        "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
        "END:DAYLIGHT",
        "BEGIN:STANDARD",
        "TZOFFSETFROM:-0700",
        "TZOFFSETTO:-0800",
        "TZNAME:PST",
        "DTSTART:19701101T020000",
        "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        `UID:${event.slug}@ubcthaiaiyara.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART;TZID=${TZ}:${compactLocal(event.start)}`,
        `DTEND;TZID=${TZ}:${compactLocal(event.end)}`,
        `SUMMARY:${icsEscape(`${event.title} — UBC Thai Aiyara`)}`,
        `DESCRIPTION:${icsEscape(event.description)}`,
        `LOCATION:${icsEscape(`${event.location.name}, ${event.location.address}`)}`,
        ...(event.link ? [`URL:${icsEscape(event.link)}`] : []),
        "END:VEVENT",
        "END:VCALENDAR",
    ];
    return lines.map(icsFold).join("\r\n") + "\r\n";
}
