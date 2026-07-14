import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Team",
    description:
        "Meet the student volunteers behind UBC Thai Aiyara.",
};

// TODO: replace roles with the real exec team, add names and photos.
const team = [
    { role: "President" },
    { role: "Vice President" },
    { role: "Treasurer" },
    { role: "Events Director" },
    { role: "Marketing Director" },
    { role: "Community Lead" },
];

export default function TeamPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Team</span>
                <h2>Meet our team.</h2>
                <div className="page-prose">
                    <p className="lead-p">
                        UBC Thai Aiyara is run by a team of student volunteers who
                        pour their time into building a home away from home. Here
                        are the people behind it.
                    </p>
                </div>
                <div className="float-grid team-grid">
                    {team.map((member, i) => (
                        <article key={i} className="float-card team-card">
                            <div
                                className="team-card-photo"
                                aria-hidden="true"
                            />
                            <h3>[Name]</h3>
                            <p className="team-role">{member.role}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
