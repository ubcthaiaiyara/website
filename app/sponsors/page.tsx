import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sponsors",
    description:
        "The partners who help UBC Thai Aiyara host events and grow its community.",
};

export default function SponsorsPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Sponsors</span>
                <h2>Backed by our community.</h2>
                <div className="page-prose">
                    <p className="lead-p">
                        UBC Thai Aiyara is supported by partners who believe in
                        what we do. Their generosity helps us host events, welcome
                        new members, and keep Thai culture thriving at UBC.
                    </p>

                    <h3>Current partners</h3>
                    <div className="sponsor-grid">
                        <div className="sponsor-card">
                            <div className="sponsor-logo">OSO</div>
                            <h3>OSO Hair Salon</h3>
                            <p>Proud supporter of the Aiyara family.</p>
                        </div>
                    </div>

                    <h3>Become a sponsor</h3>
                    <p>
                        Interested in supporting UBC Thai Aiyara? We would love to
                        work with you. Reach out at{" "}
                        <a href="mailto:contact@ubcthaiaiyara.com">
                            contact@ubcthaiaiyara.com
                        </a>{" "}
                        to learn about partnership opportunities.
                    </p>
                </div>
            </section>
        </main>
    );
}
