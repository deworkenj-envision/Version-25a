export default function DashboardPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Dashboard</div>
          <h1 style={{ margin: "10px 0 6px" }}>What changed in V31</h1>
          <div className="subtle">This version makes the site feel less like a generic app and more like a real print storefront.</div>
        </div>
      </div>
      <div className="grid grid-3">
        <div className="card card-pad"><div className="subtle">Storefront feel</div><strong style={{ fontSize: 30 }}>Improved</strong></div>
        <div className="card card-pad"><div className="subtle">Product cues</div><strong style={{ fontSize: 30 }}>Richer</strong></div>
        <div className="card card-pad"><div className="subtle">Primary flow</div><strong style={{ fontSize: 30 }}>Upload First</strong></div>
      </div>
    </div>
  );
}
