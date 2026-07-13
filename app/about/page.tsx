import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About",
    description:
        "UBC Thai Aiyara is a social and cultural club and a second home for Thai students at UBC.",
};

export default function AboutPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">About</span>
                <h2>More than a club.</h2>
                <div className="page-prose">
                    <p className="lead-p">
                        UBC Thai Aiyara brings together Thai students and anyone
                        who loves Thai culture at the University of British
                        Columbia. We are a social and cultural club under the{" "}
                        <a
                            href="https://www.ams.ubc.ca/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Alma Mater Society (AMS)
                        </a>
                        , and for over a decade we have been a second home for
                        Thai students far from home.
                    </p>

                    <h3>What we do</h3>
                    <p>
                        We celebrate Thai culture and build community through
                        festivals, socials, food nights, and casual hangouts.
                        Our events range from Songkran and Loy Krathong to
                        retreats, game nights, and collaborations with other
                        Southeast Asian groups, like Taste of SEA.
                    </p>

                    <h3>Roon Pee, Roon Norng</h3>
                    <p>
                        Our mentorship tradition pairs senior members (Roon Pee)
                        with newer members (Roon Norng), so no one has to
                        navigate life at UBC alone. It is one of the ways we make
                        a big campus feel like family.
                    </p>

                    <h3>Who can join</h3>
                    <p>
                        Everyone is welcome, whether you are Thai, learning the
                        language, or simply curious about the culture. Membership
                        is open to UBC students and the wider UBC community.
                    </p>

                    <Link className="button" href="/join">
                        Become a member
                    </Link>
                </div>
            </section>
        </main>
    );
}
