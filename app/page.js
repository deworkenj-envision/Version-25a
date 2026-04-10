"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PRODUCT_CONFIG = {
  postcards: {
    key: "postcards",
    label: "Postcards",
    pageTitle: "Custom Postcards",
    description:
      "Great for promotions, direct mail, announcements, handouts, and event marketing.",
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
    pageTitle: "Custom Business Cards",
    description:
      "Professional cards for networking, appointments, leave-behinds, and everyday customer contact.",
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
    pageTitle: "Custom Flyers",
    description:
      "Useful for promotions, menus, sales sheets, event handouts, and local advertising.",
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

const productTags = [
  "Business Cards",
  "Postcards",
  "Flyers",
  "Brochures",
  "Banners",
  "Yard Signs",
  "Menus",
  "Rack Cards",
];

function getFirst(arr) {
  return Array.isArray(arr) && arr.length ? String(arr[0]) : "";
}

function Field({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-[14px] text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-blue-200"
      >
        {options.map((option) => {
          const normalized =
            typeof option === "string" || typeof option === "number"
              ? { value: String(option), label: String(option) }
              : option;

          return (
            <option key={normalized.value} value={normalized.value}>
              {normalized.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function ProductTag({ children }) {
  return (
    <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
      {children}
    </span>
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
  }, [productKey, availableSizes]);

  useEffect(() => {
    const nextPapers = product.options.paper[size] || [];
    setPaper(getFirst(nextPapers));
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f9fbff_32%,#fffdf8_100%)] text-slate-900">
      <section className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
          <div>
            <div className="text-2xl font-bold tracking-[-0.03em] text-slate-900">EnVision Direct</div>
            <div className="text-sm text-slate-600">Professional print ordering made easier</div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/order"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Order
            </Link>
            <Link
              href="/track"
              className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Track
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_38%,#60a5fa_72%,#93c5fd_100%)] px-6 py-10 text-white md:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_24%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                  EnVision Direct
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] md:text-5xl">
                  Professional print products in one clean ordering experience
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
                  Business cards, postcards, flyers, banners, brochures, signs, menus, and more — with a simpler way to choose options, upload artwork, and place your order.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {productTags.map((item) => (
                    <ProductTag key={item}>{item}</ProductTag>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-white/25 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur">
                <img
                  src="/collage.jpg"
                  alt="EnVision Direct print product collage"
                  className="h-[260px] w-full object-cover md:h-[320px]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
              <div className="rounded-[22px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Selected product
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-900">
                      {product.pageTitle}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
                      {product.description}
                    </p>
                  </div>

                  <Link
                    href={`/order?product=${encodeURIComponent(product.label)}`}
                    className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Upload File
                  </Link>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-900">
                  How pricing updates
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    "Product selection changes available sizes and stocks",
                    "Paper selection changes color and coating options",
                    "Size controls valid quantity tiers",
                    "Pricing updates in real time as selections change",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[16px] border border-slate-200 bg-blue-50 px-4 py-4 text-sm font-medium text-slate-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="p-6">
              <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-sm">
                <div className="mb-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Build your order
                  </div>
                  <div className="mt-1 text-2xl font-bold tracking-[-0.02em] text-slate-900">
                    Choose your options
                  </div>
                </div>

                <div className="grid gap-4">
                  <Field
                    label="Product"
                    value={productKey}
                    onChange={(e) => setProductKey(e.target.value)}
                    options={productList.map((item) => ({
                      value: item.key,
                      label: item.label,
                    }))}
                  />

                  <Field
                    label="Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    options={availableSizes}
                  />

                  <div>
                    <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      Trim Size
                    </label>
                    <input
                      value={trimSize}
                      onChange={(e) => setTrimSize(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-[14px] text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-blue-200"
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

              <div className="mt-5 rounded-[22px] border border-amber-200 bg-[linear-gradient(135deg,#fff3bf_0%,#ffe08a_100%)] p-5 shadow-sm">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Printing Total</span>
                  <span>${pricing.printingTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Unit Price</span>
                  <span>${pricing.unitPrice.toFixed(3)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[18px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-sm font-semibold text-slate-700">Reward Points</span>
                <span className="text-sm font-bold text-slate-900">{pricing.rewardPoints}</span>
              </div>

              <Link
                href={`/order?product=${encodeURIComponent(product.label)}`}
                className="mt-4 block rounded-[18px] border border-slate-900 bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_100%)] px-4 py-3 text-center text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] hover:opacity-95"
              >
                Place Order
              </Link>

              <div className="mt-3 text-right text-xs font-medium text-slate-500">
                Live estimate preview
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}