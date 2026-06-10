import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";
import { getMemberBySerial } from "@/lib/members";
import LogoutButton from "./LogoutButton";

// Server Component, session-gated. Not signed in → /login. The member's pass is
// downloaded from /api/passes/<serial>, which independently verifies the session
// matches this serial.
export default async function DashboardPage() {
  const serial = await readSession();
  if (!serial) {
    redirect("/login");
  }

  const member = await getMemberBySerial(serial);
  if (!member) {
    // Session references a member that no longer exists (e.g. in-memory store
    // was reset). Treat as signed out.
    redirect("/login");
  }

  return (
    <main className="auth-main">
      <h1>Hi, {member.name.split(" ")[0]} 👋</h1>
      <p>You&apos;re an active member of the Aiyara family.</p>

      <div className="card pass-card">
        <div className="pass-preview">
          <span className="pass-org">UBC Thai Aiyara</span>
          <span className="pass-name">{member.name}</span>
          <span className="pass-status">MEMBER · Active</span>
        </div>
        <a className="button" href={`/api/passes/${member.serial_number}`}>
          Add to Apple Wallet
        </a>
        <p className="hint">
          Opens your <code>.pkpass</code> — add it to Apple Wallet on your iPhone.
        </p>
      </div>

      <LogoutButton />
    </main>
  );
}
