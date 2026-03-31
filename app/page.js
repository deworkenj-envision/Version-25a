import { products } from "./lib/products";

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 32 }}>
      <section
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          borderRadius: 36,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 28,
            padding: 40,
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.14)",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Professional Print • Upload Ready Files
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 64,
                lineHeight: 0.93,
                letterSpacing: "-0.03em",
                maxWidth: 700,
              }}
            >
              Upload your artwork.
              <br />
              Place your order fast.
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 20,
                lineHeight: 1.5,
                color: "rgba(255,255,255,.82)",
                maxWidth: 620,
              }}
            >
              Business cards, flyers, banners, and postcards with a clean,
              customer-friendly order flow built for print-ready files.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="/upload">
                Start Order
              </a>
              <a
                className="btn"
                href="/products"
                style={{
                  background: "rgba(255,255,255,.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.18)",
                }}
              >
                Browse Products
              </a>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div
                className="finish"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.14)",
                }}
              >
                Fast turnaround
              </div>
              <div
                className="finish"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.14)",
                }}
              >
                Upload print-ready artwork
              </div>
              <div
                className="finish"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.14)",
                }}
              >
                Simple ordering
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                color: "#0f172a",
                borderRadius: 28,
                padding: 22,
                minHeight: 210,
                boxShadow: "0 20px 40px rgba(0,0,0,.15)",
                display: "grid",
                alignContent: "space-between",
              }}
            >
              <div>
                <div className="badge">Business Cards</div>
                <h3 style={{ margin: "14px 0 8px", fontSize: 22 }}>
                  Premium business cards
                </h3>
                <div className="subtle">Matte, gloss, soft-touch</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 28 }}>From $54</div>
            </div>

            <div
              style={{
                background: "#fff",
                color: "#0f172a",
                borderRadius: 28,
                padding: 22,
                minHeight: 210,
                boxShadow: "0 20px 40px rgba(0,0,0,.15)",
                display: "grid",
                alignContent: "space-between",
              }}
            >
              <div>
                <div className="badge">Flyers</div>
                <h3 style={{ margin: "14px 0 8px", fontSize: 22 }}>
                  Marketing flyers
                </h3>
                <div className="subtle">High-quality promo prints</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 28 }}>From $79</div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 24,
                padding: 20,
                border: "1px solid rgba(255,255,255,.14)",
              }}
            >
              <div style={{ color: "rgba(255,255,255,.72)", fontSize: 13 }}>
                File Types
              </div>
              <strong style={{ fontSize: 28, lineHeight: 1.1 }}>
                PDF, PNG, JPG
              </strong>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 24,
                padding: 20,
                border: "1px solid rgba(255,255,255,.14)",
              }}
            >
              <div style={{ color: "rgba(255,255,255,.72)", fontSize: 13 }}>
                Best For
              </div>
              <strong style={{ fontSize: 28, lineHeight: 1.1 }}>
                Ready Artwork
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">Shop Products</div>
            <h2 style={{ margin: "12px 0 8px", fontSize: 42, lineHeight: 1 }}>
              Choose what you want to print
            </h2>
            <div className="subtle" style={{ fontSize: 18 }}>
              Product-first ordering for customers with finished artwork.
            </div>
          </div>
        </div>

        <div className="grid grid-4">
          {products.map((item) => (
            <div
              className="card product-card"
              key={item.slug}
              style={{ padding: 20, borderRadius: 28 }}
            >
              <div
                style={{
                  height: 140,
                  borderRadius: 20,
                  background:
                    item.slug === "business-cards"
                      ? "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)"
                      : item.slug === "flyers"
                      ? "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)"
                      : item.slug === "banners"
                      ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                  boxShadow: "0 10px 25px rgba(0,0,0,.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {item.slug === "business-cards" && (
                  <>
                    <div
                      style={{
                        width: 92,
                        height: 58,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                        transform: "rotate(-8deg) translateX(-12px)",
                        position: "absolute",
                      }}
                    />
                    <div
                      style={{
                        width: 92,
                        height: 58,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                        transform: "rotate(7deg) translateX(18px) translateY(8px)",
                        position: "absolute",
                      }}
                    />
                  </>
                )}

                {item.slug === "flyers" && (
                  <div
                    style={{
                      width: 88,
                      height: 116,
                      background: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                      transform: "rotate(-5deg)",
                    }}
                  />
                )}

                {item.slug === "banners" && (
                  <div
                    style={{
                      width: 156,
                      height: 56,
                      background: "linear-gradient(135deg,#0f172a,#2563eb)",
                      borderRadius: 12,
                      boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                    }}
                  />
                )}

                {item.slug === "postcards" && (
                  <div
                    style={{
                      width: 112,
                      height: 74,
                      background: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                      transform: "rotate(-6deg)",
                    }}
                  />
                )}
              </div>

              <div className="product-top">
                <div className="badge">{item.badge}</div>
                <div className="subtle">{item.size}</div>
              </div>

              <h3 style={{ margin: "2px 0 0", fontSize: 20 }}>{item.name}</h3>
              <div className="subtle">{item.lead}</div>

              <div className="finish-row">
                {item.finishes.map((finish) => (
                  <div key={finish} className="finish">
                    {finish}
                  </div>
                ))}
              </div>

              <div className="price">From {item.starting}</div>

              <a className="btn btn-primary" href="/upload">
                Start Order
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">How It Works</div>
            <h2 style={{ margin: "12px 0 8px", fontSize: 42, lineHeight: 1 }}>
              A simpler path to print
            </h2>
            <div className="subtle" style={{ fontSize: 18 }}>
              Built for customers who already have files ready to go.
            </div>
          </div>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">1</div>
            <h3>Choose product</h3>
            <div className="subtle">
              Pick business cards, flyers, banners, or postcards.
            </div>
          </div>

          <div className="how-card">
            <div className="how-number">2</div>
            <h3>Upload artwork</h3>
            <div className="subtle">
              Add your print-ready file directly with the order.
            </div>
          </div>

          <div className="how-card">
            <div className="how-number">3</div>
            <h3>Review and checkout</h3>
            <div className="subtle">
              Confirm the details and complete the order quickly.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}