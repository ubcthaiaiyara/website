"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
    CATEGORY_LABELS,
    eventTone,
    formatEventParts,
    type ClubEvent,
    type EventCategory,
} from "@/lib/events";

type When = "all" | "upcoming" | "past";
type Type = "all" | EventCategory;

const WHEN_OPTIONS: { value: When; label: string }[] = [
    { value: "all", label: "All events" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
];

const TYPE_OPTIONS: { value: Type; label: string }[] = [
    { value: "all", label: "All types" },
    ...(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((c) => ({
        value: c as Type,
        label: CATEGORY_LABELS[c],
    })),
];

// Cards shown before the "See more" button reveals the rest.
const PAGE_SIZE = 5;

// Destination-Vancouver-style poster row holding just the essentials: a
// brand-tone panel with the big date, title, and venue over a gradient art
// backdrop. The whole card links to the event's page, where the description
// and calendar actions live.
function EventCard({
    event,
    past,
    revealDelay,
}: {
    event: ClubEvent;
    past?: boolean;
    // When set (ms), the card fades/slides in — used for cards revealed by the
    // "See more" button so only the newly shown ones animate.
    revealDelay?: number;
}) {
    const d = formatEventParts(event);
    const tone = eventTone(event);
    return (
        <Link
            href={`/events/${event.slug}`}
            className={`event-tile${past ? " event-tile-past" : ""}${
                revealDelay !== undefined ? " event-tile-reveal" : ""
            }`}
            style={
                revealDelay !== undefined
                    ? { animationDelay: `${revealDelay}ms` }
                    : undefined
            }
        >
            <span
                className={`event-tile-art event-tone-${tone}`}
                aria-hidden="true"
            />
            <span className={`event-tile-panel event-panel-${tone}`}>
                <span className="event-tile-title">{event.title}</span>
                <span className="event-tile-date">
                    <span className="event-tile-day">{d.day}</span>
                    <span className="event-tile-monthyear">
                        <span>{d.month}</span>
                        <span>{d.year}</span>
                    </span>
                    <span className="event-tile-time">
                        {d.weekday}
                        <br />
                        {d.timeRange}
                    </span>
                </span>
                <span className="event-tile-foot">
                    <span className="event-tile-where">
                        <svg
                            viewBox="0 0 24 24"
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {event.location.name}
                    </span>
                    <span className="event-tile-cta">
                        Get details
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
                            <path d="M5 12h14" />
                            <path d="m13 6 6 6-6 6" />
                        </svg>
                    </span>
                </span>
            </span>
        </Link>
    );
}

function FilterGroup<T extends string>({
    label,
    options,
    value,
    counts,
    onChange,
}: {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    counts: Record<T, number>;
    onChange: (value: T) => void;
}) {
    const groupRef = useRef<HTMLDivElement>(null);
    const [indicator, setIndicator] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
    } | null>(null);
    const enteredRef = useRef(false);
    const rafRef = useRef<number | undefined>(undefined);

    // The active highlight is one shared element that slides between options;
    // measure the active button so the indicator can follow it (and track
    // reflows, since the options wrap into rows on small screens).
    const measure = useCallback(() => {
        const active = groupRef.current?.querySelector<HTMLButtonElement>(
            "button.is-active",
        );
        if (!active) return;
        const full = {
            top: active.offsetTop,
            left: active.offsetLeft,
            width: active.offsetWidth,
            height: active.offsetHeight,
        };
        if (enteredRef.current) {
            setIndicator(full);
            return;
        }
        // First appearance (page load): render the pill collapsed at the active
        // option's edge, then expand it to full width on the next frame so it
        // wipes in left-to-right via the CSS transition.
        setIndicator({ ...full, width: 0 });
        rafRef.current = requestAnimationFrame(() => {
            enteredRef.current = true;
            setIndicator(full);
        });
    }, []);

    useLayoutEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("resize", measure);
            if (rafRef.current !== undefined) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [measure, value]);

    return (
        <fieldset className="event-filter-group">
            <legend className="rail-legend">{label}</legend>
            {/* Positioning context for the indicator lives on a plain div:
                absolute children of a <fieldset> are laid out from below the
                legend while offsetTop measures from above it, which would
                shift the indicator down by one row. */}
            <div ref={groupRef} className="event-filter-options">
                {indicator && (
                    <span
                        className="event-filter-indicator"
                        aria-hidden="true"
                        style={{
                            transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                            width: indicator.width,
                            height: indicator.height,
                        }}
                    />
                )}
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`event-filter-option${
                            value === option.value ? " is-active" : ""
                        }`}
                        aria-pressed={value === option.value}
                        onClick={() => onChange(option.value)}
                    >
                        <span>{option.label}</span>
                        <span className="event-filter-count">
                            {counts[option.value]}
                        </span>
                    </button>
                ))}
            </div>
        </fieldset>
    );
}

