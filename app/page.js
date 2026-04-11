"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

export default function HomePage() {
  const productNames = Object.keys(PRODUCT_OPTIONS);
  const [product, setProduct] = useState("Business Cards");

  const current = useMemo(() => PRODUCT_OPTIONS[product], [product]);

  const [size, setSize] = useState(PRODUCT_OPTIONS["Business Cards"].sizes[0]);
  const [paper, setPaper] = useState(PRODUCT_OPTIONS["Business Cards"].papers[0]);
  const [finish, setFinish] = useState(PRODUCT_OPTIONS["Business Cards"].finishes[0]);
  const [sides, setSides] = useState(PRODUCT_OPTIONS["Business Cards"].sides[0]);
  const [quantity, setQuantity] = useState(PRODUCT_OPTIONS["Business Cards"].quantities[0]);

  function handleProductChange(nextProduct) {
    const next = PRODUCT_OPTIONS[nextProduct];
    setProduct(nextProduct);
    setSize(next.sizes[0]);
    setPaper(next.papers[0]);
    setFinish(next.finishes[0]);
    setSides(next.sides[0]);
    setQuantity(next.quantities[0]);
  }

  const estimatedTotal = estimatePrice(product, quantity);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-6 py-10 text-white shadow-2xl md:px-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Top Quality Printing
                <span className="mt-2 block">Best Prices. Fast Turnaround.</span>
              </h1>

              <div className="mt-6">
                <Link
                  href="/track"
                  className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-neutral-900"
                >
                  Track Your Order
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {productNames.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleProductChange(item)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold tracking-wide backdrop-blur-sm transition ${
                      product === item
                        ? "border-white bg-white text-blue-700 shadow-lg"
                        : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[520px] space-y-4">
                <div className="flex justify-center rounded-[24px] bg-white/12 p-5 shadow-2xl backdrop-blur-md">
                  <img
                    src="/logo.webp"
                    alt="EnVision Direct logo"
                    className="h-auto max-h-[110px] w-auto object-contain"
                  />
                </div>

                <div className="overflow-hidden rounded-[24px] bg-white/10 p-2 shadow-2xl backdrop-blur-md">
                  <img
                    src="/hero-collage.png"
                    alt="Printed products collage"
                    className="h-auto w-full rounded-[18px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-lg ring-1 ring-slate-200 md:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Start Your Order
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Build your print order
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Choose your product, select the options you want, and continue to the full order page.
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
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                >
                  {current.quantities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/order"
                className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Continue to Full Order Page
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-lg ring-1 ring-slate-200 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Quick Estimate
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
              <h4 className="text-lg font-semibold text-slate-900">Why order with us</h4>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                  Easy online ordering
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                  Upload print-ready artwork
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
                  Fast turnaround and tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}