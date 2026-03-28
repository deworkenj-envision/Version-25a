import './globals.css';

export const metadata = {
  title: 'PrintLuxe V25',
  description: 'Premium print storefront with populated screens and stable deploy setup.'
};

const links = [
  ['Products', '/products'],
  ['Pricing', '/pricing'],
  ['Designer', '/designer'],
  ['Checkout', '/checkout'],
  ['Dashboard', '/dashboard'],
  ['Admin', '/admin']
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand">
              <span className="brand-badge" />
              <span>PrintLuxe V25</span>
            </a>
            <nav className="nav-links">
              {links.map(([label, href]) => (
                <a key={href} href={href}>{label}</a>
              ))}
            </nav>
            <a className="btn btn-primary" href="/login">Client Login</a>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container">Stable full preview build. Local demo mode works without Stripe or Supabase keys.</div>
        </footer>
      </body>
    </html>
  );
}
