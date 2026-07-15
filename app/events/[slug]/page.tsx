import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventActions from "@/app/components/EventActions";
import EventMap from "@/app/components/EventMap";
import {
    CATEGORY_LABELS,
    EVENTS,
    eventTone,
    formatEventParts,
    getEvent,
    googleCalendarUrl,
    mapsUrl,
    vancouverToUtc,
} from "@/lib/events";

// The upcoming/past state depends on "now" — refresh at most hourly.
export const revalidate = 3600;

export function generateStaticParams() {
    return EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const event = getEvent(slug);
    if (!event) return { title: "Event not found" };
    return {
        title: event.title,
        description: event.description,
    };
}

export default async function EventPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const event = getEvent(slug);
    if (!event) notFound();

    const d = formatEventParts(event);
    const past = vancouverToUtc(event.end) < new Date();

    return (
        <main className="subpage">
            <section className="section event-detail">
                <Link className="event-back" href="/events">
                    <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M19 12H5" />
                        <path d="m11 18-6-6 6-6" />
                    </svg>
                    All events
                </Link>

                <div className="event-detail-grid">
                    <div
                        className={`event-art event-detail-poster event-tone-${eventTone(event)}`}
                        aria-hidden="true"
                    />

                    <div className="event-detail-info">
                        <div className="event-detail-head">
                            <span className="event-detail-category">
                                {CATEGORY_LABELS[event.category]}
                            </span>
                            <h2>{event.title}</h2>
                        </div>

                        <div className="event-detail-facts">
                            <div className="event-fact">
                            <span
                                className="event-fact-tile event-fact-calendar"
                                aria-hidden="true"
                            >
                                <span>{d.month}</span>
                                <span>{d.day}</span>
                            </span>
                            <span className="event-fact-text">
                                <strong>
                                    {d.weekday}, {d.month} {d.day}, {d.year}
                                </strong>
                                <span>{d.timeRange}</span>
                            </span>
                        </div>

                        <div className="event-fact">
                            <span className="event-fact-tile" aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </span>
                            <span className="event-fact-text">
                                <strong>
                                    <a
                                        href={mapsUrl(event)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {event.location.name}
                                    </a>
                                </strong>
                                <span>{event.location.address}</span>
                            </span>
                            </div>
                        </div>

                        {past ? (
                            <p className="event-ended">
                                This event has ended. Follow us on{" "}
                                <a
                                    href="https://www.instagram.com/ubcthaiaiyara"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram
                                </a>{" "}
                                to hear about the next one.
                            </p>
                        ) : (
                            <EventActions
                                googleUrl={googleCalendarUrl(event)}
                                icsUrl={`/api/events/${event.slug}/ics`}
                                link={event.link}
                            />
                        )}
                    </div>
                </div>

                <details className="event-desc" open>
                    <summary className="event-desc-summary">
                        <span>About this event</span>
                        <svg
                            className="event-desc-chevron"
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </summary>
                    <p className="event-about">{event.description}</p>
                </details>

                <div className="event-map-section">
                    <span className="event-map-label">Location</span>
                    <EventMap
                        name={event.location.name}
                        address={event.location.address}
                        mapsHref={mapsUrl(event)}
                    />
                </div>
            </section>
        </main>
    );
}
