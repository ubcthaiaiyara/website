import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UBC Thai Aiyara — Membership",
  description: "Club membership for the UBC Thai Aiyara club.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
