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

  async function loadOrders() {
    const res = await fetch("/api/orders", { cache: "no-store" });
    const data = await res.json();

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

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function saveOrder(orderId) {
    const draft = drafts[orderId];

    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    await loadOrders();
  }

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-4xl font-bold mb-8">Admin Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const draft = drafts[order.id];
          const address = buildAddress(order);

          return (
            <div key={order.id} className="rounded-3xl border bg-white shadow">

              {/* 🔥 BLACK HEADER (kept) */}
              <div className="bg-slate-900 text-white p-6 rounded-t-3xl grid md:grid-cols-6 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Order</p>
                  <p className="font-bold">{order.order_number}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Customer</p>
                  <p className="font-bold">{order.customer_name}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-bold">{order.customer_email}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-bold">{order.customer_phone || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="font-bold">{formatMoney(order.total)}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Created</p>
                  <p className="font-bold">{formatDate(order.created_at)}</p>
                </div>
              </div>

              <div className="p-6">

                {/* 🔥 SHIPPING BLOCK (NEW) */}
                <div className="mb-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Shipping</p>
                  <p className="font-semibold">{order.shipping_name}</p>
                  <p className="text-sm text-slate-700">{address || "-"}</p>
                </div>

                {/* ORDER DETAILS */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Info label="Product" value={order.product_name} />
                  <Info label="Quantity" value={order.quantity} />
                  <Info label="Paper" value={order.paper} />
                  <Info label="Finish" value={order.finish} />
                </div>

                {/* ARTWORK */}
                {order.artwork_url && (
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Download Artwork
                  </a>
                )}

                {/* STATUS */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
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
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}