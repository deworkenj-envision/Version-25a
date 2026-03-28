'use client';

import { useMemo, useState } from 'react';

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function conceptSvg({ palette, headline, subline, cta, shape }) {
  const [a, b, c] = palette;
  const safeHeadline = escapeXml(headline);
  const safeSubline = escapeXml(subline);
  const safeCta = escapeXml(cta);

  const art = {
    wave: `<path d="M0,160 C130,60 260,260 420,155 C560,65 720,180 900,110 L900,300 L0,300 Z" fill="${b}" opacity="0.9"/>`,
    burst: `<circle cx="710" cy="75" r="110" fill="${b}" opacity="0.92"/><circle cx="760" cy="118" r="52" fill="${c}" opacity="0.8"/>`,
    ribbon: `<path d="M-10,45 L540,45 L490,150 L-10,150 Z" fill="${b}" opacity="0.96"/><path d="M540,45 L900,45 L900,150 L490,150 Z" fill="${c}" opacity="0.9"/>`
  }[shape];

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300">
    <rect width="900" height="300" rx="24" fill="${a}" />
    ${art}
    <rect x="36" y="36" width="828" height="228" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)"/>
    <text x="58" y="98" font-family="Arial" font-size="18" fill="#ffffff" opacity="0.75">ENVISION DIRECT</text>
    <text x="58" y="156" font-family="Arial" font-size="42" font-weight="700" fill="#ffffff">${safeHeadline}</text>
    <text x="58" y="196" font-family="Arial" font-size="22" fill="#eaf2ff">${safeSubline}</text>
    <rect x="58" y="220" width="176" height="40" rx="12" fill="#ffffff" opacity="0.95"/>
    <text x="88" y="246" font-family="Arial" font-size="18" font-weight="700" fill="${a}">${safeCta}</text>
  </svg>`;
}

export default function DesignerStudio() {
  const [headline, setHeadline] = useState('Modern print that closes deals');
  const [subline, setSubline] = useState('Business cards, flyers, banners, and more.');
  const [cta, setCta] = useState('Get Started');
  const [product, setProduct] = useState('Business Cards');
  const concepts = useMemo(() => {
    return [
      { name: 'Ocean Wave', svg: conceptSvg({ palette: ['#0d3b66', '#1b9aaa', '#f4d35e'], headline, subline, cta, shape: 'wave' }) },
      { name: 'Launch Burst', svg: conceptSvg({ palette: ['#402060', '#7c3aed', '#22d3ee'], headline, subline, cta, shape: 'burst' }) },
      { name: 'Luxury Ribbon', svg: conceptSvg({ palette: ['#141414', '#a855f7', '#f59e0b'], headline, subline, cta, shape: 'ribbon' }) }
    ];
  }, [headline, subline, cta]);

  function saveDemo() {
    const item = { id: Date.now(), product, headline, subline, cta, savedAt: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem('printluxe-designs') || '[]');
    localStorage.setItem('printluxe-designs', JSON.stringify([item, ...current].slice(0, 20)));
    alert('Design saved locally for demo preview.');
  }

  function downloadSvg(markup, name) {
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-2">
      <div className="panel">
        <div className="form-grid">
          <label className="field">
            <span>Product</span>
            <select value={product} onChange={(e) => setProduct(e.target.value)}>
              {['Business Cards', 'Flyers', 'Postcards', 'Banners'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="field">
            <span>Brand</span>
            <input value="Envision Direct" readOnly />
          </div>
          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Headline</span>
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </label>
          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Subline</span>
            <input value={subline} onChange={(e) => setSubline(e.target.value)} />
          </label>
          <label className="field">
            <span>CTA</span>
            <input value={cta} onChange={(e) => setCta(e.target.value)} />
          </label>
          <div className="field">
            <span>Output</span>
            <input value={`${product} concept set`} readOnly />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={saveDemo}>Save design</button>
          <a className="btn btn-secondary" href="/checkout">Continue to checkout</a>
        </div>
      </div>

      <div className="grid">
        {concepts.map((concept) => (
          <div className="preview" key={concept.name}>
            <div className="preview-toolbar">
              <span>{concept.name}</span>
              <button className="btn btn-secondary" onClick={() => downloadSvg(concept.svg, concept.name)}>Download SVG</button>
            </div>
            <div className="preview-stage">
              <div dangerouslySetInnerHTML={{ __html: concept.svg }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
