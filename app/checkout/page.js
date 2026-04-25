"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return toNumber(value).toFixed(2);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
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

  const initialNotes = searchParams.get("notes") || "";
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
  const [customerPhone, setCustomerPhone] = useState("");

  const [shippingName, setShippingName] = useState("");
  const [shippingNameEdited, setShippingNameEdited] = useState(false);
  const [shippingAddressLine1, setShippingAddressLine1] = useState("");
  const [shippingAddressLine2, setShippingAddressLine2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("US");

  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shippingNameEdited) {
      setShippingName(customerName);
    }
  }, [customerName, shippingNameEdited]);

  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName || "");
  const isPdf = /\.pdf$/i.test(fileName || "");

  const requiredComplete =
    customerName.trim() &&
    isValidEmail(customerEmail) &&
    customerPhone.trim() &&
    shippingName.trim() &&
    shippingAddressLine1.trim() &&
    shippingCity.trim() &&
    shippingState.trim() &&
    shippingPostalCode.trim() &&
    shippingCountry.trim() &&
    artworkUrl &&
    subtotal > 0;

  async function handleCheckout() {
    if (!customerName.trim()) return setError("Please enter your full name.");
    if (!isValidEmail(customerEmail)) return setError("Please enter a valid email address.");
    if (!customerPhone.trim()) return setError("Please enter your phone number.");
    if (!shippingName.trim()) return setError("Please enter the ship-to name.");
    if (!shippingAddressLine1.trim()) return setError("Please enter the shipping address.");
    if (!shippingCity.trim()) return setError("Please enter the shipping city.");
    if (!shippingState.trim()) return setError("Please enter the shipping state.");
    if (!shippingPostalCode.trim()) return setError("Please enter the shipping ZIP/postal code.");
    if (!shippingCountry.trim()) return setError("Please enter the shipping country.");
    if (!artworkUrl) return setError("Artwork upload is required before checkout.");
    if (subtotal <= 0) return setError("Subtotal is missing or invalid. Please go back and rebuild the order.");

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
          customerPhone,
          shippingName,
          shippingAddressLine1,
          shippingAddressLine2,
          shippingCity,
          shippingState,
          shippingPostalCode,
          shippingCountry,
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
      if (!data?.url) throw new Error("Stripe checkout URL was not returned.");

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
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Contact & Shipping Information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Required before payment so we can process and ship your order.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="Contact Name *" value={customerName} onChange={setCustomerName} />
              <Input label="Email Address *" type="email" value={customerEmail} onChange={setCustomerEmail} />
              <Input label="Phone Number *" type="tel" value={customerPhone} onChange={setCustomerPhone} />

              <Input
                label="Ship To Name *"
                helpText="Auto-filled from contact name. Change only if shipping to someone else."
                value={shippingName}
                onChange={(value) => {
                  setShippingNameEdited(true);
                  setShippingName(value);
                }}
              />

              <div className="sm:col-span-2">
                <Input label="Shipping Address *" value={shippingAddressLine1} onChange={setShippingAddressLine1} />
              </div>

              <div className="sm:col-span-2">
                <Input label="Apartment, Suite, Unit" value={shippingAddressLine2} onChange={setShippingAddressLine2} />
              </div>

              <Input label="City *" value={shippingCity} onChange={setShippingCity} />
              <Input label="State *" value={shippingState} onChange={setShippingState} />
              <Input label="ZIP / Postal Code *" value={shippingPostalCode} onChange={setShippingPostalCode} />
              <Input label="Country *" value={shippingCountry} onChange={setShippingCountry} />
            </div>

            {error ? (
              <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
            ) : null}

            <div className="mt-8 border-t border-slate-200 pt-8">
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
                  <p className="mt-1 font-semibold text-slate-900">
                    {fileName || "Uploaded artwork"}
                  </p>

                  {artworkUrl ? (
                    <a
                      href={artworkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block font-semibold text-blue-600 hover:underline"
                    >
                      View Uploaded File
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold text-red-600">No file uploaded</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block rounded-xl border border-slate-200 bg-white p-4">
                    <span className="block text-sm font-semibold text-slate-700">
                      Order Notes / Special Instructions
                    </span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      placeholder="Enter any special instructions for your order..."
                      className="mt-3 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
                disabled={loading || !requiredComplete}
                className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Redirecting..." : "Pay Securely"}
              </button>

              {!requiredComplete ? (
                <p className="mt-3 text-center text-xs font-medium text-slate-500">
                  Complete all required fields before payment.
                </p>
              ) : null}

              <a
                href="/order"
                className="mt-4 block w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Order
              </a>
            </div>

            {artworkUrl ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Artwork Preview</h2>
                <p className="mt-1 text-sm text-slate-500">{fileName || "Uploaded artwork"}</p>

                {isImage ? (
                  <img
                    src={artworkUrl}
                    alt="Uploaded artwork preview"
                    className="mt-4 max-h-[500px] w-full rounded-xl border border-slate-200 bg-white object-contain"
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
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, type = "text", helpText = "" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {helpText ? (
        <span className="mt-1 block text-xs text-slate-500">{helpText}</span>
      ) : null}
    </label>
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
          <div className="mx-auto max-w-5xl">Loading checkout...</div>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}