export default function HomePage() {
  const products = [
    {
      badge: "Best Seller",
      name: "Business Cards",
      size: "3.5 x 2 in",
      desc: "Perfect for networking, storefronts, and service businesses.",
      bg: "from-slate-100 to-slate-200",
      shape: "cards",
    },
    {
      badge: "Promo Ready",
      name: "Flyers",
      size: "8.5 x 11 in",
      desc: "Great for events, menus, promotions, and handouts.",
      bg: "from-slate-100 to-blue-100",
      shape: "flyer",
    },
    {
      badge: "Large Format",
      name: "Banners",
      size: "6 x 3 ft",
      desc: "Ideal for storefronts, events, and temporary signage.",
      bg: "from-blue-100 to-blue-200",
      shape: "banner",
    },
    {
      badge: "Direct Mail",
      name: "Postcards",
      size: "6 x 4 in",
      desc: "Built for local marketing, promotions, and announcements.",
      bg: "from-slate-100 to-amber-100",
      shape: "postcard",
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
            <a href="#products" className="font-semibold text-slate-700 hover:text-slate-900">
              Products
            </a>
            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
              Upload Artwork
            </a>
            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900">
              Dashboard
            </a>
            <a
              href="#products"
              className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
            >
              Upload Artwork
            </a>
          </nav>
        </div>
      </header>

      {/* Premium Hero */}
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 shadow-2xl">
            <div className="grid gap-8 px-8 py-10 md:grid-cols-[1.2fr_1fr] md:px-9 md:py-12 lg:px-10">
              {/* Left side */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95">
                  Premium Print • Upload Ready Files
                </div>

                <div className="mt-8 text-center md:text-left">
                  <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
                    Top Quality Printing with the Best Prices
                  </h1>

                  <div className="mt-8 space-y-3">
                    <p className="text-2xl font-semibold text-white md:text-3xl">
                      Fast Turnaround
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Postcards
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Flyers
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Business Cards
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Banners
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                    <a
                      href="#products"
                      className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-7 py-3 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                    >
                      Upload Artwork
                    </a>
                    <a
                      href="#products"
                      className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-lg font-semibold text-white transition hover:bg-white/15"
                    >
                      Browse Products
                    </a>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Top Quality Printing
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Best Prices
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Fast Turnaround
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - only one bottom info card remains */}
              <div className="flex flex-col justify-center gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                  <div className="rounded-[30px] bg-white p-6 shadow-xl">
                    <div className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
                      Postcards • Flyers • Business Cards • Banners
                    </div>
                    <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
                      Print-ready orders made simple
                    </h3>
                    <p className="mt-2 text-lg text-slate-600">
                      Upload finished artwork and place your order quickly.
                    </p>
                    <div className="mt-5 text-4xl font-extrabold text-slate-950">
                      Best Prices
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur">
                    <div className="text-lg text-white/85">Fast Turnaround</div>
                    <div className="text-5xl font-extrabold leading-none text-white">
                      2–4 Days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products section */}
          <section
            id="products"
            className="mt-8 rounded-[34px] border border-slate-200 bg-white px-7 py-8 shadow-sm md:px-8 md:py-10"
          >
            <div className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
              Featured Products
            </div>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              Popular print products
            </h2>
            <p className="mt-2 text-2xl text-slate-500">
              Choose your product and upload your artwork.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`mb-5 flex h-44 items-center justify-center rounded-[22px] bg-gradient-to-br ${product.bg} shadow-inner`}
                  >
                    {product.shape === "cards" && (
                      <div className="relative h-24 w-40">
                        <div className="absolute left-6 top-4 h-16 w-16 rotate-[-8deg] rounded-xl bg-white shadow-lg" />
                        <div className="absolute right-4 top-6 h-16 w-20 rotate-[8deg] rounded-xl bg-white shadow-lg" />
                      </div>
                    )}
                    {product.shape === "flyer" && (
                      <div className="h-28 w-24 rotate-[-5deg] rounded-xl bg-white shadow-lg" />
                    )}
                    {product.shape === "banner" && (
                      <div className="h-14 w-40 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-700 shadow-lg" />
                    )}
                    {product.shape === "postcard" && (
                      <div className="h-18 w-28 rotate-[-6deg] rounded-2xl bg-white shadow-lg" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
                      {product.badge}
                    </div>
                    <div className="text-xl text-slate-500">{product.size}</div>
                  </div>

                  <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-[1.35rem] leading-7 text-slate-500">
                    {product.desc}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5">
                      Start Order
                    </button>
                    <button className="rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}