"use client";

import Image from "next/image";
import Link from "next/link";

const AUTH_TO_HOME_KEY = "aiyara-auth-to-home";

export default function AuthBrand() {
    return (
        <Link
            href="/"
            className="auth-brand"
            onClick={() => {
                try {
                    sessionStorage.setItem(AUTH_TO_HOME_KEY, "1");
                } catch {
                    // Storage can be unavailable in restricted browsing modes.
                }
            }}
        >
            <Image
                src="/elephant.png"
                alt="UBC Thai Aiyara"
                width={81}
                height={109}
                priority
            />
        </Link>
    );
}
