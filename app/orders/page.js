"use client";

import { useEffect, useMemo, useState } from "react";

const validProducts = ["Business Cards", "Flyers", "Postcards"];

export default function OrdersPage() {
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("Business Cards");
  const [paperType, setPaperType] = useState("Standard");
  const [quantity, setQuantity] = useState(500);
  const [finishes, setFinishes] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("Ground");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get("product");
    if (productParam && validProducts.includes(productParam)) {
      setProduct(productParam);
    }
  }, []);

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

    if (paperType === "Premium") basePrice += 10;
    if (paperType === "Luxury") basePrice += 20;
    if (finishes.includes("Gloss")) basePrice += 8;
    if (finishes.includes("Matte")) basePrice += 8;
    if (finishes.includes("Soft Touch")) basePrice += 14;
    if (finishes.includes("Rounded Corners")) basePrice += 6;

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
    customerName: customerName || "New Customer",
    product,
    paperType,
    quantity,
    finishes,
    printPrice: subtotal,
    shippingMethod,
    shippingPrice: shipping,
    tax,
    total,
    status: "Pending",
  };

  async function handleCheckout() {
    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save order");
      }

      setMessage(`Order ${result.id} created successfully.`);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Start Your Order</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-xl">
            <input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border p-3 mb-4"
            />

            <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full border p-3 mb-4">
              <option>Business Cards</option>
              <option>Flyers</option>
              <option>Postcards</option>
            </select>

            <select value={paperType} onChange={(e) => setPaperType(e.target.value)} className="w-full border p-3 mb-4">
              <option>Standard</option>
              <option>Premium</option>
              <option>Luxury</option>
            </select>

            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full border p-3 mb-4">
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>

            <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} className="w-full border p-3">
              <option>Ground</option>
              <option>Express</option>
              <option>Overnight</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <p>Product: {product}</p>
            <p>Paper: {paperType}</p>
            <p>Quantity: {quantity}</p>
            <p>Total: ${total.toFixed(2)}</p>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="mt-4 w-full bg-blue-600 text-white py-2"
            >
              {isSubmitting ? "Saving..." : "Continue to Checkout"}
            </button>

            {message && <p className="mt-3 text-sm">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}