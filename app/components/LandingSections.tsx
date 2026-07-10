import Link from "next/link";
import FloatingSection from "./FloatingSection";
import VoiceCarousel from "./VoiceCarousel";
import StoryGallery from "./StoryGallery";

// Landing-page content sections, in the recommended scroll order. Each wraps its
// content in <FloatingSection> so it rises + fades in on first scroll into view.
// Copy here is PLACEHOLDER — search for "TODO:" and swap in real details as the
// club gathers them. The whole file is content-only; drop or reorder sections
// freely on the home page.

// 0. Stats band — a full-bleed dark strip that sits right after the hero to
//    break the hero's gradient from the content gradient below. Doubles as quick
//    social proof. Numbers are PLACEHOLDER.
export function StatsSection() {
    const stats = [
        // TODO: real numbers.
        { value: "[20XX]", label: "Established" },
        { value: "[150+]", label: "Members" },
        { value: "[20+]", label: "Events a year" },
        { value: "[∞]", label: "Friendships made" },
    ];
    return (
        <FloatingSection as="div" className="stats-band">
            <div className="stats-inner">
                {stats.map((s, i) => (
                    <div key={i} className="stat">
                        <span className="stat-value">{s.value}</span>
                        <span className="stat-label">{s.label}</span>
                    </div>
                ))}
            </div>
        </FloatingSection>
    );
}

// 1. Our Story — founding + mission. A dated origin paragraph builds trust
//    cheaply; fill in the real year, founders, and "why".
export function StorySection() {
    return (
        <FloatingSection id="about" className="section">
            <span className="section-label">Our story</span>
            <h2>How Thai Aiyara began.</h2>
            <div className="float-card story-card">
                <div className="story-text">
                    <p className="lead">
                        UBC Thai Aiyara is a social and cultural club under the
                        Alma Mater Society at the University of British Columbia.
                        It was founded over 10 years ago and has since been a
                        family and a second &quot;home away from home&quot; for
                        Thai students studying at UBC.
                    </p>
                    <p className="lead">
                        Thai Aiyara aims to promote Thai culture as well as bring
                        together the community of Thai students at UBC through
                        hosting a variety of amusing social and cultural
                        activities during the academic year, along with casual
                        hangouts, retreats, and everything in between! We also
                        partner with other Southeast Asian (SEA) groups to host
                        events throughout the year, such as Taste of SEA. Feel
                        free to contact any of our executives or members if
                        you&apos;re interested in getting involved!
                    </p>
                </div>

                <StoryGallery />
            </div>
        </FloatingSection>
    );
}

// 2. What we do — culture & events, photo-forward. Replace the placeholder
//    tiles with real event photos + names (Songkran, Loy Krathong, socials…).
export function WhatWeDoSection() {
    const items = [
        // TODO: replace with real events + photos.
        {
            title: "Festivals",
            blurb: "Celebrate Songkran, Loy Krathong, and the moments that bring Thai culture to campus.",
            visual: "festival",
        },
        {
            title: "Food nights",
            blurb: "Gather over Thai food, snacks, and familiar flavours when campus starts to feel far from home.",
            visual: "food",
        },
        {
            title: "Socials",
            blurb: "Meet friends, bring friends, and find people who make UBC feel smaller.",
            visual: "social",
        },
    ];
    return (
        <FloatingSection id="what-we-do" className="section win-section culture-section">
            <span className="section-label">What we do</span>
            <h2>Culture, food, and friends.</h2>
            <p className="win-intro">
                {/* TODO: one-line intro to the kinds of things you run. */}
                From festivals to food nights, here&apos;s a taste of what a year
                with Thai Aiyara looks like.
            </p>
            <div className="win-grid culture-grid">
                {items.map((item, i) => (
                    <article key={i} className="win-card culture-card">
                        <div
                            className={`win-visual culture-visual culture-${item.visual}`}
                            aria-hidden="true"
                        />
                        <div className="win-body">
                            <h3>{item.title}</h3>
                            <p>{item.blurb}</p>
                        </div>
                    </article>
                ))}
            </div>
        </FloatingSection>
    );
}

