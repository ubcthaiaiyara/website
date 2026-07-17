import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// While SITE_MODE=maintenance, gate the whole site: every page URL renders the
// maintenance screen (app/page.tsx serves it at "/"), so the rest of the site
// can't be reached by typing a path directly (e.g. /about, /login). Static
// assets, API routes, robots/sitemap, and Next internals are excluded via the
// matcher below so the maintenance page and its assets still load.
export function proxy(request: NextRequest) {
    if (process.env.SITE_MODE !== "maintenance") {
        return NextResponse.next();
    }

    // The homepage already renders the maintenance screen.
    if (request.nextUrl.pathname === "/") {
        return NextResponse.next();
    }

    // Rewrite (not redirect) so the requested URL stays put but shows
    // maintenance content.
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.rewrite(url);
}

export const config = {
    // Run on page routes only: skip API routes, Next internals, and any path
    // with a file extension (public assets like the wordmark, fonts, robots,
    // sitemap, favicon). Also skip the metadata image routes as they have no
    // file extension, so without this they'd be rewritten to the maintenance
    // HTML and social crawlers would get a non-image for og:image/twitter:image.
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|twitter-image|.*\\..*).*)",
    ],
};
