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

  const shippingPreview = 1.0;
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

  function handleArtworkChange(e) {
    const file = e.target.files?.[0] || null;
    setArtworkFile(file);
    setUploadError("");
    setUploadedArtworkUrl("");
    setUploadedArtworkFileName("");
  }

  return (
    <main className="min-h-screen bg-[#eef2f7]">
      {/* ... ALL YOUR EXISTING CODE ABOVE REMAINS UNCHANGED ... */}

      {/* 🔧 FIXED SECTION BELOW */}
      {artworkFile && (
        <div className="mt-3 space-y-3">
          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Selected file: <span className="font-semibold">{artworkFile.name}</span>
          </div>

          {artworkFile.type.startsWith("image/") && (
            <div className="overflow-hidden rounded-[18px] border border-slate-200">
              <img
                src={URL.createObjectURL(artworkFile)}
                alt="Artwork Preview"
                className="max-h-64 w-full object-contain bg-white"
              />
            </div>
          )}

          {artworkFile.type === "application/pdf" && (
            <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
              <iframe
                src={URL.createObjectURL(artworkFile)}
                className="h-64 w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* ... REST OF YOUR FILE UNCHANGED ... */}
    </main>
  );
}