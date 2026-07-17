"use client";

import { useEffect, useRef, useState } from "react";

// Action row for an upcoming event's detail page: a calendar dropdown plus
// wallet / QR / details buttons.
export default function EventActions({
    googleUrl,
    icsUrl,
    link,
}: {
    googleUrl: string;
    icsUrl: string;
    link?: string;
}) {
    const [calOpen, setCalOpen] = useState(false);
    const calRef = useRef<HTMLDivElement>(null);

    // Close the calendar menu on outside click or Escape.
    useEffect(() => {
        if (!calOpen) return;
        const onDown = (e: MouseEvent) => {
            if (calRef.current && !calRef.current.contains(e.target as Node)) {
                setCalOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setCalOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [calOpen]);

    return (
        <div className="event-detail-actions">
            <div
                className={`event-cal-dropdown${calOpen ? " is-open" : ""}`}
                ref={calRef}
            >
                <button
                    type="button"
                    className="button button-sm event-cal-trigger"
                    aria-haspopup="menu"
                    aria-expanded={calOpen}
                    onClick={() => setCalOpen((o) => !o)}
                >
                    Add to calendar
                    <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
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
                {calOpen && (
                    <div className="event-cal-menu" role="menu">
                        <a
                            role="menuitem"
                            href={googleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setCalOpen(false)}
                        >
                            Google Calendar
                        </a>
                        <a
                            role="menuitem"
                            href={icsUrl}
                            onClick={() => setCalOpen(false)}
                        >
                            Apple Calendar
                        </a>
                    </div>
                )}
            </div>

            {/* TODO: wire up Apple Wallet pass generation for the event. */}
            <button type="button" className="button button-ghost button-sm">
                <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M3 10h18" />
                </svg>
                Add to Wallet
            </button>

            {/* TODO: show a scannable QR code (check-in / event link). */}
            <button type="button" className="button button-ghost button-sm">
                <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3M21 14v.01M14 21h.01M21 21v-3M17 21h.01" />
                </svg>
                Show QR code
            </button>

            {link && (
                <a
                    className="button button-ghost button-sm"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Event details
                </a>
            )}
        </div>
    );
}
