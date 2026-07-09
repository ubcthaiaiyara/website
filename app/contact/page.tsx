import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Socials — UBC Thai Aiyara",
};

export default function SocialsPage() {
  return (
    <main className="subpage">
      <section className="section">
        <span className="section-label">Socials</span>
        <h2>Follow along.</h2>
        <p className="lead">
          Keep up with UBC Thai Aiyara events, announcements, and community updates.
        </p>
        <p className="contact-links">
          <a href="https://www.instagram.com/ubcthaiaiyara">Instagram</a>
          <a href="https://www.tiktok.com/@ubc.thaiaiyara">TikTok</a>
          <a href="https://www.linkedin.com/company/ubc-thaiaiyara">LinkedIn</a>
        </p>
        <p className="lead">
          For membership questions or collaborations, email{" "}
          <a href="mailto:contact@ubcthaiaiyara.com">
            contact@ubcthaiaiyara.com
          </a>
          .
        </p>
        <Link className="button" href="/join">
          Become a member
        </Link>
      </section>
    </main>
  );
}
