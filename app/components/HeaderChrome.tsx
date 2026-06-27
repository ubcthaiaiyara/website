"use client";

import { useEffect, useState } from "react";

// Client shell for the site header: swaps the chrome from fully transparent
// (blended into the page background / hero) to a frosted translucent bar once
// the page is scrolled. Presentation only — the nav content itself stays in the
// server-rendered SiteHeader.
export default function HeaderChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      {children}
    </header>
  );
}
