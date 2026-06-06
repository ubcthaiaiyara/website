import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "UBC Thai Aiyara — Membership",
  description: "Club membership for the UBC Thai Aiyara club.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-inner">
            <p>
              <a href="https://www.instagram.com/ubcthaiaiyara" className="social">
                Instagram
              </a>
              <a href="https://www.facebook.com/ubcthaiaiyara" className="social">
                Facebook
              </a>
              <a href="mailto:ubcthaiaiyara@gmail.com" className="social">
                Email
              </a>
            </p>
            <p className="copyright">©2021 by UBC Thai Aiyara.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
