import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — UBC Thai Aiyara",
};

export default function AboutPage() {
  return (
    <main className="subpage">
      <section className="section">
        <span className="section-label">About</span>
        <h2>More than a club.</h2>
        <p className="lead">
          UBC Thai Aiyara brings together Thai students and anyone who loves Thai
          culture at the University of British Columbia. From socials and food
          nights to festivals and Roon Pee–Roon Norng mentorship, we&apos;re a
          community that feels like home away from home.
        </p>
      </section>
    </main>
  );
}
