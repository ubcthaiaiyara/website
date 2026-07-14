import Image from "next/image";
import Link from "next/link";
import { readSession } from "@/lib/session";
import { getMemberByUserId } from "@/lib/members";
import AuthEntryLink from "./AuthEntryLink";
import HeaderChrome from "./HeaderChrome";
import HomeLink from "./HomeLink";

// Server component: reads the session so the header can show either the
// signed-out (Log in / Join) or signed-in actions. Rendered globally from
// app/layout.tsx. HeaderChrome (client) owns the bar itself: the scroll-driven
// transparent → frosted transition and the mobile hamburger.
export default async function SiteHeader() {
  const userId = await readSession();
  const member = userId ? await getMemberByUserId(userId) : null;
  // Greet the signed-in member by first name on the account button. `name` is
  // the combined first + last; fall back to "there" if it's somehow blank.
  const firstName = member?.name.trim().split(/\s+/)[0] || "there";

  return (
    <HeaderChrome>
      <HomeLink>
        <Image
          src="/thai-aiyara-wordmark.png"
          alt="UBC Thai Aiyara"
          width={764}
          height={317}
          className="brand-logo"
          priority
        />
      </HomeLink>

      {/* Wrapper is display:contents normally (so the desktop bar lays the nav
          links and actions out as direct flex children); on the mobile overlay
          it becomes a real flex box that centers the label groups. */}
      <div className="nav-menu">
        <nav className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/events">Events</Link>
          <Link href="/team">Team</Link>
          <Link href="/sponsors">Sponsors</Link>
        </nav>

        <div className="nav-actions">
          {member ? (
            <Link className="button button-sm" href="/dashboard">
              <span className="nav-greeting">Hi, {firstName}</span>
              <span className="nav-account-label">My account</span>
            </Link>
          ) : (
            <>
              <AuthEntryLink className="nav-login" href="/login">
                Log in
              </AuthEntryLink>
              <AuthEntryLink className="button button-sm" href="/join">
                Join Now
              </AuthEntryLink>
            </>
          )}
        </div>
      </div>
    </HeaderChrome>
  );
}
