"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function safe(value) {
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatMoney(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
}

export default function PackingSlipsPage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids") || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPackingSlips() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/api/admin/packing-slips?ids=${encodeURIComponent(ids)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load packing slips.");
        }

        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load packing slips.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadPackingSlips();
  }, [ids]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 print:bg-white">
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-900 px-6 py-4 text-white print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="text-sm font-semibold">
            {loading
              ? "Loading packing slips..."
              : `${orders.length} Packing Slip${orders.length === 1 ? "" : "s"}`}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Print
            </button>
            <button
              onClick={() => window.close()}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 print:p-0">
        {loading ? (
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
            Loading packing slips...
          </div>
        ) : error ? (
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold">Could not load packing slips</h1>
            <p className="text-sm text-zinc-600">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold">No packing slips found</h1>
            <p className="text-sm text-zinc-600">
              Go back to Admin Orders, select one or more orders, then click
              {" "}
              <strong>Bulk Print Packing Slips</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-6 print:space-y-0">
            {orders.map((order) => (
              <div
                key={order.id}
                className="mx-auto min-h-[11in] w-full max-w-[8.5in] break-after-page bg-white p-8 shadow-sm print:shadow-none"
              >
                <div className="mb-6 flex items-start justify-between gap-6 border-b-2 border-zinc-900 pb-4">
                  <div>
                    <h1 className="text-3xl font-bold">EnVision Direct</h1>
                    <p className="mt-1 text-sm text-zinc-600">
                      Production Packing Slip
                    </p>
                  </div>

                  <div className="text-right">
                    <h2 className="text-2xl font-bold">
                      {safe(order.order_number)}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Created: {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Customer
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="inline-block min-w-[110px] font-semibold text-zinc-500">
                          Name:
                        </span>
                        {safe(order.customer_name)}
                      </div>
                      <div>
                        <span className="inline-block min-w-[110px] font-semibold text-zinc-500">
                          Email:
                        </span>
                        {safe(order.customer_email)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Order Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="inline-block min-w-[110px] font-semibold text-zinc-500">
                          Status:
                        </span>
                        {safe(order.status)}
                      </div>
                      <div>
                        <span className="inline-block min-w-[110px] font-semibold text-zinc-500">
                          Total:
                        </span>
                        {formatMoney(order.total)}
                      </div>
                      <div className="break-all">
                        <span className="inline-block min-w-[110px] font-semibold text-zinc-500">
                          Order ID:
                        </span>
                        {safe(order.id)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-zinc-200">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-zinc-100">
                      <tr>
                        <th className="border-b border-zinc-200 px-3 py-3">Product</th>
                        <th className="border-b border-zinc-200 px-3 py-3">Size</th>
                        <th className="border-b border-zinc-200 px-3 py-3">Paper</th>
                        <th className="border-b border-zinc-200 px-3 py-3">Finish</th>
                        <th className="border-b border-zinc-200 px-3 py-3">Sides</th>
                        <th className="border-b border-zinc-200 px-3 py-3">Qty</th>
                        <th className="border-b border-zinc-200 px-3 py-3">Artwork</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.product_name)}
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.size)}
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.paper)}
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.finish)}
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.sides)}
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.quantity)}
                        </td>
                        <td className="border-b border-zinc-200 px-3 py-3">
                          {safe(order.file_name)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-2xl border border-zinc-200 p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Production Notes
                  </h3>
                  <div className="min-h-[70px] text-sm">
                    {order.notes ? order.notes : "No customer notes provided."}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-8 text-sm text-zinc-500">
                  <div className="border-t border-zinc-300 pt-3">
                    Packed By: ______________________________________
                  </div>
                  <div className="border-t border-zinc-300 pt-3">
                    Checked By: _____________________________________
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}