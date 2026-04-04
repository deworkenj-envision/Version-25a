"use client";

import { useMemo, useState } from "react";
import { calculatePrice } from "../lib/pricing";
import { calculateShipping } from "../lib/shipping";

const productOptions = [
  {
    name: "Business Cards",
    badge: "Best Seller",
    size: "3.5 x 2 in",
    description: "Perfect for networking, storefronts, and service businesses.",
    price: 54,
    sizes: ["3.5 x 2 in"],
    papers: ["14pt Matte", "16pt Gloss", "16pt Soft Touch"],
    finishes: ["Matte", "Gloss", "Soft Touch", "UV Coated"],
    sides: ["Front Only", "Front and Back"],
    quantities: ["250", "500", "1000", "2500"],
  },
  {
    name: "Flyers",
    badge: "Promo Ready",
    size: "8.5 x 11 in",
    description: "Great for events, menus, promotions, and handouts.",
    price: 79,
    sizes: ["8.5 x 11 in", "5.5 x 8.5 in", "11 x 17 in"],
    papers: ["100lb Gloss Text", "100lb Matte Text", "14pt Cover"],
    finishes: ["Gloss", "Matte", "No Coating"],
    sides: ["Front Only", "Front and Back"],
    quantities: ["250", "500", "1000", "2500"],
  },
  {
    name: "Banners",
    badge: "Large Format",
    size: "6 x 3 ft",
    description: "Ideal for storefronts, events, and temporary signage.",
    price: 129,
    sizes: ["2 x 4 ft", "3 x 6 ft", "4 x 8 ft", "6 x 3 ft"],
    papers: ["13oz Vinyl", "15oz Heavy Duty Vinyl", "Mesh Banner"],
    finishes: ["Hemmed", "Grommets", "Pole Pockets"],
    sides: ["Single Sided"],
    quantities: ["1", "2", "5", "10"],
  },
  {
    name: "Postcards",
    badge: "Direct Mail",
    size: "6 x 4 in",
    description: "Built for local marketing, promotions, and announcements.",
    price: 69,
    sizes: ["4 x 6 in", "5 x 7 in", "6 x 9 in"],
    papers: ["14pt Matte", "16pt Gloss", "16pt AQ"],
    finishes: ["Matte", "Gloss", "AQ Coated", "UV Coated"],
    sides: ["Front Only", "Front and Back"],
    quantities: ["250", "500", "1000", "2500"],
  },
];

