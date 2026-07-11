"use client";

import { useEffect, useRef } from "react";

export type VoiceQuote = {
    quote: string;
    name: string;
    detail: string;
};

export default function VoiceCarousel({ quotes }: { quotes: VoiceQuote[] }) {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller || quotes.length === 0) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

        let frame = 0;
        let previous = performance.now();
        const speed = 44;

        const tick = (now: number) => {
            const delta = Math.min(now - previous, 32);
            previous = now;

            const midpoint = scroller.scrollWidth / 2;
            scroller.scrollLeft += (speed * delta) / 1000;

            if (scroller.scrollLeft >= midpoint) {
                scroller.scrollLeft -= midpoint;
            }

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [quotes.length]);

    const loopedQuotes = [...quotes, ...quotes];

    return (
        <div
            ref={scrollerRef}
            className="voice-scroll"
            aria-label="Member voices carousel"
        >
            {loopedQuotes.map((q, i) => (
                <figure
                    key={`${q.name}-${i}`}
                    className={`float-card voice-card voice-card-${i % quotes.length}`}
                    aria-hidden={i >= quotes.length}
                >
                    <blockquote>{q.quote}</blockquote>
                    <figcaption>
                        <span className="voice-name">{q.name}</span>
                        <span className="voice-detail">{q.detail}</span>
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}
