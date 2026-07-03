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

            {/* About */}
            <section id="about" className="section">
                <span className="section-label">01 — About</span>
                <h2>More than a club.</h2>
                <p className="lead">
                    UBC Thai Aiyara brings together Thai students and anyone who
                    loves Thai culture at the University of British Columbia.
                    From socials and food nights to festivals and Roon Pee–Roon
                    Norng mentorship, we&apos;re a community that feels like
                    home away from home.
                </p>
            </section>

            {/* Sponsors */}
            <section id="sponsors" className="section section-alt">
                <span className="section-label">02 — Sponsors</span>
                <h2>Our trusted partners.</h2>
                <div className="sponsor-grid">
                    <div className="sponsor-card">
                        <div className="sponsor-logo">OSO</div>
                        <h3>OSO Hair Salon</h3>
                        <p>Proud supporter of the Aiyara family.</p>
                    </div>
                </div>
            </section>

            {/* Events */}
            <section id="events" className="section">
                <span className="section-label">03 — Events</span>
                <h2>What&apos;s happening.</h2>
                <div className="events-empty">
                    <p>No events at the moment — check back soon!</p>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="section section-alt">
                <span className="section-label">04 — Contact</span>
                <h2>Get in touch.</h2>
                <p className="lead">
                    Questions about membership or want to collaborate? Reach out
                    anytime.
                </p>
                <p className="contact-links">
                    <a href="mailto:contact@ubcthaiaiyara.com">
                        contact@ubcthaiaiyara.com
                    </a>
                    <a href="https://www.instagram.com/ubcthaiaiyara">
                        Instagram
                    </a>
                    <a href="https://www.linkedin.com/company/ubc-thaiaiyara">
                        LinkedIn
                    </a>
                </p>
                <Link className="button" href="/join">
                    Become a member
                </Link>
            </section>
        </>
    );
}
