"use client";

import { useMemo, useState } from "react";
import PremiumTemplateMockup from "./PremiumTemplateMockup";
import { products, templates, steps } from "../lib/designerData";

export default function PremiumDesigner() {
  const [product, setProduct] = useState(products[0].slug);
  const [method, setMethod] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates.find((t) => t.product === products[0].slug)?.id || ""
  );
  const [brandName, setBrandName] = useState("Envision Direct");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("Premium print that looks ready to sell.");
  const [cta, setCta] = useState("");
  const [contact, setContact] = useState("555-123-4567 • envisiondirect.net");
  const [logoText, setLogoText] = useState("ED");
  const [accent, setAccent] = useState("");
  const [bg, setBg] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  const filtered = useMemo(() => templates.filter((t) => t.product === product), [product]);
  const currentTemplate = useMemo(
    () => filtered.find((t) => t.id === selectedTemplate) || filtered[0],
    [filtered, selectedTemplate]
  );

  function chooseProduct(slug) {
    setProduct(slug);
    const first = templates.find((t) => t.product === slug);
    setSelectedTemplate(first?.id || "");
    setActiveStep(2);
  }

  function chooseMethod(next) {
    setMethod(next);
    setActiveStep(3);
  }

  function saveDraft() {
    const payload = {
      product, method, selectedTemplate, brandName, headline, subheadline,
      cta, contact, logoText, accent, bg, uploadName
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("printluxe-v27-designer-draft", JSON.stringify(payload));
      alert("Draft saved locally in this browser.");
    }
  }

  function loadDraft() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("printluxe-v27-designer-draft");
    if (!raw) return alert("No saved draft found yet.");
    const d = JSON.parse(raw);
    setProduct(d.product || products[0].slug);
    setMethod(d.method || "template");
    setSelectedTemplate(d.selectedTemplate || "");
    setBrandName(d.brandName || "Envision Direct");
    setHeadline(d.headline || "");
    setSubheadline(d.subheadline || "Premium print that looks ready to sell.");
    setCta(d.cta || "");
    setContact(d.contact || "555-123-4567 • envisiondirect.net");
    setLogoText(d.logoText || "ED");
    setAccent(d.accent || "");
    setBg(d.bg || "");
    setUploadName(d.uploadName || "");
    setActiveStep(3);
    alert("Draft loaded.");
  }

  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="stepper">
        {steps.map((step) => (
          <div key={step.id} className={`step ${activeStep >= step.id ? "active" : ""}`}>
            <strong>Step {step.id}</strong>
            <small>{step.title}</small>
          </div>
        ))}
      </div>

      <div className="designer-layout">
        <div className="grid" style={{ gap: 20 }}>
          <section className="card panel">
            <div className="page-head" style={{ margin: "0 0 16px" }}>
              <div>
                <div className="badge">Step 1</div>
                <h2 className="section-title" style={{ marginTop: 10 }}>Choose your product</h2>
                <div className="subtle">Start with the product you want to print. Templates change automatically by product.</div>
              </div>
            </div>
            <div className="grid grid-4">
              {products.map((item) => (
                <button
                  key={item.slug}
                  className={`card product-card ${product === item.slug ? "selected" : ""}`}
                  onClick={() => chooseProduct(item.slug)}
                  style={{ textAlign: "left", border: "1px solid var(--line)", cursor: "pointer" }}
                >
                  <div className="badge">{item.badge}</div>
                  <h3 style={{ margin: "6px 0 0" }}>{item.name}</h3>
                  <div className="subtle" style={{ fontSize: 13 }}>{item.size}</div>
                  <div className="subtle">{item.blurb}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="card panel">
            <div className="page-head" style={{ margin: "0 0 16px" }}>
              <div>
                <div className="badge">Step 2</div>
                <h2 className="section-title" style={{ marginTop: 10 }}>Choose how you want to design</h2>
                <div className="subtle">Use a polished starter template or upload finished artwork.</div>
              </div>
            </div>
            <div className="method-grid">
              <button className={`method-card ${method === "template" ? "selected" : ""}`} onClick={() => chooseMethod("template")} style={{ textAlign: "left" }}>
                <div className="method-icon">✦</div>
                <h3 style={{ margin: "14px 0 8px" }}>Use a Template</h3>
                <div className="subtle">Choose from built-in starter layouts, then customize text, colors, and branding.</div>
              </button>
              <button className={`method-card ${method === "upload" ? "selected" : ""}`} onClick={() => chooseMethod("upload")} style={{ textAlign: "left" }}>
                <div className="method-icon">↑</div>
                <h3 style={{ margin: "14px 0 8px" }}>Upload My Own Design</h3>
                <div className="subtle">For customers who already have finished artwork and just need it printed.</div>
              </button>
            </div>
          </section>

          {method === "template" ? (
            <>
              <section className="card panel">
                <div className="page-head" style={{ margin: "0 0 16px" }}>
                  <div>
                    <div className="badge">Step 3</div>
                    <h2 className="section-title" style={{ marginTop: 10 }}>Pick a premium starter template</h2>
                    <div className="subtle">Larger, cleaner thumbnails make it easier to choose the right direction.</div>
                  </div>
                </div>
                <div className="template-grid">
                  {filtered.map((template) => (
                    <button key={template.id} className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`} onClick={() => setSelectedTemplate(template.id)} style={{ textAlign: "left" }}>
                      <div className="thumb-wrap"><PremiumTemplateMockup template={template} /></div>
                      <div className="template-meta">
                        <div><strong>{template.title}</strong><div className="subtle" style={{ fontSize: 13 }}>{template.category}</div></div>
                        <div className="badge">{template.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="card panel">
                <div className="page-head" style={{ margin: "0 0 16px" }}>
                  <div>
                    <div className="badge">Edit</div>
                    <h2 className="section-title" style={{ marginTop: 10 }}>Customize the selected template</h2>
                    <div className="subtle">Only the most important fields are shown, so the screen feels cleaner and less intimidating.</div>
                  </div>
                </div>
                <div className="controls">
                  <input className="input" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Business name" />
                  <div className="grid grid-2">
                    <input className="input" value={logoText} onChange={(e) => setLogoText(e.target.value.slice(0, 3).toUpperCase())} placeholder="Logo initials" />
                    <input className="input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone • website • email" />
                  </div>
                  <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline" />
                  <textarea className="textarea" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline / supporting text" />
                  <input className="input" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Call to action" />
                  <div className="color-row">
                    <div>
                      <div className="subtle" style={{ fontSize: 13, marginBottom: 6 }}>Accent color</div>
                      <input className="input" type="color" value={accent || currentTemplate?.accent || "#2563eb"} onChange={(e) => setAccent(e.target.value)} />
                    </div>
                    <div>
                      <div className="subtle" style={{ fontSize: 13, marginBottom: 6 }}>Background color</div>
                      <input className="input" type="color" value={bg || currentTemplate?.bg || "#ffffff"} onChange={(e) => setBg(e.target.value)} />
                    </div>
                  </div>
                  <div className="toolbar">
                    <button className="btn btn-secondary" onClick={saveDraft}>Save Draft</button>
                    <button className="btn btn-secondary" onClick={loadDraft}>Load Draft</button>
                    <a className="btn btn-primary" href="/dashboard">Continue</a>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="card panel">
              <div className="page-head" style={{ margin: "0 0 16px" }}>
                <div>
                  <div className="badge">Upload</div>
                  <h2 className="section-title" style={{ marginTop: 10 }}>Upload print-ready artwork</h2>
                  <div className="subtle">A cleaner upload path for customers who already have finished designs.</div>
                </div>
              </div>
              <div className="upload-box">
                <p style={{ marginTop: 0, fontSize: 18, fontWeight: 700 }}>Accepted formats: PDF, PNG, JPG, SVG</p>
                <input className="input" type="file" accept=".pdf,.png,.jpg,.jpeg,.svg" onChange={(e) => setUploadName(e.target.files?.[0]?.name || "")} />
                <p className="subtle" style={{ marginBottom: 0, marginTop: 14 }}>
                  {uploadName ? `Selected file: ${uploadName}` : "Choose a print-ready file to continue."}
                </p>
              </div>
              <div className="toolbar" style={{ marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={saveDraft}>Save Draft</button>
                <a className="btn btn-primary" href="/dashboard">Continue</a>
              </div>
            </section>
          )}
        </div>

        <aside className="preview-shell">
          <div className="preview-top">
            <div>
              <div className="badge">Premium preview</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>Live product mockup</h2>
              <div className="subtle">This side stays focused on the result instead of overwhelming the customer with controls.</div>
            </div>
          </div>
          <div className="preview-stage">
            {method === "template" && currentTemplate ? (
              <PremiumTemplateMockup
                template={currentTemplate}
                brandName={brandName}
                headline={headline}
                subheadline={subheadline}
                cta={cta}
                contact={contact}
                logoText={logoText}
                accent={accent}
                bg={bg}
              />
            ) : (
              <div style={{ width: "100%", maxWidth: 620, padding: 30, borderRadius: 28, background: "#fff", border: "2px dashed #cbd5e1", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Upload Preview</div>
                <div className="subtle">{uploadName || "No artwork selected yet"}</div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
