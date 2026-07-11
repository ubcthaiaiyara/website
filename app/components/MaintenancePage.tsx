import Image from "next/image";

export default function MaintenancePage() {
    return (
        <main className="maintenance-page">
            <div className="maintenance-glow maintenance-glow-one" aria-hidden="true" />
            <div className="maintenance-glow maintenance-glow-two" aria-hidden="true" />

            <section className="maintenance-card" aria-labelledby="maintenance-title">
                <Image
                    className="maintenance-logo"
                    src="/thai-aiyara-wordmark.png"
                    alt="Thai Aiyara"
                    width={764}
                    height={317}
                    priority
                />
                <h1 id="maintenance-title">We&apos;re making a few updates.</h1>
                <p className="maintenance-copy">
                    Our website is currently under construction. We&apos;ll be
                    back soon with a refreshed home for our community.
                </p>
                <nav className="maintenance-socials" aria-label="Follow Thai Aiyara">
                    <a href="https://www.instagram.com/ubcthaiaiyara" target="_blank" rel="noreferrer" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" className="maintenance-social-dot" />
                        </svg>
                    </a>
                    <a href="https://www.tiktok.com/@ubc.thaiaiyara" target="_blank" rel="noreferrer" aria-label="TikTok">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M14.3 3c.2 1.9 1.3 3.5 3.7 3.7v3.1c-1.4 0-2.7-.4-3.7-1.2v6.5a5.1 5.1 0 1 1-4.4-5.1v3.1a2 2 0 1 0 1.3 1.9V3h3.1Z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/company/ubc-thaiaiyara" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6.2 8.5H3.1V21h3.1V8.5ZM4.7 3A1.8 1.8 0 1 0 4.7 6.6 1.8 1.8 0 0 0 4.7 3ZM21 13.8c0-3.8-2-5.6-4.7-5.6-2.2 0-3.1 1.2-3.6 2v-1.7H9.6V21h3.1v-6.2c0-1.6.3-3.2 2.3-3.2 2 0 2 1.9 2 3.3V21H21v-7.2Z" />
                        </svg>
                    </a>
                </nav>
            </section>
        </main>
    );
}
