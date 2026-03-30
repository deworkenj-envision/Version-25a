import { products } from "./lib/products";

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 28 }}>
      {/* HERO */}
      <section
        className="card"
        style={{
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
            padding: 32,
          }}
        >
          {/* LEFT */}
          <div style={{ display: "grid", alignContent: "center", gap: 16 }}>
            <div
              style={{
                display: "inline-flex",
                padding: "7px 11px",
                borderRadius: 999,
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.14)",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Premium Print • Upload Ready Files
            </div>

            <h1 style={{ fontSize: 64, lineHeight: 0.95, margin: 0 }}>
              Print-ready files?
              <br />
              Get them printed fast.
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,.8)",
                maxWidth: 600,
              }}
            >
              Business cards, flyers, banners, and more. Upload your finished
              artwork and place your order in minutes.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <a className="btn btn-primary" href="/upload">
                Upload Artwork
              </a>
              <a
                className="btn"
                href="/products"
                style={{
                  background: "rgba(255,255,255,.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.2)",
                }}
              >
                Browse Products
              </a>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="finish">Fast turnaround</div>
              <div className="finish">Upload print-ready artwork</div>
              <div className="finish">Simple ordering</div>
              <div className="finish">Premium print quality</div>
            </div>
          </div>

          {/* RIGHT */}
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
                borderRadius: 24,
                padding: 20,
                boxShadow: "0 20px 40px rgba(0,0,0,.15)",
              }}
            >
              <div className="badge">Business Cards</div>
              <h3>Premium Business Cards</h3>
              <div className="subtle">Matte, gloss, soft-touch</div>
              <div style={{ fontWeight: 800, marginTop: 10 }}>
                From $54
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                color: "#0f172a",
                borderRadius: 24,
                padding: 20,
                boxShadow: "0 20px 40px rgba(0,0,0,.15)",
              }}
            >
              <div className="badge">Flyers</div>
              <h3>Marketing Flyers</h3>
              <div className="subtle">High-quality promo prints</div>
              <div style={{ fontWeight: 800, marginTop: 10 }}>
                From $79
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 20,
                padding: 18,
              }}
            >
              <div style={{ color: "rgba(255,255,255,.7)" }}>
                Fast Turnaround
              </div>
              <strong style={{ fontSize: 24 }}>2–4 Days</strong>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 20,
                padding: 18,
              }}
            >
              <div style={{ color: "rgba(255,255,255,.7)" }}>
                File Types
              </div>
              <strong style={{ fontSize: 24 }}>PDF, PNG, JPG</strong>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section-band">
        <div className="page-head">
          <div>
            <div className="badge">Featured Products</div>
            <h2>Popular print products</h2>
            <div className="subtle">
              Choose your product and upload your artwork.
            </div>
          </div>
        </div>

        <div className="grid grid-4">
          {products.map((item) => (
            <div className="card product-card" key={item.slug}>
              {/* VISUAL MOCKUP */}
              <div
                style={{
                  height: 120,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 55,
                    background: "#fff",
                    borderRadius: 6,
                    boxShadow: "0 8px 20px rgba(0,0,0,.15)",
                    transform: "rotate(-6deg)",
                  }}
                />
              </div>

              <div className="product-top">
                <div className="badge">{item.badge}</div>
                <div className="subtle">{item.size}</div>
              </div>

              <h3>{item.name}</h3>
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

      {/* HOW IT WORKS */}
      <section className="section-band">
        <div className="page-head">
          <div>
            <div className="badge">How It Works</div>
            <h2>Simple print ordering</h2>
            <div className="subtle">
              Built for customers with ready-to-print files.
            </div>
          </div>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">1</div>
            <h3>Choose product</h3>
          </div>

          <div className="how-card">
            <div className="how-number">2</div>
            <h3>Upload artwork</h3>
          </div>

          <div className="how-card">
            <div className="how-number">3</div>
            <h3>Checkout</h3>
          </div>
        </div>
      </section>
    </div>
  );
}