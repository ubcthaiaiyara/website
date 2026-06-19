"use client";

import { useState } from "react";

// Client component. Posts to the logout route (which clears the cookie), then
// sends the member back to the landing page.
export default function LogoutButton() {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    // Full navigation so the shell re-renders signed-out (the header drops the
    // account link) instead of reusing the Router Cache's signed-in render.
    window.location.assign("/");
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
