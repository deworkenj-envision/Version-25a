"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      console.log(data);

      await loadOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  function getStatusClasses(status) {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-700";
      case "printing":
        return "bg-amber-100 text-amber-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and production status.
          </p>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[160px_1.5fr_1.1fr_90px_110px_120px_150px_140px] items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
            >
              {/* Order Number */}
              <div className="min-w-0">
                <div className="text-[28px] font-semibold leading-none tracking-tight text-gray-900">
                  {order.order_number || "—"}
                </div>
              </div>

              {/* Customer */}
              <div className="min-w-0">
                <div className="truncate text-base font-semibold leading-tight text-gray-900">
                  {order.customer_name || "No customer name"}
                </div>
                <div className="mt-1 truncate text-sm text-gray-500">
                  {order.customer_email || "No email"}
                </div>
              </div>

              {/* Product */}
              <div className="min-w-0">
                <div className="truncate text-base text-gray-800">
                  {order.product_name || "—"}
                </div>
              </div>

              {/* Quantity */}
              <div className="text-base font-medium text-gray-800">
                {order.quantity || 0}
              </div>

              {/* Total */}
              <div className="text-base font-semibold text-gray-900">
                ${Number(order.total || 0).toFixed(2)}
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {order.status || "unknown"}
                </span>
              </div>

              {/* Artwork */}
              <div>
                {order.artwork_url ? (
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">No artwork</span>
                )}
              </div>

              {/* Status Dropdown */}
              <div>
                <select
                  value={order.status || "paid"}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-gray-400"
                >
                  <option value="paid">paid</option>
                  <option value="printing">printing</option>
                  <option value="shipped">shipped</option>
                </select>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}