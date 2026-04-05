"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = ["paid", "printing", "shipped", "cancelled"];

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
  const [statusValues, setStatusValues] = useState({});
  const [updatingId, setUpdatingId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch("/api/orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load orders.");
      }

      const nextOrders = Array.isArray(data.orders) ? data.orders : [];
      setOrders(nextOrders);

      const nextStatusValues = {};
      nextOrders.forEach((order) => {
        const rowKey = order?.id || order?.order_number;
        if (rowKey) {
          nextStatusValues[rowKey] = String(
            order.status || "paid"
          ).toLowerCase();
        }
      });
      setStatusValues(nextStatusValues);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(rowKey) {
    try {
      const nextStatus = statusValues[rowKey];

      if (!rowKey || !nextStatus) {
        setError("Missing order id");
        return;
      }

      setUpdatingId(rowKey);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `/api/orders/${encodeURIComponent(rowKey)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status.");
      }

      setOrders((current) =>
        current.map((order) => {
          const currentKey = order.id || order.order_number;
          return currentKey === rowKey
            ? { ...order, status: nextStatus }
            : order;
        })
      );

      setSuccessMessage("Order status updated.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId("");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const metrics = useMemo(() => {
    const awaitingPayment = orders.filter(
      (order) => String(order.status || "").toLowerCase() === "pending_payment"
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
      awaitingPayment,
      inProduction,
      needsFollowUp,
    };
  }, [orders]);

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Order management
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Review incoming print orders, monitor payment status, download
              artwork, and manage production from one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
              {metrics.awaitingPayment}
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

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {successMessage ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              {successMessage}
            </div>
          ) : null}

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
            <div className="-mx-4 mt-6 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full align-middle px-4 sm:px-6 lg:px-8">
                <table className="min-w-[1820px] border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-sm text-slate-500">
                      <th className="px-5 py-2 whitespace-nowrap">Order</th>
                      <th className="px-5 py-2 whitespace-nowrap">Customer</th>
                      <th className="px-5 py-2 whitespace-nowrap">Product</th>
                      <th className="px-5 py-2 whitespace-nowrap">Quantity</th>
                      <th className="px-5 py-2 whitespace-nowrap">Total</th>
                      <th className="px-5 py-2 whitespace-nowrap">Status</th>
                      <th className="px-5 py-2 whitespace-nowrap">Placed</th>
                      <th className="px-5 py-2 whitespace-nowrap">Artwork</th>
                      <th className="px-5 py-2 whitespace-nowrap">Update</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => {
                      const rowKey = order.id || order.order_number;
                      const currentStatus =
                        statusValues[rowKey] ||
                        String(order.status || "paid").toLowerCase();

                      return (
                        <tr
                          key={rowKey}
                          className="bg-slate-50 text-sm text-slate-700"
                        >
                          <td className="rounded-l-2xl px-5 py-5 font-semibold text-slate-900 whitespace-nowrap">
                            {order.order_number || "—"}
                          </td>

                          <td className="px-5 py-5 min-w-[280px]">
                            <div className="font-medium text-slate-900 break-words">
                              {order.customer_name || "—"}
                            </div>
                            <div className="text-slate-500 break-all">
                              {order.customer_email || "—"}
                            </div>
                          </td>

                          <td className="px-5 py-5 min-w-[220px] break-words">
                            {order.product_name || "—"}
                          </td>

                          <td className="px-5 py-5 whitespace-nowrap">
                            {order.quantity || "—"}
                          </td>

                          <td className="px-5 py-5 whitespace-nowrap">
                            {formatMoney(order.total)}
                          </td>

                          <td className="px-5 py-5 whitespace-nowrap">
                            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200">
                              {order.status || "—"}
                            </span>
                          </td>

                          <td className="px-5 py-5 min-w-[190px]">
                            {formatDate(order.created_at)}
                          </td>

                          <td className="px-5 py-5 min-w-[220px]">
                            {order.artwork_url ? (
                              <a
                                href={order.artwork_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100"
                              >
                                Download Artwork
                              </a>
                            ) : (
                              <span className="text-slate-400">No artwork</span>
                            )}
                            {order.file_name ? (
                              <div className="mt-2 text-xs text-slate-500 break-all">
                                {order.file_name}
                              </div>
                            ) : null}
                          </td>

                          <td className="rounded-r-2xl px-5 py-5 min-w-[360px]">
                            <div className="flex items-center gap-3">
                              <select
                                value={currentStatus}
                                onChange={(e) =>
                                  setStatusValues((prev) => ({
                                    ...prev,
                                    [rowKey]: e.target.value,
                                  }))
                                }
                                className="min-w-[180px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
                              >
                                {STATUS_OPTIONS.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => updateOrderStatus(rowKey)}
                                disabled={!rowKey || updatingId === rowKey}
                                className="shrink-0 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {updatingId === rowKey ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}