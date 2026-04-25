"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function TrackRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token =
      searchParams.get("token") ||
      searchParams.get("tracking_token") ||
      searchParams.get("t");

    if (token) {
      router.replace(`/track/${encodeURIComponent(token)}`);
    }
  }, [router, searchParams]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.logoWrap}>
            <Image
              src="/images/logo-hero.png"
              alt="EnVision Direct"
              width={290}
              height={110}
              priority
              style={styles.logo}
            />
          </div>

          <h1 style={styles.title}>Track Your Order</h1>

          <p style={styles.subtitle}>
            Checking your secure tracking link...
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Secure Tracking Link Required
          </h2>

          <p style={styles.cardText}>
            If this page does not redirect automatically, please open the tracking
            link from your order confirmation, shipped, or delivered email.
          </p>

          <Link href="/" style={styles.button}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackRedirectContent />
    </Suspense>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #eef4fb 45%, #ffffff 100%)",
    padding: "32px 18px 70px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#071b3a",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  hero: {
    background: "#ffffff",
    border: "1px solid #dbe6f3",
    borderRadius: 24,
    padding: "34px 22px 32px",
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(15, 43, 82, 0.10)",
    marginBottom: 24,
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
  },
  logo: {
    width: "290px",
    height: "auto",
    objectFit: "contain",
  },
  title: {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 900,
    color: "#061936",
  },
  subtitle: {
    marginTop: 12,
    color: "#486381",
    fontSize: 16,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe6f3",
    borderRadius: 24,
    padding: 26,
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(15, 43, 82, 0.10)",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 12,
  },
  cardText: {
    color: "#486381",
    fontSize: 15,
    lineHeight: 1.6,
  },
  button: {
    display: "inline-block",
    marginTop: 20,
    background: "#0b5cff",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 800,
  },
};