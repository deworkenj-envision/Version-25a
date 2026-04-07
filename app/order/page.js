"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PRODUCT_OPTIONS,
  calculatePrice,
  formatPrice,
} from "../../lib/pricing";

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      {children}
    </label>
  );
}

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

  const options = PRODUCT_OPTIONS[productName] || {
    quantities: [100],
    papers: ["Standard"],
    finishes: ["Matte"],
    sides: ["Front Only"],
  };

  useEffect(() => {
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
    <main className="min-h-screen bg-slate-50">
      <section className="bg-[#17307a] px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Build Your Print Order
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100 md:text-lg">
            Choose your product, set your specs, upload artwork, and get live pricing
            before checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-6 pb-16">
        <form
          onSubmit={handleCheckout}
          className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                title="Choose your product"
                subtitle="Start with the print item you want to order."
              />

              <div className="grid gap-4 md:grid-cols-3">
                {Object.keys(PRODUCT_OPTIONS).map((product) => {
                  const active = productName === product;
                  return (
                    <button
                      key={product}
                      type="button"
                      onClick={() => setProductName(product)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-lg font-semibold text-slate-900">
                        {product}
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        {product === "Business Cards" &&
                          "Premium cards with professional finishes."}
                        {product === "Flyers" &&
                          "Sharp, high-quality prints for promotions."}
                        {product === "Postcards" &&
                          "Durable direct-mail and marketing pieces."}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                title="Customize your order"
                subtitle="Your pricing updates automatically as you change options."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.quantities.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="paper">Paper</FieldLabel>
                  <select
                    id="paper"
                    value={paper}
                    onChange={(e) => setPaper(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.papers.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="finish">Finish</FieldLabel>
                  <select
                    id="finish"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.finishes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="sides">Printing sides</FieldLabel>
                  <select
                    id="sides"
                    value={sides}
                    onChange={(e) => setSides(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {options.sides.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Selected product</p>
                  <p className="mt-1 font-semibold text-slate-900">{productName}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Configuration</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {paper} / {finish}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Print style</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {quantity} / {sides}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                title="Customer information"
                subtitle="Add your details and upload your print-ready artwork."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="customerName">Full name</FieldLabel>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="customerEmail">Email address</FieldLabel>
                  <input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel htmlFor="artwork">Upload artwork</FieldLabel>
                  <input
                    id="artwork"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium"
                  />
                  {uploadedFile?.fileName ? (
                    <p className="mt-2 text-sm text-green-700">
                      Uploaded: {uploadedFile.fileName}
                    </p>
                  ) : null}
                  {selectedFile && !uploadedFile?.fileName ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Selected file: {selectedFile.name}
                    </p>
                  ) : null}
                  {uploading ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Uploading artwork...
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="Anything you want us to know about your order..."
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-2xl font-semibold text-slate-900">Live pricing</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your total updates automatically as you customize your order.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Product</p>
                <p className="mt-1 font-semibold text-slate-900">{productName}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Specs</p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {quantity} • {paper} • {finish} • {sides}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
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
                    <span className="text-base font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="text-3xl font-bold text-slate-900">
                      {formatPrice(pricing.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  What happens next
                </p>
                <ul className="mt-3 space-y-2 text-sm text-blue-900">
                  <li>• Review your live pricing</li>
                  <li>• Continue to secure payment</li>
                  <li>• We receive your artwork and order details</li>
                  <li>• Track your status online after purchase</li>
                </ul>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full rounded-2xl bg-blue-600 px-4 py-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}