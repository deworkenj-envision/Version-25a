"use client";

import { useMemo, useState } from "react";

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCarrierTrackingUrl(carrier, trackingNumber) {
  const tracking = encodeURIComponent((trackingNumber || "").trim());
  const normalizedCarrier = String(carrier || "").trim().toLowerCase();

  if (!tracking) return "";

  if (normalizedCarrier === "ups") {
    return `https://www.ups.com/track?tracknum=${tracking}`;
  }

  if (normalizedCarrier === "usps") {
    return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${tracking}`;
  }

  if (normalizedCarrier === "fedex") {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${tracking}`;
  }

  return "";
}

function getStatusClasses(status) {
  const s = String(status || "").toLowerCase();

  if (s === "delivered") {
    return "bg-green-100 text-green-800 border-green-200";
  }

  if (s === "shipped") {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }

  if (s === "printing") {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  if (s === "paid" || s === "pending") {
    return "bg-slate-100 text-slate-800 border-slate-200";
  }

  return "bg-gray-100 text-gray-800 border-gray-200";
}

function normalizeStatus(status) {
  const s = String(status || "").toLowerCase();

  if (!s) return "Pending";
  if (s === "paid") return "Paid";
  if (s === "pending") return "Pending";
  if (s === "printing") return "Printing";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";

  return status;
}

function Step({ label, active, done }) {
  const circleClasses = done
    ? "bg-green-600 text-white border-green-600"
    : active
    ? "bg-blue-600 text-white border-blue-600"
    : "bg-white text-slate-500 border-slate-300";

  const textClasses = active || done ? "text-slate-900" : "text-slate-500";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${circleClasses}`}
      >
        {done ? "✓" : ""}
      </div>
      <span className={`text-sm font-medium ${textClasses}`}>{label}</span>
    </div>
  );
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  async function handleTrackOrder(e) {
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
          orderNumber,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Could not find that order.");
        return;
      }

      setOrder(data.order);
    } catch (err) {
      console.error(err);
      setError("Could not track order right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const trackingUrl = useMemo(() => {
    if (!order) return "";
    return getCarrierTrackingUrl(order.carrier, order.tracking_number);
  }, [order]);

  const currentStatus = String(order?.status || "").toLowerCase();

  const timeline = {
    pending:
      currentStatus === "pending" ||
      currentStatus === "paid" ||
      currentStatus === "printing" ||
      currentStatus === "shipped" ||
      currentStatus === "delivered",
    printing:
      currentStatus === "printing" ||
      currentStatus === "shipped" ||
      currentStatus === "delivered",
    shipped: currentStatus === "shipped" || currentStatus === "delivered",
    delivered: currentStatus === "delivered",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[#17307a] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Track Your Order
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100 md:text-lg">
            Enter your order number to see your current print status, shipment
            details, and artwork information.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Find your order
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Order number is required. Email is optional but helps narrow the
              search.
            </p>

            <form onSubmit={handleTrackOrder} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="orderNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Order number
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="EV-10087"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {!order ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Order details will appear here
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Enter your order number to view status, shipping info, and
                    artwork details.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Order Number</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {order.order_number}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Placed {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div
                    className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {normalizeStatus(order.status)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Order progress
                  </h4>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Step
                      label="Order Received"
                      done={timeline.pending}
                      active={!timeline.pending}
                    />
                    <Step
                      label="In Production"
                      done={timeline.printing}
                      active={currentStatus === "printing"}
                    />
                    <Step
                      label="Shipped"
                      done={timeline.shipped}
                      active={currentStatus === "shipped"}
                    />
                    <Step
                      label="Delivered"
                      done={timeline.delivered}
                      active={currentStatus === "delivered"}
                    />
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Order details
                    </h4>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Customer</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.customer_name || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Email</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.customer_email || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Product</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.product_name || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Quantity</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.quantity || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Paper</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.paper || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Finish</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.finish || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Sides</span>
                        <span className="text-right font-medium text-slate-900">
                          {order.sides || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Total</span>
                        <span className="text-right font-semibold text-slate-900">
                          {formatMoney(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Shipping & files
                    </h4>

                    <div className="mt-4 space-y-4">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Carrier</p>
                        <p className="mt-1 font-medium text-slate-900">
                          {order.carrier || "Not assigned yet"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Tracking number</p>
                        <p className="mt-1 break-all font-medium text-slate-900">
                          {order.tracking_number || "Not available yet"}
                        </p>
                      </div>

                      {trackingUrl ? (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          Track Shipment
                        </a>
                      ) : null}

                      {order.artwork_url ? (
                        <a
                          href={order.artwork_url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-0 inline-flex rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:ml-3"
                        >
                          Download Artwork
                        </a>
                      ) : null}

                      {order.file_name ? (
                        <p className="text-sm text-slate-500">
                          Uploaded file:{" "}
                          <span className="font-medium text-slate-700">
                            {order.file_name}
                          </span>
                        </p>
                      ) : null}
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