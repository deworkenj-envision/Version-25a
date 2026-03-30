import { products, acceptedFiles } from "./lib/products";
import ProductVisual from "./components/ProductVisual";

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 30 }}>
      <section className="hero-wrap">
        <div className="hero-stage">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="badge" style={{background:"rgba(255,255,255,.12)", color:"#fff", border:"1px solid rgba(255,255,255,.14)"}}>Brand-first print storefront</div>
              <h1>Upload your artwork and get premium print delivered fast.</h1>
              <p>
                Built for customers who already have finished files. Choose the product, upload the artwork, and move to checkout with a cleaner print-first ordering flow.
              </p>
              <div className="toolbar">
                <a className="btn btn-primary" href="/upload">Upload Artwork</a>
                <a className="btn btn-secondary" href="/products" style={{background:"rgba(255,255,255,.08)", color:"#fff", border:"1px solid rgba(255,255,255,.18)"}}>Browse Products</a>
              </div>
              <div className="finish-row">
                <div className="finish" style={{background:"rgba(255,255,255,.1)", color:"#fff", border:"1px solid rgba(255,255,255,.14)"}}>Fast turnaround</div>
                <div className="finish" style={{background:"rgba(255,255,255,.1)", color:"#fff", border:"1px solid rgba(255,255,255,.14)"}}>Upload ready files</div>
                <div className="finish" style={{background:"rgba(255,255,255,.1)", color:"#fff", border:"1px solid rgba(255,255,255,.14)"}}>Premium print quality</div>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-product-visual">
                <div className="hero-card-stack">
                  <div className="hero-stack-a" />
                  <div className="hero-stack-b" />
                </div>
                <div className="hero-flyer" />
                <div className="hero-banner" />
              </div>
              <div className="hero-mini-grid">
                <div className="hero-card">
                  <div className="badge">Business Cards</div>
                  <h3 style={{margin:"12px 0 8px"}}>Matte, gloss, and soft-touch finishes</h3>
                  <div className="subtle">Professional cards printed from your finished files.</div>
                </div>
                <div className="hero-card">
                  <div className="badge">Banners</div>
                  <h3 style={{margin:"12px 0 8px"}}>Large-format prints for events and storefronts</h3>
                  <div className="subtle">Upload finished files and move quickly to production-ready checkout.</div>
                </div>
                <div className="hero-stat">
                  <div style={{color:"rgba(255,255,255,.72)", fontSize:13}}>Accepted Files</div>
                  <strong style={{fontSize:30}}>{acceptedFiles.join(", ")}</strong>
                </div>
                <div className="hero-stat">
                  <div style={{color:"rgba(255,255,255,.72)", fontSize:13}}>Best For</div>
                  <strong style={{fontSize:30}}>Ready Artwork</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head">
          <div>
            <div className="badge">Featured Products</div>
            <h2 className="section-title">Print products that feel tangible</h2>
            <div className="subtle">Product-first cards with stronger visual depth, finishes, and clearer buying cues.</div>
          </div>
        </div>
        <div className="grid grid-4">
          {products.map((item) => (
            <div className="card product-card" key={item.slug}>
              <ProductVisual type={item.visual} />
              <div className="product-top">
                <div className="badge">{item.badge}</div>
                <div className="subtle">{item.size}</div>
              </div>
              <h3 style={{margin:0}}>{item.name}</h3>
              <div className="subtle">{item.lead}</div>
              <div className="finish-row">
                {item.finishes.map((finish) => <div key={finish} className="finish">{finish}</div>)}
              </div>
              <div className="price">From {item.starting}</div>
              <a className="btn btn-primary" href="/upload">Upload Artwork</a>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="page-head">
          <div>
            <div className="badge">How It Works</div>
            <h2 className="section-title">A cleaner path from file to finished print</h2>
            <div className="subtle">Less builder logic. More confidence, clarity, and product focus.</div>
          </div>
        </div>
        <div className="how-grid">
          <div className="how-card"><div className="how-number">1</div><h3>Choose your product</h3><div className="subtle">Pick cards, flyers, banners, or postcards with clear size and finish cues.</div></div>
          <div className="how-card"><div className="how-number">2</div><h3>Upload finished artwork</h3><div className="subtle">Send the print-ready PDF, PNG, JPG, or SVG file directly with the job.</div></div>
          <div className="how-card"><div className="how-number">3</div><h3>Review and order</h3><div className="subtle">Confirm the details and move into checkout with a simpler storefront experience.</div></div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-head">
          <div>
            <div className="badge">Why customers choose this flow</div>
            <h2 className="section-title">Premium feel without design-tool confusion</h2>
            <div className="subtle">The experience is cleaner because the site focuses on the purchase, not on building artwork from scratch.</div>
          </div>
        </div>
        <div className="trust-grid">
          <div className="trust-card"><h3 style={{marginTop:0}}>Fast turnaround</h3><div className="subtle">A more direct upload-first process gets real customers moving faster.</div></div>
          <div className="trust-card"><h3 style={{marginTop:0}}>Professional finishes</h3><div className="subtle">Cards, flyers, banners, and postcards all show clearer print cues.</div></div>
          <div className="trust-card"><h3 style={{marginTop:0}}>Cleaner buying path</h3><div className="subtle">Less clutter and fewer decisions means a stronger customer-facing storefront.</div></div>
          <div className="trust-card"><h3 style={{marginTop:0}}>Brand-first feel</h3><div className="subtle">Richer spacing, stronger visuals, and better hierarchy improve trust immediately.</div></div>
        </div>
      </section>
    </div>
  );
}
