import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

// Editorial serif for display headlines (primary), Cotham Sans — a quirky
// grotesk by Sébastien Sanfilippo (OFL) — for descriptions and secondary
// titles. Both exposed as CSS variables consumed by globals.css.
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
            className={`${libreBaskerville.variable} ${cothamSans.variable}`}
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
                                Copyright © {new Date().getFullYear()} UBC Thai
                                Aiyara. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
