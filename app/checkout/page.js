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

  const productName = searchParams.get("product") || "Business Cards";
  const quantity = searchParams.get("quantity") || "100";
  const size = searchParams.get("size") || "—";
  const paper = searchParams.get("paper") || "Standard";
  const finish = searchParams.get("finish") || "Matte";
  const sides = searchParams.get("sides") || "Front Only";

  const artworkUrl = searchParams.get("artworkUrl") || "";
  const fileName = searchParams.get("artworkFileName") || "";

  const productImage = searchParams.get("productImage") || "";

  const subtotal = toNumber(searchParams.get("subtotal"));
  const shipping = 1.0;
  const total = subtotal + shipping;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [shippingAddressLine1, setShippingAddressLine1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("US");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);
  const isPdf = /\.pdf$/i.test(fileName);

  async function handleCheckout() {
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
          shippingAddressLine1,
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
          fileName,
          artworkUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Checkout failed.");

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* ORDER DETAILS */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Order Details</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div><b>Product:</b> {productName}</div>
              <div><b>Size:</b> {size}</div>
              <div><b>Paper:</b> {paper}</div>
              <div><b>Finish:</b> {finish}</div>
              <div><b>Sides:</b> {sides}</div>
              <div><b>Quantity:</b> {quantity}</div>
            </div>
          </div>

          {/* ARTWORK PREVIEW */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Artwork</h2>

            <div className="mt-4">
              <div className="text-sm mb-2">
                File: <b>{fileName || "Uploaded file"}</b>
              </div>

              {isImage && (
                <img
                  src={artworkUrl}
                  className="max-h-72 w-full object-contain border rounded-lg"
                />
              )}

              {isPdf && (
                <iframe
                  src={artworkUrl}
                  className="w-full h-72 border rounded-lg"
                />
              )}
            </div>
          </div>

          {/* CUSTOMER INFO */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Shipping Info</h2>

            <div className="grid gap-3 mt-4">
              <input placeholder="Name" onChange={(e)=>setCustomerName(e.target.value)} className="input"/>
              <input placeholder="Email" onChange={(e)=>setCustomerEmail(e.target.value)} className="input"/>
              <input placeholder="Phone" onChange={(e)=>setCustomerPhone(e.target.value)} className="input"/>
              <input placeholder="Address" onChange={(e)=>setShippingAddressLine1(e.target.value)} className="input"/>
              <input placeholder="City" onChange={(e)=>setShippingCity(e.target.value)} className="input"/>
              <input placeholder="State" onChange={(e)=>setShippingState(e.target.value)} className="input"/>
              <input placeholder="ZIP" onChange={(e)=>setShippingPostalCode(e.target.value)} className="input"/>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="sticky top-6 h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${formatMoney(shipping)}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${formatMoney(total)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Processing..." : "Pay Securely"}
          </button>

          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}