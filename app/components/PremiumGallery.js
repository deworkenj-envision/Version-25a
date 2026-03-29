"use client";
import { useMemo, useState } from "react";
import TemplateMockup from "./TemplateMockup";
import { products, industries, templates, methods } from "../lib/galleryData";

export default function PremiumGallery() {
  const [product, setProduct] = useState("business-cards");
  const [industry, setIndustry] = useState("All");
  const [method, setMethod] = useState("template");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates.find((t) => t.product === "business-cards")?.id || ""
  );
  const [brandName, setBrandName] = useState("Envision Direct");
  const [headline, setHeadline] = useState("");
  const [sub, setSub] = useState("");
  const [cta, setCta] = useState("");
  const [contact, setContact] = useState("555-123-4567 • envisiondirect.net");
  const [logoText, setLogoText] = useState("ED");
  const [accent, setAccent] = useState("");
  const [bg, setBg] = useState("");
  const [uploadName, setUploadName] = useState("");

  const visibleTemplates = useMemo(() => {
    return templates.filter((t) => t.product === product && (industry === "All" || t.industry === industry));
  }, [product, industry]);

  const currentTemplate = useMemo(() => {
    return visibleTemplates.find((t) => t.id === selectedTemplateId) || visibleTemplates[0] || templates[0];
  }, [visibleTemplates, selectedTemplateId]);

  function chooseProduct(next) {
    setProduct(next);
    const first = templates.find((t) => t.product === next && (industry === "All" || t.industry === industry)) ||
                  templates.find((t) => t.product === next);
    setSelectedTemplateId(first?.id || "");
  }

  function chooseIndustry(next) {
    setIndustry(next);
    const first = templates.find((t) => t.product === product && (next === "All" || t.industry === next));
    setSelectedTemplateId(first?.id || "");
  }

  function saveDraft() {
    if (typeof window === "undefined") return;
    localStorage.setItem("printluxe-v28-gallery-draft", JSON.stringify({
      product, industry, method, selectedTemplateId, brandName, headline, sub, cta, contact, logoText, accent, bg, uploadName
    }));
    alert("Draft saved locally in this browser.");
  }

  function loadDraft() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("printluxe-v28-gallery-draft");
    if (!raw) return alert("No saved draft found yet.");
    const d = JSON.parse(raw);
    setProduct(d.product || "business-cards");
    setIndustry(d.industry || "All");
    setMethod(d.method || "template");
    setSelectedTemplateId(d.selectedTemplateId || "");
    setBrandName(d.brandName || "Envision Direct");
    setHeadline(d.headline || "");
    setSub(d.sub || "");
    setCta(d.cta || "");
    setContact(d.contact || "555-123-4567 • envisiondirect.net");
    setLogoText(d.logoText || "ED");
    setAccent(d.accent || "");
    setBg(d.bg || "");
    setUploadName(d.uploadName || "");
    alert("Draft loaded.");
  }

  return (
    <div className="layout">
      <aside className="card sidepanel">
        <div className="grid" style={{gap:20}}>
          <div>
            <div className="badge">1 • Product</div>
            <h3 className="section-title" style={{marginTop:10}}>Pick your product</h3>
            <div className="product-list">
              {products.map((item) => (
                <button key={item.slug} className={`product-card ${product === item.slug ? "selected" : ""}`} onClick={() => chooseProduct(item.slug)}>
                  <div className="badge">{item.badge}</div>
                  <div style={{fontWeight:800, marginTop:10}}>{item.name}</div>
                  <div className="subtle" style={{fontSize:13}}>{item.size}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="badge">2 • Method</div>
            <h3 className="section-title" style={{marginTop:10}}>Choose design path</h3>
            <div className="method-list">
              {methods.map((m) => (
                <button key={m.id} className={`method-card ${method === m.id ? "selected" : ""}`} onClick={() => setMethod(m.id)}>
                  <div style={{fontWeight:800}}>{m.title}</div>
                  <div className="subtle" style={{marginTop:6}}>{m.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="grid" style={{gap:20}}>
        <div className="card card-pad">
          <div className="page-head" style={{margin:"0 0 16px"}}>
            <div>
              <div className="badge">3 • Template Gallery</div>
              <h2 className="section-title" style={{marginTop:10}}>Browse by industry</h2>
              <div className="subtle">Templates are grouped by the kinds of businesses that actually buy these products.</div>
            </div>
          </div>
          <div className="filter-row">
            {industries.map((label) => (
              <button key={label} className={`pill ${industry === label ? "active" : ""}`} onClick={() => chooseIndustry(label)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {method === "template" ? (
          <>
            <div className="template-grid">
              {visibleTemplates.map((template) => (
                <button key={template.id} className={`template-card ${selectedTemplateId === template.id ? "selected" : ""}`} onClick={() => setSelectedTemplateId(template.id)}>
                  <div className="template-thumb">
                    <TemplateMockup template={template} />
                  </div>
                  <div className="template-meta">
                    <div>
                      <strong>{template.title}</strong>
                      <div className="subtle" style={{fontSize:13}}>{template.industry}</div>
                    </div>
                    <div className="badge">{template.product.replace("-", " ")}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="card editor">
              <div className="page-head" style={{margin:"0 0 16px"}}>
                <div>
                  <div className="badge">4 • Personalize</div>
                  <h2 className="section-title" style={{marginTop:10}}>Light customization only</h2>
                  <div className="subtle">Keep the editor simple so customers stay focused on buying.</div>
                </div>
              </div>
              <div className="controls">
                <input className="input" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Business name" />
                <div className="grid grid-2">
                  <input className="input" value={logoText} onChange={(e) => setLogoText(e.target.value.slice(0,3).toUpperCase())} placeholder="Logo initials" />
                  <input className="input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone • website • email" />
                </div>
                <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline" />
                <textarea className="textarea" value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Supporting text" />
                <input className="input" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Call to action" />
                <div className="color-row">
                  <div>
                    <div className="subtle" style={{fontSize:13, marginBottom:6}}>Accent color</div>
                    <input className="input" type="color" value={accent || currentTemplate?.accent || "#2563eb"} onChange={(e) => setAccent(e.target.value)} />
                  </div>
                  <div>
                    <div className="subtle" style={{fontSize:13, marginBottom:6}}>Background color</div>
                    <input className="input" type="color" value={bg || currentTemplate?.bg || "#ffffff"} onChange={(e) => setBg(e.target.value)} />
                  </div>
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary" onClick={saveDraft}>Save Draft</button>
                  <button className="btn btn-secondary" onClick={loadDraft}>Load Draft</button>
                  <a className="btn btn-primary" href="/dashboard">Continue</a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card editor">
            <div className="page-head" style={{margin:"0 0 16px"}}>
              <div>
                <div className="badge">Upload Path</div>
                <h2 className="section-title" style={{marginTop:10}}>Upload your own artwork</h2>
                <div className="subtle">A simpler path for customers who already have a finished design.</div>
              </div>
            </div>
            <div className="upload-box">
              <p style={{marginTop:0,fontSize:18,fontWeight:700}}>Accepted formats: PDF, PNG, JPG, SVG</p>
              <input className="input" type="file" accept=".pdf,.png,.jpg,.jpeg,.svg" onChange={(e) => setUploadName(e.target.files?.[0]?.name || "")} />
              <p className="subtle" style={{marginBottom:0,marginTop:14}}>
                {uploadName ? `Selected file: ${uploadName}` : "Choose a print-ready file to continue."}
              </p>
            </div>
            <div className="toolbar" style={{marginTop:16}}>
              <button className="btn btn-secondary" onClick={saveDraft}>Save Draft</button>
              <a className="btn btn-primary" href="/dashboard">Continue</a>
            </div>
          </div>
        )}
      </section>

      <aside className="preview-shell">
        <div className="page-head" style={{margin:"0 0 16px"}}>
          <div>
            <div className="badge">Live Preview</div>
            <h2 className="section-title" style={{marginTop:10}}>What the customer is buying</h2>
            <div className="subtle">A stronger product mockup instead of flat placeholder cards.</div>
          </div>
        </div>
        <div className="preview-stage">
          {method === "template" && currentTemplate ? (
            <TemplateMockup
              template={currentTemplate}
              brandName={brandName}
              headline={headline}
              sub={sub}
              cta={cta}
              contact={contact}
              logoText={logoText}
              accent={accent}
              bg={bg}
            />
          ) : (
            <div style={{width:"100%",maxWidth:620,padding:30,borderRadius:28,background:"#fff",border:"2px dashed #cbd5e1",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,marginBottom:8}}>Upload Preview</div>
              <div className="subtle">{uploadName || "No artwork selected yet"}</div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
