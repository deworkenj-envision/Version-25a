"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCT_OPTIONS, calculatePrice, formatPrice } from "../../lib/pricing";

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

            {/* PRODUCT OPTIONS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Product options</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <select value={productName} onChange={(e) => setProductName(e.target.value)} className="input">
                  {Object.keys(PRODUCT_OPTIONS).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>

                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="input">
                  {options.quantities.map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>

                <select value={paper} onChange={(e) => setPaper(e.target.value)} className="input">
                  {options.papers.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>

                <select value={finish} onChange={(e) => setFinish(e.target.value)} className="input">
                  {options.finishes.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>

                <select value={sides} onChange={(e) => setSides(e.target.value)} className="input md:col-span-2">
                  {options.sides.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

              </div>
            </div>

            {/* CUSTOMER */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Customer info</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <input placeholder="Full name" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} className="input" required />
                <input placeholder="Email" value={customerEmail} onChange={(e)=>setCustomerEmail(e.target.value)} className="input" required />

                <input type="file" onChange={(e)=>setSelectedFile(e.target.files?.[0])} className="input md:col-span-2"/>

                <textarea placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} className="input md:col-span-2"/>

              </div>
            </div>

          </div>

          {/* SUMMARY */}
          <aside className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-3">
              <div>Subtotal: {formatPrice(pricing.subtotal)}</div>
              <div>Shipping: {formatPrice(pricing.shipping)}</div>
              <div className="text-xl font-bold">Total: {formatPrice(pricing.total)}</div>
            </div>

            {error && <div className="text-red-600 mt-4">{error}</div>}

            <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl">
              {submitting ? "Processing..." : "Continue to Payment"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}