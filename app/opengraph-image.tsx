import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social share card (used for Open Graph and Twitter). Next auto-injects the
// og:image / twitter:image tags from this file for every route. Styled to match
// the site: the maintenance/hero midnight gradient, the white wordmark, and the
// Lastik serif heading with a soft light sheen.
export const alt =
    "UBC Thai Aiyara — a home away from home for Thai students & friends at UBC.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
    const [lastik, openRunde, wordmark, grainPng] = await Promise.all([
        // Satori can't parse woff2, so these are decompressed OTFs.
        readFile(join(process.cwd(), "app/fonts/Lastik-Regular.otf")),
        readFile(join(process.cwd(), "app/fonts/OpenRunde-Regular.otf")),
        readFile(join(process.cwd(), "public/thai-aiyara-wordmark.png")),
        // Pre-rendered coarse noise (Satori can't rasterize SVG feTurbulence).
        readFile(join(process.cwd(), "public/og-grain.png")),
    ]);
    const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`;
    const grainSrc = `data:image/png;base64,${grainPng.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "0 110px",
                    // Fine grain over a #4f548c background with subtle depth.
                    backgroundColor: "#4f548c",
                    backgroundImage: `url(${grainSrc}), radial-gradient(circle at 25% 25%, #5c61a0 0%, transparent 52%), linear-gradient(135deg, #44487e 0%, #4f548c 55%, #3c4174 100%)`,
                    backgroundSize: "600px 600px, 100% 100%, 100% 100%",
                    backgroundRepeat: "repeat, no-repeat, no-repeat",
                }}
            >
                <img
                    src={wordmarkSrc}
                    width={210}
                    height={87}
                    alt=""
                    style={{ marginBottom: 42 }}
                />
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Lastik",
                        fontSize: 84,
                        lineHeight: 1.2,
                        // Room so the serif descenders (the "y") aren't clipped.
                        paddingBottom: 16,
                        letterSpacing: -3,
                        maxWidth: 940,
                        // Frozen version of the site's title shimmer.
                        backgroundImage:
                            "linear-gradient(110deg, #eef0f4 28%, #ffffff 50%, #c9cdd8 74%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    A home away from home.
                </div>
                <div
                    style={{
                        marginTop: 46,
                        fontFamily: "OpenRunde",
                        fontSize: 30,
                        letterSpacing: 1,
                        color: "#d3d4dc",
                    }}
                >
                    ubcthaiaiyara.com
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: "Lastik", data: lastik, style: "normal", weight: 400 },
                {
                    name: "OpenRunde",
                    data: openRunde,
                    style: "normal",
                    weight: 400,
                },
            ],
        },
    );
}
