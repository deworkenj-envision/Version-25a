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

function buildTrackingUrl(carrier, trackingNumber) {
  const number = encodeURIComponent((trackingNumber || "").trim());
  if (!number) return "";

  switch ((carrier || "").toLowerCase()) {
    case "ups":
      return `https://www.ups.com/track?tracknum=${number}`;
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${number}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${number}`;
    default:
      return "";
  }
}

function getFileExtensionFromUrl(url) {
  if (!url) return "";
  try {
    const cleanUrl = url.split("?")[0];
    const lastPart = cleanUrl.split("/").pop() || "";
    const parts = lastPart.split(".");
    if (parts.length < 2) return "";
    return parts.pop();
  } catch {
    return "";
  }
}

async function downloadArtworkWithOrderNumber(artworkUrl, orderNumber) {
  if (!artworkUrl) return;

  const response = await fetch(artworkUrl);
  if (!response.ok) {
    throw new Error("Could not download artwork.");
  }

  const blob = await response.blob();
  const extension = getFileExtensionFromUrl(artworkUrl) || "pdf";
  const filename = `${orderNumber || "artwork"}.${extension}`;

  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artworkDownloading, setArtworkDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [status, setStatus] = useState("pending");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const res = await fetch(`/api/orders/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load order.");
        }

        const loadedOrder = data?.order || data;

        if (!cancelled) {
          setOrder(loadedOrder);
          setStatus(loadedOrder?.status || "pending");
          setTrackingCarrier(loadedOrder?.tracking_carrier || "");
          setTrackingNumber(loadedOrder?.tracking_number || "");
          setNotes(loadedOrder?.notes || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load order.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadOrder();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const trackingUrl = useMemo(() => {
    return buildTrackingUrl(trackingCarrier, trackingNumber);
  }, [trackingCarrier, trackingNumber]);

  async function handleSave() {
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
          tracking_carrier: trackingCarrier || null,
          tracking_number: trackingNumber || null,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save order.");
      }

      const updatedOrder = data?.order || data;

      setOrder(updatedOrder);
      setStatus(updatedOrder?.status || status);
      setTrackingCarrier(updatedOrder?.tracking_carrier || trackingCarrier);
      setTrackingNumber(updatedOrder?.tracking_number || trackingNumber);
      setNotes(updatedOrder?.notes || notes);
      setSuccess("Order updated successfully.");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to save order.");
    } finally {
      setSaving(false);
    }
  }

  async function handleArtworkDownload() {
    if (!order?.artwork_url) return;

    try {
      setArtworkDownloading(true);
      setError("");
      setSuccess("");
      await downloadArtworkWithOrderNumber(order.artwork_url, order.order_number);
    } catch (err) {
      setError(err.message || "Failed to download artwork.");
    } finally {
      setArtworkDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            Loading order...
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            Order not found.
          </div>
        </div>
      </div>
    );
  }

  const subtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shipping || 0);
  const total = Number(order.total || subtotal + shipping);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2">
              <Link
                href="/admin/orders"
                className="text-sm text-white/70 transition hover:text-white"
              >
                ← Back to Orders
              </Link>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Order {order.order_number || order.id}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span>Created: {formatDate(order.created_at)}</span>
              <span>•</span>
              <span>Stripe Session: {order.stripe_session_id || "—"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/admin/orders/${order.id}/packing-slip`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Print Packing Slip
            </a>

            {order.artwork_url ? (
              <>
                <a
                  href={order.artwork_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-400"
                >
                  Open Sheet
                </a>

                <button
                  type="button"
                  onClick={handleArtworkDownload}
                  disabled={artworkDownloading}
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {artworkDownloading ? "Downloading..." : "Download Artwork"}
                </button>
              </>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-black p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    (status || "").toLowerCase() === "delivered"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : (status || "").toLowerCase() === "shipped"
                      ? "bg-sky-500/20 text-sky-300"
                      : (status || "").toLowerCase() === "printing"
                      ? "bg-amber-500/20 text-amber-300"
                      : (status || "").toLowerCase() === "paid"
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {status || "pending"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Product
                  </div>
                  <div className="text-lg font-medium">
                    {order.product_name || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Quantity
                  </div>
                  <div className="text-lg font-medium">{order.quantity || "—"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Size
                  </div>
                  <div className="text-lg font-medium">{order.size || "—"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Sides
                  </div>
                  <div className="text-lg font-medium">{order.sides || "—"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Paper
                  </div>
                  <div className="text-lg font-medium">{order.paper || "—"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Finish
                  </div>
                  <div className="text-lg font-medium">{order.finish || "—"}</div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-black p-6 shadow-2xl">
              <h2 className="mb-5 text-xl font-semibold">Customer</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Name
                  </div>
                  <div className="text-lg font-medium">
                    {order.customer_name || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Email
                  </div>
                  <div className="break-all text-lg font-medium">
                    {order.customer_email || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                  Internal / Customer Notes
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                  placeholder="Add order notes here..."
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-black p-6 shadow-2xl">
              <h2 className="mb-5 text-xl font-semibold">Fulfillment</h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="printing">Printing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Carrier
                  </label>
                  <select
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none"
                  >
                    <option value="">Select carrier</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="FedEx">FedEx</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-white outline-none placeholder:text-white/30"
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>

              {trackingUrl ? (
                <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
                  <div className="mb-2 text-sm font-medium text-sky-200">
                    Clickable Tracking Link
                  </div>
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm text-sky-300 underline"
                  >
                    {trackingUrl}
                  </a>
                </div>
              ) : null}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Fulfillment Updates"}
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-black p-6 shadow-2xl">
              <h2 className="mb-5 text-xl font-semibold">Payment Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-medium">{money(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="text-white/70">Shipping</span>
                  <span className="font-medium">{money(shipping)}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{money(total)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-black p-6 shadow-2xl">
              <h2 className="mb-5 text-xl font-semibold">Artwork</h2>

              {order.artwork_url ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                      File Name
                    </div>
                    <div className="text-sm text-white/80">
                      {order.file_name || `${order.order_number || "Order"} artwork`}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <a
                      href={order.artwork_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                    >
                      Open Sheet
                    </a>

                    <button
                      type="button"
                      onClick={handleArtworkDownload}
                      disabled={artworkDownloading}
                      className="inline-flex items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {artworkDownloading ? "Downloading..." : "Download Artwork"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                  No artwork uploaded for this order.
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-black p-6 shadow-2xl">
              <h2 className="mb-5 text-xl font-semibold">Quick Info</h2>

              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Order ID
                  </div>
                  <div className="break-all text-white/85">{order.id}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Payment Status
                  </div>
                  <div className="text-white/85">{order.status || "pending"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Carrier
                  </div>
                  <div className="text-white/85">
                    {trackingCarrier || order.tracking_carrier || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">
                    Tracking Number
                  </div>
                  <div className="break-all text-white/85">
                    {trackingNumber || order.tracking_number || "—"}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}