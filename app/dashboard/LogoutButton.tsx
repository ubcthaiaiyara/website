"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Client component. Posts to the logout route (which clears the cookie), then
// sends the member back to the landing page.
export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      className="button button-ghost"
      type="button"
      onClick={handleLogout}
      disabled={busy}
    >
      {busy ? "Signing out…" : "Log out"}
    </button>
  );
}
