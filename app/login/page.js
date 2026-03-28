export default function LoginPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="panel">
          <h1 className="section-title">Client Login</h1>
          <p className="section-subtitle">Demo credentials shown below so the preview has useful content immediately.</p>
          <div className="form-grid">
            <label className="field"><span>Email</span><input defaultValue="john@envisiondirect.net" /></label>
            <label className="field"><span>Password</span><input type="password" defaultValue="demo1234" /></label>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/dashboard">Enter dashboard</a>
            <a className="btn btn-secondary" href="/admin">Open admin</a>
          </div>
          <hr className="sep" />
          <p className="muted">Demo customer: john@envisiondirect.net / demo1234</p>
          <p className="muted">Demo admin: admin@envisiondirect.net / admin123</p>
        </div>
      </div>
    </main>
  );
}
