import { products } from "./lib/products";
export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 26 }}>
      <section className="hero">
        <div className="hero-pane">
          <div className="badge">Simple upload storefront</div>
          <h1>Choose a product and upload print-ready artwork.</h1>
          <p>This version removes the design tool completely. Visitors pick the product they want, upload finished artwork, add a few order details, and move to checkout.</p>
          <div className="toolbar" style={{ marginTop: 18 }}>
            <a className="btn btn-primary" href="/upload">Upload Artwork</a>
            <a className="btn btn-secondary" href="/products">Browse Products</a>
          </div>
        </div>
        <div className="hero-card">
          <div className="kpis">
            <div className="kpi"><div className="subtle">Design tool</div><strong>Removed</strong></div>
            <div className="kpi"><div className="subtle">Customer flow</div><strong>Simplified</strong></div>
            <div className="kpi"><div className="subtle">Ordering</div><strong>Faster</strong></div>
          </div>
        </div>
      </section>
      <section className="grid grid-4">
        {products.map((item) => (
          <div className="card product-card" key={item.slug}>
            <div className="badge">{item.badge}</div>
            <h3 style={{ margin: "4px 0 0" }}>{item.name}</h3>
            <div className="subtle" style={{ fontSize: 13 }}>{item.size}</div>
            <div className="subtle">{item.description}</div>
            <div style={{ marginTop: 6, fontWeight: 800 }}>Starting at {item.starting}</div>
            <a className="btn btn-primary" href="/upload">Order {item.name}</a>
          </div>
        ))}
      </section>
    </div>
  );
}
