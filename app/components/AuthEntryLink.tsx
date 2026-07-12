"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const HOME_TO_AUTH_KEY = "aiyara-home-to-auth";

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
                if (
                    window.location.pathname !== "/" ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                ) {
                    return;
                }

                try {
                    sessionStorage.setItem(HOME_TO_AUTH_KEY, "1");
                } catch {
                    // Storage can be unavailable in restricted browsing modes.
                }
            }}
        >
            {children}
        </Link>
    );
}
