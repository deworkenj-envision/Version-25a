"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function money(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function DetailItem({ label, value, large = false }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={`mt-1 font-semibold text-slate-900 ${
          large ? "text-lg" : "text-base"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Finalizing your order...");
  const [error, setError] = useState("");

  const params = useMemo(() => {
    if (typeof window === "undefined") {
      return { sessionId: "", orderId: "" };
    }

    const search = new URLSearchParams(window.location.search);
    return {
      sessionId: (search.get("session_id") || "").trim(),
      orderId: (search.get("order_id") || "").trim(),
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOrderWithRetry() {
      setLoading(true);
      setError("");

      for (let attempt = 1; attempt <= 12; attempt += 1) {
        try {
          const query = new URLSearchParams();

          if (params.sessionId) query.set("session_id", params.sessionId);
          if (!params.sessionId && params.orderId) query.set("order_id", params.orderId);

          if (!query.toString()) {
            throw new Error("Missing session information.");
          }

          const res = await fetch(`/api/orders/success?${query.toString()}`, {
            cache: "no-store",
          });

          const data = await res.json();

          if (res.ok && data?.order) {
            if (!cancelled) {
              setOrder(data.order);
              setMessage("Your order is confirmed.");
              setLoading(false);
            }
            return;
          }

          if (attempt < 12) {
            if (!cancelled) {
              setMessage("Waiting for payment confirmation...");
            }
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }

          throw new Error(data?.error || "Could not load order.");
        } catch (err) {
          if (attempt < 12) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }

          if (!cancelled) {
            setError(err.message || "Could not load order.");
            setLoading(false);
          }
          return;
        }
      }
    }

    loadOrderWithRetry();

    return () => {
      cancelled = true;
    };
  }, [params.orderId, params.sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-14 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-bold">Thank you for your order</h1>
          <p className="mt-4 text-slate-600">{message}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-14 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-bold">Thank you for your order</h1>
          <p className="mt-4 text-red-600">{error}</p>

          <div className="mt-6">
            <Link
              href="/track"
              className="inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Track Order
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-14 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] border border-emerald-200 bg-white p-10 shadow-sm">
          <div className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            Payment Confirmed
          </div>

          <h1 className="mt-4 text-4xl font-bold">Thank you for your order</h1>

          <p className="mt-3 text-slate-600">
            Your order has been received and is now in our system.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <DetailItem label="Order Number" value={order?.order_number} large />
              <DetailItem label="Created" value={formatDate(order?.created_at)} large />
              <DetailItem label="Status" value={(order?.status || "—").toUpperCase()} large />
              <DetailItem label="Total" value={money(order?.total)} large />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Product Details</h2>

            <div className="mt-6 space-y-4">
              <DetailItem label="Product" value={order?.product_name} large />
              <DetailItem label="Quantity" value={order?.quantity} large />
              <DetailItem label="Size" value={order?.size} large />
              <DetailItem label="Paper" value={order?.paper} large />
              <DetailItem label="Finish" value={order?.finish} large />
              <DetailItem label="Sides" value={order?.sides} large />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Customer Information</h2>

            <div className="mt-6 space-y-4">
              <DetailItem label="Customer Name" value={order?.customer_name} large />
              <DetailItem label="Email" value={order?.customer_email} large />
              <DetailItem label="Phone" value={order?.customer_phone} large />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Shipping Information</h2>

            <div className="mt-6 space-y-4">
              <DetailItem label="Ship To" value={order?.shipping_name} large />
              <DetailItem label="Address" value={order?.shipping_address_line1} large />
              <DetailItem label="Apt / Suite / Unit" value={order?.shipping_address_line2 || "—"} large />
              <DetailItem
                label="City, State ZIP"
                value={[
                  order?.shipping_city,
                  order?.shipping_state,
                  order?.shipping_postal_code,
                ]
                  .filter(Boolean)
                  .join(", ")
                  .replace(", ", ", ")}
                large
              />
              <DetailItem label="Country" value={order?.shipping_country} large />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Order Notes</h2>
          <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 font-medium text-slate-800">
            {order?.notes || "—"}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <Link
              href={order?.tracking_token ? `/track?token=${order.tracking_token}` : "/track"}
              className="inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Track Order
            </Link>

            <Link
              href="/"
              className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}