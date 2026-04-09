"use client";

import { useMemo, useState } from "react";

function getTrackingUrl(carrier, trackingNumber) {
  if (!carrier || !trackingNumber) return null;

  const c = carrier.toLowerCase();

  if (c.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
  }

  if (c.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  if (c.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  return null;
}

function getStatusSteps(status) {
  const normalized = (status || "").toLowerCase();

  const steps = [
    { key: "paid", label: "Order Placed" },
    { key: "printing", label: "In Production" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  let activeIndex = 0;

  if (normalized === "paid" || normalized === "pending") activeIndex = 0;
  if (normalized === "printing" || normalized === "in production") activeIndex = 1;
  if (normalized === "shipped") activeIndex = 2;
  if (normalized === "delivered") activeIndex = 3;

  return steps.map((step, index) => ({
    ...step,
    complete: index < activeIndex,
    active: index === activeIndex,
    upcoming: index > activeIndex,
  }));
}

function getStatusBadge(status) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "delivered") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized === "shipped") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (normalized === "printing" || normalized === "in production") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-neutral-100 text-neutral-700 border-neutral-200";
}

function prettyStatus(status) {
  if (!status) return "Pending";

  const normalized = status.toLowerCase();

  if (normalized === "paid") return "Order Placed";
  if (normalized === "printing") return "In Production";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function StepIcon({ step }) {
  if (step.complete) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300 bg-emerald-500 text-lg font-bold text-white shadow-sm">
        ✓
      </div>
    );
  }

  if (step.active) {
    return (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-blue-300 bg-blue-500 text-sm font-bold text-white shadow-sm">
        <div className="absolute inset-0 rounded-full ring-4 ring-blue-100" />
        <span className="relative">•</span>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-500 shadow-sm">
      •
    </div>
  );
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
  const steps = useMemo(() => getStatusSteps(order?.status), [order?.status]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-neutral-100">
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-200 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
                  Envision Direct
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Track Your Order
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                  Enter your order number to view status, shipping details, and
                  tracking information in one place.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Quick example
                </div>
                <div className="mt-1 text-lg font-semibold">EV-10087</div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 lg:px-10">
            <form
              onSubmit={handleSubmit}
              className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="order-number"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Order Number
                  </label>

                  <input
                    id="order-number"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter order number"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base outline-none transition focus:border-neutral-900"
                  />
                </div>

                <div className="lg:w-[220px] lg:self-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-neutral-950 px-6 py-4 text-base font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Searching..." : "Track Order"}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                {error}
              </div>
            )}

            {!order && !error && (
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">
                    Real-time order visibility
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Customers can quickly check production and shipping progress
                    without contacting support.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">
                    Shipment details
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Carrier and tracking information appear automatically when an
                    order has been shipped.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">
                    Premium customer experience
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    A cleaner branded status page builds trust and feels much
                    stronger than a plain lookup form.
                  </p>
                </div>
              </div>
            )}

            {order && (
              <div className="mt-8 space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                  <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                          Order Summary
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                          {order.order_number || order.id}
                        </h2>
                        <p className="mt-2 text-sm text-neutral-600">
                          Review current progress, shipping status, and customer
                          details below.
                        </p>
                      </div>

                      <div
                        className={`inline-flex h-fit items-center rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {prettyStatus(order.status)}
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="mb-6 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
                        Order Timeline
                      </div>

                      <div className="hidden md:flex items-start justify-between">
                        {steps.map((step, index) => (
                          <div
                            key={step.key}
                            className="relative flex min-w-0 flex-1 flex-col items-center text-center"
                          >
                            {index < steps.length - 1 && (
                              <div className="absolute left-[50%] top-6 h-[3px] w-full">
                                <div className="mx-8 h-full rounded-full bg-neutral-200">
                                  <div
                                    className={`h-full rounded-full ${
                                      step.complete
                                        ? "bg-emerald-500"
                                        : step.active
                                        ? "bg-blue-500 w-1/2"
                                        : "bg-transparent w-0"
                                    }`}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="relative z-10">
                              <StepIcon step={step} />
                            </div>

                            <div className="mt-4">
                              <div
                                className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                                  step.complete
                                    ? "text-emerald-600"
                                    : step.active
                                    ? "text-blue-600"
                                    : "text-neutral-400"
                                }`}
                              >
                                {step.complete
                                  ? "Complete"
                                  : step.active
                                  ? "In Progress"
                                  : "Upcoming"}
                              </div>

                              <div
                                className={`mt-2 text-sm font-semibold ${
                                  step.complete || step.active
                                    ? "text-neutral-950"
                                    : "text-neutral-500"
                                }`}
                              >
                                {step.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 md:hidden">
                        {steps.map((step, index) => (
                          <div key={step.key} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <StepIcon step={step} />
                              {index < steps.length - 1 && (
                                <div
                                  className={`mt-2 h-12 w-[3px] rounded-full ${
                                    step.complete ? "bg-emerald-500" : "bg-neutral-200"
                                  }`}
                                />
                              )}
                            </div>

                            <div className="pt-1">
                              <div
                                className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                                  step.complete
                                    ? "text-emerald-600"
                                    : step.active
                                    ? "text-blue-600"
                                    : "text-neutral-400"
                                }`}
                              >
                                {step.complete
                                  ? "Complete"
                                  : step.active
                                  ? "In Progress"
                                  : "Upcoming"}
                              </div>

                              <div
                                className={`mt-1 text-sm font-semibold ${
                                  step.complete || step.active
                                    ? "text-neutral-950"
                                    : "text-neutral-500"
                                }`}
                              >
                                {step.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                        <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                          Product
                        </div>
                        <div className="mt-2 text-lg font-semibold text-neutral-950">
                          {order.product_name || "—"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                        <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                          Customer
                        </div>
                        <div className="mt-2 text-lg font-semibold text-neutral-950">
                          {order.customer_name || "—"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                        <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                          Email
                        </div>
                        <div className="mt-2 break-all text-base font-medium text-neutral-950">
                          {order.customer_email || "—"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                        <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                          Created
                        </div>
                        <div className="mt-2 text-base font-medium text-neutral-950">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString()
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
                      <div className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                        Shipment
                      </div>

                      <div className="mt-5 space-y-4">
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                          <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                            Carrier
                          </div>
                          <div className="mt-2 text-lg font-semibold text-neutral-950">
                            {carrier || "Not assigned yet"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                          <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                            Tracking Number
                          </div>
                          <div className="mt-2 break-all text-lg font-semibold text-neutral-950">
                            {trackingNumber || "Not available yet"}
                          </div>
                        </div>

                        {trackingUrl && (
                          <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-4 text-base font-medium text-white transition hover:bg-neutral-800"
                          >
                            Open Carrier Tracking
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-neutral-200 bg-gradient-to-br from-neutral-950 to-neutral-800 p-6 text-white shadow-sm sm:p-7">
                      <div className="text-sm uppercase tracking-[0.16em] text-white/60">
                        Need help?
                      </div>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight">
                        We’re keeping your order moving.
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/75">
                        If anything looks off, your team can update order
                        status, carrier, and tracking details from the admin
                        side.
                      </p>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                        Status updates appear here as your print job moves from
                        production to final delivery.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                        Customer Confidence
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                        Cleaner presentation, better trust
                      </div>
                    </div>

                    <div className="text-sm text-neutral-500">
                      Order status updates are now easier to read.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
