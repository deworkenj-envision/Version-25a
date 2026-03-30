import "./globals.css";
export const metadata = { title: "PrintLuxe V35", description: "Brand-first real print storefront with upload-only ordering." };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">Print<span>Luxe</span> V35</div>
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/products">Products</a>
              <a href="/upload">Upload Artwork</a>
              <a href="/dashboard">Dashboard</a>
              <a className="btn btn-primary" href="/upload">Upload Artwork</a>
            </nav>
          </div>
        </header>
        <main className="shell">{children}</main>
        <footer className="shell">Brand-first print storefront • upload-only ordering • built for finished artwork.</footer>
      </body>
    </html>
  );
}
