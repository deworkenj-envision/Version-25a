import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function formatMoney(value) {
  const num = Number(value || 0);
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(value) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusSteps(status) {
  const steps = ["paid", "printing", "shipped", "delivered"];
  const currentIndex = steps.indexOf(status);

  return steps.map((step, index) => ({
    key: step,
    label:
      step === "paid"
        ? "Order Received"
        : step === "printing"
        ? "In Production"
        : step === "shipped"
        ? "Shipped"
        : "Delivered",
    complete: currentIndex >= index,
    current: currentIndex === index,
  }));
}

export default async function TrackTokenPage({ params }) {
  const token = params?.token;

  if (!token) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Tracking link missing</h1>
          <p style={styles.text}>
            This tracking link is missing the secure order token.
          </p>
          <Link href="/" style={styles.secondaryButton}>
            Return Home
          </Link>
        </section>
      </main>
    );
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .single();

  if (error || !order) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Order not found</h1>
          <p style={styles.text}>
            We could not find an order for this tracking link.
          </p>
          <Link href="/" style={styles.secondaryButton}>
            Return Home
          </Link>
        </section>
      </main>
    );
  }

  const status = order.status || "paid";
  const steps = getStatusSteps(status);
  const isDelivered = status === "delivered";

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Order Status</p>
            <h1 style={styles.title}>
              {isDelivered ? "Your order has been delivered" : "Track Your Order"}
            </h1>
            <p style={styles.text}>
              Order{" "}
              <strong>{order.order_number || `#${order.id}`}</strong>
            </p>
          </div>

          <div style={styles.badge}>
            {status.replaceAll("_", " ").toUpperCase()}
          </div>
        </div>

        <div style={styles.progressBox}>
          {steps.map((step, index) => (
            <div key={step.key} style={styles.stepWrap}>
              <div
                style={{
                  ...styles.stepCircle,
                  ...(step.complete ? styles.stepCircleComplete : {}),
                  ...(step.current ? styles.stepCircleCurrent : {}),
                }}
              >
                {step.complete ? "✓" : index + 1}
              </div>

              <div>
                <div
                  style={{
                    ...styles.stepLabel,
                    ...(step.current ? styles.stepLabelCurrent : {}),
                  }}
                >
                  {step.label}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  style={{
                    ...styles.stepLine,
                    ...(steps[index + 1].complete ? styles.stepLineComplete : {}),
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div style={styles.grid}>
          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>Order Information</h2>

            <div style={styles.row}>
              <span>Product</span>
              <strong>{order.product_name || "Not available"}</strong>
            </div>

            <div style={styles.row}>
              <span>Size</span>
              <strong>{order.size || "Not available"}</strong>
            </div>

            <div style={styles.row}>
              <span>Paper</span>
              <strong>{order.paper || "Not available"}</strong>
            </div>

            <div style={styles.row}>
              <span>Finish</span>
              <strong>{order.finish || "Not available"}</strong>
            </div>

            <div style={styles.row}>
              <span>Sides</span>
              <strong>{order.sides || "Not available"}</strong>
            </div>

            <div style={styles.row}>
              <span>Quantity</span>
              <strong>{order.quantity || "Not available"}</strong>
            </div>

            <div style={styles.row}>
              <span>Total</span>
              <strong>{formatMoney(order.total)}</strong>
            </div>

            <div style={styles.row}>
              <span>Order Date</span>
              <strong>{formatDate(order.created_at)}</strong>
            </div>
          </div>

          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>Shipping Information</h2>

            <div style={styles.row}>
              <span>Status</span>
              <strong>{status.replaceAll("_", " ")}</strong>
            </div>

            <div style={styles.row}>
              <span>Carrier</span>
              <strong>
                {order.tracking_carrier || order.carrier || "Not available"}
              </strong>
            </div>

            <div style={styles.row}>
              <span>Tracking Number</span>
              <strong>{order.tracking_number || "Not available"}</strong>
            </div>

            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.primaryButton}
              >
                Track Package
              </a>
            )}

            <Link
              href={`/order?reorderToken=${encodeURIComponent(token)}`}
              style={styles.reorderButton}
            >
              Reorder This
            </Link>
          </div>
        </div>

        {isDelivered && (
          <div style={styles.deliveredBox}>
            <h2 style={styles.deliveredTitle}>Delivered</h2>
            <p style={styles.text}>
              Thank you for ordering with EnVision Direct. We hope everything
              arrived exactly as expected.
            </p>

            <div style={styles.buttonRow}>
              <Link
                href={`/reviews?token=${encodeURIComponent(token)}`}
                style={styles.primaryButton}
              >
                Leave a Review
              </Link>

              <Link
                href={`/order?reorderToken=${encodeURIComponent(token)}`}
                style={styles.reorderButton}
              >
                Reorder This
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef5ff 0%, #f8fbff 45%, #ffffff 100%)",
    padding: "48px 18px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#102033",
  },
  card: {
    maxWidth: "1050px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 24px 70px rgba(15, 35, 70, 0.12)",
    border: "1px solid rgba(20, 64, 120, 0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "34px",
    lineHeight: "1.1",
    color: "#0f2745",
  },
  text: {
    margin: "0",
    color: "#526173",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  badge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    padding: "10px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.06em",
  },
  progressBox: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "18px",
    marginBottom: "24px",
    border: "1px solid #e5edf7",
  },
  stepWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "44px",
  },
  stepCircle: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#e5e7eb",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    zIndex: 2,
    flexShrink: 0,
  },
  stepCircleComplete: {
    background: "#2563eb",
    color: "#ffffff",
  },
  stepCircleCurrent: {
    boxShadow: "0 0 0 5px rgba(37, 99, 235, 0.15)",
  },
  stepLabel: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#64748b",
  },
  stepLabelCurrent: {
    color: "#1d4ed8",
  },
  stepLine: {
    position: "absolute",
    left: "34px",
    right: "-12px",
    top: "22px",
    height: "3px",
    background: "#e5e7eb",
    zIndex: 1,
  },
  stepLineComplete: {
    background: "#2563eb",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  infoBox: {
    background: "#ffffff",
    border: "1px solid #e5edf7",
    borderRadius: "18px",
    padding: "22px",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "20px",
    color: "#0f2745",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "1px solid #edf2f7",
    padding: "12px 0",
    fontSize: "14px",
    color: "#526173",
  },
  primaryButton: {
    display: "inline-block",
    marginTop: "18px",
    padding: "14px 22px",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "900",
    textDecoration: "none",
    boxShadow: "0 10px 24px rgba(37,99,235,0.25)",
  },
  reorderButton: {
    display: "inline-block",
    marginTop: "18px",
    marginLeft: "10px",
    padding: "14px 22px",
    borderRadius: "12px",
    background: "#0f2745",
    color: "#ffffff",
    fontWeight: "900",
    textDecoration: "none",
    boxShadow: "0 10px 24px rgba(15,39,69,0.22)",
  },
  secondaryButton: {
    display: "inline-block",
    marginTop: "18px",
    padding: "14px 22px",
    borderRadius: "12px",
    background: "#e5edf7",
    color: "#0f2745",
    fontWeight: "900",
    textDecoration: "none",
  },
  deliveredBox: {
    marginTop: "24px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "18px",
    padding: "22px",
  },
  deliveredTitle: {
    margin: "0 0 8px",
    color: "#166534",
    fontSize: "22px",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
};