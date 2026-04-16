"use client";

import { useEffect, useMemo, useState } from "react";

const PRODUCT_OPTIONS = {
  "Business Cards": {
    sizes: ["3.5 x 2"],
    papers: ["Standard"],
    finishes: ["Matte", "Gloss"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100],
    description:
      "Professional business cards with clean finishes and sharp print quality.",
  },
  Flyers: {
    sizes: ["8.5 x 11"],
    papers: ["100lb Gloss Text"],
    finishes: ["Gloss"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100],
    description:
      "High-impact flyers for promotions, events, menus, and handouts.",
  },
  Postcards: {
    sizes: ["4 x 6"],
    papers: ["14pt"],
    finishes: ["Matte"],
    sides: ["Front Only", "Front and Back"],
    quantities: [100],
    description:
      "Premium postcards perfect for marketing, direct mail, and announcements.",
  },
  Banners: {
    sizes: ["2 x 4"],
    papers: ["13oz Vinyl"],
    finishes: ["Matte"],
    sides: ["Front Only"],
    quantities: [1],
    description:
      "Durable indoor and outdoor banners with vibrant full-color printing.",
  },
};

const SHIPPING_FLAT_RATE = 9.95;

function formatMoney(value) {
  const number = Number(value || 0);
  return `$${number.toFixed(2)}`;
}

export default function OrderPage() {
  const defaultProduct = "Business Cards";

  const [productName, setProductName] = useState(defaultProduct);
  const [size, setSize] = useState(PRODUCT_OPTIONS[defaultProduct].sizes[0]);
  const [paper, setPaper] = useState(PRODUCT_OPTIONS[defaultProduct].papers[0]);
  const [finish, setFinish] = useState(PRODUCT_OPTIONS[defaultProduct].finishes[0]);
  const [sides, setSides] = useState(PRODUCT_OPTIONS[defaultProduct].sides[0]);
  const [quantity, setQuantity] = useState(PRODUCT_OPTIONS[defaultProduct].quantities[0]);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [livePrice, setLivePrice] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [artworkFile, setArtworkFile] = useState(null);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [uploadedArtwork, setUploadedArtwork] = useState(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentOptions = useMemo(() => {
    return PRODUCT_OPTIONS[productName] || PRODUCT_OPTIONS[defaultProduct];
  }, [productName]);

  const subtotal = Number(livePrice || 0);
  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const options = PRODUCT_OPTIONS[productName];
    if (!options) return;

    setSize(options.sizes[0] || "");
    setPaper(options.papers[0] || "");
    setFinish(options.finishes[0] || "");
    setSides(options.sides[0] || "");
    setQuantity(options.quantities[0] || 0);
    setLivePrice(null);
  }, [productName]);

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
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
                EnVision Direct
              </div>

              <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                Top Quality Printing.
                <br />
                Fast Turnaround.
                <br />
                The Best Prices.
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-blue-50">
                Choose your product, upload print-ready artwork, and get a live
                price instantly.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/15 px-4 py-2">Business Cards</span>
                <span className="rounded-full bg-white/15 px-4 py-2">Flyers</span>
                <span className="rounded-full bg-white/15 px-4 py-2">Postcards</span>
                <span className="rounded-full bg-white/15 px-4 py-2">Banners</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
                Live Estimate
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Selected Product</div>
                <div className="mt-1 text-2xl font-bold">{productName}</div>
                <p className="mt-2 text-sm text-slate-600">
                  {currentOptions.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-slate-500">Subtotal</div>
                    <div className="mt-1 font-semibold">{formatMoney(subtotal)}</div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-slate-500">Shipping</div>
                    <div className="mt-1 font-semibold">{formatMoney(shipping)}</div>
                  </div>
                  <div className="col-span-2 rounded-xl bg-blue-700 p-4 text-white">
                    <div className="text-blue-100">Estimated Total</div>
                    <div className="mt-1 text-3xl font-bold">
                      {pricingLoading ? "Loading..." : formatMoney(total)}
                    </div>
                  </div>
                </div>

                {livePrice === null && !pricingLoading ? (
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
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Build Your Order</h2>
              <p className="mt-2 text-slate-600">
                Select your print options below. Pricing updates automatically from
                your live pricing table.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Product">
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="input"
                >
                  {Object.keys(PRODUCT_OPTIONS).map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Size">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="input"
                >
                  {currentOptions.sizes.map((option) => (
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
                >
                  {currentOptions.papers.map((option) => (
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
                >
                  {currentOptions.finishes.map((option) => (
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
                >
                  {currentOptions.sides.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Quantity">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input"
                >
                  {currentOptions.quantities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
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

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="text-base font-semibold text-slate-900">Upload Artwork</div>
              <p className="mt-1 text-sm text-slate-600">
                Upload your print-ready file before checkout.
              </p>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setArtworkFile(file);
                    setUploadedArtwork(null);
                    setMessage("");
                  }}
                  className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
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
                <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Uploaded: <span className="font-semibold">{uploadedArtwork.fileName}</span>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Order Summary</h3>

            <div className="mt-6 space-y-4">
              <SummaryRow label="Product" value={productName} />
              <SummaryRow label="Size" value={size} />
              <SummaryRow label="Paper" value={paper} />
              <SummaryRow label="Finish" value={finish} />
              <SummaryRow label="Sides" value={sides} />
              <SummaryRow label="Quantity" value={String(quantity)} />
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Print Price</span>
                <span>{pricingLoading ? "Loading..." : formatMoney(subtotal)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>{formatMoney(shipping)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>{pricingLoading ? "Loading..." : formatMoney(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={
                checkoutLoading ||
                uploadingArtwork ||
                livePrice === null ||
                !uploadedArtwork?.publicUrl
              }
              className="mt-8 w-full rounded-2xl bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "Starting Checkout..." : "Proceed to Checkout"}
            </button>

            <p className="mt-3 text-center text-sm text-slate-500">
              Artwork upload is required before checkout.
            </p>

            {message ? (
              <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
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
          padding: 0.9rem 1rem;
          font-size: 0.95rem;
          color: #0f172a;
          outline: none;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
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