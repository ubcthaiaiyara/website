import { redirect } from "next/navigation";
import type { Viewport } from "next";
import { readSession } from "@/lib/session";
import { getMemberBySerial } from "@/lib/members";
import AccountView from "./AccountView";

// Keep iOS Safari's browser chrome aligned with the account page's midnight
// background, including when arriving from white auth pages.
export const viewport: Viewport = {
  themeColor: "#050115",
};

// Server Component, session-gated account page. Not signed in → /login. Shows
// the member's account details and lets them download their Apple Wallet pass
// from /api/passes/<serial>, which independently verifies the session matches
// this serial.
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

  const memberSince = new Date(member.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="auth-main account-main">
      <h1 className="account-page-title">My account</h1>
      <AccountView
        name={member.name}
        email={member.email}
        faculty={member.faculty ?? ""}
        program={member.program ?? ""}
        year={member.year ?? ""}
        memberSince={memberSince}
        serial={member.serial_number}
      />
    </main>
  );
}
