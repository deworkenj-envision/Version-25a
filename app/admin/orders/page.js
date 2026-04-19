"use client";

import { useEffect, useMemo, useState } from "react";

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function normalizeOrder(order) {
  return {
    ...order,
    status: order.status || "pending",
    carrier: order.carrier || "",
    tracking_number: order.tracking_number || "",
    tracking_url: order.tracking_url || "",
  };
}

function buildAddress(order) {
  return [
    order.shipping_address_line1,
    order.shipping_address_line2,
    `${order.shipping_city || ""} ${order.shipping_state || ""} ${order.shipping_postal_code || ""}`.trim(),
    order.shipping_country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getTimeValue(value) {
  const time = new Date(value || "").getTime();
  return Number.isFinite(time) ? time : 0;
}

function getMoneyValue(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingId, setSavingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  async function loadOrders(showRefreshState = false) {
    try {
      if (showRefreshState) setRefreshing(true);
      else setLoading(true);

      setError("");
      setSuccessMessage("");

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load orders.");
      }

      const rawOrders = Array.isArray(data?.orders) ? data.orders : [];
      const normalized = rawOrders.map(normalizeOrder);

      setOrders(normalized);

      const nextDrafts = {};
      normalized.forEach((order) => {
        nextDrafts[order.id] = {
          status: order.status || "pending",
          carrier: order.carrier || "",
          tracking_number: order.tracking_number || "",
          tracking_url: order.tracking_url || "",
        };
      });
      setDrafts(nextDrafts);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function updateDraft(orderId, updates) {
    setDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        ...updates,
      },
    }));
  }

  async function saveOrder(orderId) {
    try {
      setSavingId(orderId);
      setError("");
      setSuccessMessage("");

      const draft = drafts[orderId] || {};
      const order = orders.find((item) => item.id === orderId);

      if (!order) {
        throw new Error("Order not found.");
      }

      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: draft.status ?? order.status ?? "pending",
          carrier: draft.carrier ?? order.carrier ?? "",
          tracking_number: draft.tracking_number ?? order.tracking_number ?? "",
          tracking_url: draft.tracking_url ?? order.tracking_url ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update order.");
      }

      setSuccessMessage(
        data?.message ||
          `Order ${order.order_number || ""} updated successfully.`
      );

      await loadOrders(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update order.");
    } finally {
      setSavingId("");
    }
  }

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : (order.status || "pending") === statusFilter;

      if (!matchesStatus) return false;
      if (!query) return true;

      const searchableText = [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        order.product_name,
        order.file_name,
        order.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return getTimeValue(a.created_at) - getTimeValue(b.created_at);

        case "highest_total":
          return getMoneyValue(b.total) - getMoneyValue(a.total);

        case "lowest_total":
          return getMoneyValue(a.total) - getMoneyValue(b.total);

        case "customer_az":
          return String(a.customer_name || "").localeCompare(
            String(b.customer_name || ""),
            undefined,
            { sensitivity: "base" }
          );

        case "customer_za":
          return String(b.customer_name || "").localeCompare(
            String(a.customer_name || ""),
            undefined,
            { sensitivity: "base" }
          );

        case "newest":
        default:
          return getTimeValue(b.created_at) - getTimeValue(a.created_at);
      }
    });

    return sorted;
  }, [orders, searchTerm, statusFilter, sortBy]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Admin Orders
            </h1>
            <p className="mt-2 text-slate-600">
              View orders, update statuses, add shipment tracking, and open fulfillment sheets.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_220px]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Orders
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order #, customer, email, phone, product..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="all">all statuses</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="printing">printing</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sort Orders
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
              >
                <option value="newest">newest first</option>
                <option value="oldest">oldest first</option>
                <option value="highest_total">highest total</option>
                <option value="lowest_total">lowest total</option>
                <option value="customer_az">customer name A-Z</option>
                <option value="customer_za">customer name Z-A</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredOrders.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{orders.length}</span> orders
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {successMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading orders...
          </div>
        ) : null}

        {!loading && filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            No matching orders found.
          </div>
        ) : null}

        {!loading && filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const draft = drafts[order.id] || {};
              const isSaving = savingId === order.id;
              const address = buildAddress(order);

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          Order Number
                        </p>
                        <p className="mt-1 break-all text-base font-semibold">
                          {order.order_number || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          Customer
                        </p>
                        <p className="mt-1 break-all text-base font-semibold">
                          {order.customer_name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          Email
                        </p>
                        <p className="mt-1 break-all text-base font-semibold">
                          {order.customer_email || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          Phone
                        </p>
                        <p className="mt-1 break-all text-base font-semibold">
                          {order.customer_phone || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          Total
                        </p>
                        <p className="mt-1 text-base font-semibold">
                          {formatMoney(order.total)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          Created
                        </p>
                        <p className="mt-1 break-all text-base font-semibold">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Product
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {order.product_name || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Quantity
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {order.quantity ?? "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Shipping
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatMoney(order.shipping)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Current Status
                        </p>
                        <p className="mt-1 break-all font-semibold text-blue-700">
                          {order.status || "pending"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          File Name
                        </p>
                        <p className="mt-1 break-all font-semibold text-slate-900">
                          {order.file_name || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Shipping Address
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {order.shipping_name || "-"}
                        </p>
                        <p className="mt-1 break-words text-sm text-slate-700">
                          {address || "-"}
                        </p>
                      </div>
                    </div>

                    {order.notes ? (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-slate-900">
                          {order.notes}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Status
                        </label>
                        <select
                          value={draft.status ?? order.status ?? "pending"}
                          onChange={(e) =>
                            updateDraft(order.id, { status: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                        >
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="printing">printing</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Carrier
                        </label>
                        <select
                          value={draft.carrier ?? order.carrier ?? ""}
                          onChange={(e) =>
                            updateDraft(order.id, {
                              carrier: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                        >
                          <option value="">Select carrier</option>
                          <option value="UPS">UPS</option>
                          <option value="USPS">USPS</option>
                          <option value="FedEx">FedEx</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          value={draft.tracking_number ?? order.tracking_number ?? ""}
                          onChange={(e) =>
                            updateDraft(order.id, {
                              tracking_number: e.target.value,
                            })
                          }
                          placeholder="Enter tracking number"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Saved Carrier
                        </p>
                        <p className="mt-1 break-all font-semibold text-slate-900">
                          {order.carrier || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Saved Tracking Number
                        </p>
                        <p className="mt-1 break-all font-semibold text-slate-900">
                          {order.tracking_number || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Tracking Link
                        </p>
                        {order.tracking_url ? (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Open Tracking
                          </a>
                        ) : (
                          <p className="mt-1 font-semibold text-slate-900">
                            Not available
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Order ID
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                          {order.id || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Artwork
                        </p>
                        {order.artwork_url ? (
                          <a
                            href={order.artwork_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Download Artwork
                          </a>
                        ) : (
                          <p className="mt-1 font-semibold text-slate-900">
                            No artwork
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Print Sheet
                        </p>
                        <a
                          href={`/admin/orders/${order.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Open Sheet
                        </a>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => saveOrder(order.id)}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {isSaving ? "Saving..." : "Save Update"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDrafts((prev) => ({
                            ...prev,
                            [order.id]: {
                              status: order.status || "pending",
                              carrier: order.carrier || "",
                              tracking_number: order.tracking_number || "",
                              tracking_url: order.tracking_url || "",
                            },
                          }))
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-slate-100"
                      >
                        Reset Changes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>
    </main>
  );
}