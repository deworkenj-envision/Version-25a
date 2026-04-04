"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/orders", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load orders.");
        }

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function formatDate(value) {
    if (!value) return "Not available";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return "Not available";
    }
  }

  function displayValue(value, fallback = "Not provided") {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string" && value.trim() === "") return fallback;
    return value;
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Orders</h1>
          <p className="text-gray-600 mt-2">
            View customer orders and uploaded artwork.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 p-6 text-gray-700">
            Loading orders...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl border border-gray-200 p-6 text-gray-700">
            No orders found.
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-700">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Artwork</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id || index}
                    className="border-t border-gray-200 text-sm"
                  >
                    <td className="px-4 py-3">
                      {formatDate(
                        order.created_at ||
                          order.createdAt ||
                          order.date ||
                          order.order_date
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {displayValue(order.customer_name || order.customerName)}
                    </td>

                    <td className="px-4 py-3">
                      {displayValue(order.customer_email || order.customerEmail)}
                    </td>

                    <td className="px-4 py-3">
                      {displayValue(order.product_name || order.productName)}
                    </td>

                    <td className="px-4 py-3">
                      {displayValue(order.quantity)}
                    </td>

                    <td className="px-4 py-3">
                      {order.total !== null &&
                      order.total !== undefined &&
                      order.total !== ""
                        ? `$${Number(order.total).toFixed(2)}`
                        : "Not provided"}
                    </td>

                    <td className="px-4 py-3">
                      {displayValue(order.status, "Pending")}
                    </td>

                    <td className="px-4 py-3">
                      {order.artwork_url || order.artworkUrl ? (
                        <a
                          href={order.artwork_url || order.artworkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View File
                        </a>
                      ) : (
                        "No file"
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {displayValue(order.notes, "None")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}