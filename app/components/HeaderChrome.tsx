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
    // The nav text flips from light to dark when the background behind it
    // actually turns light — i.e. once the cream lower band of the hero
    // gradient (~62% of its height) reaches the top of the viewport. On
    // pages without a hero the text is dark from the start anyway.
    let threshold = 24;

    const onScroll = () => setScrolled(window.scrollY > threshold);

    const measure = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      threshold = hero ? hero.offsetHeight * 0.62 : 24;
      onScroll();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
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