// 3. Voices — member testimonials about belonging (not careers). Attribution
//    can be "Member, Class of 20XX". 3–5 quotes works well.
export function VoicesSection() {
    const quotes = [
        // TODO: real quotes + attributions.
        {
            quote: "[A sentence or two about what the club meant to you.]",
            name: "[Member name]",
            detail: "[Member, Class of 20XX]",
        },
        {
            quote: "[A sentence or two about what the club meant to you.]",
            name: "[Member name]",
            detail: "[Member, Class of 20XX]",
        },
        {
            quote: "[A sentence or two about what the club meant to you.]",
            name: "[Member name]",
            detail: "[Member, Class of 20XX]",
        },
        {
            quote: "[A sentence or two about finding friends, culture, or support through the club.]",
            name: "[Member name]",
            detail: "[Member, Class of 20XX]",
        },
        {
            quote: "[A sentence or two about a favourite event or memory with Thai Aiyara.]",
            name: "[Member name]",
            detail: "[Member, Class of 20XX]",
        },
        {
            quote: "[A sentence or two about feeling welcomed at UBC through the community.]",
            name: "[Member name]",
            detail: "[Member, Class of 20XX]",
        },
    ];
    return (
        <FloatingSection id="voices" className="section voices-section">
            <span className="section-label">Voices</span>
            <h2>A home away from home.</h2>
            <VoiceCarousel quotes={quotes} />
        </FloatingSection>
    );
}

// 4. Meet the team — warm, faces over org-chart. Cards hold an exec photo,
//    name, and role.
export function TeamSection() {
    const team = [
        // TODO: real execs + photos.
        { name: "[Name]", role: "[Role]" },
        { name: "[Name]", role: "[Role]" },
        { name: "[Name]", role: "[Role]" },
        { name: "[Name]", role: "[Role]" },
    ];
    return (
        <FloatingSection id="team" className="section">
            <span className="section-label">Meet the team</span>
            <h2>The people behind it.</h2>
            <div className="float-grid team-grid">
                {team.map((member, i) => (
                    <article key={i} className="float-card team-card">
                        {/* TODO: swap for a real photo (next/image). */}
                        <div className="team-card-photo" aria-hidden="true" />
                        <h3>{member.name}</h3>
                        <p className="team-role">{member.role}</p>
                    </article>
                ))}
            </div>
        </FloatingSection>
    );
}

// Feature showcase modelled exactly on billow.so's "Smart Insights — Know
// what's working" section: a rounded panel split into a text column (pill,
// two-tone heading, copy, CTA) and a gradient panel holding a floating
// notification card. Content adapted to the club (an event reminder).
export function HighlightSection() {
    return (
        <FloatingSection id="highlights" className="section">
            <div className="insight-panel">
                <div className="insight-left">
                    <span className="insight-badge">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2a7 7 0 0 0-7 7c0 3 -2 4 -2 6h18c0-2-2-3-2-6a7 7 0 0 0-7-7Z" />
                            <path d="M9 20a3 3 0 0 0 6 0" />
                        </svg>
                        Members only
                    </span>
                    <h2 className="insight-title">
                        <span>Stay in the loop.</span>
                        <span className="insight-title-alt">
                            Never miss a moment.
                        </span>
                    </h2>
                    <p className="insight-copy">
                        Every event, social, and festival in one place. Get
                        reminders, RSVP in a tap, and keep your membership pass
                        close — so you&apos;re always part of what&apos;s
                        happening.
                    </p>
                    <Link className="insight-cta" href="/join">
                        Join us
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </Link>
                </div>

                <div className="insight-visual">
                    <div className="insight-card">
                        <div className="insight-card-top">
                            <span className="insight-status">
                                <span className="insight-dot" />
                                This weekend
                            </span>
                            <div className="insight-card-icons">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                        <h3>Songkran is this Saturday</h3>
                        <p>
                            Water fights, Thai food, and music at the AMS Nest.
                            Doors at 5 — bring friends and your membership pass.
                        </p>
                        <div className="insight-tags">
                            <span className="insight-tag">Apr 13</span>
                            <span className="insight-tag">AMS Nest</span>
                            <span className="insight-tag">5:00 PM</span>
                        </div>
                        <div className="insight-card-action">
                            Add to Apple Wallet
                        </div>
                    </div>
                </div>
            </div>
        </FloatingSection>
    );
}

// Bento grid — "what you get as a member", billow-style mixed-size cards.
export function BentoSection() {
    return (
        <FloatingSection id="perks" className="section">
            <span className="section-label">Membership</span>
            <h2>What you get.</h2>
            <div className="bento-grid">
                <article className="float-card bento-card bento-lg">
                    {/* TODO: real perk copy. */}
                    <h3>Events all year round</h3>
                    <p>
                        Songkran, Loy Krathong, food nights, socials, and more —
                        there&apos;s always something happening.
                    </p>
                </article>
                <article className="float-card bento-card">
                    <h3>Apple Wallet pass</h3>
                    <p>Your membership, always in your pocket.</p>
                </article>
                <article className="float-card bento-card">
                    <h3>Mentorship</h3>
                    <p>Roon Pee–Roon Norng guidance from those who&apos;ve been there.</p>
                </article>
                <article className="float-card bento-card bento-wide">
                    <h3>A community that feels like family</h3>
                    <p>Friends who make being far from home feel a little closer.</p>
                </article>
            </div>
        </FloatingSection>
    );
}

