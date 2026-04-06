"use client";

import { useState } from "react";

function prettyStatus(status) {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusStep(status) {
  const s = (status || "").toLowerCase();

  if (s === "pending") return 1;
  if (s === "paid") return 2;
  if (s === "printing") return 3;
  if (s === "shipped") return 4;
  if (s === "delivered") return 5;

  return 1;
}

function Step({ label, active }) {
  return (
    <div className="flex-1 min-w-[90px]">
      <div
        className={`h-3 rounded-full mb-2 ${
          active ? "bg-blue-600" : "bg-gray-300"
        }`}
      />
      <p
        className={`text-xs sm:text-sm font-medium ${
          active ? "text-slate-900" : "text-slate-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to find order.");
        return;
      }

      setOrder(data.order || null);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while tracking the order.");
    } finally {
      setLoading(false);
    }
  }

  const currentStep = statusStep(order?.status);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-blue-800 px-6 py-10 sm:px-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Track Your Order
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-2xl">
              Enter your order number and email address to view the latest
              production status for your print order.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="orderNumber"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Order Number
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Example: EV-10079"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Checking Order..." : "Track Order"}
                </button>
              </div>
            </form>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            ) : null}

            {order ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Order Number
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.order_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Customer
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.customer_name || "Customer"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Product
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {order.product_name || "Print Product"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 font-semibold text-blue-700">
                        {prettyStatus(order.status)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Production Progress
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-5">
                    <Step label="Pending" active={currentStep >= 1} />
                    <Step label="Paid" active={currentStep >= 2} />
                    <Step label="Printing" active={currentStep >= 3} />
                    <Step label="Shipped" active={currentStep >= 4} />
                    <Step label="Delivered" active={currentStep >= 5} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Order Details
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Quantity
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {order.quantity ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Shipping
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        ${Number(order.shipping || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Total
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Email
                      </p>
                      <p className="mt-1 font-medium text-slate-900 break-all">
                        {order.customer_email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        File Name
                      </p>
                      <p className="mt-1 font-medium text-slate-900 break-all">
                        {order.file_name || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Order Date
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {order.artwork_url ? (
                    <div className="mt-6">
                      <a
                        href={order.artwork_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-green-600 text-white px-5 py-3 font-semibold hover:bg-green-700"
                      >
                        Download Artwork
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}