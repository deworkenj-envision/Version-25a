"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load orders");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Admin orders fetch error:", err);
      setError(err.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Orders
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            View all submitted print orders.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <button
              onClick={loadOrders}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Refresh Orders
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-sm text-slate-600">
              Loading orders...
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-sm text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-600">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Quantity</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Total</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100">
                      <td className="px-6 py-4 text-slate-900">{order.id}</td>
                      <td className="px-6 py-4 text-slate-900">
                        {order.customer_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {order.customer_email || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {order.product_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {order.quantity ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {typeof order.total === "number"
                          ? `$${order.total.toFixed(2)}`
                          : order.total
                          ? `$${Number(order.total).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {order.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}