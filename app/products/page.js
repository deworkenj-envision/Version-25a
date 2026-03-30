import { products } from "../lib/products";
export default function ProductsPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Products</div>
          <h1 style={{ margin: "10px 0 6px" }}>Simple product selection</h1>
          <div className="subtle">Choose the product and upload finished artwork. No design interface.</div>
        </div>
      </div>
      <div className="grid grid-2">
        {products.map((item) => (
          <div className="card card-pad" key={item.slug}>
            <div className="badge">{item.badge}</div>
            <h3 style={{ margin: "10px 0 4px" }}>{item.name}</h3>
            <div className="subtle">{item.size}</div>
            <p className="subtle">{item.description}</p>
            <div style={{ fontWeight: 800, marginBottom: 14 }}>Starting at {item.starting}</div>
            <a className="btn btn-primary" href="/upload">Upload Artwork</a>
          </div>
        ))}
      </div>
    </div>
  );
}
