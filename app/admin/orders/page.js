import StatusSelect from "./status-select";

async function getOrders() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/orders`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  return response.json();
}

export default async function AdminOrdersPage() {
  const data = await getOrders();
  const allOrders = data.orders || [];
  const orders = allOrders.filter((order) => order.order_number);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Admin
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Orders Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Review the most recent customer print orders.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order #</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Size</th>
                  <th className="px-4 py-3 font-semibold">Paper</th>
                  <th className="px-4 py-3 font-semibold">Finish</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Artwork</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-4 py-6 text-center text-slate-500">
                      No print orders found yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3">{order.customer_name}</td>
                      <td className="px-4 py-3">{order.customer_email}</td>
                      <td className="px-4 py-3">{order.product_name}</td>
                      <td className="px-4 py-3">{order.size}</td>
                      <td className="px-4 py-3">{order.paper}</td>
                      <td className="px-4 py-3">{order.finish}</td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {order.total != null ? `$${Number(order.total).toFixed(2)}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {order.artwork_url ? (
                          <a
                            href={order.artwork_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            View File
                          </a>
                        ) : (
                          <span className="text-slate-400">No file</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect id={order.id} currentStatus={order.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}