import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-US", {
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

function getSteps(status) {
  const steps = ["paid", "printing", "shipped", "delivered"];
  const i = steps.indexOf(status);

  return steps.map((s, idx) => ({
    label:
      s === "paid"
        ? "Order Received"
        : s === "printing"
        ? "In Production"
        : s === "shipped"
        ? "Shipped"
        : "Delivered",
    complete: i >= idx,
    current: i === idx,
  }));
}

export default async function Page({ params }) {
  const { token } = await params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .single();

  const status = order?.status || "paid";
  const steps = getSteps(status);

  return (
    <main style={styles.page}>
      <section style={styles.card}>

        {/* LOGO */}
        <div style={styles.brandHeader}>
          <img src="/images/logo-hero.png" style={styles.logo} />
        </div>

        {/* HERO */}
        <div style={styles.hero}>
          <p style={styles.kicker}>Order Status</p>
          <h1 style={styles.title}>Track Your Order</h1>
          <p>Order <strong>{order.order_number}</strong></p>
        </div>

        <div style={styles.layout}>

          {/* LEFT */}
          <aside style={styles.statusPanel}>
            <h2>Order Progress</h2>

            {steps.map((step, i) => (
              <div key={i} style={styles.step}>
                <div style={{
                  ...styles.circle,
                  ...(step.complete ? styles.circleDone : {})
                }}>
                  {step.complete ? "✓" : i + 1}
                </div>

                <div>
                  <div style={{
                    fontWeight: "bold",
                    color: step.current ? "#16a34a" : "#111"
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {step.complete ? "Complete" : step.current ? "Current" : "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </aside>

          {/* RIGHT */}
          <div style={styles.rightBox}>

            <div style={styles.infoBox}>
              <h3>Order Information</h3>
              <div style={styles.row}><span>Product</span><strong>{order.product_name}</strong></div>
              <div style={styles.row}><span>Size</span><strong>{order.size}</strong></div>
              <div style={styles.row}><span>Paper</span><strong>{order.paper}</strong></div>
              <div style={styles.row}><span>Finish</span><strong>{order.finish}</strong></div>
              <div style={styles.row}><span>Sides</span><strong>{order.sides}</strong></div>
              <div style={styles.row}><span>Qty</span><strong>{order.quantity}</strong></div>
              <div style={styles.row}><span>Total</span><strong>{formatMoney(order.total)}</strong></div>
            </div>

            <div style={styles.shippingBox}>
              <h3>Shipping Information</h3>
              <div style={styles.row}><span>Status</span><strong>{status}</strong></div>
              <div style={styles.row}><span>Carrier</span><strong>{order.carrier}</strong></div>
              <div style={styles.row}><span>Tracking</span><strong>{order.tracking_number}</strong></div>

              {/* CENTERED BUTTON */}
              <div style={styles.reorderWrap}>
                <Link
                  href={`/order?reorderToken=${token}`}
                  style={styles.reorderButton}
                >
                  Reorder This Product
                </Link>
              </div>

            </div>

          </div>
        </div>

      </section>
    </main>
  );
}

const styles = {
  page: { background: "#eef5ff", padding: 40 },
  card: { maxWidth: 1100, margin: "0 auto", background: "#fff", padding: 30, borderRadius: 20 },

  brandHeader: { display: "flex", justifyContent: "center", marginBottom: 20 },
  logo: { width: 260 },

  hero: { background: "#1f5bb5", color: "#fff", padding: 25, borderRadius: 20, marginBottom: 20 },
  kicker: { fontSize: 12 },
  title: { fontSize: 30 },

  layout: { display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 },

  statusPanel: { background: "#eafaf1", padding: 20, borderRadius: 20 },
  step: { display: "flex", gap: 10, marginBottom: 20 },

  circle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  circleDone: { background: "#16a34a", color: "#fff" },

  rightBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  infoBox: { border: "1px solid #ddd", padding: 20, borderRadius: 20 },

  shippingBox: {
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  row: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" },

  reorderWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },

  reorderButton: {
    padding: "18px 30px",
    background: "#0f2745",
    color: "#fff",
    borderRadius: 14,
    fontWeight: "900",
    fontSize: 16,
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
};