import { mockOrders } from '../../lib/data';

export default function AdminPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Admin Queue</h1>
        <p className="section-subtitle">A populated proof and production view so the admin screens show real content immediately.</p>
        <div className="grid grid-3" style={{ marginBottom: 18 }}>
          <div className="metric"><strong>6</strong><span className="muted">Awaiting proof approval</span></div>
          <div className="metric"><strong>4</strong><span className="muted">Printing today</span></div>
          <div className="metric"><strong>2</strong><span className="muted">Needs customer follow-up</span></div>
        </div>
        <div className="panel">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Status</th><th>Placed</th></tr></thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.status}</td>
                  <td>{order.placedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
