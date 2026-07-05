"use client";

import { useState } from "react";
import EyeIcon from "../components/EyeIcon";

type Step = "email" | "otp" | "password";

// Client login flow. Step 1 collects an email and (once wired up) requests a
// one-time code; step 2 verifies that code; a password fallback is offered as
// an alternative. The password path posts to the existing /api/auth/login.
export default function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 → request an email code, then advance to the OTP step.
  async function handleEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // TODO: POST { email } to a "send login code" endpoint before advancing.
    setStep("otp");
  }

  // Step 2 → verify the code.
  async function handleOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    // TODO: verify { email, code } and, on success, redirect to the dashboard.
    setSubmitting(false);
  }

  // Password fallback → the existing password login.
  async function handlePassword(event: React.FormEvent<HTMLFormElement>) {
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

      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setSubmitting(false);
    }
  }

  function resend() {
    setError(null);
    // TODO: re-request a login code for `email`.
  }

  // Return to the first (email) step, clearing any entered code/password.
  function backToStart() {
    setError(null);
    setCode("");
    setPassword("");
    setStep("email");
  }

  if (step === "otp") {
    return (
      <>
        <h1>Check your inbox</h1>
        <p className="auth-subtext">
          Enter the verification code we just sent to {email}
        </p>
        <form className="card" onSubmit={handleOtp}>
          <div className="field">
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
              aria-label="Verification code"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Verifying…" : "Continue"}
          </button>
          <button type="button" className="link-button" onClick={resend}>
            Resend email
          </button>

          <div className="oauth-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="oauth-button"
            onClick={() => {
              setError(null);
              setStep("password");
            }}
          >
            Continue with password
          </button>
          <button type="button" className="link-button" onClick={backToStart}>
            <svg
              className="chevron"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z"
                fill="currentColor"
              />
            </svg>
            Go back
          </button>
        </form>
      </>
    );
  }

  if (step === "password") {
    return (
      <>
        <h1>Welcome back!</h1>
        <p className="auth-subtext">Signing in as {email}</p>
        <form className="card" onSubmit={handlePassword}>
          <div className="field">
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-label="Password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Continue"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setError(null);
              setStep("otp");
            }}
          >
            Use email code instead
          </button>
          <button type="button" className="link-button" onClick={backToStart}>
            <svg
              className="chevron"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z"
                fill="currentColor"
              />
            </svg>
            Go back
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <h1>Welcome back!</h1>
      <form className="card" onSubmit={handleEmail}>
        <div className="field">
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email address"
            aria-label="Email"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          Continue with email
        </button>

        <div className="oauth-divider">
          <span>OR</span>
        </div>

        {/* TODO: wire up Google OAuth — presentation only for now. */}
        <button type="button" className="oauth-button">
          <svg className="oauth-icon" viewBox="0 0 24 24" aria-hidden="true">
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
          Sign in with Google
        </button>

        <p className="form-alt">
          Don&apos;t have an account? <a href="/join">Sign up</a>
        </p>
      </form>
    </>
  );
}
