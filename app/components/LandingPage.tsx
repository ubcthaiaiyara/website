import type { CSSProperties } from "react";
import Link from "next/link";
import { readSession } from "@/lib/session";
import AuthEntryLink from "./AuthEntryLink";
import Fireflies from "./Fireflies";
import {
    StorySection,
    WhatWeDoSection,
    HighlightSection,
    BentoSection,
    VoicesSection,
    FaqSection,
} from "./LandingSections";

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
    { x: 40, y: 60, s: 4, dx: -18, dy: -20, dur: 11, delay: 1.9 },
    { x: 52, y: 55, s: 4, dx: 22, dy: -20, dur: 9, delay: 3.2 },
    { x: 62, y: 62, s: 3, dx: 18, dy: 18, dur: 9.5, delay: 3.5 },
    { x: 74, y: 56, s: 3, dx: -20, dy: -16, dur: 10.5, delay: 0.7 },
    { x: 90, y: 58, s: 4, dx: 16, dy: 22, dur: 12, delay: 2.1 },
    { x: 10, y: 62, s: 3, dx: 20, dy: -18, dur: 10, delay: 2.8 },
    { x: 31, y: 50, s: 4, dx: -18, dy: 20, dur: 11.5, delay: 1.2 },
];

export default async function LandingPage() {
    const signedIn = Boolean(await readSession());

    return (
        <>
            <Fireflies className="page-fireflies" />
            <section className="hero">
                <div className="fireflies" aria-hidden="true">
                    {FIREFLIES.map((firefly, index) => (
                        <span
                            key={index}
                            className="firefly"
                            style={
                                {
                                    left: `${firefly.x}%`,
                                    top: `${firefly.y}%`,
                                    width: `${firefly.s}px`,
                                    height: `${firefly.s}px`,
                                    "--dx": `${firefly.dx}px`,
                                    "--dy": `${firefly.dy}px`,
                                    "--dur": `${firefly.dur}s`,
                                    "--delay": `${firefly.delay}s`,
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
                                    <AuthEntryLink className="button" href="/join">
                                        Join us
                                    </AuthEntryLink>
                                    <AuthEntryLink className="button button-ghost" href="/login">
                                        Member login
                                    </AuthEntryLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <StorySection />
            <WhatWeDoSection />
            <VoicesSection />
            <BentoSection />
            <HighlightSection />
            <FaqSection />
        </>
    );
}
