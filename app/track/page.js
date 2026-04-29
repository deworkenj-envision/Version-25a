"use client";

import { useState } from "react";

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e) {
    e.preventDefault();

    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter your order number and email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        email: email.trim(),
      });

      const res = await fetch(`/api/orders/track?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.token) {
        throw new Error("Order not found");
      }

      window.location.href = `/track/${encodeURIComponent(data.token)}`;
    } catch (err) {
      setError("Order not found. Please check your order number and email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleTrack} style={styles.card}>
        <h1 style={styles.title}>Track Your Order</h1>

        <p style={styles.text}>
          Enter your order number and email address to view your order status.
        </p>

        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number (ex: EV-10167)"
          style={styles.input}
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          type="email"
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Tracking..." : "Track Order"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef5ff",
    padding: "30px",
  },
  card: {
    background: "#fff",
    padding: "42px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "430px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
    color: "#0f172a",
  },
  text: {
    marginBottom: "22px",
    color: "#475569",
    lineHeight: "1.6",
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    marginBottom: "14px",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "900",
    fontSize: "15px",
    cursor: "pointer",
  },
  error: {
    marginTop: "16px",
    color: "#dc2626",
    fontSize: "14px",
    lineHeight: "1.5",
  },
};