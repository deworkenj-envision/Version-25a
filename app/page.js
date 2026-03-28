import { dashboardMetrics, products, mockOrders } from '../lib/data';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="kicker">Premium print SaaS</div>
            <h1 className="h1">Launch real print products, quotes, proofs, and orders.</h1>
            <p className="lead">
              V25 is a populated full-site build with a working designer preview, pricing tools, checkout scaffolding,
              account dashboards, and admin workflow screens.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="/designer">Start Designing</a>
              <a className="btn btn-secondary" href="/pricing">View Pricing</a>
            </div>
          </div>
          <div className="hero-card">
            <div className="grid grid-2">
              {dashboardMetrics.map((metric) => (
                <div className="metric" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span className="muted">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured products</h2>
          <p className="section-subtitle">The catalog below is fully populated so the site previews like a real storefront instead of placeholders.</p>
          <div className="grid grid-4">
            {products.map((product) => (
              <div className="card" key={product.slug}>
                <div className="badge info">From ${product.priceFrom}</div>
                <h3>{product.name}</h3>
                <p className="muted">{product.description}</p>
                <p className="muted">Turnaround: {product.turnaround}</p>
                <a className="btn btn-secondary" href="/products">View product</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="panel">
            <h2 className="section-title">What works now</h2>
            <ul className="list">
              <li>Multi-page storefront</li>
              <li>Live pricing calculator</li>
              <li>Prompt-based procedural design concepts</li>
              <li>Checkout route with Stripe-ready API</li>
              <li>Dashboard and admin previews with sample orders</li>
            </ul>
          </div>
          <div className="panel">
            <h2 className="section-title">Recent orders preview</h2>
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Product</th><th>Status</th><th>Total</th></tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.status}</td>
                    <td>${order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
