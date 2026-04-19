"use client";

import { useEffect, useState } from "react";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingId, setSavingId] = useState("");

  async function loadOrders(showRefreshState = false) {
    try {
      if (showRefreshState) setRefreshing(true);
      else setLoading(true);

      setError("");
      setSuccessMessage("");

      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to load orders.");

      const normalized = (data.orders || []).map(normalizeOrder);
      setOrders(normalized);

      const nextDrafts = {};
      normalized.forEach((order) => {
        nextDrafts[order.id] = {
          status: order.status,
          carrier: order.carrier,
          tracking_number: order.tracking_number,
        };
      });
      setDrafts(nextDrafts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function saveOrder(orderId) {
    const draft = drafts[orderId] || {};
    const order = orders.find((o) => o.id === orderId);

    try {
      setSavingId(orderId);

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: draft.status,
          carrier: draft.carrier,
          tracking_number: draft.tracking_number,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMessage("Order updated");
      await loadOrders(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-[1500px] mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Admin Orders</h1>

        {orders.map((order) => {
          const draft = drafts[order.id] || {};
          const address = buildAddress(order);

          return (
            <div key={order.id} className="mb-6 rounded-2xl bg-white shadow p-6">
              
              {/* HEADER */}
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order</p>
                  <p className="font-bold">{order.order_number}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-bold">{order.customer_name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-bold">{order.customer_email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-bold">{order.customer_phone || "-"}</p>
                </div>
              </div>

              {/* SHIPPING */}
              <div className="mb-4">
                <p className="text-xs text-gray-500">Shipping Address</p>
                <p className="font-semibold">
                  {order.shipping_name}
                </p>
                <p>{address || "-"}</p>
              </div>

              {/* ORDER DETAILS */}
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Product</p>
                  <p>{order.product_name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Qty</p>
                  <p>{order.quantity}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p>{formatMoney(order.total)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p>{formatDate(order.created_at)}</p>
                </div>
              </div>

              {/* ARTWORK */}
              <div className="mb-4">
                {order.artwork_url && (
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Download Artwork
                  </a>
                )}
              </div>

              {/* STATUS UPDATE */}
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDrafts({
                      ...drafts,
                      [order.id]: { ...draft, status: e.target.value },
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option>pending</option>
                  <option>paid</option>
                  <option>printing</option>
                  <option>shipped</option>
                  <option>delivered</option>
                </select>

                <input
                  placeholder="Tracking Number"
                  value={draft.tracking_number}
                  onChange={(e) =>
                    setDrafts({
                      ...drafts,
                      [order.id]: {
                        ...draft,
                        tracking_number: e.target.value,
                      },
                    })
                  }
                  className="border p-2 rounded"
                />

                <button
                  onClick={() => saveOrder(order.id)}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}