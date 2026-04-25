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

function statusMessage(status) {
  const s = (status || "").toLowerCase();

  if (s === "paid") {
    return "We received your order and payment. Your artwork is queued for production review.";
  }

  if (s === "printing") {
    return "Your order is currently in production. We will notify you when it ships.";
  }

  if (s === "shipped") {
    return "Your order has shipped. Use the carrier tracking button for the latest delivery updates.";
  }

  if (s === "delivered") {
    return "Your order has been delivered. Thank you for choosing EnVision Direct.";
  }

  return "Your order has been received and is being reviewed.";
}

function statusLabel(status) {
  const s = (status || "pending").toLowerCase();

  if (s === "paid") return "Paid";
  if (s === "printing") return "Printing";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";

  return "Pending";
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

  const carrier = order.tracking_carrier || order.carrier || "";
  const trackingNumber = order.tracking_number || "";
  const trackingUrl =
    order.tracking_url || getTrackingLink(carrier, trackingNumber);

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
        <section style={styles.hero}>
          <div style={styles.logoWrap}>
            <Image
              src="/images/logo-hero.png"
              alt="EnVision Direct"
              width={280}
              height={105}
              priority
              style={styles.logo}
            />
          </div>

          <div style={styles.orderBadge}>Secure Order Tracking</div>

          <h1 style={styles.title}>{order.order_number || "Your Order"}</h1>

          <div style={styles.statusRow}>
            <span style={styles.statusPill}>{statusLabel(status)}</span>
          </div>

          <p style={styles.heroText}>{statusMessage(status)}</p>
        </section>

        <section style={styles.topGrid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.eyebrow}>Progress</p>
                <h2 style={styles.cardTitle}>Order Timeline</h2>
              </div>
            </div>

            <div style={styles.timeline}>
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
                          boxShadow:
                            state === "current"
                              ? "0 0 0 6px rgba(11,92,255,0.12)"
                              : "none",
                        }}
                      >
                        {state === "complete" ? "✓" : ""}
                      </div>

                      {index !== steps.length - 1 && <div style={styles.line} />}
                    </div>

                    <div style={styles.timelineText}>
                      <div style={styles.stepTitle}>{label}</div>
                      <div
                        style={{
                          ...styles.stepStatus,
                          color:
                            state === "complete"
                              ? "#15803d"
                              : state === "current"
                              ? "#0b5cff"
                              : "#64748b",
                        }}
                      >
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
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.eyebrow}>Delivery</p>
                <h2 style={styles.cardTitle}>Shipping Details</h2>
              </div>
            </div>

            <div style={styles.detailList}>
              <Detail label="Carrier" value={carrier || "Pending"} />
              <Detail label="Tracking Number" value={trackingNumber || "Pending"} />
              <Detail label="Order Date" value={formatDate(order.created_at)} />
            </div>

            {trackingUrl ? (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.primaryButton}
              >
                Open Carrier Tracking
              </a>
            ) : (
              <div style={styles.pendingBox}>
                Carrier tracking will appear here once your order ships.
              </div>
            )}
          </div>
        </section>

        <section style={styles.bottomGrid}>
          <div style={styles.card}>
            <p style={styles.eyebrow}>Customer</p>
            <h3 style={styles.smallTitle}>Contact</h3>
            <div style={styles.compactText}>
              <p style={styles.boldLine}>{order.customer_name || "—"}</p>
              <p>{order.customer_email || "—"}</p>
              <p>{order.customer_phone || "—"}</p>
            </div>
          </div>

          <div style={styles.card}>
            <p style={styles.eyebrow}>Ship To</p>
            <h3 style={styles.smallTitle}>Address</h3>
            <div style={styles.compactText}>
              <p style={styles.boldLine}>{order.shipping_name || "—"}</p>
              <p>{order.shipping_address_line1 || "—"}</p>
              {order.shipping_address_line2 ? (
                <p>{order.shipping_address_line2}</p>
              ) : null}
              <p>
                {order.shipping_city || "—"}, {order.shipping_state || "—"}{" "}
                {order.shipping_postal_code || ""}
              </p>
              <p>{order.shipping_country || "US"}</p>
            </div>
          </div>

          <div style={styles.card}>
            <p style={styles.eyebrow}>Order</p>
            <h3 style={styles.smallTitle}>Details</h3>
            <div style={styles.compactText}>
              <p style={styles.boldLine}>{order.product_name || "—"}</p>
              <p>Quantity: {order.quantity || "—"}</p>
              <p>Size: {order.size || "—"}</p>
              <p>Total: ${Number(order.total || 0).toFixed(2)}</p>
            </div>
          </div>
        </section>

        <div style={styles.footer}>
          <Link href="/" style={styles.backLink}>
            Back to EnVision Direct
          </Link>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #ffffff 0%, #eef4fb 40%, #f8fbff 100%)",
    padding: "34px 18px 64px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#071b3a",
  },
  container: {
    maxWidth: 1120,
    margin: "0 auto",
  },
  hero: {
    background: "#ffffff",
    border: "1px solid #dbe6f3",
    borderRadius: 28,
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 22px 55px rgba(15, 43, 82, 0.10)",
    marginBottom: 22,
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: {
    width: "280px",
    height: "auto",
    objectFit: "contain",
    borderRadius: 8,
  },
  orderBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef4ff",
    color: "#0b5cff",
    border: "1px solid #cfe0ff",
    borderRadius: 999,
    padding: "7px 13px",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: "clamp(34px, 5vw, 50px)",
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: "-0.04em",
    color: "#061936",
  },
  statusRow: {
    marginTop: 14,
  },
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: 999,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 900,
  },
  heroText: {
    margin: "16px auto 0",
    maxWidth: 720,
    color: "#486381",
    fontSize: 16,
    lineHeight: 1.65,
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
    marginBottom: 18,
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 18,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe6f3",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 45px rgba(15, 43, 82, 0.08)",
  },
  cardHeader: {
    borderBottom: "1px solid #e5edf6",
    paddingBottom: 14,
    marginBottom: 18,
  },
  eyebrow: {
    margin: "0 0 6px",
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  cardTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
    color: "#071b3a",
  },
  smallTitle: {
    margin: "0 0 12px",
    fontSize: 19,
    fontWeight: 900,
    color: "#071b3a",
  },
  timeline: {
    display: "grid",
    gap: 0,
  },
  timelineRow: {
    display: "flex",
    gap: 14,
    minHeight: 58,
  },
  timelineLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 3,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  line: {
    width: 2,
    flex: 1,
    background: "#e5edf6",
    marginTop: 5,
    marginBottom: 5,
  },
  timelineText: {
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 900,
    color: "#071b3a",
  },
  stepStatus: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: 800,
  },
  detailList: {
    display: "grid",
    gap: 12,
    marginBottom: 18,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    borderBottom: "1px solid #edf2f7",
    paddingBottom: 10,
  },
  detailLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: 800,
  },
  detailValue: {
    textAlign: "right",
    color: "#071b3a",
    fontSize: 14,
    fontWeight: 900,
    wordBreak: "break-word",
  },
  primaryButton: {
    display: "inline-flex",
    width: "100%",
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background: "#0b5cff",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
    boxShadow: "0 12px 24px rgba(11, 92, 255, 0.22)",
  },
  pendingBox: {
    background: "#f8fbff",
    border: "1px solid #dbe6f3",
    borderRadius: 16,
    padding: 14,
    color: "#486381",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 700,
  },
  compactText: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.65,
  },
  boldLine: {
    fontWeight: 900,
    color: "#071b3a",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
  },
  backLink: {
    color: "#0b5cff",
    fontWeight: 900,
    textDecoration: "none",
  },
};