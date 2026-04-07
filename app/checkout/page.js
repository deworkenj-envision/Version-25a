"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return toNumber(value).toFixed(2);
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const productName = searchParams.get("productName") || "Business Cards";
  const quantity = searchParams.get("quantity") || "100";
  const paper = searchParams.get("paper") || "Standard";
  const finish = searchParams.get("finish") || "Matte";
  const sides = searchParams.get("sides") || "Front Only";
  const customerName = searchParams.get("customerName") || "";
  const customerEmail = searchParams.get("customerEmail") || "";
  const notes = searchParams.get("notes") || "";
  const artworkUrl = searchParams.get("artworkUrl") || "";
  const fileName = searchParams.get("fileName") || "";

  const subtotal = toNumber(searchParams.get("subtotal"));
  const shipping = toNumber(searchParams.get("shipping"));
  const total = toNumber(searchParams.get("total"));

  const summary = useMemo(() => {
    return {
      subtotal: formatMoney(subtotal),
      shipping: formatMoney(shipping),
      total: formatMoney(total),
    };
  }, [subtotal, shipping, total]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-3 text-slate-600">
            Review your order details before payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Order details
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Product</p>
                <p className="mt-1 font-semibold text-slate-900">{productName}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Quantity</p>
                <p className="mt-1 font-semibold text-slate-900">{quantity}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Paper</p>
                <p className="mt-1 font-semibold text-slate-900">{paper}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Finish</p>
                <p className="mt-1 font-semibold text-slate-900">{finish}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Sides</p>
                <p className="mt-1 font-semibold text-slate-900">{sides}</p>
              </div>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-slate-900">
              Customer information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {customerName || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {customerEmail || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Notes</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {notes || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Artwork</p>
                {artworkUrl ? (
                  <a
                    href={artworkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                  >
                    {fileName || "View uploaded artwork"}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold text-slate-900">No file uploaded</p>
                )}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Pricing summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">
                  ${summary.subtotal}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-slate-900">
                  ${summary.shipping}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    ${summary.total}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-4 text-base font-semibold text-white transition hover:bg-blue-700"
              onClick={() => window.history.back()}
            >
              Back to Order
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}