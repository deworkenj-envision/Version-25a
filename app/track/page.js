import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function TrackPage({ searchParams }) {
  const token = searchParams?.token;

  if (token) {
    redirect(`/track/${encodeURIComponent(token)}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef5ff",
        padding: "40px 18px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "22px",
          padding: "32px",
          boxShadow: "0 18px 50px rgba(15, 35, 70, 0.12)",
        }}
      >
        <h1 style={{ margin: "0 0 12px", color: "#0f2745", fontSize: "34px" }}>
          Tracking link missing
        </h1>

        <p style={{ color: "#334155", fontSize: "16px", marginBottom: "22px" }}>
          This tracking link is missing the secure order token.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 22px",
            borderRadius: "12px",
            background: "#e5edf7",
            color: "#0f2745",
            fontWeight: "900",
            textDecoration: "none",
          }}
        >
          Return Home
        </a>
      </section>
    </main>
  );
}