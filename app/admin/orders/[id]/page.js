"use client";

import { useEffect, useState } from "react";

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

export default function AdminOrderDetailPage({ params }) {
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadOrder() {
    const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
    const data = await res.json();
    const o = data.order || data;
    setOrder(o);
    setStatus(o.status || "");
    setCarrier(o.tracking_carrier || "");
    setTrackingNumber(o.tracking_number || "");
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function handleSave() {
    try {
      setSaving(true);

      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          tracking_carrier: carrier,
          tracking_number: trackingNumber,
        }),
      });

      const data = await res.json();
      const updated = data.order || data;

      setOrder(updated);
      setStatus(updated.status || "");
      setCarrier(updated.tracking_carrier || "");
      setTrackingNumber(updated.tracking_number || "");
    } finally {
      setSaving(false);
    }
  }

  if (!order) {
    return <div className="p-10">Loading...</div>;
  }

  const trackingUrl = buildTrackingUrl(carrier, trackingNumber);

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-10">
      <div className="mx-auto max-w-[1800px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
        <div className="grid gap-6 bg-[#08163d] px-7 py-6 text-white md:grid-cols-6">
          <div>
            <div className="text-sm uppercase tracking-wide text-white/85">Order Number</div>
            <div className="mt-2 text-[17px] font-semibold">{order.order_number || "—"}</div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-white/85">Customer</div>
            <div className="mt-2 text-[17px] font-semibold">{order.customer_name || "—"}</div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-white/85">Email</div>
            <div className="mt-2 text-[17px] font-semibold break-all">{order.customer_email || "—"}</div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-white/85">Phone</div>
            <div className="mt-2 text-[17px] font-semibold">{order.customer_phone || order.phone || "—"}</div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-white/85">Total</div>
            <div className="mt-2 text-[17px] font-semibold">${Number(order.total || 0).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-white/85">Created</div>
            <div className="mt-2 text-[17px] font-semibold">
              {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
            </div>
          </div>
        </div>

        <div className="space-y-8 p-7">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Product</div>
              <div className="mt-3 text-[18px] font-semibold text-slate-900">{order.product_name || "—"}</div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Quantity</div>
              <div className="mt-3 text-[18px] font-semibold text-slate-900">{order.quantity || "—"}</div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Shipping</div>
              <div className="mt-3 text-[18px] font-semibold text-slate-900">${Number(order.shipping || 0).toFixed(2)}</div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Current Status</div>
              <div className="mt-3 text-[18px] font-semibold text-blue-600">{order.status || "—"}</div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">File Name</div>
              <div className="mt-3 break-all text-[18px] font-semibold text-slate-900">
                {order.file_name || "—"}
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Shipping Address</div>
              <div className="mt-3 text-[18px] font-semibold text-slate-900">
                {order.shipping_name || order.customer_name || "—"}
              </div>
              <div className="mt-2 text-[16px] text-slate-700">
                {order.shipping_address || order.address || "—"}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-3 block text-[16px] font-semibold text-slate-800">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-[18px] border border-slate-300 bg-white px-6 py-5 text-[18px] text-slate-900"
              >
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="printing">printing</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-[16px] font-semibold text-slate-800">Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded-[18px] border border-slate-300 bg-white px-6 py-5 text-[18px] text-slate-900"
              >
                <option value="">Select carrier</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="FedEx">FedEx</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-[16px] font-semibold text-slate-800">Tracking Number</label>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full rounded-[18px] border border-slate-300 bg-white px-6 py-5 text-[18px] text-slate-900"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-6">
            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Saved Carrier</div>
              <div className="mt-3 text-[18px] font-semibold text-slate-900">{carrier || "—"}</div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Saved Tracking Number</div>
              <div className="mt-3 break-all text-[18px] font-semibold text-slate-900">
                {trackingNumber || "—"}
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Tracking Link</div>
              <div className="mt-4">
                {trackingUrl ? (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-[16px] bg-blue-600 px-6 py-3 text-[16px] font-semibold text-white"
                  >
                    Open Tracking
                  </a>
                ) : (
                  <div className="text-slate-500">—</div>
                )}
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Order ID</div>
              <div className="mt-3 break-all text-[18px] font-semibold text-slate-900">{order.id}</div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Artwork</div>
              <div className="mt-4">
                {order.artwork_url ? (
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-[16px] bg-green-600 px-6 py-3 text-[16px] font-semibold text-white"
                  >
                    Download Artwork
                  </a>
                ) : (
                  <div className="text-slate-500">—</div>
                )}
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-6">
              <div className="text-sm uppercase tracking-wide text-slate-500">Print Sheet</div>
              <div className="mt-4">
                <a
                  href={`/admin/orders/${order.id}/packing-slip`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-[16px] bg-[#08163d] px-6 py-3 text-[16px] font-semibold text-white"
                >
                  Print Packing Slip
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-[18px] bg-blue-600 px-8 py-4 text-[18px] font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Update"}
            </button>

            <button
              onClick={loadOrder}
              className="rounded-[18px] border border-slate-300 bg-white px-8 py-4 text-[18px] font-semibold text-slate-900"
            >
              Reset Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}