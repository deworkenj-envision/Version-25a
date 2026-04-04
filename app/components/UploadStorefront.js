"use client";
import { useMemo, useState } from "react";
import { acceptedFiles, products } from "../lib/products";
import ProductVisual from "./ProductVisual";

export default function order-artworkworkworktorefront() {
  const [product, setProduct] = useState(products[0].slug);
  const [quantity, setQuantity] = useState("500");
  const [notes, setNotes] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [uploadName, setUploadName] = useState("");
  const currentProduct = useMemo(() => products.find((p) => p.slug === product) || products[0], [product]);

  function saveDraft() {
    if (typeof window === "undefined") return;
    localStorage.setItem("printluxe-v35-upload-draft", JSON.stringify({ product, quantity, notes, contactName, email, uploadName }));
    alert("Draft saved locally in this browser.");
  }
  function loadDraft() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("printluxe-v35-upload-draft");
    if (!raw) return alert("No saved draft found.");
    const d = JSON.parse(raw);
    setProduct(d.product || products[0].slug);
    setQuantity(d.quantity || "500");
    setNotes(d.notes || "");
    setContactName(d.contactName || "");
    setEmail(d.email || "");
    setUploadName(d.uploadName || "");
    alert("Draft loaded.");
  }

  return (
    <div className="layout">
      <aside className="card sidebar">
        <div className="grid" style={{ gap: 20 }}>
          <div>
            <div className="badge">Step 1</div>
            <h2 className="section-title" style={{ marginTop: 10 }}>Choose a product</h2>
            <div className="subtle">Pick the print item you need, then upload finished artwork.</div>
          </div>
          <div className="list">
            {products.map((item) => (
              <button key={item.slug} className={`selector ${product === item.slug ? "selected" : ""}`} onClick={() => setProduct(item.slug)}>
                <div className="badge">{item.badge}</div>
                <div style={{ fontWeight: 800, marginTop: 10 }}>{item.name}</div>
                <div className="subtle" style={{ fontSize: 13 }}>{item.size}</div>
                <div className="subtle" style={{ marginTop: 6 }}>{item.lead}</div>
                <div style={{ marginTop: 10, fontWeight: 800 }}>Starting at {item.starting}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="grid" style={{ gap: 20 }}>
        <div className="card card-pad">
          <div className="page-head" style={{ margin: "0 0 16px" }}>
            <div>
              <div className="badge">Step 2</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>Upload print-ready artwork</h2>
              <div className="subtle">Accepted file types: {acceptedFiles.join(", ")}.</div>
            </div>
          </div>
          <div className="upload-box">
            <p style={{ marginTop: 0, fontSize: 20, fontWeight: 800 }}>Upload your finished design</p>
            <div className="subtle" style={{ marginBottom: 14 }}>Designed for customers who already have a file ready to print.</div>
            <input className="input" type="file" accept=".pdf,.png,.jpg,.jpeg,.svg" onChange={(e) => setUploadName(e.target.files?.[0]?.name || "")} />
            <p className="subtle" style={{ marginBottom: 0, marginTop: 14 }}>{uploadName ? `Selected file: ${uploadName}` : "Choose a file to continue."}</p>
          </div>
        </div>

        <div className="card card-pad">
          <div className="page-head" style={{ margin: "0 0 16px" }}>
            <div>
              <div className="badge">Step 3</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>Order details</h2>
              <div className="subtle">Only the fields visitors need to complete the order.</div>
            </div>
          </div>
          <div className="controls">
            <div className="grid grid-2">
              <input className="input" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact name" />
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
            </div>
            <div className="grid grid-2">
              <select className="select" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                <option value="100">100</option><option value="250">250</option><option value="500">500</option><option value="1000">1000</option>
              </select>
              <input className="input" value={currentProduct.name} readOnly />
            </div>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions, finishing notes, or job details" />
            <div className="toolbar">
              <button className="btn btn-secondary" onClick={saveDraft}>Save Draft</button>
              <button className="btn btn-secondary" onClick={loadDraft}>Load Draft</button>
              <a className="btn btn-primary" href="/dashboard">Continue to Checkout</a>
            </div>
          </div>
        </div>
      </section>

      <aside className="preview">
        <div className="page-head" style={{ margin: "0 0 16px" }}>
          <div>
            <div className="badge">Order Preview</div>
            <h2 className="section-title" style={{ marginTop: 10 }}>A clearer order summary</h2>
            <div className="subtle">Show visitors the product, file status, and job details in one place.</div>
          </div>
        </div>
        <div className="preview-stage">
          <div className="preview-art">
            <ProductVisual type={currentProduct.visual} />
            <div>
              <div className="badge">{currentProduct.size}</div>
              <h3 style={{ margin: "12px 0 6px", fontSize: 30 }}>{currentProduct.name}</h3>
              <div className="subtle">{currentProduct.description}</div>
            </div>
            <div className="finish-row">
              {currentProduct.finishes.map((finish) => <div key={finish} className="finish">{finish}</div>)}
            </div>
            <div className="preview-file">
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Artwork Upload</div>
              <div className="subtle">{uploadName || "No file selected yet"}</div>
            </div>
            <div className="grid grid-2">
              <div className="card card-pad"><div className="subtle">Quantity</div><strong style={{ fontSize: 28 }}>{quantity}</strong></div>
              <div className="card card-pad"><div className="subtle">Starting Price</div><strong style={{ fontSize: 28 }}>{currentProduct.starting}</strong></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
