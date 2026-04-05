"use client";

import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const bucketName = "order-artwork";

function getFileUrl(order) {
  const value =
    order.artwork_url ||
    order.publicUrl ||
    order.file_url ||
    order.artwork_path ||
    order.file_path ||
    order.filePath ||
    order.artwork;

  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${trimmed}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">Admin Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border-b p-3">Customer</th>
                  <th className="border-b p-3">Email</th>
                  <th className="border-b p-3">Product</th>
                  <th className="border-b p-3">Qty</th>
                  <th className="border-b p-3">Total</th>
                  <th className="border-b p-3">Status</th>
                  <th className="border-b p-3">Artwork</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id || index} className="border-t">
                    <td className="p-3">{order.customer_name || "-"}</td>
                    <td className="p-3">{order.customer_email || "-"}</td>
                    <td className="p-3">{order.product_name || "-"}</td>
                    <td className="p-3">{order.quantity || 1}</td>
                    <td className="p-3">
                      {typeof order.total === "number"
                        ? `$${order.total.toFixed(2)}`
                        : order.total
                        ? `$${Number(order.total).toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="p-3">{order.status || "-"}</td>
                    <td className="p-3">
                      {getFileUrl(order) ? (
                        <a
                          href={getFileUrl(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}