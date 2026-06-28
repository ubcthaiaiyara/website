import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

// Editorial serif for display headlines (primary), TeX Gyre Heros — a Helvetica-
// class grotesque — for body copy and descriptions (secondary). Both exposed as
// CSS variables consumed by globals.css.
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

// Self-hosted: TeX Gyre Heros isn't on Google Fonts (GUST Font License).
const texGyreHeros = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/TeXGyreHeros-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/TeXGyreHeros-Italic.otf", weight: "400", style: "italic" },
    { path: "./fonts/TeXGyreHeros-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/TeXGyreHeros-BoldItalic.otf", weight: "700", style: "italic" },
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
    <html lang="en" className={`${libreBaskerville.variable} ${texGyreHeros.variable}`}>
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
                  href="https://www.facebook.com/ubcthaiaiyara"
                  className="social"
                >
                  Facebook
                </a>
                <a href="mailto:contact@ubcthaiaiyara.com" className="social">
                  Email
                </a>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="copyright">
                ©{new Date().getFullYear()} by UBC Thai Aiyara.
              </p>
              <p className="copyright">Vancouver, BC · University of British Columbia</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