export default function order-artworkworkworkPage() {
  const [selectedProduct, setSelectedProduct] = useState("Business Cards");
  const [quantity, setQuantity] = useState("500");
  const [fileName, setFileName] = useState("");
  const [storedFilePath, setStoredFilePath] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("No artwork uploaded yet.");
  const [uploadError, setUploadError] = useState("");

  const currentProduct = useMemo(() => {
    return (
      productOptions.find((item) => item.name === selectedProduct) ||
      productOptions[0]
    );
  }, [selectedProduct]);

  const [size, setSize] = useState(currentProduct.sizes[0]);
  const [paper, setPaper] = useState(currentProduct.papers[0]);
  const [finish, setFinish] = useState(currentProduct.finishes[0]);
  const [sides, setSides] = useState(currentProduct.sides[0]);

  const calculatedPrice = useMemo(() => {
    return calculatePrice({
      productName: selectedProduct,
      quantity,
      paper,
      finish,
      sides,
    });
  }, [selectedProduct, quantity, paper, finish, sides]);

  const shippingPrice = useMemo(() => {
    return calculateShipping({
      productName: selectedProduct,
      quantity,
    });
  }, [selectedProduct, quantity]);

  const grandTotal = useMemo(() => {
    return calculatedPrice + shippingPrice;
  }, [calculatedPrice, shippingPrice]);

  function handleProductChange(productName) {
    const product =
      productOptions.find((item) => item.name === productName) ||
      productOptions[0];

    setSelectedProduct(product.name);
    setSize(product.sizes[0]);
    setPaper(product.papers[0]);
    setFinish(product.finishes[0]);
    setSides(product.sides[0]);
    setQuantity(product.quantities[0]);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError("");
      setFileName(file.name);
      setStoredFilePath("");
      setUploadMessage(`Uploading ${file.name}...`);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-artwork", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.error || "Failed to upload artwork.");
        setUploadMessage("Upload failed.");
        setFileName("");
        return;
      }

      setStoredFilePath(data.filePath);
      setFileName(data.fileName);
      setUploadMessage(`Artwork uploaded successfully: ${data.fileName}`);
    } catch (error) {
      console.error(error);
      setUploadError("Something went wrong while uploading the artwork.");
      setUploadMessage("Upload failed.");
      setFileName("");
    } finally {
      setUploading(false);
    }
  }

  async function handlePlaceOrder() {
    if (!contactName.trim()) {
      alert("Please enter your contact name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!storedFilePath.trim()) {
      alert("Please upload your artwork file.");
      return;
    }

    try {
      setSubmitting(true);

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: contactName,
          customerEmail: email,
          productName: selectedProduct,
          size,
          paper,
          finish,
          sides,
          quantity,
          fileName: storedFilePath,
          notes,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        alert(orderData.error || "Failed to create order.");
        return;
      }

      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.order.order_number,
          productName: orderData.order.product_name,
          quantity: 1,
          price: grandTotal,
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        alert(checkoutData.error || "Failed to start Stripe checkout.");
        return;
      }

      if (!checkoutData.url) {
        alert("Stripe checkout URL was not returned.");
        return;
      }

      window.location.href = checkoutData.url;
    } catch (error) {
      console.error(error);
      alert("Something went wrong while starting checkout.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Order Now
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Start your print order
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Choose your product, select your print options, upload your artwork,
              and continue to payment.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 1
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Choose a product
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {productOptions.map((item) => {
                  const active = selectedProduct === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleProductChange(item.name)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          {item.badge}
                        </span>
                        <span className="text-sm text-slate-500">{item.size}</span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                      <div className="mt-4 text-lg font-bold text-slate-900">
                        Starting at ${item.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 2
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Choose print details
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.sizes.map((option) => (
                    <option key={option} value={option}>
                      Size: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.papers.map((option) => (
                    <option key={option} value={option}>
                      Paper: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.finishes.map((option) => (
                    <option key={option} value={option}>
                      Finish: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={sides}
                  onChange={(e) => setSides(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.sides.map((option) => (
                    <option key={option} value={option}>
                      Sides: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2"
                >
                  {currentProduct.quantities.map((option) => (
                    <option key={option} value={option}>
                      Quantity: {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 3
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Upload print-ready artwork
                </h2>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-blue-700"
                />

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    Artwork Status
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    {uploadMessage}
                  </div>

                  {uploading && (
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-3 text-sm font-medium text-red-600">
                      {uploadError}
                    </div>
                  )}

                  {!!storedFilePath && !uploading && !uploadError && (
                    <div className="mt-3 text-sm font-medium text-green-700">
                      File saved successfully and ready for checkout.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 4
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Customer details
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Contact name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
                <textarea
                  placeholder="Special instructions"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting || uploading}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading
                    ? "Uploading Artwork..."
                    : submitting
                    ? "Starting Payment..."
                    : "Continue to Payment"}
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Order Preview
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Order summary
              </h2>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Product</span>
                  <span className="font-semibold text-slate-900">{currentProduct.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Size</span>
                  <span className="font-semibold text-slate-900">{size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paper</span>
                  <span className="font-semibold text-slate-900">{paper}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Finish</span>
                  <span className="font-semibold text-slate-900">{finish}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sides</span>
                  <span className="font-semibold text-slate-900">{sides}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Quantity</span>
                  <span className="font-semibold text-slate-900">{quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Artwork file</span>
                  <span className="font-semibold text-slate-900">
                    {fileName || "Not uploaded yet"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-500">Print Price</span>
                  <span className="font-semibold text-slate-900">
                    ${calculatedPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-semibold text-slate-900">
                    ${shippingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-500">Grand Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
