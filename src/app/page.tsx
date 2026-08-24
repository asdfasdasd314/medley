import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page">
      <div className="home-panel">
        <p className="eyebrow">Medley</p>
        <h1>Interview</h1>
        <p className="lede">
          Rate a short playlist so we have somewhere to start.
        </p>
        <Link className="primary-link" href="/interview">
          Open interview
        </Link>
      </div>
    </main>
  );
}
