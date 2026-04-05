"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadOrder() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/order-by-session?session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!isCancelled) {
          if (data?.found && data?.order) {
            setOrder(data.order);
          } else {
            setOrder(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load order details:", error);
        if (!isCancelled) {
          setOrder(null);
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isCancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
          Order Received
        </div>

        <h1 className="mb-3 text-5xl font-bold tracking-tight text-slate-950">
          Your order has been received
        </h1>

        <p className="mb-8 text-xl text-slate-600">
          {loading
            ? "Loading your order details..."
            : order
            ? "Thank you. Your payment was successful and your order details are below."
            : "We could not load the full order details, but your request was submitted."}
        </p>

        <div className="mb-8 rounded-[24px] bg-slate-50 p-8">
          <div className="grid grid-cols-2 gap-y-5 text-lg">
            <div className="text-slate-500">Order Number</div>
            <div className="text-right font-semibold text-slate-900">
              {loading
                ? "Loading..."
                : order?.order_number || order?.id || "Unavailable"}
            </div>

            <div className="text-slate-500">Product</div>
            <div className="text-right font-semibold text-slate-900">
              {loading
                ? "Loading..."
                : order?.product_name || "Unavailable"}
            </div>

            <div className="text-slate-500">Quantity</div>
            <div className="text-right font-semibold text-slate-900">
              {loading
                ? "Loading..."
                : order?.quantity ?? "Unavailable"}
            </div>

            <div className="text-slate-500">Paper</div>
            <div className="text-right font-semibold text-slate-900">
              {loading
                ? "Loading..."
                : order?.paper || "Unavailable"}
            </div>

            <div className="text-slate-500">Finish</div>
            <div className="text-right font-semibold text-slate-900">
              {loading
                ? "Loading..."
                : order?.finish || "Unavailable"}
            </div>

            <div className="text-slate-500">Status</div>
            <div className="text-right font-semibold text-amber-600">
              {loading
                ? "Loading..."
                : order?.status || "Paid"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Start Another Order
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}