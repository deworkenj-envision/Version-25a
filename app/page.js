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

  const [size, setSize] = useState(current.sizes[0]);
  const [paper, setPaper] = useState(current.papers[0]);
  const [finish, setFinish] = useState(current.finishes[0]);
  const [sides, setSides] = useState(current.sides[0]);
  const [quantity, setQuantity] = useState(current.quantities[0]);

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

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-[30px] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-2xl md:p-10">

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">

            {/* LEFT SIDE */}
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                <span className="block">Top Quality Printing.</span>
                <span className="mt-2 block">Fast Turnaround.</span>
                <span className="mt-2 block">The Best Prices.</span>
              </h1>

              <div className="mt-12 flex flex-col items-center lg:items-start">
                <p className="text-lg md:text-xl font-semibold text-white text-center lg:text-left">
                  Already placed an order? Track it here:
                </p>

                <Link
                  href="/track"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-neutral-900"
                >
                  Track Your Order
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[560px] space-y-8">

                {/* LOGO */}
                <div className="overflow-hidden rounded-[36px] bg-white/10 p-2 shadow-2xl backdrop-blur-md">
                  <div className="overflow-hidden rounded-[28px]">
                    <img
                      src="/images/logo-hero.png"
                      alt="logo"
                      className="h-[180px] w-full scale-115 object-cover"
                    />
                  </div>
                </div>

                {/* COLLAGE */}
                <div className="overflow-hidden rounded-[36px] bg-white/10 p-2 shadow-2xl backdrop-blur-md">
                  <div className="overflow-hidden rounded-[28px]">
                    <img
                      src="/images/hero_desktop.webp"
                      alt="collage"
                      className="h-[340px] w-full object-cover"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ORDER + ESTIMATE */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* ORDER */}
          <div className="bg-white p-6 rounded-[28px] shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Build your order</h2>

            <div className="grid grid-cols-2 gap-4">
              {[["Product", productNames, product, handleProductChange],
                ["Size", current.sizes, size, setSize],
                ["Paper", current.papers, paper, setPaper],
                ["Finish", current.finishes, finish, setFinish],
                ["Sides", current.sides, sides, setSides],
                ["Quantity", current.quantities, quantity, setQuantity]
              ].map(([label, options, value, setter]) => (
                <div key={label}>
                  <label className="text-sm font-medium">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full mt-1 p-3 border rounded-xl"
                  >
                    {options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/order" className="bg-blue-600 text-white px-6 py-3 rounded-full">
                Continue Order
              </Link>
              <Link href="/pricing" className="border px-6 py-3 rounded-full">
                Pricing
              </Link>
            </div>
          </div>

          {/* ESTIMATE */}
          <div className="bg-white p-6 rounded-[28px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">{product}</h3>

            <div className="space-y-2">
              <div>Size: {size}</div>
              <div>Paper: {paper}</div>
              <div>Finish: {finish}</div>
              <div>Sides: {sides}</div>
              <div>Qty: {quantity}</div>
            </div>

            <div className="mt-6 text-3xl font-bold">
              ${estimatedTotal.toFixed(2)}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}