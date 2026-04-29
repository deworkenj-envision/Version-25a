"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TrackPage() {
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        email: email.trim(),
      });

      const res = await fetch(`/api/orders/track?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();

      if (!text) {
        throw new Error(
          "Tracking lookup returned no response. Check app/api/orders/track/route.js."
        );
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Tracking lookup failed.");
      }

      if (!res.ok || !data?.success || !data?.token) {
        throw new Error(data?.error || "Order not found.");
      }

      router.push(`/track/${data.token}`);
    } catch (err) {
      setError(err.message || "Order not found.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo-hero.png"
            alt="EnVision Direct"
            width={230}
            height={90}
            priority
            className="h-auto w-auto"
          />
        </div>

        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Track Your Order
        </h1>

        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-md">
          <div className="space-y-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order Number"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Looking Up Order..." : "Track Order"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}