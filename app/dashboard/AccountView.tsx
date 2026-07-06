"use client";

import { useState } from "react";
import LogoutButton from "./LogoutButton";
import MembershipCard from "../components/MembershipCard";

type Props = {
    name: string;
    email: string;
    faculty: string;
    program: string;
    year: string;
    memberSince: string;
    serial: string;
};

const YEAR_OPTIONS = [
    "1st year",
    "2nd year",
    "3rd year",
    "4th year",
    "5th+ year",
    "Graduate",
];

const FACULTY_OPTIONS = [
    "Applied Science",
    "Architecture and Landscape Architecture",
    "Arts",
    "Audiology and Speech Sciences",
    "Business (Sauder)",
    "Community and Regional Planning",
    "Dentistry",
    "Education",
    "Extended Learning",
    "Forestry & Environmental Stewardship",
    "Graduate and Postdoctoral Studies",
    "Information",
    "Journalism",
    "Kinesiology",
    "Land and Food Systems",
    "Law",
    "Medicine",
    "Music",
    "Nursing",
    "Pharmaceutical Sciences",
    "Population and Public Health",
    "Public Policy and Global Affairs",
    "Science",
    "Social Work",
    "UBC Vantage College",
    "Vancouver School of Economics",
];

function splitName(full: string): [string, string] {
    const parts = full.trim().split(/\s+/);
    return [parts[0] ?? "", parts.slice(1).join(" ")];
}

// Substack-style settings: a single centered column titled "Settings" with
// stacked sections (Personal details, Membership, sign out). Each field is a
// row — label on the left, editable control on the right — split by hairlines.
export default function AccountView(props: Props) {
    const [initialFirst, initialLast] = splitName(props.name);
    const [firstName, setFirstName] = useState(initialFirst);
    const [lastName, setLastName] = useState(initialLast);
    const [faculty, setFaculty] = useState(props.faculty);
    const [program, setProgram] = useState(props.program);
    const [year, setYear] = useState(props.year);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function onChange<T>(setter: (v: T) => void) {
        return (value: T) => {
            setter(value);
            setSaved(false);
            setError(null);
        };
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/account", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    faculty,
                    program,
                    year,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(
                    data.error ?? "Couldn't save. Please try again.",
                );
            }

            setSaved(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="settings">
            <section className="settings-section">
                <h2 className="settings-section-title">My membership card</h2>
                <div className="settings-membership">
                    <MembershipCard
                        name={firstName || "Member"}
                        since={props.memberSince.match(/\d{4}/)?.[0] ?? "2025"}
                        label="Aiyara Member"
                    />
                    <div className="wallet-badges">
                        <a
                            className="wallet-badge"
                            href={`/api/passes/${props.serial}`}
                            aria-label="Add to Apple Wallet"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/add-to-apple-wallet.svg"
                                alt="Add to Apple Wallet"
                            />
                        </a>

                        {/* Presentational only — Google Wallet pass generation
                            is not wired up yet. */}
                        <button
                            type="button"
                            className="wallet-badge-google"
                            aria-label="Add to Google Wallet"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/add-to-google-wallet.svg"
                                alt="Add to Google Wallet"
                            />
                        </button>
                    </div>
                </div>
            </section>

            <form className="settings-section" onSubmit={handleSubmit}>
                <h2 className="settings-section-title">Personal details</h2>

                <div className="settings-rows">
                    <div className="settings-row">
                        <span className="settings-row-name">Name</span>
                        <div className="settings-row-control settings-name">
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) =>
                                    onChange(setFirstName)(e.target.value)
                                }
                                autoComplete="given-name"
                                aria-label="First name"
                                placeholder="First name"
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) =>
                                    onChange(setLastName)(e.target.value)
                                }
                                autoComplete="family-name"
                                aria-label="Last name"
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <label className="settings-row-name" htmlFor="faculty">
                            Faculty
                        </label>
                        <div className="settings-row-control">
                            <select
                                id="faculty"
                                value={faculty}
                                onChange={(e) =>
                                    onChange(setFaculty)(e.target.value)
                                }
                            >
                                <option value="">Select faculty</option>
                                {FACULTY_OPTIONS.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="settings-row">
                        <label className="settings-row-name" htmlFor="program">
                            Program
                        </label>
                        <div className="settings-row-control">
                            <input
                                id="program"
                                type="text"
                                value={program}
                                onChange={(e) =>
                                    onChange(setProgram)(e.target.value)
                                }
                                placeholder="e.g. Integrated Engineering"
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <label className="settings-row-name" htmlFor="year">
                            Year
                        </label>
                        <div className="settings-row-control">
                            <select
                                id="year"
                                value={year}
                                onChange={(e) =>
                                    onChange(setYear)(e.target.value)
                                }
                            >
                                <option value="">Select year</option>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="settings-row">
                        <span className="settings-row-info">
                            <label
                                className="settings-row-name"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <span className="settings-row-desc">
                                Your email can&apos;t be changed.
                            </span>
                        </span>
                        <div className="settings-row-control">
                            <input
                                id="email"
                                type="email"
                                value={props.email}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {error && <p className="error">{error}</p>}

                <div className="settings-actions">
                    <button className="button" type="submit" disabled={saving}>
                        {saving
                            ? "Saving…"
                            : saved
                              ? "Saved ✓"
                              : "Save changes"}
                    </button>
                </div>
            </form>

            <section className="settings-section settings-signout">
                <LogoutButton />
            </section>
        </div>
    );
}
