import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.1.132"],
    // The Open Graph image reads the Lastik OTF + wordmark at runtime; make sure
    // both are bundled into the route's serverless function.
    outputFileTracingIncludes: {
        "/opengraph-image": [
            "./app/fonts/Lastik-Regular.otf",
            "./app/fonts/OpenRunde-Regular.otf",
            "./public/thai-aiyara-wordmark.png",
            "./public/og-grain.png",
        ],
    },
};

export default nextConfig;
