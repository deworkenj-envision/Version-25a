"use client";

import { useState } from "react";

function getTrackingUrl(carrier, trackingNumber) {
  if (!carrier || !trackingNumber) return null;

  const c = carrier.toLowerCase();

  if (c.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
  }

  if (c.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}`;
  }

  if (c.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`;
  }

  return null;
}

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
        `/api/orders/track?orderNumber=${encodeURIComponent(cleaned)}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
        return;
      }

      if (!data.order) {
        setError("Order not found");
        return;
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Track page error:", err);
      setError("Something went wrong while tracking the order.");
    } finally {
      setLoading(false);
    }
  }

  const carrier = order?.tracking_carrier || order?.carrier;
  const trackingNumber = order?.tracking_number;
  const trackingUrl = getTrackingUrl(carrier, trackingNumber);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>

      <p className="text-gray-700 mb-10">
        Enter your order number like <strong>EV-10087</strong>.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10 sm:flex-row">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="EV-10087"
          className="flex-1 rounded-2xl border border-black px-5 py-4 text-lg outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-black px-6 py-4 text-lg text-white disabled:opacity-60"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {order && (
        <div className="rounded-3xl border border-black p-6 sm:p-8 space-y-5">
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

          {carrier && (
            <div>
              <span className="font-semibold">Carrier:</span> {carrier}
            </div>
          )}

          {trackingNumber && (
            <div>
              <span className="font-semibold">Tracking Number:</span>{" "}
              {trackingUrl ? (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {trackingNumber}
                </a>
              ) : (
                trackingNumber
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}