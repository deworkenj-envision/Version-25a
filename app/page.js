"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PRODUCT_CONFIG = {
  postcards: {
    key: "postcards",
    label: "Postcards",
    pageTitle: "Digital Postcards",
    heroImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    description:
      "Postcards work well for promotions, direct mail, handouts, thank-you cards, and event marketing.",
    related: ["EDDM Postcards", "Rack Cards", "Club Flyers", "Tear Cards"],
    options: {
      size: ["4 x 6", "5 x 7", "5.5 x 8.5", "6 x 9", "8.5 x 11"],
      quantity: {
        "4 x 6": [100, 250, 500, 1000, 2500],
        "5 x 7": [100, 250, 500, 1000],
        "5.5 x 8.5": [100, 250, 500, 1000],
        "6 x 9": [100, 250, 500],
        "8.5 x 11": [100, 250, 500],
      },
      paper: {
        "4 x 6": ["14pt Gloss Cover", "16pt Matte Cover", "14pt Uncoated"],
        "5 x 7": ["14pt Gloss Cover", "16pt Matte Cover"],
        "5.5 x 8.5": ["14pt Gloss Cover", "16pt Matte Cover"],
        "6 x 9": ["14pt Gloss Cover", "16pt Matte Cover"],
        "8.5 x 11": ["100lb Gloss Cover", "100lb Matte Cover"],
      },
      color: {
        "14pt Gloss Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "16pt Matte Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "14pt Uncoated": ["4/4 Full Color Both Sides", "1/1 Black Both Sides"],
        "100lb Gloss Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "100lb Matte Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
      },
      coating: {
        "14pt Gloss Cover": ["No Coating", "Gloss UV Front", "AQ Both Sides"],
        "16pt Matte Cover": ["No Coating", "Soft Touch", "Matte Finish"],
        "14pt Uncoated": ["No Coating"],
        "100lb Gloss Cover": ["No Coating", "AQ Both Sides"],
        "100lb Matte Cover": ["No Coating", "Matte Finish"],
      },
      turnaround: {
        default: ["Standard 3-4 Business Days", "Rush 1-2 Business Days"],
      },
      bundling: {
        default: ["No Bundling", "Bundle in 25s", "Bundle in 50s"],
      },
      versions: {
        default: [1, 2, 3, 4],
      },
    },
  },

  businessCards: {
    key: "businessCards",
    label: "Business Cards",
    pageTitle: "Digital Business Cards",
    heroImage:
      "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=1400&q=80",
    description:
      "Business cards are ideal for networking, appointments, leave-behinds, and everyday customer contact.",
    related: ["Rounded Corner Cards", "Folded Cards", "Spot UV Cards", "Appointment Cards"],
    options: {
      size: ["3.5 x 2", "2 x 3.5 Vertical"],
      quantity: {
        "3.5 x 2": [250, 500, 1000, 2500, 5000],
        "2 x 3.5 Vertical": [250, 500, 1000, 2500],
      },
      paper: {
        "3.5 x 2": ["16pt Gloss Cover", "16pt Matte Cover", "14pt Uncoated"],
        "2 x 3.5 Vertical": ["16pt Gloss Cover", "16pt Matte Cover"],
      },
      color: {
        "16pt Gloss Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "16pt Matte Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "14pt Uncoated": ["4/4 Full Color Both Sides", "1/1 Black Both Sides"],
      },
      coating: {
        "16pt Gloss Cover": ["No Coating", "Gloss UV Front"],
        "16pt Matte Cover": ["No Coating", "Soft Touch"],
        "14pt Uncoated": ["No Coating"],
      },
      turnaround: {
        default: ["Standard 3-4 Business Days", "Rush 1-2 Business Days"],
      },
      bundling: {
        default: ["No Bundling", "Bundle in 50s", "Bundle in 100s"],
      },
      versions: {
        default: [1, 2, 3],
      },
    },
  },

  flyers: {
    key: "flyers",
    label: "Flyers",
    pageTitle: "Digital Flyers",
    heroImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Flyers are useful for sales, menus, promotions, event handouts, and local advertising.",
    related: ["Brochures", "Menus", "Sell Sheets", "Door Hangers"],
    options: {
      size: ["5.5 x 8.5", "8.5 x 11", "11 x 17"],
      quantity: {
        "5.5 x 8.5": [100, 250, 500, 1000],
        "8.5 x 11": [100, 250, 500, 1000, 2500],
        "11 x 17": [100, 250, 500, 1000],
      },
      paper: {
        "5.5 x 8.5": ["100lb Gloss Text", "100lb Gloss Cover", "80lb Uncoated"],
        "8.5 x 11": ["100lb Gloss Text", "100lb Gloss Cover", "80lb Uncoated"],
        "11 x 17": ["100lb Gloss Text", "100lb Gloss Cover"],
      },
      color: {
        "100lb Gloss Text": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "100lb Gloss Cover": ["4/4 Full Color Both Sides", "4/0 Full Color Front Only"],
        "80lb Uncoated": ["4/4 Full Color Both Sides", "1/0 Black Front Only"],
      },
      coating: {
        "100lb Gloss Text": ["No Coating", "AQ Front"],
        "100lb Gloss Cover": ["No Coating", "AQ Both Sides"],
        "80lb Uncoated": ["No Coating"],
      },
      turnaround: {
        default: ["Standard 3-4 Business Days", "Rush 1-2 Business Days"],
      },
      bundling: {
        default: ["No Bundling", "Bundle in 50s", "Bundle in 100s"],
      },
      versions: {
        default: [1, 2, 3],
      },
    },
  },
};

