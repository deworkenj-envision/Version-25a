import { products, trustPoints } from "./lib/products";
export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 28 }}>
      <section className="hero">
        <div className="hero-pane">
          <div className="badge">Real print storefront</div>
          <h1>Upload your print-ready files and place the order fast.</h1>
          <p>Built for customers who already have finished artwork. Choose the product, upload the file, confirm the job details, and move to checkout without getting stuck inside a design tool.</p>
          <div className="toolbar" style={{ marginTop: 18 }}>
            <a className="btn btn-primary" href="/upload">Upload Artwork</a>
            <a className="btn btn-secondary" href="/products">Browse Products</a>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-grid">
            <div className="print-swatch">
              <div className="print-chip">Business Cards</div>
              <div><h3 style={{ margin: "12px 0 6px" }}>Matte, gloss, and soft-touch finishes</h3><div className="subtle">Printed from your finished design with a faster, simpler order path.</div></div>
            </div>
            <div className="print-swatch">
              <div className="print-chip">Large Format</div>
              <div><h3 style={{ margin: "12px 0 6px" }}>Banners for events, storefronts, and promotions</h3><div className="subtle">Upload finished files and move quickly to production-ready checkout.</div></div>
            </div>
            <div className="mini-card"><div className="subtle">Ordering flow</div><strong style={{ fontSize: 30 }}>Simple</strong></div>
            <div className="mini-card"><div className="subtle">Design tool</div><strong style={{ fontSize: 30 }}>Removed</strong></div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">Why this works</div>
            <h2 style={{ margin: "10px 0 6px" }}>Built for real print customers</h2>
            <div className="subtle">The site feels more like a print company because it focuses on products, turnaround, and uploading finished files.</div>
          </div>
        </div>
        <div className="trust-grid">
          {trustPoints.map((item) => (
            <div className="trust-card" key={item}>
              <h3 style={{ marginTop: 0 }}>{item}</h3>
              <div className="subtle">Clear, focused ordering without extra steps that slow the customer down.</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">How it works</div>
            <h2 style={{ margin: "10px 0 6px" }}>A better upload-first print flow</h2>
            <div className="subtle">Everything is designed to get the visitor from product selection to checkout faster.</div>
          </div>
        </div>
        <div className="how-grid">
          <div className="how-card"><div className="how-number">1</div><h3>Choose a product</h3><div className="subtle">Select the print item you need, from business cards to banners.</div></div>
          <div className="how-card"><div className="how-number">2</div><h3>Upload finished artwork</h3><div className="subtle">Attach your PDF, PNG, JPG, or SVG file directly with the order.</div></div>
          <div className="how-card"><div className="how-number">3</div><h3>Review and order</h3><div className="subtle">Confirm the details and continue to checkout with a cleaner, simpler process.</div></div>
        </div>
      </section>

      <section className="grid grid-4">
        {products.map((item) => (
          <div className="card product-card" key={item.slug}>
            <div className="product-top">
              <div className="badge">{item.badge}</div>
              <div className="subtle">{item.size}</div>
            </div>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <div className="subtle">{item.lead}</div>
            <div className="finish-row">
              {item.finishes.map((finish) => <div key={finish} className="finish">{finish}</div>)}
            </div>
            <div className="price">Starting at {item.starting}</div>
            <a className="btn btn-primary" href="/upload">Order {item.name}</a>
          </div>
        ))}
      </section>
    </div>
  );
}
