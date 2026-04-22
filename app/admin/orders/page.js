"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = ["pending", "paid", "printing", "shipped", "delivered"];

function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function statusClasses(status) {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "paid":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "printing":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "shipped":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("printing");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();

      const list = Array.isArray(data?.orders) ? data.orders : [];
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setOrders(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const allVisibleIds = useMemo(() => orders.map((o) => o.id).filter(Boolean), [orders]);

  const allSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedOrderIds.includes(id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(allVisibleIds);
    }
  }

  function toggleSelectOne(orderId) {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }

  async function handleBulkStatusUpdate() {
    if (!selectedOrderIds.length) {
      alert("Please select at least one order.");
      return;
    }

    try {
      setBusy(true);
      setError("");

      const res = await fetch("/api/admin/orders/bulk-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          status: bulkStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update selected orders.");
      }

      await loadOrders();
      setSelectedOrderIds([]);
      alert(`Updated ${data?.updatedCount || 0} orders to ${bulkStatus}.`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update selected orders.");
      alert(err.message || "Failed to update selected orders.");
    } finally {
      setBusy(false);
    }
  }

  function handlePrintBulkPackingSlips() {
    if (!selectedOrderIds.length) {
      alert("Please select at least one order.");
      return;
    }

    const ids = selectedOrderIds.join(",");
    const url = `/admin/packing-slips?ids=${encodeURIComponent(ids)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Orders
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage orders, update statuses, and print packing slips.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm font-medium text-gray-700">
              {selectedOrderIds.length} selected
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleBulkStatusUpdate}
                disabled={busy}
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Applying..." : "Apply Bulk Status"}
              </button>

              <button
                onClick={handlePrintBulkPackingSlips}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Print Bulk Packing Slips
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-sm text-gray-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-sm text-gray-600">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-200">
                      <td className="px-4 py-4 align-top">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => toggleSelectOne(order.id)}
                        />
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="font-semibold text-gray-900">
                          {order.order_number || "—"}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{order.id}</div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-gray-900">
                          {order.customer_name || "—"}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {order.customer_email || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-gray-900">
                          {order.product_name || "—"}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {order.size || "—"} · {order.quantity || 0}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                            order.status
                          )}`}
                        >
                          {order.status || "unknown"}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-top text-gray-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            Open
                          </a>

                          <a
                            href={`/admin/packing-slips?ids=${encodeURIComponent(order.id)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700"
                          >
                            Packing Slip
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}