import "./globals.css";

export const metadata = {
  title: "PrintLuxe",
  description: "Print ordering platform",
};

function PublicNav() {
  return (
    <>
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/upload">Upload Artwork</a>
      <a href="/dashboard">Login</a>
      <a className="btn btn-primary" href="/upload">Upload Artwork</a>
    </>
  );
}

function AppNav() {
  return (
    <>
      <a href="/dashboard">Dashboard</a>
      <a href="/orders">Orders</a>
      <a href="/uploads">Uploads</a>
      <a href="/account">Account</a>
      <a className="btn btn-primary" href="/upload">New Order</a>
    </>
  );
}

export default function RootLayout({ children }) {
  const isApp =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">Print<span>Luxe</span></div>

            <nav className="nav">
              {isApp ? <AppNav /> : <PublicNav />}
            </nav>
          </div>
        </header>

        <main className="shell">{children}</main>

        <footer className="shell">
          {isApp
            ? "Manage your orders, files, and account."
            : "Upload print-ready artwork and order fast."}
        </footer>
      </body>
    </html>
  );
}