"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import LogoutButton from "./LogoutButton";
import MembershipCard from "../components/MembershipCard";
import EyeIcon from "../components/EyeIcon";

type Props = {
    name: string;
    email: string;
    faculty: string;
    program: string;
    year: string;
    memberSince: string;
    serial: string;
    hasPassword: boolean;
    hasGoogle: boolean;
};

const TABS = [
    { id: "membership", label: "Membership" },
    { id: "account", label: "Profile" },
    { id: "security", label: "Security" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type TabIndicator = {
    x: number;
    y: number;
    width: number;
    height: number;
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

// Settings with a left category nav and a right content panel. The Account tab
// is an editable form; the Membership tab shows the 3D card + wallet badges.
export default function AccountView(props: Props) {
    const [tab, setTab] = useState<TabId>("membership");
    const tabsRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
        account: null,
        security: null,
        membership: null,
    });
    const [tabIndicator, setTabIndicator] = useState<TabIndicator>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [initialFirst, initialLast] = splitName(props.name);
    const [firstName, setFirstName] = useState(initialFirst);
    const [lastName, setLastName] = useState(initialLast);
    const [faculty, setFaculty] = useState(props.faculty);
    const [program, setProgram] = useState(props.program);
    const [year, setYear] = useState(props.year);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Set / change password. Members who signed in with an email code or Google
    // have no password yet; this lets them add one. If one already exists
    // (props.hasPassword), the current password is required to change it.
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwSaved, setPwSaved] = useState(false);
    const [pwError, setPwError] = useState<string | null>(null);
    const [googleConnected, setGoogleConnected] = useState(props.hasGoogle);
    const [googleSaving, setGoogleSaving] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Result of the Google connect round trip (redirected back with a query).
    // Held in state (not read live) and dismissable; the query is stripped on
    // mount so a refresh doesn't re-show it.
    const searchParams = useSearchParams();
    const [googleNotice, setGoogleNotice] = useState<
        "success" | "error" | null
    >(
        searchParams.get("connected") === "google"
            ? "success"
            : searchParams.get("error") === "google-link"
              ? "error"
              : null,
    );
    const [googleNoticeReason] = useState(searchParams.get("reason"));

    useEffect(() => {
        if (searchParams.get("connected") || searchParams.get("error")) {
            window.history.replaceState(null, "", window.location.pathname);
        }
        // Run once on mount to clear the one-time result query.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPwError(null);

        if (props.hasPassword && currentPassword.length === 0) {
            setPwError("Enter your current password.");
            return;
        }
        if (newPassword.length < 8) {
            setPwError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError("Passwords don't match.");
            return;
        }

        setPwSaving(true);
        try {
            const res = await fetch("/api/account/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: newPassword,
                    currentPassword,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(
                    data.error ?? "Couldn't update password. Please try again.",
                );
            }

            setPwSaved(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPwError(err instanceof Error ? err.message : "Unexpected error.");
        } finally {
            setPwSaving(false);
        }
    }

    async function handleDeleteSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setDeleteError(null);

        if (deleteConfirm !== props.email) {
            setDeleteError("Enter your email to confirm account deletion.");
            return;
        }
        if (deletePassword.length === 0) {
            setDeleteError("Enter your password to delete your account.");
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch("/api/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(
                    data.error ?? "Couldn't delete account. Please try again.",
                );
            }

            window.location.assign("/");
        } catch (err) {
            setDeleteError(
                err instanceof Error ? err.message : "Unexpected error.",
            );
            setDeleting(false);
        }
    }

    async function handleDisconnectGoogle() {
        setGoogleSaving(true);
        setGoogleError(null);

        try {
            const res = await fetch("/api/account/providers/google", {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(
                    data.error ?? "Could not disconnect Google.",
                );
            }

            setGoogleConnected(false);
        } catch (err) {
            setGoogleError(
                err instanceof Error ? err.message : "Unexpected error.",
            );
        } finally {
            setGoogleSaving(false);
        }
    }

    useLayoutEffect(() => {
        const updateIndicator = () => {
            const tabs = tabsRef.current;
            const activeTab = tabRefs.current[tab];
            if (!tabs || !activeTab) return;

            const tabsRect = tabs.getBoundingClientRect();
            const activeRect = activeTab.getBoundingClientRect();
            setTabIndicator({
                x: activeRect.left - tabsRect.left,
                y: activeRect.top - tabsRect.top,
                width: activeRect.width,
                height: activeRect.height,
            });
        };

        updateIndicator();

        const resizeObserver =
            typeof ResizeObserver === "undefined"
                ? null
                : new ResizeObserver(updateIndicator);

        if (resizeObserver) {
            if (tabsRef.current) resizeObserver.observe(tabsRef.current);
            TABS.forEach((t) => {
                const node = tabRefs.current[t.id];
                if (node) resizeObserver.observe(node);
            });
        }

        window.addEventListener("resize", updateIndicator);
        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener("resize", updateIndicator);
        };
    }, [tab]);

    return (
        <div className="account">
            <aside className="account-nav">
                <div className="account-tabs" ref={tabsRef}>
                    <span
                        className="account-tab-indicator"
                        aria-hidden="true"
                        style={{
                            width: tabIndicator.width,
                            height: tabIndicator.height,
                            transform: `translate(${tabIndicator.x}px, ${tabIndicator.y}px)`,
                        }}
                    />
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            ref={(node) => {
                                tabRefs.current[t.id] = node;
                            }}
                            type="button"
                            className={`account-tab${tab === t.id ? " is-active" : ""}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className={`account-nav-foot${tab === "membership" ? " is-hidden" : ""}`}>
                    <LogoutButton />
                </div>
            </aside>

            <section className="account-panel">
                {tab === "membership" && (
                    <div className="membership-panel">
                        <div className="settings-membership">
                            <MembershipCard
                                name={firstName || "Member"}
                                since={
                                    props.memberSince.match(/\d{4}/)?.[0] ??
                                    "2025"
                                }
                                label="Membership"
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
                            </div>
                        </div>
                    </div>
                )}

                {tab === "account" && (
                    <form className="settings-section" onSubmit={handleSubmit}>
                        <h2 className="settings-section-title">
                            Personal details
                        </h2>

                        <div className="settings-rows">
                            <div className="settings-row">
                                <span className="settings-row-name">Name</span>
                                <div className="settings-row-control settings-name">
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) =>
                                            onChange(setFirstName)(
                                                e.target.value,
                                            )
                                        }
                                        autoComplete="given-name"
                                        aria-label="First name"
                                        placeholder="First name"
                                    />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) =>
                                            onChange(setLastName)(
                                                e.target.value,
                                            )
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

                </div>

                        {error && <p className="error">{error}</p>}

                        <div className="settings-actions">
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

                {tab === "security" && (
                    <>
                    {googleNotice && (
                        <div
                            className={`settings-notice ${googleNotice === "success" ? "is-success" : "is-error"}`}
                        >
                            <span>
                                {googleNotice === "success"
                                    ? "Google connected."
                                    : `Couldn't connect Google${googleNoticeReason ? `: ${googleNoticeReason}` : "."}`}
                            </span>
                            <button
                                type="button"
                                className="settings-notice-dismiss"
                                onClick={() => setGoogleNotice(null)}
                                aria-label="Dismiss"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <section className="settings-section">
                        <h2 className="settings-section-title">Email</h2>
                        <p className="settings-row-desc">
                            Your email can&apos;t be changed.
                        </p>

                        <div className="settings-rows">
                            <div className="settings-row">
                                <label
                                    className="settings-row-name"
                                    htmlFor="email"
                                >
                                    Email address
                                </label>
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
                    </section>

                    <form
                        className="settings-section settings-subsection"
                        onSubmit={handlePasswordSubmit}
                    >
                        <h2 className="settings-section-title">Password</h2>
                        <p className="settings-row-desc">
                            {props.hasPassword
                                ? "Change your password. Enter your current one to confirm."
                                : "Set a password to sign in without an emailed code."}
                        </p>

                        <div className="settings-rows">
                            {props.hasPassword && (
                                <div className="settings-row">
                                    <label
                                        className="settings-row-name"
                                        htmlFor="current-password"
                                    >
                                        Current password
                                    </label>
                                    <div className="settings-row-control">
                                        <div className="password-field">
                                            <input
                                                id="current-password"
                                                type={
                                                    showCurrent
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={currentPassword}
                                                onChange={(e) => {
                                                    setCurrentPassword(
                                                        e.target.value,
                                                    );
                                                    setPwSaved(false);
                                                    setPwError(null);
                                                }}
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                                aria-label="Current password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowCurrent((v) => !v)
                                                }
                                                aria-label={
                                                    showCurrent
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                aria-pressed={showCurrent}
                                            >
                                                <EyeIcon open={showCurrent} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="settings-row">
                                <label
                                    className="settings-row-name"
                                    htmlFor="new-password"
                                >
                                    New password
                                </label>
                                <div className="settings-row-control">
                                    <div className="password-field">
                                        <input
                                            id="new-password"
                                            type={showNew ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setPwSaved(false);
                                                setPwError(null);
                                            }}
                                            autoComplete="new-password"
                                            placeholder="At least 8 characters"
                                            aria-label="New password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowNew((v) => !v)
                                            }
                                            aria-label={
                                                showNew
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            aria-pressed={showNew}
                                        >
                                            <EyeIcon open={showNew} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-row">
                                <label
                                    className="settings-row-name"
                                    htmlFor="confirm-password"
                                >
                                    Confirm
                                </label>
                                <div className="settings-row-control">
                                    <div className="password-field">
                                        <input
                                            id="confirm-password"
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(
                                                    e.target.value,
                                                );
                                                setPwSaved(false);
                                                setPwError(null);
                                            }}
                                            autoComplete="new-password"
                                            placeholder="Re-enter password"
                                            aria-label="Confirm password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirm((v) => !v)
                                            }
                                            aria-label={
                                                showConfirm
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            aria-pressed={showConfirm}
                                        >
                                            <EyeIcon open={showConfirm} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {pwError && <p className="error">{pwError}</p>}

                        <div className="settings-actions">
                            <button
                                className="button"
                                type="submit"
                                disabled={pwSaving}
                            >
                                {pwSaving
                                    ? "Saving…"
                                    : pwSaved
                                      ? "Saved ✓"
                                      : props.hasPassword
                                        ? "Update password"
                                        : "Set password"}
                            </button>
                        </div>
                    </form>

                    <section className="settings-section settings-subsection">
                        <h2 className="settings-section-title">
                            Sign-in methods
                        </h2>
                        <p className="settings-row-desc">
                            Sign in with these services for faster sign-in.
                        </p>

                        <div className="settings-rows">
                            <div className="settings-row settings-row-inline-mobile">
                                <span className="settings-row-info">
                                    <span className="settings-row-heading">
                                        <span className="settings-row-name">
                                            Google
                                        </span>
                                        {googleConnected && (
                                            <span className="settings-status">
                                                Connected
                                            </span>
                                        )}
                                    </span>
                                </span>
                                <div className="settings-row-control settings-inline-action">
                                    {googleConnected ? (
                                        <button
                                            className="button button-ghost settings-action-button"
                                            type="button"
                                            onClick={handleDisconnectGoogle}
                                            disabled={googleSaving}
                                        >
                                            {googleSaving
                                                ? "Disconnecting..."
                                                : "Disconnect"}
                                        </button>
                                    ) : (
                                        <a
                                            className="button button-ghost settings-action-button"
                                            href="/api/account/providers/google/link/start"
                                        >
                                            <svg
                                                className="oauth-icon"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fill="#4285F4"
                                                    d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.74Z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 24c3.24 0 5.96-1.08 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.28a12 12 0 0 0 0 10.8l4.01-3.1Z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
                                                />
                                            </svg>
                                            Connect Google
                                        </a>
                                    )}
                                </div>
                            </div>
                            {googleError && (
                                <p className="error">{googleError}</p>
                            )}
                        </div>
                    </section>

                    <form
                        className="settings-section settings-subsection danger-zone"
                        onSubmit={handleDeleteSubmit}
                    >
                        <h2 className="settings-section-title">
                            Delete account
                        </h2>
                        <p className="settings-row-desc">
                            Permanently delete your member profile, sign-in
                            account, and wallet pass access. This can&apos;t be
                            undone.
                        </p>

                        <div className="settings-rows">
                            <div className="settings-row">
                                <span className="settings-row-info">
                                    <label
                                        className="settings-row-name"
                                        htmlFor="delete-confirm"
                                    >
                                        Confirm email
                                    </label>
                                    <span className="settings-row-desc">
                                        Type {props.email} to continue.
                                    </span>
                                </span>
                                <div className="settings-row-control">
                                    <input
                                        id="delete-confirm"
                                        type="email"
                                        value={deleteConfirm}
                                        onChange={(e) => {
                                            setDeleteConfirm(e.target.value);
                                            setDeleteError(null);
                                        }}
                                        autoComplete="off"
                                        placeholder={props.email}
                                    />
                                </div>
                            </div>

                            <div className="settings-row">
                                <span className="settings-row-info">
                                    <label
                                        className="settings-row-name"
                                        htmlFor="delete-password"
                                    >
                                        Password
                                    </label>
                                    <span className="settings-row-desc">
                                        Enter your current password.
                                    </span>
                                </span>
                                <div className="settings-row-control">
                                    <div className="password-field">
                                        <input
                                            id="delete-password"
                                            type={
                                                showDeletePassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={deletePassword}
                                            onChange={(e) => {
                                                setDeletePassword(
                                                    e.target.value,
                                                );
                                                setDeleteError(null);
                                            }}
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowDeletePassword(
                                                    (v) => !v,
                                                )
                                            }
                                            aria-label={
                                                showDeletePassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            aria-pressed={showDeletePassword}
                                        >
                                            <EyeIcon
                                                open={showDeletePassword}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {deleteError && (
                            <p className="error">{deleteError}</p>
                        )}

                        <div className="settings-actions">
                            <button
                                className="button danger-button"
                                type="submit"
                                disabled={
                                    deleting ||
                                    deleteConfirm !== props.email ||
                                    deletePassword.length === 0
                                }
                            >
                                {deleting ? "Deleting…" : "Delete account"}
                            </button>
                        </div>
                    </form>
                    </>
                )}
            </section>
        </div>
    );
}
