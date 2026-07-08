import { redirect } from "next/navigation";
import type { Viewport } from "next";
import { readSession } from "@/lib/session";
import AuthBrand from "../components/AuthBrand";
import LoginForm from "./LoginForm";

// Overrides the root layout's dark theme-color so Safari's toolbar tint
// matches this page's white background instead of the hero's midnight.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Server Component shell. Already signed in? Skip straight to the dashboard.
export default async function LoginPage() {
  if (await readSession()) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-split">
      {/* Left: form column */}
      <div className="auth-form-col">
        <AuthBrand />

        <div className="auth-form-inner">
          <LoginForm />
        </div>

        <p className="auth-footer">
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>
        </p>
      </div>

      {/* Right: brand visual panel with a minimalist Thai floral pattern */}
      <div className="auth-visual" aria-hidden="true">
        <div className="auth-visual-inner" />
      </div>
    </main>
  );
}
