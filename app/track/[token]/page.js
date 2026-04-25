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
  const token = params?.token;
  if (!token) notFound();

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .maybeSingle();

  if (!order) notFound();

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
            width={290}
            height={110}
            style={styles.logo}
          />

          <h1 style={styles.title}>
            {order.order_number || "Your Order"}
          </h1>

          <p style={styles.subtitle}>
            Current Status: <strong>{status}</strong>
          </p>
        </div>

        {/* TIMELINE */}
        <div style={styles.timeline}>
          {steps.map(([step, label]) => {
            const state = stepState(status, step);

            return (
              <div key={step} style={styles.step}>
                <div
                  style={{
                    ...styles.circle,
                    background:
                      state === "complete"
                        ? "#16a34a"
                        : state === "current"
                        ? "#0b5cff"
                        : "#cbd5e1",
                  }}
                />

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

        {/* DETAILS */}
        <div style={styles.grid}>

          <div style={styles.card}>
            <h2>Shipping</h2>
            <p><strong>Carrier:</strong> {carrier || "Pending"}</p>
            <p><strong>Tracking:</strong> {trackingNumber || "Pending"}</p>

            {trackingUrl && (
              <a href={trackingUrl} target="_blank" style={styles.button}>
                Open Carrier Tracking
              </a>
            )}
          </div>

          <div style={styles.card}>
            <h2>Customer</h2>
            <p>{order.customer_name}</p>
            <p>{order.customer_email}</p>
            <p>{order.customer_phone}</p>
          </div>

          <div style={styles.card}>
            <h2>Shipping Address</h2>
            <p>{order.shipping_name}</p>
            <p>{order.shipping_address_line1}</p>
            {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
            <p>{order.shipping_city}, {order.shipping_state}</p>
          </div>

          <div style={styles.card}>
            <h2>Order Details</h2>
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
    background: "linear-gradient(180deg, #f8fbff, #ffffff)",
    padding: "30px",
    fontFamily: "Arial",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  hero: {
    textAlign: "center",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  logo: {
    display: "block",
    margin: "0 auto 20px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748b",
  },
  timeline: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  circle: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
  },
  stepTitle: {
    fontWeight: "700",
  },
  stepStatus: {
    fontSize: "12px",
    color: "#64748b",
  },
  grid: {
    display: "grid",
    gap: "15px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
  },
  button: {
    display: "inline-block",
    marginTop: "10px",
    background: "#0b5cff",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    textDecoration: "none",
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