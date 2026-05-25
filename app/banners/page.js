"use client";

import { useState } from "react";

export default function BannersPage() {
  const WIDTH_OPTIONS = Array.from(
    { length: 150 },
    (_, i) => i + 1
  );

  const HEIGHT_OPTIONS = Array.from(
    { length: 16 },
    (_, i) => i + 1
  );

  const PRICE_PER_SQFT = 2.75;
  const STANDARD_SHIPPING = 15;
  const RUSH_FEE = 25;

  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(8);
  const [quantity, setQuantity] = useState(1);
  const [rushShipping, setRushShipping] = useState(false);

  const squareFeet = Number(width) * Number(height);

  const bannerSubtotal =
    squareFeet *
    PRICE_PER_SQFT *
    Number(quantity);

  const shipping =
    STANDARD_SHIPPING +
    (rushShipping ? RUSH_FEE : 0);

  const total = bannerSubtotal + shipping;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src="/logo.png"
              alt="EnVision Direct"
              className="h-20 w-auto"
            />
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
            Custom Vinyl Banner Printing
          </h1>

          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            High-quality full-color vinyl banners printed fast and
            shipped nationwide.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Weather Resistant
            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Sewn Hem Included
            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Grommets Every 2 Feet
            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Fast Turnaround
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
              <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-green-50 to-white p-8">
                <div className="w-full max-w-xl rounded-2xl border-4 border-green-600 bg-white p-8 text-center shadow-lg">
                  <div className="mb-4 text-sm font-bold uppercase tracking-widest text-green-700">
                    EnVision Direct
                  </div>

                  <div className="mb-4 text-4xl font-extrabold text-gray-900">
                    Custom Vinyl Banners
                  </div>

                  <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-green-600" />

                  <p className="text-lg font-medium text-gray-700">
                    Durable. Weather Resistant. Full Color.
                  </p>

                  <p className="mt-4 text-sm text-gray-500">
                    13oz Matte Vinyl • Sewn Hem • Grommets Every 2 Feet
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  $2.75
                </div>
                <div className="text-sm text-gray-600">
                  Per Sq Ft
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  $15
                </div>
                <div className="text-sm text-gray-600">
                  Standard Shipping
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  +$25
                </div>
                <div className="text-sm text-gray-600">
                  Rush Shipping
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Vinyl Banner Calculator
            </h2>

            <p className="mb-6 text-gray-600">
              Choose your banner size in feet and get instant pricing.
            </p>

            <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-5 text-sm text-gray-700">
              <h3 className="mb-3 font-bold text-green-800">
                Included With Every Banner
              </h3>

              <ul className="space-y-2">
                <li>✔ 13oz Matte Vinyl</li>
                <li>✔ Full Color 1-Sided Printing</li>
                <li>✔ Sew Hem Included</li>
                <li>✔ Grommets Every 2 Feet</li>
                <li>✔ Indoor & Outdoor Use</li>
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-gray-800">
                  Width (In Feet)
                </label>

                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  {WIDTH_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-800">
                  Height (In Feet)
                </label>

                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  {HEIGHT_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-800">
                  Quantity
                </label>

                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  {[1, 2, 3, 4, 5, 10].map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex w-full items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={rushShipping}
                    onChange={(e) =>
                      setRushShipping(e.target.checked)
                    }
                  />

                  <span className="font-medium">
                    Rush Shipping (+$25)
                  </span>
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
                <strong>$2.75</strong>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Banner Price</span>
                <strong>${bannerSubtotal.toFixed(2)}</strong>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Shipping</span>
                <strong>${shipping.toFixed(2)}</strong>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-[1.02] hover:from-green-700 hover:to-green-600">
              Order Now
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Standard shipping is $15. Rush shipping adds $25.
            </p>
          </div>
        </div>

        <section className="mt-16 rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Custom Banner Printing
          </h2>

          <p className="mb-4 text-gray-700">
            EnVision Direct offers high-quality custom vinyl banner
            printing with fast turnaround and nationwide shipping.
            Our banners are printed in full color on durable 13oz
            matte vinyl material and include sewn hems and grommets
            every 2 feet.
          </p>

          <p className="text-gray-700">
            Perfect for trade shows, storefronts, events, grand
            openings, birthdays, outdoor advertising, and promotional
            displays.
          </p>
        </section>
      </section>
    </main>
  );
}