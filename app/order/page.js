"use client";

import { useMemo, useState } from "react";

const PRODUCT_OPTIONS = [
  "Business Cards",
  "Flyers",
  "Postcards",
  "Banners",
  "Brochures",
];

const PAPER_OPTIONS = ["Standard", "Premium", "Gloss", "Recycled"];
const FINISH_OPTIONS = ["Matte", "Glossy", "Soft Touch", "Uncoated"];
const SIDES_OPTIONS = ["Front Only", "Front and Back"];

const PRICING = {
  "Business Cards": {
    baseUnitPrice: 0.25,
    paperUpcharges: {
      Standard: 0,
      Premium: 0.05,
      Gloss: 0.04,
      Recycled: 0.03,
    },
    finishUpcharges: {
      Matte: 0,
      Glossy: 0.03,
      "Soft Touch": 0.08,
      Uncoated: 0,
    },
    sidesMultiplier: {
      "Front Only": 1,
      "Front and Back": 1.15,
    },
  },

  Flyers: {
    baseUnitPrice: 0.35,
    paperUpcharges: {
      Standard: 0,
      Premium: 0.07,
      Gloss: 0.05,
      Recycled: 0.04,
    },
    finishUpcharges: {
      Matte: 0,
      Glossy: 0.04,
      "Soft Touch": 0.1,
      Uncoated: 0,
    },
    sidesMultiplier: {
      "Front Only": 1,
      "Front and Back": 1.2,
    },
  },

  Postcards: {
    baseUnitPrice: 0.45,
    paperUpcharges: {
      Standard: 0,
      Premium: 0.08,
      Gloss: 0.06,
      Recycled: 0.05,
    },
    finishUpcharges: {
      Matte: 0,
      Glossy: 0.05,
      "Soft Touch": 0.12,
      Uncoated: 0,
    },
    sidesMultiplier: {
      "Front Only": 1,
      "Front and Back": 1.15,
    },
  },

  Banners: {
    baseUnitPrice: 3.5,
    paperUpcharges: {
      Standard: 0,
      Premium: 0.5,
      Gloss: 0.35,
      Recycled: 0.25,
    },
    finishUpcharges: {
      Matte: 0,
      Glossy: 0.25,
      "Soft Touch": 0.4,
      Uncoated: 0,
    },
    sidesMultiplier: {
      "Front Only": 1,
      "Front and Back": 1.25,
    },
  },

  Brochures: {
    baseUnitPrice: 0.65,
    paperUpcharges: {
      Standard: 0,
      Premium: 0.1,
      Gloss: 0.08,
      Recycled: 0.06,
    },
    finishUpcharges: {
      Matte: 0,
      Glossy: 0.06,
      "Soft Touch": 0.14,
      Uncoated: 0,
    },
    sidesMultiplier: {
      "Front Only": 1,
      "Front and Back": 1.2,
    },
  },
};

