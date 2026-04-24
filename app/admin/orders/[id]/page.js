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
    return new Date(value).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
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
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${styles[normalized] || "bg-white/10 text-white border-white/20"}`}>
      {status || "—"}
    </span>
  );
}

function InfoCard({ label, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300/70">{label}</p>
      <div className="mt-3 text-base font-semibold text-white">{children}</div>
    </div>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrder() {
    if (!id) return;

    const res = await fetch(`/api/orders/${id}`);
    const data = await res.json();

    const orderData = data?.order || null;
    setOrder(orderData);

    const activityRes = await fetch(`/api/admin/orders/${id}/activity`);
    const activityData = await activityRes.json();

    setActivity(activityData?.activity || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        {order.order_number}
      </h1>

      <p className="mb-4 text-slate-300">
        Created: {formatDate(order.created_at)}
      </p>

      {/* Activity Section */}
      <section className="mt-6 border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Fulfillment History</h2>

        {activity.length === 0 ? (
          <p>No activity yet</p>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="mb-4 border-b border-white/10 pb-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-slate-300">{item.description}</p>
              <p className="text-xs text-slate-400">
                {formatDate(item.created_at)}
              </p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}