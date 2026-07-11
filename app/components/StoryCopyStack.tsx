"use client";

import { type CSSProperties, useState } from "react";

const storyParagraphs = [
    "UBC Thai Aiyara is a social and cultural club under the Alma Mater Society at the University of British Columbia. It was founded over 10 years ago and has since been a family and a second \"home away from home\" for Thai students studying at UBC.",
    "Thai Aiyara aims to promote Thai culture as well as bring together the community of Thai students at UBC through hosting a variety of amusing social and cultural activities during the academic year, along with casual hangouts, retreats, and everything in between!",
    "We also partner with other Southeast Asian (SEA) groups to host events throughout the year, such as Taste of SEA. Feel free to contact any of our executives or members if you’re interested in getting involved!",
];

const rotations = [-2, 2, -1.5];

export default function StoryCopyStack() {
    const [activeIndex, setActiveIndex] = useState(0);
    const nextIndex = (activeIndex + 1) % storyParagraphs.length;

    return (
        <div className="feature-stack story-copy-stack" aria-live="polite">
            {storyParagraphs.map((paragraph, index) => {
                const stackIndex =
                    (index - activeIndex + storyParagraphs.length) %
                    storyParagraphs.length;
                const isActive = stackIndex === 0;

                return (
                    <button
                        key={paragraph}
                        type="button"
                        className="feature-stack-card"
                        style={
                            {
                                "--stack-index": stackIndex,
                                "--stack-rotation": `${rotations[index]}deg`,
                            } as CSSProperties
                        }
                        onClick={() => {
                            if (isActive) setActiveIndex(nextIndex);
                        }}
                        tabIndex={isActive ? 0 : -1}
                        aria-hidden={!isActive}
                        aria-label={
                            isActive
                                ? `Show the next part of our story`
                                : undefined
                        }
                    >
                        <span className="feature-stack-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="feature-stack-content">
                            <span>{paragraph}</span>
                        </span>
                        {isActive && (
                            <span className="feature-stack-hint">Click to reveal</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
