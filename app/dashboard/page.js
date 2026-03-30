export default function DashboardPage() {
  return (
    <div className="grid" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <div className="badge">Dashboard</div>
          <h1 style={{ margin: "10px 0 6px" }}>What changed in V29</h1>
          <div className="subtle">The site is now focused on simple product selection and print-ready uploads only.</div>
        </div>
      </div>
      <div className="grid grid-3">
        <div className="card card-pad"><div className="subtle">Design interface</div><strong style={{ fontSize: 30 }}>Removed</strong></div>
        <div className="card card-pad"><div className="subtle">Customer path</div><strong style={{ fontSize: 30 }}>Simplified</strong></div>
        <div className="card card-pad"><div className="subtle">Primary action</div><strong style={{ fontSize: 30 }}>Upload Artwork</strong></div>
      </div>
    </div>
  );
}
