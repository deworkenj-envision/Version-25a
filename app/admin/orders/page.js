"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "printing", label: "Printing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
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

function statusBadgeClass(status) {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "bg-purple-100 text-purple-700 border border-purple-200";
    case "shipped":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "printing":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case "paid":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [applyingBulk, setApplyingBulk] = useState(false);

  async function loadOrders(showSpinner = true) {
    try {
      if (showSpinner) setLoading(true);
      else setRefreshing(true);

      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders(true);
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
      return [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.product_name,
        order.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [orders, search]);

  const selectedCount = selectedIds.length;

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedIds.includes(order.id));

  function toggleSelectAllVisible() {
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

  function toggleSelectOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function clearSelection() {
    setSelectedIds([]);
    setBulkAction("");
  }

  function handleBulkPrintPackingSlips() {
    if (!selectedIds.length) {
      alert("Please select at least one order first.");
      return;
    }

    const ids = encodeURIComponent(selectedIds.join(","));
    window.open(`/admin/packing-slips?ids=${ids}`, "_blank");
  }

  async function applyBulkAction() {
    if (!selectedIds.length) {
      alert("Please select at least one order first.");
      return;
    }

    if (!bulkAction) {
      alert("Please choose a bulk action first.");
      return;
    }

    const selectedStatus = bulkAction.replace("status:", "");

    try {
      setApplyingBulk(true);

      const res = await fetch("/api/admin/orders/bulk-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderIds: selectedIds,
          status: selectedStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Bulk update failed");
      }

      await loadOrders(false);
      clearSelection();
      alert("Bulk action applied successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message || "Bulk action failed.");
    } finally {
      setApplyingBulk(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-6 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0b1b44]">
              Admin Orders
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Manage orders, open details, and print packing slips in bulk.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer, email, product..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm outline-none transition focus:border-[#0b1b44] sm:w-[385px]"
            />
            <button
              onClick={() => loadOrders(false)}
              disabled={refreshing}
              className="rounded-2xl bg-[#0b1b44] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div className="text-base font-medium text-[#0b1b44]">
              {selectedCount} order{selectedCount === 1 ? "" : "s"} selected
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
              <button
                onClick={handleBulkPrintPackingSlips}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bulk Print Packing Slips
              </button>

              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b1b44]"
              >
                <option value="">Bulk Actions</option>
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={`status:${option.value}`}
                  >
                    Mark as {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={applyBulkAction}
                disabled={!bulkAction || applyingBulk}
                className="rounded-2xl bg-[#0b1b44] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyingBulk ? "Applying..." : "Apply"}
              </button>

              <button
                onClick={clearSelection}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0b1b44] transition hover:bg-slate-50"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#081633] text-white">
                <tr>
                  <th className="w-[60px] px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-5 w-5 rounded border-white/40"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Order
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => {
                    const checked = selectedIds.includes(order.id);

                    return (
                      <tr
                        key={order.id}
                        className={
                          index % 2 === 0 ? "bg-[#eef7f1]" : "bg-white"
                        }
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelectOne(order.id)}
                            className="h-5 w-5 rounded"
                          />
                        </td>

                        <td className="px-4 py-4 font-semibold text-[#0b1b44]">
                          {order.order_number || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900">
                            {order.customer_name || "—"}
                          </div>
                          <div className="text-sm text-slate-500">
                            {order.customer_email || ""}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-800">
                          {order.product_name || "—"}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {formatMoney(order.total)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}
                          >
                            {order.status || "pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0b1b44] transition hover:bg-slate-50"
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
    </div>
  );
}