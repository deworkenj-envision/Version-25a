"use client";

import { useEffect, useState } from "react";

export default function PackingSlipPage({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
      const data = await res.json();
      const o = data.order || data;
      setOrder(o);

      setTimeout(() => {
        window.print();
      }, 500);
    }

    loadOrder();
  }, [id]);

  if (!order) {
    return <div className="p-10">Loading packing slip...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-8 text-black">
      <div className="mx-auto max-w-4xl border border-gray-300 p-8">
        <div className="mb-8 flex items-start justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">EnVision Direct</h1>
            <p className="mt-1 text-sm text-gray-600">Packing Slip</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Order Number</div>
            <div className="text-xl font-bold">{order.order_number || "—"}</div>
            <div className="mt-2 text-sm text-gray-600">
              {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Customer</h2>
            <p>{order.customer_name || "—"}</p>
            <p>{order.customer_email || "—"}</p>
            <p>{order.customer_phone || order.phone || "—"}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Ship To</h2>
            <p>{order.shipping_name || order.customer_name || "—"}</p>
            <p>{order.shipping_address || order.address || "—"}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Order Details</h2>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Product</th>
                <th className="border border-gray-300 p-3 text-left">Specs</th>
                <th className="border border-gray-300 p-3 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">{order.product_name || "—"}</td>
                <td className="border border-gray-300 p-3">
                  {[order.size, order.paper, order.finish, order.sides].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="border border-gray-300 p-3">{order.quantity || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Shipping</h2>
            <p>Carrier: {order.tracking_carrier || "—"}</p>
            <p>Tracking: {order.tracking_number || "—"}</p>
            <p>Status: {order.status || "—"}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">File</h2>
            <p>{order.file_name || "—"}</p>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-gray-600">
          Thank you for your order.
        </div>
      </div>
    </div>
  );
}