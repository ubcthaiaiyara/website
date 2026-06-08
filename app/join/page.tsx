import JoinForm from "./JoinForm";

// Server Component shell. Renders the client-side JoinForm.
export default function JoinPage() {
  return (
    <main className="auth-main">
      <h1>Join UBC Thai Aiyara</h1>
      <p>Create your account to get your digital membership pass.</p>
      <JoinForm />
    </main>
  );
}
