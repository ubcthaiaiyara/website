import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sponsors",
    description:
        "Partner with UBC Thai Aiyara to reach an engaged student community and support Thai culture at UBC.",
};

const tiers = [
    {
        name: "Presenting Partner",
        blurb: "Our headline partnership.",
        benefits: [
            "Top billing logo at every event, on banners and on stage",
            "A dedicated feature across our social channels",
            "A booth or table at our signature festivals",
            "Logo and link on our website",
            "A thank you to our whole community",
        ],
    },
    {
        name: "Festival Sponsor",
        blurb: "Front and center at our biggest celebrations.",
        benefits: [
            "Logo at our major festivals, like Songkran and Loy Krathong",
            "A shoutout on our social channels",
            "Logo and link on our website",
        ],
    },
    {
        name: "Community Supporter",
        blurb: "Help us keep the community thriving.",
        benefits: [
            "Logo and link on our website",
            "A mention on our event banners",
        ],
    },
];

// Current partners (from the club's existing sponsor list). The logo squares
// use initials as placeholders until real logos are added.
const partners = [
    {
        logo: "OSO",
        name: "OSO Hair Salon",
        perk: "10% off all services for Aiyara members.",
    },
    {
        logo: "KFT",
        name: "Kung Fu Tea",
        perk: "15% off all drinks with your membership card.",
    },
    {
        logo: "LGH",
        name: "Lemongrass House",
        perk: "Buy one get one free on all products with your membership card.",
    },
    {
        logo: "GFC",
        name: "Grounds for Coffee",
        perk: "Fresh buns for members on an event basis.",
    },
    {
        logo: "ST",
        name: "Sala Thai",
        perk: "15% off food and drinks at this longtime downtown Vancouver Thai restaurant.",
    },
    {
        logo: "SH",
        name: "StorageHotel",
        perk: "10% off your first month of storage with the code UBCTHAI.",
    },
];

const reasons = [
    "Reach a large, engaged, and diverse student community at UBC.",
    "Put your brand front and center at cultural festivals and socials throughout the year.",
    "Grow your presence across our website, social media, and event materials.",
    "Support Thai culture and a student community that has felt like home for over a decade.",
];

export default function SponsorsPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Sponsors</span>
                <h2>Partner with us.</h2>
                <div className="page-prose">
                    <p className="lead-p">
                        UBC Thai Aiyara is a student run cultural club, and our
                        partners help us host the events that bring the community
                        together. Sponsoring us puts your brand in front of an
                        engaged student audience while supporting Thai culture at
                        UBC.
                    </p>
                </div>

                <div className="sponsor-stats">
                    <div className="sponsor-stat">
                        <span className="sponsor-stat-value">10+</span>
                        <span className="sponsor-stat-label">Years running</span>
                    </div>
                    <div className="sponsor-stat">
                        <span className="sponsor-stat-value">150+</span>
                        <span className="sponsor-stat-label">Active members</span>
                    </div>
                    <div className="sponsor-stat">
                        <span className="sponsor-stat-value">20+</span>
                        <span className="sponsor-stat-label">Events a year</span>
                    </div>
                </div>

                <div className="page-prose">
                    <h3>Why sponsor us</h3>
                    <ul>
                        {reasons.map((r) => (
                            <li key={r}>{r}</li>
                        ))}
                    </ul>

                    <h3>Sponsorship tiers</h3>
                </div>

                <div className="faq-list tier-accordion">
                    {tiers.map((tier) => (
                        <details key={tier.name} className="faq-item">
                            <summary>
                                <span>{tier.name}</span>
                                <span className="faq-icon" aria-hidden="true" />
                            </summary>
                            <div className="faq-answer">
                                <p className="tier-blurb">{tier.blurb}</p>
                                <ul className="tier-benefits">
                                    {tier.benefits.map((b) => (
                                        <li key={b}>{b}</li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    ))}
                </div>

                <div className="page-prose">
                    <p>
                        Looking for something custom, or want to contribute gifts
                        in kind? We would love to tailor a package that fits.
                    </p>

                    <h3>Current partners</h3>
                </div>

                <div className="sponsor-grid">
                    {partners.map((s) => (
                        <div key={s.name} className="sponsor-card">
                            <div className="sponsor-logo">{s.logo}</div>
                            <h3>{s.name}</h3>
                            <p>{s.perk}</p>
                        </div>
                    ))}
                </div>

                <div className="page-prose">
                    <h3>Become a sponsor</h3>
                    <p>
                        Interested in supporting UBC Thai Aiyara? Reach out at{" "}
                        <a href="mailto:contact@ubcthaiaiyara.com">
                            contact@ubcthaiaiyara.com
                        </a>{" "}
                        and we will share our sponsorship package and find the
                        right fit together.
                    </p>
                </div>
            </section>
        </main>
    );
}
