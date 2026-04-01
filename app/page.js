export default function HomePage() {
  const products = [
    "Business Cards",
    "Postcards",
    "Flyers",
    "Banners",
    "Brochures",
    "Yard Signs",
  ];

  const steps = [
    "Pick the product you want.",
    "Choose the paper type, quantity and finishes.",
    "Upload your print-ready artwork.",
    "Place your order.",
  ];

  const features = [
    {
      title: "Premium Print Quality",
      text: "Sharp color, clean finishes, and professional results for every order.",
    },
    {
      title: "Easy Ordering",
      text: "Simple product selection, fast uploads, and a smooth checkout experience.",
    },
    {
      title: "Fast Turnaround",
      text: "Order quickly and keep your business moving with dependable production.",
    },
  ];

  return (
    <main className="bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="bg-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1.4fr] lg:gap-12">

            {/* LEFT SIDE */}
            <div>
              <div className="inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                Premium Printing • Fast Turnaround • Professional Quality
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Top Quality Printing at the Best Prices
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
                Business cards, postcards, flyers, banners and more — printed beautifully
                and delivered with the professional finish your brand deserves.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/products"
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow"
                >
                  Start Your Order
                </a>

                <a
                  href="/contact"
                  className="rounded-xl border border-white px-6 py-3 text-base font-semibold text-white"
                >
                  Request a Quote
                </a>
              </div>

              {/* INFO BOXES */}
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-blue-600 p-5 shadow-lg">
                  <h2 className="text-lg font-semibold text-white">Popular Products</h2>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white">
                    {products.map((product) => (
                      <div key={product} className="rounded-lg bg-blue-500 px-3 py-2">
                        {product}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-600 p-5 shadow-lg">
                  <h2 className="text-lg font-semibold text-white">We make it easy:</h2>
                  <ul className="mt-4 space-y-3 text-sm text-white">
                    {steps.map((step) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div>
              <div className="overflow-hidden rounded-[2rem] border border-blue-500 bg-white shadow-2xl h-[320px] md:h-[380px] lg:h-[440px]">

                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet="/hero_mobile.webp"
                    type="image/webp"
                  />
                  <source
                    media="(max-width: 1280px)"
                    srcSet="/hero_tablet.webp"
                    type="image/webp"
                  />
                  <source
                    srcSet="/hero_desktop.webp"
                    type="image/webp"
                  />
                  <img
                    src="/hero_desktop_fallback.jpg"
                    alt="Printed products including postcards, business cards, flyers, and banners"
                    className="block h-full w-full object-cover scale-105"
                  />
                </picture>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Popular Products
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Print essentials for every business
              </h2>
            </div>

            <a
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              View all products →
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Business Cards",
              "Postcards",
              "Flyers",
              "Banners",
              "Brochures",
              "Yard Signs",
              "Stickers",
              "Booklets",
            ].map((product) => (
              <a
                key={product}
                href="/products"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                  {product}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Premium quality printing with clean, professional presentation.
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              A smoother, better print ordering experience
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}