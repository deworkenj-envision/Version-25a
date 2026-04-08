"use client";

import { useState } from "react";

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const cleaned = orderNumber.trim().toUpperCase();

      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(cleaned)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
        return;
      }

      setOrder(data.order || null);
    } catch (err) {
      setError("Something went wrong while tracking the order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">Track Your Order</h1>
      <p className="text-gray-600 mb-8">
        Enter your order number like <strong>EV-10087</strong>.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="EV-10087"
          className="flex-1 rounded-xl border px-4 py-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black text-white px-5 py-3"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      {order ? (
        <div className="rounded-2xl border p-6 space-y-3">
          <div>
            <span className="font-semibold">Order Number:</span>{" "}
            {order.order_number || order.id}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {order.status}
          </div>
          <div>
            <span className="font-semibold">Product:</span> {order.product_name}
          </div>
          <div>
            <span className="font-semibold">Customer:</span> {order.customer_name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {order.customer_email}
          </div>
          {order.carrier ? (
            <div>
              <span className="font-semibold">Carrier:</span> {order.carrier}
            </div>
          ) : null}
          {order.tracking_number ? (
            <div>
              <span className="font-semibold">Tracking Number:</span>{" "}
              {order.tracking_number}
            </div>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}