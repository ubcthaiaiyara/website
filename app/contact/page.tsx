import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Socials",
    description:
        "Follow UBC Thai Aiyara on Instagram, TikTok, and LinkedIn, or get in touch by email.",
};

export default function SocialsPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Socials</span>
                <h2>Follow along.</h2>
                <div className="page-prose">
                    <p className="lead-p">
                        Keep up with UBC Thai Aiyara events, announcements, and
                        community updates across our channels.
                    </p>

                    <h3>Find us online</h3>
                    <p className="contact-links">
                        <a href="https://www.instagram.com/ubcthaiaiyara">
                            Instagram
                        </a>
                        <a href="https://www.tiktok.com/@ubc.thaiaiyara">
                            TikTok
                        </a>
                        <a href="https://www.linkedin.com/company/ubc-thaiaiyara">
                            LinkedIn
                        </a>
                    </p>

                    <h3>Get in touch</h3>
                    <p>
                        For membership questions or collaborations, email{" "}
                        <a href="mailto:contact@ubcthaiaiyara.com">
                            contact@ubcthaiaiyara.com
                        </a>
                        .
                    </p>

                    <Link className="button" href="/join">
                        Become a member
                    </Link>
                </div>
            </section>
        </main>
    );
}
