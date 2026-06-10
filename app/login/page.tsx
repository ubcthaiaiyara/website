import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";
import LoginForm from "./LoginForm";

// Server Component shell. Already signed in? Skip straight to the dashboard.
export default async function LoginPage() {
  if (await readSession()) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-main">
      <h1>Member Login</h1>
      <p>Sign in to download your membership pass.</p>
      <LoginForm />
    </main>
  );
}
