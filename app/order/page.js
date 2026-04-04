"use client";

import { useState } from "react";

export default function OrderPage() {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    productName: "Business Cards",
    quantity: 100,
    notes: "",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState("");

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

    let uploadData = uploadedFile;

    if (file && !uploadedFile) {
      uploadData = await handleUpload();
      if (!uploadData) return;
    }

    try {
      setMessage("Creating checkout session...");

      const total = Number(form.quantity) * 0.25;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: form.productName,
          quantity: Number(form.quantity),
          total,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          artworkUrl: uploadData?.publicUrl || "",
          artworkPath: uploadData?.filePath || "",
          notes: form.notes,
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
          Choose your product, upload artwork, and continue to payment.
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
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              accept=".pdf,.png,.jpg,.jpeg,.ai,.eps"
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