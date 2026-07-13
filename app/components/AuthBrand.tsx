"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTH_TO_HOME_KEY = "aiyara-auth-to-home";
const TO_AUTH_KEY = "aiyara-page-to-auth";

export default function AuthBrand() {
    const [enteringAuth, setEnteringAuth] = useState(false);

    useEffect(() => {
        // One-shot flag consumed on entry. Two constraints combine here:
        //   • setState is deferred to rAF (lint: no setState in effect body).
        //   • React StrictMode double-invokes this effect in dev; the first
        //     pass's cleanup cancels its frame, so the flag must NOT be cleared
        //     until the rAF actually runs — otherwise the second pass reads null
        //     and the animation never applies. Removing inside the callback lets
        //     the second pass re-see "1" and re-schedule the update.
        let frame: number | undefined;
        try {
            if (sessionStorage.getItem(TO_AUTH_KEY) === "1") {
                frame = window.requestAnimationFrame(() => {
                    sessionStorage.removeItem(TO_AUTH_KEY);
                    setEnteringAuth(true);
                });
            }
        } catch {
            // Storage can be unavailable in restricted browsing modes.
        }
        return () => {
            if (frame !== undefined) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <Link
            href="/"
            className={`auth-brand${enteringAuth ? " is-entering-auth" : ""}`}
            onClick={() => {
                try {
                    sessionStorage.setItem(AUTH_TO_HOME_KEY, "1");
                } catch {
                    // Storage can be unavailable in restricted browsing modes.
                }
            }}
        >
            <Image
                src="/thai-aiyara-wordmark.png"
                alt="UBC Thai Aiyara"
                width={764}
                height={317}
                priority
            />
        </Link>
    );
}
