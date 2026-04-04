"use client";

import { useState } from "react";

const PRODUCTS = [
  "Business Cards",
  "Flyers",
  "Postcards",
  "Brochures",
  "Banners",
  "Yard Signs",
];

export default function UploadPage() {
  const [selectedProduct, setSelectedProduct] = useState("Business Cards");
  const [quantity, setQuantity] = useState("500");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setMessage("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-artwork", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage(`Upload successful: ${data.fileName}`);
    } catch (err) {
      setMessage(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Upload Artwork</h1>
      <p style={{ marginBottom: "30px", color: "#666" }}>
        Choose your product and upload your print-ready file.
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        <div>
          <label htmlFor="product" style={{ display: "block", marginBottom: "8px" }}>
            Product
          </label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{ padding: "10px", width: "100%" }}
          >
            {PRODUCTS.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" style={{ display: "block", marginBottom: "8px" }}>
            Quantity
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ padding: "10px", width: "100%" }}
          >
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="2500">2500</option>
          </select>
        </div>

        <div>
          <label htmlFor="artwork" style={{ display: "block", marginBottom: "8px" }}>
            Upload file
          </label>
          <input
            id="artwork"
            type="file"
            onChange={handleFileChange}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        {fileName ? <p>Selected file: {fileName}</p> : null}
        {uploading ? <p>Uploading...</p> : null}
        {message ? <p>{message}</p> : null}
      </div>
    </main>
  );
}