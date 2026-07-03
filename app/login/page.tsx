import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { readSession } from "@/lib/session";
import LoginForm from "./LoginForm";

// Server Component shell. Already signed in? Skip straight to the dashboard.
export default async function LoginPage() {
  if (await readSession()) {
    redirect("/dashboard");
  }

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
          <span>Aiyara</span>
        </Link>

        <div className="auth-form-inner">
          <h1>Welcome back</h1>
          <LoginForm />
        </div>
      </div>

      {/* Right: brand visual panel with a minimalist Thai floral pattern */}
      <div className="auth-visual" aria-hidden="true">
        <div className="auth-visual-inner" />
      </div>
    </main>
  );
}
