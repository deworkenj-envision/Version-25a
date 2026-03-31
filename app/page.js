export default function HomePage() {
  const products = [
    {
      name: "Postcards",
      desc: "High-quality postcard printing",
    },
    {
      name: "Flyers",
      desc: "Perfect for promotions & events",
    },
    {
      name: "Business Cards",
      desc: "Premium finishes available",
    },
    {
      name: "Banners",
      desc: "Durable indoor & outdoor banners",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-extrabold tracking-tight">
            PrintLuxe V35
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
              Home
            </a>
            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
              Products
            </a>
            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
              Upload Artwork
            </a>
            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
              Dashboard
            </a>
            <a
              href="#"
              className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
            >
              Upload Artwork
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Area */}
      <section className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 px-8 py-12 text-white shadow-2xl shadow-blue-200 md:px-12 md:py-16">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Top Quality Printing with the Best Prices
              </h1>

              <div className="mt-8 space-y-3 text-center md:text-left">
                <p className="text-xl font-semibold md:text-2xl">
                  Top Quality Printing with the Best Prices
                </p>
                <p className="text-xl font-semibold md:text-2xl">
                  Fast Turnaround
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="rounded-full bg-white/18 px-5 py-2.5 text-sm font-bold ring-1 ring-white/25 md:text-base">
                  Postcards
                </span>
                <span className="rounded-full bg-white/18 px-5 py-2.5 text-sm font-bold ring-1 ring-white/25 md:text-base">
                  Flyers
                </span>
                <span className="rounded-full bg-white/18 px-5 py-2.5 text-sm font-bold ring-1 ring-white/25 md:text-base">
                  Business Cards
                </span>
                <span className="rounded-full bg-white/18 px-5 py-2.5 text-sm font-bold ring-1 ring-white/25 md:text-base">
                  Banners
                </span>
              </div>

              <div className="mt-10">
                <a
                  href="#products"
                  className="inline-flex items-center rounded-2xl bg-white px-7 py-4 text-lg font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5"
                >
                  Start Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-6 pb-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Shop Products
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 h-40 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />

                <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
                <p className="mt-3 text-slate-600">{product.desc}</p>

                <div className="mt-6">
                  <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
                    Start Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center text-lg text-slate-500">
            Brand-first print storefront • upload-only ordering • built for finished artwork.
          </div>
        </div>
      </section>
    </main>
  );
}