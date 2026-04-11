"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PRODUCT_OPTIONS = {
  "Business Cards": {
    sizes: ["2 x 3.5"],
    papers: ["Standard", "Premium", "Linen"],
    finishes: ["Matte", "Gloss", "Soft Touch"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100, 250, 500, 1000],
  },
  Postcards: {
    sizes: ["4 x 6", "5 x 7", "6 x 9"],
    papers: ["Standard", "Premium"],
    finishes: ["Matte", "Gloss", "UV"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100, 250, 500, 1000],
  },
  Flyers: {
    sizes: ["4 x 6", "5.5 x 8.5", "8.5 x 11"],
    papers: ["Standard", "Premium"],
    finishes: ["Matte", "Gloss"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100, 250, 500, 1000, 2500],
  },
  Brochures: {
    sizes: ["8.5 x 11", "8.5 x 14", "11 x 17"],
    papers: ["Standard", "Premium"],
    finishes: ["Matte", "Gloss"],
    sides: ["Front and Back"],
    quantities: [100, 250, 500, 1000],
  },
  Banners: {
    sizes: ["2 x 4 ft", "3 x 6 ft", "4 x 8 ft"],
    papers: ["13 oz Vinyl", "15 oz Vinyl", "Mesh"],
    finishes: ["Standard"],
    sides: ["Front Only"],
    quantities: [1, 2, 5, 10],
  },
  "Yard Signs": {
    sizes: ['18" x 24"', '24" x 36"'],
    papers: ["4mm Coroplast", "6mm Coroplast"],
    finishes: ["Standard"],
    sides: ["Front Only", "Front and Back"],
    quantities: [1, 5, 10, 25, 50],
  },
  Menus: {
    sizes: ["8.5 x 11", "8.5 x 14", "11 x 17"],
    papers: ["Standard", "Premium", "Laminated"],
    finishes: ["Matte", "Gloss"],
    sides: ["Front Only", "Front and Back"],
    quantities: [50, 100, 250, 500],
  },
  "Rack Cards": {
    sizes: ["4 x 9"],
    papers: ["Standard", "Premium"],
    finishes: ["Matte", "Gloss", "UV"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100, 250, 500, 1000],
  },
};

function estimatePrice(product, quantity) {
  const qty = Number(quantity || 0);

  const baseMap = {
    "Business Cards": 24.99,
    Postcards: 34.99,
    Flyers: 39.99,
    Brochures: 79.99,
    Banners: 49.99,
    "Yard Signs": 19.99,
    Menus: 44.99,
    "Rack Cards": 32.99,
  };

  const unitMap = {
    "Business Cards": 0.08,
    Postcards: 0.12,
    Flyers: 0.1,
    Brochures: 0.22,
    Banners: 12,
    "Yard Signs": 8,
    Menus: 0.14,
    "Rack Cards": 0.11,
  };

  const base = baseMap[product] ?? 25;
  const unit = unitMap[product] ?? 0.1;

  if (!qty) return base;
  return base + qty * unit;
}

export default function OrderPage() {
  const searchParams = useSearchParams();
  const productNames = Object.keys(PRODUCT_OPTIONS);

  const [product, setProduct] = useState("Business Cards");
  const current = useMemo(() => PRODUCT_OPTIONS[product], [product]);

  const [size, setSize] = useState(PRODUCT_OPTIONS["Business Cards"].sizes[0]);
  const [paper, setPaper] = useState(PRODUCT_OPTIONS["Business Cards"].papers[0]);
  const [finish, setFinish] = useState(PRODUCT_OPTIONS["Business Cards"].finishes[0]);
  const [sides, setSides] = useState(PRODUCT_OPTIONS["Business Cards"].sides[0]);
  const [quantity, setQuantity] = useState(PRODUCT_OPTIONS["Business Cards"].quantities[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const qpProduct = searchParams.get("product");
    const nextProduct = PRODUCT_OPTIONS[qpProduct] ? qpProduct : "Business Cards";
    const nextConfig = PRODUCT_OPTIONS[nextProduct];

    const qpSize = searchParams.get("size");
    const qpPaper = searchParams.get("paper");
    const qpFinish = searchParams.get("finish");
    const qpSides = searchParams.get("sides");
    const qpQuantity = searchParams.get("quantity");

    setProduct(nextProduct);
    setSize(nextConfig.sizes.includes(qpSize) ? qpSize : nextConfig.sizes[0]);
    setPaper(nextConfig.papers.includes(qpPaper) ? qpPaper : nextConfig.papers[0]);
    setFinish(nextConfig.finishes.includes(qpFinish) ? qpFinish : nextConfig.finishes[0]);
    setSides(nextConfig.sides.includes(qpSides) ? qpSides : nextConfig.sides[0]);
    setQuantity(
      nextConfig.quantities.map(String).includes(String(qpQuantity))
        ? Number(qpQuantity)
        : nextConfig.quantities[0]
    );
  }, [searchParams]);

  function handleProductChange(nextProduct) {
    const next = PRODUCT_OPTIONS[nextProduct];
    setProduct(nextProduct);
    setSize(next.sizes[0]);
    setPaper(next.papers[0]);
    setFinish(next.finishes[0]);
    setSides(next.sides[0]);
    setQuantity(next.quantities[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      alert("Selections carried over successfully. Your order form is ready.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const estimatedTotal = estimatePrice(product, quantity);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 rounded-[30px] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-2xl md:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
                Order Form
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                Complete your print order
              </h1>
              <p className="mt-3 max-w-2xl text-white/90">
                Your homepage selections have been carried over. Review them below, add your details,
                and continue with your order.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-slate-100"
            >
              Back to Homepage
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] bg-white p-6 shadow-lg ring-1 ring-slate-200 md:p-8"
          >
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Order Details
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Review and customize
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Adjust any options below before moving to checkout and artwork upload.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product
                </label>
                <select
                  value={product}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {productNames.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {current.sizes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Paper / Material
                </label>
                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {current.papers.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Finish
                </label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {current.finishes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Sides
                </label>
                <select
                  value={sides}
                  onChange={(e) => setSides(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {current.sides.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {current.quantities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Artwork File
              </label>
              <input
                type="file"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
              />
              {fileName ? (
                <p className="mt-2 text-sm text-slate-600">Selected file: {fileName}</p>
              ) : null}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add any special instructions here"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Order Details"}
              </button>

              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                View Pricing
              </Link>
            </div>
          </form>

          <div className="rounded-[28px] bg-white p-6 shadow-lg ring-1 ring-slate-200 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Live Summary
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{product}</h3>

            <div className="mt-6 space-y-4 rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Size</span>
                <span className="text-right font-semibold text-slate-900">{size}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Paper / Material</span>
                <span className="text-right font-semibold text-slate-900">{paper}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Finish</span>
                <span className="text-right font-semibold text-slate-900">{finish}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Sides</span>
                <span className="text-right font-semibold text-slate-900">{sides}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Quantity</span>
                <span className="text-right font-semibold text-slate-900">{quantity}</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-slate-600">Estimated starting price</span>
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-blue-50 p-5 ring-1 ring-blue-100">
              <h4 className="text-lg font-semibold text-slate-900">What happens next</h4>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                  Review your options
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                  Upload print-ready artwork
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                  Continue to checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}