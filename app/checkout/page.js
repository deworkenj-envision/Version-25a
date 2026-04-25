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

  const [shippingAddressLine1, setShippingAddressLine1] = useState("");
  const [shippingAddressLine2, setShippingAddressLine2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("US");

  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName || "");
  const isPdf = /\.pdf$/i.test(fileName || "");

  const requiredComplete =
    customerName.trim() &&
    isValidEmail(customerEmail) &&
    customerPhone.trim() &&
    shippingAddressLine1.trim() &&
    shippingCity.trim() &&
    shippingState.trim() &&
    shippingPostalCode.trim() &&
    shippingCountry.trim() &&
    artworkUrl &&
    subtotal > 0;

  async function handleCheckout() {
    if (!customerName.trim()) return setError("Please enter your name or company name.");
    if (!isValidEmail(customerEmail)) return setError("Please enter a valid email address.");
    if (!customerPhone.trim()) return setError("Please enter your phone number.");
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
          shippingName: customerName,
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT SIDE (unchanged) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* ...UNCHANGED CONTENT... */}
          </section>

          {/* RIGHT SIDE (FIXED SUMMARY ONLY) */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">

            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <SummaryRow label="Subtotal" value={formatMoney(subtotal)} />
                <SummaryRow label="Shipping" value={formatMoney(shipping)} />

                <div className="rounded-xl bg-gradient-to-br from-[#2457f5] to-[#0e98ff] p-5 text-white">
                  <div className="text-sm text-blue-100">Total</div>
                  <div className="mt-1 text-3xl font-extrabold">
                    ${formatMoney(total)}
                  </div>

                  <div className="mt-3 text-xs text-blue-100 space-y-1">
                    <div>✓ Secure Stripe Checkout</div>
                    <div>✓ Professional Print Quality</div>
                    <div>✓ Fast Turnaround</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading || !requiredComplete}
                className="mt-6 block w-full rounded-xl bg-[#2457f5] px-4 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1848db] disabled:cursor-not-allowed disabled:bg-slate-400"
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

          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}