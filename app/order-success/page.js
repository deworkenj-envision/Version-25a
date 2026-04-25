"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id") || "";
  const orderId = searchParams.get("order_id") || "";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);

        let data = null;

        if (orderId) {
          const res = await fetch(`/api/orders/${orderId}`, {
            cache: "no-store",
          });

          if (res.ok) {
            data = await res.json();
          }
        }

        if (!data && sessionId) {
          const res = await fetch(
            `/api/orders?session_id=${encodeURIComponent(sessionId)}`,
            { cache: "no-store" }
          );

          if (res.ok) {
            data = await res.json();
          }
        }

        setOrder(data?.order || data || null);
      } catch (err) {
        console.error("Order success load error:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, sessionId]);

  const displayTotal = useMemo(() => {
    const value = Number(order?.total || 0);
    return value > 0 ? `$${value.toFixed(2)}` : "Unavailable";
  }, [order]);

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

        <div style={styles.checkIcon}>✓</div>

        <h1 style={styles.title}>Order Received</h1>

        <p style={styles.subtitle}>
          Thank you for your order. We received your details and your artwork.
        </p>
      </section>

      <section style={styles.card}>
        {loading ? (
          <div style={styles.loading}>Loading your order details...</div>
        ) : (
          <>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.eyebrow}>Confirmation</p>
                <h2 style={styles.cardTitle}>
                  {order?.order_number || "Order Confirmed"}
                </h2>
              </div>

              <span style={styles.statusBadge}>
                {order?.status || "Paid"}
              </span>
            </div>

            <div style={styles.grid}>
              <Info label="Customer" value={order?.customer_name} />
              <Info label="Email" value={order?.customer_email} />
              <Info label="Product" value={order?.product_name} />
              <Info label="Size" value={order?.size} />
              <Info label="Paper" value={order?.paper} />
              <Info label="Finish" value={order?.finish} />
              <Info label="Sides" value={order?.sides} />
              <Info label="Quantity" value={order?.quantity} />
              <Info label="Total" value={displayTotal} />
              <Info label="Artwork File" value={order?.file_name} />
            </div>

            <div style={styles.actions}>
              <Link href="/track" style={styles.primaryBtn}>
                Track Your Order
              </Link>

              <Link href="/" style={styles.secondaryBtn}>
                Back to Home
              </Link>
            </div>

            <p style={styles.note}>
              A confirmation email has been sent. We will notify you again when
              your order moves into production and when it ships.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>
        {value !== null && value !== undefined && value !== ""
          ? value
          : "Unavailable"}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<main style={styles.page}>Loading...</main>}>
      <OrderSuccessContent />
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
  checkIcon: {
    width: 62,
    height: 62,
    margin: "0 auto 16px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "#ffffff",
    fontSize: 38,
    fontWeight: 900,
    lineHeight: "62px",
    boxShadow: "0 12px 26px rgba(22, 163, 74, 0.28)",
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
  card: {
    maxWidth: 980,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #dbe6f3",
    borderRadius: 24,
    padding: 26,
    boxShadow: "0 18px 45px rgba(15, 43, 82, 0.10)",
  },
  loading: {
    textAlign: "center",
    padding: 40,
    color: "#486381",
    fontSize: 17,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    borderBottom: "1px solid #e5edf6",
    paddingBottom: 20,
    marginBottom: 22,
  },
  eyebrow: {
    margin: "0 0 5px",
    color: "#2563eb",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  cardTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    color: "#071b3a",
  },
  statusBadge: {
    padding: "9px 14px",
    borderRadius: 999,
    background: "#dcfce7",
    color: "#166534",
    fontSize: 13,
    fontWeight: 900,
    textTransform: "capitalize",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
  },
  infoBox: {
    border: "1px solid #e1e9f3",
    borderRadius: 16,
    padding: "15px 16px",
    background: "#f8fbff",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 7,
  },
  infoValue: {
    color: "#071b3a",
    fontSize: 16,
    fontWeight: 800,
    wordBreak: "break-word",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 28,
  },
  primaryBtn: {
    minHeight: 48,
    padding: "0 20px",
    borderRadius: 14,
    background: "#0b5cff",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
  },
  secondaryBtn: {
    minHeight: 48,
    padding: "0 20px",
    borderRadius: 14,
    background: "#eef4ff",
    color: "#0b3b82",
    textDecoration: "none",
    fontWeight: 900,
    border: "1px solid #cfe0ff",
    display: "inline-flex",
    alignItems: "center",
  },
  note: {
    margin: "22px 0 0",
    color: "#486381",
    lineHeight: 1.6,
    fontSize: 15,
  },
};