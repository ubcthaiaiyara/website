import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

// Type system: Libre Baskerville (serif) for primary display statements,
// Cotham Sans for secondary titles and UI, and Open Runde — a rounded sans by
// Laurids Kern (OFL) — for descriptions and paragraphs. All exposed as CSS
// variables consumed by globals.css.
const libreBaskerville = Libre_Baskerville({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
    weight: ["400", "700"],
    style: ["normal", "italic"],
});

// Self-hosted: Cotham Sans isn't on Google Fonts. Single weight — heavier
// weights render as browser-synthesized bold.
const cothamSans = localFont({
    variable: "--font-sans",
    display: "swap",
    src: [{ path: "./fonts/CothamSans.otf", weight: "400", style: "normal" }],
});

// Self-hosted: Open Runde isn't on Google Fonts.
const openRunde = localFont({
    variable: "--font-body",
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

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${libreBaskerville.variable} ${cothamSans.variable} ${openRunde.variable}`}
        >
            <body>
                <SiteHeader />
                {children}
                <footer className="site-footer">
                    <div className="footer-inner">
                        <div className="footer-top">
                            <p className="footer-wordmark">
                                Aiyara,
                                <br />
                                your home at UBC.
                            </p>
                            <div className="footer-socials">
                                <a
                                    href="https://www.instagram.com/ubcthaiaiyara"
                                    className="social"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/ubc-thaiaiyara"
                                    className="social"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="mailto:contact@ubcthaiaiyara.com"
                                    className="social"
                                >
                                    Email
                                </a>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p className="copyright">
                                © {new Date().getFullYear()} UBC Thai Aiyara.
                                All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
