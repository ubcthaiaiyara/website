import { ImageResponse } from "next/og";

// Social share card (used for Open Graph and Twitter). Next auto-injects the
// og:image / twitter:image tags from this file for every route.
export const alt = "UBC Thai Aiyara: Home for UBC Thai Aiyara members.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
                    padding: "0 96px",
                    // Midnight brand gradient (matches the hero / theme color).
                    background:
                        "radial-gradient(circle at 50% 0%, #1a1140 0%, #050115 60%)",
                    color: "#f5f0e6",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        fontSize: 34,
                        letterSpacing: 8,
                        textTransform: "uppercase",
                        color: "#c9a86a",
                        marginBottom: 28,
                    }}
                >
                    UBC Thai Aiyara
                </div>
                <div
                    style={{
                        fontSize: 76,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        maxWidth: 900,
                    }}
                >
                    Home for UBC Thai Aiyara members.
                </div>
                <div
                    style={{
                        marginTop: 40,
                        fontSize: 28,
                        color: "#a79fb5",
                    }}
                >
                    ubcthaiaiyara.com
                </div>
            </div>
        ),
        { ...size },
    );
}
