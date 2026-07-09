import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

// Type system: Lastik (serif display) for headings and display statements, and
// Open Runde — a rounded sans by Laurids Kern (OFL) — for everything else (UI,
// descriptions, paragraphs). Exposed as CSS variables consumed by globals.css.

// Self-hosted: Open Runde isn't on Google Fonts.
const openRunde = localFont({
    variable: "--font-sans",
    display: "swap",
    src: [
        {
            path: "./fonts/OpenRunde-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/OpenRunde-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/OpenRunde-Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/OpenRunde-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
});

// Self-hosted display face — Lastik Free (That That Type, free for personal and
// commercial use). Single weight (400). Serves as the site's serif throughout
// (headings, quotes, display numerals), replacing Libre Baskerville.
const lastik = localFont({
    variable: "--font-serif",
    display: "swap",
    src: [
        { path: "./fonts/Lastik-Regular.woff2", weight: "400", style: "normal" },
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
            className={`${openRunde.variable} ${lastik.variable}`}
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
                                    friends at the University of British
                                    Columbia.
                                </p>
                                <a
                                    className="footer-email"
                                    href="mailto:contact@ubcthaiaiyara.com"
                                >
                                    contact@ubcthaiaiyara.com
                                </a>
                            </div>

                            <nav className="footer-col">
                                <h4>Explore</h4>
                                <Link href="/about">About</Link>
                                <Link href="/sponsors">Sponsors</Link>
                                <Link href="/contact">Socials</Link>
                            </nav>

                            <nav className="footer-col">
                                <h4>Socials</h4>
                                <a href="https://www.instagram.com/ubcthaiaiyara">
                                    Instagram
                                </a>
                                <a href="https://www.tiktok.com/@ubc.thaiaiyara">
                                    TikTok
                                </a>
                                <a href="https://www.linkedin.com/company/ubc-thaiaiyara">
                                    LinkedIn
                                </a>
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
                <SpeedInsights />
            </body>
        </html>
    );
}
