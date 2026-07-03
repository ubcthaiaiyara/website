import Link from "next/link";

// Server Component. Static landing page — an editorial redesign of the club's
// site (hero, president quote, about, sponsors, events, contact). All CTAs
// route into the membership module (/join, /login).
export default function HomePage() {
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
                            <Link className="button" href="/join">
                                Join us
                            </Link>
                            <Link
                                className="button button-ghost"
                                href="/login"
                            >
                                Member login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="section quote-section">
                <blockquote className="quote">
                    <p>
                        “With my Roon Pees, Roon Norngs and friends there for
                        me, I feel right at home. Aiyara is more than a club —
                        it&apos;s a family.”
                    </p>
                    <cite>— Minnie Tanglertsampan, President 2021–2022</cite>
                </blockquote>
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
