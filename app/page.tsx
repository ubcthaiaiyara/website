import Link from "next/link";

// Server Component. Static landing page, no interactivity.
export default function HomePage() {
  return (
    <main>
      <h1>UBC Thai Aiyara</h1>
      <p>
        The membership home for the UBC Thai Aiyara club. Join to get your
        digital membership pass for your Apple Wallet.
      </p>
      <Link className="button" href="/join">
        Join the club
      </Link>
    </main>
  );
}
