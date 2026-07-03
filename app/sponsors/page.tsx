import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors — UBC Thai Aiyara",
};

export default function SponsorsPage() {
  return (
    <main className="subpage">
      <section className="section">
        <span className="section-label">Sponsors</span>
        <h2>Our trusted partners.</h2>
        <div className="sponsor-grid">
          <div className="sponsor-card">
            <div className="sponsor-logo">OSO</div>
            <h3>OSO Hair Salon</h3>
            <p>Proud supporter of the Aiyara family.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
