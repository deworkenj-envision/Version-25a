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
  const resolvedParams = await params;
  const token = resolvedParams?.token;

  if (!token) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <img src="/images/logo-hero.png" alt="EnVision Direct" style={styles.logo} />
          <h1 style={styles.title}>Tracking link missing</h1>
          <p style={styles.text}>This tracking link is missing the secure order token.</p>
          <Link href="/" style={styles.secondaryButton}>Return Home</Link>
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
          <img src="/images/logo-hero.png" alt="EnVision Direct" style={styles.logo} />
          <h1 style={styles.title}>Order not found</h1>
          <p style={styles.text}>We could not find an order for this tracking link.</p>
          <Link href="/" style={styles.secondaryButton}>Return Home</Link>
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
        <div style={styles.brandHeader}>
          <img src="/images/logo-hero.png" alt="EnVision Direct" style={styles.logo} />
          
        </div>

        <div style={styles.hero}>
          <p style={styles.kicker}>Order Status</p>
          <h1 style={styles.title}>
            {isDelivered ? "Your order has been delivered" : "Track Your Order"}
          </h1>
          <p style={styles.text}>
            Order <strong>{order.order_number || `#${order.id}`}</strong>
          </p>
        </div>

        <div style={styles.layout}>
          <aside style={styles.statusPanel}>
            <h2 style={styles.panelTitle}>Order Progress</h2>

            <div style={styles.verticalSteps}>
              {steps.map((step, index) => (
                <div key={step.key} style={styles.verticalStep}>
                  {index < steps.length - 1 && (
                    <div
                      style={{
                        ...styles.verticalLine,
                        ...(steps[index + 1].complete ? styles.verticalLineComplete : {}),
                      }}
                    />
                  )}

                  <div
                    style={{
                      ...styles.verticalCircle,
                      ...(step.complete ? styles.verticalCircleComplete : {}),
                      ...(step.current ? styles.verticalCircleCurrent : {}),
                    }}
                  >
                    {step.complete ? "✓" : index + 1}
                  </div>

                  <div>
                    <div
                      style={{
                        ...styles.verticalLabel,
                        ...(step.current ? styles.verticalLabelCurrent : {}),
                      }}
                    >
                      {step.label}
                    </div>
                    <div style={styles.verticalSubtext}>
                      {step.complete
                        ? "Complete"
                        : step.current
                        ? "Current step"
                        : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div style={styles.content}>
            <div style={styles.grid}>
              <div style={styles.infoBox}>
                <h2 style={styles.sectionTitle}>Order Information</h2>

                <div style={styles.row}><span>Product</span><strong>{order.product_name || "Not available"}</strong></div>
                <div style={styles.row}><span>Size</span><strong>{order.size || "Not available"}</strong></div>
                <div style={styles.row}><span>Paper</span><strong>{order.paper || "Not available"}</strong></div>
                <div style={styles.row}><span>Finish</span><strong>{order.finish || "Not available"}</strong></div>
                <div style={styles.row}><span>Sides</span><strong>{order.sides || "Not available"}</strong></div>
                <div style={styles.row}><span>Quantity</span><strong>{order.quantity || "Not available"}</strong></div>
                <div style={styles.row}><span>Total</span><strong>{formatMoney(order.total)}</strong></div>
                <div style={styles.row}><span>Order Date</span><strong>{formatDate(order.created_at)}</strong></div>
              </div>

              <div style={styles.infoBox}>
                <h2 style={styles.sectionTitle}>Shipping Information</h2>

                <div style={styles.row}><span>Status</span><strong>{status.replaceAll("_", " ")}</strong></div>
                <div style={styles.row}><span>Carrier</span><strong>{order.tracking_carrier || order.carrier || "Not available"}</strong></div>
                <div style={styles.row}><span>Tracking Number</span><strong>{order.tracking_number || "Not available"}</strong></div>

                <div style={styles.buttonStack}>
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
            </div>

            {isDelivered && (
              <div style={styles.deliveredBox}>
                <h2 style={styles.deliveredTitle}>Delivered</h2>
                <p style={styles.text}>
                  Thank you for ordering with EnVision Direct. We hope everything arrived exactly as expected.
                </p>

                <div style={styles.buttonRow}>
                  <Link href={`/reviews?token=${encodeURIComponent(token)}`} style={styles.primaryButton}>
                    Leave a Review
                  </Link>

                  <Link href={`/order?reorderToken=${encodeURIComponent(token)}`} style={styles.reorderButton}>
                    Reorder This
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eaf3ff 0%, #f8fbff 45%, #ffffff 100%)",
    padding: "42px 18px",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#0b2442",
  },
  card: {
    maxWidth: "1120px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "30px",
    boxShadow: "0 28px 80px rgba(15, 35, 70, 0.14)",
    border: "1px solid rgba(20, 64, 120, 0.08)",
  },
brandHeader: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "24px",
},
  logo: {
    width: "260px",
    maxWidth: "100%",
    height: "auto",
    display: "block",
  },
  statusBadge: {
    background: "#ecfdf5",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    padding: "11px 16px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.07em",
  },
  hero: {
    background: "linear-gradient(135deg, #0f3f7a 0%, #1667c7 100%)",
    borderRadius: "24px",
    padding: "30px",
    color: "#ffffff",
    marginBottom: "24px",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#bfdbfe",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "36px",
    lineHeight: "1.1",
    color: "inherit",
  },
  text: {
    margin: "0",
    color: "inherit",
    opacity: 0.9,
    fontSize: "16px",
    lineHeight: "1.6",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "22px",
    alignItems: "start",
  },
  statusPanel: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "22px",
    padding: "22px",
  },
  panelTitle: {
    margin: "0 0 18px",
    color: "#14532d",
    fontSize: "20px",
  },
  verticalSteps: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  verticalStep: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "42px 1fr",
    gap: "12px",
    minHeight: "78px",
  },
  verticalCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    zIndex: 2,
    border: "3px solid #ffffff",
    boxShadow: "0 8px 18px rgba(15, 35, 70, 0.12)",
  },
  verticalCircleComplete: {
    background: "#16a34a",
    color: "#ffffff",
  },
  verticalCircleCurrent: {
    boxShadow: "0 0 0 6px rgba(22, 163, 74, 0.15)",
  },
  verticalLine: {
    position: "absolute",
    left: "17px",
    top: "36px",
    width: "3px",
    height: "42px",
    background: "#d1fae5",
    zIndex: 1,
  },
  verticalLineComplete: {
    background: "#16a34a",
  },
  verticalLabel: {
    marginTop: "4px",
    color: "#14532d",
    fontSize: "15px",
    fontWeight: "900",
  },
  verticalLabelCurrent: {
    color: "#15803d",
  },
  verticalSubtext: {
    marginTop: "4px",
    color: "#4b8060",
    fontSize: "12px",
    fontWeight: "700",
  },
  content: {
    minWidth: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  infoBox: {
    background: "#ffffff",
    border: "1px solid #e5edf7",
    borderRadius: "20px",
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
    padding: "14px 22px",
    borderRadius: "13px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "900",
    textDecoration: "none",
    boxShadow: "0 10px 24px rgba(37,99,235,0.25)",
    textAlign: "center",
  },
  reorderButton: {
    display: "inline-block",
    padding: "14px 22px",
    borderRadius: "13px",
    background: "#0f2745",
    color: "#ffffff",
    fontWeight: "900",
    textDecoration: "none",
    boxShadow: "0 10px 24px rgba(15,39,69,0.22)",
    textAlign: "center",
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
  buttonStack: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px",
  },
  deliveredBox: {
    marginTop: "22px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "20px",
    padding: "22px",
    color: "#166534",
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
    marginTop: "18px",
  },
};