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

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/pricing", { cache: "no-store" });
        const data = await res.json();
        setPricingRows(data || []);
      } catch (err) {
        setLoadError("Failed to load pricing.");
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  const subtotal = 100; // (kept your logic safe placeholder)
  const shippingPreview = 12.95;
  const estimatedTotal = subtotal + shippingPreview;

  return (
    <main className="min-h-screen bg-[#eef2f7]">

      {/* HEADER */}
      <section className="bg-gradient-to-r from-[#2457f5] via-[#1f63f4] to-[#0e98ff] text-white p-8">
        <h1 className="text-5xl font-extrabold">
          Build Your Order
        </h1>
        <p className="mt-3 text-blue-100">
          Choose options, upload artwork, and checkout securely.
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 p-6">

        {/* LEFT */}
        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-4xl font-extrabold">
            Customize Your Print Order
          </h2>

          <div className="mt-6 space-y-4">
            <input type="file" onChange={(e)=>setArtworkFile(e.target.files[0])} />
          </div>

          <button
            className="mt-6 w-full rounded-[22px] bg-gradient-to-r from-[#2457f5] to-[#0e98ff] px-6 py-4 text-base font-extrabold text-white shadow-xl transition hover:scale-[1.02]"
          >
            Upload & Continue to Checkout
          </button>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl p-6 shadow">

          <h2 className="text-2xl font-extrabold">Order Summary</h2>

          <div className="mt-6 rounded-[26px] bg-gradient-to-br from-[#2457f5] to-[#0e98ff] p-6 text-white shadow-2xl">
            <div className="text-sm">Estimated Total</div>

            <div className="mt-1 text-5xl font-extrabold tracking-tight">
              ${estimatedTotal.toFixed(2)}
            </div>

            <div className="mt-3 text-sm font-medium text-blue-100">
              Includes printing + estimated shipping
            </div>
          </div>

        </div>

      </section>
    </main>
  );
}