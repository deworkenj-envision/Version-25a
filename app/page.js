"use client";

import { useMemo, useState } from "react";

export default function Page() {
  const [product, setProduct] = useState("Business Cards");
  const [paperType, setPaperType] = useState("Standard");
  const [quantity, setQuantity] = useState(500);
  const [finishes, setFinishes] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("Ground");

  function toggleFinish(finish) {
    setFinishes((prev) =>
      prev.includes(finish)
        ? prev.filter((item) => item !== finish)
        : [...prev, finish]
    );
  }

  const printPrice = useMemo(() => {
    let basePrice = 0;

    if (product === "Business Cards") {
      if (quantity === 100) basePrice = 19.99;
      if (quantity === 250) basePrice = 29.99;
      if (quantity === 500) basePrice = 39.99;
      if (quantity === 1000) basePrice = 59.99;
    }

    if (product === "Flyers") {
      if (quantity === 100) basePrice = 34.99;
      if (quantity === 250) basePrice = 49.99;
      if (quantity === 500) basePrice = 69.99;
      if (quantity === 1000) basePrice = 99.99;
    }

    if (product === "Postcards") {
      if (quantity === 100) basePrice = 29.99;
      if (quantity === 250) basePrice = 44.99;
      if (quantity === 500) basePrice = 64.99;
      if (quantity === 1000) basePrice = 94.99;
    }

    if (paperType === "Premium") {
      basePrice += 10;
    }

    if (paperType === "Luxury") {
      basePrice += 20;
    }

    if (finishes.includes("Gloss")) {
      basePrice += 8;
    }

    if (finishes.includes("Matte")) {
      basePrice += 8;
    }

    if (finishes.includes("Soft Touch")) {
      basePrice += 14;
    }

    if (finishes.includes("Rounded Corners")) {
      basePrice += 6;
    }

    return basePrice;
  }, [product, paperType, quantity, finishes]);

  const shippingPrice = useMemo(() => {
    if (shippingMethod === "Ground") return 8.99;
    if (shippingMethod === "Express") return 19.99;
    if (shippingMethod === "Overnight") return 34.99;
    return 0;
  }, [shippingMethod]);

  const subtotal = Number(printPrice || 0);
  const shipping = Number(shippingPrice || 0);
  const tax = 0;
  const total = subtotal + shipping + tax;

  const orderData = {
    product,
    paperType,
    quantity,
    finishes,
    printPrice: subtotal,
    shippingMethod,
    shippingPrice: shipping,
    tax,
    total,
  };

  function handleCheckout() {
    console.log("Order ready for checkout:", orderData);
    alert("Next step: wire this button to Stripe checkout.");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Start Your Order
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose your product, paper, quantity, finishes, and shipping.
            Your order summary updates automatically.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Order Details
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product
                </label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option>Business Cards</option>
                  <option>Flyers</option>
                  <option>Postcards</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Paper Type
                </label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
              </div>

              <div>
                <span className="mb-3 block text-sm font-medium text-slate-700">
                  Finishes
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {["Gloss", "Matte", "Soft Touch", "Rounded Corners"].map(
                    (finish) => (
                      <label
                        key={finish}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={finishes.includes(finish)}
                          onChange={() => toggleFinish(finish)}
                        />
                        {finish}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Shipping Method
                </label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option>Ground</option>
                  <option>Express</option>
                  <option>Overnight</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <span>Product</span>
                <span className="font-medium text-slate-900">{product}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Paper</span>
                <span className="font-medium text-slate-900">{paperType}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Quantity</span>
                <span className="font-medium text-slate-900">{quantity}</span>
              </div>

              <div className="flex justify-between gap-4 items-start">
                <span>Finishes</span>
                <span className="max-w-[60%] text-right font-medium text-slate-900">
                  {finishes.length ? finishes.join(", ") : "None"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Print Price</span>
                <span className="font-medium text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Shipping Method</span>
                <span className="font-medium text-slate-900">
                  {shippingMethod}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Tax</span>
                <span className="font-medium text-slate-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between gap-4 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue to Checkout
            </button>

            <div className="mt-6 rounded-xl bg-slate-100 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Saved Order Object
              </p>
              <pre className="overflow-x-auto text-xs text-slate-700">
                {JSON.stringify(orderData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}