"use client";

import { Suspense } from "react";
import Image from "next/image";

function CheckoutContent() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <Image
          src="/images/logo-hero.png"
          alt="EnVision Direct"
          width={290}
          height={110}
          priority
          style={styles.logo}
        />

        <h1 style={styles.title}>Secure Checkout</h1>

        <p style={styles.subtitle}>
          Complete your contact, shipping, artwork, and payment details to place your order.
        </p>
      </section>

      {/* KEEP YOUR EXISTING CHECKOUT FORM CODE BELOW THIS LINE */}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main style={styles.page}>Loading checkout...</main>}>
      <CheckoutContent />
    </Suspense>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef4fb 45%, #ffffff 100%)",
    padding: "32px 18px 70px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#071b3a",
  },
  hero: {
    maxWidth: 1180,
    margin: "0 auto 32px",
    background: "#ffffff",
    border: "1px solid #dbe6f3",
    borderRadius: 24,
    padding: "34px 22px 32px",
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(15, 43, 82, 0.10)",
  },
  logo: {
    width: "290px",
    height: "auto",
    objectFit: "contain",
    borderRadius: 8,
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: "clamp(34px, 5vw, 52px)",
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#061936",
  },
  subtitle: {
    margin: "14px auto 0",
    maxWidth: 760,
    color: "#486381",
    fontSize: 18,
    lineHeight: 1.6,
  },
};