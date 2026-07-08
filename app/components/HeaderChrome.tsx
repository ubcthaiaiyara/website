"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Covers the sheet's slide-up exit animation in globals.css (sheet-slide-up).
const MENU_EXIT_MS = 300;
const AUTH_TO_HOME_KEY = "aiyara-auth-to-home";

// Client shell for the site header: swaps the chrome from fully transparent
// (blended into the page background / hero) to a frosted translucent bar once
// the page is scrolled, and owns the mobile hamburger menu state. Presentation
// only — the nav content itself stays in the server-rendered SiteHeader.
export default function HeaderChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  const [open, setOpen] = useState(false);
  const [fromAuth, setFromAuth] = useState(false);
  // True while the overlay is playing its exit animation — the menu stays
  // mounted (still .is-open) so it can fade out before actually closing.
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<number | undefined>(undefined);
  const fromAuthTimer = useRef<number | undefined>(undefined);

  const closeMenu = () => {
    setClosing(true);
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, MENU_EXIT_MS);
  };

  const openMenu = () => {
    window.clearTimeout(exitTimer.current);
    setClosing(false);
    setOpen(true);
  };

  useEffect(
    () => () => {
      window.clearTimeout(exitTimer.current);
      window.clearTimeout(fromAuthTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    try {
      if (
        sessionStorage.getItem(AUTH_TO_HOME_KEY) !== "1" ||
        !document.querySelector(".hero")
      ) {
        return;
      }

      sessionStorage.removeItem(AUTH_TO_HOME_KEY);
    } catch {
      return;
    }

    setFromAuth(true);
    window.clearTimeout(fromAuthTimer.current);
    fromAuthTimer.current = window.setTimeout(() => setFromAuth(false), 520);
    return () => window.clearTimeout(fromAuthTimer.current);
  }, [pathname]);

  useEffect(() => {
    // The nav text flips from light to dark when the background behind it
    // actually turns light — i.e. once the cream lower band of the hero
    // gradient (~62% of its height) reaches the top of the viewport. On
    // pages without a hero the text is dark from the start anyway.
    let threshold = 24;
    // Last scroll position, to derive direction. Scrolling down past a small
    // buffer hides the bar; any upward movement brings it back.
    let lastY = window.scrollY;
    // How tall the bar is, so we know when the dark footer has scrolled up
    // behind it — at which point the bar flips to its midnight treatment.
    let headerH = 72;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > threshold);
      // Ignore tiny jitter and the elastic top of the page. Only hide once
      // we're comfortably below the header's own height.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 96);
        lastY = y;
      }
      const footer = document.querySelector<HTMLElement>(".site-footer");
      setOverFooter(
        !!footer && footer.getBoundingClientRect().top < headerH
      );
    };

    const measure = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      threshold = hero ? hero.offsetHeight * 0.62 : 24;
      const header = document.querySelector<HTMLElement>(".site-header");
      if (header) headerH = header.offsetHeight;
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

  // Lock scrolling on the page behind the full-screen overlay menu.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${
        open ? " is-open" : ""
      }${closing ? " is-closing" : ""}${hidden && !open ? " is-hidden" : ""}${
        overFooter && !open ? " over-footer" : ""
      }${fromAuth ? " from-auth" : ""}`}
      onClick={(e) => {
        // Following any nav link should collapse the mobile menu.
        if ((e.target as HTMLElement).closest("a")) closeMenu();
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
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
