"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function money(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
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
  const s = String(status || "").toLowerCase();

  if (s === "paid") {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }
  if (s === "printing") {
    return "bg-amber-100 text-amber-700 border border-amber-200";
  }
  if (s === "shipped") {
    return "bg-sky-100 text-sky-700 border border-sky-200";
  }
  if (s === "delivered") {
    return "bg-violet-100 text-violet-700 border border-violet-200";
  }

  return "bg-slate-100 text-slate-700 border border-slate-200";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();

      const rows = Array.isArray(data?.orders)
        ? data.orders
        : Array.isArray(data)
        ? data
        : [];

      setOrders(rows);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
      const haystack = [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.product_name,
        order.status,
        order.tracking_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [orders, query]);

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedIds.includes(order.id));

  function toggleOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredOrders.some((order) => order.id === id))
      );
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredOrders.forEach((order) => next.add(order.id));
      return Array.from(next);
    });
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function openBulkPackingSlips() {
    if (!selectedIds.length) return;
    const ids = selectedIds.join(",");
    window.open(`/admin/packing-slips?ids=${encodeURIComponent(ids)}`, "_blank");
  }

  function openSinglePackingSlip(id) {
    window.open(`/admin/packing-slips?ids=${encodeURIComponent(id)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Orders
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage orders, open details, and print packing slips in bulk.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order #, customer, email, product..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 sm:w-96"
            />
            <button
              onClick={loadOrders}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">
                  {selectedIds.length}
                </span>{" "}
                order{selectedIds.length === 1 ? "" : "s"} selected
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openBulkPackingSlips}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Bulk Print Packing Slips
                </button>

                <button
                  onClick={clearSelection}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedIds.includes(order.id);

                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-slate-200 last:border-b-0 ${
                          isSelected ? "bg-emerald-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-4 align-top">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(order.id)}
                            className="mt-1 h-4 w-4"
                          />
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-slate-900">
                            {order.order_number || "No Order #"}
                          </div>
                          <div className="mt-1 break-all text-xs text-slate-500">
                            {order.id}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-slate-900">
                            {order.customer_name || "—"}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {order.customer_email || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-slate-900">
                            {order.product_name || "—"}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {[order.size, order.paper, order.finish, order.sides]
                              .filter(Boolean)
                              .join(" • ") || "—"}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Qty: {order.quantity || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top font-semibold text-slate-900">
                          {money(order.total)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses(
                              order.status
                            )}`}
                          >
                            {order.status || "pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-sm text-slate-600">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                            >
                              Open
                            </Link>

                            <button
                              onClick={() => openSinglePackingSlip(order.id)}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Packing Slip
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}