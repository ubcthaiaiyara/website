import Link from "next/link";
import Image from "next/image";
import { readSession } from "@/lib/session";
import HeaderChrome from "./HeaderChrome";

// Server component: reads the session so the header can show either the
// signed-out (Log in / Join) or signed-in (My Pass) actions. Rendered globally
// from app/layout.tsx. HeaderChrome (client) owns the bar itself: the
// scroll-driven transparent → frosted transition and the mobile hamburger.
export default async function SiteHeader() {
  const signedIn = Boolean(await readSession());

  return (
    <HeaderChrome>
      <Link href="/" className="brand">
        <Image
          src="/elephant.png"
          alt="UBC Thai Aiyara"
          width={81}
          height={109}
          className="brand-logo"
          priority
        />
      </Link>

      {/* Wrapper is display:contents normally (so the desktop bar lays the nav
          links and actions out as direct flex children); on the mobile overlay
          it becomes a real flex box that centers the label groups. */}
      <div className="nav-menu">
        <nav className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/sponsors">Sponsors</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="nav-actions">
          {signedIn ? (
            <Link className="button button-sm" href="/dashboard">
              My Account
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
