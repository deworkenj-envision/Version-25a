import { dashboardMetrics, mockOrders } from '../../lib/data';
import DesignLibrary from '../components/DesignLibrary';

export default function DashboardPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Customer Dashboard</h1>
        <p className="section-subtitle">Populated dashboard metrics and order history are included in the real preview build.</p>
        <div className="grid grid-4">
          {dashboardMetrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span className="muted">{metric.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-2" style={{ marginTop: 18 }}>
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Recent Orders</h2>
            <table className="table">
              <thead><tr><th>ID</th><th>Product</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.product}</td>
                    <td><span className={`badge ${order.status === 'Shipped' ? 'success' : order.status === 'Printing' ? 'warn' : 'info'}`}>{order.status}</span></td>
                    <td>${order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DesignLibrary />
        </div>
      </div>
    </main>
  );
}