function getFirst(arr) {
  return Array.isArray(arr) && arr.length ? String(arr[0]) : "";
}

function optionCard(title, value) {
  return { title, value };
}

function Field({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold tracking-wide text-neutral-700">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-black bg-white px-3 text-[14px] text-black shadow-[0_1px_0_rgba(0,0,0,0.05)] outline-none transition focus:ring-2 focus:ring-black/10"
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
  const productList = Object.values(PRODUCT_CONFIG);
  const [productKey, setProductKey] = useState(productList[0].key);

  const product = PRODUCT_CONFIG[productKey];

  const availableSizes = product.options.size;
  const [size, setSize] = useState(getFirst(availableSizes));

  const availablePapers = useMemo(
    () => product.options.paper[size] || [],
    [product, size]
  );
  const [paper, setPaper] = useState(getFirst(availablePapers));

  const availableColors = useMemo(
    () => product.options.color[paper] || [],
    [product, paper]
  );
  const [color, setColor] = useState(getFirst(availableColors));

  const availableCoatings = useMemo(
    () => product.options.coating[paper] || [],
    [product, paper]
  );
  const [coating, setCoating] = useState(getFirst(availableCoatings));

  const availableQuantities = useMemo(
    () => (product.options.quantity[size] || []).map(String),
    [product, size]
  );
  const [quantity, setQuantity] = useState(getFirst(availableQuantities));

  const availableTurnarounds = useMemo(
    () => product.options.turnaround.default || [],
    [product]
  );
  const [turnaround, setTurnaround] = useState(getFirst(availableTurnarounds));

  const availableBundling = useMemo(
    () => product.options.bundling.default || [],
    [product]
  );
  const [bundling, setBundling] = useState(getFirst(availableBundling));

  const availableVersions = useMemo(
    () => (product.options.versions.default || []).map(String),
    [product]
  );
  const [versions, setVersions] = useState(getFirst(availableVersions));

  const [trimSize, setTrimSize] = useState(getFirst(availableSizes));

  useEffect(() => {
    setSize(getFirst(availableSizes));
  }, [productKey]);

  useEffect(() => {
    const nextPapers = product.options.paper[size] || [];
    const nextPaper = getFirst(nextPapers);
    setPaper(nextPaper);
    setTrimSize(size);
  }, [product, size]);

  useEffect(() => {
    const nextColors = product.options.color[paper] || [];
    setColor(getFirst(nextColors));

    const nextCoatings = product.options.coating[paper] || [];
    setCoating(getFirst(nextCoatings));
  }, [product, paper]);

  useEffect(() => {
    const nextQty = (product.options.quantity[size] || []).map(String);
    setQuantity(getFirst(nextQty));
  }, [product, size]);

  useEffect(() => {
    setTurnaround(getFirst(product.options.turnaround.default || []));
    setBundling(getFirst(product.options.bundling.default || []));
    setVersions(getFirst((product.options.versions.default || []).map(String)));
  }, [productKey, product]);

  const pricing = useMemo(() => {
    const qty = Number(quantity || 0);
    const ver = Number(versions || 1);

    let baseUnit = 0.12;
    if (product.key === "postcards") baseUnit = 0.24;
    if (product.key === "businessCards") baseUnit = 0.10;
    if (product.key === "flyers") baseUnit = 0.16;

    if (size.includes("8.5 x 11")) baseUnit += 0.08;
    if (size.includes("11 x 17")) baseUnit += 0.14;
    if (size.includes("6 x 9")) baseUnit += 0.04;
    if (size.includes("5.5 x 8.5")) baseUnit += 0.03;

    if (paper.includes("16pt")) baseUnit += 0.03;
    if (paper.includes("100lb Gloss Cover")) baseUnit += 0.05;
    if (paper.includes("100lb Gloss Text")) baseUnit += 0.03;
    if (paper.includes("Matte")) baseUnit += 0.02;

    if (color.includes("4/4")) baseUnit += 0.03;
    if (color.includes("4/0")) baseUnit += 0.015;

    if (coating.includes("Gloss UV")) baseUnit += 0.03;
    if (coating.includes("Soft Touch")) baseUnit += 0.05;
    if (coating.includes("AQ")) baseUnit += 0.02;
    if (coating.includes("Matte Finish")) baseUnit += 0.02;

    if (turnaround.includes("Rush")) baseUnit += 0.04;

    if (bundling !== "No Bundling") baseUnit += 0.005;

    if (ver > 1) baseUnit += (ver - 1) * 0.01;

    if (qty >= 5000) baseUnit *= 0.72;
    else if (qty >= 2500) baseUnit *= 0.78;
    else if (qty >= 1000) baseUnit *= 0.84;
    else if (qty >= 500) baseUnit *= 0.90;
    else if (qty >= 250) baseUnit *= 0.95;

    const unitPrice = baseUnit;
    const printingTotal = unitPrice * qty;
    const rewardPoints = Math.round(printingTotal);

    return {
      unitPrice,
      printingTotal,
      rewardPoints,
    };
  }, [product, size, paper, color, coating, turnaround, bundling, quantity, versions]);

  const summaryCards = [
    optionCard("Product", product.label),
    optionCard("Size", size),
    optionCard("Paper", paper),
    optionCard("Color", color),
  ];

  return (
    <main className="min-h-screen bg-[#f4f4f2] text-black">
      <section className="border-b border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
          <div>
            <div className="text-2xl font-bold tracking-[-0.03em]">EnVision Direct</div>
            <div className="text-sm text-neutral-600">Print ordering and live estimating</div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/order"
              className="rounded-xl border border-black bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
            >
              Order
            </Link>
            <Link
              href="/track"
              className="rounded-xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Track
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-[28px] border border-black bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className="border-b border-black bg-[#ece8df] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Digital print products
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em]">{product.pageTitle}</h1>
            </div>

            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="border-b border-black p-6 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex justify-between gap-3">
                  <div className="rounded-full border border-black bg-[#f5f3ee] px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                    Upload print-ready artwork
                  </div>
                  <Link
                    href={`/order?product=${encodeURIComponent(product.label)}`}
                    className="rounded-xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Upload File
                  </Link>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-black">
                  <img
                    src={product.heroImage}
                    alt={product.label}
                    className="h-[320px] w-full object-cover"
                  />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {summaryCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-[18px] border border-black bg-[#f7f6f2] px-4 py-4"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                        {card.title}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-neutral-900">{card.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {["Overview", "Specs", "Options", "Turnaround"].map((tab, index) => (
                    <span
                      key={tab}
                      className={`rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                        index === 0 ? "bg-black text-white" : "bg-[#f5f3ee] text-neutral-700"
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-[22px] border border-black bg-[#f7f6f2] p-5">
                  <h2 className="text-xl font-bold tracking-[-0.02em]">Product overview</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">{product.description}</p>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">
                    Use the estimator on the right to change product options and see pricing update
                    as selections change.
                  </p>
                </div>

                <div className="mt-5 rounded-[22px] border border-black bg-white p-5">
                  <h3 className="text-lg font-bold tracking-[-0.02em]">Related products</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {product.related.map((item) => (
                      <div
                        key={item}
                        className="rounded-[16px] border border-black bg-[#faf9f6] px-4 py-3 text-sm font-semibold"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] border border-black bg-[#e8efe8] p-5">
                  <h3 className="text-lg font-bold tracking-[-0.02em]">How this estimator works</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      "Product changes available sizes and papers",
                      "Paper changes color and coating choices",
                      "Size changes valid quantity tiers",
                      "Pricing updates as options change",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[16px] border border-black bg-white px-4 py-3 text-sm font-semibold"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="self-start overflow-hidden rounded-[24px] border border-black bg-[#e7e3db] shadow-[0_10px_26px_rgba(0,0,0,0.08)]">
            <div className="border-b border-black bg-[#d9d1c4] px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                Live estimator
              </div>
              <div className="mt-1 text-xl font-bold tracking-[-0.02em]">Build your print order</div>
            </div>

            <div className="border-b border-black bg-white px-4 py-4">
              <Field
                label="Product"
                value={productKey}
                onChange={(e) => setProductKey(e.target.value)}
                options={productList.map((p) => ({ value: p.key, label: p.label })).map((x) => x.value)}
              />
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="rounded-[18px] border border-black bg-[#f8f6f0] p-4">
                <div className="mb-3 text-sm font-bold">{product.label}</div>

                <div className="space-y-4">
                  <Field
                    label="Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    options={availableSizes}
                  />

                  <div>
                    <label className="mb-2 block text-[13px] font-semibold tracking-wide text-neutral-700">
                      Trim Size
                    </label>
                    <input
                      value={trimSize}
                      onChange={(e) => setTrimSize(e.target.value)}
                      className="h-11 w-full rounded-xl border border-black bg-white px-3 text-[14px] text-black outline-none transition focus:ring-2 focus:ring-black/10"
                    />
                  </div>

                  <Field
                    label="Paper"
                    value={paper}
                    onChange={(e) => setPaper(e.target.value)}
                    options={availablePapers}
                  />

                  <Field
                    label="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    options={availableColors}
                  />

                  <Field
                    label="Coating"
                    value={coating}
                    onChange={(e) => setCoating(e.target.value)}
                    options={availableCoatings}
                  />

                  <Field
                    label="Turnaround"
                    value={turnaround}
                    onChange={(e) => setTurnaround(e.target.value)}
                    options={availableTurnarounds}
                  />

                  <Field
                    label="Bundle in Sets"
                    value={bundling}
                    onChange={(e) => setBundling(e.target.value)}
                    options={availableBundling}
                  />

                  <Field
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    options={availableQuantities}
                  />

                  <Field
                    label="Versions"
                    value={versions}
                    onChange={(e) => setVersions(e.target.value)}
                    options={availableVersions}
                  />
                </div>
              </div>

              <div className="rounded-[18px] border border-black bg-[#f3efb7] p-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Printing Total</span>
                  <span>${pricing.printingTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm font-bold">
                  <span>Unit Price</span>
                  <span>${pricing.unitPrice.toFixed(3)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[16px] border border-black bg-white px-4 py-3">
                <span className="text-sm font-semibold">Reward Points</span>
                <span className="text-sm font-bold">{pricing.rewardPoints}</span>
              </div>

              <Link
                href={`/order?product=${encodeURIComponent(product.label)}`}
                className="block rounded-[16px] border border-black bg-black px-4 py-3 text-center text-[15px] font-bold text-white hover:opacity-92"
              >
                Place Order
              </Link>

              <div className="text-right text-xs font-medium text-neutral-600">
                Live estimate preview
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}