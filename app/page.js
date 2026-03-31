export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold">
            PrintLuxe V35
          </div>

          <nav className="flex items-center gap-6">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Upload Artwork</a>
            <a href="#">Dashboard</a>

            <button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-white">
              Upload Artwork
            </button>
          </nav>
        </div>
      </header>


      {/* HERO (FIXED BLUE HEADER ONLY) */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 p-10 text-white">

            {/* TITLE */}
            <h1 className="text-4xl font-bold mb-4 text-center">
              Top Quality Printing with the Best Prices
            </h1>

            {/* SUBTEXT */}
            <p className="text-xl text-center mb-6">
              Fast Turnaround
            </p>

            {/* PRODUCT LIST (FIXED ORDER + SPACING) */}
            <div className="flex justify-center gap-6 mb-8 text-lg font-semibold">
              <span>Postcards</span>
              <span>Flyers</span>
              <span>Business Cards</span>
              <span>Banners</span>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button className="bg-white text-blue-700 px-6 py-3 rounded">
                Start Order
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* PRODUCTS (UNCHANGED STYLE LIKE YOUR SCREENSHOT) */}
      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-2xl font-bold mb-6">
            Shop Products
          </h2>

          <div className="space-y-8">

            <div>
              <h3 className="text-xl font-semibold">Postcards</h3>
              <p className="mb-2">High-quality postcard printing</p>
              <button className="border px-3 py-1">Start Order</button>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Flyers</h3>
              <p className="mb-2">Perfect for promotions & events</p>
              <button className="border px-3 py-1">Start Order</button>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Business Cards</h3>
              <p className="mb-2">Premium finishes available</p>
              <button className="border px-3 py-1">Start Order</button>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Banners</h3>
              <p className="mb-2">Durable indoor & outdoor banners</p>
              <button className="border px-3 py-1">Start Order</button>
            </div>

          </div>

          <div className="mt-10 text-sm text-gray-500">
            Brand-first print storefront • upload-only ordering • built for finished artwork.
          </div>

        </div>
      </section>

    </main>
  );
}