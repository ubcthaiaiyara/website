"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// The wordmark is the site's home control. Next.js intentionally treats a
// link to the current route as a no-op, so handle that case by returning the
// visitor to the top of the landing page.
export default function HomeLink({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className="brand"
      aria-label="Go to the home page"
      onClick={(event) => {
        if (
          pathname === "/" &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}
