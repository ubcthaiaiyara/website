import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ubcthaiaiyara.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    // Public, indexable routes only (dashboard/join/login are private).
    const routes = ["", "/about", "/sponsors", "/contact"];

    return routes.map((path) => ({
        url: `${base}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.7,
    }));
}
