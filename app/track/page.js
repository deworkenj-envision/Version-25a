"use client";

import { useState } from "react";

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack() {
    if (!orderNumber) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}`);
      const data = await res.json();

      if (!res.ok || !data?.token) {
        throw new Error("Order not found");
      }

      // redirect to secure tracking page
      window.location.href = `/track/${data.token}`;
    } catch (err) {
      setError("Order not found. Please check your order number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Track Your Order</h1>

        <p style={styles.text}>
          Enter your order number to view your order status.
        </p>

        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter Order Number (ex: EV-10123)"
          style={styles.input}
        />

        <button onClick={handleTrack} style={styles.button}>
          {loading ? "Tracking..." : "Track Order"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
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
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  text: {
    marginBottom: "20px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#1f5bb5",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  error: {
    marginTop: "15px",
    color: "red",
  },
};