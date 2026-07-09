"use client";

import { useState } from "react";
import EyeIcon from "../components/EyeIcon";
import OtpInput from "../components/OtpInput";
import { firstAutofilledEmail } from "@/lib/email-autofill";
import { useCountdown, parseWaitSeconds } from "../hooks/useCountdown";

type Step = "details" | "otp" | "password" | "confirm-email";

// How long to disable "Resend code" after a code is sent. A server rate-limit
// response overrides this with the exact wait it asks for.
const RESEND_COOLDOWN_SECONDS = 30;

// Client sign-up flow, ordered like the reference: name + email first with a
// primary "Continue", then a Google option, then the sign-in link. "Continue"
// advances to an emailed verification code (passwordless, matching login); a
// password fallback is offered as an alternative that creates the account
// directly via the existing /api/auth/signup endpoint.
export default function JoinForm() {
  const [step, setStep] = useState<Step>("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, startResendCountdown] = useCountdown();

  // Step 1 → validate the details, send a signup OTP, then advance to the code
  // step. Names are trimmed so whitespace-only input is rejected here.
  async function handleDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (firstName.trim().length === 0) {
      setError("Please enter your first name.");
      setSubmitting(false);
      return;
    }
    if (lastName.trim().length === 0) {
      setError("Please enter your last name.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/otp/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "signup",
          name: `${firstName} ${lastName}`.trim(),
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not send a confirmation code.");
      }

      setStep("otp");
      startResendCountdown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  // Step 2 → verify the code and finish creating/signing into the account.
  async function handleOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: code,
          name: `${firstName} ${lastName}`.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Invalid or expired code.");
      }

      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setSubmitting(false);
    }
  }

  // Password fallback → create the account via the existing signup endpoint,
  // which hashes the password, signs the member in, and returns their serial.
  async function handlePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 202) {
        setCode("");
        setStep("confirm-email");
        startResendCountdown(RESEND_COOLDOWN_SECONDS);
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setSubmitting(false);
    }
  }

  async function resend() {
    if (resendIn > 0) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/otp/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "signup",
          name: `${firstName} ${lastName}`.trim(),
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // If the server is rate-limiting, count down the exact wait it returned.
        startResendCountdown(parseWaitSeconds(data.error) ?? RESEND_COOLDOWN_SECONDS);
        throw new Error(data.error ?? "Could not resend the code.");
      }

      startResendCountdown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "confirm-email") {
    return (
      <>
        <h1>Confirm your email</h1>
        <p className="auth-subtext">
          Enter the confirmation code we sent to {email}
        </p>
        <form className="card" onSubmit={handleOtp}>
          <OtpInput
            id="confirm-code"
            value={code}
            onChange={setCode}
            disabled={submitting}
            label="Confirmation code"
          />
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Verifying…" : "Continue"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={resend}
            disabled={submitting || resendIn > 0}
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setError(null);
              setPassword("");
              setStep("details");
            }}
          >
            Use a different email
          </button>
        </form>
      </>
    );
  }

  if (step === "otp") {
    return (
      <>
        <h1>Check your inbox</h1>
        <p className="auth-subtext">
          Enter the verification code we just sent to {email}
        </p>
        <form className="card" onSubmit={handleOtp}>
          <OtpInput
            id="code"
            value={code}
            onChange={setCode}
            disabled={submitting}
            label="Verification code"
          />
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Verifying…" : "Continue"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={resend}
            disabled={submitting || resendIn > 0}
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
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
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setError(null);
              setStep("details");
            }}
          >
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
        <h1>Create account</h1>
        <p className="auth-subtext">Creating your account as {email}</p>
        <form className="card" onSubmit={handlePassword}>
          <div className="field">
            <div className="password-field">
              <input
                id="password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Create a password (8+ characters)"
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
            {submitting ? "Creating account…" : "Continue"}
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
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setError(null);
              setPassword("");
              setStep("details");
            }}
          >
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
      <h1>Create account</h1>
      <form className="card" onSubmit={handleDetails}>
        <div className="name-row">
          <div className="field">
            <input
              id="firstName"
              name="given-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              placeholder="First name *"
              aria-label="First name"
            />
          </div>
          <div className="field">
            <input
              id="lastName"
              name="family-name"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              placeholder="Last name *"
              aria-label="Last name"
            />
          </div>
        </div>
        <div className="field">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(firstAutofilledEmail(e.target.value))}
            autoComplete="email"
            placeholder="Enter your email address *"
            aria-label="Email"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Sending code…" : "Continue"}
        </button>

        <div className="oauth-divider">
          <span>OR</span>
        </div>

        <a className="oauth-button" href="/api/auth/google/start?mode=signup">
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
          Sign up with Google
        </a>

        <p className="form-alt">
          Already a member? <a href="/login">Log in</a>
        </p>
      </form>
    </>
  );
}
