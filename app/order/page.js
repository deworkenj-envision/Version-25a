"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PRODUCT_OPTIONS,
  calculatePrice,
  formatPrice,
} from "../../lib/pricing";

export default function OrderPage() {
  const [productName, setProductName] = useState("Business Cards");
  const [quantity, setQuantity] = useState(100);
  const [paper, setPaper] = useState("Standard");
  const [finish, setFinish] = useState("Matte");
  const [sides, setSides] = useState("Front Only");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const options = PRODUCT_OPTIONS[productName];

  useEffect(() => {
    if (!options) return;
    setQuantity(options.quantities[0]);
    setPaper(options.papers[0]);
    setFinish(options.finishes[0]);
    setSides(options.sides[0]);
  }, [productName]);

  const pricing = useMemo(() => {
    return calculatePrice({
      productName,
      quantity,
      paper,
      finish,
      sides,
    });
  }, [productName, quantity, paper, finish, sides]);

  async function handleUpload() {
    if (!selectedFile) return null;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload-artwork", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed.");
      }

      setUploadedFile(data);
      return data;
    } catch (err) {
      setError(err.message || "Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let artwork = uploadedFile;

      if (selectedFile && !uploadedFile) {
        artwork = await handleUpload();
        if (!artwork) {
          setSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          quantity,
          paper,
          finish,
          sides,
          customerName,
          customerEmail,
          notes,
          subtotal: pricing.subtotal,
          shipping: pricing.shipping,
          total: pricing.total,
          fileName: artwork?.fileName || "",
          artworkUrl: artwork?.publicUrl || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Checkout failed.");
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Missing checkout URL.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Start Your Order</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose your product, paper, quantity, and finish. Upload your
            print-ready artwork and continue to checkout.
          </p>
        </div>

        <form onSubmit={handleCheckout} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                Product options
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="productName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Product
                  </label>
                  <select
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {Object.keys(PRODUCT_OPTIONS).map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.quantities.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="paper"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Paper
                  </label>
                  <select
                    id="paper"
                    value={paper}
                    onChange={(e) => setPaper(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.papers.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="finish"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Finish
                  </label>
                  <select
                    id="finish"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.finishes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="sides"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Printing sides
                  </label>
                  <select
                    id="sides"
                    value={sides}
                    onChange={(e) => setSides(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.sides.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                Customer information
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerEmail"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="artwork"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Upload artwork
                  </label>
                  <input
                    id="artwork"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium"
                  />
                  {uploadedFile?.fileName ? (
                    <p className="mt-2 text-sm text-green-700">
                      Uploaded: {uploadedFile.fileName}
                    </p>
                  ) : null}
                  {uploading ? (
                    <p className="mt-2 text-sm text-slate-600">Uploading artwork...</p>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="Anything you want us to know about your order..."
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-2xl font-semibold text-slate-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Product</p>
                <p className="mt-1 font-semibold text-slate-900">{productName}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Specs</p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {quantity} • {paper} • {finish} • {sides}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(pricing.subtotal)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(pricing.shipping)}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {formatPrice(pricing.total)}
                    </span>
                  </div>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full rounded-xl bg-blue-600 px-4 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}