// Getting-started section modelled exactly on billow.so's "Your first win is
// five minutes away": centered pill + two-line heading + subheading, then three
// cards, each with a product mockup illustration above a centered title/blurb.
export function JoinStepsSection() {
    return (
        <FloatingSection id="join-steps" className="section win-section">
            <span className="section-label">Getting started</span>
            <h2>Membership is minutes away.</h2>
            <p className="win-intro">
                No long forms, no hassle. Sign up, confirm, and you&apos;re in —
                with your pass ready in Apple Wallet.
            </p>

            <div className="win-grid">
                <article className="win-card">
                    <div className="win-visual">
                        <div className="win-mock win-form">
                            <span className="win-bar" />
                            <span className="win-bar" />
                            <span className="win-bar win-bar-sm" />
                        </div>
                        <span className="win-float win-float-btn">Sign up</span>
                    </div>
                    <div className="win-body">
                        <h3>Create your account</h3>
                        <p>
                            Enter your name and email. That&apos;s it — you&apos;re
                            a member in seconds.
                        </p>
                    </div>
                </article>

                <article className="win-card">
                    <div className="win-visual">
                        <div className="win-mock win-otp">
                            <span>4</span>
                            <span>8</span>
                            <span>2</span>
                            <span>1</span>
                        </div>
                        <span className="win-float win-float-check" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    </div>
                    <div className="win-body">
                        <h3>Confirm your email</h3>
                        <p>
                            Tap the code we send you to verify. Quick and secure.
                        </p>
                    </div>
                </article>

                <article className="win-card">
                    <div className="win-visual">
                        <div className="win-mock win-pass">
                            <span className="win-pass-label">
                                UBC Thai Aiyara
                            </span>
                            <span className="win-pass-name">Member</span>
                        </div>
                        <span className="win-float win-float-time">
                            <strong>1</strong>min
                        </span>
                    </div>
                    <div className="win-body">
                        <h3>Add your Wallet pass</h3>
                        <p>
                            Your membership lives in Apple Wallet, always in your
                            pocket.
                        </p>
                    </div>
                </article>
            </div>
        </FloatingSection>
    );
}

// FAQ accordion — native <details>/<summary>, no JS needed. Answers are
// PLACEHOLDER where marked.
export function FaqSection() {
    // Structure and framing adapted from billow.so's FAQ ("Totally fair to
    // ask"), with the questions rewritten for club membership.
    const faqs = [
        {
            q: "How do I join?",
            a: "Create an account, confirm your email, and add your pass to Apple Wallet. The whole thing takes about a minute.",
        },
        {
            q: "Is there a membership fee?",
            a: "[TODO: membership fee details.]",
        },
        {
            q: "Do I need to be Thai to join?",
            a: "Not at all — everyone who loves Thai culture is welcome here.",
        },
        {
            q: "Can I bring friends?",
            a: "Absolutely. The more the merrier — anyone at UBC can sign up.",
        },
        {
            q: "Is my information secure?",
            a: "Yes. We only use your details to manage your membership, and never share them.",
        },
        {
            q: "What if I have a question?",
            a: "Reach out on Instagram or email contact@ubcthaiaiyara.com — we're happy to help.",
        },
    ];
    return (
        <FloatingSection id="faq" className="section">
            <span className="section-label">FAQ</span>
            <h2>Totally fair to ask.</h2>
            <p className="faq-intro">
                Answers to common questions about joining.
            </p>
            <div className="faq-list">
                {faqs.map((f, i) => (
                    <details key={i} className="faq-item">
                        <summary>
                            <span>{f.q}</span>
                            <span className="faq-icon" aria-hidden="true" />
                        </summary>
                        <div className="faq-answer">
                            <p>{f.a}</p>
                        </div>
                    </details>
                ))}
            </div>
        </FloatingSection>
    );
}

// 5. Join CTA — points at the real membership funnel, not just a social link.
export function JoinCtaSection() {
    return (
        <FloatingSection id="join-cta" className="section billow-cta-section">
            <div className="billow-cta-card">
                <div className="billow-cta-content">
                    <div className="billow-cta-copy">
                        <h2>Stop missing out.</h2>
                        <p>
                            Join UBC Thai Aiyara in minutes. Get your member
                            pass, hear about events first, and stay close to the
                            community.
                        </p>
                    </div>

                    <Link className="billow-cta-button" href="/join">
                        Join today
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </Link>
                </div>

                <div className="billow-cta-clouds" aria-hidden="true">
                    <span className="billow-cloud billow-cloud-one" />
                    <span className="billow-cloud billow-cloud-two" />
                    <span className="billow-cloud billow-cloud-three" />
                </div>
            </div>
        </FloatingSection>
    );
}
