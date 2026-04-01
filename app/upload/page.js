"use client";

import { useMemo, useState } from "react";

const productOptions = [
  {
    name: "Business Cards",
    badge: "Best Seller",
    size: "3.5 x 2 in",
    description:
      "Perfect for networking, storefronts, and service businesses.",
    price: "$54",
  },
  {
    name: "Flyers",
    badge: "Promo Ready",
    size: "8.5 x 11 in",
    description: "Great for events, menus, promotions, and handouts.",
    price: "$79",
  },
  {
    name: "Banners",
    badge: "Large Format",
    size: "6 x 3 ft",
    description: "Ideal for storefronts, events, and temporary signage.",
    price: "$129",
  },
  {
    name: "Postcards",
    badge: "Direct Mail",
    size: "6 x 4 in",
    description: "Built for local marketing, promotions, and announcements.",
    price: "$69",
  },
];

export default function UploadPage() {
  const [selectedProduct, setSelectedProduct] = useState("Business Cards");
  const [quantity, setQuantity] = useState("500");
  const [fileName, setFileName] = useState("");

  const currentProduct = useMemo(() => {
    return (
      productOptions.find((item) => item.name === selectedProduct) ||
      productOptions[0]
    );
  }, [selectedProduct]);

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
              Choose your product, upload your print-ready file, and move
              quickly to checkout with a cleaner premium ordering flow.
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
                <p className="mt-2 text-slate-600">
                  Pick the print item you need, then continue to the order form.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {productOptions.map((item) => {
                  const active = selectedProduct === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedProduct(item.name)}
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
                        <span className="text-sm text-slate-500">
                          {item.size}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                      <div className="mt-4 text-lg font-bold text-slate-900">
                        Starting at {item.price}
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
                  Upload print-ready artwork
                </h2>
                <p className="mt-2 text-slate-600">
                  Accepted file types: PDF, PNG, JPG, SVG.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Upload your finished design
                </h3>
                <p className="mt-2 text-slate-600">
                  Designed for customers who already have a file ready to print.
                </p>

                <div className="mt-5">
                  <input
                    type="file"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name || "")
                    }
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-blue-700"
                  />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {fileName ? `Selected file: ${fileName}` : "Choose a file to continue."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 3
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Order details
                </h2>
                <p className="mt-2 text-slate-600">
                  Only the fields customers need to complete the order.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Contact name"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0 transition focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-0 transition focus:border-blue-500"
                />
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  {productOptions.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2500">2500</option>
                </select>
                <textarea
                  placeholder="Special instructions, finishing notes, or delivery details"
                  rows={4}
                  className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Save Draft
                </button>
                <button className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Load Draft
                </button>
                <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                  Continue to Checkout
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
                A clearer order summary
              </h2>
              <p className="mt-2 text-slate-600">
                Show visitors the product, file status, and job details in one
                place.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-slate-900">
                      {currentProduct.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {currentProduct.badge} • {currentProduct.size}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Starting at</div>
                    <div className="text-xl font-bold text-slate-900">
                      {currentProduct.price}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
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
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Order status</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Awaiting checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <h3 className="text-xl font-bold">Need help before ordering?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Contact us if you want help choosing sizes, finishes, or checking
                your artwork before checkout.
              </p>
              <a
                href="/contact"
                className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Contact Support
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}