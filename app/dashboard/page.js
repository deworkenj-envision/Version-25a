export default function DashboardPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Dashboard</div>
          <h1 style={{ margin: "10px 0 6px" }}>What changed in V35</h1>
          <div className="subtle">This version adds richer product visuals, premium spacing, and a stronger brand feel while keeping the upload-first storefront.</div>
        </div>
      </div>
      <div className="grid grid-3">
        <div className="card card-pad"><div className="subtle">Product visuals</div><strong style={{ fontSize: 30 }}>Richer</strong></div>
        <div className="card card-pad"><div className="subtle">Brand feel</div><strong style={{ fontSize: 30 }}>Stronger</strong></div>
        <div className="card card-pad"><div className="subtle">Primary flow</div><strong style={{ fontSize: 30 }}>Upload First</strong></div>
      </div>
    </div>
  );
}
