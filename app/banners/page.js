"use client";

import { useState } from "react";

export default function BannersPage() {
  const SIZE_OPTIONS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    12, 14, 16, 18, 20,
  ];

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
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Custom Vinyl Banner Printing
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            High-quality custom vinyl banners printed in full color
            on durable 13oz matte vinyl material.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <img
                src="/banner-sample.jpg"
                alt="Custom Vinyl Banner"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">
              Vinyl Banner Calculator
            </h2>

            <div className="mb-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>✔ 13oz Matte Vinyl</li>
                <li>✔ Full Color 1-Sided Printing</li>
                <li>✔ Sew Hem Included</li>
                <li>✔ Grommets Every 2 Feet</li>
                <li>✔ Indoor & Outdoor Use</li>
              </ul>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* WIDTH */}
              <div>
                <label className="mb-1 block font-medium">
                  Width (In Feet)
                </label>

                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* HEIGHT */}
              <div>
                <label className="mb-1 block font-medium">
                  Height (In Feet)
                </label>

                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* QUANTITY */}
              <div>
                <label className="mb-1 block font-medium">
                  Quantity
                </label>

                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {[1, 2, 3, 4, 5, 10].map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              {/* RUSH SHIPPING */}
              <div className="flex items-end">
                <label className="flex w-full items-center gap-2 rounded-lg border px-3 py-2">
                  <input
                    type="checkbox"
                    checked={rushShipping}
                    onChange={(e) =>
                      setRushShipping(e.target.checked)
                    }
                  />

                  Rush Shipping (+$25)
                </label>
              </div>
            </div>

            {/* PRICING */}
            <div className="mt-6 rounded-xl border bg-gray-50 p-4">
              <div className="mb-2 flex justify-between">
                <span>Square Feet</span>
                <strong>{squareFeet} sq ft</strong>
              </div>

              <div className="mb-2 flex justify-between">
                <span>Price Per Sq Ft</span>
                <strong>$2.75</strong>
              </div>

              <div className="mb-2 flex justify-between">
                <span>Banner Price</span>
                <strong>
                  ${bannerSubtotal.toFixed(2)}
                </strong>
              </div>

              <div className="mb-2 flex justify-between">
                <span>Shipping</span>
                <strong>
                  ${shipping.toFixed(2)}
                </strong>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>

                  <span>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* ORDER BUTTON */}
            <button className="mt-6 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700">
              Order Now
            </button>
          </div>
        </div>

        {/* SEO CONTENT */}
        <section className="mt-16 rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">
            Custom Banner Printing
          </h2>

          <p className="mb-4 text-gray-700">
            EnVision Direct offers high-quality custom vinyl banner
            printing with fast turnaround and nationwide shipping.
            Our banners are printed in full color on durable
            13oz matte vinyl material and include sewn hems and
            grommets every 2 feet.
          </p>

          <p className="text-gray-700">
            Perfect for trade shows, storefronts, events,
            grand openings, birthdays, outdoor advertising,
            and promotional displays.
          </p>
        </section>
      </section>
    </main>
  );
}