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

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  const styles = {
    pending: "bg-amber-500/20 text-amber-200 border-amber-300/30",
    paid: "bg-sky-500/20 text-sky-200 border-sky-300/30",
    printing: "bg-violet-500/20 text-violet-200 border-violet-300/30",
    shipped: "bg-cyan-500/20 text-cyan-200 border-cyan-300/30",
    delivered: "bg-emerald-500/20 text-emerald-200 border-emerald-300/30",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        styles[normalized] || "bg-white/10 text-white border-white/20"
      }`}
    >
      {status || "—"}
    </span>
  );
}

function InfoCard({ label, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300/70">
        {label}
      </p>
      <div className="mt-3 text-base font-semibold text-white">{children}</div>
    </div>
  );
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
  const [warning, setWarning] = useState("");

  const [status, setStatus] = useState("pending");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  async function loadOrder() {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setWarning("");

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

    const normalizedStatus = (status || "").toLowerCase().trim();
    const trimmedCarrier = trackingCarrier.trim();
    const trimmedTracking = trackingNumber.trim();

    if (normalizedStatus === "shipped") {
      if (!trimmedCarrier || !trimmedTracking) {
        setError("Tracking carrier and tracking number are required before marking an order as shipped.");
        setSuccess("");
        setWarning("");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      setWarning("");

      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: normalizedStatus,
          tracking_carrier: trimmedCarrier,
          tracking_number: trimmedTracking,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save order");
      }

      if (data?.warning) {
        setWarning(data.warning);
      } else {
        setSuccess("Order updated successfully.");
      }

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

  const shippedNeedsTracking =
    (status || "").toLowerCase() === "shipped" &&
    (!trackingCarrier.trim() || !trackingNumber.trim());

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm text-slate-300">Loading order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Order Details</h1>
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/15 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Back to Orders
            </Link>
          </div>

          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-6">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Order Details</h1>
            <Link
              href="/admin/orders"
              className="rounded-xl border border-white/15 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Back to Orders
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-300">Order not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.28em] text-cyan-300">
                Admin Order View
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {order.order_number || "Order"}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Created {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/orders"
                className="rounded-xl border border-white/15 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Back to Orders
              </Link>

              <button
                onClick={() => router.refresh()}
                className="rounded-xl border border-white/15 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {warning ? (
          <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            {warning}
          </div>
        ) : null}

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-white">Order Information</h2>
              <p className="mt-1 text-sm text-slate-300">
                Full order summary and production details
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard label="Order Number">
                {order.order_number || "—"}
              </InfoCard>

              <InfoCard label="Status">
                <StatusBadge status={order.status} />
              </InfoCard>

              <InfoCard label="Customer">
                {order.customer_name || "—"}
              </InfoCard>

              <InfoCard label="Email">
                <span className="break-all">{order.customer_email || "—"}</span>
              </InfoCard>

              <InfoCard label="Product">
                {order.product_name || "—"}
              </InfoCard>

              <InfoCard label="Quantity">
                {order.quantity || "—"}
              </InfoCard>

              <InfoCard label="Size">
                {order.size || "—"}
              </InfoCard>

              <InfoCard label="Sides">
                {order.sides || "—"}
              </InfoCard>

              <InfoCard label="Paper">
                {order.paper || "—"}
              </InfoCard>

              <InfoCard label="Finish">
                {order.finish || "—"}
              </InfoCard>

              <InfoCard label="Subtotal">
                {money(order.subtotal)}
              </InfoCard>

              <InfoCard label="Shipping">
                {money(order.shipping)}
              </InfoCard>

              <div className="sm:col-span-2 rounded-2xl border border-emerald-400/20 bg-slate-800 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300/70">
                  Total
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {money(order.total)}
                </p>
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-slate-800 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300/70">
                  Notes
                </p>
                <p className="mt-3 min-h-[56px] whitespace-pre-wrap text-base font-medium text-white">
                  {order.notes || "—"}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
              <h2 className="mb-1 text-2xl font-semibold text-white">Update Order</h2>
              <p className="mb-5 text-sm text-slate-300">
                Manage status and shipment details
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="printing">Printing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Tracking Carrier
                  </label>
                  <select
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="">Select carrier</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="FedEx">FedEx</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Tracking Number
                  </label>
                  <input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-cyan-400"
                  />
                </div>

                {(status || "").toLowerCase() === "shipped" ? (
                  <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-sky-100">
                    To mark this order as shipped, both tracking carrier and tracking number are required. The shipped email will include the secure tracking link.
                  </div>
                ) : null}

                {trackingLink ? (
                  <a
                    href={trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    Open Tracking Link
                  </a>
                ) : null}

                <button
                  onClick={saveOrderUpdates}
                  disabled={saving || shippedNeedsTracking}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : shippedNeedsTracking
                    ? "Tracking Required for Shipped"
                    : "Save Changes"}
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
              <h2 className="mb-1 text-2xl font-semibold text-white">Artwork</h2>
              <p className="mb-5 text-sm text-slate-300">
                Production file attached to this order
              </p>

              {order.artwork_url ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300/70">
                      File Name
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-white">
                      {order.file_name || "Artwork file available"}
                    </p>
                  </div>

                  <a
                    href={order.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    Download Artwork
                  </a>
                </div>
              ) : (
                <p className="text-sm text-slate-300">No artwork uploaded.</p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}