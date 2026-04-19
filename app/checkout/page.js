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

  const isImage = fileName?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
  const isPdf = fileName?.match(/\.pdf$/i);

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
      setError("Subtotal is missing or invalid.");
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

      if (!res.ok) throw new Error(data?.error || "Checkout failed.");
      if (!data?.url) throw new Error("Stripe URL missing.");

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
        <h1 className="mb-6 text-4xl font-bold text-slate-900">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Order Details</h2>

            {productImage && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img src={productImage} className="h-40 w-full object-cover" />
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info label="Product" value={productName} />
              <Info label="Quantity" value={quantity} />
              <Info label="Size" value={size} />
              <Info label="Paper" value={paper} />
              <Info label="Finish" value={finish} />
              <Info label="Sides" value={sides} />

              <div className="sm:col-span-2">
                <p className="text-sm text-slate-500">Artwork</p>

                {artworkUrl && (
                  <>
                    {/* PREVIEW */}
                    {isImage && (
                      <img
                        src={artworkUrl}
                        className="mt-3 max-h-[400px] w-full rounded-xl border object-contain"
                      />
                    )}

                    {isPdf && (
                      <iframe
                        src={artworkUrl}
                        className="mt-3 h-[500px] w-full rounded-xl border bg-white"
                      />
                    )}

                    {/* VIEW BUTTON */}
                    <a
                      href={artworkUrl}
                      target="_blank"
                      className="mt-3 inline-block font-semibold text-blue-600"
                    >
                      View Uploaded File
                    </a>
                  </>
                )}
              </div>

              <Info label="Notes" value={notes || "—"} />
            </div>

            <h2 className="mt-8 text-xl font-semibold">Your Info</h2>

            <div className="mt-4 space-y-4">
              <input
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border p-3"
              />

              <input
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-xl border p-3"
              />
            </div>

            {error && <p className="mt-4 text-red-500">{error}</p>}
          </section>

          <aside className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Summary</h2>

            <div className="mt-6 space-y-4">
              <Row label="Subtotal" value={formatMoney(subtotal)} />
              <Row label="Shipping" value={formatMoney(shipping)} />

              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${formatMoney(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-white font-bold"
            >
              {loading ? "Redirecting..." : "Pay Securely"}
            </button>

            <a href="/order" className="mt-4 block text-center text-sm">
              Back to Order
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">${value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
