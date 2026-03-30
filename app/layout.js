import "./globals.css";
export const metadata = { title: "PrintLuxe V30", description: "Premium storefront polish for upload-only print ordering." };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">Print<span>Luxe</span> V30</div>
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
        <footer className="shell">Premium storefront styling • simple upload-only ordering • built for finished artwork.</footer>
      </body>
    </html>
  );
}
