"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const LOGO_SRC = "/logo.png";

function formatMoney(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
}

function normalize(value) {
  return String(value ?? "").trim();
}

function slugify(value) {
  return normalize(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PRODUCT_META = {
  "business-cards": {
    label: "Business Cards",
    image: "/products/business-cards.jpg",
    short: "Premium cards for networking, branding, and first impressions.",
  },
  flyers: {
    label: "Flyers",
    image: "/products/flyers.jpg",
    short: "High-impact flyers for promotions, events, menus, and handouts.",
  },
  postcards: {
    label: "Postcards",
    image: "/products/postcards.jpg",
    short: "Direct-mail and handout postcards with bold visual impact.",
  },
  banners: {
    label: "Banners",
    image: "/products/banners.jpg",
    short: "Durable large-format banners for indoor and outdoor display.",
  },
};

const PRODUCT_ALIASES = {
  "business-cards": "business-cards",
  "business cards": "business-cards",
  businesscards: "business-cards",
  "biz cards": "business-cards",
  bizcards: "business-cards",
  flyers: "flyers",
  flyer: "flyers",
  postcards: "postcards",
  postcard: "postcards",
  banners: "banners",
  banner: "banners",
};

function canonicalProductSlug(value) {
  const raw = normalize(value).toLowerCase();
  if (!raw) return "";
  return PRODUCT_ALIASES[raw] || PRODUCT_ALIASES[slugify(raw)] || slugify(raw);
}

function findMatchingProduct(products, requestedValue) {
  if (!requestedValue || !products.length) return "";

  const requestedSlug = canonicalProductSlug(requestedValue);

  const exact = products.find(
    (p) => normalize(p).toLowerCase() === normalize(requestedValue).toLowerCase()
  );
  if (exact) return exact;

  const slugMatch = products.find((p) => canonicalProductSlug(p) === requestedSlug);
  if (slugMatch) return slugMatch;

  return "";
}

function bestValueRow(rows) {
  if (!rows.length) return null;

  return rows.reduce((best, row) => {
    const qty = Number(row.quantity || 0);
    const price = Number(row.price || 0);
    const unit = qty > 0 ? price / qty : Infinity;

    if (!best) return { ...row, unitPrice: unit };
    return unit < best.unitPrice ? { ...row, unitPrice: unit } : best;
  }, null);
}

export default function OrderPage() {
  const router = useRouter();

  const [pricingRows, setPricingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [productName, setProductName] = useState("");
  const [size, setSize] = useState("");
  const [paper, setPaper] = useState("");
  const [finish, setFinish] = useState("");
  const [sides, setSides] = useState("");
  const [quantity, setQuantity] = useState("");

  const [notes, setNotes] = useState("");
  const [artworkFile, setArtworkFile] = useState(null);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedArtworkUrl, setUploadedArtworkUrl] = useState("");
  const [uploadedArtworkFileName, setUploadedArtworkFileName] = useState("");

  const [requestedProduct, setRequestedProduct] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    setRequestedProduct(
      params.get("product") ||
        params.get("productName") ||
        params.get("name") ||
        ""
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPricing() {
      try {
        setLoading(true);
        setLoadError("");

        const res = await fetch("/api/pricing", { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to load pricing.");

        const data = await res.json();

        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.pricing)
            ? data.pricing
            : Array.isArray(data?.rows)
              ? data.rows
              : [];

        if (!active) return;

        const cleanedRows = rows
          .filter(Boolean)
          .map((row) => ({
            id: row.id,
            product_name: normalize(row.product_name),
            size: normalize(row.size),
            paper: normalize(row.paper),
            finish: normalize(row.finish),
            sides: normalize(row.sides),
            quantity: String(row.quantity ?? "").trim(),
            price: Number(row.price ?? row.base_price ?? row.total ?? 0),
          }))
          .filter((row) => row.product_name && row.quantity && Number.isFinite(row.price));

        setPricingRows(cleanedRows);
      } catch (err) {
        setLoadError(err.message || "Failed to load pricing.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPricing();

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => {
    return [...new Set(pricingRows.map((row) => row.product_name))].sort();
  }, [pricingRows]);

  useEffect(() => {
    if (!products.length) return;

    const matchedProduct = findMatchingProduct(products, requestedProduct);

    setProductName((current) => {
      if (current && products.includes(current)) return current;
      if (matchedProduct) return matchedProduct;
      return products[0];
    });
  }, [products, requestedProduct]);

  const selectedProductSlug = useMemo(() => canonicalProductSlug(productName), [productName]);

  const productImage = useMemo(() => {
    return PRODUCT_META[selectedProductSlug]?.image || "";
  }, [selectedProductSlug]);

  const productDescription = useMemo(() => {
    return PRODUCT_META[selectedProductSlug]?.short || "Choose your print options below.";
  }, [selectedProductSlug]);

  const rowsForProduct = useMemo(() => {
    return pricingRows.filter((row) => row.product_name === productName);
  }, [pricingRows, productName]);

  const sizeOptions = useMemo(() => {
    return [...new Set(rowsForProduct.map((row) => row.size).filter(Boolean))].sort();
  }, [rowsForProduct]);

  useEffect(() => {
    if (!sizeOptions.length) {
      setSize("");
      return;
    }
    if (!sizeOptions.includes(size)) setSize(sizeOptions[0]);
  }, [sizeOptions, size]);

  const rowsForSize = useMemo(() => {
    if (!size) return rowsForProduct;
    return rowsForProduct.filter((row) => row.size === size);
  }, [rowsForProduct, size]);

  const paperOptions = useMemo(() => {
    return [...new Set(rowsForSize.map((row) => row.paper).filter(Boolean))].sort();
  }, [rowsForSize]);

  useEffect(() => {
    if (!paperOptions.length) {
      setPaper("");
      return;
    }
    if (!paperOptions.includes(paper)) setPaper(paperOptions[0]);
  }, [paperOptions, paper]);

  const rowsForPaper = useMemo(() => {
    if (!paper) return rowsForSize;
    return rowsForSize.filter((row) => row.paper === paper);
  }, [rowsForSize, paper]);

  const finishOptions = useMemo(() => {
    return [...new Set(rowsForPaper.map((row) => row.finish).filter(Boolean))].sort();
  }, [rowsForPaper]);

  useEffect(() => {
    if (!finishOptions.length) {
      setFinish("");
      return;
    }
    if (!finishOptions.includes(finish)) setFinish(finishOptions[0]);
  }, [finishOptions, finish]);

  const rowsForFinish = useMemo(() => {
    if (!finish) return rowsForPaper;
    return rowsForPaper.filter((row) => row.finish === finish);
  }, [rowsForPaper, finish]);

  const sidesOptions = useMemo(() => {
    return [...new Set(rowsForFinish.map((row) => row.sides).filter(Boolean))].sort();
  }, [rowsForFinish]);

  useEffect(() => {
    if (!sidesOptions.length) {
      setSides("");
      return;
    }
    if (!sidesOptions.includes(sides)) setSides(sidesOptions[0]);
  }, [sidesOptions, sides]);

  const rowsForSides = useMemo(() => {
    if (!sides) return rowsForFinish;
    return rowsForFinish.filter((row) => row.sides === sides);
  }, [rowsForFinish, sides]);

  const quantityOptions = useMemo(() => {
    return [...new Set(rowsForSides.map((row) => String(row.quantity)).filter(Boolean))].sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [rowsForSides]);

  useEffect(() => {
    if (!quantityOptions.length) {
      setQuantity("");
      return;
    }
    if (!quantityOptions.includes(quantity)) setQuantity(quantityOptions[0]);
  }, [quantityOptions, quantity]);

  const selectedRow = useMemo(() => {
    return rowsForSides.find((row) => String(row.quantity) === String(quantity)) || null;
  }, [rowsForSides, quantity]);

  const subtotal = Number(selectedRow?.price || 0);

  const unitPrice = useMemo(() => {
    const qty = Number(quantity || 0);
    if (!qty || !subtotal) return 0;
    return subtotal / qty;
  }, [quantity, subtotal]);

  const allProductRows = useMemo(() => {
    return pricingRows.filter(
      (row) => canonicalProductSlug(row.product_name) === selectedProductSlug
    );
  }, [pricingRows, selectedProductSlug]);

  const bestValue = useMemo(() => bestValueRow(allProductRows), [allProductRows]);

  const heroPrice = subtotal || Number(bestValue?.price || 0);
  const heroQty = quantity || String(bestValue?.quantity || "");
  const heroUnit = unitPrice || Number(bestValue?.unitPrice || 0);

  const shippingPreview = 1.00;
  const estimatedTotal = heroPrice ? heroPrice + shippingPreview : 0;

  const canContinue = Boolean(
    selectedRow &&
      productName &&
      size &&
      paper &&
      finish &&
      sides &&
      quantity &&
      artworkFile &&
      !uploadingArtwork
  );

  async function uploadArtworkToServer(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-artwork", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || data?.message || "Artwork upload failed.");
    }

    const artworkUrl =
      data?.artworkUrl ||
      data?.url ||
      data?.publicUrl ||
      data?.fileUrl ||
      "";

    const fileName =
      data?.fileName ||
      data?.filename ||
      file?.name ||
      "";

    if (!artworkUrl) {
      throw new Error("Upload succeeded but no artwork URL was returned.");
    }

    return { artworkUrl, fileName };
  }

  async function handleContinue() {
    if (!selectedRow) return;

    if (!artworkFile) {
      setUploadError("Please upload your artwork before continuing.");
      return;
    }

    try {
      setUploadingArtwork(true);
      setUploadError("");

      const uploadResult = await uploadArtworkToServer(artworkFile);

      setUploadedArtworkUrl(uploadResult.artworkUrl);
      setUploadedArtworkFileName(uploadResult.fileName);

      const payload = {
        productName,
        size,
        paper,
        finish,
        sides,
        quantity: Number(quantity),
        price: subtotal,
        notes,
        artworkUrl: uploadResult.artworkUrl,
        artworkFileName: uploadResult.fileName,
        productImage,
      };

      localStorage.setItem("envision_order_config", JSON.stringify(payload));

      const params = new URLSearchParams({
        product: productName,
        size,
        paper,
        finish,
        sides,
        quantity: String(quantity),
        subtotal: String(subtotal),
        notes,
        artworkUrl: uploadResult.artworkUrl,
        artworkFileName: uploadResult.fileName,
        productImage: productImage || "",
      });

      router.push(`/checkout?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Artwork upload failed.");
    } finally {
      setUploadingArtwork(false);
    }
  }

  function handleArtworkChange(e) {
    const file = e.target.files?.[0] || null;
    setArtworkFile(file);
    setUploadError("");
    setUploadedArtworkUrl("");
    setUploadedArtworkFileName("");
  }

  function handleProductCardClick(product) {
    setProductName(product);
  }

  return (
    <main className="min-h-screen bg-[#eef2f7]">
      <section className="bg-gradient-to-r from-[#2457f5] via-[#1f63f4] to-[#0e98ff] text-white">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div />
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-8 lg:pb-16">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Build Your Order.
              <br />
              Upload Artwork.
              <br />
              Checkout Securely.
            </h1>

            <p className="mt-5 max-w-2xl text-base text-blue-100 sm:text-lg">
              Choose your product, select exact print options, see live pricing, and place your
              order with confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {products.map((product) => {
                const isActive = product === productName;
                return (
                  <button
                    key={product}
                    type="button"
                    onClick={() => handleProductCardClick(product)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-[#2457f5]"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    {product}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[28px] bg-white/95 p-4 text-slate-900 shadow-2xl backdrop-blur">
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-[18px] bg-slate-100">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productName || "Selected product"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">
                  Preview
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-sm">
              <div className="truncate text-lg font-bold">{productName || "Product"}</div>
              <div className="mb-2 line-clamp-2 text-xs text-slate-500">
                {productDescription}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Price</span>
                  <span className="font-semibold">
                    {heroPrice ? formatMoney(heroPrice) : "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Per</span>
                  <span className="font-semibold">
                    {heroUnit ? formatMoney(heroUnit) : "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Ship</span>
                  <span className="font-semibold">{formatMoney(shippingPreview)}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Qty</span>
                  <span className="font-semibold">{heroQty || "—"}</span>
                </div>
              </div>
            </div>

            <div className="min-w-[140px] rounded-[20px] bg-[#2457f5] px-5 py-4 text-center text-white">
              <div className="text-xs text-blue-100">Total</div>
              <div className="text-2xl font-extrabold">
                {estimatedTotal ? formatMoney(estimatedTotal) : "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">Loading pricing...</div>
            <p className="mt-2 text-sm text-slate-500">Please wait while we load your print options.</p>
          </div>
        ) : loadError ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <div className="text-lg font-semibold">Pricing could not be loaded</div>
            <p className="mt-2 text-sm">{loadError}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[28px] bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    Customize Your Order
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Pick your product options below. Pricing and shipping update live as you build
                    your order.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/track")}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Track an Existing Order
                </button>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => {
                  const slug = canonicalProductSlug(product);
                  const meta = PRODUCT_META[slug];
                  const isActive = product === productName;

                  return (
                    <button
                      key={product}
                      type="button"
                      onClick={() => handleProductCardClick(product)}
                      className={`overflow-hidden rounded-[22px] border text-left transition ${
                        isActive
                          ? "border-[#2457f5] ring-2 ring-[#2457f5]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="h-28 bg-slate-100">
                        {meta?.image ? (
                          <img
                            src={meta.image}
                            alt={product}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            {product}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-bold text-slate-900">{product}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {isActive ? "Currently selected" : "Select product"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <OptionField label="Size" value={size} onChange={setSize} options={sizeOptions} />
                <OptionField label="Paper" value={paper} onChange={setPaper} options={paperOptions} />
                <OptionField label="Finish" value={finish} onChange={setFinish} options={finishOptions} />
                <OptionField label="Sides" value={sides} onChange={setSides} options={sidesOptions} />
              </div>

              <div className="mt-5">
                <OptionField
                  label="Quantity"
                  value={quantity}
                  onChange={setQuantity}
                  options={quantityOptions}
                />
              </div>

              <div className="mt-8 rounded-[24px] border border-slate-200 p-5">
                <h3 className="text-xl font-bold text-slate-900">Artwork & Instructions</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Artwork upload is required before checkout.
                </p>

                <div className="mt-5 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Upload Artwork
                    </label>

                    <label className="flex cursor-pointer items-center justify-center rounded-[22px] border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-[#2457f5] hover:bg-blue-50">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {artworkFile ? artworkFile.name : "Click to choose your print-ready file"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          PDF, JPG, PNG, AI, PSD, EPS and other print-ready formats
                        </div>
                      </div>
                      <input type="file" className="hidden" onChange={handleArtworkChange} />
                    </label>

                    {artworkFile && (
  <div className="mt-3 space-y-3">
    <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      Selected file: <span className="font-semibold">{artworkFile.name}</span>
    </div>

    {/* IMAGE PREVIEW */}
    {artworkFile.type.startsWith("image/") && (
      <div className="overflow-hidden rounded-[18px] border border-slate-200">
        <img
          src={URL.createObjectURL(artworkFile)}
          alt="Artwork Preview"
          className="max-h-64 w-full object-contain bg-white"
        />
      </div>
    )}

    {/* PDF PREVIEW */}
    {artworkFile.type === "application/pdf" && (
      <div className="rounded-[18px] border border-slate-200 bg-white p-4 text-sm text-slate-600">
        PDF uploaded: preview will be available after checkout.
      </div>
    )}
  </div>
)}

                    {uploadedArtworkUrl && (
                      <div className="mt-3 rounded-[18px] border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        Uploaded successfully:{" "}
                        <span className="font-semibold">
                          {uploadedArtworkFileName || artworkFile?.name || "Artwork file"}
                        </span>
                      </div>
                    )}

                    {uploadError && (
                      <div className="mt-3 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {uploadError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      placeholder="Add any special instructions for your order..."
                      className="w-full rounded-[22px] border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2457f5] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-[28px] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-slate-900">Order Summary</h2>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live Match
                  </span>
                </div>

                <div className="overflow-hidden rounded-[20px] bg-slate-100">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName || "Selected product"}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                      Product preview
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <SummaryRow label="Product" value={productName || "—"} />
                  <SummaryRow label="Size" value={size || "—"} />
                  <SummaryRow label="Paper" value={paper || "—"} />
                  <SummaryRow label="Finish" value={finish || "—"} />
                  <SummaryRow label="Sides" value={sides || "—"} />
                  <SummaryRow label="Quantity" value={quantity || "—"} />
                  <SummaryRow label="Per Piece" value={unitPrice ? formatMoney(unitPrice) : "—"} />
                </div>

                {bestValue?.quantity && (
                  <div className="mt-5 rounded-[20px] border border-amber-300 bg-amber-50 p-4">
                    <div className="text-sm font-semibold text-amber-700">Best Value Quantity</div>
                    <div className="mt-1 text-3xl font-extrabold text-slate-900">{bestValue.quantity}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {formatMoney(bestValue.price)} total · {formatMoney(bestValue.unitPrice)} each
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-[24px] bg-gradient-to-br from-[#2457f5] to-[#0e98ff] p-5 text-white shadow-lg">
                  <div className="text-sm font-medium text-blue-100">
                    Estimated Total
                  </div>

                  <div className="mt-1 text-4xl font-extrabold">
                    {subtotal ? formatMoney(subtotal + shippingPreview) : "—"}
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-blue-100">
                    <div className="flex justify-between">
                      <span>Print Price</span>
                      <span>{subtotal ? formatMoney(subtotal) : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatMoney(shippingPreview)}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/20 pt-3 text-xs text-blue-100">
                    <div>✓ Secure Checkout</div>
                    <div>✓ High Quality Printing</div>
                    <div>✓ Fast Turnaround</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="mt-5 w-full rounded-[20px] bg-[#2457f5] px-5 py-4 text-base font-bold text-white transition hover:bg-[#1848db] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {uploadingArtwork ? "Uploading Artwork..." : "Upload & Continue to Checkout"}
                </button>

                {!artworkFile && (
                  <p className="mt-3 text-center text-xs text-red-500">
                    Please upload artwork before continuing.
                  </p>
                )}

                <p className="mt-3 text-center text-xs text-slate-500">
                  Final shipping and payment details will be completed on the next step.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-[18px] bg-slate-100 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function OptionField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#2457f5] focus:ring-2 focus:ring-blue-100"
      >
        {options.length === 0 ? (
          <option value="">No options available</option>
        ) : (
          options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

function SummaryRow({ label, value, noBorder = false }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${noBorder ? "" : "border-b border-slate-100 pb-3"}`}>
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}