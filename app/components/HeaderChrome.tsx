"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Client shell for the site header. Two bits of state:
//   • scrolled — frosts the bar once the page is scrolled past the hero (or a
//     few px on pages without a hero); over the hero the bar stays transparent.
//   • open     — toggles the mobile dropdown menu.
// The nav content itself is server-rendered in SiteHeader and passed as
// children.
export default function HeaderChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Collapsed hides the nav content (not the blur) when scrolling down; any
  // upward scroll brings it back.
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Over a hero, content flips to dark once its cream lower band (~62% down)
    // reaches the top of the viewport; elsewhere, after a few pixels.
    let threshold = 24;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > threshold);
      // Ignore jitter and the elastic top; collapse only once past the bar.
      if (Math.abs(y - lastY) > 6) {
        setCollapsed(y > lastY && y > 96);
        lastY = y;
      }
    };
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

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${
        open ? " is-open" : ""
      }${collapsed && !open ? " is-collapsed" : ""}`}
      // Following any link inside the header closes the mobile menu.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) setOpen(false);
      }}
    >
      {/* Progressive blur (newgenre.studio): eight backdrop-filter bands with
          doubling blur strength, each masked to a 12.5% slice so page content
          diffuses gradually as it scrolls up under the bar. */}
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
