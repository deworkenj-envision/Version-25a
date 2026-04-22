"use client";

import { useState } from "react";

function normalizeStatus(status) {
  return (status || "pending").toLowerCase();
}

function getTimeline(status) {
  const current = normalizeStatus(status);

  const steps = [
    { key: "paid", label: "Order Received" },
    { key: "printing", label: "In Production" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const order = ["paid", "printing", "shipped", "delivered"];
  const currentIndex = order.indexOf(current);

  return steps.map((step, index) => {
    let state = "upcoming";
    if (currentIndex > index) state = "complete";
    if (currentIndex === index) state = "current";

    return {
      ...step,
      state,
    };
  });
}

function buildTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";

  const num = encodeURIComponent(trackingNumber.trim());
  const c = (carrier || "").toLowerCase();

  if (c === "ups") return `https://www.ups.com/track?tracknum=${num}`;
  if (c === "usps") return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  if (c === "fedex") return `https://www.fedex.com/fedextrack/?trknbr=${num}`;

  return "";
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedNumber, setSearchedNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrackOrder(e) {
    e.preventDefault();

    const cleaned = orderNumber.trim().toUpperCase();

    if (!cleaned) {
      setError("Please enter your order number.");
      setOrder(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);
      setSearchedNumber(cleaned);

      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(cleaned)}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Order not found.");
      }

      if (!data?.order) {
        throw new Error("Order not found.");
      }

      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      setError(err.message || "Unable to find that order.");
    } finally {
      setLoading(false);
    }
  }

  const timeline = getTimeline(order?.status);
  const trackingLink = buildTrackingLink(order?.tracking_carrier, order?.tracking_number);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-[#1452ad] px-6 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-center text-4xl font-bold tracking-tight">
            Track Your Order
          </h1>
          <p className="mt-3 text-center text-base text-white/85">
            Enter your order number to view the latest status.
          </p>

          <form
            onSubmit={handleTrackOrder}
            className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 rounded-[28px] bg-white p-4 shadow-lg sm:flex-row"
          >
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (example: EV-10114)"
              className="h-18 flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 text-base font-medium text-slate-900 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#2563eb] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {error ? (
            <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {!order && !loading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-500">
                {searchedNumber
                  ? `No order found for ${searchedNumber}.`
                  : "Enter an order number above to track an order."}
              </p>
            </div>
          ) : null}

          {order ? (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-0 md:grid-cols-5">
                  <div className="bg-[#06163f] px-6 py-5 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      Order Number
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {order.order_number || "—"}
                    </p>
                  </div>

                  <div className="bg-[#06163f] px-6 py-5 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      Status
                    </p>
                    <p className="mt-2 text-2xl font-bold uppercase">
                      {order.status || "—"}
                    </p>
                  </div>

                  <div className="bg-[#06163f] px-6 py-5 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      Product
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {order.product_name || "—"}
                    </p>
                  </div>

                  <div className="bg-[#06163f] px-6 py-5 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      Quantity
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                      {order.quantity || "—"}
                    </p>
                  </div>

                  <div className="bg-[#06163f] px-6 py-5 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      Order Date
                    </p>
                    <p className="mt-2 text-lg font-bold">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">Order Progress</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Current status for order {order.order_number}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-4">
                  {timeline.map((step, index) => {
                    const isComplete = step.state === "complete";
                    const isCurrent = step.state === "current";

                    return (
                      <div
                        key={step.key}
                        className={`rounded-2xl border p-5 ${
                          isComplete
                            ? "border-emerald-200 bg-emerald-50"
                            : isCurrent
                            ? "border-blue-200 bg-blue-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            isComplete
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-slate-300 text-slate-700"
                          }`}
                        >
                          {isComplete ? "Complete" : isCurrent ? "In Progress" : "Pending"}
                        </div>

                        <p className="mt-4 text-lg font-semibold text-slate-900">
                          {index + 1}. {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">Shipping Details</h3>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Carrier
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.tracking_carrier || "Not assigned yet"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Tracking Number
                      </p>
                      <p className="mt-1 break-all text-base font-semibold text-slate-900">
                        {order.tracking_number || "Not available yet"}
                      </p>
                    </div>

                    {trackingLink ? (
                      <a
                        href={trackingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                      >
                        Open Carrier Tracking
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">Order Details</h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Size</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.size || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Sides</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.sides || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Paper</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.paper || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Finish</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.finish || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}