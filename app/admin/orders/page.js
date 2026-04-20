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
    return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30";
  }
  if (s === "printing") {
    return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30";
  }
  if (s === "shipped") {
    return "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30";
  }
  if (s === "delivered") {
    return "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30";
  }

  return "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-500/30";
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

      const rows = Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
      setOrders(rows);
    } catch (err) {
      console.error("Failed to load orders:", err);
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
    const ids = encodeURIComponent(selectedIds.join(","));
    window.open(`/admin/packing-slips?ids=${ids}`, "_blank");
  }

  function openSinglePackingSlip(id) {
    window.open(`/admin/packing-slips?ids=${encodeURIComponent(id)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Orders</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage orders, view details, and bulk print packing slips.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order #, customer, email, product..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600 sm:w-96"
            />
            <button
              onClick={loadOrders}
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{selectedIds.length}</span>{" "}
              order{selectedIds.length === 1 ? "" : "s"} selected
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={openBulkPackingSlips}
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Print Packing Slips
              </button>

              <button
                onClick={clearSelection}
                className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
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
                    <td colSpan={8} className="px-4 py-10 text-center text-zinc-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-zinc-400">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedIds.includes(order.id);

                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-zinc-800 last:border-b-0 ${
                          isSelected ? "bg-zinc-900/70" : "bg-transparent"
                        }`}
                      >
                        <td className="px-4 py-4 align-top">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(order.id)}
                            className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                          />
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-white">
                            {order.order_number || "No Order #"}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500 break-all">
                            {order.id}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-white">
                            {order.customer_name || "—"}
                          </div>
                          <div className="mt-1 text-sm text-zinc-400">
                            {order.customer_email || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-white">
                            {order.product_name || "—"}
                          </div>
                          <div className="mt-1 text-sm text-zinc-400">
                            {[order.size, order.paper, order.finish, order.sides]
                              .filter(Boolean)
                              .join(" • ") || "—"}
                          </div>
                          <div className="mt-1 text-sm text-zinc-500">
                            Qty: {order.quantity || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top font-semibold text-white">
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

                        <td className="px-4 py-4 align-top text-sm text-zinc-400">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-900"
                            >
                              Open
                            </Link>

                            <button
                              onClick={() => openSinglePackingSlip(order.id)}
                              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90"
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