"use client";

import { useState } from "react";

export default function BannersPage() {
  const WIDTH_OPTIONS = Array.from({ length: 150 }, (_, i) => i + 1);
  const HEIGHT_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 1);

  const PRICE_PER_SQFT = 2.75;
  const BASE_SHIPPING = 15;
  const RUSH_FEE = 25;
  const SHIPPING_OVERAGE_START = 99;
  const SHIPPING_OVERAGE_RATE = 0.1;
  const SALES_TAX_RATE = 0.09;

  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(8);
  const [quantity, setQuantity] = useState(1);
  const [rushShipping, setRushShipping] = useState(false);

  const squareFeet = Number(width) * Number(height) * Number(quantity);
  const bannerSubtotal = squareFeet * PRICE_PER_SQFT;

  const shippingOverage =
    squareFeet > SHIPPING_OVERAGE_START
      ? (squareFeet - SHIPPING_OVERAGE_START) * SHIPPING_OVERAGE_RATE
      : 0;

  const shipping =
    BASE_SHIPPING +
    shippingOverage +
    (rushShipping ? RUSH_FEE : 0);

  const subtotal = bannerSubtotal + shipping;
  const salesTax = subtotal * SALES_TAX_RATE;
  const total = subtotal + salesTax;

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-center">
          <img
            src="/logo-hero.png"
            alt="EnVision Direct"
            className="mx-auto mb-6 h-32 w-auto object-contain"
          />

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
            Custom Vinyl Banner Printing
          </h1>

          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            High-quality full-color vinyl banners printed fast and shipped nationwide.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              {[
                "Weather Resistant",
                "Sewn Hem Included",
                "Grommets Every 2 Feet",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full bg-green-50 px-5 py-3 text-sm font-semibold text-green-800"
                >
                  ✔ {item}
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
              <div className="flex min-h-[420px] items-center justify-center bg-gray-100 p-8">
                <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <div className="bg-blue-900 px-8 py-10 text-center text-white">
                    <h2 className="mb-3 text-5xl font-extrabold">
                      Your Banner Here
                    </h2>

                    <p className="text-xl font-medium">
                      Full Color Custom Vinyl Banner
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-white px-8 py-8 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        High Quality
                      </div>
                      <div className="text-sm text-gray-600">
                        13oz Matte Vinyl
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        Full Color
                      </div>
                      <div className="text-sm text-gray-600">
                        Vibrant Printing
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        Durable
                      </div>
                      <div className="text-sm text-gray-600">
                        Indoor & Outdoor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-xl">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Vinyl Banner Calculator
            </h2>

            <p className="mb-6 text-gray-600">
              Choose your banner size in feet and get instant pricing.
            </p>

            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
              <h3 className="mb-3 font-bold text-green-800">
                Included With Every Banner
              </h3>

              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                <div>✔ 13oz Matte Vinyl</div>
                <div>✔ Grommets Every 2 Feet</div>
                <div>✔ Full Color 1-Sided Printing</div>
                <div>✔ Indoor & Outdoor Use</div>
                <div>✔ Sew Hem Included</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold">
                  Width (In Feet)
                </label>

                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                >
                  {WIDTH_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold">
                  Height (In Feet)
                </label>

                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                >
                  {HEIGHT_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold">
                  Quantity
                </label>

                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                >
                  {[1, 2, 3, 4, 5, 10].map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 font-semibold">
                  <input
                    type="checkbox"
                    checked={rushShipping}
                    onChange={(e) => setRushShipping(e.target.checked)}
                  />

                  Rush Shipping (+$25)
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border bg-gray-50 p-5">
              <div className="mb-3 flex justify-between">
                <span>Square Feet</span>
                <strong>{squareFeet} sq ft</strong>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Price Per Sq Ft</span>
                <strong>${PRICE_PER_SQFT.toFixed(2)}</strong>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Banner Price</span>
                <strong>${bannerSubtotal.toFixed(2)}</strong>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Shipping</span>
                <strong>${shipping.toFixed(2)}</strong>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Sales Tax (9%)</span>
                <strong>${salesTax.toFixed(2)}</strong>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>

                  <div className="text-right">
                    <div className="text-green-700">
                      ${total.toFixed(2)}
                    </div>

                    <div className="text-xs font-medium text-gray-500">
                      (Final price includes sales tax)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-green-700 px-6 py-5 text-xl font-bold text-white shadow-lg transition hover:bg-green-800">
              Order Now
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Standard shipping is $15. Orders over 99 sq ft add $0.10 per extra sq ft. Rush shipping adds $25.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}