import Link from "next/link";

// Server Component. Static landing page — a modern redesign of the club's Wix
// site (hero, president quote, sponsors, events, contact). All CTAs route into
// the membership module (/join, /login).
export default function HomePage() {
    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="hero-inner">
                    <p className="eyebrow">UBC Thai Aiyara</p>
                    <h1>
                        Welcome to the
                        <br />
                        Aiyara Family
                    </h1>
                    <p className="hero-sub">
                        The home for Thai students and friends at UBC. Join the
                        family and carry your digital membership pass in Apple
                        Wallet.
                    </p>
                    <div className="hero-cta">
                        <Link className="button" href="/join">
                            Join Now
                        </Link>
                        <Link className="button button-ghost" href="/login">
                            Member Login
                        </Link>
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
                <h2>About Aiyara</h2>
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
                <h2>Our Sponsors</h2>
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
                <h2>Events</h2>
                <div className="events-empty">
                    <p>No events at the moment — check back soon!</p>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="section section-alt">
                <h2>Get in Touch</h2>
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
                    <a href="https://www.facebook.com/ubcthaiaiyara">
                        Facebook
                    </a>
                </p>
                <Link className="button" href="/join">
                    Become a member
                </Link>
            </section>
        </>
    );
}
