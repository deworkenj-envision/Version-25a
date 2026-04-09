"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const products = {
  "Postcards - Digital": {
    productName: "Postcards",
    sizes: ["4 x 6", "5 x 7", "5.5 x 8.5", "6 x 9", "8.5 x 11"],
    trimSizes: ["4 x 6", "5 x 7", "5.5 x 8.5", "6 x 9", "8.5 x 11"],
    papers: [
      "14pt C2S (Gloss Cover)",
      "16pt C2S",
      "14pt Matte Cover",
      "16pt Matte Cover",
    ],
    colors: [
      "4/4 (Full Color Both Sides)",
      "4/0 (Full Color Front Only)",
      "1/1 (Black Both Sides)",
    ],
    coatings: ["No Coating", "Gloss UV Front", "AQ Both Sides", "Matte Finish"],
    turnarounds: ["1-2 Day", "2-4 Day", "4-6 Day"],
    bundling: ["No Bundling", "Bundle in 25s", "Bundle in 50s"],
    quantities: [100, 250, 500, 1000, 2500],
    versions: [1, 2, 3, 4],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    description:
      "Postcards are a strong option for promotions, handouts, direct mail, and event marketing.",
  },
  "Business Cards - Digital": {
    productName: "Business Cards",
    sizes: ["3.5 x 2", "2 x 3.5 Vertical"],
    trimSizes: ["3.5 x 2", "2 x 3.5 Vertical"],
    papers: [
      "16pt C2S",
      "14pt C2S",
      "16pt Matte",
      "14pt Uncoated",
    ],
    colors: [
      "4/4 (Full Color Both Sides)",
      "4/0 (Full Color Front Only)",
      "1/1 (Black Both Sides)",
    ],
    coatings: ["No Coating", "Gloss UV Front", "Soft Touch", "Matte Finish"],
    turnarounds: ["1-2 Day", "2-4 Day", "4-6 Day"],
    bundling: ["No Bundling", "Bundle in 50s", "Bundle in 100s"],
    quantities: [250, 500, 1000, 2500, 5000],
    versions: [1, 2, 3],
    image:
      "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=1400&q=80",
    description:
      "Business cards are ideal for networking, handouts, appointments, and everyday customer contact.",
  },
  "Flyers - Digital": {
    productName: "Flyers",
    sizes: ["4 x 6", "5.5 x 8.5", "8.5 x 11", "11 x 17"],
    trimSizes: ["4 x 6", "5.5 x 8.5", "8.5 x 11", "11 x 17"],
    papers: ["100lb Gloss Text", "100lb Gloss Cover", "80lb Uncoated"],
    colors: [
      "4/4 (Full Color Both Sides)",
      "4/0 (Full Color Front Only)",
      "1/0 (Black Front Only)",
    ],
    coatings: ["No Coating", "AQ Front", "AQ Both Sides"],
    turnarounds: ["1-2 Day", "2-4 Day", "4-6 Day"],
    bundling: ["No Bundling", "Bundle in 50s", "Bundle in 100s"],
    quantities: [100, 250, 500, 1000, 2500],
    versions: [1, 2, 3],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Flyers are useful for promotions, menus, sales sheets, event marketing, and everyday advertising.",
  },
};

