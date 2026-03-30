import { products } from "../lib/products";
import ProductVisual from "../components/ProductVisual";

export default function ProductsPage() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="page-head">
        <div>
          <div className="badge">Products</div>
          <h1 style={{ margin: "10px 0 6px" }}>Print products with stronger visual feel</h1>
          <div className="subtle">Choose the product, review finishes, and move straight into the upload-first order flow.</div>
        </div>
      </div>
      <div className="grid grid-2">
        {products.map((item) => (
          <div className="card card-pad" key={item.slug}>
            <ProductVisual type={item.visual} />
            <div className="product-top" style={{marginTop:16}}>
              <div className="badge">{item.badge}</div>
              <div className="subtle">{item.size}</div>
            </div>
            <h3 style={{ margin: "12px 0 6px" }}>{item.name}</h3>
            <div className="subtle">{item.lead}</div>
            <p className="subtle">{item.description}</p>
            <div className="finish-row">
              {item.finishes.map((finish) => <div key={finish} className="finish">{finish}</div>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 12 }}>
              <div>
                <div className="subtle">{item.turnaround}</div>
                <div className="price">From {item.starting}</div>
              </div>
              <a className="btn btn-primary" href="/upload">Upload Artwork</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
