export default function DashboardPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Dashboard</div>
          <h1 style={{ margin: "10px 0 6px" }}>What changed in V30</h1>
          <div className="subtle">The flow stays simple like V29, but the storefront now looks much more premium.</div>
        </div>
      </div>
      <div className="grid grid-3">
        <div className="card card-pad"><div className="subtle">Design tool</div><strong style={{ fontSize: 30 }}>Still removed</strong></div>
        <div className="card card-pad"><div className="subtle">Storefront look</div><strong style={{ fontSize: 30 }}>Improved</strong></div>
        <div className="card card-pad"><div className="subtle">Primary action</div><strong style={{ fontSize: 30 }}>Upload Artwork</strong></div>
      </div>
    </div>
  );
}
