import LandingPage from "./components/LandingPage";
import MaintenancePage from "./components/MaintenancePage";

export default function HomePage() {
    return process.env.SITE_MODE === "maintenance" ? (
        <MaintenancePage />
    ) : (
        <LandingPage />
    );
}
