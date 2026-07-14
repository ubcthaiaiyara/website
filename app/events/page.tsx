import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Events",
    description:
        "Festivals, socials, and traditions hosted by UBC Thai Aiyara throughout the year.",
};

export default function EventsPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Events</span>
                <h2>Our events.</h2>
                <div className="page-prose">
                    <p className="lead-p">
                        From cultural festivals to casual hangouts, there is
                        always something happening at UBC Thai Aiyara. Here is a
                        taste of what we host throughout the year.
                    </p>

                    <h3>Songkran</h3>
                    <p>
                        Our Thai New Year celebration, complete with music, food,
                        and a friendly water fight. It is one of the biggest
                        events on our calendar and a favourite for new and
                        returning members alike.
                    </p>

                    <h3>Loy Krathong</h3>
                    <p>
                        A gentle evening of floating krathong, candlelight, and
                        reflection, celebrating one of the most beautiful
                        traditions in Thailand.
                    </p>

                    <h3>Taste of SEA</h3>
                    <p>
                        A collaboration with other Southeast Asian clubs at UBC
                        that brings together food, performances, and community
                        from across the region.
                    </p>

                    <h3>Socials and retreats</h3>
                    <p>
                        Throughout the year we host game nights, food outings,
                        study sessions, and weekend retreats, so there is always
                        a way to meet people and feel at home.
                    </p>

                    <p>
                        Follow us on{" "}
                        <a
                            href="https://www.instagram.com/ubcthaiaiyara"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>{" "}
                        for dates and details, or become a member to get event
                        reminders and RSVP in a tap.
                    </p>

                    <Link className="button" href="/join">
                        Become a member
                    </Link>
                </div>
            </section>
        </main>
    );
}
