import Link from "next/link";
import Image from "next/image";
import JoinForm from "./JoinForm";

// Server Component shell. Mirrors the login page's split-screen layout: a white
// form column on the left, the brand gradient panel on the right.
export default function JoinPage() {
  return (
    <main className="auth-split">
      {/* Left: form column */}
      <div className="auth-form-col">
        <Link href="/" className="auth-brand">
          <Image
            src="/elephant.png"
            alt="UBC Thai Aiyara"
            width={81}
            height={109}
            priority
          />
        </Link>

        <div className="auth-form-inner">
          <JoinForm />
        </div>

        <p className="auth-footer">
          By creating an account, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      {/* Right: brand visual panel with a minimalist Thai floral pattern */}
      <div className="auth-visual" aria-hidden="true">
        <div className="auth-visual-inner" />
      </div>
    </main>
  );
}
