import type { Metadata } from "next";
import SponsorshipBook from "../components/SponsorshipBook";

export const metadata: Metadata = {
    title: "Sponsors",
    description:
        "Partner with UBC Thai Aiyara to reach an engaged student community and support Thai culture at UBC.",
};

const tiers = [
    {
        name: "Diamond",
        desc: "Our headline partnership, with top billing, a dedicated social feature, and a booth at our signature festivals.",
    },
    {
        name: "Gold",
        desc: "Strong visibility at our major festivals, across social media, and on our website throughout the year.",
    },
    {
        name: "Silver",
        desc: "A meaningful way to reach our community through event recognition, social mentions, and a website feature.",
    },
];

type Partner = {
    id: string;
    name: string;
    logo?: string;
};

const partnerTiers: { name: string; partners: Partner[] }[] = [
    {
        name: "Diamond",
        partners: [
            {
                id: "diamond-1",
                name: "Diamond sponsor",
            },
        ],
    },
    {
        name: "Gold",
        partners: [
            {
                id: "gold-1",
                name: "Gold sponsor",
            },
            {
                id: "gold-2",
                name: "Gold sponsor",
            },
        ],
    },
    {
        name: "Silver",
        partners: [
            {
                id: "silver-1",
                name: "Silver sponsor",
            },
            {
                id: "silver-2",
                name: "Silver sponsor",
            },
            {
                id: "silver-3",
                name: "Silver sponsor",
            },
        ],
    },
];

const reasons = [
    {
        number: "1",
        title: "Meet an engaged campus community",
        description:
            "Connect with a large, diverse group of UBC students who show up for culture, friendship, and new experiences.",
    },
    {
        number: "2",
        title: "Show up where it matters",
        description:
            "Put your brand at the centre of our festivals, socials, and the moments our members remember together.",
    },
    {
        number: "3",
        title: "Keep the conversation going",
        description:
            "Grow your presence through our website, social channels, and thoughtfully designed event materials.",
    },
    {
        number: "4",
        title: "Invest in a living culture",
        description:
            "Help a student community that has felt like home for more than a decade share Thai culture at UBC.",
    },
];

export default function SponsorsPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Sponsors</span>
                <h2>Partner with us.</h2>
                <div className="sponsor-package-layout">
                    <div className="insight-panel sponsor-package-panel">
                        <div className="insight-left">
                            <p className="insight-copy sponsor-package-copy">
                                UBC Thai Aiyara is a student run cultural club,
                                and our partners help us host the events that
                                bring the community together. Sponsoring us puts
                                your brand in front of an engaged student
                                audience while supporting Thai culture at UBC.
                            </p>
                            <div className="sponsor-stats">
                                <div className="sponsor-stat">
                                    <span className="sponsor-stat-value">
                                        10+
                                    </span>
                                    <span className="sponsor-stat-label">
                                        Years running
                                    </span>
                                </div>
                                <div className="sponsor-stat">
                                    <span className="sponsor-stat-value">
                                        150+
                                    </span>
                                    <span className="sponsor-stat-label">
                                        Active members
                                    </span>
                                </div>
                                <div className="sponsor-stat">
                                    <span className="sponsor-stat-value">
                                        20+
                                    </span>
                                    <span className="sponsor-stat-label">
                                        Events a year
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="insight-visual sponsor-package-visual">
                        {/* Replace this link once the final sponsorship PDF is
                            added to public/. */}
                        <div className="sponsor-package-stage">
                            <SponsorshipBook />
                            <a
                                className="button button-sm sponsor-package-download"
                                href="/sponsorship-package.pdf"
                                download
                            >
                                Download the package
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 4v11" />
                                    <path d="M7 12l5 5 5-5" />
                                    <path d="M5 20h14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <section className="sponsor-why win-section">
                    <span className="section-label">Why sponsor us</span>
                    <h2>Be part of the moments that bring us together.</h2>
                    <p className="sponsor-section-intro">
                        A partnership with Aiyara is a chance to build genuine
                        connections with students while making space for Thai
                        culture to thrive at UBC.
                    </p>
                    <div className="win-grid sponsor-reason-grid">
                        {reasons.map((reason) => (
                            <article key={reason.number} className="win-card">
                                <div className="win-visual sponsor-reason-visual">
                                    <span>{reason.number}</span>
                                </div>
                                <div className="win-body">
                                    <h3>{reason.title}</h3>
                                    <p>{reason.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="sponsor-tiers">
                    <div className="sponsor-section-heading">
                        <span className="section-label">Sponsorship tiers</span>
                        <h2>A partnership that fits your goals.</h2>
                        <p>
                            Choose a starting point, or let&apos;s shape a
                            custom package around the impact you want to make.
                        </p>
                    </div>
                    <div className="float-grid sponsor-tier-grid">
                        {tiers.map((tier) => (
                            <article key={tier.name} className="sponsor-tier-card">
                                <h3>{tier.name}</h3>
                                <p>{tier.desc}</p>
                                <a
                                    className="tier-more"
                                    href="mailto:contact@ubcthaiaiyara.com"
                                >
                                    Explore this tier
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M7 17 17 7" />
                                        <path d="M8 7h9v9" />
                                    </svg>
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="sponsor-partners">
                    <div className="sponsor-section-heading">
                        <span className="section-label">Current partners</span>
                        <h2>Good company, shared values.</h2>
                        <p>
                            We are grateful to the local businesses that help
                            make our community possible.
                        </p>
                    </div>
                    <div className="sponsor-logo-grid">
                        {partnerTiers.flatMap((tier) =>
                            tier.partners.map((partner) => (
                                <article
                                    key={partner.id}
                                    className="sponsor-logo-card"
                                >
                                    <span
                                        className={`sponsor-tier-badge sponsor-tier-badge-${tier.name.toLowerCase()}`}
                                        title={`${tier.name} sponsor`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="8" r="7" />
                                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                        </svg>
                                    </span>
                                    {partner.logo ? (
                                        <img
                                            className="sponsor-logo-img"
                                            src={partner.logo}
                                            alt={`${partner.name} logo`}
                                        />
                                    ) : (
                                        <div className="sponsor-logo">
                                            {partner.name}
                                        </div>
                                    )}
                                </article>
                            )),
                        )}
                    </div>
                </section>

                <section className="sponsor-contact-panel">
                    <div className="sponsor-contact-copy">
                        <h2>Become part of our story.</h2>
                        <p>
                            Sponsor UBC Thai Aiyara and help bring Thai culture
                            to campus.
                        </p>
                        <div className="sponsor-contact-actions">
                            <a
                                className="sponsor-contact-cta"
                                href="mailto:contact@ubcthaiaiyara.com"
                            >
                                Get in touch
                            </a>
                            <a
                                className="sponsor-contact-secondary"
                                href="/sponsorship-package.pdf"
                                download
                            >
                                View sponsorship package
                            </a>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
