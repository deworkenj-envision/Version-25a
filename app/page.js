import { products } from "./lib/products";
export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 28 }}>
      <section className="hero">
        <div className="hero-pane">
          <div className="badge">Premium upload storefront</div>
          <h1>Premium print ordering without the design-tool headache.</h1>
          <p>Visitors choose a product, upload print-ready artwork, add a few job details, and move forward quickly. The flow stays simple, but the storefront feels more polished and trustworthy.</p>
          <div className="toolbar" style={{ marginTop: 18 }}>
            <a className="btn btn-primary" href="/upload">Upload Artwork</a>
            <a className="btn btn-secondary" href="/products">Browse Products</a>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-stack">
            <div className="hero-mini">
              <div className="badge">Easy ordering</div>
              <h3 style={{ margin: "12px 0 6px" }}>Choose product → Upload artwork → Checkout</h3>
              <div className="subtle">No designer. No clutter. Just a cleaner order path.</div>
            </div>
            <div className="kpis">
              <div className="kpi"><div className="subtle">Design tool</div><strong>Removed</strong></div>
              <div className="kpi"><div className="subtle">Ordering flow</div><strong>Cleaner</strong></div>
              <div className="kpi"><div className="subtle">Visitor experience</div><strong>Faster</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">How it works</div>
            <h2 style={{ margin: "10px 0 6px" }}>Simple enough for any customer</h2>
            <div className="subtle">A cleaner process designed for visitors who already have finished artwork.</div>
          </div>
        </div>
        <div className="how-grid">
          <div className="how-card"><div className="how-number">1</div><h3>Choose a product</h3><div className="subtle">Pick the print item you need without digging through a complicated tool.</div></div>
          <div className="how-card"><div className="how-number">2</div><h3>Upload artwork</h3><div className="subtle">Send your finished PDF, PNG, JPG, or SVG file directly with the order.</div></div>
          <div className="how-card"><div className="how-number">3</div><h3>Approve and order</h3><div className="subtle">Review the summary, confirm the details, and move on to checkout.</div></div>
        </div>
      </section>

      <section className="grid grid-4">
        {products.map((item) => (
          <div className="card product-card" key={item.slug}>
            <div className="badge">{item.badge}</div>
            <h3 style={{ margin: "4px 0 0" }}>{item.name}</h3>
            <div className="subtle" style={{ fontSize: 13 }}>{item.size}</div>
            <div className="subtle">{item.description}</div>
            <div className="price">Starting at {item.starting}</div>
            <a className="btn btn-primary" href="/upload">Order {item.name}</a>
          </div>
        ))}
      </section>

      <section className="section-band">
        <div className="page-head" style={{ marginTop: 0 }}>
          <div>
            <div className="badge">Why customers trust this flow</div>
            <h2 style={{ margin: "10px 0 6px" }}>Simple on purpose</h2>
            <div className="subtle">The site feels cleaner because it focuses on the actual purchase, not a complicated builder.</div>
          </div>
        </div>
        <div className="trust-grid">
          <div className="trust-card"><h3>Clear path to order</h3><div className="subtle">Visitors immediately understand what to do when they arrive.</div></div>
          <div className="trust-card"><h3>No design confusion</h3><div className="subtle">Customers with ready artwork do not have to fight a design interface first.</div></div>
          <div className="trust-card"><h3>More premium storefront feel</h3><div className="subtle">Stronger spacing, typography, and content hierarchy make the site feel more trustworthy.</div></div>
        </div>
      </section>
    </div>
  );
}
