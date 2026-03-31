import { products } from "./lib/products";

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 32 }}>
      <section
        className="card"
        style={{
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
          color: "#fff",
          borderRadius: 36,
          padding: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.08fr 0.92fr",
            gap: 28,
            padding: 36,
          }}
        >
          <div
            style={{
              display: "grid",
              alignContent: "center",
              gap: 18,
            }}
          >
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
              Premium Print • Upload Ready Files
            </div>

            <h1
              style={{
                fontSize: 68,
                lineHeight: 0.92,
                margin: 0,
                letterSpacing: "-0.03em",
                maxWidth: 720,
              }}
            >
              Print-ready files?
              <br />
              Get them printed fast.
            </h1>

            <p
              style={{
                fontSize: 20,
                lineHeight: 1.5,
                color: "rgba(255,255,255,.82)",
                margin: 0,
                maxWidth: 640,
              }}
            >
              Business cards, flyers, banners, and more. Upload your finished
              artwork and place your order in minutes.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="/upload">
                Upload Artwork
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
              <div
                className="finish"
                style={{
                  background: "rgba(255,255,255,.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.14)",
                }}
              >
                Premium print quality
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              alignContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                color: "#0f172a",
                borderRadius: 28,
                padding: 22,
                boxShadow: "0 20px 40px rgba(0,0,0,.15)",
              }}
            >
              <div className="badge">Business Cards</div>
              <h3 style={{ margin: "14px 0 8px", fontSize: 18 }}>
                Premium Business Cards
              </h3>
              <div className="subtle">Matte, gloss, soft-touch</div>
              <div style={{ fontWeight: 900, marginTop: 12, fontSize: 26 }}>
                From $54
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                color: "#0f172a",
                borderRadius: 28,
                padding: 22,
                boxShadow: "0 20px 40px rgba(0,0,0,.15)",
              }}
            >
              <div className="badge">Flyers</div>
              <h3 style={{ margin: "14px 0 8px", fontSize: 18 }}>
                Marketing Flyers
              </h3>
              <div className="subtle">High-quality promo prints</div>
              <div style={{ fontWeight: 900, marginTop: 12, fontSize: 26 }}>
                From $79
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 22,
                padding: 18,
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              <div style={{ color: "rgba(255,255,255,.72)", fontSize: 13 }}>
                Fast Turnaround
              </div>
              <strong style={{ fontSize: 30, lineHeight: 1.1 }}>2–4 Days</strong>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 22,
                padding: 18,
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              <div style={{ color: "rgba(255,255,255,.72)", fontSize: 13 }}>
                File Types
              </div>
              <strong style={{ fontSize: 30, lineHeight: 1.1 }}>PDF, PNG, JPG</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">Featured Products</div>
            <h2 style={{ margin: "12px 0 8px", fontSize: 40, lineHeight: 1 }}>
              Popular print products
            </h2>
            <div className="subtle" style={{ fontSize: 18 }}>
              Choose your product and upload your artwork.
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
                  height: 130,
                  borderRadius: 18,
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
                        width: 90,
                        height: 56,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                        transform: "rotate(-8deg) translateX(-10px)",
                        position: "absolute",
                      }}
                    />
                    <div
                      style={{
                        width: 90,
                        height: 56,
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
                      width: 86,
                      height: 112,
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
                      width: 150,
                      height: 54,
                      background: "linear-gradient(135deg,#0f172a,#2563eb)",
                      borderRadius: 12,
                      boxShadow: "0 10px 24px rgba(0,0,0,.14)",
                    }}
                  />
                )}

                {item.slug === "postcards" && (
                  <div
                    style={{
                      width: 108,
                      height: 72,
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

              <h3 style={{ margin: "2px 0 0", fontSize: 18 }}>{item.name}</h3>
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
                Upload Artwork
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">How It Works</div>
            <h2 style={{ margin: "12px 0 8px", fontSize: 40, lineHeight: 1 }}>
              Simple print ordering
            </h2>
            <div className="subtle" style={{ fontSize: 18 }}>
              Built for customers with ready-to-print files.
            </div>
          </div>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">1</div>
            <h3>Choose product</h3>
            <div className="subtle">
              Select business cards, flyers, banners, or postcards.
            </div>
          </div>

          <div className="how-card">
            <div className="how-number">2</div>
            <h3>Upload artwork</h3>
            <div className="subtle">
              Upload your finished file directly with your order.
            </div>
          </div>

          <div className="how-card">
            <div className="how-number">3</div>
            <h3>Checkout</h3>
            <div className="subtle">
              Review and complete your order in minutes.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}