import type { Metadata } from "next";
import LandingPage from "./components/LandingPage";
import MaintenancePage from "./components/MaintenancePage";

const isMaintenance = process.env.SITE_MODE === "maintenance";

// Keep the maintenance placeholder out of search indexes so it never becomes
// the site's first impression. Remove the gate (unset SITE_MODE) at launch.
export const metadata: Metadata = isMaintenance
    ? { robots: { index: false, follow: false } }
    : {};

export default function HomePage() {
    return isMaintenance ? <MaintenancePage /> : <LandingPage />;
}
