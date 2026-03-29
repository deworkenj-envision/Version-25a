"use client";

import { useMemo, useState } from "react";
import TemplatePreview from "./TemplatePreview";
import { products, templates } from "../lib/templates";

const defaultProduct = products[0].slug;

export default function TemplateBrowser() {
  const [product, setProduct] = useState(defaultProduct);
  const [method, setMethod] = useState("template");
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates.find((t) => t.product === defaultProduct)?.id || "");
  const [brandName, setBrandName] = useState("Envision Direct");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [contact, setContact] = useState("555-123-4567 • info@envisiondirect.net");
  const [accent, setAccent] = useState("");
  const [bg, setBg] = useState("");
  const [logoText, setLogoText] = useState("ED");
  const [uploadName, setUploadName] = useState("");

  const filtered = useMemo(() => templates.filter((t) => t.product === product), [product]);
  const selectedTemplate = useMemo(() => filtered.find((t) => t.id === selectedTemplateId) || filtered[0], [filtered, selectedTemplateId]);

  function onChangeProduct(nextProduct) {
    setProduct(nextProduct);
    setSelectedTemplateId(templates.find((t) => t.product === nextProduct)?.id || "");
  }

  function saveDraft() {
    const payload = { product, method, selectedTemplateId, brandName, headline, subheadline, cta, contact, accent, bg, logoText, uploadName, savedAt: new Date().toISOString() };
    localStorage.setItem("printluxe-v26-draft", JSON.stringify(payload));
    alert("Draft saved locally in this browser.");
  }

  function loadDraft() {
    const raw = localStorage.getItem("printluxe-v26-draft");
    if (!raw) return alert("No saved draft found in this browser yet.");
    const draft = JSON.parse(raw);
    setProduct(draft.product || defaultProduct);
    setMethod(draft.method || "template");
    setSelectedTemplateId(draft.selectedTemplateId || "");
    setBrandName(draft.brandName || "Envision Direct");
    setHeadline(draft.headline || "");
    setSubheadline(draft.subheadline || "");
    setCta(draft.cta || "");
    setContact(draft.contact || "");
    setAccent(draft.accent || "");
    setBg(draft.bg || "");
    setLogoText(draft.logoText || "ED");
    setUploadName(draft.uploadName || "");
    alert("Draft loaded.");
  }

  function downloadSvg() {
    if (!selectedTemplate) return;
    const finalAccent = accent || selectedTemplate.accent;
    const finalBg = bg || selectedTemplate.bg;
    const esc = (v) => (v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
  <rect width="1200" height="700" rx="28" fill="${finalBg}" />
  <rect x="52" y="52" width="80" height="80" rx="18" fill="${finalAccent}" />
  <text x="92" y="103" text-anchor="middle" font-size="28" font-family="Arial" font-weight="700" fill="white">${esc(logoText || "ED")}</text>
  <text x="150" y="88" font-size="30" font-family="Arial" font-weight="800" fill="#0f172a">${esc(brandName)}</text>
  <text x="150" y="118" font-size="16" font-family="Arial" fill="#475569">${esc(selectedTemplate.category)} template</text>
  <rect x="930" y="58" width="210" height="52" rx="26" fill="${finalAccent}" />
  <text x="1035" y="91" text-anchor="middle" font-size="20" font-family="Arial" font-weight="700" fill="white">${esc(cta || selectedTemplate.cta)}</text>
  <text x="60" y="260" font-size="68" font-family="Arial" font-weight="800" fill="#0f172a">${esc(headline || selectedTemplate.headline)}</text>
  <text x="60" y="334" font-size="28" font-family="Arial" fill="#475569">${esc(subheadline || selectedTemplate.subheadline)}</text>
  <line x1="60" y1="610" x2="1140" y2="610" stroke="#cbd5e1" />
  <text x="60" y="652" font-size="20" font-family="Arial" fill="#475569">${esc(contact)}</text>
</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTemplate.id}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="preview-wrap">
      <div className="sidebar stack">
        <div className="card stack">
          <div className="badge">Step 1</div>
          <h3 style={{margin:0}}>Select product</h3>
          <div className="small">Each product has its own built-in starter template set.</div>
          <select className="select" value={product} onChange={(e) => onChangeProduct(e.target.value)}>
            {products.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </div>

        <div className="card stack">
          <div className="badge">Step 2</div>
          <h3 style={{margin:0}}>Choose design method</h3>
          <div className="row">
            <button className={method === "template" ? "cta" : "ghost"} onClick={() => setMethod("template")}>Use a Template</button>
            <button className={method === "upload" ? "cta" : "ghost"} onClick={() => setMethod("upload")}>Upload My Own Design</button>
          </div>
        </div>

        {method === "template" ? (
          <>
            <div className="card stack">
              <div className="badge">Step 3</div>
              <h3 style={{margin:0}}>Pick a starter template</h3>
              <div className="small">{filtered.length} templates available for this product.</div>
              <select className="select" value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
                {filtered.map((template) => <option key={template.id} value={template.id}>{template.title} • {template.category}</option>)}
              </select>
            </div>

            <div className="card stack">
              <div className="badge">Step 4</div>
              <h3 style={{margin:0}}>Customize template</h3>
              <input className="input" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Business name" />
              <input className="input" value={logoText} onChange={(e) => setLogoText(e.target.value.slice(0,3).toUpperCase())} placeholder="Logo initials" />
              <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline override" />
              <textarea className="textarea" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline override" />
              <input className="input" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Call to action override" />
              <input className="input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact line" />
              <div className="row">
                <div style={{flex:1}}>
                  <div className="small" style={{marginBottom:6}}>Accent color</div>
                  <input className="input" type="color" value={accent || selectedTemplate?.accent || "#2563eb"} onChange={(e) => setAccent(e.target.value)} />
                </div>
                <div style={{flex:1}}>
                  <div className="small" style={{marginBottom:6}}>Background color</div>
                  <input className="input" type="color" value={bg || selectedTemplate?.bg || "#ffffff"} onChange={(e) => setBg(e.target.value)} />
                </div>
              </div>
              <div className="row">
                <button className="ghost" onClick={saveDraft}>Save Draft</button>
                <button className="ghost" onClick={loadDraft}>Load Draft</button>
                <button className="cta" onClick={downloadSvg}>Download SVG</button>
              </div>
            </div>
          </>
        ) : (
          <div className="card stack">
            <div className="badge">Upload path</div>
            <h3 style={{margin:0}}>Upload your own design</h3>
            <div className="upload-zone">
              <p style={{marginTop:0}}><strong>Accepted:</strong> PDF, PNG, JPG, SVG</p>
              <input className="input" type="file" accept=".pdf,.png,.jpg,.jpeg,.svg" onChange={(e) => setUploadName(e.target.files?.[0]?.name || "")} />
              <div className="small" style={{marginTop:12}}>{uploadName ? `Selected file: ${uploadName}` : "Choose a print-ready file to continue."}</div>
            </div>
            <div className="row">
              <button className="ghost" onClick={saveDraft}>Save Draft</button>
              <button className="cta" onClick={() => alert(uploadName ? `Upload flow ready for ${uploadName}` : "Select a file first.")}>Continue with Upload</button>
            </div>
          </div>
        )}
      </div>

      <div className="stack">
        <div className="card">
          <div className="page-head">
            <div>
              <div className="badge">Live preview</div>
              <h2 style={{margin:"10px 0 6px"}}>{method === "template" ? "Template Preview" : "Upload Preview"}</h2>
              <div className="subtle">{method === "template" ? "Choose a starter layout and personalize the content." : "Keep the upload flow simple for customers with finished artwork."}</div>
            </div>
            <a className="cta" href="/dashboard">Go to Dashboard</a>
          </div>
          <div className="preview-stage">
            {method === "template" && selectedTemplate ? (
              <TemplatePreview template={selectedTemplate} brandName={brandName} headline={headline} subheadline={subheadline} cta={cta} contact={contact} accent={accent} bg={bg} logoText={logoText} />
            ) : (
              <div className="preview-canvas" style={{aspectRatio:"16 / 10", background:"#fff", display:"grid", placeItems:"center", border:"2px dashed #cbd5e1", color:"#64748b", padding:24, textAlign:"center"}}>
                <div>
                  <div style={{fontSize:22, fontWeight:800, marginBottom:8}}>Upload your print-ready design</div>
                  <div>{uploadName || "No file selected yet"}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {method === "template" && (
          <div className="grid grid-3">
            {filtered.map((template) => (
              <button key={template.id} onClick={() => setSelectedTemplateId(template.id)} style={{textAlign:"left", background:"transparent", border:"none", padding:0, cursor:"pointer"}}>
                <div className="card">
                  <div className="template-thumb"><TemplatePreview template={template} /></div>
                  <div className="template-meta">
                    <div>
                      <strong>{template.title}</strong>
                      <div className="small">{template.category}</div>
                    </div>
                    <div className="badge">{template.previewShape}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
