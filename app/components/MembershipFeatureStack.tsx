"use client";

import { type CSSProperties, useState } from "react";

type Feature = {
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        title: "Events all year round",
        description:
            "Songkran, Loy Krathong, food nights, socials, and more. There’s always something happening.",
    },
    {
        title: "Apple Wallet pass",
        description: "Your membership, always in your pocket.",
    },
    {
        title: "Mentorship",
        description:
            "Roon Pee–Roon Norng guidance from those who’ve been there.",
    },
    {
        title: "A community that feels like family",
        description:
            "Friends who make being far from home feel a little closer.",
    },
];

const rotations = [-2.5, 2, -1.5, 2.5];

export default function MembershipFeatureStack() {
    const [activeIndex, setActiveIndex] = useState(0);
    const nextIndex = (activeIndex + 1) % features.length;

    return (
        <div className="feature-stack-wrap">
            <div className="feature-stack" aria-live="polite">
                {features.map((feature, index) => {
                    const stackIndex =
                        (index - activeIndex + features.length) % features.length;
                    const isActive = stackIndex === 0;

                    return (
                        <button
                            key={feature.title}
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
                                    ? `Show next feature: ${features[nextIndex].title}`
                                    : undefined
                            }
                        >
                            <span className="feature-stack-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="feature-stack-content">
                                <strong>{feature.title}</strong>
                                <span>{feature.description}</span>
                            </span>
                            {isActive && (
                                <span className="feature-stack-hint">Click to reveal</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
