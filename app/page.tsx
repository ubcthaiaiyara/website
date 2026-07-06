import Link from "next/link";
import { readSession } from "@/lib/session";

// Server Component. Editorial landing page (hero, events, …). The hero CTAs
// route into the membership module. For a signed-in member the Join / Login
// split is meaningless, so it collapses to a single "View my membership" CTA
// that mirrors the header's "My Account" — matching /login and /join, which
// already send signed-in users to the dashboard.
export default async function HomePage() {
    const signedIn = Boolean(await readSession());

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-top">
                        <h1>A home away from home for Thai students &amp; friends at UBC.</h1>
                    </div>
                    <div className="hero-bottom">
                        <p className="hero-sub">
                            Join the family and carry your digital membership
                            pass in Apple Wallet.
                        </p>
                        <div className="hero-cta">
                            {signedIn ? (
                                <Link className="button" href="/dashboard">
                                    View my membership
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

            {/* Events */}
            <section id="events" className="section">
                <span className="section-label">Events</span>
                <h2>What&apos;s happening.</h2>
                <div className="events-empty">
                    <p>No events at the moment — check back soon!</p>
                </div>
            </section>
        </>
    );
}
