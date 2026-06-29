"use client";

import { useEffect, useState } from "react";

// Client shell for the site header: swaps the chrome from fully transparent
// (blended into the page background / hero) to a frosted translucent bar once
// the page is scrolled, and owns the mobile hamburger menu state. Presentation
// only — the nav content itself stays in the server-rendered SiteHeader.
export default function HeaderChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${
        open ? " is-open" : ""
      }`}
      onClick={(e) => {
        // Following any nav link should collapse the mobile menu.
        if ((e.target as HTMLElement).closest("a")) setOpen(false);
      }}
    >
      {/* Progressive blur stack: eight bands with doubling blur strength,
          masked so the diffusion ramps from nothing to full at the top edge. */}
      <div className="nav-blur" aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className="nav-inner">
        {children}
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
