"use client";

import { useState } from "react";

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function normalizeStatus(status) {
  return String(status || "pending").toLowerCase();
}

function statusSteps(status) {
  const current = normalizeStatus(status);

  const steps = [
    { key: "paid", label: "Order Received" },
    { key: "printing", label: "In Production" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const order = {
    pending: 0,
    paid: 1,
    printing: 2,
    shipped: 3,
    delivered: 4,
  };

  const currentLevel = order[current] || 0;

  return steps.map((step, index) => {
    const level = index + 1;
    return {
      ...step,
      complete: currentLevel > level,
      current: currentLevel === level,
    };
  });
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  async function handleTrack(e) {
    e.preventDefault();

    const value = orderNumber.trim();
    if (!value) {
      setError("Please enter your order number.");
      setOrder(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(value)}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Order not found.");
      }

      const foundOrder =
        data?.order ||
        (Array.isArray(data?.orders) ? data.orders[0] : null);

      if (!foundOrder) {
        throw new Error("Order not found.");
      }

      setOrder(foundOrder);
    } catch (err) {
      setError(err.message || "Order not found.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  const steps = statusSteps(order?.status);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium">
              EnVision Direct Order Tracking
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Track Your Order
            </h1>

            <p className="mt-4 text-base text-blue-100 sm:text-lg">
              Enter your order number to check status, shipment details, and tracking updates.
            </p>

            <form
              onSubmit={handleTrack}
              className="mt-8 rounded-3xl bg-white p-4 shadow-2xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter order number (example: EV-10109)"
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-base text-slate-900 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Searching..." : "Track Order"}
                </button>
              </div>
            </form>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {!order ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Enter your order number above to view the latest status.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-900 px-6 py-5 text-white">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Order Number
                    </p>
                    <p className="mt-1 text-base font-semibold break-all">
                      {order.order_number || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Status
                    </p>
                    <p className="mt-1 text-base font-semibold uppercase">
                      {order.status || "pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Product
                    </p>
                    <p className="mt-1 text-base font-semibold break-all">
                      {order.product_name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Quantity
                    </p>
                    <p className="mt-1 text-base font-semibold">
                      {order.quantity ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Order Date
                    </p>
                    <p className="mt-1 text-base font-semibold break-all">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900">Order Progress</h2>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  {steps.map((step) => (
                    <div
                      key={step.key}
                      className={`rounded-2xl border p-5 ${
                        step.complete
                          ? "border-emerald-200 bg-emerald-50"
                          : step.current
                            ? "border-blue-200 bg-blue-50"
                            : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          step.complete
                            ? "bg-emerald-600 text-white"
                            : step.current
                              ? "bg-blue-600 text-white"
                              : "bg-slate-300 text-slate-700"
                        }`}
                      >
                        {step.complete ? "Complete" : step.current ? "Current" : "Pending"}
                      </div>

                      <p className="mt-4 text-lg font-semibold text-slate-900">
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCard label="Size" value={order.size || "-"} />
                  <InfoCard label="Paper" value={order.paper || "-"} />
                  <InfoCard label="Finish" value={order.finish || "-"} />
                  <InfoCard label="Sides" value={order.sides || "-"} />
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Shipment Details</h2>

                <div className="mt-5 space-y-4">
                  <ShipmentRow label="Carrier" value={order.carrier || order.tracking_carrier || "-"} />
                  <ShipmentRow label="Tracking Number" value={order.tracking_number || "-"} />
                  <ShipmentRow
                    label="Tracking Link"
                    value={
                      order.tracking_url ? (
                        <a
                          href={order.tracking_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Track Package
                        </a>
                      ) : (
                        "Not available yet"
                      )
                    }
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

                <div className="mt-5 space-y-4">
                  <ShipmentRow label="Subtotal" value={formatMoney(order.subtotal)} />
                  <ShipmentRow label="Shipping" value={formatMoney(order.shipping)} />
                  <ShipmentRow label="Total" value={formatMoney(order.total)} />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Need help?
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    If you have any questions about your order, contact EnVision Direct and include
                    your order number for faster support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ShipmentRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="text-right text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}