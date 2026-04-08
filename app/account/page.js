"use client";

import { useMemo, useState } from "react";

function getTrackingUrl(carrier, trackingNumber) {
  if (!carrier || !trackingNumber) return null;

  const c = String(carrier).toLowerCase();

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

function prettyStatus(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "paid") return "Order Placed";
  if (normalized === "printing") return "In Production";
  if (normalized === "shipped") return "Shipped";
  if (normalized === "delivered") return "Delivered";
  if (normalized === "pending") return "Pending";

  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClasses(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "delivered") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "shipped") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (normalized === "printing") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-neutral-200 bg-neutral-100 text-neutral-700";
}

function money(value) {
  const n = Number(value || 0);
  return `$${n.toFixed(2)}`;
}

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  async function handleLookup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCustomer(null);
    setOrders([]);

    try {
      const res = await fetch("/api/orders/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          orderNumber: orderNumber.trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not load customer orders.");
        return;
      }

      setCustomer(data.customer || null);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Account lookup error:", err);
      setError("Something went wrong while loading your orders.");
    } finally {
      setLoading(false);
    }
  }

  const orderCountLabel = useMemo(() => {
    if (!orders.length) return "No orders found";
    if (orders.length === 1) return "1 Order";
    return `${orders.length} Orders`;
  }, [orders]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-neutral-100">
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-200 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
                  Envision Direct
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Customer Account
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                  View your order history, shipping updates, artwork links, and
                  tracking details in one place.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Access your orders
                </div>
                <div className="mt-1 text-lg font-semibold">
                  Email + Order Number
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 lg:px-10">
            <form
              onSubmit={handleLookup}
              className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-4 shadow-sm sm:p-5"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_280px_220px]">
                <div>
                  <label
                    htmlFor="customer-email"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base outline-none transition focus:border-neutral-900"
                  />
                </div>

                <div>
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
                    placeholder="EV-10087"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base outline-none transition focus:border-neutral-900"
                  />
                </div>

                <div className="lg:self-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-neutral-950 px-6 py-4 text-base font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Loading..." : "View My Orders"}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                {error}
              </div>
            )}

            {!customer && !error && (
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">
                    Order history
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Customers can see all past and current orders from one clean
                    account page.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">
                    Shipping updates
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Shipped orders can show carrier, tracking number, and direct
                    tracking links.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">
                    Repeat-order ready
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    This creates the base for future reorder, login, and mobile
                    app features.
                  </p>
                </div>
              </div>
            )}

            {customer && (
              <div className="mt-8 space-y-6">
                <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                        Customer Overview
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                        {customer.name || "Customer"}
                      </h2>
                      <p className="mt-2 text-sm text-neutral-600">
                        {customer.email}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700">
                      {orderCountLabel}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5">
                  {orders.map((order) => {
                    const carrier = order.tracking_carrier || order.carrier;
                    const trackingNumber = order.tracking_number;
                    const trackingUrl = getTrackingUrl(carrier, trackingNumber);

                    return (
                      <div
                        key={order.id}
                        className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7"
                      >
                        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                              Order
                            </div>
                            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                              {order.order_number || order.id}
                            </h3>
                            <p className="mt-2 text-sm text-neutral-600">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleString()
                                : "—"}
                            </p>
                          </div>

                          <div
                            className={`inline-flex h-fit items-center rounded-full border px-3 py-1.5 text-sm font-medium ${statusClasses(
                              order.status
                            )}`}
                          >
                            {prettyStatus(order.status)}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                              Product
                            </div>
                            <div className="mt-2 text-base font-semibold text-neutral-950">
                              {order.product_name || "—"}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                              Total
                            </div>
                            <div className="mt-2 text-base font-semibold text-neutral-950">
                              {money(order.total)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                              Carrier
                            </div>
                            <div className="mt-2 text-base font-semibold text-neutral-950">
                              {carrier || "Not assigned yet"}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                              Tracking
                            </div>
                            <div className="mt-2 break-all text-base font-semibold text-neutral-950">
                              {trackingNumber || "Not available yet"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <a
                            href={`/track`}
                            className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                          >
                            Open Tracking Page
                          </a>

                          {trackingUrl && (
                            <a
                              href={trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                            >
                              Open Carrier Tracking
                            </a>
                          )}

                          {order.artwork_url && (
                            <a
                              href={order.artwork_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                            >
                              View Artwork
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}