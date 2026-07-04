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

const TABS = [
    { id: "account", label: "Account" },
    { id: "membership", label: "Membership" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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

// Settings-style account view: a left column to pick a category, a right panel
// showing that category's content. The Account tab is an editable form.
export default function AccountView(props: Props) {
    const [tab, setTab] = useState<TabId>("account");

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
        <div className="account">
            <aside className="account-nav">
                <p className="account-greeting">
                    Hi, {firstName || "there"} 👋
                </p>
                <div className="account-tabs">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            className={`account-tab${tab === t.id ? " is-active" : ""}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="account-nav-foot">
                    <LogoutButton />
                </div>
            </aside>

            <section className="account-panel">
                {tab === "account" && (
                    <form className="card account-form" onSubmit={handleSubmit}>
                        <h2 className="card-title">Personal details</h2>

                        <div className="account-form-grid">
                            <div className="field">
                                <label htmlFor="firstName">First name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) =>
                                        onChange(setFirstName)(e.target.value)
                                    }
                                    autoComplete="given-name"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="lastName">Last name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        onChange(setLastName)(e.target.value)
                                    }
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="faculty">Faculty</label>
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

                        <div className="field">
                            <label htmlFor="program">Program</label>
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

                        <div className="field">
                            <label htmlFor="year">Year</label>
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

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={props.email}
                                disabled
                            />
                        </div>

                        {error && <p className="error">{error}</p>}

                        <div className="account-form-actions">
                            <button
                                className="button"
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving…"
                                    : saved
                                      ? "Saved ✓"
                                      : "Save changes"}
                            </button>
                        </div>
                    </form>
                )}

                {tab === "membership" && (
                    <div className="card pass-card">
                        <MembershipCard
                            name={firstName || "Member"}
                            since={
                                props.memberSince.match(/\d{4}/)?.[0] ?? "2025"
                            }
                            label="Aiyara Member"
                        />
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
                        <p className="hint">
                            Opens your <code>.pkpass</code> — add it to Apple
                            Wallet on your iPhone.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
