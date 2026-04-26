import "./globals.css";

export const metadata = {
  title: "PrintLuxe V35",
  description: "Premium printing storefront",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
            <div className="grid gap-8 md:grid-cols-3">

              {/* BRAND */}
              <div>
                <div className="text-lg font-bold text-slate-900">
                  EnVision Direct
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Professional online printing with fast turnaround and competitive pricing.
                </p>
              </div>

              {/* LINKS */}
              <div className="flex flex-col gap-2 text-sm">
                <a href="/contact" className="text-slate-600 hover:text-blue-600">
                  Contact
                </a>
                <a href="/terms" className="text-slate-600 hover:text-blue-600">
                  Terms of Service
                </a>
                <a href="/privacy" className="text-slate-600 hover:text-blue-600">
                  Privacy Policy
                </a>
                <a href="/refund" className="text-slate-600 hover:text-blue-600">
                  Refund Policy
                </a>
              </div>

              {/* CONTACT */}
              <div className="text-sm text-slate-600">
                <div>Email: orders@envisiondirect.net</div>
                <div className="mt-2">
                  © {new Date().getFullYear()} EnVision Direct
                </div>
              </div>

            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}