"use client";

import { useEffect, useRef, useState } from "react";

// Minimal typings for the bits of MapKit JS we use (it has no bundled types).
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        mapkit?: any;
    }
}

const MAPKIT_SRC = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";

let mapkitPromise: Promise<void> | null = null;

// Load the MapKit JS library once and reuse the promise across mounts.
function loadMapkit(): Promise<void> {
    if (typeof window === "undefined") return Promise.reject();
    if (window.mapkit?.maps) return Promise.resolve();
    if (mapkitPromise) return mapkitPromise;

    mapkitPromise = new Promise<void>((resolve, reject) => {
        const existing = document.getElementById(
            "mapkit-js",
        ) as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject());
            return;
        }
        const script = document.createElement("script");
        script.id = "mapkit-js";
        script.src = MAPKIT_SRC;
        script.crossOrigin = "anonymous";
        script.dataset.libraries = "map,annotations,services";
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
    });
    return mapkitPromise;
}

export default function EventMap({
    name,
    address,
    mapsHref,
}: {
    name: string;
    address: string;
    mapsHref: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let map: any = null;
        let cancelled = false;

        loadMapkit()
            .then(() => {
                if (cancelled || !ref.current) return;
                const mapkit = window.mapkit;

                if (!mapkit.__aiyaraInited) {
                    mapkit.init({
                        authorizationCallback: (done: (t: string) => void) => {
                            fetch("/api/mapkit-token")
                                .then((r) =>
                                    r.ok ? r.text() : Promise.reject(),
                                )
                                .then(done)
                                .catch(() => setFailed(true));
                        },
                    });
                    mapkit.__aiyaraInited = true;
                }

                // Geocode the address to real coordinates, then drop a pin.
                const geocoder = new mapkit.Geocoder({
                    getsUserLocation: false,
                });
                geocoder.lookup(address, (error: unknown, data: any) => {
                    if (cancelled || !ref.current) return;
                    const result = data?.results?.[0];
                    if (error || !result) {
                        setFailed(true);
                        return;
                    }
                    const coord = result.coordinate;
                    map = new mapkit.Map(ref.current, {
                        center: coord,
                        showsMapTypeControl: false,
                        showsCompass: mapkit.FeatureVisibility.Hidden,
                        isRotationEnabled: false,
                    });
                    map.region = new mapkit.CoordinateRegion(
                        coord,
                        new mapkit.CoordinateSpan(0.008, 0.008),
                    );
                    map.addAnnotation(
                        new mapkit.MarkerAnnotation(coord, {
                            title: name,
                            color: "#1c2644",
                        }),
                    );
                });
            })
            .catch(() => setFailed(true));

        return () => {
            cancelled = true;
            if (map) map.destroy();
        };
    }, [address, name]);

    if (failed) {
        // No token configured, or the map failed to load — link out instead.
        return (
            <a
                className="event-map event-map-fallback"
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className="event-map-fallback-name">{name}</span>
                <span className="event-map-fallback-address">{address}</span>
                <span className="event-map-fallback-cta">
                    Open in Apple Maps →
                </span>
            </a>
        );
    }

    return (
        <div
            className="event-map"
            ref={ref}
            role="img"
            aria-label={`Map showing ${name}`}
        />
    );
}
