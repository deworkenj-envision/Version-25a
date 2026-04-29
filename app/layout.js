import "./globals.css";

export const metadata = {
  title: "EnVision Direct | Online Printing Services – Fast Turnaround & Best Prices",
  description:
    "Order high-quality printing online with EnVision Direct. Business cards, postcards, flyers, and banners with fast turnaround, competitive pricing, and easy online ordering.",
  
  keywords: [
    "online printing",
    "business cards printing",
    "postcards printing",
    "flyer printing",
    "banner printing",
    "cheap printing online",
    "fast printing services",
    "print shop online",
  ],

  openGraph: {
    title: "EnVision Direct – Professional Printing Made Simple",
    description:
      "Upload your artwork, get instant pricing, and order high-quality prints with fast turnaround.",
    url: "https://envisiondirect.net",
    siteName: "EnVision Direct",
    images: [
      {
        url: "https://envisiondirect.net/images/hero-collage-logo.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {children}

        {/* SEO STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EnVision Direct",
              url: "https://envisiondirect.net",
              email: "orders@envisiondirect.net",
              description:
                "Online printing services offering business cards, flyers, postcards, and banners with fast turnaround and competitive pricing.",
            }),
          }}
        />

        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
            <div className="grid gap-8 md:grid-cols-3">

              {/* BRAND */}
              <div>
                <div className="text-lg font-bold text-slate-900">
                  EnVision Direct
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  With more than 20 years of industry experience, EnVision Direct is built on a commitment to quality, reliability, and efficiency. We combine expert print production with a streamlined online ordering experience to deliver professional results—quickly and affordably.
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

                {/* 🔥 PRODUCT LINKS (SEO BOOST) */}
                <div className="mt-4 font-semibold text-slate-800">
                  Products
                </div>
                <a href="/business-cards" className="text-slate-600 hover:text-blue-600">
                  Business Cards
                </a>
                <a href="/postcards" className="text-slate-600 hover:text-blue-600">
                  Postcards
                </a>
                <a href="/flyers" className="text-slate-600 hover:text-blue-600">
                  Flyers
                </a>
                <a href="/banners" className="text-slate-600 hover:text-blue-600">
                  Banners
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