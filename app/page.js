import { products, trustPoints } from "./lib/products";

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 28 }}>
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
          <div style={{ display: "grid", alignContent: "center", gap: 16 }}>
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
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

            <h1
              style={{
                fontSize: 64,
                lineHeight: 0.95,
                margin: 0,
                maxWidth: 760,
              }}
            >
              Professional printing for customers who already have artwork ready.
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.78)",
                margin: 0,
                maxWidth: 700,
              }}
            >
              Order business cards, flyers, banners, and postcards with a clean,
              simple upload-first process. No design tool. No clutter. Just fast,
              straightforward print ordering.
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
                  border: "1px solid rgba(255,255,255,.15)",
                }}
              >
                Browse Products
              </a>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              {trustPoints.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.08)",
                    border: "1px solid rgba(255,255,255,.12)",
                    fontSize: 13,
                    color: "rgba(255,255,255,.9)",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              alignContent: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  borderRadius: 26,
                  padding: 18,
                  minHeight: 170,
                  boxShadow: "0 20px 50px rgba(0,0,0,.15)",
                }}
              >
                <div className="badge">Business Cards</div>
                <h3 style={{ margin: "14px 0 8px", fontSize: 22 }}>
                  Matte, gloss, and soft-touch finishes
                </h3>
                <div className="subtle">
                  Clean, premium cards printed from your finished files.
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  borderRadius: 26,
                  padding: 18,
                  minHeight: 170,
                  boxShadow: "0 20px 50px rgba(0,0,0,.15)",
                }}
              >
                <div className="badge">Banners</div>
                <h3 style={{ margin: "14px 0 8px", fontSize: 22 }}>
                  Large-format prints for events and storefronts
                </h3>
                <div className="subtle">
                  Simple upload flow for ready-to-print signage.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 22,
                  padding: 18,
                }}
              >
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
                  Design tool
                </div>
                <strong style={{ fontSize: 28 }}>Removed</strong>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 22,
                  padding: 18,
                }}
              >
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
                  Order flow
                </div>
                <strong style={{ fontSize: 28 }}>Simple</strong>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 22,
                  padding: 18,
                }}
              >
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
                  Best for
                </div>
                <strong style={{ fontSize: 28 }}>Ready Files</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">Featured Products</div>
            <h2 style={{ margin: "10px 0 6px" }}>
              Popular print products customers order most
            </h2>
            <div className="subtle">
              Clear product choices with pricing cues and quick upload access.
            </div>
          </div>
        </div>

        <div className="grid grid-4">
          {products.map((item) => (
            <div className="card product-card" key={item.slug}>
              <div className="product-top">
                <div className="badge">{item.badge}</div>
                <div className="subtle">{item.size}</div>
              </div>

              <h3 style={{ margin: 0 }}>{item.name}</h3>
              <div className="subtle">{item.lead}</div>

              <div className="finish-row">
                {item.finishes.map((finish) => (
                  <div key={finish} className="finish">
                    {finish}
                  </div>
                ))}
              </div>

              <div className="price">Starting at {item.starting}</div>

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
            <h2 style={{ margin: "10px 0 6px" }}>
              A faster path from finished artwork to checkout
            </h2>
            <div className="subtle">
              Built for customers who already know what they want to print.
            </div>
          </div>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">1</div>
            <h3>Choose a product</h3>
            <div className="subtle">
              Select business cards, flyers, banners, or postcards.
            </div>
          </div>
          <div className="how-card">
            <div className="how-number">2</div>
            <h3>Upload artwork</h3>
            <div className="subtle">
              Send your print-ready PDF, PNG, JPG, or SVG file.
            </div>
          </div>
          <div className="how-card">
            <div className="how-number">3</div>
            <h3>Review and order</h3>
            <div className="subtle">
              Confirm the details and continue directly to checkout.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}