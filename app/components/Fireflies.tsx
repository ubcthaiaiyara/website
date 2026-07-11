import type { CSSProperties } from "react";

// A full-page firefly field. Rendered once, behind the page content, it drifts
// across the entire scroll height — visible over the dark bands (hero, the lower
// "sunset" into the footer) and naturally washing out over the cream middle,
// which reads as day.
//
// Positions are generated deterministically from the index (a sin-hash, no
// Math.random) so the server and client render identical markup — no hydration
// mismatch. Values: x/y are % positions over the whole page, s is size (px),
// dx/dy the drift vector (px), dur the float period (s), delay the offset (s).
const COUNT = 46;

const PAGE_FIREFLIES = Array.from({ length: COUNT }, (_, i) => {
    // Deterministic pseudo-random in [0,1) keyed by the firefly index + a salt.
    const rand = (salt: number) => {
        const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
        return v - Math.floor(v);
    };
    return {
        x: +(rand(1) * 100).toFixed(2),
        y: +(rand(2) * 100).toFixed(2),
        s: +(2 + rand(3) * 3).toFixed(2),
        dx: +((rand(4) - 0.5) * 48).toFixed(2),
        dy: +((rand(5) - 0.5) * 48).toFixed(2),
        dur: +(8 + rand(6) * 5).toFixed(2),
        delay: +(rand(7) * 4).toFixed(2),
    };
});

export default function Fireflies({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div className={className} aria-hidden="true">
            {PAGE_FIREFLIES.map((f, i) => (
                <span
                    key={i}
                    className="firefly"
                    style={
                        {
                            left: `${f.x}%`,
                            top: `${f.y}%`,
                            width: `${f.s}px`,
                            height: `${f.s}px`,
                            "--dx": `${f.dx}px`,
                            "--dy": `${f.dy}px`,
                            "--dur": `${f.dur}s`,
                            "--delay": `${f.delay}s`,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    );
}
