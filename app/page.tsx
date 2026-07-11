import type { CSSProperties } from "react";
import Link from "next/link";
import { readSession } from "@/lib/session";
import Fireflies from "./components/Fireflies";
import {
    StorySection,
    WhatWeDoSection,
    HighlightSection,
    BentoSection,
    VoicesSection,
    FaqSection,
} from "./components/LandingSections";

// Fireflies drifting over the dark upper sky of the hero. Fixed (deterministic)
// values so the server-rendered markup is stable — no hydration mismatch.
// x/y are % positions, s is size (px), dx/dy the drift vector (px), dur the
// float period (s), delay the animation offset (s).
const FIREFLIES = [
    { x: 8, y: 14, s: 4, dx: 24, dy: -18, dur: 9, delay: 0 },
    { x: 18, y: 30, s: 3, dx: -20, dy: -24, dur: 11, delay: 1.5 },
    { x: 26, y: 10, s: 5, dx: 18, dy: 22, dur: 8, delay: 0.8 },
    { x: 34, y: 41, s: 3, dx: -16, dy: -20, dur: 12, delay: 2.2 },
    { x: 42, y: 20, s: 4, dx: 22, dy: 16, dur: 10, delay: 0.4 },
    { x: 50, y: 8, s: 3, dx: -24, dy: 20, dur: 9.5, delay: 1.1 },
    { x: 57, y: 33, s: 5, dx: 20, dy: -22, dur: 8.5, delay: 2.6 },
    { x: 64, y: 16, s: 3, dx: -18, dy: 18, dur: 11.5, delay: 0.2 },
    { x: 71, y: 38, s: 4, dx: 16, dy: -16, dur: 10.5, delay: 1.8 },
    { x: 78, y: 12, s: 3, dx: -22, dy: -18, dur: 9, delay: 0.9 },
    { x: 85, y: 28, s: 5, dx: 18, dy: 24, dur: 12, delay: 2.4 },
    { x: 92, y: 18, s: 3, dx: -20, dy: 16, dur: 8, delay: 1.3 },
    { x: 14, y: 44, s: 4, dx: 22, dy: -20, dur: 11, delay: 3 },
    { x: 46, y: 45, s: 3, dx: -18, dy: -22, dur: 10, delay: 0.6 },
    { x: 68, y: 46, s: 4, dx: 20, dy: 18, dur: 9.5, delay: 2 },
    { x: 88, y: 42, s: 3, dx: -16, dy: -18, dur: 12, delay: 1.6 },
    { x: 20, y: 52, s: 3, dx: 20, dy: -22, dur: 10, delay: 0.5 },
    { x: 40, y: 60, s: 4, dx: -16, dy: -20, dur: 11, delay: 1.9 },
    { x: 52, y: 55, s: 4, dx: 22, dy: -20, dur: 9, delay: 3.2 },
    { x: 62, y: 62, s: 3, dx: 18, dy: 18, dur: 9.5, delay: 3.5 },
    { x: 74, y: 56, s: 3, dx: -20, dy: -16, dur: 10.5, delay: 0.7 },
    { x: 90, y: 58, s: 4, dx: 16, dy: 22, dur: 12, delay: 2.1 },
    { x: 10, y: 62, s: 3, dx: 20, dy: -18, dur: 10, delay: 2.8 },
    { x: 31, y: 50, s: 4, dx: -18, dy: 20, dur: 11.5, delay: 1.2 },
];

// Server Component. Editorial landing page (hero, events, …). The hero CTAs
// route into the membership module. For a signed-in member the Join / Login
// split is meaningless, so it collapses to a single "View my account" CTA
// that mirrors the header's account button — matching /login and /join, which
// already send signed-in users to the dashboard.
export default async function HomePage() {
    const signedIn = Boolean(await readSession());

    return (
        <>
            {/* Page-wide firefly field, behind all content — twinkles over the
                dark bands (hero, the lower sunset) and washes out over cream. */}
            <Fireflies className="page-fireflies" />

            {/* Hero */}
            <section className="hero">
                <div className="fireflies" aria-hidden="true">
                    {FIREFLIES.map((f, i) => (
                        <span
                            key={i}
                            className="firefly"
                            style={
                                {
                                    left: `${f.x}%`,
                                    top: `${f.y}%`,
                                    width: `${f.s}px`,
                                    height: `${f.s}px`,
                                    "--dx": `${f.dx}px`,
                                    "--dy": `${f.dy}px`,
                                    "--dur": `${f.dur}s`,
                                    "--delay": `${f.delay}s`,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>
                <div className="hero-inner">
                    <div className="hero-top">
                        <h1>A home away from home for Thai students &amp; friends at UBC.</h1>
                    </div>
                    <div className="hero-bottom">
                        <p className="hero-sub">
                            Whether you&apos;re Thai or simply love the culture,
                            you belong here.
                        </p>
                        <div className="hero-cta">
                            {signedIn ? (
                                <Link className="button" href="/dashboard">
                                    View my account
                                </Link>
                            ) : (
                                <>
                                    <Link className="button" href="/join">
                                        Join us
                                    </Link>
                                    <Link
                                        className="button button-ghost"
                                        href="/login"
                                    >
                                        Member login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial content sections (placeholder copy — see
                components/LandingSections.tsx). Each floats in on scroll. */}
            <StorySection />
            <WhatWeDoSection />
            <VoicesSection />
            <BentoSection />
            <HighlightSection />
            <FaqSection />
        </>
    );
}
