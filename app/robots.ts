import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ubcthaiaiyara.com";

export default function robots(): MetadataRoute.Robots {
    // While in maintenance, keep the whole site out of the index.
    if (process.env.SITE_MODE === "maintenance") {
        return { rules: { userAgent: "*", disallow: "/" } };
    }

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Private/authenticated areas with no SEO value; keep them out.
            disallow: ["/dashboard", "/join", "/login", "/api/"],
        },
        sitemap: `${base}/sitemap.xml`,
    };
}
