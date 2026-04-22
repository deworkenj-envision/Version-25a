"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STATUS_OPTIONS = ["pending", "paid", "printing", "shipped", "delivered"];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "printing", label: "Printing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function formatMoney(value) {
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

function normalizeOrdersPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    printing: "bg-violet-100 text-violet-700 border-violet-200",
    shipped: "bg-sky-100 text-sky-700 border-sky-200",
    delivered: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[s] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {status || "—"}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load orders");
      }

      const nextOrders = normalizeOrdersPayload(data);
      setOrders(nextOrders);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter(
      (order) => (order?.status || "").toLowerCase() === activeFilter
    );
  }, [orders, activeFilter]);

  const selectedVisibleCount = useMemo(() => {
    const visibleSet = new Set(filteredOrders.map((o) => o.id));
    return selectedIds.filter((id) => visibleSet.has(id)).length;
  }, [filteredOrders, selectedIds]);

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedIds.includes(order.id));

  function toggleOrder(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAllVisible() {
    const visibleIds = filteredOrders.map((order) => order.id);

    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function applyBulkStatus(status) {
    if (!selectedIds.length) {
      setError("Please select at least one order.");
      setMessage("");
      return;
    }

    try {
      setBusyAction(status);
      setError("");
      setMessage("");

      const res = await fetch("/api/admin/orders/bulk-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderIds: selectedIds,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Failed to mark orders as ${status}`);
      }

      setMessage(
        `${selectedIds.length} order${
          selectedIds.length === 1 ? "" : "s"
        } updated to ${status}.`
      );

      await loadOrders();
      setSelectedIds([]);
    } catch (err) {
      setError(err.message || "Bulk update failed.");
    } finally {
      setBusyAction("");
    }
  }

  function printBulkPackingSlips() {
    if (!selectedIds.length) {
      setError("Please select at least one order.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");

    const params = new URLSearchParams();
    params.set("ids", selectedIds.join(","));

    window.open(`/api/admin/packing-slips?${params.toString()}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-8 py-8 text-slate-900">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Admin Orders</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage production, fulfillment, and shipment workflow.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-lg font-semibold">
                {selectedIds.length} order{selectedIds.length === 1 ? "" : "s"} selected
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {selectedVisibleCount} selected in current filter view
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={printBulkPackingSlips}
                disabled={!selectedIds.length}
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Bulk Print Packing Slips
              </button>

              <button
                onClick={() => applyBulkStatus("printing")}
                disabled={!selectedIds.length || busyAction !== ""}
                className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyAction === "printing" ? "Updating..." : "Mark Printing"}
              </button>

              <button
                onClick={() => applyBulkStatus("shipped")}
                disabled={!selectedIds.length || busyAction !== ""}
                className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyAction === "shipped" ? "Updating..." : "Mark Shipped"}
              </button>

              <button
                onClick={() => applyBulkStatus("delivered")}
                disabled={!selectedIds.length || busyAction !== ""}
                className="rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyAction === "delivered" ? "Updating..." : "Mark Delivered"}
              </button>

              <button
                onClick={clearSelection}
                disabled={!selectedIds.length}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            const count =
              filter.key === "all"
                ? orders.length
                : orders.filter(
                    (order) => (order?.status || "").toLowerCase() === filter.key
                  ).length;

            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter.label} ({count})
              </button>
            );
          })}

          <button
            onClick={toggleSelectAllVisible}
            disabled={!filteredOrders.length}
            className="ml-auto rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allVisibleSelected ? "Unselect Visible" : "Select All Visible"}
          </button>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#041b4d] text-white">
                <tr>
                  <th className="w-16 px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-5 w-5 accent-blue-600"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Order
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                      No orders found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => {
                    const checked = selectedIds.includes(order.id);

                    return (
                      <tr
                        key={order.id}
                        className={`border-t border-slate-200 ${
                          index % 2 === 0 ? "bg-[#eef4ef]" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-5 align-top">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOrder(order.id)}
                            className="h-5 w-5 accent-blue-600"
                          />
                        </td>

                        <td className="px-4 py-5 align-top">
                          <div className="font-semibold">{order.order_number || "—"}</div>
                        </td>

                        <td className="px-4 py-5 align-top">
                          <div className="font-semibold">
                            {order.customer_name || "—"}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {order.customer_email || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-5 align-top">
                          {order.product_name || "—"}
                        </td>

                        <td className="px-4 py-5 align-top font-semibold">
                          {formatMoney(order.total)}
                        </td>

                        <td className="px-4 py-5 align-top">
                          <StatusBadge status={order.status} />
                        </td>

                        <td className="px-4 py-5 align-top text-slate-700">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-4 py-5 align-top">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                          >
                            Open
                          </Link>
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
    </main>
  );
}