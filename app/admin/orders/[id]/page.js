"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

function money(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function getTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";
  const num = encodeURIComponent(trackingNumber.trim());

  switch ((carrier || "").toLowerCase()) {
    case "ups":
      return `https://www.ups.com/track?tracknum=${num}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${num}`;
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
    default:
      return "";
  }
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [status, setStatus] = useState("pending");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  async function loadOrder() {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/orders/${id}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load order");
      }

      const nextOrder = data?.order || null;
      setOrder(nextOrder);
      setStatus(nextOrder?.status || "pending");
      setTrackingCarrier(nextOrder?.tracking_carrier || "");
      setTrackingNumber(nextOrder?.tracking_number || "");
    } catch (err) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function saveOrderUpdates() {
    if (!id) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          tracking_carrier: trackingCarrier,
          tracking_number: trackingNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save order");
      }

      setSuccess("Order updated successfully.");
      await loadOrder();
    } catch (err) {
      setError(err.message || "Failed to save order");
    } finally {
      setSaving(false);
    }
  }

  const trackingLink = useMemo(() => {
    return getTrackingLink(trackingCarrier, trackingNumber);
  }, [trackingCarrier, trackingNumber]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm text-white/70">Loading order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Order Details</h1>
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Back to Orders
            </Link>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Order Details</h1>
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Back to Orders
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/70">Order not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-300/80">
              Admin Order View
            </p>
            <h1 className="text-3xl font-semibold">
              {order.order_number || "Order"}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Created {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Back to Orders
            </Link>

            <button
              onClick={() => router.refresh()}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-5 text-xl font-semibold">Order Information</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Order Number</p>
                <p className="mt-2 text-base font-medium">{order.order_number || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Status</p>
                <p className="mt-2 text-base font-medium capitalize">{order.status || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Customer</p>
                <p className="mt-2 text-base font-medium">{order.customer_name || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Email</p>
                <p className="mt-2 break-all text-base font-medium">{order.customer_email || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Product</p>
                <p className="mt-2 text-base font-medium">{order.product_name || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Quantity</p>
                <p className="mt-2 text-base font-medium">{order.quantity || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Size</p>
                <p className="mt-2 text-base font-medium">{order.size || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Sides</p>
                <p className="mt-2 text-base font-medium">{order.sides || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Paper</p>
                <p className="mt-2 text-base font-medium">{order.paper || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Finish</p>
                <p className="mt-2 text-base font-medium">{order.finish || "—"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Subtotal</p>
                <p className="mt-2 text-base font-medium">{money(order.subtotal)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">Shipping</p>
                <p className="mt-2 text-base font-medium">{money(order.shipping)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-white/50">Total</p>
                <p className="mt-2 text-xl font-semibold">{money(order.total)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-white/50">Notes</p>
                <p className="mt-2 whitespace-pre-wrap text-base font-medium">
                  {order.notes || "—"}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-5 text-xl font-semibold">Update Order</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="printing">Printing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">Tracking Carrier</label>
                  <select
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="">Select carrier</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="FedEx">FedEx</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">Tracking Number</label>
                  <input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                  />
                </div>

                {trackingLink ? (
                  <a
                    href={trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                  >
                    Open Tracking Link
                  </a>
                ) : null}

                <button
                  onClick={saveOrderUpdates}
                  disabled={saving}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-5 text-xl font-semibold">Artwork</h2>

              {order.artwork_url ? (
                <div className="space-y-3">
                  <p className="text-sm text-white/65">
                    {order.file_name || "Artwork file available"}
                  </p>
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
                  >
                    Download Artwork
                  </a>
                </div>
              ) : (
                <p className="text-sm text-white/60">No artwork uploaded.</p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}