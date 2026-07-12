"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Reveal-on-scroll wrapper. Children start slightly lowered + faded, then rise
// into place the first time the block enters the viewport (IntersectionObserver,
// fired once). Motion is intentionally subtle to match the site's restrained
// feel, and is skipped entirely when the visitor prefers reduced motion — the
// content just renders in place, fully visible.
export default function FloatingSection({
    children,
    className = "",
    as: Tag = "section",
    id,
}: {
    children: ReactNode;
    className?: string;
    // Allow the caller to pick the semantic element (section, div, …).
    as?: "section" | "div" | "article";
    id?: string;
}) {
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Respect reduced-motion: show immediately, don't animate or observe.
        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reduce) {
            const frame = window.requestAnimationFrame(() => setVisible(true));
            return () => window.cancelAnimationFrame(frame);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                }
            },
            // Trigger a little before the block is fully on screen.
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
            id={id}
            className={`reveal${visible ? " is-visible" : ""} ${className}`.trim()}
        >
            {children}
        </Tag>
    );
}
