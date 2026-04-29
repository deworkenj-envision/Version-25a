"use client";

import { useState } from "react";
import Image from "next/image";

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_number: orderNumber,
          email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.order) {
        throw new Error(data?.error || "Order not found");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      
      {/* LOGO */}
      <div className="mb-6">
        <Image
          src="/images/logo-hero.png"
          alt="EnVision Direct"
          width={220}
          height={80}
          priority
        />
      </div>

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Track Your Order
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Order Number (ex: EV-10109)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </form>

      {/* ORDER RESULT */}
      {order && (
        <div className="w-full max-w-md mt-8 bg-white p-6 rounded-lg shadow-md">
          
          <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
            Order Details
          </h2>

          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Order #:</strong> {order.order_number}</p>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Product:</strong> {order.product_name}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Status:</strong> {order.status}</p>

            {order.tracking_number && (
              <p>
                <strong>Tracking:</strong>{" "}
                <a
                  href={order.tracking_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {order.tracking_number}
                </a>
              </p>
            )}
          </div>

          {/* REORDER BUTTON */}
          <div className="mt-6 flex justify-center">
            <a
              href="/order"
              className="bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition"
            >
              Reorder This Product
            </a>
          </div>
        </div>
      )}
    </div>
  );
}