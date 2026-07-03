import type { Metadata, Viewport } from "next";
import { Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

// Type system: Libre Baskerville (serif) for primary display statements, and
// Open Runde — a rounded sans by Laurids Kern (OFL) — for everything else
// (titles, UI, descriptions, paragraphs). Exposed as CSS variables consumed by
// globals.css.
const libreBaskerville = Libre_Baskerville({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
    weight: ["400", "700"],
    style: ["normal", "italic"],
});

// Self-hosted: Open Runde isn't on Google Fonts.
const openRunde = localFont({
    variable: "--font-sans",
    display: "swap",
    src: [
        { path: "./fonts/OpenRunde-Regular.woff2", weight: "400", style: "normal" },
        { path: "./fonts/OpenRunde-Medium.woff2", weight: "500", style: "normal" },
        { path: "./fonts/OpenRunde-Semibold.woff2", weight: "600", style: "normal" },
        { path: "./fonts/OpenRunde-Bold.woff2", weight: "700", style: "normal" },
    ],
});

export const metadata: Metadata = {
    title: "UBC Thai Aiyara",
    description: "Club membership for the UBC Thai Aiyara club.",
};

// Tints the iOS Safari toolbars. Safari samples this meta tag (or the <body>
// background as a fallback) — never the <html> background — so the midnight
// html color alone can't reach the chrome. Match the top of the hero gradient.
export const viewport: Viewport = {
    themeColor: "#050115",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${libreBaskerville.variable} ${openRunde.variable}`}
        >
            <body>
                <SiteHeader />
                <div className="page-body">{children}</div>
                <footer className="site-footer">
                    <div className="footer-inner">
                        <div className="footer-grid">
                            <div className="footer-brand">
                                <div className="footer-mark">
                                    <span>UBC Thai Aiyara</span>
                                </div>
                                <p className="footer-desc">
                                    A home away from home for Thai students and
                                    friends at UBC — socials, festivals, and
                                    Roon Pee–Roon Norng mentorship that make the
                                    community feel like family.
                                </p>
                                <div className="footer-socials">
                                    <a
                                        href="https://www.instagram.com/ubcthaiaiyara"
                                        className="social"
                                        aria-label="Instagram"
                                    >
                                        <svg
                                            className="social-icon"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                                            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M16.5 7.5l0 .01" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/ubc-thaiaiyara"
                                        className="social"
                                        aria-label="LinkedIn"
                                    >
                                        <svg
                                            className="social-icon"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M8 11l0 5" />
                                            <path d="M8 8l0 .01" />
                                            <path d="M12 16l0 -5" />
                                            <path d="M16 16v-3a2 2 0 0 0 -4 0" />
                                            <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="mailto:contact@ubcthaiaiyara.com"
                                        className="social"
                                        aria-label="Email"
                                    >
                                        <svg
                                            className="social-icon"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                            <path d="M3 7l9 6l9 -6" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <nav className="footer-col">
                                <h4>Explore</h4>
                                <Link href="/about">About</Link>
                                <Link href="/sponsors">Sponsors</Link>
                                <Link href="/contact">Contact</Link>
                            </nav>

                            <nav className="footer-col">
                                <h4>Membership</h4>
                                <Link href="/join">Join us</Link>
                                <Link href="/login">Member login</Link>
                            </nav>

                            <nav className="footer-col">
                                <h4>Legal</h4>
                                <a href="/terms">Terms of Service</a>
                                <a href="/privacy">Privacy Policy</a>
                            </nav>
                        </div>

                        <div className="footer-bottom">
                            <p className="copyright">
                                © {new Date().getFullYear()} UBC Thai Aiyara.
                                All rights reserved.
                            </p>
                            <p className="footer-location">
                                <svg
                                    className="footer-pin"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
                                    />
                                </svg>
                                Vancouver, Canada
                            </p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
