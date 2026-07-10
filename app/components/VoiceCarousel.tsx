"use client";

import { type CSSProperties, useEffect, useRef } from "react";

export type VoiceQuote = {
    quote: string;
    name: string;
    detail: string;
};

const cardRotations = [0];

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

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        let activeCard: HTMLElement | null = null;
        let pointer: { x: number; y: number } | null = null;

        const clearActiveCard = () => {
            activeCard?.classList.remove("is-hovered");
            activeCard = null;
        };

        const setActiveCard = () => {
            if (!pointer) {
                clearActiveCard();
                return;
            }

            // Rotated cards can visually overlap. Resolve the card from the
            // topmost element at the pointer so only that card gets the tilt.
            const element = document.elementFromPoint(pointer.x, pointer.y);
            const card = element?.closest<HTMLElement>(".voice-card");

            if (!card || !scroller.contains(card)) {
                clearActiveCard();
                return;
            }

            if (card === activeCard) return;

            clearActiveCard();
            card.classList.add("is-hovered");
            activeCard = card;
        };

        const handlePointerMove = (event: PointerEvent) => {
            pointer = { x: event.clientX, y: event.clientY };
            setActiveCard();
        };

        const handlePointerLeave = () => {
            pointer = null;
            clearActiveCard();
        };

        scroller.addEventListener("pointermove", handlePointerMove);
        scroller.addEventListener("pointerleave", handlePointerLeave);
        scroller.addEventListener("scroll", setActiveCard, { passive: true });

        return () => {
            scroller.removeEventListener("pointermove", handlePointerMove);
            scroller.removeEventListener("pointerleave", handlePointerLeave);
            scroller.removeEventListener("scroll", setActiveCard);
            clearActiveCard();
        };
    }, []);

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
                    className="float-card voice-card"
                    style={
                        {
                            "--card-rotate": `${cardRotations[i % cardRotations.length]}deg`,
                        } as CSSProperties
                    }
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
