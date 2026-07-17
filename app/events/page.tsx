import type { Metadata } from "next";
import EventsBrowser from "@/app/components/EventsBrowser";
import { pastEvents, upcomingEvents } from "@/lib/events";

export const metadata: Metadata = {
    title: "Events",
    description:
        "Festivals, socials, and traditions hosted by UBC Thai Aiyara throughout the year.",
};

// Re-render hourly so events migrate from "Upcoming" to "Past" on their own.
export const revalidate = 3600;

export default function EventsPage() {
    const upcoming = upcomingEvents();
    const past = pastEvents();

    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Events</span>
                <h2>Our events.</h2>
                <div className="page-prose events-intro">
                    <p className="lead-p">
                        From cultural festivals to casual hangouts, there is
                        always something happening at UBC Thai Aiyara. Add an
                        event to your calendar below, or follow us on{" "}
                        <a
                            href="https://www.instagram.com/ubcthaiaiyara"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>{" "}
                        for the latest updates.
                    </p>
                </div>

                <EventsBrowser upcoming={upcoming} past={past} />
            </section>
        </main>
    );
}
