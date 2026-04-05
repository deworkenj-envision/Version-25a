"use client";

import { useMemo, useState } from "react";

export default function OrderPage() {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    productName: "Business Cards",
    quantity: 100,
    paper: "Standard",
    finish: "Matte",
    size: "",
    sides: "",
    notes: "",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState("");

  const subtotal = useMemo(() => {
    return Number(form.quantity || 0) * 0.25;
  }, [form.quantity]);

  const shipping = 0;
  const total = subtotal + shipping;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
          total,
          subtotal,
          shipping,

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
          Choose your product, paper, finish, upload artwork, and continue to payment.
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
              <option value="Business Cards">Business Cards</option>
              <option value="Flyers">Flyers</option>
              <option value="Postcards">Postcards</option>
              <option value="Banners">Banners</option>
              <option value="Brochures">Brochures</option>
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
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Gloss">Gloss</option>
              <option value="Recycled">Recycled</option>
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
              <option value="Matte">Matte</option>
              <option value="Glossy">Glossy</option>
              <option value="Soft Touch">Soft Touch</option>
              <option value="Uncoated">Uncoated</option>
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
              <option value="">Select sides</option>
              <option value="Front Only">Front Only</option>
              <option value="Front and Back">Front and Back</option>
            </select>
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

          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            <div className="flex items-center justify-between py-1">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
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