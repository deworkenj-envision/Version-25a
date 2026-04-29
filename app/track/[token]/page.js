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
          <img src="/images/logo-hero.png" style={styles.logo} />
          <h1 style={styles.title}>Tracking link missing</h1>
          <p style={styles.text}>This tracking link is missing the secure order token.</p>
          <Link href="/" style={styles.secondaryButton}>Return Home</Link>
        </section>
      </main>
    );
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .single();

  const status = order?.status || "paid";
  const steps = getStatusSteps(status);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        
        <div style={styles.brandHeader}>
          <img src="/images/logo-hero.png" style={styles.logo} />
        </div>

        <div style={styles.hero}>
          <p style={styles.kicker}>Order Status</p>
          <h1 style={styles.title}>Track Your Order</h1>
          <p style={styles.text}>Order <strong>{order.order_number}</strong></p>
        </div>

        <div style={styles.layout}>

          {/* LEFT STATUS */}
          <aside style={styles.statusPanel}>
            <h2 style={styles.panelTitle}>Order Progress</h2>

            <div style={styles.verticalSteps}>
              {steps.map((step, index) => (
                <div key={step.key} style={styles.verticalStep}>
                  
                  {index < steps.length - 1 && (
                    <div style={{
                      ...styles.verticalLine,
                      ...(steps[index + 1].complete ? styles.verticalLineComplete : {}),
                    }} />
                  )}

                  <div style={{
                    ...styles.verticalCircle,
                    ...(step.complete ? styles.verticalCircleComplete : {}),
                    ...(step.current ? styles.verticalCircleCurrent : {}),
                  }}>
                    {step.complete ? "✓" : index + 1}
                  </div>

                  <div>
                    <div style={{
                      ...styles.verticalLabel,
                      ...(step.current ? styles.verticalLabelCurrent : {}),
                    }}>
                      {step.label}
                    </div>
                    <div style={styles.verticalSubtext}>
                      {step.complete ? "Complete" : step.current ? "Current" : "Pending"}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div style={styles.content}>

            <div style={styles.grid}>
              
              <div style={styles.infoBox}>
                <h2 style={styles.sectionTitle}>Order Information</h2>

                <div style={styles.row}><span>Product</span><strong>{order.product_name}</strong></div>
                <div style={styles.row}><span>Size</span><strong>{order.size}</strong></div>
                <div style={styles.row}><span>Paper</span><strong>{order.paper}</strong></div>
                <div style={styles.row}><span>Finish</span><strong>{order.finish}</strong></div>
                <div style={styles.row}><span>Sides</span><strong>{order.sides}</strong></div>
                <div style={styles.row}><span>Quantity</span><strong>{order.quantity}</strong></div>
                <div style={styles.row}><span>Total</span><strong>{formatMoney(order.total)}</strong></div>
                <div style={styles.row}><span>Date</span><strong>{formatDate(order.created_at)}</strong></div>
              </div>

              <div style={styles.infoBox}>
                <h2 style={styles.sectionTitle}>Shipping Information</h2>

                <div style={styles.row}><span>Status</span><strong>{status}</strong></div>
                <div style={styles.row}><span>Carrier</span><strong>{order.carrier}</strong></div>
                <div style={styles.row}><span>Tracking</span><strong>{order.tracking_number}</strong></div>

                <div style={styles.reorderWrap}>
                  <Link
                    href={`/order?reorderToken=${encodeURIComponent(token)}`}
                    style={styles.reorderButton}
                  >
                    Reorder This Product
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#eef5ff", padding: "40px" },
  card: { maxWidth: "1100px", margin: "0 auto", background: "#fff", padding: "30px", borderRadius: "20px" },
  brandHeader: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  logo: { width: "260px" },
  hero: { background: "#1f5bb5", padding: "25px", borderRadius: "20px", color: "#fff", marginBottom: "20px" },
  kicker: { fontSize: "12px" },
  title: { fontSize: "30px", margin: "10px 0" },
  text: {},
  layout: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" },

  statusPanel: { background: "#eafaf1", padding: "20px", borderRadius: "20px" },
  panelTitle: { marginBottom: "15px" },

  verticalSteps: {},
  verticalStep: { position: "relative", display: "grid", gridTemplateColumns: "40px 1fr", marginBottom: "20px" },
  verticalCircle: { width: "34px", height: "34px", borderRadius: "50%", background: "#cbd5f5", display: "flex", alignItems: "center", justifyContent: "center" },
  verticalCircleComplete: { background: "#16a34a", color: "#fff" },
  verticalCircleCurrent: { outline: "4px solid rgba(22,163,74,0.2)" },
  verticalLine: { position: "absolute", left: "17px", top: "34px", height: "40px", width: "2px", background: "#cbd5f5" },
  verticalLineComplete: { background: "#16a34a" },
  verticalLabel: { fontWeight: "bold" },
  verticalLabelCurrent: { color: "#16a34a" },
  verticalSubtext: { fontSize: "12px" },

  content: {},
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  infoBox: { border: "1px solid #ddd", padding: "20px", borderRadius: "20px" },
  sectionTitle: { marginBottom: "10px" },
  row: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" },

  reorderWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30px",
  },

  reorderButton: {
    padding: "18px 30px",
    borderRadius: "14px",
    background: "#0f2745",
    color: "#fff",
    fontWeight: "900",
    fontSize: "16px",
    textDecoration: "none",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  },

  secondaryButton: {
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 20px",
    background: "#eee",
    borderRadius: "10px",
  }
};