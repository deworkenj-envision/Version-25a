"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/orders", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load orders.");
          return;
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Admin
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Orders</h1>
          <p className="mt-2 text-slate-600">
            View paid orders received from Stripe checkout.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="text-slate-600">Loading orders...</div>
          ) : error ? (
            <div className="font-medium text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-slate-600">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-4 py-3 font-semibold text-slate-900">Order #</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Customer</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Email</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Product</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Qty</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Total</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Status</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Artwork</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id || order.stripe_session_id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-3">{order.order_number || "-"}</td>
                      <td className="px-4 py-3">{order.customer_name || "-"}</td>
                      <td className="px-4 py-3">{order.customer_email || "-"}</td>
                      <td className="px-4 py-3">{order.product_name || "-"}</td>
                      <td className="px-4 py-3">{order.quantity || "-"}</td>
                      <td className="px-4 py-3">
                        {typeof order.total === "number"
                          ? `$${order.total.toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">{order.status || "-"}</td>
                      <td className="px-4 py-3">
                        {order.artwork_url ? (
                          <a
                            href={order.artwork_url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            View File
                          </a>
                        ) : (
                          "-"
                        )}
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