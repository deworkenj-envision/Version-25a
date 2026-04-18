"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

const PRODUCT_IMAGES = {
  "business-cards": "/images/business-cards.jpg",
  postcards: "/images/postcards.jpg",
  flyers: "/images/flyers.jpg",
  banners: "/images/banners.jpg",
};

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
  const [requestedImage, setRequestedImage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const qpProduct =
      params.get("product") ||
      params.get("productName") ||
      params.get("name") ||
      "";

    const qpImage =
      params.get("image") ||
      params.get("thumbnail") ||
      params.get("thumb") ||
      "";

    setRequestedProduct(normalize(qpProduct));
    setRequestedImage(normalize(qpImage));
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPricing() {
      try {
        setLoading(true);
        setLoadError("");

        const res = await fetch("/api/pricing", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Unable to load pricing.");
        }

        const data = await res.json();
        const rows = Array.isArray(data)
          ? data
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
          .filter((row) => row.product_name && row.quantity);

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

    if (requestedProduct) {
      const exactMatch = products.find(
        (p) => normalize(p).toLowerCase() === requestedProduct.toLowerCase()
      );

      if (exactMatch) {
        setProductName(exactMatch);
        return;
      }

      const slugMatch = products.find(
        (p) => slugify(p) === slugify(requestedProduct)
      );

      if (slugMatch) {
        setProductName(slugMatch);
        return;
      }
    }

    if (!productName) {
      setProductName(products[0]);
    }
  }, [products, requestedProduct, productName]);

  const productImage = useMemo(() => {
    if (requestedImage) return requestedImage;
    return PRODUCT_IMAGES[slugify(productName)] || "";
  }, [productName, requestedImage]);

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
    if (!sizeOptions.includes(size)) {
      setSize(sizeOptions[0]);
    }
  }, [sizeOptions, size]);

  const rowsForSize = useMemo(() => {
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
    if (!paperOptions.includes(paper)) {
      setPaper(paperOptions[0]);
    }
  }, [paperOptions, paper]);

  const rowsForPaper = useMemo(() => {
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
    if (!finishOptions.includes(finish)) {
      setFinish(finishOptions[0]);
    }
  }, [finishOptions, finish]);

  const rowsForFinish = useMemo(() => {
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
    if (!sidesOptions.includes(sides)) {
      setSides(sidesOptions[0]);
    }
  }, [sidesOptions, sides]);

  const rowsForSides = useMemo(() => {
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
    if (!quantityOptions.includes(quantity)) {
      setQuantity(quantityOptions[0]);
    }
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

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium">
              Custom Print Ordering
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Build your order with live pricing
            </h1>
            <p className="mt-3 max-w-2xl text-base text-blue-100 sm:text-lg">
              Choose your options, upload your artwork, and continue to checkout with everything ready.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">Loading pricing...</div>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we load your print options.
            </p>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <div className="text-lg font-semibold">Pricing could not be loaded</div>
            <p className="mt-2 text-sm">{loadError}</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="bg-slate-100">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName || "Selected product"}
                        className="h-full min-h-[240px] w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[240px] items-center justify-center p-6 text-center text-sm text-slate-500">
                        Product image preview
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                      Selected Product
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {productName || "Choose your product"}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600">
                      Your product selection from the homepage should appear here, along with its preview image.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                        Live pricing
                      </div>
                      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                        Smart options
                      </div>
                      <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                        Artwork required
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Configure your product</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Available selections automatically update based on the options you choose.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <OptionField
                    label="Product"
                    value={productName}
                    onChange={setProductName}
                    options={products}
                  />
                  <OptionField
                    label="Size"
                    value={size}
                    onChange={setSize}
                    options={sizeOptions}
                  />
                  <OptionField
                    label="Paper"
                    value={paper}
                    onChange={setPaper}
                    options={paperOptions}
                  />
                  <OptionField
                    label="Finish"
                    value={finish}
                    onChange={setFinish}
                    options={finishOptions}
                  />
                  <OptionField
                    label="Sides"
                    value={sides}
                    onChange={setSides}
                    options={sidesOptions}
                  />
                  <OptionField
                    label="Quantity"
                    value={quantity}
                    onChange={setQuantity}
                    options={quantityOptions}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Artwork & instructions</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Artwork upload is required before checkout.
                </p>

                <div className="mt-5 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Upload Artwork
                    </label>

                    <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {artworkFile ? artworkFile.name : "Click to choose your print-ready file"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          PDF, JPG, PNG, AI, PSD, EPS and other print-ready formats
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleArtworkChange}
                      />
                    </label>

                    {artworkFile && (
                      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        Selected file: <span className="font-semibold">{artworkFile.name}</span>
                      </div>
                    )}

                    {uploadedArtworkUrl && (
                      <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        Uploaded successfully:{" "}
                        <span className="font-semibold">
                          {uploadedArtworkFileName || artworkFile?.name || "Artwork file"}
                        </span>
                      </div>
                    )}

                    {uploadError && (
                      <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-blue-900 to-sky-700 px-6 py-5 text-white">
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                  <p className="mt-1 text-sm text-blue-100">
                    Review your selections before checkout
                  </p>
                </div>

                <div className="space-y-5 p-6">
                  <SummaryRow label="Product" value={productName || "—"} />
                  <SummaryRow label="Size" value={size || "—"} />
                  <SummaryRow label="Paper" value={paper || "—"} />
                  <SummaryRow label="Finish" value={finish || "—"} />
                  <SummaryRow label="Sides" value={sides || "—"} />
                  <SummaryRow label="Quantity" value={quantity || "—"} />
                  <SummaryRow
                    label="Artwork"
                    value={artworkFile ? artworkFile.name : "Required before checkout"}
                  />

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Unit Price</span>
                      <span>{unitPrice ? formatMoney(unitPrice) : "—"}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>{subtotal ? formatMoney(subtotal) : "—"}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                        <span>Starting Total</span>
                        <span>{subtotal ? formatMoney(subtotal) : "—"}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="w-full rounded-2xl bg-blue-700 px-5 py-4 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {uploadingArtwork ? "Uploading Artwork..." : "Upload & Continue to Checkout"}
                  </button>

                  {!artworkFile && (
                    <p className="text-center text-xs text-red-500">
                      Please upload artwork before continuing.
                    </p>
                  )}

                  <p className="text-center text-xs text-slate-500">
                    Final shipping and payment details will be completed on the next step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function OptionField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}