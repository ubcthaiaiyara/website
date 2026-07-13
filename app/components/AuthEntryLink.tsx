"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const TO_AUTH_KEY = "aiyara-page-to-auth";

export default function AuthEntryLink({
    href,
    className,
    children,
}: {
    href: "/login" | "/join";
    className: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className={className}
            onClick={(event) => {
                // Animate the auth wordmark for any plain left-click navigation
                // into auth, from any page. Skip modified clicks (new tab, etc.)
                // and the auth pages themselves (moving between login and join).
                const path = window.location.pathname;
                if (
                    path === "/login" ||
                    path === "/join" ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                ) {
                    return;
                }

                try {
                    sessionStorage.setItem(TO_AUTH_KEY, "1");
                } catch {
                    // Storage can be unavailable in restricted browsing modes.
                }
            }}
        >
            {children}
        </Link>
    );
}
