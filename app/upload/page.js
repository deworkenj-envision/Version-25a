"use client";

import { useMemo, useState } from "react";

const productOptions = [
  {
    name: "Business Cards",
    badge: "Best Seller",
    size: "3.5 x 2 in",
    description: "Perfect for networking, storefronts, and service businesses.",
    price: "$54",
    sizes: ["3.5 x 2 in"],
    papers: ["14pt Matte", "16pt Gloss", "16pt Soft Touch"],
    finishes: ["Matte", "Gloss", "Soft Touch", "UV Coated"],
    sides: ["Front Only", "Front and Back"],
  },
  {
    name: "Flyers",
    badge: "Promo Ready",
    size: "8.5 x 11 in",
    description: "Great for events, menus, promotions, and handouts.",
    price: "$79",
    sizes: ["8.5 x 11 in", "5.5 x 8.5 in", "11 x 17 in"],
    papers: ["100lb Gloss Text", "100lb Matte Text", "14pt Cover"],
    finishes: ["Gloss", "Matte", "No Coating"],
    sides: ["Front Only", "Front and Back"],
  },
  {
    name: "Banners",
    badge: "Large Format",
    size: "6 x 3 ft",
    description: "Ideal for storefronts, events, and temporary signage.",
    price: "$129",
    sizes: ["2 x 4 ft", "3 x 6 ft", "4 x 8 ft", "6 x 3 ft"],
    papers: ["13oz Vinyl", "15oz Heavy Duty Vinyl", "Mesh Banner"],
    finishes: ["Hemmed", "Grommets", "Pole Pockets"],
    sides: ["Single Sided"],
  },
  {
    name: "Postcards",
    badge: "Direct Mail",
    size: "6 x 4 in",
    description: "Built for local marketing, promotions, and announcements.",
    price: "$69",
    sizes: ["4 x 6 in", "5 x 7 in", "6 x 9 in"],
    papers: ["14pt Matte", "16pt Gloss", "16pt AQ"],
    finishes: ["Matte", "Gloss", "AQ Coated", "UV Coated"],
    sides: ["Front Only", "Front and Back"],
  },
];

export default function UploadsPage() {
  const [selectedProduct, setSelectedProduct] = useState("Business Cards");
  const [quantity, setQuantity] = useState("500");
  const [fileName, setFileName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const currentProduct = useMemo(() => {
    return (
      productOptions.find((item) => item.name === selectedProduct) ||
      productOptions[0]
    );
  }, [selectedProduct]);

  const [size, setSize] = useState(currentProduct.sizes[0]);
  const [paper, setPaper] = useState(currentProduct.papers[0]);
  const [finish, setFinish] = useState(currentProduct.finishes[0]);
  const [sides, setSides] = useState(currentProduct.sides[0]);

  function handleProductChange(productName) {
    const product =
      productOptions.find((item) => item.name === productName) ||
      productOptions[0];

    setSelectedProduct(product.name);
    setSize(product.sizes[0]);
    setPaper(product.papers[0]);
    setFinish(product.finishes[0]);
    setSides(product.sides[0]);
  }

  function handlePlaceOrder() {
    if (!contactName.trim()) {
      alert("Please enter your contact name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!fileName.trim()) {
      alert("Please upload your artwork file.");
      return;
    }

    const fakeOrderNumber = `PL-${Date.now().toString().slice(-6)}`;
    const target = `/order-success?order=${fakeOrderNumber}&product=${encodeURIComponent(
      selectedProduct
    )}&qty=${encodeURIComponent(quantity)}`;

    window.location.href = target;
  }

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
              Choose your product, select your print options, upload your artwork,
              and place your order.
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
                  Pick the print item you need, then configure the order.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {productOptions.map((item) => {
                  const active = selectedProduct === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleProductChange(item.name)}
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
                        <span className="text-sm text-slate-500">{item.size}</span>
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
                  Choose print details
                </h2>
                <p className="mt-2 text-slate-600">
                  Select the size, paper, finish, sides, and quantity for your order.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.sizes.map((option) => (
                    <option key={option} value={option}>
                      Size: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.papers.map((option) => (
                    <option key={option} value={option}>
                      Paper: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.finishes.map((option) => (
                    <option key={option} value={option}>
                      Finish: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={sides}
                  onChange={(e) => setSides(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                >
                  {currentProduct.sides.map((option) => (
                    <option key={option} value={option}>
                      Sides: {option}
                    </option>
                  ))}
                </select>

                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2"
                >
                  <option value="250">Quantity: 250</option>
                  <option value="500">Quantity: 500</option>
                  <option value="1000">Quantity: 1000</option>
                  <option value="2500">Quantity: 2500</option>
                </select>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 3
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Upload print-ready artwork
                </h2>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-blue-700"
                />

                <p className="mt-4 text-sm text-slate-500">
                  {fileName ? `Selected file: ${fileName}` : "Choose a file to continue."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Step 4
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Customer details
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Contact name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
                <textarea
                  placeholder="Special instructions"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Place Order
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
                Order summary
              </h2>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Product</span>
                  <span className="font-semibold text-slate-900">{currentProduct.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Size</span>
                  <span className="font-semibold text-slate-900">{size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paper</span>
                  <span className="font-semibold text-slate-900">{paper}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Finish</span>
                  <span className="font-semibold text-slate-900">{finish}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sides</span>
                  <span className="font-semibold text-slate-900">{sides}</span>
                </div>
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
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}