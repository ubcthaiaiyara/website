import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — UBC Thai Aiyara",
};

export default function ContactPage() {
  return (
    <main className="subpage">
      <section className="section">
        <span className="section-label">Contact</span>
        <h2>Get in touch.</h2>
        <p className="lead">
          Questions about membership or want to collaborate? Reach out anytime.
        </p>
        <p className="contact-links">
          <a href="mailto:contact@ubcthaiaiyara.com">
            contact@ubcthaiaiyara.com
          </a>
          <a href="https://www.instagram.com/ubcthaiaiyara">Instagram</a>
          <a href="https://www.linkedin.com/company/ubc-thaiaiyara">LinkedIn</a>
        </p>
        <Link className="button" href="/join">
          Become a member
        </Link>
      </section>
    </main>
  );
}
