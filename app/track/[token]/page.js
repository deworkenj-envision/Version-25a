import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function getTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";
  const num = encodeURIComponent(trackingNumber.trim());
  const c = (carrier || "").toLowerCase();

  if (c === "ups") return `https://www.ups.com/track?tracknum=${num}`;
  if (c === "usps") return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  if (c === "fedex") return `https://www.fedex.com/fedextrack/?trknbr=${num}`;
  return "";
}

function stepState(currentStatus, step) {
  const order = ["pending", "paid", "printing", "shipped", "delivered"];
  const currentIndex = order.indexOf((currentStatus || "").toLowerCase());
  const stepIndex = order.indexOf(step);

  if (currentIndex > stepIndex) return "complete";
  if (currentIndex === stepIndex) return "current";
  return "upcoming";
}

export default async function SecureTrackingPage({ params }) {
  const resolvedParams = await params;
  const token = resolvedParams?.token;
  if (!token) notFound();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .maybeSingle();

  if (error || !order) notFound();

  const carrier = order.tracking_carrier || "";
  const trackingNumber = order.tracking_number || "";
  const trackingUrl = getTrackingLink(carrier, trackingNumber);
  const status = (order.status || "pending").toLowerCase();

  const steps = [
    ["paid", "Order Received"],
    ["printing", "Printing"],
    ["shipped", "Shipped"],
    ["delivered", "Delivered"],
  ];

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.hero}>
          <Image
            src="/images/logo-hero.png"
            alt="EnVision Direct"
            width={260}
            height={100}
          />
          <h1 style={styles.title}>{order.order_number}</h1>
          <p style={styles.subtitle}>
            Current Status: <strong>{status}</strong>
          </p>
        </div>

        {/* TOP 2-COLUMN SECTION */}
        <div style={styles.topGrid}>

          {/* LEFT: TIMELINE */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order Progress</h2>

            {steps.map(([step, label], index) => {
              const state = stepState(status, step);

              return (
                <div key={step} style={styles.timelineRow}>
                  <div style={styles.timelineLeft}>
                    <div
                      style={{
                        ...styles.circle,
                        background:
                          state === "complete"
                            ? "#16a34a"
                            : state === "current"
                            ? "#0b5cff"
                            : "#d1d5db",
                      }}
                    />
                    {index !== steps.length - 1 && <div style={styles.line} />}
                  </div>

                  <div>
                    <div style={styles.stepTitle}>{label}</div>
                    <div style={styles.stepStatus}>
                      {state === "complete"
                        ? "Complete"
                        : state === "current"
                        ? "In Progress"
                        : "Pending"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: SHIPPING (PRIORITY INFO) */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Shipping</h2>

            <p><strong>Carrier:</strong> {carrier || "Pending"}</p>
            <p><strong>Tracking:</strong> {trackingNumber || "Pending"}</p>

            {trackingUrl && (
              <a href={trackingUrl} target="_blank" style={styles.button}>
                Open Carrier Tracking
              </a>
            )}
          </div>

        </div>

        {/* BOTTOM GRID */}
        <div style={styles.bottomGrid}>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Customer</h3>
            <p>{order.customer_name}</p>
            <p>{order.customer_email}</p>
            <p>{order.customer_phone}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Shipping Address</h3>
            <p>{order.shipping_name}</p>
            <p>{order.shipping_address_line1}</p>
            {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
            <p>{order.shipping_city}, {order.shipping_state}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Details</h3>
            <p>{order.product_name}</p>
            <p>Qty: {order.quantity}</p>
            <p>{formatDate(order.created_at)}</p>
          </div>

        </div>

        <div style={styles.footer}>
          <Link href="/" style={styles.link}>
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#f8fbff,#ffffff)",
    padding: "40px 20px",
    fontFamily: "Inter, sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  hero: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "900",
    marginTop: "10px",
  },
  subtitle: {
    color: "#64748b",
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    marginBottom: "12px",
    fontWeight: "800",
  },

  timelineRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
  },

  timelineLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  circle: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },

  line: {
    width: "2px",
    height: "26px",
    background: "#e5e7eb",
  },

  stepTitle: {
    fontWeight: "700",
  },

  stepStatus: {
    fontSize: "12px",
    color: "#64748b",
  },

  button: {
    display: "inline-block",
    marginTop: "12px",
    background: "#0b5cff",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
  },

  link: {
    color: "#0b5cff",
    fontWeight: "bold",
  },
};