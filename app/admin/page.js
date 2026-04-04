"use client";

import { useEffect, useMemo, useState } from "react";

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const metrics = useMemo(() => {
    const pendingPayment = orders.filter(
      (order) => order.status === "pending_payment"
    ).length;

    const inProduction = orders.filter((order) =>
      ["paid", "processing", "printing"].includes(
        String(order.status || "").toLowerCase()
      )
    ).length;

    const needsFollowUp = orders.filter(
      (order) =>
        !order.customer_email ||
        !order.artwork_url ||
        String(order.status || "").toLowerCase().includes("issue")
    ).length;

    return {
      total: orders.length,
      pendingPayment,
      inProduction,
      needsFollowUp,
    };
  }, [orders]);

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Order management
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Review incoming print orders, monitor payment status, and manage
              production from one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Total
            </div>
            <div className="mt-3 text-4xl font-bold text-slate-900">
              {metrics.total}
            </div>
            <div className="mt-2 text-sm text-slate-500">All orders</div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Awaiting Payment
            </div>
            <div className="mt-3 text-4xl font-bold text-slate-900">
              {metrics.pendingPayment}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Orders not yet paid
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              In Production
            </div>
            <div className="mt-3 text-4xl font-bold text-slate-900">
              {metrics.inProduction}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Paid or being processed
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Needs Follow-Up
            </div>
            <div className="mt-3 text-4xl font-bold text-slate-900">
              {metrics.needsFollowUp}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Missing info or issue flagged
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Live Orders
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Recent order queue
              </h2>
            </div>

            <button
              type="button"
              onClick={loadOrders}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600">
              Loading orders...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600">
              No orders found yet.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-sm text-slate-500">
                    <th className="px-4 py-2">Order</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id || order.order_number}
                      className="rounded-2xl bg-slate-50 text-sm text-slate-700"
                    >
                      <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">
                        {order.order_number || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {order.customer_name || "—"}
                        </div>
                        <div className="text-slate-500">
                          {order.customer_email || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4">{order.product_name || "—"}</td>
                      <td className="px-4 py-4">{order.quantity || "—"}</td>
                      <td className="px-4 py-4">{formatMoney(order.total)}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200">
                          {order.status || "—"}
                        </span>
                      </td>
                      <td className="rounded-r-2xl px-4 py-4">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
