import "./globals.css";

export const metadata = {
  title: "PrintLuxe V35",
  description: "Premium printing storefront",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