function getPricingConfig(productName) {
  return PRICING[productName] || PRICING["Business Cards"];
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function OrderPage() {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    productName: "Business Cards",
    quantity: 100,
    paper: "Standard",
    finish: "Matte",
    size: "",
    sides: "Front Only",
    notes: "",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState("");

  const pricing = useMemo(() => {
    const config = getPricingConfig(form.productName);
    const quantity = Number(form.quantity || 0);

    const baseUnitPrice = Number(config.baseUnitPrice || 0);
    const paperUpcharge = Number(config.paperUpcharges?.[form.paper] || 0);
    const finishUpcharge = Number(config.finishUpcharges?.[form.finish] || 0);
    const sidesMultiplier = Number(config.sidesMultiplier?.[form.sides] || 1);

    const unitPriceBeforeMultiplier =
      baseUnitPrice + paperUpcharge + finishUpcharge;

    const finalUnitPrice = unitPriceBeforeMultiplier * sidesMultiplier;
    const subtotal = quantity * finalUnitPrice;

    const shipping =
      form.productName === "Banners"
        ? quantity > 1
          ? 18
          : 12
        : subtotal >= 100
        ? 0
        : 9.95;

    const total = subtotal + shipping;

    return {
      baseUnitPrice,
      paperUpcharge,
      finishUpcharge,
      sidesMultiplier,
      finalUnitPrice,
      subtotal,
      shipping,
      total,
    };
  }, [form.productName, form.quantity, form.paper, form.finish, form.sides]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose a file first.");
      return null;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-artwork", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setUploadedFile(data);
      setMessage("Artwork uploaded successfully.");
      return data;
    } catch (err) {
      setMessage(err.message || "Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setMessage("");

    let uploadData = uploadedFile;

    if (!file && !uploadedFile) {
      setMessage("Please upload your artwork before continuing to payment.");
      return;
    }

    if (file && !uploadedFile) {
      uploadData = await handleUpload();
      if (!uploadData) return;
    }

    if (!uploadData?.publicUrl && !uploadData?.filePath) {
      setMessage("Artwork upload is required before checkout.");
      return;
    }

    try {
      setMessage("Creating checkout session...");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: form.productName,
          quantity: Number(form.quantity),
          total: pricing.total,
          subtotal: pricing.subtotal,
          shipping: pricing.shipping,

          customerName: form.customerName,
          customerEmail: form.customerEmail,

          paper: form.paper,
          finish: form.finish,
          size: form.size,
          sides: form.sides,
          notes: form.notes,

          artworkUrl: uploadData?.publicUrl || "",
          filePath: uploadData?.filePath || "",
          fileName: uploadData?.fileName || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed.");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("Checkout session created, but no redirect URL was returned.");
    } catch (err) {
      setMessage(err.message || "Checkout failed.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Place Your Order</h1>
        <p className="mb-8 text-gray-600">
          Choose your product, customize options, upload artwork, and continue to payment.
        </p>

        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label htmlFor="customerName" className="mb-2 block font-medium">
              Full Name
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={form.customerName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="customerEmail" className="mb-2 block font-medium">
              Email Address
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="productName" className="mb-2 block font-medium">
              Product
            </label>
            <select
              id="productName"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            >
              {PRODUCT_OPTIONS.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="mb-2 block font-medium">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="paper" className="mb-2 block font-medium">
              Paper
            </label>
            <select
              id="paper"
              name="paper"
              value={form.paper}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            >
              {PAPER_OPTIONS.map((paper) => (
                <option key={paper} value={paper}>
                  {paper}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="finish" className="mb-2 block font-medium">
              Finish
            </label>
            <select
              id="finish"
              name="finish"
              value={form.finish}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            >
              {FINISH_OPTIONS.map((finish) => (
                <option key={finish} value={finish}>
                  {finish}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="size" className="mb-2 block font-medium">
              Size
            </label>
            <input
              id="size"
              name="size"
              type="text"
              value={form.size}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              placeholder='Example: 3.5" x 2"'
            />
          </div>

          <div>
            <label htmlFor="sides" className="mb-2 block font-medium">
              Sides
            </label>
            <select
              id="sides"
              name="sides"
              value={form.sides}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            >
              {SIDES_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Live Pricing
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Base unit price</span>
                <span>{formatMoney(pricing.baseUnitPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Paper upcharge</span>
                <span>{formatMoney(pricing.paperUpcharge)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Finish upcharge</span>
                <span>{formatMoney(pricing.finishUpcharge)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sides multiplier</span>
                <span>{pricing.sidesMultiplier.toFixed(2)}x</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span>Final unit price</span>
                <span>{formatMoney(pricing.finalUnitPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(pricing.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{formatMoney(pricing.shipping)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatMoney(pricing.total)}</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="artworkFile" className="mb-2 block font-medium">
              Upload Artwork
            </label>
            <input
              id="artworkFile"
              name="artworkFile"
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setUploadedFile(null);
                setMessage("");
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              accept=".pdf,.png,.jpg,.jpeg,.ai,.eps"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block font-medium">
              Order Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              placeholder="Add any print instructions here..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !file}
              className="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Artwork"}
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 text-white"
            >
              Continue to Payment
            </button>
          </div>

          {uploadedFile?.fileName && (
            <p className="text-sm text-green-600">
              Uploaded: {uploadedFile.fileName}
            </p>
          )}

          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </main>
  );
}