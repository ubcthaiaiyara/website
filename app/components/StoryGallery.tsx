"use client";

import { useEffect, useState } from "react";

// Five-image gallery for the Our Story card. Auto-cycles every few seconds
// (paused under prefers-reduced-motion), advances on click, and has dot
// controls. The slides are placeholder gradients for now — swap each
// .story-slide-N background for a real photo (or a next/image).
const COUNT = 5;

export default function StoryGallery() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % COUNT),
      4000,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="story-gallery">
      <button
        type="button"
        className="story-gallery-viewport"
        onClick={() => setIndex((i) => (i + 1) % COUNT)}
        aria-label="Next photo"
      >
        {Array.from({ length: COUNT }).map((_, i) => (
          <span
            key={i}
            className={`story-slide story-slide-${i}${
              i === index ? " is-active" : ""
            }`}
          />
        ))}
      </button>

      <div className="story-dots">
        {Array.from({ length: COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`story-dot${i === index ? " is-active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
