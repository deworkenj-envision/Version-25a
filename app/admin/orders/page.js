"use client";

import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "printing",
  "shipped",
  "completed",
  "cancelled",
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
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

  async function updateStatus(orderId, status) {
    try {
      setSavingId(orderId);

      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Recent Orders</h1>
          <p className="mt-1 text-sm text-slate-600">
            View artwork, track payments, and update order status.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[1550px]">
              <div className="grid grid-cols-[150px_260px_200px_90px_100px_130px_190px_300px_130px] gap-4 border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">
                <div>Order</div>
                <div>Customer</div>
                <div>Product</div>
                <div>Quantity</div>
                <div>Total</div>
                <div>Status</div>
                <div>Placed</div>
                <div>Artwork</div>
                <div>Update</div>
              </div>

              {loading ? (
                <div className="px-6 py-10 text-sm text-slate-500">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="px-6 py-10 text-sm text-slate-500">
                  No orders found.
                </div>
              ) : (
                <div>
                  {orders.map((order) => {
                    const artworkUrl =
                      order.artwork_url ||
                      order.artworkUrl ||
                      order.file_url ||
                      order.fileUrl ||
                      "";

                    const artworkName =
                      order.artwork_name ||
                      order.artworkName ||
                      order.file_name ||
                      order.fileName ||
                      (artworkUrl ? artworkUrl.split("/").pop() : "No artwork");

                    const customerName =
                      order.customer_name ||
                      order.customerName ||
                      "Customer";

                    const customerEmail =
                      order.customer_email ||
                      order.customerEmail ||
                      "—";

                    const orderNumber =
                      order.order_number ||
                      order.orderNumber ||
                      order.id ||
                      "—";

                    const status = (order.status || "pending").toLowerCase();

                    return (
                      <div
                        key={order.id}
                        className="grid grid-cols-[150px_260px_200px_90px_100px_130px_190px_300px_130px] gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-700"
                      >
                        <div className="flex items-center font-semibold text-slate-900">
                          {orderNumber}
                        </div>

                        <div className="flex min-w-0 flex-col justify-center">
                          <span className="truncate font-semibold text-slate-900">
                            {customerName}
                          </span>
                          <span className="truncate text-slate-500">
                            {customerEmail}
                          </span>
                        </div>

                        <div className="flex items-center">
                          {order.product_name ||
                            order.productName ||
                            order.product ||
                            "—"}
                        </div>

                        <div className="flex items-center">
                          {order.quantity ?? "—"}
                        </div>

                        <div className="flex items-center">
                          {formatMoney(order.total)}
                        </div>

                        <div className="flex items-center">
                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            {status}
                          </span>
                        </div>

                        <div className="flex items-center">
                          {formatDate(
                            order.created_at || order.createdAt || order.placed_at
                          )}
                        </div>

                        <div className="flex min-w-0 flex-col justify-center gap-2">
                          {artworkUrl ? (
                            <>
                              <a
                                href={artworkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-fit items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                              >
                                Download Artwork
                              </a>
                              <span className="truncate text-xs text-slate-500">
                                {artworkName}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-400">No artwork</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <select
                            value={status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            disabled={savingId === order.id}
                            className="h-9 w-[110px] rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-800 outline-none focus:border-slate-400"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}