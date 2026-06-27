import Link from "next/link";
import { readSession } from "@/lib/session";
import HeaderChrome from "./HeaderChrome";

// Server component: reads the session so the header can show either the
// signed-out (Log in / Join) or signed-in (My Pass) actions. Rendered globally
// from app/layout.tsx. HeaderChrome (client) handles the scroll-driven
// transparent → frosted transition.
export default async function SiteHeader() {
  const signedIn = Boolean(await readSession());

  return (
    <HeaderChrome>
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-text">UBC Thai Aiyara</span>
        </Link>

        <nav className="nav-links">
          <a href="/#about">About</a>
          <a href="/#sponsors">Sponsors</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          {signedIn ? (
            <Link className="button button-sm" href="/dashboard">
              Account
            </Link>
          ) : (
            <>
              <Link className="nav-login" href="/login">
                Log in
              </Link>
              <Link className="button button-sm" href="/join">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </HeaderChrome>
  );
}
