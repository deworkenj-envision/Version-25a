"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    console.log(data);

    // refresh orders
    const updated = await fetch("/api/orders");
    const json = await updated.json();
    setOrders(json.orders || []);
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-8 items-center gap-4 p-4 bg-white rounded-xl shadow-sm border"
          >
            {/* Order Number */}
            <div className="font-medium">{order.order_number}</div>

            {/* Customer */}
            <div>
              <div className="font-medium text-sm">
                {order.customer_name}
              </div>
              <div className="text-xs text-gray-500">
                {order.customer_email}
              </div>
            </div>

            {/* Product */}
            <div className="text-sm">{order.product_name}</div>

            {/* Qty */}
            <div className="text-sm">{order.quantity}</div>

            {/* Total */}
            <div className="text-sm font-medium">
              ${order.total?.toFixed(2)}
            </div>

            {/* Status Badge */}
            <div>
              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                {order.status}
              </span>
            </div>

            {/* Artwork */}
            <div>
              {order.artwork_url && (
                <a
                  href={order.artwork_url}
                  target="_blank"
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  Download
                </a>
              )}
            </div>

            {/* Status Dropdown */}
            <div>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
                className="border rounded-lg px-3 py-2 text-sm w-full"
              >
                <option value="paid">paid</option>
                <option value="printing">printing</option>
                <option value="shipped">shipped</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}