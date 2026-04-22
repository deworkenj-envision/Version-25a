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
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
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
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Order Number</p>
                <p className="mt-1 text-lg font-semibold">{order?.order_number || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
                <p className="mt-1 text-lg font-semibold">{order?.customer_name || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                <p className="mt-1 text-lg font-semibold break-all">
                  {order?.customer_email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatDate(order?.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <p className="mt-1 text-lg font-semibold uppercase">
                  {order?.status || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Product</p>
                <p className="mt-1 text-lg font-semibold">{order?.product_name || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Quantity</p>
                <p className="mt-1 text-lg font-semibold">{order?.quantity || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Size</p>
                <p className="mt-1 text-lg font-semibold">{order?.size || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Paper</p>
                <p className="mt-1 text-lg font-semibold">{order?.paper || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Finish</p>
                <p className="mt-1 text-lg font-semibold">{order?.finish || "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                <p className="mt-1 text-2xl font-bold">{money(order?.total)}</p>
              </div>
            </div>
          </div>
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