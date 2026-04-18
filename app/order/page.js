"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function formatMoney(value) {
  const number = Number(value || 0);
  return `$${number.toFixed(2)}`;
}

function uniqueValues(rows, key) {
  return [...new Set((rows || []).map((row) => row[key]).filter(Boolean))];
}

function getDefaultValue(list, fallback = "") {
  return Array.isArray(list) && list.length > 0 ? list[0] : fallback;
}

function getProductFromUrl() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("product") || "";
}

const PRODUCT_META = {
  "Business Cards": {
    image: "/products/business-cards.jpg",
    blurb: "Professional business cards with clean finishes and sharp print quality.",
  },
  Flyers: {
    image: "/products/flyers.jpg",
    blurb: "High-impact flyers for promotions, events, menus, and handouts.",
  },
  Postcards: {
    image: "/products/postcards.jpg",
    blurb: "Premium postcards perfect for marketing, direct mail, and announcements.",
  },
  Banners: {
    image: "/products/banners.jpg",
    blurb: "Durable indoor and outdoor banners with vibrant full-color printing.",
  },
};

export default function OrderPage() {
  const [pricingRows, setPricingRows] = useState([]);
  const [pricingTableLoading, setPricingTableLoading] = useState(true);

  const [productName, setProductName] = useState("");
  const [size, setSize] = useState("");
  const [paper, setPaper] = useState("");
  const [finish, setFinish] = useState("");
  const [sides, setSides] = useState("");
  const [quantity, setQuantity] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [livePrice, setLivePrice] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);

  const [artworkFile, setArtworkFile] = useState(null);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [uploadedArtwork, setUploadedArtwork] = useState(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPricingTable() {
      try {
        setPricingTableLoading(true);

        const res = await fetch("/api/pricing", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "Failed to load pricing table.");
        }

        const rows = Array.isArray(data.pricing) ? data.pricing : [];
        setPricingRows(rows);

        if (rows.length > 0) {
          const productFromUrl = getProductFromUrl();
          const firstMatchingRow =
            rows.find((row) => row.product_name === productFromUrl) || rows[0];

          setProductName(firstMatchingRow.product_name || "");
          setSize(firstMatchingRow.size || "");
          setPaper(firstMatchingRow.paper || "");
          setFinish(firstMatchingRow.finish || "");
          setSides(firstMatchingRow.sides || "");
          setQuantity(String(firstMatchingRow.quantity ?? ""));
        }
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Failed to load pricing.");
      } finally {
        setPricingTableLoading(false);
      }
    }

    loadPricingTable();
  }, []);

  const allProducts = useMemo(() => {
    return uniqueValues(pricingRows, "product_name");
  }, [pricingRows]);

  const rowsForProduct = useMemo(() => {
    return pricingRows.filter((row) => row.product_name === productName);
  }, [pricingRows, productName]);

  const availableSizes = useMemo(() => {
    return uniqueValues(rowsForProduct, "size");
  }, [rowsForProduct]);

  const rowsForProductAndSize = useMemo(() => {
    return rowsForProduct.filter((row) => row.size === size);
  }, [rowsForProduct, size]);

  const availablePapers = useMemo(() => {
    return uniqueValues(rowsForProductAndSize, "paper");
  }, [rowsForProductAndSize]);

  const rowsForProductSizePaper = useMemo(() => {
    return rowsForProductAndSize.filter((row) => row.paper === paper);
  }, [rowsForProductAndSize, paper]);

  const availableFinishes = useMemo(() => {
    return uniqueValues(rowsForProductSizePaper, "finish");
  }, [rowsForProductSizePaper]);

  const rowsForProductSizePaperFinish = useMemo(() => {
    return rowsForProductSizePaper.filter((row) => row.finish === finish);
  }, [rowsForProductSizePaper, finish]);

  const availableSides = useMemo(() => {
    return uniqueValues(rowsForProductSizePaperFinish, "sides");
  }, [rowsForProductSizePaperFinish]);

  const rowsForFullOptionsMinusQuantity = useMemo(() => {
    return rowsForProductSizePaperFinish.filter((row) => row.sides === sides);
  }, [rowsForProductSizePaperFinish, sides]);

  const availableQuantities = useMemo(() => {
    return [
      ...new Set(
        rowsForFullOptionsMinusQuantity
          .map((row) => Number(row.quantity))
          .filter((v) => !Number.isNaN(v))
      ),
    ].sort((a, b) => a - b);
  }, [rowsForFullOptionsMinusQuantity]);

  const selectedRow = useMemo(() => {
    return pricingRows.find(
      (row) =>
        row.product_name === productName &&
        row.size === size &&
        row.paper === paper &&
        row.finish === finish &&
        row.sides === sides &&
        Number(row.quantity) === Number(quantity)
    );
  }, [pricingRows, productName, size, paper, finish, sides, quantity]);

  const quantityRows = useMemo(() => {
    return rowsForFullOptionsMinusQuantity
      .map((row) => ({
        ...row,
        quantity: Number(row.quantity),
        price: Number(row.price || 0),
      }))
      .sort((a, b) => a.quantity - b.quantity);
  }, [rowsForFullOptionsMinusQuantity]);

  const bestValueRow = useMemo(() => {
    if (!quantityRows.length) return null;

    let best = null;

    for (const row of quantityRows) {
      if (!row.quantity || !row.price) continue;

      const unitPrice = row.price / row.quantity;

      if (!best || unitPrice < best.unitPrice) {
        best = {
          ...row,
          unitPrice,
        };
      }
    }

    return best;
  }, [quantityRows]);

  const currentUnitPrice = useMemo(() => {
    const qty = Number(quantity);
    const subtotal = Number(livePrice || 0);

    if (!qty || !subtotal) return 0;
    return subtotal / qty;
  }, [quantity, livePrice]);

  const savingsVsSmallestQty = useMemo(() => {
    if (!quantityRows.length || !livePrice || !quantity) return null;

    const smallest = quantityRows[0];
    if (!smallest?.quantity || !smallest?.price) return null;

    const smallestUnit = Number(smallest.price) / Number(smallest.quantity);
    const currentUnit = Number(livePrice) / Number(quantity);

    const savings = smallestUnit - currentUnit;
    if (savings <= 0) return null;

    return savings;
  }, [quantityRows, livePrice, quantity]);

  const productDescription = useMemo(() => {
    return (
      PRODUCT_META[productName]?.blurb ||
      "Choose your print options and get a live price instantly."
    );
  }, [productName]);

  const currentProductImage = useMemo(() => {
    return PRODUCT_META[productName]?.image || "/products/business-cards.jpg";
  }, [productName]);

  const subtotal = Number(livePrice || 0);
  const shipping = Number(shippingPrice || 0);
  const total = subtotal + shipping;

  useEffect(() => {
    if (!pricingRows.length) return;

    if (!productName || !allProducts.includes(productName)) {
      const nextProduct = getDefaultValue(allProducts);
      if (nextProduct) {
        setProductName(nextProduct);
      }
    }
  }, [pricingRows, allProducts, productName]);

  useEffect(() => {
    if (!productName) return;

    const nextSizes = uniqueValues(
      pricingRows.filter((row) => row.product_name === productName),
      "size"
    );

    if (!size || !nextSizes.includes(size)) {
      setSize(getDefaultValue(nextSizes));
    }
  }, [pricingRows, productName, size]);

  useEffect(() => {
    if (!productName || !size) return;

    const nextPapers = uniqueValues(
      pricingRows.filter(
        (row) => row.product_name === productName && row.size === size
      ),
      "paper"
    );

    if (!paper || !nextPapers.includes(paper)) {
      setPaper(getDefaultValue(nextPapers));
    }
  }, [pricingRows, productName, size, paper]);

  useEffect(() => {
    if (!productName || !size || !paper) return;

    const nextFinishes = uniqueValues(
      pricingRows.filter(
        (row) =>
          row.product_name === productName &&
          row.size === size &&
          row.paper === paper
      ),
      "finish"
    );

    if (!finish || !nextFinishes.includes(finish)) {
      setFinish(getDefaultValue(nextFinishes));
    }
  }, [pricingRows, productName, size, paper, finish]);

  useEffect(() => {
    if (!productName || !size || !paper || !finish) return;

    const nextSides = uniqueValues(
      pricingRows.filter(
        (row) =>
          row.product_name === productName &&
          row.size === size &&
          row.paper === paper &&
          row.finish === finish
      ),
      "sides"
    );

    if (!sides || !nextSides.includes(sides)) {
      setSides(getDefaultValue(nextSides));
    }
  }, [pricingRows, productName, size, paper, finish, sides]);

  useEffect(() => {
    if (!productName || !size || !paper || !finish || !sides) return;

    const nextQuantities = [
      ...new Set(
        pricingRows
          .filter(
            (row) =>
              row.product_name === productName &&
              row.size === size &&
              row.paper === paper &&
              row.finish === finish &&
              row.sides === sides
          )
          .map((row) => String(row.quantity))
      ),
    ].sort((a, b) => Number(a) - Number(b));

    if (!quantity || !nextQuantities.includes(String(quantity))) {
      setQuantity(getDefaultValue(nextQuantities));
    }
  }, [pricingRows, productName, size, paper, finish, sides, quantity]);

  useEffect(() => {
    async function fetchLivePrice() {
      if (!productName || !size || !paper || !finish || !sides || !quantity) {
        setLivePrice(null);
        return;
      }

      try {
        setPricingLoading(true);

        const params = new URLSearchParams({
          product_name: productName,
          size,
          paper,
          finish,
          sides,
          quantity: String(quantity),
        });

        const res = await fetch(`/api/pricing?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success && typeof data?.exactPrice === "number") {
          setLivePrice(Number(data.exactPrice));
        } else {
          setLivePrice(null);
        }
      } catch (error) {
        console.error("Pricing fetch error:", error);
        setLivePrice(null);
      } finally {
        setPricingLoading(false);
      }
    }

    fetchLivePrice();
  }, [productName, size, paper, finish, sides, quantity]);

  useEffect(() => {
    async function fetchShipping() {
      if (!productName || !quantity) {
        setShippingPrice(0);
        return;
      }

      try {
        setShippingLoading(true);

        const params = new URLSearchParams({
          product_name: productName,
          quantity: String(quantity),
        });

        const res = await fetch(`/api/shipping?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success && typeof data?.shipping === "number") {
          setShippingPrice(Number(data.shipping));
        } else {
          setShippingPrice(0);
        }
      } catch (error) {
        console.error("Shipping fetch error:", error);
        setShippingPrice(0);
      } finally {
        setShippingLoading(false);
      }
    }

    fetchShipping();
  }, [productName, quantity]);

  async function handleArtworkUpload() {
    if (!artworkFile) {
      setMessage("Please choose an artwork file first.");
      return null;
    }

    try {
      setUploadingArtwork(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", artworkFile);

      const res = await fetch("/api/upload-artwork", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Artwork upload failed.");
      }

      const uploaded = {
        fileName: data.fileName || artworkFile.name,
        filePath: data.filePath || "",
        publicUrl: data.publicUrl || "",
      };

      setUploadedArtwork(uploaded);
      setMessage("Artwork uploaded successfully.");
      return uploaded;
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Artwork upload failed.");
      return null;
    } finally {
      setUploadingArtwork(false);
    }
  }

  async function handleCheckout() {
    if (!customerName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!customerEmail.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!uploadedArtwork?.publicUrl) {
      setMessage("Please upload your artwork before checkout.");
      return;
    }

    if (livePrice === null) {
      setMessage("Pricing is unavailable for this selection.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setMessage("");

      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        productName,
        size,
        paper,
        finish,
        sides,
        quantity: Number(quantity),
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        total: Number(total),
        notes: notes.trim(),
        fileName: uploadedArtwork.fileName,
        artworkUrl: uploadedArtwork.publicUrl,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Checkout failed.");
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Checkout session URL was not returned.");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Checkout failed.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
                EnVision Direct Premium Estimator
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl xl:text-[4rem]">
                Build Your Order.
                <br />
                Upload Artwork.
                <br />
                Checkout Securely.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
                Choose your product, select exact print options, see live pricing,
                and place your order with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                {allProducts.length > 0 ? (
                  allProducts.map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-white/15 px-4 py-2 font-medium"
                    >
                      {product}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="rounded-full bg-white/15 px-4 py-2">Business Cards</span>
                    <span className="rounded-full bg-white/15 px-4 py-2">Flyers</span>
                    <span className="rounded-full bg-white/15 px-4 py-2">Postcards</span>
                    <span className="rounded-full bg-white/15 px-4 py-2">Banners</span>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] bg-white shadow-2xl ring-1 ring-white/20">
              <div className="relative">
                <Image
                  src={currentProductImage}
                  alt={productName || "Selected product"}
                  width={1200}
                  height={800}
                  className="h-64 w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                    Live Estimate
                  </div>
                  <div className="mt-1 text-3xl font-bold">
                    {productName || "Loading..."}
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/90">
                    {productDescription}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <MetricCard
                  label="Print Price"
                  value={pricingLoading ? "Loading..." : formatMoney(subtotal)}
                />
                <MetricCard
                  label="Per Piece"
                  value={
                    pricingLoading
                      ? "Loading..."
                      : currentUnitPrice > 0
                      ? formatMoney(currentUnitPrice)
                      : "-"
                  }
                />
                <MetricCard
                  label="Shipping"
                  value={shippingLoading ? "Loading..." : formatMoney(shipping)}
                />
                <MetricCard
                  label="Selected Qty"
                  value={quantity ? String(quantity) : "-"}
                />
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-[24px] bg-blue-700 p-5 text-white shadow-lg">
                  <div className="text-sm font-medium text-blue-100">Estimated Total</div>
                  <div className="mt-1 text-3xl font-extrabold">
                    {pricingLoading || pricingTableLoading || shippingLoading
                      ? "Loading..."
                      : formatMoney(total)}
                  </div>

                  {bestValueRow ? (
                    <div className="mt-2 text-sm text-blue-100">
                      Best value quantity: {bestValueRow.quantity}
                    </div>
                  ) : null}

                  {savingsVsSmallestQty ? (
                    <div className="mt-1 text-sm text-blue-100">
                      Better unit price than the smallest quantity by{" "}
                      {formatMoney(savingsVsSmallestQty)} each.
                    </div>
                  ) : null}
                </div>

                {livePrice === null && !pricingLoading && !pricingTableLoading ? (
                  <p className="mt-4 text-sm text-amber-600">
                    No exact price was found for this combination yet.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-6 pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="rounded-[30px] bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                  Customize Your Order
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600">
                  Pick your product options below. Pricing and shipping update live
                  as you build your order.
                </p>
              </div>

              <Link
                href="/track"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
              >
                Track an Existing Order
              </Link>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {allProducts.map((product) => {
                const isActive = product === productName;
                const image =
                  PRODUCT_META[product]?.image || "/products/business-cards.jpg";

                return (
                  <button
                    key={product}
                    type="button"
                    onClick={() => setProductName(product)}
                    className={`overflow-hidden rounded-[24px] border text-left transition ${
                      isActive
                        ? "border-blue-700 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="relative">
                      <Image
                        src={image}
                        alt={product}
                        width={800}
                        height={600}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-base font-bold text-slate-900">{product}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {isActive ? "Currently selected" : "Select product"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Size">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="input"
                  disabled={pricingTableLoading || availableSizes.length === 0}
                >
                  {availableSizes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Paper">
                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  className="input"
                  disabled={pricingTableLoading || availablePapers.length === 0}
                >
                  {availablePapers.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Finish">
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="input"
                  disabled={pricingTableLoading || availableFinishes.length === 0}
                >
                  {availableFinishes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Sides">
                <select
                  value={sides}
                  onChange={(e) => setSides(e.target.value)}
                  className="input"
                  disabled={pricingTableLoading || availableSides.length === 0}
                >
                  {availableSides.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Quantity">
                <div className="space-y-4">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input"
                    disabled={pricingTableLoading || availableQuantities.length === 0}
                  >
                    {availableQuantities.map((option) => (
                      <option key={option} value={String(option)}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {availableQuantities.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {availableQuantities.slice(0, 6).map((option) => {
                        const optionRow = quantityRows.find(
                          (row) => Number(row.quantity) === Number(option)
                        );
                        const isSelected = Number(quantity) === Number(option);
                        const isBestValue =
                          bestValueRow &&
                          Number(bestValueRow.quantity) === Number(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setQuantity(String(option))}
                            className={`rounded-[22px] border px-4 py-4 text-left transition ${
                              isSelected
                                ? "border-blue-700 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-base font-bold text-slate-900">
                                {option}
                              </span>
                              {isBestValue ? (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                                  Best
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-2 text-sm font-semibold text-slate-700">
                              {optionRow ? formatMoney(optionRow.price) : "-"}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {optionRow?.quantity && optionRow?.price
                                ? `${formatMoney(
                                    Number(optionRow.price) / Number(optionRow.quantity)
                                  )} each`
                                : ""}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </Field>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <Field label="Your Name">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input"
                  placeholder="Enter your full name"
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Notes / Special Instructions">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input min-h-[120px]"
                  placeholder="Add any print instructions or special notes here"
                />
              </Field>
            </div>

            <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">Upload Artwork</div>
                  <p className="mt-1 text-sm text-slate-600">
                    Upload your print-ready file before checkout.
                  </p>
                </div>

                {uploadedArtwork?.publicUrl ? (
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Artwork Uploaded
                  </div>
                ) : null}
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setArtworkFile(file);
                    setUploadedArtwork(null);
                    setMessage("");
                  }}
                  className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
                />

                <button
                  type="button"
                  onClick={handleArtworkUpload}
                  disabled={!artworkFile || uploadingArtwork}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingArtwork ? "Uploading..." : "Upload Artwork"}
                </button>
              </div>

              {uploadedArtwork?.publicUrl ? (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Uploaded: <span className="font-semibold">{uploadedArtwork.fileName}</span>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="rounded-[30px] bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-slate-900">Order Summary</h3>
              {selectedRow?.id ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Live Match
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  No Match
                </span>
              )}
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
              <Image
                src={currentProductImage}
                alt={productName || "Selected product"}
                width={1200}
                height={800}
                className="h-44 w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <SummaryRow label="Product" value={productName || "-"} />
              <SummaryRow label="Size" value={size || "-"} />
              <SummaryRow label="Paper" value={paper || "-"} />
              <SummaryRow label="Finish" value={finish || "-"} />
              <SummaryRow label="Sides" value={sides || "-"} />
              <SummaryRow label="Quantity" value={quantity || "-"} />
              <SummaryRow
                label="Per Piece"
                value={currentUnitPrice > 0 ? formatMoney(currentUnitPrice) : "-"}
              />
            </div>

            {bestValueRow ? (
              <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                <div className="text-sm font-semibold text-amber-800">
                  Best Value Quantity
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {bestValueRow.quantity}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {formatMoney(bestValueRow.price)} total ·{" "}
                  {formatMoney(bestValueRow.unitPrice)} each
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Print Price</span>
                <span>{pricingLoading ? "Loading..." : formatMoney(subtotal)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>{shippingLoading ? "Loading..." : formatMoney(shipping)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>
                  {pricingLoading || shippingLoading ? "Loading..." : formatMoney(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={
                checkoutLoading ||
                uploadingArtwork ||
                pricingLoading ||
                pricingTableLoading ||
                shippingLoading ||
                livePrice === null ||
                !uploadedArtwork?.publicUrl
              }
              className="mt-8 w-full rounded-[22px] bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "Starting Checkout..." : "Proceed to Checkout"}
            </button>

            <p className="mt-3 text-center text-sm text-slate-500">
              Artwork upload is required before checkout.
            </p>

            {message ? (
              <div className="mt-5 rounded-[22px] bg-slate-100 p-4 text-sm text-slate-700">
                {message}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #cbd5e1;
          background: white;
          padding: 0.95rem 1rem;
          font-size: 0.95rem;
          color: #0f172a;
          outline: none;
          transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .input:hover {
          background: #f8fafc;
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}