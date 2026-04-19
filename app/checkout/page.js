"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return toNumber(value).toFixed(2);
}

function CheckoutInner() {
  const searchParams = useSearchParams();

  const productName =
    searchParams.get("product") ||
    searchParams.get("productName") ||
    "Business Cards";

  const quantity = searchParams.get("quantity") || "100";
  const size = searchParams.get("size") || "—";
  const paper = searchParams.get("paper") || "Standard";
  const finish = searchParams.get("finish") || "Matte";
  const sides = searchParams.get("sides") || "Front Only";

  const notes = searchParams.get("notes") || "";
  const artworkUrl = searchParams.get("artworkUrl") || "";
  const fileName =
    searchParams.get("artworkFileName") ||
    searchParams.get("fileName") ||
    "";

  const productImage = searchParams.get("productImage") || "";
  const subtotal = toNumber(searchParams.get("subtotal"));
  const shipping = 12.95;
  const total = subtotal + shipping;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName || "");
  const isPdf = /\.pdf$/i.test(fileName || "");

  async function handleCheckout() {
    if (!customerName.trim() || !customerEmail.trim()) {
      setError("Please enter your name and email.");
      return;
    }

    if (!artworkUrl) {
      setError("Artwork upload is required before checkout.");
      return;
    }

    if (subtotal <= 0) {
      setError("Subtotal is missing or invalid. Please go back and rebuild the order.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          productName,
          size,
          paper,
          finish,
          sides,
          quantity,
          subtotal,
          shipping,
          total,
          notes,
          fileName,
          artworkUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Checkout failed.");
      }

      if (!data?.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold text-slate-900">Checkout Page</h1>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Order Details</h2>

            {productImage ? (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img
                  src={productImage}
                  alt={productName}
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Product" value={productName} />
              <InfoCard label="Quantity" value={quantity} />
              <InfoCard label="Size" value={size} />
              <InfoCard label="Paper" value={paper} />
              <InfoCard label="Finish" value={finish} />
              <InfoCard label="Sides" value={sides} />

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Artwork</p>

                {artworkUrl ? (
                  <div className="mt-2">
                    <p className="font-semibold text-slate-900">
                      {fileName || "Uploaded artwork"}
                    </p>

                    {isImage ? (
                      <img
                        src={artworkUrl}
                        alt="Uploaded artwork preview"
                        className="mt-4 max-h-[500px] w-full rounded-xl border border-slate-200 object-contain bg-white"
                      />
                    ) : null}

                    {isPdf ? (
                      <iframe
                        src={artworkUrl}
                        title="Uploaded PDF Preview"
                        className="mt-4 h-[650px] w-full rounded-xl border border-slate-200 bg-white"
                      />
                    ) : null}

                    <a
                      href={artworkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
                    >
                      View Uploaded File
                    </a>
                  </div>
                ) : (
                  <p className="mt-1 font-semibold text-slate-900">No file uploaded</p>
                )}
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Notes</p>
                <p className="mt-1 font-semibold text-slate-900">{notes || "—"}</p>
              </div>
            </div>

            <h2 className="mt-8 text-xl font-semibold text-slate-900">Your Info</h2>

            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3"
              />
            </div>

            {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Summary</h2>

            <div className="mt-6 space-y-4">
              <SummaryRow label="Subtotal" value={formatMoney(subtotal)} />
              <SummaryRow label="Shipping" value={formatMoney(shipping)} />

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ${formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-base font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-400"
            >
              {loading ? "Redirecting..." : "Pay Securely"}
            </button>

            <a
              href="/order"
              className="mt-4 block w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Order
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">${value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="mb-6 text-4xl font-bold text-slate-900">Checkout Page</h1>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-600">Loading checkout...</p>
            </div>
          </div>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}