// Two-column browser: filters on the left, the event list on the right.
// The server page splits events into upcoming/past (so "now" is decided at
// revalidation time, not in the visitor's browser).
export default function EventsBrowser({
    upcoming,
    past,
}: {
    upcoming: ClubEvent[];
    past: ClubEvent[];
}) {
    const [when, setWhen] = useState<When>("all");
    const [type, setType] = useState<Type>("all");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Changing a filter collapses the list back to the first page.
    const changeWhen = (value: When) => {
        setWhen(value);
        setVisibleCount(PAGE_SIZE);
    };
    const changeType = (value: Type) => {
        setType(value);
        setVisibleCount(PAGE_SIZE);
    };

    const byType = (list: ClubEvent[]) =>
        type === "all" ? list : list.filter((e) => e.category === type);
    const byWhen = (list: ClubEvent[], w: When) =>
        w === "all"
            ? list
            : w === "upcoming"
              ? list.filter((e) => upcoming.includes(e))
              : list.filter((e) => past.includes(e));

    const all = [...upcoming, ...past];
    const whenCounts = Object.fromEntries(
        WHEN_OPTIONS.map((o) => [o.value, byType(byWhen(all, o.value)).length]),
    ) as Record<When, number>;
    const typeCounts = Object.fromEntries(
        TYPE_OPTIONS.map((o) => [
            o.value,
            byWhen(all, when).filter(
                (e) => o.value === "all" || e.category === o.value,
            ).length,
        ]),
    ) as Record<Type, number>;

    const shownUpcoming = when === "past" ? [] : byType(upcoming);
    const shownPast = when === "upcoming" ? [] : byType(past);
    const combined = [
        ...shownUpcoming.map((event) => ({ event, past: false })),
        ...shownPast.map((event) => ({ event, past: true })),
    ];
    const nothing = combined.length === 0;
    const visible = combined.slice(0, visibleCount);
    const remaining = combined.length - visible.length;

    return (
        <div className="events-layout">
            <aside className="events-filters" aria-label="Filter events">
                <FilterGroup
                    label="When"
                    options={WHEN_OPTIONS}
                    value={when}
                    counts={whenCounts}
                    onChange={changeWhen}
                />
                <FilterGroup
                    label="Type"
                    options={TYPE_OPTIONS}
                    value={type}
                    counts={typeCounts}
                    onChange={changeType}
                />
            </aside>

            <div className="events-results">
                {!nothing && (
                    <>
                        <div className="event-list">
                            {visible.map(({ event, past: isPast }, i) => (
                                <EventCard
                                    key={event.slug}
                                    event={event}
                                    past={isPast}
                                    revealDelay={
                                        i >= PAGE_SIZE
                                            ? (i - PAGE_SIZE) * 60
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                        {remaining > 0 && (
                            <button
                                type="button"
                                className="event-more"
                                onClick={() => setVisibleCount(combined.length)}
                            >
                                See more
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                        )}
                    </>
                )}
                {nothing && (
                    <p className="event-list-empty">
                        Nothing matches those filters right now — try widening
                        them, or follow us on Instagram to hear about the next
                        event first.
                    </p>
                )}
            </div>
        </div>
    );
}