function Field({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-bold text-black">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded border border-[#8b8b8b] bg-[#e9e9ee] px-3 text-[14px] text-black outline-none"
      >
        {options.map((option) => (
          <option key={String(option)} value={String(option)}>
            {String(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function HomePage() {
  const productKeys = Object.keys(products);
  const [selectedProduct, setSelectedProduct] = useState(productKeys[0]);

  const product = products[selectedProduct];

  const [size, setSize] = useState(product.sizes[0]);
  const [trimSize, setTrimSize] = useState(product.trimSizes[0]);
  const [paper, setPaper] = useState(product.papers[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [coating, setCoating] = useState(product.coatings[0]);
  const [turnaround, setTurnaround] = useState(product.turnarounds[0]);
  const [bundling, setBundling] = useState(product.bundling[0]);
  const [quantity, setQuantity] = useState(String(product.quantities[1] || product.quantities[0]));
  const [versions, setVersions] = useState(String(product.versions[0]));

  function handleProductChange(nextProductKey) {
    const next = products[nextProductKey];
    setSelectedProduct(nextProductKey);
    setSize(next.sizes[0]);
    setTrimSize(next.trimSizes[0]);
    setPaper(next.papers[0]);
    setColor(next.colors[0]);
    setCoating(next.coatings[0]);
    setTurnaround(next.turnarounds[0]);
    setBundling(next.bundling[0]);
    setQuantity(String(next.quantities[1] || next.quantities[0]));
    setVersions(String(next.versions[0]));
  }

  const pricing = useMemo(() => {
    let base = 0;

    if (product.productName === "Postcards") base = 0.26;
    if (product.productName === "Business Cards") base = 0.11;
    if (product.productName === "Flyers") base = 0.18;

    const qty = Number(quantity);
    const ver = Number(versions);

    let paperAdj = 0;
    if (paper.includes("16pt")) paperAdj += 0.03;
    if (paper.includes("Matte")) paperAdj += 0.015;
    if (paper.includes("Gloss Cover")) paperAdj += 0.02;

    let coatingAdj = 0;
    if (coating.includes("Gloss UV")) coatingAdj += 0.03;
    if (coating.includes("Soft Touch")) coatingAdj += 0.05;
    if (coating.includes("AQ")) coatingAdj += 0.02;
    if (coating === "No Coating") coatingAdj += 0;

    let turnaroundAdj = 0;
    if (turnaround === "1-2 Day") turnaroundAdj += 0.04;
    if (turnaround === "2-4 Day") turnaroundAdj += 0.02;

    let sideAdj = 0;
    if (color.includes("4/4")) sideAdj += 0.03;
    if (color.includes("4/0")) sideAdj += 0.015;

    let versionAdj = (ver - 1) * 0.01;

    let unitPrice = base + paperAdj + coatingAdj + turnaroundAdj + sideAdj + versionAdj;

    if (qty >= 1000) unitPrice *= 0.8;
    else if (qty >= 500) unitPrice *= 0.88;
    else if (qty >= 250) unitPrice *= 0.95;

    const printingTotal = unitPrice * qty;
    const rewardPoints = Math.round(printingTotal);

    return {
      unitPrice,
      printingTotal,
      rewardPoints,
    };
  }, [product, quantity, versions, paper, coating, turnaround, color]);

  return (
    <main className="min-h-screen bg-[#f3f4f7] text-black">
      <section className="border-b border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
          <div>
            <div className="text-2xl font-extrabold">EnVision Direct</div>
            <div className="text-sm text-gray-600">Online print ordering</div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/order"
              className="rounded-md border border-black bg-white px-4 py-2 text-sm font-bold hover:bg-gray-100"
            >
              Order
            </Link>
            <Link
              href="/track"
              className="rounded-md border border-black bg-[#0b7fd1] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
            >
              Track
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded border border-[#b9b9b9] bg-white shadow-sm">
            <div className="border-b border-[#cfcfcf] bg-[#f5f5f5] px-6 py-5">
              <p className="text-sm font-bold uppercase tracking-wide text-[#0b7fd1]">
                4-Color Digital Printing
              </p>
              <h1 className="mt-2 text-3xl font-bold">{product.productName}</h1>
            </div>

            <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
              <div className="border-b border-r border-[#d2d2d2] bg-[#f7f7f7] p-6 md:border-b-0">
                <div className="mb-4 flex justify-end">
                  <Link
                    href="/order"
                    className="inline-flex items-center gap-2 rounded border border-[#b7b7b7] bg-[#f0f0f0] px-4 py-2 text-sm font-bold hover:bg-[#e5e5e5]"
                  >
                    Upload File
                  </Link>
                </div>

                <div className="overflow-hidden rounded border border-[#c5c5c5] bg-white">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="h-[260px] w-full object-cover"
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="border-b border-[#d8d8d8] pb-4">
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    {["Info", "Size", "Paper", "Color", "Coating", "Turnaround", "Quantity", "File Setup"].map(
                      (tab) => (
                        <span
                          key={tab}
                          className={`rounded border px-3 py-2 ${
                            tab === "Info"
                              ? "border-[#0b7fd1] bg-[#dff1ff] text-[#0b7fd1]"
                              : "border-[#c8c8c8] bg-[#f3f3f3] text-gray-700"
                          }`}
                        >
                          {tab}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[170px_1fr]">
                  <div className="space-y-3">
                    {["Description", "Recommendations", "Marketing Tips", "Versions"].map((item, index) => (
                      <div
                        key={item}
                        className={`px-4 py-3 text-sm font-bold ${
                          index === 0
                            ? "bg-[#3aa6df] text-white"
                            : "bg-[#dfeaf1] text-[#42515a]"
                        }`}
                        style={{
                          clipPath:
                            "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%, 0 0)",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#0b7fd1]">Description</h2>
                    <p className="mt-3 text-sm leading-6 text-gray-700">
                      {product.description}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-700">
                      Choose your size, paper, color, coating, turnaround, and quantity from
                      the calculator on the right to begin the order.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#d2d2d2] bg-[#f5f5f5] px-6 py-5">
              <h3 className="text-2xl font-bold text-[#0b7fd1]">Other Related Products</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {["Postcards w/ Mailing", "Digital Rack Cards", "Digital Tear Cards", "Digital Club Flyers"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded border border-[#c6c6c6] bg-white p-4 text-center text-sm font-bold"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <aside className="self-start rounded border border-[#9a9a9a] bg-[#d7d7dc] shadow-sm">
            <div className="border-b border-[#b6b6b6] bg-[linear-gradient(#f4f4f4,#d9d9de)] px-3 py-3 text-center">
              <div className="text-[16px] font-medium text-[#0b7fd1]">Pricing Calculator</div>
            </div>

            <div className="border-b border-[#b6b6b6] bg-[#efefef] px-3 py-3 text-[15px]">
              {selectedProduct}
            </div>

            <div className="space-y-3 px-3 py-3">
              <Field
                label="Product"
                value={selectedProduct}
                onChange={(e) => handleProductChange(e.target.value)}
                options={productKeys}
              />

              <Field
                label="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                options={product.sizes}
              />

              <div>
                <label className="mb-1 block text-[13px] font-bold text-black">
                  Any Trim Size <span className="font-normal">(Edit Size Below)</span>
                </label>
                <input
                  value={trimSize}
                  onChange={(e) => setTrimSize(e.target.value)}
                  className="h-10 w-full rounded border border-[#8b8b8b] bg-[#e9e9ee] px-3 text-[14px] text-black outline-none"
                />
              </div>

              <Field
                label="Paper"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                options={product.papers}
              />

              <Field
                label="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                options={product.colors}
              />

              <Field
                label="Coating"
                value={coating}
                onChange={(e) => setCoating(e.target.value)}
                options={product.coatings}
              />

              <Field
                label="Turnaround"
                value={turnaround}
                onChange={(e) => setTurnaround(e.target.value)}
                options={product.turnarounds}
              />

              <Field
                label="Bundle in Sets"
                value={bundling}
                onChange={(e) => setBundling(e.target.value)}
                options={product.bundling}
              />

              <Field
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                options={product.quantities.map(String)}
              />

              <Field
                label="Versions"
                value={versions}
                onChange={(e) => setVersions(e.target.value)}
                options={product.versions.map(String)}
              />

              <div className="rounded border border-[#c4c16a] bg-[#f2ef99] px-3 py-3 text-[15px]">
                <div className="flex items-center justify-between font-bold">
                  <span>Printing Total</span>
                  <span>${pricing.printingTotal.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between font-bold">
                  <span>Unit Price</span>
                  <span>${pricing.unitPrice.toFixed(3)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded border border-[#8b8b8b] bg-[#d3d3d6] px-3 py-2 text-[15px]">
                <span>Reward Points</span>
                <span className="font-bold">{pricing.rewardPoints}</span>
              </div>

              <Link
                href={`/order?product=${encodeURIComponent(product.productName)}`}
                className="block rounded-md border border-[#0068ab] bg-[linear-gradient(#21a2ea,#0b7fd1)] px-4 py-3 text-center text-[16px] font-bold text-white hover:opacity-95"
              >
                Place Order
              </Link>

              <div className="text-right text-[13px] text-gray-700">Print Estimate</div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}