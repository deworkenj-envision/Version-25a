import { products } from '../../lib/data';

export default function ProductsPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Products</h1>
        <p className="section-subtitle">All core product screens are fully populated in this build.</p>
        <div className="grid grid-2">
          {products.map((product) => (
            <div className="card" key={product.slug}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{product.name}</h2>
                <span className="badge success">From ${product.priceFrom}</span>
              </div>
              <p className="muted">{product.description}</p>
              <p><strong>Turnaround:</strong> {product.turnaround}</p>
              <p><strong>Sizes:</strong> {product.sizes.join(', ')}</p>
              <ul className="list">
                {product.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a className="btn btn-secondary" href="/pricing">Price this item</a>
                <a className="btn btn-primary" href="/designer">Design now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
