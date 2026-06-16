"use client";

import { useState } from "react";

// Client component. On success the server sets the session cookie; we then send
// the member to their dashboard.
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      // Full navigation (not router.push) so the request to the session-gated
      // dashboard carries the just-set cookie and the whole shell re-renders
      // signed-in, rather than reusing the Router Cache's signed-out render.
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Signing in…" : "Log in"}
      </button>
      <p className="form-alt">
        New here? <a href="/join">Join the family</a>
      </p>
    </form>
  );
}
